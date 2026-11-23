// Shared handle to the page's Lenis smooth-scroll instance (set in App), so
// components can scroll programmatically without fighting it.
export const scroller = { lenis: null }

export function scrollToY(y, duration = 0.8) {
  if (scroller.lenis) scroller.lenis.scrollTo(y, { duration, immediate: duration === 0 })
  else window.scrollTo({ top: y, behavior: duration === 0 ? 'instant' : 'smooth' })
}
