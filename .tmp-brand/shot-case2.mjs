import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const TAG = process.argv[3] || 'case2'
const MODE = process.argv[4] || 'open'
const SLUG = process.argv[5] || 'orderflow'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9800 + Math.floor(Math.random() * 90)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-case2-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(`.tmp-brand/${TAG}-${name}.jpg`, Buffer.from(s.data, 'base64')); console.log('shot', name) }
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
const hoverClick = async (sel) => {
  const r = await evalJs(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + 28 } })()`)
  if (!r) throw new Error('no ' + sel)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x, y: r.y })
  await wait(700)
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 })
}
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
if (MODE === 'reduced') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
const start = MODE === 'close' || MODE === 'page' ? '/work/' + SLUG : '/'
await send('Page.navigate', { url: 'http://localhost:5173' + start })
await wait(6000)
await shot('0-start')
if (MODE === 'page') {
  await evalJs(`window.scrollTo(0, 900)`)
  await wait(800)
  await shot('1-scrolled')
} else if (MODE === 'open' || MODE === 'reduced') {
  await hoverClick(`a[href="/work/${SLUG}"]`)
  let prev = 0
  for (const t of [60, 170, 290, 440, 620, 860]) { await wait(t - prev); await shot('t' + t); prev = t }
  await wait(800); await shot('9-done')
} else if (MODE === 'close') {
  await hoverClick('.em-top a.em-word')
  let prev = 0
  for (const t of [60, 170, 290, 440, 620, 860]) { await wait(t - prev); await shot('t' + t); prev = t }
  await wait(800); await shot('9-done')
}
console.log(await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, pane: !!document.querySelector('.pg-pane'), scrollY: Math.round(window.scrollY), vw: innerWidth})`))
console.log('errors', logs)
ws.close(); chrome.kill()
