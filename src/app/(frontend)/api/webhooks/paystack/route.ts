import { getPayload } from '@/lib/payload'
import { markDonation, paystackSignatureValid } from '@/lib/payments'

/** Paystack → CAHN. Set in Paystack Dashboard → Settings → API Keys & Webhooks → /api/webhooks/paystack */
export async function POST(req: Request) {
  const raw = await req.text()
  if (!paystackSignatureValid(raw, req.headers.get('x-paystack-signature'))) return new Response('Bad signature', { status: 401 })
  const evt = JSON.parse(raw)
  const payload = await getPayload()
  const ref = evt?.data?.reference || evt?.data?.metadata?.reference
  switch (evt?.event) {
    case 'charge.success':
      if (ref) await markDonation(payload, ref, 'paid', { providerRef: String(evt.data.id), subscriptionRef: evt.data?.plan?.plan_code || undefined })
      break
    case 'charge.failed':
      if (ref) await markDonation(payload, ref, 'failed')
      break
    case 'refund.processed':
      if (evt.data?.transaction_reference) await markDonation(payload, evt.data.transaction_reference, 'refunded')
      break
  }
  return Response.json({ received: true })
}
