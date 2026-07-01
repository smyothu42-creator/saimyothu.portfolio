import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// Circle cursor: a ring trails the pointer. When hovering a Selected Work card
// (.case) the ring swaps out for a "View project" chip. Skipped on touch /
// coarse-pointer devices.
export default function Cursor() {
  const ringRef = useRef(null)
  const chipRef = useRef(null)

  const isFine =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: fine)').matches

  useGSAP(() => {
    if (!isFine) return
    const ring = ringRef.current
    const chip = chipRef.current

    gsap.set([ring, chip], { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(chip, { scale: 0.6 })

    const xRing = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })
    const xChip = gsap.quickTo(chip, 'x', { duration: 0.45, ease: 'power3' })
    const yChip = gsap.quickTo(chip, 'y', { duration: 0.45, ease: 'power3' })

    let shown = false
    let onCase = false
    let onProject = false
    let onHot = false
    const HOT = 'button, a[href], [data-magnetic]'
    const onMove = (e) => {
      if (!shown) {
        shown = true
        if (!onCase && !onProject && !onHot) gsap.to(ring, { opacity: 1, duration: 0.3 })
      }
      xRing(e.clientX); yRing(e.clientY)
      xChip(e.clientX); yChip(e.clientY)
    }

    const enterCase = () => {
      onCase = true
      gsap.to(ring, { opacity: 0, scale: 0.4, duration: 0.25, ease: 'power3' })
      gsap.to(chip, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' })
    }
    const leaveCase = () => {
      onCase = false
      gsap.to(ring, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3' })
      gsap.to(chip, { opacity: 0, scale: 0.6, duration: 0.25, ease: 'power3' })
    }

    // Hide the circle cursor over Playground rows — the floating thumbnail
    // is the visual there.
    const enterProject = () => {
      onProject = true
      gsap.to(ring, { opacity: 0, duration: 0.2, ease: 'power3' })
    }
    const leaveProject = () => {
      onProject = false
      gsap.to(ring, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3' })
    }

    // Hide the ring over interactive controls (menu button, icon buttons, links).
    const enterHot = () => { onHot = true; gsap.to(ring, { opacity: 0, duration: 0.2, ease: 'power3' }) }
    const leaveHot = () => { onHot = false; gsap.to(ring, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3' }) }

    // The chip shows only over the project card image (.case .card), not the
    // title/tags/description beneath it.
    const onOver = (e) => {
      if (e.target.closest('.case .card')) enterCase()
      else if (e.target.closest('.project')) enterProject()
      else if (e.target.closest(HOT)) enterHot()
    }
    const onOut = (e) => {
      if (e.target.closest('.case .card') && !e.relatedTarget?.closest('.case .card')) leaveCase()
      if (e.target.closest('.project') && !e.relatedTarget?.closest('.project')) leaveProject()
      if (e.target.closest(HOT) && !e.relatedTarget?.closest(HOT)) leaveHot()
    }
    const onLeaveWin = () => gsap.to([ring, chip], { opacity: 0, duration: 0.25 })
    const onEnterWin = () => { if (!onCase && !onProject && !onHot) gsap.to(ring, { opacity: 1, duration: 0.25 }) }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeaveWin)
    document.addEventListener('mouseenter', onEnterWin)

    // Magnetic pull via delegation, so every [data-magnetic] follows the cursor —
    // including dynamically-rendered ones (footer icons, case study, about page).
    const onMagMove = (e) => {
      const el = e.target.closest?.('[data-magnetic]')
      if (!el) return
      const r = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.35,
        y: (e.clientY - (r.top + r.height / 2)) * 0.35,
        duration: 0.4, ease: 'power3',
      })
    }
    const onMagOut = (e) => {
      const from = e.target.closest?.('[data-magnetic]')
      if (!from) return
      const to = e.relatedTarget?.closest?.('[data-magnetic]')
      if (to !== from) gsap.to(from, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }
    document.addEventListener('mousemove', onMagMove)
    document.addEventListener('mouseout', onMagOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeaveWin)
      document.removeEventListener('mouseenter', onEnterWin)
      document.removeEventListener('mousemove', onMagMove)
      document.removeEventListener('mouseout', onMagOut)
    }
  }, [])

  if (!isFine) return null

  return (
    <>
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-chip" ref={chipRef}>View project</div>
    </>
  )
}
