# Redesign plan

Planning only. No site source, config, or package file was edited to produce this plan. Do not implement until this plan and `DESIGN_SYSTEM.md` are approved.

Workspace: this duplicate (`saimyothu-portfolio copy` on `main`). The original portfolio folder was not opened or modified.

Visual source: `Frame 1.pdf` (one Figma page, eight Apple.com screenshots). `references/moodboard/` has no images. `references/MOODBOARD_NOTES.md` is unfilled. Details, the three directions, and the token sheet live in `DESIGN_SYSTEM.md`. Recommended direction: **Daylight Studio**.

## Audit summary

| Fact | Evidence |
| --- | --- |
| Framework | Vite 8 + React 19. Entry `index.html` → `src/main.jsx` → `src/App.jsx`. Not Next.js. No Tailwind. |
| Routing | Hand-rolled in `src/pages.js`. `/` home, `/about` about, `/work/:slug` case study. `/work` and any other path render home. Vercel SPA rewrite in `vercel.json`. |
| Code splitting | `home`, `about`, and `case` are dynamic imports. The first route loads before paint. Others preload on idle unless `saveData`. |
| Styling | `src/fonts.css`, then `src/index.css` (2154 lines), then `src/selv.css` (2922 lines). Both stylesheets are live. `selv.css` says it is the glass layout and that `index.css` still styles case-study blocks. A class scan agrees: case blocks use `ig-*`, `cs-*`, `st-*`, and `jm-*` from `index.css`. |
| Current look | Dark page (`html` background `#050506` in `selv.css`, `#04091c` inline in `index.html`). Centered column `--sv-col: 692px` (860px on case studies). Frosted cards, floating icon dock, custom cursor, full-viewport backdrop. |
| Type | Figtree (self-hosted variable), DM Mono, Caveat, Dancing Script, Poppins. `index.css` mentions Gabarito, which is not loaded. |
| Motion | Lenis smooth scroll. CSS transitions. One GSAP use: the home “more work” fan (`src/components/Home.jsx`). View Transitions on route change. IntersectionObserver on `.reveal`. No ScrollTrigger in the current `src/` (the README still describes ScrollTrigger; that README is stale). |
| Data | All copy, routes’ content, and media paths in `src/data.js`. |
| Images | `src/avif.js` plus a Vite `define` of `__AVIF__` from JPEGs that have a matching AVIF. |
| Tests | No unit test script. Scripts in `package.json`: `dev`, `build`, `lint`, `preview`. |
| SEO | `<title>` is “Sai Myo Thu, Product Designer”. No description, Open Graph, canonical, sitemap, or robots file. |
| Hosting | `vercel.json` cache headers for fonts, `/assets/`, and media. |

`README.md` describes an older app (Grandslang, Fraunces, ScrollTrigger, a Playground, `Thumb.jsx`, a `?skip` loader). Those are not in the current `src/`. Do not follow the README as a map of this codebase. `Loader.jsx` does not implement `?skip`.

### Dependencies

Runtime: `react`, `react-dom`, `gsap`, `@gsap/react`, `lenis`.

Dev: Vite, React plugin, ESLint 10 and the React Hooks / Refresh plugins.

Do not add a framework, Tailwind, Framer Motion, or another animation library. GSAP can stay installed after the fan is removed. Do not give it new work unless a later approval says the CSS path failed.

### Global behavior worth keeping

- History API routing, scroll restoration in `sessionStorage` under `sv-scroll`, and the back button’s return to the previous scroll offset (`App.jsx`).
- Internal link clicks intercepted for paths starting with `/`. Modified clicks and `target="_blank"` still do the browser thing. `data-back` uses `history.back()` when there is a prior in-site entry.
- View Transition crossfade, skipped for reduced motion and older browsers.
- First-page code load before `createRoot` (`src/main.jsx`).
- “My take” open/close: button, click outside, Escape, focus return. About can open it through the `sv:take` event.
- Contact scrolls to the bottom of the page today (`Dock.jsx` `toBottom`), not to an element id. The connect card is the last content before the footer.
- Case “other work” memory in `sessionStorage` key `sv-seen-work`.
- Placeholder testimonials are never rendered.
- Behance is in `SOCIALS` with `href: '#'` and is filtered out in `Socials`.

