// Run steps like record.mjs, screenshotting after each click (for writing a steps file).
import fs from 'node:fs'; import { launch, sleep, clickText, buttons } from './lib.mjs'
const [out, stepsFile, url, W = 402, H = 820] = process.argv.slice(2)
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8')); fs.mkdirSync(out, { recursive: true })
const { browser, page } = await launch(+W, +H, 1)
if (process.env.MOCKS) { const mocks = (await import(new URL(process.env.MOCKS, 'file://' + process.cwd() + '/').href)).default; await page.setRequestInterception(true); page.on('request', (rq) => { const m = mocks.find((x) => (!x.method || x.method === rq.method()) && x.re.test(rq.url())); if (!m) return rq.continue(); console.log('FAKED', rq.method(), rq.url().slice(0, 90)); rq.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(m.body(rq.url())) }) }) }
if (process.env.TZ_EMU) await page.emulateTimezone(process.env.TZ_EMU) // e.g. show a daytime clock
await page.goto(url, { waitUntil: 'networkidle2', timeout: 180000 })
let n = 0
for (const s of steps) {
  if (s.startsWith('@')) { await sleep(+s.slice(1)); continue }
  if (s.startsWith('CSS:')) { await page.addStyleTag({ content: s.slice(4) }); continue }
  if (s.startsWith('#') || s === 'REC') continue
  if (s.startsWith('UPLOAD:')) { const [sel, file] = s.slice(7).split('|'); const h = await page.$(sel); await h.uploadFile(file); await sleep(800); continue } // a file into a file input
  if (s.startsWith('FILL:')) { const [sel, txt] = s.slice(5).split('|'); await page.click(sel); await page.type(sel, txt, { delay: 0 }); await sleep(300); await page.screenshot({ path: out + '/f-' + sel.replace(/\W/g, '') + '.png' }); continue }
  if (s.startsWith('EVAL:')) { console.log('EVAL', JSON.stringify(await page.evaluate(s.slice(5))).slice(0, 1500)); continue }
  if (s.startsWith('SCROLLIN:')) { const [sel, y] = s.slice(9).split('|'); await page.evaluate((sel, y) => document.querySelector(sel)?.scrollBy({ top: +y, behavior: 'smooth' }), sel, y); await sleep(900); continue } // scroll one element, e.g. a modal body
  if (s.startsWith('TYPE:')) { const [sel, txt] = s.slice(5).split('|'); await page.type(sel, txt, { delay: 10 }); continue }
  if (s.startsWith('KEY:')) { await page.keyboard.press(s.slice(4)); await sleep(400); continue }
  if (s.startsWith('!')) { await page.evaluate((y) => { const el = [...document.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)); (el || document.scrollingElement).scrollBy({ top: y }) }, +s.slice(1)); await sleep(600); continue }
  if (s.startsWith('GO:')) { await page.goto(s.slice(3), { waitUntil: 'networkidle2' }); }
  else { try { await clickText(page, s) } catch { console.log('MISS', s) } }
  await sleep(1500); n++
  await page.screenshot({ path: `${out}/s${String(n).padStart(2, '0')}.png` })
  console.log('--', n, s, '|', page.url().replace(/^.*\/menu\//, ''), '|', JSON.stringify(await buttons(page)).slice(0, 400))
}
await page.screenshot({ path: out + '/zz-end.png' })
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('input,textarea')].filter(e=>e.getBoundingClientRect().height).map(e=>({n:e.name,id:e.id,ph:e.placeholder,t:e.type})))))
await browser.close()
