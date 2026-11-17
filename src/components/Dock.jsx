import { useEffect, useRef, useState } from 'react'
import { NAV, ABOUT } from '../data'
import { TakeNote } from './ui'

const isActive = (href, path) =>
  href === '/' ? path === '/' : href.startsWith('/') && (path === href || path.startsWith(href + '/'))

// Quiet top bar. Same destinations as NAV: Works, About, Contact, Resume,
// plus the "My take" note. Contact is the #contact hash on the connect card.
export default function Dock({ path }) {
  const [take, setTake] = useState(false)
  const takeBtn = useRef(null)
  const takeBox = useRef(null)

  useEffect(() => {
    const open = () => setTake(true)
    window.addEventListener('sv:take', open)
    return () => window.removeEventListener('sv:take', open)
  }, [])
  useEffect(() => {
    if (!take) return
    const onKey = (e) => { if (e.key === 'Escape') { setTake(false); takeBtn.current?.focus() } }
    const onDown = (e) => {
      if (takeBox.current?.contains(e.target) || takeBtn.current?.contains(e.target)) return
      setTake(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [take])

  return (
    <>
      <nav className="dl-nav" aria-label="Main">
        <div className="dl-nav-inner">
          {NAV.map((item) => {
            const on = isActive(item.href, path)
            return (
              <a
                key={item.href}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={on ? 'is-current' : undefined}
                aria-current={on ? 'page' : undefined}
                aria-label={item.external ? `${item.label} (opens in a new tab)` : undefined}
              >
                {item.label}
              </a>
            )
          })}
          {ABOUT.takes?.length > 0 && (
            <button
              ref={takeBtn}
              type="button"
              className={take ? 'is-open' : undefined}
              aria-label="My Takes"
              aria-expanded={take}
              aria-controls="sv-take-pop"
              onClick={() => setTake((v) => !v)}
            >
              My take
            </button>
          )}
        </div>
      </nav>
      <TakeNote id="sv-take-pop" boxRef={takeBox} className="sv-take-pop" open={take} />
    </>
  )
}
