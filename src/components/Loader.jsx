import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SIGNATURE_LETTERS } from './signaturePaths'

// Intro: the "Saimt." signature (real Yellowtail glyph outlines, same face as
// the hero logo) is *written on* the way you'd write by hand — each letter is
// drawn stroke-by-stroke via stroke-dashoffset, one after the next, then inked
// solid black. Once written, the panel slides up like the page-transition
// curtain to reveal the home page.
export default function Loader({ onComplete }) {
  const root = useRef(null)
  const sig = useRef(null)

  useGSAP(() => {
    let killed = false

    const build = () => {
      if (killed) return
      const letters = gsap.utils.toArray('.loader-letter', sig.current)

      // Start hidden: each outline undrawn (dash fully offset) and un-inked.
      gsap.set(letters, { strokeDashoffset: 1, fillOpacity: 0 })

      const tl = gsap.timeline()
      tl.from(sig.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' })

      // Write each letter on in writing order, slightly overlapping so it flows
      // like a continuous hand rather than stamping one glyph at a time.
      letters.forEach((el, i) => {
        const dur = 0.34 + i * 0.04 // wider letters take a touch longer
        tl.to(el, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' }, i === 0 ? 0.2 : '-=0.12')
          // ink the letter solid just after its outline lands
          .to(el, { fillOpacity: 1, duration: 0.25, ease: 'power1.out' }, '-=0.16')
      })

      tl.to(sig.current, { scale: 1.02, duration: 0.5, ease: 'power2.out' }, '+=0.15')
        // curtain wipe up to reveal the home page
        .to(root.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.classList.remove('loading')
            onComplete?.()
          },
        }, '+=0.3')
    }

    // Wait for Yellowtail to load so the signature renders correctly.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build)
    } else {
      build()
    }

    return () => { killed = true }
  }, { scope: root })

  return (
    <div id="loader" ref={root}>
      <svg ref={sig} className="loader-sig" viewBox="0 0 600 240" role="img" aria-label="Saimt.">
        {/* Real baseline coords from the font; this <g> centres the word. */}
        <g transform="translate(119, 21)">
          {SIGNATURE_LETTERS.map((letter) => (
            <path
              key={letter.key}
              className="loader-letter"
              d={letter.d}
              pathLength="1"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
