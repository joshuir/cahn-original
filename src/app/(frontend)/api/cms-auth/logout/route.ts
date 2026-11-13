import { AT_COOKIE, cookieHeader, revoke, RT_COOKIE, supabaseAuthEnabled } from '@/auth/supabase'

/** Ends the Supabase CMS session (the Payload session is cleared by Payload's own logout). */
export async function POST(req: Request) {
  const at = (req.headers.get('cookie') || '').match(new RegExp(`${AT_COOKIE}=([^;]+)`))?.[1]
  if (at && supabaseAuthEnabled) await revoke(decodeURIComponent(at)).catch(() => null)
  const headers = new Headers({ 'Content-Type': 'application/json' })
  headers.append('Set-Cookie', cookieHeader(AT_COOKIE, '', 0))
  headers.append('Set-Cookie', cookieHeader(RT_COOKIE, '', 0))
  return new Response('{"ok":true}', { headers })
}
