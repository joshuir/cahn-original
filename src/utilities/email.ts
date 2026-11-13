import type { Payload } from 'payload'
import { SITE_URL } from './preview'

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Simple branded HTML wrapper for transactional emails. */
export const emailLayout = (title: string, body: string) => `<!doctype html><html><body style="margin:0;background:#F7F2E9;font-family:Inter,Arial,sans-serif;color:#0F1F18">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="height:6px;background:linear-gradient(90deg,#C23A2B 33%,#F0B323 33% 66%,#0B6B3F 66%)"></td></tr>
<tr><td style="padding:32px">
<div style="font-weight:800;font-size:20px;margin-bottom:16px">CAHN</div>
<h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 32px;background:#0F1F18;color:#CFD9D3;font-size:12px;line-height:1.5">Caribbean &amp; African Health Network · 11 Richmond Grove, Manchester M13 0LN · Helpline 077 1002 2382</td></tr>
</table></td></tr></table></body></html>`

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/London' }) : 'Date to be confirmed'

export async function sendEventConfirmation(payload: Payload, reg: any) {
  const eventId = typeof reg.event === 'object' ? reg.event.id : reg.event
  const event: any = await payload.findByID({ collection: 'events', id: eventId, depth: 0 })
  const url = `${SITE_URL}/en/events/${event.slug}`
  await payload.sendEmail({
    to: reg.email,
    subject: `You're registered: ${event.title}`,
    html: emailLayout(
      `You're registered, ${reg.name?.split(' ')[0] || 'friend'}`,
      `<p style="line-height:1.6">Thank you for registering for <strong>${esc(event.title)}</strong>.</p>
<p style="line-height:1.6"><strong>When:</strong> ${esc(fmtDate(event.startsAt))}<br><strong>Where:</strong> ${esc(event.venue || 'See event page')}<br><strong>Tickets:</strong> ${esc(reg.tickets || 1)}</p>
<p><a href="${url}" style="display:inline-block;background:#0F1F18;color:#F7F2E9;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Event details &amp; add to calendar</a></p>
<p style="font-size:13px;color:#4A5A52">Can no longer come? Reply to this email so we can offer your place to someone else.</p>`,
    ),
  })
}

export async function sendSubscribeConfirmation(payload: Payload, sub: { email: string; token: string }) {
  const unsub = `${SITE_URL}/api/site/unsubscribe?token=${sub.token}`
  await payload.sendEmail({
    to: sub.email,
    subject: 'Welcome to the CAHN e-bulletin',
    html: emailLayout(
      'You’re subscribed',
      `<p style="line-height:1.6">Each week you’ll get Health Hour topics, events, jobs and opportunities from CAHN.</p>
<p style="font-size:13px;color:#4A5A52">Didn’t sign up, or changed your mind? <a href="${unsub}">Unsubscribe with one click</a>.</p>`,
    ),
  })
}

export async function sendDonationReceipt(payload: Payload, d: any) {
  if (!d.email) return
  await payload.sendEmail({
    to: d.email,
    subject: 'Thank you for your gift to CAHN',
    html: emailLayout(
      'Thank you for your gift',
      `<p style="line-height:1.6">We’ve received your ${d.frequency === 'monthly' ? 'monthly ' : ''}donation of <strong>${esc(d.currency)} ${esc(Number(d.amount).toFixed(2))}</strong>.</p>
<p style="line-height:1.6">Reference: <strong>${esc(d.reference)}</strong></p>
${d.frequency === 'monthly' ? '<p style="font-size:13px;color:#4A5A52">To change or cancel your monthly gift, reply to this email or contact donations@cahn.org.uk.</p>' : ''}`,
    ),
  })
}
