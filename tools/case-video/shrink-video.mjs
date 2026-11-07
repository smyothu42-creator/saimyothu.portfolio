// Re-encodes a site video at a lower bitrate with Chrome's own H.264 encoder (no ffmpeg needed):
// plays it in real time and records the frames. usage: node shrink-video.mjs in.mp4 out.mp4 [bitsPerSecond]
import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'
import puppeteer from '/Users/saimyothu/claude-workspace/superfine/node_modules/.pnpm/puppeteer-core@24.37.5/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
const [src, out, bps = '1600000'] = process.argv.slice(2)
const file = path.resolve(src)
const srv = http.createServer((q, r) => {
  if (q.url === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end('<video id="v" src="/v.mp4" muted playsinline></video>') }
  const st = fs.statSync(file), m = /bytes=(\d+)-(\d*)/.exec(q.headers.range || '')
  if (m) { const a = +m[1], b = m[2] ? +m[2] : st.size - 1; r.writeHead(206, { 'content-type': 'video/mp4', 'content-range': `bytes ${a}-${b}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': b - a + 1 }); return fs.createReadStream(file, { start: a, end: b }).pipe(r) }
  r.writeHead(200, { 'content-type': 'video/mp4', 'content-length': st.size, 'accept-ranges': 'bytes' }); fs.createReadStream(file).pipe(r)
}).listen(5198)
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', protocolTimeout: 900000, args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=metal', '--enable-gpu'] })
const page = await browser.newPage()
fs.writeFileSync(out, '')
await page.exposeFunction('saveChunk', (b64) => fs.appendFileSync(out, Buffer.from(b64, 'base64')))
await page.goto('http://localhost:5198/', { waitUntil: 'load' })
const r = await page.evaluate(async (bps) => {
  const v = document.getElementById('v')
  await new Promise((ok) => { if (v.readyState >= 1) ok(); else v.onloadedmetadata = ok })
  const stream = v.captureStream()
  const rec = new MediaRecorder(stream, { mimeType: 'video/mp4;codecs=avc1.640028', videoBitsPerSecond: bps })
  const pend = []
  rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then(async (ab) => { const b = new Uint8Array(ab); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); await window.saveChunk(btoa(s)) })) }
  const done = new Promise((ok) => (rec.onstop = ok))
  rec.start(1000); await v.play()
  await new Promise((ok) => (v.onended = ok))
  rec.stop(); await done; for (const p of pend) await p
  return { w: v.videoWidth, h: v.videoHeight, dur: v.duration }
}, +bps)
console.log(src, JSON.stringify(r), (fs.statSync(file).size / 1048576).toFixed(1), '->', (fs.statSync(out).size / 1048576).toFixed(1), 'MB')
await browser.close(); srv.close()
