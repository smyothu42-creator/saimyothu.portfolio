import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9348
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', `--remote-debugging-port=${PORT}`, '--window-size=1440,1000', '--user-data-dir=/tmp/cdp-profile-lookbook', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() {
  for (let i = 0; i < 50; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const p = l.find((t) => t.type === 'page')
      if (p) return p.webSocketDebuggerUrl
    } catch {}
    await wait(200)
  }
  throw new Error('no chrome')
}
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pend = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) }
})
const send = (method, params = {}) => new Promise((res, rej) => {
  const mid = ++id
  pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)))
  ws.send(JSON.stringify({ id: mid, method, params }))
})
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/work/uz-branding' })
await wait(3500)
await ev(`(() => { const i=document.querySelector('img[src*="use-18-lookbook"]'); if(i) i.scrollIntoView({block:'center'}); })()`)
await wait(1500)
const box = await ev(`(() => { const i=document.querySelector('img[src*="use-18-lookbook"]'); if(!i) return null; const r=i.getBoundingClientRect(); return JSON.stringify({x:r.x,y:r.y+scrollY,w:r.width,h:r.height,src:i.currentSrc,complete:i.complete,nw:i.naturalWidth}) })()`)
console.log(box)
const b = JSON.parse(box)
const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } })
writeFileSync('.tmp-brand/check-lookbook.jpg', Buffer.from(s.data, 'base64'))
ws.close()
chrome.kill()
