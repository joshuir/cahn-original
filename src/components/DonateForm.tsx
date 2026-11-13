'use client'

import React, { useMemo, useState } from 'react'
import { track } from './CookieConsent'

export type Currency = { code: string; symbol: string; label: string; provider: 'stripe' | 'paystack'; amounts: number[]; methods?: string[] }

export function DonateForm({ currencies, impacts, allowMonthly, feePercent, giftAid, locale, enabled }: { currencies: Currency[]; impacts: string[]; allowMonthly: boolean; feePercent: number; giftAid: boolean; locale: string; enabled: { stripe: boolean; paystack: boolean } }) {
  const [code, setCode] = useState(currencies[0]?.code)
  const [idx, setIdx] = useState(1)
  const [custom, setCustom] = useState('')
  const [freq, setFreq] = useState<'one-off' | 'monthly'>('one-off')
  const [cover, setCover] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [ga, setGa] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const cur = currencies.find((c) => c.code === code) || currencies[0]
  const useCustom = custom !== '' && Number(custom) > 0
  const amount = useCustom ? Number(custom) : cur?.amounts[idx] ?? 0
  const fee = Math.round(amount * (feePercent / 100) * 100) / 100
  const total = Math.round((amount + (cover ? fee : 0)) * 100) / 100
  const fmt = (v: number) => `${cur.symbol}${v.toLocaleString('en-GB', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
  const providerOn = cur ? enabled[cur.provider] : false
  const impact = useMemo(() => (useCustom ? 'Every gift makes a difference — thank you for choosing your own amount.' : impacts[idx] || ''), [useCustom, idx, impacts])

  if (!cur) return <p>Donations are being set up. Please check back soon.</p>

  const give = async () => {
    setErr('')
    if (!(amount > 0)) return setErr('Please choose or enter an amount.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Please enter your email for the receipt.')
    setBusy(true)
    track('begin_checkout', { currency: cur.code, value: total, frequency: freq })
    try {
      const res = await fetch(`/api/donate/${cur.provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: cur.code, frequency: freq, coverFees: cover, email, name, giftAid: ga, locale }),
      })
      const j = await res.json()
      if (!res.ok || !j.url) throw new Error(j.error || 'Payment could not start')
      window.location.href = j.url
    } catch (e: any) {
      setErr(e.message)
      setBusy(false)
    }
  }

  return (
    <div className="stack" style={{ gap: 22 }}>
      {allowMonthly && (
        <div role="radiogroup" aria-label="Frequency" className="seg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {(['one-off', 'monthly'] as const).map((f) => (
            <button key={f} type="button" role="radio" aria-checked={freq === f} aria-selected={freq === f} onClick={() => setFreq(f)}>{f === 'one-off' ? 'One-off' : 'Monthly'}</button>
          ))}
        </div>
      )}
      <label className="field">Currency
        <select className="input" value={code} onChange={(e) => { setCode(e.target.value); setIdx(1); setCustom('') }}>
          {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} {c.symbol} · {c.label}</option>)}
        </select>
      </label>
      <div role="radiogroup" aria-label="Amount" className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {cur.amounts.map((v, i) => {
          const on = !useCustom && idx === i
          return (
            <button key={v} type="button" role="radio" aria-checked={on} onClick={() => { setIdx(i); setCustom('') }} style={{ borderRadius: 18, padding: 18, font: '800 26px var(--font-display)', cursor: 'pointer', background: on ? 'var(--ink)' : '#fff', color: on ? 'var(--paper)' : 'var(--ink)', border: '2px solid var(--ink)' }}>
              {fmt(v)}
            </button>
          )
        })}
      </div>
      <label className="field">Or enter any amount
        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd3c2', borderRadius: 12, padding: '0 14px', background: '#fff' }}>
          <span className="muted" style={{ fontWeight: 700 }}>{cur.symbol}</span>
          <input type="number" min={1} step="any" inputMode="decimal" placeholder="Other amount" value={custom} onChange={(e) => setCustom(e.target.value)} style={{ flex: 1, border: 0, outline: 'none', padding: '14px 8px', font: '600 16px var(--font-body)', minWidth: 0 }} />
        </div>
      </label>
      {impact && <p style={{ background: 'var(--paper)', borderRadius: 16, padding: 16, lineHeight: 1.55 }}><strong style={{ color: 'var(--green)' }}>{fmt(amount)}</strong> {impact}</p>}
      <div className="grid g2" style={{ gap: 12 }}>
        <label className="field">Email for your receipt<input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="field">Name (optional)<input className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
      </div>
      <div style={{ background: 'var(--paper)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span className="muted">Processed securely by</span><strong>{cur.provider === 'paystack' ? 'Paystack · African payments' : 'Stripe · international payments'}</strong></div>
        {cur.methods?.length ? <div className="row" style={{ gap: 6 }}>{cur.methods.map((m) => <span key={m} style={{ padding: '6px 10px', borderRadius: 8, background: '#fff', fontSize: 12, fontWeight: 600 }}>{m}</span>)}</div> : null}
      </div>
      {feePercent > 0 && <label className="check"><input type="checkbox" checked={cover} onChange={() => setCover(!cover)} /> Add {fmt(fee)} to cover processing fees</label>}
      {giftAid && cur.code === 'GBP' && <label className="check"><input type="checkbox" checked={ga} onChange={() => setGa(!ga)} /> I am a UK taxpayer and want CAHN to claim Gift Aid on this and any future donations.</label>}
      {err && <span className="err" role="alert">{err}</span>}
      {!providerOn && <span className="err" role="status">Online payments in {cur.code} are not switched on yet. Please choose another currency or contact us.</span>}
      <button type="button" className="btn btn-red" onClick={give} disabled={busy || !providerOn} style={{ padding: 20, fontSize: 18 }}>
        {busy ? 'Opening secure checkout…' : `Donate ${fmt(total)}${freq === 'monthly' ? ' / month' : ''}`}
      </button>
      <span className="muted" style={{ fontSize: 12, textAlign: 'center' }}>You’ll complete payment on {cur.provider === 'paystack' ? 'Paystack' : 'Stripe'}’s secure page. CAHN never sees your card details.</span>
    </div>
  )
}
