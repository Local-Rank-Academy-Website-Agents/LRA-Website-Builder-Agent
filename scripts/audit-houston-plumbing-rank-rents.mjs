import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const slugs=["plumber-houston-pros","drain-cleaning-of-houston","water-heater-repair-houston","water-heater-installers-of-houston","hydro-jetting-houston"];
const failures=[];
const records=[];
const summaries=[];
const decode=s=>String(s||"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&gt;/g,">").replace(/&lt;/g,"<");
const text=h=>decode(String(h||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());
const norm=s=>text(s).toLowerCase().replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
const wordCount=h=>text(h).split(/\s+/).filter(Boolean).length;
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const routeOf=(base,file)=>{const rel=path.relative(base,file).replaceAll("\\","/");return rel==="index.html"?"/":rel==="404.html"?"/404.html":`/${rel.replace(/index\.html$/,"")}`};
const targetFile=(base,ref)=>{const clean=decodeURIComponent(ref.split(/[?#]/)[0]);return clean.endsWith("/")?path.join(base,clean.slice(1),"index.html"):path.join(base,clean.slice(1))};
const shingles=s=>{const words=norm(s).split(" ").filter(Boolean),set=new Set();for(let i=0;i<=words.length-5;i++)set.add(words.slice(i,i+5).join(" "));return set};
const similarity=(a,b)=>{let intersection=0;for(const value of a)if(b.has(value))intersection++;const union=a.size+b.size-intersection;return union?intersection/union:0};

for(const slug of slugs){
  const base=path.join(root,"projects",slug,"site");
  const siteRecords=[];
  let linkChecks=0;
  for(const file of walk(base).filter(f=>f.endsWith(".html"))){
    const html=fs.readFileSync(file,"utf8"),route=routeOf(base,file),substantive=/^\/(?:services|service-areas)\/[^/]+\/$/.test(route);
    const mainHtml=html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1]||"";
    const uniqueHtml=html.match(/<div data-unique-copy>([\s\S]*?)<\/div>\s*<section class="section (?:related|nearby|areas-block)/i)?.[1]||"";
    const faqHtml=html.match(/<section class="section faq[^>]*>([\s\S]*?)<\/section>/i)?.[1]||"";
    const title=text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||"");
    const h1=text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||"");
    if(title!==h1)failures.push(`${slug}${route}: title and H1 differ`);
    for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)){
      const ref=match[1];
      if(!ref.startsWith("/"))continue;
      linkChecks++;
      const target=targetFile(base,ref);
      if(!fs.existsSync(target))failures.push(`${slug}${route}: broken internal reference ${ref}`);
      const fragment=ref.includes("#")?ref.split("#")[1]:"";
      if(fragment&&fs.existsSync(target)&&target.endsWith(".html")){
        const targetHtml=fs.readFileSync(target,"utf8");
        if(!new RegExp(`\\bid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}["']`).test(targetHtml))failures.push(`${slug}${route}: missing fragment target ${ref}`);
      }
    }
    if(substantive){
      const words=wordCount(mainHtml);
      if(words<500||words>1000)failures.push(`${slug}${route}: ${words} visible words, outside 500-1,000`);
      if(!faqHtml)failures.push(`${slug}${route}: missing FAQ section`);
      const comparisonText=`${text(uniqueHtml)} ${text(faqHtml)}`.trim();
      records.push({slug,route,words,uniqueHtml,faqHtml,comparisonText});
      siteRecords.push(records.at(-1));
    }
  }
  const wordCounts=siteRecords.map(x=>x.words);
  summaries.push({slug,pages:siteRecords.length,min:Math.min(...wordCounts),max:Math.max(...wordCounts),linkChecks});
}

const paragraphs=new Map(),questions=new Map(),answers=new Map();
for(const record of records){
  for(const paragraph of [...(`${record.uniqueHtml}${record.faqHtml}`).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>norm(m[1])).filter(p=>p.split(" ").length>=12)){
    const prior=paragraphs.get(paragraph);if(prior)failures.push(`Exact duplicate paragraph: ${record.slug}${record.route} and ${prior}`);else paragraphs.set(paragraph,`${record.slug}${record.route}`);
  }
  for(const question of [...record.faqHtml.matchAll(/<summary>([\s\S]*?)<span>/gi)].map(m=>norm(m[1]))){
    const prior=questions.get(question);if(prior)failures.push(`Exact duplicate FAQ question: ${record.slug}${record.route} and ${prior}`);else questions.set(question,`${record.slug}${record.route}`);
  }
  for(const answer of [...record.faqHtml.matchAll(/<details>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi)].map(m=>norm(m[1]))){
    const prior=answers.get(answer);if(prior)failures.push(`Exact duplicate FAQ answer: ${record.slug}${record.route} and ${prior}`);else answers.set(answer,`${record.slug}${record.route}`);
  }
}

let closest={score:0,a:"",b:""};
const sets=records.map(x=>shingles(x.comparisonText));
for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const score=similarity(sets[i],sets[j]);
  if(score>closest.score)closest={score,a:`${records[i].slug}${records[i].route}`,b:`${records[j].slug}${records[j].route}`};
  if(score>.65)failures.push(`Similarity ${(score*100).toFixed(1)}% exceeds 65%: ${records[i].slug}${records[i].route} and ${records[j].slug}${records[j].route}`);
}

const totalLinks=summaries.reduce((n,x)=>n+x.linkChecks,0);
const report=["# Houston Plumbing Rank-and-Rent Quality Audit","",`Generated: ${new Date().toISOString()}`,"",`- Sites: ${slugs.length}`,`- Service and service-area pages audited: ${records.length}`,`- Pages within 500-1,000 visible words: ${records.filter(x=>x.words>=500&&x.words<=1000).length}/${records.length}`,`- Internal href/src references checked: ${totalLinks.toLocaleString()}`,`- Broken internal references: ${failures.filter(x=>x.includes("broken internal")||x.includes("missing fragment")).length}`,`- Exact duplicate substantive paragraphs: ${failures.filter(x=>x.startsWith("Exact duplicate paragraph")).length}`,`- Exact duplicate FAQ questions: ${failures.filter(x=>x.startsWith("Exact duplicate FAQ question")).length}`,`- Exact duplicate FAQ answers: ${failures.filter(x=>x.startsWith("Exact duplicate FAQ answer")).length}`,`- Highest five-word-shingle similarity: ${(closest.score*100).toFixed(1)}%`,`- Closest pair: ${closest.a} and ${closest.b}`,"- Similarity failure threshold: 65.0%",`- Result: ${failures.length?"FAIL":"PASS"}`,"","## Per-site word and link audit","","| Site | Substantive pages | Minimum words | Maximum words | Internal references checked |","| --- | ---: | ---: | ---: | ---: |",...summaries.map(x=>`| ${x.slug} | ${x.pages} | ${x.min} | ${x.max} | ${x.linkChecks.toLocaleString()} |`),"","Shared navigation labels, footer directories, and interface controls are excluded from duplicate-body comparisons. All visible main-page text is included in the 500-1,000-word count.",""];
fs.writeFileSync(path.join(root,"projects","HOUSTON-PLUMBING-RANK-RENT-AUDIT.md"),report.join("\n"),"utf8");
if(failures.length){console.error(failures.map(x=>`- ${x}`).join("\n"));process.exit(1)}
console.log(`PASS: ${records.length} substantive pages, ${totalLinks} internal references, maximum similarity ${(closest.score*100).toFixed(1)}%.`);
