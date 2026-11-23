import { TESTIMONIALS } from '../data'

export default function Testimonials() {
  const list = TESTIMONIALS.filter((p) => !p.placeholder)
  if (!list.length) return null
  return (
    <section className="rv-quotes" aria-labelledby="notes">
      <h2 id="notes" className="rv-kicker">Notes</h2>
      {list.map((p) => (
        <blockquote key={p.name}>
          <p>{p.quote}</p>
          <footer>
            <cite>{p.name}</cite>
            <span>{p.role}</span>
          </footer>
        </blockquote>
      ))}
    </section>
  )
}
