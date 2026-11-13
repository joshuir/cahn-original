import Link from 'next/link'
import React from 'react'
import { Img } from './Media'
import { href, type Dict, type Locale } from '@/lib/i18n'

const CAT: Record<string, [string, string, string]> = {
  flagship: ['Flagship', 'var(--red)', '#fff'],
  community: ['Community', 'var(--green)', '#fff'],
  online: ['Online weekly', 'var(--gold)', 'var(--ink)'],
  awareness: ['Awareness', 'var(--paper)', 'var(--ink)'],
  campaign: ['Campaign', 'var(--ink)', 'var(--paper)'],
}
export const categoryLabel = (c: string) => CAT[c]?.[0] || c

export function DateBox({ iso, tbc, d, locale }: { iso?: string; tbc?: boolean; d: Dict; locale: Locale }) {
  if (tbc || !iso) return <div className="datebox"><b>{iso ? new Date(iso).getUTCFullYear() : 'TBC'}</b><small>{iso ? 'DATE TBC' : ''}</small></div>
  const dt = new Date(iso)
  return (
    <div className="datebox">
      <b>{dt.toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Europe/London' })}</b>
      <small>{dt.toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { month: 'short', timeZone: 'Europe/London' }).toUpperCase()}</small>
    </div>
  )
}

export const fmtEventDate = (e: any, locale: Locale) =>
  e.dateTBC || !e.startsAt
    ? ''
    : new Date(e.startsAt).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })

export function EventCard({ e, locale, d }: { e: any; locale: Locale; d: Dict }) {
  const [label, bg, fg] = CAT[e.category] || CAT.community
  return (
    <Link href={href(locale, `/events/${e.slug}`)} className="card lift reveal">
      <div style={{ position: 'relative', height: 180 }}>
        <Img media={e.image} label={e.title} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <DateBox iso={e.startsAt} tbc={e.dateTBC} d={d} locale={locale} />
          <span className="pill" style={{ background: bg, color: fg }}>{label}</span>
        </div>
      </div>
      <div className="card-body" style={{ flex: 1 }}>
        <h3 className="h3">{e.title}</h3>
        {e.venue && <span className="muted" style={{ fontSize: 14 }}>{e.venue}</span>}
        {e.summary && <p className="muted" style={{ fontSize: 15, lineHeight: 1.55 }}>{e.summary}</p>}
      </div>
    </Link>
  )
}

/** Shared subpage header: wordmark breadcrumb + display heading. */
export function PageHead({ locale, crumbs, eyebrow, title, lede, dark, children }: { locale: Locale; crumbs: { label: string; url?: string }[]; eyebrow?: string; title: React.ReactNode; lede?: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <section className={dark ? 'ink' : ''}>
      <div className="wrap" style={{ paddingTop: 20 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 14 }} className="muted">
          <Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link>
          {crumbs.map((c, i) => (
            <span key={i}>
              {' / '}
              {c.url ? <Link href={href(locale, c.url)} style={{ color: 'inherit' }}>{c.label}</Link> : <span aria-current="page" style={{ color: dark ? 'var(--paper)' : 'var(--ink)' }}>{c.label}</span>}
            </span>
          ))}
        </nav>
      </div>
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 56, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="stack" style={{ flex: '1 1 620px', gap: 22 }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="display">{title}</h1>
          {lede && <p className="lede">{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
