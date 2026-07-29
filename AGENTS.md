# Agent Operating Contract

## Mission

Build pristine, high-converting local rank-and-rent websites and hand them off as clean, portable, deployment-ready packages.

Stay within that mission. Do not become the hosting operator, ad buyer, CRM administrator, or ongoing SEO campaign manager unless the project owner explicitly expands the scope.

## Guided entrypoint

For a new website, use the repo skill at `.agents/skills/build-website/SKILL.md`. Users can invoke it as `$build-website` in Codex or `/build-website` in Claude Code.

If no completed brief exists, run its guided intake. In autopilot mode, continue through planning, implementation, verification, and handoff without stopping after intake.

## Required inputs

Before implementation, resolve or document reasonable assumptions for:

- Niche and primary services
- Target city, service area, and nearby markets
- Domain or placeholder domain
- Brand name, voice, colors, and available assets
- Lead action, phone number, email, and form destination
- Required pages and exclusions
- Verified proof: licenses, insurance, years in business, reviews, guarantees, certifications, and service claims
- Operating status: live business, authorized operator, or rank-and-rent property awaiting an operator
- Phone status: active, planned later, or form-only
- Address status: eligible storefront, private service-area base, future, virtual/mailbox, or none
- Google Business Profile status and URL when one legitimately exists
- Preferred stack or hosting constraints
- Analytics, consent, and legal requirements

Use `templates/PROJECT-BRIEF.md`. Never invent business facts, customer reviews, addresses, credentials, prices, service availability, or performance guarantees.

## Build workflow

### 1. Plan

- Translate the brief into a compact sitemap and conversion journey.
- Identify the primary service, supporting services, and legitimate location coverage.
- Define one search intent and one primary conversion action per landing page.
- Establish a visual direction appropriate to the niche and market.
- Flag missing facts with visible placeholders that cannot be mistaken for finished content.

### 2. Design

- Create a bespoke visual system: typography, spacing, colors, surfaces, imagery, and components.
- Design mobile-first and verify desktop composition.
- Make the first screen immediately communicate service, location, proof, and next action.
- Use restrained motion and decoration. Never let effects interfere with clarity, speed, or accessibility.
- Avoid generic AI aesthetics, excessive gradients, crowded card grids, repetitive sections, and stock-template composition.

### 3. Build

- Prefer a portable static output unless the brief requires server-side behavior.
- Keep dependencies lean, supported, and documented.
- Use semantic HTML, responsive layouts, keyboard-accessible interactions, and visible focus states.
- Optimize images and fonts; reserve dimensions to avoid layout shift.
- Implement forms with validation, spam-control guidance, success/error states, and a documented destination.
- Keep secrets out of source control and deployable artifacts.

### 4. Optimize for local search

- Create descriptive titles, meta descriptions, headings, canonicals, and social metadata.
- Include a useful service-area structure without mass-produced doorway pages.
- Add internal links based on user journeys and topical relationships.
- Add appropriate JSON-LD using only verified facts.
- Provide `robots.txt` and a valid sitemap for indexable production sites.
- Preserve one clear primary topic per page while writing naturally for people.
- Include trust, process, FAQs, and local context only when accurate and useful.

### 5. Verify

- Run a clean install and production build.
- Inspect the built site at mobile, tablet, and desktop widths.
- Test navigation, forms, calls, email links, and every primary CTA.
- Check for broken links, overflow, clipping, contrast issues, missing alt text, duplicate metadata, console errors, and placeholder content.
- Confirm crawl controls, sitemap URLs, canonicals, structured data, and not-found behavior.
- Record any remaining limitations instead of hiding them.

### 6. Hand off

- Provide source, lockfile, and the production output directory.
- Include exact build and deployment commands.
- Document environment variables by name and purpose; never include secret values.
- Document form routing, analytics, DNS, domain, redirects, and post-launch checks.
- Complete `templates/HANDOFF-CHECKLIST.md`.
- Do not deploy unless explicitly requested. The normal final state is a package another person can upload and deploy without reverse-engineering the project.

## Quality gates

Do not mark a project complete unless all applicable gates in `docs/QUALITY-BAR.md` pass.

If automated scoring is available, target:

- Lighthouse Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Scores are signals, not substitutes for visual inspection and functional testing.

## Ethical and search-quality boundaries

- Do not fabricate reviews, staff, photos, project history, certifications, licenses, awards, addresses, or local presence.
- Do not publish a future, virtual, mailbox, or unstaffed address as a current location or place it in `LocalBusiness` address schema.
- Do not create or imply a Google Business Profile for an ineligible lead-generation property.
- Do not impersonate an existing company.
- Do not create misleading “near me” or location pages with no meaningful differentiation.
- Do not hide ownership, tracking, redirects, or lead routing from the project owner.
- Do not use copied competitor content or unlicensed media.
- Do not promise rankings or lead volume.

## Communication

Lead with the completed outcome. State assumptions and unresolved launch dependencies plainly. Handoff instructions must be understandable to a competent person who has never seen the codebase.
