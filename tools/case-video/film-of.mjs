// usage: node compose.mjs <config.json> <out.mp4>
import fs from 'node:fs'
import path from 'node:path'
import { launch } from './lib.mjs'
const [cfgFile, out] = process.argv.slice(2)
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'))
const { browser, page } = await launch(cfg.W, cfg.H, 1)
fs.writeFileSync(out, '')
await page.exposeFunction('saveChunk', (b64) => fs.appendFileSync(out, Buffer.from(b64, 'base64')))
page.on('console', (m) => console.log('page:', m.text()))
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto('file://' + path.resolve('film-of.html'), { waitUntil: 'networkidle0' })
const r = await page.evaluate((c) => window.film(c), cfg)
console.log(JSON.stringify(r), (fs.statSync(out).size / 1e6).toFixed(1) + ' MB')
await browser.close()
