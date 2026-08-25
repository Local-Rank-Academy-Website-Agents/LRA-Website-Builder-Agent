import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const slugs=["plumber-houston-pros","drain-cleaning-of-houston","water-heater-repair-houston","water-heater-installers-of-houston","hydro-jetting-houston"];
const failures=[];
const summaries=[];
const decode=s=>String(s||"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&gt;/g,">").replace(/&lt;/g,"<");
const text=h=>decode(String(h||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const routeOf=(base,file)=>{const rel=path.relative(base,file).replaceAll("\\","/");return rel==="index.html"?"/":rel==="404.html"?"/404.html":`/${rel.replace(/index\.html$/,"")}`};
const linksIn=html=>[...html.matchAll(/<a[^>]+href="(\/[^"#?]*(?:#[^"?]*)?)"/gi)].map(m=>m[1]);
const routePart=href=>href.split(/[?#]/)[0];
const section=(html,start,end)=>html.match(new RegExp(`${start}([\\s\\S]*?)${end}`,"i"))?.[1]||"";
const setEqual=(actual,expected)=>actual.size===expected.size&&[...expected].every(x=>actual.has(x));
const typeSet=graph=>new Set(graph.flatMap(x=>Array.isArray(x["@type"])?x["@type"]:[x["@type"]]).filter(Boolean));
const forbiddenKeys=new Set(["address","telephone","openingHours","aggregateRating","review","geo","priceRange"]);
const scanForbidden=(value,pathName="schema")=>{if(Array.isArray(value)){value.forEach((x,i)=>scanForbidden(x,`${pathName}[${i}]`));return}if(!value||typeof value!=="object")return;for(const [key,child] of Object.entries(value)){if(forbiddenKeys.has(key))failures.push(`${pathName}: unsupported pre-launch schema key ${key}`);scanForbidden(child,`${pathName}.${key}`)}};

for(const slug of slugs){
  const projectRoot=path.join(root,"projects",slug),base=path.join(projectRoot,"dist"),config=JSON.parse(fs.readFileSync(path.join(projectRoot,"site.config.json"),"utf8"));
  const mod=await import(`../projects/${slug}/scripts/site-data.mjs?launch-audit=${Date.now()}-${slug}`);
  const services=mod.services||mod.project.services,areas=mod.areas;
  const serviceRoutes=new Set(services.map(x=>`/services/${x.slug}/`)),areaRoutes=new Set(areas.map(x=>`/service-areas/${x.slug}/`));
  const serviceByRoute=new Map(services.map(x=>[`/services/${x.slug}/`,x])),areaByRoute=new Map(areas.map(x=>[`/service-areas/${x.slug}/`,x]));
  const files=walk(base).filter(f=>f.endsWith(".html")),pages=new Map(),canonicals=new Map();
  let schemaPages=0,internalLinks=0,relationshipChecks=0;
  for(const file of files){
    const html=fs.readFileSync(file,"utf8"),route=routeOf(base,file),expectedUrl=`${config.baseUrl.replace(/\/$/,"")}${route}`;
    const title=text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||""),description=decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]||""),canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||"";
    const ogTitle=decode(html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1]||""),ogDescription=decode(html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1]||""),ogUrl=html.match(/<meta property="og:url" content="([^"]+)"/i)?.[1]||"";
    const hrefs=linksIn(html); internalLinks+=hrefs.length;
    pages.set(route,{html,title,hrefs});
    if(route!=="/404.html"){
      if(canonical!==expectedUrl)failures.push(`${slug}${route}: canonical ${canonical} should be ${expectedUrl}`);
      if(ogTitle!==title||ogDescription!==description||ogUrl!==canonical)failures.push(`${slug}${route}: Open Graph metadata does not match title, description, and canonical`);
      if(canonicals.has(canonical))failures.push(`${slug}${route}: duplicate canonical also used by ${canonicals.get(canonical)}`);else canonicals.set(canonical,route);
      const schemaBlocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
      if(schemaBlocks.length!==1)failures.push(`${slug}${route}: expected one JSON-LD block, found ${schemaBlocks.length}`);
      for(const block of schemaBlocks){
        let data;try{data=JSON.parse(block[1])}catch(error){failures.push(`${slug}${route}: invalid JSON-LD (${error.message})`);continue}
        schemaPages++;if(data["@context"]!=="https://schema.org")failures.push(`${slug}${route}: wrong schema context`);
        const graph=data["@graph"]||[],types=typeSet(graph),website=graph.find(x=>x["@type"]==="WebSite"),webpage=graph.find(x=>x["@type"]==="WebPage");
        if(!types.has("WebSite")||!types.has("WebPage"))failures.push(`${slug}${route}: WebSite or WebPage schema missing`);
        if(types.has("LocalBusiness")||types.has("Plumber")||types.has("Service")||types.has("Organization"))failures.push(`${slug}${route}: premature operating-business/provider schema present`);
        if(website?.url!==`${config.baseUrl.replace(/\/$/,"")}/`||website?.["@id"]!==`${config.baseUrl.replace(/\/$/,"")}/#website`)failures.push(`${slug}${route}: WebSite URL/@id mismatch`);
        if(webpage?.url!==canonical||webpage?.name!==title||webpage?.description!==description||webpage?.isPartOf?.["@id"]!==`${config.baseUrl.replace(/\/$/,"")}/#website`)failures.push(`${slug}${route}: WebPage schema does not match visible metadata`);
        const breadcrumb=graph.find(x=>x["@type"]==="BreadcrumbList");
        if(route!=="/"&&route!=="/404.html"){
          if(!breadcrumb)failures.push(`${slug}${route}: BreadcrumbList missing`);
          else{const items=breadcrumb.itemListElement||[];for(let i=0;i<items.length;i++){if(items[i].position!==i+1)failures.push(`${slug}${route}: breadcrumb positions are not sequential`);if(!String(items[i].name||"").trim())failures.push(`${slug}${route}: breadcrumb has an empty label`);const itemRoute=new URL(items[i].item).pathname;if(!pages.has(itemRoute)&&!fs.existsSync(itemRoute.endsWith("/")?path.join(base,itemRoute.slice(1),"index.html"):path.join(base,itemRoute.slice(1))))failures.push(`${slug}${route}: breadcrumb points to missing ${items[i].item}`)}if(items.at(-1)?.item!==canonical)failures.push(`${slug}${route}: final breadcrumb URL does not match canonical`)}
        }
        scanForbidden(data,`${slug}${route}`);
      }
      const robots=html.match(/<meta name="robots" content="([^"]+)"/i)?.[1]||"";
      const expectedRobots=config.indexingEnabled?"index, follow":"noindex, nofollow";if(robots!==expectedRobots)failures.push(`${slug}${route}: robots meta ${robots} should be ${expectedRobots}`);
    }
  }
  for(const [route,page] of pages)for(const href of page.hrefs){const target=routePart(href);if(!pages.has(target)&&!fs.existsSync(target.endsWith("/")?path.join(base,target.slice(1),"index.html"):path.join(base,target.slice(1))))failures.push(`${slug}${route}: broken internal link ${href}`)}

  for(const [route,service] of serviceByRoute){
    const html=pages.get(route)?.html||"";
    const relatedHtml=slug==="plumber-houston-pros"?section(html,'id="related-services-heading"','<section class="section areas-block"'):section(html,'id="related-title"','<section class="section" aria-labelledby="service-area-title"');
    const areasHtml=slug==="plumber-houston-pros"?section(html,'id="service-areas-heading"','<section class="section faq'):section(html,'id="service-area-title"','<section class="section faq');
    const actualRelated=new Set(linksIn(relatedHtml).map(routePart).filter(x=>serviceRoutes.has(x))),expectedRelated=new Set(service.related.map(x=>`/services/${x}/`));
    const actualAreas=new Set(linksIn(areasHtml).map(routePart).filter(x=>areaRoutes.has(x)));
    relationshipChecks+=2;
    if(!setEqual(actualRelated,expectedRelated))failures.push(`${slug}${route}: Related Services links do not match configured related services`);
    if(!setEqual(actualAreas,areaRoutes))failures.push(`${slug}${route}: Service Areas links do not match all configured areas`);
  }
  for(const [route,area] of areaByRoute){
    const html=pages.get(route)?.html||"";
    const servicesHtml=slug==="plumber-houston-pros"?section(html,'id="area-services-heading"','<section class="section nearby"'):section(html,'id="area-service-title"','<section class="section nearby"');
    const nearbyHtml=section(html,'<section class="section nearby"','<section class="section faq');
    const actualServices=new Set(linksIn(servicesHtml).map(routePart).filter(x=>serviceRoutes.has(x)));
    const actualNearby=new Set(linksIn(nearbyHtml).map(routePart).filter(x=>areaRoutes.has(x))),expectedNearby=new Set(areas.filter(x=>x.region===area.region&&x.slug!==area.slug).map(x=>`/service-areas/${x.slug}/`));
    relationshipChecks+=2;
    if(!setEqual(actualServices,serviceRoutes))failures.push(`${slug}${route}: area service links do not match all configured services`);
    if(!setEqual(actualNearby,expectedNearby))failures.push(`${slug}${route}: nearby-area links do not match the configured region`);
  }
  const expectedIndexable=new Set([...pages.keys()].filter(x=>x!=="/404.html")),sitemap=fs.readFileSync(path.join(base,"sitemap.xml"),"utf8"),sitemapRoutes=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname));
  if(!setEqual(sitemapRoutes,expectedIndexable))failures.push(`${slug}: sitemap routes do not exactly match generated non-404 pages`);
  const robotsTxt=fs.readFileSync(path.join(base,"robots.txt"),"utf8");
  if(config.indexingEnabled&&!robotsTxt.includes(`Sitemap: ${config.baseUrl.replace(/\/$/,"")}/sitemap.xml`))failures.push(`${slug}: production robots.txt lacks sitemap declaration`);
  if(!config.indexingEnabled&&!/Disallow:\s*\//.test(robotsTxt))failures.push(`${slug}: pre-launch robots.txt is not blocking crawling`);
  const reached=new Set(["/"]),queue=["/"];while(queue.length){const from=queue.shift();for(const href of pages.get(from)?.hrefs||[]){const target=routePart(href);if(pages.has(target)&&target!=="/404.html"&&!reached.has(target)){reached.add(target);queue.push(target)}}}
  for(const route of expectedIndexable)if(!reached.has(route))failures.push(`${slug}${route}: orphaned from homepage crawl graph`);
  summaries.push({slug,pages:expectedIndexable.size,schemaPages,internalLinks,relationshipChecks,orphans:[...expectedIndexable].filter(x=>!reached.has(x)).length,baseUrl:config.baseUrl,indexingEnabled:config.indexingEnabled});
}

