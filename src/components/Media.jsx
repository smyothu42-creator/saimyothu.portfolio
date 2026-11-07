// Cover tile: the case image if there is one, otherwise a coloured wordmark.
// Off-screen art waits until it is scrolled near (lazy); the case cover, the first thing
// on its page, loads straight away and first (eager).
export default function Media({ art, title, aspect, eager = false }) {
  return (
    <div className="media" style={{ aspectRatio: aspect, background: art.bg }}>
      {art.img ? (
        <img src={art.img} alt={title} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
      ) : (
        <span className="media-mark" style={{ color: art.color }}>{art.text}</span>
      )}
    </div>
  )
}
