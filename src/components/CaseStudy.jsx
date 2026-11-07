import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CASES, HOME_WORK, MORE_WORK } from '../data'
import { scrollToY } from '../scroll'
import { useDragPill } from '../useDragPill'
import {
  TLDR, Flow, Compare, Journey, Decision, Blueprint, People, Principles, Mock, Insights,
  JourneyMap, Tree, Frameworks, Wireframes, Spec, Closing,
  HMW, Details, Achievements, Roadmap,
} from './CaseBlocks'
import { Impact, Role, Sub, IconList, Segments, Table, Iterations, Pills, Walkthrough, Film, Shot, WalkTabs, ShotTabs, Reel, Demo, Choices, BeforeAfter } from './Story'
import { Illo, Person } from './Illos'
import { Card, BackButton, ConnectCard, Icon } from './ui'
import Media from './Media'

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
  const c = CASES.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Card className="sv-pagehead">
        <BackButton href="/" label="Back to home" />
        <h1 className="sv-h1">Project not found</h1>
        <p className="sv-pagehead-sub"><a className="sv-link" href="/">Back to home</a></p>
      </Card>
    )
  }
  const s = c.study

  const facts = (s
    ? [
        ['Role', [s.role]],
        ['Timeline', [s.duration]],
        ['Scope', s.scope],
        ['Team', s.team],
        ['Tools', s.tools?.split(',').map((t) => t.trim())],
      ]
    : [
        ['Domain', [c.domain]],
        ['Focus', c.tags],
      ]
  )
    .map(([k, v]) => [k, (v || []).filter(Boolean)])
    .filter(([, v]) => v.length)

  return (
    <div className="sv-case" style={s?.accent ? { '--acc': s.accent } : undefined}>
      {s?.sections?.length > 1 && <CaseNav sections={s.sections} />}
      <Card className="sv-cover" id="cs-top">
        <Media art={c.art} title={c.title} />
        <BackButton href="/" label="Back to home" />
        <h1 className="sv-cover-title">{c.title}</h1>
      </Card>

      {facts.length > 0 && (
        <Card className={'sv-facts' + (facts.length % 2 ? ' is-odd' : '')}>
          {facts.map(([k, v]) => (
            <div className="sv-fact" key={k}>
              <dt>{k}</dt>
              <dd>{v.join(k === 'Tools' || k === 'Focus' ? ', ' : ' · ')}</dd>
            </div>
          ))}
        </Card>
      )}

      <Card className="sv-text">
        {s?.heading && <p className="sv-statement">{plain(s.heading)}</p>}
        <p>{s?.summary ?? c.desc}</p>
      </Card>

      {s?.sections.map((sec) => <Section key={sec.id} sec={sec} />)}

      <OtherWork current={c.slug} />

      {s?.gallery?.length > 0 && <Gallery images={s.gallery} />}
      {!s && <ConnectCard />}
    </div>
  )
}

