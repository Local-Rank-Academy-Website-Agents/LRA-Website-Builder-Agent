export { areas } from "./areas.mjs";

export const project = {
  slug: "sewer-line-repair-houston",
  name: "Sewer Line Repair Houston Pros",
  shortName: "SLH",
  topic: "Sewer Line Repair",
  topicLower: "sewer line repair",
  requestLabel: "Request Sewer Service",
  homepageH1: "Sewer Line Repair Services in the Greater Houston Area",
  lede: "Understand damaged private sewer lines, compare repair methods, and prepare a detailed request for a qualified Greater Houston plumbing operator.",
  heroImage: "sewer-line-repair-houston.webp",
  heroImageAlt: "Plumbing technician inspecting a residential sewer line with camera equipment in Greater Houston",
  heroWidth: 1672,
  heroHeight: 909,
  processTitle: "Sewer Repair Planning Process",
  processIntro: "A practical path from recurring sewer symptoms to inspection, method selection, written scope, repair, and verification.",
  palette: { ink: "#102633", teal: "#1d6673", aqua: "#4e9c9a", orange: "#e56a3f", paper: "#faf7f1", mist: "#e6efed" },
  services: [
    {
      slug: "sewer-line-repair", label: "Sewer Line Repair", group: "Repair and replacement", keyword: "sewer line repair", baseH1: "Sewer Line Repair in Houston, TX",
      intro: "address a confirmed crack, offset, belly, separation, intrusion point, or localized collapse in a private building sewer",
      situation: "multiple fixtures back up, a cleanout overflows, odors return, the yard settles, or a camera inspection documents structural damage",
      system: "the private building sewer, branch connections, cleanouts, grade, joints, pipe material, depth, and municipal-side handoff",
      methods: "camera confirmation, line locating, utility marking, targeted excavation, section replacement, connection repair, and post-work flow verification",
      evidence: "the defect location, affected pipe material and depth, access route, proposed repair limits, and the test used to verify restored drainage",
      decision: "the method should match the confirmed defect and access conditions instead of treating every backup as proof that the full line must be replaced",
      scope: "localized structural repair of private residential or commercial sewer piping",
      costFactors: "depth, length, pipe material, surface restoration, access, utilities, permits, inspection, dewatering, and the number of failed sections",
      related: ["sewer-camera-inspection", "sewer-line-replacement", "trenchless-sewer-repair", "sewer-cleanout-installation"]
    },
    {
      slug: "sewer-line-replacement", label: "Sewer Line Replacement", group: "Repair and replacement", keyword: "sewer line replacement", baseH1: "Sewer Line Replacement in Houston, TX",
      intro: "replace a private sewer run when distributed deterioration, repeated failures, poor alignment, or incompatible pipe makes spot repair insufficient",
      situation: "camera footage shows several failed sections, cast iron is deteriorated throughout, grade is unreliable, or earlier spot repairs have not stopped recurrence",
      system: "the full private sewer route, connection points, branch tie-ins, cleanouts, slope, bedding, easements, structures, and finished surfaces",
      methods: "route verification, camera inspection, depth and grade measurement, utility locating, open-cut replacement, trenchless alternatives, testing, and inspection",
      evidence: "the replacement limits, selected material and diameter, grade plan, branch reconnections, cleanout locations, restoration boundary, and verification record",
      decision: "full replacement should be supported by line-wide condition and lifecycle value, not by a single blockage that can be cleared without structural work",
      scope: "partial or complete replacement of a failing private building sewer",
      costFactors: "replacement length, depth, pipe diameter, access, slab or paving crossings, landscaping, utility conflicts, permits, inspection, and restoration",
      related: ["sewer-line-repair", "trenchless-sewer-repair", "sewer-camera-inspection", "sewer-pipe-lining"]
    },
    {
      slug: "trenchless-sewer-repair", label: "Trenchless Sewer Repair", group: "Low-disruption methods", keyword: "trenchless sewer repair", baseH1: "Trenchless Sewer Repair in Houston, TX",
      intro: "use pipe bursting or another limited-excavation method when the host route, connections, access points, and soil conditions support it",
      situation: "a damaged sewer crosses landscaping, paving, or other finished areas and a qualified inspection indicates that limited excavation may be practical",
      system: "the host pipe, diameter, alignment, depth, entry and exit points, branch connections, utilities, soil, and downstream connection",
      methods: "camera and dimensional review, line locating, access-pit planning, pipe bursting or another approved replacement method, reconnection, testing, and inspection",
      evidence: "why the line is suitable for the proposed method, where access pits and reconnections occur, what surfaces remain affected, and how the new line is verified",
      decision: "trenchless work is not automatically excavation-free and should be rejected when collapse, alignment, branch, access, or host-pipe conditions make it unsuitable",
      scope: "limited-excavation rehabilitation or replacement of an eligible private sewer line",
      costFactors: "method, diameter, length, depth, access pits, branch reconnections, utilities, host-pipe condition, permits, inspection, and restoration",
      related: ["sewer-camera-inspection", "sewer-line-replacement", "sewer-pipe-lining", "sewer-line-repair"]
    },
    {
      slug: "sewer-pipe-lining", label: "Sewer Pipe Lining", group: "Low-disruption methods", keyword: "sewer pipe lining", baseH1: "Sewer Pipe Lining in Houston, TX",
      intro: "rehabilitate an eligible sewer segment with a cured-in-place liner after cleaning, inspection, measurement, and connection planning",
      situation: "the existing pipe has cracks, infiltration, or surface deterioration but retains an alignment and cross-section that may support a structural liner",
      system: "the host pipe, diameter changes, bends, branch connections, cleanouts, downstream termination, material condition, and available insertion access",
      methods: "cleaning, camera inspection, measurement, liner design, installation, curing, branch reopening where required, and final video documentation",
      evidence: "pre-installation host-pipe condition, liner limits and specification, branch treatment, curing record, and a post-installation inspection of the finished bore",
      decision: "lining should not be presented as suitable for a collapsed, badly offset, incorrectly graded, or inaccessible line without a method-specific engineering basis",
      scope: "structural lining of eligible private sewer segments",
      costFactors: "diameter, length, bends, access, cleaning, branch count, host-pipe preparation, curing method, documentation, permits, and inspection",
      related: ["sewer-camera-inspection", "trenchless-sewer-repair", "sewer-line-replacement", "sewer-line-repair"]
    },
    {
      slug: "sewer-camera-inspection", label: "Sewer Camera Inspection", group: "Inspection and access", keyword: "sewer camera inspection", baseH1: "Sewer Camera Inspection in Houston, TX",
      intro: "document accessible sewer-pipe conditions before choosing cleaning, repair, lining, replacement, or a property-purchase response",
      situation: "blockages recur, roots or offsets are suspected, a repair needs verification, or a buyer wants evidence about an accessible private sewer",
      system: "the accessible drain or sewer route, cleanout, branch transitions, pipe material, joints, grade clues, obstructions, and downstream connection",
      methods: "cleanout access, controlled camera travel, footage capture, distance measurement, surface locating where feasible, and written condition notes",
      evidence: "date-stamped footage or images, observed defect type, approximate distance and location, access limitations, and the next diagnostic or repair step",
      decision: "video documents visible conditions but cannot by itself prove every leak, determine exact depth everywhere, or inspect a line that is blocked or inaccessible",
      scope: "visual inspection and location support for accessible private drainage and sewer piping",
      costFactors: "cleanout access, blockage, line length, diameter, branches, recording requirements, locating, occupied-space protection, and repeat inspection",
      related: ["sewer-line-repair", "sewer-line-replacement", "trenchless-sewer-repair", "sewer-cleanout-installation"]
    },
    {
      slug: "sewer-cleanout-installation", label: "Sewer Cleanout Installation", group: "Inspection and access", keyword: "sewer cleanout installation", baseH1: "Sewer Cleanout Installation in Houston, TX",
      intro: "add a service opening that supports safer future inspection, cleaning, testing, and repair access to a private building sewer",
      situation: "no practical cleanout exists, the current opening is damaged or buried, or recurring service requires access at a better location",
      system: "the building drain and sewer route, pipe material and diameter, grade, existing fittings, utilities, finished surface, and proposed access point",
      methods: "route confirmation, utility locating, excavation, compatible fitting installation, riser and cap placement, leak or flow testing, and surface restoration",
      evidence: "the cleanout location, connection material, direction of access, finished elevation, protection from damage, and verification of a secure connection",
      decision: "the selected location should provide useful access without creating a trip hazard, vehicle-load risk, drainage problem, or conflict with other utilities",
      scope: "installation, replacement, raising, or relocation of private sewer cleanouts",
      costFactors: "depth, pipe material, location, excavation, paving or landscaping, traffic rating, utilities, permits, inspection, and restoration",
      related: ["sewer-camera-inspection", "sewer-line-repair", "sewer-line-replacement", "trenchless-sewer-repair"]
    }
  ]
};
