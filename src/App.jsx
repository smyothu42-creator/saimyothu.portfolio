import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroller } from './scroll'

import Backdrop from './components/Backdrop'
import Dock from './components/Dock'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import Home from './components/Home'
import AboutPage from './components/AboutPage'
import CaseStudy from './components/CaseStudy'
import Footer from './components/Footer'

// Tiny path router: /work/<slug> → case study, /about, else → home.
function parseRoute(pathname) {
  const m = pathname.match(/^\/work\/([\w-]+)\/?$/)
  if (m) return { name: 'case', slug: m[1] }
  if (/^\/work\/?$/.test(pathname)) return { name: 'home' } // the old Work page
  if (/^\/about\/?$/.test(pathname)) return { name: 'about' }
  return { name: 'home' }
}

const PAGES = { home: Home, about: AboutPage }

// Each page visit (history entry) remembers how far down it was scrolled, so
// going back returns to the same place. `idx` counts visits within the site, so
// a back button knows whether there's anywhere on the site to go back to.
const SCROLL_KEY = 'sv-scroll'
const readScrolls = () => {
  try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY)) || {} } catch { return {} }
}
const scrolls = readScrolls()
const saveScroll = (key) => {
  if (!key) return
  scrolls[key] = window.scrollY
  try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify(scrolls)) } catch { /* private window: this visit only */ }
}
const newKey = () => Math.random().toString(36).slice(2)

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname))
  const [path, setPath] = useState(() => window.location.pathname)
  const lenisRef = useRef(null)
  const entryKey = useRef(null)
  const stopRestore = useRef(null)

  // Scrolls to y, trying again while the page is still growing (images and
  // videos load in) and giving up as soon as the visitor scrolls themselves.
  const restoreScroll = (y) => {
    stopRestore.current?.()
    const jump = () => {
      lenisRef.current?.resize()
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    jump()
    if (!y) return
    const t0 = performance.now()
    let id
    const stop = () => {
      cancelAnimationFrame(id)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
      stopRestore.current = null
    }
    const tick = () => {
      if (Math.abs(window.scrollY - y) > 2) jump()
      if (performance.now() - t0 > 1500) stop()
      else id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('keydown', stop)
    stopRestore.current = stop
  }

  // Page change wrapped in a View Transition: the browser snapshots the old
  // page (glass blur and all) and cross-fades to the new one, whose cards
  // then do their usual fade-up. Animating <main> ourselves would switch the
  // cards' blur off mid-animation. No support or reduced motion: instant.
  const transition = (update) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) { update(); return }
    document.startViewTransition(update)
  }

  const navigate = (to) => {
    if (to === window.location.pathname) { lenisRef.current?.scrollTo(0, { duration: 0.8 }); return } // same page: back to top
    saveScroll(entryKey.current)
    stopRestore.current?.()
    const key = newKey()
    window.history.pushState({ key, idx: (window.history.state?.idx ?? 0) + 1 }, '', to)
    entryKey.current = key
    transition(() => {
      flushSync(() => {
        setPath(to)
        setRoute(parseRoute(to))
      })
      lenisRef.current?.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    })
  }

  useEffect(() => {
    // The browser would jump before the new page renders, so we place it ourselves.
    window.history.scrollRestoration = 'manual'
    const first = window.history.state?.key || newKey()
    window.history.replaceState({ ...window.history.state, key: first, idx: window.history.state?.idx ?? 0 }, '')
    entryKey.current = first
    const onPop = (e) => {
      saveScroll(entryKey.current)
      entryKey.current = e.state?.key ?? null
      const y = scrolls[e.state?.key] ?? 0
      transition(() => {
        flushSync(() => {
          setPath(window.location.pathname)
          setRoute(parseRoute(window.location.pathname))
        })
        restoreScroll(y)
      })
    }
    const onHide = () => saveScroll(entryKey.current)
    window.addEventListener('popstate', onPop)
    window.addEventListener('pagehide', onHide)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('pagehide', onHide)
    }
  }, [])

  // Lenis smooth scrolling + client-side routing for internal path links.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    scroller.lenis = lenis
    // A reload keeps its place too.
    const reloaded = scrolls[window.history.state?.key]
    if (reloaded) restoreScroll(reloaded)
    // Keep GSAP ScrollTrigger (scroll-linked effects) in step with Lenis.
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)
    let id
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)

    const onClick = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      const a = e.target.closest('a[href^="/"]')
      if (!a || a.target === '_blank') return
      e.preventDefault()
      // A back button returns to the previous place on the site; opened directly, it uses its link.
      if (a.dataset.back !== undefined && window.history.state?.idx > 0) { window.history.back(); return }
      navigate(a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(id)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])

  // Fade-up reveal for anything marked .reveal, re-armed on every route.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [route])

  const scrollTop = () => lenisRef.current?.scrollTo(0, { duration: 1.2 })

  const Page = PAGES[route.name]

  return (
    <>
      <Backdrop />
      <Dock path={path} />
      <Cursor />
      <Loader />
      <main className={'sv-col page' + (route.name === 'case' ? ' is-wide' : '')} key={path}>
        {route.name === 'case' ? <CaseStudy slug={route.slug} /> : <Page />}
        <Footer onBackToTop={scrollTop} />
      </main>
    </>
  )
}
