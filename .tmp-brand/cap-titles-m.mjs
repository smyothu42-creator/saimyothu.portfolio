import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9392
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-titles-m', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
const rows = await send('Runtime.evaluate', { expression: `JSON.stringify([...document.querySelectorAll('.em-row')].map(r => { const n = r.querySelector('.em-row-name'); const l = r.querySelector('.em-row-line'); const b = r.getBoundingClientRect(); const nb = n.getBoundingClientRect(); return { title: n.textContent, line: l.textContent, rowH: Math.round(b.height), titleW: Math.round(nb.width), titleH: Math.round(nb.height), lines: Math.round(nb.height / parseFloat(getComputedStyle(n).lineHeight)) } }))`, returnByValue: true })
console.log(rows.result.value)
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 })
writeFileSync('.tmp-brand/home-titles-m.jpg', Buffer.from(shot.data, 'base64'))
ws.close(); chrome.kill()
