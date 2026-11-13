import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { PageHead } from '@/components/Cards'
import { Img, mediaURL } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { bySlug } from '@/lib/payload'
import { docMeta } from '@/lib/seo'

type P = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const doc = await bySlug('services', slug, (isLocale(lang) ? lang : 'en') as Locale)
  return doc ? docMeta(doc, `/services/${slug}`, { title: doc.title }) : {}
}

export default async function Service({ params }: P) {
  const { lang, slug } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const s = await bySlug('services', slug, locale)
  if (!s) notFound()
  const flyer = mediaURL(s.flyer)
  return (
    <>
      {s.sensitive && <a href="https://www.bbc.co.uk/weather" className="quick-exit" rel="noreferrer">Leave this site quickly ✕</a>}
      <PageHead locale={locale} crumbs={[{ label: 'Services', url: '/services' }, { label: s.title }]} eyebrow="Service · free & confidential" title={s.title} lede={s.summary} />
      <section className="wrap" style={{ paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 620px' }} className="stack">
          {s.image && <Img media={s.image} label={s.title} className="shape-round" style={{ height: 380 }} size="hero" />}
          <RichText data={s.body} />
        </div>
        <aside className="ink stack" style={{ flex: '0 1 380px', borderRadius: 28, padding: 28, gap: 14, position: 'sticky', top: 24 }}>
          <span className="h3">Get support</span>
          <span className="muted" style={{ lineHeight: 1.55 }}>Refer yourself or someone you support. It’s free and confidential.</span>
          <Link href={href(locale, '/contact?topic=support')} className="btn btn-gold">Make a referral</Link>
          {flyer && <a href={flyer} className="btn btn-line">Download service flyer</a>}
          <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>In immediate danger? Call 999.</span>
        </aside>
      </section>
    </>
  )
}
