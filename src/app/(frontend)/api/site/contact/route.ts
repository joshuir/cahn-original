import { clean, clientIP, isBot, rateLimit, turnstileOK, validEmail } from '@/lib/guard'
import { getPayload } from '@/lib/payload'
import { emailLayout } from '@/utilities/email'

/** Enquiry + volunteer forms. Stored as Form submissions in the CMS and emailed to the team. */
export async function POST(req: Request) {
  if (!rateLimit(req, 'contact', 5)) return Response.json({ error: 'Too many requests' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  if (isBot(body)) return Response.json({ ok: true })
  if (!(await turnstileOK(body.turnstile, clientIP(req)))) return Response.json({ error: 'Spam check failed' }, { status: 400 })
  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const topic = clean(body.topic, 80) || 'General'
  const message = clean(body.message, 5000)
  if (!name || !validEmail(email) || !message) return Response.json({ error: 'Please complete all fields.' }, { status: 400 })
  if (!body.consent) return Response.json({ error: 'Please tick the consent box.' }, { status: 400 })

  const payload = await getPayload()
  const forms = await payload.find({ collection: 'forms', where: { title: { equals: 'Contact' } }, limit: 1, overrideAccess: true })
  if (forms.docs[0]) {
    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        form: forms.docs[0].id,
        submissionData: [
          { field: 'topic', value: topic },
          { field: 'name', value: name },
          { field: 'email', value: email },
          { field: 'message', value: message },
          { field: 'role', value: clean(body.role, 80) },
        ].filter((f) => f.value),
      },
    })
  }
  const to = process.env.ENQUIRIES_TO || 'info@cahn.org.uk'
  await payload
    .sendEmail({
      to,
      replyTo: email,
      subject: `[Website] ${topic} — ${name}`,
      html: emailLayout(`New enquiry: ${topic}`, `<p><strong>${name}</strong> &lt;${email}&gt;</p><p style="white-space:pre-wrap;line-height:1.6">${message.replace(/</g, '&lt;')}</p>`),
    })
    .catch((e) => payload.logger.error(e))
  await payload
    .sendEmail({ to: email, subject: 'We’ve received your message', html: emailLayout('Thanks for getting in touch', `<p style="line-height:1.6">Your message about <strong>${topic}</strong> is with our team. We reply within 2 working days.</p>`) })
    .catch((e) => payload.logger.error(e))
  return Response.json({ ok: true })
}
