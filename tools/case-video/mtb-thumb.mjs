// usage: node mtb-thumb.mjs out.jpg  (renders mtb-thumb.html at 2x, the caller scales it down)
import path from 'node:path'; import { launch } from './lib.mjs'
const { browser, page } = await launch(1300, 1200, 2)
await page.goto('file://' + path.resolve('mtb-thumb.html'), { waitUntil: 'networkidle0' })
await page.screenshot({ path: process.argv[2], type: 'png', clip: { x: 0, y: 0, width: 1300, height: 1200 } })
await browser.close()
