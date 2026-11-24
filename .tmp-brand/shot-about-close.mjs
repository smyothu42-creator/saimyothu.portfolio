import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const TAG = process.argv[3] || 'ac'
const CLICK = process.argv[4] || '.em-top a.em-word'
const SCROLL = Number(process.argv[5] || 0)
const PAGE = process.argv[6] || 'about'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9600 + Math.floor(Math.random() * 90)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-ac-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(`.tmp-brand/${TAG}-${name}.jpg`, Buffer.from(s.data, 'base64')); console.log('shot', name) }
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173/' + PAGE })
await wait(5000)
if (SCROLL) { await evalJs(`window.scrollTo(0, ${SCROLL})`); await wait(600) }
await shot('0-start')
await evalJs(`document.querySelector('${CLICK}').click()`)
await wait(40); await shot('a')
await wait(90); await shot('b')
await wait(120); await shot('c')
await wait(150); await shot('d')
await wait(200); await shot('e')
await wait(400); await shot('9-done')
console.log(await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane'), scrollY: Math.round(scrollY), px: document.querySelector('.pg-pane') ? getComputedStyle(document.querySelector('.pg-pane')).getPropertyValue('--pg-x') : null})`))
console.log('errors', logs)
ws.close(); chrome.kill()
