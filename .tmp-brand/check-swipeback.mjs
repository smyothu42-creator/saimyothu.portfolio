import { spawn } from 'node:child_process'
const W = 1440
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 10200 + Math.floor(Math.random() * 60)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--window-size=${W},900`, `--user-data-dir=/tmp/cdp-profile-swb-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable'); await send('Runtime.enable')
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(3500)
await send('Runtime.evaluate', { expression: `document.querySelector('.em-top nav a[href="/contact"]').click()` })
await wait(250)
await send('Runtime.evaluate', { expression: `history.back()` })
await wait(1200)
console.log('after midswipe back', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, swipe: !!document.querySelector('.pg-swipe'), topX: document.querySelector('.em-top')?.getBoundingClientRect().left, mainX: document.querySelector('.em-root > main')?.getBoundingClientRect().left})`))
await send('Runtime.evaluate', { expression: `document.querySelector('.em-top nav a[href="/contact"]').click()` })
await wait(1200)
console.log('then swipe again', await evalJs(`JSON.stringify({path: location.pathname, swipe: !!document.querySelector('.pg-swipe'), scrollY: scrollY})`))
console.log('errors', logs)
ws.close(); chrome.kill()