// The end of a case study: the next four projects from the home page, starting
// after this one and wrapping round, so each page points somewhere different.
function OtherWork({ current }) {
  const order = [...HOME_WORK, ...MORE_WORK]
  const from = order.indexOf(current) + 1
  const next = [...order.slice(from), ...order.slice(0, from)].filter((slug) => slug !== current).slice(0, 4)
  const items = next.map((slug) => CASES.find((c) => c.slug === slug)).filter(Boolean)
  return (
    <Card className="sv-others">
      <h2 className="sv-h2">More Work</h2>
      <ul className="sv-others-list">
        {items.map((c) => (
          <li key={c.slug}>
            <a className="sv-other" href={`/work/${c.slug}`}>
              <Media art={c.art.thumb ? { ...c.art, img: c.art.thumb } : c.art} title="" />
              <span className="sv-other-name">{c.title}</span>
              <span className="sv-other-arrow"><Icon name="arrowRight" size={20} stroke={1.8} /></span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// `*words*` in a title render as a light italic accent; plain() strips the
// markers for labels.
const plain = (t = '') => t.replace(/\*/g, '')
function rich(t = '') {
  return t.split(/\*(.+?)\*/).map((part, i) => (i % 2 ? <em className="acc-i" key={i}>{part}</em> : part))
}

// One section as one card. `bare` sections (the product film) are the visual
// alone. A section's opening `lead` block sits under its heading, and an
// optional `illo` sits beside the heading. `title` (optional) is the heading
// when it should say more than the short `nav` label in the side list.
function Section({ sec }) {
  if (sec.bare) {
    const card = (
      <Card className="sv-sec sv-sec-bare" aria-label={plain(sec.nav)} id={sec.id}>
        {sec.blocks.map((b, j) => <Block key={j} block={b} />)}
      </Card>
    )
    return card
  }
  const opensWithLead = sec.blocks[0]?.kind === 'lead'
  const lead = opensWithLead ? sec.blocks[0].p : null
  const body = opensWithLead ? sec.blocks.slice(1) : sec.blocks
  return (
    <Card className={'sv-sec' + (sec.illo ? ' has-illo' : '')} id={sec.id}>
      <div className="sv-sec-head">
        <div>
          {sec.eyebrow && <p className="sv-label sv-label-left">{sec.eyebrow}</p>}
          <h2 className="sv-h2">{rich(sec.title || sec.nav)}</h2>
          {lead && <p className="sv-sec-lead">{rich(lead)}</p>}
        </div>
        {sec.illo && <Illo name={sec.illo} className="sv-illo" />}
      </div>
      {body.length > 0 && (
        <div className="sv-sec-body">
          {body.map((b, j) => <Block key={j} block={b} />)}
        </div>
      )}
    </Card>
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

// Blocks keyed by `kind` in data.js. TEXT kinds sit on the dark card; every
// other visual goes on a light plate.
const VISUALS = {
  tldr: TLDR, flow: Flow, compare: Compare, journey: Journey, decision: Decision,
  blueprint: Blueprint, people: People, principles: Principles, mock: Mock, insights: Insights,
  journeymap: JourneyMap, tree: Tree, frameworks: Frameworks, wireframes: Wireframes, spec: Spec, closing: Closing,
  hmw: HMW, details: Details, achievements: Achievements, roadmap: Roadmap,
  impact: Impact, role: Role, sub: Sub, iconlist: IconList, segments: Segments, table: Table,
  iterations: Iterations, pills: Pills, walkthrough: Walkthrough, film: Film, shot: Shot, walktabs: WalkTabs, shottabs: ShotTabs,
  reel: Reel, demo: Demo, choices: Choices, beforeafter: BeforeAfter,
}
const TEXT = new Set(['impact', 'role', 'sub', 'iconlist', 'segments', 'table', 'iterations', 'pills', 'demo', 'choices'])

function Block({ block }) {
  const Visual = VISUALS[block.kind]
  if (Visual) {
    const node = <Visual {...block} caption={undefined} />
    const plated = TEXT.has(block.kind) ? node : <div className={'sv-plate is-' + block.kind + (block.wide ? ' is-wide' : '')}>{node}</div>
    if (!block.caption) return plated
    return (
      <figure className="cs-fig">
        {plated}
        <figcaption className="cs-figcap">{block.caption}</figcaption>
      </figure>
    )
  }
  // Term / explanation rows. An item's `illo` puts that person's bust in
  // front of the term.
  if (block.kind === 'notes') {
    return (
      <dl className="cs-notes">
        {block.items.map((it) => (
          <div key={it.t}>
            <dt>{it.illo && <Person name={it.illo} className="cs-notes-person" />}{it.t}</dt>
            <dd>{it.p}</dd>
          </div>
        ))}
      </dl>
    )
  }
  if (block.kind === 'split') {
    return block.items.map((it, i) => (
      <div className="cs-sub" key={i}>
        <h3>{it.h}</h3>
        <p>{it.p}</p>
      </div>
    ))
  }
  if (block.kind === 'lead') return <p className="sv-sec-lead">{block.p}</p>
  if (block.kind === 'list') {
    return (
      <div className="cs-prose">
        {block.p && <p>{block.p}</p>}
        <ul className="cs-list">{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    )
  }
  if (block.kind === 'stats') {
    return (
      <div className="cs-stats">
        {block.items.map((it, i) => (
          <div key={i}><span className="cs-stat-num">{it.num}</span><span>{it.label}</span></div>
        ))}
      </div>
    )
  }
  return <p>{block.p}</p>
}

// Section list: a glass panel fixed on the left, mirroring the main menu,
// listing the case study's sections. The section in view is highlighted
// (the one whose top last passed a line a third of the way down the
// screen); clicking an item scrolls there. Hidden on narrower screens.
function CaseNav({ sections }) {
  // A section with a `group` (e.g. a design phase: Understand, Define…) is
  // listed once, under its group's name, pointing at the group's first section.
  const items = [{ id: 'cs-top', label: 'Overview' }]
  for (const x of sections) {
    if (x.group && items.some((it) => it.group === x.group)) continue
    items.push({ id: x.id, label: x.group || plain(x.nav), group: x.group })
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
      return el.getBoundingClientRect().top + window.scrollY - 24
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
      <ol ref={list} className={drag.dragging ? 'is-dragging' : undefined} {...drag.handlers}>
        <span
          className={'sv-toc-glass' + (pill ? '' : ' is-hidden')}
          style={pill ? { ...drag.pillStyle(), height: pill.h } : undefined}
          aria-hidden="true"
        />
        {items.map((it) => (
          <li key={it.id}>
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
