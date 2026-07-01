import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { NAV, EMAIL } from '../data'
import Logo from './Logo'

// The single theme button cycles dark → light → pixel → dark (cycle order lives
// in App). The icon + aria-label preview the theme the next click switches to.
const NEXT_THEME = { dark: 'light', light: 'pixel', pixel: 'dark' }
const NEXT_LABEL = {
  dark: 'Switch to light mode',
  light: 'Switch to Pixel Art mode',
  pixel: 'Switch to dark mode',
}

// Icon previews the NEXT theme: sun (→ light), pixel-art invader (→ Pixel Art),
// moon (→ dark). Shared by the nav toggle + overlay button. `next` is the theme
// the button switches to on click.
function ThemeIcon({ next }) {
  return (
    <svg className="theme-ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {next === 'light' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </>
      )}
      {next === 'dark' && (
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      )}
      {next === 'pixel' && (
        // Space invader built from a 3px pixel grid (rows of contiguous blocks).
        <g fill="currentColor" stroke="none">
          <rect x="6" y="3" width="3" height="3" />
          <rect x="15" y="3" width="3" height="3" />
          <rect x="3" y="6" width="18" height="3" />
          <rect x="0" y="9" width="6" height="3" />
          <rect x="9" y="9" width="6" height="3" />
          <rect x="18" y="9" width="6" height="3" />
          <rect x="0" y="12" width="24" height="3" />
          <rect x="3" y="15" width="6" height="3" />
          <rect x="15" y="15" width="6" height="3" />
          <rect x="0" y="18" width="3" height="3" />
          <rect x="9" y="18" width="6" height="3" />
          <rect x="21" y="18" width="3" height="3" />
        </g>
      )}
    </svg>
  )
}

