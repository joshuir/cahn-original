import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { RenderBlocks } from '@/components/RenderBlocks'
import { href, isLocale, type Locale } from '@/lib/i18n'
import { list } from '@/lib/payload'
import { docMeta } from '@/lib/seo'

type P = { params: Promise<{ lang: string; slug: string[] }> }

async function getPage(locale: Locale, slug: string[]) {
  const path = `/${slug.join('/')}`
  const docs = await list('pages', locale, { where: { path: { equals: path } }, limit: 1, depth: 2 })
  return docs[0] || null
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const page = await getPage((isLocale(lang) ? lang : 'en') as Locale, slug)
  return page ? docMeta(page, `/${slug.join('/')}`, { title: page.title }) : { title: 'Page not found' }
}

/** CMS pages built with the page builder — About and its subpages, policies, campaigns. */
export default async function CMSPage({ params }: P) {
  const { lang, slug } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const page = await getPage(locale, slug)
  if (!page) notFound()
  const subnav: any[] = page.subnav || []
  return (
    <>
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="wrap" style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 14 }} className="muted">
            <Link href={href(locale, '/')}>Home</Link>
            {page.parent && typeof page.parent === 'object' && (
              <>
                {' / '}
                <Link href={href(locale, page.parent.path)}>{page.parent.title}</Link>
              </>
            )}
            {' / '}
            <span aria-current="page" style={{ color: 'var(--ink)' }}>{page.title}</span>
          </nav>
          {subnav.length > 0 && (
            <nav aria-label="Section" style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 14, fontWeight: 600 }}>
              {subnav.map((s, i) => (
                <Link key={i} href={href(locale, s.url)} style={{ padding: '8px 12px', borderRadius: 999, textDecoration: 'none', background: i === 0 ? 'var(--ink)' : 'transparent', color: i === 0 ? 'var(--paper)' : 'var(--ink)' }}>
                  {s.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
      <RenderBlocks blocks={page.layout} locale={locale} />
    </>
  )
}