## Pages and sections

### Home — `src/components/Home.jsx`

Order today:

1. Intro card. Portrait, name, sign-off, OrderFlow and Heizen links. The card links to `/about`. Hover reveals “About me”.
2. `HOME_WORK` as three large cards: OrderFlow, Superfine Employee, MTB Pay Merchant. Title and `result` visible.
3. `MORE_WORK` as a fanned hand: OrderFlow Landing Page, SFK Driver App, Merchant Experience. GSAP opens the hand on hover. Touch layout is reduced (`ANGLE_OPEN_NARROW`).
4. Testimonials.
5. About teaser. “The person behind the work.” Three photos.
6. `ConnectCard`.
7. `Footer` (rendered by `App.jsx` on every page).

`OTHERS_INTRO` in `data.js` is not rendered. `ABOUT.values` is not rendered on the home page, despite a comment that says a home strip uses it.

### About — `src/components/AboutPage.jsx`

1. Photo slideshow from `ABOUT.photos` (three photos, captions, 3s crossfade, reduced motion shortens it). “My take” can open from the photo.
2. Headline and two bio paragraphs. Core values render only if `ABOUT.showValues` is true. It is `false`.
3. “What a product designer does” renders only if `ABOUT.craft.show` is true. It is `false`. The copy and both tab lists remain in data.
4. Work experience, newest first, via `src/dates.js`. Resume link to `RESUME_URL`.
5. Testimonials.
6. Connect card.

`ABOUT.years` and `ABOUT.experienceLead` are not rendered. The year blurbs are marked in a comment as placeholder copy. Do not design a new “journey by age” section from them.

### Case study — `src/components/CaseStudy.jsx`

Cover (image or video), back control, title, overview, impact if it is the first section, facts, remaining sections, two “other work” cards, connect. Sticky section index when there is more than one section. Unknown slug: “Project not found” and a link home.

Block kinds that must keep working, from `data.js`: `lead`, `notes`, `flows`, `impact`, `shot`, `iconlist`, `stats`, `loop`, `compare2`, `role`, `segments`, `table`, `hub`, `mockpair`, `photos`, `arch`, `decisions`, `ship`, `steps`, `journeymap`, `choices`, `demo`. Renderers live in `src/components/Story.jsx`, `src/components/CaseBlocks.jsx`, and `CaseStudy.jsx`.

### Chrome

| Piece | File | Role |
| --- | --- | --- |
| Backdrop | `src/components/Backdrop.jsx` | `BACKDROP = 'calm'` shows `public/bg-calm.jpg`. Other modes exist in CSS and `LofiRoom.jsx` / `BackdropScenes.jsx`. |
| Dock | `src/components/Dock.jsx` | Works, About, Contact, Resume, My take. Vertical from 1101px, horizontal bar at `max-width: 1100px`. Drag the selection pill between page links. |
| Cursor | `src/components/Cursor.jsx` | Custom cursor. `index.html` sets `cursor: none` on fine pointers when motion is allowed. |
| Loader | `src/components/Loader.jsx` | First load only. At least 1s, at most 3s, then a panel exit. Reduced motion shortens it. |
| Footer | `src/components/Footer.jsx` | Sign-off and back to top. |

## Preservation matrix

Status key: **keep** means the content and behavior survive. **restyle** means the same content in the new presentation. **hidden** means it stays in data and stays off the page. **decision** means it changes only with an explicit yes.

