import type { CollectionConfig } from 'payload'
import { anyone, blockEditorPublish, canDeleteSection, canEditSection, publishedOrStaff } from '../access'
import { searchKeywords, slugField, sortOrder, versioned } from '../fields/shared'
import { previewURL } from '../utilities/preview'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    group: 'Services & programmes',
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', '_status'],
    livePreview: { url: ({ data, locale }) => previewURL(`/services/${data?.slug || ''}`, locale?.code) },
  },
  access: { read: publishedOrStaff, create: canEditSection('services'), update: canEditSection('services'), delete: canDeleteSection('services') },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'summary', type: 'textarea', localized: true, required: true },
    {
      name: 'needs',
      type: 'select',
      hasMany: true,
      admin: { description: 'Used by the “I need help with…” finder.' },
      options: [
        { label: 'Feeling unsafe at home', value: 'unsafe' },
        { label: 'Housing, benefits or work', value: 'housing' },
        { label: 'Immigration or legal issues', value: 'legal' },
        { label: 'My mental wellbeing', value: 'wellbeing' },
        { label: 'Parenting & family', value: 'family' },
        { label: 'Leaving hospital', value: 'hospital' },
        { label: 'Exploitation or trafficking', value: 'exploitation' },
        { label: 'Windrush compensation', value: 'windrush' },
      ],
    },
    { name: 'body', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'flyer', type: 'upload', relationTo: 'media' },
    { name: 'sensitive', type: 'checkbox', label: 'Show “Leave this site quickly” button on this page', defaultValue: false },
    sortOrder,
    searchKeywords,
  ],
}

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  labels: { singular: 'Programme', plural: 'Programmes & initiatives' },
  admin: {
    group: 'Services & programmes',
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'theme', '_status'],
    livePreview: { url: ({ data, locale }) => previewURL(`/programmes/${data?.slug || ''}`, locale?.code) },
  },
  access: { read: publishedOrStaff, create: canEditSection('services'), update: canEditSection('services'), delete: canDeleteSection('services') },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'tag', type: 'text', admin: { description: 'Short code shown on the card, e.g. BHIP' } },
    {
      name: 'theme',
      type: 'select',
      required: true,
      options: [
        { label: 'Health improvement', value: 'health' },
        { label: 'Blood & organ donation', value: 'donation' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Community empowerment', value: 'empowerment' },
        { label: 'Research & learning', value: 'research' },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true, required: true },
    { name: 'hoverText', type: 'text', localized: true, admin: { description: 'Extra line revealed on hover / focus.' } },
    { name: 'body', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Show in the spotlight band.' } },
    sortOrder,
    searchKeywords,
  ],
}

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People (board, patrons, staff)' },
  orderable: true,
  admin: { group: 'Website', useAsTitle: 'name', defaultColumns: ['name', 'role', 'team'] },
  access: { read: anyone, create: canEditSection('pages'), update: canEditSection('pages'), delete: canDeleteSection('pages') },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    {
      name: 'team',
      type: 'select',
      required: true,
      options: [
        { label: 'Board', value: 'board' },
        { label: 'Patrons', value: 'patrons' },
        { label: 'Executive office', value: 'executive' },
        { label: 'Community services', value: 'community' },
        { label: 'Health partnership & policy', value: 'policy' },
        { label: 'Comms, marketing, IT & faith', value: 'comms' },
        { label: 'Volunteers', value: 'volunteers' },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', localized: true },
  ],
}
