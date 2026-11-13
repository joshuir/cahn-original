import type { CollectionConfig } from 'payload'
import { adminField, isAdminUser, SECTION_OPTIONS } from '../access'
import { supabaseStrategy } from '../auth/supabase'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users & roles' },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    // Staff sign in with their existing CAHN Supabase account (see src/auth/supabase.ts).
    strategies: [supabaseStrategy],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'sections'],
    group: 'Settings',
  },
  access: {
    // Everyone signed in can see the team list; only admins manage it.
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => isAdminUser(user as any),
    update: ({ req: { user }, id }) => isAdminUser(user as any) || (user && user.id === id) || false,
    delete: ({ req: { user } }) => isAdminUser(user as any),
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: adminField, create: adminField },
      options: [
        { label: 'Administrator — full control', value: 'admin' },
        { label: 'Section administrator — edit & publish in assigned sections', value: 'sectionAdmin' },
        { label: 'Editor — drafts only, needs approval to publish', value: 'editor' },
        { label: 'Viewer — read only', value: 'viewer' },
      ],
    },
    {
      name: 'sections',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: SECTION_OPTIONS,
      access: { update: adminField, create: adminField },
      admin: {
        description: 'Which parts of the site this person can manage. Administrators can manage everything.',
        condition: (data) => data?.role !== 'admin',
      },
    },
  ],
}
