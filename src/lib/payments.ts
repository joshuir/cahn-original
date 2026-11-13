import crypto from 'crypto'
import type { Payload } from 'payload'
import Stripe from 'stripe'
import { sendDonationReceipt } from '@/utilities/email'
import { SITE_URL } from '@/utilities/preview'

export type DonationInput = {
  amount: number
  currency: string
  frequency: 'one-off' | 'monthly'
  coverFees?: boolean
  email: string
  name?: string
  giftAid?: boolean
  locale?: string
}

// Currencies whose smallest unit is the major unit (no decimals) for Stripe.
const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'XAF', 'XOF', 'UGX', 'RWF'])
const minor = (amount: number, currency: string) => (ZERO_DECIMAL.has(currency) ? Math.round(amount) : Math.round(amount * 100))

export const newReference = () => `CAHN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

/** Validates a donation request against Donation settings in the CMS. */
export async function validateDonation(payload: Payload, body: any, provider: 'stripe' | 'paystack') {
  const ds: any = await payload.findGlobal({ slug: 'donation-settings', depth: 0 })
  const currency = String(body?.currency || '').toUpperCase()
  const cfg = (ds?.currencies || []).find((c: any) => c.code?.toUpperCase() === currency)
  if (!cfg) throw new Error('That currency is not available.')
  if (cfg.provider !== provider) throw new Error('That currency uses a different payment provider.')
  const amount = Number(body?.amount)
  if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) throw new Error('Please enter a valid amount.')
  const email = String(body?.email || '').trim().slice(0, 200)
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Please enter a valid email address.')
  const frequency = body?.frequency === 'monthly' && ds?.allowMonthly !== false ? 'monthly' : 'one-off'
  const feePct = Number(ds?.coverFeesPercent ?? 3)
  const fees = body?.coverFees ? Math.round(amount * (feePct / 100) * 100) / 100 : 0
  return {
    amount: Math.round(amount * 100) / 100,
    fees,
    currency,
    frequency,
    email,
    name: String(body?.name || '').slice(0, 120),
    giftAid: Boolean(body?.giftAid) && Boolean(ds?.giftAid) && currency === 'GBP',
    locale: ['en', 'fr', 'pt'].includes(body?.locale) ? body.locale : 'en',
  } as const
}

// ─── Stripe ──────────────────────────────────────────────────────────────

export const stripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe is not configured.')
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function startStripe(payload: Payload, v: Awaited<ReturnType<typeof validateDonation>>) {
  const s = stripe() // throws before anything is stored if Stripe isn't configured
  const reference = newReference()
  const total = v.amount + v.fees
  await payload.create({
    collection: 'donations',
    overrideAccess: true,
    data: { reference, provider: 'stripe', amount: v.amount, coveredFees: v.fees, currency: v.currency, frequency: v.frequency, status: 'pending', email: v.email, name: v.name, giftAid: v.giftAid },
  })
  const session = await s.checkout.sessions.create({
    mode: v.frequency === 'monthly' ? 'subscription' : 'payment',
    customer_email: v.email,
    client_reference_id: reference,
    metadata: { reference, giftAid: String(v.giftAid) },
    ...(v.frequency === 'monthly' ? { subscription_data: { metadata: { reference } } } : { payment_intent_data: { metadata: { reference } } }),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: v.currency.toLowerCase(),
          unit_amount: minor(total, v.currency),
          product_data: { name: v.frequency === 'monthly' ? 'Monthly gift to CAHN' : 'Gift to CAHN' },
          ...(v.frequency === 'monthly' ? { recurring: { interval: 'month' as const } } : {}),
        },
      },
    ],
    success_url: `${SITE_URL}/${v.locale}/donate/thank-you?ref=${reference}`,
    cancel_url: `${SITE_URL}/${v.locale}/donate/thank-you?ref=${reference}&cancelled=1`,
  })
  await payload.update({ collection: 'donations', overrideAccess: true, where: { reference: { equals: reference } }, data: { providerRef: session.id } })
  return { url: session.url, reference }
}

// ─── Paystack ────────────────────────────────────────────────────────────

const PAYSTACK = 'https://api.paystack.co'
async function paystack(path: string, init: RequestInit = {}) {
  if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('Paystack is not configured.')
  const res = await fetch(`${PAYSTACK}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok || j?.status === false) throw new Error(j?.message || 'Paystack request failed')
  return j.data
}

export async function startPaystack(payload: Payload, v: Awaited<ReturnType<typeof validateDonation>>) {
  if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('Paystack is not configured.')
  const reference = newReference()
  const total = v.amount + v.fees
  const amountMinor = Math.round(total * 100) // kobo / pesewas / cents
  await payload.create({
    collection: 'donations',
    overrideAccess: true,
    data: { reference, provider: 'paystack', amount: v.amount, coveredFees: v.fees, currency: v.currency, frequency: v.frequency, status: 'pending', email: v.email, name: v.name },
  })
  let plan: string | undefined
  if (v.frequency === 'monthly') {
    const p = await paystack('/plan', { method: 'POST', body: JSON.stringify({ name: `CAHN monthly ${v.currency} ${total}`, interval: 'monthly', amount: amountMinor, currency: v.currency }) })
    plan = p.plan_code
  }
  const init = await paystack('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: v.email,
      amount: amountMinor,
      currency: v.currency,
      reference,
      plan,
      callback_url: `${SITE_URL}/${v.locale}/donate/thank-you?ref=${reference}`,
      metadata: { reference, name: v.name },
    }),
  })
  return { url: init.authorization_url as string, reference }
}

/** Confirms a Paystack transaction by reference and updates the donation. */
export async function verifyPaystack(payload: Payload, reference: string) {
  const data = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`)
  await markDonation(payload, reference, data.status === 'success' ? 'paid' : data.status === 'abandoned' ? 'cancelled' : 'failed', { providerRef: String(data.id) })
}

export function paystackSignatureValid(raw: string, signature: string | null) {
  if (!process.env.PAYSTACK_SECRET_KEY || !signature) return false
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(raw).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
  } catch {
    return false
  }
}

// ─── Shared ──────────────────────────────────────────────────────────────

export async function markDonation(payload: Payload, reference: string, status: 'paid' | 'failed' | 'cancelled' | 'refunded', extra: Record<string, unknown> = {}) {
  const r = await payload.find({ collection: 'donations', where: { reference: { equals: reference } }, limit: 1, overrideAccess: true })
  const d: any = r.docs[0]
  if (!d) return
  const wasPaid = d.status === 'paid'
  const updated = await payload.update({ collection: 'donations', id: d.id, overrideAccess: true, data: { status, ...extra } })
  if (status === 'paid' && !wasPaid) await sendDonationReceipt(payload, updated).catch((e) => payload.logger.error(e))
}
