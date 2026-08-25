# Leak Detection Houston Pros

Portable static rank-and-rent website for a pre-launch Greater Houston leak-detection property. The package contains 358 generated HTML pages, including seven service pages, 43 service-area guides, and all 301 one-to-one city/service combinations.

## Current launch state

This build is intentionally pre-launch:

- Indexing is disabled in `site.config.json` and `robots.txt`.
- The canonical host is the temporary Vercel production domain; a final custom domain is still pending.
- No phone number, address, Google Business Profile, reviews, credentials, operator claims, or fabricated proof are published.
- Forms validate and show a completed-review state but do not transmit or retain submissions.

Resolve every item in `LAUNCH-BLOCKERS.md` before making the site public or indexable.

## Requirements

- Node.js 24 or a current supported Node.js LTS release
- npm 11 or the npm version bundled with Node.js

There are no runtime application dependencies.

## Commands

```powershell
npm ci
npm run dev
```

The local preview opens at `http://127.0.0.1:4183`.

```powershell
npm run check
npm run build
```

`npm run build` regenerates every route, refreshes `ROUTE-INVENTORY.csv`, runs structural and SEO checks, and writes the portable production package to `dist/`.

## Project structure

- `scripts/site-data.mjs` — approved services, markets, local context, and linking relationships
- `scripts/generate-site.mjs` — route and page generator
- `scripts/check.mjs` — route, metadata, content, schema, link, and asset verification
- `site/` — generated source website
- `dist/` — deployment-ready static output
- `ROUTE-INVENTORY.csv` — complete route inventory
- `KEYWORD-MAP.md` — page ownership and cannibalization rules
- `HANDOFF.md` — delivery and launch checklist
- `CONTENT-SOURCES.md` — reference, font, and generated-image notes

## Deployment

Upload the contents of `dist/` to any static host. `vercel.json` supplies clean-URL and trailing-slash behavior for Vercel. On another host, configure directory-index routing and a custom 404 page.

Before deployment:

1. Replace the temporary Vercel base URL in `site.config.json` when the final custom domain is ready.
2. Verify the operator and true service coverage.
3. Connect and test an authorized lead destination and spam control.
4. Add only verified contact, trust, and business details.
5. Add analytics/consent configuration if required.
6. Set `indexingEnabled` to `true`, rebuild, and inspect the output.

No secrets or machine-specific paths are required by the generated site.
