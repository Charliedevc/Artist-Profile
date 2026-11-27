# Artist platform

Build the permanent platform for Narçi, an independent Dark R&B and New Jazz artist. Preserve the ç in all display text. The current album era can change while Narçi’s identity, catalog URLs, navigation, and player persist.

## Architecture

- Use the Next.js App Router under `src/app`. Use Server Components by default and add client boundaries for browser APIs and interaction.
- Keep artist, release, track, and media records in `src/content`. Give each release a stable slug and its own approved media and streaming links. Reference the featured era from artist-level configuration so changing it requires no route changes.
- Use the [UnitedMasters profile](https://unitedmasters.com/a/swoove) and its release pages for source metadata and distribution links. Keep similarly titled records separate when their source URLs differ. FigCraft defines the site’s visual design.
- Keep upcoming projects and unreleased audio in private storage. Publish only an approved announcement or preview projection. Check subscriber entitlements on the server before issuing short-lived access to protected audio. Never place private records or media in public assets, browser bundles, static output, feeds, or sitemaps.
- Use the verified UnitedMasters signup page for initial fan subscriptions. If adding a first-party signup later, keep subscriber records server-side and provide consent and unsubscribe handling.
- Keep release presentation and scoped era theme tokens in `src/features/releases`. Plan for a discography index and stable release URLs under `/music/[slug]`. Keep global design tokens in `src/app/globals.css`.
- Mount the future player in the root layout so playback survives client-side navigation. Keep player logic in `src/features/player`. Use Howler for playback and WaveSurfer for rendering and seeking through the shared playback state. Keep one audible playback source and prefer precomputed peaks for longer tracks.
- Use Tailwind for styling, Motion for transitions, and Lucide for icons. Use `public/media` for approved, lightweight local assets. Keep production masters and private unreleased audio outside the public tree.

## Development standards

- Use strict TypeScript and commit the npm lockfile with dependency changes. Run lint, typecheck, and a production build before handoff.
- Support keyboard interaction, visible focus, labeled controls, reduced motion, and small screens. Require a user gesture to start audio. Give the waveform an accessible seek control.
- Lazy-load heavy media, provide video captions where applicable, and check playback and route navigation on desktop and mobile Safari. Publish only approved excerpts and verify media URLs, CORS, and byte-range behavior before launch.

## FigCraft workflow

- Use FigCraft for visual design and Next.js for implementation. Start with desktop and mobile explorations for the permanent artist shell and two distinct album eras. Document shared and era-specific typography, color, spacing, imagery, motion, and component states in FigCraft.
- Favor an underground, dark and sensual editorial direction, minimalist navigation, cinematic pacing, and subtle film grain. Avoid gradient-heavy treatments, generic templates, unnecessary cards, and SaaS-style layouts.
- Review the homepage, album experience, and player together, including narrow layouts, control focus, and reduced-motion behavior. Translate approved values into CSS tokens and reference the relevant FigCraft frames during handoff. Export approved assets with predictable names and record their source and usage rights.
