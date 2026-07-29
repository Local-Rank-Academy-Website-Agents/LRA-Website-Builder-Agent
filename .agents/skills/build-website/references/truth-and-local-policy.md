# Truth, Address, Phone, GBP, and Schema Rules

Use these rules before writing public content or structured data.

## Operating identity

- Distinguish an operating business or authorized operator from a rank-and-rent property still waiting for an operator.
- Never imply that a lead-generation property is a verified local business.
- Never invent reviews, employees, history, licenses, jobs, guarantees, addresses, phone numbers, or a Google Business Profile.

## Phone branching

| Intake status | Public website behavior | Handoff behavior |
| --- | --- | --- |
| Active and controlled | Publish the number and `tel:` links; include it in appropriate schema | Verify routing before launch |
| Planned/rented later | Use form-first CTAs; omit `telephone` from schema | Add an activation blocker with every file/config location to update |
| No phone | Use form-first CTAs | Document optional future activation |

Never publish a fake, example, inactive, or competitor phone number.

## Address branching

| Intake status | Public website behavior | Structured-data behavior |
| --- | --- | --- |
| Current staffed customer-facing storefront/office | Display the verified address where useful | `LocalBusiness.address` may use the verified physical address |
| Current service-area base; customers are not served there | Do not display the street address | Prefer truthful `Organization`, `Service`, and `areaServed`; do not expose the private base |
| Future location or address not yet rented/open | Do not display it as current | Omit the address and record a launch blocker |
| Virtual office, mailbox, or unstaffed coworking address | Do not present it as the business location | Omit the address |
| No address | Use honest service-area language | Use schema that does not claim a physical location |

Google describes `LocalBusiness.address` as the physical location of the business:
https://developers.google.com/search/docs/appearance/structured-data/local-business

Google Business Profile rules require accurate real-world representation. Virtual offices are generally ineligible; coworking offices require signage, customer access, and the business's own staff during business hours:
https://support.google.com/business/answer/3038177

Service-area businesses that do not serve customers at their address should hide it and use accurate service areas:
https://support.google.com/business/answer/9157481

## Google Business Profile branching

| Status | Website behavior |
| --- | --- |
| Verified | Match the verified business name, phone, address/service-area model, hours, and profile URL |
| Pending | Use only verified current facts; do not claim verification |
| Planned or none | The website may launch without a profile; record setup as a handoff item |
| Not eligible / lead-generation property | Do not create, claim, or imply a profile |
| Unsure | Flag for an eligibility review before profile work |

Google states that lead-generation agents or companies and online-only brands are not eligible for a Business Profile:
https://support.google.com/business/answer/13763036

## Future-value activation

When a phone, address, or GBP will be added later:

1. Keep the value out of production content and schema.
2. Store only non-sensitive planning notes in the project brief.
3. Add an unchecked item to `LAUNCH-BLOCKERS.md`.
4. List the exact configuration fields and pages that must be updated.
5. Require a new production build and schema validation after activation.
