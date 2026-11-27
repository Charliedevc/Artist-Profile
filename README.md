# Son'Ye Artist Profile

A permanent home for Narçi, an independent Dark R&B and New Jazz artist. The Signature implementation uses Next.js App Router, strict TypeScript, Tailwind CSS, Motion, Howler.js, WaveSurfer.js, and Lucide React.

## Artist profile and catalog

The [UnitedMasters profile](https://unitedmasters.com/a/swoove) is the initial source for Narçi’s name, biography, profile image reference, releases, and fan signup. The 26 catalog records in `src/content/releases.ts` preserve the profile order, titles, and listed years. Each includes the date and streaming destinations supplied by its release page and the cover reference shown on the artist profile. Similar titles with distinct release pages retain distinct slugs.

The root layout carries the player across `/`, `/music`, `/music/[slug]`, `/visuals`, and `/about`. The initial featured release is Brielle, configured by slug in `src/content/artist.ts`. Release themes are scoped in `src/features/releases/release-theme.ts`. UnitedMasters hosts the existing email signup.

## Signature assets and playback

The approved layout is on **D — Narçi Signature** in `design/Narci-Phase-2.1.figcraft`. Local reference copies in `public/media/signature` are optimized WebP derivatives of the portrait and 26 cover URLs recorded in the content layer. Confirm web usage rights or swap them for approved production assets before deployment. Commission the landscape and vertical campaign portraits and poster or film shown in the FigCraft direction. Supply captions for any video with dialogue or meaningful audio.

Add approved public excerpts and captioned visuals to the allowlists in `src/content/signature.ts`. Supply a matching title, release slug, and optional duration and precomputed peaks for each excerpt. The root player uses Howler as the audio source and uses WaveSurfer to draw supplied peaks. The current allowlists are empty. Masters, unreleased files and subscriber audio belong outside the public tree and Git. Protected playback needs a separate server-authorized delivery path.

After playback starts, Previous retraces the queue history and Up Next shows the remaining order when multiple public previews are available. Shuffle fixes the order for each pass. Switching shuffle during a pass reorders the remaining previews. Repeat Off stops at the end, All wraps the queue, and One restarts the current preview when it ends. Manual skips still follow the queue in One mode.

Release pages generate descriptions and music JSON-LD from the public catalog. Add optional track durations in whole seconds, role-based credits, and lyrics only when approved for display. Social image metadata uses approved artwork with an absolute HTTP(S) URL. Locally hosted social artwork can be configured once a public origin is confirmed.

### Manual additions and approvals

- Supply approved artwork masters and artist photography, along with usage rights and image descriptions.
- Confirm release formats, track lists, and production and engineering credits before adding them. The profile describes Narçi as a self-taught producer and engineer without attributing individual releases.
- Approve any upcoming announcement, public excerpt, or subscriber preview before it appears on the site. Keep drafts and audio masters in private storage. Exclusive audio requires a server-side entitlement check and expiring delivery URLs.
- Check Safari desktop and mobile playback and delivery once the approved audio has been supplied.

## Local development on Windows

Use Node.js 20.9 or later and Git. The foundation was set up on Node.js 26.13.1 and npm 11.20.0. Use `npm.cmd` in PowerShell to invoke npm through the Windows command shim.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. Run the project checks with:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

The v0.4 Chrome checks covered the production layout at 320, 390, 768, and 1440 pixels, dialog focus and Escape, and all 26 release routes and 53 rendered streaming destinations. An isolated synthetic tone exercised the waveform, keyboard seeking and volume, and playback across in-app navigation.

- **Safari** remains unverified on desktop and iOS.
- **Audible playback with Narçi media** remains unverified because the public preview allowlist is empty. Confirm audio quality, CORS, and byte-range delivery with approved excerpts before launch.

## FFmpeg on Windows

The existing Winget installation of Gyan FFmpeg 9.0.2 is on the Windows user PATH. Verify it in a normal PowerShell session with `where.exe ffmpeg` and `ffmpeg -version`. The Codex restricted shell can see the PATH entry but cannot access this installation under the Windows user profile. FFmpeg is used for media preparation and is optional for building the app.

## FigCraft MCP

The Artist and MacanOS projects use the existing global Codex setting in `%USERPROFILE%/.codex/config.toml`. It runs `figcraft-cli.exe mcp --attach 7979` over stdio. Run `codex.cmd mcp list` and `codex.cmd mcp get figcraft` from a regular PowerShell session to check that the entry is enabled.

Start FigCraft in control mode with file access scoped to Artist. Run this from the Artist project root.

```powershell
& 'C:\Program Files\FigCraft\figcraft.exe' --control 7979 --automation-read-root "$PWD" --automation-write-root "$PWD"
```

Keep that FigCraft window open and start a fresh Codex session in Artist after the control listener is available. A live MCP handshake, tool listing, and read-only `inspect_document` call were verified against FigCraft 0.18.1. The call reported an Untitled draft with one empty page and no unsaved changes.

ESLint 9 is pinned for compatibility with the plugins used by Next.js 16.4.6. Revisit the pin when those plugins support ESLint 10.

## Project layout

| Path | Purpose |
| --- | --- |
| `src/app` | Routes, root layout, and global styles |
| `src/content` | Artist profile, release catalog, track metadata, and featured-era configuration |
| `src/features/releases` | Release presentation and scoped album-era themes |
| `src/features/player` | Persistent playback and waveform integration |
| `public/media` | Approved local web media |

See [AGENTS.md](AGENTS.md) for architecture and the FigCraft workflow and [ROADMAP.md](ROADMAP.md) for the build sequence.

