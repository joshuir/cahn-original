import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/utilities/preview'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/', '/*/search', '/*/donate/thank-you'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
