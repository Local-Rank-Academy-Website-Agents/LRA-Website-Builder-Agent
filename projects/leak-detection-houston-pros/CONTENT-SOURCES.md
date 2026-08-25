# Content, Design, Font, and Image Sources

## Design references

- `https://www.waterheater-repairhouston.com/` was the primary reference for the image-led local-service presentation, conversion-first hero, service cards, and long-form landing-page rhythm.
- `https://draincleaning-houston.com/` was the secondary reference for broad service-area navigation and internal-link discoverability.

The delivered site does not copy either reference site's text, code, branding, photos, reviews, business claims, or other protected assets. It uses a bespoke teal, navy, aqua, and orange visual system built for this project.

## Typeface

Sora is self-hosted in weights 400, 500, 600, 700, and 800 under `site/assets/fonts/`. Sora is published by the Sora project under the SIL Open Font License; project information is available from the Google Fonts Sora repository at `https://github.com/sora-xor/sora-font`.

## Generated image set

All seven service photographs were generated from scratch using OpenAI's built-in image generation mode and converted to optimized 1400-pixel WebP assets. No people are identified as employees, and no generated image is presented as a completed local project or customer testimonial.

Final prompt set and intended compositions:

1. Hero / core water leak detection — photorealistic editorial local-service scene inside a bright modern Houston-area home; a technician's hands use a thermal camera and moisture meter near an open plumbing access panel; navy, teal, and warm-coral accents; clean natural light; no text, logos, faces, badges, or claims; wide landscape composition with usable crop space.
2. Slab leak detection — photorealistic close editorial view of hands operating professional acoustic detection equipment on a clean tile floor above a concrete slab; subtle residential context, realistic tools and cable placement, natural daylight, no demolition, faces, logos, text, or branding; wide landscape composition.
3. Underground water leak detection — photorealistic Houston-area suburban yard scene with hands using professional ground-listening and line-tracing equipment over turf beside a water-service route; realistic utility context and Gulf Coast landscaping; no excavation spectacle, faces, logos, text, or branded uniforms; wide landscape composition.
4. Interior plumbing leak detection — photorealistic bright residential interior with a moisture meter and compact inspection tool checking a wall and under-sink supply area; realistic pipes, clean cabinetry, natural daylight, no faces, damage theatrics, logos, text, or branding; wide editorial composition.
5. Sewer line leak detection — photorealistic professional drain and building-sewer diagnostic setup at a residential exterior cleanout; inspection-camera reel, locator, gloves, and realistic piping context; restrained Gulf Coast landscaping; no sewage, faces, logos, text, or branding; wide landscape composition.
6. Pool and spa leak detection — photorealistic residential pool diagnostic scene with dye-testing and pressure-testing equipment near the pool edge and circulation fittings; clear water, tasteful Houston-area backyard context, no people posing, logos, text, or exaggerated damage; wide editorial composition.
7. Commercial leak detection — photorealistic commercial mechanical-room and corridor diagnostic scene with technician hands using thermal and ultrasonic-style instruments near meters and distribution piping; clean operational setting, navy and teal equipment accents, no faces, company logos, text, certificates, or claims; wide landscape composition.

Optimized delivery assets:

- `site/assets/images/hero-leak-detection.webp`
- `site/assets/images/slab-leak-detection.webp`
- `site/assets/images/underground-leak-detection.webp`
- `site/assets/images/interior-plumbing-leak-detection.webp`
- `site/assets/images/sewer-line-leak-detection.webp`
- `site/assets/images/pool-leak-detection.webp`
- `site/assets/images/commercial-leak-detection.webp`

The original PNG generation outputs remain in the source image directory for future editing. The production build omits those PNG originals and ships the compressed WebP files only.
