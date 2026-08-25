# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Astro dev server
npm run check    # astro check (TypeScript + Astro diagnostics)
npm run build    # astro check && astro build
npm run preview  # serve the production build
```

There is no test suite and no linter beyond `astro check`. `npm run build` fails on any type error because `check` runs first — use `npm run check` as the fast feedback loop.

## Stack

Astro 7 (static, no UI framework integrations), Tailwind CSS 4 via `@tailwindcss/vite` (no `tailwind.config`), GSAP + ScrollTrigger. TypeScript is `astro/tsconfigs/strict`. There is no smooth-scroll library — the site uses native scrolling. All content is in Spanish; write UI copy, `aria-label`s and comments in Spanish.

## Architecture

Two routes only: `/` ([src/pages/index.astro](src/pages/index.astro)) composes the landing sections, `/narrativas` ([src/pages/narrativas.astro](src/pages/narrativas.astro)) hosts the flipbook plus portfolio grid.

Layering is strict — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md):

- `src/data/` — all serializable content (projects, spreads, soundtrack tracks, services, method steps). Adding a narrative means adding data here, not new components.
- `src/components/` — grouped by domain (`landing/`, `narratives/`, `audio/`, `layout/`).
- `src/pages/` — composition only, no behavior.
- `src/scripts/` — shared runtime behavior.
- `public/brand/` — logos and fonts; `public/media/` — production-optimized media only.

[src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) is the single document shell: it imports `global.css`, loads Google Fonts, and inlines `import "../scripts/app"` and `import "../scripts/navigation"` for every page. `audio-controller` is imported only by `/narrativas`.

[src/scripts/navigation.ts](src/scripts/navigation.ts) drives the tone-aware nav: it hit-tests `elementsFromPoint` against `section[data-tone]` to swap the logo and burger between light and solid. Any new full-bleed section needs a `data-tone` attribute or the nav will read the wrong tone over it.

### Flipbook (the non-obvious part)

[Flipbook.astro](src/components/narratives/Flipbook.astro) renders **one** book stage (left half, right half, and a single turning page with front/back faces) and drives it from a single client-side state machine covering buttons, keyboard, drag and touch.

Page content is *not* rendered in place. [SpreadTemplates.astro](src/components/narratives/SpreadTemplates.astro) pre-renders every project × spread × side into hidden `<template data-spread-template data-project data-spread data-side>` elements; the flipbook clones the matching fragment into a half at turn time. So a page's markup is server-rendered Astro, but its DOM node is transient.

[NarrativePage.astro](src/components/narratives/NarrativePage.astro) is the dispatcher. It routes by `spread.layout` **prefix** before falling back to its own `layout:side` chain:

- `n500-*` -> [Natura500Page.astro](src/components/narratives/Natura500Page.astro)
- `vo-*` -> [VitalOceansPage.astro](src/components/narratives/VitalOceansPage.astro)
- `generic` -> [BookPage.astro](src/components/narratives/BookPage.astro)
- `t4n-*` -> handled inline, as a chain of conditionals on `layout:side`

The three projects are `tech-for-nature-mexico`, `natura500` and `oceanos-vitales`, each with its own track list (`t4nTracks`, `n500Tracks`, `vitalOceansTracks`) in [src/data/narratives.ts](src/data/narratives.ts). A new spread means a new union member on `NarrativeSpread["layout"]` plus a branch in the owning page component; a whole new narrative is better served by its own `<Slug>Page.astro` and a new prefix, following Natura500 and Vital Oceans.

### Audio

[src/scripts/audio-controller.ts](src/scripts/audio-controller.ts) owns a **single** `HTMLAudioElement` parked on `window.simplixityAudio`, precisely because the flipbook unmounts page DOM mid-playback — a track must survive its own player being destroyed. Players are markup-only and declare themselves with data attributes (`data-audio-player`, `data-audio-src`, `data-audio-title`, `data-audio-toggle`, `data-audio-progress`, `data-audio-current`, `data-audio-duration`); the controller re-scans and rebinds after clones. The three players ([ColorAudioPlayer](src/components/audio/ColorAudioPlayer.astro), [CapsuleAudioPlayer](src/components/audio/CapsuleAudioPlayer.astro), [PlayPauseButton](src/components/audio/PlayPauseButton.astro)) hold no playback logic — keep it that way.

### Motion

[src/scripts/app.ts](src/scripts/app.ts) sets up the loader and every ScrollTrigger sequence (`setupLoader`, `setupHero`, `setupHeroSequence`, `setupScrollMotion`). Scrolling is native — Lenis was removed along with its dependency, so do not reintroduce `window.simplixityLenis`. Every setup function early-returns on `prefers-reduced-motion: reduce`; preserve that guard in new animations. The loader fires a `simplixity:ready` custom event and uses `sessionStorage` (`simplixity-loader-seen`) so it plays once per session.

## Design constraints

Design tokens live in the `@theme` block of [src/styles/global.css](src/styles/global.css) (`--color-navy`, `--color-pink`, `--color-cyan`, `--color-lilac`, `--color-yellow`, `--color-sage`, `--color-blush`, `--color-page`, `--color-muted`, `--font-display`, `--font-hand`, `--font-sans`, `--ease-studio`, `--ease-overlay`), which is what makes `bg-page`, `text-navy`, `font-display` etc. work. Add colors/fonts there, not in ad-hoc CSS.

[DESIGN.md](DESIGN.md) is the authoritative visual spec (frontmatter tokens + do's and don'ts) and [PRODUCT.md](PRODUCT.md) the audience/positioning context. Load-bearing rules from them:

- WCAG 2.2 AA: keyboard operability, visible focus, semantic HTML, no meaning conveyed by color/motion alone.
- Animate only `transform`, `opacity` and moderate filters.
- The flipbook must respond identically to buttons, keyboard, drag and touch.
- No gradient-in-text, no decorative glassmorphism, no >1px decorative side borders.
- The HTML prototypes in `docs/prototypes/` are the authoritative visual reference; they are reference material and must stay out of the runtime.

## Media policy

Published raster images are WebP, published audio is MP3, under `public/media/<area>/<slug>/`. Masters (WAV/PNG) never enter Git or `public/`. Non-shipping reference imagery belongs in `docs/references/`.

`public/media/` and `public/multimedia/` are **gitignored** — the binaries live in Cloudflare R2, not the repo. `public/brand/` stays in git (small, first paint, avoids cross-origin font fetches).

- Every reference to those two directories must go through `asset()` from [src/lib/assets.ts](src/lib/assets.ts). Never hardcode `/media/...` in markup: it works locally and 404s in production.
- `asset()` prefixes `PUBLIC_MEDIA_BASE_URL`; empty in dev (serves from `public/`), the R2 origin in Vercel.
- `media-manifest.json` (path, size, sha256 per asset) IS committed and is the contract between local, R2 and CI.

### Adding a media file

New files go in `media-inbox/`, mirroring their final path (`media-inbox/media/landing/x.webp` -> `/media/landing/x.webp`); only `media-inbox/media/` and `media-inbox/multimedia/` are accepted. **Never copy a new file straight into `public/media/` or `public/multimedia/`** — those are gitignored, so git never sees it and it never reaches production. This is the easy mistake to make here, since that is where the existing assets live. `npm run media:preview` copies the inbox into `public/` so `npm run dev` can show it; the file stays in the inbox, which is what the push publishes.

There are two ways to publish, and which one applies depends on whether the person has R2 credentials.

**With credentials** — `npm run media:sync` uploads the diff and regenerates the manifest; commit it. The `.githooks/pre-push` hook (wired by the `prepare` script) runs `media-sync --if-needed` automatically and aborts the push if the manifest changed, so this is hard to forget.

**Without credentials** — drop the file in `media-inbox/`, mirroring its final path (`media-inbox/media/landing/x.webp` -> `/media/landing/x.webp`), and push. The `Medios` Action runs `media-ingest --clear`, which uploads to R2, **merges** into the manifest and commits back a cleared inbox. Contributors configure nothing.

The distinction matters when editing `scripts/media-ingest.mjs`: it merges the manifest rather than regenerating it, because in CI `public/media` is empty (gitignored) and a regeneration would wipe every previously published entry. `media-sync` regenerates, because there it walks a complete local tree.

```bash
npm run media:sync     # con credenciales: sube el diff y regenera el manifest
npm run media:preview  # sin credenciales: copia media-inbox/ a public/ para ver el sitio
npm run media:pull     # baja los medios tras un clon nuevo (sin credenciales)
npm run media:verify   # confirma que el manifest coincide con el bucket
```

The `Medios` Action also runs `media:verify` on every push and PR, failing the build when an asset in the manifest is missing from R2 — that is what prevents a deploy from pointing at a file that was never uploaded. `media:sync` only prunes deleted remote objects when passed `--prune`.

## Adding a narrative

Create `public/media/narratives/<slug>/`, register the project (word, title, palette fields `bg`/`fg`/`paper`/`accent`, tags, spreads) in [src/data/narratives.ts](src/data/narratives.ts), and reuse the existing page/audio components (paths through `asset()`). `SpreadTemplates` and the portfolio grid pick it up from the data automatically. Finish with `npm run media:sync` and commit `media-manifest.json`.
