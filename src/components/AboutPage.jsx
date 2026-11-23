import { ABOUT, TESTIMONIALS } from '../data'
import { newestFirst } from '../dates'

const spanLabel = (role) => (role.end ? `${role.start.slice(0, 4)}—${role.end.slice(0, 4)}` : 'Current')

export default function AboutPage() {
  const roles = newestFirst(ABOUT.experience)
  const notes = TESTIMONIALS.filter((p) => !p.placeholder)
  const firstYear = Math.min(...roles.map((r) => +r.start.slice(0, 4)))
  const thisYear = new Date().getFullYear()

  return (
    <article className="about">
      <section className="about-hero">
        <div className="about-wrap">
          <div className="about-hero-copy">
            <h1>Love to transform complex problems to simple solutions.</h1>
            <div className="about-bio">
              {ABOUT.bio.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="about-xp">
              <div className="about-xp-head">
                <p className="about-label">Experience</p>
                <span className="about-xp-range">{firstYear}—{thisYear}</span>
              </div>
              <ol className="about-xp-list">
                {roles.map((r) => (
                  <li key={r.co + r.start}>
                    <span className="about-xp-co">{r.co}</span>
                    <span className="about-xp-role">{r.role}</span>
                    <span className="about-xp-years">{spanLabel(r)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <img
            className="about-hero-photo"
            src="/sai-swc-color.jpg"
            alt="Sai Myo Thu in a grey polo shirt at a bookshop, language books behind him"
            width="1600"
            height="1600"
          />
        </div>
      </section>
      <section className="about-notes" aria-labelledby="about-notes-title">
        <div className="about-wrap">
          <h2 id="about-notes-title" className="about-notes-title">
            What people I’ve worked<br />with say about me.
          </h2>
          <ul className="about-notes-list">
            {notes.map((p) => (
              <li key={p.name}>
                <blockquote>
                  <p>{p.quote}</p>
                  <footer>
                    {p.photo && <img src={p.photo} alt="" width="40" height="40" />}
                    <span>
                      <cite>{p.name}</cite>
                      <span>{p.role}</span>
                    </span>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}
