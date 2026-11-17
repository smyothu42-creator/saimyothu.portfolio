# Design system

Recommended direction: **Daylight Studio**.

This is a visual specification for the existing Vite + React portfolio. It does not change the site. Implementation waits for approval of this file and `REDESIGN_PLAN.md`.

Stack fact: styles are plain CSS custom properties in `src/index.css` and `src/selv.css`. There is no Tailwind config. Tokens below are CSS variables for those files.

## Thesis

A warm paper page. One idea on screen at a time. The work is the picture. Type does the layout. Motion only explains a change.

Five words: quiet, exact, spacious, editorial, assured.

The page ground is light. Dark is a stage for a single project, not the color of the whole site. Proof sits in a calm grid. Secondary projects sit in a sideways row. Nothing on the page borrows Apple’s name, mark, products, photography, navigation, or campaign colors.

## What was actually looked at

`references/moodboard/` has no images. It contains only `ADD-YOUR-IMAGES-HERE.txt`. `references/MOODBOARD_NOTES.md` is an unfilled template: role, audience, three words, light or dark preference, must-keep, must-avoid, per-image notes, and importance are all blank. Those notes cannot rank anything.

The visual source is the uploaded Figma export `Frame 1.pdf` (one page, 4280 × 4150 pt, producer Figma, title “Frame 1”, no extractable text). Eight JPEG screenshots are embedded in that page. Each was extracted and viewed, and the whole page was rendered and viewed. Observations below come from those views. Where a description is soft, the confidence column says so.

| # | What the frame shows | Pixel size |
| --- | --- | --- |
| 1 | Dark product hero. Centered hardware, large white name, one paragraph, two pill buttons, thin top navigation. | 1199 × 690 |
| 2 | White spec section. A phone cropped at the top, then an asymmetric grid of short claims with hairline rules. | 736 × 808 |
| 3 | White legal and link footer. Small grey text, then a multi-column link index. | 1921 × 993 |
| 4 | Light product index. Large wordmark, category links, a row of white product cards with a picture, price, and one blue button. The row is cut off on the right. | 1914 × 989 |
| 5 | White page with one black rounded stage. Product name and tagline on the stage, product crossing large type, pill buttons, a pause control under the stage. | 1923 × 992 |
| 6 | Light section. Large left headline, a text link on the right, a horizontal row of white cards (title, short copy, product picture). Cards run off the right edge. Arrow controls. | 1918 × 987 |
| 7 | Light split. Large headline, then a pale rounded panel: accordion text on the left, one product photograph on the right. | 1919 × 989 |
| 8 | Dark full-bleed statement. Huge centered headline, one paragraph, a row of small service icons, a darker band with one pill button. | 1914 × 983 |

The board itself sits on a light grey ground. Dark frames and light frames are mixed. There is no annotation on the PDF.

## Reference → decision

