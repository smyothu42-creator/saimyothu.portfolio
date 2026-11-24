import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9459
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/cdp-cap-fb-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 }); writeFileSync(path, Buffer.from(r.data, 'base64')) }
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/orderflow' })
await wait(3200)
await evalx(`window.scrollTo(0, document.querySelector('#pilot .cs-feedback').getBoundingClientRect().top + scrollY - 20)`)
await wait(1600)
await shot(process.env.OUT || '.tmp-brand/pilot-desktop.jpg')
console.log(await evalx(`[...document.querySelectorAll('#pilot .cs-mock-col')].map(c => { const r = c.getBoundingClientRect(); return c.className + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' top=' + Math.round(r.top); }).join(' | ') + ' || feedback h=' + Math.round(document.querySelector('#pilot .cs-feedback')?.getBoundingClientRect().height)`))
ws.close(); chrome.kill()
