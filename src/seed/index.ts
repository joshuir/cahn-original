/**
 * Seeds the CMS with CAHN's content structure (taken from the cahn.org.uk audit
 * and the approved designs) so the site works on first deploy.
 *
 *   npm run seed            — seeds an empty database
 *   SEED_FORCE=1 npm run seed — wipes seeded collections first
 *
 * Creates the first administrator from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 * (a random password is generated and printed if none is given).
 * Photos, logos, flyers and PDFs are NOT seeded: upload CAHN's own media in the CMS.
 */
import crypto from 'crypto'
import config from '@payload-config'
import { getPayload } from 'payload'

const p = (text: string) => ({ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }] })
const h = (text: string) => ({ type: 'heading', tag: 'h2', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }] })
const rich = (...nodes: any[]) => ({ root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: nodes } })

const nextSat = (weeks = 0) => {
  const d = new Date()
  d.setUTCHours(11, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + ((6 - d.getUTCDay() + 7) % 7) + weeks * 7)
  if (weeks === 0 && d < new Date()) d.setUTCDate(d.getUTCDate() + 7)
  return d.toISOString()
}

const payload = await getPayload({ config })
const log = (m: string) => payload.logger.info(`[seed] ${m}`)
const ctx = { overrideAccess: true, context: { disableRevalidate: true } } as const

const SEEDED = ['banners', 'partners', 'health-hour-sessions', 'events', 'services', 'programmes', 'people', 'publications', 'posts', 'videos', 'pages', 'grants', 'forms'] as const

if (process.env.SEED_FORCE) {
  for (const c of SEEDED) await payload.delete({ collection: c as any, where: { id: { exists: true } }, ...ctx })
  log('cleared seeded collections')
}

const existing = await payload.find({ collection: 'services', limit: 1, ...ctx })
if (existing.totalDocs > 0 && !process.env.SEED_FORCE) {
  log('content already exists — skipping (set SEED_FORCE=1 to reseed)')
  process.exit(0)
}

// ─── First administrator ─────────────────────────────────────────────────
const users = await payload.find({ collection: 'users', limit: 1, ...ctx })
if (!users.totalDocs) {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cahn.org.uk'
  const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url')
  await payload.create({ collection: 'users', data: { email, password, name: 'CAHN Administrator', role: 'admin' }, ...ctx })
  const quiet = process.env.SEED_ADMIN_PASSWORD || process.env.VERCEL || process.env.CI
  log(`admin created: ${email}${quiet ? ' — sign in with your CAHN (Supabase) account' : ` / password: ${password}  (change it after first login)`}`)
}

