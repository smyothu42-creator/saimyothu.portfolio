import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { HOME_WORK, ORDERFLOW_URL, PROFILE } from '../data'
import { StageHint } from './ui'

export const HOME_PROJECTS = {
  orderflow: {
    year: '2026',
    line: '1,300+ orders in 42 days',
    metric: 'QR ordering for cafés, with the till left in place',
    kind: 'pos',
    pos: '/case/orderflow/feat/a-qr.mp4',
  },
  'mtb-pay-merchant': { year: '2025', line: '100+ merchants on the App Store', metric: 'A wallet for shopkeepers at a busy counter', kind: 'phone', src: '/case/mtb-pay-merchant/flows/receive.mp4' },
  'flowy-design-system': { year: 'Ongoing', line: 'Flowy an agentic design system', metric: 'Catalog in review, screens not moved yet', kind: 'flowy', src: '/case/flowy/cover.jpg?v=2' },
  pohpoh: { year: '2024', line: 'Poh Poh · Money and gold wallet', metric: 'Prototype · tested with 4 participants', kind: 'phone', src: '/case/pohpoh/hover.mp4?v=4', poster: '/case/pohpoh/hover-poster.webp' },
  'superfine-employee': { year: '2026', line: '$173K in lunch orders in 6 weeks', metric: 'Office meal ordering with the allowance up front', kind: 'phone', src: '/case/superfine-employee/flows/m-order.mp4' },
  'uz-branding': {
    year: '2026',
    line: 'A womenswear identity',
    metric: 'A premium identity carried from the tag to the shopfront',
    kind: 'brand',
    mark: '/case/uz-branding/mark-white.png',
    src: '/case/uz-branding/hover-photo.jpg?v=5',
  },
  'orderflow-landing': {
    line: 'OrderFlow Landing Page',
    metric: 'The website for OrderFlow’s QR ordering system',
    year: '2026',
    kind: 'external',
    href: ORDERFLOW_URL,
  },
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const yearTimelines = new WeakMap()

function paintYear(row, on, still) {
  let timeline = yearTimelines.get(row)

  if (!timeline) {
    const year = row.querySelector('.em-row-year')
    timeline = gsap.timeline({ paused: true })
      .to(year.querySelector('.em-row-year-text'), {
        yPercent: -110,
        duration: 0.42,
        ease: 'power2.inOut',
      }, 0)
      .to(year.querySelector('.em-row-arrow'), {
        y: 0,
        duration: 0.42,
        ease: 'power2.inOut',
      }, 0)
    yearTimelines.set(row, timeline)
  }

  if (still) timeline.progress(on ? 1 : 0).pause()
  else if (on) timeline.play()
  else timeline.reverse()
}

function paintRow(row, on) {
  const still = reduceMotion()
  gsap.to(row.querySelector('.em-row-body'), { x: on && !still ? 6 : 0, duration: still ? 0 : 0.45, ease: 'power2.out', overwrite: 'auto' })
  const textMotion = {
    y: on && !still ? -2 : 0,
    duration: still ? 0 : 0.45,
    ease: on ? 'back.out(1.4)' : 'power2.out',
    overwrite: 'auto',
  }
  gsap.to(row.querySelector('.em-row-index'), { ...textMotion, scale: on && !still ? 1.12 : 1 })
  gsap.to(row.querySelector('.em-row-name'), { ...textMotion, scale: on && !still ? 1.12 : 1 })
  gsap.to(row.querySelector('.em-row-line'), { ...textMotion, scale: on && !still ? 1.06 : 1 })
  gsap.to(row.querySelector('.em-row-index'), {
    color: on ? '#202833' : '#8a8a8e',
    duration: still ? 0 : 0.3,
    ease: 'sine.out',
    overwrite: 'auto',
  })
  paintYear(row, on, still)
}

function Note({ parts }) {
  return parts.map((part, i) => (
    typeof part === 'string'
      ? <span key={i}>{part}</span>
      : (
        <a key={i} href={part.href}>{part.text}</a>
      )
  ))
}

function Screen({ src, poster, play }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return undefined
    if (!play || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause()
      return undefined
    }
    const go = () => v.play().catch(() => {})
    if (v.readyState >= 2) go()
    else v.addEventListener('canplay', go, { once: true })
    return () => v.removeEventListener('canplay', go)
  }, [play, src])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="auto" aria-hidden="true" />
}

function Phone({ src, poster, play }) {
  return (
    <div className="st-device em-phone">
      <div className="st-device-screen">
        <Screen src={src} poster={poster} play={play} />
        <span className="st-device-island" />
      </div>
    </div>
  )
}

function Pos({ src, play }) {
  return (
    <div className="em-pos">
      <div className="em-pos-body">
        <div className="em-pos-screen"><Screen src={src} play={play} /></div>
        <div className="em-pos-chin"><img src="/logos/orderflow.png" alt="" /></div>
      </div>
    </div>
  )
}

// Card bounds in the 1600 × 1200 Flowy cover, inset to exclude its backdrop and shadows.
const flowyCards = [
  [70, 216, 888, 428],
  [994, 216, 536, 428],
  [70, 680, 748, 450],
  [854, 680, 328, 450],
  [1218, 680, 312, 450],
]
const flowyBoard = { x: 70, y: 216, width: 1460, height: 914 }

function FlowyCards({ src }) {
  return flowyCards.map(([x, y, width, height]) => (
    <span key={`${x}-${y}`} className="em-flowy-card" style={{
      left: `${100 * (x - flowyBoard.x) / flowyBoard.width}%`,
      top: `${100 * (y - flowyBoard.y) / flowyBoard.height}%`,
      width: `${100 * width / flowyBoard.width}%`,
      height: `${100 * height / flowyBoard.height}%`,
      backgroundImage: `url("${src}")`,
      backgroundSize: `${160000 / width}% ${120000 / height}%`,
      backgroundPosition: `${100 * x / (1600 - width)}% ${100 * y / (1200 - height)}%`,
    }} />
  ))
}

