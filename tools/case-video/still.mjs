// usage: node still.mjs cfg.json out.jpg
import fs from 'node:fs'; import path from 'node:path'; import { launch } from './lib.mjs'
const [cfgFile, out] = process.argv.slice(2)
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'))
const { browser, page } = await launch(cfg.W, cfg.H, 1)
await page.goto('file://' + path.resolve('composer.html'), { waitUntil: 'networkidle0' })
const url = await page.evaluate((c) => window.still(c), cfg)
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log(out, (fs.statSync(out).size / 1024 | 0) + ' KB')
await browser.close()
