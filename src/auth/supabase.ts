import crypto from 'crypto'
import type { AuthStrategy, Payload } from 'payload'

/**
 * CMS sign-in with CAHN's existing Supabase Auth accounts.
 *
 * Staff sign in on /admin with the same email + password they already use in
 * Supabase. We verify the credentials with Supabase, keep the Supabase session
 * in two httpOnly cookies, and on every request this Payload auth strategy
 * checks that session and resolves the matching CMS user (by email).
 *
 * Only Supabase accounts whose `public.profiles.role` is admin/editor/etc. get
 * CMS access; roles are mapped below. Nothing in Supabase is written to.
 */
export const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
export const SB_KEY = process.env.SUPABASE_ANON_KEY || ''
export const supabaseAuthEnabled = Boolean(SB_URL && SB_KEY)

export const AT_COOKIE = 'cahn_sb_at'
export const RT_COOKIE = 'cahn_sb_rt'

const ROLE_MAP: Record<string, 'admin' | 'sectionAdmin' | 'editor' | 'viewer'> = {
  admin: 'admin',
  superadmin: 'admin',
  owner: 'admin',
  manager: 'sectionAdmin',
  section_admin: 'sectionAdmin',
  editor: 'editor',
  staff: 'editor',
  viewer: 'viewer',
}

type SBUser = { id: string; email?: string; user_metadata?: Record<string, any> }
type Tokens = { access_token: string; refresh_token: string; expires_in: number; user: SBUser }

async function sb(path: string, init: RequestInit = {}, bearer?: string) {
  const res = await fetch(`${SB_URL}${path}`, {
    ...init,
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}), ...(init.headers || {}) },
    cache: 'no-store',
  })
  const json = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, json }
}

export const passwordGrant = (email: string, password: string) =>
  sb('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) })

const refreshGrant = (refresh_token: string) =>
  sb('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token }) })

export const revoke = (accessToken: string) => sb('/auth/v1/logout', { method: 'POST' }, accessToken)

/** Reads the person's role from Supabase `profiles` using their own token (RLS applies). */
async function profileRole(user: SBUser, token: string) {
  const r = await sb(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role,full_name`, { method: 'GET' }, token)
  const row = Array.isArray(r.json) ? r.json[0] : null
  return { role: ROLE_MAP[String(row?.role || '').toLowerCase()] || null, name: row?.full_name || user.user_metadata?.full_name || user.email }
}

/** Finds the CMS user for a Supabase account, creating it on first sign-in if their profile grants a CMS role. */
export async function resolveCmsUser(payload: Payload, sbUser: SBUser, token: string) {
  const email = String(sbUser.email || '').toLowerCase()
  if (!email) return null
  const found = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })
  if (found.docs[0]) return found.docs[0] as any
  const { role, name } = await profileRole(sbUser, token)
  if (!role) return null
  return (await payload.create({
    collection: 'users',
    overrideAccess: true,
    // Local password is random and never shared: this person signs in through Supabase.
    data: { email, name, role, password: crypto.randomBytes(24).toString('base64url') } as any,
  })) as any
}

export const cookieHeader = (name: string, value: string, maxAge: number) =>
  `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`

export const sessionCookies = (t: Tokens) => [
  cookieHeader(AT_COOKIE, t.access_token, Math.max(60, t.expires_in || 3600)),
  cookieHeader(RT_COOKIE, t.refresh_token, 60 * 60 * 24 * 14),
]

const readCookie = (headers: Headers, name: string) => {
  const m = (headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? decodeURIComponent(m[1]) : null
}

// Short cache so every admin request doesn't round-trip to Supabase.
const cache = new Map<string, { user: SBUser; until: number }>()

export const supabaseStrategy: AuthStrategy = {
  name: 'supabase',
  authenticate: async ({ headers, payload, canSetHeaders }) => {
    if (!supabaseAuthEnabled) return { user: null }
    let at = readCookie(headers, AT_COOKIE)
    const rt = readCookie(headers, RT_COOKIE)
    if (!at && !rt) return { user: null }

    let sbUser: SBUser | null = null
    let responseHeaders: Headers | undefined
    const hit = at ? cache.get(at) : undefined
    if (hit && hit.until > Date.now()) sbUser = hit.user
    else if (at) {
      const r = await sb('/auth/v1/user', { method: 'GET' }, at)
      if (r.ok) sbUser = r.json
    }
    if (!sbUser && rt && canSetHeaders) {
      const r = await refreshGrant(rt)
      if (r.ok) {
        const t = r.json as Tokens
        at = t.access_token
        sbUser = t.user
        responseHeaders = new Headers()
        for (const c of sessionCookies(t)) responseHeaders.append('Set-Cookie', c)
      }
    }
    if (!sbUser || !at) return { user: null }
    cache.set(at, { user: sbUser, until: Date.now() + 60_000 })
    if (cache.size > 500) cache.clear()

    const user = await resolveCmsUser(payload, sbUser, at)
    if (!user) return { user: null }
    return { user: { ...user, collection: 'users', _strategy: 'supabase' }, responseHeaders }
  },
}
