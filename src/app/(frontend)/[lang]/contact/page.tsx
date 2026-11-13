import React from 'react'
import { ContactForm } from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { getSettings } from '@/lib/payload'

export const metadata = { title: 'Contact', description: 'Get in touch with the Caribbean & African Health Network.' }

const TOPICS = [
  { key: 'general', label: 'General', team: 'enquiries' },
  { key: 'support', label: 'Get support', team: 'services' },
  { key: 'health-hour', label: 'Health Hour', team: 'Health Hour' },
  { key: 'events', label: 'Events & sponsorship', team: 'events' },
  { key: 'press', label: 'Press & media', team: 'communications' },
  { key: 'partnerships', label: 'Partnerships & research', team: 'partnerships' },
]

export default async function Contact({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ topic?: string }> }) {
  const { lang } = await params
  const { topic } = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const s = await getSettings(locale)
  const ordered = [...TOPICS].sort((a, b) => (a.key === topic ? -1 : b.key === topic ? 1 : 0))
  const tel = s?.helpline ? `tel:+44${String(s.helpline).replace(/\D/g, '').replace(/^0/, '')}` : undefined
  return (
    <section className="wrap" style={{ paddingTop: 64, paddingBottom: 96, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div className="stack" style={{ flex: '1 1 480px', gap: 24 }}>
        <h1 style={{ font: '800 clamp(52px, 7vw, 100px)/0.92 var(--font-display)', letterSpacing: '-0.04em' }}>Talk to us.</h1>
        <p className="lede">Choose a topic so your message reaches the right team first time. We reply within 2 working days.</p>
        <div className="stack" style={{ gap: 12 }}>
          {tel && (
            <a href={tel} className="ink" style={{ borderRadius: 22, padding: 22, textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
              <Icon name="phone" size={26} stroke={1.8} color="var(--gold)" />
              <span className="stack" style={{ gap: 0 }}><span className="muted" style={{ fontSize: 13 }}>{d.helpline}</span><span style={{ font: '700 22px var(--font-display)' }}>{s.helpline}</span></span>
            </a>
          )}
          {s?.email && (
            <a href={`mailto:${s.email}`} className="white" style={{ borderRadius: 22, padding: 22, textDecoration: 'none', color: 'var(--ink)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <Icon name="mail" size={26} stroke={1.8} color="var(--green)" />
              <span className="stack" style={{ gap: 0 }}><span className="muted" style={{ fontSize: 13 }}>General enquiries</span><span style={{ font: '700 22px var(--font-display)' }}>{s.email}</span></span>
            </a>
          )}
          {s?.address && (
            <div className="white" style={{ borderRadius: 22, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <Icon name="pin" size={26} stroke={1.8} color="var(--red-text)" />
              <span style={{ lineHeight: 1.55, whiteSpace: 'pre-line' }}>{s.address}</span>
            </div>
          )}
        </div>
      </div>
      <div className="panel" style={{ flex: '1 1 560px' }}>
        <ContactForm topics={ordered} labels={{ name: d.name, email: d.email, message: d.message, error: d.submitError }} />
      </div>
    </section>
  )
}