// ─── Site settings ──────────────────────────────────────────────────────
await payload.updateGlobal({
  slug: 'site-settings',
  ...ctx,
  data: {
    siteName: 'Caribbean & African Health Network',
    shortName: 'CAHN',
    utilityText: 'Health Hour — live every Saturday at 11:00',
    helpline: '077 1002 2382',
    email: 'info@cahn.org.uk',
    defaultDescription: 'CAHN works from grassroots to government to end health inequalities for Caribbean and African communities — through advocacy, leadership, education and community power.',
    social: [
      { platform: 'Instagram', url: 'https://www.instagram.com/cahn_uk/' },
      { platform: 'Facebook', url: 'https://www.facebook.com/cahnuk' },
      { platform: 'X', url: 'https://twitter.com/cahn_uk' },
      { platform: 'YouTube', url: 'https://www.youtube.com/channel/UCpTHOGbhlEV0wZA5jvnOJEA' },
    ],
    mainNav: [
      { label: 'About', url: '/about', blurb: 'Who we are, who leads us and who we work with.', children: [{ label: 'Our story', url: '/about' }, { label: 'Mission, vision & values', url: '/about#values' }, { label: 'Board & patrons', url: '/about#people' }, { label: 'Staff team', url: '/about#people' }, { label: 'Volunteers', url: '/opportunities#volunteer' }, { label: 'Partners & supporters', url: '/about#partners' }] },
      { label: 'Services', url: '/services', blurb: 'Practical, culturally aware support for individuals and families.', children: [{ label: 'Domestic violence & sexual abuse', url: '/services/domestic-violence-sexual-abuse' }, { label: 'Advocacy service', url: '/services/advocacy-service' }, { label: 'Counselling service', url: '/services/counselling-service' }, { label: 'Family support & parenting', url: '/services/family-support-parenting' }, { label: 'Hospital discharge service', url: '/services/hospital-discharge-service' }, { label: 'Modern slavery service', url: '/services/modern-slavery-service' }, { label: 'Creative health services', url: '/services/creative-health-services' }, { label: 'Drop-ins & Digital Hub', url: '/services/drop-ins-community-digital-hub' }] },
      { label: 'Programmes', url: '/programmes', blurb: 'Long-term programmes improving Black health outcomes.', children: [{ label: 'Black Health Improvement Programme', url: '/programmes/black-health-improvement-programme' }, { label: 'Health Hour', url: '/health-hour' }, { label: 'Blood & organ donation', url: '/programmes/blood-organ-donation-project' }, { label: 'Community Leadership Programme', url: '/programmes/community-leadership-programme' }, { label: 'KASIH & KASO', url: '/programmes/kasih-kaso' }, { label: 'All programmes', url: '/programmes' }] },
      { label: 'Events', url: '/events', blurb: 'Flagship events, campaigns and the weekly calendar.', children: [{ label: 'Events calendar', url: '/events' }, { label: 'Black Healthcare Awards', url: '/events/black-healthcare-awards-2026' }, { label: 'Rising Together', url: '/events/rising-together-2027' }, { label: 'Black Health Inequalities Summit', url: '/events/black-health-inequalities-summit' }, { label: 'Windrush Day', url: '/events/windrush-day-78-celebration' }, { label: 'Black History Month', url: '/events/black-history-month-gala' }] },
      { label: 'Research', url: '/research', blurb: 'Evidence, reports and resources you can download.', children: [{ label: 'Reports', url: '/research?type=report' }, { label: 'Research', url: '/research?type=research' }, { label: 'Policy statements', url: '/research?type=policy' }, { label: 'Resources', url: '/research?type=resource' }] },
      { label: 'Get involved', url: '/opportunities', blurb: 'Work with us, volunteer, partner or apply for funding.', children: [{ label: 'Jobs', url: '/opportunities#jobs' }, { label: 'Volunteering', url: '/opportunities#volunteer' }, { label: 'Grants', url: '/opportunities#grants' }, { label: 'Partnerships', url: '/opportunities#partner' }, { label: 'Donate', url: '/donate' }] },
      { label: 'Media', url: '/media', blurb: 'News, film and photography from across the network.', children: [{ label: 'Press releases', url: '/media' }, { label: 'Video library', url: '/media?tab=video' }, { label: 'Gallery', url: '/media?tab=gallery' }, { label: 'Updates & e-bulletin', url: '/media?tab=updates' }] },
    ],
    footerColumns: [
      { heading: 'About', links: [{ label: 'Our story', url: '/about' }, { label: 'Board & patrons', url: '/about#people' }, { label: 'Partners & supporters', url: '/about#partners' }] },
      { heading: 'Get help', links: [{ label: 'Services', url: '/services' }, { label: 'Programmes', url: '/programmes' }, { label: 'Health Hour', url: '/health-hour' }, { label: 'Research & publications', url: '/research' }] },
      { heading: 'Get involved', links: [{ label: 'Events', url: '/events' }, { label: 'Jobs, grants & volunteering', url: '/opportunities' }, { label: 'Media & press', url: '/media' }, { label: 'Contact', url: '/contact' }, { label: 'Donate', url: '/donate' }] },
    ],
  },
})
log('site settings')

