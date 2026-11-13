'use client'

import React, { useState } from 'react'
import { Icon } from './Icon'

type S = { id: any; topic: string; category?: string; date: string; replayUrl?: string; thumb?: string | null; resources: { label: string; url: string }[] }

export function SessionArchive({ sessions, allLabel }: { sessions: S[]; allLabel: string }) {
  const cats = Array.from(new Set(sessions.map((s) => s.category).filter(Boolean))) as string[]
  const [cat, setCat] = useState('all')
  const shown = sessions.filter((s) => cat === 'all' || s.category === cat)
  return (
    <>
      <div className="row" style={{ gap: 10, marginBottom: 24 }} role="group" aria-label="Filter by topic">
        <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>{allLabel}</button>
        {cats.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="grid g3" aria-live="polite">
        {shown.map((s) => (
          <article key={s.id} className="card lift">
            <a href={s.replayUrl || '#'} aria-label={`Watch replay: ${s.topic}`} className={s.thumb ? '' : 'ph'} style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: s.thumb ? `url(${s.thumb})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={20} /></span>
            </a>
            <div className="card-body">
              {s.category && <span className="tag" style={{ color: 'var(--red-text)' }}>{s.category}</span>}
              <h3 className="h3" style={{ fontSize: 20 }}>{s.topic}</h3>
              <span className="muted" style={{ fontSize: 14 }}>{s.date}</span>
              {s.resources.length > 0 && (
                <div className="row" style={{ gap: 8 }}>
                  {s.resources.map((r, i) => (
                    <a key={i} href={r.url} style={{ fontSize: 14, fontWeight: 600 }}>{r.label} ↓</a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
        {!shown.length && <p className="muted">Replays will appear here after each session.</p>}
      </div>
    </>
  )
}
