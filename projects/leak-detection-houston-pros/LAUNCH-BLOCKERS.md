# Launch Blockers

The site is fully buildable and previewable, but it must remain noindex and form-only until these items are resolved.

## Required before public launch

- [ ] Contract and verify an eligible operator authorized to receive and perform work.
- [ ] Confirm the seven-service scope; remove unsupported services and their city matrices before indexing.
- [ ] Confirm intended coverage for every market and ZIP code; remove unsupported markets before indexing.
- [x] Replace the temporary Vercel `baseUrl` with the final custom HTTPS domain. Completed 2026-08-25.
- [ ] Keep `indexingEnabled` false until the domain, operator, coverage, content, and routing are verified.
- [ ] Connect `formEndpoint`; test success, validation, spam control, privacy handling, and errors end to end.
- [ ] Add a controlled phone number only if supplied; update maintained configuration and generated output, then rebuild and test every `tel:` link.
- [ ] Complete a privacy review for the real form processor, retention policy, analytics, cookies, and operator disclosures.

## Address and Google Business Profile

- [ ] Confirm final address status. Never publish a private base, future location, virtual office, mailbox, or unstaffed coworking location.
- [ ] Do not add `LocalBusiness.address` unless a real staffed customer-facing location is verified.
- [ ] Do not create or imply a Google Business Profile for this lead-generation property while it awaits an operator.
- [ ] If an eligible operator later uses the site, verify its GBP name, phone, address/service-area model, hours, and URL before adding a profile link or local-business schema.

## Analytics, search, and deployment

- [ ] Choose analytics and consent requirements; test consent behavior where required.
- [ ] Recheck canonicals, sitemap host, robots, structured data, and social previews after setting the final domain.
- [x] Deploy only after explicit project-owner authorization. Authorization received 2026-08-25.
- [ ] Run live HTTPS, redirect, form, navigation, 404, sitemap, robots, and Search Console smoke tests after deployment.
