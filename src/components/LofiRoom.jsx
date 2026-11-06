import { useEffect, useRef, useState } from 'react'
// Lo-fi room: a window with the city outside and a cat on the sill (left),
// Sai at the desk behind a laptop with a mug and a lamp (right), a shelf, a
// poster and string lights. The same room is lit two ways:
//   dark theme   night: moon, stars, lit windows, lamp and string lights on
//   light theme  morning: sun, clouds, birds, a sunbeam across the floor
// Colours come from CSS variables (selv.css, `.is-lofi`), so switching the
// theme cross-fades the whole room.
// The card column covers the middle of the screen, so the room is drawn as
// three layers: the wall and floor stretched across the full width, the
// window half pinned to the left edge and the desk half pinned to the right
// edge, each scaled to the screen height. Both halves stay in view on any
// screen shape; phones keep just the window and the cat.
//
// It is interactive: the layers shift a little with the mouse for depth; Sai
// (behind the laptop) looks up and waves when hovered and talks when
// clicked; the cat tilts its head on hover and meows when clicked; clicking
// the window sends a shooting star at night or a bird in the morning.

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// City outside the window (window glass spans x 110–590, y 130–590).
const r = rng(42)
const FAR = Array.from({ length: 11 }, (_, i) => ({ x: 104 + i * 46, w: 40 + r() * 16, h: 70 + r() * 110 }))
const NEAR = Array.from({ length: 8 }, (_, i) => ({ x: 100 + i * 64, w: 52 + r() * 18, h: 40 + r() * 90 }))
const LIT = []
NEAR.forEach((b) => {
  for (let y = 590 - b.h + 12; y < 580; y += 16) {
    for (let x = b.x + 8; x < b.x + b.w - 10; x += 14) {
      if (r() < 0.42) LIT.push({ x, y, k: LIT.length })
    }
  }
})
const STARS = Array.from({ length: 38 }, (_, i) => ({ i, x: 120 + r() * 460, y: 140 + r() * 220, s: r() < 0.15 ? 2 : 1.1 }))
const BULBS = Array.from({ length: 26 }, (_, i) => {
  const x = 20 + i * 62
  const y = 42 + Math.sin((i / 25) * Math.PI * 4) * 14 + 14
  return { i, x, y }
})

const SAI_LINES = ["Hi, I'm Sai 👋", 'Designing something nice…', 'Coffee keeps the pixels moving ☕', "Let's build something together!"]
const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Speech bubble anchored at its tail tip (x, y), growing up and to the left.
function Bubble({ x, y, text }) {
  const w = Math.max(84, text.length * 7.7 + 34)
  return (
    <g className="l-bubble" transform={`translate(${x} ${y})`}>
      <path d={`M${-w + 18} -54 h${w - 18} a12 12 0 0 1 12 12 v18 a12 12 0 0 1-12 12 h-18 l-6 12 -6-12 h${-(w - 30)} a12 12 0 0 1-12-12 v-18 a12 12 0 0 1 12-12z`} />
      <text x={-w / 2 + 9} y="-27" textAnchor="middle">{text}</text>
    </g>
  )
}

function Lights({ from, to }) {
  const bulbs = BULBS.filter((b) => b.x >= from && b.x <= to)
  const d = 'M' + bulbs.map((b) => `${b.x} ${b.y - 8}`).join(' L')
  return (
    <>
      <path className="l-wire" d={d} fill="none" strokeWidth="2" />
      {bulbs.map((b) => (
        <g key={b.i} className="l-bulb" style={{ '--d': `${(b.i % 5) * 0.4}s` }}>
          <circle className="l-night l-bulb-glow" cx={b.x} cy={b.y} r="16" fill="url(#lf-glow)" />
          <circle className="l-bulb-dot" cx={b.x} cy={b.y} r="5" />
        </g>
      ))}
    </>
  )
}


