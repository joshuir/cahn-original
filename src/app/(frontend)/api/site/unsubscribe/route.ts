import { getPayload } from '@/lib/payload'

/** One-click unsubscribe link used in every email (GET) and by mail clients (POST, RFC 8058). */
async function unsubscribe(token: string | null) {
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return false
  const payload = await getPayload()
  const r = await payload.find({ collection: 'subscribers', where: { token: { equals: token } }, limit: 1, overrideAccess: true })
  if (!r.docs[0]) return false
  await payload.update({ collection: 'subscribers', id: r.docs[0].id, overrideAccess: true, data: { status: 'unsubscribed' } })
  return true
}

export async function GET(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get('token'))
  const html = `<!doctype html><meta name="viewport" content="width=device-width"><title>Unsubscribed</title><body style="font-family:Inter,Arial,sans-serif;background:#F7F2E9;color:#0F1F18;display:grid;place-items:center;min-height:90vh;margin:0"><div style="background:#fff;border-radius:24px;padding:40px;max-width:480px"><h1 style="margin:0 0 12px">${ok ? 'You’ve been unsubscribed' : 'Link not recognised'}</h1><p>${ok ? 'You won’t receive any more emails from this list.' : 'This link may have already been used. Contact info@cahn.org.uk if you still receive emails.'}</p><a href="/" style="color:#0B6B3F;font-weight:700">Back to cahn.org.uk</a></div></body>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(req: Request) {
  await unsubscribe(new URL(req.url).searchParams.get('token'))
  return new Response(null, { status: 204 })
}
