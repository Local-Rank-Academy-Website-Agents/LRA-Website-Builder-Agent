# Launch Blockers

This build is a test package for a rank-and-rent property awaiting an operator. Do not make it public or indexable until every required item below is resolved.

## Required before public launch

- [ ] **Contract with an authorized operator.** Record the legal operator name and verify each of the 18 mapped service capabilities and all intended community/ZIP-code coverage. Remove unsupported services and locations before launch.
- [ ] **Verify Texas licensing for regulated work.** Confirm the operator's current TDLR mold remediation company and contractor records. Add license details only after verification and operator approval.
- [ ] **Confirm service scope.** In `PROJECT-BRIEF.md` and every relevant page, remove any service the operator does not perform. Keep assessment/testing described as independent when Texas rules require separation.
- [ ] **Select and control a domain.** Replace `baseUrl` in `site.config.json`, update the domain text in `HANDOFF.md`, then rebuild so generated canonical and Open Graph URLs use the verified domain.
- [ ] **Connect the lead form.** Set a real destination in `site/assets/main.js` or the hosting platform's form configuration. Update the success/error copy and test an end-to-end submission.
- [ ] **Add a monitored contact channel.** Add a verified business email or active controlled phone only if the project owner wants it published. If a phone is added, update navigation, contact content, schema where appropriate, and test every `tel:` link.
- [ ] **Decide analytics and consent.** Configure analytics only with the correct owner property and consent behavior.
- [ ] **Enable indexing only after all other blockers pass.** Set `indexingEnabled` to `true` in `site.config.json`; rebuild so robots metadata is regenerated; confirm `dist/robots.txt` allows crawling; validate the sitemap and schema.
- [ ] **Run final operator review.** Confirm name, service descriptions, hours if added, coverage, lead routing, privacy text, and referral disclosure.

## Address and Google Business Profile

- No address exists. Do not add an address to visible content or structured data.
- This lead-generation property is not eligible for a Google Business Profile while awaiting an operator. Do not create, claim, or imply one.
- If a future operator has a legitimate profile, link to it only after confirming name, phone, service-area/address model, and ownership consistency. Never use a virtual office, mailbox, or unstaffed address.

## Activation verification

After any phone, address, operator, domain, form, or GBP change:

1. Run `npm run check`.
2. Run `npm run build`.
3. Inspect mobile, tablet, and desktop layouts.
4. Test every lead action end to end.
5. Validate structured data and confirm no private or future address leaked.
