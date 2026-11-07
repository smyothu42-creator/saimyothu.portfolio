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
      {s?.sections?.length > 1 && <CaseNav sections={s.sections} top={s.navTop !== false} overview={s.overviewNav} />}
      <Card className="sv-cover" id="cs-top">
        <Media art={c.art} title={c.title} eager />
        <BackButton href="/" label="Back to home" />
        <h1 className="sv-cover-title">{c.title}</h1>
      </Card>

      {facts.length > 0 && (
        <Card className={'sv-facts' + (facts.length % 2 ? ' is-odd' : '')} id="cs-overview">
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
      {(!sec.notitle || lead || sec.illo) && <div className="sv-sec-head">
        <div>
          {sec.eyebrow && <p className="sv-label sv-label-left">{sec.eyebrow}</p>}
          {!sec.notitle && <h2 className="sv-h2">{rich(sec.title || sec.nav)}</h2>}
          {lead && <p className="sv-sec-lead">{rich(lead)}</p>}
        </div>
        {sec.illo && <Illo name={sec.illo} className="sv-illo" />}
      </div>}
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
  reel: Reel, demo: Demo, choices: Choices, beforeafter: BeforeAfter, hub: Hub,
}
const TEXT = new Set(['hub', 'impact', 'role', 'sub', 'iconlist', 'segments', 'table', 'iterations', 'pills', 'demo', 'choices'])

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
      <dl className={'cs-notes' + (block.items.some((it) => it.illo) ? ' has-people' : '')}>
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
  return <p>{block.p}</p>
}

// Section list: a glass panel fixed on the left, mirroring the main menu,
// listing the case study's sections. The section in view is highlighted
// (the one whose top last passed a line a third of the way down the
// screen); clicking an item scrolls there. Hidden on narrower screens.
function CaseNav({ sections, top = true, overview }) {
  // A section with a `group` (e.g. a design phase: Understand, Define…) is
  // listed once, under its group's name, pointing at the group's first section.
  // `toc: false` keeps a section (like the intro film) out of the list, and a
  // study with `navTop: false` leaves out the cover's Overview entry, and
  // `overviewNav` lists the facts and summary at the top under that name.
  const items = top ? [{ id: 'cs-top', label: 'Overview' }] : []
  if (overview) items.push({ id: 'cs-overview', label: overview })
  for (const x of sections) {
    if (x.toc === false) continue
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

// Brand marks in front of a stat: the apps' real store icons
// (public/logos/apps) and the Myanmar flag, drawn.
const BRANDS = { foodpanda: 'foodpanda', grab: 'Grab', kbzpay: 'KBZPay' }
function BrandTile({ name }) {
  if (name === 'myanmar') {
    return (
      <svg className="cs-logo" viewBox="0 0 48 48" role="img" aria-label="Myanmar flag">
        <rect width="48" height="16" fill="#FECB00" /><rect y="16" width="48" height="16" fill="#34B233" /><rect y="32" width="48" height="16" fill="#EA2839" />
        <path fill="#fff" d="M24 11.5l3.06 9.42h9.9l-8.01 5.82 3.06 9.42L24 30.34l-8.01 5.82 3.06-9.42-8.01-5.82h9.9z" />
      </svg>
    )
  }
  if (!BRANDS[name]) return null
  return <img className="cs-logo" src={`/logos/apps/${name}.png`} alt={BRANDS[name]} width="64" height="64" loading="lazy" />
}

// Product vision: the OrderFlow ecosystem. The logo sits in the middle and
// the modules sit on a glass ring around it. The highlight moves round on its
// own; clicking a module stops that and shows the module on the right.
const HUB_ICONS = {
  qr: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18h2v2M18 18h2v2h-2" />,
  pos: <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21zM9 8h6M9 12h6M9 16h3" />,
  ai: <path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" />,
  loyalty: <path d="M4 10h16v4H4zM6 14v6h12v-6M12 10v10M12 10c-1.5-3-5-4-5-1.5S10 10 12 10zM12 10c1.5-3 5-4 5-1.5S14 10 12 10z" />,
  inventory: <path d="M3 8l9-4 9 4-9 4zM3 8v8l9 4 9-4V8M12 12v8" />,
}
const HUB_MS = 3800
function Hub({ items }) {
  const n = items.length
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(true)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => { setOn((i) => (i + 1) % n); setTick((k) => k + 1) }, HUB_MS)
    return () => clearTimeout(t)
  }, [auto, on, n])
  const pick = (i) => { setOn(i); setAuto(false) }
  const cur = items[on]
  const at = (i) => (-90 + (360 / n) * i) * Math.PI / 180
  return (
    <div className="cs-hub">
      <div className="cs-hub-art">
        <svg className="cs-hub-spokes" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="38" />
          {items.map((it, i) => (
            <line key={it.key} className={i === on ? 'is-on' : undefined} x1={50 + 38 * Math.cos(at(i))} y1={50 + 38 * Math.sin(at(i))} x2="50" y2="50" />
          ))}
        </svg>
        <span className="cs-hub-core">
          <img src="/logos/orderflow-icon.png" alt="" />
        </span>
        {items.map((it, i) => (
          <button
            key={it.key} type="button"
            className={'cs-hub-node' + (i === on ? ' is-on' : '') + (it.live ? ' is-live' : '')}
            style={{ left: `${50 + 38 * Math.cos(at(i))}%`, top: `${50 + 38 * Math.sin(at(i))}%`, animationDelay: `${-i * 0.7}s` }}
            onClick={() => pick(i)} aria-pressed={i === on} aria-label={it.t}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">{HUB_ICONS[it.key]}</svg>
            <span className="cs-hub-label">{it.t}</span>
          </button>
        ))}
      </div>
      <div className="cs-hub-panel" aria-live="polite">
        <p className="cs-hub-name">OrderFlow ecosystem</p>
        <p className="cs-hub-step">Step {on + 1} of {n}<span className={'cs-hub-tag' + (cur.live ? ' is-live' : '')}>{cur.tag}</span></p>
        <h3 key={'t' + on} className="cs-hub-title">{cur.t}</h3>
        <p key={'p' + on} className="cs-hub-text">{cur.p}</p>
        <div className="cs-hub-dots">
          {items.map((it, i) => (
            <button key={it.key} type="button" className={i === on ? 'is-on' : undefined} onClick={() => pick(i)} aria-label={'Show ' + it.t}>
              {i === on && auto && <span key={tick} className="cs-hub-fill" style={{ animationDuration: HUB_MS + 'ms' }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
