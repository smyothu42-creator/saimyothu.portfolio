import { lazy, Suspense } from 'react'
import { BACKDROP } from '../data'

// The fixed backdrop the glass cards blur over, picked by BACKDROP in data.js.
// 'calm' is plain CSS. The other options (BackdropScenes.jsx) pull in much more
// code, so they only load if one of them is chosen.
const Scenes = lazy(() => import('./BackdropScenes'))

export default function Backdrop() {
  if (BACKDROP === 'calm') return <div className="sv-backdrop is-photo is-calm" aria-hidden="true" />
  return <Suspense fallback={null}><Scenes /></Suspense>
}
