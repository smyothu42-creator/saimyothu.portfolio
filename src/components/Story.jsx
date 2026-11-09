import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Person } from './Illos'
import { Icon } from './ui'
import { scrollToY } from '../scroll'

// Blocks for the "story" case-study layout: impact band, product film, role,
// background panels, research and an animated design walkthrough. Screens are
// drawn from small data descriptions (see Screen below), so a flow can be
// edited from data.js without touching this file.

// Start an effect only once the element has scrolled into view.
function useInView(ref, margin = '0px 0px -15% 0px') {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return seen
}

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Cycle 0…n-1 every `ms` while `on`; stays at 0 for reduced motion.
function useTicker(n, ms, on) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!on || prefersReduced()) return
    const id = setInterval(() => setI((x) => (x + 1) % n), ms)
    return () => clearInterval(id)
  }, [n, ms, on])
  return i
}

// ---------------------------------------------------------------------------
// Impact: the headline result in a sentence, then the key numbers.
const STORE_MARKS = {
  play: (
    <>
      <path fill="#00A0FF" d="M3.6 2.3 13.3 12l-9.7 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" />
      <path fill="#00E676" d="M3.6 2.3c.4-.1 1 0 1.6.3L16.3 9l-3 3z" />
      <path fill="#FF3D00" d="M3.6 21.7c.4.1 1 0 1.6-.3L16.3 15l-3-3z" />
      <path fill="#FFC107" d="m16.3 9 3.7 2.1c.9.5.9 1.3 0 1.8L16.3 15l-3-3z" />
    </>
  ),
  apple: <path fill="#fff" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />,
}

