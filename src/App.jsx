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
import ContactPage from './components/ContactPage'
import CaseStudy from './components/CaseStudy'
import Footer from './components/Footer'

// Tiny path router: /work/<slug> → case study, /about, /contact,
// else → home.
function parseRoute(pathname) {
  const m = pathname.match(/^\/work\/([\w-]+)\/?$/)
  if (m) return { name: 'case', slug: m[1] }
  if (/^\/work\/?$/.test(pathname)) return { name: 'home' } // the old Work page
  if (/^\/about\/?$/.test(pathname)) return { name: 'about' }
  if (/^\/contact\/?$/.test(pathname)) return { name: 'contact' }
  return { name: 'home' }
}

const PAGES = { home: Home, about: AboutPage, contact: ContactPage }

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname))
  const [path, setPath] = useState(() => window.location.pathname)
  const lenisRef = useRef(null)

  // Page change wrapped in a View Transition: the browser snapshots the old
  // page (glass blur and all) and cross-fades to the new one, whose cards
  // then do their usual fade-up. Animating <main> ourselves would switch the
  // cards' blur off mid-animation. No support or reduced motion: instant.
  const transition = (update) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) { update(); return }
    document.startViewTransition(() => flushSync(update))
  }

  const navigate = (to) => {
    if (to === window.location.pathname) { lenisRef.current?.scrollTo(0, { duration: 0.8 }); return } // same page: back to top
    window.history.pushState({}, '', to)
    transition(() => {
      setPath(to)
      setRoute(parseRoute(to))
      lenisRef.current?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    })
  }

  useEffect(() => {
    const onPop = () => transition(() => {
      setPath(window.location.pathname)
      setRoute(parseRoute(window.location.pathname))
    })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Lenis smooth scrolling + client-side routing for internal path links.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    scroller.lenis = lenis
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
