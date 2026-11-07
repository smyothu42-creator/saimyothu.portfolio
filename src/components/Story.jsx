import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Person } from './Illos'
import { Icon } from './ui'
import { scrollToY } from '../scroll'

// Blocks for the "story" case-study layout: impact band, product film, role,
// background panels, research and an animated design walkthrough. Screens are
// drawn from small data descriptions (see Screen below), so a flow can be
// edited from data.js without touching this file.

// Start an effect only once the element has scrolled into view.
function useInView(ref, margin = '0px 0px -15% 0px') {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return seen
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Cycle 0…n-1 every `ms` while `on`; stays at 0 for reduced motion.
function useTicker(n, ms, on) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!on || prefersReduced()) return
    const id = setInterval(() => setI((x) => (x + 1) % n), ms)
    return () => clearInterval(id)
  }, [n, ms, on])
  return i
}

// ---------------------------------------------------------------------------
// Impact: the headline result in a sentence, then the key numbers.
export function Impact({ headline, items }) {
  return (
    <>
      {headline && <p className="cs-lead">{headline}</p>}
      <div className="cs-stats">
        {items.map((it) => (
          <div key={it.label}><span className="cs-stat-num">{it.num}</span><span>{it.label}</span></div>
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Role: Execution / Collaboration / Research, each with a few bullets.
export function Role({ items }) {
  return (
    <div className="st-role">
      {items.map((it) => (
        <div key={it.h}>
          <h3 className="st-sub-h">{it.h}</h3>
          <ul>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

// Accent sub-heading with a paragraph or bullets, used inside panels.
export function Sub({ h, p, items, strong }) {
  return (
    <div className="st-subblock">
      <h3 className="st-sub-h">{h}</h3>
      {p && <p>{p}</p>}
      {items && <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>}
      {strong && <p className="st-strong">{strong}</p>}
    </div>
  )
}

// Problem spaces as plain term / explanation rows.
export function IconList({ items }) {
  return (
    <dl className="cs-notes">
      {items.map((it) => <div key={it.h}><dt>{it.h}</dt><dd>{it.p}</dd></div>)}
    </dl>
  )
}

// Target user segments: a column each, with traits, under an optional bust
// (`illo`, see Illos.jsx).
export function Segments({ items }) {
  return (
    <div className="st-segments">
      {items.map((it) => (
        <div className="st-segment" key={it.h}>
          {it.illo && <Person name={it.illo} />}
          <h3 className="st-sub-h">{it.h}</h3>
          {it.sub && <p className="st-muted">{it.sub}</p>}
          <ul>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

// Plain comparison table (secondary research).
export function Table({ cols, rows }) {
  return (
    <div className="st-table-wrap">
      <table className="st-table">
        <thead><tr>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
      </table>
    </div>
  )
}

// A real work screenshot (FigJam board, Figma file). Opens full size in a
// new tab, since boards carry small text. `crop` ('top' / 'bottom') with
// `ratio` (width / height of the visible part) shows one half of a tall board.
export function Shot({ src, alt, crop, ratio }) {
  return (
    <a className="st-shot" href={src} target="_blank" rel="noopener noreferrer" aria-label={`${alt} (opens full size)`}>
      <img src={src} alt={alt} loading="lazy" style={crop ? { aspectRatio: ratio, objectFit: 'cover', objectPosition: crop } : undefined} />
      <span className="st-shot-hint" aria-hidden="true">View full size ↗</span>
    </a>
  )
}

// Before / after: drag the handle (or use the arrow keys) to wipe between two
// screens of the same size. The range input carries the keyboard and screen
// reader support; the handle on top is only what you see.
export function BeforeAfter({ before, after, alt, ratio = '1920 / 992' }) {
  const [pos, setPos] = useState(50)
  const root = useRef(null)
  const drag = useRef(false)
  const move = (e) => {
    const r = root.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  return (
    <div
      className="st-ba"
      ref={root}
      style={{ aspectRatio: ratio, '--pos': `${pos}%` }}
      onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e) }}
      onPointerMove={(e) => { if (drag.current) move(e) }}
      onPointerUp={() => { drag.current = false }}
      onPointerCancel={() => { drag.current = false }}
    >
      <img src={after} alt={`After: ${alt}`} loading="lazy" draggable="false" />
      <img className="st-ba-before" src={before} alt={`Before: ${alt}`} loading="lazy" draggable="false" />
      <span className={'st-ba-tag is-before' + (pos < 14 ? ' is-off' : '')} aria-hidden="true">Before</span>
      <span className={'st-ba-tag is-after' + (pos > 86 ? ' is-off' : '')} aria-hidden="true">After</span>
      <span className="st-ba-line" aria-hidden="true"><span className="st-ba-knob"><Icon name="arrowRight" size={16} stroke={2} /><Icon name="arrowRight" size={16} stroke={2} /></span></span>
      <input className="st-ba-range" type="range" min="0" max="100" value={Math.round(pos)} aria-label="Compare before and after" onChange={(e) => setPos(+e.target.value)} />
    </div>
  )
}

// Problem → what we changed, one row per iteration.
export function Iterations({ items }) {
  return <Table cols={['What we saw', 'What we changed']} rows={items.map((it) => [it.problem, it.change])} />
}

// Pills for the walkthrough flows (as in the panel intro).
export function Pills({ items, active = [] }) {
  return (
    <div className="st-pills">
      {items.map((p) => <span key={p} className={'st-pill' + (active.includes(p) ? ' is-on' : '')}>{p}</span>)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Design walkthrough for one flow: title, objective, then its screens. The
// screens fade in one after another when the flow scrolls into view, then the
// caption under each screen is picked out in turn, like a slow click-through.
export function Walkthrough({ flows, current, title, objective, screens, note }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const step = useTicker(screens.length, 1800, seen)
  return (
    <div className={'st-walk' + (seen ? ' is-in' : '')} ref={ref}>
      {title && (
        <div className="st-walk-head">
          <h3 className="st-walk-title">
            {title}
            {flows && <span className="st-walk-count">{flows.indexOf(current) + 1} of {flows.length}</span>}
          </h3>
          {objective && <p className="st-walk-obj">{objective}</p>}
        </div>
      )}
      <div className={'st-screens' + (screens.some((s) => s.window) ? ' has-window' : '')}>
        {screens.map((sc, i) => (
          <figure key={sc.label} className={'st-screen' + (i === step ? ' is-active' : '') + (sc.window ? ' is-window' : '')} style={{ '--i': i }}>
            {sc.window ? <Window {...sc} /> : <Screen {...sc} />}
            <figcaption>{i + 1}. {sc.label}</figcaption>
          </figure>
        ))}
      </div>
      {note && <p className="st-walk-note">{note}</p>}
    </div>
  )
}

// Tab switch shared by the tabbed blocks: the selected item's one-line `lead`,
// then a segmented control, then `render(item)` below. Arrow keys move
// between tabs (and are kept from the deck, so the slide doesn't change).
// Inside a stepped deck slide (see Deck.jsx) the slide is pinned while it
// scrolls: the scroll position picks the tab, and picking a tab scrolls there.
// With `scrub`, the panels also follow the scroll itself: the next one fades
// in over the current one as the page moves, instead of on a timer.
function Tabbed({ items, label, render, scrub }) {
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(1) // 1 = moving forward, -1 = back
  const tabs = useRef([])
  const pill = useRef(null)
  const root = useRef(null)
  const id = useId()
  const curRef = useRef(0)
  const panels = useRef([])
  const go = (i) => {
    if (i === curRef.current) return
    setDir(i > curRef.current ? 1 : -1)
    curRef.current = i
    setCur(i)
  }

  // Slide the white pill under the selected tab.
  useLayoutEffect(() => {
    const place = () => {
      const btn = tabs.current[cur]
      if (!btn || !pill.current) return
      pill.current.style.width = `${btn.offsetWidth}px`
      pill.current.style.transform = `translateX(${btn.offsetLeft}px)`
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [cur])

  // The stepped slide this sits in, with its top and the height of one step.
  const stepped = () => {
    const slide = root.current?.closest('.deck-slide[data-steps]')
    if (!slide) return null
    const navH = parseFloat(getComputedStyle(slide).getPropertyValue('--nav-h')) || 0
    return { top: slide.getBoundingClientRect().top + window.scrollY - navH, h: slide.offsetHeight / items.length }
  }
  // Scrubbed crossfade: the lower panel stays solid and the next one fades in
  // on top of it across the middle of the step, eased at both ends, so the
  // grey stage never shows through.
  const paint = (raw) => {
    root.current?.querySelector('.st-panels')?.classList.add('is-scrub')
    const f = Math.max(0, Math.min(items.length - 1, raw))
    const a = Math.floor(f)
    const lin = Math.max(0, Math.min(1, (f - a - 0.1) / 0.8))
    const t = lin * lin * (3 - 2 * lin)
    panels.current.forEach((el, i) => {
      if (!el) return
      const o = i === a ? 1 : i === a + 1 ? t : 0
      el.style.opacity = String(o)
      el.style.visibility = o > 0 ? 'visible' : 'hidden'
    })
  }
  // Back to the class-driven crossfade (narrow screens, no stepped slide).
  const unpaint = () => {
    root.current?.querySelector('.st-panels')?.classList.remove('is-scrub')
    panels.current.forEach((el) => { if (el) el.style.opacity = el.style.visibility = '' })
  }
  useEffect(() => {
    let lastY = window.scrollY
    let heading = 0 // last clear scroll direction: 1 down, -1 up
    const onScroll = () => {
      const s = stepped()
      const y = window.scrollY
      // Smooth scrolling jitters by fractions of a pixel; only a clear move
      // changes the direction, so the tab can't flicker back and forth.
      if (Math.abs(y - lastY) > 3) { heading = y > lastY ? 1 : -1; lastY = y }
      if (!s) { if (scrub) unpaint(); return }
      // Switch once the page is a quarter of the way to the next step in the
      // direction it's moving, so the change starts with the scroll.
      const raw = (y - s.top) / s.h
      if (scrub) paint(raw)
      const now = curRef.current
      let i = now
      if (heading > 0 && raw > now + 0.25) i = now + 1
      else if (heading < 0 && raw < now - 0.25) i = now - 1
      // Landed far from the current tab (e.g. a jump from the topic bar).
      if (Math.abs(raw - now) > 1.25) i = Math.round(raw)
      go(Math.max(0, Math.min(items.length - 1, i)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  const select = (i) => {
    const s = stepped()
    if (s) scrollToY(s.top + i * s.h, 0.8)
    go(i)
  }
  const pick = (i) => {
    const n = (i + items.length) % items.length
    select(n)
    tabs.current[n]?.focus()
  }
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    e.stopPropagation()
    pick(cur + d)
  }
  const it = items[cur]
  return (
    <div className="st-tabs" ref={root}>
      {/* Description of the selected item, then the tabs. */}
      {it.lead && <p className="st-tabs-lead" key={cur}>{it.lead}</p>}
      <div className="st-tabs-bar">
        <div className="st-tablist" role="tablist" aria-label={label} onKeyDown={onKey}>
          <span className="st-tab-pill" ref={pill} aria-hidden="true" />
          {items.map((x, i) => (
            <button
              key={x.name}
              ref={(el) => { tabs.current[i] = el }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === cur}
              aria-controls={`${id}-panel`}
              tabIndex={i === cur ? 0 : -1}
              className={'st-tab' + (i === cur ? ' is-active' : '')}
              onClick={() => select(i)}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      {/* Every panel stays mounted, stacked in one cell, so switching
          crossfades instead of swapping; `data-dir` sets the drift. */}
      <div className="st-panels" data-dir={dir > 0 ? 'next' : 'prev'}>
        {items.map((x, i) => (
          <div
            key={x.name}
            ref={(el) => { panels.current[i] = el }}
            className={'st-panel' + (i === cur ? ' is-active' : '')}
            role="tabpanel"
            id={i === cur ? `${id}-panel` : undefined}
            aria-labelledby={`${id}-tab-${i}`}
            aria-hidden={i !== cur}
            inert={i !== cur}
          >
            {render(x, i, i === cur)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Design walkthrough with a tab per flow (e.g. Ordering, Live order board).
// Each flow is { name, lead, screens, note }.
export function WalkTabs({ flows }) {
  return <Tabbed items={flows} label="Flows" render={(f) => <Walkthrough screens={f.screens} note={f.note} />} />
}

// Flows one at a time (OrderFlow's Design Execution): the flow's title and a
// short line in the middle, arrows either side to move between flows, and its
// step-by-step Demo below. When a flow's recording ends it moves on to the
// next one by itself, wrapping round. Each item is { title, p, ...Demo props };
// `label` names the carousel for screen readers.
export function FlowSwitch({ items, device, label }) {
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(1)
  const n = items.length
  // flows already shown keep their video, so coming back doesn't load it again
  const [seen, setSeen] = useState(() => new Set([0]))
  const show = (i, d) => { setDir(d); setCur(i); setSeen((s) => (s.has(i) ? s : new Set(s).add(i))) }
  const go = (d) => show((cur + d + n) % n, d)
  const pick = (i) => { if (i !== cur) show(i, i > cur ? 1 : -1) }
  const it = items[cur]
  const prev = items[(cur - 1 + n) % n], next = items[(cur + 1) % n]
  // Start loading once the section is within a screen or so of the viewport:
  // the flow on screen and the one after it, so moving on starts at once.
  const root = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el || near) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true) }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])
  const wants = (i) => near && (i === cur || i === (cur + 1) % n || seen.has(i))
  return (
    <div className="st-flows" ref={root} role="region" aria-roledescription="carousel" aria-label={label ? label + ' flows' : 'Flows'}>
      <div className="st-flows-head">
        <button type="button" className="st-flows-arrow" onClick={() => go(-1)} aria-label={'Previous flow: ' + prev.title}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="st-flows-text" key={cur} data-dir={dir > 0 ? 'next' : 'prev'} aria-live="polite">
          <h2 className="sv-h2 st-flows-title">{it.title}</h2>
          {it.p && <p className="st-flows-p">{it.p}</p>}
        </div>
        <button type="button" className="st-flows-arrow" onClick={() => go(1)} aria-label={'Next flow: ' + next.title}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="st-flows-dots">
        {items.map((x, i) => (
          <button key={x.title} type="button" className={i === cur ? 'is-on' : undefined} onClick={() => pick(i)} aria-label={x.title} aria-current={i === cur ? 'true' : undefined} />
        ))}
      </div>
      <div className="st-panels" data-dir={dir > 0 ? 'next' : 'prev'}>
        {items.map((x, i) => (
          <div key={x.title} className={'st-panel' + (i === cur ? ' is-active' : '')} aria-hidden={i !== cur} inert={i !== cur}>
            <Demo device={device} {...x} active={i === cur} onEnd={() => go(1)} load={wants(i)} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Screenshots behind tabs (e.g. Today / Proposed). Each item is
// { name, lead, ...Shot props }.
export function ShotTabs({ items }) {
  return <Tabbed items={items} label="Views" scrub render={(it) => <Shot {...it} />} />
}

// ---------------------------------------------------------------------------
// Screen recording of the real product (made with tools/case-video), shown
// like the demos on diana.lu: a big rounded video, muted and looping, with a
// small "Demo n" label and a one-line title above it. It plays only while it
// is on screen; with reduced motion it shows the poster and a play button.
// `eager` starts downloading the video as the page loads (a film near the top),
// so it is buffered by the time it scrolls into view.
export function Reel({ src, poster, audio, label, title, ratio = '16 / 9', alt, eager = false }) {
  const ref = useRef(null)
  const song = useRef(null)
  const seek = useRef(null)
  const [sound, setSound] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (prefersReduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [userPaused])
  const toggle = () => {
    const v = ref.current
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) } else { setUserPaused(true); v.pause() }
  }
  // The song is its own track (`audio`), off until asked for: browsers block
  // sound that starts by itself. It follows the video: same position, and it
  // stops whenever the video stops, including when scrolled out of view.
  const follow = () => {
    const v = ref.current, a = song.current
    if (!a || !sound) return
    if (Math.abs(a.currentTime - v.currentTime) > 0.25) a.currentTime = v.currentTime
    if (a.paused && !v.paused) a.play().catch(() => {})
  }
  // Seek bar: it tracks the video each frame while playing (written straight to
  // the input, no re-render); dragging it moves the video and the song.
  const paint = useCallback((t) => {
    const s = seek.current, d = ref.current?.duration
    if (!s || !Number.isFinite(d) || !d) return
    if (!s.dataset.drag) s.value = t
    s.style.setProperty('--seek', `${(t / d) * 100}%`)
  }, [])
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => { paint(ref.current.currentTime); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, paint])
  const onSeek = (e) => {
    const t = Number(e.target.value)
    const v = ref.current, a = song.current
    v.currentTime = t
    if (a && sound) a.currentTime = t
    paint(t)
  }
  // Full screen: the whole frame, so these controls stay on top. iPhone Safari
  // only lets the video itself go full screen, with its own controls.
  const frame = useRef(null)
  const [full, setFull] = useState(false)
  useEffect(() => {
    const on = () => setFull((document.fullscreenElement || document.webkitFullscreenElement) === frame.current)
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])
  const toggleFull = () => {
    const f = frame.current, v = ref.current
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return }
    if (f.requestFullscreen) f.requestFullscreen().catch(() => {})
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen()
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
  }
  const toggleSound = () => {
    const v = ref.current, a = song.current
    if (sound) { setSound(false); a.pause(); return }
    setSound(true)
    a.volume = 0.7 // the song is mastered loud
    a.currentTime = v.currentTime
    a.play().catch(() => setSound(false)) // inside the click, so browsers allow it
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) }
  }
  return (
    <div className="st-reel">
      {(label || title) && (
        <div className="st-reel-head">
          {label && <span className="st-reel-label">{label}</span>}
          {title && <span className="st-reel-title">{title}</span>}
        </div>
      )}
      <div className="st-reel-frame" ref={frame} style={{ aspectRatio: ratio }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={eager ? 'auto' : 'none'}
          aria-label={alt || title}
          onPlay={() => { setPlaying(true); follow() }}
          onPause={() => { setPlaying(false); song.current?.pause() }}
          onTimeUpdate={follow}
          onLoadedMetadata={(e) => { if (seek.current && Number.isFinite(e.target.duration)) seek.current.max = e.target.duration }}
        />
        {audio && <audio ref={song} src={audio} preload="none" />}
        <div className="st-reel-ctrls">
          <span className="st-reel-seek">
            <input
              ref={seek}
              type="range"
              min="0"
              max="100"
              step="0.01"
              defaultValue="0"
              aria-label="Move through the video"
              onInput={onSeek}
              onPointerDown={(e) => { e.currentTarget.dataset.drag = '1' }}
              onPointerUp={(e) => { delete e.currentTarget.dataset.drag }}
            />
          </span>
          <button type="button" className={'st-reel-btn' + (playing ? ' is-playing' : '')} onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
            {playing ? ICONS.pause : ICONS.play}
          </button>
          <button type="button" className="st-reel-btn is-aux" onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'Full screen'}>
            {full ? ICONS.shrink : ICONS.expand}
          </button>
          {audio && (
            <button type="button" className="st-reel-btn is-sound" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'}>
              {sound ? ICONS.soundOn : ICONS.soundOff}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const stepNo = (i) => String(i + 1).padStart(2, '0')

// Step-by-step demo: the app screen recording (screen only, made with
// tools/case-video raw mode) inside a phone drawn in CSS, and the steps as
// plain text beside it. No panel behind either, so only the text and the
// mockup show. The step in view follows the video; picking a step seeks
// there. `steps` are { t: seconds, text }.
// `active` false (a hidden flow) keeps it paused, and it starts over each
// time it comes back. With `onEnd` it plays once and calls it at the end
// (FlowSwitch moves on to the next flow) instead of looping.
// `load` false holds back the video and its poster (FlowSwitch only loads the
// flow on screen and the next one, once the section is close).
export function Demo({ src, poster, steps = [], alt, device = 'phone', active = true, onEnd, load = true }) {
  const ref = useRef(null)
  const [at, setAt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v || prefersReduced()) return
    if (!active || !load) { v.pause(); return }
    if (onEnd) v.currentTime = 0 // timeupdate then moves the step list back to the first step
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.3 })
    io.observe(v)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPaused, active, load])
  const onTime = () => {
    const t = ref.current.currentTime
    let k = 0
    steps.forEach((s, i) => { if (s.t <= t + 0.05) k = i })
    setAt(k)
  }
  const seek = (i) => {
    const v = ref.current
    v.currentTime = steps[i].t + 0.05
    setAt(i)
    if (v.paused && !prefersReduced()) { setUserPaused(false); v.play().catch(() => {}) }
  }
  const toggle = () => {
    const v = ref.current
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) } else { setUserPaused(true); v.pause() }
  }
  // Full screen shows just the recording, with the browser's own controls.
  const toggleFull = () => {
    const v = ref.current
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return }
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
  }
  useEffect(() => {
    const v = ref.current
    const on = () => { v.controls = (document.fullscreenElement || document.webkitFullscreenElement) === v }
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])
  return (
    <div className={'st-demo is-' + device}>
      <ol className="st-demo-steps">
        {steps.map((s, i) => (
          <li key={s.t}>
            <button type="button" className={'st-demo-step' + (i === at ? ' is-on' : i < at ? ' is-done' : '')} onClick={() => seek(i)} aria-current={i === at ? 'step' : undefined}>
              <span className="st-step-n">{stepNo(i)}</span>
              <span className="st-demo-text">{s.text}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className={device === 'browser' ? 'st-browser' : 'st-device'}>
        {device === 'browser' && <div className="st-browser-bar" aria-hidden="true"><i /><i /><i /></div>}
        <div className={device === 'browser' ? 'st-browser-page' : 'st-device-screen'}>
          <video
            ref={ref}
            src={load ? src : undefined}
            poster={load ? poster : undefined}
            muted
            loop={!onEnd}
            playsInline
            preload={load && onEnd ? 'auto' : 'none'}
            aria-label={alt}
            onTimeUpdate={onTime}
            onEnded={onEnd}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {device !== 'browser' && <span className="st-device-island" aria-hidden="true" />}
        </div>
        <button type="button" className={'st-reel-btn st-demo-btn' + (playing ? ' is-playing' : '')} onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? ICONS.pause : ICONS.play}
        </button>
        <button type="button" className="st-reel-btn st-demo-btn st-demo-full is-aux" onClick={toggleFull} aria-label="Full screen">
          {ICONS.expand}
        </button>
      </div>
    </div>
  )
}

// Design choices beside one phone: picking (or hovering) a choice brings up
// its screen; while in view it moves on by itself, with a thin bar filling
// under the current choice. Any click stops the auto-advance. `items` are
// { h, p, src, alt }.
// `label` titles the block; `ratio` sets the browser page shape (default 1440 / 900).
export function Choices({ items, ms = 4200, device = 'phone', label, ratio }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const [at, setAtRaw] = useState(0)
  const [prev, setPrev] = useState(null)
  const setAt = (n) => setAtRaw((cur) => { const v = typeof n === 'function' ? n(cur) : n; if (v !== cur) setPrev(cur); return v })
  const [auto, setAuto] = useState(true)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (!seen || !auto || hold || prefersReduced()) return
    const id = setTimeout(() => setAt((x) => (x + 1) % items.length), ms)
    return () => clearTimeout(id)
  }, [seen, auto, hold, at, ms, items.length])
  const running = seen && auto && !hold && !prefersReduced()
  return (
    <div className={'st-choices is-' + device} ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      {label && <h3 className="cs-stat-h st-choices-label">{label}</h3>}
      <ol className="st-choices-list">
        {items.map((it, i) => (
          <li key={it.h}>
            <button
              type="button"
              className={'st-choice' + (i === at ? ' is-on' : '')}
              aria-pressed={i === at}
              onClick={() => { setAt(i); setAuto(false) }}
              onMouseEnter={() => setAt(i)}
              onFocus={() => setAt(i)}
            >
              <span className="st-step-n">{stepNo(i)}</span>
              <span className="st-choice-body">
                <span className="st-choice-h">{it.h}</span>
                <span className="st-choice-p">{it.p}</span>
                <span className="st-choice-bar" aria-hidden="true">
                  {i === at && <i key={at} style={{ animationDuration: `${ms}ms`, animationPlayState: running ? 'running' : 'paused' }} />}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className={device === 'browser' ? 'st-browser' : 'st-device'}>
        {device === 'browser' && <div className="st-browser-bar" aria-hidden="true"><i /><i /><i /></div>}
        <div className={device === 'browser' ? 'st-browser-page' : 'st-device-screen'} style={device === 'browser' && ratio ? { aspectRatio: ratio } : undefined}>
          {items.map((it, i) => (
            <img key={i === at ? `${it.src}-${at}` : it.src} src={it.src} alt={it.alt} className={i === at ? 'is-on' : i === prev ? 'is-prev' : undefined} aria-hidden={i !== at} />
          ))}
          {device !== 'browser' && <span className="st-device-island" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Phone screen drawn from parts. Each part is { t: type, ...props }.
export function Screen({ dark, title, right, parts = [] }) {
  return (
    <div className={'sc-phone' + (dark ? ' is-dark' : '')}>
      <div className="sc-status"><span>9:41</span><span className="sc-dots" /></div>
      {title && (
        <div className="sc-top">
          <b>{title}</b>
          {right === 'lang' && <span className="sc-seg"><b>EN</b><i>မြန်မာ</i></span>}
          {right && right !== 'lang' && <span className="sc-right">{right}</span>}
        </div>
      )}
      <div className="sc-body">{parts.map((p, i) => <Part key={i} {...p} />)}</div>
    </div>
  )
}

function Part({ t, ...p }) {
  switch (t) {
    case 'chips':
      return <div className="sc-chips">{p.items.map((c, i) => <span key={c} className={i === (p.active ?? 0) ? 'is-on' : undefined}>{c}</span>)}</div>
    case 'row':
      return (
        <div className="sc-row">
          {!p.noThumb && <span className="sc-thumb" />}
          <span className="sc-col"><b>{p.name}</b>{p.sub && <i>{p.sub}</i>}</span>
          {p.tag && <em className={'sc-tag is-' + (p.tone || 'ok')}>{p.tag}</em>}
          {p.add != null && <span className={'sc-add' + (p.add ? ' is-on' : '')}>{p.add || '+'}</span>}
        </div>
      )
    case 'alert':
      return <div className={'sc-alert is-' + (p.tone || 'warn')}>{p.text}</div>
    case 'meter':
      return (
        <div className="sc-meter">
          <span><b>${p.left.toFixed(2)}</b> of ${p.of} left</span>
          <span className="sc-meter-track"><span style={{ width: `${(p.left / p.of) * 100}%` }} /></span>
        </div>
      )
    case 'block':
      return <div className="sc-block"><i>{p.label}</i><b>{p.value}</b></div>
    case 'steps':
      return <div className="sc-steps">{p.items.map((s, i) => <span key={s} className={i < p.done ? 'is-done' : i === p.done ? 'is-now' : undefined}>{s}</span>)}</div>
    case 'big':
      return (
        <div className="sc-big">
          <span className={'sc-big-icon' + (p.tone ? ' is-' + p.tone : '')}>{ICONS[p.icon] || ICONS.check}</span>
          <b>{p.title}</b>
          {p.sub && <i>{p.sub}</i>}
        </div>
      )
    case 'qr':
      return <div className="sc-qr"><span className="sc-qr-frame">{ICONS.qr}</span><i>{p.text}</i></div>
    case 'img':
      return <div className="sc-img" />
    case 'opts':
      return (
        <div className="sc-opts">
          <i>{p.label}</i>
          {p.items.map((o, i) => <span key={o} className={i === p.selected ? 'is-on' : undefined}>{o}</span>)}
        </div>
      )
    case 'stop':
      return <div className="sc-stop"><b>{p.name}</b><i>{p.sub}</i></div>
    case 'people':
      return <div className="sc-people">{p.items.map((n, i) => <span key={n} className={i < (p.done || 0) ? 'is-done' : undefined}>{n}</span>)}</div>
    case 'total':
      return <div className="sc-total"><span>{p.label}</span><b>{p.value}</b></div>
    case 'text':
      return <p className="sc-text">{p.text}</p>
    case 'ghost':
      return <div className="sc-ghost">{p.text}</div>
    case 'cta':
      return <div className={'sc-cta' + (p.tone ? ' is-' + p.tone : '')}>{p.text}</div>
    default:
      return null
  }
}

// Desktop window: an order board, a table or a stats view.
export function Window({ title, view, lanes, cols, rows, tiles, bars }) {
  return (
    <div className="sc-window">
      <div className="sc-bar"><i /><i /><i /><span>{title}</span></div>
      {view === 'board' && (
        <div className="sc-board">
          {lanes.map((l) => (
            <div className="sc-lane" key={l.name}>
              <span className="sc-lane-h">{l.name}<em>{l.tickets.length}</em></span>
              {l.tickets.map((tk) => <Ticket key={tk.t} {...tk} />)}
            </div>
          ))}
        </div>
      )}
      {view === 'table' && (
        <table className="sc-table">
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
        </table>
      )}
      {view === 'stats' && (
        <div className="sc-statsview">
          <div className="sc-tiles">{tiles.map((t) => <div key={t.label}><i>{t.label}</i><b>{t.num}</b></div>)}</div>
          <div className="sc-bars">{bars.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
        </div>
      )}
    </div>
  )
}

function Ticket({ t, src, n, fresh }) {
  return (
    <div className={'sc-ticket' + (fresh ? ' is-new' : '')}>
      <b>{t}</b>
      <span><em className={'sc-src src-' + src.toLowerCase()}>{src}</em>{n}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product film: a short looping animation of the product in use, shown like
// a video: a rounded frame with the scene's subtitle over its foot. Starts when in
// view; on deck slides it zooms to fill the screen as you scroll in.
export function Film({ name }) {
  const script = FILMS[name]
  const ref = useRef(null)
  const frame = useRef(null)
  const seen = useInView(ref, '0px 0px -25% 0px')
  const scene = useTicker(script.scenes.length, 3200, seen)
  const sc = script.scenes[scene]
  useZoomToFill(ref, frame)
  return (
    <div className="st-film" ref={ref}>
      <div className="st-film-frame" ref={frame}>
        <div className="st-film-stage" aria-hidden="true">{script.render(sc)}</div>
        <div className="st-film-overlay">
          <p className="st-film-cap" key={scene} aria-live="polite">{sc.cap}</p>
        </div>
      </div>
    </div>
  )
}

// Scroll-linked zoom for the film on deck slides: as its slide scrolls into
// place, the frame grows from its card size until it fills the slide, and the
// slide's heading fades out; scrolling away shrinks it back. Only runs when
// the deck is paged (wide screens) and motion isn't reduced.
function useZoomToFill(wrapRef, frameRef) {
  useEffect(() => {
    const wrap = wrapRef.current
    const el = frameRef.current
    const slide = wrap?.closest('.deck-slide')
    if (!slide || prefersReduced()) return
    const heading = slide.querySelector('.cs-heading')
    let raf = 0
    const reset = () => {
      el.style.transform = el.style.borderRadius = ''
      wrap.style.removeProperty('--zoom')
      if (heading) heading.style.opacity = ''
    }
    const update = () => {
      raf = 0
      if (!slide.closest('.deck.is-on')) return reset()
      const navH = parseFloat(getComputedStyle(slide).getPropertyValue('--nav-h')) || 0
      const s = slide.getBoundingClientRect()
      const h = s.height
      // 0 when the slide is a screen away, 1 when it's settled in place.
      const raw = Math.max(0, 1 - Math.abs(s.top - navH) / (h * 0.75))
      const p = raw * raw * (3 - 2 * raw)
      el.style.transform = 'none'
      const r = el.getBoundingClientRect()
      const zoom = parseFloat(getComputedStyle(el.closest('.deck-inner')).zoom) || 1
      const k = Math.min(Math.max(s.width / r.width, h / r.height), 2.2)
      const dx = (s.left + s.width / 2 - (r.left + r.width / 2)) / zoom
      const dy = (s.top + h / 2 - (r.top + r.height / 2)) / zoom
      el.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${1 + (k - 1) * p})`
      el.style.borderRadius = `${(24 * (1 - p)) / (1 + (k - 1) * p)}px`
      wrap.style.setProperty('--zoom', p.toFixed(3))
      if (heading) heading.style.opacity = String(1 - Math.min(1, p * 1.4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    // Re-measure once fonts and the slide's own layout have settled.
    const late = setTimeout(onScroll, 1200)
    document.fonts?.ready.then(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(late)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reset()
    }
  }, [wrapRef, frameRef])
}

const FILMS = {
  superfine: {
    scenes: [
      { cap: 'An employee opens today’s menu and sees what their allowance covers.', emp: 'menu', drv: 'idle' },
      { cap: 'They order before the cut-off, with the countdown in view.', emp: 'placed', drv: 'idle' },
      { cap: 'At cut-off, orders lock and the kitchen starts preparing.', emp: 'preparing', drv: 'idle' },
      { cap: 'The driver’s run is grouped by building, with a checklist of people.', emp: 'out', drv: 'stop' },
      { cap: 'One tap marks it delivered, and the employee sees it straight away.', emp: 'delivered', drv: 'done' },
    ],
    render(sc) {
      const steps = ['Placed', 'Locked at cut-off', 'Preparing', 'Out for delivery', 'Delivered']
      const done = { menu: 0, placed: 1, preparing: 2, out: 3, delivered: 5 }[sc.emp]
      const emp = sc.emp === 'menu'
        ? { title: 'Today’s lunch', parts: [{ t: 'alert', text: 'Ordering closes in 42 min' }, { t: 'meter', left: 12.5, of: 15 }, { t: 'row', name: 'Chicken grain bowl', tag: 'Covered' }, { t: 'row', name: 'Tofu banh mi', tag: 'Covered' }, { t: 'row', name: 'Seasonal salad', tag: '+$2.00', tone: 'over' }] }
        : { title: 'Your lunch', parts: [{ t: 'block', label: 'Chicken grain bowl', value: 'Covered by allowance' }, { t: 'steps', items: steps, done }, { t: 'block', label: 'Deliver to', value: 'Office · Floor 12' }] }
      const drv = {
        idle: { dark: true, title: 'Today’s run', parts: [{ t: 'text', text: 'Your run starts after the kitchen packs the orders.' }] },
        stop: { dark: true, title: 'Stop 2 of 6', parts: [{ t: 'stop', name: 'Montgomery Tower', sub: 'Floor 12 · Reception' }, { t: 'people', items: ['Alex R.', 'Priya S.', 'Jordan M.'], done: 1 }, { t: 'cta', text: 'Mark delivered', tone: 'yellow' }] },
        done: { dark: true, title: 'Stop 2 of 6', parts: [{ t: 'stop', name: 'Montgomery Tower', sub: 'Floor 12 · Reception' }, { t: 'people', items: ['Alex R.', 'Priya S.', 'Jordan M.'], done: 3 }, { t: 'big', icon: 'check', title: 'All delivered', tone: 'ok' }] },
      }[sc.drv]
      return (
        <div className="st-film-sf">
          <Screen {...emp} />
          <div className={sc.drv === 'idle' ? 'is-dim' : undefined}><Screen {...drv} /></div>
        </div>
      )
    },
  },
}

// ---------------------------------------------------------------------------
// Simple line icons (24px grid, stroke = currentColor).
const svg = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
)
const ICONS = {
  handoff: svg(<><circle cx="5" cy="12" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 11l3.5-3.5M14 7.5L17 10.5M17 13.5L14 16.5M10 16.5L7 13" /></>),
  menu: svg(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /><path d="M16 16l2 2" /></>),
  eye: svg(<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /><path d="M4 20L20 4" /></>),
  box: svg(<><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>),
  clock: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  wallet: svg(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h2M3 9h18" /></>),
  building: svg(<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" /></>),
  mail: svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  person: svg(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6" /></>),
  qr: svg(<><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>),
  send: svg(<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />),
  check: svg(<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>),
  bell: svg(<><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" /><path d="M10 20a2 2 0 004 0" /></>),
  soundOn: svg(<><path d="M11 5L6.5 9H3v6h3.5L11 19V5z" /><path d="M15.5 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></>),
  soundOff: svg(<><path d="M11 5L6.5 9H3v6h3.5L11 19V5z" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></>),
  expand: svg(<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />),
  shrink: svg(<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />),
  play: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>,
}
