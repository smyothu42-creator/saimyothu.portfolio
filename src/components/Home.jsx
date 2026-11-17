import { ABOUT, CASES, HOME_WORK, MORE_WORK, PROFILE } from '../data'
import { Card, Icon, ConnectCard } from './ui'
import Media from './Media'
import { avif } from '../avif'
import Testimonials from './Testimonials'

export default function Home() {
  return (
    <>
      <Intro />
      <MainWork />
      <Portfolio />
      <Testimonials />
      <AboutTeaser />
      <ConnectCard />
    </>
  )
}

const ABOUT_PHOTOS = [
  { src: PROFILE.hero.src, position: 'center 40%' },
  { src: avif('/sai-team.jpg'), position: '0% center' },
  { src: ABOUT.photos[0].src, position: '50% center' },
]

function AboutTeaser() {
  return (
    <Card as="a" href="/about" className="sv-teaser" aria-label="About me: read my story">
      <div className="sv-teaser-text">
        <h2 className="sv-teaser-title">The person behind the work.</h2>
        <span className="sv-teaser-go">
          Read my story
          <span className="sv-teaser-arrow"><Icon name="arrowUpRight" size={17} stroke={2} /></span>
        </span>
      </div>
      <div className="sv-teaser-fan" aria-hidden="true">
        {ABOUT_PHOTOS.map((p) => (
          <i key={p.src} style={{ backgroundImage: `url(${p.src})`, backgroundPosition: p.position }} />
        ))}
      </div>
    </Card>
  )
}

function Intro() {
  return (
    <header className="dl-hero">
      <div
        className="dl-avatar"
        style={{
          backgroundImage: `url(${PROFILE.portrait})`,
          backgroundSize: PROFILE.avatar?.size,
          backgroundPosition: PROFILE.avatar?.position,
        }}
        aria-hidden="true"
      />
      <p className="dl-eyebrow">{PROFILE.role}</p>
      <h1 className="dl-display">{PROFILE.name}</h1>
      <p className="dl-lead">{PROFILE.tagline}</p>
      <p className="dl-note">
        {PROFILE.signoff}.{' '}
        {PROFILE.note.map((part, i) =>
          typeof part === 'string' ? part : (
            <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
          ),
        )}
        .
      </p>
      <a className="dl-action" href="#work">
        Selected work
        <Icon name="arrowDown" size={16} stroke={2} />
      </a>
    </header>
  )
}

function MainWork() {
  const items = HOME_WORK.map((slug) => CASES.find((c) => c.slug === slug)).filter(Boolean)
  return (
    <section className="dl-work" id="work" aria-labelledby="work-title">
      <h2 className="dl-section" id="work-title">Selected work</h2>
      {items.map((c, i) => (
        <article key={c.slug} className={'dl-stage' + (i === 0 ? ' is-lead' : '')}>
          <div className="dl-stage-media">
            <Media
              art={i === 0 ? c.art : (c.art.thumb ? { ...c.art, img: c.art.thumb } : c.art)}
              title={i === 0 ? c.title : ''}
              eager={i === 0}
              video={i === 0 ? c.art.video : undefined}
            />
            <a className="dl-stage-hit" href={`/work/${c.slug}`} aria-label={`${c.title}${c.result ? `. ${c.result}` : ''}`} />
          </div>
          <a className="dl-stage-foot" href={`/work/${c.slug}`}>
            <div>
              <h3>{c.title}</h3>
              {c.result && <p>{c.result}</p>}
            </div>
            <span className="dl-stage-go" aria-hidden="true"><Icon name="arrowRight" size={22} stroke={1.8} /></span>
          </a>
        </article>
      ))}
    </section>
  )
}

function Portfolio() {
  const items = MORE_WORK.map((slug) => CASES.find((c) => c.slug === slug)).filter(Boolean)
  return (
    <section className="dl-more" aria-labelledby="more-title">
      <h2 className="dl-section" id="more-title">More work</h2>
      <div className="dl-rail">
        {items.map((it) => (
          <a key={it.slug} className="dl-rail-card" href={`/work/${it.slug}`}>
            <Media art={it.art.thumb ? { ...it.art, img: it.art.thumb } : it.art} title="" />
            <h3>{it.title}</h3>
            <p>{it.short || it.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
