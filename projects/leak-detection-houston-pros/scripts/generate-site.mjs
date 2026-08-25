import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { areas, project } from "./site-data.mjs";

const root = process.cwd();
const out = path.join(root, "site");
const config = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
const base = config.baseUrl.replace(/\/$/, "");
const routes = [];
const serviceBySlug = Object.fromEntries(project.services.map((service) => [service.slug, service]));
const serviceGroups = [...new Set(project.services.map((service) => service.group))];
const areaGroups = [...new Set(areas.map((area) => area.region))];
const imageDimensions = {
  "hero-leak-detection.webp": [1400, 768],
  "slab-leak-detection.webp": [1400, 1050],
  "underground-leak-detection.webp": [1400, 933],
  "interior-plumbing-leak-detection.webp": [1400, 933],
  "sewer-line-leak-detection.webp": [1400, 933],
  "pool-leak-detection.webp": [1400, 933],
  "commercial-leak-detection.webp": [1400, 933]
};

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const abs = (route) => `${base}${route}`;
const serviceRoute = (service) => `/services/${service.slug}/`;
const areaRoute = (area) => `/service-areas/${area.slug}/`;
const localRoute = (service, area) => `${areaRoute(area)}${service.slug}/`;
const localH1 = (service, area) => `${service.baseH1} in ${area.label}`;
const areaH1 = (area) => `Leak Detection in ${area.label}`;

function resetGeneratedPages() {
  for (const relative of ["services", "service-areas", "process", "contact", "privacy"]) {
    fs.rmSync(path.join(out, relative), { recursive: true, force: true });
  }
  for (const relative of ["index.html", "404.html", "sitemap.xml", "robots.txt"]) {
    fs.rmSync(path.join(out, relative), { force: true });
  }
  fs.mkdirSync(path.join(out, "assets"), { recursive: true });
}

