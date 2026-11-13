'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off')

/** GSAP ScrollTrigger reveal for every `.reveal` element; static when motion is reduced. */
export function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!els.length) return
    if (prefersReducedMotion()) {
      els.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }
    let ctx: any
    let cancelled = false
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const subtle = document.documentElement.dataset.motion === 'subtle'
      ctx = gsap.context(() => {
        els.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: subtle ? 0.5 : 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })
      })
    })()
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [pathname])
  return null
}

/** Next Health Hour: Saturday 11:00 Europe/London. */
export function nextSaturday11(now = new Date()) {
  // London's current UTC offset (handles GMT/BST automatically)
  const off =
    new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })).getTime() -
    new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
  const wall = new Date(now.getTime() + off) // London wall-clock time, read via UTC getters
  const target = new Date(Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate(), 11, 0, 0))
  target.setUTCDate(target.getUTCDate() + ((6 - wall.getUTCDay() + 7) % 7))
  if (target <= wall) target.setUTCDate(target.getUTCDate() + 7)
  return new Date(target.getTime() - off)
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

const split = (ms: number) => ({
  d: Math.floor(ms / 864e5),
  h: Math.floor((ms % 864e5) / 36e5),
  m: Math.floor((ms % 36e5) / 6e4),
  s: Math.floor((ms % 6e4) / 1e3),
})
const pad = (n: number) => String(n).padStart(2, '0')

/** Big countdown tiles (days / hours / mins / secs). */
export function Countdown({ target, labels }: { target?: string; labels: { days: string; hours: string; mins: string; secs: string } }) {
  const now = useNow(1000)
  const end = target ? new Date(target).getTime() : now ? nextSaturday11(new Date(now)).getTime() : 0
  const p = split(Math.max(0, end - (now ?? end)))
  return (
    <div className="countdown" role="timer" aria-live="off">
      {[
        [p.d, labels.days],
        [p.h, labels.hours],
        [p.m, labels.mins],
        [p.s, labels.secs],
      ].map(([v, l]) => (
        <div key={String(l)}>
          <b>{now === null ? '--' : pad(v as number)}</b>
          <small>{l}</small>
        </div>
      ))}
    </div>
  )
}

/** Compact “2d 04h 15m” countdown to the next Health Hour. */
export function ShortCountdown() {
  const now = useNow(30000)
  if (now === null) return <span>—</span>
  const p = split(Math.max(0, nextSaturday11(new Date(now)).getTime() - now))
  return <span>{(p.d ? `${p.d}d ` : '') + `${pad(p.h)}h ${pad(p.m)}m`}</span>
}