// Top nav, three-dot button and the full-screen overlay menu.
// Open/close state lives in App and toggles `body.menu-open`, which the CSS
// (clip-path circle reveal, dot → cross morph) keys off of.
export default function Nav({ onToggle, onClose, theme, onToggleTheme }) {
  const nextLabel = NEXT_LABEL[theme] ?? NEXT_LABEL.dark
  const nextTheme = NEXT_THEME[theme] ?? NEXT_THEME.dark
  const ref = useRef(null)

  // At the very top of the page we show the inline nav links; once the user
  // scrolls past a small threshold they collapse into the two-line menu button.
  // Back at the top, the links return. Lenis dispatches native scroll events,
  // so a plain window scroll listener stays in sync with the smooth scroller.
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 60,
  )
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linksRef = useRef(null)
  const btnRef = useRef(null)
  // Tracks the previous state so the very first run sets positions instantly
  // (no animation on load) while every later change plays the GSAP swap.
  const prevScrolled = useRef(null)

  // Elegant GSAP hand-off between the inline links and the two-line button.
  // Desktop only (matchMedia) — on small screens the button is always shown.
  useGSAP(() => {
    const links = gsap.utils.toArray('.topnav-link, .theme-toggle', linksRef.current)
    const btn = btnRef.current
    const container = linksRef.current
    if (!btn || !container) return
    const first = prevScrolled.current === null
    prevScrolled.current = scrolled

    const mm = gsap.matchMedia()
    mm.add('(min-width: 821px)', () => {
      // Initial paint: snap to the right state with no motion.
      if (first) {
        gsap.set(container, { pointerEvents: scrolled ? 'none' : 'auto' })
        gsap.set(links, { yPercent: scrolled ? -130 : 0, autoAlpha: scrolled ? 0 : 1 })
        gsap.set(btn, { autoAlpha: scrolled ? 1 : 0, scale: scrolled ? 1 : 0.6 })
        return
      }
      const tl = gsap.timeline()
      if (scrolled) {
        // Links lift away one-by-one, then the button springs in.
        tl.set(container, { pointerEvents: 'none' })
          .to(links, { yPercent: -130, autoAlpha: 0, duration: 0.4, stagger: 0.06, ease: 'power3.in' })
          .fromTo(btn,
            { autoAlpha: 0, scale: 0.6 },
            { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.15')
      } else {
        // Button eases out, then the links cascade back down into place.
        tl.to(btn, { autoAlpha: 0, scale: 0.6, duration: 0.32, ease: 'power3.in' })
          .set(container, { pointerEvents: 'auto' })
          .fromTo(links,
            { yPercent: -130, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, '-=0.05')
      }
    })
    return () => mm.revert()
  }, { dependencies: [scrolled], scope: ref })

  // GSAP hover: rolls the label up to swap in an accent-coloured copy. Bound to
  // the text element only, so it fires just when the pointer is over the word.
  useGSAP(() => {
    const texts = gsap.utils.toArray('.menu-link-text', ref.current)
    const cleanups = texts.map((text) => {
      const roll = text.querySelector('.menu-link-roll')
      const enter = () => gsap.to(roll, { yPercent: -50, duration: 0.5, ease: 'power3.out' })
      const leave = () => gsap.to(roll, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
      text.addEventListener('mouseenter', enter)
      text.addEventListener('mouseleave', leave)
      return () => { text.removeEventListener('mouseenter', enter); text.removeEventListener('mouseleave', leave) }
    })
    return () => cleanups.forEach((fn) => fn())
  }, { scope: ref })

  return (
    <div ref={ref} className={scrolled ? 'nav-scrolled' : 'nav-top'}>
      {/* Inline links shown at the top of the page; they cross-fade out and
          hand off to the two-line button as soon as the page scrolls. */}
      <nav className="topnav-links" ref={linksRef} aria-hidden={scrolled}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="topnav-link"
            tabIndex={scrolled ? -1 : 0}
            data-magnetic
          >
            {item.label}
          </a>
        ))}
        {/* Theme toggle lives at the end of the inline nav links. Icon reflects
            the active theme; hand-off animation lifts it away with the links. */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={nextLabel}
          tabIndex={scrolled ? -1 : 0}
          data-magnetic
        >
          <ThemeIcon next={nextTheme} />
        </button>
      </nav>

      <button className="menu-btn" ref={btnRef} aria-label="Menu" onClick={onToggle} data-magnetic>
        {/* Both lines live in one SVG so they rasterize on the same grid and
            always render identically (no per-line sub-pixel drift). */}
        <svg className="menu-ico" viewBox="0 0 32 14" width="32" height="14" aria-hidden="true">
          <rect className="bar bar1" x="1" y="2" width="30" height="2" rx="1" />
          <rect className="bar bar2" x="1" y="10" width="30" height="2" rx="1" />
        </svg>
      </button>

      <div className="overlay">
        <nav className="menu-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={onClose} className="menu-link">
              <span className="n">{item.n}</span>
              <span className="menu-link-text">
                <span className="menu-link-roll">
                  <span>{item.label}</span>
                  <span>{item.label}</span>
                </span>
              </span>
            </a>
          ))}
        </nav>

        <div className="ov-foot">
          <div className="ov-group">
            <span className="ov-label">Get in touch</span>
            <a className="ov-email" href={`mailto:${EMAIL}`}>
              Send me an email<i className="ov-email-line" />
            </a>
          </div>
          <div className="ov-group">
            <span className="ov-label">Follow me</span>
            <div className="ov-icons">
            <a className="footer-ico" href="#" aria-label="LinkedIn" data-magnetic>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3V9zm6 0h3.8v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9z"/>
              </svg>
            </a>
            <a className="footer-ico" href="#" aria-label="Video call" data-magnetic>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="14" height="12" rx="2" />
                <path d="M16 10l6-3v10l-6-3" />
              </svg>
            </a>
            <a className="footer-ico" href="#" aria-label="WhatsApp" data-magnetic>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.21.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.06 8.06 0 0 1-1.24-4.3c0-4.47 3.64-8.11 8.12-8.11zm-2.78 4.4c-.13 0-.34.05-.52.25-.18.2-.69.67-.69 1.64s.71 1.9.81 2.04c.1.13 1.39 2.12 3.37 2.97 1.65.71 1.98.57 2.34.54.36-.03 1.16-.47 1.32-.93.16-.46.16-.85.11-.93-.05-.08-.18-.13-.38-.23-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.83-.31-1.59-.98-.59-.52-.98-1.17-1.1-1.37-.11-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.43-1.08-.6-1.48-.16-.39-.32-.33-.44-.34l-.37-.01z"/>
              </svg>
            </a>
            <a className="footer-ico" href="#" aria-label="Resume" data-magnetic>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </a>
            </div>
          </div>
          <div className="ov-group">
            <span className="ov-label">Play</span>
            <div className="ov-icons">
              <button
                className="footer-ico"
                onClick={onToggleTheme}
                aria-label={nextLabel}
                data-magnetic
              >
                <ThemeIcon next={nextTheme} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="topnav">
        <a href="#top" className="brand" aria-label="Sai — home" data-magnetic>
          <Logo className="brand-logo" />
        </a>
      </div>
    </div>
  )
}
