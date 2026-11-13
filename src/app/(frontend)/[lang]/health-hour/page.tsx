import React from 'react'
import { NewsletterForm } from '@/components/Forms'
import { Img, mediaURL, youtubeId } from '@/components/Media'
import { Countdown } from '@/components/Motion'
import { SessionArchive } from '@/components/SessionArchive'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

export const metadata = {
  title: 'Health Hour',
  description: 'Trusted health advice live from Black doctors, nurses and pharmacists — every Saturday at 11:00 UK time on Zoom, YouTube, Facebook and LinkedIn.',
}

export default async function HealthHour({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const now = new Date().toISOString()
  const [upcoming, past] = await Promise.all([
    list('health-hour-sessions', locale, { where: { sessionDate: { greater_than_equal: now } }, sort: 'sessionDate', limit: 1, depth: 2 }),
    list('health-hour-sessions', locale, { where: { sessionDate: { less_than: now } }, sort: '-sessionDate', limit: 60, depth: 2 }),
  ])
  const next = upcoming[0]
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })
  const sessionLd = next && {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Health Hour: ${next.topic}`,
    startDate: next.sessionDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: 'https://www.youtube.com/@cahn' },
    organizer: { '@type': 'NGO', name: 'Caribbean & African Health Network' },
    isAccessibleForFree: true,
  }

  return (
    <>
      {sessionLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sessionLd) }} />}
      <section className="ink" style={{ overflow: 'hidden' }}>
        <div className="wrap" style={{ paddingTop: 80, paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="stack" style={{ flex: '1 1 540px', gap: 26 }}>
            <span className="pill" style={{ background: 'rgba(240,179,35,.14)', color: 'var(--gold)', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E0604F', display: 'inline-block' }} /> Live every Saturday · 11:00 UK
            </span>
            <h1 style={{ font: '800 clamp(56px, 8vw, 120px)/0.9 var(--font-display)', letterSpacing: '-0.04em' }}>
              Health<br /><span style={{ color: 'var(--gold)' }}>Hour.</span>
            </h1>
            <p className="lede">Black doctors, consultants, GPs, nurses and pharmacists sharing trusted advice on prevention, management and treatment — tailored to Caribbean and African communities.</p>
            <div className="stack" style={{ gap: 12 }}>
              <span className="tag muted">Next session starts in</span>
              <Countdown target={next?.sessionDate} labels={{ days: d.days, hours: d.hours, mins: d.mins, secs: d.secs }} />
              {next && <span className="muted" style={{ fontSize: 14 }}>{next.topic} · {fmt(next.sessionDate)} · Zoom + YouTube live</span>}
            </div>
            <div className="row" style={{ gap: 12 }}>
              <a href="#register" className="btn btn-gold">Get the Zoom link →</a>
              <a href="/api/site/ics?healthHour=1" className="btn btn-line">{d.addCal}</a>
            </div>
          </div>
          <div style={{ flex: '1 1 420px', display: 'flex', justifyContent: 'center' }}>
            {next?.flyer ? (
              <Img media={next.flyer} label={next.topic} fit="contain" style={{ maxWidth: 380, width: '100%', height: 480, borderRadius: 28 }} />
            ) : (
              <Img label="Clinician speaking to camera" className="shape-arch" style={{ width: 300, height: 380 }} />
            )}
          </div>
        </div>
      </section>

      <section className="wrap" aria-label="Health Hour in numbers" style={{ paddingTop: 72, paddingBottom: 24 }}>
        <div className="grid g4" style={{ gap: 16 }}>
          {[
            ['400+', 'sessions delivered since 2020', 'var(--green)'],
            ['Sat', 'every week, 11:00 UK time', 'var(--red-text)'],
            ['4', 'ways to watch: Zoom, YouTube, Facebook, LinkedIn', 'var(--ink)'],
            ['£0', 'always free — clinicians volunteer their time', 'var(--gold)'],
          ].map(([n, l, c], i) => (
            <div key={i} className={i === 3 ? 'ink' : 'white'} style={{ borderRadius: 24, padding: 28 }}>
              <div style={{ font: '800 64px/1 var(--font-display)', color: c }}>{n}</div>
              <div className="muted" style={{ marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {next?.speakers?.length > 0 && (
        <section className="sand">
          <div className="wrap sec stack" style={{ gap: 28 }}>
            <h2 className="h2">This Saturday’s panel</h2>
            <div className="grid g4" style={{ gap: 16 }}>
              {next.speakers.map((sp: any, i: number) => (
                <div key={i} className="stack" style={{ gap: 12 }}>
                  <Img media={sp.photo} label={sp.name} className={['shape-arch', 'shape-round', 'shape-door'][i % 3]} style={{ height: 280 }} />
                  <span className="h3" style={{ fontSize: 20 }}>{sp.name}</span>
                  {sp.role && <span className="muted" style={{ fontSize: 14 }}>{sp.role}</span>}
                </div>
              ))}
              <div className="ink stack" style={{ borderRadius: 24, padding: 26, gap: 12, justifyContent: 'space-between' }}>
                <span className="h3" style={{ fontSize: 24 }}>Are you a clinician who’d like to speak?</span>
                <span className="muted" style={{ fontSize: 15 }}>Health Hour is powered by healthcare professionals who volunteer their time.</span>
                <a href="mailto:Healthhour@cahn.org.uk" style={{ color: 'var(--gold)', fontWeight: 700 }}>Healthhour@cahn.org.uk →</a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="replays" className="wrap sec">
        <div className="between" style={{ marginBottom: 28 }}>
          <h2 className="h2">Past sessions &amp; resources</h2>
          <span className="muted">Choose a topic to see replays and downloads</span>
        </div>
        <SessionArchive
          allLabel={d.all}
          sessions={past.map((s) => {
            const yt = youtubeId(s.replayUrl)
            return {
              id: s.id,
              topic: s.topic,
              category: s.category,
              date: fmt(s.sessionDate),
              replayUrl: s.replayUrl,
              thumb: yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : mediaURL(s.flyer, 'card'),
              resources: (s.resources || []).map((r: any) => ({ label: r.label, url: mediaURL(r.file) || r.url || '#' })),
            }
          })}
        />
      </section>

      <section id="register" className="wrap" style={{ paddingTop: 24, paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap' }}>
        <div className="stack" style={{ flex: '1 1 420px', gap: 16 }}>
          <h2 className="h2">Save your seat</h2>
          <p className="lede">Register once and we’ll email your Zoom link every week, plus reminders and the resources from each session.</p>
          <div className="row" style={{ gap: 10 }}>
            <a href="/api/site/ics?healthHour=1" className="btn btn-line" style={{ background: '#fff', border: 0 }}>+ Calendar (.ics)</a>
          </div>
        </div>
        <div className="panel" style={{ flex: '1 1 520px' }}>
          <NewsletterForm locale={locale} topic="health-hour" source="health-hour" labels={{ email: d.email, signUp: d.registerHH, consent: 'Email me the weekly Zoom link and session resources. I can unsubscribe at any time.', thanks: 'You’re in — check your inbox for your confirmation and Zoom link.', error: d.submitError }} />
        </div>
      </section>
    </>
  )
}
