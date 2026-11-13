import Link from 'next/link'
import React from 'react'
import { categoryLabel, fmtEventDate } from '@/components/Cards'
import { EventsBrowser } from '@/components/EventsBrowser'
import { mediaURL } from '@/components/Media'
import { href, isLocale, t, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

export const metadata = { title: 'Events & campaigns', description: 'Flagship awards and summits, cultural celebrations, weekly online sessions and awareness campaigns.' }

const CAT: Record<string, [string, string]> = {
  flagship: ['var(--red)', '#fff'],
  community: ['var(--green)', '#fff'],
  online: ['var(--gold)', 'var(--ink)'],
  awareness: ['var(--paper)', 'var(--ink)'],
  campaign: ['var(--ink)', 'var(--paper)'],
}

export default async function Events({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const now = new Date().toISOString()
  const all = await list('events', locale, { sort: 'startsAt', limit: 300 })
  const isUp = (e: any) => e.dateTBC || e.startsAt >= now
  const upcoming = all.filter(isUp)
  const past = all.filter((e) => !isUp(e)).reverse()
  const next = upcoming[0]
  const campaigns = all.filter((e) => e.category === 'campaign')

  return (
    <>
      <section className="wrap" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <nav aria-label="Breadcrumb" className="muted" style={{ fontSize: 14, marginBottom: 32 }}>
          <Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link> / <span style={{ color: 'var(--ink)' }}>Events &amp; campaigns</span>
        </nav>
        <div className="between" style={{ marginBottom: 32 }}>
          <h1 style={{ font: '800 clamp(52px, 7vw, 104px)/0.92 var(--font-display)', letterSpacing: '-0.04em' }}>
            Gather.<br />Celebrate.<br /><span style={{ color: 'var(--red-text)' }}>Change things.</span>
          </h1>
          <p className="lede" style={{ maxWidth: 420, fontSize: 18 }}>Flagship awards and summits, cultural celebrations, weekly online sessions and awareness campaigns across the UK.</p>
        </div>
        {next && (
          <Link href={href(locale, `/events/${next.slug}`)} className={`lift ${next.image ? '' : 'ph'}`} style={{ borderRadius: 36, minHeight: 440, padding: 40, color: 'var(--paper)', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', backgroundImage: next.image ? `linear-gradient(0deg, rgba(15,31,24,.9), rgba(15,31,24,.2)), url(${mediaURL(next.image, 'hero')})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="pill" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>Next up</span>
            <div className="between">
              <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
                <span style={{ font: '800 clamp(40px, 5vw, 72px)/0.95 var(--font-display)', letterSpacing: '-0.03em' }}>{next.title}</span>
                {next.summary && <span style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{next.summary}</span>}
                <span style={{ fontWeight: 600 }}>{[fmtEventDate(next, locale) || d.dateTBC, next.venue].filter(Boolean).join(' · ')}</span>
              </div>
              <span className="btn" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>{next.registration?.ctaLabel || d.register} →</span>
            </div>
          </Link>
        )}
      </section>

      <EventsBrowser
        labels={{ upcoming: d.upcoming, past: d.past, all: d.all }}
        events={[...upcoming, ...past].map((e) => {
          const dt = e.startsAt ? new Date(e.startsAt) : null
          return {
            id: e.id,
            title: e.title,
            url: href(locale, `/events/${e.slug}`),
            category: e.category,
            catLabel: categoryLabel(e.category),
            catBg: CAT[e.category]?.[0] || 'var(--green)',
            catFg: CAT[e.category]?.[1] || '#fff',
            day: !dt ? 'TBC' : e.dateTBC ? String(dt.getUTCFullYear()) : dt.toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Europe/London' }),
            mon: e.dateTBC || !dt ? d.dateTBC.toUpperCase() : dt.toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { month: 'short', timeZone: 'Europe/London' }).toUpperCase(),
            venue: e.venue,
            summary: e.summary,
            upcoming: isUp(e),
            image: mediaURL(e.image, 'card'),
          }
        })}
      />

      {campaigns.length > 0 && (
        <section className="wrap sec">
          <h2 className="h2" style={{ marginBottom: 28 }}>Campaigns</h2>
          <div className="grid g4" style={{ gap: 14 }}>
            {campaigns.map((c, i) => (
              <Link key={c.id} href={href(locale, `/events/${c.slug}`)} className="lift" style={{ background: i === 0 ? 'var(--red)' : '#fff', color: i === 0 ? '#fff' : 'var(--ink)', borderRadius: 22, padding: 24, textDecoration: 'none', minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span className="h3">{c.title}</span>
                <span style={{ opacity: 0.8 }}>{d.readMore} →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
