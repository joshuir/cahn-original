'use client'

import React, { useState } from 'react'

const TEAMS: [string, string][] = [
  ['board', 'Board'],
  ['patrons', 'Patrons'],
  ['executive', 'Executive office'],
  ['community', 'Community services'],
  ['policy', 'Health partnership & policy'],
  ['comms', 'Comms, marketing, IT & faith'],
  ['volunteers', 'Volunteers'],
]
const SHAPES = ['999px 999px 22px 22px', '22px', '22px', '22px 22px 999px 999px']

export function PeopleGrid({ people, teams, allLabel = 'Everyone' }: { people: { id: any; name: string; role?: string; team: string; photo?: string | null; alt?: string }[]; teams?: string[]; allLabel?: string }) {
  const [team, setTeam] = useState<string>('all')
  const available = TEAMS.filter(([k]) => (!teams?.length || teams.includes(k)) && people.some((p) => p.team === k))
  const shown = people.filter((p) => team === 'all' || p.team === team)
  return (
    <>
      {available.length > 1 && (
        <div className="row" style={{ gap: 8 }} role="group" aria-label="Filter by team">
          <button type="button" className="chip" aria-pressed={team === 'all'} onClick={() => setTeam('all')}>{allLabel}</button>
          {available.map(([k, l]) => (
            <button key={k} type="button" className="chip" aria-pressed={team === k} onClick={() => setTeam(k)}>{l}</button>
          ))}
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }} aria-live="polite">
        {shown.map((p, i) => (
          <div key={p.id} className="stack" style={{ gap: 10 }}>
            {p.photo ? (
              <img src={p.photo} alt={p.alt || p.name} loading="lazy" style={{ height: 260, width: '100%', objectFit: 'cover', borderRadius: SHAPES[i % 4] }} />
            ) : (
              <div className="ph-warm" role="img" aria-label={`Portrait placeholder: ${p.name}`} style={{ height: 260, borderRadius: SHAPES[i % 4] }} />
            )}
            <span className="h3" style={{ fontSize: 20 }}>{p.name}</span>
            {p.role && <span className="muted" style={{ fontSize: 14 }}>{p.role}</span>}
          </div>
        ))}
      </div>
    </>
  )
}
