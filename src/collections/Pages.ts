import type { CollectionConfig } from 'payload'
import { blockEditorPublish, canDeleteSection, canEditSection, publishedOrStaff } from '../access'
import { pageBlocks } from '../blocks'
import { searchKeywords, slugField, versioned } from '../fields/shared'
import { previewURL } from '../utilities/preview'

/**
 * Flexible pages built from drag-and-drop blocks (About and its subpages,
 * policy pages, campaign pages, and anything new the team needs).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status', 'updatedAt'],
    livePreview: { url: ({ data, locale }) => previewURL(data?.path || '/', locale?.code) },
    preview: (doc, { locale }) => previewURL((doc as any)?.path || '/', locale),
  },
  access: {
    read: publishedOrStaff,
    create: canEditSection('pages'),
    update: canEditSection('pages'),
    delete: canDeleteSection('pages'),
  },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: { position: 'sidebar', description: 'Nest this page under another (e.g. About → Our story).' },
    },
    {
      name: 'path',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Full address, built from parent + slug.' },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data) return undefined
            let prefix = ''
            if (data.parent) {
              const parentId = typeof data.parent === 'object' ? data.parent.id : data.parent
              const parent = await req.payload.findByID({ collection: 'pages', id: parentId, depth: 0, req }).catch(() => null)
              if (parent?.path) prefix = parent.path as string
            }
            return `${prefix}/${data.slug}`.replace(/\/+/g, '/')
          },
        ],
      },
    },
    {
      name: 'subnav',
      type: 'array',
      localized: true,
      admin: { description: 'Optional section menu shown in the page header (e.g. Our story · Board · Staff · Partners).' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'layout', type: 'blocks', blocks: pageBlocks, localized: true },
    searchKeywords,
  ],
}