// ─── Homepage modules ───────────────────────────────────────────────────
const banners = [
  { title: 'Health Hour is live this Saturday', tag: 'Every Saturday · 11:00', tagColour: 'gold', line: 'Trusted advice from Black clinicians — on Zoom, YouTube, Facebook and LinkedIn.', linkLabel: 'Join Health Hour', linkUrl: '/health-hour' },
  { title: 'World AIDS Day at Southwark Cathedral', tag: 'Commemoration · 30 Nov', tagColour: 'paper', line: 'Remembering those lost, celebrating advances in treatment, and ending stigma.', linkLabel: 'Register to attend', linkUrl: '/events/world-aids-day-2026' },
  { title: 'Black Healthcare Awards 2026', tag: 'Flagship awards', tagColour: 'red', line: '450+ guests at the Royal Lancaster London honouring excellence across Black healthcare.', linkLabel: 'See the winners', linkUrl: '/events/black-healthcare-awards-2026' },
  { title: 'The Black Health Manifesto', tag: 'Campaign', tagColour: 'green', line: 'Three mandates for change — for men, women, children and young people.', linkLabel: 'Read the manifesto', linkUrl: '/research?type=policy' },
  { title: 'Rising Together 2027', tag: 'Conference · 2027', tagColour: 'gold', line: 'Global Majority Nursing & Midwifery Leadership Conference — CPD accredited.', linkLabel: 'Register interest', linkUrl: '/events/rising-together-2027' },
]
for (const b of banners) await payload.create({ collection: 'banners', data: { ...b, _status: 'published' } as any, ...ctx })

for (const name of ['Comic Relief', 'Anthony Nolan']) await payload.create({ collection: 'partners', data: { name, group: 'current', showInCarousel: true }, ...ctx })

const sessions = [
  { topic: 'Sickle cell', category: 'Sickle cell', sessionDate: nextSat(0) },
  { topic: 'Menopause', category: 'Menopause', sessionDate: nextSat(1) },
  { topic: 'Kidney health', category: 'Kidney health', sessionDate: nextSat(-1) },
  { topic: 'Mental health', category: 'Mental health', sessionDate: nextSat(-2) },
  { topic: 'Blood donation', category: 'Blood donation', sessionDate: nextSat(-3) },
  { topic: 'Cancer screening', category: 'Screenings', sessionDate: nextSat(-4) },
]
for (const s of sessions) await payload.create({ collection: 'health-hour-sessions', data: { ...s, showInMockup: true, _status: 'published' } as any, ...ctx })
log('banners, partners, Health Hour sessions')

// ─── Publications (files to be uploaded in the CMS) ─────────────────────
const pubs: any[] = []
for (const x of [
  { title: 'Black Men’s Health Manifesto', type: 'policy', searchKeywords: ['manifesto', 'men'] },
  { title: 'Black Women’s Health Manifesto', type: 'policy', searchKeywords: ['manifesto', 'women'] },
  { title: 'Mandate for Children & Young People', type: 'policy', searchKeywords: ['manifesto', 'children', 'youth'] },
  { title: 'Fibroids Report', type: 'report', searchKeywords: ['womens health', 'womb', 'gynae'] },
  { title: 'Women’s Health Insights (IWD)', type: 'report', searchKeywords: ['women', 'iwd'] },
  { title: 'Anthony Nolan survey findings', type: 'research', searchKeywords: ['stem cell', 'blood', 'donor', 'sickle cell'] },
  { title: 'COVID-19 vaccines report', type: 'report', searchKeywords: ['covid', 'vaccine', 'jab'] },
  { title: 'Decolonising Public Health through Praxis', type: 'research', year: 2022, searchKeywords: ['book', 'ruddock', 'clennon'] },
  { title: 'Breast & gynae cancer intervention report', type: 'report', searchKeywords: ['cancer', 'breast', 'screening'] },
]) pubs.push(await payload.create({ collection: 'publications', data: { ...x, _status: 'published' } as any, ...ctx }))

