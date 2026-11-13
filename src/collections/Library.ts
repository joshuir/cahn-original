import type { CollectionConfig } from 'payload'
import { anyone, blockEditorPublish, canDeleteSection, canEditSection, publishedOrStaff } from '../access'
import { searchKeywords, slugField, versioned } from '../fields/shared'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Research & publications' },
  admin: { group: 'Research & media', useAsTitle: 'title', defaultColumns: ['title', 'type', 'year', '_status'] },
  access: { read: publishedOrStaff, create: canEditSection('research'), update: canEditSection('research'), delete: canDeleteSection('research') },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  defaultSort: '-year',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Report', value: 'report' },
        { label: 'Research paper', value: 'research' },
        { label: 'Policy statement', value: 'policy' },
        { label: 'Resource', value: 'resource' },
      ],
    },
    { name: 'year', type: 'number' },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'file', type: 'upload', relationTo: 'media', admin: { description: 'The PDF to download. Paste its text into the media item’s “Document text” so search can look inside it.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    searchKeywords,
  ],
}

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Vacancy', plural: 'Jobs & vacancies' },
  admin: { group: 'Opportunities', useAsTitle: 'title', defaultColumns: ['title', 'employer', 'location', 'closesAt', '_status'] },
  access: {
    read: publishedOrStaff,
    create: canEditSection('opportunities'),
    update: canEditSection('opportunities'),
    delete: canDeleteSection('opportunities'),
  },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  defaultSort: 'closesAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'employer', type: 'select', required: true, defaultValue: 'cahn', options: [{ label: 'CAHN', value: 'cahn' }, { label: 'Partner organisation', value: 'partner' }] },
    { name: 'partnerName', type: 'text', admin: { condition: (d) => d?.employer === 'partner' } },
    { name: 'location', type: 'text' },
    { name: 'contract', type: 'text' },
    { name: 'salary', type: 'text' },
    { name: 'closesAt', type: 'date', required: true, admin: { description: 'The vacancy disappears from the site after this date.' } },
    { name: 'description', type: 'richText', localized: true },
    { name: 'applyUrl', type: 'text' },
    { name: 'pack', type: 'upload', relationTo: 'media', admin: { description: 'Job pack PDF' } },
    searchKeywords,
  ],
}

export const Grants: CollectionConfig = {
  slug: 'grants',
  labels: { singular: 'Grant programme', plural: 'Grants' },
  admin: { group: 'Opportunities', useAsTitle: 'title' },
  access: { read: publishedOrStaff, create: canEditSection('opportunities'), update: canEditSection('opportunities'), delete: canDeleteSection('opportunities') },
  versions: versioned,
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'roundStatus', type: 'select', defaultValue: 'upcoming', options: ['open', 'upcoming', 'closed'] },
    { name: 'opensAt', type: 'date' },
    { name: 'closesAt', type: 'date' },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'guidance', type: 'upload', relationTo: 'media' },
    { name: 'applyUrl', type: 'text' },
    searchKeywords,
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'News item', plural: 'Press & updates' },
  admin: { group: 'Research & media', useAsTitle: 'title', defaultColumns: ['title', 'kind', 'publishedAt', '_status'] },
  access: { read: publishedOrStaff, create: canEditSection('media'), update: canEditSection('media'), delete: canDeleteSection('media') },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'press',
      options: [
        { label: 'Press release', value: 'press' },
        { label: 'Statement', value: 'statement' },
        { label: 'E-bulletin', value: 'bulletin' },
        { label: 'Case study', value: 'case-study' },
        { label: 'Testimonial', value: 'testimonial' },
        { label: 'Update', value: 'update' },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true, admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', localized: true },
    searchKeywords,
  ],
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video', plural: 'Video library' },
  orderable: true,
  admin: { group: 'Research & media', useAsTitle: 'title', defaultColumns: ['title', 'series'] },
  access: { read: anyone, create: canEditSection('media'), update: canEditSection('media'), delete: canDeleteSection('media') },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'series', type: 'select', options: ['CEO film', 'Health Hour', 'Events', 'Campaigns', 'Stories'] },
    { name: 'youtubeUrl', type: 'text', required: true },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', admin: { description: 'Optional. The YouTube thumbnail is used if empty.' } },
    { name: 'duration', type: 'text' },
  ],
}

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Photo album', plural: 'Photo galleries' },
  orderable: true,
  admin: { group: 'Research & media', useAsTitle: 'name' },
  access: { read: anyone, create: canEditSection('media'), update: canEditSection('media'), delete: canDeleteSection('media') },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('name'),
    { name: 'date', type: 'date' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
