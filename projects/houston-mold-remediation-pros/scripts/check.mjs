import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const source = path.join(root, "site");
const config = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
const required = ["index.html", "404.html", "assets/styles.css", "assets/main.js"];
const failures = [];
const titles = new Map();
const canonicals = new Map();
const htmlRecords = [];

for (const file of required) {
  if (!fs.existsSync(path.join(source, file))) failures.push(`Missing ${file}`);
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

for (const file of walk(source)) {
  if (!/\.(html|css|js|json|xml|txt)$/i.test(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  if (/\{\{[A-Z0-9_]+\}\}|\[TODO\b|PLACEHOLDER|REPLACE THIS/i.test(content)) {
    failures.push(`Unresolved template content in ${path.relative(root, file)}`);
  }
  if (file.endsWith(".html")) {
    if (!/<title>[^<]+<\/title>/i.test(content)) failures.push(`Missing title in ${path.relative(root, file)}`);
    if (!/<h1[\s>]/i.test(content) && !file.endsWith("404.html")) failures.push(`Missing H1 in ${path.relative(root, file)}`);
    if (!/name=["']description["']/i.test(content)) failures.push(`Missing meta description in ${path.relative(root, file)}`);
    const hasNoindex = /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(content);
    if (!config.indexingEnabled && !hasNoindex) {
      failures.push(`Missing pre-launch noindex in ${path.relative(root, file)}`);
    }
    if (config.indexingEnabled && hasNoindex && !file.endsWith("404.html")) {
      failures.push(`Unexpected noindex in indexable page ${path.relative(root, file)}`);
    }

    const h1Count = [...content.matchAll(/<h1[\s>]/gi)].length;
    if (!file.endsWith("404.html") && h1Count !== 1) {
      failures.push(`Expected exactly one H1 in ${path.relative(root, file)}; found ${h1Count}`);
    }

    if (!file.endsWith("404.html") && !/Frequently asked questions/i.test(content)) {
      failures.push(`Missing visible FAQ section in ${path.relative(root, file)}`);
    }

    const relative = path.relative(source, file).replaceAll("\\", "/");
    if (/^services\/[^/]+\/index\.html$/.test(relative)) {
      if (!/id=["']related-services-heading["'][^>]*>Related Services/i.test(content)) {
        failures.push(`Missing Related Services section in ${path.relative(root, file)}`);
      }
      if (!/id=["']service-areas-heading["'][^>]*>Service Areas for/i.test(content)) {
        failures.push(`Missing Service Areas section in ${path.relative(root, file)}`);
      }
    }

    const title = content.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    if (title) {
      if (titles.has(title)) failures.push(`Duplicate title in ${path.relative(root, file)} and ${titles.get(title)}`);
      titles.set(title, path.relative(root, file));
    }

    const canonical = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
    if (canonical) {
      if (canonicals.has(canonical)) failures.push(`Duplicate canonical in ${path.relative(root, file)} and ${canonicals.get(canonical)}`);
      canonicals.set(canonical, path.relative(root, file));
    }

    for (const match of content.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(match[1]);
      } catch {
        failures.push(`Invalid JSON-LD in ${path.relative(root, file)}`);
      }
    }

    for (const match of content.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
      const reference = match[1];
      if (!reference.startsWith("/") || reference.startsWith("//")) continue;
      const clean = reference.split(/[?#]/, 1)[0];
      if (!clean) continue;
      const target = clean.endsWith("/")
        ? path.join(source, clean.slice(1), "index.html")
        : path.join(source, clean.slice(1));
      if (!fs.existsSync(target)) failures.push(`Broken internal reference ${reference} in ${path.relative(root, file)}`);
    }

    htmlRecords.push({ file, content });
  }
}

const sourceHtml = new Map(
  htmlRecords.map(({ file, content }) => [
    `/${path.relative(source, file).replaceAll("\\", "/").replace(/index\.html$/, "")}`,
    content,
  ]),
);

for (const { file, content } of htmlRecords) {
  for (const match of content.matchAll(/href=["'](\/[^"'?#]+\/)?#([^"']+)["']/gi)) {
    const route = match[1] || `/${path.relative(source, file).replaceAll("\\", "/").replace(/index\.html$/, "")}`;
    const targetContent = sourceHtml.get(route);
    if (!targetContent || !new RegExp(`\\bid=["']${match[2]}["']`, "i").test(targetContent)) {
      failures.push(`Broken fragment ${match[0]} in ${path.relative(root, file)}`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Site checks passed.");
