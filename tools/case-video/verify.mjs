// usage: node verify.mjs video.mp4 sheet.png [n]
import path from 'node:path'
import { launch } from './lib.mjs'
const [vid, out, n = 8] = process.argv.slice(2)
const { browser, page } = await launch(1600, 900, 1)
await page.goto('file://' + path.resolve('composer.html'))
const info = await page.evaluate(async (src, n) => {
  const v = document.createElement('video'); v.src = src; v.muted = true; await new Promise((r) => (v.onloadeddata = r))
  const d = v.duration, cols = 4, w = 400, h = Math.round(w * v.videoHeight / v.videoWidth)
  const c = document.createElement('canvas'); c.width = cols * w; c.height = Math.ceil(n / cols) * h; const x = c.getContext('2d')
  for (let i = 0; i < n; i++) { v.currentTime = (d * (i + 0.5)) / n; await new Promise((r) => (v.onseeked = r)); x.drawImage(v, (i % cols) * w, Math.floor(i / cols) * h, w, h) }
  document.body.innerHTML = ''; document.body.appendChild(c); window.__png = c.toDataURL('image/png')
  return { d, vw: v.videoWidth, vh: v.videoHeight }
}, 'file://' + path.resolve(vid), +n)
const png = await page.evaluate(() => window.__png)
;(await import('node:fs')).writeFileSync(out, Buffer.from(png.split(',')[1], 'base64'))
console.log(JSON.stringify(info))
await browser.close()
