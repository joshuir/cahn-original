import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingTop: 120, paddingBottom: 140 }}>
      <div className="stack" style={{ gap: 20, maxWidth: 720 }}>
        <div className="tri"><span /><span /><span /></div>
        <h1 className="display">We can’t find that page.</h1>
        <p className="lede">It may have moved when we rebuilt our website. Try searching, or head back to the homepage.</p>
        <div className="row" style={{ gap: 12 }}>
          <Link href="/en/search" className="btn btn-ink">Search the site</Link>
          <Link href="/en" className="btn btn-line">Go to homepage</Link>
        </div>
      </div>
    </section>
  )
}
