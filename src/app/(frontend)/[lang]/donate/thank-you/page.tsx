import Link from 'next/link'
import React from 'react'
import { Icon } from '@/components/Icon'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { getPayload } from '@/lib/payload'
import { verifyPaystack } from '@/lib/payments'

export const metadata = { title: 'Thank you', robots: { index: false } }

/**
 * Return page after checkout. Status comes from the payment webhook; for Paystack
 * we also verify the reference directly so the donor sees an accurate result.
 */
export default async function ThankYou({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ ref?: string; reference?: string; cancelled?: string }> }) {
  const { lang } = await params
  const sp = await searchParams
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const ref = (sp.ref || sp.reference || '').slice(0, 80)
  const payload = await getPayload()
  let donation: any = null
  if (ref) {
    const r = await payload.find({ collection: 'donations', where: { reference: { equals: ref } }, limit: 1, overrideAccess: true })
    donation = r.docs[0] || null
    if (donation?.provider === 'paystack' && donation.status === 'pending') {
      await verifyPaystack(payload, ref).catch(() => null)
      donation = (await payload.find({ collection: 'donations', where: { reference: { equals: ref } }, limit: 1, overrideAccess: true })).docs[0]
    }
  }
  const failed = sp.cancelled || donation?.status === 'failed' || donation?.status === 'cancelled'
  return (
    <section className="wrap" style={{ paddingTop: 96, paddingBottom: 120, maxWidth: 760 }}>
      <div className="panel stack" style={{ gap: 18 }}>
        {failed ? (
          <>
            <span className="h2">Your payment didn’t go through</span>
            <p className="muted" style={{ lineHeight: 1.6 }}>No money has been taken. You can try again, choose another currency, or contact us for other ways to give.</p>
            <Link href={href(locale, '/donate')} className="btn btn-red" style={{ alignSelf: 'flex-start' }}>Try again</Link>
          </>
        ) : (
          <>
            <div className="ok-badge"><Icon name="check" size={30} stroke={2.5} /></div>
            <span className="h2">Thank you{donation?.name ? `, ${donation.name.split(' ')[0]}` : ''}.</span>
            <p className="muted" style={{ lineHeight: 1.6 }}>
              {donation
                ? `Your ${donation.frequency === 'monthly' ? 'monthly ' : ''}gift of ${donation.currency} ${Number(donation.amount + (donation.coveredFees || 0)).toFixed(2)} ${donation.status === 'paid' ? 'has been received' : 'is being confirmed'}. A receipt is on its way to your inbox.`
                : 'Your gift is being confirmed. A receipt is on its way to your inbox.'}
            </p>
            {ref && <p className="muted" style={{ fontSize: 14 }}>Reference: <strong>{ref}</strong></p>}
            <Link href={href(locale, '/')} className="btn btn-ink" style={{ alignSelf: 'flex-start' }}>Back to home</Link>
          </>
        )}
      </div>
    </section>
  )
}
