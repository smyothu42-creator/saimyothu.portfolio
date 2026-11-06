import puppeteer from '/Users/saimyothu/claude-workspace/superfine/node_modules/.pnpm/puppeteer-core@24.37.5/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
export async function launch(w = 390, h = 844, dpr = 2) {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    protocolTimeout: 600000, headless: 'new', args: [`--window-size=${w},${h}`, '--hide-scrollbars', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=' + dpr],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dpr, isMobile: false, hasTouch: false })
  return { browser, page }
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// Click the topmost visible button whose text/aria-label matches (exact first).
export async function clickText(page, text) {
  const pt = await page.evaluate((text) => {
    const norm = (e) => (e.getAttribute('aria-label') || e.innerText || '').trim().replace(/\s+/g, ' ')
    const els = [...document.querySelectorAll('button,a,[role=button],[role=tab],[role=slider]')].filter((e) => {
      const r = e.getBoundingClientRect()
      if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) return false
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
      return top && (e === top || e.contains(top))
    })
    if (text.startsWith('$')) { const q = [...document.querySelectorAll(text.slice(1))].filter((e) => e.getBoundingClientRect().height); var picked = q[0] }
    const all = [...document.querySelectorAll('button,a,[role=button],[role=tab],[role=radio],[role=checkbox],label')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height })
    const find = (list) => list.find((e) => norm(e) === text) || list.find((e) => norm(e).startsWith(text)) || list.find((e) => norm(e).includes(text))
    const el = picked || find(els) || find(all)
    if (!el) return null
    el.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    const r = el.getBoundingClientRect()
    return [r.x + r.width / 2, r.y + r.height / 2]
  }, text)
  if (!pt) throw new Error('not found: ' + text)
  await page.mouse.move(pt[0], pt[1], { steps: 8 })
  await page.mouse.click(pt[0], pt[1], { delay: 60 })
  return pt
}
export async function buttons(page) {
  return page.evaluate(() => [...document.querySelectorAll('button,a,[role=button],[role=slider]')].filter((e) => { const r = e.getBoundingClientRect(); if (!r.height) return false; const t = document.elementFromPoint(r.x + r.width/2, r.y + r.height/2); return t && (e === t || e.contains(t)) }).map((e) => (e.getAttribute('aria-label') || e.innerText).trim().replace(/\s+/g, ' ').slice(0, 50)).filter(Boolean))
}
// Drag a slide-to-confirm knob (button whose aria-label starts with `label`, inside a rounded track) to the end.
export async function slide(page, label) {
  const b = await page.evaluate((label) => {
    const el = [...document.querySelectorAll('button[aria-label]')].find((e) => e.getAttribute('aria-label').startsWith(label) && e.getBoundingClientRect().height && e.className.includes('cursor-grab'))
    if (!el) return null
    el.scrollIntoView({ block: 'nearest' })
    const r = el.getBoundingClientRect(), t = el.parentElement.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, end: t.right - r.width / 2 - 4 }
  }, label)
  if (!b) throw new Error('no slider ' + label)
  await page.mouse.move(b.x, b.y)
  await page.mouse.down()
  await page.mouse.move(b.end, b.y, { steps: 30 })
  await new Promise((r) => setTimeout(r, 120))
  await page.mouse.up()
}