export default function LofiRoom() {
  const wrap = useRef(null)
  const [sai, setSai] = useState({ on: false, line: 0, talk: false })
  const [cat, setCat] = useState({ on: false, meow: 0 })
  const [shots, setShots] = useState(0)
  const talkTimer = useRef(0)
  const meowTimer = useRef(0)

  // Mouse parallax: --px / --py in -1…1, eased by a CSS transition.
  useEffect(() => {
    if (prefersReduced()) return
    let raf = 0
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = wrap.current
        if (!el) return
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])
  useEffect(() => () => { clearTimeout(talkTimer.current); clearTimeout(meowTimer.current) }, [])

  const saiTalk = (next) => {
    clearTimeout(talkTimer.current)
    setSai((s) => ({ on: true, talk: true, line: next ? (s.line + 1) % SAI_LINES.length : s.line }))
    talkTimer.current = setTimeout(() => setSai((s) => ({ ...s, talk: false })), 2800)
  }
  const meow = () => {
    clearTimeout(meowTimer.current)
    setCat((c) => ({ ...c, meow: c.meow + 1 }))
    meowTimer.current = setTimeout(() => setCat((c) => ({ ...c, meow: 0 })), 1800)
  }

  return (
    <div className="lofi-wrap" ref={wrap}>
      <svg className="lofi-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
        <linearGradient id="lf-sky-n" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141836" />
          <stop offset="0.55" stopColor="#2c2a5e" />
          <stop offset="1" stopColor="#5a3f78" />
        </linearGradient>
        <linearGradient id="lf-sky-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc3ec" />
          <stop offset="0.6" stopColor="#cfe3f1" />
          <stop offset="1" stopColor="#ffd9b8" />
        </linearGradient>
        <radialGradient id="lf-glow">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lf-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd38a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lf-beam" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="var(--l-beam)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--l-beam)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lf-glass"><rect x="110" y="130" width="480" height="460" rx="4" /></clipPath>
        <radialGradient id="lf-pool">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffcf8a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lf-pool-cool">
          <stop offset="0" stopColor="#9fb0ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#9fb0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lf-pool-sun">
          <stop offset="0" stopColor="#fff2d2" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff2d2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lf-screen">
          <stop offset="0" stopColor="#9cc0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9cc0ff" stopOpacity="0" />
        </radialGradient>
        <filter id="lf-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="lf-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
        </filter>
        </defs>
      </svg>

      {/* Wall and floor, stretched across the full width */}
      <svg className="lofi lofi-back" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <rect className="l-wall" width="1600" height="900" />
        <rect className="l-wall-shade" width="1600" height="120" opacity="0.5" />
        <rect className="l-floor" y="760" width="1600" height="140" />
        <g className="l-floor-line">
          <rect y="796" width="1600" height="2" />
          <rect y="836" width="1600" height="2" />
          <rect y="878" width="1600" height="2" />
        </g>
        <rect className="l-wall-shade" y="752" width="1600" height="10" />
        <rect className="l-grain" width="1600" height="900" filter="url(#lf-grain)" />
      </svg>

      {/* Left half: window, cat, plant, cushion */}
      <svg className="lofi lofi-left" viewBox="20 0 640 900" aria-hidden="true">
        <circle className="l-night" cx="350" cy="380" r="420" fill="url(#lf-pool-cool)" />
        <circle className="l-day" cx="350" cy="420" r="460" fill="url(#lf-pool-sun)" />
        <Lights from={0} to={660} />

        <g className="l-par-far">
      {/* Window: outside */}
      <g clipPath="url(#lf-glass)">
        <g className="l-outside">
        <rect className="l-day" x="110" y="130" width="480" height="460" fill="url(#lf-sky-d)" />
        <rect className="l-night" x="110" y="130" width="480" height="460" fill="url(#lf-sky-n)" />
        <g className="l-night l-stars">
          {STARS.map((s) => <circle key={s.i} cx={s.x} cy={s.y} r={s.s} fill="#fff" />)}
        </g>
        <g className="l-night">
          <circle cx="455" cy="225" r="70" fill="url(#lf-glow)" opacity="0.35" />
          <circle cx="455" cy="225" r="30" fill="#fbf3de" />
          <circle cx="444" cy="217" r="5" fill="#e9dcc0" />
          <circle cx="463" cy="236" r="3.5" fill="#e9dcc0" />
        </g>
        <g className="l-day">
          <circle cx="470" cy="300" r="110" fill="url(#lf-glow)" opacity="0.6" />
          <circle cx="470" cy="300" r="38" fill="#fff3d6" />
          <g className="l-clouds" fill="#fff" opacity="0.9">
            <path d="M150 230 q10-26 40-20 q16-22 44-8 q30-4 32 22 q14 6 6 18 h-120 q-14-4-2-12z" />
            <path d="M330 175 q8-18 30-14 q12-16 32-6 q22-2 22 16 q10 6 4 14 h-88 q-10-4 0-10z" opacity="0.8" />
          </g>
          <g className="l-birds" fill="none" stroke="#5b6b85" strokeWidth="2" strokeLinecap="round">
            <path d="M250 300 q8-8 14 0 q6-8 14 0" />
            <path d="M285 282 q6-6 11 0 q5-6 11 0" />
          </g>
        </g>
        {FAR.map((b, i) => <rect key={'f' + i} className="l-city-far" x={b.x} y={590 - b.h - 70} width={b.w} height={b.h + 70} />)}
        {NEAR.map((b, i) => <rect key={'n' + i} className="l-city" x={b.x} y={590 - b.h} width={b.w} height={b.h} />)}
        <g className="l-night l-lit">
          {LIT.map((w) => <rect key={w.k} x={w.x} y={w.y} width="6" height="8" rx="1" />)}
        </g>
        </g>
      </g>

          {/* Shooting star (night) / bird (morning), one per window click */}
          <g clipPath="url(#lf-glass)" key={shots}>
            {shots > 0 && (
              <>
                <path className="l-night l-shoot" d="M200 170 L 380 250" />
                <path className="l-day l-flyby" d="M-20 0 q8-8 14 0 q6-8 14 0" transform="translate(140 260)" />
              </>
            )}
          </g>
          {/* glass reflections */}
          <g className="l-glass-shine">
            <path d="M130 360 L 240 140 L 270 140 L 160 360 Z" />
            <path d="M380 590 L 520 365 L 538 365 L 398 590 Z" />
          </g>
        </g>
        <rect className="is-hit" x="110" y="130" width="480" height="460" fill="transparent" onClick={() => setShots((n) => n + 1)}>
          <title>Click the window</title>
        </rect>

      {/* Window: frame, mullions, curtains, sill */}
      <path className="l-frame" fillRule="evenodd" d="M90 110 h520 v500 h-520z M110 130 v460 h480 v-460z" />
      <rect className="l-frame" x="345" y="130" width="10" height="460" />
      <rect className="l-frame" x="110" y="355" width="480" height="10" />
      <rect className="l-rod" x="30" y="92" width="640" height="8" rx="4" />
      <path className="l-curtain" d="M38 98 h92 q-14 160 6 300 q18 150-4 330 h-86 q-20-170 2-330 q14-150-10-300z" />
      <path className="l-curtain" d="M570 98 h92 q-24 150-10 300 q22 160 2 330 h-86 q-22-180-4-330 q20-140 6-300z" />
      <path className="l-curtain-fold" d="M70 110 q-10 150 8 300 q16 150 0 300" fill="none" strokeWidth="3" />
      <path className="l-curtain-fold" d="M620 110 q14 150-4 300 q-16 150 2 300" fill="none" strokeWidth="3" />
      <rect className="l-sill" x="70" y="598" width="560" height="22" rx="6" />
      <rect className="l-wall-shade" x="86" y="620" width="528" height="10" opacity="0.7" />


        {/* shadows on the sill */}
        <ellipse className="l-shadow" cx="212" cy="600" rx="56" ry="6" filter="url(#lf-soft)" />
        <ellipse className="l-shadow" cx="500" cy="600" rx="40" ry="5" filter="url(#lf-soft)" />

        {/* Cat on the sill, looking out; tilts its head on hover, meows on click */}
        <g className={'l-par-mid l-cat' + (cat.on ? ' is-hover' : '') + (cat.meow ? ' is-meow' : '')}>
          <path className="l-tail" d="M238 596 C 290 604, 306 574, 290 552" fill="none" strokeWidth="11" strokeLinecap="round" />
          <path d="M168 598 C 160 560, 176 522, 210 518 C 246 516, 262 556, 254 598 Z" />
          <g className="l-cat-head">
            <circle cx="211" cy="503" r="27" />
            <path className="l-ear" d="M189 492 L 194 466 L 208 484 Z" />
            <path className="l-ear" d="M214 484 L 228 466 L 233 492 Z" />
          </g>
          <path className="l-night l-rim" d="M236 500 a27 27 0 0 0-14-22 M246 540 C 252 556, 256 576, 254 596" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          <rect className="is-hit" x="150" y="456" width="120" height="146" fill="transparent"
            onMouseEnter={() => setCat((c) => ({ ...c, on: true }))}
            onMouseLeave={() => setCat((c) => ({ ...c, on: false }))}
            onClick={meow}
          />
        </g>
        {cat.meow > 0 && <Bubble key={'m' + cat.meow} x="236" y="462" text="Meow!" />}

        <g className="l-par-mid">
      {/* Plant on the sill */}
      <g>
        <path className="l-leaf" d="M496 560 C 470 520, 478 490, 500 470 C 506 500, 510 530, 496 560 Z" />
        <path className="l-leaf2" d="M500 560 C 520 520, 548 506, 566 500 C 556 528, 530 552, 500 560 Z" />
        <path className="l-leaf2" d="M494 560 C 470 540, 450 530, 432 528 C 446 552, 470 562, 494 560 Z" />
        <path className="l-pot" d="M470 556 h60 l-7 42 h-46 z" />
      </g>

        </g>

        {/* Moonbeam / sunbeam on the floor */}
        <path className="l-beam" d="M120 590 L 590 590 L 860 900 L 300 900 Z" fill="url(#lf-beam)" />

        {/* Floor cushion under the window */}
        <ellipse className="l-shadow" cx="244" cy="836" rx="160" ry="14" filter="url(#lf-soft)" />
        <ellipse className="l-cushion" cx="240" cy="808" rx="150" ry="34" />
        <ellipse className="l-cushion-top" cx="240" cy="796" rx="140" ry="26" />
      </svg>

      {/* Right half: shelf, poster, desk, Sai, laptop, mug, lamp */}
      <svg className="lofi lofi-right" viewBox="960 0 640 900" aria-hidden="true">
        <circle className="l-night l-lamp-pool" cx="1090" cy="560" r="300" fill="url(#lf-pool)" />
        <Lights from={960} to={1600} />
        <g className="l-par-mid">
      {/* Right wall: poster and shelf */}
      <rect className="l-frame" x="1404" y="170" width="150" height="196" rx="6" />
      <rect className="l-poster" x="1416" y="182" width="126" height="172" rx="3" />
      <path className="l-poster-art" d="M1416 320 l34-46 26 30 22-24 44 40 v34 h-126z" />
      <circle className="l-poster-sun" cx="1508" cy="226" r="14" />
      <g transform="translate(80 0)">
      <rect className="l-shelf" x="1050" y="318" width="300" height="12" rx="3" />
      <rect className="l-wall-shade" x="1060" y="330" width="280" height="6" opacity="0.6" />
      {[
        [1064, 54, 'a'], [1084, 64, 'b'], [1104, 48, 'c'], [1122, 60, 'a'], [1140, 50, 'd'], [1160, 58, 'b'],
      ].map(([x, h, c]) => <rect key={x} className={'l-book-' + c} x={x} y={318 - h} width="16" height={h} rx="2" />)}
      <rect className="l-book-c" x="1184" y="270" width="16" height="48" rx="2" transform="rotate(-14 1200 318)" />
      <path className="l-pot" d="M1290 290 h40 l-5 28 h-30 z" />
      <path className="l-leaf" d="M1310 292 C 1294 268, 1300 250, 1312 238 C 1318 260, 1320 276, 1310 292 Z" />
      <path className="l-leaf2" d="M1312 292 C 1326 272, 1342 266, 1352 262 C 1346 280, 1330 292, 1312 292 Z" />

      </g>

        </g>

        {/* Rug and desk shadow */}
        <ellipse className="l-rug" cx="1330" cy="836" rx="250" ry="40" />
        <ellipse className="l-shadow" cx="1290" cy="768" rx="320" ry="12" filter="url(#lf-soft)" />

        {/* Sai */}
        <g className={'l-par-near l-sai' + (sai.on ? ' is-hover' : '')}>
          <rect className="l-chair" x="1258" y="468" width="154" height="190" rx="30" />
          <rect className="l-chair-shade" x="1270" y="480" width="130" height="10" rx="5" />
          {/* body */}
          <path className="l-tee" d="M1278 640 C 1276 560, 1294 520, 1335 512 C 1376 520, 1394 560, 1392 640 Z" />
          <path className="l-tee-fold" d="M1310 560 q8 30 4 70 M1362 560 q-8 30-4 70" fill="none" strokeWidth="3" strokeLinecap="round" />
          <rect className="l-skin" x="1325" y="484" width="20" height="24" rx="8" />
          {/* left arm, resting on the desk */}
          <path className="l-tee" d="M1290 532 C 1268 548, 1258 584, 1262 618 L 1286 622 C 1284 594, 1290 566, 1302 548 Z" />
          <path className="l-skin" d="M1262 612 C 1266 626, 1282 634, 1298 630 L 1294 618 C 1284 620, 1276 616, 1272 608 Z" />
          {/* right arm: types, or waves when hovered */}
          <g className="l-arm">
            <path className="l-tee" d="M1380 532 C 1402 548, 1412 584, 1408 618 L 1384 622 C 1386 594, 1380 566, 1368 548 Z" />
            <path className="l-skin l-hand" d="M1408 612 C 1404 626, 1388 634, 1372 630 L 1376 618 C 1386 620, 1394 616, 1398 608 Z" />
          </g>
          <g className="l-wave">
            <path className="l-tee" d="M1380 532 C 1404 536, 1420 528, 1428 510 L 1410 498 C 1404 512, 1392 518, 1372 518 Z" />
            <path className="l-skin" d="M1416 502 C 1416 474, 1424 452, 1436 448 C 1444 446, 1448 454, 1444 464 L 1440 500 Z" />
            <path className="l-skin" d="M1428 452 l-2-16 M1436 449 l1-16 M1444 455 l5-13" strokeWidth="6" strokeLinecap="round" />
          </g>
          {/* headphones round the neck */}
          <path className="l-phones" d="M1304 512 C 1306 532, 1364 532, 1366 512" fill="none" strokeWidth="7" strokeLinecap="round" />
          <ellipse className="l-phones-cup" cx="1302" cy="510" rx="9" ry="13" />
          <ellipse className="l-phones-cup" cx="1368" cy="510" rx="9" ry="13" />
          {/* head */}
          <ellipse className="l-skin" cx="1306" cy="460" rx="7" ry="10" />
          <ellipse className="l-skin" cx="1364" cy="460" rx="7" ry="10" />
          <ellipse className="l-skin" cx="1335" cy="456" rx="29" ry="33" />
          <ellipse className="l-blush" cx="1318" cy="472" rx="6" ry="3.5" />
          <ellipse className="l-blush" cx="1352" cy="472" rx="6" ry="3.5" />
          {/* eyes: down at the screen, or up at you */}
          <g className="l-eyes-down l-face-line" fill="none" strokeWidth="2.6" strokeLinecap="round">
            <path d="M1316 462 q6 4 12 0" />
            <path d="M1342 462 q6 4 12 0" />
            <path d="M1330 478 h10" />
          </g>
          <g className="l-eyes-up">
            <circle className="l-face-dot" cx="1322" cy="458" r="3.6" />
            <circle className="l-face-dot" cx="1348" cy="458" r="3.6" />
            <path className="l-face-line" d="M1326 474 q9 8 18 0" fill="none" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          {/* glasses */}
          <g className="l-glasses" fill="none" strokeWidth="2.4">
            <rect x="1310" y="450" width="22" height="16" rx="5" />
            <rect x="1338" y="450" width="22" height="16" rx="5" />
            <path d="M1332 457 h6" />
          </g>
          {/* messy hair */}
          <path className="l-hair" d="M1303 466 C 1292 432, 1302 402, 1330 394 C 1360 386, 1384 406, 1378 446 C 1376 456, 1372 462, 1367 468 C 1366 454, 1362 444, 1355 438 L 1351 450 L 1342 437 L 1334 449 L 1326 436 L 1319 448 C 1313 444, 1308 454, 1303 466 Z" />
          <path className="l-hair" d="M1336 397 C 1333 385, 1341 378, 1353 380 C 1346 384, 1344 390, 1347 396 Z" />
          <path className="l-hair-shine" d="M1318 410 q12-10 30-6" fill="none" strokeWidth="3" strokeLinecap="round" />
          {/* screen light on the face at night */}
          <ellipse className="l-night l-screen-light" cx="1335" cy="490" rx="90" ry="70" fill="url(#lf-screen)" />
          <rect className="is-hit" x="1262" y="392" width="200" height="250" fill="transparent"
            onMouseEnter={() => { setSai((s) => ({ ...s, on: true })); saiTalk(false) }}
            onMouseLeave={() => setSai((s) => ({ ...s, on: false }))}
            onClick={() => saiTalk(true)}
          />
        </g>
        {sai.talk && <Bubble key={'s' + sai.line} x="1318" y="392" text={SAI_LINES[sai.line]} />}

        {/* Desk */}
        <rect className="l-desk-top" x="960" y="640" width="640" height="18" rx="4" />
        <rect className="l-desk-edge" x="960" y="640" width="640" height="4" rx="2" />
        <rect className="l-desk" x="980" y="658" width="620" height="102" />
        <rect className="l-desk-line" x="1010" y="684" width="200" height="4" rx="2" />
        <rect className="l-desk-knob" x="1094" y="700" width="32" height="6" rx="3" />
        <rect className="l-desk-line" x="1240" y="658" width="4" height="102" />

        {/* Laptop, seen from behind, with stickers */}
        <g className="l-par-near">
          <ellipse className="l-shadow" cx="1335" cy="640" rx="96" ry="5" filter="url(#lf-soft)" />
          <rect className="l-laptop" x="1250" y="556" width="170" height="80" rx="9" />
          <rect className="l-laptop-shine" x="1250" y="556" width="170" height="6" rx="3" />
          <circle className="l-sticker-a" cx="1284" cy="584" r="11" />
          <path className="l-sticker-b" d="M1384 606 c-6-7-16-1-10 7 l10 9 10-9 c6-8-4-14-10-7z" />
          <rect className="l-sticker-c" x="1322" y="600" width="30" height="16" rx="4" transform="rotate(-8 1337 608)" />
          <rect className="l-laptop-base" x="1240" y="632" width="190" height="8" rx="3" />
        </g>

        <g className="l-par-mid"><g transform="translate(470 0)">
          <ellipse className="l-shadow" cx="1070" cy="640" rx="64" ry="4" filter="url(#lf-soft)" />
      {/* Books on the desk */}
      <rect className="l-book-b" x="1010" y="616" width="110" height="12" rx="2" />
      <rect className="l-book-a" x="1018" y="604" width="96" height="12" rx="2" />
      <rect className="l-book-d" x="1014" y="628" width="116" height="12" rx="2" />

        </g></g>

        <g className="l-par-mid"><g transform="translate(40 0)">
          <ellipse className="l-shadow" cx="1436" cy="640" rx="26" ry="4" filter="url(#lf-soft)" />
      {/* Mug + steam */}
      <path className="l-mug" d="M1416 604 h36 v30 a6 6 0 0 1-6 6 h-24 a6 6 0 0 1-6-6 z" />
      <path className="l-mug-handle" d="M1452 612 q14 0 14 10 q0 10-14 10" fill="none" strokeWidth="5" />
      <g className="l-steam" fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M1426 594 q-8-12 0-22 q8-10 0-22" />
        <path d="M1442 594 q8-12 0-22 q-8-10 0-22" />
      </g>

        </g></g>

        {/* Desk lamp (left of the laptop) and its light */}
        <g className="l-par-mid"><g transform="translate(2540 0) scale(-1 1)">
          <path className="l-night l-cone" d="M1432 492 L 1504 492 L 1590 640 L 1290 640 Z" fill="url(#lf-cone)" />
          <ellipse className="l-lamp" cx="1530" cy="638" rx="34" ry="7" />
          <path className="l-lamp-arm" d="M1530 634 L 1546 540 L 1490 470" fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path className="l-lamp" d="M1460 452 L 1514 474 L 1500 504 L 1434 494 Z" />
          <circle className="l-night" cx="1468" cy="498" r="26" fill="url(#lf-glow)" opacity="0.8" />
        </g></g>
      </svg>
    </div>
  )
}
