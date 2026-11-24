import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9405
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-noimpact', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
for (const [slug, file] of [['orderflow', 'big-orderflow.png'], ['superfine-employee', 'big-superfine.png'], ['flowy-design-system', 'big-flowy.png'], ['mtb-pay-merchant', 'big-mtb.png'], ['uz-branding', 'big-uz.png']]) {
  await evalJs(`(() => { const a = document.querySelector('.em-row[href="/work/${slug}"]'); a.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); return true })()`)
  await wait(1000)
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`.tmp-brand/${file}`, Buffer.from(shot.data, 'base64'))
}
console.log(await evalJs(`(() => { const r = document.querySelector('.em-shot.is-on').getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } })()`))
ws.close(); chrome.kill()
