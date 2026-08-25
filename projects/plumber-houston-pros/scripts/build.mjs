import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const source = path.join(root, "site");
const output = path.join(root, "dist");
const config = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));

if (!fs.existsSync(source)) throw new Error("Missing site/ directory.");
if (!config.baseUrl?.startsWith("https://") || config.baseUrl.includes("example.com")) {
  throw new Error("Set an HTTPS baseUrl in site.config.json before building.");
}
if (config.indexingEnabled && config.baseUrl.endsWith(".invalid")) {
  throw new Error("A reserved .invalid domain cannot be used when indexing is enabled.");
}

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}
walk(output);

const unresolved = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (/\{\{[A-Z0-9_]+\}\}|\[TODO\b|\[PLACEHOLDER\]|REPLACE THIS/i.test(content)) {
    unresolved.push(path.relative(output, file));
  }
}
if (unresolved.length) {
  throw new Error(`Unresolved template content in: ${unresolved.join(", ")}`);
}

const urls = htmlFiles
  .map((file) => path.relative(output, file).replaceAll("\\", "/"))
  .filter((file) => file !== "404.html")
  .map((file) => (file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`));
const baseUrl = config.baseUrl.replace(/\/$/, "");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(output, "sitemap.xml"), sitemap, "utf8");
const robots = config.indexingEnabled
  ? `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`
  : "User-agent: *\nDisallow: /\n";
fs.writeFileSync(path.join(output, "robots.txt"), robots, "utf8");
console.log(`Built ${htmlFiles.length} HTML pages into dist/.`);
