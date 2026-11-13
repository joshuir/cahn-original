import type { Access, FieldAccess, Where } from 'payload'

/**
 * Roles
 *  - admin:        everything, including users, branding and payment settings
 *  - sectionAdmin: edit + publish only inside the sections assigned to them
 *  - editor:       create and edit drafts in assigned sections; cannot publish
 *  - viewer:       read-only access to the admin
 */
export type Role = 'admin' | 'sectionAdmin' | 'editor' | 'viewer'

export type Section =
  | 'homepage'
  | 'pages'
  | 'healthHour'
  | 'events'
  | 'services'
  | 'research'
  | 'opportunities'
  | 'media'
  | 'donations'
  | 'newsletter'

export const SECTION_OPTIONS: { label: string; value: Section }[] = [
  { label: 'Homepage modules', value: 'homepage' },
  { label: 'Pages & navigation', value: 'pages' },
  { label: 'Health Hour', value: 'healthHour' },
  { label: 'Events & campaigns', value: 'events' },
  { label: 'Services & programmes', value: 'services' },
  { label: 'Research & publications', value: 'research' },
  { label: 'Opportunities', value: 'opportunities' },
  { label: 'Media & press', value: 'media' },
  { label: 'Donations', value: 'donations' },
  { label: 'Newsletter & subscribers', value: 'newsletter' },
]

type U = { role?: Role; sections?: Section[] | null } | null | undefined

export const isAdminUser = (user: U) => user?.role === 'admin'

const inSection = (user: U, section: Section) =>
  isAdminUser(user) || (!!user?.sections && user.sections.includes(section))

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user as U)

export const adminField: FieldAccess = ({ req: { user } }) => isAdminUser(user as U)

/** Public can read published docs; logged-in staff can read drafts too. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  const where: Where = { _status: { equals: 'published' } }
  return where
}

/** Create / update within a section. Viewers never write. */
export const canEditSection =
  (section: Section): Access =>
  ({ req: { user } }) => {
    const u = user as U
    if (!u || u.role === 'viewer') return false
    return inSection(u, section)
  }

/** Delete within a section: admins and section admins only. */
export const canDeleteSection =
  (section: Section): Access =>
  ({ req: { user } }) => {
    const u = user as U
    if (!u) return false
    if (isAdminUser(u)) return true
    return u.role === 'sectionAdmin' && inSection(u, section)
  }

/**
 * Publishing gate: editors may save drafts but not publish.
 * Used as a beforeChange hook on versioned collections/globals.
 */
export const blockEditorPublish = ({ data, req }: { data: any; req: any }) => {
  const u = req.user as U
  if (u?.role === 'editor' && data?._status === 'published') {
    data._status = 'draft'
  }
  return data
}
