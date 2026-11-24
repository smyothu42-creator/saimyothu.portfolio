import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9437
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-cap-restructure', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
const shot = async (path, full = false) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, ...(full ? { captureBeyondViewport: true } : {}) }); writeFileSync(path, Buffer.from(r.data, 'base64')) }
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/orderflow' })
await wait(2800)
// top of page through glance
await shot('.tmp-brand/restructure-top.jpg')
for (const id of ['shift', 'after', 'again']) {
  await evalx(`(() => { const el = document.getElementById('${id}'); el.scrollIntoView(); window.scrollBy(0, -80); })()`)
  await wait(900)
  await evalx(`window.scrollBy(0, 1)`)
  await wait(400)
  await shot(`.tmp-brand/restructure-${id}.jpg`)
}
console.log('sections:', await evalx(`[...document.querySelectorAll('.em-sec')].map(s => s.id).join(',')`))
console.log('glance items:', await evalx(`document.querySelectorAll('.em-glance-item').length + ' / findings ' + document.querySelectorAll('.cs-finding').length + ' / time ' + document.querySelectorAll('.cs-time-item').length + ' / table ' + document.querySelectorAll('.st-table').length`))
ws.close(); chrome.kill()
