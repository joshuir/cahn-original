'use client'

import React, { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../Motion'

export type Flyer = {
  id: string | number
  topic: string
  date: string
  upcoming: boolean
  image?: string | null
  alt?: string
}

const CARD_TONES = [
  ['#2A4236', '#C23A2B', '#fff'],
  ['#3A2A10', '#F7F2E9', '#0F1F18'],
  ['#0F1F18', '#0B6B3F', '#fff'],
  ['#40150F', '#F0B323', '#0F1F18'],
  ['#1B3328', '#A12C1F', '#fff'],
  ['#2A4236', '#FFFFFF', '#0F1F18'],
]

/**
 * Animated smartphone mockup. Flyers slide through the screen with GSAP;
 * uploaded flyers keep their original proportions (object-fit: contain over
 * a blurred copy of themselves), so nothing is cropped or stretched.
 */
export function HealthHourPhone({ flyers, seconds = 4, labels }: { flyers: Flyer[]; seconds?: number; labels: { upcoming: string; replay: string; nowShowing: string } }) {
  const [i, setI] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const phone = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion() || flyers.length < 2) return
    const id = setInterval(() => setI((v) => (v + 1) % flyers.length), Math.max(2, seconds) * 1000)
    return () => clearInterval(id)
  }, [flyers.length, seconds])

  // Gentle float of the device
  useEffect(() => {
    if (prefersReducedMotion() || !phone.current) return
    let tween: any
    import('gsap').then(({ gsap }) => {
      tween = gsap.to(phone.current, { y: -14, rotate: -1.5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    })
    return () => tween?.kill()
  }, [])

  // Slide transition
  useEffect(() => {
    const els = refs.current
    const reduce = prefersReducedMotion()
    if (first.current || reduce) {
      els.forEach((el, n) => el && (el.style.transform = `translateX(${n === i ? 0 : 100}%)`))
      first.current = false
      return
    }
    const prev = (i - 1 + flyers.length) % flyers.length
    import('gsap').then(({ gsap }) => {
      els.forEach((el, n) => {
        if (!el) return
        if (n === i) gsap.fromTo(el, { xPercent: 100, x: 0 }, { xPercent: 0, duration: 0.8, ease: 'power3.inOut', onStart: () => { el.style.transform = '' } })
        else if (n === prev) gsap.to(el, { xPercent: -100, duration: 0.8, ease: 'power3.inOut' })
        else gsap.set(el, { xPercent: 100 })
      })
    })
  }, [i, flyers.length])

  if (!flyers.length) return null
  const cur = flyers[i]

  return (
    <div className="phone-stage">
      <div className="halo" aria-hidden="true" />
      <div ref={phone} className="phone" style={{ transform: 'rotate(-3deg)' }}>
        <div className="screen">
          <div className="island" aria-hidden="true" />
          {flyers.map((f, n) => {
            const [bg, card, fg] = CARD_TONES[n % CARD_TONES.length]
            return (
              <div
                key={f.id}
                ref={(el) => {
                  refs.current[n] = el
                }}
                className="flyer"
                style={{ background: bg, transform: `translateX(${n === 0 ? 0 : 100}%)` }}
                aria-hidden={n !== i}
              >
                {f.image ? (
                  <>
                    <div className="backdrop" style={{ backgroundImage: `url(${f.image})` }} />
                    <img src={f.image} alt={f.alt || `Health Hour flyer: ${f.topic}`} loading={n === 0 ? 'eager' : 'lazy'} />
                  </>
                ) : (
                  <div className="flyer-card" role="img" aria-label={`Health Hour flyer: ${f.topic}`} style={{ background: card, color: fg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ font: '800 13px var(--font-display)', letterSpacing: '.12em' }}>HEALTH HOUR</span>
                      <span style={{ padding: '4px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', background: f.upcoming ? 'var(--ink)' : 'rgba(0,0,0,.18)', color: f.upcoming ? 'var(--gold)' : fg }}>
                        {(f.upcoming ? labels.upcoming : labels.replay).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ font: '800 38px/0.95 var(--font-display)', letterSpacing: '-0.02em' }}>{f.topic}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <span>{f.date} · 11:00 UK</span>
                      <span style={{ opacity: 0.8 }}>Zoom + YouTube</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div className="pips" aria-hidden="true">
            {flyers.map((f, n) => (
              <span key={f.id} className={n === i ? 'on' : ''} />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {labels.nowShowing}: {cur.topic}
      </span>
    </div>
  )
}
