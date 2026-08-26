import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { assertBuildableSite, canonicalHost, findCloudflareZone, getSite, loadManifest, normalizeDomain, parseArgs, parseJsonOutput, readSiteConfig, repoRoot, run, runVercel, updateCanonical, upsertCloudflareCname, writeJson } from "./lib/site-factory.mjs";

const args = parseArgs();
if (!args.site) throw new Error("Usage: npm run factory:launch -- --site <slug> [--domain example.com] [--production] [--configure-dns] [--dry-run]");

const manifest = loadManifest();
const site = getSite(args.site, manifest);
if (!site.managed) throw new Error(`${site.slug} is recorded as externally managed and cannot be launched by this factory.`);
assertBuildableSite(site);

const domain = normalizeDomain(args.domain || site.domain);
const prefix = String(args["canonical-prefix"] || manifest.defaults.canonicalPrefix || "www");
const host = domain ? canonicalHost(domain, prefix) : null;
const isProduction = Boolean(args.production);
const configureDns = Boolean(args["configure-dns"]);
const publicAccess = Boolean(args["public-access"]);
const dryRun = Boolean(args["dry-run"]);

if (configureDns && !domain) throw new Error("--configure-dns requires --domain or a domain in portfolio/sites.json.");
if (isProduction && domain && !site.domain && !args["accept-unregistered-domain"]) {
  throw new Error("The requested production domain is not yet recorded in portfolio/sites.json. Add it to the manifest or pass --accept-unregistered-domain after verifying ownership.");
}

const { config: startingConfig } = readSiteConfig(site);
if (isProduction && site.operatorStatus === "awaiting-operator" && startingConfig.indexingEnabled) throw new Error("Production launch blocked: indexing is enabled while the site awaits an operator.");

const plan = {
  site: site.slug,
  directory: path.relative(repoRoot, site.directory).replaceAll("\\", "/"),
  target: isProduction ? "production" : "preview",
  domain,
  canonicalHost: host,
  configureDns,
  publicAccess,
  indexingEnabled: startingConfig.indexingEnabled,
  operatorStatus: site.operatorStatus,
  leadRoutingStatus: site.leadRoutingStatus
};
console.log(JSON.stringify({ plan }, null, 2));
if (dryRun) process.exit(0);

if (domain && startingConfig.baseUrl !== `https://${host}`) updateCanonical(site, domain, prefix);

if (!args["skip-build"]) run("npm", ["run", "build"], { cwd: site.directory, capture: false });

const deployArgs = ["deploy", "--yes", "--json", isProduction ? "--prod" : "--target=preview"];
const deploy = runVercel(deployArgs, { cwd: site.directory });
const deployment = parseJsonOutput(deploy.stdout);
const deploymentUrl = deployment.deployment?.url || deployment.url || deployment.production || null;
if (!deploymentUrl) throw new Error(`Unable to read deployment URL from Vercel output: ${deploy.stdout.slice(-800)}`);

if (publicAccess) {
  const publicAccessFile = path.join(repoRoot, "output", "vercel-setup", `${site.slug}-public-access.json`);
  writeJson(publicAccessFile, { ssoProtection: null });
  runVercel(["api", `/v9/projects/${encodeURIComponent(site.vercelProject)}`, "-X", "PATCH", "--input", publicAccessFile, "--raw"], { cwd: site.directory });
  console.log(`Vercel Authentication disabled for this public rank-and-rent project. Configuration recorded in ${path.relative(repoRoot, publicAccessFile)}.`);
}

let dnsPlan = null;
if (domain) {
  for (const candidate of [domain, host]) {
    const added = runVercel(["domains", "add", candidate, site.vercelProject], { cwd: site.directory, allowFailure: true });
    const combined = `${added.stdout}\n${added.stderr}`;
    if (added.status !== 0 && !/already|configured|verified|exists/i.test(combined)) throw new Error(`Unable to attach ${candidate} to Vercel: ${combined.trim()}`);
  }

  const firstVerification = runVercel(["domains", "verify", host], { cwd: site.directory, allowFailure: true });
  const verification = parseJsonOutput(firstVerification.stdout);
  const recommended = verification.recommended?.records?.find((record) => record.type === "CNAME") || verification.recommended?.cname?.[0];
  const target = typeof recommended?.value === "string" ? recommended.value : Array.isArray(recommended?.value) ? recommended.value[0] : null;
  if (!target) throw new Error(`Vercel did not return a recommended CNAME target for ${host}.`);
  dnsPlan = {
    provider: "cloudflare",
    proxy: false,
    records: [
      { type: "CNAME", name: "@", fqdn: domain, target: target.replace(/\.$/, "") },
      { type: "CNAME", name: prefix, fqdn: host, target: target.replace(/\.$/, "") }
    ]
  };
  const handoffFile = path.join(repoRoot, "output", "domain-setup", `${site.slug}.json`);
  writeJson(handoffFile, { generatedAt: new Date().toISOString(), site: site.slug, domain, canonicalHost: host, dnsPlan });
  console.log(`DNS plan written to ${path.relative(repoRoot, handoffFile)}.`);

  if (configureDns) {
    const zone = await findCloudflareZone(domain);
    for (const record of dnsPlan.records) await upsertCloudflareCname(zone.id, record.fqdn, record.target);
  } else if (!verification.ok) {
    console.warn("DNS is not configured yet. Apply the generated plan through Cloudflare or rerun with --configure-dns and a scoped CLOUDFLARE_API_TOKEN.");
  }

  if (configureDns || verification.ok) {
    let verified = verification.ok;
    for (let attempt = 0; attempt < 8 && !verified; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const checked = parseJsonOutput(runVercel(["domains", "verify", host], { cwd: site.directory }).stdout);
      verified = checked.ok;
    }
    if (!verified) throw new Error(`Vercel has not verified ${host} after DNS configuration.`);
    const endpoint = `/v9/projects/${encodeURIComponent(site.vercelProject)}/domains/${encodeURIComponent(domain)}`;
    runVercel(["api", endpoint, "-X", "PATCH", "-f", `redirect=${host}`, "-F", "redirectStatusCode=308", "--raw"], { cwd: site.directory });
  }
}

const publicUrl = domain ? `https://${host}` : `https://${deploymentUrl.replace(/^https?:\/\//, "")}`;
if (!args["skip-verify"] && (!domain || configureDns || site.domain === domain)) {
  const verifyArgs = [path.join(repoRoot, "scripts", "site-verify-live.mjs"), "--url", publicUrl];
  if (domain) verifyArgs.push("--domain", domain);
  else verifyArgs.push("--expected-canonical", startingConfig.baseUrl);
  if (startingConfig.indexingEnabled) verifyArgs.push("--indexable");
  else verifyArgs.push("--noindex");
  run(process.execPath, verifyArgs, { cwd: repoRoot, capture: false });
}

console.log(JSON.stringify({ ok: true, site: site.slug, target: isProduction ? "production" : "preview", deploymentUrl: `https://${deploymentUrl.replace(/^https?:\/\//, "")}`, publicUrl, dnsPlan }, null, 2));
