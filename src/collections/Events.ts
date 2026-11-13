import type { CollectionConfig } from 'payload'
import { blockEditorPublish, canDeleteSection, canEditSection, publishedOrStaff } from '../access'
import { searchKeywords, slugField, versioned } from '../fields/shared'
import { previewURL } from '../utilities/preview'
import { sendEventConfirmation } from '../utilities/email'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events & campaigns' },
  admin: {
    group: 'Events',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'startsAt', 'venue', '_status'],
    livePreview: { url: ({ data, locale }) => previewURL(`/events/${data?.slug || ''}`, locale?.code) },
    preview: (doc, { locale }) => previewURL(`/events/${(doc as any)?.slug || ''}`, locale),
  },
  access: {
    read: publishedOrStaff,
    create: canEditSection('events'),
    update: canEditSection('events'),
    delete: canDeleteSection('events'),
  },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'community',
      options: [
        { label: 'Flagship', value: 'flagship' },
        { label: 'Community', value: 'community' },
        { label: 'Online weekly', value: 'online' },
        { label: 'Awareness', value: 'awareness' },
        { label: 'Campaign', value: 'campaign' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'dateTBC', type: 'checkbox', label: 'Date to be confirmed', admin: { position: 'sidebar' } },
    { name: 'venue', type: 'text', localized: true },
    { name: 'address', type: 'textarea' },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'body', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'schedule',
      type: 'array',
      fields: [
        { name: 'time', type: 'text', required: true },
        { name: 'item', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'speakers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'bio', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'registration',
      type: 'group',
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'onsite',
          options: [
            { label: 'Register on this website', value: 'onsite' },
            { label: 'External link (Eventbrite, portal…)', value: 'external' },
            { label: 'No registration', value: 'none' },
          ],
        },
        { name: 'externalUrl', type: 'text', admin: { condition: (_, s) => s?.mode === 'external' } },
        { name: 'capacity', type: 'number', admin: { condition: (_, s) => s?.mode === 'onsite' } },
        { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Register' },
      ],
    },
    { name: 'gallery', type: 'relationship', relationTo: 'albums', admin: { position: 'sidebar', description: 'Photo album shown after the event.' } },
    searchKeywords,
  ],
}

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: { singular: 'Registration', plural: 'Event registrations' },
  admin: {
    group: 'Events',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'event', 'tickets', 'createdAt'],
  },
  access: {
    // Created only through the site's registration API (server-side); staff read.
    read: canEditSection('events'),
    create: () => false,
    update: canEditSection('events'),
    delete: canDeleteSection('events'),
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        await sendEventConfirmation(req.payload, doc).catch((e) => req.payload.logger.error(e))
      },
    ],
  },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'tickets', type: 'number', defaultValue: 1, min: 1, max: 10 },
    { name: 'accessNeeds', type: 'text' },
    { name: 'marketingConsent', type: 'checkbox' },
    { name: 'locale', type: 'text' },
  ],
}
