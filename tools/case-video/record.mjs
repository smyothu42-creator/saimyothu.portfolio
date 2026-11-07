// Record a scripted session of the driver prototype as timestamped JPEG frames.
// usage: node record.mjs <out-dir> <steps.json>
// steps: ["#Chapter caption", "click text", "~slide label", "@ms", "!scroll y"]
import fs from 'node:fs'
import { launch, sleep, clickText, slide, buttons } from './lib.mjs'
const [out, stepsFile, url = 'http://localhost:5173/', W = 390, H = 844] = process.argv.slice(2)
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8'))
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true })
const DPR = +(process.env.DPR || 2); const { browser, page } = await launch(+W, +H, DPR)
if (process.env.LIGHT) { await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await page.evaluateOnNewDocument(() => { try { localStorage.setItem('theme', 'light') } catch {} }) }
// MOCKS=file.mjs: answer matching requests in the browser (default export [{ method, re, body(url) }]),
// e.g. so a recorded checkout never places a real order.
if (process.env.MOCKS) {
  const mocks = (await import(new URL(process.env.MOCKS, 'file://' + process.cwd() + '/').href)).default
  await page.setRequestInterception(true)
  page.on('request', (rq) => {
    const m = mocks.find((x) => (!x.method || x.method === rq.method()) && x.re.test(rq.url()))
    if (!m) return rq.continue()
    rq.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(m.body(rq.url())) })
  })
}
// Every click (mouse down) while recording, in CSS px on the REC clock, so the composer can draw a pointer.
const taps = []
await page.exposeFunction('__tap', (x, y) => { if (recording) taps.push({ t: +(Date.now() / 1000 - wall0).toFixed(3), x, y }) })
await page.evaluateOnNewDocument(() => addEventListener('mousedown', (e) => window.__tap(e.clientX, e.clientY), true))
if (process.env.TZ_EMU) await page.emulateTimezone(process.env.TZ_EMU) // e.g. show a daytime clock
await page.goto(url, { waitUntil: 'networkidle2', timeout: 180000 })
await sleep(800)
const cdp = await page.createCDPSession()
const frames = [], marks = []
let t0 = null, n = 0, recording = false
cdp.on('Page.screencastFrame', async (f) => {
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {})
  if (!recording) return
  const ts = f.metadata.timestamp
  if (t0 == null) t0 = wall0 // frames and captions share the REC clock
  const file = `f${String(n++).padStart(5, '0')}.jpg`
  fs.writeFileSync(`${out}/${file}`, Buffer.from(f.data, 'base64'))
  frames.push({ t: +(ts - t0).toFixed(3), file })
})
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 })
const now = () => (t0 == null ? 0 : Date.now() / 1000 - wall0)
let wall0 = 0
for (const s of steps) {
  if (s === 'REC') { recording = true; wall0 = Date.now() / 1000; await sleep(300); continue }
  if (s.startsWith('SNAP:')) { await page.screenshot({ path: `${out}/${s.slice(5)}.png`, type: 'png', captureBeyondViewport: false }); continue } // a lossless still at full DPR
  if (s.startsWith('KEY:')) { await page.keyboard.press(s.slice(4)); await sleep(400); continue }
  if (s.startsWith('CSS:')) { await page.addStyleTag({ content: s.slice(4) }); continue }
  if (s.startsWith('#')) { marks.push({ t: +now().toFixed(3), cap: s.slice(1) }); continue }
  if (s.startsWith('@')) { await sleep(+s.slice(1)); continue }
  if (s.startsWith('FILL:')) { const [sel, txt] = s.slice(5).split('|'); await page.click(sel); await page.type(sel, txt, { delay: 0 }); await sleep(300); continue } // instant, no half-typed validation errors
  if (s.startsWith('UPLOAD:')) { const [sel, file] = s.slice(7).split('|'); const h = await page.$(sel); await h.uploadFile(file); await sleep(800); continue } // a file into a file input
  if (s.startsWith('SCROLLIN:')) { const [sel, y] = s.slice(9).split('|'); await page.evaluate((sel, y) => document.querySelector(sel)?.scrollBy({ top: +y, behavior: 'smooth' }), sel, y); await sleep(900); continue } // scroll one element, e.g. a modal body
  if (s.startsWith('TYPE:')) { const [sel, txt] = s.slice(5).split('|'); await page.type(sel, txt, { delay: 45 }); await sleep(300); continue }
  if (s.startsWith('!')) { await page.evaluate((y) => { const area = (e) => e.clientWidth * e.clientHeight; const el = [...document.querySelectorAll('*')].filter((e) => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => area(b) - area(a))[0]; (el || document.scrollingElement).scrollBy({ top: y, behavior: 'smooth' }) }, +s.slice(1)); await sleep(900); continue }
  try { s.startsWith('~') ? await slide(page, s.slice(1)) : await clickText(page, s) } catch (e) { console.log('MISS', s) }
  await sleep(700)
}
await sleep(600)
await cdp.send('Page.stopScreencast')
fs.writeFileSync(`${out}/index.json`, JSON.stringify({ w: W * DPR, h: H * DPR, css: [+W, +H], frames, marks, taps }, null, 1))
console.log('frames', frames.length, 'dur', frames.at(-1)?.t, 'marks', marks.length)
console.log(JSON.stringify(await buttons(page)))
await page.screenshot({ path: `${out}/_end.png` })
await browser.close()
