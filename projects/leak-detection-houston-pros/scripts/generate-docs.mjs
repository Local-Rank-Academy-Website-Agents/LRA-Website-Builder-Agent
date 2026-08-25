import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { areas, project } from "./site-data.mjs";

const root = process.cwd();
const rows = [["route", "page_type", "primary_keyword", "h1", "coverage_status"]];
rows.push(["/", "home", "leak detection services Greater Houston", project.homepageH1, "pre-launch"]);
rows.push(["/services/", "directory", "leak detection services", "Leak Detection Services", "pre-launch"]);
for (const service of project.services) rows.push([`/services/${service.slug}/`, "service", service.keyword, service.baseH1, "pre-launch"]);
rows.push(["/service-areas/", "directory", "Greater Houston leak detection service areas", "Greater Houston Leak Detection Service Areas", "intended pending verification"]);
for (const area of areas) {
  rows.push([`/service-areas/${area.slug}/`, "area", `leak detection ${area.label}`, `Leak Detection in ${area.label}`, "intended pending verification"]);
  for (const service of project.services) rows.push([`/service-areas/${area.slug}/${service.slug}/`, "city_service", `${service.keyword} ${area.label}`, `${service.baseH1} in ${area.label}`, "intended pending verification"]);
}
rows.push(["/process/", "process", "leak detection process", "Leak Detection Process", "pre-launch"]);
rows.push(["/contact/", "contact", "request leak detection", "Request Leak Detection", "pre-launch"]);
rows.push(["/privacy/", "legal", "privacy information", "Privacy Information", "pre-launch"]);
rows.push(["/404.html", "utility", "", "Page Not Found", "not indexable"]);

const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
fs.writeFileSync(path.join(root, "ROUTE-INVENTORY.csv"), csv, "utf8");
console.log(`Wrote ROUTE-INVENTORY.csv with ${rows.length - 1} routes.`);
