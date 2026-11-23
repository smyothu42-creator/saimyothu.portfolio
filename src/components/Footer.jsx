import { EMAIL } from '../data'

export default function Footer({ onBackToTop }) {
  return (
    <footer className="rv-foot">
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <button type="button" onClick={onBackToTop}>Back to top</button>
    </footer>
  )
}
