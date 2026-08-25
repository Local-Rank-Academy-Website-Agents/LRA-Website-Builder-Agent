# Website Handoff

## Delivery summary

- Project: Houston Mold Remediation Pros
- Delivery date: July 29, 2026
- Local preview: `http://localhost:4173/`
- Source: `projects/houston-mold-remediation-pros/site/`
- Production output: `projects/houston-mold-remediation-pros/dist/`
- Maintained architecture: `scripts/site-data.mjs` and `KEYWORD-MAP.md`
- Status: Pre-launch rank-and-rent test build awaiting an operator

## Build

- Runtime: Node.js 20 or newer
- Package manager: npm
- Dependencies: None
- Install: `npm ci`
- Generate: `npm run generate`
- Check: `npm run check`
- Production build: `npm run build`
- Preview: `npm run view`
- Windows viewer: `VIEW-SITE.cmd`
- Output: `dist/`

## Delivered architecture

- 25 HTML pages
- 18 keyword-mapped service pages
- 33 intended community destinations grouped into seven Greater Houston regions
- Static desktop mega-menus and accessible mobile submenus for Services and Service Areas
- Complete service and area directories in the HTML footer
- Direct mapped H1 on every service page
- Broad Greater Houston topic H1 on the homepage
- Unique FAQ section on every substantive page
- Five or six mapped related-service links on every service page
- Seven mapped regional service-area links on every service page
- Reciprocal core-service links from the service-area guide
- Shared page generation from one data source

## Verification completed

- [x] `npm run check` passed
- [x] `npm run build` passed and produced 25 HTML pages
- [x] Internal file and route references checked
- [x] Service-area fragments checked against destination IDs
- [x] Exactly one H1 checked on every substantive page
- [x] Unique FAQ section required on every substantive page
- [x] Related Services and Service Areas sections required on every service page
- [x] JSON-LD parsed
- [x] Titles and canonicals checked for duplicates
- [x] Desktop viewport inspected at 1440 × 900
- [x] Mobile viewport inspected at 390 × 844
- [x] Desktop Services dropdown opened and clicked through
- [x] Mobile Services submenu exposed all 18 service destinations
- [x] Mobile Service Areas submenu exposed all seven regions and 33 community destinations
- [x] Cypress anchor click reached the correct area section
- [x] Attic service page showed six related services, seven area groups, and four FAQs
- [x] Contact form empty-field error state passed
- [x] Contact form valid non-transmitting test state passed
- [x] No horizontal overflow found in tested desktop and mobile states
- [x] Updated desktop and mobile homepage screenshots saved

## SEO and truth status

- Canonical domain: `https://houston-mold-remediation-pros.invalid`
- Indexing: Disabled
- Robots: `Disallow: /`
- Phone: None
- Address: None
- Google Business Profile: None and not eligible while awaiting an operator
- Form destination: None
- Analytics: None
- Verified operator services and coverage: None
- Structured data: Organization, WebSite, Service, CollectionPage, BreadcrumbList

No public phone, address, LocalBusiness address schema, review, staff, credential, price, guarantee, emergency-response claim, or active-coverage claim is included.

## Activation requirements

1. Contract with and verify the real operator.
2. Remove services and community targets the operator does not cover.
3. Verify current Texas credentials and the separation of assessment, remediation, and verification roles.
4. Configure a monitored form destination with server-side validation and spam controls.
5. Add a real privacy contact and final data-handling terms.
6. Select a domain and set `baseUrl` in `site.config.json`.
7. Decide analytics and consent.
8. Set `indexingEnabled` to `true` only after all prior checks pass.
9. Run `npm run check && npm run build`.
10. Deploy `dist/`, then test HTTPS, redirects, form delivery, 404 behavior, sitemap, and indexability.

See `LAUNCH-BLOCKERS.md` for the authoritative pre-launch checklist.

## Known limitations

- The form validates locally but transmits and stores nothing.
- Locations are intended targets, not verified active coverage.
- No live business proof or operator photography exists.
- The hero image is illustrative and does not depict a real project.
- No public deployment or live form-delivery test was performed.
