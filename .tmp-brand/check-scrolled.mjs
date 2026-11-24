import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = 1440, H = 600
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9800 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/cdp-profile-scr-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(`.tmp-brand/${name}.jpg`, Buffer.from(s.data, 'base64')) }
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3500)
await send('Runtime.evaluate', { expression: `window.scrollTo(0, 400); document.querySelector('.em-stage').scrollIntoView?.()` })
await wait(300)
await shot('scroll-0')
console.log('before', await evalJs(`JSON.stringify({y: scrollY, stage: document.querySelector('.em-stage').getBoundingClientRect().toJSON()})`))
await send('Runtime.evaluate', { expression: `document.querySelector('.em-stage-nav a[href="/about"]').click()` })
await wait(120); await shot('scroll-1')
await wait(1200); await shot('scroll-done')
console.log('done', await evalJs(`JSON.stringify({path: location.pathname, y: scrollY})`))
console.log('errors', logs)
ws.close(); chrome.kill()
