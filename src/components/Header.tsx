'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { href, LOCALE_NAMES, LOCALES, type Dict, type Locale } from '@/lib/i18n'

export type NavItem = { label: string; url: string; blurb?: string; children?: { label: string; url: string }[] }

export function Brand({ logo, name }: { logo?: string | null; name: string }) {
  if (logo) return <img src={logo} alt={name} />
  return (
    <>
      <span className="brand-mark" aria-hidden="true">
        <b>CAHN</b>
        <span className="triband" style={{ height: 6 }}><span /><span /><span /></span>
      </span>
      <span className="brand-name"><span>Caribbean &amp; African</span><span>Health Network</span></span>
    </>
  )
}

export function Header({
  locale,
  nav,
  d,
  helpline,
  utility,
  logo,
  siteName,
}: {
  locale: Locale
  nav: NavItem[]
  d: Dict
  helpline?: string
  utility?: string
  logo?: string | null
  siteName: string
}) {
  const pathname = usePathname() || `/${locale}`
  const [open, setOpen] = useState<number | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [drawerSec, setDrawerSec] = useState<number | null>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Close menus on route change and on Escape
  useEffect(() => {
    setOpen(null)
    setDrawer(false)
    setLangOpen(false)
  }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setLangOpen(false)
        setDrawer(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
  }, [drawer])

  const swapLocale = (l: Locale) => pathname.replace(/^\/(en|fr|pt)(?=\/|$)/, `/${l}`) || `/${l}`
  const remember = (l: Locale) => {
    document.cookie = `cahn_lang=${l}; path=/; max-age=31536000; samesite=lax`
  }
  const panel = open !== null ? nav[open] : null
  const tel = helpline ? `tel:+44${helpline.replace(/\D/g, '').replace(/^0/, '')}` : undefined

  return (
    <>
      <a href="#main" className="skip">{d.skip}</a>
      <div className="utility">
        <div className="wrap">
          <div className="row" style={{ gap: 24, alignItems: 'center' }}>
            {helpline && (
              <span>
                {d.helpline} <a href={tel} style={{ color: '#fff', fontWeight: 600 }}>{helpline}</a>
              </span>
            )}
            {utility && (
              <span className="hide-m" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="dot" />
                {utility}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href={href(locale, '/contact')} className="hide-m" style={{ padding: '6px 10px' }}>{d.contact}</Link>
            <a href="/admin" className="hide-m" style={{ padding: '6px 10px' }}>{d.staffLogin}</a>
            <div className="lang" ref={langRef}>
              <button type="button" aria-haspopup="true" aria-expanded={langOpen} aria-label={`${d.changeLanguage}, ${LOCALE_NAMES[locale]}`} onClick={() => setLangOpen((v) => !v)}>
                <Icon name="globe" size={16} stroke={1.8} />
                <span>{locale.toUpperCase()}</span>
                <Icon name="chevron" size={10} stroke={2.5} />
              </button>
              {langOpen && (
                <ul>
                  {LOCALES.map((l) => (
                    <li key={l}>
                      <a href={swapLocale(l)} hrefLang={l} lang={l} aria-current={l === locale} onClick={() => remember(l)}>
                        <strong style={{ width: 28 }}>{l.toUpperCase()}</strong>
                        {LOCALE_NAMES[l]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <header className="site-header" onMouseLeave={() => setOpen(null)}>
        <div className="wrap bar">
          <Link href={href(locale, '/')} className="brand" aria-label={`${siteName} — home`}>
            <Brand logo={logo} name={siteName} />
          </Link>
          <nav className="nav" aria-label="Primary">
            {nav.map((item, i) =>
              item.children?.length ? (
                <button
                  key={item.url + i}
                  type="button"
                  className="navbtn"
                  aria-expanded={open === i}
                  aria-controls="mega"
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {item.label}
                  <Icon name="chevron" size={10} stroke={2.5} />
                </button>
              ) : (
                <Link key={item.url + i} href={href(locale, item.url)} className="navbtn" onMouseEnter={() => setOpen(null)}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href={href(locale, '/search')} className="iconbtn" aria-label={d.searchSite}><Icon name="search" /></Link>
            <Link href={href(locale, '/health-hour')} className="btn btn-line hide-m hh-btn" style={{ minHeight: 46, padding: '11px 16px', fontSize: 14 }}>{d.healthHour}</Link>
            <Link href={href(locale, '/donate')} className="btn btn-red" style={{ minHeight: 46, padding: '12px 20px', fontSize: 14 }}>
              {d.donate}
              <Icon name="heart" size={14} fill />
            </Link>
            <button type="button" className="iconbtn burger" aria-label={d.menu} aria-expanded={drawer} onClick={() => setDrawer(true)}>
              <Icon name="menu" />
            </button>
          </div>
        </div>
        {panel && (
          <div className="mega" id="mega">
            <div className="wrap">
              <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="tag muted">{panel.label}</span>
                {panel.blurb && <p style={{ font: '600 24px/1.2 var(--font-display)' }}>{panel.blurb}</p>}
                <Link href={href(locale, panel.url)} style={{ fontWeight: 600 }}>{d.explore} {panel.label} →</Link>
              </div>
              <div className="mega-links">
                {panel.children?.map((c) => (
                  <Link key={c.url + c.label} href={href(locale, c.url)}>{c.label}</Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {drawer && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label={d.menu}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(247,242,233,.12)' }}>
            <span style={{ font: '800 20px var(--font-display)' }}>CAHN</span>
            <button type="button" className="iconbtn" style={{ background: 'var(--paper)', color: 'var(--ink)', border: 0 }} aria-label={d.closeMenu} onClick={() => setDrawer(false)} autoFocus>
              <Icon name="close" />
            </button>
          </div>
          <form action={href(locale, '/search')} style={{ padding: '14px 20px 0' }} role="search">
            <label htmlFor="m-q" className="sr-only">{d.search}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ink-2)', borderRadius: 14, padding: '0 14px' }}>
              <Icon name="search" color="#B9C6BE" />
              <input id="m-q" name="q" type="search" placeholder={d.search} style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', color: 'var(--paper)', font: '500 16px var(--font-body)', padding: '13px 0', minWidth: 0 }} />
            </div>
          </form>
          <nav aria-label="Mobile" style={{ flex: 1, padding: '8px 20px' }}>
            {nav.map((item, i) => (
              <div className="drawer-sec" key={item.url + i}>
                {item.children?.length ? (
                  <>
                    <button type="button" aria-expanded={drawerSec === i} onClick={() => setDrawerSec(drawerSec === i ? null : i)}>
                      {item.label}
                      <span className="plus" aria-hidden="true">{drawerSec === i ? '−' : '+'}</span>
                    </button>
                    {drawerSec === i && (
                      <div style={{ paddingBottom: 14 }}>
                        <Link href={href(locale, item.url)}>{d.explore} {item.label}</Link>
                        {item.children.map((c) => (
                          <Link key={c.url + c.label} href={href(locale, c.url)}>{c.label}</Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={href(locale, item.url)} style={{ font: '700 22px var(--font-display)', color: 'var(--paper)', padding: '16px 0' }}>{item.label}</Link>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, padding: '18px 0' }}>
              {LOCALES.map((l) => (
                <a key={l} href={swapLocale(l)} onClick={() => remember(l)} className="chip" style={{ color: 'var(--paper)', borderColor: 'rgba(247,242,233,.4)', background: l === locale ? 'var(--gold)' : 'transparent', ...(l === locale ? { color: 'var(--ink)' } : {}) }} aria-current={l === locale}>
                  {l.toUpperCase()}
                </a>
              ))}
            </div>
          </nav>
          <div style={{ padding: '14px 20px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid rgba(247,242,233,.12)' }}>
            <Link href={href(locale, '/health-hour')} className="btn" style={{ border: '1.5px solid rgba(247,242,233,.4)', color: 'var(--paper)' }}>{d.healthHour}</Link>
            <Link href={href(locale, '/donate')} className="btn btn-red">{d.donate}</Link>
          </div>
        </div>
      )}
    </>
  )
}
