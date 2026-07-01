import { useEffect, useRef, useState } from 'react'
import { CASES } from '../data'

// Full case-study page. Reads the matching case by slug and renders a sticky
// section nav (left) + hero + content sections, modelled on the reference.
export default function CaseStudy({ slug, onNavigate }) {
  const study = CASES.find((c) => c.slug === slug)
  const next = CASES[(CASES.findIndex((c) => c.slug === slug) + 1) % CASES.length]
  const [active, setActive] = useState(study?.study?.sections?.[0]?.id || '')
  const rootRef = useRef(null)

  // Scrollspy: highlight the section currently in view in the sticky nav.
  useEffect(() => {
    if (!study?.study) return
    const ids = [...study.study.sections.map((s) => s.id), 'see-next']
    const els = ids.map((id) => document.getElementById('sec-' + id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.sec) })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [study])

  if (!study) return null

  const s = study.study
  // Fallback page for cases without authored study content.
  if (!s) {
    return (
      <main className="cs" ref={rootRef}>
        <div className="cs-wrap">
          <button className="cs-back" onClick={() => onNavigate('/')}>← Back to work</button>
          <h1 className="cs-title">{study.title}</h1>
          <p className="cs-summary">{study.desc}</p>
          <div className="cs-tags">{study.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
      </main>
    )
  }

  const navItems = [...s.sections.map((sec) => ({ id: sec.id, label: sec.nav })), { id: 'see-next', label: 'See Next' }]

  const goSection = (id) => {
    document.getElementById('sec-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="cs" ref={rootRef}>
      <div className="cs-topbar">
        <button className="cs-back" onClick={() => onNavigate('/')} aria-label="Back to work" data-magnetic>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <span>Back to work</span>
        </button>
      </div>

      <div className="cs-layout">
        {/* Sticky section nav */}
        <aside className="cs-nav">
          <ul>
            {navItems.map((it) => (
              <li key={it.id}>
                <button
                  className={'cs-nav-link' + (active === it.id ? ' is-active' : '')}
                  onClick={() => goSection(it.id)}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content column */}
        <div className="cs-main">
          {/* Hero */}
          <section className="cs-hero" id="sec-context" data-sec="context">
            <div className="cs-hero-grid">
              <h1 className="cs-title">{s.heading}</h1>
              <div className="cs-hero-side">
                <p className="cs-summary">{s.summary}</p>
                <div className="cs-tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <button className="cs-skip" onClick={() => goSection('solution')} data-magnetic>
                  <span className="cs-skip-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </span>
                  <span className="cs-skip-label">Skip to Solution</span>
                </button>
              </div>
            </div>

            <dl className="cs-meta">
              <div><dt>Role</dt><dd>{s.role}</dd></div>
              <div><dt>Duration</dt><dd>{s.duration}</dd></div>
              <div><dt>Tools</dt><dd>{s.tools}</dd></div>
            </dl>

            {/* First section's blocks live in the hero block (Context) */}
            {s.sections[0].blocks.map((b, i) => <Block key={i} block={b} />)}
          </section>

          {/* Remaining sections */}
          {s.sections.slice(1).map((sec) => (
            <section className="cs-section" key={sec.id} id={'sec-' + sec.id} data-sec={sec.id}>
              <h2 className="cs-section-label">{sec.nav}</h2>
              {sec.blocks.map((b, i) => <Block key={i} block={b} />)}
            </section>
          ))}

          {/* See next */}
          <section className="cs-section cs-next" id="sec-see-next" data-sec="see-next">
            <h2 className="cs-section-label">See Next</h2>
            <button className="cs-next-card" onClick={() => onNavigate('/work/' + next.slug)} data-magnetic>
              <span className="cs-next-title">{next.title}</span>
              <span className="cs-next-arrow">↗</span>
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

function Block({ block }) {
  if (block.kind === 'split') {
    return (
      <div className="cs-split">
        {block.items.map((it, i) => (
          <div key={i}><h3 className="cs-h">{it.h}</h3><p className="cs-p">{it.p}</p></div>
        ))}
      </div>
    )
  }
  if (block.kind === 'lead') return <p className="cs-lead">{block.p}</p>
  if (block.kind === 'stats') {
    return (
      <div className="cs-stats">
        {block.items.map((it, i) => (
          <div key={i}><span className="cs-stat-num">{it.num}</span><span className="cs-stat-label">{it.label}</span></div>
        ))}
      </div>
    )
  }
  return <p className="cs-p">{block.p}</p>
}
