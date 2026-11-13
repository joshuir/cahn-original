import type { Block } from 'payload'
import { linkFields } from '../fields/shared'

const tone = {
  name: 'tone',
  type: 'select' as const,
  defaultValue: 'paper',
  options: [
    { label: 'Paper (light)', value: 'paper' },
    { label: 'Sand', value: 'sand' },
    { label: 'Palm ink (dark)', value: 'ink' },
    { label: 'Gold', value: 'gold' },
  ],
}

export const PageHeaderBlock: Block = {
  slug: 'pageHeader',
  labels: { singular: 'Page header', plural: 'Page headers' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'lede', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imageShape',
      type: 'select',
      defaultValue: 'arch',
      options: [
        { label: 'Arch (rounded top)', value: 'arch' },
        { label: 'Rounded rectangle', value: 'rounded' },
        { label: 'Doorway (rounded bottom)', value: 'door' },
      ],
    },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'text', type: 'textarea', localized: true, required: true },
        {
          name: 'colour',
          type: 'select',
          defaultValue: 'red',
          options: [
            { label: 'Red', value: 'red' },
            { label: 'Gold', value: 'gold' },
            { label: 'Green', value: 'green' },
          ],
        },
      ],
    },
  ],
}

export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: { singular: 'Highlight columns', plural: 'Highlight columns' },
  fields: [
    tone,
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true, required: true },
      ],
    },
  ],
}

export const DotGridBlock: Block = {
  slug: 'dotGrid',
  labels: { singular: 'Priority grid', plural: 'Priority grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'items', type: 'array', fields: [{ name: 'label', type: 'text', localized: true, required: true }] },
  ],
}

export const NumberedCardsBlock: Block = {
  slug: 'numberedCards',
  labels: { singular: 'Numbered cards', plural: 'Numbered cards' },
  fields: [
    tone,
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const PeopleBlock: Block = {
  slug: 'people',
  labels: { singular: 'People grid', plural: 'People grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'The people behind CAHN' },
    {
      name: 'teams',
      type: 'select',
      hasMany: true,
      admin: { description: 'Leave empty to show everyone, with team filters.' },
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
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
  ],
}

export const SplitBlock: Block = {
  slug: 'split',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    tone,
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageSide', type: 'select', defaultValue: 'left', options: ['left', 'right'] },
    { name: 'links', type: 'array', maxRows: 2, fields: [linkFields('link', true)] },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action band', plural: 'Call to action bands' },
  fields: [
    tone,
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'text', type: 'textarea', localized: true },
    linkFields('link', true),
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Questions' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', localized: true, required: true },
        { name: 'answer', type: 'textarea', localized: true, required: true },
      ],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube link. Captions should be enabled on YouTube.' } },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'poster', type: 'upload', relationTo: 'media' },
  ],
}

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: { singular: 'Partner logos', plural: 'Partner logos' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Partners & supporters' },
    {
      name: 'group',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Current partners', value: 'current' },
        { label: 'Previous partners', value: 'previous' },
        { label: 'Funders', value: 'funder' },
      ],
    },
    { name: 'style', type: 'select', defaultValue: 'grid', options: ['grid', 'carousel'] },
  ],
}

export const pageBlocks: Block[] = [
  PageHeaderBlock,
  TimelineBlock,
  ColumnsBlock,
  DotGridBlock,
  NumberedCardsBlock,
  PeopleBlock,
  SplitBlock,
  RichTextBlock,
  CTABlock,
  FAQBlock,
  VideoBlock,
  PartnersBlock,
]
