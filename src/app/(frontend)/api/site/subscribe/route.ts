import { clean, isBot, rateLimit, validEmail } from '@/lib/guard'
import { getPayload } from '@/lib/payload'
import { sendSubscribeConfirmation } from '@/utilities/email'

export async function POST(req: Request) {
  if (!rateLimit(req, 'subscribe', 5)) return Response.json({ error: 'Too many requests' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  if (isBot(body)) return Response.json({ ok: true })
  const email = clean(body.email, 200).toLowerCase()
  if (!validEmail(email)) return Response.json({ error: 'Please enter a valid email.' }, { status: 400 })
  if (!body.consent) return Response.json({ error: 'Please tick the consent box.' }, { status: 400 })
  const topic = ['e-bulletin', 'health-hour', 'events', 'jobs'].includes(body.topic) ? body.topic : 'e-bulletin'
  const payload = await getPayload()
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  let sub: any
  if (existing.docs[0]) {
    const cur: any = existing.docs[0]
    sub = await payload.update({
      collection: 'subscribers',
      id: cur.id,
      overrideAccess: true,
      data: { status: 'subscribed', topics: Array.from(new Set([...(cur.topics || []), topic])), consentText: clean(body.consentText, 500), consentAt: new Date().toISOString() },
    })
  } else {
    sub = await payload.create({
      collection: 'subscribers',
      overrideAccess: true,
      data: { email, status: 'subscribed', topics: [topic], source: clean(body.source, 60), consentText: clean(body.consentText, 500), consentAt: new Date().toISOString(), locale: clean(body.locale, 5) },
    })
  }
  await sendSubscribeConfirmation(payload, sub).catch((e) => payload.logger.error(e))
  return Response.json({ ok: true })
}
