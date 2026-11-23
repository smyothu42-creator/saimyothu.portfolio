# Architecture

Verified against the repository on 2026-11-23.

## Runtime and toolchain

- Vite 8 builds and serves an ESM application from `index.html`.
- React 19 and `react-dom` render the application into `#root`; development renders under `StrictMode`.
- GSAP drives page-sheet transitions, home-row motion, and case-study motion. `@gsap/react` is declared but is not imported by current source code.
- Lenis owns smooth scrolling. The active instance is shared through `src/scroll.js` for programmatic scrolling.
- ESLint 10 uses the flat configuration with the recommended JavaScript, React Hooks, and Vite React Refresh rules.
- The repository contains npm lockfile v3 and pnpm lockfile v9. Package scripts are `dev`, `build`, `lint`, and `preview`.

## Boot and rendering flow

1. `index.html` sets metadata, preloads Figtree, Satoshi Medium, and the Pristine Script wordmark font, and loads `src/main.jsx`.
2. `src/main.jsx` loads CSS in this order: `fonts.css`, `index.css`, `selv.css`, then `revamp.css`. Later layers win.
3. `main.jsx` installs global UI sounds, parses the initial path, dynamically imports that page through `src/pages.js`, and only then mounts `App`.
4. `src/App.jsx` renders the loaded page with `createElement`. Other route bundles are preloaded during idle time unless Data Saver is enabled.

There is no third-party routing library. `src/pages.js` is the route table and parser; `App.jsx` intercepts same-origin root-relative anchor clicks, uses the History API, and handles `popstate`.

## Navigation and transitions

`App.jsx` owns:

- client-side navigation and lazy page loading;
- per-history-entry scroll positions stored in `sessionStorage` under `sv-scroll`;
- manual restoration after back/forward navigation and reloads;
- a Lenis animation-frame loop;
- IntersectionObserver-based `.reveal` activation;
- native View Transitions when available;
- wide-screen home-to-page sheet motion (`PagePane`) and page-to-page rail motion (`PageRail`), with reduced-motion and narrow-screen fallbacks.

Link clicks and browser back/forward navigation share the same page transitions. The transitions temporarily stop Lenis, render their own page/header copies, then atomically replace the live route and restore the destination entry's scroll position. `Topbar` is omitted on Home and Flowy and during transition overlays.

## Page and data architecture

- Route components are dynamically imported from `src/components/` or `src/flowy/` by `src/pages.js`.
- `src/data.js` is the main content model: profile, navigation metadata, case studies, project order, testimonials, About content, social links, email, and contact hints.
- `src/components/Home.jsx` contains the Home project previews and their result/metric copy. `HOME_WORK` in `src/data.js` orders the six case studies on Home and in the case-study pager. Home appends a direct link to the OrderFlow landing page after the case studies.
- `src/components/CaseStudy.jsx` finds a case by slug, renders its metadata and sections, and dispatches each data block to a renderer from `CaseBlocks.jsx` or `Story.jsx`.
- `src/components/ui.jsx` holds shared primitives such as cards, buttons, icons, social links, the contact close, segmented filters, and handwritten “take” notes.
- `src/flowy/` is a self-contained design-system reference page with its own components and scoped CSS.

Several older visual-shell components (`Backdrop`, `BackdropScenes`, `Cursor`, `Dock`, `Footer`, `Loader`, `Nav`, and `Testimonials`) remain in `src/components/` but are not imported by the current mounted application. Confirm call sites before treating them as active UI.

## Media and static assets

Static files live under `public/` and are addressed by root-relative URLs. Major groups are case-study media (`public/case/<project>/`), fonts, logos, people, sounds, profile/background images, and the resume PDF.

AVIF selection is build-assisted:

1. `vite.config.js` recursively finds `.avif` files with a same-basename JPG, JPEG, or PNG fallback and injects their paths as `__AVIF__`.
2. `src/avif.js` checks browser support and rewrites matching image paths.
3. `src/data.js` applies that rewrite to its exported content models in place.

Video components respect reduced-motion and, where implemented, Data Saver. `Media.jsx` uses posters and chooses a smaller mobile video when provided. Global click sounds in `src/sfx.js` use Web Audio with an `Audio` fallback and wait for user activation where required.

## Build and hosting

- `npm run build` creates generated `dist/`, which is ignored by Git and should not be edited directly.
- `vercel.json` rewrites all paths to `/index.html`, enabling direct visits to client routes.
- Vercel gives immutable one-year caching to `/fonts/*` and `/assets/*`; user-facing media and PDFs are configured to revalidate.
- Vite also emits code-split page chunks because every page in `src/pages.js` uses dynamic `import()`.

## Non-authoritative material

- `.tmp-brand/`, `.tmp-motion/`, and `.tmp-refs/` contain captures, experiments, or references.
- `dist/` is generated output.
- `reports/` and `research_notes/` contain design-system research, not runtime code.

Use these only when a task explicitly concerns their artifacts or history.

