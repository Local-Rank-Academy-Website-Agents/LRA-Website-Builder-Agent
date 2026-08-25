import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { areaGroups, serviceBySlug, services, site } from "./site-data.mjs";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "site");
const config = JSON.parse(fs.readFileSync(path.join(projectRoot, "site.config.json"), "utf8"));
site.baseUrl = config.baseUrl;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const absolute = (route) => `${site.baseUrl}${route === "/" ? "/" : route}`;

const brand = (footer = false) => `
  <a class="brand${footer ? " brand--footer" : ""}" href="/" aria-label="${site.name} home">
    <svg class="brand__mark" viewBox="0 0 44 44" aria-hidden="true"><path d="M22 5C15 13 10 18 10 26a12 12 0 0 0 24 0C34 18 29 13 22 5Z"/><path d="M16 27c3-1 5-3 7-6 1 4 4 7 7 8"/></svg>
    <span><b>Houston Mold</b><small>Remediation Pros</small></span>
  </a>`;

const serviceGroups = [...new Set(services.map((service) => service.group))];

function servicesMenu() {
  return serviceGroups.map((group) => `
    <div class="nav-menu-group">
      <strong>${escapeHtml(group)}</strong>
      ${services.filter((service) => service.group === group).map((service) => `<a href="/services/${service.slug}/">${escapeHtml(service.label)}</a>`).join("")}
    </div>`).join("");
}

function areasMenu() {
  return areaGroups.map((group) => `
    <div class="nav-menu-group">
      <a class="nav-menu-group__title" href="/houston-service-area/#${group.slug}">${escapeHtml(group.label)}</a>
      ${group.areas.map(([slug, label]) => `<a href="/houston-service-area/#${slug}">${escapeHtml(label)}</a>`).join("")}
    </div>`).join("");
}

function header(active = "") {
  return `
  <div class="status-bar">
    <div class="shell status-bar__inner"><span class="status-dot"></span><span>${escapeHtml(site.status)}</span><span class="status-bar__detail">Form-first test build · no public phone or address</span></div>
  </div>
  <header class="site-header">
    <div class="shell nav-wrap">
      ${brand()}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>
        <span class="sr-only">Toggle navigation</span><span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation" data-nav>
        <div class="nav-dropdown" data-dropdown>
          <div class="nav-dropdown__control">
            <a class="nav-dropdown__trigger" href="/services/"${active === "services" ? ' aria-current="page"' : ""}>Services</a>
            <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="services-submenu" aria-label="Show services submenu" data-dropdown-toggle><span aria-hidden="true"></span></button>
          </div>
          <div class="nav-dropdown__menu nav-mega nav-mega--services" id="services-submenu" aria-label="Services submenu">
            <div class="nav-menu-group nav-menu-group--intro"><strong>Service directory</strong><a href="/services/">View all services</a></div>
            ${servicesMenu()}
          </div>
        </div>
        <div class="nav-dropdown" data-dropdown>
          <div class="nav-dropdown__control">
            <a class="nav-dropdown__trigger" href="/houston-service-area/"${active === "areas" ? ' aria-current="page"' : ""}>Service Areas</a>
            <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="areas-submenu" aria-label="Show service areas submenu" data-dropdown-toggle><span aria-hidden="true"></span></button>
          </div>
          <div class="nav-dropdown__menu nav-mega nav-mega--areas" id="areas-submenu" aria-label="Service areas submenu">
            ${areasMenu()}
          </div>
        </div>
        <a href="/process/"${active === "process" ? ' aria-current="page"' : ""}>How It Works</a>
        <a href="/contact/"${active === "contact" ? ' aria-current="page"' : ""}>Contact</a>
        <a class="button button--small" href="/contact/">Request a Service Match</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="shell footer-top">
      <div>
        ${brand(true)}
        <p class="footer-note">Independent pre-launch service-matching website. No local operator, phone, public address, Google Business Profile, or form destination is active. Provider credentials, capabilities, and ZIP-code coverage must be verified before launch.</p>
      </div>
      <nav class="footer-quick" aria-label="Information">
        <b>Information</b>
        <a href="/process/">How it works</a>
        <a href="/contact/">Request a service match</a>
        <a href="/privacy/">Privacy</a>
        <a href="/houston-service-area/">Coverage verification</a>
      </nav>
    </div>
    <div class="shell footer-directory">
      <div class="footer-directory__heading"><b>Complete Service Directory</b><a href="/services/">All services</a></div>
      <div class="footer-directory__grid footer-directory__grid--services">
        ${serviceGroups.map((group) => `
          <nav aria-label="${escapeHtml(group)} services">
            <strong>${escapeHtml(group)}</strong>
            ${services.filter((service) => service.group === group).map((service) => `<a href="/services/${service.slug}/">${escapeHtml(service.label)}</a>`).join("")}
          </nav>`).join("")}
      </div>
    </div>
    <div class="shell footer-directory">
      <div class="footer-directory__heading"><b>Complete Service Area Directory</b><a href="/houston-service-area/">Area guide</a></div>
      <p class="footer-directory__note">These are target markets for operator verification, not claims of currently active coverage.</p>
      <div class="footer-directory__grid footer-directory__grid--areas">
        ${areaGroups.map((group) => `
          <nav aria-label="${escapeHtml(group.label)} service areas">
            <a class="footer-directory__group" href="/houston-service-area/#${group.slug}">${escapeHtml(group.label)}</a>
            ${group.areas.map(([slug, label]) => `<a href="/houston-service-area/#${slug}">${escapeHtml(label)}</a>`).join("")}
          </nav>`).join("")}
      </div>
    </div>
    <div class="shell footer-bottom">
      <span>© <span data-year></span> ${site.name}</span>
      <span>Pre-launch test build · Coverage verification required</span>
    </div>
  </footer>`;
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.route),
    })),
  };
}

