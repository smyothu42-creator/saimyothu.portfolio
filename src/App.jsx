import { createElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync, createPortal } from 'react-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { scroller } from './scroll'

import Topbar from './components/Topbar'
import { StageHint } from './components/ui'
import { PROFILE } from './data'
import { getPage, loadPage, parseRoute, preloadPages } from './pages'

// Home is one page with a white pane on the left and the project list on the
// right. About/Contact and case studies open inside that page: the pane widens
// from the stage to the full window, its text swapping from the tagline into
// the page, and the logo/nav ride the pane's edge out to the top-right.
// Closing is the same motion reversed: the sheet's right edge sweeps back left
// into the stage, and home is uncovered from the right.
function PagePane({ name, slug, back, targetY, onDone }) {
  const paneRef = useRef(null)
  const edgeRef = useRef(null)
  const homeRef = useRef(null)
  const done = useRef(onDone)
  done.current = onDone
  useLayoutEffect(() => {
    const pane = paneRef.current
    const edge = edgeRef.current
    const layer = pane.querySelector('.pg-pane-layer')
    const topbar = layer.querySelector('.em-top')
    const nav = topbar.querySelector('nav')
    const mark = topbar.querySelector('.em-word')
    const content = layer.querySelector('main')
    const face = pane.querySelector('.pg-face')
    if (back) homeRef.current.scrollTop = targetY
    const root = back ? homeRef.current : document
    const stage = root.querySelector('.em-home .em-stage')
    const work = root.querySelector('.em-home .em-work')
    if (!stage || !topbar) { done.current(); return undefined }
    const stageNav = stage.querySelector('.em-stage-nav')
    const brand = stage.querySelector('.em-hand')
    const vw = window.innerWidth
    const padEnd = Math.max(36, (vw - 1232) / 2)
    const startW = Math.round(stage.getBoundingClientRect().width)
    const startRight = vw - (startW - 28)
    const mid = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 }
    // The page's pieces, in reading order, so the text and media land one
    // after the other instead of all at once.
    const blocks = content ? [
      content.querySelector('h1'),
      content.querySelector('.em-case-meta, .about-bio, .contact-lede'),
      content.querySelector('.rv-stage, .about-xp, .contact-facts'),
      content.querySelector('.about-hero-photo, .contact-channels, .em-sec'),
      content.querySelector('.about-notes-list'),
    ].filter(Boolean) : []
    const toPage = { paddingLeft: padEnd, paddingRight: padEnd, y: targetY, duration: 0.68, ease: 'power3.inOut' }
    const tl = gsap.timeline({ onComplete: () => done.current() })
    // Where the stage puts the brand; measured once with the stage's type in
    // place, then used as the far end of the morph in both directions.
    let dy = 0
    if (stageNav) dy = Math.round(mid(stageNav) - mid(nav))
    const dyMark = brand ? Math.round(mid(brand) - mid(mark)) : 0
    if (back) {
      // Collapse: the sheet keeps its left edge at the stage and its right
      // edge travels back to the stage width, so home's list is uncovered
      // from the right while the logo/nav settle onto the stage.
      const scrollY = window.scrollY
      gsap.set(pane, { width: vw, '--pg-x': '0px' })
      gsap.set(edge, { left: vw, opacity: 1 })
      gsap.set(layer, { y: -scrollY })
      gsap.set(content, { opacity: 1, y: 0 })
      gsap.set(topbar, { opacity: 1, y: scrollY, transition: 'none' })
      gsap.set(face, { opacity: 0 })
      // The page lifts away in reverse reading order — intro, media, facts,
      // then the title — so closing reads as the open run backwards. The first
      // block gets the slowest fade and its own head start; the sheet holds its
      // full width while the copy goes, then sweeps back into the stage.
      const leave = [...blocks].reverse()
      const inDur = [0.55, 0.42, 0.36, 0.32]
      leave.forEach((el, i) => {
        tl.to(el, { opacity: 0, y: 18, duration: inDur[i] ?? 0.32, ease: 'power2.in' }, 0.05 + i * 0.17)
      })
      tl.to(pane, { width: startW, duration: 0.7, ease: 'power3.inOut' }, 0.5)
      tl.to(edge, { left: startW, duration: 0.7, ease: 'power3.inOut' }, 0.5)
      tl.to(topbar, { paddingLeft: 28, paddingRight: startRight, y: dy + scrollY, duration: 0.7, ease: 'power3.inOut' }, 0.5)
      tl.to(mark, { y: dyMark, duration: 0.7, ease: 'power3.inOut' }, 0.5)
      tl.to(nav, { gap: 16, duration: 0.7, ease: 'power3.inOut' }, 0.5)
      tl.to(content, { opacity: 0, duration: 0.24, ease: 'power1.in' }, 0.82)
      tl.to(face, { opacity: 1, duration: 0.22, ease: 'power2.out' }, 1.0)
    } else {
      gsap.set(layer, { y: -targetY })
      gsap.set(topbar, { paddingLeft: 28, paddingRight: startRight, y: dy + targetY })
      gsap.set(mark, { y: dyMark })
      gsap.set(nav, { gap: 16 })
      gsap.set(pane, { width: startW, '--pg-x': '0px' })
      gsap.set(blocks, { opacity: 0, y: 18 })
      gsap.set(face, { opacity: 1 })
      tl.to(face, { opacity: 0, y: -16, duration: 0.2, ease: 'power2.out' }, 0.02)
      // Same beat as the close: the first piece takes the longest to arrive,
      // and each next one starts after a clear pause (0.15) so the page reads
      // in one item at a time rather than as a single fade.
      const inDur = [0.52, 0.4, 0.34, 0.3]
      blocks.forEach((el, i) => {
        tl.to(el, { opacity: 1, y: 0, duration: inDur[i] ?? 0.3, ease: 'power2.out' }, 0.14 + i * 0.15)
      })
      tl.to(pane, { width: vw, duration: 0.68, ease: 'power3.inOut' }, 0.06)
      tl.to(topbar, toPage, 0.06)
      tl.to(mark, { y: 0, duration: 0.68, ease: 'power3.inOut' }, 0.06)
      tl.to(nav, { gap: 28, duration: 0.68, ease: 'power3.inOut' }, 0.06)
      if (work) tl.to(work, { opacity: 0.45, x: 26, duration: 0.68, ease: 'power3.inOut' }, 0.06)
    }
    return () => {
      tl.kill()
      gsap.killTweensOf([pane, edge, layer, topbar, mark, nav, content, face, work, ...blocks].filter(Boolean))
      gsap.set([pane, edge, layer, topbar, mark, nav, content, face, work, ...blocks].filter(Boolean), { clearProps: 'all' })
    }
  }, [back, name, slug, targetY])
  const href = slug ? '/work/' + slug : '/' + name
  return (
    <>
      {back && (
        <div className="pg-home em-root is-home" ref={homeRef} aria-hidden="true">
          <main className="sv-col page">{createElement(getPage('home'))}</main>
        </div>
      )}
      <div className="pg-pane" ref={paneRef} aria-hidden="true">
        <div className="pg-face">
          <aside className="em-stage"><StageHint>{PROFILE.tagline}</StageHint></aside>
        </div>
        <div className={'pg-pane-layer em-root is-' + name}>
          <Topbar path={href} />
          <main className="sv-col page">{createElement(getPage(name), { slug })}</main>
        </div>
      </div>
      {back && <div className="pg-fold-edge" ref={edgeRef} aria-hidden="true" />}
    </>
  )
}

