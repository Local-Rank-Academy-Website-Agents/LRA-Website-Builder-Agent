# Website Handoff

## Delivery summary

- Project: Plumber Houston Pros
- Delivery date: 2026-08-26
- Source location: `projects/plumber-houston-pros/`
- Production output: `projects/plumber-houston-pros/dist/`
- Primary contact: Not supplied

## Build

- Runtime: Node.js 18+
- Package manager: npm
- Install command: `npm install`
- Development command: `npm run dev`
- Production build command: `npm run build`
- Output directory: `dist/`
- Build verified from installed lockfile: Yes

## Deployment

- Production host: Vercel project `tristans-projects-e26a06f0/plumber-houston-pros`
- Production recovery URL: `https://plumber-houston-pros.vercel.app`
- Upload steps: Run `npm run build`, then deploy the linked project with `vercel deploy --prod`.
- Environment variables: None required by the static site; the public HubSpot form endpoint is configured in `site/assets/lead-routing.js`.
- Redirects: Configure HTTPS and one preferred hostname.
- Custom headers: Add sensible security headers at the hosting layer after the form and analytics stack are selected.
- Domain and DNS: `plumberhoustonpros.com` is attached to Vercel but still resolves through ALL-INKL nameservers. Cut over the apex to Vercel after registrar/DNS control is recovered.

## Lead routing

- Phone status: Active CallRail tracking number `832-621-4929`
- Phone destination: Controlled forwarding destination configured in Local Rank Academy's CallRail account
- Form destination: HubSpot portal `247139734`, form `076098ff-c93e-4ecc-8d94-0c40fdec45df`
- CRM/webhook: HubSpot Forms submission API
- Spam protection: Honeypot and browser-side validation; review HubSpot spam controls periodically
- Success/error behavior tested: Generated states and deployed client script verified; do not create a live CRM test contact without owner approval

## SEO and analytics

- Address status: None
- Address published in content/schema: No
- Google Business Profile: Not eligible for this lead-generation property
- Canonical domain: `https://plumberhoustonpros.com`
- Sitemap URL after build: `/sitemap.xml`
- Robots behavior: Index/follow with `Allow: /`; 404 remains noindex
- Structured data: `WebSite`, `Organization`, `BreadcrumbList`, and truthful `Service` records without fabricated local address, phone, rating, or active coverage
- Analytics: None
- Search Console: Not configured
- Consent: Privacy page discloses HubSpot form intake and CallRail forwarding/possible recording; reassess before adding analytics or advertising pixels

## Verification completed

- [x] Mobile and desktop layouts inspected at 390×844 and 1440×900
- [x] Desktop and mobile navigation tested
- [x] Live form validation and HubSpot success/error states generated
- [x] Active CallRail phone links are published sitewide
- [x] Titles, descriptions, canonicals, and social metadata checked
- [x] Every title tag exactly equals its visible H1
- [x] Homepage H1 targets plumbing services with the Greater Houston modifier
- [x] Homepage visibly links all eight primary-priority services
- [x] All 54 service-page H1s directly match their mapped topic
- [x] Every substantive page has a unique visible FAQ section
- [x] Keyword map has no unresolved service or location cannibalization conflict
- [x] Every approved service appears in desktop/mobile navigation, footer directories, and sitemap generation
- [x] Every approved service area appears in desktop/mobile navigation, footer directories, and sitemap generation
- [x] Every service page links to four mapped related services and all 43 intended area pages
- [x] Every area page links to all 54 service pages and its regional peers
- [x] No approved route is orphaned
- [x] Structured data parses as valid JSON
- [x] Phone, address, and Google Business Profile output matches the independent lead-generation status
- [x] Broken internal references and missing assets checked
- [x] Console checked with no errors or warnings during representative form testing
- [x] Page-specific content audit passed: zero exact duplicate paragraphs; maximum similarity 49.5%
- [x] Production build completed
- [x] No unresolved template tokens or secrets included

## Post-deployment smoke test

- [x] Verify HTTPS on the Vercel production alias
- [ ] Re-test every lead action on the custom domain after DNS cutover
- [ ] Confirm analytics only after it is intentionally configured
- [ ] Submit sitemap in Search Console
- [x] Inspect key Vercel URLs for indexability
- [x] Check Vercel routes, real 404 response, favicon, and console

## Remaining launch dependencies

See `LAUNCH-BLOCKERS.md`: custom-domain DNS control, provider qualification/coverage checks, stronger spam/retention controls, and optional analytics remain unresolved.

## Known limitations

- The Vercel recovery deployment is indexable and routes calls/forms; the custom domain still serves the ALL-INKL copy until DNS control is recovered.
- Hyper-local pages accept requests but do not guarantee provider availability for every service/ZIP combination.
- The static preview server serves the 404 document for missing routes; production host status-code behavior must be configured and tested.
