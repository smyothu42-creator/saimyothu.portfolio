import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9377
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-profile-about', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'https://www.ericsin.com/about' })
await wait(6000)
const h = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })
const H = h.result.value
for (let y = 0; y < H; y += 700) { await send('Runtime.evaluate', { expression: `window.scrollTo(0,${y})` }); await wait(450) }
await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' })
await wait(1200)
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: H, scale: 1 } })
writeFileSync('.tmp-brand/eric-about-full.jpg', Buffer.from(shot.data, 'base64'))
console.log('height', H)
const txt = await send('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true })
writeFileSync('.tmp-brand/eric-about.txt', txt.result.value || '')
const geo = await send('Runtime.evaluate', { expression: `(() => {
  const out = []
  const walk = (el, depth) => {
    if (depth > 7) return
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const tag = el.tagName.toLowerCase()
    const txt = (el.childNodes.length && [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim())
    if (r.width > 0 && r.height > 0 && (txt || ['img','video','h1','h2','h3','section','figure','header'].includes(tag))) {
      out.push([tag, Math.round(r.x), Math.round(r.y + window.scrollY), Math.round(r.width), Math.round(r.height), cs.fontSize, cs.fontFamily.split(',')[0].replace(/"/g,''), cs.fontWeight, cs.fontStyle, cs.letterSpacing, cs.lineHeight, cs.color, txt.slice(0,70)].join(' | '))
    }
    [...el.children].forEach(c => walk(c, depth + 1))
  }
  walk(document.body, 0)
  return out.join('\\n')
})()`, returnByValue: true })
writeFileSync('.tmp-brand/eric-about-geo.txt', geo.result.value || '')
ws.close(); chrome.kill()
