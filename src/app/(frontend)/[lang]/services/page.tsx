import Link from 'next/link'
import React from 'react'
import { PageHead } from '@/components/Cards'
import { Img } from '@/components/Media'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { getSettings, list } from '@/lib/payload'

export const metadata = { title: 'Services', description: 'Free, confidential and culturally aware support for individuals and families.' }

const NEEDS: [string, string][] = [
  ['unsafe', 'Feeling unsafe at home'],
  ['housing', 'Housing, benefits or work'],
  ['legal', 'Immigration or legal issues'],
  ['wellbeing', 'My mental wellbeing'],
  ['family', 'Parenting & family'],
  ['hospital', 'Leaving hospital'],
  ['exploitation', 'Exploitation or trafficking'],
  ['windrush', 'Windrush compensation'],
]

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const [services, programmes, s] = await Promise.all([
    list('services', locale, { sort: 'sortOrder' }),
    list('programmes', locale, { sort: 'sortOrder', limit: 7 }),
    getSettings(locale),
  ])
  const firstFor = (need: string) => services.find((x) => (x.needs || []).includes(need))
  const tel = s?.helpline ? `tel:+44${String(s.helpline).replace(/\D/g, '').replace(/^0/, '')}` : undefined
  return (
    <>
      <a href="https://www.bbc.co.uk/weather" className="quick-exit" rel="noreferrer">Leave this site quickly ✕</a>
      <PageHead locale={locale} crumbs={[{ label: 'Services' }]} eyebrow="Services · free & confidential" title="Support that understands where you’re from." lede="Practical help for individuals and families — from culturally aware counselling to advocacy with housing, welfare, legal and immigration systems.">
        <div className="ink stack" style={{ flex: '1 1 360px', borderRadius: 28, padding: 28, gap: 12 }}>
          <span className="h3">Not sure where to start?</span>
          <span className="muted" style={{ lineHeight: 1.55 }}>Tell us a little about what’s happening and our team will connect you to the right service.</span>
          <div className="row" style={{ gap: 10 }}>
            <Link href={href(locale, '/contact?topic=support')} className="btn btn-gold">Self-referral</Link>
            {tel && <a href={tel} className="btn btn-line">Call {s.helpline}</a>}
          </div>
        </div>
      </PageHead>

      <section className="wrap" aria-label="Find help by need" style={{ paddingBottom: 56 }}>
        <span style={{ display: 'block', fontWeight: 700, marginBottom: 14 }}>I need help with…</span>
        <div className="row" style={{ gap: 10 }}>
          {NEEDS.map(([k, l]) => {
            const svc = firstFor(k)
            return (
              <Link key={k} href={svc ? href(locale, `/services/${svc.slug}`) : '#all'} className="chip" style={{ background: '#fff', borderColor: 'var(--line)' }}>
                {l}
              </Link>
            )
          })}
        </div>
      </section>

      <section id="all" className="wrap" style={{ paddingBottom: 72 }}>
        <div className="rows">
          {services.map((x, i) => (
            <Link key={x.id} href={href(locale, `/services/${x.slug}`)} className="rowlink">
              <span style={{ flex: '0 0 56px', font: '800 28px var(--font-display)', color: 'var(--red-text)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ flex: '1 1 280px', font: '700 26px/1.15 var(--font-display)' }}>{x.title}</span>
              <span className="muted" style={{ flex: '2 1 360px', lineHeight: 1.55 }}>{x.summary}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {programmes.length > 0 && (
        <section className="sand">
          <div className="wrap sec stack" style={{ gap: 28 }}>
            <div className="between">
              <h2 className="h2">Programmes &amp; initiatives</h2>
              <Link href={href(locale, '/programmes')} style={{ fontWeight: 600 }}>All programmes →</Link>
            </div>
            <div className="grid g4" style={{ gap: 16 }}>
              {programmes.map((p, i) => (
                <Link key={p.id} href={href(locale, `/programmes/${p.slug}`)} className="lift stack" style={{ background: i === 0 ? 'var(--ink)' : '#fff', color: i === 0 ? 'var(--paper)' : 'var(--ink)', borderRadius: 24, padding: 26, textDecoration: 'none', gap: 10, minHeight: 190 }}>
                  <span className="tag" style={{ color: i === 0 ? 'var(--gold)' : 'var(--green)' }}>{p.tag}</span>
                  <span className="h3">{p.title}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{p.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap sec" style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center' }}>
        <Img label="Transformation Community Resource Centre" warm className="shape-door" style={{ flex: '1 1 420px', height: 360 }} />
        <div className="stack" style={{ flex: '1 1 480px', gap: 16 }}>
          <h2 className="h2">Make a referral</h2>
          <p className="lede">Refer yourself, a family member or a client. Messages go straight to the services team.</p>
          <div className="row" style={{ gap: 10 }}>
            <Link href={href(locale, '/contact?topic=support')} className="btn btn-green">Start referral →</Link>
          </div>
          <span className="muted" style={{ fontSize: 14 }}>In immediate danger? Call 999.</span>
        </div>
      </section>
    </>
  )
}
