import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { assertBuildableSite, canonicalHost, getChangedSiteSlugs, getSite, loadManifest, normalizeDomain, parseArgs, readSiteConfig, run } from "./lib/site-factory.mjs";

const args = parseArgs();
const manifest = loadManifest();
const failures = [];
const seenSlugs = new Set();
const seenDomains = new Set();

for (const candidate of manifest.sites) {
  try {
    if (seenSlugs.has(candidate.slug)) failures.push(`Duplicate site slug: ${candidate.slug}`);
    seenSlugs.add(candidate.slug);
    const site = getSite(candidate.slug, manifest);
    assertBuildableSite(site);
    const { config } = readSiteConfig(site);
    if (candidate.domain) {
      const domain = normalizeDomain(candidate.domain);
      if (seenDomains.has(domain)) failures.push(`Duplicate portfolio domain: ${domain}`);
      seenDomains.add(domain);
      const expected = `https://${candidate.canonicalHost || canonicalHost(domain)}`;
      if (config.baseUrl !== expected) failures.push(`${site.slug}: baseUrl ${config.baseUrl} does not match ${expected}`);
    } else if (candidate.managed && !String(config.baseUrl || "").endsWith(".invalid")) {
      failures.push(`${site.slug}: an unassigned managed site must retain a reserved .invalid baseUrl`);
    }
    if (candidate.managed && candidate.operatorStatus === "awaiting-operator" && config.indexingEnabled) failures.push(`${site.slug}: indexing cannot be enabled while the site awaits an operator`);
    if (!fs.existsSync(path.join(site.directory, "HANDOFF.md"))) failures.push(`${site.slug}: missing HANDOFF.md`);
    if (!fs.existsSync(path.join(site.directory, "LAUNCH-BLOCKERS.md"))) failures.push(`${site.slug}: missing LAUNCH-BLOCKERS.md`);
  } catch (error) {
    failures.push(`${candidate.slug}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

let buildSlugs = [];
if (args.build) {
  buildSlugs = args.changed ? getChangedSiteSlugs(manifest) : manifest.sites.filter((site) => site.managed).map((site) => site.slug);
  for (const slug of buildSlugs) {
    const site = getSite(slug, manifest);
    console.log(`Building ${slug}...`);
    run("npm", ["run", "build"], { cwd: site.directory, capture: false });
  }
}

console.log(`Portfolio check passed: ${manifest.sites.length} registered sites, ${seenDomains.size} assigned domains${args.build ? `, ${buildSlugs.length} builds` : ""}.`);
