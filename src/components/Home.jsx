import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ABOUT, CASES, HOME_WORK, MORE_WORK, PROFILE } from '../data'
import { Card, Icon, ConnectCard } from './ui'
import Media from './Media'
import { avif } from '../avif'
import Testimonials from './Testimonials'

const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Home() {
  return (
    <>
      <Intro />
      <MainWork />
      <Portfolio />
      <Testimonials />
      <AboutTeaser />
      <ConnectCard />
    </>
  )
}

// Invitation to the About page: the whole card is the link. Three real photos
// sit like a small hand of cards, echoing More Work, and fan out on hover.
const ABOUT_PHOTOS = [
  { src: PROFILE.hero.src, position: 'center 40%' },
  { src: avif('/sai-team.jpg'), position: '0% center' },
  { src: ABOUT.photos[0].src, position: '50% center' },
]

function AboutTeaser() {
  return (
    <Card as="a" href="/about" className="sv-teaser" aria-label="About me: read my story">
      <div className="sv-teaser-text">
        <h2 className="sv-teaser-title">The person behind the work.</h2>
        <span className="sv-teaser-go">
          Read my story
          <span className="sv-teaser-arrow"><Icon name="arrowUpRight" size={17} stroke={2} /></span>
        </span>
      </div>
      <div className="sv-teaser-fan" aria-hidden="true">
        {ABOUT_PHOTOS.map((p) => (
          <i key={p.src} style={{ backgroundImage: `url(${p.src})`, backgroundPosition: p.position }} />
        ))}
      </div>
    </Card>
  )
}

// The whole card opens the About page: a link stretched over it (the
// OrderFlow / Heizen links sit above it and stay clickable). On hover the
// card lifts, the photo zooms a touch and the arrow chip opens to "About me".
function Intro() {
  return (
    <Card className="sv-intro is-link">
      <a className="sv-card-link" href="/about" aria-label="About me" />
      {/* Arrow only by default; "About me" slides out when the card is hovered. */}
      <span className="sv-intro-hint" aria-hidden="true">
        <span className="sv-intro-hint-text"><span>About me</span></span>
        <Icon name="arrowUpRight" size={16} stroke={2} />
      </span>
      <div className="sv-intro-id">
        <div
          className="sv-avatar"
          style={{
            backgroundImage: `url(${PROFILE.portrait})`,
            backgroundSize: PROFILE.avatar?.size,
            backgroundPosition: PROFILE.avatar?.position,
          }}
          role="img"
          aria-label={PROFILE.name}
        />
        <div>
          <h1 className="sv-name">{PROFILE.name}</h1>
          <p className="sv-intro-note">
            {PROFILE.signoff}.{' '}
            {PROFILE.note.map((part, i) =>
              typeof part === 'string' ? part : (
                <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
              ),
            )}
            .
          </p>
        </div>
      </div>
    </Card>
  )
}

// More Work: more projects (MORE_WORK in data.js), held like a hand of cards:
// every card turns around one pivot point well below the stack, so turning
// moves it along a gentle arc. At rest the hand is nearly closed; hovering
// opens it (GSAP): the side cards spring out one after the other with a
// small overshoot, the front card rises, and the shadows deepen. Hovering
// one card glides it out along its own radius and names it
// below. Every card opens its case study.
const ANGLE_REST = 6 // degrees from the centre to the outer cards at rest
const ANGLE_OPEN = 16 // degrees from the centre to the outer cards when open
const ANGLE_OPEN_NARROW = 8 // tablets and phones: less room either side
const LIFT = 10 // px a hovered card slides out along its radius
const RISE = 14 // px the front card rises when the hand opens
const SHADOW_REST = '0 28px 50px -18px rgba(0, 0, 0, 0.75)'
const SHADOW_OPEN = '0 44px 70px -22px rgba(0, 0, 0, 0.85)'

// The hovered card: a deeper shadow.
const SHADOW_LIFTED = '0 44px 70px -18px rgba(0, 0, 0, 0.9)'

function pose(cards, open, hover, instant, opening) {
  const still = instant || prefersReduced()
  const wide = window.matchMedia('(min-width: 1060px)').matches
  const spread = wide ? ANGLE_OPEN : ANGLE_OPEN_NARROW
  // Three kinds of move: opening the hand (springy, side cards staggered),
  // moving between cards while open (one smooth glide, no overshoot), and
  // closing (eased back together).
  const moving = open && !opening
  const mid = (cards.length - 1) / 2
  cards.forEach((el, i) => {
    if (!el) return
    const side = i - mid // negative left, positive right
    const front = i === Math.floor(mid) // the card on top of the closed hand
    const inner = Math.abs(side) < 1
    const lifted = hover === i
    const angle = (side / Math.max(mid, 1)) * (open ? spread : ANGLE_REST) // three or more fill the same arc; two stay close
    const delay = still || !opening ? 0 : Math.abs(side) * 0.07
    // Stacking order changes at once, so the card coming up never slides
    // under its neighbour halfway through.
    gsap.set(el, { zIndex: lifted ? 9 : 8 - Math.abs(i - Math.floor(mid)) })
    gsap.to(el, {
      rotate: angle,
      y: (open && inner ? -RISE : 0) + (lifted ? -LIFT : 0),
      boxShadow: lifted ? SHADOW_LIFTED : open ? SHADOW_OPEN : SHADOW_REST,
      filter: `brightness(${!open && !front ? 0.65 : open && hover >= 0 && !lifted ? 0.72 : 1})`,
      duration: still ? 0 : opening ? 0.85 : moving ? 0.7 : 0.6,
      delay,
      ease: opening ? 'back.out(1.6)' : moving ? 'expo.out' : 'power3.inOut',
      // Kill every running or still-delayed tween on this card first, so an
      // older (delayed) open can never start later and undo a close.
      overwrite: true,
    })
  })
}

