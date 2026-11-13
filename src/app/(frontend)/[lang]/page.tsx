import Link from 'next/link'
import React from 'react'
import { NewsletterForm } from '@/components/Forms'
import { BannerRotator, type Banner } from '@/components/home/BannerRotator'
import { CeoFilm } from '@/components/home/CeoFilm'
import { HealthHourPhone, type Flyer } from '@/components/home/HealthHourPhone'
import { Icon } from '@/components/Icon'
import { Img, mediaURL, youtubeId } from '@/components/Media'
import { ShortCountdown } from '@/components/Motion'
import { EventCard } from '@/components/Cards'
import { href, isLocale, t, type Locale } from '@/lib/i18n'
import { getHomepage, list } from '@/lib/payload'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (isLocale(lang) ? lang : 'en') as Locale
  const d = t(locale)
  const now = new Date().toISOString()

  const [home, bannersRaw, partners, sessions, events] = await Promise.all([
    getHomepage(locale),
    list('banners', locale, {
      sort: '_order',
      where: {
        and: [
          { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] },
          { or: [{ endsAt: { exists: false } }, { endsAt: { greater_than: now } }] },
        ],
      },
    }),
    list('partners', locale, { sort: '_order', where: { showInCarousel: { equals: true } } }),
    list('health-hour-sessions', locale, { sort: '_order', where: { showInMockup: { equals: true } }, limit: 12 }),
    home_events(locale, now),
  ])

  const hero = home?.hero || {}
  const heroImgs: any[] = hero.images || []

  const banners: Banner[] = bannersRaw.map((b) => ({
    id: b.id,
    title: b.title,
    tag: b.tag,
    tagColour: b.tagColour,
    line: b.line,
    linkLabel: b.linkLabel,
    href: href(locale, b.linkUrl),
    image: mediaURL(b.image, 'hero'),
    imageAlt: b.image?.alt,
    video: mediaURL(b.video),
  }))

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London' })
  const flyers: Flyer[] = sessions.slice(0, home?.healthHour?.maxFlyers || 8).map((s) => ({
    id: s.id,
    topic: s.topic,
    date: fmt(s.sessionDate),
    upcoming: s.sessionDate >= now,
    image: mediaURL(s.flyer),
    alt: s.flyer?.alt,
  }))

  // Repeat logos so one half of the loop is always wider than the screen, then double it for a seamless loop
  const base: any[] = []
  while (partners.length && base.length < 10) base.push(...partners)
  const loop = [...base, ...base]
  const vid = home?.ceoVideo || {}
  const hh = home?.healthHour || {}
  const areas: any[] = home?.areas || []
  const manifesto = home?.manifesto || {}

  return (
    <>
      {/* 1 · HERO — restored original; no additional CTAs */}
      <section className="hero">
        <svg className="hero-pulse" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 190 H360 L400 190 L425 120 L450 250 L478 60 L505 210 L530 190 H760 L800 190 C860 190 880 150 940 150 C1000 150 1020 190 1080 190 H1440" fill="none" stroke="var(--gold)" strokeWidth="2.2" />
        </svg>
        <div className="wrap">
          <div style={{ flex: '1 1 560px', minWidth: 0 }} className="stack">
            {hero.eyebrow && (
              <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: '#B9C6BE', fontWeight: 600 }}>
                <div className="tri"><span /><span /><span /></div>
                {hero.eyebrow}
              </div>
            )}
            <h1 className="rise" style={{ animationDelay: '.1s' }}>
              {hero.headline} {hero.highlight && <em>{hero.highlight}</em>}
            </h1>
            {hero.lede && <p className="lede rise" style={{ animationDelay: '.2s' }}>{hero.lede}</p>}
          </div>
          <div className="hero-photos">
            <Img media={heroImgs[0]} label="Community health check, Manchester" className="shape-arch rise" style={{ height: 420, animationDelay: '.2s' }} size="hero" priority />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 64 }}>
              <Img media={heroImgs[1]} label="Health Hour clinician" className="shape-round rise" style={{ height: 230, animationDelay: '.35s' }} priority />
              <Img media={heroImgs[2]} label="Windrush Day families" className="shape-door rise" style={{ height: 190, animationDelay: '.5s' }} priority />
            </div>
            <Link href={href(locale, '/health-hour')} className="hero-chip lift rise" style={{ animationDelay: '.7s' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pulse" size={20} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="tag muted">{d.liveSat}</span>
                <span style={{ font: '700 18px var(--font-display)' }}>{d.startsIn} <ShortCountdown /></span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · ROTATING BANNERS — automatic, no controls */}
      {home?.banners?.enabled !== false && <BannerRotator banners={banners} seconds={home?.banners?.seconds || 6} label="Featured from CAHN" />}

      {/* 3 · PARTNERS — infinite logo carousel */}
      {home?.partners?.enabled !== false && partners.length > 0 && (
        <section className="white" aria-labelledby="partners-h" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap between" style={{ paddingTop: 56, paddingBottom: 24 }}>
            <div className="stack" style={{ gap: 10 }}>
              <span className="eyebrow">{home.partners.eyebrow}</span>
              <h2 id="partners-h" style={{ font: '800 clamp(30px, 3.5vw, 44px)/1.05 var(--font-display)' }}>{home.partners.heading}</h2>
            </div>
            <Link href={href(locale, '/about#partners')} style={{ fontWeight: 600 }}>{d.allPartners} →</Link>
          </div>
          <div className="mq">
            <div className="marquee" style={{ ['--loop' as any]: `${home.partners.loopSeconds || 48}s` }}>
              {loop.map((p, n) => {
                const dup = n >= partners.length
                const logo = mediaURL(p.logo, 'thumb')
                const inner = logo ? <img src={logo} alt={dup ? '' : p.name} loading="lazy" /> : p.name
                return p.url ? (
                  <a key={`${p.id}-${n}`} href={p.url} className="logo-tile" target="_blank" rel="noopener noreferrer" aria-hidden={dup || undefined} tabIndex={dup ? -1 : 0} aria-label={dup ? undefined : p.name}>
                    {inner}
                  </a>
                ) : (
                  <span key={`${p.id}-${n}`} className="logo-tile" aria-hidden={dup || undefined}>{inner}</span>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4 · CEO VIDEO — immediately after the partner carousel */}
      {vid.enabled !== false && (
        <section className="ink" aria-labelledby="film-h">
          <div className="wrap sec stack" style={{ gap: 36 }}>
            <div className="between">
              <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
                <span className="eyebrow">{vid.eyebrow}</span>
                <h2 id="film-h" style={{ font: '800 clamp(38px, 5vw, 68px)/0.98 var(--font-display)', letterSpacing: '-0.03em' }}>{vid.title}</h2>
              </div>
              {vid.text && <p className="muted" style={{ maxWidth: 440, fontSize: 18, lineHeight: 1.6 }}>{vid.text}</p>}
            </div>
            <CeoFilm youtubeId={youtubeId(vid.youtubeUrl)} file={mediaURL(vid.file)} captions={mediaURL(vid.captions)} poster={mediaURL(vid.poster, 'hero')} title={vid.title || 'Our Work'} label={d.playFilm} />
          </div>
        </section>
      )}

      {/* 5 · HEALTH HOUR — animated mobile mockup */}
      {hh.enabled !== false && (
        <section className="gold-bg" aria-labelledby="hh-h" style={{ overflow: 'hidden' }}>
          <div className="wrap sec" style={{ display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="stack" style={{ flex: '1 1 520px', gap: 22 }}>
              <span className="eyebrow">{hh.eyebrow}</span>
              <h2 id="hh-h" style={{ font: '800 clamp(40px, 5vw, 72px)/0.98 var(--font-display)', letterSpacing: '-0.03em' }}>{hh.heading}</h2>
              {hh.text && <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 560 }}>{hh.text}</p>}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 560 }}>
                <div className="ink" style={{ borderRadius: 22, padding: 22 }}>
                  <div style={{ font: '800 44px/1 var(--font-display)', color: 'var(--gold)' }}>{hh.sessionsCount || '400+'}</div>
                  <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{d.sessionsSince}</div>
                </div>
                <div className="white" style={{ borderRadius: 22, padding: 22 }}>
                  <div style={{ font: '800 30px/1.1 var(--font-display)' }}><ShortCountdown /></div>
                  <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{d.untilSat}</div>
                </div>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <Link href={href(locale, '/health-hour#register')} className="btn btn-ink">{d.registerHH} →</Link>
                <Link href={href(locale, '/health-hour#replays')} className="btn btn-line">{d.pastSessions}</Link>
              </div>
            </div>
            <HealthHourPhone flyers={flyers} seconds={hh.flyerSeconds || 4} labels={{ upcoming: d.upcoming, replay: d.replay, nowShowing: d.nowShowing }} />
          </div>
        </section>
      )}

      {/* 6 · Areas of work */}
      {areas.length > 0 && (
        <section className="wrap" style={{ paddingTop: 96, paddingBottom: 48 }}>
          <h2 className="h2 reveal" style={{ marginBottom: 32 }}>{d.areas}</h2>
          <div className="grid g4">
            {areas.map((a, n) => (
              <Link key={n} href={href(locale, a.url)} className="card lift reveal">
                <Img media={a.image} label={a.title} warm style={{ height: 200 }} />
                <div className="card-body">
                  <span className="tag" style={{ color: 'var(--green)' }}>{String(n + 1).padStart(2, '0')}</span>
                  <span className="h3">{a.title}</span>
                  {a.text && <span className="muted" style={{ lineHeight: 1.55, fontSize: 15 }}>{a.text}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7 · Coming up */}
      {home?.showEvents !== false && events.length > 0 && (
        <section className="wrap" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div className="between" style={{ marginBottom: 32 }}>
            <h2 className="h2">{d.comingUp}</h2>
            <Link href={href(locale, '/events')} style={{ fontWeight: 600 }}>{d.allEvents} →</Link>
          </div>
          <div className="grid g3">
            {events.map((e) => (
              <EventCard key={e.id} e={e} locale={locale} d={d} />
            ))}
          </div>
        </section>
      )}

      {/* 8 · Manifesto + e-bulletin */}
      <section className="wrap" style={{ paddingTop: 48, paddingBottom: 96, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {(manifesto.documents || []).length > 0 && (
          <div className="ink stack reveal" style={{ flex: '1 1 560px', borderRadius: 32, padding: 40, gap: 22 }}>
            <span className="eyebrow">{manifesto.eyebrow}</span>
            <h2 style={{ font: '800 40px/1.05 var(--font-display)' }}>{manifesto.heading}</h2>
            <div style={{ borderTop: '1px solid rgba(247,242,233,.2)' }}>
              {manifesto.documents.map((p: any) => (
                <a key={p.id} href={mediaURL(p.file) || href(locale, '/research')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(247,242,233,.2)', color: 'var(--paper)', textDecoration: 'none', font: '600 20px var(--font-display)' }}>
                  {p.title}
                  <span style={{ font: '600 13px var(--font-body)', color: 'var(--gold)' }}>PDF ↓</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="stack reveal" style={{ flex: '1 1 460px', border: '2px solid var(--ink)', borderRadius: 32, padding: 40, gap: 18, justifyContent: 'center' }}>
          <h2 style={{ font: '800 38px/1.05 var(--font-display)' }}>{d.bulletin}</h2>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.55 }}>{d.bulletinText}</p>
          <NewsletterForm locale={locale} labels={{ email: d.email, signUp: d.signUp, consent: d.consent, thanks: d.thanksSub, error: d.submitError }} />
        </div>
      </section>
    </>
  )
}

async function home_events(locale: Locale, now: string) {
  return list('events', locale, { where: { or: [{ startsAt: { greater_than_equal: now } }, { dateTBC: { equals: true } }] }, sort: 'startsAt', limit: 3 })
}
