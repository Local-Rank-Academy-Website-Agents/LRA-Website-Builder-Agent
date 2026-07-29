# LRA Website Builder Agent

An execution-focused website builder for local rank-and-rent projects.

Its job is simple:

1. Turn a completed project brief into a polished, trustworthy local-service website.
2. Build the site for organic visibility, qualified leads, speed, accessibility, and conversion.
3. Deliver clean source files and a deployment-ready package that another person can upload and launch.

This repository is the operating system for that work. It is not a hosting platform, lead marketplace, or general-purpose marketing agent.

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

## Default operating model

The agent follows [AGENTS.md](AGENTS.md). Start a project by copying [templates/PROJECT-BRIEF.md](templates/PROJECT-BRIEF.md), then use the acceptance standards in [docs/QUALITY-BAR.md](docs/QUALITY-BAR.md) and finish with [templates/HANDOFF-CHECKLIST.md](templates/HANDOFF-CHECKLIST.md).

The default delivery target is a portable static build. Use a server or CMS only when the project brief requires it.

## Definition of done

A site is done only when:

- The design feels bespoke and production-ready on mobile and desktop.
- All required pages, links, forms, metadata, and schema are complete.
- Claims are supportable and no fake reviews, credentials, addresses, or guarantees are present.
- The production build succeeds from a clean install.
- The deployable output has been inspected at representative breakpoints.
- The handoff package can be used by someone who did not build the site.

Deployment is intentionally a handoff step unless the project owner explicitly asks the agent to deploy.

## Repository layout

```text
.
├── AGENTS.md
├── docs/
│   └── QUALITY-BAR.md
├── templates/
│   ├── HANDOFF-CHECKLIST.md
│   └── PROJECT-BRIEF.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── new-site.yml
    └── pull_request_template.md
```

## Principles

- Useful local content over doorway-page spam
- Real proof over invented social proof
- Clear ownership and deployment notes over hidden dependencies
- Fast, accessible experiences over visual gimmicks
- Market-specific design over copy-pasted templates
- Verified completion over “looks done”

