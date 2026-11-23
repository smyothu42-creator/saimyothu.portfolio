import { useEffect, useRef } from 'react'

export default function Topbar({ path }) {
  const about = path === '/me' || path === '/about'
  const contact = path === '/contact'
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let lastY = window.scrollY
    let heading = 0
    const onScroll = () => {
      const y = window.scrollY
      // Ignore smooth-scroll jitter; only a clear direction change counts.
      if (Math.abs(y - lastY) > 3) {
        heading = y > lastY ? 1 : -1
        lastY = y
      }
      el.classList.toggle('is-hidden', heading === 1 && y > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="em-top" ref={ref}>
      <a className="em-word" href="/">Sai Myo Thu</a>
      <nav aria-label="Main">
        <a href="/about" aria-current={about ? 'page' : undefined}>About</a>
        <a href="/contact" aria-current={contact ? 'page' : undefined}>Contact</a>
      </nav>
    </header>
  )
}
