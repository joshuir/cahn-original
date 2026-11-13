import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import '../globals.css'
import { CookieConsent } from '@/components/CookieConsent'
import { Footer } from '@/components/Footer'
import { Header, type NavItem } from '@/components/Header'
import { LivePreview } from '@/components/LivePreview'
import { mediaURL } from '@/components/Media'
import { Reveal } from '@/components/Motion'
import { href, isLocale, LOCALES, t } from '@/lib/i18n'
import { getSettings, isDraft } from '@/lib/payload'
import { themeFromSettings } from '@/lib/theme'
import { SITE_URL } from '@/utilities/preview'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = { themeColor: '#0F1F18', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : 'en'
  const s = await getSettings(locale).catch(() => null)
  const name = s?.siteName || 'Caribbean & African Health Network'
  const og = mediaURL(s?.ogImage)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} (CAHN)`, template: `%s · CAHN` },
    description: s?.defaultDescription || 'Healthier lives for Caribbean & African communities — within a generation.',
    openGraph: { siteName: name, type: 'website', locale, images: og ? [og] : undefined },
    icons: mediaURL(s?.favicon) ? { icon: mediaURL(s?.favicon) as string } : undefined,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])) },
  }
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const locale = lang
  const s = await getSettings(locale)
  const d = t(locale)
  const theme = themeFromSettings(s)
  const draft = await isDraft()
  const nav: NavItem[] = (s?.mainNav || []).map((n: any) => ({
    label: n.label,
    url: n.url,
    blurb: n.blurb,
    children: (n.children || []).map((c: any) => ({ label: c.label, url: c.url })),
  }))

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: s?.siteName,
    alternateName: 'CAHN',
    url: SITE_URL,
    email: s?.email,
    telephone: s?.helpline,
    address: s?.address,
    sameAs: (s?.social || []).map((x: any) => x.url),
  }

  return (
    <html lang={locale} data-motion={theme.motion}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={theme.fontsURL} />
        <style dangerouslySetInnerHTML={{ __html: theme.css }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </head>
      <body>
        {draft && <LivePreview serverURL={SITE_URL} />}
        {draft && (
          <div style={{ background: 'var(--gold)', color: 'var(--ink)', textAlign: 'center', padding: 8, fontSize: 13, fontWeight: 700 }}>
            Preview mode — you are seeing unpublished changes. <a href="/next/exit-preview" style={{ color: 'var(--ink)' }}>Exit preview</a>
          </div>
        )}
        <Header
          locale={locale}
          nav={nav}
          d={d}
          helpline={s?.helpline}
          utility={s?.utilityText}
          logo={mediaURL(s?.logo)}
          siteName={s?.siteName || 'Caribbean & African Health Network'}
        />
        <main id="main">{children}</main>
        <Footer locale={locale} s={s} />
        <CookieConsent
          ga4Id={s?.ga4Id}
          text={s?.cookieText || ''}
          labels={{ accept: d.cookieAccept, essential: d.cookieEssential, policy: d.cookiePolicy }}
          policyHref={href(locale, '/cookies')}
        />
        <Reveal />
      </body>
    </html>
  )
}