// About ↔ Contact ↔ Case — the pages sit side by side like adjacent sheets and
// the whole strip moves over by one page, so the next page slides in from its
// side of the nav while the current one leaves with it. The page it replaces
// is a copy held at the live scroll position, so the first frame matches the
// page underneath exactly.
function PageRail({ name, slug, from, fromSlug, dir, targetY, onDone }) {
  const railRef = useRef(null)
  const trackRef = useRef(null)
  const done = useRef(onDone)
  done.current = onDone
  useLayoutEffect(() => {
    const rail = railRef.current
    const track = trackRef.current
    const vw = window.innerWidth
    const out = rail.querySelector('.pg-rail-out .pg-rail-layer')
    const outTopbar = out?.querySelector('.em-top')
    const incoming = rail.querySelector('.pg-rail-in .pg-rail-layer')
    const inTopbar = incoming?.querySelector('.em-top')
    if (out) {
      const scrollY = window.scrollY
      gsap.set(out, { y: -scrollY })
      gsap.set(outTopbar, { y: scrollY, transition: 'none' })
    }
    gsap.set(incoming, { y: -targetY })
    gsap.set(inTopbar, { y: targetY, transition: 'none' })
    const tl = gsap.timeline({ onComplete: () => done.current() })
    tl.to(track, { x: -dir * vw, duration: 0.72, ease: 'power3.inOut' }, 0)
    return () => {
      tl.kill()
      gsap.killTweensOf([track, out, outTopbar, incoming, inTopbar].filter(Boolean))
      gsap.set([track, out, outTopbar, incoming, inTopbar].filter(Boolean), { clearProps: 'all' })
    }
  }, [name, slug, from, fromSlug, dir, targetY])
  const inStyle = dir > 0
    ? { left: '100vw', boxShadow: '-46px 0 60px -48px rgba(24, 32, 45, 0.35), -1px 0 0 rgba(24, 32, 45, 0.06)' }
    : { left: '-100vw', boxShadow: '46px 0 60px -48px rgba(24, 32, 45, 0.35), 1px 0 0 rgba(24, 32, 45, 0.06)' }
  const hrefFor = (r, s) => (s ? '/work/' + s : '/' + r)
  return createPortal(
    <div className="pg-rail" ref={railRef} aria-hidden="true">
      <div className="pg-rail-track" ref={trackRef}>
        <div className="pg-rail-panel pg-rail-out">
          <div className={'pg-rail-layer em-root is-' + from}>
            <Topbar path={hrefFor(from, fromSlug)} />
            <main className="sv-col page">{createElement(getPage(from), { slug: fromSlug })}</main>
          </div>
        </div>
        <div className="pg-rail-panel pg-rail-in" style={inStyle}>
          <div className={'pg-rail-layer em-root is-' + name}>
            <Topbar path={hrefFor(name, slug)} />
            <main className="sv-col page">{createElement(getPage(name), { slug })}</main>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

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
  const [slide, setSlide] = useState(null)
  const [homeReturned, setHomeReturned] = useState(false)
  const lenisRef = useRef(null)
  const entryKey = useRef(null)
  const currentRoute = useRef(route)
  const stopRestore = useRef(null)
  const lastNav = useRef(0)
  const sliding = useRef(false)

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

  // Called by the slide once the stage is off screen: swap in the real page
  // and lift the overlay in the same frame, so nothing visibly changes.
  const finishSlide = (slide) => {
    if (!sliding.current || slide.nav !== lastNav.current) return
    sliding.current = false
    const next = parseRoute(slide.to)
    currentRoute.current = next
    entryKey.current = slide.key
    flushSync(() => {
      setPath(slide.to)
      setRoute(next)
      setHomeReturned(next.name === 'home')
      setSlide(null)
    })
    restoreScroll(slide.scrollY)
    scroller.lenis?.start()
  }

  const showRoute = (to, key, scrollY, nav) => {
    const from = currentRoute.current
    const next = parseRoute(to)
    const aboutish = (r) => r.name === 'about' || r.name === 'contact'
    const between = (from.name === 'home' && (aboutish(next) || next.name === 'case'))
      || ((aboutish(from) || from.name === 'case') && next.name === 'home')
    const toSheet = aboutish(next) || next.name === 'case'
    const swipe = (aboutish(from) || from.name === 'case') && toSheet && from.name !== next.name
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 861px)').matches
    if (between && !still && wide) {
      sliding.current = true
      scroller.lenis?.stop()
      const page = next.name === 'home' ? from : next
      setSlide({ kind: 'pane', name: page.name, slug: page.slug, back: next.name === 'home', to, key, scrollY, nav })
      return
    }
    if (swipe && !still) {
      sliding.current = true
      scroller.lenis?.stop()
      setSlide({ kind: 'rail', name: next.name, slug: next.slug, from: from.name, fromSlug: from.slug, dir: next.name === 'contact' ? 1 : -1, to, key, scrollY, nav })
      return
    }
    transition(() => {
      if (nav !== lastNav.current) return
      currentRoute.current = next
      entryKey.current = key
      flushSync(() => {
        setPath(to)
        setRoute(next)
        setHomeReturned(next.name === 'home')
      })
      restoreScroll(scrollY)
    })
  }

  const navigate = async (to) => {
    if (sliding.current) return
    if (to === window.location.pathname) { lenisRef.current?.scrollTo(0, { duration: 0.8 }); return } // same page: back to top
    const nav = ++lastNav.current
    // Its code first, so the page switches in one go. If that fails (say, an old
    // tab after a new deploy), a normal page load gets the current files.
    try { await loadPage(parseRoute(to).name) } catch { window.location.href = to; return }
    if (nav !== lastNav.current) return // a newer click won
    saveScroll(entryKey.current)
    stopRestore.current?.()
    const key = newKey()
    window.history.pushState({ key, idx: (window.history.state?.idx ?? 0) + 1 }, '', to)
    showRoute(to, key, 0, nav)
  }

  useEffect(() => {
    // The browser would jump before the new page renders, so we place it ourselves.
    window.history.scrollRestoration = 'manual'
    preloadPages()
    const first = window.history.state?.key || newKey()
    window.history.replaceState({ ...window.history.state, key: first, idx: window.history.state?.idx ?? 0 }, '')
    entryKey.current = first
    const onPop = async (e) => {
      if (sliding.current) { // a back press during the panel move wins
        sliding.current = false
        setSlide(null)
        scroller.lenis?.start()
      }
      const nav = ++lastNav.current
      const to = window.location.pathname
      stopRestore.current?.()
      try { await loadPage(parseRoute(to).name) } catch { window.location.reload(); return }
      if (nav !== lastNav.current) return
      saveScroll(entryKey.current)
      const key = e.state?.key ?? null
      showRoute(to, key, scrolls[key] ?? 0, nav)
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

  // Fade-up reveal for anything marked .reveal, re-armed on every route. It starts
  // a screen ahead, so a card is already showing by the time it scrolls into view.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px 100% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [route])

  return (
    <div className={'em-root is-' + route.name + (slide ? ' is-sliding' : '') + (homeReturned ? ' is-home-returned' : '')}>
      {/* The slide brings its own topbar (PagePane morphs it into the stage,
          PageRail renders one per sheet); leaving this one up during a slide
          leaves a second, static logo/nav floating over the uncovered home. */}
      {route.name !== 'home' && route.name !== 'flowy' && !slide && <Topbar path={path} />}
      <main className="sv-col page" key={path}>
        {createElement(getPage(route.name), { slug: route.slug })}
        {slide && (slide.kind === 'rail'
          ? <PageRail name={slide.name} slug={slide.slug} from={slide.from} fromSlug={slide.fromSlug} dir={slide.dir} targetY={slide.scrollY} onDone={() => finishSlide(slide)} />
          : <PagePane name={slide.name} slug={slide.slug} back={slide.back} targetY={slide.scrollY} onDone={() => finishSlide(slide)} />)}
      </main>
    </div>
  )
}
