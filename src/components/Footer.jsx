import { NAV, PROFILE } from '../data'
import { Icon } from './ui'

// Last card on every page: sign-off, the same destinations as the top bar, back to top.
export default function Footer({ onBackToTop }) {
  return (
    <footer className="sv-card sv-footer">
      <p><span className="sv-dim">{PROFILE.signoff}</span></p>
      <nav className="dl-footer-nav" aria-label="Footer">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button type="button" className="sv-footer-top" onClick={onBackToTop}>
        Back to top <Icon name="arrowUp" size={16} stroke={2} />
      </button>
    </footer>
  )
}
