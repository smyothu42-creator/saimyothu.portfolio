// Exports a hero scene frame by frame to a lossless master (RGB, FFV1), so the final x264 encode
// starts clean. window.run() records through Chrome's real-time encoder, which blurs and can drop frames.
// usage (from this folder): node hero-master.mjs of|sf|mtb out.mkv [fps]
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { launch } from './lib.mjs'

const [name, out, fps = '30'] = process.argv.slice(2)
const scene = `hero-${name}`
const { browser, page } = await launch(1600, 1032, 1)
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto('file://' + path.resolve(`${scene}.html`), { waitUntil: 'networkidle0' })
const names = fs.readdirSync(scene).filter((f) => f.endsWith('.jpg'))
await page.evaluate((s) => window.prep(s), Object.fromEntries(names.map((f) => [f.replace('.jpg', ''), `${scene}/${f}`])))

const T = await page.evaluate(() => T)
const n = Math.round(T * +fps)
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'png', '-framerate', fps, '-i', '-',
  '-c:v', 'ffv1', '-level', '3', '-pix_fmt', 'gbrp', out], { stdio: ['pipe', 'inherit', 'inherit'] })
const closed = new Promise((ok) => ff.on('close', ok))

for (let i = 0; i < n; i++) {
  const url = await page.evaluate((t) => { frame(t); return C.toDataURL('image/png') }, i / +fps)
  if (!ff.stdin.write(Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'))) await new Promise((ok) => ff.stdin.once('drain', ok))
  if (i % 100 === 0) console.log(`${name} ${i}/${n}`)
}
ff.stdin.end()
const code = await closed
await browser.close()
console.log(`${name} done: ${n} frames, ffmpeg exit ${code}`)
process.exit(code)
