import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { PageHead } from '@/components/Cards'
import { Img } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { bySlug } from '@/lib/payload'
import { docMeta } from '@/lib/seo'

type P = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const doc = await bySlug('programmes', slug, (isLocale(lang) ? lang : 'en') as Locale)
  return doc ? docMeta(doc, `/programmes/${slug}`, { title: doc.title }) : {}
}

export default async function Programme({ params }: P) {
  const { lang, slug } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const p = await bySlug('programmes', slug, locale)
  if (!p) notFound()
  return (
    <>
      <PageHead locale={locale} crumbs={[{ label: 'Programmes', url: '/programmes' }, { label: p.title }]} eyebrow={p.tag} title={p.title} lede={p.summary} />
      <section className="wrap" style={{ paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="stack" style={{ flex: '1 1 620px' }}>
          {p.image && <Img media={p.image} label={p.title} className="shape-round" style={{ height: 380 }} size="hero" />}
          <RichText data={p.body} />
        </div>
        <aside className="sand stack" style={{ flex: '0 1 360px', borderRadius: 28, padding: 28, gap: 14 }}>
          <span className="h3">Get involved</span>
          <span className="muted" style={{ lineHeight: 1.55 }}>Want to take part, partner with us or bring this programme to your community?</span>
          <Link href={href(locale, '/contact?topic=partnerships')} className="btn btn-green">Contact the team</Link>
        </aside>
      </section>
    </>
  )
}
