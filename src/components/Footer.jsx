import { PROFILE } from '../data'
import { Icon } from './ui'

// Last card on every page: sign-off on the left, back-to-top on the right.
export default function Footer({ onBackToTop }) {
  return (
    <footer className="sv-card sv-footer">
      <p><span className="sv-dim">{PROFILE.signoff}</span></p>
      <button className="sv-footer-top" onClick={onBackToTop}>
        Back to top <Icon name="arrowUp" size={16} stroke={2} />
      </button>
    </footer>
  )
}