| Source | Visible cue | Decision | Why | Confidence |
| --- | --- | --- | --- | --- |
| Frames 2, 4, 5, 6, 7 and the board ground | Most of the surface is white or off-white | Page background is warm paper, not the current near-black glass | Five of eight frames, plus the canvas, are light. Dark is used for a moment, then the page returns to light | High |
| Frames 1, 5, 8 | Near-black field, one product or one sentence, lots of empty space | Selected projects get a wide stage. One project, one picture, one result line | Those frames are the cinematic moments. They should be sections, not the site chrome | High |
| Frames 1, 6, 8 | One dominant headline, short support copy, a single next step | Hero and section intros: one heading, one sentence, one action | Repeated hierarchy. A second filled button is a store pattern and is not used | High |
| Frame 2 | Big numeral or short claim, small explanation, uneven grid, hairlines | Impact numbers use this rhythm: large figure, quiet label, no icon tiles | OrderFlow, Superfine, and MTB already have real figures in `data.js` | High |
| Frame 4 and 6 | Equal cards in a row that continues past the viewport | `MORE_WORK` is a horizontal rail. Name and result are visible without hover | The frames show a row of choices, not a stack that hides its labels | High |
| Frame 7 | Headline, then text that changes beside one picture | About teaser and long case explanations can use a split: copy on the left, one real image on the right | Direct compositional match for “The person behind the work” and for case walkthroughs | High |
| Frame 5 | Pause control under a moving stage | Case videos keep a visible pause. Autoplaying film never traps the scroll | The only motion control in the board is pause | Medium. The frame shows a carousel pause, not a documented scroll spec |
| Frame 3 | Small type, many columns of links | Footer is small and quiet, and it only lists links the site already has | The density is real. A fake corporate sitemap would invent structure | High |
| Frames 1, 4, 5, 8 | Thin top bar, text items, no floating icon dock | Main navigation becomes a slim top bar with the existing labels | The dock is current-site chrome. It does not appear in any frame | High |
| All frames | System cursor, no glass blur, no custom pointer | Custom cursor and frosted-glass cards leave the visual system | None of the eight frames use them | High |
| Frames 1, 4, 5 | Pill buttons, blue fill on some of them | One pill style for the single primary action. Fill is the portfolio accent, not Apple blue | Shape is transferable. The blue and the burgundy wordmark are campaign colors | High |
| Frame 4 | Burgundy “Shop Mac” and a patterned logo | Not used | Seasonal brand color and a trademark | High |
| All frames | San Francisco-like neutral grotesque, tight large type, loose small type | Stay on the self-hosted Figtree already in `src/fonts.css`. Retune size, weight, and tracking. Do not add a proprietary face | Figtree is the loaded UI face. A second display family is not justified | Medium. The exact face in the screenshots was not measured |
| Frames 4, 6 | Soft card radius, light shadow, white card on grey | Cards use a small radius and a short shadow. Radius is not 32px on every surface | Current `--sv-r: 32px` glass is a different material | Medium |
| No frame | No light/dark toggle | No theme switch in this redesign. Light page, dark stages | The board is not a paired theme | High |
| Notes file | Empty | No personal “must keep” color or motif is on record | Cannot claim the current navy glass or the lo-fi room was requested | High |

## Conflicts

The frames disagree in two places. The notes file does not break the tie, so the choice follows how often the cue appears, then what a case-study portfolio can support.

1. **Light page vs dark page.** Frames 1 and 8 are fully dark. Frames 2, 3, 4, 6, and 7 are light. Frame 5 is a dark stage on a light page. Decision: light page, dark stage. A full dark site would follow two frames and ignore five.
2. **One hero vs a catalog grid.** Frames 1, 5, and 8 show one subject. Frame 4 shows many products. Decision: `HOME_WORK` (three studies) is staged one at a time. `MORE_WORK` (three studies) uses the row. Nine equal cards would turn the home page into a catalog.

## Directions

### 1. Daylight Studio — recommended

Warm paper (`#f3f1ec`). Ink (`#161513`). One deep blue (`#1b3a4b`) for links and the single filled button.

Home, using copy that already exists:

- Top bar: Works, About, Contact, Resume, and the existing “My take” control.
- Hero: `PROFILE.name` as the display line, `PROFILE.role` as the eyebrow, `PROFILE.tagline` as the sentence, then the existing sign-off and the OrderFlow and Heizen links. One action scrolls to selected work. The portrait stays small so it does not compete with the type.
- Selected work: the three `HOME_WORK` studies, each a wide stage. OrderFlow can use its existing cover video. Superfine Employee and MTB Pay Merchant use their existing thumbs. Title and `result` are always visible.
- More work: `MORE_WORK` in a horizontal rail. `short` or `result` stays visible. No hover-only name.
- Proof: the four real testimonials, one at a time.
- About teaser: “The person behind the work.” plus the three photos already chosen in `Home.jsx`.
- Contact: “Let's talk over coffee”, the live social links, mailto, and the existing hints.

Case studies keep every section. The first impact block becomes the spec grid. A long walkthrough can use the split (copy, then the real screen). The side index stays.

