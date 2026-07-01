Retrobit typeface — Pixel Art theme
===================================

The Pixel Art theme uses "Retrobit" by Umka Type. It is a commercial font and
is NOT bundled in this repo. To enable it, place your licensed font files here:

    public/fonts/Retrobit.woff2   (preferred)
    public/fonts/Retrobit.ttf     (fallback)

Vite serves the public/ folder at the site root, so the @font-face in
src/index.css references them as /fonts/Retrobit.woff2 and /fonts/Retrobit.ttf.

Where to get it:
  https://www.myfonts.com/collections/retrobit-font-umka-type

Until the files are present, the Pixel Art theme falls back to "VT323" (loaded
from Google Fonts) — a highly legible pixel face — so nothing breaks.

Tip: convert a .ttf to .woff2 with `npx ttf2woff2 Retrobit.ttf > Retrobit.woff2`.
