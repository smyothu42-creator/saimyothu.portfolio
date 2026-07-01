import { createContext, useCallback, useContext, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const ThumbCtx = createContext({ show: () => {}, hide: () => {} })
export const useThumb = () => useContext(ThumbCtx)

// Floating, cursor-following preview shared across the app.
// GSAP quickTo gives the smooth "lerp" follow the original used a rAF loop for.
export function ThumbProvider({ children }) {
  const thumbRef = useRef(null)
  const paneRef = useRef(null)
  const xTo = useRef(null)
  const yTo = useRef(null)

  useGSAP(() => {
    xTo.current = gsap.quickTo(thumbRef.current, 'left', { duration: 0.5, ease: 'power3' })
    yTo.current = gsap.quickTo(thumbRef.current, 'top', { duration: 0.5, ease: 'power3' })
    const onMove = (e) => {
      xTo.current(e.clientX)
      yTo.current(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, { scope: thumbRef })

  const show = useCallback((color, label) => {
    if (!paneRef.current) return
    paneRef.current.style.background = color
    paneRef.current.textContent = label
    thumbRef.current.classList.add('show')
    document.body.classList.add('thumb-active') // hides the circle cursor (see CSS)
  }, [])

  const hide = useCallback(() => {
    thumbRef.current?.classList.remove('show')
    document.body.classList.remove('thumb-active')
  }, [])

  return (
    <ThumbCtx.Provider value={{ show, hide }}>
      {children}
      <div id="thumb" ref={thumbRef}>
        <div className="pane" ref={paneRef} />
      </div>
    </ThumbCtx.Provider>
  )
}
