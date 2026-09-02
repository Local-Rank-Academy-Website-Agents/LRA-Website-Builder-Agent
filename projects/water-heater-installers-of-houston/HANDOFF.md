# Handoff

Run `npm run build` for the validated static output in `dist/`. The Vercel project is `water-heater-installation-houston`, and the indexed production site is `https://www.waterheaterinstallation-houston.com/`. The apex domain redirects permanently to `www`.

Form submissions route to the configured HubSpot endpoint in `site/assets/lead-routing.js`. No secret values are stored in source control. Remaining operator and phone dependencies are documented in `LAUNCH-BLOCKERS.md`.
