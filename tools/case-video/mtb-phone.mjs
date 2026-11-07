// The red iPhone for the MTB Pay Merchant thumbnail: the home screen with its export
// edges trimmed, as a flat render on a transparent canvas, placed in the hand by
// hand-of.py. usage: node mtb-phone.mjs
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { launch } from './lib.mjs'
// The -body crop, because the mockup draws its own status bar.
execFileSync('python3', ['-c', `
import cv2
i = cv2.imread('out-mtb/home-body.png')
cv2.imwrite('out-mtb/home-trim.png', i[:-17, :-4])
`])
const { browser, page } = await launch(800, 600, 1)
await page.goto('file://' + path.resolve('composer.html'), { waitUntil: 'networkidle0' })
const url = await page.evaluate(() => window.phonePng('out-mtb/home-trim.png', 1400, {
  png: true, rim: 0.017, bezel: 0.021,
  rimStops: [[0, '#ef5350'], [0.3, '#b81d24'], [0.62, '#d32f2f'], [1, '#8e1218']],
}))
fs.writeFileSync('out-mtb/phone.png', Buffer.from(url.split(',')[1], 'base64')); await browser.close()
