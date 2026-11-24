import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9600 + Math.floor(Math.random() * 40)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', `--user-data-dir=/tmp/cdp-profile-probe-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)
const probe = `(() => {
  const st = document.querySelector('.em-stage')
  const ov = document.querySelector('.pg-slide')
  const cs = st && getComputedStyle(st)
  const co = ov && getComputedStyle(ov)
  const r = st && st.getBoundingClientRect()
  return {
    path: location.pathname,
    stage: st ? { z: cs.zIndex, pos: cs.position, tf: cs.transform, x: Math.round(r.x), w: Math.round(r.width), vis: cs.visibility, op: cs.opacity } : null,
    overlay: ov ? { z: co.zIndex, op: co.opacity } : null,
    main: (() => { const m = document.querySelector('main'); const c = m && getComputedStyle(m); return c ? { z: c.zIndex, pos: c.position, iso: c.isolation, tf: c.transform, filter: c.filter } : null })(),
    home: (() => { const h = document.querySelector('.em-home'); const c = h && getComputedStyle(h); return c ? { z: c.zIndex, pos: c.position, iso: c.isolation, tf: c.transform } : null })(),
    topAt200_400: (document.elementFromPoint(200, 400)?.className || 'none'),
  }
})()`
await send('Runtime.evaluate', { expression: `document.querySelector('.em-stage-nav a[href="/about"]').click()` })
for (const t of [60, 160, 300, 500, 800]) {
  await wait(t === 60 ? 60 : t - [60, 160, 300, 500][[60, 160, 300, 500, 800].indexOf(t) - 1])
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true })
  console.log(t, JSON.stringify(r.result.value))
}
ws.close(); chrome.kill()
