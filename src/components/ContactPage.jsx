import { useState } from 'react'
import { EMAIL } from '../data'
import { Card, BackButton, Button, Icon, Socials } from './ui'

export default function ContactPage() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <>
      <Card className="sv-pagehead">
        <BackButton href="/" label="Back to home" />
        <h1 className="sv-h1">Let's talk</h1>
        <p className="sv-pagehead-sub">
          A product to shape, a role to fill, or just a question. <span className="sv-dim">Here's where to find me.</span>
        </p>
      </Card>

      <Card className="sv-connect">
        <p className="sv-label">Email</p>
        <a className="sv-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <div className="sv-row">
          <Button href={`mailto:${EMAIL}`}>Write to me</Button>
          <button className="sv-btn" onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} size={18} />
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>
      </Card>

      <Card className="sv-connect">
        <p className="sv-label">Elsewhere</p>
        <Socials />
      </Card>
    </>
  )
}
