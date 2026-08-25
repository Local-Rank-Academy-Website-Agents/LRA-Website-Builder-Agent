# Plumber Houston Pros

A portable, zero-dependency static rank-and-rent website for a comprehensive Greater Houston plumbing service and market architecture.

## What is included

- 104 generated HTML pages
- 54 distinct plumbing service pages
- 43 hyper-local intended service-area pages
- Exact title/H1 alignment on every route
- Unique descriptions, canonicals, visible FAQs, and page-specific body content
- Reciprocal service-to-area and area-to-service linking
- Accessible desktop mega-menus and mobile submenus
- Browser-only test form with validation and no transmission
- Pre-launch `noindex` controls, sitemap generation, robots generation, structured data, 404 page, and original code-native visual assets
- Automated content similarity, paragraph duplication, metadata, schema, broken-link, navigation, and route-count audits

## Commands

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
npm run check
npm run build
```

`npm run build` writes the independently deployable site to `dist/`.

## Source of truth

`scripts/site-data.mjs` owns all approved service and market records. `scripts/generate-site.mjs` uses it for pages, navigation, internal links, schema, and FAQs. `scripts/generate-docs.mjs` uses the same data for `KEYWORD-MAP.md` and `ROUTE-INVENTORY.csv`.

Do not hand-edit generated HTML pages, `KEYWORD-MAP.md`, or `ROUTE-INVENTORY.csv`. Edit the shared data/generator and regenerate.

## Current launch state

- Reserved placeholder canonical: `https://plumber-houston-pros.invalid`
- Indexing: Disabled
- Phone: None
- Form destination: None
- Address: None
- Google Business Profile: Not eligible for the lead-generation property
- Analytics: None
- Environment variables: None

See `LAUNCH-BLOCKERS.md` before any production launch.

## Static deployment

1. Resolve every launch blocker.
2. Set the real HTTPS `baseUrl` and enable indexing only when appropriate.
3. Run `npm run build`.
4. Upload the contents of `dist/` to the web root of Netlify, Cloudflare Pages, Vercel static hosting, GitHub Pages, S3-compatible hosting, or another static server.
5. Configure HTTPS and one preferred-domain redirect.
6. Re-test the live form, navigation, canonicals, robots file, sitemap, 404 response behavior, and social preview.

