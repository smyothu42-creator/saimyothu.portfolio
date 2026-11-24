import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const SLUG = process.argv[3] || 'orderflow'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9900 + Math.floor(Math.random() * 80)
const PROFILE = `/tmp/cdp-profile-paras-${PORT}`
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=${PROFILE}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 }); writeFileSync(`.tmp-brand/paras-${SLUG}-${name}.jpg`, Buffer.from(s.data, 'base64')); console.log('shot', name) }
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173/work/' + SLUG })
await wait(5000)
const ids = await evalJs(`JSON.stringify([...document.querySelectorAll('.em-sec')].map(s => s.id))`)
console.log('sections', ids)
const list = JSON.parse(ids)
let n = 0
for (const sid of list) {
  const y = await evalJs(`(() => { const e = document.getElementById(${JSON.stringify(sid)}); return e ? Math.round(e.getBoundingClientRect().top + scrollY - 90) : null })()`)
  if (y == null) continue
  await evalJs(`window.scrollTo(0, ${y})`)
  await wait(900)
  await shot(String(n++).padStart(2, '0') + '-' + sid)
}
console.log(await evalJs(`JSON.stringify({path: location.pathname, scrollH: document.body.scrollHeight})`))
console.log('errors', logs)
ws.close(); chrome.kill()
