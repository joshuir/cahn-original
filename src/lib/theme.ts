const FONT_PAIRS: Record<string, { url: string; display: string; body: string }> = {
  'bricolage-inter': {
    url: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap',
    display: "'Bricolage Grotesque'",
    body: 'Inter',
  },
  'fraunces-inter': {
    url: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;500;600;700&display=swap',
    display: "'Fraunces'",
    body: 'Inter',
  },
  'space-inter': {
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap',
    display: "'Space Grotesk'",
    body: 'Inter',
  },
  'dmserif-dmsans': {
    url: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap',
    display: "'DM Serif Display'",
    body: "'DM Sans'",
  },
  'poppins-opensans': {
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Open+Sans:wght@400;600;700&display=swap',
    display: 'Poppins',
    body: "'Open Sans'",
  },
}

const hex = (v: unknown, fallback: string) => (typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : fallback)

/** CSS variables built from Site settings → Theme. */
export function themeFromSettings(s: any) {
  const pair = FONT_PAIRS[s?.fontPair] || FONT_PAIRS['bricolage-inter']
  const radius = Number(s?.radius) > 0 && Number(s?.radius) < 64 ? Number(s.radius) : 28
  const css = `:root{--ink:${hex(s?.ink, '#0F1F18')};--paper:${hex(s?.paper, '#F7F2E9')};--sand:${hex(s?.sand, '#EFE7D8')};--muted:${hex(s?.muted, '#4A5A52')};--green:${hex(s?.green, '#0B6B3F')};--red:${hex(s?.red, '#C23A2B')};--gold:${hex(s?.gold, '#F0B323')};--red-text:${hex(s?.redText, '#A12C1F')};--radius:${radius}px;--font-display:${pair.display},system-ui,sans-serif;--font-body:${pair.body},system-ui,sans-serif}`
  return { css, fontsURL: pair.url, motion: (s?.motion as string) || 'full' }
}
