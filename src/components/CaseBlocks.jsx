// Infographic blocks for case studies. Each is pure HTML/CSS (no images), so
// they stay sharp at any size and can be edited straight from data.js. Colour
// comes from the study's `accent`, exposed on the article as --acc.

import { Person } from './Illos'

// Three-up summary: problem → what I did → outcome. Sits near the top so a
// reviewer gets the whole story in one scroll.
export function TLDR({ items }) {
  return (
    <div className="ig-tldr">
      {items.map((it, i) => (
        <div className="ig-card" key={i}>
          <span className="ig-kicker">{it.k}</span>
          <p>{it.p}</p>
        </div>
      ))}
    </div>
  )
}

// Numbered horizontal flow with connectors; wraps to a vertical list on mobile.
export function Flow({ title, steps }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <ol className="ig-flow">
        {steps.map((s, i) => (
          <li key={i} className={s.hl ? 'is-hl' : undefined}>
            <span className="ig-flow-num">{String(i + 1).padStart(2, '0')}</span>
            <strong>{s.t}</strong>
            {s.d && <span className="ig-flow-d">{s.d}</span>}
          </li>
        ))}
      </ol>
    </figure>
  )
}

// Before / after columns.
export function Compare({ title, before, after }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-compare">
        {[before, after].map((col, i) => (
          <div className={'ig-compare-col' + (i ? ' is-after' : '')} key={i}>
            <span className="ig-kicker">{col.title}</span>
            <ul>{col.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </figure>
  )
}

// Friction curve: one bar per journey stage, height = pain (1–3). The worst
// stages are labelled so the chart reads without a legend.
export function Journey({ title, stages }) {
  const label = ['', 'Low', 'Medium', 'High']
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-journey" role="list">
        {stages.map((s, i) => (
          <div className={'ig-journey-col pain-' + s.pain} key={i} role="listitem">
            <div className="ig-journey-track">
              <div className="ig-journey-bar" style={{ height: `${(s.pain / 3) * 100}%` }}>
                <span>{label[s.pain]}</span>
              </div>
            </div>
            <strong>{s.t}</strong>
            {s.note && <span className="ig-journey-note">{s.note}</span>}
          </div>
        ))}
      </div>
    </figure>
  )
}

// A key decision: the question, the options weighed, and the trade-off taken.
export function Decision({ n, q, options, why, tradeoff }) {
  return (
    <div className="ig-decision">
      <div className="ig-decision-head">
        <span className="ig-decision-n">Decision {n}</span>
        <h3>{q}</h3>
      </div>
      <div className="ig-options">
        {options.map((o, i) => (
          <div className={'ig-option' + (o.chosen ? ' is-chosen' : '')} key={i}>
            <span className="ig-option-tag">{o.chosen ? '✓ Chosen' : 'Considered'}</span>
            <strong>{o.t}</strong>
            <p>{o.p}</p>
          </div>
        ))}
      </div>
      <dl className="ig-decision-foot">
        <div><dt>Why</dt><dd>{why}</dd></div>
        <div><dt>Trade-off</dt><dd>{tradeoff}</dd></div>
      </dl>
    </div>
  )
}

// Service blueprint: actors as rows, stages as columns. Scrolls sideways on
// small screens rather than squashing the grid.
export function Blueprint({ title, cols, rows }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-blueprint-scroll">
        <table className="ig-blueprint">
          <thead>
            <tr><th />{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.cells.map((c, i) => <td key={i} className={c ? undefined : 'is-empty'}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

// Persona / user cards with a short needs list.
export function People({ items }) {
  return (
    <div className="ig-people">
      {items.map((it, i) => (
        <div className="ig-card" key={i}>
          <span className="ig-kicker">{it.tag}</span>
          <h3>{it.h}</h3>
          {it.p && <p>{it.p}</p>}
          {it.needs && (
            <ul className="ig-needs">{it.needs.map((n, j) => <li key={j}>{n}</li>)}</ul>
          )}
        </div>
      ))}
    </div>
  )
}

// Research insight → design response, one row per pair.
export function Insights({ title, items }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <ol className="ig-insights">
        {items.map((it, i) => (
          <li key={i}>
            <div className="ig-insight">
              <span className="ig-kicker">Insight {String(i + 1).padStart(2, '0')}</span>
              <p>{it.insight}</p>
            </div>
            <span className="ig-insight-arrow" aria-hidden="true">→</span>
            <div className="ig-insight is-response">
              <span className="ig-kicker">Design response</span>
              <p>{it.response}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}

// Numbered principles.
export function Principles({ items }) {
  return (
    <ol className="ig-principles">
      {items.map((it, i) => (
        <li key={i}>
          <span className="ig-flow-num">{String(i + 1).padStart(2, '0')}</span>
          <strong>{it.t}</strong>
          <p>{it.p}</p>
        </li>
      ))}
    </ol>
  )
}

// Lo-fi UI mockups on a tinted stage. `screens` names entries in MOCKS.
export function Mock({ screens, caption }) {
  return (
    <figure className="ig-figure">
      <div className="ig-stage">
        {screens.map((name) => {
          const M = MOCKS[name]
          return (
            <div className="ig-stage-item" key={name}>
              <M />
              <span className="ig-stage-label">{M.label}</span>
            </div>
          )
        })}
      </div>
      {caption && <figcaption className="ig-caption">{caption}</figcaption>}
    </figure>
  )
}

// The same mockups without labels or stage, for the case-study banner.
export function MockScreens({ screens }) {
  return screens.map((name) => {
    const M = MOCKS[name]
    return <M key={name} />
  })
}

function Phone({ dark, children }) {
  return (
    <div className={'mk-phone' + (dark ? ' is-dark' : '')} aria-hidden="true">
      <div className="mk-notch" />
      {children}
    </div>
  )
}

function QrMenu() {
  return (
    <Phone>
      <div className="mk-top">
        <span className="mk-h">Table 7</span>
        <span className="mk-seg"><b>EN</b><i>မြန်မာ</i></span>
      </div>
      <div className="mk-chips"><b>Noodles</b><i>Rice</i><i>Drinks</i><i>Snacks</i></div>
      {[['Mohinga', '3,500 Ks'], ['Shan noodles', '4,000 Ks'], ['Tea leaf salad', '3,000 Ks'], ['Milk tea', '1,500 Ks']].map(([n, p], i) => (
        <div className="mk-row" key={n}>
          <span className="mk-thumb" />
          <span className="mk-col"><b>{n}</b><i>{p}</i></span>
          <span className={'mk-add' + (i < 2 ? ' is-on' : '')}>{i < 2 ? '1' : '+'}</span>
        </div>
      ))}
      <div className="mk-cta">2 items · Send order</div>
    </Phone>
  )
}
QrMenu.label = 'Guest · QR menu in the browser'

function OrderBoard() {
  const cols = [
    ['New', [['T7', 'QR', '2 items', true], ['T3', 'POS', '4 items']]],
    ['Preparing', [['Takeaway 12', 'QR', '1 item'], ['T1', 'QR', '3 items']]],
    ['Ready', [['T5', 'POS', '2 items']]],
  ]
  return (
    <div className="mk-window" aria-hidden="true">
      <div className="mk-bar"><i /><i /><i /><span>Live order board</span></div>
      <div className="mk-board">
        {cols.map(([name, tickets]) => (
          <div className="mk-lane" key={name}>
            <span className="mk-lane-h">{name} <em>{tickets.length}</em></span>
            {tickets.map(([t, src, n, fresh]) => (
              <div className={'mk-ticket' + (fresh ? ' is-new' : '')} key={t}>
                <b>{t}</b>
                <span><em className={'mk-src src-' + src.toLowerCase()}>{src}</em>{n}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
OrderBoard.label = 'Staff · one board for QR and POS orders'

function Allowance() {
  return (
    <Phone>
      <div className="mk-top"><span className="mk-h">Today’s lunch</span></div>
      <div className="mk-alert">Ordering closes in <b>42 min</b></div>
      <div className="mk-meter">
        <span className="mk-meter-h"><b>$12.50</b> of $15 left</span>
        <span className="mk-meter-track"><span style={{ width: '83%' }} /></span>
      </div>
      {['Chicken grain bowl', 'Tofu banh mi', 'Seasonal salad'].map((n, i) => (
        <div className="mk-row" key={n}>
          <span className="mk-thumb" />
          <span className="mk-col"><b>{n}</b><i>{i === 2 ? '+$2.00 over' : 'Covered'}</i></span>
          <span className="mk-add">+</span>
        </div>
      ))}
      <div className="mk-cta">Deliver to Office · Floor 12</div>
    </Phone>
  )
}
Allowance.label = 'Corporate employee · allowance + cut-off'

function Personal() {
  return (
    <Phone>
      <div className="mk-top"><span className="mk-h">Checkout</span></div>
      <div className="mk-block"><i>Deliver to</i><b>Home · Saved</b></div>
      <div className="mk-block"><i>Pay with</i><b>Visa •• 4242</b></div>
      <div className="mk-steps">
        {['Placed', 'Preparing', 'On the way', 'Delivered'].map((s, i) => (
          <span key={s} className={i < 2 ? 'is-done' : undefined}>{s}</span>
        ))}
      </div>
      <div className="mk-cta">Place order · $16.50</div>
    </Phone>
  )
}
Personal.label = 'Individual · saved address, payment, tracking'

function Driver() {
  return (
    <Phone dark>
      <div className="mk-top"><span className="mk-h">Stop 2 of 6</span></div>
      <div className="mk-stop">
        <b>Montgomery Tower</b>
        <i>Floor 12 · Reception</i>
      </div>
      <div className="mk-group">
        {['Alex R.', 'Priya S.', 'Jordan M.', 'Sam K.'].map((n, i) => (
          <span key={n} className={i < 2 ? 'is-done' : undefined}>{n}</span>
        ))}
      </div>
      <div className="mk-cta mk-cta-big">Mark delivered</div>
      <div className="mk-ghost">Add photo proof</div>
    </Phone>
  )
}
Driver.label = 'Driver · one stop, one action'

const MOCKS = { 'qr-menu': QrMenu, 'order-board': OrderBoard, allowance: Allowance, personal: Personal, driver: Driver }

// ---------------------------------------------------------------------------
// Research-artefact blocks, styled after a design team's working documents:
// journey map, IA tree, framework diagrams, wireframes, spec sheet, closing.
// ---------------------------------------------------------------------------

// User journey: one row per person. A single mood line runs across the stages
// the person takes part in (dot + mood word), with that stage's pain point
// underneath. The row's lowest moment is set in bold so the dips scan first.
// Stages a person skips are simply left empty.
const JM_TOP = 8    // y of the happiest mood (emotion 2), px
const JM_STEP = 13  // px per emotion step
export function JourneyMap({ title, stages, users }) {
  const n = stages.length
  const cols = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }
  return (
    <figure className="ig-figure jm">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="jm-scroll">
        <div className="jm-grid" style={{ '--n': n }}>
          <div className="jm-head" style={cols}>
            {stages.map((st, i) => (
              <span key={st}><em>{i + 1}</em>{st}</span>
            ))}
          </div>
          {users.map((u) => {
            const live = u.cells.map((c, i) => (c ? i : -1)).filter((i) => i >= 0)
            const low = Math.min(...live.map((i) => u.cells[i].emotion))
            const pt = (i) => ({ x: ((i + 0.5) / n) * 100, y: JM_TOP + (2 - u.cells[i].emotion) * JM_STEP })
            return (
              <div className="jm-row" key={u.name}>
                <div className="jm-user">
                  {u.illo ? <Person name={u.illo} className="jm-person" /> : null}
                  <strong>{u.name}</strong>
                </div>
                <div className="jm-track" style={cols}>
                  <svg className="jm-line" viewBox="0 0 100 68" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points={live.map((i) => { const p = pt(i); return `${p.x},${p.y}` }).join(' ')} vectorEffect="non-scaling-stroke" />
                  </svg>
                  {live.map((i) => {
                    const p = pt(i)
                    const c = u.cells[i]
                    return (
                      <span key={'m' + i} className={'jm-mood' + (c.emotion === low && low < 0 ? ' is-low' : c.emotion > 0 ? ' is-high' : '')} style={{ left: `${p.x}%`, top: `${p.y}px`, '--r': i + 1 }}>
                        <i />{c.mood}
                      </span>
                    )
                  })}
                  {u.cells.map((c, i) => (
                    <p key={i} className={'jm-pain' + (c && c.emotion === low && low < 0 ? ' is-low' : '')} data-stage={stages[i]} style={{ '--r': i + 1 }}>{c ? c.pain : ''}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </figure>
  )
}

// Information architecture: one column per product, nested pages beneath.
export function Tree({ title, roots }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-tree" style={{ gridTemplateColumns: `repeat(${roots.length}, minmax(0, 1fr))` }}>
        {roots.map((r) => (
          <div className="ig-tree-col" key={r.t}>
            <div className="ig-tree-root">{r.t}{r.d && <span>{r.d}</span>}</div>
            <TreeList nodes={r.children} />
          </div>
        ))}
      </div>
    </figure>
  )
}

function TreeList({ nodes }) {
  if (!nodes?.length) return null
  return (
    <ul className="ig-tree-list">
      {nodes.map((nd) => {
        const node = typeof nd === 'string' ? { t: nd } : nd
        return (
          <li key={node.t}>
            <span className="ig-tree-node">{node.t}</span>
            <TreeList nodes={node.children} />
          </li>
        )
      })}
    </ul>
  )
}

// Framework A vs B: each option as a labelled flow of boxes, with a bracket
// underneath naming the phases. The chosen one is highlighted.
export function Frameworks({ title, items, why, tradeoff }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-fw">
        {items.map((f) => (
          <div className={'ig-fw-item' + (f.chosen ? ' is-chosen' : '')} key={f.label}>
            <span className="ig-fw-pill">{f.label}</span>
            <div className="ig-fw-flow">
              {f.steps.map((st, i) => {
                const step = typeof st === 'string' ? { t: st } : st
                return [
                  i > 0 && <span className="ig-fw-arrow" key={'a' + i} aria-hidden="true">→</span>,
                  <div className={'ig-fw-box' + (step.hl ? ' is-hl' : '')} key={step.t}>
                    {step.t}
                    {step.d && <span>{step.d}</span>}
                  </div>,
                ]
              })}
            </div>
            {f.note && <p className="ig-fw-note">{f.note}</p>}
          </div>
        ))}
      </div>
      {(why || tradeoff) && (
        <dl className="ig-decision-foot ig-fw-foot">
          {why && <div><dt>Why</dt><dd>{why}</dd></div>}
          {tradeoff && <div><dt>Trade-off</dt><dd>{tradeoff}</dd></div>}
        </dl>
      )}
    </figure>
  )
}

// Lo-fi wireframe grid, grouped by product. `v` picks a skeleton layout.
export function Wireframes({ title, groups }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-wf-panel">
        {groups.map((g) => (
          <div className="ig-wf-group" key={g.h}>
            <h3>{g.h}</h3>
            <div className={'ig-wf-grid' + (g.wide ? ' is-wide' : '')}>
              {g.items.map((it) => (
                <div className="ig-wf-item" key={it.t}>
                  <strong>{it.t}</strong>
                  {it.d && <span>{it.d}</span>}
                  <div className={'ig-wf-frame' + (g.wide ? ' is-wide' : '')} aria-hidden="true">
                    <Skeleton v={it.v} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

function Skeleton({ v }) {
  const bar = (w, k, cls = '') => <i key={k} className={'sk ' + cls} style={{ width: w }} />
  if (v === 'board') {
    return (
      <div className="sk-cols">
        {[3, 2, 1].map((n, c) => (
          <div key={c} className="sk-col">{bar('60%', 'h', 'sk-h')}{Array.from({ length: n }, (_, i) => <i key={i} className="sk sk-card" />)}</div>
        ))}
      </div>
    )
  }
  if (v === 'grid') {
    return <>{bar('50%', 'h', 'sk-h')}<div className="sk-tiles">{Array.from({ length: 6 }, (_, i) => <i key={i} className={'sk sk-tile' + (i === 1 ? ' is-acc' : '')} />)}</div></>
  }
  if (v === 'stats') {
    return <>{bar('45%', 'h', 'sk-h')}<div className="sk-tiles sk-tiles-3">{[0, 1, 2].map((i) => <i key={i} className="sk sk-tile" />)}</div><i className="sk sk-chart" /></>
  }
  if (v === 'table') {
    return <>{bar('40%', 'h', 'sk-h')}{Array.from({ length: 6 }, (_, i) => <div key={i} className="sk-row">{bar('20%', 'a')}{bar('40%', 'b')}{bar('15%', 'c')}</div>)}</>
  }
  if (v === 'detail') {
    return <><i className="sk sk-img" />{bar('70%', 'h', 'sk-h')}{bar('90%', 'a')}{bar('60%', 'b')}<div className="sk-chips">{bar('28%', 'c', 'sk-chip')}{bar('28%', 'd', 'sk-chip is-acc')}</div><i className="sk sk-btn" /></>
  }
  if (v === 'status') {
    return <>{bar('60%', 'h', 'sk-h')}{[1, 1, 0, 0].map((d, i) => <div key={i} className="sk-step">{<i className={'sk-dot' + (d ? ' is-acc' : '')} />}{bar('55%', 'x')}</div>)}<i className="sk sk-btn" /></>
  }
  if (v === 'meter') {
    return <>{bar('55%', 'h', 'sk-h')}<i className="sk sk-alert" /><i className="sk sk-meter" />{[0, 1, 2].map((i) => <div key={i} className="sk-row">{<i className="sk sk-thumb" />}{bar('50%', 'x')}</div>)}<i className="sk sk-btn" /></>
  }
  if (v === 'stops') {
    return <>{bar('50%', 'h', 'sk-h')}{[0, 1, 2, 3].map((i) => <div key={i} className={'sk-stop' + (i === 0 ? ' is-acc' : '')}>{bar('60%', 'x')}{bar('35%', 'y')}</div>)}</>
  }
  if (v === 'proof') {
    return <>{bar('55%', 'h', 'sk-h')}<i className="sk sk-img sk-img-tall" />{bar('70%', 'a')}<i className="sk sk-btn sk-btn-big" /></>
  }
  if (v === 'form') {
    return <>{bar('50%', 'h', 'sk-h')}{[0, 1, 2].map((i) => <i key={i} className="sk sk-field" />)}<i className="sk sk-btn" /></>
  }
  // 'list' (default): menu / item list
  return (
    <>
      {bar('50%', 'h', 'sk-h')}
      <div className="sk-chips">{bar('22%', 'c1', 'sk-chip is-acc')}{bar('22%', 'c2', 'sk-chip')}{bar('22%', 'c3', 'sk-chip')}</div>
      {[0, 1, 2, 3].map((i) => <div key={i} className="sk-row"><i className="sk sk-thumb" />{bar('50%', 'x')}</div>)}
      <i className="sk sk-btn" />
    </>
  )
}

// Component spec sheet: anatomy with numbered callouts, then every state.
export function Spec({ title, variant }) {
  const S = SPECS[variant]
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <div className="ig-spec">
        <div className="ig-spec-block">
          <span className="ig-spec-pill">Anatomy</span>
          <div className="ig-spec-anatomy">
            <div className="ig-spec-sample">{S.anatomy}</div>
            <ol className="ig-spec-callouts">
              {S.callouts.map((c, i) => <li key={c}><span>{i + 1}</span>{c}</li>)}
            </ol>
          </div>
        </div>
        <div className="ig-spec-block">
          <span className="ig-spec-pill">States</span>
          <div className="ig-spec-states">
            {S.states.map(([label, node]) => (
              <div className="ig-spec-state" key={label}>
                <span className="ig-spec-state-h">{label}</span>
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

function Ticket({ table = 'T7', src = 'QR', items = '2 items · 3 min ago', state = 'new', n }) {
  return (
    <div className={'sp-ticket is-' + state}>
      <div className="sp-ticket-top">
        <b>{table}{n && <em className="sp-num">1</em>}</b>
        <span className={'mk-src src-' + src.toLowerCase()}>{src}{n && <em className="sp-num">2</em>}</span>
      </div>
      <span className="sp-ticket-items">{items}{n && <em className="sp-num">3</em>}</span>
      <span className="sp-ticket-act">
        {{ new: 'Accept', accepted: 'Start preparing', preparing: 'Mark ready', ready: 'Served' }[state]}
        {n && <em className="sp-num">4</em>}
      </span>
    </div>
  )
}

function Meter({ left = 12.5, of = 15, over, n }) {
  const pct = Math.max(0, Math.min(100, (left / of) * 100))
  return (
    <div className={'sp-meter' + (over ? ' is-over' : left / of < 0.25 ? ' is-low' : '')}>
      <span className="sp-meter-h">
        {over ? <b>${over.toFixed(2)} over</b> : <b>${left.toFixed(2)}</b>}
        {!over && <> of ${of} left</>}
        {n && <em className="sp-num">1</em>}
      </span>
      <span className="sp-meter-track"><span style={{ width: over ? '100%' : `${pct}%` }} />{n && <em className="sp-num">2</em>}</span>
      <span className="sp-meter-note">{over ? 'You’ll pay the difference at checkout' : 'Covered items are tagged on the menu'}{n && <em className="sp-num">3</em>}</span>
    </div>
  )
}

const SPECS = {
  ticket: {
    anatomy: <Ticket n />,
    callouts: ['Table or order number, set by the QR', 'Source tag: QR or POS', 'Item count and time since ordered', 'One primary action for the next step'],
    states: [
      ['New', <Ticket key="n" state="new" />],
      ['Accepted', <Ticket key="a" state="accepted" items="2 items · 4 min" />],
      ['Preparing', <Ticket key="p" state="preparing" src="POS" table="T3" items="4 items · 8 min" />],
      ['Ready', <Ticket key="r" state="ready" table="Takeaway 12" items="1 item · 11 min" />],
    ],
  },
  allowance: {
    anatomy: <Meter n />,
    callouts: ['Remaining allowance, in plain money', 'Progress bar, always on the menu', 'What happens next, in one line'],
    states: [
      ['Within allowance', <Meter key="w" left={12.5} />],
      ['Nearly used', <Meter key="l" left={2.5} />],
      ['Over allowance', <Meter key="o" over={2} />],
    ],
  },
}

// Centred closing lists: success, impact, takeaways.
export function Closing({ groups }) {
  return (
    <div className="ig-closing">
      {groups.map((g) => (
        <div className="ig-closing-group" key={g.h}>
          <h3>{g.h}</h3>
          <ul>{g.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Blocks inspired by Cofolios case studies: How-might-we + success signals
// (Verli Chen, Google), design details explored → chosen (Michelle Gore,
// Airbnb), achievements strip (Sangeetha, Quicko), and a phased roadmap.
// ---------------------------------------------------------------------------

// The framing question, then the measurable signals that would prove it.
export function HMW({ q, signals }) {
  return (
    <div className="ig-hmw">
      <span className="ig-kicker">How might we</span>
      <p className="ig-hmw-q">{q}</p>
      {signals && (
        <div className="ig-hmw-signals">
          <span className="ig-hmw-label">We’ll know it works when</span>
          <ol>
            {signals.map((s, i) => (
              <li key={i}><span className="ig-flow-num">{String(i + 1).padStart(2, '0')}</span>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// One row per component: a small visual, what was explored, and what shipped.
export function Details({ items }) {
  return (
    <div className="ig-details">
      {items.map((it, i) => {
        const V = MINIS[it.visual]
        return (
          <div className="ig-detail" key={it.t}>
            <div className="ig-detail-visual" aria-hidden="true">{V && <V />}</div>
            <div className="ig-detail-text">
              <span className="ig-kicker">Design detail {String(i + 1).padStart(2, '0')}</span>
              <h3>{it.t}</h3>
              <ul className="ig-detail-explored">
                {it.explored.map((e) => <li key={e}>{e}</li>)}
              </ul>
              <p className="ig-detail-chose"><b>Chose:</b> {it.chose}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Three short statements with a mark, as a closing strip.
export function Achievements({ title, items }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <ul className="ig-achieve">
        {items.map((it) => <li key={it}><span aria-hidden="true">✦</span>{it}</li>)}
      </ul>
    </figure>
  )
}

// Now / Next / Later, with the live phase highlighted.
export function Roadmap({ title, phases }) {
  return (
    <figure className="ig-figure">
      {title && <figcaption className="ig-title">{title}</figcaption>}
      <ol className="ig-roadmap">
        {phases.map((p) => (
          <li key={p.h} className={p.live ? 'is-live' : undefined}>
            <span className="ig-roadmap-h">{p.h}<em>{p.status}</em></span>
            <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </li>
        ))}
      </ol>
    </figure>
  )
}

// Small component illustrations for the design-detail rows.
function MiniQr() {
  return (
    <div className="mn-row">
      <div className="mn-qr">{Array.from({ length: 25 }, (_, i) => <i key={i} className={[0, 1, 3, 5, 6, 8, 12, 14, 16, 18, 19, 21, 23, 24].includes(i) ? 'on' : ''} />)}</div>
      <span className="mn-arrow">→</span>
      <span className="mn-pill is-acc">Table 7 · set automatically</span>
    </div>
  )
}
function MiniEdit() {
  return (
    <div className="mn-timeline">
      <div className="mn-tl-bar"><span className="mn-tl-open">Editable</span><span className="mn-tl-locked">Locked</span></div>
      <div className="mn-tl-labels"><span>Sent</span><span>Accepted by staff</span><span>Served</span></div>
    </div>
  )
}
function MiniSource() {
  return (
    <div className="mn-stack">
      <div className="mn-ticket"><b>T7</b><span className="mk-src src-qr">QR</span></div>
      <div className="mn-ticket"><b>T3</b><span className="mk-src src-pos">POS</span></div>
    </div>
  )
}
function MiniCountdown() {
  return (
    <div className="mn-stack">
      <span className="mn-pill is-warn">Ordering closes in <b>42 min</b></span>
      <span className="mn-pill">🔔 Reminder 30 min before cut-off</span>
    </div>
  )
}
function MiniCovered() {
  return (
    <div className="mn-stack">
      <div className="mn-item"><span>Chicken grain bowl</span><em className="mn-tag is-ok">Covered</em></div>
      <div className="mn-item"><span>Seasonal salad</span><em className="mn-tag is-over">+$2.00 over</em></div>
    </div>
  )
}
function MiniProof() {
  return (
    <div className="mn-stack">
      <span className="mn-btn">✓ Tap to confirm</span>
      <span className="mn-btn is-ghost">📷 Add photo</span>
    </div>
  )
}
const MINIS = { qr: MiniQr, edit: MiniEdit, source: MiniSource, countdown: MiniCountdown, covered: MiniCovered, proof: MiniProof }
