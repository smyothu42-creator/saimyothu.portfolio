import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9421
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-finish', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const shot = async (file) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`.tmp-brand/${file}`, Buffer.from(s.data, 'base64')) }
const go = async (url) => { await send('Page.navigate', { url: 'http://localhost:5173' + url }); await wait(2200) }
const to = async (sel) => { await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(sel)})?.scrollIntoView({block:'start'})` }); await wait(900) }
const bottom = async () => { await send('Runtime.evaluate', { expression: `window.scrollTo(0, document.body.scrollHeight)` }); await wait(900) }
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

await go('/')
await wait(600)
await shot('fin-home.jpg')
await go('/about')
await to('.about-more')
await shot('fin-about-more.jpg')
await go('/work/orderflow')
await shot('fin-of-top.jpg')
await to('#numbers')
await shot('fin-of-numbers.jpg')
await bottom()
await shot('fin-of-next.jpg')
await go('/work/mtb-pay-merchant')
await to('#hierarchy')
await shot('fin-mtb-hierarchy.jpg')
await bottom()
await shot('fin-mtb-next.jpg')
await go('/work/uz-branding')
await to('#print')
await shot('fin-uz-print.jpg')
await bottom()
await shot('fin-uz-next.jpg')
await go('/work/flowy-design-system')
await to('#system')
await shot('fin-flowy-system.jpg')

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await go('/')
await wait(600)
await shot('fin-m-home.jpg')
await go('/work/orderflow')
await to('#numbers')
await shot('fin-m-of-numbers.jpg')
await bottom()
await shot('fin-m-of-next.jpg')
await go('/about')
await to('.about-more')
await shot('fin-m-about-more.jpg')
ws.close(); chrome.kill()