function page({
  title,
  description,
  route,
  active = "",
  body,
  schema = [],
  bodyClass = "",
}) {
  const graph = Array.isArray(schema) ? schema : [schema];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${config.indexingEnabled ? "index, follow" : "noindex, nofollow"}">
  <link rel="canonical" href="${absolute(route)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${absolute(route)}">
  <meta property="og:image" content="${absolute("/assets/images/hero-mold-assessment.jpg")}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  ${graph.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>` : ""}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
  <a class="skip-link" href="#main-content">Skip to content</a>
  ${header(active)}
  ${body}
  ${footer()}
  <script src="/assets/main.js" defer></script>
</body>
</html>`;
}

function faqSection(title, intro, faqs) {
  return `
    <section class="section section--ivory page-faq" aria-labelledby="faq-heading">
      <div class="shell faq-layout">
        <div class="faq-heading reveal">
          <p class="eyebrow">Frequently asked questions</p>
          <h2 id="faq-heading">${escapeHtml(title)}</h2>
          <p>${escapeHtml(intro)}</p>
        </div>
        <div class="accordion reveal">
          ${faqs.map(([question, answer]) => `
            <details>
              <summary>${escapeHtml(question)}<span aria-hidden="true">+</span></summary>
              <p>${escapeHtml(answer)}</p>
            </details>`).join("")}
        </div>
      </div>
    </section>`;
}

function ctaSection(eyebrow = "Describe the property concern", heading = "Request a service match.", copy = "Share the ZIP code, property type, moisture history, and affected area. The test form validates locally but will not transmit until a verified operator and destination are connected.") {
  return `
    <section class="cta-section">
      <div class="shell cta-panel reveal">
        <div><p class="eyebrow eyebrow--light">${escapeHtml(eyebrow)}</p><h2>${escapeHtml(heading)}</h2></div>
        <div><p>${escapeHtml(copy)}</p><a class="button button--amber" href="/contact/">Open the request form <span aria-hidden="true">→</span></a></div>
      </div>
    </section>`;
}

function pageHero({ eyebrow, h1, lede, breadcrumbs }) {
  return `
    <section class="page-hero">
      <div class="shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb">${breadcrumbs.map((crumb, index) => crumb.route ? `<a href="${crumb.route}">${escapeHtml(crumb.label)}</a>${index < breadcrumbs.length - 1 ? " / " : ""}` : escapeHtml(crumb.label)).join("")}</nav>
        <div class="page-hero__inner">
          <div><p class="eyebrow eyebrow--light">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(h1)}</h1></div>
          <p class="page-hero__lede">${escapeHtml(lede)}</p>
        </div>
      </div>
    </section>`;
}

function serviceCard(service, index, featured = false) {
  return `
    <a class="service-card${featured ? " service-card--featured" : ""}" href="/services/${service.slug}/">
      <span>${String(index + 1).padStart(2, "0")} · ${escapeHtml(service.group)}</span>
      <h3>${escapeHtml(service.label)}</h3>
      <p>${escapeHtml(service.lede)}</p>
      <b>Explore this service <span aria-hidden="true">↗</span></b>
    </a>`;
}

function homePage() {
  const priorityServices = services.filter((service) => service.priority);
  const schema = [
    {
      "@type": "WebSite",
      name: site.name,
      url: absolute("/"),
      description: site.description,
    },
    {
      "@type": "Organization",
      name: site.name,
      url: absolute("/"),
      description: "Independent pre-launch mold remediation service-matching website.",
    },
  ];
  const faqs = [
    ["Do I need mold testing before remediation?", "Not every visible condition requires sampling. Testing should answer a defined question, and regulated Texas projects may require an independent mold assessment consultant to establish a protocol."],
    ["What should I do when water is still entering the property?", "Address immediate safety first and contact the appropriate emergency, plumbing, roofing, or water-mitigation resource. This pre-launch site does not provide emergency response."],
    ["Can mold simply be painted over?", "No. Coating a surface does not correct the moisture source or address contaminated or damaged material behind the finish."],
    ["Which Greater Houston areas are included?", "The site maps Houston and surrounding target markets, but every ZIP code and service must be confirmed with a future operator before launch."],
    ["Does this website currently send leads to a contractor?", "No. The form is in test mode and stores or transmits nothing. Routing will be activated only after a real operator and destination are verified."],
  ];
  const body = `
  <main id="main-content">
    <section class="hero">
      <div class="shell hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">Form-first service matching · Greater Houston</p>
          <h1>Mold Remediation Services in the Greater Houston Area</h1>
          <p class="hero__lede">Explore the right response for residential, commercial, attic, crawl-space, HVAC, water-damage, odor, testing, and moisture-control concerns—then organize the details a verified local provider will need.</p>
          <div class="button-row">
            <a class="button" href="/contact/">Request a service match <span aria-hidden="true">→</span></a>
            <a class="text-link" href="/services/">Explore all ${services.length} services</a>
          </div>
          <ul class="hero__signals" aria-label="Website status">
            <li>Houston-area keyword map</li>
            <li>Texas-aware process</li>
            <li>Pre-launch test mode</li>
          </ul>
        </div>
        <div class="hero__visual reveal">
          <img src="/assets/images/hero-mold-assessment.jpg" width="1600" height="900" alt="Prepared home interior with containment sheeting and a moisture meter">
          <div class="hero__note"><span class="hero__note-number">01</span><p><b>Start with the moisture story.</b> The location, material, water event, and timeline help determine the correct first service.</p></div>
        </div>
      </div>
      <div class="shell hero__rail" aria-label="Common mold concern triggers"><span>Musty odor</span><span>Recent leak</span><span>Visible growth</span><span>Storm water</span><span>HVAC concern</span></div>
    </section>

    <section class="section section--ivory">
      <div class="shell split-heading reveal">
        <div><p class="eyebrow">Houston mold and moisture context</p><h2>Match the service to the source, material, and property.</h2></div>
        <div class="prose"><p>Greater Houston properties experience long cooling seasons, high outdoor humidity, tropical weather, hard-driven rain, roof exposure, plumbing failures, and drainage conditions that can keep building materials wet.</p><p>A useful response distinguishes assessment, remediation, water mitigation, HVAC work, source repair, drying, and verification. Those services may involve different professionals and a defined sequence.</p></div>
      </div>
      <div class="shell concern-grid">
        <article class="concern-card reveal"><span class="card-index">A</span><h3>Water intrusion and hidden wet materials</h3><p>Drywall cavities, cabinets, insulation, flooring, and framing can remain damp after visible water is removed.</p></article>
        <article class="concern-card reveal"><span class="card-index">B</span><h3>Humidity, condensation, and HVAC pathways</h3><p>Air handlers, ducts, cold surfaces, pressure differences, and oversized equipment can contribute to persistent moisture.</p></article>
        <article class="concern-card reveal"><span class="card-index">C</span><h3>Assessment, protocol, and verification decisions</h3><p>Texas requirements and project needs determine when an independent assessor should define or verify the work.</p></article>
      </div>
    </section>

    <section class="section services-section" aria-labelledby="home-services-heading">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Core service pages</p><h2 id="home-services-heading">Mold services organized by search intent.</h2></div><a class="text-link" href="/services/">Browse the complete directory</a></div>
        <div class="service-card-grid service-card-grid--compact">
          ${priorityServices.map((service, index) => serviceCard(service, index, index === 0)).join("")}
        </div>
      </div>
    </section>

    <section class="section section--green">
      <div class="shell process-intro">
        <div class="process-intro__copy reveal"><p class="eyebrow eyebrow--light">A Texas-aware service path</p><h2>Assessment and remediation are different roles.</h2><p>When a formal assessment, protocol, or clearance is required, independence and sequencing matter. The future provider-matching workflow must verify the professional, license, scope, and actual service area.</p><a class="button button--amber" href="/process/">Understand the matching process</a></div>
        <ol class="process-steps reveal">
          <li><span>1</span><div><b>Describe the concern</b><small>ZIP code, property type, affected material, moisture event, and timing</small></div></li>
          <li><span>2</span><div><b>Choose the right first service</b><small>Assessment, remediation, water mitigation, HVAC, or moisture control</small></div></li>
          <li><span>3</span><div><b>Verify the provider</b><small>Credentials, service capability, independence, and real ZIP-code coverage</small></div></li>
          <li><span>4</span><div><b>Review the written scope</b><small>Containment, materials, source repair, drying, documentation, and verification</small></div></li>
        </ol>
      </div>
    </section>

    <section class="section local-section">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Greater Houston service-area map</p><h2>Target markets organized by region.</h2></div><a class="text-link" href="/houston-service-area/">Open the complete area guide</a></div>
        <p class="directory-disclaimer">All locations below are intended coverage targets for a future operator. They are not claims of current availability.</p>
        <div class="area-group-grid">
          ${areaGroups.map((group) => `<article class="area-group-card reveal"><a href="/houston-service-area/#${group.slug}"><h3>${escapeHtml(group.label)}</h3></a><p>${escapeHtml(group.areas.map(([, label]) => label).join(" · "))}</p></article>`).join("")}
        </div>
      </div>
    </section>

    ${faqSection("Greater Houston mold remediation questions", "Answers for the broad service and market before you choose a more specific page.", faqs)}
    ${ctaSection()}
  </main>`;
  return page({
    title: `Mold Remediation Services in Greater Houston | ${site.name}`,
    description: "Explore mold remediation services across the Greater Houston area, including residential, commercial, HVAC, attic, water-damage, testing, and moisture-control pathways.",
    route: "/",
    body,
    schema,
  });
}

function servicesPage() {
  const faqs = [
    ["Why are mold removal and mold remediation not separate pages?", "They substantially overlap in search intent. The broad mold remediation page owns that umbrella topic so near-duplicate pages do not compete."],
    ["Why are HVAC remediation and duct cleaning separate?", "One concerns contaminated HVAC components and material-specific remediation; the other concerns source-removal cleaning of suitable ductwork after the correct scope is established."],
    ["Can one request involve several services?", "Yes. A water event may require assessment, remediation, HVAC work, moisture control, and verification in sequence."],
    ["Are all listed services active now?", "No. They are mapped service intents for a pre-launch rank-and-rent property. A future operator's capabilities must be verified before routing."],
  ];
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: `${services.length} non-overlapping service pathways`,
      h1: "Mold Remediation Services in Houston, TX",
      lede: "Use this directory to choose the service that best matches the property, material, moisture source, and decision you need to make.",
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "Services" }],
    })}
    <section class="section">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Complete service directory</p><h2>Each page owns one primary search intent.</h2></div><p class="section-heading__copy">Synonyms and overlapping topics are consolidated. Distinct pages are reserved for different property types, systems, materials, or decisions.</p></div>
        ${serviceGroups.map((group) => `
          <section class="service-directory-group reveal" aria-labelledby="group-${group.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}">
            <div class="service-directory-group__heading"><h3 id="group-${group.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}">${escapeHtml(group)}</h3><span>${services.filter((service) => service.group === group).length} pages</span></div>
            <div class="service-card-grid">${services.filter((service) => service.group === group).map((service, index) => serviceCard(service, index)).join("")}</div>
          </section>`).join("")}
      </div>
    </section>
    <section class="section section--green">
      <div class="shell split-heading"><div><p class="eyebrow eyebrow--light">Not sure which page fits?</p><h2>Start with the moisture event and affected material.</h2></div><div class="prose prose--light"><p>Describe where the concern appears, what became wet, when it happened, whether water is still entering, and whether an independent assessment already exists.</p><a class="button button--amber" href="/process/">Review the service path</a></div></div>
    </section>
    ${faqSection("Questions about the service directory", "How the services are separated and how a future request will be matched.", faqs)}
    ${ctaSection()}
  </main>`;
  return page({
    title: `Mold Remediation Services in Houston, TX | ${site.name}`,
    description: `Browse ${services.length} distinct Houston mold remediation, assessment, HVAC, odor, water-damage, and moisture-control service pages.`,
    route: "/services/",
    active: "services",
    body,
    schema: [breadcrumbSchema([{ name: "Home", route: "/" }, { name: "Services", route: "/services/" }])],
  });
}

