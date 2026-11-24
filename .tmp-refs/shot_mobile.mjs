import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9337
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=390,844', '--user-data-dir=/tmp/cdp-profile-mobile', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 50; i++) { try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const page = list.find((t) => t.type === 'page'); if (page) return page.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, (m) => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await send('Page.navigate', { url: 'http://localhost:5173/work/uz-branding' })
await wait(3000)
for (const y of process.argv.slice(2).map(Number)) {
  await ev(`window.scrollTo(0, ${y})`); await wait(500)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 })
  writeFileSync(`.tmp-refs/refs/m_${y}.jpg`, Buffer.from(shot.data, 'base64'))
}
const info = await ev(`(() => { const r=s=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return {x:Math.round(b.x),w:Math.round(b.width),h:Math.round(b.height)}}; return {h:document.documentElement.scrollHeight, case:r('.em-case'), stage:r('.rv-stage .media'), h2:r('.em-sec-row h2'), copy:r('.em-sec-copy'), duo:r('.sv-duo'), duoImg:r('.sv-duo img')}; })()`)
console.log(JSON.stringify(info)); ws.close(); chrome.kill()
