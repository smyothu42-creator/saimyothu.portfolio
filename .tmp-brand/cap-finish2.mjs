import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9422
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-finish2', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (file) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`.tmp-brand/${file}`, Buffer.from(s.data, 'base64')) }
const go = async (url) => { await send('Page.navigate', { url: 'http://localhost:5173' + url }); await wait(2200) }
const to = async (sel) => {
  const js = `document.querySelector(${JSON.stringify(sel)})?.scrollIntoView({block:'start',behavior:'instant'})`
  await send('Runtime.evaluate', { expression: js }); await wait(1300)
  await send('Runtime.evaluate', { expression: js }); await wait(600)
}
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

await go('/work/orderflow')
await to('#numbers')
await shot('fin2-of-numbers.jpg')
await go('/work/mtb-pay-merchant')
await to('#hierarchy')
await shot('fin2-mtb-hierarchy.jpg')
await go('/work/superfine-employee')
await to('#ranked')
await shot('fin2-sf-ranked.jpg')
await to('#rest')
await shot('fin2-sf-rest.jpg')

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await go('/work/orderflow')
await to('#numbers')
await shot('fin2-m-of-numbers.jpg')
ws.close(); chrome.kill()
