import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9488
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, `--user-data-dir=/tmp/cdp-cap-format-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(path, Buffer.from(r.data, 'base64')) }
await send('Page.enable')

const pages = [
  { url: '/work/orderflow', name: 'of', targets: ['.em-glance', 'problem', 'shift', 'shipped', 'result'] },
  { url: '/work/superfine-employee', name: 'sf', targets: ['same', 'numbers', 'lessons'] },
  { url: '/work/mtb-pay-merchant', name: 'mtb', targets: ['counter', 'hierarchy', 'numbers'] },
  { url: '/work/flowy-design-system', name: 'fl', targets: ['system', 'rules'] },
  { url: '/work/uz-branding', name: 'uz', targets: ['system'] },
]

for (const page of pages) {
  await send('Page.navigate', { url: 'http://localhost:5173' + page.url })
  await wait(3200)
  await evalx(`(() => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) window.scrollTo(0, y); window.scrollTo(0, 0); })()`)
  await wait(2500)
  await evalx(`(() => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) window.scrollTo(0, y); window.scrollTo(0, 0); })()`)
  await wait(5000)
  for (const t of page.targets) {
    const sel = t.startsWith('.') ? t : '#' + t
    for (let k = 0; k < 8; k++) {
      await send('Runtime.evaluate', { expression: `(async () => { const el = document.querySelector('${sel}'); if (!el) return; const y = el.getBoundingClientRect().top + scrollY - 70; const m = await import('/src/scroll.js'); m.scroller.lenis?.scrollTo(y, { immediate: true, force: true }); window.scrollTo(0, y); })()`, awaitPromise: true })
      await wait(800)
      const top = await evalx(`(() => { const el = document.querySelector('${sel}'); return el ? Math.round(el.getBoundingClientRect().top) : -999 })()`)
      if (Math.abs(top - 70) < 6) break
    }
    await shot(`.tmp-brand/fmt-${page.name}-${t.replace(/^[.#]/, '')}${process.env.SUF || ''}.jpg`)
  }
  console.log(page.name, 'h2:', await evalx(`[...document.querySelectorAll('.em-case h2')].map(h => h.textContent.trim()).join(' | ')`))
  console.log(page.name, 'h3 sample:', await evalx(`[...document.querySelectorAll('.cs-sub h3')].slice(0, 3).map(h => h.textContent.trim()).join(' | ')`))
}
console.log('styles:', await evalx(`(() => { const h = document.querySelector('.cs-sub h3'); const p = document.querySelector('.cs-sub p'); const d = document.querySelector('.em-glance-item dt'); const v = document.querySelector('.em-glance-item dd'); const g = (el, k) => el ? getComputedStyle(el)[k] : '-'; return JSON.stringify({ h3: [g(h,'fontSize'), g(h,'fontWeight'), g(h,'color')], p: [g(p,'fontSize'), g(p,'color')], dt: [g(d,'fontSize'), g(d,'fontWeight'), g(d,'color')], dd: [g(v,'fontSize'), g(v,'color')] }) })()`))
ws.close(); chrome.kill()
