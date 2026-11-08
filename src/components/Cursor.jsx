import { useEffect, useRef } from 'react'

// Custom cursor (mouse / trackpad only; not for touch or reduced motion):
// a small circle with a white rim and soft glow that glides after the
// pointer and shrinks a little on click.
//
// Over a few chosen elements (pill buttons like "More Works", the "About me"
// arrow chip, the OrderFlow / Heizen links, back buttons, testimonial arrows,
// the About page core values and the "Let's connect" social icons)
// it flows into the button, taking its size and rounded corners, then fades
// out as if absorbed, while the button is pulled a few pixels toward the
// pointer like a magnet. Leaving springs it back.
//
// Over an element marked data-cursor="drag" (none right now) it grows
// into a glass pill reading "‹ Drag ›", so people know they can pull it;
// while the button is held it squeezes slightly.

const TARGETS = [
  '.sv-btn',               // pill buttons, e.g. "More Works"
  '.sv-round',             // testimonial arrows
  '.sv-back',              // round back buttons
  '.sv-connect .sv-social', // "Let's connect" social icons
  '.sv-intro-note a',      // OrderFlow / Heizen links in the intro card
  '.sv-services .sv-pill', // core values on the About page
  '.sv-track-step',        // About page workflow steps (absorbed into the dot)
  '.st-flows-arrow',       // OrderFlow flow arrows
  '.sv-toc-back',          // "Back to work" in the case study's side menu (absorbed into its arrow chip)
].join(', ')

// The element the cursor wraps and pulls: usually the hit itself, but a
// workflow step is a dot plus a name, and only the dot should take it.
const visualOf = (el) => (el?.matches('.sv-track-step') ? el.querySelector('.sv-track-dot') || el
  : el?.matches('.sv-toc-back') ? el.querySelector('.sv-toc-back-ic') || el : el)
const SIZE = 22
const PILL = { w: 92, h: 38 }
const MAG = { pull: 0.22, max: 10, pad: 6 }
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, m) => Math.max(-m, Math.min(m, v))

// The intro card is one big link with the "About me" chip drawn on top
// (aria-hidden, so it never receives the pointer). Treat the chip as the
// target only while the pointer is actually over it.
function chipUnder(el, x, y) {
  const link = el.closest?.('.sv-intro .sv-card-link, .sv-photo-hero .sv-card-link')
  if (!link) return null
  const chip = link.parentElement.querySelector('.sv-intro-hint')
  if (!chip) return null
  const r = chip.getBoundingClientRect()
  return x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 4 && y <= r.bottom + 4 ? chip : null
}

function radiusOf(el, w, h) {
  const cs = getComputedStyle(el).borderTopLeftRadius
  const raw = cs.endsWith('%') ? (parseFloat(cs) / 100) * Math.min(w, h) : parseFloat(cs) || 8
  return Math.min(raw, Math.min(w, h) / 2)
}

