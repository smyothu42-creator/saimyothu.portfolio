import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ChatSheet from './ChatSheet'

// Pre-made prompts shown in the dropdown when the chat box is focused.
const SUGGESTIONS = [
  'What was your role and impact?',
  'Walk me through your design process',
  'Which tools do you work with?',
  'How can we work together?',
]

// Phrases the second hero line types out, one after another, on a loop.
const TYPING_PHRASES = [
  'he worked at startup companies',
  'he is solving complex problems',
  'he loves simple things',
]

// Canned "AI" answers — keyword-matched to keep the demo self-contained.
function getAnswer(q) {
  const s = q.toLowerCase()
  if (/(role|impact|responsib|lead)/.test(s))
    return "I usually own product design end-to-end — framing the problem, research, system design, and shipping polished UI. On Retina AI I was the only designer, so I ran the research, designed the whole flow, and built the front-end alongside the team."
  if (/(process|approach|method|workflow)/.test(s))
    return "My process in five beats: understand the problem, research with real users, map the system, prototype fast, then test → refine → build. I like keeping a tight loop between design and code so ideas get pressure-tested early."
  if (/(tool|figma|stack|software|tech)/.test(s))
    return "I design in Figma and prototype in code. Day to day that's React, TypeScript, and GSAP for motion — plus a bit of Node and Python when a project needs it. This very site is React + Vite + GSAP."
  if (/(work together|hire|contact|collaborat|reach|email|project|freelance)/.test(s))
    return "Let's do it. The fastest way is email — hello@saimyothu.com — or open the menu and hit \"Send me an email\". Tell me a bit about the project, timeline, and what success looks like, and I'll take it from there."
  return "Good question! I'm Sai — a product designer based in Myanmar. Ask me about my role & impact, my design process, the tools I use, or how we can work together."
}

// Centered big-name hero: the name reveals up from behind a mask, the mono
// subtitle fades in beneath it. Entrance plays once `loaded` is true.
export default function Hero({ loaded }) {
  const ref = useRef(null)
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const timerRef = useRef(null)
  const [typed, setTyped] = useState('')

  // Typewriter for the second hero line: type a phrase, hold, delete, advance —
  // looping forever. Starts once the hero has revealed (loaded).
  useEffect(() => {
    if (!loaded) return
    let phrase = 0, char = 0, deleting = false, timer
    const tick = () => {
      const full = TYPING_PHRASES[phrase]
      if (!deleting) {
        char += 1
        setTyped(full.slice(0, char))
        if (char === full.length) { deleting = true; timer = setTimeout(tick, 2000); return }
        timer = setTimeout(tick, 95)
      } else {
        char -= 1
        setTyped(full.slice(0, char))
        if (char === 0) { deleting = false; phrase = (phrase + 1) % TYPING_PHRASES.length; timer = setTimeout(tick, 480); return }
        timer = setTimeout(tick, 48)
      }
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [loaded])

  // Click a suggestion: fill the box with the question and close the dropdown.
  const pick = (q) => {
    setValue(q)
    setOpen(false)
  }

  // Send a message → open the sheet, add the user bubble, then a delayed AI reply.
  const ask = (raw) => {
    const q = (raw ?? '').trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setSheetOpen(true)
    setOpen(false)
    setValue('')
    setTyping(true)
    clearTimeout(timerRef.current)
    // Reply delay scales a little with answer length for a natural feel.
    const answer = getAnswer(q)
    timerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', text: answer }])
    }, 1100 + Math.min(answer.length * 6, 900))
  }

  useGSAP(() => {
    const root = ref.current
    const $ = (sel) => root.querySelectorAll(sel)

    // GSAP owns the transforms so the reveal lands exactly (no CSS % transform).
    gsap.set($('.hero-lead-text'), { autoAlpha: 0, y: 28 })
    gsap.set($('.hero-ai'), { autoAlpha: 0, y: 24 })

    if (!loaded) return

    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to($('.hero-lead-text'), { autoAlpha: 1, y: 0, duration: 1 }, 0.1)
      .to($('.hero-ai'), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
  }, { dependencies: [loaded], scope: ref })

  return (
    <header className="hero" id="top" ref={ref}>
      <div className="hero-lead">
        <p className="hero-lead-text">
          Sai is a Product Designer<br />
          <span className="hero-typed">
            {typed}
            <span className="hero-caret" aria-hidden="true" />
          </span>
        </p>

        <ChatSheet
          open={sheetOpen}
          messages={messages}
          typing={typing}
          onClose={() => setSheetOpen(false)}
        />

      <form className="hero-ai" onSubmit={(e) => { e.preventDefault(); ask(value) }}>
        <input
          className="hero-ai-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          placeholder="Ask anything about me…"
          aria-label="Ask about Sai"
        />
        <button className="hero-ai-send" type="submit" aria-label="Send" data-magnetic>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {open && (
          <ul className="hero-ai-menu" role="listbox">
            <li className="hero-ai-menu-head">Try asking</li>
            {SUGGESTIONS.map((q) => (
              <li key={q}>
                {/* onMouseDown (not onClick) so the pick fires before the input
                    blur closes the menu. */}
                <button
                  type="button"
                  className="hero-ai-option"
                  onMouseDown={(e) => { e.preventDefault(); pick(q) }}
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      </div>
    </header>
  )
}
