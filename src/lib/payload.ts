import config from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload as gp } from 'payload'
import type { Locale } from './i18n'

export const getPayload = cache(async () => gp({ config }))

/** True while an editor is previewing drafts from the CMS. */
export const isDraft = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const getSettings = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }) as Promise<any>
})

export const getHomepage = cache(async (locale: Locale) => {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'homepage', locale, depth: 2, draft: await isDraft() }) as Promise<any>
})

/** Generic list helper that respects drafts while previewing. */
export async function list(collection: any, locale: Locale, opts: { where?: any; sort?: string; limit?: number; depth?: number } = {}) {
  const payload = await getPayload()
  const draft = await isDraft()
  const res = await payload.find({
    collection,
    locale,
    draft,
    where: opts.where,
    sort: opts.sort,
    limit: opts.limit ?? 100,
    depth: opts.depth ?? 1,
    overrideAccess: false,
  })
  return res.docs as any[]
}

export async function bySlug(collection: any, slug: string, locale: Locale, depth = 2) {
  const docs = await list(collection, locale, { where: { slug: { equals: slug } }, limit: 1, depth })
  return docs[0] || null
}
