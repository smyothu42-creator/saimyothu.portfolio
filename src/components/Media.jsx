// Cover tile: the case image if there is one, otherwise a coloured wordmark.
// Off-screen art waits until it is scrolled near (lazy); the case cover, the first thing
// on its page, loads straight away and first (eager).
// `video` (the case cover only): a muted looping clip in place of the image,
// with the image as its poster; with reduced motion it stays on the poster.
const still = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
export default function Media({ art, title, aspect, eager = false, video }) {
  return (
    <div className={'media' + (video ? ' is-video' : '')} style={{ aspectRatio: aspect, background: art.bg }}>
      {video ? (
        <video src={video} poster={art.poster || art.img} autoPlay={!still()} muted loop playsInline preload="auto" aria-label={title} />
      ) : art.img ? (
        <img src={art.img} alt={title} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
      ) : (
        <span className="media-mark" style={{ color: art.color }}>{art.text}</span>
      )}
    </div>
  )
}
