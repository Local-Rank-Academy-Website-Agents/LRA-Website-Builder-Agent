export { areas } from "./areas.mjs";

export const project = {
  slug: "water-heater-installation-houston",
  name: "Water Heater Installation Houston Pros",
  shortName: "WHI",
  topic: "Water Heater Installation",
  topicLower: "water heater installation",
  requestLabel: "Request an Installation Quote",
  homepageH1: "Houston Water Heater Installation Services",
  lede: "Compare water heater installation and replacement options, document the property requirements, and prepare a detailed request for a qualified Greater Houston plumbing operator.",
  heroImage: "water-heater-installation-houston.webp",
  heroImageAlt: "Plumbing technician installing a residential water heater in a clean Houston utility space",
  heroWidth: 1672,
  heroHeight: 941,
  processTitle: "Water Heater Installation Process",
  processIntro: "A practical path from demand and fuel review to equipment selection, written scope, permitting, installation, startup, and closeout.",
  palette: { ink: "#1d2a33", teal: "#176a73", aqua: "#7a9f9b", orange: "#c96837", paper: "#faf5ec", mist: "#e7eeeb" },
  services: [
    {
      slug: "water-heater-installation", label: "Water Heater Installation", group: "Core installation", keyword: "water heater installation Houston", baseH1: "Water Heater Installation in Houston, TX",
      intro: "select and install a water heater that fits the property's demand, utilities, location, venting, drainage, and adopted requirements",
      situation: "a new property needs hot water equipment, a remodel changes demand, or an existing system requires planned replacement",
      system: "the heater, hot and cold connections, shutoff, fuel or electrical supply, venting where applicable, combustion air, drain pan and discharge, expansion control, recirculation, and nearby surfaces",
      methods: "site and demand review, equipment and location confirmation, permit planning, controlled connections, required safety components, startup, temperature setting, leak and operation testing, and owner documentation",
      evidence: "equipment model and capacity, utility requirements, vent and drain plan, included connections, permit responsibility, startup results, disposal, exclusions, and warranty responsibility",
      decision: "equipment should be selected from verified demand, available utilities, location constraints, efficiency goals, serviceability, code, and complete installed cost",
      scope: "installation of a compatible residential or light-commercial water heating system",
      costFactors: "heater type and capacity, location, access, fuel or electrical work, venting, drainage, expansion control, recirculation, permits, removal, disposal, and finish work",
      related: ["water-heater-replacement", "tankless-water-heater-installation", "gas-water-heater-installation", "electric-water-heater-installation"]
    },
    {
      slug: "water-heater-replacement", label: "Water Heater Replacement", group: "Replacement", keyword: "water heater replacement Houston", baseH1: "Water Heater Replacement in Houston, TX",
      intro: "remove or retire an existing water heater and install a compatible replacement with updated connections and required safety provisions",
      situation: "the existing unit leaks, cannot meet demand, has reached the end of a practical service life, or a repair-versus-replacement review favors new equipment",
      system: "the old and new heater, water connections, shutoff, utility supply, venting, drain pan and discharge, expansion control, recirculation, platform, and removal path",
      methods: "existing-condition review, compatible equipment selection, controlled shutdown and removal, connection and safety updates, new installation, startup, testing, disposal, and documentation",
      evidence: "old and new equipment details, capacity and compatibility, code-related updates, connection work, removal and disposal, permit responsibility, tests, and warranty terms",
      decision: "a like-for-like size is not automatically correct when demand, fuel input, venting, location, or adopted requirements have changed",
      scope: "planned replacement of an existing tank or tankless water heater",
      costFactors: "equipment, capacity, fuel type, access, stairs or attic location, vent and drain changes, electrical or gas work, code updates, permit, removal, and disposal",
      related: ["water-heater-installation", "tankless-water-heater-installation", "gas-water-heater-installation", "electric-water-heater-installation"]
    },
    {
      slug: "tankless-water-heater-installation", label: "Tankless Water Heater Installation", group: "Tankless systems", keyword: "tankless water heater installation Houston", baseH1: "Tankless Water Heater Installation in Houston, TX",
      intro: "size and install an on-demand water heater around peak flow, temperature rise, utilities, venting, condensate, service access, and maintenance",
      situation: "an owner is comparing tankless hot water, replacing an existing tankless unit, or planning equipment for a new or remodeled property",
      system: "the tankless unit, gas or electrical service, water piping, isolation valves, venting and combustion air, condensate where applicable, recirculation, controls, drain, and mounting location",
      methods: "flow and temperature-rise review, utility-capacity verification, model and location selection, connection and vent planning, installation, startup programming, testing, and documentation",
      evidence: "model, input and flow assumptions, utility requirements, venting and condensate plan, service valves, recirculation scope, permit responsibility, startup readings, and maintenance guidance",
      decision: "tankless selection must be based on simultaneous demand and site capacity; advertised maximum flow alone does not establish property performance",
      scope: "new or replacement installation of a gas or electric tankless water heater",
      costFactors: "unit capacity, fixture demand, temperature rise, gas sizing, electrical capacity, vent length, condensate, water treatment, recirculation, access, permit, and conversion work",
      related: ["water-heater-installation", "water-heater-replacement", "gas-water-heater-installation", "electric-water-heater-installation"]
    },
    {
      slug: "gas-water-heater-installation", label: "Gas Water Heater Installation", group: "Fuel-specific installation", keyword: "gas water heater installation Houston", baseH1: "Gas Water Heater Installation in Houston, TX",
      intro: "install compatible gas-fired equipment with verified input, fuel delivery, venting, combustion air, drainage, safety controls, and startup",
      situation: "a property uses natural gas or propane and needs a new or replacement tank or tankless heater designed for the available fuel and location",
      system: "the heater, gas shutoff and connection, venting, combustion air, water connections, relief discharge, drain pan, expansion control, and controls",
      methods: "equipment and fuel confirmation, gas and vent review, permit planning, controlled installation, connection testing, startup, combustion or draft verification as applicable, and documentation",
      evidence: "equipment and fuel type, gas and vent scope, safety components, connection changes, permit responsibility, leak and startup tests, and warranty details",
      decision: "gas equipment should not be selected until input, gas delivery, vent category, combustion air, location, clearances, and discharge routing are confirmed",
      scope: "installation or replacement of a gas-fired tank or tankless water heater",
      costFactors: "equipment and input, gas-line capacity, vent type and route, combustion air, location, access, drain routing, permit, removal, and code-related updates",
      related: ["water-heater-installation", "water-heater-replacement", "tankless-water-heater-installation", "commercial-water-heater-installation"]
    },
    {
      slug: "electric-water-heater-installation", label: "Electric Water Heater Installation", group: "Fuel-specific installation", keyword: "electric water heater installation Houston", baseH1: "Electric Water Heater Installation in Houston, TX",
      intro: "install compatible electric equipment with verified capacity, branch-circuit requirements, drainage, safety controls, and startup",
      situation: "a property has suitable electrical service and needs a new or replacement tank, heat-pump, or tankless electric system",
      system: "the heater, dedicated electrical circuit and disconnect where required, water connections, relief discharge, drain pan, expansion control, condensate for heat-pump units, and clearances",
      methods: "demand and electrical-capacity review, equipment and location confirmation, permit planning, plumbing and electrical coordination, installation, startup, testing, and documentation",
      evidence: "equipment model and input, required circuit, electrical responsibility, water and drain connections, permit responsibility, startup tests, and warranty details",
      decision: "electric equipment must match available panel and circuit capacity, demand, installation space, recovery expectations, and total conversion cost",
      scope: "installation or replacement of an electric tank, heat-pump, or tankless water heater",
      costFactors: "equipment type and capacity, circuit and panel work, location, access, condensate or drainage, expansion control, permit, removal, disposal, and conversion needs",
      related: ["water-heater-installation", "water-heater-replacement", "tankless-water-heater-installation", "commercial-water-heater-installation"]
    },
    {
      slug: "commercial-water-heater-installation", label: "Commercial Water Heater Installation", group: "Commercial properties", keyword: "commercial water heater installation Houston", baseH1: "Commercial Water Heater Installation in Houston, TX",
      intro: "plan and install commercial equipment around peak demand, recovery, redundancy, utilities, venting, recirculation, controls, occupancy, and service continuity",
      situation: "a restaurant, multifamily, hospitality, healthcare, retail, industrial, or managed property needs new, replacement, staged, or redundant hot-water capacity",
      system: "the heater or bank, storage, utilities, venting, combustion air, water treatment, recirculation, mixing, pumps, controls, drainage, access, and building operations",
      methods: "demand and redundancy analysis, equipment schedule, utility and location review, engineered or manufacturer input where needed, installation, startup, balancing, testing, and closeout",
      evidence: "design assumptions, equipment schedule, utility requirements, shutdown plan, included piping and controls, permit responsibility, startup records, and warranties",
      decision: "commercial installation should be based on documented demand, recovery, service continuity, utility capacity, maintenance access, and ownership goals",
      scope: "new, replacement, or staged commercial water heater installation",
      costFactors: "demand, equipment count, storage, utility upgrades, venting, recirculation, controls, redundancy, access, rigging, phasing, permits, and commissioning",
      related: ["water-heater-installation", "water-heater-replacement", "gas-water-heater-installation", "electric-water-heater-installation"]
    }
  ]
};
