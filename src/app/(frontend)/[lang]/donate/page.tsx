import Link from 'next/link'
import React from 'react'
import { DonateForm, type Currency } from '@/components/DonateForm'
import { Icon } from '@/components/Icon'
import { Img } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { getPayload } from '@/lib/payload'

export const metadata = { title: 'Donate', description: 'Your gift powers CAHN’s health advocacy and support services for Black Caribbean and African communities.' }

export default async function Donate({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const payload = await getPayload()
  const ds: any = await payload.findGlobal({ slug: 'donation-settings', locale, depth: 1 })
  const currencies: Currency[] = (ds?.currencies || []).map((c: any) => ({ code: c.code, symbol: c.symbol, label: c.label, provider: c.provider, amounts: c.amounts || [], methods: c.methods || [] }))
  const impacts: string[] = (ds?.impacts || []).map((i: any) => i.text)
  return (
    <>
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="wrap" style={{ paddingTop: 14, paddingBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <nav aria-label="Breadcrumb" className="muted" style={{ fontSize: 14 }}><Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link> / <span style={{ color: 'var(--ink)' }}>Donate</span></nav>
          <span className="muted" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><Icon name="lock" size={14} /> Secure, encrypted checkout</span>
        </div>
      </div>
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="stack" style={{ flex: '1 1 500px', minWidth: 0, gap: 28 }}>
          <h1 style={{ font: '800 clamp(48px, 6vw, 88px)/0.95 var(--font-display)', letterSpacing: '-0.035em' }}>{ds?.heading || 'Your gift powers care that understands.'}</h1>
          {ds?.intro && <p className="lede">{ds.intro}</p>}
          <Img label="Counselling session (consented imagery)" className="shape-arch" style={{ height: 320, maxWidth: 560 }} />
        </div>
        <div className="panel" style={{ flex: '0 1 540px', minWidth: 0 }}>
          <DonateForm
            currencies={currencies}
            impacts={impacts}
            allowMonthly={ds?.allowMonthly !== false}
            feePercent={Number(ds?.coverFeesPercent ?? 3)}
            giftAid={Boolean(ds?.giftAid)}
            locale={locale}
            enabled={{ stripe: Boolean(process.env.STRIPE_SECRET_KEY), paystack: Boolean(process.env.PAYSTACK_SECRET_KEY) }}
          />
        </div>
      </section>
      <section className="ink">
        <div className="wrap sec grid g3">
          <div className="stack" style={{ gap: 10 }}><span className="h3">Sponsor an event</span><span className="muted">Partner on the Black Healthcare Awards, BHM Gala or Health Hour.</span><Link href={href(locale, '/contact?topic=events')} style={{ color: 'var(--gold)', fontWeight: 700 }}>Talk to us →</Link></div>
          <div className="stack" style={{ gap: 10 }}><span className="h3">Fundraise for CAHN</span><span className="muted">Run, bake or celebrate — and raise money for community health.</span><Link href={href(locale, '/contact?topic=general')} style={{ color: 'var(--gold)', fontWeight: 700 }}>Start fundraising →</Link></div>
          <div className="stack" style={{ gap: 10 }}><span className="h3">Other ways to give</span>{ds?.otherWays ? <RichText data={ds.otherWays} className="muted" /> : <span className="muted">Bank transfer, corporate matching and in-kind support.</span>}<Link href={href(locale, '/contact')} style={{ color: 'var(--gold)', fontWeight: 700 }}>See options →</Link></div>
        </div>
      </section>
    </>
  )
}
