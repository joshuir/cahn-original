'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { prefersReducedMotion } from '../Motion'

export type Banner = {
  id: string | number
  title: string
  tag?: string
  tagColour?: string
  line?: string
  linkLabel: string
  href: string
  image?: string | null
  imageAlt?: string
  video?: string | null
}

const TAGS: Record<string, [string, string]> = {
  gold: ['var(--gold)', 'var(--ink)'],
  red: ['var(--red)', '#fff'],
  green: ['var(--green)', '#fff'],
  paper: ['var(--paper)', 'var(--ink)'],
}

/**
 * Rotates automatically and continuously — no play/pause controls, per the brief.
 * Rotation stops (first banner shown statically) for visitors who prefer reduced motion,
 * and the hidden slides are removed from the tab order and the accessibility tree.
 */
export function BannerRotator({ banners, seconds = 6, label }: { banners: Banner[]; seconds?: number; label: string }) {
  const [i, setI] = useState(0)
  const [reduce, setReduce] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const r = prefersReducedMotion()
    setReduce(r)
    if (r || banners.length < 2) return
    timer.current = setInterval(() => setI((v) => (v + 1) % banners.length), Math.max(3, seconds) * 1000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [banners.length, seconds])

  if (!banners.length) return null

  return (
    <section className="wrap" style={{ paddingTop: 72, paddingBottom: 40 }} aria-roledescription="carousel" aria-label={label}>
      <div className="banners">
        {banners.map((b, n) => {
          const on = n === i
          const [bg, fg] = TAGS[b.tagColour || 'gold'] || TAGS.gold
          return (
            <Link key={b.id} href={b.href} className={`banner${on ? ' on' : ''}`} aria-hidden={!on} tabIndex={on ? 0 : -1} aria-roledescription="slide" aria-label={`${n + 1} of ${banners.length}: ${b.title}`}>
              <div className={`media${b.image ? '' : ' ph'}`} style={{ padding: b.image ? 0 : 24, display: 'flex', justifyContent: 'flex-end' }}>
                {b.video && !reduce ? (
                  <video className="cover" src={b.video} poster={b.image || undefined} autoPlay muted loop playsInline aria-hidden="true" />
                ) : b.image ? (
                  <img className="cover" src={b.image} alt={b.imageAlt || ''} loading={n === 0 ? 'eager' : 'lazy'} />
                ) : (
                  <span>Banner image · add in CMS</span>
                )}
              </div>
              <div className="shade" />
              <div className="copy">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
                  {b.tag && <span className="pill" style={{ background: bg, color: fg }}>{b.tag}</span>}
                  <span className="title">{b.title}</span>
                  {b.line && <span style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{b.line}</span>}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: 'var(--gold)' }}>
                  {b.linkLabel}
                  <Icon name="arrow" />
                </span>
              </div>
            </Link>
          )
        })}
        {banners.length > 1 && (
          <div className="bars" aria-hidden="true">
            {banners.map((b, n) => (
              <span key={`${b.id}-${n === i ? i : 'x'}`} className={n < i ? 'done' : n === i ? 'on' : ''} style={{ ['--dur' as any]: `${seconds}s` }}>
                <i />
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
