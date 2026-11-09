// Cover tile: the case image if there is one, otherwise a coloured wordmark.
// Off-screen art waits until it is scrolled near (lazy); the case cover, the first thing
// on its page, loads straight away and first (eager).
// `video` (the case cover only): a muted looping clip in place of the image,
// with the image as its poster. Phones get the smaller art.videoSm when there is
// one. With reduced motion or Data Saver it stays on the poster.
import { useEffect, useRef, useState } from 'react'

const still = () => typeof window !== 'undefined' && (
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData
)
const isPhone = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 700px)').matches

export default function Media({ art, title, aspect, eager = false, video }) {
  const ref = useRef(null)
  const [noMotion] = useState(still)
  const [clip] = useState(() => (isPhone() && art.videoSm) || video)
  useEffect(() => {
    if (video && !noMotion) ref.current?.play().catch(() => {})
  }, [video, noMotion])
  return (
    <div className={'media' + (video ? ' is-video' : '')} style={{ aspectRatio: aspect, background: art.bg }}>
      {video ? (
        <video ref={ref} src={noMotion ? undefined : clip} poster={art.poster || art.img} autoPlay={!noMotion} muted loop playsInline preload={noMotion ? 'none' : 'auto'} aria-label={title} />
      ) : art.img ? (
        <img src={art.img} alt={title} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
      ) : (
        <span className="media-mark" style={{ color: art.color }}>{art.text}</span>
      )}
    </div>
  )
}
