import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

import { ThumbProvider } from './components/Thumb'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Contact from './components/Contact'
import CaseStudy from './components/CaseStudy'
import AboutPage from './components/AboutPage'
import Logo from './components/Logo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Tiny path router: /work/<slug> → case study, /about → about, else → home.
function parseRoute(pathname) {
  const m = pathname.match(/^\/work\/([\w-]+)\/?$/)
  if (m) return { name: 'case', slug: m[1] }
  if (/^\/about\/?$/.test(pathname)) return { name: 'about' }
  return { name: 'home' }
}

export default function App() {
  // `?skip` jumps straight past the intro loader (handy for previews/deep links).
  const [loaded, setLoaded] = useState(
    () => new URLSearchParams(window.location.search).has('skip'),
  )
  const [menuOpen, setMenuOpen] = useState(false)
  // Light/dark theme — persisted, applied to <html data-theme> so the CSS
  // variable overrides take effect site-wide.
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark',
  )
  const rootRef = useRef(null)
  const contentRef = useRef(null)
  const lenisRef = useRef(null)

  // Client-side route (home vs case study).
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname))
  const panelRef = useRef(null)
  const panelLabelRef = useRef(null)
  const animatingRef = useRef(false)
  // When an in-page anchor is clicked from another page, we route home first
  // and stash the target here so the home layout effect can scroll to it once
  // the layout has actually settled (rather than landing at the top).
  const pendingScrollRef = useRef(null)

  // Codigo-style curtain wipe: a solid panel slides up to cover the page, the
  // route swaps behind it, then the panel keeps sliding up and off to reveal it.
  const navigate = (path) => {
    if (animatingRef.current) return
    const panel = panelRef.current
    const label = panelLabelRef.current
    if (!panel) { // fallback if the overlay isn't mounted
      window.history.pushState({}, '', path)
      setRoute(parseRoute(path)); window.scrollTo(0, 0)
      return
    }
    animatingRef.current = true
    gsap.timeline({ onComplete: () => { animatingRef.current = false } })
      .set(panel, { visibility: 'visible', yPercent: 100 })
      .set(label, { autoAlpha: 0, y: 24 })
      .to(panel, { yPercent: 0, duration: 0.6, ease: 'power4.inOut' })
      .to(label, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.35')
      .add(() => {
        window.history.pushState({}, '', path)
        setRoute(parseRoute(path))
        lenisRef.current?.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      })
      .to(label, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power3.in' }, '+=0.2')
      .to(panel, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.15')
      .set(panel, { visibility: 'hidden' })
  }

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Lenis smooth scrolling, driven by GSAP's ticker and synced to ScrollTrigger.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Internal path links (e.g. /about) → route with the curtain transition.
    const onPathClick = (e) => {
      const a = e.target.closest('a[href^="/"]')
      if (!a) return
      e.preventDefault()
      navigate(a.getAttribute('href'))
    }
    document.addEventListener('click', onPathClick)

    // Smooth-scroll in-page anchor links instead of the native jump. From a
    // case-study page, anchors route home first, then scroll to the target.
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      e.preventDefault()
      if (id.length <= 1) return
      if (parseRoute(window.location.pathname).name !== 'home') {
        // Signature logo (#top) → home with the curtain transition.
        if (id === '#top') { navigate('/'); return }
        // Other anchors (e.g. Work) → route home, then jump straight to the
        // section once the home layout has settled (consumed in the home reveal
        // effect via pendingScrollRef) so we don't land at the top of the page.
        pendingScrollRef.current = id
        window.history.pushState({}, '', '/')
        setRoute({ name: 'home' })
      } else {
        lenis.scrollTo(id, { offset: 0, duration: 1.4 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('click', onPathClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  // Release the scroll lock once we're past the loader (or skipping it).
  useEffect(() => {
    const lenis = lenisRef.current
    if (loaded) {
      document.body.classList.remove('loading')
      lenis?.start()
    } else {
      lenis?.stop() // keep the page locked behind the loader
    }
  }, [loaded])

  // Reflect menu state onto <body> so the CSS clip-path reveal can key off it.
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])

  // Apply + persist the theme.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Esc closes the overlay menu.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll-driven animations: per-element reveals + the fixed-footer reveal.
  // Home-only — the case-study page has its own layout.
  useGSAP(() => {
    if (route.name !== 'home') return
    const root = rootRef.current
    const reveals = root.querySelectorAll('.reveal')
    gsap.set(reveals, { y: 28 })

    ScrollTrigger.batch(reveals, {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true }),
    })

    // Fixed footer reveal: give the content layer a bottom margin equal to the
    // footer's height so scrolling uncovers it, then slide the big line up.
    const contentLayer = contentRef.current
    const footer = document.querySelector('.contact')
    const footerBig = document.querySelector('.footer-chat')
    const sizeFooter = () => { contentLayer.style.marginBottom = footer.offsetHeight + 'px' }

    // Cursor-follow: the headline gently drifts toward the pointer while the
    // mouse is anywhere over the footer, easing back to center on leave.
    const xTo = gsap.quickTo(footerBig, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(footerBig, 'y', { duration: 0.7, ease: 'power3' })
    const onFooterMove = (e) => {
      const r = footer.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.12)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.12)
    }
    const onFooterLeave = () => { xTo(0); yTo(0) }
    footer.addEventListener('mousemove', onFooterMove)
    footer.addEventListener('mouseleave', onFooterLeave)

    sizeFooter()
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: sizeFooter })
    ScrollTrigger.refresh()

    // Arrived here from another page via an in-page anchor (e.g. Work): now
    // that the layout is settled, recompute Lenis bounds and jump straight to
    // the requested section instead of leaving the user at the top.
    if (pendingScrollRef.current) {
      const target = pendingScrollRef.current
      pendingScrollRef.current = null
      lenisRef.current?.resize()
      lenisRef.current?.scrollTo(target, { offset: 0, immediate: true })
    }

    const onResize = () => { sizeFooter(); ScrollTrigger.refresh() }
    const onLoad = () => { sizeFooter(); ScrollTrigger.refresh() }
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onLoad)
    return () => {
      footer.removeEventListener('mousemove', onFooterMove)
      footer.removeEventListener('mouseleave', onFooterLeave)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onLoad)
    }
  }, { dependencies: [route], scope: rootRef })

  // Recompute ScrollTrigger positions once the loader leaves (layout settles).
  useGSAP(() => {
    if (loaded) ScrollTrigger.refresh()
  }, { dependencies: [loaded], scope: rootRef })

  return (
    <ThumbProvider>
      <div ref={rootRef}>
        <Cursor />
        {/* Page-transition curtain (Codigo-style upward wipe). */}
        <div className="page-wipe" ref={panelRef} aria-hidden="true">
          <Logo className="page-wipe-label" ref={panelLabelRef} />
        </div>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
        <Nav
          onToggle={() => setMenuOpen((v) => !v)}
          onClose={() => setMenuOpen(false)}
          theme={theme}
          onToggleTheme={() =>
            setTheme((t) => (t === 'dark' ? 'light' : t === 'light' ? 'pixel' : 'dark'))
          }
        />
        {route.name === 'case' ? (
          <CaseStudy slug={route.slug} onNavigate={navigate} />
        ) : route.name === 'about' ? (
          <AboutPage onNavigate={navigate} />
        ) : (
          <>
            <div className="content-layer" ref={contentRef}>
              <Hero loaded={loaded} />
              <Work onOpen={(slug) => navigate('/work/' + slug)} />
            </div>
            <Contact />
          </>
        )}
      </div>
    </ThumbProvider>
  )
}
