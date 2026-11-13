import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { canEditSection } from './access'
import { Donations, Subscribers } from './collections/Audience'
import { EventRegistrations, Events } from './collections/Events'
import { Banners, HealthHourSessions, Partners } from './collections/HomepageModules'
import { Albums, Grants, Jobs, Posts, Publications, Videos } from './collections/Library'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { People, Programmes, Services } from './collections/Work'
import { DonationSettings, Homepage, SiteSettings } from './globals'
import { LIVE_PREVIEW_BREAKPOINTS, SITE_URL } from './utilities/preview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useS3 = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress: process.env.EMAIL_FROM || 'info@cahn.org.uk',
      defaultFromName: 'Caribbean & African Health Network',
    })
  : process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || 'info@cahn.org.uk',
        defaultFromName: 'Caribbean & African Health Network',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined // no adapter: Payload logs emails to the console (development)

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · CAHN Studio' },
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: { Logo: '/components/admin/Brand#Logo', Icon: '/components/admin/Brand#Icon' },
      beforeLogin: ['/components/admin/SupabaseLogin#SupabaseLogin'],
      logout: { Button: '/components/admin/SupabaseLogin#SupabaseLogoutButton' },
    },
    livePreview: {
      breakpoints: LIVE_PREVIEW_BREAKPOINTS,
      collections: ['pages', 'events', 'services', 'programmes'],
      globals: ['homepage'],
    },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
      { label: 'Português', code: 'pt' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [
    Pages,
    Banners,
    Partners,
    HealthHourSessions,
    Events,
    EventRegistrations,
    Services,
    Programmes,
    People,
    Publications,
    Posts,
    Videos,
    Albums,
    Jobs,
    Grants,
    Subscribers,
    Donations,
    Media,
    Users,
  ],
  globals: [Homepage, SiteSettings, DonationSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '', max: process.env.VERCEL ? 3 : 10 },
    // All CMS tables live in their own schema, isolated from anything else in the database.
    schemaName: process.env.DATABASE_SCHEMA || 'cms',
    // Supabase: use the pooled (6543) connection string in production.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  email,
  sharp,
  cors: [SITE_URL],
  csrf: [SITE_URL],
  jobs: {
    // Runs scheduled publish / unpublish jobs. On Vercel, a cron hits /api/payload-jobs/run.
    autoRun: process.env.VERCEL ? undefined : [{ cron: '* * * * *', queue: 'default' }],
    access: { run: ({ req }) => Boolean(req.user) || req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}` },
  },
  plugins: [
    seoPlugin({
      collections: ['pages', 'events', 'services', 'programmes', 'publications', 'posts'],
      globals: ['homepage'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }: any) => `${doc?.title || 'CAHN'} · Caribbean & African Health Network`,
      generateDescription: ({ doc }: any) => doc?.summary || doc?.excerpt || '',
    }),
    searchPlugin({
      collections: ['pages', 'services', 'programmes', 'events', 'publications', 'jobs', 'posts', 'health-hour-sessions'],
      defaultPriorities: { services: 10, programmes: 9, 'health-hour-sessions': 8, events: 7, publications: 6, pages: 5, jobs: 4, posts: 3 },
      searchOverrides: {
        admin: { group: 'Settings' },
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'slug', type: 'text', admin: { readOnly: true } },
          { name: 'summary', type: 'textarea', admin: { readOnly: true } },
          { name: 'keywords', type: 'text', admin: { readOnly: true } },
          { name: 'docText', type: 'textarea', admin: { readOnly: true } },
          { name: 'path', type: 'text', admin: { readOnly: true } },
        ],
      },
      beforeSync: async ({ originalDoc, searchDoc, req }) => {
        const coll = searchDoc.doc.relationTo as string
        const d: any = originalDoc
        const base: Record<string, string> = {
          services: '/services/',
          programmes: '/programmes/',
          events: '/events/',
          publications: '/research#',
          jobs: '/opportunities#',
          posts: '/media#',
          'health-hour-sessions': '/health-hour#',
        }
        let docText = ''
        if (coll === 'publications' && d.file) {
          const fileId = typeof d.file === 'object' ? d.file.id : d.file
          const f: any = await req.payload.findByID({ collection: 'media', id: fileId, depth: 0, req }).catch(() => null)
          docText = (f?.documentText || '').slice(0, 20000)
        }
        return {
          ...searchDoc,
          title: d.title || d.topic || searchDoc.title,
          slug: d.slug || '',
          summary: d.summary || d.excerpt || '',
          keywords: (d.searchKeywords || []).join(' '),
          docText,
          path: coll === 'pages' ? d.path || `/${d.slug}` : `${base[coll] || '/'}${d.slug || d.id}`,
        }
      },
    }),
    formBuilderPlugin({
      fields: { payment: false, state: false, country: true, message: true, checkbox: true, select: true, email: true, text: true, textarea: true, number: true },
      formOverrides: { admin: { group: 'Forms' }, access: { create: canEditSection('pages'), update: canEditSection('pages') } },
      formSubmissionOverrides: { admin: { group: 'Forms' } },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !useS3,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true, // large videos/PDFs upload straight to Blob, bypassing the 4.5MB function limit
    }),
    s3Storage({
      enabled: useS3,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true, // required for Supabase Storage
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'eu-west-2',
        endpoint: process.env.S3_ENDPOINT || '',
      },
    }),
  ],
})
