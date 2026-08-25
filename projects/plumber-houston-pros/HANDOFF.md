# Website Handoff

## Delivery summary

- Project: Plumber Houston Pros
- Delivery date: 2026-08-10
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

- Recommended host: Any static host
- Upload steps: Resolve launch blockers, set the production HTTPS `baseUrl`, enable indexing only when ready, run the production build, and upload the contents of `dist/`.
- Environment variables: None in the current static test build; document form-handler secrets by name only after integration.
- Redirects: Configure HTTPS and one preferred hostname.
- Custom headers: Add sensible security headers at the hosting layer after the form and analytics stack are selected.
- Domain and DNS: Production domain is undecided; `.invalid` is intentionally non-production.

## Lead routing

- Phone status: Form-only; no active number
- Phone destination: None
- Form destination: None; browser-side validation only
- CRM/webhook: None
- Spam protection: Honeypot markup; server-side controls required before activation
- Success/error behavior tested: Yes for local validation; no live endpoint exists

## SEO and analytics

- Address status: None
- Address published in content/schema: No
- Google Business Profile: Not eligible for this lead-generation property
- Canonical domain: `https://plumber-houston-pros.invalid` until replaced
- Sitemap URL after build: `/sitemap.xml`
- Robots behavior: Full disallow while pre-launch
- Structured data: `WebSite`, `Organization`, `BreadcrumbList`, and truthful `Service` records without fabricated local address, phone, rating, or active coverage
- Analytics: None
- Search Console: Not configured
- Consent: Reassess before analytics, advertising, call tracking, or live form processing

## Verification completed

- [x] Mobile and desktop layouts inspected at 390×844 and 1440×900
- [x] Desktop and mobile navigation tested
- [x] Browser-only form validation and success/error states tested
- [x] No placeholder phone or email links are published
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
- [x] Phone, address, and Google Business Profile output matches the pre-launch status
- [x] Broken internal references and missing assets checked
- [x] Console checked with no errors or warnings during representative form testing
- [x] Page-specific content audit passed: zero exact duplicate paragraphs; maximum similarity 49.5%
- [x] Production build completed
- [x] No unresolved template tokens or secrets included

## Post-deployment smoke test

- [ ] Verify HTTPS and preferred-domain redirect
- [ ] Re-test every lead action on the live domain
- [ ] Confirm analytics only after it is intentionally configured
- [ ] Submit sitemap in Search Console
- [ ] Inspect key URLs for indexability
- [ ] Check live redirects, real 404 response, favicon, and social preview

## Remaining launch dependencies

See `LAUNCH-BLOCKERS.md`: operator, verified capabilities/coverage, domain, form destination, privacy contact, live routing/security, and optional analytics remain unresolved.

## Known limitations

- The site is intentionally non-indexable and non-routing.
- Hyper-local service coverage is mapped for future verification and is not an active availability claim.
- The static preview server serves the 404 document for missing routes; production host status-code behavior must be configured and tested.
