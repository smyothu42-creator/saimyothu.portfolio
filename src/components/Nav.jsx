import { EMAIL } from '../data'

const workOn = (path) => path === '/' || path.startsWith('/work')

export default function Nav({ path }) {
  return (
    <header className="rv-mast">
      <a className="rv-mast-col" href="/">
        <span>Sai Myo Thu</span>
        <span>Designer</span>
      </a>
      <p className="rv-mast-col">
        <span>Yangon, Myanmar</span>
        <span>Born 2003</span>
      </p>
      <nav className="rv-mast-col" aria-label="Main">
        <a href="/" aria-current={workOn(path) ? 'page' : undefined}>Work</a>
        <a href="/about" aria-current={path === '/about' ? 'page' : undefined}>About</a>
        <a href="/contact" aria-current={path === '/contact' ? 'page' : undefined}>Contact</a>
      </nav>
      <a className="rv-mast-col" href={`mailto:${EMAIL}`}>
        <span>Contact</span>
        <span className="rv-mast-mail">{EMAIL}</span>
      </a>
    </header>
  )
}
