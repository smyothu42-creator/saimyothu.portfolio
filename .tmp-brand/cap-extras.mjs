import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9491
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/cdp-cap-extras-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(path, Buffer.from(r.data, 'base64')) }
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/orderflow' })
await wait(3000)
await evalx(`(() => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) window.scrollTo(0, y); window.scrollTo(0, 0); })()`)
await wait(2500)
await evalx(`(() => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) window.scrollTo(0, y); window.scrollTo(0, 0); })()`)
await wait(5000)
for (const [name, y] of [['shipped-flows', 1250], ['shipped-flows2', 2300], ['shipped-end', 3300]]) {
  await send('Runtime.evaluate', { expression: `(async () => { const el = document.getElementById('shipped'); const t = el.getBoundingClientRect().top + scrollY - 70 + ${y}; const m = await import('/src/scroll.js'); m.scroller.lenis?.scrollTo(t, { immediate: true, force: true }); window.scrollTo(0, t); })()`, awaitPromise: true })
  await wait(900)
  await shot(`.tmp-brand/fmt-of-${name}${process.env.SUF || ''}.jpg`)
}
ws.close(); chrome.kill()
