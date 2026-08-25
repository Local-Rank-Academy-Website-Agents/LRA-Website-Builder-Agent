# Rank-and-Rent Site Factory

This repository can build, deploy, connect, and verify independent rank-and-rent properties with one command. New properties remain noindex and form-only until an operator and lead destination are verified.

## What the owner still controls

The project owner must choose and purchase each domain, provide or approve the eventual operator and lead destination, and explicitly approve indexing. The factory does not purchase domains, invent business proof, create an ineligible Google Business Profile, or activate unverified claims.

## One-time automation setup

1. Create a Vercel token and store it as the `VERCEL_TOKEN` GitHub environment secret.
2. Create a Cloudflare API token using the Edit Zone DNS template. Restrict it to the intended zones or account and store it as `CLOUDFLARE_API_TOKEN`.
3. Create GitHub environments named `preview` and `production`. Add required reviewers to `production` when a human promotion gate is desired.
4. Use `config/automation-env.example` only as a field-name reference. Keep real token values out of source control, screenshots, tickets, and chat.

The Cloudflare token is optional when Codex controls an already authenticated Cloudflare browser. Without the token, the launch command writes the exact DNS plan to `output/domain-setup/<site>.json` for the browser workflow.

## Register a property

Add the project to `portfolio/sites.json`. A pre-launch entry should look like:

```json
{
  "slug": "houston-repiping-pros",
  "directory": "projects/houston-repiping-pros",
  "vercelProject": "houston-repiping-pros",
  "domain": null,
  "status": "build-ready",
  "managed": true,
  "operatorStatus": "awaiting-operator",
  "leadRoutingStatus": "not-connected"
}
```

When a domain has been purchased, add the apex `domain` and preferred `canonicalHost` to the same record and update `site.config.json` to the matching HTTPS canonical.

## Commands

Validate the complete portfolio without deploying:

```powershell
npm run factory:check
```

Build every managed property:

```powershell
npm run factory:build
```

Show a launch plan without changing files or external systems:

```powershell
npm run factory:launch -- --site leak-detection-houston-pros --dry-run
```

Create a preview deployment:

```powershell
npm run factory:launch -- --site hydro-jetting-houston
```

Create a public review deployment for a static property with no secrets:

```powershell
npm run factory:launch -- --site hydro-jetting-houston --public-access
```

`--public-access` disables Vercel Authentication for the entire selected project, including existing deployments. Use it only for sites intended to be public. Without the flag, the team's deployment-protection policy remains unchanged.

Deploy a registered production domain and configure Cloudflare automatically:

```powershell
npm run factory:launch -- --site houston-repiping-pros --domain example.com --production --configure-dns
```

Verify a live site independently:

```powershell
npm run factory:verify -- --site leak-detection-houston-pros
```

## Launch sequence

The production command performs these operations:

1. Validate the registered site and launch gates.
2. Set the www canonical when a domain is supplied.
3. Run the site's production build and structural checks.
4. Deploy through the pinned Vercel CLI.
5. Attach the apex and www domains to the matching Vercel project.
6. Read Vercel's current project-specific DNS target.
7. Upsert DNS-only Cloudflare CNAME records when a scoped token is available.
8. Refuse to overwrite conflicting non-CNAME records.
9. Configure a permanent apex-to-www redirect in Vercel.
10. Verify HTTPS, canonical, robots policy, sitemap host, stylesheet, custom 404, and redirect behavior.

## GitHub workflow

The `Site factory` action accepts the registered site slug, preview or production target, optional domain, DNS choice, and an explicit public-access choice. Production can be protected with required environment reviewers. `Portfolio checks` validates the manifest and builds changed managed sites on pull requests and pushes to main.

Vercel projects remain independent even though their source lives in one repository. Each site keeps its own package, build output, configuration, launch blockers, and handoff documentation.
