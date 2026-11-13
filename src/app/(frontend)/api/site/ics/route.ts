import { getPayload } from '@/lib/payload'
import { SITE_URL } from '@/utilities/preview'

const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** Calendar file for an event (?event=slug) or the weekly Health Hour (?healthHour=1). */
export async function GET(req: Request) {
  const url = new URL(req.url)
  let lines: string[]
  if (url.searchParams.get('healthHour')) {
    lines = [
      'BEGIN:VEVENT',
      'UID:health-hour-weekly@cahn.org.uk',
      `DTSTAMP:${stamp(new Date())}`,
      'DTSTART;TZID=Europe/London:20200104T110000',
      'DTEND;TZID=Europe/London:20200104T120000',
      'RRULE:FREQ=WEEKLY;BYDAY=SA',
      'SUMMARY:CAHN Health Hour (live)',
      `DESCRIPTION:${esc(`Trusted health advice live from Black clinicians. Register for the Zoom link: ${SITE_URL}/en/health-hour#register`)}`,
      `URL:${SITE_URL}/en/health-hour`,
      'END:VEVENT',
    ]
  } else {
    const slug = (url.searchParams.get('event') || '').slice(0, 120)
    const payload = await getPayload()
    const r = await payload.find({ collection: 'events', where: { slug: { equals: slug } }, limit: 1, overrideAccess: false })
    const e: any = r.docs[0]
    if (!e?.startsAt) return new Response('Not found', { status: 404 })
    const start = new Date(e.startsAt)
    const end = e.endsAt ? new Date(e.endsAt) : new Date(start.getTime() + 2 * 36e5)
    lines = [
      'BEGIN:VEVENT',
      `UID:event-${e.id}@cahn.org.uk`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${esc(e.title)}`,
      `LOCATION:${esc([e.venue, e.address].filter(Boolean).join(', '))}`,
      `DESCRIPTION:${esc(`${e.summary || ''}\n${SITE_URL}/en/events/${e.slug}`)}`,
      `URL:${SITE_URL}/en/events/${e.slug}`,
      'END:VEVENT',
    ]
  }
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CAHN//Website//EN', 'CALSCALE:GREGORIAN', ...lines, 'END:VCALENDAR'].join('\r\n')
  return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="cahn-event.ics"' } })
}
