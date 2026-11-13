import Link from 'next/link'
import React from 'react'
import { href, type Locale } from '@/lib/i18n'

export function Footer({ locale, s }: { locale: Locale; s: any }) {
  const cols: any[] = s?.footerColumns || []
  const social: any[] = s?.social || []
  const tel = s?.helpline ? `tel:+44${String(s.helpline).replace(/\D/g, '').replace(/^0/, '')}` : undefined
  return (
    <footer className="site-footer">
      <div className="triband"><span /><span /><span /></div>
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15, lineHeight: 1.6 }}>
          <span style={{ font: '800 28px var(--font-display)', color: 'var(--paper)' }}>{s?.shortName || 'CAHN'}</span>
          <span style={{ whiteSpace: 'pre-line' }}>{s?.address}</span>
          {s?.helpline && <a href={tel} style={{ color: 'var(--gold)', fontWeight: 700 }}>Helpline {s.helpline}</a>}
          {s?.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
        </div>
        {cols.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontWeight: 700, color: 'var(--paper)' }}>{c.heading}</span>
            {(c.links || []).map((l: any, j: number) => (
              <Link key={j} href={href(locale, l.url)}>{l.label}</Link>
            ))}
          </div>
        ))}
        {social.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontWeight: 700, color: 'var(--paper)' }}>Follow</span>
            {social.map((x, i) => (
              <a key={i} href={x.url} rel="noopener noreferrer" target="_blank">{x.platform}</a>
            ))}
          </div>
        )}
      </div>
      <div className="wrap" style={{ paddingTop: 20, paddingBottom: 32, borderTop: '1px solid rgba(207,217,211,.18)', display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'space-between', fontSize: 13 }}>
        <span>{s?.companyLine}</span>
        <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href={href(locale, '/privacy')}>Privacy</Link>
          <Link href={href(locale, '/cookies')}>Cookies</Link>
          <Link href={href(locale, '/accessibility')}>Accessibility</Link>
          <a href="/sitemap.xml">Sitemap</a>
        </span>
      </div>
    </footer>
  )
}
