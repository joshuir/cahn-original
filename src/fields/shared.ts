import type { Field } from 'payload'

export const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** URL slug, generated from `title` (or `name`) when left blank. */
export const slugField = (from: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the page address. Leave blank to generate from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from]
        if (typeof source === 'string') return slugify(source)
        return value
      },
    ],
  },
})

/** A link that can point to an internal path or an external URL. */
export const linkFields = (name = 'link', required = false): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', localized: true, required },
    {
      name: 'url',
      type: 'text',
      required,
      admin: { description: 'Internal path such as /health-hour, or a full https:// address' },
    },
    { name: 'newTab', type: 'checkbox', defaultValue: false },
  ],
})

/** Drafts, autosave, scheduled publishing and version history for content collections. */
export const versioned = {
  drafts: {
    autosave: { interval: 1500 },
    schedulePublish: true,
  },
  maxPerDoc: 30,
} as const

/** Search keywords / alternative terms to improve site search matching. */
export const searchKeywords: Field = {
  name: 'searchKeywords',
  type: 'text',
  hasMany: true,
  admin: {
    position: 'sidebar',
    description: 'Alternative terms people might search for (e.g. “BHIP”, “DV”, “sickle cell”).',
  },
}

export const sortOrder: Field = {
  name: 'sortOrder',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
}
