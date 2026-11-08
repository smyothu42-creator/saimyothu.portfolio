import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDragPill } from '../useDragPill'
import { EMAIL, SOCIALS, ABOUT, CONTACT_HINTS } from '../data'

// Shared building blocks for the glass-card layout: the card itself, pill
// buttons, the round back button, line icons and the "Let's connect" card.

export function Card({ as: Tag = 'section', className = '', children, ref, ...rest }) {
  return (
    <Tag ref={ref} className={'sv-card reveal ' + className} {...rest}>
      {children}
    </Tag>
  )
}

export function Button({ href, children, external, className = '', ...rest }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a className={'sv-btn ' + className} href={href} {...ext} {...rest}>
      {children}
    </a>
  )
}

export function BackButton({ href = '/', label = 'Back' }) {
  return (
    <a className="sv-back" href={href} aria-label={label} data-back>
      <Icon name="arrowLeft" />
    </a>
  )
}

// 24px line icons, stroke = currentColor.
const paths = {
  home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" /></>,
  resume: <><path d="M13.5 3.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8.5z" /><path d="M13.5 3.5v5h5" /><path d="M9 15h6" /></>,
  work: <><path d="M12 3.5 21 8.25l-9 4.75-9-4.75z" /><path d="m3 12.25 9 4.75 9-4.75" /><path d="m3 16 9 4.75L21 16" /></>,
  about: <><circle cx="12" cy="12" r="8.75" /><circle cx="12" cy="9.75" r="2.75" /><path d="M6.6 18.75c.9-2.45 2.9-3.75 5.4-3.75s4.5 1.3 5.4 3.75" /></>,
  contact: <><rect x="3" y="5.25" width="18" height="13.5" rx="2.75" /><path d="m3.75 7.75 6.9 5a2.3 2.3 0 0 0 2.7 0l6.9-5" /></>,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  quote: <><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M9.5 8.5v1.6c0 1.2-.6 2-1.6 2.4M14.5 8.5v1.6c0 1.2-.6 2-1.6 2.4" /></>,
  WhatsApp: <><path d="M3 21l1.65-4.8A8.5 8.5 0 1 1 7.8 19.4L3 21z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9 9.5z" /></>,
}

