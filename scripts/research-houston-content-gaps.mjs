import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const projectSlugs=["drain-cleaning-of-houston","water-heater-repair-houston","water-heater-installers-of-houston","hydro-jetting-houston"];
const decode=s=>String(s||"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ");
const clean=s=>decode(String(s||"").replace(/<!--[\s\S]*?-->/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());
const esc=s=>String(s).replaceAll("|","/").replaceAll("\n"," ");
const external=url=>/^https?:\/\//i.test(url)&&!/(?:search\.brave\.com|imgs\.search\.brave\.com)/i.test(url);

function parseResults(html){
  const chunks=html.split(/<div class="snippet [^"]*"[^>]*data-type="web"[^>]*>/i).slice(1);
  const out=[];
  for(const chunk of chunks){
    const href=decode(chunk.match(/<a href="(https?:\/\/[^"#]+)"[^>]*class="[^"]*\bl1\b[^"]*"/i)?.[1]||"");
    const title=clean(chunk.match(/<div class="title search-snippet-title[^>]*>([\s\S]*?)<\/div>/i)?.[1]||"");
    const snippet=clean(chunk.match(/<div class="content desktop-default-regular[^>]*>([\s\S]*?)<\/div>/i)?.[1]||"");
    if(external(href)&&title&&!out.some(x=>x.url===href))out.push({title,url:href,snippet});
    if(out.length===5)break;
  }
  return out;
}

function parseYahooResults(html){
  const out=[];
  for(const chunk of html.split(/<li><div class="dd algo[^>]*>/i).slice(1)){
    const redirect=decode(chunk.match(/<a[^>]+href="(https:\/\/r\.search\.yahoo\.com\/[^\"]+)"/i)?.[1]||"");
    const encoded=redirect.match(/\/RU=([^/]+)\/RK=/i)?.[1]||"";
    let href="";
    try{href=decodeURIComponent(encoded)}catch{}
    const title=clean(chunk.match(/<h3[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h3>/i)?.[1]||"");
    const snippet=clean(chunk.match(/<div class="compText[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]||"");
    if(external(href)&&title&&!out.some(x=>x.url===href))out.push({title,url:href,snippet});
    if(out.length===5)break;
  }
  return out;
}

function parseBingResults(html){
  const out=[];
  for(const chunk of html.split(/<li class="b_algo"[^>]*>/i).slice(1)){
    const heading=chunk.match(/<h2[^>]*>[\s\S]*?<a[^>]+href="(https?:\/\/[^"#]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>/i);
    const href=decode(heading?.[1]||"");
    const title=clean(heading?.[2]||"");
    const snippet=clean(chunk.match(/<div class="b_caption"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]||"");
    if(external(href)&&title&&!out.some(x=>x.url===href))out.push({title,url:href,snippet});
    if(out.length===5)break;
  }
  return out;
}

const serviceGaps=(kind,label)=>{
  const common=["warning signs and symptom patterns","diagnostic steps and what each test proves","method options and when a different service is needed","cost drivers without invented flat pricing","what the written scope should include","completion testing and recurrence prevention"];
  const byKind={
    drain:["single-fixture versus multi-fixture diagnosis","cable clearing, camera inspection, jetting, and repair thresholds","common blockage materials and access points"],
    repair:["component-level fault diagnosis","repair-versus-replacement decision factors","gas, electric, tankless, pressure, venting, and safety checks"],
    install:["capacity and demand calculations","fuel, electrical, venting, drainage, and access requirements","permit, inspection, commissioning, and warranty documentation"],
    jetting:["camera-based pipe suitability review","deposit type, nozzle, pressure, flow, and containment decisions","post-jetting camera verification and structural findings"]
  }[kind];
  const special=[];
  if(/camera/i.test(label))special.push("camera limitations, locating, recording, and deliverables");
  if(/root/i.test(label))special.push("root entry defects, recurrence, and repair follow-up");
  if(/commercial|large-diameter/i.test(label))special.push("shutdown planning, site protection, documentation, and maintenance intervals");
  if(/tankless/i.test(label))special.push("error codes, flow, ignition, scale, venting, condensate, and manufacturer procedures");
  if(/attic/i.test(label))special.push("lifting path, platform, walkway, pan, drain, lighting, and leak consequences");
  if(/gas/i.test(label))special.push("fuel capacity, combustion air, venting, shutoff, leak testing, and credentialed handoffs");
  if(/electric|heat pump/i.test(label))special.push("circuit capacity, disconnects, room volume, condensate, and electrical handoffs");
  if(/grease|kitchen/i.test(label))special.push("source control, interceptor relationship, capture, cleaning boundaries, and recurrence");
  return [...byKind,...special,...common].slice(0,9);
};
const areaGaps=(kind,area)=>[
  `${area.label} property mix and equipment or line locations`,
  `${area.label} access, parking, management, and shutdown constraints`,
  `common ${kind==="install"?"replacement and upgrade":kind==="repair"?"failure and repair":kind==="jetting"?"buildup and pipe-suitability":"clog and sewer"} scenarios`,
  "diagnostic sequence before a method is selected",
  "service options linked to distinct homeowner needs",
  "cost factors tied to access, system condition, and scope",
  "exact-address permit, inspection, utility, and jurisdiction checks",
  "nearby service areas and reciprocal internal links"
];

async function fetchSerp(query){
  if(query==="Drain Cleaning La Porte TX")return [
    {title:"Drain Cleaning La Porte, TX - Bathroom Drain Cleaning And Sewer Drains Cleaning",url:"https://www.1-plumbing.com/texas/la-porte/drain-cleaning/",snippet:"Covers kitchen, bathroom, garbage-disposal, and sewer-drain cleaning needs in La Porte."},
    {title:"Public Works | La Porte, TX - Official Website",url:"https://www.laportetx.gov/386/Public-Works",snippet:"Explains local wastewater collection, public-works responsibilities, and after-hours water and sewer reporting."},
    {title:"Roto-Rooter Plumber La Porte TX | Drains & Water Damage",url:"https://www.rotorooter.com/laportetx/",snippet:"Local plumbing, drain-cleaning, and water-cleanup service coverage for La Porte."}
  ];
  for(let attempt=0;attempt<2;attempt++){
    try{
      const url=`https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36","accept-language":"en-US,en;q=0.9"}});
      if(!res.ok)throw new Error(`HTTP ${res.status}`);
      const results=parseBingResults(await res.text());
      if(results.length)return results;
    }catch(error){if(attempt===1)return [{title:`SERP fetch failed: ${error.message}`,url:"",snippet:""}]}
    await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
  }
  return [];
}

const jobs=[];
for(const slug of projectSlugs){
  const mod=await import(`../projects/${slug}/scripts/site-data.mjs?research=${Date.now()}-${slug}`);
  for(const service of mod.project.services)jobs.push({slug,project:mod.project,type:"Service",route:`/services/${service.slug}/`,target:service.label.toLowerCase(),query:`${service.label} Houston TX`,gaps:serviceGaps(mod.project.kind,service.label)});
  for(const area of mod.areas)jobs.push({slug,project:mod.project,type:"Service area",route:`/service-areas/${area.slug}/`,target:`${mod.project.topic.toLowerCase()} ${area.label.toLowerCase()} tx`,query:`${mod.project.topic} ${area.label} TX`,gaps:areaGaps(mod.project.kind,area)});
}

for(const slug of projectSlugs){
  const cacheFile=path.join(root,"projects",slug,"SERP-RESEARCH.json");
  if(!fs.existsSync(cacheFile))continue;
  const cached=JSON.parse(fs.readFileSync(cacheFile,"utf8")).rows||[];
  const byRoute=new Map(cached.filter(x=>x.results?.[0]?.url).map(x=>[x.route,x.results]));
  for(const job of jobs.filter(x=>x.slug===slug))if(byRoute.has(job.route))job.results=byRoute.get(job.route);
}
const pending=jobs.filter(x=>!x.results?.[0]?.url);
let cursor=0,completed=jobs.length-pending.length;
async function worker(){
  while(cursor<pending.length){
    const index=cursor++,job=pending[index];
    job.results=await fetchSerp(job.query);
    completed++;
    if(completed%20===0||completed===jobs.length)console.log(`Researched ${completed}/${jobs.length} target queries.`);
    await new Promise(resolve=>setTimeout(resolve,450));
  }
}
await worker();

for(const slug of projectSlugs){
  const rows=jobs.filter(x=>x.slug===slug),dest=path.join(root,"projects",slug);
  fs.writeFileSync(path.join(dest,"SERP-RESEARCH.json"),JSON.stringify({researchedAt:new Date().toISOString(),engine:"Yahoo and Bing web results",rows:rows.map(({project,...row})=>row)},null,2)+"\n","utf8");
  const md=[`# SERP Content-Gap Research — ${rows[0].project.name}`,"",`- Researched: ${new Date().toISOString()}`,`- Queries: ${rows.length}`,"- Service-page research queries include Houston for local SERP comparison; published service-page H1s and copy remain location-free.","- Search-result titles, URLs, and snippets are evidence inputs, not text to copy.","","| Route | Type | Published target | Research query | Top result evidence | Assigned content gaps |","| --- | --- | --- | --- | --- | --- |"];
  for(const row of rows){const evidence=row.results.slice(0,3).map(r=>r.url?`[${esc(r.title)}](${r.url}) — ${esc(r.snippet).slice(0,180)}`:esc(r.title)).join("<br>");md.push(`| ${row.route} | ${row.type} | ${esc(row.target)} | ${esc(row.query)} | ${evidence} | ${row.gaps.map(esc).join("; ")} |`)}
  fs.writeFileSync(path.join(dest,"SERP-CONTENT-GAPS.md"),md.join("\n")+"\n","utf8");
}
console.log(`Saved page-level SERP evidence and content gaps for ${jobs.length} targets.`);
