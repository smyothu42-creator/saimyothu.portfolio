import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

// Draggable "scrapbook" About page — scattered cards the visitor can throw
// around the canvas. Each .scrap is a GSAP Draggable; press brings it to front.
export default function AboutPage({ onNavigate }) {
  const ref = useRef(null)

  useGSAP(() => {
    const root = ref.current
    const cards = gsap.utils.toArray('.scrap', root)

    // Seed each card's resting rotation, then play a staggered entrance.
    cards.forEach((c) => gsap.set(c, { rotation: parseFloat(c.dataset.rot || 0) }))
    gsap.from(cards, {
      autoAlpha: 0, scale: 0.85, y: 40,
      duration: 0.6, ease: 'back.out(1.4)', stagger: { each: 0.06, from: 'random' },
    })

    let z = 20
    const drags = Draggable.create(cards, {
      bounds: root,
      edgeResistance: 0.65,
      inertia: false,
      onPress() {
        this.target.style.zIndex = ++z
        gsap.to(this.target, { scale: 1.05, duration: 0.2, ease: 'power2.out' })
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.35, ease: 'power3.out' })
      },
    })
    return () => drags.forEach((d) => d.kill())
  }, { scope: ref })

  return (
    <main className="about-page" ref={ref}>
      <span className="about-hint">✦ drag things around</span>

      {/* Signature + tagline */}
      <div className="scrap scrap-sign" data-rot="-3" style={{ left: '42%', top: '40%' }}>
        <span className="scrap-sign-name">Sai Myo Thu</span>
        <span className="scrap-sign-tag">I design, then I build</span>
      </div>

      {/* Profile phone card */}
      <div className="scrap scrap-profile" data-rot="-4" style={{ left: '5%', top: '14%' }}>
        <div className="scrap-profile-top">
          <div className="scrap-profile-name">Sai Myo Thu</div>
          <div className="scrap-profile-bio">Loves design, prototyping, storytelling, and visual craft.</div>
        </div>
        <img className="scrap-profile-img" src="/sai-portrait.jpg" alt="Sai" draggable="false" />
      </div>

      {/* Resume — a real-looking résumé page */}
      <div className="scrap scrap-resume" data-rot="6" style={{ left: '6%', top: '40%' }}>
        <div className="resume-paper">
          <div className="resume-top">
            <div className="resume-id">
              <div className="resume-name">Sai Myo Thu <span className="resume-badge">✓</span></div>
              <div className="resume-role">Product Designer</div>
            </div>
            <div className="resume-contact">
              <span>www.saimyothu.com</span>
              <span>hello@saimyothu.com</span>
            </div>
          </div>
          <div className="resume-cols">
            <div className="resume-col">
              <h4>Experience</h4>
              <div className="resume-item">
                <b>Retina AI — Product Designer</b>
                <i>2024 – Present</i>
                <p>Led the end-to-end redesign of an AI nutrition platform and built the front-end.</p>
              </div>
              <div className="resume-item">
                <b>Freelance — Product Designer</b>
                <i>2020 – 2024</i>
                <p>Designed digital products for startups across fintech, health, and commerce.</p>
              </div>
              <div className="resume-item">
                <b>Studio Aung — UI Designer</b>
                <i>2018 – 2020</i>
                <p>Shipped marketing sites and brand systems for local clients.</p>
              </div>
            </div>
            <div className="resume-col">
              <h4>Education</h4>
              <div className="resume-item">
                <b>Self-taught</b>
                <p>Design, front-end, and motion — learning by building.</p>
              </div>
              <h4>Skills</h4>
              <div className="resume-skills">
                Figma · React · TypeScript · GSAP · Prototyping · UX Research · Design Systems · Motion
              </div>
            </div>
          </div>
        </div>
        <div className="resume-file">resume.pdf</div>
      </div>

      {/* Terminal window */}
      <div className="scrap scrap-term" data-rot="2" style={{ left: '40%', top: '60%' }}>
        <div className="term-bar">
          <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
          <span className="term-title">sai — zsh</span>
        </div>
        <div className="term-body">
          <p><span className="term-prompt">~ $</span> whoami</p>
          <p>Product Designer · 6+ years</p>
          <p><span className="term-prompt">~ $</span> ls interests/</p>
          <p>design/ code/ coffee/ photography/</p>
        </div>
      </div>

      {/* Folder */}
      <div className="scrap scrap-folder" data-rot="-6" style={{ left: '30%', top: '20%' }}>
        <span className="folder-tab" />
        <span className="folder-count">12</span>
      </div>

      {/* Photo polaroids */}
      <div className="scrap scrap-photos" data-rot="6" style={{ left: '68%', top: '24%' }}>
        <div className="polaroid" style={{ '--p': '#bcd4ec' }}><span>✺</span><b>seattle</b></div>
        <div className="polaroid" style={{ '--p': '#e7cfe0' }}><span>❀</span><b>blooms</b></div>
        <div className="polaroid" style={{ '--p': '#d6e7c9' }}><span>☀</span><b>moments</b></div>
      </div>

      {/* Ticket */}
      <div className="scrap scrap-ticket" data-rot="-2" style={{ left: '62%', top: '6%' }}>
        <div className="ticket-l">
          <div className="ticket-name">DESIGN<br />TOUR</div>
          <div className="ticket-est">EST. 2018 → PRESENT</div>
        </div>
        <div className="ticket-r">
          <div className="ticket-row"><b>Time</b> Anytime</div>
          <div className="ticket-row"><b>Where</b> Myanmar · Online</div>
          <div className="ticket-barcode" />
        </div>
      </div>

      {/* Sticky note */}
      <div className="scrap scrap-note" data-rot="4" style={{ left: '82%', top: '60%' }}>
        Currently open to<br />new projects ✏︎
      </div>
    </main>
  )
}
