import { BACKDROP, CASES, PROFILE } from '../data'
import { Screen, Window } from './Story'
import LofiRoom from './LofiRoom'

// Fixed backdrop the glass cards blur over. Picked by BACKDROP in data.js:
//   'calm'       layered blue mountains in evening mist, public/bg-calm.jpg (default)
//   'lofi'       a drawn lo-fi room: night in dark mode, morning in light
//   'city'       Yangon at night, Sule Pagoda and light trails, public/bg-city.jpg
//   'desk'       photo of a designer's desk at night, public/bg-desk.jpg
//   'photo'      moonlit beach photo, public/bg.jpg
//   'canvas'     a dark Figma-style canvas with your real UI screens on it
// or one of the scenes drawn in code:
//   'mountains'  blue-hour sky with stars and layered ridges
//   'grass'      dusk sky over a field of grass blades
//   'sea'        moon over a calm night sea, with its light on the water 
// Shapes come from a seeded random, so a scene is the same on every load.

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ---- grass ----
function blades(count, seed, minH, maxH) {
  const r = rng(seed)
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = r() * 1600
    const h = minH + r() * (maxH - minH)
    const w = 3 + r() * 5
    const lean = (r() - 0.5) * h * 0.7
    d += `M${x - w} 600 Q${x + lean * 0.35} ${600 - h * 0.55} ${x + lean} ${600 - h} Q${x + lean * 0.45} ${600 - h * 0.5} ${x + w} 600Z`
  }
  return d
}

// ---- mountains ----
// A ridge line across 1600 units: a few slow sine waves for the big shapes,
// plus jitter for rocky detail, closed down to the bottom edge.
function ridge(seed, base, amp, rough) {
  const r = rng(seed)
  const waves = [0, 1, 2].map((i) => ({ f: (0.002 + r() * 0.003) * (i + 1), p: r() * 6.28, a: amp / (i + 1) }))
  let d = `M0 900 L0 ${base}`
  let jitter = 0
  for (let x = 0; x <= 1600; x += 16) {
    jitter = jitter * 0.6 + (r() - 0.5) * rough
    const y = base - waves.reduce((s, w) => s + Math.sin(x * w.f + w.p) * w.a, 0) + jitter
    d += ` L${x} ${y.toFixed(1)}`
  }
  return d + ' L1600 900Z'
}

function stars(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => ({
    i,
    x: r() * 1600,
    y: r() * 420,
    s: r() < 0.08 ? 1.6 : 0.5 + r() * 0.7,
    o: 0.25 + r() * 0.6,
  }))
}

// ---- sea ----
// The moon sits right of the card column, so it shows beside the cards.
const MOON_X = 1330

// Short horizontal glints on the water: dense and bright under the moon,
// spreading wider and dimmer toward the shore.
function glints(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const t = Math.pow(r(), 1.4) // 0 at the horizon, 1 at the bottom
    const y = 560 + t * 340
    const spread = 40 + t * 420
    const x = MOON_X + (r() - 0.5) * 2 * spread * (0.3 + r() * 0.7)
    return { i, x, y, w: 6 + t * 60 * r(), h: 0.8 + t * 2, o: (1 - t * 0.6) * (0.25 + r() * 0.6) }
  })
}
function swells(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / count
    return { i, y: 560 + Math.pow(t, 1.6) * 340, o: 0.05 + r() * 0.06 }
  })
}

const SCENES = {
  sea: {
    stars: stars(120, 5),
    glints: glints(220, 13),
    swells: swells(26, 29),
  },
  grass: {
    back: blades(260, 7, 90, 300),
    front: blades(160, 19, 160, 420),
  },
  mountains: {
    stars: stars(170, 3),
    ridges: [
      ridge(11, 520, 70, 10),
      ridge(23, 600, 90, 14),
      ridge(37, 690, 80, 16),
      ridge(51, 790, 60, 18),
    ],
  },
}

