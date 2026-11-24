import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9397
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-h1s', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value
await send('Page.enable')
const slugs = ['orderflow', 'mtb-pay-merchant', 'flowy-design-system', 'superfine-employee', 'uz-branding', 'sfk-driver-app']
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 })
  for (const slug of slugs) {
    await send('Page.navigate', { url: `http://localhost:5173/work/${slug}` })
    await wait(1800)
    console.log(tag, slug, await evalJs(`(() => { const h = document.querySelector('h1'); const b = h.getBoundingClientRect(); const s = getComputedStyle(h); return { text: h.textContent.trim(), w: Math.round(b.width), h: Math.round(b.height), fs: s.fontSize, lh: s.lineHeight } })()`))
    if (slug === 'superfine-employee' || slug === 'mtb-pay-merchant') {
      await evalJs(`window.scrollTo(0, 0)`)
      await wait(300)
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 })
      writeFileSync(`.tmp-brand/h1-${slug}-${tag}.jpg`, Buffer.from(shot.data, 'base64'))
    }
  }
}
ws.close(); chrome.kill()