function write(route, html) {
  const relative = route === "/" ? "index.html" : route === "/404.html" ? "404.html" : `${route.replace(/^\//, "")}index.html`;
  const file = path.join(out, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
  if (route !== "/404.html") routes.push(route);
}

function image(service, { eager = false, className = "content-photo", area = null } = {}) {
  const [width, height] = imageDimensions[service.image];
  const alt = area ? `${service.imageAlt} in ${area.label}` : service.imageAlt;
  return `<figure class="${className}"><img src="/assets/images/${service.image}" alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}></figure>`;
}

function brand() {
  return `<a class="brand" href="/" aria-label="${esc(project.name)} home"><span class="mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 3C12 9 7 14 7 20a9 9 0 0 0 18 0c0-6-5-11-9-17Z" stroke="currentColor" stroke-width="3"/><path d="M11 21c1 3 3 4 6 4" stroke="var(--orange)" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand-copy"><strong>${esc(project.name)}</strong><small>Greater Houston Leak Detection</small></span></a>`;
}

function menuGroups(items, groupKey, routeFor) {
  const groups = [...new Set(items.map((item) => item[groupKey]))];
  return groups.map((group) => `<div class="menu-group"><strong>${esc(group)}</strong>${items.filter((item) => item[groupKey] === group).map((item) => `<a href="${routeFor(item)}">${esc(item.label)}</a>`).join("")}</div>`).join("");
}

function header(active = "") {
  return `<a class="skip" href="#main-content">Skip to content</a><div class="status"><div class="shell"><span></span><p>Pre-launch leak detection service information</p><b>Operator and exact coverage require verification</b></div></div><header class="header"><div class="shell nav-shell">${brand()}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation"><i></i><i></i><i></i></button><nav class="site-nav" id="site-nav" aria-label="Primary navigation"><div class="dropdown"><div class="dropdown-control"><a href="/services/"${active === "services" ? ' aria-current="page"' : ""}>Services</a><button type="button" aria-expanded="false" aria-label="Toggle services menu">+</button></div><div class="mega mega-services">${menuGroups(project.services, "group", serviceRoute)}</div></div><div class="dropdown"><div class="dropdown-control"><a href="/service-areas/"${active === "areas" ? ' aria-current="page"' : ""}>Service Areas</a><button type="button" aria-expanded="false" aria-label="Toggle service areas menu">+</button></div><div class="mega mega-areas">${menuGroups(areas, "region", areaRoute)}</div></div><a href="/process/"${active === "process" ? ' aria-current="page"' : ""}>Process</a><a href="/contact/"${active === "contact" ? ' aria-current="page"' : ""}>Contact</a><a class="button nav-cta" href="/contact/#request">Request Detection</a></nav></div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="shell footer-top"><div>${brand()}<p>Pre-launch information for narrowing suspected water loss across intended Greater Houston markets. An operator and exact coverage are not yet verified.</p></div><nav aria-label="Footer utility"><strong>Site</strong><a href="/services/">Services</a><a href="/service-areas/">Service Areas</a><a href="/process/">Process</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a></nav><div><strong>Lead status</strong><p>Form-first. No active phone, address, Google Business Profile, or lead destination is published.</p></div></div><div class="shell footer-dir"><h2>Leak detection services</h2><div class="footer-grid service-footer">${serviceGroups.map((group) => `<nav><strong>${esc(group)}</strong>${project.services.filter((service) => service.group === group).map((service) => `<a href="${serviceRoute(service)}">${esc(service.label)}</a>`).join("")}</nav>`).join("")}</div></div><div class="shell footer-dir"><h2>Greater Houston service-area guides</h2><div class="footer-grid area-footer">${areaGroups.map((group) => `<nav><strong>${esc(group)}</strong>${areas.filter((area) => area.region === group).map((area) => `<a href="${areaRoute(area)}">${esc(area.label)}</a>`).join("")}</nav>`).join("")}</div></div><div class="shell footer-bottom"><span>© ${new Date().getFullYear()} ${esc(project.name)}</span><span>Pre-launch rank-and-rent information property</span></div></footer><a class="mobile-lead-cta" href="/contact/#request">Request Leak Detection</a>`;
}

function breadcrumb(items) {
  return { "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: abs(item.route) })) };
}

function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb">${items.map((item, index) => item.route ? `<a href="${item.route}">${esc(item.label)}</a><span>/</span>` : `<b aria-current="page">${esc(item.label)}</b>`).join("")}</nav>`;
}

function faq(title, intro, items) {
  return `<section class="section faq" aria-labelledby="faq-title"><div class="shell faq-grid"><div><p class="eyebrow">Questions and decisions</p><h2 id="faq-title">${esc(title)}</h2><p>${esc(intro)}</p></div><div class="accordion">${items.map(([question, answer]) => `<details><summary>${esc(question)}<span aria-hidden="true">+</span></summary><p>${esc(answer)}</p></details>`).join("")}</div></div></section>`;
}

function faqSchema(items) {
  return { "@type": "FAQPage", mainEntity: items.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
}

function quickForm(service = null, area = null, instance = "hero") {
  const id = `request-${instance}`;
  return `<form class="quick-lead" id="${id}" data-lead-form novalidate><div class="quick-lead-head"><p class="eyebrow">Prepare request details</p><h2>Tell us what you are seeing</h2><span>Share the symptom and property location to prepare the right detection path.</span></div><div class="quick-fields"><div class="field"><label for="${id}-name">Name</label><input id="${id}-name" name="name" autocomplete="name" required><span data-error-for="name"></span></div><div class="field"><label for="${id}-contact">Email or phone</label><input id="${id}-contact" name="contact" autocomplete="email" required><span data-error-for="contact"></span></div><div class="field"><label for="${id}-location">Property location</label><input id="${id}-location" name="location" autocomplete="street-address" value="${area ? esc(area.label) : ""}" required><span data-error-for="location"></span></div><div class="field"><label for="${id}-service">Suspected leak</label><select id="${id}-service" name="service" required><option value="">Select a service</option>${project.services.map((item) => `<option value="${item.slug}"${service?.slug === item.slug ? " selected" : ""}>${esc(item.label)}</option>`).join("")}</select><span data-error-for="service"></span></div><div class="field full"><label for="${id}-details">What is happening?</label><textarea id="${id}-details" name="details" rows="3" required placeholder="First symptom, when it began, meter or moisture clues, and property access details"></textarea><span data-error-for="details"></span></div><div class="honeypot" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div></div><p class="quick-note">This pre-launch form does not transmit or retain information yet.</p><button class="button" type="submit">Review Request Details</button><div class="form-status" role="status" aria-live="polite"></div></form>`;
}

function finalCta(title, copy) {
  return `<section class="final-cta"><div class="shell"><div><p class="eyebrow">Prepare the service request</p><h2>${esc(title)}</h2></div><div><p>${esc(copy)}</p><a class="button button-light" href="/contact/#request">Request Leak Detection</a></div></div></section>`;
}

function pageHero({ h1, eyebrow, intro, trail, service = null, area = null }) {
  const artService = service || project.services[0];
  return `<section class="page-hero"><div class="shell">${crumbs(trail)}<div class="page-hero-grid"><div class="page-title"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(h1)}</h1><p class="hero-intro">${esc(intro)}</p>${image(artService, { className: "hero-photo", area })}</div>${quickForm(service, area, "hero")}</div></div></section>`;
}

function serviceCards(services, routeFor = serviceRoute, area = null) {
  return services.map((service) => `<a class="service-card" href="${routeFor(service)}">${image(service, { className: "card-photo", area })}<span>${esc(service.group)}</span><h3>${esc(service.label)}</h3><p>${esc(service.intro)}.</p><b>Explore ${esc(service.label.toLowerCase())} →</b></a>`).join("");
}

function page({ title, description, route, body, active = "", graph = [] }) {
  const robots = config.indexingEnabled ? "index, follow" : "noindex, nofollow";
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", name: project.name, url: abs("/") }, ...graph] };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${abs(route)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${abs(route)}"><meta property="og:site_name" content="${esc(project.name)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script><script src="/assets/main.js" defer></script></head><body>${header(active)}${body}${footer()}</body></html>`;
}

function serviceFaqs(service) {
  return [
    [`What information helps with ${service.label.toLowerCase()}?`, `Record the first symptom, when it began, meter behavior, visible moisture, affected fixtures or zones, prior repairs, and access to valves, equipment, crawlspaces, attics, or utility areas.`],
    [`Which methods may be used for ${service.label.toLowerCase()}?`, `The testing sequence may include ${service.methods}. The useful combination depends on the property and the system that can actually produce the symptom.`],
    [`Does detection guarantee the exact repair opening?`, `No. The goal is ${service.intro}. Concealed construction, pipe depth, signal conditions, and repair access can leave a reasonable search zone rather than a point-sized mark.`],
    [`What evidence should the result include?`, `A useful result documents ${service.evidence}. It should also state uncertainty and what additional access or testing would change the conclusion.`],
    [`What affects the cost of ${service.label.toLowerCase()}?`, `Cost commonly changes with ${service.costFactors}. Repair, demolition, restoration, permits, and utility work should be priced separately unless clearly included.`]
  ];
}

function areaFaqs(area) {
  return [
    [`Is ${area.label} confirmed as an active service area?`, `No. ${area.label} is an intended pre-launch market. A contracted operator must verify the exact address, ZIP code, service type, and scheduling coverage before routing is activated.`],
    [`What property details matter in ${area.label}?`, `${area.propertyMix} Share the building type, construction, meters, pools, irrigation, occupied areas, and the first symptom.`],
    [`Why is the exact ${area.label} address necessary?`, `Local names can cross municipal, county, utility, district, and inspection boundaries. The address helps identify the correct property, access plan, and private-versus-utility piping boundary.`],
    [`How should access be prepared in ${area.label}?`, area.access],
    [`Can every type of leak be tested at every ${area.label} property?`, `Not automatically. The operator must verify equipment, access, pipe material, safety conditions, property authorization, and whether the suspected system falls within the contracted scope.`]
  ];
}

function localFaqs(service, area) {
  return [
    [`Is ${service.label.toLowerCase()} active in ${area.label} now?`, `This page maps an intended service and market combination. An operator must verify the exact ${area.label} address, scope, and availability before any request is scheduled.`],
    [`What should I record before requesting ${service.label.toLowerCase()} in ${area.label}?`, `Record the first symptom, timing, meter or moisture behavior, affected zones, building type, prior work, and the access details described for the property.`],
    [`Which evidence matters for this ${area.label} service?`, `The result should identify ${service.evidence}. Local property context helps plan testing, but it does not replace measurements or controlled isolation.`],
    [`What can interfere with ${service.label.toLowerCase()} in ${area.label}?`, `${area.waterContext} Ambient noise, inaccessible valves, overlapping systems, and past moisture can also limit conclusions.`],
    [`Does this page include repair after detection?`, `No repair promise is made. ${service.decision}. Repair access, restoration, permits, utility coordination, and pricing require a separate verified scope.`]
  ];
}

function homePage() {
  const faqs = [
    ["Which leak detection service should I choose?", "Start with the system and symptom: whole-property water loss, slab piping, a buried service line, interior plumbing, drainage, a pool or spa, or a managed commercial system."],
    ["What should I gather before requesting leak detection?", "Record meter behavior, the first visible or audible clue, when it began, affected fixtures or zones, property type, prior work, and access to shutoffs and equipment."],
    ["Does this site represent an active Houston operator?", "Not yet. This is a pre-launch rank-and-rent property awaiting an operator. No phone, address, credentials, reviews, or scheduling claims are published."],
    ["Are all 43 Greater Houston markets active?", "They are intended candidate markets. Exact service and ZIP-code coverage must be verified with the contracted operator before public indexing or lead routing."],
    ["Does leak detection include repair?", "Detection narrows the likely source and documents evidence. Opening finishes, excavating, repairing pipe, restoration, permits, and utility coordination require a separately approved scope."]
  ];
  const coreSlugs = ["houston", "katy", "the-woodlands", "cypress", "sugar-land", "pearland", "league-city", "pasadena"];
  const coreAreas = coreSlugs.map((slug) => areas.find((area) => area.slug === slug));
  const body = `<main id="main-content"><section class="home-hero"><div class="shell home-grid"><div class="home-copy"><p class="eyebrow">Greater Houston water leak detection</p><h1>${esc(project.homepageH1)}</h1><p class="lede">${esc(project.lede)}</p><div class="actions"><a class="button" href="#request-home">Request Leak Detection</a><a href="/services/">Explore all seven services</a></div><ul><li>Seven distinct detection scopes</li><li>43 intended Greater Houston markets</li><li>301 city-matched service pages</li></ul></div><div class="home-convert">${image(project.services[0], { eager: true, className: "home-photo" })}${quickForm(null, null, "home")}</div></div></section><section class="section intro"><div class="shell split"><div><p class="eyebrow">Start with the system</p><h2>Match the water-loss clue to the right test path</h2></div><div class="prose"><p>A moving meter, warm floor, wet wall, damp yard, drainage odor, falling pool level, and unexplained commercial consumption do not point to the same system.</p><p>The service map separates each intent so the request, testing sequence, evidence, and repair handoff remain clear.</p></div></div></section><section class="section"><div class="shell section-head"><div><p class="eyebrow">Leak detection services</p><h2>Seven focused diagnostic scopes</h2></div><a href="/services/">Complete service directory</a></div><div class="shell card-grid">${serviceCards(project.services)}</div></section><section class="section evidence"><div class="shell section-head"><div><p class="eyebrow">Evidence before access</p><h2>Trace, isolate, document</h2></div><p>Good detection does not treat a visible stain as proof. It connects measurements, system boundaries, and repeatable observations before repair access is chosen.</p></div><div class="shell evidence-grid"><article><span>01</span><h3>Define the symptom</h3><p>Record meter movement, pressure behavior, moisture boundaries, sound, temperature, drainage, or pool-level changes.</p></article><article><span>02</span><h3>Isolate the system</h3><p>Separate supply, drainage, pool, irrigation, condensate, envelope, and past-moisture explanations.</p></article><article><span>03</span><h3>Mark uncertainty</h3><p>State the likely zone, supporting evidence, access limits, and the next step needed before repair.</p></article></div></section><section class="section dark"><div class="shell split"><div><p class="eyebrow">Greater Houston market map</p><h2>One-to-one city and service routes</h2></div><div class="prose"><p>Every approved market pillar links to seven matching local service pages. Local pages keep related-service links inside the same market whenever the destination exists.</p><a class="button" href="/service-areas/">Browse all 43 markets</a></div></div><div class="shell core-location-grid">${coreAreas.map((area) => `<a href="${areaRoute(area)}"><span>${esc(area.region)}</span><h3>${esc(area.label)}</h3><p>${esc(area.context)}</p><b>Leak detection in ${esc(area.label)} →</b></a>`).join("")}</div></section>${faq("Leak detection questions for Greater Houston", "Service selection, evidence, coverage status, and repair boundaries.", faqs)}${finalCta("Prepare a leak detection request.", "Share the property location, observed condition, meter or moisture clues, timing, and access details. Lead routing remains disconnected until an operator is verified.")}</main>`;
  return page({ title: project.homepageH1, description: "Explore seven leak detection services and 43 intended Greater Houston markets with one-to-one city and service guides.", route: "/", body, graph: [faqSchema(faqs)] });
}

function servicesPage() {
  const h1 = "Leak Detection Services";
  const faqs = [["Why are testing methods not separate services?", "Thermal imaging, acoustic listening, moisture mapping, pressure testing, and dye testing support several scopes. Keeping them within the owning service avoids competing pages."],["Can one property need more than one scope?", "Yes. A whole-property investigation may narrow the problem to a slab, interior branch, buried service, drainage system, pool, or managed commercial zone."],["Where are local versions of each service?", "Every generic service page links to all 43 intended market versions."],["What is excluded before an operator is verified?", "Emergency response, repair, gas, roof, fire-line, irrigation, industrial, and availability claims remain excluded."],["How is the right service chosen?", "Use the affected system, meter behavior, moisture location, property type, and whether the symptom is pressurized, drainage-related, buried, pool-related, or building-wide."]];
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: "Seven distinct service intents", intro: "Browse leak detection by system, symptom, property type, and evidence requirement.", trail: [{label:"Home",route:"/"},{label:"Services"}] })}<section class="section"><div class="shell">${serviceGroups.map((group) => `<section class="directory-group"><div><p class="eyebrow">Service category</p><h2>${esc(group)}</h2></div><div class="directory-list">${project.services.filter((service) => service.group === group).map((service) => `<a href="${serviceRoute(service)}"><span>${esc(service.label)}</span><small>${esc(service.intro)}</small><b>→</b></a>`).join("")}</div></section>`).join("")}</div></section>${faq("Leak detection service questions", "How the service taxonomy and local matrix work.", faqs)}${finalCta("Choose the service that matches the suspected system.", "If the source is unclear, start with Water Leak Detection and describe every observed clue.")}</main>`;
  return page({ title: h1, description: "Browse seven distinct water, slab, underground, plumbing, sewer, pool, and commercial leak detection services.", route: "/services/", body, active: "services", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Services",route:"/services/"}]), faqSchema(faqs)] });
}

function serviceContent(service) {
  return `<div data-unique-copy><section class="section"><div class="shell content-grid"><article class="prose"><p class="eyebrow">Houston diagnostic guide</p><h2>Signs that point toward ${esc(service.label.toLowerCase())}</h2><p>${esc(service.label)} is intended to ${esc(service.intro)}. This scope may fit when ${esc(service.situation)}. Record when the condition began, whether it changes with fixture use or time, and whether a meter, pressure, sound, temperature, odor, or moisture pattern can be repeated.</p><p>The system boundary includes ${esc(service.system)}. That boundary matters because water may travel away from its source, multiple systems may occupy the same cavity, and previous moisture can remain after active flow stops.</p><h2>How the suspected system is isolated</h2><p>A testing plan may use ${esc(service.methods)}. No single tool proves every leak. The sequence should begin with the reported symptom, remove competing explanations, and test the sections capable of producing the condition.</p>${image(service)}<h2>Evidence that supports a useful finding</h2><p>The useful result is ${esc(service.evidence)}. Photographs, meter observations, pressure results, marked boundaries, test conditions, and limits should be documented in plain language. If access or signal conditions prevent a firm conclusion, the report should explain the remaining possibilities and the next test that could narrow them.</p><h2>What this detection scope does not prove</h2><p>${esc(service.decision)}. Detection is not a promise that a repair can use a particular opening, that concealed pipe follows an assumed route, or that every wet material comes from the same event.</p><h2>Repair planning after detection</h2><p>The detection scope covers ${esc(service.scope)}. Pipe repair, demolition, excavation, finish removal, drying, remediation, structural work, restoration, permits, and utility coordination remain separate unless a verified operator includes them in writing. A repair proposal should refer back to the documented test conditions rather than treating a mark as a guarantee.</p><h2>What affects the testing scope and price</h2><p>Common variables include ${esc(service.costFactors)}. A comparable proposal should state the systems included, available test time, access assumptions, deliverables, exclusions, and how additional zones or concealed conditions are handled.</p></article><aside class="scope-card"><span>Detection scope</span><h2>${esc(service.label)}</h2><dl><dt>System focus</dt><dd>${esc(service.system)}</dd><dt>Methods</dt><dd>${esc(service.methods)}</dd><dt>Evidence goal</dt><dd>${esc(service.evidence)}</dd><dt>Decision boundary</dt><dd>${esc(service.decision)}</dd></dl><a class="button" href="#request-hero">Prepare Request</a></aside></div></section></div>`;
}

function servicePage(service) {
  const h1 = service.baseH1;
  const faqs = serviceFaqs(service);
  const related = service.related.map((slug) => serviceBySlug[slug]);
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: "Greater Houston service guide", intro: `${service.baseH1} is used to ${service.intro}.`, trail: [{label:"Home",route:"/"},{label:"Services",route:"/services/"},{label:service.label}], service })}${serviceContent(service)}<section class="section related" aria-labelledby="related-title"><div class="shell section-head"><div><p class="eyebrow">Related diagnostic paths</p><h2 id="related-title">Related Leak Detection Services</h2></div><p>Use the related scope that matches the affected system and the evidence found during initial isolation.</p></div><div class="shell card-grid related-grid">${serviceCards(related)}</div></section><section class="section" aria-labelledby="service-area-title"><div class="shell section-head"><div><p class="eyebrow">City-matched guides</p><h2 id="service-area-title">${esc(service.label)} Service Areas</h2></div><p>Each link opens the one-to-one ${esc(service.label.toLowerCase())} page for that intended Greater Houston market.</p></div><div class="shell link-groups">${areaGroups.map((group) => `<div><strong>${esc(group)}</strong>${areas.filter((area) => area.region === group).map((area) => `<a href="${localRoute(service, area)}">${esc(service.label)} in ${esc(area.label)}</a>`).join("")}</div>`).join("")}</div></section>${faq(`${service.label} questions`, `Evidence, scope, price variables, and repair handoff for ${service.label.toLowerCase()}.`, faqs)}${finalCta(`Prepare a ${service.label.toLowerCase()} request.`, "Include the first symptom, test clues already observed, property type, affected zone, and access details.")}</main>`;
  return page({ title: h1, description: `${service.label} guidance for Greater Houston, including symptoms, testing methods, evidence, repair boundaries, and 43 local service guides.`, route: serviceRoute(service), body, active: "services", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Services",route:"/services/"},{name:service.label,route:serviceRoute(service)}]), faqSchema(faqs)] });
}

function areasPage() {
  const h1 = "Greater Houston Leak Detection Service Areas";
  const faqs = [["Are all listed markets active now?", "No. They are intended pre-launch markets that require operator and ZIP-code verification before routing or indexing."],["Why include both cities and Houston neighborhoods?", "The directory separates locally recognized markets where property type, access, utility context, and search intent can support a useful guide."],["How do local service links work?", "Each area pillar links to seven service pages for that same place. Related services on those pages stay in the same place."],["Can coverage change before launch?", "Yes. Unsupported markets should be removed with their entire service matrix before indexing."],["Why is an exact address still required?", "Place names can cross city, county, MUD, utility, and inspection boundaries. Exact routing depends on the property address and operator scope."]];
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: "43 intended Greater Houston markets", intro: "Browse city, community, neighborhood, and district guides organized by Greater Houston region.", trail: [{label:"Home",route:"/"},{label:"Service Areas"}] })}<section class="section"><div class="shell">${areaGroups.map((group) => `<section class="area-region"><div class="section-head"><div><p class="eyebrow">Greater Houston region</p><h2>${esc(group)}</h2></div><span>${areas.filter((area) => area.region === group).length} market guides</span></div><div class="location-grid">${areas.filter((area) => area.region === group).map((area) => `<a href="${areaRoute(area)}"><span>${esc(area.type)} · ${esc(area.county)}</span><h3>${esc(area.label)}</h3><p>${esc(area.context)}</p><b>Leak detection in ${esc(area.label)} →</b></a>`).join("")}</div></section>`).join("")}</div></section>${faq("Greater Houston service-area questions", "Coverage status, local routes, and exact-property verification.", faqs)}${finalCta("Start with the exact property location.", "Share the street, city, ZIP code, building type, suspected system, and access conditions so coverage can be checked after an operator is connected.")}</main>`;
  return page({ title: h1, description: "Browse 43 intended Greater Houston leak detection market guides with one-to-one local pages for all seven services.", route: "/service-areas/", body, active: "areas", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Service Areas",route:"/service-areas/"}]), faqSchema(faqs)] });
}

function nearbyAreas(area, limit = 6) {
  const same = areas.filter((candidate) => candidate.region === area.region && candidate.slug !== area.slug);
  const others = areas.filter((candidate) => candidate.region !== area.region && candidate.slug !== area.slug);
  return [...same, ...others].slice(0, limit);
}

function areaContent(area) {
  return `<div data-unique-copy><section class="section"><div class="shell content-grid"><article class="prose"><p class="eyebrow">${esc(area.label)} property guide</p><h2>Property and water-system context in ${esc(area.label)}</h2><p>${esc(area.context)}</p><p>${esc(area.propertyMix)} These differences affect the number of meters and zones, pipe routes, access points, operating schedules, and the systems that must be separated before a source is assigned.</p><h2>Moisture clues that need careful separation</h2><p>${esc(area.waterContext)} A current leak should be supported by meter, pressure, moisture, thermal, acoustic, drainage, or water-level evidence that connects the symptom to an active system.</p>${image(project.services[0], { area })}<h2>Preparing a ${esc(area.label)} property for testing</h2><p>${esc(area.access)}</p><p>Before the visit, note the first symptom, timing, active water use, recent weather, prior repairs, remodels, irrigation cycles, pool operation, appliance use, and whether a building manager or tenant controls any access point.</p><h2>Private piping, utilities, and later repair</h2><p>The service boundary can change with the actual provider, meter, MUD, city limit, private site main, tenant agreement, or property-side responsibility. Those details should be verified for the exact ${esc(area.label)} address. Detection does not authorize excavation, opening finishes, structural work, remediation, restoration, or utility-side repair.</p><h2>How local service pages are organized</h2><p>The seven links below stay inside ${esc(area.label)}. Each page combines one diagnostic scope with this area's property, access, and water-system context. The pages remain pre-launch until an operator verifies that exact service and location combination.</p></article><aside class="content-lead">${quickForm(null, area, "content")}</aside></div></section></div>`;
}

