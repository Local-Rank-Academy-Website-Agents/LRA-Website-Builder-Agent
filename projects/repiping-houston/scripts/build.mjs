import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const source = path.join(root, "site");
const output = path.join(root, "dist");
const config = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));

if (!fs.existsSync(source)) throw new Error("Missing site/ directory.");
if (!config.baseUrl?.startsWith("https://")) throw new Error("Set an HTTPS baseUrl in site.config.json.");
if (config.indexingEnabled && config.baseUrl.endsWith(".invalid")) throw new Error("A reserved .invalid domain cannot be indexed.");

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });

const originalPngDir = path.join(output, "assets", "images");
if (fs.existsSync(originalPngDir)) {
  for (const name of fs.readdirSync(originalPngDir).filter((file) => file.endsWith(".png"))) fs.rmSync(path.join(originalPngDir, name));
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}
walk(output);

const urls = htmlFiles
  .map((file) => path.relative(output, file).replaceAll("\\", "/"))
  .filter((file) => file !== "404.html")
  .map((file) => file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`);
const baseUrl = config.baseUrl.replace(/\/$/, "");
fs.writeFileSync(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
fs.writeFileSync(path.join(output, "robots.txt"), config.indexingEnabled ? `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n", "utf8");
console.log(`Built ${htmlFiles.length} HTML pages into dist/. Indexing ${config.indexingEnabled ? "enabled" : "disabled"}.`);