| Source | What it is | Proposed destination | Status |
| --- | --- | --- | --- |
| `PROFILE` in `src/data.js` | Name, role, tagline, sign-off, portrait crop, OrderFlow and Heizen links | Home hero and footer | keep, restyle |
| `NAV` | Works `/`, About `/about`, Contact bottom scroll, Resume external | Quiet top nav, same targets | keep, restyle |
| `RESUME_URL` | Google Drive PDF | Resume control, new tab | keep |
| `public/Sai-Myo-Thu-Resume.pdf` | Local PDF, not referenced by `NAV` | Leave the file. Do not swap the link unless asked | keep unused |
| `HOME_WORK` | orderflow, superfine-employee, mtb-pay-merchant | Three home stages, same order | keep |
| `MORE_WORK` | orderflow-landing, sfk-driver-app, merchant-experience | Horizontal rail, same order | keep, restyle |
| `CASES` orderflow | “OrderFlow for F&B Business”, result “35.7M MMK in revenue through OrderFlow”, full study | `/work/orderflow` | keep |
| `CASES` superfine-employee | “Corporate Meal Order”, “$173K in lunch orders in the first 6 weeks” | `/work/superfine-employee` | keep |
| `CASES` sfk-driver-app | “SFK Driver App”, “Prototyped in three sprints” | `/work/sfk-driver-app` | keep |
| `CASES` mtb-pay-merchant | “MTB Pay Merchant”, “A merchant wallet used by 100+ merchants”, Play Store and App Store URLs inside the study | `/work/mtb-pay-merchant` | keep |
| `CASES` orderflow-landing | “OrderFlow Landing Page” | `/work/orderflow-landing` | keep |
| `CASES` merchant-experience | “Merchant Experience” | `/work/merchant-experience` | keep |
| `CASES` retina-ai | Full study, not in `HOME_WORK` or `MORE_WORK` | `/work/retina-ai` still resolves. Not added to the home page | keep, decision if it should be listed |
| `CASES` heizen-studio | Full study, same | `/work/heizen-studio` | keep, decision if it should be listed |
| `CASES` heizen-supply-chain | Full study, same | `/work/heizen-supply-chain` | keep, decision if it should be listed |
| `featured: true` | Set on OrderFlow and Superfine. Comment talks about an old Work page | Do not drive layout from this flag. Home uses the two arrays | keep data, do not repurpose |
| Every `study.sections` entry, tool list, role, team, duration, alt text | Case narrative | Same components, new chrome and type | keep |
| `TESTIMONIALS` without `placeholder` | Aman Arora, Pedrom Rejai, Haard Shah, Sheldon Dcosta, with photos | Quote block on home and about | keep |
| Placeholder testimonials | May Thandar, Daniel Reyes, Htet Aung, Priya Nair | Stay unrendered | hidden |
| `ABOUT.headline`, `bio`, `experience`, `photos`, captions | About page | Same page, new layout | keep |
| `ABOUT.showValues`, `craft.show` | Both false | Stay hidden | hidden |
| `ABOUT.takes`, `takeSign` | Six sentences and “Sai” | Still available from nav and about | keep, restyle. Script face is a decision |
| `ABOUT.years`, `experienceLead`, `OTHERS_INTRO` | Unused | Leave in `data.js`. Do not mount them | hidden |
| `SOCIALS`, `EMAIL`, `CONTACT_HINTS` | LinkedIn, WhatsApp, Facebook, mailto `smyothu319@gmail.com`, hover hints. Behance hidden | Connect card | keep |
| `index.html` title | “Sai Myo Thu, Product Designer” | Same | keep |
| Favicons, `apple-touch-icon.png` | Existing icons | Same files | keep |
| Case media under `public/case/**`, people, logos, illustrations | Real project art | Same URLs | keep |
| `tools/case-video/**` | Offline film pipeline | Untouched | leave |
| `.claude/worktrees/**` | Old worktree | Untouched | leave |
| Backdrop modes and Unsplash comments in `selv.css` | Decorative full-page scenes | Unmounted in the recommended direction | decision |
| Custom cursor | `Cursor.jsx` and `cursor: none` | Removed in the recommended direction | decision |
| Loader panels | 1–3s intro | Shortened to a non-blocking or very short wait | decision |
| Dock drag-to-navigate | `useDragPill.js` | Not part of the text nav. Drag remains on case filters if those controls stay | decision for the dock only |
| `/work` and unknown URLs render home | `parseRoute` | Same | keep |
| Lenis scroll restoration | `App.jsx` | Keep programmatic scroll. Disable smooth wheel under reduced motion | restyle behavior, small |
| ESLint issues in `Dock.jsx` and `tools/case-video` | Pre-existing | Not a redesign task | leave |

