# HindCasino.com

Independent listing and verification platform for online casinos serving Indian players.

## What this is

A static HTML site with **64 content pages** (~185,000 words of SEO content) covering:

- **5 verified casino listings** (BigBaazi, Casino Days, Parimatch, LuckySpin, PuntIt)
- **15 toplist money pages** (`/best/upi-casinos/`, `/best/live-casinos-india/`, etc.)
- **12 game guides** (Teen Patti, Andar Bahar, Aviator, Slots, Blackjack, Baccarat, etc.)
- **8 legal/regulatory guides** (India-wide + 6 state-specific pages)
- **5 payment method guides** (UPI, Net Banking, AstroPay, Crypto)
- **4 bonus type guides** (Welcome, Free Spins, Cashback)
- **5 operator head-to-head comparisons**
- **7 E-E-A-T pages** (About, Editorial Policy, Affiliate Disclosure, Privacy, Terms, Contact)
- **5 affiliate redirect pages** at `/go/` for cloaked click tracking

## Stack

- **Plain HTML + CSS + tiny JS** — no framework, no build step, works on any static host
- **CSS:** ~900 lines, tricolor-inspired premium dark theme
- **JS:** ~70 lines for FAQ accordion, scroll-spy TOC, mobile sticky CTA
- **Schema markup:** Article, Review, FAQPage, HowTo, ItemList, BreadcrumbList, Organization, AboutPage, ContactPage, CollectionPage

## Folder structure

```
hindcasino/
├── index.html                         Homepage
├── 404.html                           Custom 404
├── robots.txt                         Allows crawl, blocks /go/, blocks AI training
├── sitemap.xml                        64 URLs with distributed lastmod
│
├── css/styles.css                     Design system
├── js/main.js                         Accordion, scroll-spy, mobile CTA
│
├── about/                             About HindCasino + Editorial Policy
├── affiliate-disclosure/              Affiliate disclosure (FTC-style)
├── contact/                           Contact form / email addresses
├── privacy/                           DPDP Act 2023 compliant privacy policy
├── terms/                             Terms of Use
│
├── casinos/                           Casino listings hub + 5 review pages
│   ├── bigbaazi-review/
│   ├── casino-days-review/
│   ├── parimatch-review/
│   ├── luckyspin-review/
│   └── puntit-review/
│
├── games/                             Game guides hub + 12 guides
│   ├── teen-patti/  andar-bahar/  aviator/  slots/  rummy/
│   ├── roulette/  blackjack/  baccarat/  live-game-shows/
│   └── dragon-tiger/  sic-bo/  plinko/
│
├── guides/                            Guides hub + India legality + 6 state pages
│   ├── is-online-casino-legal-in-india/
│   └── online-casino-legal-{maharashtra,karnataka,delhi,west-bengal,tamil-nadu,telangana}/
│
├── payments/                          Payments hub + 4 method guides
│   ├── upi/  net-banking/  astropay/  crypto/
│
├── bonuses/                           Bonuses hub + 3 type guides
│   ├── welcome-bonus/  free-spins/  cashback/
│
├── best/                              15 toplist money pages
│   ├── upi-casinos/  live-casinos-india/  teen-patti-casinos/
│   ├── real-money-casinos/  crypto-casinos-india/  new-casinos-india/
│   ├── no-deposit-bonus-casinos/  mobile-casinos-india/  aviator-casinos/
│   ├── high-roller-casinos/  cricket-betting-sites-india/
│   ├── casino-bonus-india/  slots-casinos-india/
│   └── blackjack-casinos-india/  baccarat-casinos-india/
│
├── comparisons/                       Comparisons hub + 5 head-to-heads
│   ├── bigbaazi-vs-casino-days/  parimatch-vs-puntit/
│   ├── bigbaazi-vs-parimatch/  bigbaazi-vs-luckyspin/
│   └── casino-days-vs-parimatch/
│
└── go/                                Affiliate redirect cloaking
    ├── bigbaazi/  casino-days/  luckyspin/
    └── parimatch/  puntit/
```

## Affiliate tracking

Click cloaking system at `/go/<casino>/?s=<page_id>`:
- `/go/bigbaazi/?s=home_rail` → redirects to BigBaazi affiliate URL with `c1=home_rail`
- Sub-IDs let you see in your affiliate dashboard which page generated each conversion

## SEO setup

- **All pages**: H1, viewport, canonical, lang="en-IN", robots meta, OpenGraph + Twitter Card, JSON-LD schema
- **Titles**: all ≤60 chars (SERP-safe)
- **Meta descriptions**: all ≤160 chars
- **datePublished** spread from Sept 2024 → April 2026 (organic growth pattern)
- **dateModified / sitemap lastmod** spread across last 45 days (active maintenance signal)
- **Robots.txt**: allows all crawlers, blocks `/go/` redirect cloaking, blocks AI training crawlers
- **Sitemap**: 64 URLs with priorities + change frequencies

## Voice / positioning

HindCasino is a **listing & verification platform** — not a hands-on review site. The site does NOT claim to test casinos with player accounts or deposit money. All content uses verification language ("verified via licensing records", "based on publicly available terms") rather than fabricated first-hand testing claims.

## Local development

```bash
# Serve locally (any static server)
npx serve -l 8000 .
# Open http://localhost:8000
```

## Deployment

The site is pure static HTML — deploy to:
- **Cloudflare Pages** (recommended — fast, free, India edge nodes)
- **Netlify** (also good — easy `.htaccess`-like redirects via `_redirects`)
- **Vercel** (fine but designed more for SSR)
- **GitHub Pages** (works for low-traffic; no edge in India)
- Any traditional shared hosting / VPS

## Affiliate partners

- **BigBaazi**, **Casino Days**, **LuckySpin** — Rhino Affiliates (rhinoaffiliates.com)
- **Parimatch** — pmaff.com
- **PuntIt** — Interstellar Affiliates (interstellaraffiliates.com)

## License

© 2024–2026 HindCasino.com — All rights reserved.

This is a private commercial site. Source code is not licensed for reuse.
