// Cover tile: the case image if there is one, otherwise a coloured wordmark.
export default function Media({ art, title, aspect }) {
  return (
    <div className="media" style={{ aspectRatio: aspect, background: art.bg }}>
      {art.img ? (
        <img src={art.img} alt={title} />
      ) : (
        <span className="media-mark" style={{ color: art.color }}>{art.text}</span>
      )}
    </div>
  )
}
