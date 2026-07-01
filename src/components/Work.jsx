import { CASES } from '../data'

// Selected Work — a 2×2 grid of full-width case cards: image, then title +
// outlined mono tags, then a one-line description. Hovering a card shows the
// cursor's "View project" chip (handled in Cursor.jsx via the .case selector).
export default function Work({ onOpen }) {
  return (
    <section id="work">
      <div className="wrap-wide">
        <div className="case-grid">
          {CASES.map((c) => (
            <article
              className="case reveal"
              key={c.title}
              onClick={() => onOpen?.(c.slug)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(c.slug) }}
            >
              <div className="card" style={{ background: c.art.bg }}>
                {c.art.img ? (
                  <img src={c.art.img} alt={c.title} />
                ) : (
                  <span className="wordmark" style={{ color: c.art.color }}>{c.art.text}</span>
                )}
              </div>
              <div className="case-row">
                <h3 className="case-title">{c.title}</h3>
                <div className="case-tags">
                  {c.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <p className="case-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
