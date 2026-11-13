import { getPayload } from '@/lib/payload'
import { rateLimit, validEmail } from '@/lib/guard'
import { passwordGrant, resolveCmsUser, sessionCookies, supabaseAuthEnabled } from '@/auth/supabase'

/** Sign in to the CMS with an existing CAHN Supabase account. */
export async function POST(req: Request) {
  if (!supabaseAuthEnabled) return Response.json({ error: 'Supabase sign-in is not configured.' }, { status: 503 })
  if (!rateLimit(req, 'cms-login', 8, 5 * 60_000)) return Response.json({ error: 'Too many attempts. Wait a few minutes and try again.' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!validEmail(email) || !password) return Response.json({ error: 'Enter your email and password.' }, { status: 400 })

  const r = await passwordGrant(email, password)
  if (!r.ok) return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 })

  const payload = await getPayload()
  const user = await resolveCmsUser(payload, r.json.user, r.json.access_token)
  if (!user) return Response.json({ error: 'Your account does not have CMS access. Ask an administrator.' }, { status: 403 })

  const headers = new Headers({ 'Content-Type': 'application/json' })
  for (const c of sessionCookies(r.json)) headers.append('Set-Cookie', c)
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
}
