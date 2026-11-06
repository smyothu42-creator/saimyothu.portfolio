import { useRef, useState } from 'react'
import { TESTIMONIALS } from '../data'
import { Card, Icon } from './ui'

// Testimonials: one big quote; underneath, the current person (one photo,
// name and role) on the left and arrows on the right to switch. Quote and
// person cross-fade together. On touch screens, swipe left/right to switch.
export default function Testimonials() {
  const list = TESTIMONIALS
  const n = list.length
  const [i, setI] = useState(0)
  const swipe = useRef(null)
  if (!n) return null
  const initials = (nm) => nm.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const go = (d) => setI((x) => (x + d + n) % n)
  // swipe left / right on touch screens (vertical scrolling is left alone)
  const onTouchStart = (e) => { const t = e.touches[0]; swipe.current = { x: t.clientX, y: t.clientY } }
  const onTouchEnd = (e) => {
    const s0 = swipe.current
    swipe.current = null
    if (!s0 || n < 2) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s0.x, dy = t.clientY - s0.y
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1)
  }
  return (
    <Card className="sv-testimonial" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="sv-tq-quotes" aria-live="polite">
        {list.map((p, k) => (
          <blockquote key={k} className={'sv-tq-quote' + (k === i ? ' is-on' : '')} aria-hidden={k !== i}>
            “{p.quote}”
          </blockquote>
        ))}
      </div>
      <div className="sv-tq-foot">
        <div className="sv-tq-people">
          {list.map((p, k) => (
            <div key={k} className={'sv-tq-person' + (k === i ? ' is-on' : '')} aria-hidden={k !== i}>
              <span className="sv-tq-av" style={p.photo ? { backgroundImage: `url(${p.photo})` } : undefined}>
                {!p.photo && initials(p.name)}
              </span>
              <span className="sv-tq-who">
                <span className="sv-t-name">{p.name}</span>
                <span className="sv-dim">{p.role}</span>
              </span>
            </div>
          ))}
        </div>
        {n > 1 && (
          <div className="sv-tq-nav">
            <button className="sv-round" aria-label="Previous testimonial" onClick={() => go(-1)}><Icon name="arrowLeft" size={15} stroke={1.8} /></button>
            <button className="sv-round" aria-label="Next testimonial" onClick={() => go(1)}><Icon name="arrowRight" size={15} stroke={1.8} /></button>
          </div>
        )}
      </div>
    </Card>
  )
}