function relatedServicesSection(service) {
  return `
    <section class="section related-services" aria-labelledby="related-services-heading">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Internal service path</p><h2 id="related-services-heading">Related Services</h2></div><a class="text-link" href="/services/">View all services</a></div>
        <div class="related-link-grid">
          ${service.related.map((slug) => {
            const related = serviceBySlug.get(slug);
            if (!related) throw new Error(`Unknown related service ${slug} on ${service.slug}`);
            return `<a class="related-link-card reveal" href="/services/${related.slug}/"><span>${escapeHtml(related.group)}</span><h3>${escapeHtml(related.label)}</h3><p>${escapeHtml(related.lede)}</p><b>Open service page <span aria-hidden="true">↗</span></b></a>`;
          }).join("")}
        </div>
      </div>
    </section>`;
}

function serviceAreasSection(service) {
  return `
    <section class="section section--ivory service-area-links" aria-labelledby="service-areas-heading">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Coverage verification required</p><h2 id="service-areas-heading">Service Areas for ${escapeHtml(service.label)}</h2></div><a class="text-link" href="/houston-service-area/">View every target area</a></div>
        <p class="directory-disclaimer">These links identify intended Greater Houston markets for a future operator. They do not confirm that ${escapeHtml(service.label.toLowerCase())} is currently available in a specific ZIP code.</p>
        <div class="area-link-grid">
          ${areaGroups.map((group) => `<a class="area-link-card reveal" href="/houston-service-area/#${group.slug}"><span>${escapeHtml(group.areas.length)} mapped areas</span><h3>${escapeHtml(group.label)}</h3><p>${escapeHtml(group.areas.map(([, label]) => label).join(" · "))}</p></a>`).join("")}
        </div>
      </div>
    </section>`;
}

