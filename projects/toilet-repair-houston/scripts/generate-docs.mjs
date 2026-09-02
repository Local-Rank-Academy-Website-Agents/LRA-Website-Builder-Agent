import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { areas, project } from "./site-data.mjs";

const root = process.cwd();
const rows = [["route", "page_type", "primary_keyword", "h1", "coverage_status"]];
rows.push(["/", "home", `${project.topicLower} services Greater Houston`, project.homepageH1, "independent request site"]);
rows.push(["/services/", "directory", `${project.topicLower} services`, `${project.topic} Service Directory`, "independent request site"]);
for (const service of project.services) rows.push([`/services/${service.slug}/`, "service", service.keyword, service.baseH1, "pre-launch"]);
rows.push(["/service-areas/", "directory", `Greater Houston ${project.topicLower} service areas`, `${project.topic} Service Areas`, "intended pending verification"]);
for (const area of areas) {
  rows.push([`/service-areas/${area.slug}/`, "area", `${project.topicLower} ${area.label}`, `${project.topic} Services in ${area.label}`, "intended pending verification"]);
  for (const service of project.services) rows.push([`/service-areas/${area.slug}/${service.slug}/`, "city_service", `${service.keyword} ${area.label}`, `${service.label} in ${area.label}`, "intended pending verification"]);
}
rows.push(["/process/", "process", `${project.topicLower} process`, project.processTitle, "independent request site"]);
rows.push(["/contact/", "contact", `request ${project.topicLower}`, `Request ${project.topic} Service`, "independent request site"]);
rows.push(["/privacy/", "legal", "privacy information", `Privacy Information for ${project.name}`, "independent request site"]);
rows.push(["/404.html", "utility", "", "Page Not Found", "not indexable"]);

const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
fs.writeFileSync(path.join(root, "ROUTE-INVENTORY.csv"), csv, "utf8");
console.log(`Wrote ROUTE-INVENTORY.csv with ${rows.length - 1} routes.`);