await payload.updateGlobal({
  slug: 'homepage',
  ...ctx,
  data: {
    _status: 'published',
    hero: {
      eyebrow: 'Caribbean & African Health Network · since 2017',
      headline: 'Healthier lives for Caribbean & African communities —',
      highlight: 'within a generation.',
      lede: 'We work from grassroots to government to end health inequalities — through advocacy, leadership, education and community power.',
    },
    banners: { enabled: true, seconds: 6 },
    partners: { enabled: true, eyebrow: 'Working together', heading: 'Partners, funders & supporters', loopSeconds: 48 },
    ceoVideo: { enabled: true, eyebrow: 'A message from our Chief Executive', title: 'Our Work', text: 'Charles Kwaku-Odoi DL on why CAHN exists, who we serve and the change we are working towards.' },
    healthHour: { enabled: true, eyebrow: 'Flagship programme · since 2020', heading: 'Do you have an hour?', text: 'Your weekly dose of trusted health advice, live from Black doctors, consultants, nurses and pharmacists. Join on Zoom or watch on YouTube, Facebook and LinkedIn.', sessionsCount: '400+', flyerSeconds: 4, maxFlyers: 8 },
    areas: [
      { title: 'Health & Wellbeing Services', text: 'Culturally appropriate support that improves health literacy and shapes policy for generations.', url: '/services' },
      { title: 'Community Empowerment & Advocacy', text: 'Help with housing, welfare, family, legal and immigration challenges — and amplifying your voice.', url: '/services/advocacy-service' },
      { title: 'Research & Innovation', text: 'Evidence that exposes the drivers of health disparities and carries community voices to policymakers.', url: '/research' },
      { title: 'Learning & Development Academy', text: 'Training for communities and clinicians in cultural competency and conditions that affect Black people.', url: '/programmes' },
    ],
    showEvents: true,
    manifesto: { eyebrow: 'Black Health Manifesto', heading: 'Three mandates for change.', documents: pubs.slice(0, 3).map((x) => x.id) },
  } as any,
})
log('homepage + publications')

// ─── Services & programmes ──────────────────────────────────────────────
const services = [
  ['Domestic Violence & Sexual Abuse', 'Confidential, culturally aware support — plus the Empowered Voices Panel, where survivors shape services.', ['unsafe'], true, ['dv', 'dvsa', 'domestic abuse', 'abuse']],
  ['Advocacy Service', 'One-to-one help navigating housing, welfare, legal and immigration systems — including Windrush compensation claims.', ['housing', 'legal', 'windrush'], false, ['housing', 'benefits', 'windrush', 'immigration']],
  ['Counselling Service', 'Professional therapeutic counselling that respects your cultural, racial and faith identity, with affiliate counsellors.', ['wellbeing'], false, ['therapy', 'mental health', 'talking']],
  ['Family Support & Parenting', 'CAHN and SFCS parenting courses, family & advocacy webinars, and the Titan Boys and Elite Girls clubs.', ['family'], false, ['parenting', 'family', 'youth']],
  ['Hospital Discharge Service', 'Support to get home safely and settled after a hospital stay.', ['hospital'], false, ['hospital', 'discharge', 'nhs']],
  ['Modern Slavery Service', 'Confidential help for people affected by exploitation or trafficking.', ['exploitation'], true, ['trafficking', 'exploitation']],
  ['Creative Health Services', 'Arts and creativity as a route to better wellbeing.', [], false, ['arts', 'creative']],
  ['Drop-ins & Community Digital Hub', 'Home Office, legal and other drop-in sessions, plus digital skills support.', ['legal'], false, ['drop-in', 'digital', 'home office']],
] as const
for (const [i, [title, summary, needs, sensitive, kw]] of services.entries())
  await payload.create({ collection: 'services', data: { title, summary, needs: [...needs], sensitive, sortOrder: i, searchKeywords: [...kw], body: rich(p(summary)), _status: 'published' } as any, ...ctx })

