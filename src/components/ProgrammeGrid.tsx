'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Icon } from './Icon'

const THEMES: [string, string][] = [
  ['all', 'All'],
  ['health', 'Health improvement'],
  ['donation', 'Blood & organ donation'],
  ['leadership', 'Leadership'],
  ['empowerment', 'Community empowerment'],
  ['research', 'Research & learning'],
]
const PAL = [
  ['#fff', 'var(--ink)', 'var(--green)'],
  ['var(--ink)', 'var(--paper)', 'var(--gold)'],
  ['#fff', 'var(--ink)', 'var(--red-text)'],
  ['var(--green)', '#fff', 'var(--paper)'],
]

export function ProgrammeGrid({ items }: { items: { id: any; title: string; tag?: string; theme: string; summary: string; hoverText?: string; url: string }[] }) {
  const [theme, setTheme] = useState('all')
  const shown = items.filter((p) => theme === 'all' || p.theme === theme)
  return (
    <>
      <div className="wrap" style={{ position: 'sticky', top: 0, zIndex: 3, background: 'var(--paper)', paddingTop: 12, paddingBottom: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Filter programmes">
        {THEMES.filter(([k]) => k === 'all' || items.some((p) => p.theme === k)).map(([k, l]) => (
          <button key={k} type="button" className="chip" aria-pressed={theme === k} onClick={() => setTheme(k)}>{l}</button>
        ))}
        <span className="muted" style={{ marginLeft: 'auto', fontSize: 14 }} aria-live="polite">{shown.length} programme{shown.length === 1 ? '' : 's'}</span>
      </div>
      <div className="wrap" style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div className="grid g3" style={{ gap: 18 }}>
          {shown.map((p, i) => {
            const [bg, fg, tag] = PAL[i % 4]
            return (
              <Link key={p.id} href={p.url} className="flip" style={{ background: bg, color: fg, borderRadius: 28, padding: 28, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 240 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tag" style={{ color: tag }}>{p.tag}</span>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrowUpRight" size={16} stroke={2.2} /></span>
                </div>
                <span style={{ font: '700 26px/1.15 var(--font-display)', flex: 1 }}>{p.title}</span>
                <span style={{ fontSize: 15, lineHeight: 1.55, opacity: 0.85 }}>{p.summary}</span>
                {p.hoverText && <span className="more" style={{ fontSize: 14, fontWeight: 600 }}>{p.hoverText}</span>}
              </Link>
            )
          })}
        </div>
      </div>
      <style>{`.flip{transition:transform .35s var(--ease),box-shadow .35s}.flip:hover,.flip:focus-visible{transform:translateY(-6px);box-shadow:0 24px 48px rgba(15,31,24,.16)}.flip .more{max-height:0;opacity:0;overflow:hidden;transition:max-height .45s var(--ease),opacity .3s}.flip:hover .more,.flip:focus-visible .more{max-height:120px;opacity:1}@media (prefers-reduced-motion:reduce){.flip .more{max-height:none;opacity:1}}`}</style>
    </>
  )
}
