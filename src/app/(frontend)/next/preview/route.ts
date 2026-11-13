import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

/** Turns on draft mode for signed-in CMS users, then opens the requested page. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') || '/en'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Invalid path', { status: 400 })
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Sign in to the CMS to preview drafts.', { status: 403 })
  ;(await draftMode()).enable()
  redirect(path)
}
