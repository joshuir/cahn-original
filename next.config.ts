import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    // Send visitors to their saved language (cookie set by the globe selector), else English.
    const lang = ['fr', 'pt'].map((l) => ({
      source: '/',
      has: [{ type: 'cookie' as const, key: 'cahn_lang', value: l }],
      destination: `/${l}`,
      permanent: false,
    }))
    return [
      ...lang,
      { source: '/', destination: '/en', permanent: false },
      // Unprefixed paths (old links, typed URLs) → English version
      {
        source: '/:path((?!en(?:/|$)|fr(?:/|$)|pt(?:/|$)|admin|api|next|_next|media|favicon|robots|sitemap).*)',
        destination: '/en/:path',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
