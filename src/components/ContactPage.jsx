import { EMAIL, RESUME_URL, SOCIALS } from '../data'

const social = (label) => SOCIALS.find((s) => s.label === label)?.href

const CHANNELS = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'WhatsApp', value: '+95 9 952 871 461', href: social('WhatsApp') },
  { label: 'LinkedIn', value: 'in/sai-myo-thu', href: social('LinkedIn') },
  { label: 'Facebook', value: 'sai.myo.thu', href: social('Facebook') },
  { label: 'Resume', value: 'Download PDF', href: RESUME_URL },
]

export default function ContactPage() {
  return (
    <article className="contact">
      <section className="contact-hero">
        <div className="contact-wrap">
          <div className="contact-main">
            <div className="contact-intro">
              <h1>Contact</h1>
              <p className="contact-lede">
                For product design work, a flow that needs fixing, or just a hello.
                Email is the fastest way to reach me.
              </p>
              <div className="contact-channels">
                <ul>
                  {CHANNELS.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <span className="contact-ch-label">{c.label}</span>
                        <span className="contact-ch-value">{c.value}</span>
                        <span className="contact-ch-arrow" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <figure className="contact-meme">
              <img
                src="/contact-meme-clean.gif"
                alt="Jeff Goldblum playfully asking, Anyone home?"
                width="480"
                height="480"
              />
            </figure>
          </div>
        </div>
      </section>
    </article>
  )
}
