import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9333
const pages = ['APMC', 'REVOPS', 'Teladerma']

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, '--window-size=1440,1000',
  '--user-data-dir=/tmp/cdp-profile-refs', 'about:blank',
], { stdio: 'ignore' })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function getWS () {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await r.json()
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
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const mid = ++id
  pending.set(mid, (m) => m.error ? reject(new Error(method + ': ' + JSON.stringify(m.error))) : resolve(m.result))
  ws.send(JSON.stringify({ id: mid, method, params }))
})
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
  return r.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

for (const p of pages) {
  await send('Page.navigate', { url: `https://www.ericsin.com/work/${p}` })
  await wait(3500)
  // scroll through to trigger lazy media, then back to top
  await evaluate(`(async () => {
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h + 1000; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)) }
    window.scrollTo(0, 0)
    await new Promise(r => setTimeout(r, 1200))
    return document.documentElement.scrollHeight
  })()`)
  await wait(1500)

  const info = await evaluate(`(() => {
    const pick = (el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return { tag: el.tagName.toLowerCase(), cls: el.className?.toString().slice(0,80), src: (el.currentSrc || el.src || '').split('/').slice(-2).join('/'), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top + window.scrollY), ar: cs.aspectRatio, fit: cs.objectFit, radius: cs.borderRadius }
    }
    const imgs = [...document.querySelectorAll('img')].map(pick).filter(i => i.w > 200)
    const vids = [...document.querySelectorAll('video')].map(v => ({ ...pick(v), poster: v.poster.split('/').pop(), loop: v.loop, autoplay: v.autoplay, dur: v.duration, t: v.currentTime }))
    const main = document.querySelector('main') || document.body
    const mcs = getComputedStyle(main)
    // containers of images: find parents with 2+ img descendants
    return {
      title: document.title,
      width: window.innerWidth,
      pageH: document.documentElement.scrollHeight,
      main: { w: Math.round(main.getBoundingClientRect().width), x: Math.round(main.getBoundingClientRect().left), pad: mcs.padding, maxW: mcs.maxWidth },
      imgs, vids,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    }
  })()`)
  writeFileSync(`/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/refs/${p}.json`, JSON.stringify(info, null, 1))

  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  writeFileSync(`/Users/saimyothu/claude-workspace/portfolio-revamp/.tmp-refs/refs/${p}_full.png`, Buffer.from(shot.data, 'base64'))
  console.log(p, 'done', info.pageH, 'imgs', info.imgs.length, 'vids', info.vids.length)
}

ws.close()
chrome.kill()
