export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Builds the admin live-preview / preview URL for a front-end path. */
export const previewURL = (path: string, locale?: string) => {
  const lang = locale && locale !== 'all' ? locale : 'en'
  const full = `/${lang}${path === '/' ? '' : path}`
  return `${SITE_URL}/next/preview?path=${encodeURIComponent(full)}`
}

export const LIVE_PREVIEW_BREAKPOINTS = [
  { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
  { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
]