export function Icon({ name, size = 22, stroke = 1.6 }) {
  if (name === 'LinkedIn') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3V9zm6 0h3.8v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9z" />
      </svg>
    )
  }
  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M14 22v-8.5h2.9l.5-3.5H14V7.8c0-1 .4-1.8 1.9-1.8h1.7V3c-.8-.1-1.7-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6V10H7.5v3.5h3V22H14z" />
      </svg>
    )
  }
  if (name === 'Behance') {
    return <span className="sv-be" aria-hidden="true" style={{ fontSize: size * 0.82 }}>Bē</span>
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

// `onHint` (optional) hears which icon is hovered or focused, and null on leaving.
export function Socials({ onHint }) {
  const hint = (label) => (onHint ? {
    onPointerEnter: () => onHint(label),
    onPointerLeave: () => onHint(null),
    onFocus: () => onHint(label),
    onBlur: () => onHint(null),
  } : {})
  return (
    <div className="sv-socials">
      {/* a profile with no real link yet ('#') stays hidden */}
      {SOCIALS.filter((s) => s.href && s.href !== '#').map((s) => (
        <a key={s.label} className="sv-social" href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" {...hint(s.label)}>
          <Icon name={s.label} />
        </a>
      ))}
      <a className="sv-social" href={`mailto:${EMAIL}`} aria-label="Email" {...hint('Email')}>
        <Icon name="mail" />
      </a>
    </div>
  )
}

// Closing card on most pages.
export function ConnectCard() {
  const [hint, setHint] = useState(null)
  const canHover = !window.matchMedia?.('(hover: none)').matches
  const text = CONTACT_HINTS[hint] || (canHover ? CONTACT_HINTS.rest : CONTACT_HINTS.restTouch)
  return (
    <Card className="sv-connect">
      <h2 className="sv-connect-title">Let's talk over coffee</h2>
      <Socials onHint={setHint} />
      <p className={'sv-fan-hint sv-connect-note' + (hint ? '' : ' is-rest')} key={text}>{text}</p>
    </Card>
  )
}

// Segmented control: the side menu's glass capsule, with its blue glass pill
// on the selected option (Works filter, About page tabs). The pill slides on click and can
// be dragged (useDragPill): grab it, slide along, let go on an option.
export function Filter({ options, value, onChange, label, role }) {
  const root = useRef(null)
  const items = useRef({})
  const [pill, setPill] = useState(null)

  useLayoutEffect(() => {
    const place = () => {
      const el = items.current[value]
      if (el) setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [value])

  const drag = useDragPill({
    root,
    axis: 'x',
    items: () => options.map((o) => ({ key: o.id, el: items.current[o.id] })),
    pill,
    current: value,
    onPick: onChange,
  })
  const shownOn = drag.near ?? value

  return (
    <div
      className={'sv-filter' + (drag.dragging ? ' is-dragging' : '')}
      ref={root}
      role={role === 'tablist' ? 'tablist' : 'group'}
      aria-label={label}
      {...drag.handlers}
    >
      <span
        className={'sv-filter-pill' + (pill ? '' : ' is-hidden')}
        style={pill ? { ...drag.pillStyle(), width: pill.w, height: pill.h } : undefined}
        aria-hidden="true"
      />
      {options.map((o) => (
        <button
          key={o.id}
          ref={(el) => { items.current[o.id] = el }}
          className={'sv-filter-item' + (shownOn === o.id ? ' is-on' : '')}
          {...(role === 'tablist'
            ? { role: 'tab', 'aria-selected': value === o.id, 'aria-controls': o.panel }
            : { 'aria-pressed': value === o.id })}
          onClick={(e) => { if (!drag.blockClick(e)) onChange(o.id) }}
        >
          <span>{o.label}</span>
          {o.count != null && <span className="sv-filter-count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

// "My take" note: handwritten line on a glass card with a strip of tape and a
// signature. With several takes, up/down chevrons float gently just outside
// the card (where depends on `className`) and flip through them.
export function TakeNote({ id, className, open, boxRef, style }) {
  const takes = ABOUT.takes || []
  const n = takes.length
  const [i, setI] = useState(0) // the take showing
  const [to, setTo] = useState(0) // the take picked: the count follows it at once
  const [dir, setDir] = useState(1)
  const [leaving, setLeaving] = useState(false)
  const timer = useRef(null)
  const body = useRef(null)
  const inner = useRef(null)
  // The box eases to each take's height (the text itself never reflows).
  useLayoutEffect(() => {
    if (!inner.current) return
    const fit = () => { if (body.current && inner.current) body.current.style.height = `${inner.current.offsetHeight}px` }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(inner.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  if (!n) return null
  // The old take leaves, then the new one is written in. Quick clicks just move
  // the target, so they never queue up.
  const go = (d) => {
    const next = (to + d + n) % n
    setDir(d)
    setTo(next)
    setLeaving(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { setI(next); setLeaving(false) }, 170)
  }
  return (
    <div id={id} ref={boxRef} className={className + (open ? ' is-open' : '')} style={style} aria-hidden={!open} inert={!open}>
      {n > 1 && (
        <button type="button" className="sv-take-nav is-up" aria-label="Previous take" onClick={() => go(-1)}>
          <Icon name="chevronUp" size={28} stroke={1.8} />
        </button>
      )}
      <figure className="sv-card sv-text sv-take">
        <span className="sv-take-tape">my take{n > 1 && <span className="sv-take-count">{to + 1}/{n}</span>}</span>
        <div className="sv-take-body" ref={body}>
          <div ref={inner} aria-live="polite">
            <blockquote key={i} className={(leaving ? 'is-out ' : '') + (dir > 0 ? 'is-next' : 'is-prev')}><p>{takes[i]}</p></blockquote>
          </div>
        </div>
        {ABOUT.takeSign && <figcaption className="sv-take-sign">{ABOUT.takeSign}</figcaption>}
      </figure>
      {n > 1 && (
        <button type="button" className="sv-take-nav is-down" aria-label="Next take" onClick={() => go(1)}>
          <Icon name="chevron" size={28} stroke={1.8} />
        </button>
      )}
    </div>
  )
}
