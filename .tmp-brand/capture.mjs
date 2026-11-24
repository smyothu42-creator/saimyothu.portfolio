import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9340
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--remote-debugging-port=${PORT}`, '--window-size=1200,800', '--user-data-dir=/tmp/cdp-profile-brand', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 3200, height: 2026, deviceScaleFactor: 1, mobile: false })
for (const [name, file] of [['logo', 'logo.html'], ['versions', 'versions.html'], ['type-clean', 'type.html'], ['palette-clean', 'palette.html']]) {
  await send('Page.navigate', { url: `file:///Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-brand/${file}` })
  await wait(1500)
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 })
  writeFileSync(`.tmp-brand/${name}.jpg`, Buffer.from(shot.data, 'base64'))
  console.log('saved', name)
}
ws.close(); chrome.kill()
