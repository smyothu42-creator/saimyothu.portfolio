import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Inline chat panel shown ABOVE the hero chat box. It expands open (GSAP height
// reveal), pushing the page down. There is no input here — the hero chat box is
// the single, persistent input.
export default function ChatSheet({ open, messages, typing, onClose }) {
  const panelRef = useRef(null)
  const bodyRef = useRef(null)

  // Expand / collapse by animating height; page content below reflows down.
  useGSAP(() => {
    const el = panelRef.current
    if (open) {
      gsap.set(el, { display: 'block' })
      gsap.fromTo(
        el,
        { height: 0, autoAlpha: 0 },
        { height: 'auto', autoAlpha: 1, duration: 0.7, ease: 'power4.out', onComplete: () => ScrollTrigger.refresh() },
      )
    } else {
      gsap.to(el, {
        height: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.in',
        onComplete: () => { gsap.set(el, { display: 'none' }); ScrollTrigger.refresh() },
      })
    }
  }, { dependencies: [open] })

  // Animate each newly added bubble in.
  useGSAP(() => {
    const items = bodyRef.current?.querySelectorAll('.chat-msg')
    if (!items?.length) return
    gsap.from(items[items.length - 1], { autoAlpha: 0, y: 18, duration: 0.5, ease: 'power3.out' })
  }, { dependencies: [messages.length], scope: bodyRef })

  useGSAP(() => {
    if (typing) gsap.from('.chat-typing', { autoAlpha: 0, y: 14, duration: 0.4, ease: 'power3.out' })
  }, { dependencies: [typing], scope: bodyRef })

  // Pin to the latest message.
  useEffect(() => {
    const b = bodyRef.current
    if (b) gsap.to(b, { scrollTop: b.scrollHeight, duration: 0.5, ease: 'power3.out' })
  }, [messages, typing])

  return (
    <div className="chat-panel" ref={panelRef}>
      <div className="chat-panel-inner">
        <div className="chat-head">
          <div className="chat-head-id">
            <span className="chat-dot" />
            <span className="chat-head-name">Ask Sai</span>
            <span className="chat-head-sub">usually replies instantly</span>
          </div>
          <button className="chat-close" onClick={onClose} aria-label="Close chat" data-magnetic>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
          </button>
        </div>

        <div className="chat-body" ref={bodyRef} data-lenis-prevent>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div className="chat-bubble">{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="chat-msg ai chat-typing">
              <div className="chat-bubble chat-bubble-typing"><span /><span /><span /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
