import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { categoryLabel, fmtEventDate } from '@/components/Cards'
import { EventRegisterForm } from '@/components/Forms'
import { Img, mediaURL } from '@/components/Media'
import { Countdown } from '@/components/Motion'
import { RichText } from '@/components/RichText'
import { href, isLocale, t, type Locale } from '@/lib/i18n'
import { bySlug, getPayload } from '@/lib/payload'
import { docMeta } from '@/lib/seo'
import { SITE_URL } from '@/utilities/preview'

type P = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const doc = await bySlug('events', slug, (isLocale(lang) ? lang : 'en') as Locale)
  return doc ? docMeta(doc, `/events/${slug}`, { title: doc.title }) : {}
}

const gcal = (e: any) => {
  const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const end = e.endsAt || new Date(new Date(e.startsAt).getTime() + 2 * 36e5).toISOString()
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${f(e.startsAt)}/${f(end)}`, location: [e.venue, e.address].filter(Boolean).join(', '), details: `${SITE_URL}/en/events/${e.slug}` })
  return `https://calendar.google.com/calendar/render?${q}`
}
const outlook = (e: any) => {
  const end = e.endsAt || new Date(new Date(e.startsAt).getTime() + 2 * 36e5).toISOString()
  const q = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: e.title, startdt: e.startsAt, enddt: end, location: e.venue || '' })
  return `https://outlook.office.com/calendar/0/deeplink/compose?${q}`
}

export default async function EventPage({ params }: P) {
  const { lang, slug } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const e = await bySlug('events', slug, locale)
  if (!e) notFound()
  const upcoming = e.dateTBC || (e.startsAt && e.startsAt >= new Date().toISOString())
  const reg = e.registration || {}

  let placesLeft: number | null = null
  if (reg.mode === 'onsite' && reg.capacity) {
    const payload = await getPayload()
    const regs = await payload.find({ collection: 'event-registrations', where: { event: { equals: e.id } }, limit: 0, pagination: false, depth: 0 })
    const taken = regs.docs.reduce((n: number, r: any) => n + (r.tickets || 1), 0)
    placesLeft = Math.max(0, reg.capacity - taken)
  }

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startsAt,
    endDate: e.endsAt,
    description: e.summary,
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: e.venue, address: e.address },
    image: mediaURL(e.image, 'hero') || undefined,
    organizer: { '@type': 'NGO', name: 'Caribbean & African Health Network', url: SITE_URL },
    isAccessibleForFree: true,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className={e.image ? 'ink' : 'ph'} style={{ color: 'var(--paper)', backgroundImage: e.image ? `linear-gradient(0deg, rgba(15,31,24,.92), rgba(15,31,24,.45)), url(${mediaURL(e.image, 'hero')})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="wrap" style={{ paddingTop: 24 }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
            <Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link> / <Link href={href(locale, '/events')} style={{ color: 'inherit' }}>Events</Link> / <span aria-current="page" style={{ color: 'var(--paper)' }}>{e.title}</span>
          </nav>
        </div>
        <div className="wrap stack" style={{ paddingTop: 64, paddingBottom: 72, gap: 24 }}>
          <span className="pill" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>{categoryLabel(e.category)}</span>
          <h1 style={{ font: '800 clamp(52px, 7vw, 108px)/0.92 var(--font-display)', letterSpacing: '-0.04em' }}>{e.title}</h1>
          {e.summary && <p className="lede" style={{ color: 'var(--ink-soft)', maxWidth: 680 }}>{e.summary}</p>}
          <div className="row" style={{ gap: 24, fontWeight: 600 }}>
            <span>{fmtEventDate(e, locale) || d.dateTBC}</span>
            {e.startsAt && !e.dateTBC && <span>{new Date(e.startsAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' })}</span>}
            {e.venue && <span>{e.venue}</span>}
          </div>
          {upcoming && e.startsAt && !e.dateTBC && <Countdown target={e.startsAt} labels={{ days: d.days, hours: d.hours, mins: d.mins, secs: d.secs }} />}
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="stack" style={{ flex: '1 1 620px', gap: 48 }}>
          {e.body && <RichText data={e.body} />}
          {e.schedule?.length > 0 && (
            <div className="stack">
              <h2 style={{ font: '800 clamp(32px, 4vw, 48px)/1.02 var(--font-display)' }}>Schedule</h2>
              <div className="rows">
                {e.schedule.map((s: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 24, padding: '18px 0', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
                    <span style={{ flex: '0 0 90px', font: '800 20px var(--font-display)', color: 'var(--red-text)' }}>{s.time}</span>
                    <span style={{ flex: '1 1 300px', fontSize: 17 }}>{s.item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {e.speakers?.length > 0 && (
            <div className="stack">
              <h2 style={{ font: '800 clamp(32px, 4vw, 48px)/1.02 var(--font-display)' }}>Speakers</h2>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {e.speakers.map((sp: any, i: number) => (
                  <div key={i} className="stack" style={{ gap: 10 }}>
                    <Img media={sp.photo} label={sp.name} warm className={['shape-arch', 'shape-round', 'shape-door'][i % 3]} style={{ height: 220 }} />
                    <span style={{ font: '700 19px var(--font-display)' }}>{sp.name}</span>
                    {sp.role && <span className="muted" style={{ fontSize: 14 }}>{sp.role}</span>}
                    {sp.bio && <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{sp.bio}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="panel" style={{ flex: '0 1 460px', position: 'sticky', top: 24, minWidth: 0 }}>
          {upcoming && reg.mode === 'onsite' && (
            <div className="stack" style={{ gap: 14 }}>
              <span style={{ font: '800 28px var(--font-display)' }}>{reg.ctaLabel || d.register} — free</span>
              <EventRegisterForm eventId={e.id} locale={locale} ctaLabel={reg.ctaLabel || d.register} placesLeft={placesLeft} />
            </div>
          )}
          {upcoming && reg.mode === 'external' && reg.externalUrl && (
            <a href={reg.externalUrl} className="btn btn-ink" style={{ width: '100%' }} target="_blank" rel="noopener noreferrer">{reg.ctaLabel || d.register} →</a>
          )}
          {!upcoming && <p className="muted">This event has finished. {e.gallery ? 'See the photo gallery in our media section.' : ''}</p>}
          {e.startsAt && !e.dateTBC && upcoming && (
            <div className="stack" style={{ gap: 8, marginTop: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{d.addCal}</span>
              <div className="row" style={{ gap: 8 }}>
                <a href={gcal(e)} target="_blank" rel="noopener noreferrer" className="chip" style={{ borderColor: 'var(--line)' }}>Google</a>
                <a href={outlook(e)} target="_blank" rel="noopener noreferrer" className="chip" style={{ borderColor: 'var(--line)' }}>Outlook</a>
                <a href={`/api/site/ics?event=${e.slug}`} className="chip" style={{ borderColor: 'var(--line)' }}>Apple (.ics)</a>
              </div>
            </div>
          )}
        </aside>
      </section>
    </>
  )
}
