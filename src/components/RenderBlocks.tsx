import Link from 'next/link'
import React from 'react'
import { Img, mediaURL, youtubeId } from './Media'
import { PeopleGrid } from './PeopleGrid'
import { RichText } from './RichText'
import { CeoFilm } from './home/CeoFilm'
import { href, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

const toneClass = (t?: string) => (t === 'ink' ? 'ink' : t === 'sand' ? 'sand' : t === 'gold' ? 'gold-bg' : '')
const dotColour = ['var(--red)', 'var(--gold)', 'var(--green)']
const yearColour: Record<string, string> = { red: 'var(--red-text)', gold: '#8A5A00', green: 'var(--green)' }
const shape = (s?: string) => (s === 'door' ? 'shape-door' : s === 'rounded' ? 'shape-round' : 'shape-arch')

/**
 * Renders page-builder blocks. The About page and its subpages are built from
 * these blocks and reproduce the approved About design exactly.
 */
export async function RenderBlocks({ blocks, locale }: { blocks: any[]; locale: Locale }) {
  if (!blocks?.length) return null
  const out: React.ReactNode[] = []
  for (const [i, b] of blocks.entries()) {
    const key = b.id || i
    switch (b.blockType) {
      case 'pageHeader':
        out.push(
          <section key={key} className="wrap" style={{ paddingTop: 72, paddingBottom: 56, display: 'flex', gap: 56, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 600px', gap: 24 }}>
              {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
              <h1 className="display">{b.heading}</h1>
              {b.lede && <p className="lede" style={{ fontSize: 20 }}>{b.lede}</p>}
            </div>
            <Img media={b.image} label={b.heading} className={shape(b.imageShape)} style={{ flex: '1 1 400px', height: 480 }} size="hero" priority />
          </section>,
        )
        break
      case 'timeline':
        out.push(
          <section key={key} aria-label="Timeline" className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', borderTop: '2px solid var(--ink)', paddingTop: 28 }}>
              {(b.items || []).map((it: any, n: number) => (
                <div key={n} className="stack reveal" style={{ gap: 10 }}>
                  <span style={{ font: '800 44px/1 var(--font-display)', color: yearColour[it.colour] || 'var(--red-text)' }}>{it.year}</span>
                  <span className="muted" style={{ lineHeight: 1.55 }}>{it.text}</span>
                </div>
              ))}
            </div>
          </section>,
        )
        break
      case 'columns':
        out.push(
          <section key={key} className={toneClass(b.tone)}>
            <div className="wrap sec grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {(b.columns || []).map((c: any, n: number) => (
                <div key={n} className="stack reveal" style={{ gap: 14, padding: 28, borderRadius: 28, background: b.tone === 'ink' ? 'var(--ink-2)' : '#fff' }}>
                  {c.label && <span className="eyebrow">{c.label}</span>}
                  <span style={{ font: `700 ${n === 0 ? 28 : 22}px/1.25 var(--font-display)` }}>{c.text}</span>
                </div>
              ))}
            </div>
          </section>,
        )
        break
      case 'dotGrid':
        out.push(
          <section key={key} className="wrap sec" style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            <div className="stack" style={{ flex: '1 1 380px', gap: 16 }}>
              {b.heading && <h2 className="h2">{b.heading}</h2>}
              {b.intro && <p className="muted" style={{ fontSize: 17, lineHeight: 1.6 }}>{b.intro}</p>}
            </div>
            <div className="grid" style={{ flex: '2 1 620px', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {(b.items || []).map((it: any, n: number) => (
                <div key={n} className="reveal" style={{ background: '#fff', borderRadius: 22, padding: 22, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: dotColour[n % 3] }} />
                  <span style={{ font: '700 20px var(--font-display)' }}>{it.label}</span>
                </div>
              ))}
            </div>
          </section>,
        )
        break
      case 'numberedCards':
        out.push(
          <section key={key} className={toneClass(b.tone || 'sand')}>
            <div className="wrap sec stack" style={{ gap: 28 }}>
              {b.heading && <h2 className="h2">{b.heading}</h2>}
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {(b.cards || []).map((c: any, n: number) => (
                  <div key={n} className="stack reveal" style={{ background: '#fff', color: 'var(--ink)', borderRadius: 24, padding: 26, gap: 10 }}>
                    <span style={{ font: '800 34px var(--font-display)', color: 'var(--green)' }}>{n + 1}</span>
                    <span style={{ font: '700 20px var(--font-display)' }}>{c.title}</span>
                    {c.text && <span className="muted" style={{ lineHeight: 1.55, fontSize: 15 }}>{c.text}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>,
        )
        break
      case 'people': {
        const people = await list('people', locale, { sort: '_order', where: b.teams?.length ? { team: { in: b.teams } } : undefined, limit: 200 })
        out.push(
          <section key={key} id="people" className="wrap sec stack" style={{ gap: 28 }}>
            <div className="between">
              <h2 className="h2">{b.heading}</h2>
            </div>
            <PeopleGrid
              teams={b.teams}
              people={people.map((p) => ({ id: p.id, name: p.name, role: p.role, team: p.team, photo: mediaURL(p.photo, 'card'), alt: p.photo?.alt }))}
            />
          </section>,
        )
        break
      }
      case 'split':
        out.push(
          <section key={key} className={toneClass(b.tone)}>
            <div className="wrap sec" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center', flexDirection: b.imageSide === 'right' ? 'row-reverse' : 'row' }}>
              <Img media={b.image} label={b.heading} className="shape-arch" style={{ flex: '1 1 460px', height: 420 }} />
              <div className="stack" style={{ flex: '1 1 480px', gap: 18 }}>
                {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
                <h2 style={{ font: '800 clamp(36px, 4.5vw, 60px)/1 var(--font-display)', letterSpacing: '-0.03em' }}>{b.heading}</h2>
                {b.text && <p className="lede">{b.text}</p>}
                <div className="row" style={{ gap: 12 }}>
                  {(b.links || []).map((l: any, n: number) => (
                    <Link key={n} href={href(locale, l.link?.url)} className={n === 0 ? 'btn btn-gold' : 'btn btn-line'}>{l.link?.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </section>,
        )
        break
      case 'richText':
        out.push(
          <section key={key} className="wrap" style={{ paddingTop: 48, paddingBottom: 48 }}>
            {b.heading && <h2 className="h2" style={{ marginBottom: 20 }}>{b.heading}</h2>}
            <RichText data={b.content} />
          </section>,
        )
        break
      case 'cta':
        out.push(
          <section key={key} className={toneClass(b.tone || 'sand')}>
            <div className="wrap sec-sm between" style={{ alignItems: 'center' }}>
              <div className="stack" style={{ gap: 12, flex: '1 1 520px' }}>
                <h2 style={{ font: '800 clamp(30px, 3.5vw, 44px)/1.05 var(--font-display)' }}>{b.heading}</h2>
                {b.text && <p className="muted" style={{ fontSize: 17, lineHeight: 1.6 }}>{b.text}</p>}
              </div>
              {b.link?.url && <Link href={href(locale, b.link.url)} className="btn btn-green">{b.link.label} →</Link>}
            </div>
          </section>,
        )
        break
      case 'faq':
        out.push(
          <section key={key} className="wrap sec stack" style={{ gap: 20 }}>
            <h2 className="h2">{b.heading}</h2>
            <div className="rows">
              {(b.items || []).map((q: any, n: number) => (
                <details key={n} style={{ borderBottom: '1px solid var(--line)', padding: '20px 8px' }}>
                  <summary style={{ cursor: 'pointer', font: '700 20px var(--font-display)' }}>{q.question}</summary>
                  <p className="muted" style={{ marginTop: 12, lineHeight: 1.6 }}>{q.answer}</p>
                </details>
              ))}
            </div>
          </section>,
        )
        break
      case 'video':
        out.push(
          <section key={key} className="wrap sec stack" style={{ gap: 24 }}>
            {b.heading && <h2 className="h2">{b.heading}</h2>}
            <CeoFilm youtubeId={youtubeId(b.youtubeUrl)} file={mediaURL(b.file)} poster={mediaURL(b.poster, 'hero')} title={b.heading || 'Video'} label="Play video" />
          </section>,
        )
        break
      case 'partners': {
        const where = b.group && b.group !== 'all' ? { group: { equals: b.group } } : undefined
        const partners = await list('partners', locale, { sort: '_order', where })
        out.push(
          <section key={key} id="partners" className="wrap sec stack" style={{ gap: 24 }}>
            <h2 className="h2">{b.heading}</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {partners.map((p) => {
                const logo = mediaURL(p.logo, 'thumb')
                const inner = logo ? <img src={logo} alt={p.name} loading="lazy" /> : p.name
                return p.url ? (
                  <a key={p.id} href={p.url} className="logo-tile" style={{ width: 'auto' }} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <span key={p.id} className="logo-tile" style={{ width: 'auto' }}>{inner}</span>
                )
              })}
            </div>
          </section>,
        )
        break
      }
    }
  }
  return <>{out}</>
}
