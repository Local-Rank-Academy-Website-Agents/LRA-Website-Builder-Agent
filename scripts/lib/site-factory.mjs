import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(moduleDir, "..", "..");
export const manifestPath = path.join(repoRoot, "portfolio", "sites.json");

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function loadManifest() {
  return readJson(manifestPath);
}

export function getSite(slug, manifest = loadManifest()) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug || "")) throw new Error("Site slug must contain only lowercase letters, numbers, and hyphens.");
  const site = manifest.sites.find((candidate) => candidate.slug === slug);
  if (!site) throw new Error(`Site is not registered in portfolio/sites.json: ${slug}`);
  const directory = path.resolve(repoRoot, site.directory);
  const projectsRoot = path.resolve(repoRoot, "projects");
  if (directory !== projectsRoot && !directory.startsWith(`${projectsRoot}${path.sep}`)) throw new Error(`Site directory escapes projects/: ${site.directory}`);
  return { ...site, directory };
}

export function normalizeDomain(value) {
  if (!value) return null;
  const domain = String(value).trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new Error(`Invalid domain: ${value}`);
  return domain.replace(/^www\./, "");
}

export function canonicalHost(domain, prefix = "www") {
  return prefix ? `${prefix}.${domain}` : domain;
}

export function run(command, commandArgs, options = {}) {
  let executable = command;
  let resolvedArgs = commandArgs;
  if (process.platform === "win32" && command === "npm") {
    const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
    if (!fs.existsSync(npmCli)) throw new Error(`Unable to locate npm CLI beside Node.js: ${npmCli}`);
    executable = process.execPath;
    resolvedArgs = [npmCli, ...commandArgs];
  }
  const result = spawnSync(executable, resolvedArgs, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...(options.env || {}) },
    stdio: options.capture === false ? "inherit" : "pipe",
    shell: false
  });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    const safeError = `${stdout}\n${stderr}`.replaceAll(process.env.VERCEL_TOKEN || "__NO_TOKEN__", "[redacted]");
    throw new Error(`${command} failed with exit code ${result.status}.\n${safeError.trim()}`);
  }
  return { status: result.status, stdout, stderr };
}

export function vercelArgs(args, manifest = loadManifest()) {
  const version = process.env.VERCEL_CLI_VERSION || manifest.defaults.vercelCliVersion;
  const scope = process.env.VERCEL_SCOPE || manifest.defaults.vercelScope;
  const complete = ["exec", "--yes", `--package=vercel@${version}`, "--", "vercel", ...args];
  if (scope && !args.includes("--scope")) complete.push("--scope", scope);
  if (process.env.VERCEL_TOKEN && !args.includes("--token")) complete.push("--token", process.env.VERCEL_TOKEN);
  return complete;
}

export function runVercel(args, options = {}) {
  return run("npm", vercelArgs(args, options.manifest), options);
}

export function parseJsonOutput(output) {
  const text = String(output || "").trim();
  const starts = [text.indexOf("{"), text.indexOf("[")].filter((value) => value >= 0).sort((a, b) => a - b);
  if (!starts.length) throw new Error(`No JSON object found in command output: ${text.slice(0, 400)}`);
  return JSON.parse(text.slice(starts[0]));
}

export function readSiteConfig(site) {
  const file = path.join(site.directory, "site.config.json");
  if (!fs.existsSync(file)) throw new Error(`Missing site.config.json for ${site.slug}`);
  return { file, config: readJson(file) };
}

export function assertBuildableSite(site) {
  const packageFile = path.join(site.directory, "package.json");
  if (!fs.existsSync(packageFile)) throw new Error(`Missing package.json for ${site.slug}`);
  const packageJson = readJson(packageFile);
  if (!packageJson.scripts?.build) throw new Error(`Missing build script for ${site.slug}`);
  if (!packageJson.scripts?.check) throw new Error(`Missing check script for ${site.slug}`);
  return packageJson;
}

export function updateCanonical(site, domain, prefix = "www") {
  const { file, config } = readSiteConfig(site);
  config.baseUrl = `https://${canonicalHost(domain, prefix)}`;
  writeJson(file, config);
  return config;
}

export async function cloudflareRequest(endpoint, init = {}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN is required for unattended DNS changes. Use the documented browser fallback when it is not configured.");
  const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(`Cloudflare API request failed (${response.status}): ${JSON.stringify(payload.errors || payload)}`);
  return payload;
}

export async function findCloudflareZone(domain) {
  const payload = await cloudflareRequest(`/zones?name=${encodeURIComponent(domain)}&status=active&per_page=50`);
  const exact = payload.result.find((zone) => zone.name === domain);
  if (!exact) throw new Error(`Cloudflare zone not found or not accessible: ${domain}`);
  return exact;
}

export async function upsertCloudflareCname(zoneId, name, target) {
  const query = await cloudflareRequest(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(name)}&per_page=100`);
  const records = query.result;
  const conflicts = records.filter((record) => record.type !== "CNAME");
  if (conflicts.length) throw new Error(`Refusing to replace conflicting ${name} DNS record types: ${conflicts.map((record) => record.type).join(", ")}`);
  const body = JSON.stringify({ type: "CNAME", name, content: target.replace(/\.$/, ""), ttl: 1, proxied: false });
  if (records.length > 1) throw new Error(`Refusing to choose among multiple existing CNAME records for ${name}.`);
  if (records.length === 1) {
    return cloudflareRequest(`/zones/${zoneId}/dns_records/${records[0].id}`, { method: "PUT", body });
  }
  return cloudflareRequest(`/zones/${zoneId}/dns_records`, { method: "POST", body });
}

export function getChangedSiteSlugs(manifest = loadManifest()) {
  const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "HEAD^";
  const result = run("git", ["diff", "--name-only", base, "HEAD"], { allowFailure: true });
  if (result.status !== 0) return manifest.sites.filter((site) => site.managed).map((site) => site.slug);
  const names = result.stdout.split(/\r?\n/).filter(Boolean);
  return manifest.sites.filter((site) => names.some((name) => name === site.directory || name.startsWith(`${site.directory}/`))).map((site) => site.slug);
}
