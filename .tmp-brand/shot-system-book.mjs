import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9374
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,1000', '--user-data-dir=/tmp/cdp-profile-tb3', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() { for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS()); await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

async function shot(url, file, mobile = false) {
  if (mobile) await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 900, deviceScaleFactor: 2, mobile: true })
  else await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url }); await wait(3000)
  const found = await ev(`(() => { const s = document.getElementById('system'); if (!s) return 'nosection'; const i = [...s.querySelectorAll('.st-shot')].find((a) => (a.querySelector('img') || {}).src?.includes('use-18-lookbook-v7')); if (!i) return 'noimg:' + [...s.querySelectorAll('img')].map(x=>x.getAttribute('src')).join(','); i.scrollIntoView({ block: 'center' }); return 'ok' })()`)
  console.log(file, found)
  await wait(1600)
  const b = JSON.parse(await ev(`(() => { const i = [...document.querySelectorAll('#system .st-shot')].find((a) => (a.querySelector('img') || {}).src?.includes('use-18-lookbook-v7')); const r = i.getBoundingClientRect(); const im = i.querySelector('img'); return JSON.stringify({ x: r.x, y: r.y + scrollY, w: r.width, h: r.height, nw: im.naturalWidth, nh: im.naturalHeight }) })()`))
  console.log(JSON.stringify(b))
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: Math.max(0, b.x - 24), y: b.y - 30, width: Math.min(b.w + 48, 1440), height: b.h + 60, scale: 1 }, captureBeyondViewport: true })
  writeFileSync(file, Buffer.from(s.data, 'base64'))
}

await shot('http://localhost:5173/work/uz-branding', '.tmp-brand/check-system-book-desktop.jpg')
await shot('http://localhost:5173/work/uz-branding', '.tmp-brand/check-system-book-mobile.jpg', true)
ws.close(); chrome.kill()
