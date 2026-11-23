# Design system and shared styling

Verified against the repository on 2026-11-23.

## CSS ownership and cascade

The application imports four global stylesheets from `src/main.jsx`:

1. `fonts.css` — self-hosted font faces.
2. `index.css` — original global reset, base tokens, older page and case-study foundations.
3. `selv.css` — a later glass-card/backdrop system and `sv-*` primitives.
4. `revamp.css` — the active editorial/home/case-study presentation; loaded last and intentionally flattens or overrides parts of the older systems.

`src/flowy/flowy.css` is imported only by the `/flowy` page and is scoped under `.fy`.

Because the layers are cumulative rather than isolated modules, check the same selector in later files before changing an earlier declaration. New work should extend the currently visible `em-*`, `rv-*`, `about-*`, and `contact-*` systems unless the target specifically belongs to an older `sv-*` primitive or the Flowy page.

## Active editorial tokens

`revamp.css` defines the final site-level palette and layout variables:

| Token | Verified value/purpose |
| --- | --- |
| `--rv-bg` | `#f5f5f7`, page background |
| `--rv-ink` | `#202833`, primary text |
| `--rv-soft` | `#424245`, secondary text |
| `--rv-muted` | `#6e6e73`, muted labels |
| `--rv-line` | `#d2d2d7`, rules and outlines |
| `--rv-paper` | `#ffffff`, paper/sheet surface |
| `--rv-frame` | responsive outer frame spacing |
| `--rv-gutter` | responsive content gutter |
| `--rv-title-tracking` | shared `-.012em` heading tracking, based on Home project titles |
| `--rv-dash-x`, `--rv-dash-y` | repeating dashed rules |

The site pairs Figtree body text with Satoshi headings and retains its Pristine Script wordmark, using Noto Sans Myanmar and system fallbacks. The main content column is capped at 1180px with 36px side clearance on wider layouts. The home page uses a split stage/work composition; About, Contact, and case studies use full-page editorial sheets.

Earlier variables remain important for components not fully restyled:

- `index.css`: `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--gutter`, `--radius`, and `--ease`.
- `selv.css`: `--sv-text`, `--sv-soft`, `--sv-dim`, `--sv-line`, `--sv-glass`, column widths, card radius/padding, and shared easing.
- Case studies set per-project `--acc` from `study.accent` when supplied.

## Typography

Fonts are self-hosted in `public/fonts/` and declared in `fonts.css`. Families include Figtree, Pristine Script, Geist Mono, Shantell Sans, Caveat, Dancing Script, DM Mono, Poppins, Satoshi, Cormorant Garamond, Jost, and Myanmar faces.

- `fonts.css` defines Figtree as the shared text stack in `--font` and Satoshi as the heading stack in `--font-display`, with Noto Sans Myanmar and system fallbacks. The wordmark uses Pristine Script.
- Terminal excerpts and inline code samples retain their monospace treatment.
- The UZ case uses Cormorant Garamond, Jost, and the bundled Myanmar fonts for brand-specific examples.
- The Flowy surface uses the shared Figtree stack.

Do not assume every declared font is globally active; verify the target selector.

## Shared component language

- `Topbar.jsx` supplies the active non-home masthead and hides on downward scrolling after the page passes 80px.
- `Home.jsx` renders the split landing page, interactive project rows, and project previews such as the POS, phone, Flowy card collage, brand book, and external-link arrow.
- `ui.jsx` provides generic cards, link-buttons, back buttons, icons, social/contact units, segmented filters, and take notes.
- `Media.jsx` is the shared case cover renderer with image, video, poster, mobile-video, reduced-motion, and Data Saver behavior.
- `CaseBlocks.jsx` contains structured research/product-story blocks such as flows, comparisons, journeys, decisions, blueprints, people, insights, wireframes, specs, achievements, and roadmaps.
- `Story.jsx` contains richer media and narrative blocks such as impact grids, roles, tables, walkthroughs, films, demos, device frames, before/after comparisons, rails, steps, IA trees, bilingual cards, and brand pillars.
- `useDragPill.js` centralizes pointer dragging for segmented controls and similar selection pills.

Case-study UI is data-driven. Add reusable story shapes to the renderer files and map them in `CaseStudy.jsx`; do not embed one-off route logic in `App.jsx`.

## Motion and interaction

- GSAP handles home hover movement, route sheet/rail transitions, and selected case-study effects.
- Lenis handles smooth page scrolling and is the only scroll controller components should call through `scrollToY`.
- Native View Transitions provide a fallback page cross-fade when supported.
- `.reveal` elements are activated by `App.jsx`, although `revamp.css` currently neutralizes older reveal styles and supplies its own targeted entrances.
- UI sounds are installed once by `main.jsx`; interactive links and controls get a select sound.

Reduced motion is a first-class behavior: JavaScript checks `prefers-reduced-motion`, and all major stylesheets contain reduced-motion overrides. Preserve a still/instant path for every new animation.

## Responsive behavior

The CSS uses feature-specific breakpoints rather than one global grid. The most common boundaries are:

- 1180px: wide-layout refinements.
- 1100/1080/1023/980/960px: dock, detailed case, or Flowy adaptations.
- 900/860px: case-study and page layouts collapse; `App.jsx` stops using the wide home-sheet transition below 861px.
- 760/720/700/680/640px: phone layouts, tighter gutters, smaller devices, and stacked grids.

Container queries are used for dense visualizations such as journey maps. Test the relevant component around its own documented breakpoint rather than relying on a single desktop/mobile pair.

Home sizes project-row padding against the space below the intro to show four full rows and roughly two thirds of the fifth on the initial view. Short screens keep a minimum padding so wrapped copy stays readable.

## Flowy tokens and components

`src/flowy/flowy.css` defines a separate semantic token system under `.fy`:

- core and semantic colors, led by action orange `#ff9e3d`;
- spacing steps from 4px through 24px;
- card radius 18px, control radius 14px, and pill radius 999px;
- semantic surfaces, lines, danger, time, ink, and muted text;
- shared card shadow and the site-wide font stack.

`src/flowy/components.jsx` implements Button, Segmented, SearchField, SelectField, OrderCard, ItemRow, and AdminNav. Keep Flowy changes within `.fy` and its files so portfolio-wide cascade changes do not leak into the reference surface.

## Accessibility conventions

- Visible keyboard focus uses explicit outlines.
- Current navigation uses `aria-current`; segmented controls expose pressed/tab state.
- Icon-only controls carry accessible names; decorative media uses empty alt text or `aria-hidden`.
- Videos are muted/inline where they are decorative, and meaningful media accepts descriptive labels/alt text.
- Popovers use `aria-expanded`, `aria-controls`, `inert`, Escape handling, and outside-click dismissal.
- Preserve semantic headings, lists, figures, definitions, and link behavior when changing layouts.

