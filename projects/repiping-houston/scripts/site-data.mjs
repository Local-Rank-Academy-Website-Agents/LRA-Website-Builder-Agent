export { areas } from "./areas.mjs";

export const project = {
  slug: "repiping-houston",
  name: "Repiping Houston Pros",
  shortName: "RHP",
  topic: "Repiping",
  topicLower: "repiping",
  requestLabel: "Request a Repipe Quote",
  homepageH1: "Repiping Services in the Greater Houston Area",
  lede: "Compare whole-house pipe replacement options, understand access and restoration boundaries, and prepare a detailed request for a qualified Greater Houston plumbing operator.",
  heroImage: "repiping-houston.webp",
  heroImageAlt: "Plumbing technician measuring organized red and blue PEX supply lines during a Houston home repipe",
  heroWidth: 1672,
  heroHeight: 909,
  processTitle: "Whole-Property Repiping Process",
  processIntro: "A practical path from recurring supply-pipe problems to material selection, route planning, installation, testing, inspection, and finish restoration.",
  palette: { ink: "#202a2d", teal: "#276d78", aqua: "#6f9d98", orange: "#b9653d", paper: "#f8f3eb", mist: "#e8ece7" },
  services: [
    {
      slug: "whole-house-repiping", label: "Whole House Repiping", group: "Complete repiping", keyword: "whole house repiping", baseH1: "Whole House Repiping in Houston, TX",
      intro: "replace a failing hot-and-cold water distribution system with a coordinated new layout instead of continuing isolated repairs",
      situation: "leaks recur in several areas, pressure is restricted, water is discolored, pipe material is failing, or insurance and renovation decisions require a broader plan",
      system: "the incoming service handoff, main shutoff, hot and cold trunks, branches, fixture supplies, hose connections, water heater, attic, walls, and slab penetrations",
      methods: "system inventory, material and sizing review, route planning, phased shutdowns, new distribution installation, fixture reconnection, pressure testing, inspection, and restoration coordination",
      evidence: "the included fixtures and branches, chosen material, route, access openings, shutoff plan, testing standard, permit responsibility, and restoration limits",
      decision: "a whole-house repipe should be based on distributed system condition and lifecycle value rather than using one accessible leak as the only justification",
      scope: "complete replacement of residential hot-and-cold water distribution piping",
      costFactors: "home size, fixture count, stories, material, attic and wall access, routing, occupied-space protection, permit, testing, insulation, drywall, and painting",
      related: ["pex-repiping", "copper-repiping", "galvanized-pipe-replacement", "polybutylene-pipe-replacement"]
    },
    {
      slug: "pex-repiping", label: "PEX Repiping", group: "Material options", keyword: "PEX repiping", baseH1: "PEX Repiping in Houston, TX",
      intro: "replace eligible supply piping with a properly sized and supported PEX distribution layout suited to the property and adopted code",
      situation: "a whole or partial repipe is planned and the property owner is comparing flexible cross-linked polyethylene with copper and other approved materials",
      system: "trunks, branches, manifolds where used, fittings, supports, transitions, shutoffs, water heater connections, exterior exposure, and fixture supplies",
      methods: "route and sizing design, listed fittings and tools, protected penetrations, support and bend control, approved transitions, pressure testing, inspection, and insulation where required",
      evidence: "the PEX type, fitting system, route, pipe sizing, support approach, transition points, warranty documents, test result, and inspection status",
      decision: "material selection should consider layout, water conditions, exposure, code, product system, installer experience, serviceability, and restoration, not price alone",
      scope: "partial or complete PEX replacement of domestic water distribution piping",
      costFactors: "fixture count, route length, access, pipe and fitting system, manifold design, stories, shutdowns, permits, testing, insulation, and finish work",
      related: ["whole-house-repiping", "copper-repiping", "galvanized-pipe-replacement", "multifamily-repiping"]
    },
    {
      slug: "copper-repiping", label: "Copper Repiping", group: "Material options", keyword: "copper repiping", baseH1: "Copper Repiping in Houston, TX",
      intro: "replace eligible supply piping with a sized, supported, joined, and protected copper distribution system",
      situation: "a property owner prefers copper, an existing copper layout needs broad replacement, or material compatibility and exposed mechanical-room work favor rigid metallic piping",
      system: "type and diameter, joints, supports, dielectric transitions, valves, hot-water distribution, recirculation where present, exterior exposure, and fixture connections",
      methods: "route and sizing design, material preparation, approved joining, protection at penetrations, supports, transitions, pressure testing, flushing, inspection, and insulation",
      evidence: "the copper type, route, joint method, transition details, pipe sizing, protection, pressure-test result, inspection status, and restoration boundary",
      decision: "copper can be appropriate but should be evaluated against water chemistry, existing materials, route access, labor, theft exposure, and the complete installed cost",
      scope: "partial or complete copper replacement of domestic water distribution piping",
      costFactors: "copper market cost, pipe size, route length, stories, access, joining method, supports, shutdowns, permits, testing, insulation, and finish repair",
      related: ["whole-house-repiping", "pex-repiping", "galvanized-pipe-replacement", "multifamily-repiping"]
    },
    {
      slug: "galvanized-pipe-replacement", label: "Galvanized Pipe Replacement", group: "Problem materials", keyword: "galvanized pipe replacement", baseH1: "Galvanized Pipe Replacement in Houston, TX",
      intro: "remove or abandon deteriorated galvanized supply piping that restricts flow, sheds corrosion, or produces repeated leaks",
      situation: "older steel water lines deliver rusty water, weak flow, clogged branches, failing threaded joints, or leaks in several areas",
      system: "the galvanized main and branches, threaded transitions, concealed risers, fixture supplies, service handoff, water heater connections, and abandoned pipe sections",
      methods: "system inventory, route tracing, replacement design, safe disconnection, approved transitions, new PEX or copper installation, flushing, pressure testing, inspection, and restoration",
      evidence: "which galvanized lines are removed or abandoned, where transitions remain, the new material and route, fixture reconnections, test results, and finish-repair limits",
      decision: "localized repair may restore one joint, but widespread internal corrosion and restriction can support a system-level replacement decision",
      scope: "replacement of galvanized domestic water piping with an approved modern system",
      costFactors: "extent of concealed steel, threaded access, stories, fixture count, chosen replacement material, routing, permits, testing, debris removal, and restoration",
      related: ["whole-house-repiping", "pex-repiping", "copper-repiping", "multifamily-repiping"]
    },
    {
      slug: "polybutylene-pipe-replacement", label: "Polybutylene Pipe Replacement", group: "Problem materials", keyword: "polybutylene pipe replacement", baseH1: "Polybutylene Pipe Replacement in Houston, TX",
      intro: "replace identified polybutylene supply piping and its connected fittings with an approved distribution system suited to the property",
      situation: "gray or blue polybutylene is confirmed, leaks have occurred, a transaction or insurer raises material concerns, or a renovation provides practical access",
      system: "polybutylene trunks and branches, fittings, manifolds, transitions, fixture supplies, water-heater connections, concealed routes, and any pipe left abandoned",
      methods: "material confirmation, route inventory, replacement design, controlled disconnection, new PEX or copper installation, pressure testing, inspection, documentation, and restoration",
      evidence: "the identified material, replacement limits, new material and fitting system, transition points, pressure-test result, inspection status, and abandoned-pipe treatment",
      decision: "the proposal should distinguish confirmed polybutylene from other gray flexible products and clearly state whether every affected branch is included",
      scope: "replacement of polybutylene domestic water distribution piping",
      costFactors: "pipe extent, fixture count, stories, access, chosen material, manifolds, shutdown sequence, permits, testing, removal, drywall, and painting",
      related: ["whole-house-repiping", "pex-repiping", "copper-repiping", "galvanized-pipe-replacement"]
    },
    {
      slug: "multifamily-repiping", label: "Multifamily Repiping", group: "Managed properties", keyword: "multifamily repiping", baseH1: "Multifamily Repiping in Houston, TX",
      intro: "plan phased water-pipe replacement for apartments, condominiums, townhome communities, and other occupied multi-unit properties",
      situation: "leaks recur across units, risers or common branches are failing, shutdowns affect several occupants, or ownership needs a capital replacement plan",
      system: "site mains, building entries, risers, corridors, unit branches, common hot water, recirculation, meters, valves, occupied interiors, and restoration zones",
      methods: "survey and phasing, material and sizing design, resident communication, controlled shutdowns, containment, staged installation, testing, inspection, and repeatable restoration",
      evidence: "building and unit limits, phase schedule, shutdown notices, access assumptions, material system, testing and inspection records, restoration standards, and change-control process",
      decision: "multifamily work should be scoped around occupancy, repeatable unit conditions, water continuity, management access, documentation, and a realistic restoration sequence",
      scope: "phased domestic-water repiping for occupied or managed multifamily properties",
      costFactors: "building count, units, risers, meters, common systems, access, resident coordination, working hours, phasing, permits, testing, fire stopping, and restoration",
      related: ["whole-house-repiping", "pex-repiping", "copper-repiping", "galvanized-pipe-replacement"]
    }
  ]
};