Outbound URLs that must keep working:

- https://orderflowmm.com/
- https://www.heizen.work/
- https://drive.google.com/file/d/1ttu2gmFXslg1PrH6z5P8ztkYimWgyUum/view?usp=sharing
- https://www.linkedin.com/in/sai-myo-thu-7399b6227/
- https://wa.me/959952871461
- https://www.facebook.com/sai.myo.thu.733675/
- https://play.google.com/store/apps/details?id=com.mtb.merchant
- https://apps.apple.com/us/app/mtb-pay-merchant/id6756643448
- `mailto:smyothu319@gmail.com`

Copy stays word for word. Asterisk emphasis in case titles (`*ecosystem*`) is an existing pattern in `data.js`. Keep the parser that renders it. Do not invent metrics, clients, or quotes.

## Information architecture

Routes stay. Section order on the home page, and why:

1. **Nav.** The board’s sites put wayfinding in a thin bar before the hero. The current dock is a second visual system.
2. **Hero.** Name and one sentence. The board’s heroes say one thing. The portrait is supporting, because the work is the picture.
3. **Selected work.** The three studies already chosen in `HOME_WORK`, one stage each. This is the cinematic part of the board, applied to real covers.
4. **More work.** The three studies in `MORE_WORK`, as a row. This is the catalog part of the board, used only here so the page still has one primary idea.
5. **Testimonials.** Social proof after the work, using only the four real quotes.
6. **About teaser.** One sentence and a path to `/about`, with the photos already in the teaser.
7. **Contact.** The existing coffee line and the real channels.
8. **Footer.** Sign-off, back to top, repeat of the nav.

About order stays: photos, statement and bio, experience, testimonials, contact. Hidden blocks stay hidden.

Case study order stays: cover, overview, impact, facts, sections, other work, contact. The sticky index stays on wide screens.

The three unlisted studies (Retina AI, Heizen Studio, Heizen Discovery Tool) remain direct-link pages. Listing them on the home page would be a content change. It is an approval item, not part of the default plan.

## Components

| Action | Pieces |
| --- | --- |
| Reuse as-is | `src/data.js` content, `src/pages.js`, `src/avif.js`, `src/dates.js`, `src/scroll.js`, `vite.config.js` AVIF define, `vercel.json`, font files, public case media |
| Refactor presentation | `Home.jsx`, `AboutPage.jsx`, `CaseStudy.jsx` chrome, `Dock.jsx` into the quiet nav, `Footer.jsx`, `ui.jsx` (`Card`, `Button`, `ConnectCard`, `Socials`, `TakeNote`), `Testimonials.jsx`, `Media.jsx` framing, `index.css` and `selv.css` tokens and surfaces |
| Add | Presentational structure only, inside existing components if possible: stage, rail, spec grid, split. No new route, no new data model. A separate `TopNav.jsx` is acceptable if `Dock.jsx` would become unreadable. Same props and links |
| Restyle later, do not restructure | `Story.jsx`, `CaseBlocks.jsx`, `Illos.jsx`, before/after, reels, demos, flow switch, journey map |
| Leave untouched | `tools/**`, `.claude/**`, `public/case/**` bytes, package files |
| Remove from the render tree only after approval | `Backdrop.jsx` usage in `App.jsx`, `Cursor.jsx`, the loader’s panel sequence. Delete files only in a cleanup pass after the new UI is approved. Until then, unmounting is enough |

`Card` today is a glass box. In Daylight Studio a card is paper on paper, or a sunken panel. Keep the component so existing `as="a"` and class hooks still work. Change its paint.

## Section-by-section specification

