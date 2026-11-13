'use client'

import React, { useState } from 'react'
import { track } from './CookieConsent'
import { Icon } from './Icon'

type Status = 'idle' | 'sending' | 'done' | 'error'

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error || 'Request failed')
  return json
}

const formData = (e: React.FormEvent<HTMLFormElement>) => Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>

/** Hidden field that bots fill in and people never see. */
const Honeypot = () => (
  <label className="hp" aria-hidden="true">
    Leave this empty
    <input type="text" name="company" tabIndex={-1} autoComplete="off" />
  </label>
)

export function Done({ title, text }: { title: string; text?: string }) {
  return (
    <div className="stack" role="status" style={{ gap: 14 }}>
      <div className="ok-badge"><Icon name="check" size={30} stroke={2.5} /></div>
      <span style={{ font: '800 30px/1.05 var(--font-display)' }}>{title}</span>
      {text && <span className="muted" style={{ lineHeight: 1.6 }}>{text}</span>}
    </div>
  )
}

export function NewsletterForm({ locale, labels, topic = 'e-bulletin', source = 'homepage' }: { locale: string; labels: { email: string; signUp: string; consent: string; thanks: string; error: string }; topic?: string; source?: string }) {
  const [st, setSt] = useState<Status>('idle')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSt('sending')
    try {
      await post('/api/site/subscribe', { ...formData(e), topic, source, locale, consentText: labels.consent })
      setSt('done')
      track('sign_up', { method: 'newsletter', topic })
    } catch {
      setSt('error')
    }
  }
  if (st === 'done') return <p role="status" style={{ fontWeight: 700, color: 'var(--green)' }}>{labels.thanks}</p>
  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 10 }}>
      <Honeypot />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <label htmlFor={`nl-${source}`} className="sr-only">{labels.email}</label>
        <input id={`nl-${source}`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="input" style={{ flex: '1 1 220px', borderRadius: 999, padding: '16px 18px', width: 'auto', minWidth: 0 }} />
        <button type="submit" className="btn btn-green" disabled={st === 'sending'}>{labels.signUp}</button>
      </div>
      <label className="check"><input type="checkbox" name="consent" required /> {labels.consent}</label>
      {st === 'error' && <span className="err" role="alert">{labels.error}</span>}
    </form>
  )
}

export function ContactForm({ topics, labels }: { topics: { label: string; team: string }[]; labels: Record<string, string> }) {
  const [topic, setTopic] = useState(topics[0])
  const [st, setSt] = useState<Status>('idle')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSt('sending')
    try {
      await post('/api/site/contact', { ...formData(e), topic: topic.label })
      setSt('done')
      track('generate_lead', { form: 'contact', topic: topic.label })
    } catch {
      setSt('error')
    }
  }
  if (st === 'done') return <Done title={`Thanks — your message is with our ${topic.team} team.`} text="A copy has been emailed to you. We reply within 2 working days." />
  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 18 }}>
      <Honeypot />
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend style={{ fontWeight: 700, marginBottom: 10 }}>What’s it about?</legend>
        <div className="row" style={{ gap: 8 }}>
          {topics.map((t) => (
            <button key={t.label} type="button" className="chip" aria-pressed={t.label === topic.label} onClick={() => setTopic(t)}>{t.label}</button>
          ))}
        </div>
      </fieldset>
      <div className="grid g2" style={{ gap: 14 }}>
        <label className="field">{labels.name}<input className="input" name="name" required autoComplete="name" /></label>
        <label className="field">{labels.email}<input className="input" name="email" type="email" required autoComplete="email" /></label>
      </div>
      <label className="field">{labels.message}<textarea className="input" name="message" rows={6} required style={{ resize: 'vertical' }} /></label>
      <label className="check"><input type="checkbox" name="consent" required /> I agree to CAHN storing my details to respond to this enquiry, as described in the privacy notice.</label>
      {st === 'error' && <span className="err" role="alert">{labels.error}</span>}
      <button type="submit" className="btn btn-ink" disabled={st === 'sending'} style={{ padding: 18 }}>Send to {topic.team} team</button>
    </form>
  )
}

export function VolunteerForm({ roles }: { roles: string[] }) {
  const [st, setSt] = useState<Status>('idle')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSt('sending')
    try {
      const d = formData(e)
      await post('/api/site/contact', { ...d, topic: 'Volunteering', message: `Volunteer interest: ${d.role}` })
      setSt('done')
      track('generate_lead', { form: 'volunteer' })
    } catch {
      setSt('error')
    }
  }
  if (st === 'done') return <span role="status" style={{ font: '800 26px var(--font-display)', color: 'var(--green)' }}>Thank you — we’ll be in touch within 5 working days.</span>
  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 14 }}>
      <Honeypot />
      <label className="field">Full name<input className="input" name="name" required autoComplete="name" /></label>
      <label className="field">Email<input className="input" name="email" type="email" required autoComplete="email" /></label>
      <label className="field">I’d like to help with
        <select className="input" name="role">{roles.map((r) => <option key={r}>{r}</option>)}</select>
      </label>
      <label className="check"><input type="checkbox" name="consent" required /> I agree to CAHN contacting me about volunteering.</label>
      {st === 'error' && <span className="err" role="alert">Something went wrong. Please try again.</span>}
      <button type="submit" className="btn btn-green" disabled={st === 'sending'}>Register interest</button>
    </form>
  )
}

export function EventRegisterForm({ eventId, locale, ctaLabel, placesLeft }: { eventId: string | number; locale: string; ctaLabel: string; placesLeft?: number | null }) {
  const [st, setSt] = useState<Status>('idle')
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSt('sending')
    try {
      await post('/api/site/register', { ...formData(e), event: eventId, locale })
      setSt('done')
      track('sign_up', { method: 'event_registration', event: String(eventId) })
    } catch (err: any) {
      setMsg(err?.message || '')
      setSt('error')
    }
  }
  if (st === 'done')
    return <Done title={`You’re registered${name ? `, ${name.split(' ')[0]}` : ''}.`} text="A confirmation email with the details is on its way. We’ll send a reminder before the day." />
  if (placesLeft === 0) return <p style={{ fontWeight: 700 }}>This event is fully booked. Contact us to join the waiting list.</p>
  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 14 }}>
      <Honeypot />
      <label className="field">Full name<input className="input" name="name" required autoComplete="name" onChange={(e) => setName(e.target.value)} /></label>
      <label className="field">Email<input className="input" name="email" type="email" required autoComplete="email" /></label>
      <label className="field">Tickets
        <select className="input" name="tickets">{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      <label className="field">Access needs (optional)<input className="input" name="accessNeeds" /></label>
      <label className="check"><input type="checkbox" name="marketingConsent" /> Send me CAHN event news. Unsubscribe any time.</label>
      {st === 'error' && <span className="err" role="alert">{msg || 'Something went wrong. Please try again.'}</span>}
      <button type="submit" className="btn btn-ink" disabled={st === 'sending'} style={{ padding: 18 }}>{ctaLabel}</button>
      {typeof placesLeft === 'number' && <span className="muted" style={{ fontSize: 13 }}>{placesLeft} places left</span>}
    </form>
  )
}
