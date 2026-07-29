# Build Specification

## Default output

Create a portable static site in `projects/<slug>/site/` using the bundled zero-dependency starter. Use another stack only when the brief requires it.

## Default information architecture

Adapt this list to the project:

- Home
- Primary service
- Additional service pages only when supported by the brief
- Market or service-area page with useful local context
- About or process/trust page
- Contact
- Privacy
- 404

Do not mass-produce thin city pages. Each indexable page needs a distinct purpose and meaningful content.

## Design requirements

- Create a niche-appropriate art direction, not a generic SaaS layout.
- Use one strong display type treatment and a highly readable body style.
- Establish a consistent spacing and color-token system.
- Make mobile CTA behavior intentional.
- Use photography or illustration with consistent treatment.
- Avoid excessive gradients, floating cards, meaningless statistics, and repeated feature grids.

## Conversion requirements

- Show service, market, proof, and action immediately.
- Use one primary conversion action per page.
- Keep forms short and clearly explain what happens next.
- Provide useful reassurance near conversion points.
- Use phone CTAs only when the phone is active.

## Technical SEO

- Use one descriptive title, description, H1, and canonical per indexable page.
- Add Open Graph and basic social metadata.
- Generate a sitemap from production URLs.
- Use truthful `Organization`, `Service`, `WebSite`, `BreadcrumbList`, and eligible local-business data.
- Add `areaServed` only for real coverage.
- Keep structured data consistent with visible content.
- Do not add self-serving review markup or unsupported aggregate ratings.

## Engineering and QA

- Keep secrets and personal/private base addresses out of public files.
- Preserve responsive images and explicit dimensions.
- Support keyboard navigation and reduced motion.
- Run `npm run check` and `npm run build`.
- Inspect mobile and desktop output visually.
- Complete `HANDOFF.md` and `LAUNCH-BLOCKERS.md`.
