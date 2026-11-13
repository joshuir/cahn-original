import type { Metadata } from 'next'
import { mediaURL } from '@/components/Media'
import { LOCALES } from './i18n'

/** Builds page metadata from a doc's SEO plugin fields, with sensible fallbacks. */
export function docMeta(doc: any, path: string, fallback: { title: string; description?: string }): Metadata {
  const meta = doc?.meta || {}
  const title = meta.title || doc?.title || fallback.title
  const description = meta.description || doc?.summary || doc?.excerpt || fallback.description
  const image = mediaURL(meta.image) || mediaURL(doc?.image, 'hero')
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])) },
  }
}
