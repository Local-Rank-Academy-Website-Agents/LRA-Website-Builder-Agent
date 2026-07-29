import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

function parseArgs(argv) {
  const result = { launch: null, answers: null, outputRoot: "projects" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--answers") result.answers = argv[++i];
    else if (arg === "--launch") result.launch = argv[++i];
    else if (arg === "--output-root") result.outputRoot = argv[++i];
    else if (arg === "--help") result.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return result;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function splitList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function required(value, label) {
  if (!String(value || "").trim()) throw new Error(`${label} is required.`);
  return String(value).trim();
}

async function collectInteractive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (question, fallback = "") => {
    const suffix = fallback ? ` [${fallback}]` : "";
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || fallback;
  };
  const choose = async (question, options, defaultIndex = 0) => {
    console.log(`\n${question}`);
    options.forEach((option, index) => console.log(`  ${index + 1}. ${option.label}`));
    const raw = await ask("Choose a number", String(defaultIndex + 1));
    const selected = Number.parseInt(raw, 10) - 1;
    if (!options[selected]) throw new Error(`Invalid choice for "${question}".`);
    return options[selected].value;
  };

  console.log("\nLRA Website Builder Intake\n");
  const data = {};
  data.businessName = await ask("Business or website name");
  data.operatorStatus = await choose("What kind of project is this?", [
    { label: "Operating business", value: "operating-business" },
    { label: "Authorized tenant/operator", value: "authorized-operator" },
    { label: "Rank-and-rent site waiting for an operator", value: "awaiting-operator" },
  ]);
  data.mainService = await ask("Main service");
  data.city = await ask("Primary city");
  data.region = await ask("State or region");
  data.serviceAreas = splitList(await ask("Other genuinely served cities/areas, comma-separated", ""));
  data.phoneStatus = await choose("Phone number status", [
    { label: "Active business number", value: "active" },
    { label: "Plan to rent or activate later", value: "future" },
    { label: "No phone; use forms", value: "none" },
  ]);
  data.phone = data.phoneStatus === "active" ? await ask("Active phone number") : "";
  data.addressStatus = await choose("Address status", [
    { label: "Current staffed location open to customers", value: "storefront" },
    { label: "Current service-area base; keep it hidden", value: "service-area-private" },
    { label: "Plan to rent or open an address later", value: "future" },
    { label: "Virtual office, mailbox, or coworking address", value: "virtual" },
    { label: "No address", value: "none" },
  ]);
  data.address =
    data.addressStatus === "storefront"
      ? await ask("Complete verified customer-facing address")
      : "";
  data.addressNotes =
    data.addressStatus === "future" || data.addressStatus === "virtual"
      ? await ask("Private planning note about the future/virtual address", "")
      : "";
  data.gbpStatus = await choose("Google Business Profile status", [
    { label: "Verified and live", value: "verified" },
    { label: "Created but pending", value: "pending" },
    { label: "Planned later", value: "planned" },
    { label: "None", value: "none" },
    { label: "Not eligible / lead-generation property", value: "not-eligible" },
    { label: "Unsure", value: "unsure" },
  ]);
  data.gbpUrl =
    data.gbpStatus === "verified" || data.gbpStatus === "pending"
      ? await ask("Google Business Profile or Maps URL", "")
      : "";
  data.emailOrFormDestination = await ask("Lead email, CRM, webhook, or 'configure later'", "configure later");
  data.secondaryServices = splitList(await ask("Secondary services, comma-separated", ""));
  data.referenceSites = splitList(await ask("Reference website URLs, comma-separated", ""));
  data.assetPaths = splitList(await ask("Logo, photo, or screenshot paths, comma-separated", ""));
  data.brandNotes = await ask("Brand colors, style, and design notes", "");
  data.domain = await ask("Domain or 'not purchased'", "not purchased");
  data.host = await ask("Preferred host", "portable static upload");
  data.mode = await choose("Build mode", [
    { label: "Autopilot: plan and build without stopping", value: "autopilot" },
    { label: "Approve sitemap and visual direction first", value: "approval" },
  ]);
  data.launch = await choose("What should happen after intake?", [
    { label: "Launch Codex builder now", value: "codex" },
    { label: "Launch Claude Code builder now", value: "claude" },
    { label: "Create the brief only", value: "none" },
  ]);
  rl.close();
  return data;
}

function normalize(raw) {
  const businessName = required(raw.businessName, "Business name");
  const mainService = required(raw.mainService, "Main service");
  const city = required(raw.city, "Primary city");
  const region = required(raw.region, "State or region");
  const operatorStatus = raw.operatorStatus || "awaiting-operator";
  let gbpStatus = raw.gbpStatus || "none";
  if (operatorStatus === "awaiting-operator") gbpStatus = "not-eligible";

  const data = {
    projectSlug: slugify(raw.projectSlug || businessName),
    businessName,
    operatorStatus,
    mainService,
    secondaryServices: splitList(raw.secondaryServices),
    city,
    region,
    serviceAreas: splitList(raw.serviceAreas),
    phoneStatus: raw.phoneStatus || "none",
    phone: String(raw.phone || "").trim(),
    addressStatus: raw.addressStatus || "none",
    address: String(raw.address || "").trim(),
    addressNotes: String(raw.addressNotes || "").trim(),
    gbpStatus,
    gbpUrl: String(raw.gbpUrl || "").trim(),
    emailOrFormDestination: String(raw.emailOrFormDestination || "configure later").trim(),
    referenceSites: splitList(raw.referenceSites),
    assetPaths: splitList(raw.assetPaths),
    brandNotes: String(raw.brandNotes || "").trim(),
    domain: String(raw.domain || "not purchased").trim(),
    host: String(raw.host || "portable static upload").trim(),
    mode: raw.mode === "approval" ? "approval" : "autopilot",
  };

  if (!data.projectSlug) throw new Error("Could not create a valid project slug.");
  if (data.phoneStatus === "active" && !data.phone) {
    throw new Error("An active phone number is required when phoneStatus is active.");
  }
  if (data.addressStatus === "storefront" && !data.address) {
    throw new Error("A verified address is required when addressStatus is storefront.");
  }
  return data;
}

function listOrNone(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None supplied";
}

function makeBrief(data) {
  return `# Project Brief

## Identity

- Business/site name: ${data.businessName}
- Operating status: ${data.operatorStatus}
- Primary service: ${data.mainService}
- Primary market: ${data.city}, ${data.region}
- Build mode: ${data.mode}

## Services and coverage

Secondary services:
${listOrNone(data.secondaryServices)}

Additional service areas:
${listOrNone(data.serviceAreas)}

## Lead routing

- Phone status: ${data.phoneStatus}
- Active phone: ${data.phone || "Not active; do not publish"}
- Form destination: ${data.emailOrFormDestination}

## Address and Google Business Profile

- Address status: ${data.addressStatus}
- Publishable storefront address: ${data.address || "None"}
- Private planning note: ${data.addressNotes || "None"}
- Google Business Profile status: ${data.gbpStatus}
- Profile URL: ${data.gbpUrl || "None"}

Future or virtual addresses are not publishable and must not appear in LocalBusiness schema.

## Brand and references

- Brand notes: ${data.brandNotes || "Open direction"}
- Domain: ${data.domain}
- Preferred host: ${data.host}

Reference websites:
${listOrNone(data.referenceSites)}

Asset and screenshot paths:
${listOrNone(data.assetPaths)}
`;
}

function makeBlockers(data) {
  const blockers = [];
  if (data.phoneStatus !== "active") {
    blockers.push("- [ ] Activate and verify a business phone number, then update site config, phone links, visible contact content, and eligible schema.");
  }
  if (data.addressStatus === "future" || data.addressStatus === "virtual" || data.addressStatus === "none") {
    blockers.push("- [ ] Verify an eligible real-world address before publishing any street address or LocalBusiness address schema.");
  }
  if (!["verified", "not-eligible"].includes(data.gbpStatus)) {
    blockers.push("- [ ] Resolve Google Business Profile eligibility/status and add the verified profile URL only after it is live.");
  }
  if (data.domain === "not purchased") {
    blockers.push("- [ ] Purchase and connect the production domain; update canonical, sitemap, robots, and social URLs.");
  }
  if (data.emailOrFormDestination === "configure later") {
    blockers.push("- [ ] Connect and test the production form destination.");
  }
  if (!blockers.length) blockers.push("- [x] No launch blockers recorded during intake.");
  return `# Launch Blockers

${blockers.join("\n")}

After activating a value, rebuild the site and re-run schema, link, form, and live-domain checks.
`;
}

function schemaMode(data) {
  if (data.operatorStatus === "awaiting-operator") return "organization-and-service-only";
  if (data.addressStatus === "storefront") return "local-business-with-verified-address";
  return "organization-service-and-area-served";
}

function starterBaseUrl(domain) {
  const value = String(domain || "").trim();
  if (!value || value === "not purchased") return "https://example.com";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function seedStarter(projectDir, data) {
  const source = path.join(repoRoot, ".agents", "skills", "build-website", "assets", "site-starter");
  const destination = path.join(projectDir, "site");
  fs.cpSync(source, destination, { recursive: true });
  const replacements = new Map([
    ["{{BUSINESS_NAME}}", data.businessName],
    ["{{PRIMARY_SERVICE}}", data.mainService],
    ["{{CITY_STATE}}", `${data.city}, ${data.region}`],
  ]);
  const editableExtensions = new Set([".html", ".css", ".js", ".json", ".md", ".txt", ".xml"]);
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (editableExtensions.has(path.extname(entry.name))) {
        let content = fs.readFileSync(absolute, "utf8");
        for (const [token, replacement] of replacements) content = content.replaceAll(token, replacement);
        fs.writeFileSync(absolute, content, "utf8");
      }
    }
  };
  walk(destination);
  const starterConfigPath = path.join(destination, "site.config.json");
  const starterConfig = JSON.parse(fs.readFileSync(starterConfigPath, "utf8"));
  starterConfig.baseUrl = starterBaseUrl(data.domain);
  fs.writeFileSync(starterConfigPath, `${JSON.stringify(starterConfig, null, 2)}\n`, "utf8");
}

