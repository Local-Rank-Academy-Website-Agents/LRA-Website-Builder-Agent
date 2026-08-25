# Website Handoff

## Delivery summary

- Project: Leak Detection Houston Pros
- Version/commit: See the current Git HEAD for the deployed website commit
- Delivery date: 2026-08-25
- Source location: `projects/leak-detection-houston-pros/`
- Production output: `projects/leak-detection-houston-pros/dist/`
- Primary contact: Project owner to assign

## Build

- Runtime and version verified: Node.js v24.12.0
- Package manager verified: npm 11.6.2
- Install command: `npm ci`
- Development command: `npm run dev`
- Production build command: `npm run build`
- Output directory: `dist/`
- Build verified from a clean install: Yes

## Deployment

- Recommended host: Any static host; `vercel.json` is included for Vercel
- Upload or deployment steps: Resolve launch blockers, run `npm ci`, run `npm run build`, then deploy the contents of `dist/`
- Environment variable names and purposes: None currently
- Redirect/rewrite requirements: Directory-index routing, trailing slashes, clean URLs, and `404.html`; Vercel settings are included
- Custom headers: None currently
- Domain and DNS steps: Replace the temporary Vercel base URL when a verified custom domain is ready, rebuild, connect DNS, select the preferred hostname, and test redirects

Never place secret values in this document.

## Lead routing

- Phone status: Form-only pre-launch; no number published
- Phone destination: Not assigned
- Form destination: Not connected
- CRM/webhook: Not connected
- Spam protection: Honeypot markup and implementation guidance only; production server-side protection still required
- Success/error behavior tested: Yes. Required-field validation, invalid states, and the explicit non-transmission completion state were tested in browser

## SEO and analytics

- Address status: None
- Address published in content/schema: No; not eligible
- Google Business Profile status and URL: None
- Canonical domain: `https://leak-detection-houston-pros.vercel.app` temporary production host
- Sitemap URL: `/sitemap.xml`
- Robots behavior: `Disallow: /` while `indexingEnabled` is false
- Structured data types: `WebSite`, `BreadcrumbList`, and visible-content-matched `FAQPage`
- Analytics property: None
- Search Console owner: Not assigned
- Consent configuration: None

## Verification completed

- [x] Mobile, tablet, and desktop responsive rules inspected; mobile and desktop rendered in Chromium
- [x] Navigation and primary CTAs tested
- [x] Forms tested and clearly marked for launch-time connection
- [x] Phone and email links omitted because no destinations are verified
- [x] Titles, descriptions, canonicals, and social metadata checked
- [x] Homepage H1 targets the broad leak-detection topic with a Greater Houston modifier
- [x] Homepage visibly links all seven primary services
- [x] Service-page H1s directly match approved keyword topics
- [x] H2/H3 headings use mapped semantic and secondary topics
- [x] Every substantive landing page has an intent-matched FAQ section near the bottom
- [x] Keyword map has no unresolved service or location cannibalization conflicts
- [x] Every approved service appears in desktop/mobile navigation, footer directories, and sitemap
- [x] Every approved service area appears in desktop/mobile navigation, footer directories, and sitemap
- [x] Every service page links to mapped related services
- [x] Every generic service page links to all 43 approved service-specific area routes
- [x] Every city guide links to all seven services in that same city
- [x] No approved service or location page is orphaned
- [x] Sitemap and robots directives checked
- [x] Structured data parsed and matched to visible content
- [x] Phone, address, and Google Business Profile output matches the pre-launch intake status
- [x] Future, virtual, mailbox, private service-area, and unstaffed addresses are not published
- [x] Broken links and missing assets checked
- [x] Production build completed without errors
- [x] Placeholder launch dependencies are visibly disclosed and listed below
- [x] No secrets included
- [x] Automated WCAG A/AA audit returned zero violations on the homepage and a representative city/service page
- [x] Representative pages returned no browser console errors

## Post-deployment smoke test

- [ ] Verify HTTPS and preferred-domain redirect
- [ ] Re-test every lead action on the live domain
- [ ] Confirm analytics receives traffic, if analytics is added
- [ ] Submit sitemap in Search Console
- [ ] Inspect key URLs for indexability
- [ ] Check live redirects, 404 behavior, favicon, and social previews

## Remaining launch dependencies

- Confirm the final domain and canonical host.
- Verify the operator, service availability, and exact coverage for all 43 proposed markets.
- Assign and test the lead-routing destination, data-retention policy, and spam protection.
- Supply an active phone number only if calls will be answered.
- Supply only verified licensing, insurance, certifications, guarantees, team information, reviews, and business proof the operator is authorized to publish.
- Decide whether analytics and consent controls are required.
- Set `indexingEnabled` to `true` only after the previous items are complete, then rebuild and re-audit.

## Known limitations

- The site is a completed pre-launch property, not a representation of an active leak-detection company.
- Forms intentionally do not send or store data.
- Coverage statements are framed as intended or pending verification.
- No Lighthouse score was recorded; structural, browser, console, responsive, and axe-core checks were completed instead.
- Deployment and live-domain smoke testing are outside this delivery and were not requested.