This direction is the one to build. It uses both families of frames in the proportion they appear, and it gives the existing films a stage without painting the whole site black.

### 2. Night Reel

The whole page stays near-black, closer to frames 1 and 8 and to today’s site. The name is centered and very large. One case cover sits in the middle like a product shot. Selected work is a sequence of dark stages. Pill buttons are light on black.

Use this only if the dark atmosphere should survive. It fights the majority of the board, and it is close to an Apple product-hero clone if the type is centered on pure black with two pills. It also keeps the current site’s mood, which the board does not show.

### 3. Editorial Index

Light page, no dark stages. The hero is the tagline, set large and left-aligned, in the manner of frame 6. OrderFlow’s four real figures (`4`, `1,300+`, `60 / 60`, `35.7M`) become the first proof grid, in the manner of frame 2. Projects are only the horizontal cards. About uses the frame 7 split.

Use this if the site should read as an argument before it reads as a showreel. It underuses the cinematic frames and the cover videos that already exist.

## Color

All pairs below were checked against WCAG AA for normal text (4.5:1). Large display type is well above 3:1.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-bg` | `#f3f1ec` | Page. Warm paper, distinct from a cool store grey |
| `--color-bg-elevated` | `#fffcf8` | Cards on the paper |
| `--color-bg-sunken` | `#e7e2d8` | Rails and accordion panels |
| `--color-ink` | `#161513` | Headings and body. 16.2:1 on paper |
| `--color-muted` | `#5c574f` | Support text. 6.4:1 on paper |
| `--color-faint` | `#6a645c` | Eyebrows and captions. 5.2:1 on paper |
| `--color-line` | `rgba(22, 21, 19, 0.10)` | Hairlines |
| `--color-accent` | `#1b3a4b` | Links, focus, the one filled button. 10.6:1 with paper |
| `--color-accent-ink` | `#f3f1ec` | Text on the accent fill |
| `--color-stage` | `#101010` | Project stages |
| `--color-stage-ink` | `#f4f2ee` | Type on a stage. 17:1 |
| `--color-stage-muted` | `#c9c4bb` | Support type on a stage. 11:1 |
| `--color-focus` | `#1b3a4b` | 2px outline, 3px offset |

`--color-accent` is a deep ink blue in the family of the OrderFlow cover (`#1f3a5f` in `data.js`). It is not `#0071e3`. Do not introduce the burgundy from frame 4.

There is no second accent, no gradient mesh, and no glass tint. Project art brings the color. Logos already in `public/logos/` stay inside the work, at their real colors.

## Typography

Loaded and licensed for this repo (`src/fonts.css`):

- **Figtree** variable, 300–900, Latin and Latin-ext, normal and italic. This is the UI and display face.
- **DM Mono** 400 and 500. Use it only for timestamps, tool names in facts, and the loader count if the loader stays. Do not set body copy in mono.
- **Caveat** and **Dancing Script** are loaded for “My take”. The recommended direction sets those quotes in Figtree. Keep the font files until that choice is approved. See the plan’s approval list.
- **Poppins** is used once, on `.cs-step-scale`. Leave that rule until the case-block phase. Do not spread Poppins.
- `index.css` names Gabarito. That family is not in `fonts.css`. `selv.css` overrides `--font` to Figtree because it loads second. Do not add Gabarito.

Do not load San Francisco, New York, or any other proprietary face. The fallback stack stays `"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` so missing files still render. The fallback is a fallback, not the design.

| Role | Size | Weight | Line height | Tracking | Measure |
| --- | --- | --- | --- | --- | --- |
| Display | `clamp(40px, 6vw, 76px)` | 560 | 0.98 | -0.035em | 12ch, intentional breaks |
| Section | `clamp(32px, 4vw, 52px)` | 560 | 1.02 | -0.03em | 18ch |
| Stage title | `clamp(28px, 3vw, 40px)` | 560 | 1.05 | -0.03em | — |
| Lead | `clamp(18px, 1.4vw, 22px)` | 430 | 1.4 | -0.011em | 38rem |
| Body | 17px, 18px from 720px | 400 | 1.5 | -0.005em | 40rem |
| Card title | 22px | 560 | 1.15 | -0.02em | — |
| Eyebrow | 13px | 500 | 1.3 | 0.01em | — |
| Caption | 14px | 400 | 1.4 | 0 | — |
| Nav | 14px | 500 | 1 | 0 | — |
| Fact label | 12px DM Mono | 500 | 1.3 | 0.04em | — |

