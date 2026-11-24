import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9970 + Math.floor(Math.random() * 20)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', `--user-data-dir=/tmp/cdp-probe-case-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(5000)
const r = await evalJs(`(() => { const e = document.querySelector('a[href="/work/orderflow"]'); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + 28 } })()`)
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x, y: r.y })
await wait(700)
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 })
await wait(120)
console.log(await evalJs(`(() => {
  const q = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: +b.left.toFixed(1), y: +b.top.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), op: getComputedStyle(e).opacity } }
  return JSON.stringify({
    liveIntro: q('.em-home .em-intro'),
    faceRoot: q('.pg-case-face'),
    faceCol: q('.pg-case-face > main'),
    faceHome: q('.pg-case-face .em-home'),
    faceWork: q('.pg-case-face .em-work'),
    faceIntro: q('.pg-case-face .em-intro'),
    faceRow: q('.pg-case-face .em-row'),
    layer: q('.pg-case-layer'),
    layerCol: q('.pg-case-layer > main'),
    pane: q('.pg-case'),
    clip: getComputedStyle(document.querySelector('.pg-case')).clipPath,
    edge: q('.pg-case-edge'),
  }, null, 1)
})()`))
await wait(900)
console.log(await evalJs(`JSON.stringify({ path: location.pathname, h1: document.querySelector('h1')?.textContent, pane: !!document.querySelector('.pg-case') })`))
ws.close(); chrome.kill()
