import { useRef, useState } from 'react'

// Shared "drag the selection pill" behaviour, used by the side menu, the
// case-study "On this page" list and the Works filter.
//
// Grab the pill, slide it along its row/column, let go on the option you
// want. A short press without movement is left alone, so normal clicks still
// work. The click the browser fires right after a drag is swallowed (see
// `blockClick`), so it can't undo the drop.
//
//   root     ref to the container the pill and items are positioned in
//   axis     'x' | 'y', or a function returning one (e.g. by screen width)
//   items    () => [{ key, el }] in order
//   pill     current pill box { x, y, w, h } in the container's coordinates
//   current  key of the selected item
//   onPick   (key) => void, called on drop when the target changed
export function useDragPill({ root, axis = 'x', items, pill, current, onPick }) {
  const [drag, setDrag] = useState(null) // { pos, near } while dragging
  const g = useRef(null)
  const blocked = useRef(false)

  const ax = () => (typeof axis === 'function' ? axis() : axis)
  const box = (el) => (ax() === 'x' ? { a: el.offsetLeft, s: el.offsetWidth } : { a: el.offsetTop, s: el.offsetHeight })
  const pillA = () => (ax() === 'x' ? pill.x : pill.y)
  const pillS = () => (ax() === 'x' ? pill.w : pill.h)
  const client = (e) => (ax() === 'x' ? e.clientX : e.clientY)
  const rootA = () => {
    const r = root.current.getBoundingClientRect()
    return ax() === 'x' ? r.left - root.current.scrollLeft : r.top - root.current.scrollTop
  }

  const nearest = (center) => {
    let best = current, d = Infinity
    items().forEach(({ key, el }) => {
      if (!el) return
      const b = box(el)
      const dd = Math.abs(b.a + b.s / 2 - center)
      if (dd < d) { d = dd; best = key }
    })
    return best
  }

  const onPointerDown = (e) => {
    if (!pill || !root.current || (e.button ?? 0) > 0) return
    const p = client(e) - rootA()
    if (p < pillA() || p > pillA() + pillS()) return // only from the pill itself
    g.current = { id: e.pointerId, start: client(e), offset: p - pillA(), moved: false, last: null }
  }

  const onPointerMove = (e) => {
    const s = g.current
    if (!s || s.id !== e.pointerId) return
    if (!s.moved && Math.abs(client(e) - s.start) < 4) return
    if (!s.moved) {
      s.moved = true
      try { root.current.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ }
    }
    const list = items().filter((i) => i.el)
    const first = box(list[0].el)
    const last = box(list[list.length - 1].el)
    const min = first.a
    const max = last.a + last.s - pillS()
    const pos = Math.max(min, Math.min(max, client(e) - rootA() - s.offset))
    const d = { pos, near: nearest(pos + pillS() / 2) }
    s.last = d
    setDrag(d)
  }

  const onPointerUp = (e) => {
    const s = g.current
    g.current = null
    if (!s || !s.moved) return
    try { root.current?.releasePointerCapture(e.pointerId) } catch { /* not captured */ }
    setDrag(null)
    // the click that follows a drag must not count as a pick
    blocked.current = true
    setTimeout(() => { blocked.current = false }, 350)
    const target = s.last?.near ?? current
    if (target !== current) onPick(target)
  }

  // Call at the start of an item's onClick: returns true (and cancels the
  // click) when it's the stray click right after a drag.
  const blockClick = (e) => {
    if (!blocked.current) return false
    e.preventDefault()
    e.stopPropagation()
    return true
  }

  // Pill position to render: follows the pointer while dragging.
  const pillStyle = () => {
    if (!pill) return undefined
    const x = drag && ax() === 'x' ? drag.pos : pill.x
    const y = drag && ax() === 'y' ? drag.pos : pill.y
    return { transform: `translate(${x}px, ${y}px)` }
  }

  return {
    dragging: !!drag,
    near: drag ? drag.near : null,
    pillStyle,
    blockClick,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}
