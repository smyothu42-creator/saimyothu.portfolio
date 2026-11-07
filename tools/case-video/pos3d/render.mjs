// usage (from tools/case-video): node pos3d/render.mjs pos3d/scene.json out-prefix samples
import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'
import puppeteer from '/Users/saimyothu/claude-workspace/orderflow-pitch-deck/_svg-tool/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
const [cfgFile, out, samples = '64'] = process.argv.slice(2)
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'))
const root = path.resolve('pos3d'), types = { '.js': 'text/javascript', '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.wasm': 'application/wasm' }
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end() } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) }).listen(5199)
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', protocolTimeout: 900000, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', `--window-size=${cfg.W},${cfg.H}`] })
const page = await browser.newPage(); await page.setViewport({ width: cfg.W, height: cfg.H, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('ERR', e.message)); page.on('console', (m) => { if (m.type() === 'error') console.log('LOG', m.text().slice(0, 300)) })
await page.goto('http://localhost:5199/scene.html', { waitUntil: 'load' })
await page.waitForFunction('window.build', { timeout: 15000 }).catch(() => console.log('no build'))
console.log(await page.evaluate((c) => { const g = document.createElement('canvas').getContext('webgl2'); const e = g.getExtension('WEBGL_debug_renderer_info'); return g.getParameter(e.UNMASKED_RENDERER_WEBGL) }))
console.log(await page.evaluate((c) => window.build(c), cfg))
const save = (u, f) => fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64'))
let s = 0, t0 = Date.now()
while (s < +samples) { const r = await page.evaluate(() => window.step(4)); s = r.samples; if (Math.floor(s) % 32 < 1) console.log(s.toFixed(1), ((Date.now() - t0) / 1000 | 0) + 's') ; if (Date.now() - t0 > 480000) break }
save(await page.evaluate(() => window.grab()), out + '-beauty.png')
save(await page.evaluate(() => window.mask()), out + '-mask.png')
const quads = {}
for (const n of ['pos', 'phone']) { const r = await page.evaluate((n) => window.screenPass(n), n); quads[n] = r.quad; save(r.mask, `${out}-screen-${n}.png`) }
fs.writeFileSync(out + '-quads.json', JSON.stringify(quads))
console.log('samples', s.toFixed(1))
// The counter alone: comparing it with the beauty pass gives just shadows and reflections.
const p2 = await browser.newPage(); await p2.setViewport({ width: cfg.W, height: cfg.H, deviceScaleFactor: 1 })
await p2.goto('http://localhost:5199/scene.html', { waitUntil: 'load' }); await p2.waitForFunction('window.build')
await p2.evaluate((c) => window.build({ ...c, floorOnly: true }), cfg)
let f = 0; while (f < +samples) f = (await p2.evaluate(() => window.step(4))).samples
save(await p2.evaluate(() => window.grab()), out + '-floor.png')
await browser.close(); srv.close()