export default function Backdrop() {
  if (BACKDROP === 'canvas') return <Canvas />
  if (BACKDROP === 'calm') return <div className="sv-backdrop is-photo is-calm" aria-hidden="true" />
  if (BACKDROP === 'lofi' || !(BACKDROP in SCENES || ['photo', 'city', 'desk'].includes(BACKDROP))) {
    return (
      <div className="sv-backdrop is-lofi" aria-hidden="true">
        <LofiRoom />
      </div>
    )
  }
  if (BACKDROP === 'city') {
    return <div className="sv-backdrop is-photo is-city" aria-hidden="true" />
  }
  if (BACKDROP === 'desk') {
    return <div className="sv-backdrop is-photo is-desk" aria-hidden="true" />
  }
  if (BACKDROP === 'photo') {
    return <div className="sv-backdrop is-photo" aria-hidden="true" />
  }
  const scene = BACKDROP
  const sc = SCENES[scene]
  return (
    <div className={'sv-backdrop is-' + scene} aria-hidden="true">
      <span />
      <span />
      <span />
      {scene === 'sea' ? (
        <svg className="sv-scene sv-sea" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="sv-moon-glow">
              <stop offset="0" stopColor="#fff4e0" stopOpacity="0.55" />
              <stop offset="0.25" stopColor="#ffe9c7" stopOpacity="0.18" />
              <stop offset="1" stopColor="#ffe9c7" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sv-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#04060f" />
              <stop offset="0.5" stopColor="#0b1228" />
              <stop offset="0.85" stopColor="#1d2646" />
              <stop offset="1" stopColor="#2d3760" />
            </linearGradient>
            <linearGradient id="sv-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b2340" />
              <stop offset="0.35" stopColor="#0e1428" />
              <stop offset="1" stopColor="#05070f" />
            </linearGradient>
            <linearGradient id="sv-path" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe9c7" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffe9c7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1600" height="560" fill="url(#sv-sky)" />
          <g className="sv-stars">
            {sc.stars.map((st) => (
              <circle key={st.i} cx={st.x} cy={st.y} r={st.s} opacity={st.o} />
            ))}
          </g>
          <circle cx={MOON_X} cy="230" r="280" fill="url(#sv-moon-glow)" />
          <circle className="sv-moon" cx={MOON_X} cy="230" r="40" />
          <rect x="0" y="560" width="1600" height="340" fill="url(#sv-water)" />
          <rect x="0" y="558" width="1600" height="3" className="sv-horizon" />
          {sc.swells.map((w) => (
            <rect key={w.i} x="0" y={w.y} width="1600" height="1" fill="#9fb3ff" opacity={w.o} />
          ))}
          {/* the moon's path on the water */}
          <path d={`M${MOON_X - 30} 560 L${MOON_X + 30} 560 L${MOON_X + 420} 900 L${MOON_X - 420} 900Z`} fill="url(#sv-path)" className="sv-moonpath" />
          <g className="sv-glints">
            {sc.glints.map((g) => (
              <rect key={g.i} x={g.x - g.w / 2} y={g.y} width={g.w} height={g.h} rx={g.h / 2} opacity={g.o} />
            ))}
          </g>
        </svg>
      ) : scene === 'grass' ? (
        <svg className="sv-scene sv-grass" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
          <path className="sv-grass-back" d={sc.back} />
          <path className="sv-grass-front" d={sc.front} />
        </svg>
      ) : (
        <svg className="sv-scene sv-mountains" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <g className="sv-stars">
            {sc.stars.map((st) => (
              <circle key={st.i} cx={st.x} cy={st.y} r={st.s} opacity={st.o} />
            ))}
          </g>
          {sc.ridges.map((d, i) => <path key={i} className={'sv-ridge sv-ridge-' + i} d={d} />)}
        </svg>
      )}
    </div>
  )
}

// A dark Figma-style canvas: frames of the real screens from the case-study
// walkthroughs (data.js), each with its frame name above it, one frame
// selected with handles and a size tag, and a cursor with your name working
// on it. The phones sit either side of the card column, clear of the text.
const flowsOf = (slug) => {
  const c = CASES.find((x) => x.slug === slug)
  const b = c?.study?.sections.flatMap((s) => s.blocks).find((x) => x.kind === 'walktabs')
  return { c, flows: b?.flows || [] }
}
const pick = (slug, flow, screen) => {
  const { c, flows } = flowsOf(slug)
  const sc = flows[flow]?.screens?.[screen]
  return sc && c ? { sc, name: (c.art?.text || c.title) + ' / ' + sc.label, acc: c.study.accent } : null
}

const FRAMES = [
  { at: 'sv-fr-l1', f: pick('orderflow', 0, 1) },
  { at: 'sv-fr-l2', f: pick('sfk-driver-app', 0, 0) },
  { at: 'sv-fr-r1', f: pick('orderflow', 0, 3), selected: true },
  { at: 'sv-fr-r2', f: pick('sfk-driver-app', 2, 1) },
].filter((x) => x.f)

function Canvas() {
  return (
    <div className="sv-backdrop is-canvas" aria-hidden="true" inert>
      {FRAMES.map(({ at, f, selected }) => (
        <div key={at} className={'sv-frame ' + at + (selected ? ' is-selected' : '')} style={{ '--acc': f.acc, '--acc-soft': `color-mix(in srgb, ${f.acc} 12%, #fff)` }}>
          <span className="sv-frame-name">
            <svg viewBox="0 0 12 12" width="10" height="10"><path d="M3.5 1v10M8.5 1v10M1 3.5h10M1 8.5h10" /></svg>
            {f.name}
          </span>
          <div className="sv-frame-body">{f.sc.window ? <Window {...f.sc} /> : <Screen {...f.sc} />}</div>
          {selected && (
            <>
              <span className="sv-sel" />
              <span className="sv-sel-size">375 × 812</span>
              <div className="sv-cursor">
                <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2.5 19.5 10l-7 1.8L9 19z" /></svg>
                <span>{PROFILE.name.split(' ')[0]}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
