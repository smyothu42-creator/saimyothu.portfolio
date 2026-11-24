import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9404
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,1100', '--user-data-dir=/tmp/cdp-profile-list', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() { for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS()); await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
async function shot(w, h, dpr, mobile, file) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile })
  await send('Page.navigate', { url: 'http://localhost:5173/' }); await wait(3200)
  await ev(`document.querySelector('.em-list').scrollIntoView({ block: 'center' })`); await wait(900)
  const b = JSON.parse(await ev(`(() => { const el = document.querySelector('.em-list'); const r = el.getBoundingClientRect(); return JSON.stringify({ x: r.x, y: r.y + scrollY, w: r.width, h: r.height }) })()`))
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: Math.max(0, b.x - 20), y: b.y - 10, width: Math.min(b.w + 40, w), height: Math.min(b.h + 20, 1400), scale: 1 }, captureBeyondViewport: true })
  writeFileSync(file, Buffer.from(s.data, 'base64'))
  console.log(file, JSON.stringify(b))
}
await shot(1440, 1100, 1, false, '.tmp-brand/check-list-desktop.jpg')
ws.close(); chrome.kill()
