import { getPayload } from '@/lib/payload'
import { startStripe, validateDonation } from '@/lib/payments'
import { rateLimit } from '@/lib/guard'

export async function POST(req: Request) {
  if (!rateLimit(req, 'donate', 10)) return Response.json({ error: 'Too many attempts — please wait a minute.' }, { status: 429 })
  try {
    const payload = await getPayload()
    const v = await validateDonation(payload, await req.json(), 'stripe')
    return Response.json(await startStripe(payload, v))
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Could not start payment' }, { status: 400 })
  }
}
