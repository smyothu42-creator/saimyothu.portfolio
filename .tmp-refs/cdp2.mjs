import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9334
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,1000', '--user-data-dir=/tmp/cdp-profile-refs2', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS () {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await wait(200)
  }
  throw new Error('no chrome')
}
const ws = new WebSocket(await getWS())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
})
const send = (method, params = {}) => new Promise((res, rej) => {
  const mid = ++id
  pending.set(mid, (m) => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))
  ws.send(JSON.stringify({ id: mid, method, params }))
})
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

for (const p of ['Teladerma', 'REVOPS']) {
  await send('Page.navigate', { url: `https://www.ericsin.com/work/${p}` })
  await wait(4000)
  await ev(`(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h + 800; y += 650) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)) } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 1000)); return h })()`)
  await wait(1200)
  const info = await ev(`(() => {
    const pick = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,60), src: el.currentSrc || el.src || '', w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top + window.scrollY), radius: cs.borderRadius, fit: cs.objectFit } }
    return {
      pageH: document.documentElement.scrollHeight,
      vids: [...document.querySelectorAll('video')].map(v => ({ ...pick(v), poster: v.poster, loop: v.loop, muted: v.muted, dur: v.duration })),
      imgs: [...document.querySelectorAll('img')].map(pick).filter(i => i.w > 250),
      text: [...document.querySelectorAll('h1,h2,h3,p')].slice(0, 25).map(e => ({ t: e.tagName, s: e.textContent.trim().slice(0, 90), y: Math.round(e.getBoundingClientRect().top + window.scrollY), size: getComputedStyle(e).fontSize }))
    }
  })()`)
  writeFileSync(`.tmp-refs/refs/${p}.json`, JSON.stringify(info, null, 1))
  console.log(p, 'vids', info.vids.length, 'imgs', info.imgs.length, 'H', info.pageH)
}
ws.close()
chrome.kill()
