import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NAV, ABOUT } from '../data'
import { Icon, TakeNote } from './ui'
import { useDragPill } from '../useDragPill'

const isActive = (href, path) =>
  href === '/' ? path === '/' : path === href || path.startsWith(href + '/')

// Floating icon dock: a vertical pill on the right edge on wide screens, a
// horizontal bar at the bottom on phones. Each icon shows its label on hover.
// One glass circle sits behind the active icon and slides to the new one
// when the page changes; it can also be dragged to another icon, which opens
// that page on release.
//
// Below the pages sits a "My take" button: it opens my handwritten note as a
// glass box beside the dock (left of it on wide screens, above the bar on
// phones). Clicking it again, clicking elsewhere, Esc or a page change closes it.
const SIZE = 56
const horizontal = () => window.matchMedia('(max-width: 1100px)').matches

export default function Dock({ path }) {
  const root = useRef(null)
  const items = useRef([])
  const [pos, setPos] = useState(null)
  const activeIndex = NAV.findIndex((item) => isActive(item.href, path))

  useLayoutEffect(() => {
    const place = () => {
      const el = items.current[activeIndex]
      setPos(el ? { x: el.offsetLeft, y: el.offsetTop, w: SIZE, h: SIZE } : null)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [activeIndex])

  const drag = useDragPill({
    root,
    axis: () => (horizontal() ? 'x' : 'y'),
    items: () => NAV.flatMap((it, i) => (it.external ? [] : [{ key: i, el: items.current[i] }])), // pages only, not the resume
    pill: pos,
    current: activeIndex,
    onPick: (i) => items.current[i]?.click(), // a normal (untrusted) click navigates
  })
  const shownOn = drag.near ?? activeIndex

  const [take, setTake] = useState(false)
  const takeBtn = useRef(null)
  const takeBox = useRef(null)
  useEffect(() => { setTake(false) }, [path])
  // other buttons (e.g. the About photo's "My take" chip) can open it
  useEffect(() => {
    const open = () => setTake(true)
    window.addEventListener('sv:take', open)
    return () => window.removeEventListener('sv:take', open)
  }, [])
  useEffect(() => {
    if (!take) return
    const onKey = (e) => { if (e.key === 'Escape') { setTake(false); takeBtn.current?.focus() } }
    const onDown = (e) => {
      if (takeBox.current?.contains(e.target) || takeBtn.current?.contains(e.target)) return
      setTake(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [take])

  return (
    <>
    <nav className={'sv-dock' + (drag.dragging ? ' is-dragging' : '')} aria-label="Main" ref={root} {...drag.handlers}>
      <span
        className={'sv-dock-glass' + (pos ? '' : ' is-hidden')}
        style={drag.pillStyle()}
        aria-hidden="true"
      />
      {NAV.map((item, i) => {
        const on = i === activeIndex
        return (
          <a
            key={item.href}
            ref={(el) => { items.current[i] = el }}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={'sv-dock-item' + (shownOn === i ? ' is-active' : '')}
            aria-label={item.external ? `${item.label} (opens in a new tab)` : item.label}
            aria-current={on ? 'page' : undefined}
            onClick={(e) => { if (e.isTrusted) drag.blockClick(e) }}
            draggable={false}
          >
            <Icon name={item.icon} size={22} />
            <span className="sv-dock-tip" aria-hidden="true">{item.label}</span>
          </a>
        )
      })}
      {ABOUT.takes?.length > 0 && (
        <>
          <span className="sv-dock-sep" aria-hidden="true" />
          <button
            ref={takeBtn}
            type="button"
            className={'sv-dock-item sv-dock-take' + (take ? ' is-open' : '')}
            aria-label="My take"
            aria-expanded={take}
            aria-controls="sv-take-pop"
            onClick={() => setTake((v) => !v)}
          >
            <Icon name="quote" size={21} />
            <span className="sv-dock-tip" aria-hidden="true">My take</span>
          </button>
        </>
      )}
    </nav>
    <TakeNote id="sv-take-pop" boxRef={takeBox} className="sv-take-pop" open={take} />
    </>
  )
}
