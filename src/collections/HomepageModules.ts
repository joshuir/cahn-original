import type { CollectionConfig } from 'payload'
import { anyone, blockEditorPublish, canDeleteSection, canEditSection, publishedOrStaff } from '../access'
import { versioned } from '../fields/shared'

/** Rotating homepage banners. Drag rows in the list view to reorder. */
export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Homepage banner', plural: 'Homepage banners' },
  orderable: true,
  admin: {
    group: 'Homepage modules',
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'startsAt', 'endsAt', '_status'],
    description: 'Banners rotate automatically on the homepage, in the order shown here (drag to reorder). No play/pause controls are shown.',
  },
  access: {
    read: publishedOrStaff,
    create: canEditSection('homepage'),
    update: canEditSection('homepage'),
    delete: canDeleteSection('homepage'),
  },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'tag', type: 'text', localized: true, admin: { description: 'Short label, e.g. “Every Saturday · 11:00”' } },
    {
      name: 'tagColour',
      type: 'select',
      defaultValue: 'gold',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Paper', value: 'paper' },
      ],
    },
    { name: 'line', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'linkLabel', type: 'text', localized: true, required: true },
        { name: 'linkUrl', type: 'text', required: true, admin: { description: 'e.g. /health-hour' } },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Shown on its own, or as the poster frame for a video. A striped placeholder shows until one is added.' } },
    { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Optional muted looping MP4/WebM. Not played for visitors who prefer reduced motion.' } },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'The banner hides itself after this time.' } },
      ],
    },
  ],
}

/** Partner, funder and supporter logos for the infinite carousel and About page. */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner logo', plural: 'Partner logos' },
  orderable: true,
  admin: {
    group: 'Homepage modules',
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'showInCarousel'],
    description: 'Logos loop continuously on the homepage in this order. Upload SVG or transparent PNG.',
  },
  access: {
    read: anyone,
    create: canEditSection('homepage'),
    update: canEditSection('homepage'),
    delete: canDeleteSection('homepage'),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text', admin: { description: 'Partner website (optional)' } },
    {
      name: 'group',
      type: 'select',
      defaultValue: 'current',
      options: [
        { label: 'Current partner', value: 'current' },
        { label: 'Previous partner', value: 'previous' },
        { label: 'Funder', value: 'funder' },
        { label: 'Supporter', value: 'supporter' },
      ],
    },
    { name: 'showInCarousel', type: 'checkbox', defaultValue: true },
  ],
}

/** Health Hour sessions — power the phone-mockup flyers, archive and resources. */
export const HealthHourSessions: CollectionConfig = {
  slug: 'health-hour-sessions',
  labels: { singular: 'Health Hour session', plural: 'Health Hour sessions' },
  orderable: true,
  admin: {
    group: 'Health Hour',
    useAsTitle: 'topic',
    defaultColumns: ['topic', 'sessionDate', 'showInMockup', '_status'],
    description: 'Each session can carry a flyer. Flyers marked “Show in phone mockup” rotate on the homepage in this order.',
  },
  access: {
    read: publishedOrStaff,
    create: canEditSection('healthHour'),
    update: canEditSection('healthHour'),
    delete: canDeleteSection('healthHour'),
  },
  versions: versioned,
  hooks: { beforeChange: [blockEditorPublish] },
  fields: [
    { name: 'topic', type: 'text', required: true, localized: true },
    {
      name: 'category',
      type: 'select',
      options: ['Cancer', 'Menopause', 'Sickle cell', 'Blood donation', 'Kidney health', 'Dental care', 'Screenings', 'Vaccinations', 'Mental health', 'Heart health', 'Other'],
    },
    { name: 'sessionDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'speakers', type: 'array', fields: [{ name: 'name', type: 'text', required: true }, { name: 'role', type: 'text', localized: true }, { name: 'photo', type: 'upload', relationTo: 'media' }] },
    { name: 'summary', type: 'textarea', localized: true },
    {
      name: 'flyer',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Promotional flyer. Shown at its original proportions inside the phone mockup — never cropped.' },
    },
    { name: 'showInMockup', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'replayUrl', type: 'text', admin: { description: 'YouTube replay link once the session has aired.' } },
    { name: 'resources', type: 'array', fields: [{ name: 'label', type: 'text', required: true, localized: true }, { name: 'file', type: 'upload', relationTo: 'media' }, { name: 'url', type: 'text' }] },
  ],
}