Eyebrows are sentence case. The board’s small labels are not shouted in all caps.

Line breaks on the display line are part of the design. On a 375px screen the name may wrap to two lines. Do not shrink it until it fits on one line. The tagline stays one or two sentences. Do not rewrite it.

## Space, grid, radius, shadow

Spacing scale, in px: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.

| Token | Value | Use |
| --- | --- | --- |
| `--space-section` | 128px desktop, 96px at ≤1100px, 64px at ≤720px | Between home sections |
| `--page-pad` | 48px / 32px / 20px at the same breaks | Page inset |
| `--measure` | 40rem | Long case copy |
| `--col` | 720px | Hero and about text |
| `--feature` | `min(1120px, calc(100% - 2 * var(--page-pad)))` | Splits, spec grids |
| `--stage` | `min(1280px, calc(100% - 32px))` | Project stages |

Today the live column is `--sv-col: 692px` in `selv.css`, with a wider 860px on case studies. That narrow column is the current layout. Daylight Studio widens the feature and stage widths and keeps prose inside `--measure`. Do not stretch body copy to the stage width.

| Token | Value |
| --- | --- |
| `--radius-stage` | 28px |
| `--radius-card` | 20px |
| `--radius-media` | 16px |
| `--radius-pill` | 999px |
| `--shadow-card` | `0 1px 0 rgba(22,21,19,0.04), 0 18px 40px -28px rgba(22,21,19,0.28)` |
| `--shadow-stage` | `0 24px 50px -36px rgba(0,0,0,0.45)` |

Hairline borders replace glass strokes. One shadow recipe. No colored glow.

Breakpoints to design against: 375, 720, 1100, 1440. 720 and 1100 match existing CSS cuts (`max-width: 720px`, dock flip at 1100px). Also check 320 and 1920 in QA. There is no breakpoint token file. Write ordinary media queries.

## Imagery

Use only files already referenced by `src/data.js` and the components: case covers, thumbs, flow stills, mp4 films, portraits, and logos. The AVIF swap in `src/avif.js` stays.

Treatment:

- A UI screenshot sits `object-fit: contain` on `--color-bg-elevated` or on the stage, with its real aspect ratio. Do not crop a product screen to fill a frame.
- A photograph may use `object-fit: cover` when the component already sets a crop (the about slideshow positions are data).
- Stages get a fixed aspect (`16 / 9` for covers that are already 16:9, the component’s existing ratio otherwise) so the page does not jump.
- Video posters stay. Muted inline video may play, with a pause control. `prefers-reduced-motion: reduce` shows the poster and does not autoplay. `Media.jsx` already checks reduced motion and save-data. Keep that.
- No new generated mockups, no stock people, no Apple product photos.
- Backdrop photos in `public/bg*.jpg` and the drawn lo-fi room are atmosphere, not case art. The recommended direction does not show them. Leave the files.

## Components

### QuietNav

Replaces the visual role of `Dock.jsx`. Same destinations as `NAV` in `data.js`: `/` (Works), `/about`, Contact (scroll to the connect card), Resume (`RESUME_URL`, new tab). “My take” stays a button, `aria-expanded`, Escape to close, focus returns to the button.

Desktop: one row, paper background, 14px, current page in ink, others in muted, a 1px line under the bar. No logo mark. No search. No bag.

Small screens: the same four links plus “My take” as text. They wrap. They do not become a bottom icon bar. Minimum target 44 × 44.

