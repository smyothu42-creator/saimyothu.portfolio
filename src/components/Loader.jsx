import { useEffect, useState } from 'react'
import { PROFILE } from '../data'

// First-load / reload screen (not shown on in-site navigation).
//
// Six tall frosted-glass panels cover the screen side by side. The name sits
// large in the middle (each word slides up from behind a mask), with small
// editorial details in the corners, a thin counter climbing 000 -> 100 at the
// bottom right and a hairline progress line along the bottom. When the
// backdrop photo and fonts are ready, the text slides up and out and the
// panels lift away one after another, like a blind opening onto the site.

const MIN_MS = 280
const MAX_MS = 900
const LEAVE_MS = 220

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

export default function Loader() {
  const [state, setState] = useState('loading') // loading | leaving | done

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let ready = false
    let shown = 0
    let raf = 0

    // the counter eases toward 88 while loading, then runs to 100 when ready
    const tick = () => {
      const t = performance.now() - start
      const goal = ready ? 100 : Math.min(88, (t / MAX_MS) * 150)
      shown += (goal - shown) * (ready ? 0.1 : 0.05)
      if (ready && shown > 99.5 && t >= (reduced ? 80 : MIN_MS)) {
        setTimeout(() => setState('leaving'), reduced ? 0 : 80)
        setTimeout(() => setState('done'), reduced ? 250 : 250 + LEAVE_MS)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const bg = getComputedStyle(document.querySelector('.sv-backdrop') || document.body).backgroundImage
    const urls = [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1])
    Promise.race([
      Promise.all([document.fonts?.ready, ...urls.map(preload)]),
      new Promise((r) => setTimeout(r, MAX_MS)),
    ]).then(() => { ready = true })

    document.documentElement.classList.add('is-loading')
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  useEffect(() => {
    if (state !== 'loading') document.documentElement.classList.remove('is-loading')
  }, [state])

  if (state === 'done') return null
  return (
    <div className="dl-loader" data-state={state} aria-live="polite" aria-label="Loading">
      <p>{PROFILE.name}</p>
    </div>
  )
}
