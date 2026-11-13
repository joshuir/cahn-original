/**
 * Lightweight form protection: per-IP rate limit, honeypot field and optional
 * Cloudflare Turnstile. The in-memory limiter is per server instance — enough to
 * stop casual abuse; add Vercel Firewall rules for stronger protection.
 */
const hits = new Map<string, number[]>()

export function clientIP(req: Request) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
}

export function rateLimit(req: Request, bucket: string, max = 5, windowMs = 60_000) {
  const key = `${bucket}:${clientIP(req)}`
  const now = Date.now()
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs)
  list.push(now)
  hits.set(key, list)
  if (hits.size > 5000) hits.clear()
  return list.length <= max
}

export const isBot = (body: any) => Boolean(body?.company)

export async function turnstileOK(token?: string, ip?: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, ...(ip ? { remoteip: ip } : {}) }),
  })
  const j = await res.json().catch(() => ({}))
  return Boolean(j?.success)
}

export const clean = (v: unknown, max = 500) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max)
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 200