const report=["# Houston Plumbing Technical SEO and Link-Intent Audit","",`Generated: ${new Date().toISOString()}`,"",`- Sites audited: ${summaries.length}`,`- Non-404 pages audited: ${summaries.reduce((n,x)=>n+x.pages,0)}`,`- Pages with validated JSON-LD: ${summaries.reduce((n,x)=>n+x.schemaPages,0)}`,`- Internal links checked: ${summaries.reduce((n,x)=>n+x.internalLinks,0).toLocaleString()}`,`- Service/area relationship sets checked: ${summaries.reduce((n,x)=>n+x.relationshipChecks,0)}`,`- Orphan pages: ${summaries.reduce((n,x)=>n+x.orphans,0)}`,`- Failures: ${failures.length}`,`- Result: ${failures.length?"FAIL":"PASS"}`,"","## Site status","","| Site | Pages | JSON-LD pages | Internal links | Relationship checks | Orphans | Indexing | Base URL |","| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |",...summaries.map(x=>`| ${x.slug} | ${x.pages} | ${x.schemaPages} | ${x.internalLinks.toLocaleString()} | ${x.relationshipChecks} | ${x.orphans} | ${x.indexingEnabled?"enabled":"blocked"} | ${x.baseUrl} |`),"","## Launch interpretation","","The schema is truthful for a pre-launch rank-and-rent property: WebSite, WebPage, and BreadcrumbList are used; operating-business, provider, phone, address, review, and rating claims are omitted. Service/provider or LocalBusiness schema should be added only after a real operator and public facts are verified.","","All builds remain intentionally non-indexable and use placeholder `.invalid` domains. Replace each base URL, verify the operator and lead destination, then enable indexing and rebuild before deployment.",""];
fs.writeFileSync(path.join(root,"projects","HOUSTON-PLUMBING-TECHNICAL-SEO-AUDIT.md"),report.join("\n"),"utf8");
if(failures.length){console.error(failures.map(x=>`- ${x}`).join("\n"));process.exit(1)}
console.log(`PASS: ${summaries.reduce((n,x)=>n+x.pages,0)} pages, ${summaries.reduce((n,x)=>n+x.internalLinks,0)} links, ${summaries.reduce((n,x)=>n+x.relationshipChecks,0)} relationship sets, zero orphans.`);