Focus: 2px `--color-focus` outline, offset 3px, visible on the paper and on a stage.

### Hero

Not a card. Text column `--col`, left aligned inside the page pad (centered as a column on the page, type aligned left). Eyebrow, display name, tagline, sign-off with the two outbound links. One text button with an arrow: “Selected work”, pointing at `#work`. Portrait is a 72px circle using `PROFILE.portrait` and the existing `avatar` crop. The circle is not the focal point.

### Stage

A link to `/work/:slug`. Width `--stage`, radius `--radius-stage`, media full-bleed, a footer row on the paper under it: title, `result`, arrow. The whole stage is the link, with a visible focus ring. The first home stage may be dark (`--color-stage`) with the title in `--color-stage-ink` over the lower edge of the picture, only when the cover is already a composed hero (OrderFlow’s film). The other two stay title-under-picture so UI thumbs are not buried in black.

### Rail

Horizontal list of `MORE_WORK`. Each card: thumb, title, `short`. Card width about 320px on desktop, `min(78vw, 320px)` on a phone. `scroll-snap-type: x mandatory`. Buttons for previous and next are optional extras. The row must be usable by touch and by keyboard without those buttons. Name is not deferred until hover.

### SpecGrid

For `kind: 'impact'` and `kind: 'stats'`. Large number, label underneath, hairline between cells. On a phone, two columns, then one column under 360px if a label overflows. Do not add icons. Store badges in the MTB impact block stay real links.

### Split

Pale panel, `--color-bg-sunken`, radius `--radius-card`. Copy column and one image. Stack at 720px: image first if it is the project, copy first if it is a quote or a bio. Frame 7 puts copy on the left at desktop width.

### Quote

One testimonial. Large Figtree quote, then photo, name, role. The existing previous/next controls stay. Placeholder testimonials stay unrendered (`placeholder: true` in `data.js`).

### Take

The six strings in `ABOUT.takes` and the sign-off `ABOUT.takeSign`. Presented as a small paper dialog anchored to the button, not as tape and script. Keyboard: Escape closes, arrows move between lines if more than one is shown. Words stay verbatim.

### Contact

`ConnectCard`: same title, same socials, same hints, `id="contact"`. Email is `mailto:` plus the address as text, not only an icon. Behance stays hidden while `href` is `#` (`ui.jsx` already filters that).

### Footer

`PROFILE.signoff` and “Back to top”. Add a single line of the same nav links in caption size. Do not build the multi-column index from frame 3.

### Case chrome

Cover stage, overview, facts, sections, sticky section index, “other work” pair, connect. Behavior of `CaseStudy.jsx` stays. The index is text, not a blue glass pill. Unknown slug keeps the “Project not found” card.

Case block components (`Story.jsx`, `CaseBlocks.jsx`) keep their props and markup. Restyle in a later phase. Do not redesign one block into a different metaphor.

## Motion

One owner per element. Prefer CSS transitions on `transform` and `opacity`. The existing `.reveal` intersection observer in `App.jsx` can fade a section up 12px. Duration 640ms, easing `cubic-bezier(0.22, 1, 0.36, 1)` (already `--ease`). It runs once.

| Interaction | Duration | Notes |
| --- | --- | --- |
| Hover on a card or stage | 320ms | Image scale at most 1.02. No brightness dimming of siblings |
| Link and button color | 180ms | |
| Rail scroll | native | CSS snap. No GSAP |
| Quote / take change | 320ms opacity | No slide that hides the text offscreen before it is readable |
| Page change | existing View Transition crossfade | Already skipped when reduced motion is on or the API is missing |
| Video | existing | Pause visible. Reduced motion: poster |

`prefers-reduced-motion: reduce` removes transforms, snap animation, and autoplay. Content is present immediately. The intersection observer may add `.in` without a transition.

GSAP is used today for the fanned `MORE_WORK` hand in `Home.jsx`. That hand goes away in this direction, so GSAP should have no new job. Leave the `gsap` and `@gsap/react` dependencies installed. Do not add ScrollTrigger.