function servicePage(service) {
  const route = `/services/${service.slug}/`;
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: `${service.group} · Provider matching`,
      h1: service.h1,
      lede: service.lede,
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "Services", route: "/services/" }, { label: service.label }],
    })}
    <section class="section">
      <div class="shell content-grid">
        <article class="article">
          <h2>${escapeHtml(service.problemHeading)}</h2>
          <p>${escapeHtml(service.problemText)}</p>
          <div class="topic-grid">
            ${service.signals.map(([heading, copy]) => `<div class="topic-card"><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(copy)}</p></div>`).join("")}
          </div>
          <h2>${escapeHtml(service.scopeHeading)}</h2>
          <p>${escapeHtml(service.scopeText)}</p>
          <ul class="check-list">${service.scopeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <div class="article-callout"><b>Pre-launch accuracy note</b><p>This website does not currently employ or represent an activated local operator. Credentials, license requirements, service capability, pricing, and ZIP-code coverage must be verified before a request is routed.</p></div>
          <h2>${escapeHtml(service.decisionHeading)}</h2>
          <p>${escapeHtml(service.decisionText)}</p>
        </article>
        <aside>
          <div class="side-card reveal">
            <p class="eyebrow">${escapeHtml(service.label)} request</p>
            <h2>Organize the details first.</h2>
            <p>A focused request makes it easier to identify the right type of provider once routing is activated.</p>
            <ul><li>Property ZIP code and type</li><li>Room, system, or material</li><li>Water or humidity history</li><li>Existing reports or prior work</li></ul>
            <a class="button" href="/contact/">Open request form</a>
          </div>
        </aside>
      </div>
    </section>
    ${relatedServicesSection(service)}
    ${serviceAreasSection(service)}
    ${faqSection(`${service.label} questions`, `Page-specific answers about ${service.label.toLowerCase()} scope, decisions, and provider matching.`, service.faqs)}
    ${ctaSection(service.label, `Describe the ${service.label.toLowerCase()} concern.`)}
  </main>`;
  const schema = [
    {
      "@type": "Service",
      name: `${service.label} Provider Matching`,
      serviceType: service.label,
      description: service.lede,
      url: absolute(route),
    },
    breadcrumbSchema([
      { name: "Home", route: "/" },
      { name: "Services", route: "/services/" },
      { name: service.label, route },
    ]),
  ];
  return page({
    title: `${service.h1} | ${site.name}`,
    description: service.lede,
    route,
    active: "services",
    body,
    schema,
    bodyClass: "service-page",
  });
}

function areaPage() {
  const faqs = [
    ["Does listing an area mean a provider is active there?", "No. Every location is a target market for operator verification. Actual service capability and ZIP-code coverage must be confirmed before launch."],
    ["Why are these areas on one page instead of separate city pages?", "A consolidated regional guide avoids thin pages that repeat the same content with only a place name changed."],
    ["Can a service be available in one target area but not another?", "Yes. Provider travel limits, service capability, property type, scheduling, and licensing can vary by location and project."],
    ["How should coverage be confirmed?", "Use the property ZIP code and requested service. The future routing workflow must match both to a verified operator."],
  ];
  const reciprocalServices = services.filter((service) => service.priority);
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: `${areaGroups.reduce((sum, group) => sum + group.areas.length, 0)} mapped communities · Operator confirmation required`,
      h1: "Mold Remediation Service Areas Across Greater Houston",
      lede: "This regional guide maps intended coverage without inventing local offices or publishing thin city pages. Every service and ZIP code remains subject to operator verification.",
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "Service Areas" }],
    })}
    <section class="section">
      <div class="shell">
        <div class="coverage-notice reveal"><p class="eyebrow">Pre-launch coverage status</p><h2>Target markets are not active-service claims.</h2><p>The website is awaiting an operator. These regions guide future matching architecture, but no location is presented as a staffed office or confirmed service territory.</p></div>
        <nav class="area-jump-nav" aria-label="Jump to a Greater Houston region">
          ${areaGroups.map((group) => `<a href="#${group.slug}">${escapeHtml(group.label)}</a>`).join("")}
        </nav>
      </div>
    </section>
    <section class="section section--ivory area-directory">
      <div class="shell">
        ${areaGroups.map((group) => `
          <section class="area-region reveal" id="${group.slug}" aria-labelledby="${group.slug}-heading">
            <div class="area-region__heading"><div><p class="eyebrow">Target region</p><h2 id="${group.slug}-heading">${escapeHtml(group.label)}</h2></div><p>${escapeHtml(group.description)}</p></div>
            <div class="community-grid">
              ${group.areas.map(([slug, label]) => `
                <article class="community-card" id="${slug}">
                  <h3>${escapeHtml(label)}</h3>
                  <p>${escapeHtml(label)} is mapped as an intended Greater Houston service area. A future provider must confirm the requested service and ZIP-code coverage.</p>
                  <a href="/contact/">Request coverage verification</a>
                </article>`).join("")}
            </div>
          </section>`).join("")}
      </div>
    </section>
    <section class="section" aria-labelledby="area-services-heading">
      <div class="shell">
        <div class="section-heading reveal"><div><p class="eyebrow">Area-to-service links</p><h2 id="area-services-heading">Core services to verify in each market.</h2></div><a class="text-link" href="/services/">Complete service directory</a></div>
        <div class="related-link-grid">
          ${reciprocalServices.map((service) => `<a class="related-link-card reveal" href="/services/${service.slug}/"><span>${escapeHtml(service.group)}</span><h3>${escapeHtml(service.label)}</h3><p>Review the service scope, related services, and regional coverage links.</p><b>Open service page <span aria-hidden="true">↗</span></b></a>`).join("")}
        </div>
      </div>
    </section>
    ${faqSection("Greater Houston service-area questions", "How intended coverage is mapped without overstating current availability.", faqs)}
    ${ctaSection("Start with the ZIP code", "Request service-area verification.")}
  </main>`;
  return page({
    title: `Mold Remediation Service Areas Across Greater Houston | ${site.name}`,
    description: "Explore intended mold remediation service areas across Houston, The Woodlands, Katy, Cypress, Sugar Land, Pearland, Baytown, and surrounding Greater Houston communities.",
    route: "/houston-service-area/",
    active: "areas",
    body,
    schema: [
      { "@type": "CollectionPage", name: "Mold Remediation Service Areas Across Greater Houston", url: absolute("/houston-service-area/"), description: "Pre-launch target market directory requiring operator verification." },
      breadcrumbSchema([{ name: "Home", route: "/" }, { name: "Service Areas", route: "/houston-service-area/" }]),
    ],
  });
}