function areaPage(area) {
  const h1 = areaH1(area);
  const faqs = areaFaqs(area);
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: `${area.type} · ${area.county}`, intro: `${area.label} is an intended Greater Houston market pending operator and exact-address verification.`, trail: [{label:"Home",route:"/"},{label:"Service Areas",route:"/service-areas/"},{label:area.label}], area })}${areaContent(area)}<section class="section related" aria-labelledby="area-service-title"><div class="shell section-head"><div><p class="eyebrow">One-to-one local service pages</p><h2 id="area-service-title">Leak Detection Services in ${esc(area.label)}</h2></div><p>Every card links to the matching ${esc(area.label)} service page rather than a generic Houston destination.</p></div><div class="shell card-grid">${serviceCards(project.services, (service) => localRoute(service, area), area)}</div></section><section class="section nearby"><div class="shell section-head"><div><p class="eyebrow">Nearby market guides</p><h2>Other intended markets near this service map</h2></div></div><div class="shell nearby-links">${nearbyAreas(area).map((nearby) => `<a href="${areaRoute(nearby)}">${esc(nearby.label)}</a>`).join("")}</div></section>${faq(`${area.label} leak detection questions`, `Coverage, property details, access, and service boundaries for ${area.label}.`, faqs)}${finalCta(`Prepare a leak detection request for ${area.label}.`, "Include the exact property location, suspected system, first symptom, timing, and access details.")}</main>`;
  return page({ title: h1, description: `${h1}: local property context, seven city-matched services, access planning, and intended coverage status.`, route: areaRoute(area), body, active: "areas", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Service Areas",route:"/service-areas/"},{name:area.label,route:areaRoute(area)}]), faqSchema(faqs)] });
}

function localContent(service, area) {
  return `<div data-unique-copy><section class="section"><div class="shell content-grid"><article class="prose"><p class="eyebrow">${esc(area.label)} service guide</p><h2>When this ${esc(area.label)} detection scope may fit</h2><p>${esc(localH1(service, area))} is intended to ${esc(service.intro)}. The scope may fit when ${esc(service.situation)}.</p><p>${esc(area.propertyMix)} In this property mix, the request should identify the building type, meter arrangement, suspected route, affected zone, prior work, and who controls access.</p><h2>Local conditions that can change the test sequence</h2><p>${esc(area.waterContext)} These conditions do not prove a leak, but they affect which competing sources must be removed and where instruments can produce useful readings.</p>${image(service, { area })}<h2>How ${esc(service.label.toLowerCase())} is approached</h2><p>The system boundary includes ${esc(service.system)}. Testing may use ${esc(service.methods)}. A useful sequence starts with the reported condition, isolates the relevant zones, repeats observations where possible, and documents conditions that limit the conclusion.</p><h2>Evidence expected from the ${esc(area.label)} visit</h2><p>The intended evidence is ${esc(service.evidence)}. The record should connect the result to the exact test condition and property area rather than presenting a tool reading without context.</p><h2>Access and coordination in ${esc(area.label)}</h2><p>${esc(area.access)} For this service, also identify valves, meters, cleanouts, equipment, occupied rooms, pets, gates, security, tenant approvals, and any limit on water use or shutdown duration.</p><h2>Repair and responsibility boundaries</h2><p>${esc(service.decision)} The exact provider, jurisdiction, private-versus-utility boundary, property agreement, and repair authority must be verified for the address. Detection does not include excavation, finish removal, drying, remediation, structural work, pipe repair, or restoration unless later placed in a separate written scope.</p><h2>What affects ${esc(service.label.toLowerCase())} cost in ${esc(area.label)}</h2><p>Cost commonly changes with ${esc(service.costFactors)}. Local access, occupied-space coordination, site distance, security, utility boundaries, and additional zones can also change the scope. A proposal should state inclusions, limits, documentation, and how added testing is authorized.</p></article><aside class="scope-card"><span>${esc(area.label)} detection checklist</span><h2>${esc(service.label)}</h2><dl><dt>Service goal</dt><dd>${esc(service.intro)}</dd><dt>Property context</dt><dd>${esc(area.propertyMix)}</dd><dt>Methods</dt><dd>${esc(service.methods)}</dd><dt>Evidence</dt><dd>${esc(service.evidence)}</dd></dl><a class="button" href="#request-hero">Prepare Request</a></aside></div></section></div>`;
}

function localPage(service, area) {
  const h1 = localH1(service, area);
  const faqs = localFaqs(service, area);
  const related = service.related.map((slug) => serviceBySlug[slug]);
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: `${area.type} · Intended coverage pending verification`, intro: `${service.label} for ${area.label} properties, with local access, system, and evidence considerations.`, trail: [{label:"Home",route:"/"},{label:"Service Areas",route:"/service-areas/"},{label:area.label,route:areaRoute(area)},{label:service.label}], service, area })}${localContent(service, area)}<section class="section related" aria-labelledby="related-local-title"><div class="shell section-head"><div><p class="eyebrow">Stay inside ${esc(area.label)}</p><h2 id="related-local-title">Related Leak Detection Services in ${esc(area.label)}</h2></div><a href="${areaRoute(area)}">All ${esc(area.label)} services</a></div><div class="shell card-grid related-grid">${serviceCards(related, (item) => localRoute(item, area), area)}</div></section><section class="section nearby"><div class="shell section-head"><div><p class="eyebrow">Same service, nearby markets</p><h2>${esc(service.label)} Near ${esc(area.label)}</h2></div><a href="${serviceRoute(service)}">Greater Houston ${esc(service.label)}</a></div><div class="shell nearby-links">${nearbyAreas(area).map((nearby) => `<a href="${localRoute(service, nearby)}">${esc(service.label)} in ${esc(nearby.label)}</a>`).join("")}</div></section>${faq(`${service.label} in ${area.label}: questions`, `Local coverage, evidence, access, and repair boundaries for this one-to-one service page.`, faqs)}${finalCta(`Prepare a ${service.label.toLowerCase()} request for ${area.label}.`, "Share the exact location, property type, first symptom, meter or moisture clues, and access details.")}</main>`;
  return page({ title: h1, description: `${h1}: symptoms, local property context, testing methods, evidence, access, cost factors, and repair boundaries.`, route: localRoute(service, area), body, active: "areas", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Service Areas",route:"/service-areas/"},{name:area.label,route:areaRoute(area)},{name:service.label,route:localRoute(service,area)}]), faqSchema(faqs)] });
}

function processPage() {
  const h1 = "Leak Detection Process";
  const faqs = [["Does every request use every tool?", "No. Tools are chosen after the symptom and system boundary are defined. Using every instrument can add time without improving evidence."],["What should a detection result contain?", "It should state the test conditions, observations, likely zone or system, limits, and the next step needed before repair."],["Can testing require a shutdown?", "Yes. Meter, pressure, line, fixture, commercial, and pool tests may require controlled water use, isolation, or equipment changes."],["Who approves access or destructive work?", "The property owner or authorized manager must approve access. Destructive access is outside this pre-launch detection scope unless separately contracted."],["What happens when the source remains uncertain?", "The result should explain the remaining possibilities and the most useful next test or access step rather than present an unsupported conclusion."]];
  const steps = [["01","Describe the symptom","Record meter movement, moisture, sound, temperature, odor, pressure, drainage, or pool-level behavior and when it occurs."],["02","Map the systems","Identify meters, valves, fixtures, buried routes, pools, equipment, drainage, irrigation, condensate, and property boundaries."],["03","Isolate competing sources","Use controlled water use and accessible isolation points to separate pressurized, drainage, pool, appliance, envelope, and past-moisture explanations."],["04","Test and correlate","Apply the methods appropriate to the system and look for repeatable results rather than a single unexplained instrument reading."],["05","Document the finding","Record the likely zone, evidence, test conditions, access limits, uncertainty, and the next step needed before repair."],["06","Scope repair separately","Compare access, pipe repair, excavation, restoration, permits, drying, remediation, and utility coordination as separate authorized work."]];
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: "Evidence before repair", intro: "A six-stage process for moving from an unexplained symptom to a documented repair decision.", trail: [{label:"Home",route:"/"},{label:"Process"}] })}<section class="section"><div class="shell timeline">${steps.map(([number,title,copy]) => `<article><span>${number}</span><div><h2>${esc(title)}</h2><p>${esc(copy)}</p></div></article>`).join("")}</div></section>${faq("Leak detection process questions", "Testing sequence, documentation, access, and uncertainty.", faqs)}${finalCta("Prepare the symptom before the test plan.", "Share what changed, when it happens, the systems that may be involved, and any access or shutdown limits.")}</main>`;
  return page({ title: h1, description: "Follow the leak detection process from symptom documentation and system isolation through testing, evidence, and separate repair planning.", route: "/process/", body, active: "process", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Process",route:"/process/"}]), faqSchema(faqs)] });
}

function contactPage() {
  const h1 = "Request Leak Detection";
  const faqs = [["Does this form send my information now?", "No. The pre-launch form validates the request details locally but does not transmit or retain them until a secure destination is connected."],["Is there a phone number?", "No active controlled phone number has been supplied, so no placeholder or competitor number is published."],["What location detail should I provide?", "Use the exact street, city, and ZIP code when routing is connected. For preview, provide at least the city or ZIP to understand the intended market."],["What should I include in the situation description?", "Include the first symptom, timing, meter behavior, moisture or sound clues, affected fixtures or zones, prior work, and access limitations."],["Can I request emergency response?", "No emergency or availability claim is made. If there is active flooding, electrical risk, gas odor, sewage exposure, or structural danger, stop using the affected system when safe and contact the appropriate emergency or utility resource."]];
  const body = `<main id="main-content">${pageHero({ h1, eyebrow: "Form-first pre-launch contact", intro: "Prepare the location, suspected system, symptoms, timing, and access details for future operator routing.", trail: [{label:"Home",route:"/"},{label:"Contact"}] })}<section class="section" id="request"><div class="shell contact-grid"><div class="prose"><p class="eyebrow">Routing status</p><h2>No lead destination is connected yet</h2><p>The form is intentionally non-sending. It validates the fields and explains what remains before a live request can be transmitted.</p><h2>Useful request details</h2><ul class="check-list"><li>Exact property location</li><li>Building and occupancy type</li><li>First symptom and start time</li><li>Meter, pressure, moisture, or sound clues</li><li>Affected fixtures or zones</li><li>Pool, irrigation, or commercial systems</li><li>Prior repairs or recent construction</li><li>Access, gate, tenant, or shutdown limits</li></ul></div>${quickForm(null,null,"contact")}</div></section>${faq("Request and routing questions", "What the form does now and what information supports later routing.", faqs)}</main>`;
  return page({ title: h1, description: "Prepare a Greater Houston leak detection request with the property location, suspected system, symptoms, timing, and access details.", route: "/contact/", body, active: "contact", graph: [breadcrumb([{name:"Home",route:"/"},{name:"Contact",route:"/contact/"}]), faqSchema(faqs)] });
}

function privacyPage() {
  const h1 = "Privacy Information";
  const faqs = [["Does the current form transmit personal information?", "No. The pre-launch form validates fields in the browser and does not have a connected endpoint."],["Are analytics or advertising trackers active?", "No analytics or advertising integrations are configured in this package."],["Will this policy change when routing is connected?", "Yes. The final operator and form processor must document collection, use, retention, disclosure, security, and applicable rights before launch."],["Should sensitive information be entered?", "No. Do not submit payment details, government identifiers, medical information, passwords, or other sensitive data through a service-request form."],["Where will privacy questions be sent?", "A verified privacy contact must be added before live collection is enabled."]];
  const body = `<main id="main-content"><section class="simple-hero"><div class="shell">${crumbs([{label:"Home",route:"/"},{label:"Privacy"}])}<p class="eyebrow">Pre-launch policy</p><h1>${h1}</h1><p>This page explains the current non-sending preview and the privacy work required before live lead collection.</p></div></section><section class="section"><article class="shell legal"><div data-unique-copy><h2>Current collection status</h2><p>No live lead destination, CRM, webhook, analytics property, advertising pixel, phone tracking system, or active operator contact is configured. The request form performs browser-side validation and displays a status message without intentionally transmitting or retaining the entered details.</p><h2>Information a future form may collect</h2><p>A connected form may need a name, contact method, property location, suspected service, situation description, access notes, and technical details relevant to routing. The final policy must identify the receiving operator and service providers, collection purpose, legal basis where applicable, retention period, disclosures, security practices, and available privacy rights.</p><h2>Do not submit sensitive information</h2><p>A service-request form should not collect payment-card data, bank credentials, government identifiers, medical records, passwords, access codes that are not necessary for scheduling, or other sensitive information. Only property and contact details reasonably needed to evaluate the request should be collected.</p><h2>Cookies and analytics</h2><p>No analytics or advertising tools are configured. If they are added later, the project owner must document the tools, cookies, consent requirements, opt-out controls, and data-sharing behavior before enabling them.</p><h2>Future operator and contact</h2><p>A verified operator and privacy contact must be added before live lead collection. This page must then be updated to match the actual form destination and data practices.</p></div></article></section>${faq("Privacy questions", "Current form behavior and the work required before live collection.", faqs)}</main>`;
  return page({ title: h1, description: "Read the pre-launch privacy status for the non-sending form and the policy requirements before live lead collection is enabled.", route: "/privacy/", body, graph: [breadcrumb([{name:"Home",route:"/"},{name:"Privacy",route:"/privacy/"}]), faqSchema(faqs)] });
}

function notFoundPage() {
  const body = `<main id="main-content" class="not-found"><div><span>404</span><h1>Page Not Found</h1><p>The requested route is not in the current leak detection service map.</p><a class="button" href="/">Return Home</a><a href="/services/">Browse Services</a></div></main>`;
  return page({ title: "Page Not Found", description: "The requested Leak Detection Houston Pros route could not be found. Return home or browse the service directory.", route: "/404.html", body });
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#f8faf7"/><path d="M32 9C24 20 16 29 16 40a16 16 0 0 0 32 0c0-11-8-20-16-31Z" fill="none" stroke="#087f87" stroke-width="6"/><path d="M24 41c2 5 6 7 11 7" fill="none" stroke="#ff6b3d" stroke-width="6" stroke-linecap="round"/></svg>`;
}

resetGeneratedPages();
write("/", homePage());
write("/services/", servicesPage());
project.services.forEach((service) => write(serviceRoute(service), servicePage(service)));
write("/service-areas/", areasPage());
areas.forEach((area) => write(areaRoute(area), areaPage(area)));
for (const area of areas) for (const service of project.services) write(localRoute(service, area), localPage(service, area));
write("/process/", processPage());
write("/contact/", contactPage());
write("/privacy/", privacyPage());
write("/404.html", notFoundPage());
fs.writeFileSync(path.join(out, "assets", "favicon.svg"), favicon(), "utf8");
fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${abs(route)}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
fs.writeFileSync(path.join(out, "robots.txt"), config.indexingEnabled ? `User-agent: *\nAllow: /\nSitemap: ${abs("/sitemap.xml")}\n` : "User-agent: *\nDisallow: /\n", "utf8");
console.log(`Generated ${routes.length + 1} HTML pages (${project.services.length} services, ${areas.length} markets, ${project.services.length * areas.length} city/service pages).`);