export default function Cursor() {
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const p = { x: -100, y: -100 }
    const c = { x: -100, y: -100, w: SIZE, h: SIZE, r: SIZE / 2, o: 0, l: 0 }
    let hidden = true
    let press = false
    let drag = false
    let wasDrag = false // to switch circle <-> Drag pill instantly, with no grow
    let raf = 0
    let lastTarget = null // last element under the pointer (for the chip check)
    let target = null // button the cursor is absorbed into
    let pull = { x: 0, y: 0 } // its magnetic offset
    const releasing = new Map() // buttons springing back: el -> {x, y}

    const release = (el) => {
      if (!el) return
      releasing.set(el, { ...pull })
      pull = { x: 0, y: 0 }
    }
    const setTarget = (next) => {
      if (next === target) return
      release(target)
      if (next && releasing.has(next)) { pull = releasing.get(next); releasing.delete(next) }
      target = next
    }

    const onMove = (e) => {
      p.x = e.clientX
      p.y = e.clientY
      if (hidden && c.o === 0) { c.x = p.x; c.y = p.y } // appear where the pointer is
      hidden = false
      lastTarget = e.target
      drag = !!e.target.closest?.('[data-cursor="drag"]')
      setTarget(drag ? null : visualOf(e.target.closest?.(TARGETS)) || chipUnder(e.target, p.x, p.y))
    }
    const onOut = (e) => { if (!e.relatedTarget) { hidden = true; setTarget(null) } }
    const onDown = () => { press = true }
    const onUp = () => { press = false }

    const frame = () => {
      raf = requestAnimationFrame(frame)

      // the chip can slide under a still pointer as it opens; re-check it
      if (lastTarget && !drag && (!target || target.matches('.sv-intro-hint'))) {
        const hit = visualOf(lastTarget.closest?.(TARGETS)) || chipUnder(lastTarget, p.x, p.y)
        setTarget(hit)
      }

      let tx, ty, tw, th, tr, to
      if (target && target.isConnected) {
        const rect = target.getBoundingClientRect()
        // the rect includes our own pull; take it out to find the resting centre
        const cx = rect.left + rect.width / 2 - pull.x
        const cy = rect.top + rect.height / 2 - pull.y
        pull.x = lerp(pull.x, clamp((p.x - cx) * MAG.pull, MAG.max), 0.18)
        pull.y = lerp(pull.y, clamp((p.y - cy) * MAG.pull, MAG.max), 0.18)
        target.style.translate = `${pull.x.toFixed(2)}px ${pull.y.toFixed(2)}px`
        tw = rect.width + MAG.pad * 2
        th = rect.height + MAG.pad * 2
        tx = cx + pull.x
        ty = cy + pull.y
        tr = radiusOf(target, rect.width, rect.height) + MAG.pad
        to = 0 // flows in, then fades away
      } else {
        if (target) target = null
        tx = p.x
        ty = p.y
        tw = drag ? PILL.w * (press ? 0.88 : 1) : SIZE * (press ? 0.75 : 1)
        th = drag ? PILL.h * (press ? 0.9 : 1) : SIZE * (press ? 0.75 : 1)
        tr = Math.min(tw, th) / 2
        to = hidden ? 0 : 1
      }

      // buttons springing back to rest
      releasing.forEach((v, el) => {
        v.x = lerp(v.x, 0, 0.16)
        v.y = lerp(v.y, 0, 0.16)
        if (Math.abs(v.x) < 0.1 && Math.abs(v.y) < 0.1) {
          el.style.translate = ''
          releasing.delete(el)
        } else {
          el.style.translate = `${v.x.toFixed(2)}px ${v.y.toFixed(2)}px`
        }
      })

      const morphing = !!target
      c.x = lerp(c.x, tx, morphing ? 0.22 : 0.3)
      c.y = lerp(c.y, ty, morphing ? 0.22 : 0.3)
      // entering or leaving the drag strip: jump straight to the pill (or back
      // to the circle) instead of growing into it
      const snap = drag !== wasDrag && !target
      wasDrag = drag
      if (snap) { c.w = tw; c.h = th; c.r = tr; c.l = drag ? 1 : 0 }
      c.w = lerp(c.w, tw, 0.22)
      c.h = lerp(c.h, th, 0.22)
      c.r = lerp(c.r, tr, 0.22)
      c.o = lerp(c.o, to, morphing ? 0.08 : 0.2) // slower fade: you see it flow in first
      c.l = lerp(c.l, drag ? 1 : 0, 0.2)
      if (to === 0 && c.o < 0.01) c.o = 0

      const el = ring.current
      el.style.transform = `translate3d(${(c.x - c.w / 2).toFixed(2)}px, ${(c.y - c.h / 2).toFixed(2)}px, 0)`
      el.style.width = `${c.w.toFixed(2)}px`
      el.style.height = `${c.h.toFixed(2)}px`
      el.style.borderRadius = `${c.r.toFixed(2)}px`
      el.style.opacity = c.o.toFixed(3)
      el.classList.toggle('is-pill', c.l > 0.5)
      label.current.style.opacity = Math.max(0, (c.l - 0.4) / 0.6).toFixed(3)
    }
    raf = requestAnimationFrame(frame)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseout', onOut)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseout', onOut)
      root.classList.remove('has-cursor')
      if (target) target.style.translate = ''
      releasing.forEach((_, el) => { el.style.translate = '' })
    }
  }, [])

  return (
    <div className="sv-pointer" ref={ring} aria-hidden="true">
      <span className="sv-pointer-label" ref={label}>
        <svg viewBox="0 0 24 24" width="12" height="12"><path d="m15 5-7 7 7 7" /></svg>
        Drag
        <svg viewBox="0 0 24 24" width="12" height="12"><path d="m9 5 7 7-7 7" /></svg>
      </span>
    </div>
  )
}
