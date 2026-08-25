# Launch Blockers

The source and static production package are complete, but this pre-launch rank-and-rent property must remain non-indexable and non-routing until every applicable item is resolved.

## Operator and claims

- [ ] Select a real plumbing operator under a written lead-routing or tenancy agreement.
- [ ] Verify the responsible operator and applicable licenses/registrations through the Texas State Board of Plumbing Examiners.
- [ ] Verify insurance, service capabilities, gas/backflow credentials, emergency availability, commercial capability, and any other public proof before adding claims.
- [ ] Confirm every service-market combination; remove any service or area the operator cannot actually support.
- [ ] Review all local permit and inspection statements against the exact jurisdiction and current rules.

## Domain and indexing

- [ ] Select and control the production domain.
- [ ] Replace `baseUrl` in `site.config.json`.
- [ ] Set `indexingEnabled` to `true` only after the final domain, operator, coverage, privacy, and routing checks pass.
- [ ] Run `npm run build`, confirm production canonicals, inspect `dist/sitemap.xml`, and submit the live sitemap in Search Console.
- [ ] Configure HTTPS and one preferred-domain redirect at the host.

## Lead routing

- [ ] Select a controlled form destination and recipient.
- [ ] Add a secure server-side form handler; keep credentials out of source control.
- [ ] Add server-side validation, rate limiting, spam controls, failure logging, and accessible success/error handling.
- [ ] Define consent language, recipient disclosure, retention period, deletion process, and security controls.
- [ ] Update `/contact/`, `/privacy/`, `README.md`, and `HANDOFF.md`, then test real delivery end to end.

## Phone, email, and address

- [ ] If using a phone, obtain an active controlled number, test routing, add it to the shared site data and appropriate schema, and re-run the build/audit.
- [ ] Add a monitored business and privacy email.
- [ ] Do not publish a future, virtual, mailbox, private, or unstaffed address.
- [ ] Add a visible address or `LocalBusiness.address` only for a verified current customer-facing location belonging to an eligible real operator.

## Google Business Profile

- [ ] Do not create a Google Business Profile for Plumber Houston Pros as a lead-generation property.
- [ ] If an eligible operator later becomes the represented business, obtain express authorization and match its real name, phone, service-area model, hours, and profile URL exactly.

## Analytics and consent

- [ ] Select analytics and call-tracking tools, if any.
- [ ] Update the privacy notice and implement required consent/opt-out controls before loading nonessential technologies.
- [ ] Test conversion events without exposing form contents or sensitive data.

