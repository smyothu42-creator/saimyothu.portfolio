import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9389
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-me3', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(3500)
const r = await send('Runtime.evaluate', { expression: `(() => {
  const pick = (sel) => { const el = document.querySelector(sel); if (!el) return sel + ' none'; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return sel + ' x=' + Math.round(r.x) + ' y=' + Math.round(r.y) + ' w=' + Math.round(r.width) + ' h=' + Math.round(r.height) + ' font=' + cs.fontSize + ' ' + cs.fontFamily.split(',')[0] }
  return ['innerWidth ' + window.innerWidth, 'client ' + document.documentElement.clientWidth].concat(['.em-root', '.sv-col', '.about-hero', '.about-wrap', '.about-hero h1', '.about-bio', '.about-hero-photo', '.about-exp .ab-wrap', '.about-exp-list', '.about-exp-list li', '.about-meta'].map(pick)).join('\\n')
})()`, returnByValue: true })
console.log(JSON.stringify(r).slice(0, 2000))
ws.close(); chrome.kill()