function writeProject(data, outputRoot) {
  const projectDir = path.resolve(repoRoot, outputRoot, data.projectSlug);
  if (fs.existsSync(projectDir)) {
    throw new Error(`Project already exists: ${projectDir}`);
  }
  fs.mkdirSync(projectDir, { recursive: true });
  const config = {
    business: {
      name: data.businessName,
      operatorStatus: data.operatorStatus,
      mainService: data.mainService,
      secondaryServices: data.secondaryServices,
      primaryMarket: { city: data.city, region: data.region },
      serviceAreas: data.serviceAreas,
      phone: { status: data.phoneStatus, value: data.phone, publish: data.phoneStatus === "active" },
      address: {
        status: data.addressStatus,
        value: data.address,
        publish: data.addressStatus === "storefront",
      },
      googleBusinessProfile: { status: data.gbpStatus, url: data.gbpUrl },
    },
    conversion: { formDestination: data.emailOrFormDestination },
    brand: { notes: data.brandNotes, assetPaths: data.assetPaths, referenceSites: data.referenceSites },
    delivery: { domain: data.domain, host: data.host, mode: data.mode },
    schema: { mode: schemaMode(data) },
  };
  const briefPath = path.join(projectDir, "PROJECT-BRIEF.md");
  fs.writeFileSync(briefPath, makeBrief(data), "utf8");
  fs.writeFileSync(path.join(projectDir, "site.config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(projectDir, "LAUNCH-BLOCKERS.md"), makeBlockers(data), "utf8");
  fs.writeFileSync(
    path.join(projectDir, "BUILD-REQUEST.md"),
    `# Build Request

Use $build-website with this project's PROJECT-BRIEF.md and site.config.json.

- Mode: ${data.mode}
- Build directory: projects/${data.projectSlug}/site
- Deployment: not included unless explicitly requested
`,
    "utf8",
  );
  seedStarter(projectDir, data);
  return { projectDir, briefPath };
}

function launchAgent(agent, briefPath) {
  if (!agent || agent === "none") return;
  const relativeBrief = path.relative(repoRoot, briefPath).replaceAll("\\", "/");
  const prompt =
    agent === "codex"
      ? `Use $build-website with ${relativeBrief}. Complete the workflow in the requested mode and do not deploy.`
      : `/build-website ${relativeBrief}`;
  const command = process.platform === "win32" ? `${agent}.cmd` : agent;
  const args =
    agent === "codex"
      ? ["exec", "-C", repoRoot, prompt]
      : ["-p", prompt, "--permission-mode", "acceptEdits"];
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${agent} exited with status ${result.status}.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  npm run build-website
  node .agents/skills/build-website/scripts/intake.mjs --answers answers.json [--launch codex|claude|none] [--output-root projects]`);
    return;
  }
  const raw = args.answers
    ? JSON.parse(fs.readFileSync(path.resolve(args.answers), "utf8"))
    : await collectInteractive();
  const data = normalize(raw);
  const output = writeProject(data, args.outputRoot);
  console.log(`\nCreated intake package: ${output.projectDir}`);
  const launch = args.launch || raw.launch || "none";
  if (launch === "none") {
    console.log(`Next step: use $build-website with ${path.relative(repoRoot, output.briefPath)}`);
  } else {
    launchAgent(launch, output.briefPath);
  }
}

main().catch((error) => {
  console.error(`\nBuild intake failed: ${error.message}`);
  process.exitCode = 1;
});
