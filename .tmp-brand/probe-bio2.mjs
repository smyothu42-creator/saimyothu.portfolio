import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9393
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-bio2', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/about' })
await wait(4000)
const r = await send('Runtime.evaluate', { expression: `(() => {
  const foot = document.querySelector('.about-foot')
  const root = document.querySelector('.em-root')
  const out = []
  out.push('docScroll=' + document.documentElement.scrollHeight + ' bodyScroll=' + document.body.scrollHeight)
  if (root) { const cs = getComputedStyle(root); const rr = root.getBoundingClientRect(); out.push('root h=' + Math.round(rr.height) + ' scrollH=' + root.scrollHeight + ' overflow=' + cs.overflowY) }
  if (foot) out.push('foot y=' + Math.round(foot.getBoundingClientRect().top + window.scrollY) + ' h=' + Math.round(foot.getBoundingClientRect().height))
  const ps = [...document.querySelectorAll('.about-bio p')]
  ps.forEach((p, i) => out.push('p' + i + ' lines=' + Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight))))
  return out.join('\\n')
})()`, returnByValue: true })
console.log(r.result.value)
ws.close(); chrome.kill()
