'use client'

import Link from 'next/link'
import React, { useState } from 'react'

type E = { id: any; title: string; url: string; category: string; catLabel: string; catBg: string; catFg: string; day: string; mon: string; venue?: string; summary?: string; upcoming: boolean; image?: string | null }

export function EventsBrowser({ events, labels }: { events: E[]; labels: { upcoming: string; past: string; all: string } }) {
  const [when, setWhen] = useState<'up' | 'past'>('up')
  const [cat, setCat] = useState('all')
  const cats = Array.from(new Map(events.map((e) => [e.category, e.catLabel])).entries())
  const shown = events.filter((e) => (when === 'up' ? e.upcoming : !e.upcoming) && (cat === 'all' || e.category === cat))
  return (
    <section id="list" className="wrap" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', position: 'sticky', top: 0, background: 'var(--paper)', padding: '12px 0', zIndex: 3 }}>
        <div className="seg" role="tablist" aria-label="When">
          <button type="button" role="tab" aria-selected={when === 'up'} onClick={() => setWhen('up')}>{labels.upcoming}</button>
          <button type="button" role="tab" aria-selected={when === 'past'} onClick={() => setWhen('past')}>{labels.past}</button>
        </div>
        <div className="row" style={{ gap: 8 }} role="group" aria-label="Category">
          <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>{labels.all}</button>
          {cats.map(([k, l]) => (
            <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>
          ))}
        </div>
      </div>
      <p className="muted" style={{ fontSize: 14, margin: '16px 0' }} aria-live="polite">{shown.length ? `${shown.length} event${shown.length > 1 ? 's' : ''}` : 'No events in this category yet — try another filter.'}</p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 20 }}>
        {shown.map((e) => (
          <Link key={e.id} href={e.url} className="card ecard">
            <div className={e.image ? '' : 'ph'} style={{ height: 180, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundImage: e.image ? `url(${e.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="datebox"><b>{e.day}</b><small>{e.mon}</small></div>
              <span className="pill" style={{ background: e.catBg, color: e.catFg }}>{e.catLabel}</span>
            </div>
            <div className="card-body" style={{ flex: 1 }}>
              <h3 className="h3">{e.title}</h3>
              {e.venue && <span className="muted" style={{ fontSize: 14 }}>{e.venue}</span>}
              {e.summary && <p className="muted" style={{ fontSize: 15, lineHeight: 1.55, flex: 1 }}>{e.summary}</p>}
              <span className="go" style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: 999, border: '1.5px solid var(--ink)', fontWeight: 700, fontSize: 14 }}>{e.upcoming ? 'Register' : 'See highlights'} →</span>
            </div>
          </Link>
        ))}
      </div>
      <style>{`.ecard{transition:transform .3s var(--ease),box-shadow .3s}.ecard:hover{transform:translateY(-6px) rotate(-.4deg);box-shadow:0 24px 48px rgba(15,31,24,.16);color:var(--ink)}.ecard:hover .go{background:var(--ink);color:var(--paper)}`}</style>
    </section>
  )
}
