// Superfine Corporate Meal Order cover loop: renders hero-sf.html to MP4, or stills for checking.
// usage: node hero-of.mjs out.mp4 [bitrate]      node hero-of.mjs --stills dir t1 t2 ...
import fs from 'node:fs'
import path from 'node:path'
import { launch } from './lib.mjs'
const args = process.argv.slice(2)
const { browser, page } = await launch(1600, 1032, 1)
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto('file://' + path.resolve('hero-sf.html'), { waitUntil: 'networkidle0' })
const names = fs.readdirSync('hero-sf').filter((f) => f.endsWith('.jpg'))
const srcs = Object.fromEntries(names.map((f) => [f.replace('.jpg', ''), 'hero-sf/' + f]))
await page.evaluate((s) => window.prep(s), srcs)
if (args[0] === '--stills') {
  const dir = args[1]; fs.mkdirSync(dir, { recursive: true })
  for (const t of args.slice(2)) {
    const d = await page.evaluate((t) => window.still(+t), t)
    fs.writeFileSync(path.join(dir, `t${t}.jpg`), Buffer.from(d.split(',')[1], 'base64'))
  }
} else {
  const [out, bitrate = '900000'] = args
  fs.writeFileSync(out, '')
  await page.exposeFunction('saveChunk', (b64) => fs.appendFileSync(out, Buffer.from(b64, 'base64')))
  console.log(JSON.stringify(await page.evaluate((b) => window.run({ bitrate: b }), +bitrate)), (fs.statSync(out).size / 1e6).toFixed(2) + ' MB')
}
await browser.close()
