import { getPayload } from '@/lib/payload'
import { markDonation, stripe } from '@/lib/payments'

/** Stripe → CAHN. Configure in Stripe Dashboard → Developers → Webhooks → /api/webhooks/stripe */
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !secret) return new Response('Not configured', { status: 400 })
  const raw = await req.text()
  let event
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret)
  } catch {
    return new Response('Bad signature', { status: 400 })
  }
  const payload = await getPayload()
  const obj: any = event.data.object
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      if (obj.payment_status === 'paid' || obj.mode === 'subscription') {
        await markDonation(payload, obj.client_reference_id || obj.metadata?.reference, 'paid', { subscriptionRef: obj.subscription || undefined })
      }
      break
    case 'checkout.session.async_payment_failed':
      await markDonation(payload, obj.client_reference_id || obj.metadata?.reference, 'failed')
      break
    case 'checkout.session.expired':
      await markDonation(payload, obj.client_reference_id || obj.metadata?.reference, 'cancelled')
      break
    case 'charge.refunded':
      if (obj.metadata?.reference) await markDonation(payload, obj.metadata.reference, 'refunded')
      break
    case 'customer.subscription.deleted':
      if (obj.metadata?.reference) await markDonation(payload, obj.metadata.reference, 'cancelled')
      break
  }
  return Response.json({ received: true })
}
