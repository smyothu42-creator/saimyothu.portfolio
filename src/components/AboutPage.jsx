import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ABOUT, PROFILE } from '../data'
import { Card, BackButton, Button, Icon, ConnectCard, Filter, TakeNote } from './ui'
import { newestFirst, range } from '../dates'
import Testimonials from './Testimonials'


export default function AboutPage() {
  const roles = newestFirst(ABOUT.experience)

  return (
    <>
      <HeroSlides />

      {/* Intro and core values in one card: who I am, then what I stand by. */}
      <Card className="sv-text sv-services">
        <p className="sv-statement">{ABOUT.headline.join(' ')}</p>
        {ABOUT.bio.map((p, i) => <p key={i}>{p}</p>)}
        {ABOUT.showValues && (
          <>
            <p className="sv-label sv-label-left sv-values-label">My core values</p>
            <ul className="sv-pills">
              {ABOUT.values.map((v) => (
                <li key={v}><span className="sv-pill is-static"><span className="sv-pill-head">{v}</span></span></li>
              ))}
            </ul>
          </>
        )}

      </Card>


      {ABOUT.craft.show !== false && <Craft />}

      <Card>
        <div className="sv-exp-head-row">
          <h2 className="sv-h2">Work Experience</h2>
          <Button href="/Sai-Myo-Thu-Resume.pdf" external className="sv-resume" aria-label="Resume (opens the PDF)">
            Resume
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </Button>
        </div>
        <ul className="sv-exp">
          {roles.map((e) => <Role key={e.co} e={e} />)}
        </ul>
      </Card>

      <Testimonials />

      <ConnectCard />
    </>
  )
}

// "What a product designer does": (optionally) my view on the role, then
// tabs for the designer side and the entrepreneur side. Each tab is a glass
// progress track: one dot per step, joined by short segments that stop short
// of each circle and light up behind the current step,
// and the current step shown large underneath. It steps through on its own
// until someone picks a step (or hovers it); reduced motion: no auto-play.
function Craft() {
  const { showIntro, label, title, statement, body, tabs } = ABOUT.craft
  const [tab, setTab] = useState(tabs[0].id)
  const t = tabs.find((x) => x.id === tab)
  return (
    <Card className="sv-text sv-craft">
      {showIntro ? (
        <>
          <h2 className="sv-h2">{title}</h2>
          <p className="sv-statement">{statement}</p>
          <p>{body}</p>
        </>
      ) : null}
      <div className="sv-craft-tabs">
        <Filter
          role="tablist"
          label={label}
          value={tab}
          onChange={setTab}
          options={tabs.map((x) => ({ id: x.id, label: x.label, panel: `craft-${x.id}` }))}
        />
      </div>
      <Track key={t.id} t={t} />
    </Card>
  )
}

// `tab`: render as the panel of a tab (Craft); `delay`: ms per step while
// auto-playing; steps may carry a short `name` for under the dot (defaults
// to `word`).
function Track({ t, tab = true, delay = 3000 }) {
  const n = t.steps.length
  const [at, setAt] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (!auto || hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setAt((x) => (x + 1) % n), delay)
    return () => clearTimeout(id)
  }, [at, auto, hold, n, delay])
  const step = t.steps[at]

  return (
    <div
      className={'sv-craft-panel' + (tab ? '' : ' is-solo')}
      {...(tab ? { id: `craft-${t.id}`, role: 'tabpanel' } : {})}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onPointerDown={() => setAuto(false)} // any tap inside: stop auto-play so nothing moves under it
    >
      <ol className="sv-track" style={{ '--n': n }}>
        {t.steps.map((s, k) => (
          <li key={s.word}>
            <button
              className={'sv-track-step' + (k === at ? ' is-on' : k < at ? ' is-done' : '')}
              aria-pressed={k === at}
              onClick={() => { setAt(k); setAuto(false) }}
            >
              <span className="sv-track-dot" aria-hidden="true" />
              <span className="sv-track-name">{s.name || s.word}</span>
            </button>
            {k < n - 1 && <span className={'sv-track-seg' + (k < at ? ' is-done' : '')} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <div className="sv-track-now" aria-live="polite" key={at}>
        <h3>{step.word}</h3>
        <p>{step.line}</p>
      </div>
    </div>
  )
}

// The photo's "My take" note: drops out of the chip, right edges lined up,
// growing from the chip's corner. Lives in <body> (the photo card clips its
// contents) at page coordinates, so it scrolls with the page. Closes on a
// click elsewhere, Esc, or the photo again.
function TakeDrop({ open, anchor, trigger, onClose }) {
  const box = useRef(null)
  const [pos, setPos] = useState(null)
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = anchor.current?.getBoundingClientRect()
      if (r) setPos({ top: r.bottom + window.scrollY + 10, right: document.documentElement.clientWidth - r.right - window.scrollX })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, anchor])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { onClose(); trigger.current?.focus() } }
    const onDown = (e) => {
      if (box.current?.contains(e.target) || trigger.current?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, onClose, trigger])

  return createPortal(
    <TakeNote
      id="sv-take-drop"
      boxRef={box}
      className="sv-take-drop"
      open={!!(open && pos)}
      style={pos ? { top: pos.top, right: pos.right } : undefined}
    />,
    document.body,
  )
}

