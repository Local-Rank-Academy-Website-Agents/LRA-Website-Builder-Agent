import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { areas, services } from "./site-data.mjs";

const root=process.cwd();
const safe=(value)=>String(value).replaceAll("|","/").replaceAll("\n"," ");
const rows=[];
rows.push("# Keyword Map");
rows.push("");
rows.push("This file is generated from `scripts/site-data.mjs`, the authoritative source for navigation, page generation, internal links, and QA. Coverage is intended and pending operator verification.");
rows.push("");
rows.push("## Homepage target");
rows.push("");
rows.push("| Broadest topic keyword | Greater-area modifier | Required H1 and exact title tag | Primary services linked from homepage | Decision |");
rows.push("| --- | --- | --- | --- | --- |");
rows.push("| plumbing services | Greater Houston Area | Plumbing Services in the Greater Houston Area | Emergency Plumber; Water Leak Detection; Drain Cleaning; Sewer Line Repair; Water Heater Repair; Whole House Repiping; Slab Leak Repair; Commercial Plumbing | Approve |");
rows.push("");
rows.push("## Approved service targets");
rows.push("");
rows.push("| Candidate service / owning topic | Primary keyword | Canonical URL | Required H1 and exact title tag | Group | Related service routes | Area links | Decision |");
rows.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for(const service of services) rows.push(`| ${safe(service.label)} | ${safe(service.keyword)} | /services/${service.slug}/ | ${safe(service.h1)} | ${safe(service.group)} | ${service.related.map((slug)=>`/services/${slug}/`).join("; ")} | All ${areas.length} intended markets pending verification | Approve |`);
rows.push("");
rows.push("## Merged and rejected service candidates");
rows.push("");
rows.push("| Candidate phrase | Owning page | Decision | Cannibalization note |");
rows.push("| --- | --- | --- | --- |");
const merged=[
  ["24 hour plumber / urgent plumber","/services/emergency-plumber/","Merge","Same immediate-response intent; response hours cannot be claimed until an operator is verified."],
  ["plumbing leak locator / hidden leak detection","/services/water-leak-detection/","Merge","Same diagnostic offer and outcome."],
  ["clogged drain service / drain unclogging","/services/drain-cleaning/","Merge","Same branch-drain clearing intent."],
  ["sewer scope / sewer video inspection","/services/sewer-camera-inspection/","Merge","Same visual inspection deliverable."],
  ["pipe bursting / sewer lining","/services/trenchless-sewer-repair/","Merge","Methods live under one trenchless decision page."],
  ["rooter service","/services/main-sewer-line-cleaning/","Merge","Ambiguous brand-like term; main-line cleaning owns the practical intent."],
  ["tap repair / tap installation","/services/faucet-repair-installation/","Merge","Regional wording variant of faucet service."],
  ["commode repair","/services/toilet-repair/","Merge","Synonym of toilet repair."],
  ["hot water heater repair","/services/water-heater-repair/","Merge","Common redundant wording with identical intent."],
  ["repipe plumber / home repiping","/services/whole-house-repiping/","Merge","Same whole-building replacement scope."],
  ["water purification","/services/water-filtration-system/","Merge","Broad treatment phrase; page requires a measured treatment goal."],
  ["gas plumber","/services/gas-line-repair/ and /services/gas-line-installation/","Split","Repair and new-load installation require distinct decisions."],
  ["bathroom remodel","/services/bathroom-plumbing/","Defer","Full remodeling includes design and finish trades beyond plumbing."],
  ["kitchen remodel","/services/kitchen-plumbing/","Defer","Full remodeling is broader than the mapped plumbing scope."],
  ["pool plumbing","none","Reject","Pool service is a separate specialty and cannot be implied without operator capability."],
  ["septic tank pumping","none","Reject","Pumping is a separate waste-hauling specialty; private-system interfaces are discussed only as local context."],
];
for(const [candidate,owner,decision,note] of merged) rows.push(`| ${candidate} | ${owner} | ${decision} | ${note} |`);
rows.push("");
rows.push("## Approved service-area targets");
rows.push("");
rows.push("| Candidate area | Region | Coverage status | Primary keyword | Canonical URL | Required H1 and exact title tag | Unique local value | Decision |");
rows.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for(const area of areas) rows.push(`| ${safe(area.label)} | ${safe(area.region)} | Intended pending verification | ${safe(area.keyword)} | /service-areas/${area.slug}/ | ${safe(area.h1)} | Property mix, plumbing context, and access logistics written specifically for ${safe(area.label)} | Approve |`);
rows.push("");
rows.push("## Geographic clustering decisions");
rows.push("");
rows.push("- Greater Houston is the homepage umbrella; it does not receive a second competing city page.");
rows.push("- Houston owns the broad city page, while named districts target distinct neighborhood intent and contain materially different property/access context.");
rows.push("- Downtown Houston, Midtown Houston, East Downtown Houston, and Uptown/Galleria remain separate because their property types, access models, and local search intent differ.");
rows.push("- Clear Lake is retained as a recognized district distinct from League City and Webster; each page identifies jurisdiction ambiguity instead of assuming one city.");
rows.push("- Katy and Spring pages explicitly require ZIP/subdivision confirmation because mailing names extend beyond incorporated boundaries.");
rows.push("- No ZIP-code doorway pages are generated. No unstaffed address or artificial local presence is published.");
rows.push("");
rows.push("## Page ownership and linking rules");
rows.push("");
rows.push(`- One primary keyword, route, H1, exact title tag, description, and canonical per approved page.`);
rows.push(`- Every service page links to all ${areas.length} intended area pages and four mapped related services.`);
rows.push(`- Every area page links to all ${services.length} approved service pages and the other pages in its regional cluster.`);
rows.push("- Desktop navigation, mobile submenus, footer directories, generated pages, and audits use the same source data.");
rows.push("- Repeated interface labels are not treated as page-specific copy; substantive content blocks are checked for exact paragraph duplication and five-word-shingle similarity.");
fs.writeFileSync(path.join(root,"KEYWORD-MAP.md"),rows.join("\n")+"\n","utf8");

const routes=[
  ["/","Home","Plumbing services","Plumbing Services in the Greater Houston Area"],
  ["/services/","Directory","Plumbing services Houston","Plumbing Services in Houston, TX"],
  ...services.map((s)=>[`/services/${s.slug}/`,"Service",s.keyword,s.h1]),
  ["/service-areas/","Directory","plumbing service areas Greater Houston","Plumbing Service Areas in Greater Houston"],
  ...areas.map((a)=>[`/service-areas/${a.slug}/`,"Service area",a.keyword,a.h1]),
  ["/process/","Information","plumbing service matching process","How Plumbing Service Matching Works"],
  ["/contact/","Conversion","Houston plumbing request","Describe Your Houston Plumbing Need"],
  ["/privacy/","Legal","privacy information","Privacy Information for This Test Build"],
  ["/404.html","Utility","not indexable","Page Not Found"],
];
fs.writeFileSync(path.join(root,"ROUTE-INVENTORY.csv"),"route,type,primary_keyword,title_and_h1\n"+routes.map((row)=>row.map((cell)=>`"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n")+"\n","utf8");
console.log(`Generated KEYWORD-MAP.md and ROUTE-INVENTORY.csv for ${routes.length} routes.`);