// The three main projects, shown large with their name and one result, so
// nothing depends on hovering.
function MainWork() {
  const items = HOME_WORK.map((slug) => CASES.find((c) => c.slug === slug)).filter(Boolean)
  return items.map((c, i) => (
    <Card as="a" key={c.slug} className="sv-proj" href={`/work/${c.slug}`}>
      {/* the first card is the page's main image: load it right away */}
      <Media art={c.art.thumb ? { ...c.art, img: c.art.thumb } : c.art} title={c.title} eager={i === 0} />
      <div className="sv-proj-foot">
        <div>
          <h2 className="sv-proj-title">{c.title}</h2>
          {c.result && <p className="sv-proj-result">{c.result}</p>}
        </div>
        <span className="sv-proj-arrow"><Icon name="arrowRight" size={30} stroke={1.8} /></span>
      </div>
    </Card>
  ))
}

function Portfolio() {
  const items = MORE_WORK.map((slug) => CASES.find((c) => c.slug === slug)).filter(Boolean)
  const root = useRef(null)
  const cards = useRef([])
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(-1)
  const first = useRef(true)

  const wasOpen = useRef(false)
  useGSAP(() => {
    pose(cards.current, open, hover, first.current, open && !wasOpen.current)
    wasOpen.current = open
    first.current = false
  }, { scope: root, dependencies: [open, hover] })

  const close = () => { setOpen(false); setHover(-1) }
  const shown = hover >= 0 ? items[hover] : null

  // Open state follows the real pointer, not enter/leave events: the page
  // can scroll under a still mouse (no leave event fires) and a click leaves
  // focus on a card. So the pointer is tracked across the whole page, what
  // sits under it is re-checked on every move and scroll, the hand closes
  // when the window loses focus, and focus opens it only for keyboard users.
  const last = useRef(null)
  useEffect(() => {
    const keyboard = () => root.current?.contains(document.activeElement) && document.activeElement.matches(':focus-visible')
    // Only the cards themselves open the hand. Between cards (or in the empty
    // space around them) it waits a moment before closing, so sliding across
    // a gap doesn't flicker; anywhere else it closes at once.
    let grace = 0
    const check = () => {
      if (keyboard()) return
      const p = last.current
      const el = p && document.elementFromPoint(p.x, p.y)
      const card = el && root.current?.contains(el) ? el.closest('.sv-fan-card') : null
      if (card) {
        clearTimeout(grace)
        grace = 0
        setOpen(true)
        setHover(Number(card.dataset.i))
        return
      }
      setHover(-1)
      if (el && root.current?.contains(el)) {
        if (!grace) grace = setTimeout(() => { grace = 0; close() }, 220)
      } else {
        clearTimeout(grace)
        grace = 0
        close()
      }
    }
    let raf = 0
    const later = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; check() }) }
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      last.current = { x: e.clientX, y: e.clientY }
      later()
    }
    const onAway = () => { last.current = null; close() }
    // The mouse left the browser window (relatedTarget is null then).
    const onOut = (e) => { if (!e.relatedTarget) onAway() }
    // Safety net: pointer events can be missed (a fast flick out of the
    // window, the OS screenshot tool, a page swap). Four times a second, ask
    // the browser's own hover state whether a card is really under the
    // pointer; if none is (and no keyboard focus), close.
    const watchdog = setInterval(() => {
      if (keyboard() || !root.current) return
      if (!root.current.querySelector('.sv-fan-card:hover')) {
        if (!grace) close()
      }
    }, 250)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', later, { passive: true })
    window.addEventListener('blur', onAway)
    document.addEventListener('mouseout', onOut)
    document.documentElement.addEventListener('mouseleave', onAway)
    document.addEventListener('visibilitychange', onAway)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(grace)
      clearInterval(watchdog)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', later)
      window.removeEventListener('blur', onAway)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onAway)
      document.removeEventListener('visibilitychange', onAway)
    }
  }, [])

  return (
    <Card className="sv-portfolio">
      <h2 className="sv-h2">More Works</h2>
      <div
        className="sv-fan"
        ref={root}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) close() }}
      >
        {items.map((it, i) => (
          <a
            key={it.slug}
            ref={(el) => { cards.current[i] = el }}
            href={`/work/${it.slug}`}
            className="sv-fan-card"
            data-i={i}
            aria-label={`${it.title}, open case study`}
            onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) { setOpen(true); setHover(i) } }}
          >
            <Media art={it.art.thumb ? { ...it.art, img: it.art.thumb } : it.art} title={it.title} />
          </a>
        ))}
      </div>
      {/* Until a card is hovered, a hint says what to do; then it names the card. */}
      <div className="sv-fan-caption" key={shown ? shown.slug : 'hint'} aria-live="polite">
        {shown ? (
          <>
            <span className="sv-fan-title">{shown.title}</span>
            <span className="sv-dim">{shown.short}</span>
          </>
        ) : (
          <span className="sv-fan-hint">
            <span className="sv-hint-mouse">Hover over the cards to explore my work</span>
            <span className="sv-hint-touch">Tap a card to open the project</span>
          </span>
        )}
      </div>
    </Card>
  )
}
