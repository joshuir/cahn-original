import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n'
import { getPayload } from '@/lib/payload'
import { SITE_URL } from '@/utilities/preview'

export const dynamic = 'force-dynamic'

const STATIC = ['', '/services', '/programmes', '/health-hour', '/events', '/research', '/opportunities', '/media', '/contact', '/donate', '/search']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()
  const pub = { _status: { equals: 'published' } }
  const grab = async (collection: any, prefix: string, field = 'slug') => {
    const r = await payload.find({ collection, where: pub, limit: 1000, depth: 0, pagination: false })
    return r.docs.map((d: any) => ({ path: field === 'path' ? d.path : `${prefix}/${d.slug}`, updated: d.updatedAt }))
  }
  const dynamicPaths = (
    await Promise.all([grab('pages', '', 'path'), grab('services', '/services'), grab('programmes', '/programmes'), grab('events', '/events')])
  ).flat()
  const all = [...STATIC.map((p) => ({ path: p, updated: undefined as string | undefined })), ...dynamicPaths]
  return all.map(({ path, updated }) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: updated ? new Date(updated) : new Date(),
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  }))
}
