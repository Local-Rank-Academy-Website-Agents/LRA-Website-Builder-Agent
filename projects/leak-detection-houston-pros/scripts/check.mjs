import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { areas, project } from "./site-data.mjs";

const root = process.cwd();
const source = path.join(root, "site");
const config = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
const failures = [];
const records = [];
const serviceBySlug = Object.fromEntries(project.services.map((service) => [service.slug, service]));
const areaBySlug = Object.fromEntries(areas.map((area) => [area.slug, area]));
const serviceRoute = (service) => `/services/${service.slug}/`;
const areaRoute = (area) => `/service-areas/${area.slug}/`;
const localRoute = (service, area) => `${areaRoute(area)}${service.slug}/`;
const localH1 = (service, area) => `${service.baseH1} in ${area.label}`;
const areaH1 = (area) => `Leak Detection in ${area.label}`;
const fail = (message) => failures.push(message);
const decode = (value) => value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&gt;/g,">").replace(/&lt;/g,"<");
const visible = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());
const walk = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory,{withFileTypes:true}).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory,entry.name)) : [path.join(directory,entry.name)]) : [];
const fileRoute = (file) => { const relative = path.relative(source,file).replaceAll("\\","/"); return relative === "index.html" ? "/" : relative === "404.html" ? "/404.html" : `/${relative.replace(/index\.html$/,"")}`; };
const expectedCanonical = (route) => `${config.baseUrl.replace(/\/$/,"")}${route}`;

for (const required of ["index.html","404.html","assets/styles.css","assets/main.js","assets/favicon.svg",...([400,500,600,700,800].map((weight)=>`assets/fonts/sora-${weight}.ttf`)),...project.services.map((service)=>`assets/images/${service.image}`)]) {
  if (!fs.existsSync(path.join(source,required))) fail(`Missing ${required}`);
}
try { new Function(fs.readFileSync(path.join(source,"assets","main.js"),"utf8")); } catch (error) { fail(`Invalid main.js: ${error.message}`); }

