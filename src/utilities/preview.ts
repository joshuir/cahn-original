const vercelHost =
  process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL

/** Public address: explicit setting, else the Vercel deployment's own URL, else localhost. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')).replace(/\/$/, '')

/** Every origin this deployment answers on (used for CORS / CSRF). */
export const ALLOWED_ORIGINS = Array.from(
  new Set(
    [SITE_URL, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
      .filter(Boolean)
      .map((h) => (String(h).startsWith('http') ? String(h) : `https://${h}`).replace(/\/$/, '')),
  ),
)

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
