// Screens and logo for the 3D scene, into pos3d/tex/.
import fs from 'node:fs'; import path from 'node:path'; import { launch } from '../lib.mjs'
fs.mkdirSync('pos3d/tex', { recursive: true })
const { browser, page } = await launch(800, 800, 1)
await page.goto('file://' + path.resolve('composer.html'), { waitUntil: 'networkidle0' })
const png = await page.evaluate(() => window.phonePng('out-of-guest/f00000.jpg', 1400, { png: true, rim: 0.0 }))
fs.writeFileSync('pos3d/tex/phone.png', Buffer.from(png.split(',')[1], 'base64'))
const bg = await page.evaluate(() => window.still({ W: 1890, H: 1400, theme: 'site', bgImage: 'bg-calm.jpg', bgY: 0.42, bgDim: 0.66, phones: [] }))
fs.writeFileSync('pos3d/tex/backdrop.jpg', Buffer.from(bg.split(',')[1], 'base64'))
await browser.close()