This is the build recipe for Daylight Studio. Tokens are in `DESIGN_SYSTEM.md`.

### Navigation

Files: `src/components/Dock.jsx` or a new nav component, `src/App.jsx`, `src/selv.css`, later `index.html` if the cursor rule goes.

- Render `NAV` in order, then “My take” when `ABOUT.takes` has entries.
- Works is current on `/` and on `/work/...` only if the current rule says so. Today `isActive` treats `/` as current only when the path is exactly `/`. Case studies do not highlight Works. Keep that, so a case study is not pretending to be the index.
- Contact still moves to the connect card. Give the card `id="contact"` and scroll to it. That matches the `href: '#contact'` already in the data. Today the click ignores the hash and jumps to `scrollHeight`. Scrolling to the card is the same destination as long as the card stays immediately above the footer. If the footer should be included in the jump, scroll to the card and let the footer sit below it. Do not leave a hash that does nothing.
- Resume stays `target="_blank"` with `rel="noopener noreferrer"`.
- Drag-to-switch pages does not transfer to a text nav. Keyboard order is the visual order.
- At `max-width: 720px` the bar wraps under the links. It is not `position: fixed` at the bottom.

### Hero

File: `Home.jsx` `Intro`, styles in `selv.css`.

- `h1` is `PROFILE.name`.
- Eyebrow is `PROFILE.role`.
- The sentence is `PROFILE.tagline`.
- The line under it is `PROFILE.signoff` plus `PROFILE.note`, including both outbound links, which must remain clickable and not covered by a stretched card link.
- One control: “Selected work” to `#work`. The whole hero is not a link to About. About remains in the nav and in the teaser. A full-card link plus inline links is how the current intro works, and it makes the OrderFlow and Heizen links fight the card. Split them.
- Portrait uses `PROFILE.portrait` and `PROFILE.avatar` crop, 72px, `role="img"` and the existing name as the accessible name. Decorative if the `h1` already says the name. Prefer the `h1` as the name and mark the image decorative (`alt=""`) so the name is not announced twice. That is a small semantics change. Keep the accessible name on the image if the `h1` is ever visually hidden.

### Selected work

File: `Home.jsx` `MainWork`.

- Wrapper `id="work"`.
- Map `HOME_WORK` through `CASES` as now. Skip nothing silently. A missing slug is already filtered.
- Each stage links to `/work/${slug}`.
- Visible text: `title`, `result` when present.
- Media: existing `Media` with the thumb when `art.thumb` is set, eager on the first, same as today.
- OrderFlow’s page cover video stays on the case study. The home card may keep using the thumb so the home page does not start three videos. Do not invent a new cut.

### More work

File: `Home.jsx` `Portfolio`.

- Remove the GSAP pose, the pointer tracking, and the hover-dimming.
- Render `MORE_WORK` as links with thumb, `title`, and `short` (fall back to `desc` if `short` is absent).
- Horizontal scroll, snap, keyboard-focusable links. On a keyboard, focusing a card should scroll it into view (`scroll-margin`).
- Reduced motion: no fan spring. The row is static.

### Testimonials, teaser, contact, footer

Files: `Testimonials.jsx`, `Home.jsx` `AboutTeaser`, `ui.jsx`, `Footer.jsx`.

- Quotes: same four people, same words, same photos, same controls.
- Teaser: same heading, same “Read my story”, same three images, still a link to `/about`.
- Connect: same title and hints. Add the email address as text next to the mailto icon. `id="contact"`.
- Footer: same sign-off, same back-to-top through Lenis. Add the nav labels as a caption row of the same `NAV` links.

### About

File: `AboutPage.jsx`.

- Slideshow sources, alts, captions, and positions stay.
- Headline and bio stay verbatim, including “I’m 23”.
- Experience rows stay: company, role, years, resume button. Logos in the data are optional and are not all shown in the current row. Do not drop a logo into the row unless the current UI already shows it. Today `Role` renders company, role, and years only.
- Do not flip `showValues` or `craft.show`.
- “My take” copy stays. Visual moves from Caveat / Dancing Script to Figtree if that decision is approved.