function processPage() {
  const faqs = [
    ["What happens after the form is connected?", "A request should be screened for service type, ZIP code, property type, urgency, and provider capability before it is sent to a verified operator."],
    ["How will provider credentials be checked?", "The owner should verify identity, applicable Texas license information, insurance, scope capability, and coverage before activation and periodically afterward."],
    ["Can one company assess and remediate the same project?", "Texas independence and licensing rules can restrict roles. Each project should follow the current requirements and written protocol."],
    ["Is ranking or lead volume guaranteed?", "No. This website makes no search-ranking, traffic, or lead-volume guarantee."],
  ];
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: "Transparent pre-launch workflow",
      h1: "Mold Remediation Service Matching Process",
      lede: "The future workflow must connect the right service and ZIP code to a verified provider without blurring assessment, remediation, or coverage responsibilities.",
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "How It Works" }],
    })}
    <section class="section">
      <div class="shell process-timeline">
        ${[
          ["01", "Describe the property concern", "Collect the ZIP code, property type, affected room or system, moisture event, timeline, and any existing report."],
          ["02", "Select the correct service intent", "Choose assessment, remediation, water-damage cleanup, HVAC work, odor investigation, or moisture control based on the need."],
          ["03", "Verify provider eligibility", "Confirm the real operator, credentials, applicable licensing, capability, service-area limits, and lead destination before routing."],
          ["04", "Review scope and independence", "Make assessment, protocol, remediation, source repair, drying, reconstruction, and verification responsibilities explicit."],
          ["05", "Activate and monitor routing", "Test submissions, consent language, spam controls, notifications, response ownership, analytics, and privacy requirements before launch."],
        ].map(([number, heading, copy]) => `<article class="timeline-step reveal"><span>${number}</span><div><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(copy)}</p></div></article>`).join("")}
      </div>
    </section>
    <section class="section section--green">
      <div class="shell split-heading"><div><p class="eyebrow eyebrow--light">Texas role separation</p><h2>Verify the assessor and remediator independently.</h2></div><div class="prose prose--light"><p>The appropriate Texas licensing and independence requirements depend on the project. The site must never imply a credential until the actual operator and professional roles are verified.</p><a class="button button--amber" href="/services/mold-inspection-testing/">Review assessment coordination</a></div></div>
    </section>
    ${faqSection("Service-matching process questions", "What activation, verification, and routing should look like after an operator is selected.", faqs)}
    ${ctaSection("Test mode only", "Organize a future request.")}
  </main>`;
  return page({
    title: `Mold Remediation Service Matching Process | ${site.name}`,
    description: "Learn how Greater Houston mold remediation requests should be classified, verified, routed, and documented after a real operator is activated.",
    route: "/process/",
    active: "process",
    body,
    schema: [breadcrumbSchema([{ name: "Home", route: "/" }, { name: "How It Works", route: "/process/" }])],
  });
}

function contactPage() {
  const serviceOptions = services.map((service) => `<option value="${service.slug}">${escapeHtml(service.label)}</option>`).join("");
  const faqs = [
    ["Does submitting this form contact a contractor?", "No. This is a test build. The browser validates the fields, but the form does not transmit or store the request."],
    ["What contact information can I enter?", "Use an email address or a 10-digit phone number for testing. Do not enter sensitive medical, financial, insurance, or access information."],
    ["Why is a ZIP code required?", "Future routing needs to confirm that a verified operator offers the requested service in the property's actual market."],
    ["When will live routing be activated?", "Only after the project owner verifies an operator, form destination, privacy terms, service capabilities, credentials, and coverage."],
  ];
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: "Non-routing test form",
      h1: "Request a Mold Remediation Service Match",
      lede: "Describe the property, service, location, and moisture history. Nothing is transmitted until a verified operator and form destination are configured.",
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "Contact" }],
    })}
    <section class="section">
      <div class="shell contact-layout">
        <div class="contact-copy reveal">
          <p class="eyebrow">Before you begin</p>
          <h2>Use facts about the property—not assumptions about mold species or health.</h2>
          <p>The most useful details are the ZIP code, property type, affected location, material, water or humidity event, timing, and whether a formal assessment exists.</p>
          <ul class="contact-points"><li><b>No active phone number</b>Form-first test mode only</li><li><b>No public address</b>Service-area website awaiting an operator</li><li><b>No live routing</b>Submissions stay in this browser</li></ul>
        </div>
        <form class="lead-form reveal" data-lead-form novalidate>
          <div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
          <div class="form-grid">
            <div class="field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" data-required><span class="field-error" data-error-for="name"></span></div>
            <div class="field"><label for="contact">Email or phone</label><input id="contact" name="contact" autocomplete="email" data-required><span class="field-error" data-error-for="contact"></span></div>
            <div class="field"><label for="zip">Property ZIP code</label><input id="zip" name="zip" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" data-required><span class="field-error" data-error-for="zip"></span></div>
            <div class="field"><label for="property">Property type</label><select id="property" name="property" data-required><option value="">Select one</option><option>House</option><option>Apartment or multifamily</option><option>Commercial property</option><option>Other</option></select><span class="field-error" data-error-for="property"></span></div>
            <div class="field field--full"><label for="service">Service needed</label><select id="service" name="service" data-required><option value="">Select the closest match</option>${serviceOptions}</select><span class="field-error" data-error-for="service"></span></div>
            <div class="field field--full"><label for="concern">What happened and where?</label><textarea id="concern" name="concern" data-required></textarea><span class="field-error" data-error-for="concern"></span></div>
          </div>
          <p class="form-note">Test mode: do not enter medical details, insurance information, access codes, or other sensitive data. This form does not transmit.</p>
          <button class="button" type="submit">Validate test request</button>
          <div class="form-status" role="status" aria-live="polite" data-form-status></div>
        </form>
      </div>
    </section>
    ${faqSection("Request-form questions", "What this pre-launch form does and what must happen before real lead routing begins.", faqs)}
  </main>`;
  return page({
    title: `Request a Mold Remediation Service Match | ${site.name}`,
    description: "Use the non-routing test form to organize a future Greater Houston mold remediation service request by ZIP code, property type, and concern.",
    route: "/contact/",
    active: "contact",
    body,
    schema: [breadcrumbSchema([{ name: "Home", route: "/" }, { name: "Contact", route: "/contact/" }])],
  });
}

