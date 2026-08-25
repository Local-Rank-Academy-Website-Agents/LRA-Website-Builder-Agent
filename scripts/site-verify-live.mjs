import process from "node:process";
import { getSite, loadManifest, normalizeDomain, parseArgs, readSiteConfig } from "./lib/site-factory.mjs";

const args = parseArgs();
const manifest = loadManifest();
const site = args.site ? getSite(args.site, manifest) : null;
const config = site ? readSiteConfig(site).config : null;
const domain = normalizeDomain(args.domain || site?.domain);
const primaryUrl = String(args.url || config?.baseUrl || "").replace(/\/$/, "");
if (!primaryUrl.startsWith("https://")) throw new Error("Provide --site with a production baseUrl or an explicit --url https://...");

const expectedCanonical = `${String(args["expected-canonical"] || primaryUrl).replace(/\/$/, "")}/`;
const expectedCanonicalBase = expectedCanonical.replace(/\/$/, "");
const expectedIndexing = args.indexable ? true : args.noindex ? false : Boolean(config?.indexingEnabled);
const headers = { "User-Agent": "LRA-Site-Factory/1.0 (+production smoke test)" };
const checks = [];
const record = (name, pass, detail) => checks.push({ name, pass, detail });

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    return await fetch(url, { headers, signal: controller.signal, ...options });
  } finally {
    clearTimeout(timeout);
  }
}

const home = await request(`${primaryUrl}/`);
const homeHtml = await home.text();
if (home.url.startsWith("https://vercel.com/login") || home.url.startsWith("https://vercel.com/sso-api")) {
  console.log(JSON.stringify({ ok: false, accessProtected: true, url: primaryUrl, detail: "Vercel Authentication intercepted the deployment." }, null, 2));
  process.exit(2);
}
record("homepage", home.status === 200, `HTTP ${home.status}`);
const canonical = homeHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1] || "";
record("homepage canonical", canonical === expectedCanonical, canonical || "missing");
record("homepage robots meta", expectedIndexing ? !/noindex/i.test(homeHtml) : /noindex/i.test(homeHtml), expectedIndexing ? "expected indexable" : "expected noindex");

const robots = await request(`${primaryUrl}/robots.txt`);
const robotsText = await robots.text();
record("robots.txt", robots.status === 200, `HTTP ${robots.status}`);
record("robots policy", expectedIndexing ? /Allow:\s*\//i.test(robotsText) && !/Disallow:\s*\//i.test(robotsText) : /Disallow:\s*\//i.test(robotsText), robotsText.trim().replace(/\s+/g, " ").slice(0, 240));

const sitemap = await request(`${primaryUrl}/sitemap.xml`);
const sitemapText = await sitemap.text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
record("sitemap.xml", sitemap.status === 200 && sitemapUrls.length > 0, `HTTP ${sitemap.status}; ${sitemapUrls.length} URLs`);
const sitemapHostMatches = sitemapUrls.every((url) => url.startsWith(`${expectedCanonicalBase}/`));
record("sitemap host", sitemapHostMatches, sitemapUrls.length ? (sitemapHostMatches ? "all URLs use the expected canonical host" : `expected ${expectedCanonicalBase}`) : "no URLs found");

const missing = await request(`${primaryUrl}/site-factory-missing-route-${Date.now()}/`);
record("custom 404", missing.status === 404, `HTTP ${missing.status}`);

const cssPath = homeHtml.match(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)/i)?.[1];
if (cssPath) {
  const css = await request(new URL(cssPath, `${primaryUrl}/`));
  record("primary stylesheet", css.status === 200, `HTTP ${css.status}; ${cssPath}`);
} else record("primary stylesheet", false, "stylesheet link not found");

if (domain) {
  const apex = await request(`https://${domain}/`, { redirect: "manual" });
  const location = apex.headers.get("location") || "";
  record("apex redirect", [301, 308].includes(apex.status) && location === `${primaryUrl}/`, `HTTP ${apex.status}; ${location || "no location"}`);
}

const failed = checks.filter((check) => !check.pass);
console.log(JSON.stringify({ ok: failed.length === 0, url: primaryUrl, checks }, null, 2));
if (failed.length) process.exit(1);
