---
name: build-website
description: Collect a guided intake and build a complete, polished, deployment-ready local-service or rank-and-rent website. Use when a user invokes $build-website, asks to build a local lead-generation website, provides a website brief, or wants to turn a business name, primary service, market, phone/address status, Google Business Profile status, assets, and reference sites into a finished website and handoff package.
---

# Build Website

Build the entire website from guided intake through verified handoff. Do not stop after generating a plan or brief unless the user selects approval mode.

Read `references/truth-and-local-policy.md` before collecting or publishing phone, address, Google Business Profile, review, or structured-data information. Read `references/build-spec.md` before implementation.

## 1. Resolve the input path

Use an existing `PROJECT-BRIEF.md` or `site.config.json` when supplied. Otherwise run the conversational intake below.

Offer the deterministic terminal intake only when the user prefers a script:

```bash
npm run build-website
```

That script can generate the project files and optionally launch Codex or Claude Code.

## 2. Run the conversational intake

Ask the following first-round questions together. Keep the language simple and accept answers in any format.

1. What is the business or website name?
2. Is this for an operating business, an authorized tenant/operator, or a rank-and-rent site still waiting for an operator?
3. What is the main service?
4. What city and state are you targeting, and what nearby areas are genuinely served?
5. Do you have an active business phone number, plan to rent one later, or want form-only leads for now? Ask for the number only when active.
6. Which address situation applies?
   - Real storefront or office, staffed and open to customers
   - Real service-area base that should stay hidden
   - Address will be rented or opened later
   - Virtual office, mailbox, or coworking address
   - No address
7. Do you have a Google Business Profile? Accept: verified, created but pending, planned, none, not eligible, or unsure. Request the profile URL only when it exists.
8. Share reference-site URLs, screenshots, logos, photos, colors, or examples you want the design to learn from.

Ask one short follow-up round only for missing essentials:

- Active email or form destination
- Secondary services
- Domain status
- Preferred hosting platform
- Autopilot or plan/design approval before implementation

Default to autopilot, a portable static build, and no deployment when the user has no preference.

Do not repeatedly ask for optional facts. Record unresolved launch values as blockers.

## 3. Normalize the project

Create `projects/<project-slug>/` containing:

- `PROJECT-BRIEF.md`
- `site.config.json`
- `BUILD-REQUEST.md`
- `LAUNCH-BLOCKERS.md`
- `site/`

Use the schema produced by `scripts/intake.mjs`. If intake happened conversationally, create equivalent files directly.

Copy `assets/site-starter/` into `projects/<project-slug>/site/` as the implementation baseline. Replace the starter composition substantially; it is infrastructure, not a visual template.

## 4. Handle reference websites and assets

Inspect supplied URLs or screenshots with available browser, image, or web tools. Extract design traits such as:

- Typography character
- Density and spacing
- Navigation behavior
- Section rhythm
- Color and image treatment
- CTA placement
- Mobile interaction patterns

Do not copy text, logos, source code, photography, or a distinctive design wholesale. Use references as direction.

Prefer user-provided or properly licensed media. Generate original imagery only when the environment supports it and the result fits the niche.

## 5. Plan and build

In approval mode, present a compact sitemap, homepage outline, conversion path, and visual direction, then wait for approval.

In autopilot mode, make those decisions and continue immediately.

Build a bespoke, mobile-first website that:

- Identifies the service, market, proof, and primary action in the first screen
- Uses unique, useful service and market content
- Includes only legitimate location pages with meaningful differentiation
- Provides clear phone or form actions based on verified intake
- Uses semantic HTML, visible focus, accessible controls, and responsive layouts
- Includes titles, descriptions, canonicals, social metadata, crawl controls, and truthful structured data
- Includes privacy information and a useful not-found page
- Contains no fake reviews, staff, projects, licenses, address, phone number, awards, or guarantees

Use a form-first conversion path when the phone is not active. Never publish a placeholder phone number.

## 6. Apply address and GBP branching

Follow `references/truth-and-local-policy.md`.

At minimum:

- Publish a street address in visible content and `LocalBusiness` schema only when it is a real, current customer-facing location.
- Keep a service-area base private when customers are not served there.
- Never publish a future, virtual, mailbox, or merely rented address as the current location.
- Record future phone/address/GBP work in `LAUNCH-BLOCKERS.md`.
- Do not create or imply a Google Business Profile for a pure lead-generation site waiting for an operator.
- Keep NAP and GBP information consistent when a verified profile exists.

## 7. Verify

From the project `site/` directory:

```bash
npm run check
npm run build
```

Then inspect the built site at representative mobile and desktop widths. Test:

- Navigation, links, phone actions, forms, and error/success states
- Overflow, clipping, focus order, contrast, image sizing, and responsive composition
- Titles, descriptions, canonicals, schema, sitemap, robots behavior, and 404 handling
- Missing assets, console errors, template tokens, unsupported claims, and launch placeholders

Fix failures before handoff. Treat automated checks as a floor, not visual approval.

## 8. Handoff

Create `projects/<project-slug>/HANDOFF.md` using `templates/HANDOFF-CHECKLIST.md`.

Deliver:

- Complete source
- Verified `dist/` output
- Build and upload instructions
- Environment-variable names without secret values
- Form, analytics, domain, DNS, and hosting notes
- `LAUNCH-BLOCKERS.md` with exact activation steps for any future phone, address, or GBP
- Representative mobile and desktop screenshots when supported

Do not deploy unless the user explicitly requests deployment.
