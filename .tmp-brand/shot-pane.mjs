import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const TAG = process.argv[3] || 'pane'
const START = process.argv[4] || '/'
const CLICK = process.argv[5] || '.em-stage-nav a[href="/about"]'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9600 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-pane-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(`.tmp-brand/${TAG}-${name}.jpg`, Buffer.from(s.data, 'base64')); console.log('shot', name) }
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173' + START })
await wait(3500)
await shot('0-home')
await send('Runtime.evaluate', { expression: `document.querySelector('${CLICK}').click()` })
for (const [i, t] of [[1, 90], [2, 130], [3, 160], [4, 160], [5, 200]]) { await wait(t); await shot(`${i}-t${[90, 220, 380, 540, 740][i - 1]}`) }
await wait(500); await shot('6-done')
console.log(await (async () => (await send('Runtime.evaluate', { expression: `JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, pane: !!document.querySelector('.pg-pane'), stage: !!document.querySelector('.em-stage'), scrollY: window.scrollY})`, returnByValue: true })).result.value)())
console.log('errors', logs)
ws.close(); chrome.kill()
