# CAHN — website & CMS

The Caribbean & African Health Network website, rebuilt as one Next.js app with the **Payload CMS** built in (admin at `/admin`), storing everything in **Supabase Postgres** and deploying to **Vercel**.

Every visible part of the site is managed in the CMS: homepage hero, rotating banners, partner logo carousel, CEO video, Health Hour phone mockup, pages, navigation, events, services, programmes, publications, jobs, media, donation settings, colours, fonts and translations (EN / FR / PT).

## What's inside

| Area | Where it lives |
| --- | --- |
| Homepage (fixed order: hero → banners → partner carousel → CEO video → Health Hour mockup → areas → events → manifesto/e-bulletin) | `src/app/(frontend)/[lang]/page.tsx`, CMS → *Homepage* |
| About + any new page (drag-and-drop blocks, reproduces the approved About design) | CMS → *Pages*, `src/components/RenderBlocks.tsx` |
| Services, Programmes, Health Hour, Events (+ detail, registration, countdown, calendar), Research, Opportunities, Media, Contact, Search, Donate | `src/app/(frontend)/[lang]/…` |
| CMS schema, roles & permissions | `src/collections`, `src/globals`, `src/access` |
| Payments (Stripe international, Paystack African; one-off + monthly) | `src/lib/payments.ts`, `/api/donate/*`, `/api/webhooks/*` |
| Forms (contact, volunteer, newsletter, event registration) with honeypot + rate limit (+ optional Turnstile) | `/api/site/*` |
| SEO: per-page meta, Organization/Event structured data, `sitemap.xml`, `robots.txt`, hreflang | `src/lib/seo.ts`, `src/app/(frontend)/sitemap.ts` |
| GA4 (loads only after cookie consent) | CMS → *Site settings → SEO & analytics* |

### Roles

* **Administrator** — everything, including users, branding and payment settings.
* **Section administrator** — edit and publish only in the sections assigned to them (e.g. Health Hour, Events).
* **Editor** — drafts only; their changes go live after an administrator or section administrator publishes them.
* **Viewer** — read-only.

Content has drafts, autosave, version history, scheduled publish/unpublish and live preview (desktop / tablet / mobile). Published changes appear on the live site immediately — pages render on request, so there is no cache to clear.

## Local development

```bash
cp .env.example .env          # fill in DATABASE_URI and PAYLOAD_SECRET at minimum
npm install
npm run dev                   # http://localhost:3000  ·  admin at /admin
SEED_ADMIN_EMAIL=you@cahn.org.uk SEED_ADMIN_PASSWORD='…' npm run seed   # optional starter content
```

In development the database schema syncs automatically. In production, schema changes go through migrations:

```bash
npm run payload migrate:create <name>   # after changing collections/fields
```

## Deploying (Supabase + Vercel)

1. **Supabase** — create a project. Copy the *Transaction pooler* connection string (port 6543) into `DATABASE_URI`. Create a public Storage bucket called `media`, then create S3 access keys (Storage → Settings → S3 connection) and fill in the `S3_*` variables.
2. **Vercel** — import this repo. Add every variable from `.env.example` in Project → Settings → Environment Variables. `vercel.json` already runs migrations before each build and sets a cron (every 5 minutes) that publishes scheduled content.
3. **First admin** — after the first deploy, run `npm run seed` once against the production database (locally with the production `DATABASE_URI`), or open `/admin` and create the first user.
4. **Email** — add a `RESEND_API_KEY` (verify the cahn.org.uk domain in Resend) or Microsoft 365 SMTP details. Set `ENQUIRIES_TO` to the inbox that should receive website enquiries.
5. **Payments** — start with test keys.
   * Stripe: add `STRIPE_SECRET_KEY`; create a webhook to `https://<site>/api/webhooks/stripe` for `checkout.session.*`, `charge.refunded` and `customer.subscription.deleted`; add its signing secret as `STRIPE_WEBHOOK_SECRET`.
   * Paystack: add `PAYSTACK_SECRET_KEY`; set the webhook URL to `https://<site>/api/webhooks/paystack`.
   * Currencies, suggested amounts and which provider handles each currency are edited in CMS → *Donation settings*. A currency's donate button stays disabled until its provider's key is present.
6. **Domain** — add cahn.org.uk in Vercel and set `NEXT_PUBLIC_SITE_URL=https://cahn.org.uk`.

## Before launch — needs CAHN input

* Upload the official logo, the panda, a favicon and real photography/video (CMS → *Media & documents*; then Site settings / Homepage / each item). Until then, labelled striped placeholders show.
* Add partner logos and confirm the partner list (only Comic Relief and Anthony Nolan are seeded).
* Add the CEO film's YouTube link (Homepage → *4 · CEO video*) and Health Hour flyers.
* Attach the PDFs to each publication, and paste each PDF's text into its media item so site search can look inside it.
* Replace the placeholder text on the Privacy, Cookie and Accessibility pages.
* Check the seeded event dates, the Gift Aid setting (CIC eligibility) and the existing Square/PayPal/bank-transfer details before switching to Stripe/Paystack.
* Add French and Portuguese translations in the CMS (switch the locale at the top of any document). Untranslated fields fall back to English.

## Accessibility & motion

Built to WCAG 2.2 AA: keyboard navigation (menus close with Escape, a skip link, visible gold focus rings), real buttons and labels, 44px touch targets and live regions on filters. As the brief asks, the banners and logo carousel have **no pause controls**. To compensate, all motion stops for visitors who choose *reduce motion*, the logo loop pauses on keyboard focus, and administrators can set motion to *Subtle* or *Off* in Site settings → Theme. WCAG 2.2.2 normally expects a pause control on content that moves for more than 5 seconds, so CAHN should confirm it accepts this trade-off.
