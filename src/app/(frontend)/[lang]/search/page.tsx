import Link from 'next/link'
import React from 'react'
import { Icon } from '@/components/Icon'
import { highlight, snippet } from '@/lib/highlight'
import { href, isLocale, t, type Locale } from '@/lib/i18n'
import { getPayload } from '@/lib/payload'

export const metadata = { title: 'Search', robots: { index: false } }

const TYPE: Record<string, [string, string]> = {
  services: ['Service', 'var(--green)'],
  programmes: ['Programme', '#8A5A00'],
  'health-hour-sessions': ['Health Hour', '#8A5A00'],
  events: ['Event', 'var(--red-text)'],
  publications: ['Publication · PDF', '#3E4F47'],
  pages: ['Page', 'var(--ink)'],
  jobs: ['Opportunity', 'var(--green)'],
  posts: ['News', 'var(--red-text)'],
}

/** Common alternative terms → what people mean. Extend per-item with “Search keywords” in the CMS. */
const SYNONYMS: Record<string, string[]> = {
  dv: ['domestic violence', 'domestic abuse'],
  abuse: ['domestic violence'],
  therapy: ['counselling'],
  counseling: ['counselling'],
  jobs: ['vacancy', 'careers'],
  careers: ['jobs'],
  funding: ['grant'],
  grants: ['grant', 'global majority fund'],
  covid: ['covid-19', 'vaccine'],
  donate: ['donation'],
}

export default async function Search({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string; type?: string }> }) {
  const { lang } = await params
  const { q = '', type = 'all' } = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const query = q.trim().slice(0, 80)
  let results: any[] = []

  if (query) {
    const payload = await getPayload()
    const terms = [query, ...(SYNONYMS[query.toLowerCase()] || [])]
    const or: any[] = terms.flatMap((term): any[] => [
      { title: { like: term } },
      { keywords: { like: term } },
      { summary: { like: term } },
      { docText: { like: term } },
    ])
    const res = await payload.find({ collection: 'search', where: { or }, limit: 60, sort: '-priority', locale, depth: 0 })
    results = res.docs.map((r: any) => {
      const ql = query.toLowerCase()
      let note = ''
      if (r.title?.toLowerCase().includes(ql)) note = r.summary || ''
      else if (r.keywords?.toLowerCase().includes(ql)) note = `Also known as “${query}”`
      else if (r.summary?.toLowerCase().includes(ql)) note = snippet(r.summary, query) || ''
      else if (r.docText) note = `Inside the PDF: ${snippet(r.docText, query) || ''}`
      else note = r.summary || 'Related'
      return { ...r, note, coll: r.doc?.relationTo }
    })
  }
  const counts = results.reduce((m: Record<string, number>, r) => ((m[r.coll] = (m[r.coll] || 0) + 1), m), {})
  const shown = results.filter((r) => type === 'all' || r.coll === type)
  const suggestions = ['BHIP', 'sickle cell', 'domestic abuse', 'jobs', 'KASO', 'Windrush']

  return (
    <>
      <section className="stack" style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px 24px', gap: 20 }}>
        <h1 style={{ font: '800 clamp(44px, 6vw, 80px)/0.95 var(--font-display)', letterSpacing: '-0.035em' }}>What are you looking for?</h1>
        <form role="search" method="get" className="stack" style={{ gap: 12 }}>
          <label htmlFor="site-q" className="sr-only">{d.searchSite}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '2px solid var(--ink)', borderRadius: 999, padding: '0 10px 0 24px' }}>
            <Icon name="search" size={22} />
            <input id="site-q" name="q" type="search" defaultValue={query} autoFocus placeholder="Services, programmes, events, reports…" style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', padding: '20px 0', font: '500 19px var(--font-body)', color: 'var(--ink)', minWidth: 0 }} />
            <button type="submit" className="btn btn-ink" style={{ minHeight: 44 }}>{d.search}</button>
          </div>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 14 }}>Try:</span>
            {suggestions.map((s) => (
              <Link key={s} href={`?q=${encodeURIComponent(s)}`} className="chip" style={{ minHeight: 36, padding: '6px 14px', borderColor: '#CDBFA6' }}>{s}</Link>
            ))}
          </div>
        </form>
      </section>

      {query && (
        <>
          <section className="row" style={{ maxWidth: 1000, margin: '0 auto', padding: '8px 32px 24px', gap: 8 }}>
            <Link href={`?q=${encodeURIComponent(query)}`} className={`chip${type === 'all' ? ' on' : ''}`}>All <span style={{ opacity: 0.7, marginLeft: 6 }}>{results.length}</span></Link>
            {Object.entries(counts).map(([k, n]) => (
              <Link key={k} href={`?q=${encodeURIComponent(query)}&type=${k}`} className={`chip${type === k ? ' on' : ''}`}>{TYPE[k]?.[0] || k} <span style={{ opacity: 0.7, marginLeft: 6 }}>{n}</span></Link>
            ))}
          </section>
          <section aria-live="polite" style={{ maxWidth: 1000, margin: '0 auto', padding: '8px 32px 96px' }}>
            <div className="rows">
              {shown.map((r) => (
                <Link key={r.id} href={href(locale, r.path)} className="rowlink" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '22px 12px' }}>
                  <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="tag" style={{ color: TYPE[r.coll]?.[1] }}>{TYPE[r.coll]?.[0]}</span>
                    <span className="muted" style={{ fontSize: 13 }}>{href(locale, r.path)}</span>
                  </span>
                  <span style={{ font: '700 24px/1.2 var(--font-display)' }}>{highlight(r.title || '', query)}</span>
                  {r.note && <span className="muted" style={{ fontSize: 14 }}>{highlight(r.note, query)}</span>}
                </Link>
              ))}
            </div>
            {!shown.length && (
              <div className="stack" style={{ padding: '32px 0', gap: 10 }}>
                <span className="h3">{d.noResults} for “{query}”</span>
                <span className="muted">Check the spelling, try a shorter word, or call the helpline.</span>
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}
