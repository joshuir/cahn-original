import React from 'react'

const Mark = ({ size = 40 }: { size?: number }) => (
  <span style={{ width: size, height: size, borderRadius: size * 0.3, background: '#0F1F18', display: 'inline-flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', flex: 'none' }}>
    <b style={{ color: '#F7F2E9', fontSize: size * 0.32, textAlign: 'center', paddingBottom: size * 0.1, fontWeight: 800 }}>CAHN</b>
    <span style={{ display: 'flex', height: size * 0.13 }}>
      <span style={{ flex: 1, background: '#C23A2B' }} />
      <span style={{ flex: 1, background: '#F0B323' }} />
      <span style={{ flex: 1, background: '#0B6B3F' }} />
    </span>
  </span>
)

/** Login-screen logo */
export function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      <Mark size={52} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, fontWeight: 700, fontSize: 18 }}>
        <span>CAHN Studio</span>
        <span style={{ fontWeight: 500, fontSize: 13, opacity: 0.7 }}>Caribbean &amp; African Health Network</span>
      </span>
    </span>
  )
}

/** Small icon in the admin navigation */
export function Icon() {
  return <Mark size={28} />
}
