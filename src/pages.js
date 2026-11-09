// Each page's code loads on its own, so a visitor to Home doesn't download every
// case study component. App switches page only once the code has arrived, so
// the new page renders in one go (its reveal animations and the view transition
// both expect it to be there straight away).
const IMPORTS = {
  home: () => import('./components/Home'),
  about: () => import('./components/AboutPage'),
  case: () => import('./components/CaseStudy'),
}
const loaded = {}

export const loadPage = (name) => IMPORTS[name]().then((m) => { loaded[name] = m.default })
export const getPage = (name) => loaded[name]

// Tiny path router: /work/<slug> → case study, /about, else → home.
export function parseRoute(pathname) {
  const m = pathname.match(/^\/work\/([\w-]+)\/?$/)
  if (m) return { name: 'case', slug: m[1] }
  if (/^\/about\/?$/.test(pathname)) return { name: 'about' }
  return { name: 'home' } // includes /work, the old Work page
}

// Once the page is idle, fetch the other pages so moving between them is instant.
export function preloadPages() {
  if (navigator.connection?.saveData) return
  const run = () => Object.keys(IMPORTS).forEach((name) => { if (!loaded[name]) loadPage(name).catch(() => {}) })
  if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}
