# LRA Website Builder Agent

An execution-focused website builder for local rank-and-rent projects.

Its job is simple:

1. Collect the facts needed to build a trustworthy local-service website.
2. Build the site for organic visibility, qualified leads, speed, accessibility, and conversion.
3. Deliver clean source files and a deployment-ready package that another person can upload and launch.

## Quick start

From Codex, open this repository and invoke:

```text
$build-website
```

You can also type `/skills` and choose **Build Website**. Codex uses `$build-website` for a direct skill mention rather than a custom slash-command name.

From Claude Code, invoke:

```text
/build-website
```

From a terminal, run:

```bash
npm run build-website
```

The guided intake collects the business, operating status, primary service, market, phone status, address status, Google Business Profile status, lead routing, brand assets, and reference websites. It then creates a normalized project and can launch Codex or Claude Code to complete the build.

## What it produces

Every completed project includes:

- A distinctive, mobile-first website aligned with the niche and market
- Conversion-focused service and location architecture
- Unique, useful copy with clear calls to action
- Technical SEO foundations, structured data, and crawl controls
- Optimized images, accessible interactions, and strong Core Web Vitals
- Working forms with documented integration points
- A production build with no secrets or machine-specific dependencies
- A plain-language handoff guide for upload, deployment, DNS, forms, and analytics
- A launch-blocker list for any future phone, address, domain, form, or Google Business Profile

## Default operating model

The agent follows [AGENTS.md](AGENTS.md) and the repo skill at [.agents/skills/build-website/SKILL.md](.agents/skills/build-website/SKILL.md). It applies the acceptance standards in [docs/QUALITY-BAR.md](docs/QUALITY-BAR.md) and finishes with [templates/HANDOFF-CHECKLIST.md](templates/HANDOFF-CHECKLIST.md).

The default delivery target is a portable static build. Use a server or CMS only when the project brief requires it. Deployment is a handoff step unless the project owner explicitly requests it.

## Definition of done

A site is done only when:

- The design feels bespoke and production-ready on mobile and desktop.
- All required pages, links, forms, metadata, and truthful schema are complete.
- Claims are supportable and no fake reviews, credentials, addresses, phone numbers, or guarantees are present.
- The production build succeeds.
- The deployable output has been inspected at representative breakpoints.
- The handoff package can be used by someone who did not build the site.

## Repository layout

```text
.
|-- .agents/skills/build-website/
|   |-- SKILL.md
|   |-- scripts/intake.mjs
|   |-- references/
|   `-- assets/site-starter/
|-- .claude/commands/build-website.md
|-- .github/
|-- docs/QUALITY-BAR.md
|-- templates/
|-- AGENTS.md
`-- package.json
```

## Principles

- Useful local content over doorway-page spam
- Real proof over invented social proof
- Clear ownership and deployment notes over hidden dependencies
- Fast, accessible experiences over visual gimmicks
- Market-specific design over copy-pasted templates
- Verified completion over "looks done"
- No future, virtual, mailbox, or unstaffed address published as a current business location
