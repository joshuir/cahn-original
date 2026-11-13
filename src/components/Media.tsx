import React from 'react'

type M = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; mimeType?: string | null; sizes?: Record<string, { url?: string | null; width?: number | null }> } | null | undefined | number | string

export const mediaURL = (m: M, size?: 'thumb' | 'card' | 'hero'): string | null => {
  if (!m || typeof m !== 'object') return null
  if (size && m.sizes?.[size]?.url) return m.sizes[size]!.url as string
  return m.url || null
}

/**
 * Renders a CMS image, or the labelled striped placeholder from the design
 * when no image has been uploaded yet.
 */
export function Img({
  media,
  label,
  className = '',
  style,
  size = 'card',
  warm = false,
  fit = 'cover',
  priority = false,
}: {
  media?: M
  label: string
  className?: string
  style?: React.CSSProperties
  size?: 'thumb' | 'card' | 'hero'
  warm?: boolean
  fit?: 'cover' | 'contain'
  priority?: boolean
}) {
  const m = media && typeof media === 'object' ? media : null
  const src = mediaURL(m, size)
  if (!src) {
    return (
      <div role="img" aria-label={`Image placeholder: ${label}`} className={`${warm ? 'ph-warm' : 'ph'} ${className}`} style={{ display: 'flex', alignItems: 'flex-end', padding: 18, ...style }}>
        {label}
      </div>
    )
  }
  const srcSet = m?.sizes
    ? Object.values(m.sizes)
        .filter((s) => s?.url && s?.width)
        .map((s) => `${s!.url} ${s!.width}w`)
        .join(', ')
    : undefined
  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      <img
        src={src}
        srcSet={srcSet || undefined}
        sizes="(max-width: 700px) 100vw, 50vw"
        alt={m?.alt || ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: fit }}
      />
    </div>
  )
}

export const youtubeId = (url?: string | null) => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
