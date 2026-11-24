import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W = 1440
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9700 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-red-${PORT}`, 'about:blank'], { stdio: 'ignore' })
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
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3500)
await send('Runtime.evaluate', { expression: `document.querySelector('.em-stage-nav a[href="/about"]').click()` })
await wait(60)
await shot('red-mid')
console.log('mid', await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane')})`))
await wait(600)
await shot('red-done')
console.log('done', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent})`))
// back mid-slide: click word, then immediately history.back()
await send('Runtime.evaluate', { expression: `document.querySelector('.em-word').click()` })
await wait(900)
await shot('red-back')
console.log('back', await evalJs(`JSON.stringify({path: location.pathname, stage: !!document.querySelector('.em-stage')})`))
// normal motion: press browser back mid-animation
await send('Emulation.setEmulatedMedia', { features: [] })
await send('Runtime.evaluate', { expression: `document.querySelector('.em-stage-nav a[href="/about"]').click()` })
await wait(200)
await send('Runtime.evaluate', { expression: `history.back()` })
await wait(900)
console.log('midback', await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane'), stage: !!document.querySelector('.em-stage'), h1: document.querySelector('h1')?.textContent})`))
await shot('midback-done')
console.log('errors', logs)
ws.close(); chrome.kill()