const programmes = [
  ['Black Health Improvement Programme', 'BHIP', 'health', 'Training for communities and healthcare professionals.', 'Cultural competency · conditions affecting Black people', true],
  ['Blood & Organ Donation Project', 'DONATION', 'donation', 'Growing the number of Black blood, stem cell and organ donors.', 'Become a donor · sickle cell awareness', false],
  ['Community Leadership Programme', 'LEADERSHIP', 'leadership', 'Equipping the next generation of community leaders.', 'Cohort applications announced in the e-bulletin', false],
  ['Involve and Decide', 'EMPOWERMENT', 'empowerment', 'Bringing community voices into health decisions.', 'Get involved', false],
  ['KASIH & KASO', 'SCREENING', 'health', 'Knowledge, access and screening for improved health.', 'Screening events near you', false],
  ['Black Cultural Anti-racist Programme', 'ANTI-RACISM', 'empowerment', 'BCAP — improving Black lives in organisations.', 'For employers and teams', false],
  ['Core20PLUS5 Community Connectors', 'CONNECTORS', 'health', 'Linking communities with NHS priorities.', 'Meet your connectors', false],
  ['Winter Health Improvement Programme', 'WINTER', 'health', 'Staying well through the colder months.', 'Vaccines · warm homes', false],
  ['GM Perinatal Mental Health Review', 'RESEARCH', 'research', 'Listening to Black mothers and families across Greater Manchester.', 'Read the findings', false],
  ['Resilient Informed Black Community', 'RESILIENCE', 'empowerment', 'Information and resilience for community members.', 'Find out more', false],
  ['Homes for Health, Gorton', 'HOMES', 'health', 'Healthier homes for healthier lives.', 'Healthy Homes Conference', false],
  ['Learning & Development Academy', 'LEARNING', 'research', 'Courses for communities and clinicians.', 'Upcoming courses', false],
] as const
for (const [i, [title, tag, theme, summary, hoverText, featured]] of programmes.entries())
  await payload.create({ collection: 'programmes', data: { title, tag, theme, summary, hoverText, featured, sortOrder: i, searchKeywords: tag === 'BHIP' ? ['bhip'] : tag === 'SCREENING' ? ['kasih', 'kaso', 'cancer'] : [], body: rich(p(summary)), _status: 'published' } as any, ...ctx })
log('services + programmes')

