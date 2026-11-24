import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9336
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-local', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS () {
  for (let i = 0; i < 50; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const page = list.find((t) => t.type === 'page'); if (page) return page.webSocketDebuggerUrl } catch {}
    await wait(200)
  }
  throw new Error('no chrome')
}
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, (m) => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/work/uz-branding' })
await wait(3500)
const h = await ev('document.documentElement.scrollHeight')
const positions = process.argv.slice(2).map(Number)
for (const y of positions) {
  await ev(`window.scrollTo(0, ${y})`)
  await wait(700)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 })
  writeFileSync(`.tmp-refs/refs/local_${y}.jpg`, Buffer.from(shot.data, 'base64'))
  console.log('saved', y)
}
const info = await ev(`(() => { const v=document.querySelector('.rv-stage video'); return {h: document.documentElement.scrollHeight, vw: innerWidth, video: v?{paused:v.paused,t:v.currentTime,w:v.videoWidth,h:v.videoHeight}:null}; })()`)
console.log(JSON.stringify(info))
ws.close(); chrome.kill()
