import Link from 'next/link'
import React from 'react'
import { Icon } from '@/components/Icon'
import { mediaURL, youtubeId } from '@/components/Media'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { getSettings, list } from '@/lib/payload'

export const metadata = { title: 'Media — press, video & galleries' }

const TABS: [string, string][] = [
  ['press', 'Press releases'],
  ['video', 'Video library'],
  ['gallery', 'Gallery'],
  ['updates', 'Updates'],
]
const KIND: Record<string, string> = { press: 'Press release', statement: 'Statement', bulletin: 'E-bulletin', 'case-study': 'Case study', testimonial: 'Testimonial', update: 'Update' }

export default async function MediaPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { lang } = await params
  const { tab = 'press' } = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const s = await getSettings(locale)
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  let content: React.ReactNode = null
  if (tab === 'video') {
    const videos = await list('videos', locale, { sort: '_order' })
    content = (
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: 20 }}>
        {videos.map((v) => {
          const id = youtubeId(v.youtubeUrl)
          const thumb = mediaURL(v.thumbnail, 'card') || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null)
          return (
            <a key={v.id} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="stack lift" style={{ gap: 12, textDecoration: 'none', color: 'var(--ink)' }}>
              <div className={thumb ? '' : 'ph'} style={{ aspectRatio: '16/9', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundImage: thumb ? `url(${thumb})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={22} /></span>
                {v.duration && <span style={{ position: 'absolute', right: 14, bottom: 14, padding: '4px 10px', borderRadius: 8, background: 'rgba(15,31,24,.8)', color: 'var(--paper)', fontSize: 12, fontWeight: 600 }}>{v.duration}</span>}
              </div>
              {v.series && <span className="tag" style={{ color: 'var(--green)' }}>{v.series}</span>}
              <span className="h3">{v.title}</span>
            </a>
          )
        })}
        {!videos.length && <p className="muted">Videos will appear here.</p>}
      </div>
    )
  } else if (tab === 'gallery') {
    const albums = await list('albums', locale, { sort: '_order' })
    content = (
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gridAutoRows: 220, gap: 14 }}>
        {albums.map((a, i) => {
          const cover = mediaURL(a.cover, 'card') || mediaURL(a.photos?.[0], 'card')
          return (
            <div key={a.id} className={cover ? '' : 'ph'} style={{ gridRow: i % 3 === 0 ? 'span 2' : undefined, borderRadius: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 18, color: 'var(--paper)', backgroundImage: cover ? `linear-gradient(0deg, rgba(15,31,24,.85), transparent 60%), url(${cover})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <span style={{ font: '700 20px var(--font-display)' }}>{a.name}</span>
              <span style={{ fontSize: 13, opacity: 0.85 }}>{(a.photos || []).length} photos</span>
            </div>
          )
        })}
        {!albums.length && <p className="muted">Photo albums will appear here.</p>}
      </div>
    )
  } else {
    const kinds = tab === 'updates' ? ['bulletin', 'case-study', 'testimonial', 'update'] : ['press', 'statement']
    const posts = await list('posts', locale, { where: { kind: { in: kinds } }, sort: '-publishedAt', limit: 40 })
    const [lead, ...rest] = posts
    content = posts.length ? (
      tab === 'updates' ? (
        <div className="rows">
          {posts.map((p) => (
            <div key={p.id} id={p.slug} style={{ display: 'flex', gap: 24, alignItems: 'baseline', padding: '24px 8px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
              <span className="muted" style={{ flex: '0 0 140px', fontSize: 14 }}>{fmt(p.publishedAt)}</span>
              <span className="tag" style={{ flex: '0 0 140px', color: '#8A5A00' }}>{KIND[p.kind]}</span>
              <span style={{ flex: '1 1 400px', font: '700 22px/1.2 var(--font-display)' }}>{p.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 20 }}>
          <article id={lead.slug} className={lead.image ? '' : 'ph'} style={{ gridRow: 'span 3', borderRadius: 32, minHeight: 520, padding: 36, color: 'var(--paper)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 12, backgroundImage: lead.image ? `linear-gradient(0deg, rgba(15,31,24,.9), transparent 60%), url(${mediaURL(lead.image, 'hero')})` : undefined, backgroundSize: 'cover' }}>
            <span className="tag" style={{ color: 'var(--gold)' }}>{KIND[lead.kind]} · {fmt(lead.publishedAt)}</span>
            <span style={{ font: '800 40px/1.05 var(--font-display)' }}>{lead.title}</span>
            {lead.excerpt && <span style={{ color: 'var(--ink-soft)' }}>{lead.excerpt}</span>}
          </article>
          {rest.slice(0, 6).map((p) => (
            <article key={p.id} id={p.slug} className="white stack" style={{ borderRadius: 24, padding: 24, gap: 8 }}>
              <span className="tag" style={{ color: 'var(--red-text)' }}>{KIND[p.kind]} · {fmt(p.publishedAt)}</span>
              <span style={{ font: '700 22px/1.2 var(--font-display)' }}>{p.title}</span>
            </article>
          ))}
        </div>
      )
    ) : (
      <p className="muted">Nothing published here yet.</p>
    )
  }

  return (
    <>
      <section className="wrap" style={{ paddingTop: 24 }}>
        <nav aria-label="Breadcrumb" className="muted" style={{ fontSize: 14 }}><Link href={href(locale, '/')} style={{ color: 'inherit' }}>Home</Link> / <span style={{ color: 'var(--ink)' }}>Media</span></nav>
      </section>
      <section className="wrap between" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <h1 style={{ font: '800 clamp(52px, 7vw, 104px)/0.92 var(--font-display)', letterSpacing: '-0.04em' }}>Newsroom.</h1>
        <div className="seg" role="tablist" aria-label="Media type">
          {TABS.map(([k, l]) => (
            <Link key={k} href={`?tab=${k}`} role="tab" aria-selected={tab === k} scroll={false} style={{ borderRadius: 999, padding: '11px 20px', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', background: tab === k ? '#fff' : 'transparent' }}>{l}</Link>
          ))}
        </div>
      </section>
      <section className="wrap" style={{ paddingTop: 16, paddingBottom: 88 }}>{content}</section>
      <section className="ink">
        <div className="wrap sec-sm between" style={{ alignItems: 'center' }}>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ font: '800 32px var(--font-display)' }}>Press enquiries</span>
            <span className="muted">Interviews, comment and media kit: logos (including the CAHN panda), brand colours and approved photography.</span>
          </div>
          <a href={`mailto:${s?.email || 'info@cahn.org.uk'}?subject=Press%20enquiry`} className="btn btn-gold">Contact the press office</a>
        </div>
      </section>
    </>
  )
}
