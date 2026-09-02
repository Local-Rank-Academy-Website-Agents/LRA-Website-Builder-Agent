export { areas } from "./areas.mjs";

export const project = {
  slug: "toilet-repair-houston",
  name: "Toilet Repair Houston Pros",
  shortName: "TRH",
  topic: "Toilet Repair",
  topicLower: "toilet repair",
  requestLabel: "Request Toilet Service",
  homepageH1: "Houston Toilet Repair Services",
  lede: "Describe the toilet problem, compare the right repair or replacement scope, and route a detailed request for a qualified Greater Houston plumbing operator.",
  heroImage: "toilet-repair-houston.webp",
  heroImageAlt: "Plumbing technician inspecting a toilet connection in a bright Houston bathroom",
  heroWidth: 1672,
  heroHeight: 941,
  processTitle: "Toilet Repair and Replacement Process",
  processIntro: "A practical path from symptoms and shutoff checks to diagnosis, written scope, repair or replacement, testing, and cleanup.",
  palette: { ink: "#17282d", teal: "#176f70", aqua: "#72a7a1", orange: "#d06b3d", paper: "#fbf7ef", mist: "#e7efec" },
  services: [
    {
      slug: "toilet-repair", label: "Toilet Repair", group: "Core service", keyword: "toilet repair Houston", baseH1: "Toilet Repair in Houston, TX",
      intro: "diagnose and correct toilet problems involving the tank, bowl, base, shutoff, supply connection, or drain connection",
      situation: "a toilet runs, leaks, rocks, flushes weakly, refills slowly, makes unusual sounds, or stops operating as expected",
      system: "the tank and internal components, bowl, mounting hardware, wax or approved seal, flange, shutoff valve, supply connector, and drain connection",
      methods: "symptom review, water and movement checks, component inspection, targeted adjustment or replacement, seal or mounting work where indicated, and flush and leak testing",
      evidence: "the observed failure, included parts, fixture and connection limits, testing performed, exclusions, and whether additional drain or flange work requires approval",
      decision: "repair should match the confirmed failure; replacement may be more practical when the fixture is damaged, incompatible with available parts, or repeatedly failing",
      scope: "diagnosis and targeted repair of a residential or light-commercial toilet",
      costFactors: "failure type, parts, toilet design, fixture access, shutoff condition, flange or floor condition, drain symptoms, disposal, and any finish repair",
      related: ["running-toilet-repair", "toilet-leak-repair", "toilet-flange-repair", "toilet-replacement-installation"]
    },
    {
      slug: "running-toilet-repair", label: "Running Toilet Repair", group: "Tank and flush problems", keyword: "running toilet repair Houston", baseH1: "Running Toilet Repair in Houston, TX",
      intro: "identify why water continues cycling or flowing and repair the affected fill, flush, seal, or control components",
      situation: "the tank refills repeatedly, water moves into the bowl between flushes, the handle sticks, or the fixture will not stop filling",
      system: "the fill valve, flush valve, flapper or canister seal, chain or actuator, overflow tube, tank water level, handle, and accessible shutoff",
      methods: "dye or visual checks, water-level and component inspection, adjustment, compatible component replacement, and repeated-cycle verification",
      evidence: "the component causing the water loss, the replacement part or adjustment, shutoff condition, final water level, and post-repair cycle test",
      decision: "the work should correct the confirmed tank or control failure without assuming every running toilet needs a complete fixture replacement",
      scope: "repair of continuous or intermittent toilet tank cycling",
      costFactors: "toilet model, component availability, internal design, shutoff condition, access, corrosion, and whether multiple parts have failed",
      related: ["toilet-repair", "toilet-leak-repair", "toilet-replacement-installation", "commercial-toilet-repair"]
    },
    {
      slug: "toilet-leak-repair", label: "Toilet Leak Repair", group: "Leaks and seals", keyword: "toilet leak repair Houston", baseH1: "Toilet Leak Repair in Houston, TX",
      intro: "locate and repair water escaping from the tank, supply, shutoff, bowl connection, base, or internal flush path",
      situation: "water appears around the base, tank, supply line, shutoff, mounting bolts, or bowl, or unexplained tank water loss is suspected",
      system: "the tank-to-bowl connection, tank hardware, supply connector, shutoff valve, fixture body, base seal, flange, floor contact, and drain connection",
      methods: "dry-surface observation, component and connection checks, internal leak testing, controlled repair, seal or connector replacement where confirmed, and post-repair leak testing",
      evidence: "the leak source, affected connection or seal, visible floor or flange condition, included repair, drying and testing observations, and excluded water-damage work",
      decision: "water at the base can come from several sources, so the leak should be located before resetting the toilet or assuming the flange has failed",
      scope: "diagnosis and repair of active or intermittent toilet water leaks",
      costFactors: "leak location, fixture removal, seal and hardware, shutoff or supply condition, flange damage, floor condition, access, and water-damage boundaries",
      related: ["toilet-repair", "running-toilet-repair", "toilet-flange-repair", "toilet-replacement-installation"]
    },
    {
      slug: "toilet-flange-repair", label: "Toilet Flange Repair", group: "Base and drain connection", keyword: "toilet flange repair Houston", baseH1: "Toilet Flange Repair in Houston, TX",
      intro: "correct an accessible damaged, loose, low, high, corroded, or poorly supported toilet flange and restore a stable drain connection",
      situation: "the toilet rocks, the mounting bolts will not hold, the base leaks after a reset, or inspection confirms flange or surrounding support damage",
      system: "the fixture outlet, seal, closet flange, mounting hardware, drain connection, subfloor or slab interface, and finished floor height",
      methods: "fixture removal, flange and support inspection, compatible repair or replacement, approved anchoring, a new seal, resetting, and leak and stability testing",
      evidence: "the flange condition and elevation, repair method, anchoring, drain or floor limits, new seal, fixture reset, and completed leak and movement tests",
      decision: "the appropriate flange repair depends on material, condition, floor height, support, and drain connection; repair options are not interchangeable in every case",
      scope: "repair or replacement of the toilet flange and fixture mounting connection",
      costFactors: "fixture removal, flange material, slab or subfloor access, broken fasteners, drain condition, floor damage, repair method, resetting, and finish work",
      related: ["toilet-leak-repair", "toilet-repair", "toilet-replacement-installation", "commercial-toilet-repair"]
    },
    {
      slug: "toilet-replacement-installation", label: "Toilet Replacement and Installation", group: "Fixture installation", keyword: "toilet installation Houston", baseH1: "Toilet Installation and Replacement in Houston, TX",
      intro: "remove an existing toilet where applicable and install a compatible new fixture with a stable, sealed, and tested connection",
      situation: "the fixture is cracked, outdated, repeatedly failing, being remodeled, or the owner has selected a compatible replacement",
      system: "the new bowl and tank or one-piece fixture, rough-in, flange, seal, mounting hardware, shutoff, supply connector, seat, floor contact, and drain connection",
      methods: "compatibility and rough-in confirmation, controlled removal, flange and shutoff inspection, assembly and setting, secure mounting, supply connection, caulking as appropriate, and repeated flush testing",
      evidence: "the supplied fixture and accessories, rough-in fit, flange and shutoff condition, disposal responsibility, included connections, installation tests, and manufacturer documentation",
      decision: "fixture selection should account for rough-in, footprint, height, bowl shape, water connection, bathroom clearance, parts availability, and code rather than appearance alone",
      scope: "removal, replacement, and installation of a compatible toilet fixture",
      costFactors: "fixture type, one-piece or two-piece design, rough-in, flange and shutoff condition, access, stairs, removal, disposal, floor footprint, and repair discoveries",
      related: ["toilet-repair", "toilet-leak-repair", "toilet-flange-repair", "commercial-toilet-repair"]
    },
    {
      slug: "commercial-toilet-repair", label: "Commercial Toilet Repair", group: "Commercial properties", keyword: "commercial toilet repair Houston", baseH1: "Commercial Toilet Repair in Houston, TX",
      intro: "diagnose and repair toilets or flush-valve fixtures in offices, retail, restaurants, facilities, and other managed properties",
      situation: "a tank or flushometer toilet leaks, runs, will not flush correctly, is unstable, or creates recurring restroom downtime",
      system: "the fixture, flushometer or tank components, stop valve, vacuum breaker where present, handle or sensor, supply connection, flange, drain connection, partitions, and accessible controls",
      methods: "fixture identification, operational and leak checks, compatible rebuild or component replacement, adjustment, connection repair where indicated, and repeated activation testing",
      evidence: "fixture and valve model, failed component, included parts, shutdown impact, accessibility considerations, completed tests, and any follow-up replacement recommendation",
      decision: "commercial work should match the installed flush system, usage demand, parts compatibility, building shutdown rules, and restroom accessibility requirements",
      scope: "repair and replacement planning for commercial tank and flushometer toilets",
      costFactors: "fixture and valve type, sensor controls, parts availability, water shutdown, occupancy, work hours, access, multiple fixtures, flange condition, and replacement needs",
      related: ["toilet-repair", "running-toilet-repair", "toilet-leak-repair", "toilet-replacement-installation"]
    }
  ]
};
