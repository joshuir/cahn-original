import Link from 'next/link'
import React from 'react'
import { PageHead } from '@/components/Cards'
import { Img } from '@/components/Media'
import { ProgrammeGrid } from '@/components/ProgrammeGrid'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

export const metadata = { title: 'Programmes & initiatives', description: 'Long-term programmes improving Black health outcomes across the six health priorities.' }

export default async function Programmes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const items = await list('programmes', locale, { sort: 'sortOrder' })
  const featured = items.find((p) => p.featured) || items[0]
  return (
    <>
      <PageHead locale={locale} crumbs={[{ label: 'Programmes & initiatives' }]} eyebrow="Programmes & initiatives" title={<>Long-term work on the <span style={{ color: 'var(--green)' }}>six health priorities.</span></>} lede="Programmes that train communities and clinicians, grow Black donor registers, build leaders and turn research into better care.">
        <div className="grid" style={{ flex: '1 1 320px', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="ink" style={{ borderRadius: 22, padding: 22 }}><div style={{ font: '800 44px/1 var(--font-display)', color: 'var(--gold)' }}>{items.length}</div><div className="muted" style={{ fontSize: 14, marginTop: 6 }}>active programmes</div></div>
          <div className="white" style={{ borderRadius: 22, padding: 22 }}><div style={{ font: '800 44px/1 var(--font-display)' }}>6</div><div className="muted" style={{ fontSize: 14, marginTop: 6 }}>health priorities</div></div>
        </div>
      </PageHead>
      <ProgrammeGrid items={items.map((p) => ({ id: p.id, title: p.title, tag: p.tag, theme: p.theme, summary: p.summary, hoverText: p.hoverText, url: href(locale, `/programmes/${p.slug}`) }))} />
      {featured && (
        <section className="ink">
          <div className="wrap sec" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
            <Img media={featured.image} label={featured.title} className="shape-arch" style={{ flex: '1 1 460px', height: 420 }} />
            <div className="stack" style={{ flex: '1 1 480px', gap: 18 }}>
              <span className="eyebrow">Spotlight programme</span>
              <h2 style={{ font: '800 clamp(36px, 4.5vw, 60px)/1 var(--font-display)', letterSpacing: '-0.03em' }}>{featured.title}</h2>
              <p className="lede">{featured.summary}</p>
              <div className="row" style={{ gap: 12 }}>
                <Link href={href(locale, `/programmes/${featured.slug}`)} className="btn btn-gold">Find out more →</Link>
                <Link href={href(locale, '/research')} className="btn btn-line">Evaluation reports</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