function privacyPage() {
  const faqs = [
    ["Does the current form send or store personal information?", "No. It validates in the browser and displays a test-mode message without transmitting the entry."],
    ["Are analytics or advertising trackers installed?", "No analytics, advertising pixels, or call-tracking tools are configured in this build."],
    ["What changes before live launch?", "The final privacy notice must identify the site owner, provider recipients, form processor, hosting platform, retention rules, contact method, and any analytics or advertising tools."],
  ];
  const body = `
  <main id="main-content">
    ${pageHero({
      eyebrow: "Pre-launch data handling",
      h1: "Privacy Information",
      lede: "This test build does not transmit form entries and does not use analytics, advertising pixels, call tracking, or a customer relationship management system.",
      breadcrumbs: [{ label: "Home", route: "/" }, { label: "Privacy" }],
    })}
    <section class="section"><div class="shell legal-copy">
      <h2>Current test-build behavior</h2><p>The contact form performs browser-side validation only. Submitted values are not sent to a server, email service, webhook, CRM, or operator. Do not enter sensitive information while testing.</p>
      <h2>Information that may be collected after activation</h2><p>A live version may collect a name, contact method, property ZIP code, property type, requested service, and a description of the property concern. The production notice must identify the actual controller, processor, recipients, retention period, and contact method before that collection begins.</p>
      <h2>Cookies and analytics</h2><p>No analytics or advertising technologies are active. Consent and disclosure requirements must be reassessed before any measurement, remarketing, session-recording, or call-tracking technology is added.</p>
      <h2>Service providers and lead recipients</h2><p>No contractor or lead recipient is currently connected. A future operator must be disclosed appropriately, and routing should be limited to the information needed to respond to the request.</p>
      <h2>Data security and retention</h2><p>The production owner must define access controls, encryption, spam protection, deletion procedures, and a retention period that fits the selected form and hosting systems.</p>
      <h2>Contact and policy updates</h2><p>No public business email or address has been supplied. This page must be updated with a working privacy contact and effective date before live data collection begins.</p>
    </div></section>
    ${faqSection("Privacy questions for this test build", "Plain-language answers about the current non-routing form and future activation requirements.", faqs)}
    ${ctaSection("Need the service architecture instead?", "Browse the complete service directory.", "Review the mapped services and target markets without entering any personal information.").replace('href="/contact/"', 'href="/services/"').replace("Open the request form", "Browse all services")}
  </main>`;
  return page({
    title: `Privacy Information | ${site.name}`,
    description: "Learn how the Houston Mold Remediation Pros test build handles forms, analytics, cookies, routing, and future privacy requirements.",
    route: "/privacy/",
    body,
    schema: [breadcrumbSchema([{ name: "Home", route: "/" }, { name: "Privacy", route: "/privacy/" }])],
  });
}

function notFoundPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Not Found | ${site.name}</title>
  <meta name="description" content="The requested page could not be found.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="${absolute("/404.html")}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <main class="not-found" id="main-content">
    <div><div class="not-found__code">404</div><h1>That page is not in the service map.</h1><p>Use the complete service directory or Greater Houston area guide to continue.</p><div class="button-row button-row--center"><a class="button button--amber" href="/services/">Browse services</a><a class="button button--light" href="/houston-service-area/">Browse service areas</a></div></div>
  </main>
</body>
</html>`;
}

function writeRoute(route, content) {
  const file = route === "/" ? path.join(outputRoot, "index.html") : route === "/404.html" ? path.join(outputRoot, "404.html") : path.join(outputRoot, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

writeRoute("/", homePage());
writeRoute("/services/", servicesPage());
for (const service of services) writeRoute(`/services/${service.slug}/`, servicePage(service));
writeRoute("/houston-service-area/", areaPage());
writeRoute("/process/", processPage());
writeRoute("/contact/", contactPage());
writeRoute("/privacy/", privacyPage());
writeRoute("/404.html", notFoundPage());

console.log(`Generated ${services.length + 7} HTML pages from the shared site data.`);
