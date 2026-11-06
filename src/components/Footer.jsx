import { PROFILE } from '../data'
import { Icon } from './ui'

// Last card on every page: credit on the left, back-to-top on the right.
export default function Footer({ onBackToTop }) {
  return (
    <footer className="sv-card sv-footer">
      <p><span className="sv-dim">Designed by</span> {PROFILE.name}</p>
      <button className="sv-footer-top" onClick={onBackToTop}>
        <span className="sv-dim">© {new Date().getFullYear()}</span>
        <span className="sv-footer-sep" aria-hidden="true" />
        Back to top <Icon name="arrowUp" size={16} stroke={2} />
      </button>
    </footer>
  )
}
