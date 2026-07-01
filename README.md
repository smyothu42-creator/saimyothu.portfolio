# Sai Myo Thu — Portfolio (React + GSAP)

The portfolio rebuilt as a **React** app (with [Vite](https://vitejs.dev)) using
**GSAP** for all animation. Same design and content as the original single HTML
file, now split into clean, editable components.

## Run it on your computer

1. Open the Terminal app and go into this folder. You can do this by typing
   `cd ` (with a space after it), then dragging this folder onto the Terminal
   window, then pressing Return.
2. The first time only, install the building blocks:
   ```
   npm install
   ```
3. Start the live preview:
   ```
   npm run dev
   ```
   The Terminal will print a web address like `http://localhost:5173/`.
   Hold ⌘ and click it (or copy it into your browser) to see the site.
   It updates automatically as files are edited.
4. Press `Ctrl + C` in the Terminal to stop the preview.

Tip: add `?skip` to the address (e.g. `http://localhost:5173/?skip`) to jump
straight past the opening "don't blink" loader while previewing.

## Make a shareable / publishable version

```
npm run build
```

This creates a `dist/` folder — a finished website you can upload to any host
(Netlify, Vercel, GitHub Pages, etc.).

## Where things live

| What you want to change | File |
| --- | --- |
| Text: projects, skills, stats, links, email | `src/data.js` |
| Colours, fonts, spacing | `src/index.css` (the `:root` block at the top) |
| Page sections | `src/components/` (Hero, Work, Playground, About, Contact) |
| Animations / loader / scroll effects | `src/App.jsx`, `src/components/Loader.jsx`, `src/components/Thumb.jsx` |
| Your photo | `public/sai-portrait.jpg` (replace with same name) |

### Animations (all GSAP)

- **Loader** — counts 0→100, fills the bar, then slides away (`Loader.jsx`).
- **Scroll reveals** — sections fade/slide in as you scroll, via GSAP
  `ScrollTrigger.batch` (`App.jsx`).
- **Hero entrance** — plays once the loader leaves (`App.jsx`).
- **Reveal footer** — the page scrolls up to uncover the fixed "Get in touch"
  footer; the big line slides up, driven by a GSAP `ScrollTrigger` (`App.jsx`).
- **Cursor-following preview** — hovering a Playground row shows a floating
  thumbnail that trails the mouse, using GSAP `quickTo` (`Thumb.jsx`).

## Optional fonts & videos

- The headings use the paid **Grandslang B Side** font if you own it: drop
  `GrandSlang-B-Side.woff2` (and `.woff`) into the `public/` folder. Otherwise it
  falls back to **Fraunces** automatically — no setup needed.
- The first case-study card can show a video: add `northwind-cover.mp4` (and/or
  `.mov`) to `public/`. Without it, the card just shows its background colour.
