import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PLAYGROUND } from '../data'

gsap.registerPlugin(ScrollTrigger)

export default function Playground() {
  const ref = useRef(null)
  const previewRef = useRef(null)
  const listRef = useRef(null)
  const emptyRef = useRef(null)
  const panesRef = useRef([])
  // Which row is hovered (null = nothing hovered → preview shows its empty state).
  const [active, setActive] = useState(null)

  // Pin ONLY the left image so it stays put (fixed, centered) while the right
  // list scrolls past it normally; release once the list has scrolled by.
  // Desktop only — on touch/narrow screens the preview is hidden.
  // A ScrollTrigger pin is used (not CSS sticky) because an ancestor has
  // overflow: hidden, which would break position: sticky.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      // Keep it pinned until the bottom of the list reaches the bottom of the
      // image — i.e. for the whole length the list is taller than the image.
      const distance = () =>
        Math.max(0, listRef.current.offsetHeight - previewRef.current.offsetHeight)

      ScrollTrigger.create({
        trigger: previewRef.current,
        start: 'top 25%',            // pin when the 50vh image is centered
        end: () => '+=' + distance(),
        pin: previewRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      })
    })
    return () => mm.revert()
  }, { scope: ref })

  // One-time intro reveal + an idle float on the empty-state illustration.
  useGSAP(() => {
    const root = ref.current
    const rows = root.querySelectorAll('.lab-row')
    gsap.set('.pg-title-inner', { yPercent: 115 })
    gsap.set('.pg-intro', { autoAlpha: 0, y: 18 })
    gsap.set(rows, { autoAlpha: 0, y: 20 })
    gsap.set('.lab-preview', { autoAlpha: 0, y: 24 })
    gsap.set(panesRef.current, { autoAlpha: 0 })   // project tiles hidden
    gsap.set(emptyRef.current, { autoAlpha: 1 })   // empty state shown first

    gsap.to('.lab-empty-ill', { y: -7, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true })

    ScrollTrigger.create({
      trigger: root,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.timeline({ defaults: { ease: 'power4.out' } })
          .to('.pg-title-inner', { yPercent: 0, duration: 1 })
          .to('.pg-intro', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
          .to('.lab-preview', { autoAlpha: 1, y: 0, duration: 0.9, clearProps: 'transform' }, 0.2)
          .to(rows, {
            autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08,
            // Hand styling back to CSS so the hover dim/blur can take over.
            clearProps: 'opacity,visibility,transform',
          }, 0.35)
      },
    })
  }, { scope: ref })

  // Crossfade between the empty state and the hovered project's tile.
  useGSAP(() => {
    const panes = panesRef.current
    if (active === null) {
      gsap.to(emptyRef.current, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
      panes.forEach((el) => el && gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }))
      return
    }
    gsap.to(emptyRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' })
    panes.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        autoAlpha: i === active ? 1 : 0,
        scale: i === active ? 1 : 1.05,
        duration: 0.55,
        ease: 'power3.out',
      })
    })
  }, { dependencies: [active], scope: ref })

  return (
    <section id="playground" ref={ref} style={{ background: 'var(--cream-2)' }}>
      <div className="wrap-wide">
        <div className="pg-head">
          <h2 className="pg-title"><span className="pg-title-inner">Experiments &amp; Artifacts</span></h2>
          <p className="pg-intro">
            Designing and coding have always been inseparable to me. I bounce between
            Figma and Cursor until something feels right, all in pursuit of one
            question: <strong>how do we make even the most boring tool spark joy?</strong>
          </p>
        </div>

        <div className="lab">
          {/* Left: pinned image — stays put while the list scrolls past. */}
          <div className="lab-preview" ref={previewRef} aria-hidden="true">
            <div className="lab-pane lab-pane-empty" ref={emptyRef}>
              <svg className="lab-empty-ill" width="60" height="60" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4.5l5.6 15 2-5.8 5.8-2z" />
                <path d="M16.5 14.5l3.8 3.8" />
              </svg>
              <span className="lab-empty-text mono">Hover a project to preview</span>
            </div>
            {PLAYGROUND.map((p, i) => (
              <div
                key={p.idx}
                className="lab-pane"
                ref={(el) => { panesRef.current[i] = el }}
                style={{ background: `linear-gradient(155deg, ${p.color}, color-mix(in srgb, ${p.color} 58%, #000))` }}
              >
                <span className="lab-pane-mark">{p.label}</span>
                <span className="lab-pane-idx mono">{p.idx} / Design Lab</span>
              </div>
            ))}
          </div>

          {/* Right: the hoverable project list — scrolls normally with the page */}
          <ul className="lab-list" ref={listRef} onMouseLeave={() => setActive(null)}>
            {PLAYGROUND.map((p, i) => (
              <li
                key={p.idx}
                className="lab-row"
                onMouseEnter={() => setActive(i)}
              >
                <div className="lab-row-head">
                  <h3 className="lab-title">{p.title}</h3>
                  <span className="lab-year mono">{p.year}</span>
                </div>
                <p className="lab-blurb">{p.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
