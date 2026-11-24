import { spawn } from 'node:child_process'
const W = Number(process.argv[2] || 1440)
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9900 + Math.floor(Math.random() * 90)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-probe3-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(5000)
console.log(await evalJs(`(() => { const s = document.querySelector('.em-home .em-stage'); const w = document.querySelector('.em-home .em-work'); return JSON.stringify({ vw: innerWidth, stage: Math.round(s.getBoundingClientRect().width), work: Math.round(w.getBoundingClientRect().width), gh: getComputedStyle(s).height }) })()`))
const r = await evalJs(`(() => { const e = document.querySelector('a[href="/work/orderflow"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + 28 } })()`)
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x, y: r.y })
await wait(600)
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 })
let prev = 0
for (const t of [40, 120, 200, 300, 420, 560, 700, 900]) {
  await wait(t - prev); prev = t
  console.log(t, await evalJs(`(() => { const p = document.querySelector('.pg-case'); const l = document.querySelector('.pg-case-layer'); const c = l?.querySelector('main'); const head = document.querySelector('.em-case-head'); const s = document.querySelector('.em-home .em-stage'); const cs = p ? getComputedStyle(p) : null; return JSON.stringify({ px: cs?.getPropertyValue('--pg-x').trim(), contentO: c ? getComputedStyle(c).opacity : null, headO: head ? getComputedStyle(head).opacity : null, stageO: s ? getComputedStyle(s).opacity : null, stageX: s ? getComputedStyle(s).transform : null }) })()`))
}
ws.close(); chrome.kill()
