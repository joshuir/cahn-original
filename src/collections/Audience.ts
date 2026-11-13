import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import { adminOnly, canDeleteSection, canEditSection } from '../access'

/** Newsletter / e-bulletin subscribers with consent record and one-click unsubscribe. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: { group: 'Audience', useAsTitle: 'email', defaultColumns: ['email', 'status', 'source', 'createdAt'] },
  access: {
    read: canEditSection('newsletter'),
    create: () => false, // only via /api/site/subscribe
    update: canEditSection('newsletter'),
    delete: canDeleteSection('newsletter'),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.token) data.token = crypto.randomBytes(24).toString('hex')
        return data
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'name', type: 'text' },
    { name: 'status', type: 'select', defaultValue: 'subscribed', options: ['subscribed', 'unsubscribed'] },
    { name: 'topics', type: 'select', hasMany: true, options: ['e-bulletin', 'health-hour', 'events', 'jobs'] },
    { name: 'source', type: 'text', admin: { readOnly: true } },
    { name: 'consentText', type: 'textarea', admin: { readOnly: true, description: 'Exact wording the person agreed to.' } },
    { name: 'consentAt', type: 'date', admin: { readOnly: true } },
    { name: 'token', type: 'text', index: true, admin: { readOnly: true, hidden: true } },
    { name: 'locale', type: 'text' },
  ],
}

/** Donation records — created by the donate API, confirmed by payment webhooks. */
export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: { singular: 'Donation', plural: 'Donations' },
  admin: { group: 'Audience', useAsTitle: 'reference', defaultColumns: ['reference', 'amount', 'currency', 'frequency', 'provider', 'status', 'createdAt'] },
  access: {
    read: canEditSection('donations'),
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true },
    { name: 'provider', type: 'select', required: true, options: ['stripe', 'paystack'] },
    { name: 'amount', type: 'number', required: true, admin: { description: 'In major units (e.g. 25 = £25.00)' } },
    { name: 'coveredFees', type: 'number' },
    { name: 'currency', type: 'text', required: true },
    { name: 'frequency', type: 'select', options: ['one-off', 'monthly'], defaultValue: 'one-off' },
    { name: 'status', type: 'select', defaultValue: 'pending', options: ['pending', 'paid', 'failed', 'cancelled', 'refunded'] },
    { name: 'email', type: 'email' },
    { name: 'name', type: 'text' },
    { name: 'giftAid', type: 'checkbox' },
    { name: 'providerRef', type: 'text', admin: { description: 'Stripe session / Paystack reference' } },
    { name: 'subscriptionRef', type: 'text' },
  ],
}
