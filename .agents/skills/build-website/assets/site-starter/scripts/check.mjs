import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const source = path.join(root, "site");
const required = ["index.html", "404.html", "assets/styles.css", "assets/main.js"];
const failures = [];

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
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Site checks passed.");