Lenis is the smooth-scroll and `scrollTo` helper (`App.jsx`, `src/scroll.js`). Keep it for programmatic scrolls (Contact, back to top, case index). Turn off `smoothWheel` when reduced motion is set. Do not add a second scroll library.

Do not animate the same property with CSS and GSAP. Do not pin sections. The board does not show scroll-jacking.

## Responsive rules

375px:

- Nav wraps. No fixed bottom bar over the contact card.
- Display type wraps. It is still the largest thing on the screen.
- Stages are full width minus 20px, stacked.
- Spec grid is two columns.
- Split stacks.
- Rail peeks the next card so the row is obviously scrollable.
- Facts in a case study become a single column. The component already has a narrow layout at 560px. Keep a single column rather than a crushed grid.

1100px and up:

- Nav is one row.
- Hero text is the left-aligned column, not centered on the viewport like frame 1. Centering the whole column in the viewport is fine. Centering every line as a poster is direction 2.
- Spec grid can be four across when there are four figures.
- Case index can sit in the left margin, which `selv.css` already does from 1281px. Restyle it. Do not remove it.

Hover effects are extras. Titles, results, and controls exist without hover. The current fan names a project only while hovered. That behavior does not carry over.

## Accessibility

- One `h1` per page. Home: the name. About: the first visible heading in the existing headline or “Work Experience” must not skip levels. When the hero slideshow has no heading, the statement can stay a paragraph and “Work Experience” stays `h2`, matching `AboutPage.jsx`. Do not invent a second `h1`.
- Case study `h1` remains the cover title.
- Landmarks: `nav` (“Main”), `main`, `footer`.
- Buttons that are not links keep `type="button"`.
- Focus never disappears. Remove `cursor: none` from `index.html` when the custom cursor is retired.
- Body links are underlined, not color alone.
- Contrast pairs above meet AA. Do not put `--color-faint` on `--color-bg-sunken` without rechecking. On `#e7e2d8`, use `--color-muted` or ink.
- Video and before/after controls keep their current accessible names (`Story.jsx` already labels the compare range and external shots).
- Placeholder quotes never render.
- Reduced motion and save-data paths stay.

## CSS variables to add

Put this on `:root` in `src/index.css`, and stop overriding font and page color with a second dark palette in `selv.css`. Map old names during the transition (`--sv-text` → `--color-ink` on light surfaces, and to `--color-stage-ink` only inside `.is-stage`) so case blocks do not flip to black text on black overnight. That mapping is an implementation task in phase 1 and phase 8 of the plan. It is not done in this document.

```css
:root {
  --font: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: "DM Mono", ui-monospace, Menlo, monospace;
  --color-bg: #f3f1ec;
  --color-bg-elevated: #fffcf8;
  --color-bg-sunken: #e7e2d8;
  --color-ink: #161513;
  --color-muted: #5c574f;
  --color-faint: #6a645c;
  --color-line: rgba(22, 21, 19, 0.10);
  --color-accent: #1b3a4b;
  --color-accent-ink: #f3f1ec;
  --color-stage: #101010;
  --color-stage-ink: #f4f2ee;
  --color-stage-muted: #c9c4bb;
  --color-focus: #1b3a4b;
  --measure: 40rem;
  --col: 720px;
  --radius-stage: 28px;
  --radius-card: 20px;
  --radius-media: 16px;
  --radius-pill: 999px;
  --shadow-card: 0 1px 0 rgba(22, 21, 19, 0.04), 0 18px 40px -28px rgba(22, 21, 19, 0.28);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 180ms;
  --dur: 320ms;
  --dur-slow: 640ms;
}
```

## Identity check

A reviewer who covers the name should still not think this is Apple. The test: warm paper rather than cool grey, left-aligned editorial type rather than a centered product poster, real café and fintech screens rather than hardware, one deep blue rather than system blue, no logomark in the corner, no product grid of laptops. Figtree at this size is clean, and the layout and the work have to carry the difference.
