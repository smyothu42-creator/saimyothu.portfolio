import { SKILLS, STATS } from '../data'

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head reveal">
          <h2>About</h2>
          <span className="mono">The Person Behind</span>
        </div>
        <div className="about-grid">
          <div className="reveal">
            <p className="big">
              I'm <em>Sai Myo Thu</em> — a product designer who believes the best
              products feel <em>obvious</em> in hindsight and <em>effortless</em> in
              the hand.
            </p>
            <div className="skills">
              {SKILLS.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
          <div className="about-side reveal">
            <p>
              For the past several years I've designed digital products end-to-end —
              from early research and wireframes to polished, production-ready
              interfaces.
            </p>
            <p>
              I care about typography, restraint, and the small interactions that make
              software feel considered. When I'm not designing, you'll find me
              sketching, reading, or chasing good coffee.
            </p>
          </div>
        </div>
        <div className="stats reveal">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="num"><em>{s.num}</em>{s.suffix}</div>
              <div className="mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
