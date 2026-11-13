'use client'

import Link from 'next/link'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'

const KEY = 'cahn_consent'

/** Consent banner. Google Analytics 4 only loads after the visitor accepts. */
export function CookieConsent({ ga4Id, text, labels, policyHref }: { ga4Id?: string | null; text: string; labels: { accept: string; essential: string; policy: string }; policyHref: string }) {
  const [choice, setChoice] = useState<'analytics' | 'essential' | null | 'unset'>('unset')

  useEffect(() => {
    const m = document.cookie.match(new RegExp(`${KEY}=(analytics|essential)`))
    setChoice(m ? (m[1] as any) : null)
    const reopen = () => setChoice(null)
    window.addEventListener('cahn:cookie-settings', reopen)
    return () => window.removeEventListener('cahn:cookie-settings', reopen)
  }, [])

  const save = (v: 'analytics' | 'essential') => {
    document.cookie = `${KEY}=${v}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
    setChoice(v)
    if (v === 'essential') {
      // Remove GA cookies if consent is withdrawn
      document.cookie.split(';').forEach((c) => {
        const n = c.split('=')[0].trim()
        if (n.startsWith('_ga')) document.cookie = `${n}=; path=/; max-age=0; domain=.${location.hostname.replace(/^www\./, '')}`
      })
    }
  }

  return (
    <>
      {choice === 'analytics' && ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {choice === null && (
        <div className="cookie" role="region" aria-label="Cookie consent">
          <span style={{ flex: '1 1 420px', fontSize: 14, lineHeight: 1.5 }}>
            {text} <Link href={policyHref}>{labels.policy}</Link>
          </span>
          <button type="button" className="btn btn-line" style={{ minHeight: 44, padding: '10px 18px' }} onClick={() => save('essential')}>{labels.essential}</button>
          <button type="button" className="btn btn-ink" style={{ minHeight: 44, padding: '10px 18px' }} onClick={() => save('analytics')}>{labels.accept}</button>
        </div>
      )}
    </>
  )
}

/** Fire a GA4 conversion event if analytics consent was given. */
export const track = (event: string, params: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) (window as any).gtag('event', event, params)
}