export function ProjectShot({ item, on }) {
  if (item.kind === 'flowy') {
    return (
      <div className={'em-shot is-flowy-cards' + (on ? ' is-on' : '')} aria-hidden="true">
        <FlowyCards src={item.src} />
      </div>
    )
  }
  if (item.kind === 'external') {
    return (
      <div className={'em-shot is-external' + (on ? ' is-on' : '')} aria-hidden="true">
        <svg viewBox="0 0 96 96" fill="none">
          <path d="M7 89 89 7M31 7h58v58" stroke="currentColor" strokeWidth="12" />
        </svg>
      </div>
    )
  }
  if (item.kind === 'pos') {
    return (
      <div className={'em-shot is-pos' + (on ? ' is-on' : '')}>
        <Pos src={item.pos} play={on} />
      </div>
    )
  }
  if (item.kind === 'phone') {
    return (
      <div className={'em-shot is-phone' + (on ? ' is-on' : '')}>
        <Phone src={item.src} poster={item.poster} play={on} />
      </div>
    )
  }
  if (item.kind === 'brand') {
    return (
      <div className={'em-shot is-brand' + (on ? ' is-on' : '')}>
        <div className="em-brand" aria-hidden="true">
          <div className="em-book">
            <span className="em-book-pages" />
            <div className="em-book-cover">
              <img className="em-brand-photo" src={item.src} alt="" />
              <span className="em-book-spine">UZ · Summer 2026</span>
              <img className="em-brand-logo" src={item.mark} alt="" />
              <span className="em-brand-foot">
                <span>Summer 2026</span>
                <span>Essentials For Women</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={'em-shot is-' + item.kind + (item.soon ? ' is-soon' : '') + (on ? ' is-on' : '')}>
      <img src={item.src} alt="" />
      {item.soon && <span className="em-shot-flag" aria-hidden="true">Coming soon</span>}
    </div>
  )
}

function Stage({ shot, shots }) {
  return (
    <aside className={'em-stage' + (shot ? ' is-shot' : '')}>
      <div className="em-stage-bar">
        <a className="em-hand" href="/">Sai Myo Thu</a>
        <nav className="em-stage-nav" aria-label="Main">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <StageHint>{PROFILE.tagline}</StageHint>
      {shots.map((item) => (
        <ProjectShot key={item.slug} item={item} on={item.slug === shot} />
      ))}
    </aside>
  )
}

export default function Home() {
  const [active, setActive] = useState(null)
  const homeRef = useRef(null)
  const introRef = useRef(null)
  const listRef = useRef(null)
  const work = [...HOME_WORK, 'orderflow-landing']
    .map((slug) => (HOME_PROJECTS[slug] ? { slug, ...HOME_PROJECTS[slug] } : null))
    .filter(Boolean)

  useLayoutEffect(() => {
    const home = homeRef.current
    const list = listRef.current
    const rows = Array.from(list.querySelectorAll('.em-row')).slice(0, 5)
    if (rows.length < 5) return

    const bodies = rows.map((row) => row.querySelector('.em-row-body'))
    const visibleRows = 4 + 2 / 3

    function fitRows() {
      const listTop = list.getBoundingClientRect().top - home.getBoundingClientRect().top
      const available = window.innerHeight - listTop - list.clientTop
      // Budget for the actual text height, including wrapped titles and descriptions.
      const contentHeight = bodies.reduce((sum, body, index) => {
        const border = parseFloat(getComputedStyle(rows[index]).borderBottomWidth)
        const visibleFraction = index === 4 ? 2 / 3 : 1
        return sum + (body.getBoundingClientRect().height + border) * visibleFraction
      }, 0)
      const padding = (available - contentHeight) / (2 * visibleRows)
      list.style.setProperty('--em-row-padding', `${padding}px`)
    }

    fitRows()
    const observer = new ResizeObserver(fitRows)
    observer.observe(introRef.current)
    bodies.forEach((body) => observer.observe(body))
    window.addEventListener('resize', fitRows)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fitRows)
    }
  }, [])

  return (
    <div className="em-home" ref={homeRef}>
      <Stage shot={active} shots={work} />
      <div className="em-work">
        <p className="em-intro" ref={introRef}>
          <Note parts={PROFILE.note} />
        </p>

        <div className="em-list" ref={listRef}>
          {work.map((item, index) => (
            <a
              className="em-row"
              key={item.slug}
              href={item.href ?? `/work/${item.slug}`}
              target={item.href ? '_blank' : undefined}
              rel={item.href ? 'noopener noreferrer' : undefined}
              onMouseEnter={(e) => { setActive(item.slug); paintRow(e.currentTarget, true) }}
              onMouseLeave={(e) => { setActive(null); paintRow(e.currentTarget, false) }}
              onFocus={(e) => { setActive(item.slug); paintRow(e.currentTarget, true) }}
              onBlur={(e) => { setActive(null); paintRow(e.currentTarget, false) }}
            >
              <span className="em-row-body">
                <span className="em-row-index">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className="em-row-copy">
                  <span className="em-row-top">
                    <span className="em-row-name">{item.line}</span>
                    <span className="em-row-year">
                      <span className="sr-only">{item.year}</span>
                      <span className="em-row-year-text" aria-hidden="true">{item.year}</span>
                      <svg className="em-row-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {/* Internal rows get the same ↗ hover mark as the external link. */}
                        <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                  <span className="em-row-line">{item.metric}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
