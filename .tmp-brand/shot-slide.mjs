import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = Number(process.argv[2] || 1440)
const TAG = process.argv[3] || 'slide'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9500 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-slide-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => {
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 })
  writeFileSync(`.tmp-brand/${TAG}-${name}.jpg`, Buffer.from(s.data, 'base64'))
  console.log('shot', name)
}
await send('Page.enable')
await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3500)
await shot('0-home')
const t0 = Date.now()
await send('Runtime.evaluate', { expression: `document.querySelector('.em-stage-nav a[href="/about"]').click()` })
await wait(120); await shot('1-t120')
await wait(180); await shot('2-t300')
await wait(250); await shot('3-t550')
await wait(500); await shot('4-done')
console.log('elapsed', Date.now() - t0)
const info = await send('Runtime.evaluate', { expression: `JSON.stringify({ path: location.pathname, h1: document.querySelector('h1')?.textContent, stage: !!document.querySelector('.em-stage'), slideEl: !!document.querySelector('.pg-slide'), scrollY: window.scrollY })`, returnByValue: true })
console.log(info.result.value)
console.log('errors', logs)
ws.close(); chrome.kill()
