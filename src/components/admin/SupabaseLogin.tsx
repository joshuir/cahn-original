'use client'

import React, { useState } from 'react'

/** Shown above Payload's login form: sign in with the existing CAHN Supabase account. */
export function SupabaseLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/cms-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error || 'Sign-in failed')
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      window.location.href = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/admin'
    } catch (e: any) {
      setErr(e.message)
      setBusy(false)
    }
  }

  const field: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--theme-elevation-150)', background: 'var(--theme-input-bg)', color: 'var(--theme-text)', fontSize: 15 }
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', height: 5, borderRadius: 4, overflow: 'hidden', marginBottom: 18 }}>
        <span style={{ flex: 1, background: '#C23A2B' }} />
        <span style={{ flex: 1, background: '#F0B323' }} />
        <span style={{ flex: 1, background: '#0B6B3F' }} />
      </div>
      <h2 style={{ margin: '0 0 6px', fontSize: 22 }}>Sign in to CAHN Studio</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-600)', fontSize: 14 }}>Use your CAHN account — the same email and password as the CAHN Supabase admin.</p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
          Email
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
          Password
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={field} />
        </label>
        {err && <p role="alert" style={{ color: '#C23A2B', margin: 0, fontSize: 14, fontWeight: 600 }}>{err}</p>}
        <button type="submit" disabled={busy} style={{ padding: '13px 18px', borderRadius: 999, border: 0, background: '#0B6B3F', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          {busy ? 'Signing in…' : 'Sign in with CAHN account'}
        </button>
      </form>
      <p style={{ margin: '20px 0 0', fontSize: 12, color: 'var(--theme-elevation-500)', textAlign: 'center' }}>— or use a CMS-only account below —</p>
    </div>
  )
}

/** Replaces the logout button so the Supabase session is ended too. */
export function SupabaseLogoutButton() {
  const logout = async () => {
    await fetch('/api/cms-auth/logout', { method: 'POST' }).catch(() => null)
    window.location.href = '/admin/logout'
  }
  return (
    <button type="button" onClick={logout} aria-label="Log out" title="Log out" style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--theme-text)', padding: 8, display: 'flex' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
    </button>
  )
}
