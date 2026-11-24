import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9335
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,1000', '--user-data-dir=/tmp/cdp-profile-refs3', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS () {
  for (let i = 0; i < 50; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const page = list.find((t) => t.type === 'page'); if (page) return page.webSocketDebuggerUrl } catch {}
    await wait(200)
  }
  throw new Error('no chrome')
}
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, (m) => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'https://www.ericsin.com/work/Teladerma' })
await wait(4000)
await ev(`(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h + 800; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) } return h })()`)
await wait(1500)
const info = await ev(`(() => {
  const pick = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { t: el.tagName, s: el.textContent.trim().slice(0, 50), x: Math.round(r.x), w: Math.round(r.width), y: Math.round(r.top + scrollY), fs: cs.fontSize, lh: cs.lineHeight, color: cs.color, ff: cs.fontFamily.slice(0,40) } }
  const rows = [...document.querySelectorAll('h1,h2,h3,p,a,span')].filter(e => e.children.length === 0 && e.textContent.trim().length > 20).map(pick)
  const h2 = [...document.querySelectorAll('h2,h3')].map(pick)
  return { h2, rows: rows.slice(0, 24) }
})()`)
console.log(JSON.stringify(info, null, 1))
ws.close(); chrome.kill()
