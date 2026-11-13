import Link from 'next/link'
import React from 'react'
import { VolunteerForm } from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { mediaURL } from '@/components/Media'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

export const metadata = { title: 'Get involved — jobs, volunteering, grants & partnerships' }

export default async function Opportunities({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ employer?: string }> }) {
  const { lang } = await params
  const { employer = 'cahn' } = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const today = new Date().toISOString()
  const [jobs, grants] = await Promise.all([
    list('jobs', locale, { where: { and: [{ closesAt: { greater_than_equal: today } }, { employer: { equals: employer === 'partner' ? 'partner' : 'cahn' } }] }, sort: 'closesAt' }),
    list('grants', locale, { sort: '-opensAt', limit: 3 }),
  ])
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const tiles: [string, string, string, string, string][] = [
    ['#jobs', 'Careers & vacancies', 'briefcase', 'var(--ink)', 'var(--paper)'],
    ['#volunteer', 'Volunteering', 'heart', '#fff', 'var(--ink)'],
    ['#grants', 'Grants', 'coin', 'var(--gold)', 'var(--ink)'],
    ['#partner', 'Partnerships', 'handshake', 'var(--red)', '#fff'],
  ]
  return (
    <>
      <section className="wrap" style={{ paddingTop: 24 }}>
        <nav aria-label="Breadcrumb" className="muted" style={{ fontSize: 14 }}><Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link> / <span style={{ color: 'var(--ink)' }}>Get involved</span></nav>
      </section>
      <section className="wrap stack" style={{ paddingTop: 48, paddingBottom: 48, gap: 36 }}>
        <div className="between">
          <h1 style={{ font: '800 clamp(52px, 7vw, 104px)/0.92 var(--font-display)', letterSpacing: '-0.04em' }}>Work with us.<br /><span style={{ color: 'var(--green)' }}>Grow with us.</span></h1>
          <p className="lede" style={{ maxWidth: 420, fontSize: 18 }}>Careers, volunteering, grants for community groups and partnerships across the UK and Ghana.</p>
        </div>
        <div className="grid g4" style={{ gap: 16 }}>
          {tiles.map(([to, label, icon, bg, fg]) => (
            <a key={to} href={to} className="lift" style={{ background: bg, color: fg, borderRadius: 28, padding: 26, textDecoration: 'none', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Icon name={icon} size={34} stroke={1.8} />
              <span style={{ font: '700 24px var(--font-display)' }}>{label}</span>
            </a>
          ))}
        </div>
      </section>

      <section id="jobs" className="wrap" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <div className="between" style={{ alignItems: 'center', marginBottom: 20 }}>
          <h2 className="h2">Current vacancies</h2>
          <div className="seg" role="tablist" aria-label="Who is hiring">
            <Link href="?employer=cahn#jobs" role="tab" aria-selected={employer !== 'partner'} scroll={false} style={{ borderRadius: 999, padding: '11px 20px', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', background: employer !== 'partner' ? '#fff' : 'transparent' }}>CAHN jobs</Link>
            <Link href="?employer=partner#jobs" role="tab" aria-selected={employer === 'partner'} scroll={false} style={{ borderRadius: 999, padding: '11px 20px', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', background: employer === 'partner' ? '#fff' : 'transparent' }}>Partner jobs</Link>
          </div>
        </div>
        <div className="rows">
          {jobs.map((j) => (
            <a key={j.id} href={j.applyUrl || mediaURL(j.pack) || href(locale, '/contact')} className="rowlink">
              <span style={{ flex: '1 1 320px', font: '700 24px/1.15 var(--font-display)' }}>{j.title}</span>
              <span className="muted" style={{ flex: '0 1 200px' }}>{j.employer === 'partner' ? j.partnerName : j.location}</span>
              <span className="muted" style={{ flex: '0 1 160px' }}>{j.contract}</span>
              <span style={{ flex: '0 1 170px', fontWeight: 600, color: 'var(--red-text)' }}>Closes {fmt(j.closesAt)}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          ))}
          {!jobs.length && <p className="muted" style={{ padding: '24px 8px' }}>No open vacancies right now. New roles are announced in our weekly e-bulletin.</p>}
        </div>
      </section>

      <section id="volunteer" className="ink">
        <div className="wrap sec" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="stack" style={{ flex: '1 1 520px', gap: 18 }}>
            <span className="eyebrow">Volunteering</span>
            <h2 style={{ font: '800 clamp(36px, 4.5vw, 60px)/1 var(--font-display)', letterSpacing: '-0.03em' }}>Give an hour. Change a life.</h2>
            <p className="lede">Health education volunteers, Health Hour clinicians, event stewards and affiliate counsellors keep CAHN close to the communities we serve.</p>
          </div>
          <div style={{ flex: '1 1 440px', background: 'var(--paper)', color: 'var(--ink)', borderRadius: 28, padding: 30 }}>
            <VolunteerForm roles={['Health education', 'Health Hour (clinician)', 'Events', 'Counselling']} />
          </div>
        </div>
      </section>

      <section className="wrap sec" style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div id="grants" className="stack panel" style={{ flex: '1 1 520px', gap: 16, boxShadow: 'none' }}>
          <span className="eyebrow" style={{ color: '#8A5A00' }}>Grants</span>
          {grants.length ? (
            grants.map((g) => (
              <div key={g.id} className="stack" style={{ gap: 10 }}>
                <h2 style={{ font: '800 clamp(30px, 4vw, 44px)/1.02 var(--font-display)' }}>{g.title}</h2>
                {g.summary && <p className="muted" style={{ fontSize: 17, lineHeight: 1.6 }}>{g.summary}</p>}
                <span style={{ fontWeight: 700 }}>{g.roundStatus === 'open' ? `Open now${g.closesAt ? ` · closes ${fmt(g.closesAt)}` : ''}` : g.roundStatus === 'upcoming' ? `Opens ${g.opensAt ? fmt(g.opensAt) : 'soon'}` : 'Closed'}</span>
                <div className="row" style={{ gap: 10 }}>
                  {g.roundStatus === 'open' && g.applyUrl && <a href={g.applyUrl} className="btn btn-ink">Apply</a>}
                  {g.guidance && <a href={mediaURL(g.guidance) as string} className="btn btn-line">Guidance PDF ↓</a>}
                </div>
              </div>
            ))
          ) : (
            <p className="muted">Details of the next funding round will appear here.</p>
          )}
        </div>
        <div id="partner" className="sand stack" style={{ flex: '1 1 420px', borderRadius: 32, padding: 40, gap: 16 }}>
          <span className="eyebrow" style={{ color: 'var(--red-text)' }}>Partnerships</span>
          <h2 style={{ font: '800 clamp(30px, 4vw, 44px)/1.02 var(--font-display)' }}>Partner with CAHN</h2>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.6 }}>Commissioners, NHS trusts, universities and faith networks — co-design services, sponsor events or reach communities across the UK and Ghana.</p>
          <Link href={href(locale, '/contact?topic=partnerships')} className="btn btn-red" style={{ alignSelf: 'flex-start' }}>Start a conversation →</Link>
        </div>
      </section>
    </>
  )
}
