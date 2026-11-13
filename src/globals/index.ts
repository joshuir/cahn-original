import type { Field, GlobalConfig } from 'payload'
import { adminOnly, anyone, blockEditorPublish, canEditSection } from '../access'
import { previewURL } from '../utilities/preview'

const colour = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue,
  admin: { description: 'Hex colour, e.g. #0B6B3F', width: '25%' },
  validate: (v: unknown) => (typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) || 'Enter a hex colour like #0B6B3F',
})

const navItem: Field[] = [
  { name: 'label', type: 'text', required: true, localized: true },
  { name: 'url', type: 'text', required: true },
  { name: 'blurb', type: 'text', localized: true },
  {
    name: 'children',
    type: 'array',
    fields: [
      { name: 'label', type: 'text', required: true, localized: true },
      { name: 'url', type: 'text', required: true },
    ],
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings & branding',
  admin: { group: 'Settings' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'Caribbean & African Health Network', localized: true },
            { name: 'shortName', type: 'text', defaultValue: 'CAHN' },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Official CAHN logo (SVG preferred). Falls back to the CAHN wordmark.' } },
            { name: 'logoDark', type: 'upload', relationTo: 'media', admin: { description: 'Version for dark backgrounds' } },
            { name: 'mascot', type: 'upload', relationTo: 'media', admin: { description: 'The CAHN panda' } },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Theme',
          description: 'Colours and fonts used across the whole website. Changes apply as soon as you save.',
          fields: [
            {
              type: 'row',
              fields: [
                colour('ink', 'Palm ink (text, dark grounds)', '#0F1F18'),
                colour('paper', 'Paper (page background)', '#F7F2E9'),
                colour('sand', 'Sand (panels)', '#EFE7D8'),
                colour('muted', 'Muted text', '#4A5A52'),
              ],
            },
            {
              type: 'row',
              fields: [
                colour('green', 'CAHN green', '#0B6B3F'),
                colour('red', 'CAHN red', '#C23A2B'),
                colour('gold', 'CAHN gold', '#F0B323'),
                colour('redText', 'Red text on paper', '#A12C1F'),
              ],
            },
            {
              name: 'fontPair',
              type: 'select',
              defaultValue: 'bricolage-inter',
              options: [
                { label: 'Bricolage Grotesque + Inter (default)', value: 'bricolage-inter' },
                { label: 'Fraunces + Inter', value: 'fraunces-inter' },
                { label: 'Space Grotesk + Inter', value: 'space-inter' },
                { label: 'DM Serif Display + DM Sans', value: 'dmserif-dmsans' },
                { label: 'Poppins + Open Sans', value: 'poppins-opensans' },
              ],
            },
            { name: 'radius', type: 'number', defaultValue: 28, admin: { description: 'Card corner radius in px' } },
            {
              name: 'motion',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full animation', value: 'full' },
                { label: 'Subtle', value: 'subtle' },
                { label: 'Off (static site)', value: 'off' },
              ],
              admin: { description: 'Visitors who set “reduce motion” on their device always get static.' },
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            { name: 'mainNav', type: 'array', fields: navItem, admin: { description: 'Top menu. Hover opens the sub-menu on desktop; tap expands on mobile.' } },
            {
              name: 'footerColumns',
              type: 'array',
              fields: [
                { name: 'heading', type: 'text', localized: true, required: true },
                { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text', localized: true, required: true }, { name: 'url', type: 'text', required: true }] },
              ],
            },
            { name: 'utilityText', type: 'text', localized: true, defaultValue: 'Health Hour — live every Saturday at 11:00' },
          ],
        },
        {
          label: 'Contact & social',
          fields: [
            { name: 'helpline', type: 'text', defaultValue: '077 1002 2382' },
            { name: 'email', type: 'email', defaultValue: 'info@cahn.org.uk' },
            { name: 'address', type: 'textarea', defaultValue: 'Transformation Community Resource Centre\n1st Floor, Richmond House\n11 Richmond Grove, Manchester M13 0LN' },
            { name: 'companyLine', type: 'text', defaultValue: 'Caribbean & African Health Network CIC · Registered in England and Wales · Company No. 10845632' },
            {
              name: 'social',
              type: 'array',
              fields: [
                { name: 'platform', type: 'select', required: true, options: ['Instagram', 'Facebook', 'X', 'YouTube', 'LinkedIn', 'TikTok', 'Linktree'] },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO & analytics',
          fields: [
            { name: 'defaultDescription', type: 'textarea', localized: true },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            { name: 'ga4Id', type: 'text', admin: { description: 'Google Analytics 4 measurement ID (G-XXXX). Loads only after a visitor accepts analytics cookies.' } },
            { name: 'cookieText', type: 'textarea', localized: true, defaultValue: 'We use essential cookies to run this site and, only with your consent, Google Analytics to understand how it is used.' },
          ],
        },
      ],
    },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Homepage modules',
    livePreview: { url: ({ locale }) => previewURL('/', locale?.code) },
    preview: (_doc, { locale }) => previewURL('/', locale),
    description: 'Section order is fixed by the brief: Hero → Rotating banners → Partner carousel → CEO video → Health Hour mockup → the rest.',
  },
  access: { read: anyone, update: canEditSection('homepage') },
  versions: { drafts: { autosave: { interval: 1500 }, schedulePublish: true }, max: 30 },
  hooks: { beforeChange: [blockEditorPublish] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1 · Hero',
          description: 'The restored original hero. No extra calls to action are shown here.',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true },
                { name: 'headline', type: 'text', localized: true, required: true },
                { name: 'highlight', type: 'text', localized: true, admin: { description: 'Words shown in gold after the headline' } },
                { name: 'lede', type: 'textarea', localized: true },
                { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 3, admin: { description: 'Three photos: arch, rounded, doorway' } },
                { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Optional muted background loop' } },
              ],
            },
          ],
        },
        {
          label: '2 · Banners',
          fields: [
            {
              name: 'banners',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'seconds', type: 'number', defaultValue: 6, min: 3, max: 20, admin: { description: 'Seconds each banner shows. Banners themselves are managed under “Homepage banners”.' } },
              ],
            },
          ],
        },
        {
          label: '3 · Partners',
          fields: [
            {
              name: 'partners',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Working together' },
                { name: 'heading', type: 'text', localized: true, defaultValue: 'Partners, funders & supporters' },
                { name: 'loopSeconds', type: 'number', defaultValue: 48, min: 10, max: 180, admin: { description: 'Time for one full loop. Logos are managed under “Partner logos”.' } },
              ],
            },
          ],
        },
        {
          label: '4 · CEO video',
          description: 'Always placed directly after the partner carousel.',
          fields: [
            {
              name: 'ceoVideo',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'A message from our Chief Executive' },
                { name: 'title', type: 'text', localized: true, defaultValue: 'Our Work' },
                { name: 'text', type: 'textarea', localized: true },
                { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube link (preferred — captions come from YouTube)' } },
                { name: 'file', type: 'upload', relationTo: 'media', admin: { description: 'Or upload an MP4' } },
                { name: 'captions', type: 'upload', relationTo: 'media', admin: { description: 'WebVTT captions for an uploaded MP4' } },
                { name: 'poster', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: '5 · Health Hour mockup',
          fields: [
            {
              name: 'healthHour',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Flagship programme · since 2020' },
                { name: 'heading', type: 'text', localized: true, defaultValue: 'Do you have an hour?' },
                { name: 'text', type: 'textarea', localized: true },
                { name: 'sessionsCount', type: 'text', defaultValue: '400+' },
                { name: 'flyerSeconds', type: 'number', defaultValue: 4, min: 2, max: 15 },
                { name: 'maxFlyers', type: 'number', defaultValue: 8 },
              ],
            },
          ],
        },
        {
          label: '6 · More sections',
          fields: [
            {
              name: 'areas',
              type: 'array',
              label: 'Areas of work cards',
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'text', type: 'textarea', localized: true },
                { name: 'url', type: 'text', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            { name: 'showEvents', type: 'checkbox', defaultValue: true, label: 'Show “Coming up” events' },
            {
              name: 'manifesto',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Black Health Manifesto' },
                { name: 'heading', type: 'text', localized: true, defaultValue: 'Three mandates for change.' },
                { name: 'documents', type: 'relationship', relationTo: 'publications', hasMany: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  label: 'Donation settings',
  admin: { group: 'Settings', description: 'API keys are never stored here — they live in the server environment variables.' },
  access: { read: anyone, update: canEditSection('donations') },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Your gift powers care that understands.' },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'allowMonthly', type: 'checkbox', defaultValue: true },
    { name: 'coverFeesPercent', type: 'number', defaultValue: 3 },
    {
      name: 'currencies',
      type: 'array',
      minRows: 1,
      fields: [
        { type: 'row', fields: [
          { name: 'code', type: 'text', required: true, admin: { width: '20%' } },
          { name: 'symbol', type: 'text', required: true, admin: { width: '15%' } },
          { name: 'label', type: 'text', required: true, localized: true },
          { name: 'provider', type: 'select', required: true, options: [{ label: 'Stripe (international)', value: 'stripe' }, { label: 'Paystack (African payments)', value: 'paystack' }] },
        ] },
        { name: 'amounts', type: 'number', hasMany: true, required: true, admin: { description: 'Four suggested amounts' } },
        { name: 'methods', type: 'text', hasMany: true, admin: { description: 'Shown as badges, e.g. Card, Apple Pay, MTN MoMo' } },
      ],
    },
    {
      name: 'impacts',
      type: 'array',
      maxRows: 4,
      admin: { description: 'What each suggested amount could do, in the same order as the amounts.' },
      fields: [{ name: 'text', type: 'textarea', localized: true, required: true }],
    },
    { name: 'giftAid', type: 'checkbox', defaultValue: false, admin: { description: 'Only enable if CAHN is eligible to claim Gift Aid.' } },
    { name: 'otherWays', type: 'richText', localized: true },
  ],
}
