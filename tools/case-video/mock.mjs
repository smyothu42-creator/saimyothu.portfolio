// usage: node mock.mjs cfg.json out.jpg
// A 3D mockup: real app screens as phones with a side edge, or crops of them as
// floating cards, placed with CSS 3D over a mesh background. Frames come from
// composer.html. cfg: { mesh, perspective, stage (CSS transform), items: [
//   { src, x, y, w, t (CSS transform), depth, sh: [dx, dy, blur, alpha] }           phone
//   { src, crop: [x, y, w, h], x, y, w, t, radius, sh }                             card ] }
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { launch, sleep } from './lib.mjs'
const [cfgFile, out] = process.argv.slice(2)
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'))
const { browser, page } = await launch(1000, 1000, 2) // not 3: the raised phone's layer gets too big and draws blank
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto('file://' + path.resolve('composer.html'), { waitUntil: 'networkidle0' })
const bg = await page.evaluate((c) => window.still({ W: 1000, H: 1000, theme: 'site', mesh: c.mesh, phones: [] }), cfg)
for (const it of cfg.items) {
  if (it.crop) it.url = 'data:image/jpeg;base64,' + fs.readFileSync(it.src).toString('base64')
  else it.url = await page.evaluate((s) => window.phonePng(s, 1400), it.src)
}
await page.evaluate(async (c, bg) => {
  document.documentElement.style.background = '#000'
  const shadow = c.shadow || '20,44,36'
  const html = c.items.map((it) => {
    const sh = it.sh || [40, 60, 50, 0.4]
    const pos = `position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;transform-style:preserve-3d;transform:translate(-50%,-50%) ${it.t || ''}`
    if (it.crop) {
      const [cx, cy, cw, ch] = it.crop, k = it.w / cw, h = ch * k, r = it.radius ?? 28
      return `<div style="${pos};height:${h}px">
        <div style="position:absolute;inset:0;border-radius:${r}px;background:rgba(${shadow},${sh[3]});filter:blur(${sh[2]}px);transform:translate3d(${sh[0]}px,${sh[1]}px,-2px)"></div>
        <div style="position:absolute;inset:0;border-radius:${r}px;overflow:hidden;background:url(${it.url}) ${-cx * k}px ${-cy * k}px / ${it.iw * k}px auto no-repeat;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)"></div></div>`
    }
    const h = it.w * 2.1, r = it.w * 0.167, D = it.depth ?? 16
    const edge = Array.from({ length: D }, (_, i) => `<div style="position:absolute;inset:0;border-radius:${r}px;background:${i < 2 || i > D - 3 ? '#8d8f94' : '#55575c'};transform:translateZ(${-i - 1}px)"></div>`).join('')
    return `<div style="${pos};height:${h}px">
      <div style="position:absolute;inset:0;border-radius:${r}px;background:rgba(${shadow},${sh[3]});filter:blur(${sh[2]}px);transform:translate3d(${sh[0]}px,${sh[1]}px,${-D - 2}px)"></div>
      ${edge}<img src="${it.url}" style="position:absolute;inset:0;width:100%;display:block"></div>`
  }).join('')
  document.body.innerHTML = `<div style="position:fixed;inset:0;overflow:hidden;background:url(${bg}) center/cover;perspective:${c.perspective || 2600}px">
    <div style="position:absolute;inset:0;transform-style:preserve-3d;transform:${c.stage || 'none'}">${html}</div></div>`
  document.body.style.margin = 0
  await Promise.all([...document.images].map((i) => i.decode())) // rejects if a phone failed to load
}, cfg, bg)
await sleep(300)
await page.screenshot({ path: out + '.png', type: 'png' }) // drawn large, then reduced for clean edges
await browser.close()
execFileSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '90', out + '.png', '--out', out], { stdio: 'ignore' })
fs.unlinkSync(out + '.png'); console.log(out, (fs.statSync(out).size / 1024 | 0) + ' KB')
