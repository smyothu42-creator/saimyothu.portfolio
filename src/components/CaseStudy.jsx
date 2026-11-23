import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CASES, HOME_WORK } from '../data'
import { scrollToY } from '../scroll'
import { useDragPill } from '../useDragPill'
import {
  TLDR, Flow, Compare, Journey, Decision, Blueprint, People, Principles, Mock, Insights,
  JourneyMap, Tree, Frameworks, Wireframes, Spec, Closing,
  HMW, Details, Achievements, Roadmap,
} from './CaseBlocks'
import { Impact, Role, Sub, IconList, Segments, Table, Iterations, Pills, Walkthrough, Film, Shot, WalkTabs, ShotTabs, Reel, Demo, FlowSwitch, Choices, Rail, BeforeAfter, Compare2, Steps, IaTree, Pillars, Bilingual, PosFrame } from './Story'
import { Card, BackButton, Icon } from './ui'
import Media from './Media'
import { avif } from '../avif'
import { HOME_PROJECTS, ProjectShot } from './Home'

// Case study as a column of cards, like the project pages on the reference:
//   cover card (project art, back button, title over its foot)
//   facts grid (role, timeline, scope, team, tools)
//   summary card
//   one card per section: optional eyebrow → heading → lead → blocks
//   a closing "full story" card
// Text blocks sit straight on the dark glass. Product visuals (screens,
// films, journey maps, boards) sit on a light plate inside the card, the way
// photos sit on the reference's dark cards.
export default function CaseStudy({ slug }) {
  const caseRef = useRef(null)
  const c = CASES.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Card className="sv-pagehead">
        <BackButton href="/" label="Back" />
        <h1 className="sv-h1">Project not found</h1>
        <p className="sv-pagehead-sub"><a className="sv-link" href="/">Back to home</a></p>
      </Card>
    )
  }
  const s = c.study
  const homePreview = HOME_PROJECTS[c.slug]
  const useHomePreview = c.slug === 'flowy-design-system' && homePreview

  const meta = caseMeta(c)
  const sections = s?.sections || []
  const jumpSections = sections.filter((sec) => sec.jumpLabel)
  if (s?.glance?.jumpLabel) jumpSections.unshift({ id: 'cs-project-overview', jumpLabel: s.glance.jumpLabel })

  return (
    <div ref={caseRef} className={'sv-case rv-case em-case' + (s?.ref ? ' is-ref' : '')} style={s?.accent ? { '--acc': s.accent } : undefined}>
      <header className="em-case-head" id="cs-overview">
        <h1>{plain(c.name || c.coverTitle || c.title)}</h1>
        <hr className="em-case-rule" />
        {meta.length > 0 && (
          <dl className="em-case-meta">
            {meta.map((col) => (
              <div key={col.label} className={'em-meta-' + col.column}>
                <dt>{col.label}</dt>
                <dd>
                  {col.lines.map((line) => <span key={line}>{line}</span>)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className={'rv-stage' + (useHomePreview ? ' is-home-preview' : '')} id="cs-top">
        {useHomePreview ? (
          <ProjectShot item={{ slug: c.slug, ...homePreview }} on />
        ) : (
          <Media art={{ ...c.art, img: c.art.poster || c.art.img }} title={plain(c.coverTitle || c.title)} eager video={c.art.video} />
        )}
      </div>
      {!useHomePreview && <HeroMotion slug={c.slug} />}

      {s?.intro !== false && (s?.heading || s?.summary || c.desc) && (
        <section className="em-sec" id="cs-about">
          <div className="em-sec-row">
            {s?.heading && <h2>{s.heading}</h2>}
            <div className="em-sec-copy">
              <p>{s?.summary ?? c.desc}</p>
            </div>
          </div>
        </section>
      )}

      {s?.glance && <Glance glance={s.glance} title={s.overviewNav || 'Project Overview'} />}
      {jumpSections.length > 0 && <CaseJump caseRef={caseRef} sections={jumpSections} />}

      {sections.map((sec) => <Section key={sec.id} sec={sec} />)}

      <Pager slug={c.slug} />

      {s?.gallery?.length > 0 && <Gallery images={s.gallery} />}
    </div>
  )
}

// The cover drifts a little as the page scrolls under it. Transform only;
// the stage clips the edges, and reduced motion leaves the cover still.
function HeroMotion({ slug }) {
  useEffect(() => {
    const media = document.querySelector('.em-case .rv-stage .media')
    if (!media || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    media.style.willChange = 'transform'
    let raf = 0
    const tick = () => {
      raf = 0
      const box = media.parentElement.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height)))
      media.style.transform = `translate3d(0, ${(p * 24 - 12).toFixed(2)}px, 0) scale(1.06)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      media.style.transform = ''
      media.style.willChange = ''
    }
  }, [slug])
  return null
}

// The end of a case study: a compact, project-tinted card for what comes next,
// with the way back to the index and the project before this one.
function Pager({ slug }) {
  const list = HOME_WORK.filter((id) => CASES.some((c) => c.slug === id))
  const i = Math.max(0, list.indexOf(slug))
  const prev = CASES.find((c) => c.slug === list[(i - 1 + list.length) % list.length])
  const next = CASES.find((c) => c.slug === list[(i + 1) % list.length])
  const label = (c) => c.name || c.title.replace(/\u00a0/g, ' ')
  const preview = HOME_PROJECTS[next.slug]
  const nextAccent = next.study?.accent || next.art?.color || '#202833'
  return (
    <section className="em-next" id="more-work">
      <a
        className={'em-next-card' + (preview ? ' has-preview' : '')}
        href={`/work/${next.slug}`}
        style={{ '--next-accent': nextAccent }}
      >
        <span className="em-next-copy">
          <span className="em-next-name">{preview?.line || next.result || label(next)}</span>
          <span className="em-next-desc">{aboutExcerpt(next.desc || next.study?.summary)}</span>
          <span className="em-next-go">View project <span aria-hidden="true">→</span></span>
        </span>
        {preview && (
          <span className="em-next-preview" aria-hidden="true">
            <ProjectShot item={{ slug: next.slug, ...preview }} on />
          </span>
        )}
      </a>
      <nav className="em-next-nav" aria-label="More projects">
        <a href={`/work/${prev.slug}`}>← {label(prev)}</a>
        <a href="/">All work</a>
      </nav>
    </section>
  )
}

function aboutExcerpt(text = '') {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []
  const excerpt = sentences.slice(0, 2).join(' ').replace(/\s+/g, ' ').trim()
  if (excerpt.length <= 250) return excerpt
  const clipped = excerpt.slice(0, 247).replace(/\s+\S*$/, '')
  return `${clipped}…`
}

// `*words*` in a title render as a light italic accent; plain() strips the
// markers for labels.
// Industries already named on the case. Design-system and brand labels are
// the kind of work, not an industry, so they stay out of this column.
const INDUSTRY = new Set(['F&B', 'Fintech'])

function caseMeta(c) {
  const s = c.study
  const cols = []
  if (s?.metaIndustry) {
    if (s.role) cols.push({ label: 'Role', column: 1, lines: [s.role] })
    const scope = (s.scope || []).filter(Boolean)
    if (scope.length) cols.push({ label: 'Scope', column: 2, lines: scope })
    if (c.domain) cols.push({ label: 'Industry', column: 3, lines: [c.domain] })
    if (s.timeline) cols.push({ label: 'Timeline', column: 4, lines: [s.timeline] })
    return cols.slice(0, 4)
  }
  if (s?.timeline) {
    if (s.role) cols.push({ label: 'Role', column: 1, lines: [s.role] })
    const scope = (s.scope || []).filter(Boolean)
    if (scope.length) cols.push({ label: 'Scope', column: 2, lines: scope })
    const type = (c.tags || []).filter(Boolean)
    if (type.length) cols.push({ label: 'Type', column: 3, lines: type })
    cols.push({ label: 'Timeline', column: 4, lines: [s.timeline] })
    return cols.slice(0, 4)
  }
  const role = [s?.role, s?.duration].filter(Boolean)
  if (role.length) cols.push({ label: 'Role', column: 1, lines: role })
  const scope = (s?.scope || []).filter(Boolean)
  if (scope.length) cols.push({ label: 'Scope', column: 2, lines: scope })
  if (c.domain && INDUSTRY.has(c.domain)) cols.push({ label: 'Industry', column: 3, lines: [c.domain] })
  const type = (c.tags || []).filter(Boolean)
  if (type.length) cols.push({ label: 'Type', column: 4, lines: type })
  return cols.slice(0, 4)
}

const plain = (t = '') => t.replace(/\*/g, '')
function rich(t = '') {
  return t.split(/(\*\*.+?\*\*|\*.+?\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <mark className="cs-mark" key={i}>{part.slice(2, -2)}</mark>
    if (part.startsWith('*') && part.endsWith('*')) return <em className="acc-i" key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

// A short summary band under the intro: the argument in four cells, then a
// way to jump to the sections that carry it, like the reference's at-a-glance.
function Glance({ glance, title }) {
  return (
    <section id="cs-project-overview" className={'em-glance' + (glance.cols === 2 ? ' is-grid' : '')} aria-label="At a glance">
      {title && <h2 tabIndex={glance.jumpLabel ? -1 : undefined}>{title}</h2>}
      <dl className="em-glance-grid">
        {glance.items.map((it) => (
          <div key={it.label} className="em-glance-item">
            <dt>{it.label}</dt>
            <dd>{it.value}</dd>
          </div>
        ))}
      </dl>
      {glance.links?.length > 0 && (
        <nav className="em-glance-jump" aria-label="Jump to a section">
          {glance.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                const el = document.getElementById(l.href.slice(1))
                if (!el) return
                e.preventDefault()
                scrollToY(el.getBoundingClientRect().top + window.scrollY - 80, 1)
              }}
            >
              {l.label}<span aria-hidden="true">↓</span>
            </a>
          ))}
        </nav>
      )}
    </section>
  )
}

const JUMP_OFFSET = 88

function CaseJump({ caseRef, sections }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const page = caseRef.current
    const headings = [...page.querySelectorAll(':scope > .em-glance > h2[tabindex], :scope > .em-sec .em-sec-row > h2[tabindex]')]
    if (!headings.length) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      if (headings[0].getBoundingClientRect().top > window.innerHeight * 0.8) {
        setActive(null)
        return
      }
      const readingLine = Math.max(JUMP_OFFSET + 12, window.innerHeight * 0.2)
      const atEnd = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2
      const current = atEnd ? headings.at(-1) : headings.findLast((heading) => heading.getBoundingClientRect().top <= readingLine)
      setActive((current ?? headings[0]).closest('section').id)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const resize = new ResizeObserver(schedule)
    resize.observe(page)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [caseRef])

  function jump(event, id) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const heading = caseRef.current.querySelector(`#${CSS.escape(id)} h2`)
    if (!heading) return
    event.preventDefault()
    heading.focus({ preventScroll: true })
    const y = heading.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollToY(y, reduced ? 0 : 0.8)
  }

  return (
    <nav
      className={'em-case-jump' + (active ? ' is-visible' : '')}
      aria-label="Case study sections"
      aria-hidden={!active}
    >
      <ul className="em-case-jump-list">
        {sections.map(({ id, jumpLabel }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={(event) => jump(event, id)}>
              {jumpLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// One section as one card. `bare` sections (the product film) are the visual
// alone. A section's opening `lead` block sits under its heading. `title`
// (optional) is the heading when it should say more than the short `nav` label
// in the side list.
const COPY = new Set(['lead', 'split', 'list', 'subheading'])

function AsideSection({ sec }) {
  const title = plain(sec.title || sec.nav)
  const blocks = sec.blocks || []
  const leads = []
  const decisions = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.kind === 'lead') {
      leads.push(block)
      continue
    }
    if (block.kind === 'split') {
      const next = blocks[i + 1]
      const phones = next?.kind === 'phones' ? next : null
      if (phones) i += 1
      decisions.push({ h: block.h, p: block.p, phones })
      continue
    }
    if (block.kind === 'phones') decisions.push({ phones: block })
  }
  return (
    <section className="em-sec is-aside" id={sec.id} aria-label={title}>
      {title && <h2 tabIndex={sec.jumpLabel ? -1 : undefined}>{title}</h2>}
      {leads.length > 0 && (
        <div className="em-sec-aside">
          <div className="em-sec-copy">
            {leads.map((block, i) => <Block key={i} block={block} />)}
          </div>
        </div>
      )}
      {decisions.length > 0 && (
        <div className={'cs-aside-decs is-' + decisions.length}>
          {decisions.map((decision, i) => (
            <div className="cs-aside-dec" key={decision.h || i}>
              <div className="cs-aside-copy">
                <p className="cs-aside-k">Decision {String(i + 1).padStart(2, '0')}</p>
                {decision.h && <h3>{decision.h}</h3>}
                {decision.p && <p>{decision.p}</p>}
              </div>
              {decision.phones && <PhoneRow items={decision.phones.items} alt={decision.phones.alt} />}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Section({ sec }) {
  if (sec.layout === 'aside') return <AsideSection sec={sec} />
  const blocks = sec.blocks || []
  const title = !sec.notitle && plain(sec.title || sec.nav)
  // Keep the order the case was written in. A sentence that introduces a
  // screen stays above that screen, instead of every paragraph collecting
  // at the top and every picture collecting at the bottom.
  const groups = []
  for (const block of blocks) {
    const copy = !block.kind || COPY.has(block.kind)
    const last = groups[groups.length - 1]
    if (last && last.copy === copy) last.items.push(block)
    else groups.push({ copy, items: [block] })
  }
  const firstIsCopy = groups[0]?.copy
  const rest = firstIsCopy ? groups.slice(1) : groups
  return (
    <section className={'em-sec' + (sec.notitle ? ' is-media' : '')} id={sec.id} aria-label={plain(sec.nav)}>
      {(title || firstIsCopy) && (
        <div className="em-sec-row">
          {title && <h2 tabIndex={sec.jumpLabel ? -1 : undefined}>{title}</h2>}
          {firstIsCopy && (
            <div className="em-sec-copy">
              {groups[0].items.map((b, j) => <Block key={j} block={b} />)}
            </div>
          )}
        </div>
      )}
      {rest.map((g, i) => g.copy ? (
        <div className="em-sec-row" key={i}>
          <div className="em-sec-copy">
            {g.items.map((b, j) => <Block key={j} block={b} />)}
          </div>
        </div>
      ) : (
        <div className="em-sec-stack reveal" key={i}>
          {g.items.map((b, j) => <Block key={j} block={b} />)}
        </div>
      ))}
    </section>
  )
}

// Auto-scrolling photo strip; the list is doubled so the loop is seamless.
function Gallery({ images }) {
  return (
    <Card className="sv-gallery">
      <div className="sv-gallery-track">
        {[...images, ...images].map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" aria-hidden={i >= images.length} />
        ))}
      </div>
    </Card>
  )
}

// Two photographs side by side as matching squares, like the reference's
// two-column image rows.
function Duo({ images }) {
  return (
    <div className="sv-duo">
      {images.map((it) => <Shot key={it.src} {...it} />)}
    </div>
  )
}

function IllustratedNeeds({ items }) {
  return (
    <ul className="cs-illustrated-needs">
      {items.map(({ src, p }) => (
        <li key={src}>
          <img src={src} alt="" width={112} height={112} loading="lazy" />
          <p>{p}</p>
        </li>
      ))}
    </ul>
  )
}

function ScreenComparison({ h, before, after, notes }) {
  return (
    <figure className="cs-screen-compare">
      <figcaption>
        <h3>{h}</h3>
        <div className="cs-screen-compare-notes">
          <ul>
            {notes.map((note) => (
              <li key={note.h}>
                <span className="cs-screen-compare-index" aria-hidden="true" />
                <div><strong>{note.h}</strong><p>{note.p}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </figcaption>
      <div className="cs-screen-compare-grid">
        <div className="cs-screen-compare-drag">
          <div className="st-device">
            <div className="st-device-screen">
              <BeforeAfter before={before.src} after={after.src} alt={after.alt} ratio="402 / 874" />
              <span className="st-device-island" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

// Blocks keyed by `kind` in data.js. TEXT kinds sit on the dark card; every
// other visual goes on a light plate.
const VISUALS = {
  tldr: TLDR, flow: Flow, compare: Compare, journey: Journey, decision: Decision,
  blueprint: Blueprint, people: People, principles: Principles, mock: Mock, insights: Insights,
  journeymap: JourneyMap, tree: Tree, frameworks: Frameworks, wireframes: Wireframes, spec: Spec, closing: Closing,
  hmw: HMW, details: Details, achievements: Achievements, roadmap: Roadmap,
  impact: Impact, role: Role, sub: Sub, iconlist: IconList, segments: Segments, table: Table,
  iterations: Iterations, pills: Pills, walkthrough: Walkthrough, film: Film, shot: Shot, walktabs: WalkTabs, shottabs: ShotTabs,
  reel: Reel, demo: Demo, flows: FlowSwitch, choices: Choices, rail: Rail, beforeafter: BeforeAfter, compare2: Compare2, steps: Steps, iatree: IaTree, hub: Hub, decisions: Decisions, arch: Arch, mockpair: MockPair, ship: Ship, photos: Photos, loop: Loop, duo: Duo, pillars: Pillars, bilingual: Bilingual, phones: PhoneRow,
}
const TEXT = new Set(['hub', 'decisions', 'arch', 'mockpair', 'ship', 'photos', 'loop', 'impact', 'role', 'sub', 'iconlist', 'segments', 'table', 'iterations', 'pills', 'demo', 'flows', 'choices', 'rail', 'compare2', 'steps', 'iatree', 'phones'])

function PhoneRow({ items, alt }) {
  return (
    <div className="cs-phones" style={{ '--n': items.length }} role="group" aria-label={alt}>
      {items.map((src) => (
        <div className="st-device" key={src}>
          <div className="st-device-screen">
            <img src={src} alt="" loading="lazy" />
            <span className="st-device-island" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Block({ block }) {
  if (block.kind === 'illustrated-needs') return <IllustratedNeeds items={block.items} />
  if (block.kind === 'screen-comparison') return <ScreenComparison {...block} />
  const Visual = VISUALS[block.kind]
  if (Visual) {
    const node = <Visual {...block} caption={undefined} />
    const plated = TEXT.has(block.kind) ? node : <div className={'sv-plate is-' + block.kind + (block.wide ? ' is-wide' : '') + (block.natural ? ' is-natural' : '') + (block.portrait ? ' is-portrait' : '')}>{node}</div>
    if (!block.caption) return plated
    return (
      <figure className="cs-fig">
        {plated}
        <figcaption className="cs-figcap">{block.caption}</figcaption>
      </figure>
    )
  }
  // Term / explanation rows.
  if (block.kind === 'notes') {
    return (
      <dl className="cs-notes">
        {block.items.map((it) => (
          <div key={it.t}>
            <dt>{it.t}</dt>
            <dd>{it.p}</dd>
          </div>
        ))}
      </dl>
    )
  }
  if (block.kind === 'split') {
    const items = block.items || [{ h: block.h, p: block.p, ps: block.ps }]
    const cards = items.map((it, i) => (
      <div className="cs-sub" key={i}>
        {it.illustration && <img className="cs-sub-illustration" src={it.illustration} alt="" width={96} height={96} loading="lazy" />}
        <h3>{it.h}</h3>
        {(it.ps || [it.p]).filter(Boolean).map((p, j) => <p key={j}>{p}</p>)}
        {it.bullets && <ul className="cs-list">{it.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
      </div>
    ))
    if (block.cols === 2 || block.cols === 3) return <div className={'cs-split' + (block.cols === 3 ? ' is-3' : '')}>{cards}</div>
    return cards
  }
  if (block.kind === 'donut') return <Donut items={block.items} p={block.p} />
  if (block.kind === 'flowpair') return <FlowPair phone={block.phone} browser={block.browser} shared={block.shared} />
  if (block.kind === 'flowphone') return <FlowPhone label={block.label} items={block.items} note={block.note} points={block.points} steps={block.steps} />
  if (block.kind === 'lead') return <p className="sv-sec-lead">{block.p}</p>
  if (block.kind === 'subheading') {
    return (
      <div className="cs-subheading">
        <h3>{block.h}{block.h2 && <> <span className="cs-subheading-rest">{block.h2}</span></>}</h3>
        {block.p && <p>{rich(block.p)}</p>}
      </div>
    )
  }
  if (block.kind === 'list') {
    return (
      <div className="cs-prose">
        {block.p && <p>{block.p}</p>}
        <ul className="cs-list">{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    )
  }
  // A row of numbers. `h` titles the row, an item's `logos` puts brand tiles
  // in front of its number, and `note` lists the sources under the row.
  if (block.kind === 'stats') {
    return (
      <div className="cs-statrow">
        {block.h && <h3 className="cs-stat-h">{block.h}</h3>}
        <div className="cs-stats">
          {block.items.map((it, i) => (
            <div key={i} className={it.logos ? 'has-logos' : undefined}>
              {it.logos && <span className="cs-logos">{it.logos.map((l) => <BrandTile key={l} name={l} />)}</span>}
              <span className="cs-stat-txt"><span className="cs-stat-num">{it.num}</span><span>{it.label}</span></span>
            </div>
          ))}
        </div>
        {block.note && <p className="cs-stat-note">{block.note}</p>}
      </div>
    )
  }
  // What the first shift exposed: numbered findings, two by two.
  if (block.kind === 'findings') {
    return (
      <div className="cs-findings">
        {block.items.map((it, i) => (
          <div className="cs-finding" key={it.t}>
            <span className="cs-finding-n">{String(i + 1).padStart(2, '0')}</span>
            <b>{it.t}</b>
            <p>{it.p}</p>
          </div>
        ))}
      </div>
    )
  }
  // What the first shift said, and the change each note caused.
  if (block.kind === 'feedback') {
    return (
      <div className="cs-feedback">
        {block.h && <h3 className="cs-feedback-h">{block.h}</h3>}
        <div className="cs-feedback-grid">
          {block.items.map((it) => (
            <div className="cs-feedback-item" key={it.q}>
              <p className="cs-feedback-q">“{it.q}”</p>
              <span className="cs-feedback-who">{it.who}</span>
              <p className="cs-feedback-did">{it.did}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // Four honest notes at the close: assumed, missed, would do, outcome.
  if (block.kind === 'timemachine') {
    return (
      <div className="cs-time">
        {block.items.map((it) => (
          <div className="cs-time-item" key={it.t}>
            <span className="cs-time-label">{it.t}</span>
            <b>{it.h}</b>
            <p>{it.p}</p>
          </div>
        ))}
      </div>
    )
  }
  return <p>{block.p}</p>
}

// Who was in the room: a donut, with the count in the hole and the roles beside it.
const DONUT_COLORS = ['#416d50', '#739a79', '#9fbea1', '#c8dcca']
function Donut({ items, p }) {
  const sum = items.reduce((a, it) => a + it.n, 0)
  const r = 46
  const c = 2 * Math.PI * r
  const gap = 3.5
  let cursor = 0
  const slices = items.map((it, i) => {
    const span = (it.n / sum) * c
    const slice = {
      ...it,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      dash: `${Math.max(0, span - gap)} ${c}`,
      offset: -cursor,
    }
    cursor += span
    return slice
  })
  return (
    <div className="cs-donut-row">
      {p && <p>{p}</p>}
    <figure className="cs-donut">
      <svg viewBox="0 0 140 140" role="img" aria-label={`${sum} people. ${items.map((it) => `${it.t}, ${it.n}`).join('. ')}.`}>
        <g transform="rotate(-90 70 70)">
          {slices.map((s) => (
            <circle key={s.t} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={s.dash} strokeDashoffset={s.offset} />
          ))}
        </g>
        <text className="cs-donut-n" x="70" y="68" textAnchor="middle">{sum}</text>
        <text className="cs-donut-cap" x="70" y="86" textAnchor="middle">people</text>
      </svg>
      <ul>
        {slices.map((s) => (
          <li key={s.t}>
            <i style={{ background: s.color }} aria-hidden="true" />
            <span>{s.t}</span>
            <b>{s.n}</b>
          </li>
        ))}
      </ul>
    </figure>
    </div>
  )
}

// Section list: a glass panel fixed on the left, mirroring the main menu,
// listing the case study's sections. The section in view is highlighted
// (the one whose top last passed a line a third of the way down the
// screen); clicking an item scrolls there. Hidden on narrower screens.
function CaseNav({ sections, top = true, overview, overviewPart }) {
  // A section with a `group` (e.g. a design phase: Understand, Define…) is
  // listed once, under its group's name, pointing at the group's first section.
  // `toc: false` keeps a section (like the intro film) out of the list, and a
  // study with `navTop: false` leaves out the cover's Overview entry, and
  // `overviewNav` lists the facts and summary at the top under that name.
  const items = top ? [{ id: 'cs-top', label: 'Overview' }] : []
  if (overview) items.push({ id: 'cs-overview', label: overview, part: overviewPart })
  for (const x of sections) {
    if (x.toc === false) continue
    if (x.group && items.some((it) => it.group === x.group)) continue
    items.push({ id: x.id, label: x.group || plain(x.nav), group: x.group, part: x.part })
  }
  const [active, setActive] = useState(items[0].id)
  const links = useRef({})
  const list = useRef(null)
  const [pill, setPill] = useState(null)

  // One glass highlight slides behind the active item (like the main menu).
  useLayoutEffect(() => {
    const el = links.current[active]
    if (el) setPill({ x: 0, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
  }, [active])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight / 3
      let cur = items[0].id
      for (const it of items) {
        const el = document.getElementById(it.id)
        if (el && el.getBoundingClientRect().top <= line) cur = it.id
      }
      setActive(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

  // Scroll to a section. Images above it may load while scrolling and push
  // it down, so check again once the scroll ends and nudge if needed.
  const jump = (id) => {
    const target = () => {
      const el = document.getElementById(id)
      if (id === 'cs-top' || !el) return 0
      return el.getBoundingClientRect().top + window.scrollY - 80
    }
    scrollToY(target(), 1)
    setTimeout(() => {
      const y = target()
      if (Math.abs(y - window.scrollY) > 4) scrollToY(y, 0.4)
    }, 1050)
  }

  // The highlight can be dragged: let go on a section to jump there.
  const drag = useDragPill({
    root: list,
    axis: 'y',
    items: () => items.map((it) => ({ key: it.id, el: links.current[it.id] })),
    pill,
    current: active,
    onPick: (id) => { setActive(id); jump(id) },
  })
  const shownOn = drag.near ?? active

  return (
    <nav className="sv-toc" aria-label="On this page">
      {/* the way back sits here; the cover's back button only shows where this list is hidden */}
      <a className="sv-toc-back" href="/" data-back>
        Work
      </a>
      <ol ref={list} className={drag.dragging ? 'is-dragging' : undefined} {...drag.handlers}>
        <span
          className={'sv-toc-glass' + (pill ? '' : ' is-hidden')}
          style={pill ? { ...drag.pillStyle(), height: pill.h } : undefined}
          aria-hidden="true"
        />
        {/* A section's `part` (e.g. We think) heads the list from that section on. */}
        {items.map((it) => (
          <li key={it.id}>
            {it.part && <p className="sv-toc-part">{it.part}</p>}
            <a
              href={`#${it.id}`}
              ref={(el) => { links.current[it.id] = el }}
              className={'sv-toc-item' + (shownOn === it.id ? ' is-active' : '')}
              aria-current={active === it.id ? 'true' : undefined}
              draggable={false}
              onClick={(e) => { e.preventDefault(); if (!drag.blockClick(e)) jump(it.id) }}
            >
              <span className="sv-toc-dot" aria-hidden="true" />
              <span className="sv-toc-label">{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Brand marks in front of a stat: the apps' real store icons
// (public/logos/apps) and the Myanmar flag, drawn.
const BRANDS = { foodpanda: 'foodpanda', grab: 'Grab', kbzpay: 'KBZPay' }
function BrandTile({ name }) {
  if (name === 'myanmar') {
    return (
      <svg className="cs-logo" viewBox="0 0 48 48" role="img" aria-label="Myanmar flag">
        <rect width="48" height="16" fill="#FECB00" /><rect y="16" width="48" height="16" fill="#34B233" /><rect y="32" width="48" height="16" fill="#EA2839" />
        <path fill="#fff" d="M24 11.5l3.06 9.42h9.9l-8.01 5.82 3.06 9.42L24 30.34l-8.01 5.82 3.06-9.42-8.01-5.82h9.9z" />
        <defs>
          <linearGradient id="mm-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.08" /><stop offset="1" stopColor="#000" stopOpacity="0.18" /></linearGradient>
        </defs>
        <rect width="48" height="48" fill="url(#mm-gloss)" />
        <ellipse cx="24" cy="2" rx="30" ry="14" fill="#fff" opacity="0.18" />
        <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.5" />
      </svg>
    )
  }
  if (!BRANDS[name]) return null
  return <img className="cs-logo" src={avif(`/logos/apps/${name}.png`)} alt={BRANDS[name]} width="64" height="64" loading="lazy" />
}

// Product vision: the OrderFlow ecosystem. The logo sits in the middle and
// the modules sit on a glass ring around it. The highlight moves round on its
// own; clicking a module stops that and shows the module on the right.
// Line icons in the site's style (Lucide shapes, ISC licence).
const HUB_ICONS = {
  qr: <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />,
  pos: <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M14 8H8M16 12H8M13 16H8" /></>,
  ai: <><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></>,
  loyalty: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
  inventory: <><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12M3.29 7 12 12l8.71-5M7.5 4.27l9 5.15" /></>,
  menu: <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />,
  tables: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  slips: <><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
  staff: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /><circle cx="9" cy="7" r="4" /></>,
  reports: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
  alerts: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
}
const HUB_MS = 3800
// A ring drawn as arcs between its circles, so the line never runs through
// them. It turns with its orbit, so the gaps stay under the circles.
function OrbitRing({ r, count, start, gap }) {
  const pt = (deg) => [50 + r * Math.cos(deg * Math.PI / 180), 50 + r * Math.sin(deg * Math.PI / 180)]
  const step = 360 / count
  const d = Array.from({ length: count }, (_, i) => {
    const [x0, y0] = pt(start + step * i + gap)
    const [x1, y1] = pt(start + step * (i + 1) - gap)
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
  }).join('')
  return <svg className="cs-orbit-ring" viewBox="0 0 100 100" aria-hidden="true"><path d={d} /></svg>
}
function Hub({ items, outer = [] }) {
  const n = items.length
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(true)
  const [tick, setTick] = useState(0)
  const [hold, setHold] = useState(false)
  const [prev, setPrev] = useState(null)
  const [back, setBack] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const running = auto && !hold && !reduced
  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => { setBack(false); setPrev(on); setOn((on + 1) % n); setTick((k) => k + 1) }, HUB_MS)
    // The slideshow only steps through the five main modules.
    return () => clearTimeout(t)
  }, [running, on, n])
  const pick = (i, dir) => { if (i === on) return; setBack(dir ? dir < 0 : i < on); setPrev(on); setOn(i); setAuto(false) }
  // Up and down step through the five main modules (from an outer feature,
  // they go back into them).
  const go = (d) => pick(on < n ? (on + d + n) % n : d > 0 ? 0 : n - 1, d)
  const at = (i) => (-90 + (360 / n) * i) * Math.PI / 180
  // One list for the card: the main modules first, then the outer features.
  const all = [...items, ...outer]
  const badge = (i) => <svg viewBox="0 0 24 24" className="cs-hub-badge cs-hub-line" aria-hidden="true">{HUB_ICONS[all[i].key]}</svg>
  return (
    <div className="cs-hub">
      <div className="cs-hub-art">
        <span className="cs-hub-core"><img src={avif('/logos/orderflow-icon.png')} alt="" /></span>
        <div className="cs-orbit is-out">
          <OrbitRing r={46} count={outer.length} start={-60} gap={10} />
          {outer.map((it, i) => {
            const a = (-60 + (360 / outer.length) * i) * Math.PI / 180
            const k = n + i
            return (
              <span key={it.key} className="cs-orbit-item" style={{ left: `${50 + 46 * Math.cos(a)}%`, top: `${50 + 46 * Math.sin(a)}%` }}>
                <span className="cs-orbit-up">
                  <button type="button" className={'cs-hub-node is-small' + (k === on ? ' is-on' : '')} onClick={() => pick(k)} aria-pressed={k === on} aria-label={it.t} title={it.t}>
                    <svg viewBox="0 0 24 24" className="cs-hub-line" aria-hidden="true">{HUB_ICONS[it.key]}</svg>
                  </button>
                </span>
              </span>
            )
          })}
        </div>
        <div className="cs-orbit is-in">
          <OrbitRing r={29} count={n} start={-90} gap={20} />
          {items.map((it, i) => (
            <span key={it.key} className="cs-orbit-item" style={{ left: `${50 + 29 * Math.cos(at(i))}%`, top: `${50 + 29 * Math.sin(at(i))}%` }}>
              <span className="cs-orbit-up">
                <button type="button" className={'cs-hub-node' + (i === on ? ' is-on' : '')} onClick={() => pick(i)} aria-pressed={i === on} aria-label={it.t}>
                  <svg viewBox="0 0 24 24" className="cs-hub-line" aria-hidden="true">{HUB_ICONS[it.key]}</svg>
                  <span className="cs-hub-label">{it.t}</span>
                </button>
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="cs-hub-side" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      <button type="button" className="sv-take-nav is-up cs-hub-arrow" aria-label="Previous module" onClick={() => go(-1)}>
        <Icon name="chevronUp" size={28} stroke={1.8} />
      </button>
      <div className={'cs-hub-list' + (back ? ' is-back' : '')} aria-live="polite">
        {prev !== null && prev !== on && (
          <div key={'out' + tick + '-' + prev} className="st-choice is-on cs-hub-card is-out" aria-hidden="true">
            <span className="st-step-n">{badge(prev)}</span>
            <span className="st-choice-body">
              <span className="st-choice-h">{all[prev].t}</span>
              <span className="st-choice-p">{all[prev].p}</span>
              <span className="st-choice-bar" aria-hidden="true">
                <i style={{ animation: 'none' }} />
              </span>
            </span>
          </div>
        )}
        <div key={'in' + tick + '-' + on} className="st-choice is-on cs-hub-card is-in">
          <span className="st-step-n">{badge(on)}</span>
          <span className="st-choice-body">
            <span className="st-choice-h">{all[on].t}</span>
            <span className="st-choice-p">{all[on].p}</span>
            <span className="st-choice-bar" aria-hidden="true" hidden={on >= n}>
              <i key={tick} style={auto ? { animationDuration: `${HUB_MS}ms`, animationPlayState: running ? 'running' : 'paused' } : { animation: 'none' }} />
            </span>
          </span>
        </div>
      </div>
      <button type="button" className="sv-take-nav is-down cs-hub-arrow" aria-label="Next module" onClick={() => go(1)}>
        <Icon name="chevron" size={28} stroke={1.8} />
      </button>
      </div>
    </div>
  )
}

// Key product decisions: number, the problem, what we decided, and a small
// drawn visual for each (no real POS brand is shown).
const WIFI_OFF = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M5 12.86a10 10 0 0 1 5.17-2.69M19 12.86a10 10 0 0 0-2.01-1.53M2 8.82a15 15 0 0 1 4.18-2.65M22 8.82a15 15 0 0 0-11.29-3.76M2 2l20 20" /></svg>

function DecPos() {
  return (
    <div className="cs-dec-pos" aria-hidden="true">
      <div className="st-device cs-dec-phone is-app"><div className="st-device-screen"><img src={avif('/case/orderflow/guest-latest.jpg')} alt="" loading="lazy" /><span className="st-device-island" /></div></div>
      <div className="cs-dec-wire">
        <span className="cs-dec-chip">
          <span className="cs-dec-chip-ic"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg></span>
          <span className="cs-dec-chip-t"><b>New order · T-24</b><small>Latte ×2</small></span>
        </span>
      </div>
      <div className="cs-dec-terminal">
        <div className="cs-dec-bezel">
          <span className="cs-dec-glare" />
          <div className="cs-dec-pos-ui">
            <div className="cs-dec-bar">
              <span>☰ All items ▾</span><span className="cs-dec-bar-r">Ticket · Table 24</span>
            </div>
            <div className="cs-dec-grid">
              {[['latte', 'Latte', '12,000'], ['americano', 'Americano', '12,000'], ['matcha', 'Iced Matcha', '9,500'], ['black', 'Black Coffee', '9,500'], ['espresso', 'Espresso', '8,000'], ['iced-latte', 'Iced Latte', '10,000']].map(([k, t, p]) => (
                <span key={k} className="cs-dec-tile"><img src={avif(`/case/orderflow/pos/${k}.jpg`)} alt="" loading="lazy" /><b>{t}</b><i>{p}</i></span>
              ))}
            </div>
            <div className="cs-dec-ticket">
              <span className="is-new"><em>QR</em>Latte ×2<i>24,000</i></span>
              <span>Americano ×1<i>12,000</i></span>
              <span className="cs-dec-total">Total<i>36,000 Ks</i></span>
              <span className="cs-dec-pay">Charge 36,000 Ks</span>
            </div>
          </div>
        </div>
        <span className="cs-dec-arm" />
        <span className="cs-dec-base" />
      </div>
    </div>
  )
}
function DecOffline() {
  return (
    <div className="cs-dec-off" aria-hidden="true">
      <div className="cs-dec-desk">
        <span className="cs-dec-desk-screen">
          {/* Wi-Fi searching: the bars light up in turn, then the signal is cut. */}
          <svg className="cs-dec-wifi" viewBox="0 0 24 24">
            <path className="w0" d="M12 20h.01" /><path className="w1" d="M8.5 16.43a5 5 0 0 1 7 0" /><path className="w2" d="M5 12.86a10 10 0 0 1 14 0" /><path className="w3" d="M2 8.82a15 15 0 0 1 20 0" />
            <path className="cut" d="M3 3l18 18" pathLength="1" />
          </svg>
        </span>
        <span className="cs-dec-desk-foot" /><small>Set-up device only</small>
      </div>
      <div className="cs-dec-mobile">
        <span className="cs-dec-pill">{WIFI_OFF}Wi-Fi down, still running on mobile data</span>
        <div className="st-device cs-dec-phone is-app">
          <div className="st-device-screen"><img src={avif('/case/orderflow/admin-mobile.jpg')} alt="" loading="lazy" /><span className="st-device-island" /></div>
        </div>
      </div>
    </div>
  )
}
function DecEco() {
  const ring = [['qr', 'QR'], ['pos', 'POS'], ['ai', 'AI'], ['loyalty', 'Loyalty'], ['inventory', 'Inventory']]
  return (
    <div className="cs-dec-eco" aria-hidden="true">
      <div className="cs-dec-copies">{[0, 1, 2].map((i) => <span key={i}><svg viewBox="0 0 24 24">{HUB_ICONS.qr}</svg>QR menu</span>)}<small>Easy to copy</small></div>
      <svg className="cs-dec-arrow" viewBox="0 0 40 12"><path d="M0 6h36M31 1l5 5-5 5" /></svg>
      <div className="cs-dec-ringwrap">
        <div className="cs-dec-ring">
          <span className="cs-dec-ring-core"><img src={avif('/logos/orderflow-icon.png')} alt="" loading="lazy" /></span>
          <div className="cs-orbit cs-dec-orbit">
            <OrbitRing r={40} count={ring.length} start={-90} gap={17} />
            {ring.map(([k, t], i) => {
              const a = (-90 + (360 / ring.length) * i) * Math.PI / 180
              return (
                <span key={k} className="cs-orbit-item" style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }}>
                  <span className="cs-orbit-up"><span className={'cs-dec-node' + (k === 'qr' ? ' is-on' : '')}><svg viewBox="0 0 24 24">{HUB_ICONS[k]}</svg><small>{t}</small></span></span>
                </span>
              )
            })}
          </div>
        </div>
        <small>Hard to copy</small>
      </div>
    </div>
  )
}
const DEC_ART = { pos: DecPos, offline: DecOffline, eco: DecEco }
function Decisions({ items }) {
  return (
    <ol className="cs-dec">
      {items.map((it) => {
        const Art = DEC_ART[it.key]
        return (
          <li key={it.key} className="cs-dec-row">
            <div className="cs-dec-text">
              <div className="cs-dec-pd">
                <p><b>Problem</b>{it.problem}</p>
                <p><b>Decision</b>{it.decision}</p>
              </div>
            </div>
            <div className="cs-dec-art">{Art && <Art />}</div>
          </li>
        )
      })}
    </ol>
  )
}

// Product architecture: the three surfaces layered as one scene (owner's
// dashboard at the back, the staff board, the guest's phone in front), and a
// short line for each. The highlight moves from guest to staff to owner.
const ARCH_SHOTS = { owner: avif('/case/orderflow/arch-owner.jpg?v=2'), staff: avif('/case/orderflow/arch-staff.jpg'), guest: avif('/case/orderflow/guest-latest.jpg') }
// Each screen is clickable too: it picks that step and comes to the front.
const pressable = (label, onPick) => ({ role: 'button', tabIndex: 0, 'aria-label': label, onClick: onPick, onPointerEnter: onPick, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick() } } })
function ArchBrowser({ who, on, label, onPick }) {
  return (
    <div className={'st-browser cs-arch-' + who + (on ? ' is-on' : '')} {...pressable(label, onPick)} aria-pressed={on}>
      <div className="st-browser-bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="st-browser-page" style={{ aspectRatio: '1440 / 1024' }}><img src={ARCH_SHOTS[who]} alt="" loading="lazy" /></div>
    </div>
  )
}
function Arch({ items }) {
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setOn((i) => (i + 1) % items.length), 3200)
    return () => clearTimeout(t)
  }, [auto, on, items.length])
  const key = items[on].key
  const pick = (k) => { setOn(items.findIndex((it) => it.key === k)); setAuto(false) }
  const name = (k) => 'Show ' + (items.find((it) => it.key === k)?.t || k)
  return (
    <div className="cs-arch">
      <div className="cs-arch-stage">
        <ArchBrowser who="owner" on={key === 'owner'} label={name('owner')} onPick={() => pick('owner')} />
        <ArchBrowser who="staff" on={key === 'staff'} label={name('staff')} onPick={() => pick('staff')} />
        <div className={'st-device cs-arch-guest is-app' + (key === 'guest' ? ' is-on' : '')} {...pressable(name('guest'), () => pick('guest'))} aria-pressed={key === 'guest'}>
          <div className="st-device-screen"><img src={ARCH_SHOTS.guest} alt="" loading="lazy" /><span className="st-device-island" /></div>
        </div>
      </div>
    </div>
  )
}

// MVP: the guest flow on a phone and the shop flow in a browser, side by
// side, each playing through its screens like a short video (cross-fade).
// Hovering pauses it.
const MOCK_MS = 2600
function MockScreens({ srcs, alt, hold }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setI((x) => (x + 1) % srcs.length), MOCK_MS)
    return () => clearTimeout(t)
  }, [i, hold, srcs.length])
  return (
    <>
      {srcs.map((src, k) => <img key={src} src={src} alt={k === 0 ? alt : ''} className={k === i ? 'is-on' : undefined} loading="lazy" />)}
    </>
  )
}
// Guest and shop recordings, side by side. Each side keeps its own flow,
// switched with a quiet row of names under the frame.
function FlowPicks({ label, items, on, pick, breakAfter }) {
  if (!items || items.length < 2) return null
  return (
    <div className="cs-flow-picks" role="tablist" aria-label={label + ' flows'}>
      {items.flatMap((it, i) => {
        const button = (
          <button key={it.name} type="button" role="tab" aria-selected={i === on} className={i === on ? 'is-on' : undefined} onClick={() => pick(i)}>{it.name}</button>
        )
        if (breakAfter !== i + 1) return [button]
        return [button, <span key={it.name + '-break'} className="cs-flow-break" aria-hidden="true" />]
      })}
    </div>
  )
}
function FlowPhone({ label, items, note, points, steps }) {
  const [on, setOn] = useState(0)
  const it = items[on]
  const hasCopy = note || points?.length > 0 || steps?.length > 0
  return (
    <figure className="cs-flow-phone">
      <Demo key={it.src} src={it.src} poster={it.poster} alt={it.alt} device="phone" bare active load />
      {hasCopy ? (
        <div className="cs-flow-copy">
          <FlowPicks label={label} items={items} on={on} pick={setOn} breakAfter={4} />
          {steps?.length > 0 && (
            <div className="cs-flow-steps">
              {steps.map((item, i) => (
                <div className="cs-sub" key={item.h || i}>
                  <h3>{item.h}</h3>
                  {(item.ps || [item.p]).filter(Boolean).map((p, j) => <p key={j}>{p}</p>)}
                </div>
              ))}
            </div>
          )}
          {note && <p>{note}</p>}
          {points?.length > 0 && <ul className="cs-list">{points.map((item) => <li key={item}>{item}</li>)}</ul>}
        </div>
      ) : (
        <FlowPicks label={label} items={items} on={on} pick={setOn} breakAfter={4} />
      )}
    </figure>
  )
}
function FlowSide({ side, device, on, pick, shared, logo }) {
  const [localOn, setLocalOn] = useState(0)
  const at = shared ? on : localOn
  const setAt = shared ? pick : setLocalOn
  const it = side.items[at]
  return (
    <figure className={'cs-mock-col is-' + (device === 'phone' ? 'phone' : 'browser')}>
      {!shared && <FlowPicks label={side.label} items={side.items} on={at} pick={setAt} />}
      <Demo key={it.src} {...it} device={device} logo={logo} bare active load />
      <figcaption>{side.label}</figcaption>
    </figure>
  )
}
function FlowPair({ phone, browser, shared }) {
  const [on, setOn] = useState(0)
  const canShare = shared && phone.items.length === browser.items.length && phone.items.every((it, i) => it.name === browser.items[i].name)
  return (
    <div className="cs-mock-wrap">
      {canShare && <FlowPicks label="Phone and web" items={phone.items} on={on} pick={setOn} />}
      <div className={'cs-mock' + (browser.logo === null ? ' is-plain-frame' : '')}>
        <FlowSide side={phone} device="phone" on={on} pick={setOn} shared={canShare} />
        <FlowSide side={browser} device={browser.device || 'pos'} on={on} pick={setOn} shared={canShare} logo={browser.logo} />
      </div>
    </div>
  )
}
function MockPair({ phone, browser }) {
  const [hold, setHold] = useState(false)
  return (
    <div className="cs-mock" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      <figure className="cs-mock-col is-phone">
        <div className="st-device"><div className="st-device-screen cs-mock-screen"><MockScreens {...phone} hold={hold} /><span className="st-device-island" /></div></div>
        <figcaption>{phone.label}</figcaption>
      </figure>
      <figure className="cs-mock-col is-browser">
        <PosFrame ratio="16 / 10" screenClass="cs-mock-screen"><MockScreens {...browser} hold={hold} /></PosFrame>
        <figcaption>{browser.label}</figcaption>
      </figure>
    </div>
  )
}

function Ship({ stats, image, alt, summary, year }) {
  return (
    <div className="cs-ship">
      <div className="cs-stats">
        {stats.map((it) => <div key={it.label}><span className="cs-stat-num">{it.num}</span><span>{it.label}</span></div>)}
      </div>
      <figure className="cs-contributions">
        <figcaption className="cs-contributions-head">
          <span>{summary}</span>
          <span>{year}</span>
        </figcaption>
        <div className="cs-contributions-scroll" role="region" tabIndex={0} aria-label="Contribution calendar; scroll horizontally to see all months">
          <img src={image} alt={alt} width="1450" height="222" loading="lazy" />
        </div>
        <div className="cs-contributions-footer">
          <span className="cs-contributions-source">GitHub activity <span>· Scroll to see all months</span></span>
          <span className="cs-contributions-legend" role="img" aria-label="Darker green indicates more contributions">
            <span>Less</span><i /><i /><i /><i /><i /><span>More</span>
          </span>
        </div>
      </figure>
    </div>
  )
}

// Validation: photos from the café, side by side (an optional caption each).
function Photos({ items }) {
  return (
    <div className="cs-photos">
      {items.map((it) => (
        <figure key={it.src}><img src={it.src} alt={it.alt} loading="lazy" />{it.caption && <figcaption>{it.caption}</figcaption>}</figure>
      ))}
    </div>
  )
}
// The test, feedback, improve loop: three glass steps. The highlight moves
// from step to step (a dot runs along the link to the next one), and after the
// last step the "again" pill lights up before it starts over.
const LOOP_MS = 2200
const LOOP_REST_MS = 4500 // the wait after someone drags it
// The test, feedback, improve loop as a turning carousel: glass cards on an
// oval orbit. One angle turns the whole orbit (eased, a step every LOOP_MS) and
// every card's place, size, depth, blur and how solid it is follow from where
// it sits on the oval, so a card going back travels round behind the others.
function Loop({ steps }) {
  const n = steps.length
  const [on, setOn] = useState(0)
  const cards = useRef([])
  const angle = useRef(0) // where the orbit is now, in steps
  const raf = useRef(0)
  const [held, setHeld] = useState(false) // a pointer is dragging the orbit
  const [settle, setSettle] = useState(0) // bumped on release, so it eases home even onto the same card
  const released = useRef(false) // the next turn comes from a drag, not the timer
  const drag = useRef(null)
  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // after a drag, leave the chosen card up long enough to read
    const t = setTimeout(() => setOn((i) => i + 1), released.current ? LOOP_REST_MS : LOOP_MS)
    return () => clearTimeout(t)
  }, [on, held, settle])
  // place every card for the orbit angle `a` (in steps; card i is at the front when a = i)
  const place = (a) => {
    const narrow = window.matchMedia('(max-width: 640px)').matches
    cards.current.forEach((el, i) => {
      if (!el) return
      const phi = ((i - a) / n) * Math.PI * 2
      const x = Math.sin(phi), depth = (Math.cos(phi) + 1) / 2 // 1 front, 0 straight behind
      const near = depth * depth * (3 - 2 * depth)
      el.style.transform = `translate3d(${x * (narrow ? 36 : 62)}%, ${-(1 - depth) * 9}%, 0) scale(${0.68 + 0.32 * near})`
      el.style.opacity = String(0.25 + 0.75 * near)
      el.style.zIndex = String(Math.round(depth * 100))
      el.style.setProperty('--solid', String(near))
      el.style.filter = 'none'
    })
  }
  useEffect(() => {
    const fromDrag = released.current
    released.current = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = angle.current, t0 = performance.now(), dur = reduced ? 1 : fromDrag ? 520 : 1100
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur)
      // a release is already moving, so it only slows down; a timed turn eases both ways
      const e = fromDrag ? 1 - Math.pow(1 - k, 3) : k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
      angle.current = from + (on - from) * e
      place(angle.current)
      if (k < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, settle])
  // Drag sideways to turn the orbit by hand; on release it settles on the nearest
  // card, or the next one along if the drag was a short flick.
  const onDown = (e) => {
    if (e.button) return
    cancelAnimationFrame(raf.current)
    e.currentTarget.setPointerCapture(e.pointerId)
    // about the distance the front card travels in one step, so it follows the pointer
    const step = Math.max(1, (cards.current[0]?.offsetWidth || 300) * 1.3)
    drag.current = { x: e.clientX, from: angle.current, step, dx: 0 }
    setHeld(true)
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    d.dx = e.clientX - d.x
    angle.current = d.from - d.dx / d.step
    place(angle.current)
  }
  const onUp = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    let to = Math.round(angle.current)
    if (Math.abs(d.dx) > 30 && to === Math.round(d.from)) to += d.dx < 0 ? 1 : -1
    released.current = true
    setOn(to)
    setSettle((s) => s + 1)
    setHeld(false)
  }
  useEffect(() => {
    const onResize = () => place(angle.current)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const cur = ((on % n) + n) % n
  return (
    <div className="cs-loop">
      <div className={'cs-loop-stage' + (held ? ' is-held' : '')} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <svg className="cs-loop-orbit" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="15" rx="48" ry="13" /></svg>
        {steps.map((st, i) => (
          <article key={st.t} ref={(el) => { cards.current[i] = el }} className="cs-loop-card" aria-hidden={i !== cur} aria-current={i === cur ? 'step' : undefined}>
            <span className="cs-loop-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <b>{st.t}</b>
            <p>{st.p}</p>
          </article>
        ))}
      </div>
      <div className="cs-loop-foot">
        <span className="cs-loop-dots" aria-hidden="true">{steps.map((st, i) => <i key={st.t} className={i === cur ? 'is-on' : undefined} />)}</span>
      </div>
    </div>
  )
}