// ─── Events ─────────────────────────────────────────────────────────────
const events = [
  ['World AIDS Day', 'awareness', '2026-11-30T15:00:00Z', 'Southwark Cathedral, London', 'Remembering those lost, celebrating advances in HIV treatment and prevention, and renewing our commitment to ending stigma.', 'world-aids-day-2026', false],
  ['Greater Manchester Caribbean & African Community Carol Service', 'community', '2026-12-17T18:30:00Z', 'Manchester Cathedral, M3 1SX', 'Community choirs, orchestral music, candlelight readings and festive refreshments.', 'carol-service-2026', false],
  ['Rising Together 2027', 'flagship', '2027-03-01T09:00:00Z', 'Venue to be confirmed', 'Global Majority Nursing & Midwifery Leadership Conference — CPD accredited.', 'rising-together-2027', true],
  ['Black History Month Gala', 'flagship', '2026-10-24T18:00:00Z', 'The Manchester Deansgate Hotel', 'Awards honouring community champions, fashion, culture, dinner and networking.', 'black-history-month-gala', false],
  ['Black Healthcare Awards 2026', 'flagship', '2026-07-04T17:00:00Z', 'Royal Lancaster London', '450+ guests celebrating excellence across Black healthcare.', 'black-healthcare-awards-2026', false],
  ['Windrush Day 78 Celebration', 'community', '2026-06-20T12:00:00Z', 'Alexandra Park, Manchester', 'Live music, Caribbean food, family activities and community awards.', 'windrush-day-78-celebration', false],
  ['Africa Day 2026', 'community', '2026-05-28T12:00:00Z', 'Manchester', 'Performances, food, music and workshops celebrating African heritage.', 'africa-day-2026', false],
  ['Black Health Inequalities Summit', 'flagship', '2026-04-20T09:00:00Z', 'The Mermaid, London EC4V', 'Leaders, clinicians and policymakers tackling systemic inequality.', 'black-health-inequalities-summit', false],
  ['International Women’s Day', 'awareness', '2026-03-12T10:00:00Z', 'The Sheridan, Manchester', 'Speakers and workshops on women’s health, leadership and empowerment.', 'international-womens-day-2026', false],
  ['Black Health Manifesto', 'campaign', '2026-01-01T00:00:00Z', '', 'Three mandates for change — for men, women, children and young people.', 'black-health-manifesto', false],
] as const
for (const [title, category, startsAt, venue, summary, slug, tbc] of events)
  await payload.create({
    collection: 'events',
    data: { title, category, startsAt, venue, summary, slug, dateTBC: tbc, registration: { mode: category === 'campaign' ? 'none' : 'onsite', ctaLabel: tbc ? 'Register interest' : 'Register' }, _status: 'published' } as any,
    ...ctx,
  })
log('events')

// ─── People + About page (matches the approved About design) ────────────
await payload.create({ collection: 'people', data: { name: 'Dr Faye Ruddock', role: 'Chair & Founder', team: 'board' }, ...ctx })
await payload.create({ collection: 'people', data: { name: 'Charles Kwaku-Odoi DL', role: 'Chief Executive', team: 'executive' }, ...ctx })

await payload.create({
  collection: 'pages',
  ...ctx,
  data: {
    title: 'Our story',
    slug: 'about',
    _status: 'published',
    subnav: [{ label: 'Our story', url: '/about' }, { label: 'Board & patrons', url: '/about#people' }, { label: 'Staff', url: '/about#people' }, { label: 'Partners', url: '/about#partners' }],
    layout: [
      { blockType: 'pageHeader', eyebrow: 'Who we are & what we do', heading: 'Born from evidence. Built by community.', lede: 'The Caribbean & African Health Network was set up in 2017 to address long-standing health inequalities disadvantaging people of Black Caribbean and African heritage — and has grown from grassroots beginnings into a leading national voice for health equity.', imageShape: 'arch' },
      { blockType: 'timeline', items: [
        { year: '2016', colour: 'red', text: 'Dr Faye Ruddock completes doctoral research evidencing significant health disparities facing Black people in Greater Manchester.' },
        { year: '2017', colour: 'gold', text: 'CAHN is established as a community interest company, with Dr Ruddock as Chair and Founder.' },
        { year: '2020', colour: 'green', text: 'Health Hour launches — a weekly Saturday session that has since passed 400 episodes.' },
        { year: '2022', colour: 'red', text: 'Decolonising Public Health through Praxis is published, co-written with D. Ornette D. Clennon.' },
        { year: '2027', colour: 'green', text: 'CAHN enters its tenth year.' },
      ] },
      { blockType: 'columns', tone: 'ink', columns: [
        { label: 'Vision', text: 'To end health inequalities and wider disparities for Caribbean and African people in a generation.' },
        { label: 'Mission', text: 'To ensure the actions of service providers, cross-sector agencies and commissioners lead to racial and social justice for Black people.' },
        { label: 'Values', text: 'Integrity, respect, openness and transparency — within a framework of good governance.' },
      ] },
      { blockType: 'dotGrid', heading: 'Six health priorities', intro: 'The evidence base identifies six areas where we work with communities and partners — always tailored to distinct needs and across generations.', items: ['Cardiovascular health', 'Respiratory conditions', 'Cancer', 'Mental health', 'Immunology', 'Reproductive & sexual health'].map((label) => ({ label })) },
      { blockType: 'numberedCards', tone: 'sand', heading: 'Our core objectives', cards: [
        { title: 'Work collaboratively', text: 'with Caribbean and African faith and community organisations to strengthen their structures and systems.' },
        { title: 'Build partnerships', text: 'across sectors, as the point of contact between communities, the voluntary sector and commissioners.' },
        { title: 'Consult continuously', text: 'planning and evaluating solutions to persistent health inequalities.' },
        { title: 'Champion our community', text: 'promoting its assets, efficiencies and achievements.' },
      ] },
      { blockType: 'people', heading: 'The people behind CAHN' },
      { blockType: 'partners', heading: 'Partners & supporters', group: 'all', style: 'grid' },
    ],
  } as any,
})
for (const [title, slug] of [['Privacy notice', 'privacy'], ['Cookie policy', 'cookies'], ['Accessibility statement', 'accessibility']] as const) {
  await payload.create({
    collection: 'pages',
    ...ctx,
    data: { title, slug, _status: 'published', layout: [{ blockType: 'pageHeader', heading: title }, { blockType: 'richText', content: rich(h('To be completed'), p('CAHN’s approved wording for this page should be pasted here in the CMS before launch.')) }] } as any,
  })
}
log('About + policy pages')

