import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const OUT = process.argv[3] || '.tmp-brand/me-after.jpg'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9391 + Math.floor(Math.random() * 40)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-me-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(4000)
const h = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })
const H = h.result.value
for (let y = 0; y < H; y += 700) { await send('Runtime.evaluate', { expression: `window.scrollTo(0,${y})` }); await wait(250) }
await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' })
await wait(600)
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } })
writeFileSync(OUT, Buffer.from(shot.data, 'base64'))
console.log('saved', OUT, W, H)
ws.close(); chrome.kill()
