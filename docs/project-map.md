# Project map

Verified against the repository on 2026-11-23.

## Repository structure

```text
portfolio-revamp/
├── index.html                 Vite HTML entry and font preloads
├── package.json               scripts and runtime/development dependencies
├── vite.config.js             React plugin and build-time AVIF inventory
├── eslint.config.js           flat ESLint configuration
├── vercel.json                SPA rewrite and cache headers
├── src/                       application source
│   ├── main.jsx               boot, CSS order, sounds, initial route load
│   ├── App.jsx                application shell, navigation, scroll, transitions
│   ├── pages.js               lazy page registry and route parser
│   ├── data.js                portfolio/case/profile content model
│   ├── components/            route pages and reusable presentation blocks
│   ├── flowy/                 isolated Flowy reference page and components
│   ├── fonts.css              font-face declarations
│   ├── index.css              base/legacy global and case styles
│   ├── selv.css               glass-card system
│   ├── revamp.css             final active editorial overrides
│   ├── avif.js                runtime image-path selection
│   ├── scroll.js              shared Lenis bridge
│   ├── sfx.js                 global interaction sounds
│   ├── dates.js               experience date formatting
│   └── useDragPill.js         reusable draggable selection behavior
├── public/                    directly served assets
│   ├── case/<project>/        case-study images, video, audio, and flows
│   ├── fonts/                 self-hosted font files
│   ├── logos/, people/        company/profile imagery
│   ├── sounds/                UI sound clips
│   └── *.jpg/*.avif/*.pdf     page backgrounds, profile photos, resume
├── reports/                   design-system report material
├── research_notes/            supporting research notes
├── dist/                      generated build output; do not edit
└── .tmp-*/                    temporary captures/reference experiments
```

## Routes

Routes are parsed in `src/pages.js` and rendered by lazy import.

| URL | Route name | Component | Notes |
| --- | --- | --- | --- |
| `/` | `home` | `components/Home.jsx` | Primary split landing/work page |
| `/work` | `home` | `components/Home.jsx` | Explicitly treated as the old Work page alias |
| `/about` | `about` | `components/AboutPage.jsx` | Main About route |
| `/me` | `about` | `components/AboutPage.jsx` | About alias |
| `/contact` | `contact` | `components/ContactPage.jsx` | Contact details and channels |
| `/snaps` | `snaps` | `components/SnapsPage.jsx` | Small “coming soon” page |
| `/flowy` | `flowy` | `flowy/Reference.jsx` | Standalone Flowy reference; `?board=1` selects its poster view |
| `/work/:slug` | `case` | `components/CaseStudy.jsx` | Data-driven case study; unknown slugs show “Project not found” |
| any other path | `home` | `components/Home.jsx` | Parser fallback |

Vercel rewrites direct requests to `index.html`; without that rewrite, deep-link hosting must provide an equivalent SPA fallback.

## Case-study slugs

`src/data.js` currently defines these cases:

- `orderflow`
- `superfine-employee`
- `sfk-driver-app`
- `mtb-pay-merchant`
- `flowy-design-system`
- `pohpoh`
- `uz-branding`

The home page and case pager use this subset/order from `HOME_WORK`: `orderflow`, `superfine-employee`, `flowy-design-system`, `pohpoh`, `mtb-pay-merchant`, `uz-branding`. `sfk-driver-app` is routable by slug but is not listed on Home.

Each case can provide metadata, art, summary/glance content, section records, blocks, galleries, and an accent. `CaseStudy.jsx` is the schema consumer; confirm its block switch before adding a new `kind`.

## Active component map

### Route pages

- `Home.jsx` — landing-stage composition, home project previews, and project list.
- `AboutPage.jsx` — biography, sorted experience, approach, testimonials, current toolkit, and external links.
- `ContactPage.jsx` — availability/location facts plus email, social, and resume channels.
- `SnapsPage.jsx` — placeholder route.
- `CaseStudy.jsx` — case lookup, metadata, cover, jump navigation, block dispatch, gallery, and previous/next navigation.
- `flowy/Reference.jsx` — interactive design-system documentation or poster view.

### Case-study and shared UI

- `CaseBlocks.jsx` — research, process, system, comparison, and outcome blocks.
- `Story.jsx` — complex media, device, walkthrough, comparison, information architecture, and brand blocks.
- `Media.jsx` — cover image/video renderer.
- `ui.jsx` — cards, buttons, icons, contact/social units, filters, and take notes.
- `Topbar.jsx` — active masthead for non-home portfolio pages.
- `flowy/components.jsx` — Flowy-only UI primitives and admin navigation.

### Utilities and content

- `data.js` — authoritative portfolio copy and case-study structure.
- `pages.js` — route-to-bundle registry.
- `avif.js` — image URL optimization based on the build-generated inventory.
- `scroll.js` — shared smooth-scroll access.
- `dates.js` — `YYYY-MM` sorting and labels.
- `sfx.js` — delegated sounds for interactive elements.
- `useDragPill.js` — pointer selection logic shared by filters and other pills.

### Present but not mounted by current imports

`Backdrop.jsx`, `BackdropScenes.jsx`, `Cursor.jsx`, `Dock.jsx`, `Footer.jsx`, `Loader.jsx`, `Nav.jsx`, and `Testimonials.jsx` have no import path from the current entry/application tree. `LofiRoom.jsx` is only reached through the unmounted `BackdropScenes.jsx`. Treat these as retained/legacy implementations until a call site is restored.

## Content-editing map

| Change | Primary file(s) |
| --- | --- |
| Profile name, tagline, intro, email, socials, resume URL | `src/data.js` |
| Project descriptions, case sections, study media references | `src/data.js` |
| Home project order | `src/data.js` (`HOME_WORK`) |
| Home metric/year/preview type and media | `src/components/Home.jsx` (`HOME_PROJECTS`) |
| About biography, experience, approach, testimonials | `src/data.js`; layout in `AboutPage.jsx` |
| Route or alias | `src/pages.js`; review navigation behavior in `App.jsx` |
| Case block type | `CaseStudy.jsx` plus `CaseBlocks.jsx` or `Story.jsx` |
| Global/editorial styling | `src/revamp.css`, after checking earlier layers |
| Flowy reference styling/components | `src/flowy/flowy.css`, `src/flowy/components.jsx`, `src/flowy/Reference.jsx` |
| Fonts | `public/fonts/`, `src/fonts.css`, and preload entries in `index.html` when critical |
| Static case media | matching `public/case/<project>/` directory and its `src/data.js`/component reference |
| AVIF discovery behavior | `vite.config.js`, `src/avif.js` |
| Hosting, routes on refresh, cache policy | `vercel.json` |

## Important dependencies

| Package | Current role |
| --- | --- |
| `react`, `react-dom` | components, hooks, root rendering, portals, synchronous transition swaps |
| `gsap` | transition and interaction animation |
| `lenis` | smooth scrolling |
| `@gsap/react` | declared dependency; currently unused in source imports |
| `vite`, `@vitejs/plugin-react` | development server, transforms, bundling, page chunks |
| `eslint` and React plugins | static checks and Hooks/Refresh rules |

## Generated and supporting directories

- Do not edit `dist/`; regenerate it with the build script.
- Do not infer current UI from `.tmp-brand/`, `.tmp-motion/`, or `.tmp-refs/`.
- `reports/Agentic ဒီဇိုင်းစနစ် လမ်းပြမြေပုံ.md` and the matching `research_notes/` folder are research artifacts. They do not feed the runtime bundle.
- The public asset tree contains media for projects not currently represented by a `CASES` entry. Presence under `public/case/` alone does not make a project routable.

