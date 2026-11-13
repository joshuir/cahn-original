import Link from 'next/link'
import React from 'react'
import { PageHead } from '@/components/Cards'
import { Icon } from '@/components/Icon'
import { mediaURL } from '@/components/Media'
import { highlight, snippet } from '@/lib/highlight'
import { href, isLocale, t, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'

export const metadata = { title: 'Research & publications', description: 'Reports, research papers, policy statements and resources from CAHN — free to download.' }

const TYPES: [string, string, string][] = [
  ['all', 'All', ''],
  ['report', 'Reports', 'var(--red-text)'],
  ['research', 'Research', 'var(--green)'],
  ['policy', 'Policy statements', '#8A5A00'],
  ['resource', 'Resources', '#3E4F47'],
]
const COVERS = [['var(--ink)', 'var(--paper)'], ['var(--gold)', 'var(--ink)'], ['var(--green)', '#fff'], ['var(--red)', '#fff']]

export default async function Research({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string; type?: string }> }) {
  const { lang } = await params
  const { q = '', type = 'all' } = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const query = q.trim().slice(0, 80)
  const all = await list('publications', locale, { sort: '-year', limit: 300, depth: 1 })

  const docs = all
    .filter((p) => type === 'all' || p.type === type)
    .map((p) => {
      if (!query) return { p, note: [p.year, 'PDF'].filter(Boolean).join(' · ') }
      const ql = query.toLowerCase()
      if (p.title.toLowerCase().includes(ql)) return { p, note: 'Matched in title' }
      const kw = (p.searchKeywords || []).find((k: string) => k.toLowerCase().includes(ql) || ql.includes(k.toLowerCase()))
      if (kw) return { p, note: `Also known as “${kw}”` }
      if (p.summary?.toLowerCase().includes(ql)) return { p, note: snippet(p.summary, query) }
      const inside = p.file?.documentText ? snippet(p.file.documentText, query) : null
      if (inside) return { p, note: `Inside the PDF: ${inside}` }
      return null
    })
    .filter(Boolean) as { p: any; note: string }[]

  const qs = (o: Record<string, string>) => {
    const u = new URLSearchParams({ ...(query ? { q: query } : {}), ...(type !== 'all' ? { type } : {}), ...o })
    for (const [k, v] of Array.from(u.entries())) if (!v || v === 'all') u.delete(k)
    const s = u.toString()
    return s ? `?${s}` : ''
  }

  return (
    <>
      <PageHead dark locale={locale} crumbs={[{ label: 'Research & publications' }]} eyebrow="Research & publications" title="Evidence that carries community voices." lede="Reports, research papers, policy statements and resources — free to download and share.">
        <form role="search" method="get" style={{ flex: '1 1 420px' }} className="stack">
          {type !== 'all' && <input type="hidden" name="type" value={type} />}
          <label htmlFor="doc-q" style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-soft)' }}>Search publications, including inside PDFs</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--paper)', borderRadius: 999, padding: '0 8px 0 20px' }}>
            <Icon name="search" color="var(--muted)" />
            <input id="doc-q" name="q" type="search" defaultValue={query} placeholder="e.g. fibroids, manifesto, vaccines" style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', padding: '16px 0', font: '500 16px var(--font-body)', color: 'var(--ink)', minWidth: 0 }} />
            <button type="submit" className="btn btn-ink" style={{ minHeight: 40, padding: '8px 16px' }}>{d.search}</button>
          </div>
        </form>
      </PageHead>

      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {TYPES.map(([k, l]) => (
          <Link key={k} href={qs({ type: k })} className={`chip${type === k ? ' on' : ''}`} aria-current={type === k ? 'true' : undefined} scroll={false}>{l}</Link>
        ))}
        <span className="muted" style={{ marginLeft: 'auto', fontSize: 14 }}>{docs.length} publication{docs.length === 1 ? '' : 's'}</span>
      </section>

      <section className="wrap" style={{ paddingTop: 16, paddingBottom: 88 }}>
        {docs.length ? (
          <div className="grid g3" style={{ gap: 18 }}>
            {docs.map(({ p, note }, i) => {
              const [cb, cf] = COVERS[i % 4]
              const file = mediaURL(p.file)
              const tc = TYPES.find(([k]) => k === p.type)
              return (
                <article key={p.id} className="lift" style={{ background: '#fff', borderRadius: 26, padding: 22, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  {p.cover ? (
                    <img src={mediaURL(p.cover, 'thumb') as string} alt="" style={{ flex: '0 0 88px', width: 88, height: 118, objectFit: 'cover', borderRadius: 10 }} />
                  ) : (
                    <div aria-hidden="true" style={{ flex: '0 0 88px', height: 118, borderRadius: 10, background: cb, color: cf, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', font: '800 11px/1.1 var(--font-display)', boxShadow: '0 8px 18px rgba(15,31,24,.18)' }}>
                      <span>CAHN</span>
                      <span className="triband" style={{ height: 3 }}><span /><span /><span /></span>
                    </div>
                  )}
                  <div className="stack" style={{ gap: 8, minWidth: 0 }}>
                    <span className="tag" style={{ color: tc?.[2] }}>{tc?.[1]}</span>
                    <h3 style={{ font: '700 20px/1.2 var(--font-display)' }}>{highlight(p.title, query)}</h3>
                    <span className="muted" style={{ fontSize: 13 }}>{note}</span>
                    <div className="row" style={{ gap: 8, marginTop: 6 }}>
                      {file && <a href={file} className="btn btn-ink" style={{ minHeight: 40, padding: '10px 14px', fontSize: 13 }} download>{d.download} ↓</a>}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="panel stack" style={{ gap: 10 }}>
            <span className="h3">{d.noResults}{query ? ` for “${query}”` : ''}</span>
            <span className="muted">Try a broader word, or browse all reports. Can’t find something? <Link href={href(locale, '/contact')}>Ask the research team</Link>.</span>
          </div>
        )}
      </section>

      <section className="sand">
        <div className="wrap sec-sm between" style={{ alignItems: 'center' }}>
          <div className="stack" style={{ gap: 12, flex: '1 1 520px' }}>
            <h2 style={{ font: '800 clamp(30px, 3.5vw, 44px)/1.05 var(--font-display)' }}>Research &amp; PR hub</h2>
            <p className="muted" style={{ fontSize: 17, lineHeight: 1.6 }}>Commissioning research or a community listening exercise? We co-design studies with Black communities and carry findings to decision makers.</p>
          </div>
          <Link href={href(locale, '/contact?topic=partnerships')} className="btn btn-green">Work with our research team →</Link>
        </div>
      </section>
    </>
  )
}