export function Impact({ headline, items, links, fit }) {
  const stats = (
    <div className={'cs-stats' + (fit ? ' is-fit' : '')}>
      {items.map((it, i) => (
        <Fragment key={it.label}>
          {fit && i > 0 && <i className="cs-stat-div" aria-hidden="true" />}
          <div><span className="cs-stat-num">{it.num}</span><span>{it.label}</span></div>
        </Fragment>
      ))}
    </div>
  )
  return (
    <>
      {headline && <p className="cs-lead">{headline}</p>}
      {/* with links (e.g. the app stores): the numbers on the left, the buttons on the right */}
      {links?.length > 0 ? (
        <div className="cs-stat-row">
          {stats}
          <div className="cs-stat-links">
            {links.map((l) => (
              <a key={l.href} className="cs-store" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.over} ${l.label} (opens in a new tab)`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{STORE_MARKS[l.store]}</svg>
                <span><small>{l.over}</small><b>{l.label}</b></span>
              </a>
            ))}
          </div>
        </div>
      ) : stats}
    </>
  )
}

// ---------------------------------------------------------------------------
// Role: Execution / Collaboration / Research, each with a few bullets.
export function Role({ items }) {
  return (
    <div className="st-role">
      {items.map((it) => (
        <div key={it.h}>
          <h3 className="st-sub-h">{it.h}</h3>
          <ul>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

// Accent sub-heading with a paragraph or bullets, used inside panels.
export function Sub({ h, p, items, strong }) {
  return (
    <div className="st-subblock">
      <h3 className="st-sub-h">{h}</h3>
      {p && <p>{p}</p>}
      {items && <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>}
      {strong && <p className="st-strong">{strong}</p>}
    </div>
  )
}

// Problem spaces as plain term / explanation rows.
// Small object illustrations (no people) for list rows, drawn like the site's
// Open Doodles: black ink outlines, flat fills from the same palette, and the
// white sticker edge around the whole shape (each drawing is laid twice: a
// thick white copy underneath, then the coloured one).
const SPOTS = {
  // a wallet, and what's in it is a question
  wallet: <><path d="M10 14.5 30 8q3.2-1 4.2 2.2l1.4 4.3" fill="#F7D9BF" /><rect x="7" y="14" width="34" height="24" rx="5" fill="#E8A17A" /><rect x="29" y="21" width="12" height="9" rx="3" fill="#FBF3E4" /><circle cx="33.5" cy="25.5" r="1.4" fill="#1b1b1b" stroke="none" /><circle cx="38" cy="10" r="6.5" fill="#9CC1EE" /><path d="M35.8 8.6q.3-2.3 2.4-2.2 2.2.2 2 2.3-.2 1.4-1.9 1.9-.3.1-.3 1.4" fill="none" /><path d="M38 13.6v.1" /></>,
  // an alarm clock
  clock: <><circle cx="13.5" cy="12" r="5.5" fill="#F2C14E" /><circle cx="34.5" cy="12" r="5.5" fill="#F2C14E" /><path d="M13.5 39.5 10 44M34.5 39.5 38 44" /><circle cx="24" cy="27" r="14.5" fill="#F2C14E" /><circle cx="24" cy="27" r="10.5" fill="#FBF3E4" /><path d="M24 27v-7.5M24 27l5.5 3.2" /><path d="M24 7.5v4" /></>,
  // a delivery box with a question on its side
  box: <><path d="M8 18 24 11l16 7-16 7z" fill="#F2CF9C" /><path d="M8 18l16 7v17L8 35z" fill="#E6B980" /><path d="M40 18 24 25v17l16-7z" fill="#D29B5E" /><path d="M16 14.5 32 21.5" /><path d="M13.6 26.4q.4-2.4 2.7-1.9 2.2.6 1.6 2.7-.4 1.3-2 1.5-.4.1-.6 1.4" fill="none" /><path d="M15.2 33.4v.1" /></>,
  // a card, and a charge nobody expected
  // a little shop with a striped awning
  store: <><path d="M9 21h30v19H9z" fill="#FBF3E4" /><path d="M7 12h34l-2 9H9z" fill="#E8A17A" /><path d="M14.5 12l-1.2 9M22 12v9M26 12v9M33.5 12l1.2 9" /><path d="M20 40V29h8v11" fill="#9CC1EE" /><path d="M7 21q4 4 8 0 4 4 8 0 4 4 8 0 4 4 8 0" fill="none" /></>,
  // a folded map with a pin
  map: <><path d="M6 12l11-4 14 4 11-4v28l-11 4-14-4-11 4z" fill="#BFE3C9" /><path d="M17 8v28M31 12v28" /><path d="M30 6.5q-5.5 0-5.5 5.5 0 4 5.5 10 5.5-6 5.5-10 0-5.5-5.5-5.5z" fill="#E76F51" /><circle cx="30" cy="12" r="2" fill="#FBF3E4" /></>,
  // a target with an arrow in the bullseye
  target: <><circle cx="22" cy="26" r="15" fill="#FBF3E4" /><circle cx="22" cy="26" r="10" fill="#E76F51" /><circle cx="22" cy="26" r="5" fill="#FBF3E4" /><path d="M22 26 38 10" /><path d="M35 7l1 4 4 1-3 3-4-1-1-4z" fill="#F2C14E" /></>,
  // two speech bubbles
  chat: <><path d="M6 10h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H6a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="#9CC1EE" /><path d="M36 20h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2v5l-6-5h-9a3 3 0 0 1-3-3v-2" fill="#F2C14E" /><path d="M10 17h16M10 22h10" /></>,
  // a lightbulb
  bulb: <><path d="M24 6a12 12 0 0 0-7 21.8c1.4 1 2 2.6 2 4.2v1h10v-1c0-1.6.6-3.2 2-4.2A12 12 0 0 0 24 6z" fill="#F2C14E" /><path d="M19 33h10v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="#9CC1EE" /><path d="M20.5 22l3.5 3 3.5-3M24 25v8" /><path d="M5 18h3M40 18h3M9.5 6.5l2 2M38.5 6.5l-2 2" /></>,
  // a winding route between two stops
  route: <><path className="nf" d="M12 38c0-8 24-4 24-14S12 18 12 10" fill="none" strokeDasharray="3 4" /><circle cx="12" cy="10" r="5" fill="#9CC1EE" /><path d="M36 24q-5.5 0-5.5 5.5 0 4 5.5 10 5.5-6 5.5-10 0-5.5-5.5-5.5z" fill="#E76F51" transform="translate(0 -10)" /><circle cx="36" cy="19.5" r="2" fill="#FBF3E4" /><path d="M8 38h8" /></>,
  // OrderFlow's products and modules
  qr: <><rect x="13" y="4" width="22" height="40" rx="5" fill="#9CC1EE" /><rect x="16.5" y="10" width="15" height="24" rx="1.5" fill="#FBF3E4" /><path d="M19.5 13h4v4h-4zM24.5 13h4v4h-4zM19.5 23h4v4h-4z" fill="#1b1b1b" stroke="none" /><path d="M25 23.5h3M26.5 26.5h2M25 29h1.5M20 30h3" /><path d="M21 39h6" /></>,
  pos: <><path d="M11 5h26v36l-4.3-2.6-4.4 2.6-4.3-2.6-4.4 2.6-4.3-2.6L11 41z" fill="#FBF3E4" /><path d="M16 12h16M16 18h16M16 24h10" /><path d="M16 31h7M27 31h5" stroke="#E76F51" /></>,
  ai: <><path d="M24 7v6" /><circle cx="24" cy="6" r="2.6" fill="#F2C14E" /><rect x="9" y="13" width="30" height="24" rx="7" fill="#9CC1EE" /><path d="M9 22H5.5v8H9M39 22h3.5v8H39" /><circle cx="18" cy="24" r="3" fill="#1b1b1b" stroke="none" /><circle cx="30" cy="24" r="3" fill="#1b1b1b" stroke="none" /><path d="M19 31q5 3 10 0" /></>,
  loyalty: <><rect x="9" y="21" width="30" height="20" rx="2" fill="#E76F51" /><rect x="7" y="14" width="34" height="8" rx="2" fill="#F2C14E" /><path d="M24 14v27" strokeWidth="5" stroke="#F2C14E" /><path d="M24 14v27" /><path d="M24 14q-9-10-11-2 0 3 11 2zM24 14q9-10 11-2 0 3-11 2z" fill="#F2C14E" /></>,
  inventory: <><path d="M8 18 24 11l16 7-16 7z" fill="#F2CF9C" /><path d="M8 18l16 7v17L8 35z" fill="#E6B980" /><path d="M40 18 24 25v17l16-7z" fill="#D29B5E" /><path d="M16 14.5 32 21.5M12.5 31.5l5 2.3" /></>,
  menu: <><path d="M24 11Q15 6 6 9v29q9-3 18 2 9-5 18-2V9q-9-3-18 2z" fill="#FBF3E4" /><path d="M24 11v29" /><path d="M10.5 16h9M10.5 21h9M10.5 26h6M28.5 16h9M28.5 21h9M28.5 26h6" /></>,
  tables: <><ellipse cx="24" cy="22" rx="17" ry="6" fill="#E8A17A" /><path d="M10 25v15M38 25v15M24 28v13" /><ellipse cx="24" cy="20.5" rx="6" ry="2.2" fill="#FBF3E4" /></>,
  slips: <><path d="M14 4h20v14H14z" fill="#FBF3E4" /><path d="M18 9h12M18 13h8" /><rect x="6" y="16" width="36" height="17" rx="4" fill="#9CC1EE" /><path d="M13 29h22v14H13z" fill="#FBF3E4" /><path d="M17 34h14M17 38h9" /><circle cx="35" cy="22" r="1.6" fill="#E76F51" stroke="none" /></>,
  staff: <><rect x="10" y="10" width="28" height="33" rx="4" fill="#F2C14E" /><rect x="19" y="5" width="10" height="8" rx="2" fill="#9CC1EE" /><path d="M24 19l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="#FBF3E4" /><path d="M16 38h16" /></>,
  reports: <><path d="M7 41h34" /><rect x="10" y="26" width="7" height="15" rx="1" fill="#9CC1EE" /><rect x="20.5" y="17" width="7" height="24" rx="1" fill="#F2C14E" /><rect x="31" y="9" width="7" height="32" rx="1" fill="#E76F51" /></>,
  alerts: <><path d="M24 7a11 11 0 0 0-11 11v9l-4 6h30l-4-6v-9A11 11 0 0 0 24 7z" fill="#F2C14E" /><path d="M20 37a4 4 0 0 0 8 0" fill="#FBF3E4" /><path d="M24 4v3" /><path d="M5 14q1.5-4 5-6.5M43 14q-1.5-4-5-6.5" /></>,
  // OrderFlow's test, feedback, improve loop
  clipboard: <><rect x="9" y="8" width="30" height="35" rx="4" fill="#E8A17A" /><rect x="13" y="13" width="22" height="26" rx="1.5" fill="#FBF3E4" /><rect x="18" y="5" width="12" height="7" rx="2" fill="#9CC1EE" /><path d="M17 21l2.5 2.5L24 19M17 30l2.5 2.5L24 28M27 21.5h5M27 30.5h5" /></>,
  chartup: <><rect x="6" y="8" width="36" height="32" rx="4" fill="#BFE3C9" /><path d="M11 33l8-8 6 5 11-12" /><path d="M30 17.5h6.5V24" /><path d="M11 13.5h9" /></>,
  // MTB Pay Merchant's design system
  // one result screen: a big check
  done: <><rect x="9" y="5" width="30" height="38" rx="5" fill="#FBF3E4" /><circle cx="24" cy="19" r="8" fill="#BFE3C9" /><path d="M20.3 19l2.6 2.6 4.8-5" /><path d="M16 31h16M19 36h10" /></>,
  // a sheet over the screen, for one question
  sheet: <><rect x="11" y="4" width="26" height="40" rx="5" fill="#9CC1EE" /><path d="M11 24h26v15a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5z" fill="#FBF3E4" /><path d="M21 28h6M16 34h16" /><path d="M16 11h10" /></>,
  // one main button, and a tap on it
  button: <><rect x="4" y="15" width="40" height="14" rx="5" fill="#E76F51" /><path d="M16 22h16" stroke="#fff" /><circle cx="33" cy="34" r="6" fill="#F2C14E" /><path d="M33 26v2M26 34h-2M38.5 28.5l-1.4 1.4" /></>,
  // four service tiles
  tiles: <><rect x="6" y="6" width="16" height="16" rx="4" fill="#E76F51" /><rect x="26" y="6" width="16" height="16" rx="4" fill="#E76F51" /><rect x="6" y="26" width="16" height="16" rx="4" fill="#E76F51" /><rect x="26" y="26" width="16" height="16" rx="4" fill="#F2C14E" /><path d="M11 14h6M31 11v6M34 14h-6M14 31v6M11 34h6M31 31l6 6M37 31l-6 6" stroke="#fff" /></>,
  // MTB Pay Merchant's visual direction
  // a paint palette: MTB red, money-in green, white
  palette: <><path d="M24 6C13 6 5 13.5 5 23s8 17 17 17c3 0 4-2 3-4.5s0-4.5 3-4.5h5c5.5 0 10-3.5 10-9C43 13 34.5 6 24 6z" fill="#FBF3E4" /><circle cx="15" cy="20" r="3.4" fill="#E76F51" /><circle cx="23" cy="14" r="3.4" fill="#BFE3C9" /><circle cx="32" cy="16" r="3.4" fill="#F2C14E" /><circle cx="35" cy="25" r="3.4" fill="#9CC1EE" /></>,
  // a type specimen card: Aa
  type: <><rect x="5" y="8" width="38" height="32" rx="4" fill="#9CC1EE" /><path d="M11 33l7-18 7 18M13.6 27h8.8" /><circle cx="32" cy="28.5" r="4.5" fill="#FBF3E4" /><path d="M36.5 23.5V33" /></>,
  // layers, the most important on top
  layers: <><path d="M24 26 6 33l18 7 18-7z" fill="#9CC1EE" /><path d="M24 18 6 25l18 7 18-7z" fill="#F2C14E" /><path d="M24 8 6 15l18 7 18-7z" fill="#E76F51" /></>,
  // MTB Pay Merchant's UX challenges
  // an hourglass, for slow payments
  hourglass: <><path d="M15 8h18v5q0 6.5-6.5 11 6.5 4.5 6.5 11v5H15v-5q0-6.5 6.5-11Q15 19.5 15 13z" fill="#9CC1EE" /><path d="M18.5 12.5h11q-1 4.5-5.5 8-4.5-3.5-5.5-8z" fill="#F2C14E" /><path d="M17.5 39.5q1-5.5 6.5-7.5 5.5 2 6.5 7.5z" fill="#F2C14E" /><rect x="11" y="4.5" width="26" height="4.5" rx="1.5" fill="#E8A17A" /><rect x="11" y="39" width="26" height="4.5" rx="1.5" fill="#E8A17A" /></>,
  // a receipt that went wrong
  receipt: <><path d="M10 5h24v36l-4-2.4-4 2.4-4-2.4-4 2.4-4-2.4-4 2.4z" fill="#FBF3E4" /><path d="M15 12h14M15 18h14M15 24h9" /><circle cx="35.5" cy="34.5" r="7.5" fill="#E76F51" /><path d="M33 32l5 5M38 32l-5 5" stroke="#fff" /></>,
  // money, and where it went is a question
  money: <><rect x="5" y="17" width="32" height="20" rx="3" fill="#BFE3C9" /><circle cx="21" cy="27" r="5" fill="#FBF3E4" /><path d="M9.5 22v.1M32.5 32v.1" /><circle cx="38" cy="13" r="6.5" fill="#F2C14E" /><path d="M35.8 11.6q.3-2.3 2.4-2.2 2.2.2 2 2.3-.2 1.4-1.9 1.9-.3.1-.3 1.4" fill="none" /><path d="M38 16.6v.1" /></>,
  // a phone, new and shiny
  phone: <><rect x="12" y="6" width="21" height="37" rx="4.5" fill="#9CC1EE" /><rect x="15.5" y="11" width="14" height="24" rx="1.5" fill="#FBF3E4" /><path d="M20 39.5h5" /><circle cx="22.5" cy="23" r="3.2" fill="#E76F51" /><path d="M40 5l1.7 4.3L46 11l-4.3 1.7L40 17l-1.7-4.3L34 11l4.3-1.7z" fill="#F2C14E" /></>,
  card: <><rect x="6" y="12" width="32" height="22" rx="4" fill="#9CC1EE" /><path d="M6 18.5h32" strokeWidth="4" /><rect x="11" y="25" width="8" height="5.5" rx="1.2" fill="#F2C14E" /><circle cx="36.5" cy="34" r="7.5" fill="#E76F51" /><path d="M36.5 30.2v4.4M36.5 37.6v.1" stroke="#fff" /></>,
}
export function IconList({ items }) {
  const spots = items.some((it) => it.spot)
  return (
    <dl className={'cs-notes' + (spots ? ' has-spots' : '')}>
      {items.map((it) => (
        <div key={it.h}>
          <dt>{it.spot && SPOTS[it.spot] && <span className="cs-spot" aria-hidden="true"><svg viewBox="0 0 48 48"><g className="cs-spot-edge">{SPOTS[it.spot]}</g><g>{SPOTS[it.spot]}</g></svg></span>}{it.h}</dt>
          <dd>{it.p}</dd>
        </div>
      ))}
    </dl>
  )
}

// Target user segments: a column each, with traits, under an optional bust
// (`illo`, see Illos.jsx).
export function Segments({ items }) {
  return (
    <div className="st-segments">
      {items.map((it) => (
        <div className="st-segment" key={it.h}>
          {it.illo && <Person name={it.illo} />}
          <h3 className="st-sub-h">{it.h}</h3>
          {it.sub && <p className="st-muted">{it.sub}</p>}
          <ul>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

// Plain comparison table (secondary research).
export function Table({ cols, rows }) {
  return (
    <div className="st-table-wrap">
      <table className="st-table">
        <thead><tr>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
      </table>
    </div>
  )
}

// A real work screenshot (FigJam board, Figma file). Opens full size in a
// new tab, since boards carry small text. `crop` ('top' / 'bottom') with
// `ratio` (width / height of the visible part) shows one half of a tall board.
export function Shot({ src, alt, crop, ratio }) {
  return (
    <a className="st-shot" href={src} target="_blank" rel="noopener noreferrer" aria-label={`${alt} (opens full size)`}>
      <img src={src} alt={alt} loading="lazy" style={crop ? { aspectRatio: ratio, objectFit: 'cover', objectPosition: crop } : undefined} />
      <span className="st-shot-hint" aria-hidden="true">View full size ↗</span>
    </a>
  )
}

// Before / after: drag the handle (or use the arrow keys) to wipe between two
// screens of the same size. The range input carries the keyboard and screen
// reader support; the handle on top is only what you see.
// `frame` puts the slider in a device on a pale stage, with BEFORE / AFTER at
// the stage's corners.
export function BeforeAfter({ before, after, alt, ratio = '1920 / 992', frame = false, beforeLabel = 'Before', afterLabel = 'After' }) {
  const [pos, setPos] = useState(50)
  const [touched, setTouched] = useState(false)
  const root = useRef(null)
  const drag = useRef(false)
  const seen = useInView(root)
  // Once in view, nudge the divider left and right so it reads as draggable.
  useEffect(() => {
    if (!seen || touched || prefersReduced()) return
    const keys = [[0, 50], [450, 36], [1050, 64], [1600, 50]]
    const timers = keys.map(([t, p]) => setTimeout(() => setPos(p), 400 + t))
    return () => timers.forEach(clearTimeout)
  }, [seen, touched])
  const move = (e) => {
    const r = root.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  const slider = (
    <div
      className={'st-ba' + (touched ? ' is-touched' : '') + (seen && !touched ? ' is-nudging' : '')}
      ref={root}
      style={{ aspectRatio: ratio, '--pos': `${pos}%` }}
      onPointerDown={(e) => { setTouched(true); drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e) }}
      onPointerMove={(e) => { if (drag.current) move(e) }}
      onPointerUp={() => { drag.current = false }}
      onPointerCancel={() => { drag.current = false }}
    >
      <img src={after} alt={`After: ${alt}`} loading="lazy" draggable="false" />
      <img className="st-ba-before" src={before} alt={`Before: ${alt}`} loading="lazy" draggable="false" />
      <span className={'st-ba-tag is-before' + (pos < 14 ? ' is-off' : '')} aria-hidden="true">Before</span>
      <span className={'st-ba-tag is-after' + (pos > 86 ? ' is-off' : '')} aria-hidden="true">After</span>
      <span className="st-ba-line" aria-hidden="true"><span className="st-ba-knob"><Icon name="arrowRight" size={16} stroke={2} /><Icon name="arrowRight" size={16} stroke={2} /><span className="st-ba-hint">Drag</span></span></span>
      <input className="st-ba-range" type="range" min="0" max="100" value={Math.round(pos)} aria-label="Compare before and after" onChange={(e) => { setTouched(true); setPos(+e.target.value) }} />
    </div>
  )
  if (!frame) return slider
  return (
    <div className="st-ba-stage">
      <span className="st-ba-stag is-before" aria-hidden="true">{beforeLabel}</span>
      <span className="st-ba-stag is-after" aria-hidden="true">{afterLabel}</span>
      <div className="st-ba-device">{slider}</div>
    </div>
  )
}
// The framed comparison (data kind `compare`).
export const Compare2 = (props) => <BeforeAfter frame {...props} />

// Problem → what we changed, one row per iteration.
export function Iterations({ items }) {
  return <Table cols={['What we saw', 'What we changed']} rows={items.map((it) => [it.problem, it.change])} />
}

// Pills for the walkthrough flows (as in the panel intro).
export function Pills({ items, active = [] }) {
  return (
    <div className="st-pills">
      {items.map((p) => <span key={p} className={'st-pill' + (active.includes(p) ? ' is-on' : '')}>{p}</span>)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Design walkthrough for one flow: title, objective, then its screens. The
// screens fade in one after another when the flow scrolls into view, then the
// caption under each screen is picked out in turn, like a slow click-through.
export function Walkthrough({ flows, current, title, objective, screens, note }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const step = useTicker(screens.length, 1800, seen)
  return (
    <div className={'st-walk' + (seen ? ' is-in' : '')} ref={ref}>
      {title && (
        <div className="st-walk-head">
          <h3 className="st-walk-title">
            {title}
            {flows && <span className="st-walk-count">{flows.indexOf(current) + 1} of {flows.length}</span>}
          </h3>
          {objective && <p className="st-walk-obj">{objective}</p>}
        </div>
      )}
      <div className={'st-screens' + (screens.some((s) => s.window) ? ' has-window' : '')}>
        {screens.map((sc, i) => (
          <figure key={sc.label} className={'st-screen' + (i === step ? ' is-active' : '') + (sc.window ? ' is-window' : '')} style={{ '--i': i }}>
            {sc.window ? <Window {...sc} /> : <Screen {...sc} />}
            <figcaption>{i + 1}. {sc.label}</figcaption>
          </figure>
        ))}
      </div>
      {note && <p className="st-walk-note">{note}</p>}
    </div>
  )
}

// Tab switch shared by the tabbed blocks: the selected item's one-line `lead`,
// then a segmented control, then `render(item)` below. Arrow keys move
// between tabs (and are kept from the deck, so the slide doesn't change).
// Inside a stepped deck slide (see Deck.jsx) the slide is pinned while it
// scrolls: the scroll position picks the tab, and picking a tab scrolls there.
// With `scrub`, the panels also follow the scroll itself: the next one fades
// in over the current one as the page moves, instead of on a timer.
function Tabbed({ items, label, render, scrub }) {
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(1) // 1 = moving forward, -1 = back
  const tabs = useRef([])
  const pill = useRef(null)
  const root = useRef(null)
  const id = useId()
  const curRef = useRef(0)
  const panels = useRef([])
  const go = (i) => {
    if (i === curRef.current) return
    setDir(i > curRef.current ? 1 : -1)
    curRef.current = i
    setCur(i)
  }

  // Slide the white pill under the selected tab.
  useLayoutEffect(() => {
    const place = () => {
      const btn = tabs.current[cur]
      if (!btn || !pill.current) return
      pill.current.style.width = `${btn.offsetWidth}px`
      pill.current.style.transform = `translateX(${btn.offsetLeft}px)`
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [cur])

  // The stepped slide this sits in, with its top and the height of one step.
  const stepped = () => {
    const slide = root.current?.closest('.deck-slide[data-steps]')
    if (!slide) return null
    const navH = parseFloat(getComputedStyle(slide).getPropertyValue('--nav-h')) || 0
    return { top: slide.getBoundingClientRect().top + window.scrollY - navH, h: slide.offsetHeight / items.length }
  }
  // Scrubbed crossfade: the lower panel stays solid and the next one fades in
  // on top of it across the middle of the step, eased at both ends, so the
  // grey stage never shows through.
  const paint = (raw) => {
    root.current?.querySelector('.st-panels')?.classList.add('is-scrub')
    const f = Math.max(0, Math.min(items.length - 1, raw))
    const a = Math.floor(f)
    const lin = Math.max(0, Math.min(1, (f - a - 0.1) / 0.8))
    const t = lin * lin * (3 - 2 * lin)
    panels.current.forEach((el, i) => {
      if (!el) return
      const o = i === a ? 1 : i === a + 1 ? t : 0
      el.style.opacity = String(o)
      el.style.visibility = o > 0 ? 'visible' : 'hidden'
    })
  }
  // Back to the class-driven crossfade (narrow screens, no stepped slide).
  const unpaint = () => {
    root.current?.querySelector('.st-panels')?.classList.remove('is-scrub')
    panels.current.forEach((el) => { if (el) el.style.opacity = el.style.visibility = '' })
  }
  useEffect(() => {
    let lastY = window.scrollY
    let heading = 0 // last clear scroll direction: 1 down, -1 up
    const onScroll = () => {
      const s = stepped()
      const y = window.scrollY
      // Smooth scrolling jitters by fractions of a pixel; only a clear move
      // changes the direction, so the tab can't flicker back and forth.
      if (Math.abs(y - lastY) > 3) { heading = y > lastY ? 1 : -1; lastY = y }
      if (!s) { if (scrub) unpaint(); return }
      // Switch once the page is a quarter of the way to the next step in the
      // direction it's moving, so the change starts with the scroll.
      const raw = (y - s.top) / s.h
      if (scrub) paint(raw)
      const now = curRef.current
      let i = now
      if (heading > 0 && raw > now + 0.25) i = now + 1
      else if (heading < 0 && raw < now - 0.25) i = now - 1
      // Landed far from the current tab (e.g. a jump from the topic bar).
      if (Math.abs(raw - now) > 1.25) i = Math.round(raw)
      go(Math.max(0, Math.min(items.length - 1, i)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  const select = (i) => {
    const s = stepped()
    if (s) scrollToY(s.top + i * s.h, 0.8)
    go(i)
  }
  const pick = (i) => {
    const n = (i + items.length) % items.length
    select(n)
    tabs.current[n]?.focus()
  }
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    e.stopPropagation()
    pick(cur + d)
  }
  const it = items[cur]
  return (
    <div className="st-tabs" ref={root}>
      {/* Description of the selected item, then the tabs. */}
      {it.lead && <p className="st-tabs-lead" key={cur}>{it.lead}</p>}
      <div className="st-tabs-bar">
        <div className="st-tablist" role="tablist" aria-label={label} onKeyDown={onKey}>
          <span className="st-tab-pill" ref={pill} aria-hidden="true" />
          {items.map((x, i) => (
            <button
              key={x.name}
              ref={(el) => { tabs.current[i] = el }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === cur}
              aria-controls={`${id}-panel`}
              tabIndex={i === cur ? 0 : -1}
              className={'st-tab' + (i === cur ? ' is-active' : '')}
              onClick={() => select(i)}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      {/* Every panel stays mounted, stacked in one cell, so switching
          crossfades instead of swapping; `data-dir` sets the drift. */}
      <div className="st-panels" data-dir={dir > 0 ? 'next' : 'prev'}>
        {items.map((x, i) => (
          <div
            key={x.name}
            ref={(el) => { panels.current[i] = el }}
            className={'st-panel' + (i === cur ? ' is-active' : '')}
            role="tabpanel"
            id={i === cur ? `${id}-panel` : undefined}
            aria-labelledby={`${id}-tab-${i}`}
            aria-hidden={i !== cur}
            inert={i !== cur}
          >
            {render(x, i, i === cur)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Design walkthrough with a tab per flow (e.g. Ordering, Live order board).
// Each flow is { name, lead, screens, note }.
export function WalkTabs({ flows }) {
  return <Tabbed items={flows} label="Flows" render={(f) => <Walkthrough screens={f.screens} note={f.note} />} />
}

// Flows one at a time (OrderFlow's Design Execution). On top, a green live light
// with the playing flow's short name (`tag`), its name and description. Then
// every flow's name: boxes in a row above a web flow's window, a list beside a
// phone flow's phone (a row on small screens, too narrow for both). Then its
// step-by-step Demo. When a flow's recording ends it moves on to the next one by
// itself, wrapping round. Each item is { title, tag, p or desc, ...Demo props };
// `label` names it for screen readers.
export function FlowSwitch({ items, device, label }) {
  const [cur, setCur] = useState(0)
  const [dir, setDir] = useState(1)
  const n = items.length
  // flows already shown keep their video, so coming back doesn't load it again
  const [seen, setSeen] = useState(() => new Set([0]))
  const show = (i, d) => { setDir(d); setCur(i); setSeen((s) => (s.has(i) ? s : new Set(s).add(i))) }
  const go = (d) => show((cur + d + n) % n, d)
  const pick = (i) => { if (i !== cur) show(i, i > cur ? 1 : -1) }
  const it = items[cur]
  // Start loading once the section is within a screen or so of the viewport:
  // the flow on screen and the one after it, so moving on starts at once.
  const root = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el || near) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true) }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])
  const wants = (i) => near && (i === cur || i === (cur + 1) % n || seen.has(i))
  // Phone flows with a description hide the step list beside the phone.
  const side = device !== 'browser' && items.some((x) => x.desc)
  const line = (x) => (side ? x.desc : x.p)
  const flowName = (x) => x.title.replace(/\s+Flow$/, '') // shown without the word "Flow"
  // When the names scroll sideways, keep the current one in view.
  const tabs = useRef(null)
  // The bar under the current name follows its recording; set directly, so
  // playback doesn't re-render the whole carousel.
  const bar = useRef(null)
  const setBar = useCallback((r) => { if (bar.current) bar.current.style.transform = `scaleX(${r})` }, [])
  useEffect(() => {
    const row = tabs.current
    const el = row?.children[cur]
    if (!el || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2, behavior: prefersReduced() ? 'auto' : 'smooth' })
  }, [cur])
  // the live label's box takes the text's width, so the pill glides instead of snapping. The
  // observer re-measures if the text itself resizes (web font arriving, phone breakpoint).
  const recLabel = useRef(null)
  useLayoutEffect(() => {
    const box = recLabel.current
    const text = box?.firstChild
    if (!text) return
    const fit = () => { box.style.width = text.offsetWidth + 'px' }
    fit()
    const watch = new ResizeObserver(fit)
    watch.observe(text)
    return () => watch.disconnect()
  }, [cur])
  const info = (
    <div className="st-flows-info">
      <div className="st-flows-now">
        <span className="st-rec" aria-hidden="true"><i><b /><b /></i><span className="st-rec-label" ref={recLabel}><span key={cur}>{it.tag || it.title}</span></span></span>
        <h2 className="sv-h2 st-flows-title" key={'t' + cur}>{flowName(it)}</h2>
        {/* every description is laid out unseen in one cell, so the cell fits the
            longest and nothing moves between flows */}
        <div className="st-flows-slot">
          {items.map((x) => line(x) && <p key={x.title} className="st-flows-p st-flows-sizer" aria-hidden="true">{line(x)}</p>)}
          {line(it) && <p className="st-flows-p" key={cur} data-dir={dir > 0 ? 'next' : 'prev'} aria-live="polite">{line(it)}</p>}
        </div>
      </div>
      {n > 1 && (
        <div className="st-flows-tabs" ref={tabs}>
          {items.map((x, i) => (
            <button key={x.title} type="button" className={'st-flows-tab' + (i === cur ? ' is-on' : '')} aria-current={i === cur ? 'true' : undefined} onClick={() => pick(i)}>
              <span className="st-flows-tab-name">{flowName(x)}</span>
              {/* the list beside a phone keeps the description under the current name */}
              {side && i === cur && <span className="st-flows-tab-desc">{x.desc}</span>}
              {i === cur && <span className="st-flows-bar" aria-hidden="true"><i ref={bar} /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
  const panels = (
    <div className="st-panels" data-dir={dir > 0 ? 'next' : 'prev'}>
      {items.map((x, i) => (
        <div key={x.title} className={'st-panel' + (i === cur ? ' is-active' : '')} aria-hidden={i !== cur} inert={i !== cur}>
          <Demo device={device} {...x} desc={side ? undefined : x.desc} bare={side} active={i === cur} onEnd={n > 1 ? () => go(1) : undefined} onProgress={i === cur ? setBar : undefined} load={wants(i)} />
        </div>
      ))}
    </div>
  )
  return (
    <div className={'st-flows' + (side ? ' is-phone' : '')} ref={root} role="region" aria-roledescription="carousel" aria-label={label ? label + ' flows' : 'Flows'}>
      {info}
      {panels}
    </div>
  )
}

// Screenshots behind tabs (e.g. Today / Proposed). Each item is
// { name, lead, ...Shot props }.
export function ShotTabs({ items }) {
  return <Tabbed items={items} label="Views" scrub render={(it) => <Shot {...it} />} />
}

// ---------------------------------------------------------------------------
// Screen recording of the real product (made with tools/case-video), shown
// like the demos on diana.lu: a big rounded video, muted and looping, with a
// small "Demo n" label and a one-line title above it. It plays only while it
// is on screen; with reduced motion it shows the poster and a play button.
// `eager` starts downloading the video as the page loads (a film near the top),
// so it is buffered by the time it scrolls into view.
export function Reel({ src, poster, audio, label, title, ratio = '16 / 9', alt, eager = false }) {
  const ref = useRef(null)
  const song = useRef(null)
  const seek = useRef(null)
  const [sound, setSound] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (prefersReduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [userPaused])
  const toggle = () => {
    const v = ref.current
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) } else { setUserPaused(true); v.pause() }
  }
  // The song is its own track (`audio`), off until asked for: browsers block
  // sound that starts by itself. It follows the video: same position, and it
  // stops whenever the video stops, including when scrolled out of view.
  const follow = () => {
    const v = ref.current, a = song.current
    if (!a || !sound) return
    if (Math.abs(a.currentTime - v.currentTime) > 0.25) a.currentTime = v.currentTime
    if (a.paused && !v.paused) a.play().catch(() => {})
  }
  // Seek bar: it tracks the video each frame while playing (written straight to
  // the input, no re-render); dragging it moves the video and the song.
  const paint = useCallback((t) => {
    const s = seek.current, d = ref.current?.duration
    if (!s || !Number.isFinite(d) || !d) return
    if (!s.dataset.drag) s.value = t
    s.style.setProperty('--seek', `${(t / d) * 100}%`)
  }, [])
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => { paint(ref.current.currentTime); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, paint])
  const onSeek = (e) => {
    const t = Number(e.target.value)
    const v = ref.current, a = song.current
    v.currentTime = t
    if (a && sound) a.currentTime = t
    paint(t)
  }
  // Full screen: the whole frame, so these controls stay on top. iPhone Safari
  // only lets the video itself go full screen, with its own controls.
  const frame = useRef(null)
  const [full, setFull] = useState(false)
  useEffect(() => {
    const on = () => setFull((document.fullscreenElement || document.webkitFullscreenElement) === frame.current)
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])
  const toggleFull = () => {
    const f = frame.current, v = ref.current
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return }
    if (f.requestFullscreen) f.requestFullscreen().catch(() => {})
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen()
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
  }
  const toggleSound = () => {
    const v = ref.current, a = song.current
    if (sound) { setSound(false); a.pause(); return }
    setSound(true)
    a.volume = 0.7 // the song is mastered loud
    a.currentTime = v.currentTime
    a.play().catch(() => setSound(false)) // inside the click, so browsers allow it
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) }
  }
  return (
    <div className="st-reel">
      {(label || title) && (
        <div className="st-reel-head">
          {label && <span className="st-reel-label">{label}</span>}
          {title && <span className="st-reel-title">{title}</span>}
        </div>
      )}
      <div className="st-reel-frame" ref={frame} style={{ aspectRatio: ratio }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={eager ? 'auto' : 'none'}
          aria-label={alt || title}
          onPlay={() => { setPlaying(true); follow() }}
          onPause={() => { setPlaying(false); song.current?.pause() }}
          onTimeUpdate={follow}
          onLoadedMetadata={(e) => { if (seek.current && Number.isFinite(e.target.duration)) seek.current.max = e.target.duration }}
        />
        {audio && <audio ref={song} src={audio} preload="none" />}
        <div className="st-reel-ctrls">
          <span className="st-reel-seek">
            <input
              ref={seek}
              type="range"
              min="0"
              max="100"
              step="0.01"
              defaultValue="0"
              aria-label="Move through the video"
              onInput={onSeek}
              onPointerDown={(e) => { e.currentTarget.dataset.drag = '1' }}
              onPointerUp={(e) => { delete e.currentTarget.dataset.drag }}
            />
          </span>
          <button type="button" className={'st-reel-btn' + (playing ? ' is-playing' : '')} onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
            {playing ? ICONS.pause : ICONS.play}
          </button>
          <button type="button" className="st-reel-btn is-aux" onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'Full screen'}>
            {full ? ICONS.shrink : ICONS.expand}
          </button>
          {audio && (
            <button type="button" className="st-reel-btn is-sound" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'}>
              {sound ? ICONS.soundOn : ICONS.soundOff}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const stepNo = (i) => String(i + 1).padStart(2, '0')

// Step-by-step demo: the app screen recording (screen only, made with
// tools/case-video raw mode) inside a phone drawn in CSS, and the steps as
// plain text beside it. No panel behind either, so only the text and the
// mockup show. The step in view follows the video; picking a step seeks
// there. `steps` are { t: seconds, text }.
// `active` false (a hidden flow) keeps it paused, and it starts over each
// time it comes back. With `onEnd` it plays once and calls it at the end
// (FlowSwitch moves on to the next flow) instead of looping.
// `load` false holds back the video and its poster (FlowSwitch only loads the
// flow on screen and the next one, once the section is close).
// `onProgress` gets 0 to 1 as it plays, for a progress bar outside the player.
export function Demo({ src, poster, steps = [], desc, bare, alt, device = 'phone', active = true, onEnd, onProgress, load = true }) {
  const ref = useRef(null)
  const [at, setAt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  // In a flow, move on as the recording's held last frame begins (compose adds
  // a ~2.5 s tail), keeping only a beat of the final screen.
  const ended = useRef(false)
  useEffect(() => {
    const v = ref.current
    if (!v || prefersReduced()) return
    if (!active || !load) { v.pause(); return }
    ended.current = false
    if (onEnd) v.currentTime = 0 // timeupdate then moves the step list back to the first step
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.3 })
    io.observe(v)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPaused, active, load])
  const onTime = () => {
    const v = ref.current, t = v.currentTime
    if (onEnd && !ended.current && v.duration && t >= v.duration - 1.6) { ended.current = true; onEnd() }
    if (onProgress && v.duration) onProgress(Math.min(1, t / (v.duration - 1.6))) // 1 is where onEnd moves on
    let k = 0
    steps.forEach((s, i) => { if (s.t <= t + 0.05) k = i })
    setAt(k)
  }
  const seek = (i) => {
    const v = ref.current
    v.currentTime = steps[i].t + 0.05
    setAt(i)
    if (v.paused && !prefersReduced()) { setUserPaused(false); v.play().catch(() => {}) }
  }
  const toggle = () => {
    const v = ref.current
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}) } else { setUserPaused(true); v.pause() }
  }
  // Full screen shows just the recording, with the browser's own controls.
  const toggleFull = () => {
    const v = ref.current
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return }
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen()
  }
  useEffect(() => {
    const v = ref.current
    const on = () => { v.controls = (document.fullscreenElement || document.webkitFullscreenElement) === v }
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])
  return (
    <div className={'st-demo is-' + device}>
      {/* web recordings show the screen alone; a phone shows its description
          (`desc`) beside it, or else its step list */}
      {!bare && device !== 'browser' && desc && <p className="st-demo-desc">{desc}</p>}
      {!bare && device !== 'browser' && !desc && <ol className="st-demo-steps">
        {steps.map((s, i) => (
          <li key={s.t}>
            <button type="button" className={'st-demo-step' + (i === at ? ' is-on' : i < at ? ' is-done' : '')} onClick={() => seek(i)} aria-current={i === at ? 'step' : undefined}>
              <span className="st-step-n">{stepNo(i)}</span>
              <span className="st-demo-text">{s.text}</span>
            </button>
          </li>
        ))}
      </ol>}
      <div className={device === 'browser' ? 'st-browser' : 'st-device'}>
        {device === 'browser' && <div className="st-browser-bar" aria-hidden="true"><i /><i /><i /></div>}
        <div className={device === 'browser' ? 'st-browser-page' : 'st-device-screen'}>
          <video
            ref={ref}
            src={load ? src : undefined}
            poster={load ? poster : undefined}
            muted
            loop={!onEnd}
            playsInline
            preload={load && onEnd ? 'auto' : 'none'}
            aria-label={alt}
            onTimeUpdate={onTime}
            onEnded={() => { if (onEnd && !ended.current) { ended.current = true; onEnd() } }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {device !== 'browser' && <span className="st-device-island" aria-hidden="true" />}
        </div>
        {/* flows play through on their own, with no buttons over the screen */}
        {!onEnd && <>
          <button type="button" className={'st-reel-btn st-demo-btn' + (playing ? ' is-playing' : '')} onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
            {playing ? ICONS.pause : ICONS.play}
          </button>
          <button type="button" className="st-reel-btn st-demo-btn st-demo-full is-aux" onClick={toggleFull} aria-label="Full screen">
            {ICONS.expand}
          </button>
        </>}
      </div>
    </div>
  )
}

// Design choices beside one phone: picking (or hovering) a choice brings up
// its screen; while in view it moves on by itself, with a thin bar filling
// under the current choice. Any click stops the auto-advance. `items` are
// { h, p, src, alt }.
// `label` titles the block; `ratio` sets the browser page shape (default 1440 / 900).
export function Choices({ items, ms = 4200, device = 'phone', label, ratio }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const [at, setAtRaw] = useState(0)
  const [prev, setPrev] = useState(null)
  const setAt = (n) => setAtRaw((cur) => { const v = typeof n === 'function' ? n(cur) : n; if (v !== cur) setPrev(cur); return v })
  const [auto, setAuto] = useState(true)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (!seen || !auto || hold || prefersReduced()) return
    const id = setTimeout(() => setAt((x) => (x + 1) % items.length), ms)
    return () => clearTimeout(id)
  }, [seen, auto, hold, at, ms, items.length])
  const running = seen && auto && !hold && !prefersReduced()
  return (
    <div className={'st-choices is-' + device} ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      {label && <h3 className="cs-stat-h st-choices-label">{label}</h3>}
      <ol className="st-choices-list">
        {items.map((it, i) => (
          <li key={it.h}>
            <button
              type="button"
              className={'st-choice' + (i === at ? ' is-on' : '')}
              aria-pressed={i === at}
              onClick={() => { setAt(i); setAuto(false) }}
              onMouseEnter={() => setAt(i)}
              onFocus={() => setAt(i)}
            >
              <span className="st-step-n">{stepNo(i)}</span>
              <span className="st-choice-body">
                <span className="st-choice-h">{it.h}</span>
                <span className="st-choice-p">{it.p}</span>
                <span className="st-choice-bar" aria-hidden="true">
                  {i === at && <i key={at} style={{ animationDuration: `${ms}ms`, animationPlayState: running ? 'running' : 'paused' }} />}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className={device === 'browser' ? 'st-browser' : 'st-device'}>
        {device === 'browser' && <div className="st-browser-bar" aria-hidden="true"><i /><i /><i /></div>}
        <div className={device === 'browser' ? 'st-browser-page' : 'st-device-screen'} style={device === 'browser' && ratio ? { aspectRatio: ratio } : undefined}>
          {items.map((it, i) => (
            <img key={i === at ? `${it.src}-${at}` : it.src} src={it.src} alt={it.alt} className={i === at ? 'is-on' : i === prev ? 'is-prev' : undefined} aria-hidden={i !== at} />
          ))}
          {device !== 'browser' && <span className="st-device-island" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// A row of phones, each with its name and one line underneath, for a set too
// long to list beside one phone. Scrolls sideways: swipe, trackpad, drag with
// the mouse, or the arrows. `items` are { h, p, src, alt }.
export function Rail({ items }) {
  const ref = useRef(null)
  const grab = useRef(null)
  const [at, setAt] = useState(0)
  const [atEnd, setAtEnd] = useState(false)
  const [held, setHeld] = useState(false)

  const cardStep = () => {
    const [a, b] = ref.current.children
    return b.offsetLeft - a.offsetLeft
  }
  const onScroll = () => {
    const el = ref.current
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setAt(end ? items.length - 1 : Math.round(el.scrollLeft / cardStep())) // the last phones can't reach the left edge
    setAtEnd(end)
  }
  useEffect(onScroll) // the row may already fit, so the arrows start out right
  const go = (dir) => ref.current.scrollBy({ left: dir * cardStep(), behavior: prefersReduced() ? 'auto' : 'smooth' })

  const onDown = (e) => {
    if (e.pointerType !== 'mouse') return // touch scrolls natively
    grab.current = { x: e.clientX, left: ref.current.scrollLeft }
    e.currentTarget.setPointerCapture(e.pointerId)
    setHeld(true)
  }
  const onMove = (e) => {
    if (grab.current) ref.current.scrollLeft = grab.current.left - (e.clientX - grab.current.x)
  }
  const onUp = () => { grab.current = null; setHeld(false) }

  return (
    <div className="st-rail">
      <ol
        className={'st-rail-row' + (held ? ' is-held' : '') + (atEnd ? ' is-end' : '')}
        ref={ref}
        tabIndex={0}
        aria-label="Edge cases, scrolls sideways"
        onScroll={onScroll}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {items.map((it) => (
          <li key={it.h} className="st-rail-item">
            <div className="st-device">
              <div className="st-device-screen">
                <img src={it.src} alt={it.alt} loading="lazy" draggable={false} />
                <span className="st-device-island" aria-hidden="true" />
              </div>
            </div>
            <h3 className="st-rail-h">{it.h}</h3>
            <p className="st-rail-p">{it.p}</p>
          </li>
        ))}
      </ol>
      <div className="st-rail-foot">
        <span className="st-rail-count" aria-hidden="true">{stepNo(at)} / {stepNo(items.length - 1)}</span>
        <span className="st-rail-arrows">
          <button type="button" aria-label="Previous" disabled={at === 0} onClick={() => go(-1)}><Icon name="arrowRight" size={20} /></button>
          <button type="button" aria-label="Next" disabled={atEnd} onClick={() => go(1)}><Icon name="arrowRight" size={20} /></button>
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Phone screen drawn from parts. Each part is { t: type, ...props }.
export function Screen({ dark, title, right, parts = [] }) {
  return (
    <div className={'sc-phone' + (dark ? ' is-dark' : '')}>
      <div className="sc-status"><span>9:41</span><span className="sc-dots" /></div>
      {title && (
        <div className="sc-top">
          <b>{title}</b>
          {right === 'lang' && <span className="sc-seg"><b>EN</b><i>မြန်မာ</i></span>}
          {right && right !== 'lang' && <span className="sc-right">{right}</span>}
        </div>
      )}
      <div className="sc-body">{parts.map((p, i) => <Part key={i} {...p} />)}</div>
    </div>
  )
}

function Part({ t, ...p }) {
  switch (t) {
    case 'chips':
      return <div className="sc-chips">{p.items.map((c, i) => <span key={c} className={i === (p.active ?? 0) ? 'is-on' : undefined}>{c}</span>)}</div>
    case 'row':
      return (
        <div className="sc-row">
          {!p.noThumb && <span className="sc-thumb" />}
          <span className="sc-col"><b>{p.name}</b>{p.sub && <i>{p.sub}</i>}</span>
          {p.tag && <em className={'sc-tag is-' + (p.tone || 'ok')}>{p.tag}</em>}
          {p.add != null && <span className={'sc-add' + (p.add ? ' is-on' : '')}>{p.add || '+'}</span>}
        </div>
      )
    case 'alert':
      return <div className={'sc-alert is-' + (p.tone || 'warn')}>{p.text}</div>
    case 'meter':
      return (
        <div className="sc-meter">
          <span><b>${p.left.toFixed(2)}</b> of ${p.of} left</span>
          <span className="sc-meter-track"><span style={{ width: `${(p.left / p.of) * 100}%` }} /></span>
        </div>
      )
    case 'block':
      return <div className="sc-block"><i>{p.label}</i><b>{p.value}</b></div>
    case 'steps':
      return <div className="sc-steps">{p.items.map((s, i) => <span key={s} className={i < p.done ? 'is-done' : i === p.done ? 'is-now' : undefined}>{s}</span>)}</div>
    case 'big':
      return (
        <div className="sc-big">
          <span className={'sc-big-icon' + (p.tone ? ' is-' + p.tone : '')}>{ICONS[p.icon] || ICONS.check}</span>
          <b>{p.title}</b>
          {p.sub && <i>{p.sub}</i>}
        </div>
      )
    case 'qr':
      return <div className="sc-qr"><span className="sc-qr-frame">{ICONS.qr}</span><i>{p.text}</i></div>
    case 'img':
      return <div className="sc-img" />
    case 'opts':
      return (
        <div className="sc-opts">
          <i>{p.label}</i>
          {p.items.map((o, i) => <span key={o} className={i === p.selected ? 'is-on' : undefined}>{o}</span>)}
        </div>
      )
    case 'stop':
      return <div className="sc-stop"><b>{p.name}</b><i>{p.sub}</i></div>
    case 'people':
      return <div className="sc-people">{p.items.map((n, i) => <span key={n} className={i < (p.done || 0) ? 'is-done' : undefined}>{n}</span>)}</div>
    case 'total':
      return <div className="sc-total"><span>{p.label}</span><b>{p.value}</b></div>
    case 'text':
      return <p className="sc-text">{p.text}</p>
    case 'ghost':
      return <div className="sc-ghost">{p.text}</div>
    case 'cta':
      return <div className={'sc-cta' + (p.tone ? ' is-' + p.tone : '')}>{p.text}</div>
    default:
      return null
  }
}

// Desktop window: an order board, a table or a stats view.
export function Window({ title, view, lanes, cols, rows, tiles, bars }) {
  return (
    <div className="sc-window">
      <div className="sc-bar"><i /><i /><i /><span>{title}</span></div>
      {view === 'board' && (
        <div className="sc-board">
          {lanes.map((l) => (
            <div className="sc-lane" key={l.name}>
              <span className="sc-lane-h">{l.name}<em>{l.tickets.length}</em></span>
              {l.tickets.map((tk) => <Ticket key={tk.t} {...tk} />)}
            </div>
          ))}
        </div>
      )}
      {view === 'table' && (
        <table className="sc-table">
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
        </table>
      )}
      {view === 'stats' && (
        <div className="sc-statsview">
          <div className="sc-tiles">{tiles.map((t) => <div key={t.label}><i>{t.label}</i><b>{t.num}</b></div>)}</div>
          <div className="sc-bars">{bars.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
        </div>
      )}
    </div>
  )
}

function Ticket({ t, src, n, fresh }) {
  return (
    <div className={'sc-ticket' + (fresh ? ' is-new' : '')}>
      <b>{t}</b>
      <span><em className={'sc-src src-' + src.toLowerCase()}>{src}</em>{n}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product film: a short looping animation of the product in use, shown like
// a video: a rounded frame with the scene's subtitle over its foot. Starts when in
// view; on deck slides it zooms to fill the screen as you scroll in.
export function Film({ name }) {
  const script = FILMS[name]
  const ref = useRef(null)
  const frame = useRef(null)
  const seen = useInView(ref, '0px 0px -25% 0px')
  const scene = useTicker(script.scenes.length, 3200, seen)
  const sc = script.scenes[scene]
  useZoomToFill(ref, frame)
  return (
    <div className="st-film" ref={ref}>
      <div className="st-film-frame" ref={frame}>
        <div className="st-film-stage" aria-hidden="true">{script.render(sc)}</div>
        <div className="st-film-overlay">
          <p className="st-film-cap" key={scene} aria-live="polite">{sc.cap}</p>
        </div>
      </div>
    </div>
  )
}

// Scroll-linked zoom for the film on deck slides: as its slide scrolls into
// place, the frame grows from its card size until it fills the slide, and the
// slide's heading fades out; scrolling away shrinks it back. Only runs when
// the deck is paged (wide screens) and motion isn't reduced.
function useZoomToFill(wrapRef, frameRef) {
  useEffect(() => {
    const wrap = wrapRef.current
    const el = frameRef.current
    const slide = wrap?.closest('.deck-slide')
    if (!slide || prefersReduced()) return
    const heading = slide.querySelector('.cs-heading')
    let raf = 0
    const reset = () => {
      el.style.transform = el.style.borderRadius = ''
      wrap.style.removeProperty('--zoom')
      if (heading) heading.style.opacity = ''
    }
    const update = () => {
      raf = 0
      if (!slide.closest('.deck.is-on')) return reset()
      const navH = parseFloat(getComputedStyle(slide).getPropertyValue('--nav-h')) || 0
      const s = slide.getBoundingClientRect()
      const h = s.height
      // 0 when the slide is a screen away, 1 when it's settled in place.
      const raw = Math.max(0, 1 - Math.abs(s.top - navH) / (h * 0.75))
      const p = raw * raw * (3 - 2 * raw)
      el.style.transform = 'none'
      const r = el.getBoundingClientRect()
      const zoom = parseFloat(getComputedStyle(el.closest('.deck-inner')).zoom) || 1
      const k = Math.min(Math.max(s.width / r.width, h / r.height), 2.2)
      const dx = (s.left + s.width / 2 - (r.left + r.width / 2)) / zoom
      const dy = (s.top + h / 2 - (r.top + r.height / 2)) / zoom
      el.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${1 + (k - 1) * p})`
      el.style.borderRadius = `${(24 * (1 - p)) / (1 + (k - 1) * p)}px`
      wrap.style.setProperty('--zoom', p.toFixed(3))
      if (heading) heading.style.opacity = String(1 - Math.min(1, p * 1.4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    // Re-measure once fonts and the slide's own layout have settled.
    const late = setTimeout(onScroll, 1200)
    document.fonts?.ready.then(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(late)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reset()
    }
  }, [wrapRef, frameRef])
}

const FILMS = {
  superfine: {
    scenes: [
      { cap: 'An employee opens today’s menu and sees what their allowance covers.', emp: 'menu', drv: 'idle' },
      { cap: 'They order before the cut-off, with the countdown in view.', emp: 'placed', drv: 'idle' },
      { cap: 'At cut-off, orders lock and the kitchen starts preparing.', emp: 'preparing', drv: 'idle' },
      { cap: 'The driver’s run is grouped by building, with a checklist of people.', emp: 'out', drv: 'stop' },
      { cap: 'One tap marks it delivered, and the employee sees it straight away.', emp: 'delivered', drv: 'done' },
    ],
    render(sc) {
      const steps = ['Placed', 'Locked at cut-off', 'Preparing', 'Out for delivery', 'Delivered']
      const done = { menu: 0, placed: 1, preparing: 2, out: 3, delivered: 5 }[sc.emp]
      const emp = sc.emp === 'menu'
        ? { title: 'Today’s lunch', parts: [{ t: 'alert', text: 'Ordering closes in 42 min' }, { t: 'meter', left: 12.5, of: 15 }, { t: 'row', name: 'Chicken grain bowl', tag: 'Covered' }, { t: 'row', name: 'Tofu banh mi', tag: 'Covered' }, { t: 'row', name: 'Seasonal salad', tag: '+$2.00', tone: 'over' }] }
        : { title: 'Your lunch', parts: [{ t: 'block', label: 'Chicken grain bowl', value: 'Covered by allowance' }, { t: 'steps', items: steps, done }, { t: 'block', label: 'Deliver to', value: 'Office · Floor 12' }] }
      const drv = {
        idle: { dark: true, title: 'Today’s run', parts: [{ t: 'text', text: 'Your run starts after the kitchen packs the orders.' }] },
        stop: { dark: true, title: 'Stop 2 of 6', parts: [{ t: 'stop', name: 'Montgomery Tower', sub: 'Floor 12 · Reception' }, { t: 'people', items: ['Alex R.', 'Priya S.', 'Jordan M.'], done: 1 }, { t: 'cta', text: 'Mark delivered', tone: 'yellow' }] },
        done: { dark: true, title: 'Stop 2 of 6', parts: [{ t: 'stop', name: 'Montgomery Tower', sub: 'Floor 12 · Reception' }, { t: 'people', items: ['Alex R.', 'Priya S.', 'Jordan M.'], done: 3 }, { t: 'big', icon: 'check', title: 'All delivered', tone: 'ok' }] },
      }[sc.drv]
      return (
        <div className="st-film-sf">
          <Screen {...emp} />
          <div className={sc.drv === 'idle' ? 'is-dim' : undefined}><Screen {...drv} /></div>
        </div>
      )
    },
  },
}

// ---------------------------------------------------------------------------
// Simple line icons (24px grid, stroke = currentColor).
const svg = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
)
const ICONS = {
  handoff: svg(<><circle cx="5" cy="12" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 11l3.5-3.5M14 7.5L17 10.5M17 13.5L14 16.5M10 16.5L7 13" /></>),
  menu: svg(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /><path d="M16 16l2 2" /></>),
  eye: svg(<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /><path d="M4 20L20 4" /></>),
  box: svg(<><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>),
  clock: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  wallet: svg(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h2M3 9h18" /></>),
  building: svg(<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" /></>),
  mail: svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  person: svg(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6" /></>),
  qr: svg(<><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>),
  send: svg(<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />),
  check: svg(<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>),
  bell: svg(<><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" /><path d="M10 20a2 2 0 004 0" /></>),
  soundOn: svg(<><path d="M11 5L6.5 9H3v6h3.5L11 19V5z" /><path d="M15.5 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></>),
  soundOff: svg(<><path d="M11 5L6.5 9H3v6h3.5L11 19V5z" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></>),
  expand: svg(<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />),
  shrink: svg(<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />),
  play: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>,
}

// A process as numbered glass cards (e.g. how the research ran), in order.
// Each item is { t, p }.
export function Steps({ items }) {
  return (
    <ol className="cs-steps">
      {items.map((it, i) => (
        <li key={it.t} className="cs-step">
          {it.count != null
            ? <span className="cs-step-count">{it.count}</span>
            : it.spot && SPOTS[it.spot]
              ? <span className="cs-spot cs-step-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><g className="cs-spot-edge">{SPOTS[it.spot]}</g><g>{SPOTS[it.spot]}</g></svg></span>
              : <span className="cs-step-n">{String(i + 1).padStart(2, '0')}</span>}
          <b>{it.t}</b>
          {it.p && <p>{it.p}</p>}
          {/* optional samples from the design system: colour swatches, a type scale, chips */}
          {it.swatches && <span className="cs-step-swatches" aria-hidden="true">{it.swatches.map(([c, n]) => <i key={c} style={{ background: c }} title={n} />)}</span>}
          {it.scale && <span className="cs-step-scale" aria-hidden="true">{it.scale.map((z) => <i key={z} style={{ fontSize: Math.round(z * 1.15) }}>Aa<small>{z}</small></i>)}</span>}
          {it.chips && <span className="cs-step-chips" aria-hidden="true">{it.chips.map((x) => <i key={x}>{x}</i>)}</span>}
        </li>
      ))}
    </ol>
  )
}

// Information architecture as glass columns: each area with its route and the
// pages or features under it, hung off a thin line. Each item is { t, route, items }.
export function IaTree({ items }) {
  return (
    <div className="cs-ia">
      {items.map((it) => (
        <section key={it.t} className="cs-ia-col">
          <header><b>{it.t}</b>{it.route && <code>{it.route}</code>}</header>
          <ul>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
      ))}
    </div>
  )
}

// One doodle icon from SPOTS, with its white sticker edge (see .cs-doodle).
export function Doodle({ name, className = '' }) {
  const d = SPOTS[name]
  if (!d) return null
  return <svg viewBox="0 0 48 48" className={'cs-doodle ' + className} aria-hidden="true"><g className="cs-spot-edge">{d}</g><g>{d}</g></svg>
}
