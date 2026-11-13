import { clean, isBot, rateLimit, validEmail } from '@/lib/guard'
import { getPayload } from '@/lib/payload'

/** Event registration — checks capacity, stores the registration (which triggers the confirmation email). */
export async function POST(req: Request) {
  if (!rateLimit(req, 'register', 6)) return Response.json({ error: 'Too many requests' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  if (isBot(body)) return Response.json({ ok: true })
  const name = clean(body.name, 120)
  const email = clean(body.email, 200).toLowerCase()
  const tickets = Math.min(10, Math.max(1, Number(body.tickets) || 1))
  if (!name || !validEmail(email)) return Response.json({ error: 'Please enter your name and a valid email.' }, { status: 400 })

  const payload = await getPayload()
  const ev: any = await payload.findByID({ collection: 'events', id: body.event, depth: 0, overrideAccess: false }).catch(() => null)
  if (!ev || ev.registration?.mode !== 'onsite') return Response.json({ error: 'Registration is not open for this event.' }, { status: 400 })
  if (!ev.dateTBC && ev.startsAt && new Date(ev.startsAt) < new Date()) return Response.json({ error: 'This event has already started.' }, { status: 400 })

  const regs = await payload.find({ collection: 'event-registrations', where: { event: { equals: ev.id } }, limit: 0, pagination: false, depth: 0, overrideAccess: true })
  if (regs.docs.some((r: any) => r.email === email)) return Response.json({ error: 'You’re already registered — check your inbox for the confirmation.' }, { status: 409 })
  if (ev.registration?.capacity) {
    const taken = regs.docs.reduce((n: number, r: any) => n + (r.tickets || 1), 0)
    if (taken + tickets > ev.registration.capacity) return Response.json({ error: 'Sorry, there aren’t enough places left.' }, { status: 409 })
  }
  await payload.create({
    collection: 'event-registrations',
    overrideAccess: true,
    data: { event: ev.id, name, email, tickets, accessNeeds: clean(body.accessNeeds, 300), marketingConsent: Boolean(body.marketingConsent), locale: clean(body.locale, 5) },
  })
  return Response.json({ ok: true })
}
