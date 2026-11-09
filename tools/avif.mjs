// Makes an .avif next to every JPG and PNG in public/. The site serves the AVIF
// when the browser supports it and one exists (see src/avif.js), so adding a
// photo without running this is safe: it just stays a JPG until you do.
//
// usage: SHARP_DIR=/path/with/node_modules/sharp node tools/avif.mjs [--force]
// sharp stays out of package.json on purpose; install it anywhere with `npm i sharp`.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(path.join(process.env.SHARP_DIR || process.cwd(), 'x.js'))
const sharp = require('sharp')
const force = process.argv.includes('--force')

const ROOT = 'public'
const SKIP = /(^|\/)(favicon|apple-touch-icon|og-)/ // fetched by name by browsers and link previews
// Photos with film grain and soft gradients show artefacts sooner than UI does.
const quality = (rel) => (rel.includes('/') ? 62 : 72)
const MIN_SAVING = 0.1 // not worth a second file below this

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name)
  return e.isDirectory() ? walk(p) : [p]
})
const files = walk(ROOT).filter((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.test(path.relative(ROOT, f)))

sharp.concurrency(2)
let before = 0, after = 0, made = 0, kept = 0
const queue = [...files]
const worker = async () => {
  for (let f; (f = queue.shift()); ) {
    const out = f.replace(/\.\w+$/, '.avif')
    const size = fs.statSync(f).size
    if (!force && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(f).mtimeMs) {
      before += size; after += fs.statSync(out).size; continue
    }
    const buf = await sharp(f).rotate().avif({ quality: quality(path.relative(ROOT, f)), effort: 6, chromaSubsampling: '4:4:4' }).toBuffer()
    if (buf.length > size * (1 - MIN_SAVING)) {
      fs.rmSync(out, { force: true })
      before += size; after += size; kept++
      continue
    }
    fs.writeFileSync(out, buf)
    before += size; after += buf.length; made++
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
console.log(`${files.length} images: ${made} encoded, ${kept} kept as they were (AVIF not worth it)`)
console.log(`${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`)
