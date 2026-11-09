/* global __AVIF__ */
// Serves the AVIF of a photo when there is one and the browser can show it.
// __AVIF__ is the list of AVIFs in public/, read at build time (vite.config.js),
// so a new photo without an AVIF just stays a JPG. tools/avif.mjs makes them.
// Browsers that understand image-set types all decode AVIF, and it can be
// checked before the first render, so no wrapper <picture> is needed.
const SUPPORTED = typeof CSS !== 'undefined' && CSS.supports?.('background-image', 'image-set(url("a.avif") type("image/avif"))')
const HAVE = new Set(__AVIF__)
const IMAGE = /^(\/[^?#]*)\.(?:jpe?g|png)((?:[?#].*)?)$/i

export function avif(src) {
  if (!SUPPORTED || typeof src !== 'string') return src
  const m = src.match(IMAGE)
  return m && HAVE.has(m[1]) ? `${m[1]}.avif${m[2]}` : src
}

// Swaps every image path inside the site's content (data.js), in place.
export function avifAll(node) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => { if (typeof v === 'string') node[i] = avif(v); else avifAll(v) })
  } else if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      if (typeof node[k] === 'string') node[k] = avif(node[k])
      else avifAll(node[k])
    }
  }
}
