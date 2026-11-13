import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'

/**
 * Media & document library — images, videos, flyers and PDFs.
 * Images keep their original file; resized variants are generated for performance.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media file', plural: 'Media & documents' },
  admin: {
    group: 'Library',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'kind', 'updatedAt'],
  },
  folders: true,
  access: {
    read: anyone,
    create: ({ req: { user } }) => Boolean(user) && (user as any).role !== 'viewer',
    update: ({ req: { user } }) => Boolean(user) && (user as any).role !== 'viewer',
    delete: loggedIn,
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      { name: 'thumb', width: 400, withoutEnlargement: true },
      { name: 'card', width: 900, withoutEnlargement: true },
      { name: 'hero', width: 1920, withoutEnlargement: true },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Describe the image for people using screen readers. For documents, use the title.' },
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Photo / image', value: 'image' },
        { label: 'Logo', value: 'logo' },
        { label: 'Flyer', value: 'flyer' },
        { label: 'Video', value: 'video' },
        { label: 'Document (PDF)', value: 'document' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'credit', type: 'text', admin: { description: 'Photographer or source, e.g. “CAHN / Instagram” or “Unsplash — name”.' } },
    {
      name: 'documentText',
      type: 'textarea',
      admin: {
        description: 'Optional: paste the text of a PDF so site search can find words inside it.',
        condition: (data) => data?.kind === 'document',
      },
    },
  ],
}
