// usage: node poster.mjs video.mp4 out.jpg seconds
import fs from 'node:fs'; import path from 'node:path'; import { launch } from './lib.mjs'
const [vid, out, at] = process.argv.slice(2)
const { browser, page } = await launch(800, 600, 1)
await page.goto('file://' + path.resolve('composer.html'))
const url = await page.evaluate(async (src, at) => {
  const v = document.createElement('video'); v.src = src; v.muted = true; await new Promise((r) => (v.onloadeddata = r))
  v.currentTime = at; await new Promise((r) => (v.onseeked = r))
  const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0)
  return c.toDataURL('image/jpeg', 0.82)
}, 'file://' + path.resolve(vid), +at)
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await browser.close()