### Case studies

Files: `CaseStudy.jsx` first, then CSS for blocks.

- Do not edit `data.js` strings.
- Cover, back link, facts, section ids, and the index all stay.
- Impact and stats pick up SpecGrid styling.
- `kind: 'shot'` and videos keep their aspect ratios and alts.
- External store links keep their labels and `rel`.
- “Other work” algorithm stays on `HOME_WORK` + `MORE_WORK` only, so the unlisted studies do not suddenly enter that rotator.
- Light plates behind UI (`selv.css` comment around the case study) need a new relationship to the paper page. Screens that were “light on dark glass” may sit on `--color-bg-elevated` with a hairline. Check each block family before changing it. This is the riskiest visual pass.

## Phases

Each phase is one reviewable slice after approval. Do not start them in this planning task.

| Phase | Work | Files | Done when |
| --- | --- | --- | --- |
| 1. Tokens | Add the variables from `DESIGN_SYSTEM.md`. Point body, headings, and focus at them. Leave case-block colors alone if they would become illegible | `src/index.css`, `src/selv.css`, `index.html` background only | Type is Figtree on paper. Focus ring visible. Case pages still readable |
| 2. Nav | Text nav, same links, contact scroll, resume, my take | `Dock.jsx` or new component, `App.jsx`, nav CSS | Keyboard through every item. 375 and 1440 both usable. No bottom overlap |
| 3. Hero | Replace the intro card | `Home.jsx`, hero CSS | Name, tagline, both outbound links, one action. No hover-only text |
| 4. Work | Stages and rail. Stop the GSAP fan | `Home.jsx`, `Media.jsx` only if framing requires it | All six linked projects visible by name without hover |
| 5. Home close | Quotes, teaser, contact, footer | `Testimonials.jsx`, `ui.jsx`, `Footer.jsx`, `Home.jsx` | Email, three socials, resume still from the nav, back to top works |
| 6. About | Paper layout for the existing about structure | `AboutPage.jsx`, related CSS | Bio, six jobs, three photos, quotes unchanged |
| 7. Case chrome | Cover, facts, index, other work, page background | `CaseStudy.jsx`, case CSS | All nine slugs render. Unknown slug still shows the not-found card |
| 8. Case blocks | Restyle `cs-*`, `st-*`, `ig-*`, `jm-*` in families, one family per commit | `index.css`, `selv.css`. Markup only if a color cannot be fixed in CSS | Walkthroughs, films, before/after, journey map, and store buttons still work |
| 9. Approved removals | Backdrop, custom cursor, loader theatrics | `App.jsx`, `index.html`, component files | Only the items the approval names |
| 10. QA | `portfolio-visual-qa` skill. Write `QA_REPORT.md` | — | Lint, build, and the viewports in that skill |

Inside a phase: smallest change that completes the slice, then look at 375 and 1440. Do not restyle ahead of the phase.

## Technical requirements

- Stay on Vite, React, and the current file layout.
- No new dependencies.
- CSS variables are the source of truth. Do not introduce a second token system in JS.
- `index.css` and `selv.css` both stay until phase 8 proves a block no longer needs a rule. Deleting `index.css` early will strip case studies.
- Image elements keep width and height or a CSS `aspect-ratio` from the existing data (`aspect`, `ratio`). Lazy-load below the first screen. The first home media stays eager.
- Videos: do not raise bitrate or add new masters. The pipeline in `tools/case-video/` is out of scope.
- `prefers-reduced-motion` is required on every new transition. Follow the patterns already in `selv.css`.
- Focus styles are not removed by `outline: none` without a replacement.
- Internal links stay `<a href>`. The app’s click handler upgrades them. Do not switch them to `onClick` only.
- Forms: there is no contact form. Do not add one.
- SEO: keep the title. Do not invent a meta description in the implementation unless a separate approval supplies the sentence.
- Analytics: none found. Do not add any.
- Performance: the home page should not autoplay every case film. One eager image. Lenis stays off the reduced-motion path’s wheel smoothing.

## Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Two big CSS files | A token change in `:root` can wash out light plates inside dark cards, or the reverse | Phase 1 only changes the page shell. Phase 8 is per block family |
| Case studies are the product | Most of the portfolio’s substance is in `Story.jsx` and `data.js` | Chrome first. Blocks keep their DOM |
| Hover fan | Names of `MORE_WORK` are easy to lose on a phone | Rail shows the name always |
| Custom cursor and `cursor: none` | Hides the system cursor on fine pointers | Remove only with approval, and remove both the component and the inline style together |
| Lenis | Changes wheel behavior for everyone | Keep `scrollTo`. Gate `smoothWheel` on reduced motion |
| GSAP and CSS | Double-animating transform | After the fan is gone, no GSAP calls remain in `Home.jsx` |
| Loader | Blocks first paint for up to 3 seconds | Shorten only with approval. Content underneath must exist if JS is slow. The root is empty until `loadPage` resolves today. Do not make that worse |
| Unlisted studies | Easy to forget in a visual pass | Hit `/work/retina-ai`, `/work/heizen-studio`, and `/work/heizen-supply-chain` in QA |
| Stale README | An implementer might recreate ScrollTrigger or a playground | Ignore the README’s animation section |
| Lint baseline | `npm run lint` already exits 1 | Do not treat those errors as caused by the redesign. Do not expand scope into `tools/case-video` |
| Contrast on sunken panels | `--color-faint` is tuned for `#f3f1ec` | Use ink or `--color-muted` on `#e7e2d8` |
| Apple resemblance | Centered black heroes and pill buttons drift toward a clone | Follow the identity check at the end of `DESIGN_SYSTEM.md` |

## Baseline checks

Run from this duplicate on 17 Nov 2026. No packages were installed.

`npm run lint` (`eslint .`) exited 1. Pre-existing, not caused by this plan:

- `src/App.jsx` — warning, `useEffect` missing `navigate` (`react-hooks/exhaustive-deps`).
- `src/components/Dock.jsx` — error, `setState` inside an effect (`react-hooks/set-state-in-effect`).
- The same two findings in `.claude/worktrees/of-cover-short-stand/`.
- `tools/case-video/_painters.js` and `tools/case-video/pos3d/scene.js` — many `no-undef` / unused vars. The worktree copies of those files fail the same way.

`npm run build` was not run. It writes `dist/`, which is gitignored. Build belongs in phase 10, not in planning.

No browser pass was done. Nothing visual was changed.

## Decisions that need approval

1. **Direction.** Daylight Studio is the recommendation. Night Reel and Editorial Index are the alternatives in `DESIGN_SYSTEM.md`.
2. **Light page.** This reverses the current dark glass site. Say if the dark atmosphere should stay.
3. **Nav.** Text bar instead of the icon dock, including drop of drag-to-switch.
4. **Cursor, backdrop, and loader.** Recommended: retire the custom cursor and the full-page backdrop, and shorten the loader. They can stay through phases 1–8 and be removed in phase 9.
5. **“My take” in Figtree** instead of Caveat and Dancing Script. The sentences stay.
6. **Unlisted studies.** Leave Retina AI, Heizen Studio, and Heizen Discovery Tool off the home page, or add them to a rail. Default: leave them off, keep the URLs.
7. **Hero portrait.** Small circle beside the name, not the current large card. About keeps the large photos.
8. **Lenis.** Keep, with smooth wheel disabled under reduced motion. Say if smooth wheel should be disabled for everyone.
9. **Meta description.** None exists. Supply a sentence if one should be added. Otherwise the title stays as it is.

## What this plan will not do

- It will not replace projects with samples, rewrite biography, or add testimonials.
- It will not copy Apple’s logo, product photos, navigation labels, burgundy campaign color, legal footer, or type files.
- It will not migrate the framework or install libraries for the look of it.
- It will not edit the original portfolio, deploy, or start implementation before approval.
