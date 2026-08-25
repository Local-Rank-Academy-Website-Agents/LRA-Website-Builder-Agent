# Keyword Map

## Homepage target

| Broadest topic keyword | Greater-area modifier | Required H1 | Primary services linked from homepage |
| --- | --- | --- | --- |
| leak detection services | Greater Houston Area | Leak Detection Services in the Greater Houston Area | All seven approved services |

## Approved service targets

| Primary keyword | URL | Required H1 | Distinct intent | Homepage priority |
| --- | --- | --- | --- | --- |
| water leak detection | `/services/water-leak-detection/` | Water Leak Detection | Whole-property water-loss triage and source narrowing | Primary |
| slab leak detection | `/services/slab-leak-detection/` | Slab Leak Detection | Pressurized piping beneath or within a slab | Primary |
| underground water leak detection | `/services/underground-water-leak-detection/` | Underground Water Leak Detection | Private buried service and yard piping | Primary |
| plumbing leak detection | `/services/plumbing-leak-detection/` | Plumbing Leak Detection | Interior supply, fixture, appliance, drainage, and condensation source separation | Primary |
| sewer line leak detection | `/services/sewer-line-leak-detection/` | Sewer Line Leak Detection | Private drainage-line defect and leak investigation | Primary |
| pool leak detection | `/services/pool-spa-leak-detection/` | Pool & Spa Leak Detection | Pool/spa vessel, fitting, line, and equipment loss isolation | Primary |
| commercial leak detection | `/services/commercial-leak-detection/` | Commercial Leak Detection | Managed testing for commercial and multifamily systems | Primary |

## Merged and deferred candidates

- Merge hidden, home, and non-invasive leak detection into Water Leak Detection.
- Merge foundation and under-slab variants into Slab Leak Detection.
- Merge yard and service-line variants into Underground Water Leak Detection.
- Merge wall, ceiling, bathroom, and appliance symptoms into Plumbing Leak Detection.
- Merge drain and waste-line leak variants into Sewer Line Leak Detection.
- Merge swimming-pool and spa variants into Pool & Spa Leak Detection.
- Treat thermal imaging, acoustic listening, moisture mapping, pressure testing, dye testing, and tracer gas as supporting methods rather than competing pages.
- Defer gas, emergency/24-hour, repair, roof, fire-line, irrigation, and industrial services until operator scope is verified.

## Service-area targets

All 43 targets are intended pending operator verification.

- Houston core: Houston, Downtown Houston, Midtown Houston, Montrose, Houston Heights, River Oaks, West University Place, Bellaire, Memorial, Spring Branch, Uptown and the Galleria, Meyerland, Braeswood Place, East Downtown Houston, Third Ward, Energy Corridor
- North Houston: The Woodlands, Spring, Tomball, Humble, Kingwood, Atascocita, Cypress
- West and southwest: Katy, Cinco Ranch, Fulshear, Richmond, Rosenberg, Sugar Land, Stafford, Missouri City
- South and southeast: Pearland, Friendswood, League City, Clear Lake, Webster, Alvin, Manvel
- East Houston: Pasadena, Deer Park, La Porte, Baytown, Channelview

Each area receives a pillar at `/service-areas/{area}/` with the direct H1 `Leak Detection in {Area}` and seven child pages at `/service-areas/{area}/{service}/`.

## City/service linking contract

- Area pillars link to every service in that same area.
- Local service pages link to their area pillar, their generic parent service, all mapped related services in the same area, and nearby-area versions of the same service.
- Generic service pages link to all 43 local service destinations.
- Navigation and footer directories include all generic service pages and all 43 area pillars.
- The sitemap includes the complete 301-page city/service matrix.

## Cannibalization gate

- Homepage: broad Greater Houston umbrella.
- Generic service pages: service-wide Houston intent.
- Area pillars: broad place intent.
- City/service pages: one service × one place intent.
- Methods and synonyms: supporting topics owned by the relevant service page.
