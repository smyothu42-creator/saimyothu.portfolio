// The orange iPhone for the OrderFlow thumbnail: a flat render on a transparent
// canvas, placed in the hand by hand-of.py. usage: node of-phone.mjs
import fs from 'node:fs'; import path from 'node:path'; import { launch } from './lib.mjs'
const { browser, page } = await launch(800, 600, 1)
await page.goto('file://' + path.resolve('composer.html'), { waitUntil: 'networkidle0' })
const url = await page.evaluate(() => window.phonePng('out-hi-of-home/menu.png', 1400, {
  png: true, rim: 0.017, bezel: 0.021,
  rimStops: [[0, '#f0883f'], [0.3, '#c9541a'], [0.62, '#de6a26'], [1, '#a8430f']],
}))
fs.writeFileSync('out-hi-of-home/phone.png', Buffer.from(url.split(',')[1], 'base64')); await browser.close()
