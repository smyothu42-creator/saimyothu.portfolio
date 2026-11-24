import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9900 + Math.floor(Math.random() * 60)
const TAG = process.argv[2] || 'chk'
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', `--user-data-dir=/tmp/cdp-profile-chk-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(`.tmp-brand/${TAG}-${name}.jpg`, Buffer.from(s.data, 'base64')) }
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
const logs = []
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.text) })
await send('Page.enable'); await send('Runtime.enable')

// 1. reduced motion: about -> contact, home -> case
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(2500)
await evalJs(`document.querySelector('.em-top nav a[href="/contact"]').click()`)
await wait(400)
console.log('reduced rail', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, rail: !!document.querySelector('.pg-rail'), top: Math.round(document.querySelector('main').getBoundingClientRect().top)})`))
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(2500)
await evalJs(`document.querySelector('.em-row').click()`)
await wait(500)
console.log('reduced case', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, pane: !!document.querySelector('.pg-pane'), scrollY: Math.round(scrollY)})`))

// 2. back press during the rail
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(3000)
await evalJs(`document.querySelector('.em-top nav a[href="/contact"]').click()`)
await wait(220)
await shot('mid-rail')
await evalJs(`history.back()`)
await wait(900)
console.log('back mid rail', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, rail: !!document.querySelector('.pg-rail'), x: getComputedStyle(document.body).overflow})`))
await shot('after-rail-back')

// 3. back press during the case opening
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
await evalJs(`document.querySelector('.em-row').click()`)
await wait(260)
await shot('mid-case')
await evalJs(`history.back()`)
await wait(900)
console.log('back mid case', await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane'), home: !!document.querySelector('.em-home'), scrollY: Math.round(scrollY)})`))
await shot('after-case-back')

// 4. wordmark back from case (full close) and click again after
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
await evalJs(`document.querySelector('.em-row').click()`)
await wait(1200)
console.log('opened case', await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane')})`))
await evalJs(`document.querySelector('.em-top a.em-word').click()`)
await wait(1100)
console.log('closed case', await evalJs(`JSON.stringify({path: location.pathname, pane: !!document.querySelector('.pg-pane'), home: !!document.querySelector('.em-home')})`))
await evalJs(`document.querySelectorAll('.em-row')[1].click()`)
await wait(1200)
console.log('reopened case', await evalJs(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent})`))
await shot('reopened')
console.log('errors', logs)
ws.close(); chrome.kill()