// One role: logo tile, "Role at Company", dates; opens to show its note.
function Role({ e }) {
  const [open, setOpen] = useState(false)
  const head = (
    <>
      <span className="sv-exp-logo">{e.logo ? <img src={e.logo} alt="" /> : e.co[0]}</span>
      <span className="sv-exp-text">
        <span className="sv-exp-role">{e.role} at {e.co}</span>
        <span className="sv-dim">{range(e.start, e.end)}</span>
      </span>
    </>
  )
  if (!e.note) return <li className="sv-exp-row"><div className="sv-exp-head">{head}</div></li>
  return (
    <li className={'sv-exp-row' + (open ? ' is-open' : '')}>
      <button className="sv-exp-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {head}
        <span className="sv-exp-chev"><Icon name="chevron" size={20} /></span>
      </button>
      <div className="sv-exp-body"><p>{e.note}</p></div>
    </li>
  )
}

// Top photo card as a slideshow: ABOUT.photos first, then the hero photo,
// cross-fading every 3 seconds (reduced motion: a plain fade, no zoom). The
// dots jump to a photo; the name stays on top.
function HeroSlides() {
  const slides = [
    ...(ABOUT.photos || []),
    { src: PROFILE.hero?.src || PROFILE.portrait, alt: PROFILE.name, position: PROFILE.hero?.position },
  ]
  const [i, setI] = useState(0)
  const [takeOpen, setTakeOpen] = useState(false)
  const takeChip = useRef(null)
  const takeLink = useRef(null)
  // Always advances on its own; a dot click restarts the 3 s timer.
  useEffect(() => {
    if (slides.length < 2) return
    const id = setTimeout(() => setI((x) => (x + 1) % slides.length), 3000)
    return () => clearTimeout(id)
  }, [i, slides.length])

  return (
    <Card
      className={'sv-photo-hero' + (ABOUT.takes?.length ? ' is-link' : '')}
      data-open={takeOpen || undefined} // not a class: re-rendering className would drop the scroll-reveal's "in"
      style={{ aspectRatio: PROFILE.hero?.aspect }}
    >
      <div className="sv-slides" aria-live="polite">
        {slides.map((sl, k) => (
          <div
            key={sl.src}
            className={'sv-slide' + (k === i ? ' is-on' : '')}
            style={{ backgroundImage: `url(${sl.src})`, backgroundPosition: sl.position }}
            role="img"
            aria-label={sl.alt}
            aria-hidden={k !== i}
          />
        ))}
      </div>
      <BackButton href="/" label="Back to home" />
      {/* like the home card: the whole photo opens my take; on hover the card
          lifts and the chip opposite the back button folds out to "My take" */}
      {ABOUT.takes?.length > 0 && (
        <>
          <button
            ref={takeLink}
            type="button"
            className="sv-card-link"
            aria-label="My take"
            aria-expanded={takeOpen}
            aria-controls="sv-take-drop"
            onClick={() => setTakeOpen((v) => !v)}
          />
          <span className="sv-intro-hint sv-photo-hint" aria-hidden="true" ref={takeChip}>
            <span className="sv-intro-hint-text"><span>My take</span></span>
            <Icon name="quote" size={16} stroke={2} />
          </span>
          <TakeDrop open={takeOpen} anchor={takeChip} trigger={takeLink} onClose={() => setTakeOpen(false)} />
        </>
      )}
      <div className="sv-hero-foot">
        <h1 className="sv-h1">{PROFILE.name}</h1>
        {slides.length > 1 && (
          <div className="sv-dots" role="tablist" aria-label="Photos">
            {slides.map((sl, k) => (
              <button
                key={sl.src}
                role="tab"
                aria-selected={k === i}
                aria-label={sl.caption || sl.alt}
                className={'sv-dot' + (k === i ? ' is-on' : '')}
                onClick={() => setI(k)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
