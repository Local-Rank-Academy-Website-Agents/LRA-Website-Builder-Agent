# Repiping Houston Pros: Handoff

## Build

```powershell
npm install
npm run check
npm run build
```

Production output: `dist/`

## Deployment

Vercel uses `npm run build` and serves `dist/`. The independent production project is live at `https://repiping-houston.vercel.app/`. The apex and `www` custom domains are already assigned to this project and will become active after the domain is purchased and its Cloudflare DNS records point to Vercel.

## Lead routing

`site/assets/lead-routing.js` sends valid form fields to the existing HubSpot form endpoint. No secret is stored in source. The script reads the site name and optional phone from generated page attributes. A phone is not activated until `site.config.json` contains a controlled ten-digit number.

## SEO and crawl controls

- Indexing is enabled.
- `robots.txt`, XML sitemap, canonicals, social metadata, breadcrumbs, and visible FAQ markup are generated at build time.
- 314 HTML pages include 258 one-to-one city/service routes.
- The automated check verifies page counts, H1 and canonical mapping, form and asset presence, broken links, global directories, matched city/service links, FAQ markup, JSON-LD, and minimum page depth.

## Truth boundaries

The public site is an independent request resource. Do not add an address, GBP, license, review, provider name, availability guarantee, or price until the exact fact is verified and authorized.
