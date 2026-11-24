import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9386
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,1000', '--user-data-dir=/tmp/cdp-profile-secheads3', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() { for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS()); await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/work/uz-branding' }); await wait(3200)
const secs = await ev(`(() => { const a = ['cs-about','system']; return JSON.stringify(a.map(id => { const el = document.getElementById(id); const r = el.getBoundingClientRect(); return { id, y: r.y + scrollY } })) })()`)
console.log(secs)
const info = JSON.parse(secs)
for (const s of info) {
  await ev(`(() => { const el = document.getElementById('${s.id}'); scrollTo(0, el.getBoundingClientRect().y + scrollY - 80) })()`)
  await wait(900)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 })
  writeFileSync(`.tmp-brand/check-head-${s.id}.jpg`, Buffer.from(shot.data, 'base64'))
}
ws.close(); chrome.kill()
