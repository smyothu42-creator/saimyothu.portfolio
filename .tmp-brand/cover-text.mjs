import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9347
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=2400,1400', '--user-data-dir=/tmp/cdp-profile-cover', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() {
  for (let i = 0; i < 50; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const p = l.find((t) => t.type === 'page')
      if (p) return p.webSocketDebuggerUrl
    } catch {}
    await wait(200)
  }
  throw new Error('no chrome')
}
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pend = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) }
})
const send = (method, params = {}) => new Promise((res, rej) => {
  const mid = ++id
  pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)))
  ws.send(JSON.stringify({ id: mid, method, params }))
})
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 2400, height: 1350, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'file:///Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-brand/cover-overlay.html' })
await wait(1200)
console.log(await ev('window.__ready.then(() => JSON.stringify(window.__box))'))
const s = await send('Page.captureScreenshot', { format: 'png' })
writeFileSync('.tmp-brand/cover-overlay.png', Buffer.from(s.data, 'base64'))
ws.close()
chrome.kill()