for (const file of walk(source).filter((candidate) => candidate.endsWith(".html"))) {
  const html = fs.readFileSync(file,"utf8");
  const route = fileRoute(file);
  const title = decode(html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "");
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match)=>visible(match[1]));
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || "");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || "";
  const faqHtml = html.match(/<section class="section faq"[\s\S]*?<\/section>/i)?.[0] || "";
  const faqCount = (faqHtml.match(/<details>/g)||[]).length;
  const links = new Set([...html.matchAll(/href="(\/[^"#?]*)/gi)].map((match)=>match[1]));
  const uniqueHtml = html.match(/<div data-unique-copy>([\s\S]*?)<\/div>\s*<section class="section (?:related|nearby)/i)?.[1] || html.match(/<div data-unique-copy>([\s\S]*?)<\/div>/i)?.[1] || "";
  const uniqueWords = visible(uniqueHtml).split(/\s+/).filter(Boolean).length;
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match)=>match[1]);

  if (h1s.length !== 1) fail(`H1 count ${h1s.length}: ${route}`);
  if (title !== h1s[0]) fail(`Title/H1 mismatch: ${route}`);
  if (route !== "/404.html" && (description.length < 70 || description.length > 180)) fail(`Description length ${description.length}: ${route}`);
  if (canonical !== expectedCanonical(route)) fail(`Canonical mismatch: ${route}`);
  if (route !== "/404.html" && faqCount !== 5) fail(`FAQ count ${faqCount}: ${route}`);
  if (!config.indexingEnabled && !/name="robots" content="noindex, nofollow"/.test(html)) fail(`Missing noindex: ${route}`);
  if (/\{\{[A-Z0-9_]+\}\}|\[TODO\b|\[PLACEHOLDER\]|REPLACE THIS|lorem ipsum/i.test(html)) fail(`Placeholder content: ${route}`);
  if (/LocalBusiness|aggregateRating|streetAddress|telephone/.test(html)) fail(`Unverified business fact/schema: ${route}`);
  if (/href="(?:tel:|mailto:)/i.test(html)) fail(`Unverified phone/email link: ${route}`);
  if (/\.png(?:"|')/.test(html)) fail(`Unoptimized PNG reference: ${route}`);
  if (new Set(ids).size !== ids.length) fail(`Duplicate HTML id: ${route}`);
  for (const image of [...html.matchAll(/<img\b([^>]*)>/gi)].map((match)=>match[1])) {
    if (!/\balt="[^"]+"/.test(image) || !/\bwidth="\d+"/.test(image) || !/\bheight="\d+"/.test(image) || !/\bloading="(?:lazy|eager)"/.test(image)) fail(`Incomplete image attributes: ${route}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { const data=JSON.parse(match[1]); const faqNode=data["@graph"]?.find((node)=>node["@type"]==="FAQPage"); if(route!=="/404.html" && faqNode?.mainEntity?.length!==faqCount) fail(`FAQ schema mismatch: ${route}`); }
    catch { fail(`Invalid JSON-LD: ${route}`); }
  }
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"#?]*)/gi)) {
    const reference=match[1]; const target=reference.endsWith("/")?path.join(source,reference.slice(1),"index.html"):path.join(source,reference.slice(1)); if(!fs.existsSync(target)) fail(`Broken ${reference}: ${route}`);
  }
  records.push({route,title,description,canonical,html,links,uniqueWords,contentHash:crypto.createHash("sha1").update(visible(uniqueHtml)).digest("hex")});
}

for (const key of ["title","description","canonical"]) {
  const seen=new Map();
  for (const record of records) { if(seen.has(record[key])) fail(`Duplicate ${key}: ${record.route} / ${seen.get(record[key])}`); else seen.set(record[key],record.route); }
}

const servicePages=records.filter((record)=>/^\/services\/[^/]+\/$/.test(record.route));
const areaPages=records.filter((record)=>/^\/service-areas\/[^/]+\/$/.test(record.route));
const matrixPages=records.filter((record)=>/^\/service-areas\/[^/]+\/[^/]+\/$/.test(record.route));
if (records.length !== 358) fail(`HTML page count ${records.length}/358`);
if (servicePages.length !== project.services.length) fail(`Service page count ${servicePages.length}/${project.services.length}`);
if (areaPages.length !== areas.length) fail(`Area page count ${areaPages.length}/${areas.length}`);
if (matrixPages.length !== project.services.length*areas.length) fail(`Matrix page count ${matrixPages.length}/${project.services.length*areas.length}`);

const home=records.find((record)=>record.route==="/");
if (home?.title !== project.homepageH1) fail("Homepage H1 does not match mapped Greater Houston target");
for (const service of project.services) if (!home?.links.has(serviceRoute(service))) fail(`Homepage missing ${service.slug}`);

for (const record of servicePages) {
  const service=serviceBySlug[record.route.split("/")[2]];
  if (!service || record.title!==service.baseH1) fail(`Service mapping mismatch: ${record.route}`);
  if (record.uniqueWords<450) fail(`Thin service copy ${record.uniqueWords}: ${record.route}`);
  for (const area of areas) if (!record.links.has(localRoute(service,area))) fail(`Service missing local link ${service.slug}/${area.slug}`);
  for (const slug of service.related) if (!record.links.has(serviceRoute(serviceBySlug[slug]))) fail(`Service missing related ${slug}: ${record.route}`);
}
for (const record of areaPages) {
  const area=areaBySlug[record.route.split("/")[2]];
  if (!area || record.title!==areaH1(area)) fail(`Area mapping mismatch: ${record.route}`);
  if (record.uniqueWords<300) fail(`Thin area copy ${record.uniqueWords}: ${record.route}`);
  for (const service of project.services) if (!record.links.has(localRoute(service,area))) fail(`Area missing local link ${area.slug}/${service.slug}`);
}
for (const record of matrixPages) {
  const [, , areaSlug, serviceSlug]=record.route.split("/");
  const area=areaBySlug[areaSlug], service=serviceBySlug[serviceSlug];
  if (!area || !service || record.title!==localH1(service,area)) fail(`Matrix mapping mismatch: ${record.route}`);
  if (record.uniqueWords<500) fail(`Thin matrix copy ${record.uniqueWords}: ${record.route}`);
  if (!record.links.has(areaRoute(area)) || !record.links.has(serviceRoute(service))) fail(`Matrix missing parent links: ${record.route}`);
  for (const slug of service.related) if (!record.links.has(localRoute(serviceBySlug[slug],area))) fail(`Matrix missing same-area related ${slug}: ${record.route}`);
}

const duplicateBodies=new Map();
for (const record of matrixPages) { if(duplicateBodies.has(record.contentHash)) fail(`Duplicate matrix content: ${record.route} / ${duplicateBodies.get(record.contentHash)}`); else duplicateBodies.set(record.contentHash,record.route); }
const sitemap=fs.readFileSync(path.join(source,"sitemap.xml"),"utf8");
if ((sitemap.match(/<url>/g)||[]).length !== 357) fail("Sitemap route count mismatch");
const robots=fs.readFileSync(path.join(source,"robots.txt"),"utf8");
if (!config.indexingEnabled && !/Disallow: \//.test(robots)) fail("robots.txt should disallow crawling");

if (failures.length) { console.error(failures.map((failure)=>`- ${failure}`).join("\n")); process.exit(1); }
console.log(`Site checks passed: ${records.length} pages, ${matrixPages.length} city/service routes, no broken internal references.`);
