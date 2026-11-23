const SNAPS = [
  { src: '/sai-stage.jpg', alt: 'Sai speaking on stage with a microphone' },
  { src: '/sai-talk.jpg', alt: 'Sai presenting to an audience' },
  { src: '/sai-raw-setup-clean.jpg', alt: 'Sai and a teammate working at RAW Coffee Lounge' },
  { src: '/sai-team.jpg', alt: 'Sai with teammates' },
  { src: '/sai-swc.jpg', alt: 'Sai at Startup World Cup Myanmar' },
  { src: '/sai-portrait.jpg', alt: 'Portrait of Sai Myo Thu' },
]

export default function SnapsPage() {
  return (
    <div className="em-snaps">
      {SNAPS.map((shot) => (
        <figure key={shot.src}>
          <img src={shot.src} alt={shot.alt} />
        </figure>
      ))}
    </div>
  )
}
