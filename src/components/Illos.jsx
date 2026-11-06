// Hand-drawn illustrations by Pablo Stanley: Open Doodles (scenes) and Open
// Peeps (busts), both CC0. The files live in /public/illustrations, with the
// sets' accents recoloured.
//
// `Illo` renders a scene by name (section openers); `Person` renders a bust
// (target users). Names are the `illo` keys used in data.js.

const SCENES = {
  table: 'guest-ordering',
  juggle: 'order-chaos',
  lunch: 'lunch-delivery',
  research: 'research',
  idea: 'reflection',
  shipping: 'role-shipping',
  reading: 'role-reading',
}

const PEOPLE = ['guest', 'staff', 'owner', 'employee', 'customer', 'driver', 'ops']

// Each drawing comes in two colour versions (public/illustrations/color and
// color-dark): the accent and the people's skin and shirts are coloured. The
// dark-glass version (cream lines) shows on the cards; the light version is
// used inside the light plates (selv.css picks).
// The scene doodles on the dark cards use hand-painted PNGs
// (public/illustrations/painted: skin, hair, clothes and objects filled in).
function Pair({ file, className, dark }) {
  return (
    <>
      <img className={className + ' illo-on-light'} src={`/illustrations/color/${file}.svg`} alt="" aria-hidden="true" loading="lazy" />
      <img className={className + ' illo-on-dark is-sticker'} src={dark || `/illustrations/color-dark/${file}.svg`} alt="" aria-hidden="true" loading="lazy" />
    </>
  )
}

export function Illo({ name, className = 'cs-illo' }) {
  const file = SCENES[name]
  if (!file) return null
  return <Pair file={file} className={className} dark={`/illustrations/painted/${file}.png`} />
}

export function Person({ name, className = 'st-person' }) {
  if (!PEOPLE.includes(name)) return null
  return <Pair file={`peep-${name}`} className={className + ' is-peep'} />
}
