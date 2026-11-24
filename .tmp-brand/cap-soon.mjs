import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9406
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-soon', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
await evalJs(`(() => { const r = document.querySelector('.em-row.is-soon'); r.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); r.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })); return true })()`)
await wait(900)
console.log(await evalJs(`(() => { const r = document.querySelector('.em-row.is-soon'); return { tag: r.tagName, aria: r.getAttribute('aria-disabled'), href: r.getAttribute('href'), year: r.querySelector('.em-row-year').textContent, metric: r.querySelector('.em-row-line')?.textContent || null, stageShot: document.querySelector('.em-stage').className, windowOn: !!document.querySelector('.em-shot.is-window.is-on'), moved: getComputedStyle(r.querySelector('.em-row-body')).transform } })()`))
const shot = await send('Page.captureScreenshot', { format: 'png' })
writeFileSync('.tmp-brand/home-soon.png', Buffer.from(shot.data, 'base64'))
await send('Page.navigate', { url: 'http://localhost:5173/work/mtb-pay-merchant' })
await wait(3500)
console.log(await evalJs(`JSON.stringify([...document.querySelectorAll('.em-pager a')].map(a => a.getAttribute('href')))`))
ws.close(); chrome.kill()