// ─── Forms & donation settings ──────────────────────────────────────────
await payload.create({
  collection: 'forms',
  ...ctx,
  data: { title: 'Contact', confirmationType: 'message', confirmationMessage: rich(p('Thanks — we will reply within 2 working days.')), fields: [{ blockType: 'text', name: 'name', label: 'Name', required: true }, { blockType: 'email', name: 'email', label: 'Email', required: true }, { blockType: 'textarea', name: 'message', label: 'Message', required: true }] } as any,
})

await payload.updateGlobal({
  slug: 'donation-settings',
  ...ctx,
  data: {
    heading: 'Your gift powers care that understands.',
    intro: 'Your contribution directly powers CAHN’s health advocacy and support services for Black Caribbean and African communities.',
    allowMonthly: true,
    coverFeesPercent: 3,
    giftAid: false,
    currencies: [
      { code: 'GBP', symbol: '£', label: 'United Kingdom', provider: 'stripe', amounts: [10, 25, 50, 100], methods: ['Card', 'Apple Pay', 'Google Pay'] },
      { code: 'USD', symbol: '$', label: 'International', provider: 'stripe', amounts: [15, 30, 60, 125], methods: ['Card', 'Apple Pay', 'Google Pay'] },
      { code: 'EUR', symbol: '€', label: 'Europe', provider: 'stripe', amounts: [12, 30, 60, 120], methods: ['Card', 'Apple Pay', 'Google Pay'] },
      { code: 'GHS', symbol: '₵', label: 'Ghana', provider: 'paystack', amounts: [150, 400, 800, 1500], methods: ['Card', 'MTN MoMo', 'Telecel Cash', 'AirtelTigo Money'] },
      { code: 'NGN', symbol: '₦', label: 'Nigeria', provider: 'paystack', amounts: [15000, 40000, 80000, 150000], methods: ['Card', 'Bank transfer', 'USSD'] },
    ],
    impacts: [
      { text: 'could help someone access trusted, culturally tailored health information and basic checks such as blood pressure screening, in a familiar community setting.' },
      { text: 'could help someone access professional therapeutic counselling that respects their cultural, racial and faith identities.' },
      { text: 'could provide one-to-one advocacy for someone struggling to access health, housing, employment or wider services.' },
      { text: 'could fund a community listening session or outreach activity, so services better reflect Black Caribbean and African communities.' },
    ],
  } as any,
})
log('forms + donation settings')
log('done ✔')
process.exit(0)
