import { spawn } from 'node:child_process'
const W = 1440
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 10100 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-probe-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(3500)
const probe = `(() => {
  const pane = document.querySelector('.pg-swipe')
  const tops = [...document.querySelectorAll('.em-top')]
  return JSON.stringify({
    t: Math.round(performance.now()),
    y: scrollY, h: document.documentElement.scrollHeight,
    pane: pane ? Math.round(pane.getBoundingClientRect().left) : null,
    paneStyle: pane ? getComputedStyle(pane).position + '/' + getComputedStyle(pane).overflow : null,
    tops: tops.map(el => { const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), r.width|0, +getComputedStyle(el).opacity] }),
    main: [...document.querySelectorAll('.em-root > main')].map(el => { const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)] }),
    h1: document.querySelector('.pg-swipe') ? null : document.querySelector('h1')?.textContent,
  })
})()`
await send('Runtime.evaluate', { expression: `window.__frames=[]; (function loop(){ window.__frames.push(${probe}); if (window.__frames.length < 60) requestAnimationFrame(loop) })(); 'ok'` })
await send('Runtime.evaluate', { expression: `document.querySelector('.em-top nav a[href="/contact"]').click()` })
await wait(1400)
const frames = JSON.parse('[' + (await evalJs(`window.__frames.join(',')`)) + ']')
const t0 = frames[0].t
for (const f of frames) {
  if (f.t - t0 < 100) continue
  if ((f.t - t0) % 1 === 0) console.log(f.t - t0, JSON.stringify({ y: f.y, h: f.h, pane: f.pane, pos: f.paneStyle, tops: f.tops, main: f.main, h1: f.h1 }))
}
console.log('errors', logs)
ws.close(); chrome.kill()
