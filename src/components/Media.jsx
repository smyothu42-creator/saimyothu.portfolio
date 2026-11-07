// Cover tile: the case image if there is one, otherwise a coloured wordmark.
// Off-screen art waits until it is scrolled near (lazy); the case cover, the first thing
// on its page, loads straight away and first (eager).
// `video` (the case cover only): a muted looping clip in place of the image,
// with the image as its poster; with reduced motion it stays on the poster.
import { useEffect, useRef } from 'react'

const still = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
export default function Media({ art, title, aspect, eager = false, video }) {
  // Browsers hold back a video's download while the first-load screen covers
  // the page, so the cover film would only start loading once it lifts. Fetch
  // it ourselves from the start instead: it is in the cache by the time it is
  // needed, and if the video still hasn't begun, it plays from that copy.
  const ref = useRef(null)
  useEffect(() => {
    if (!video) return
    const ctl = new AbortController()
    let url = null
    fetch(video, { signal: ctl.signal, priority: 'high' })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => {
        const v = ref.current
        if (!b || !v || v.readyState >= 3) return
        url = URL.createObjectURL(b)
        v.src = url
        if (!still()) v.play().catch(() => {})
      })
      .catch(() => {})
    return () => { ctl.abort(); if (url) URL.revokeObjectURL(url) }
  }, [video])
  return (
    <div className={'media' + (video ? ' is-video' : '')} style={{ aspectRatio: aspect, background: art.bg }}>
      {video ? (
        <video ref={ref} src={video} poster={art.poster || art.img} autoPlay={!still()} muted loop playsInline preload="auto" aria-label={title} />
      ) : art.img ? (
        <img src={art.img} alt={title} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
      ) : (
        <span className="media-mark" style={{ color: art.color }}>{art.text}</span>
      )}
    </div>
  )
}
