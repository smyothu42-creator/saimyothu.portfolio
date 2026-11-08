// usage: node lp-record.mjs [pilot] [home partner pricing about faqs]
// Records the live OrderFlow site (orderflowmm.com/en) into out-lpw-<name>/ + cfg-lpw-<name>.json:
// the Pilot Partnership request, then one top-to-bottom scroll per page.
// The request uses sample details and is never sent: all form traffic is blocked
// and the recording stops on the final button.
import fs from 'node:fs'
import { launch, sleep } from './lib.mjs'
const W = 1440, H = 900, FPS = 20
const PAGES = { home: ['/en', 650], partner: ['/en/partner', 520], pricing: ['/en/pricing', 260], about: ['/en/about', 400], faqs: ['/en/faqs', 300] }
const want = process.argv.slice(2)
const on = (n) => !want.length || want.includes(n)
const { browser, page } = await launch(W, H, 1)
await page.setRequestInterception(true)
page.on('request', (r) => { if (r.method() !== 'GET' && /orderflowmm/.test(r.url()) && !/_next\/static/.test(r.url())) { console.log('blocked', r.method()); r.abort() } else r.continue() })
const finish = (name, frames, taps, tail) => {
  const out = `out-lpw-${name}`
  fs.writeFileSync(`${out}/index.json`, JSON.stringify({ w: W, h: H, css: [W, H], frames, marks: [], taps }))
  fs.writeFileSync(`cfg-lpw-${name}.json`, JSON.stringify({ W: 1200, H: 750, fps: 30, bitrate: 1600000, raw: true, cursor: true, scenes: [{ kind: 'desk', src: out, speed: 1, maxHold: 3, tail }] }))
  console.log(name, frames.length, 'frames', frames.at(-1).t, 's', taps.length, 'cursor points')
}
const fresh = (name) => { const out = `out-lpw-${name}`; fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out); return out }

if (on('pilot')) {
  const out = fresh('pilot')
  await page.goto('https://orderflowmm.com/en/partner', { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(4000) // past the site's loading splash
  const frames = [], taps = []; let rec = true, n = 0; const t0 = Date.now()
  const now = () => (Date.now() - t0) / 1000
  const loop = (async () => { while (rec) { const file = `f${String(n++).padStart(5, '0')}.jpg`; const t = now(); await page.screenshot({ path: `${out}/${file}`, type: 'jpeg', quality: 88 }); frames.push({ t: +t.toFixed(3), file }); await sleep(15) } })()
  const box = async (h) => { const b = await h.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
  const press = async (h, quiet) => { const c = await box(h); taps.push({ t: +(now() + 0.05).toFixed(3), x: Math.round(c.x), y: Math.round(c.y), ...(quiet ? { quiet: true } : {}) }); await sleep(120); if (!quiet) await page.mouse.click(c.x, c.y) }
  const byText = (t) => page.evaluateHandle((x) => [...document.querySelectorAll('[role=dialog] button, a, button')].find((e) => e.innerText.trim().startsWith(x) && e.getBoundingClientRect().width > 0), t)
  const field = async (sel, text) => { const h = await page.$(sel); await press(h); await sleep(150); await page.keyboard.type(text, { delay: 42 }); await sleep(320) }
  const choose = async (sel, label) => { const h = await page.$(sel); const c = await box(h); taps.push({ t: +(now() + 0.05).toFixed(3), x: Math.round(c.x), y: Math.round(c.y) }); await sleep(200); await page.evaluate((s, l) => { const e = document.querySelector(s); const o = [...e.options].find((x) => x.text === l) || e.options[1]; const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; set.call(e, o.value); e.dispatchEvent(new Event('change', { bubbles: true })) }, sel, label); await sleep(420) }
  await sleep(1100)
  await press(await byText('Apply for the Pilot')); await sleep(1100)
  await field('input[name=name]', 'Aung Kyaw'); await field('input[name=restaurantName]', 'Plant House Cafe'); await field('input[name=phone]', '09123456789')
  await press(await byText('Continue')); await sleep(1000)
  await choose('select[name=restaurantType]', 'Cafe'); await field('input[name=location]', 'Yangon'); await choose('select[name=tables]', '10-20'); await field('input[name=currentPos]', 'Paper slips')
  await press(await byText('Continue')); await sleep(1000)
  const v = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => [e.name, [...e.options].map((o) => o.text)]))
  console.log(JSON.stringify(v))
  for (const [nm, opts] of v) await choose(`select[name=${nm}]`, opts[1])
  await field('textarea[name=biggestProblem]', 'Orders get lost at the counter during rush hour.')
  const last = await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].filter((e) => e.getBoundingClientRect().width > 0 && e.innerText.trim()); return b.at(-1).innerText.trim() })
  console.log('final button:', last)
  await press(await byText(last), true) // the arrow rests on it: never clicked, nothing is sent
  await sleep(1400)
  rec = false; await loop
  finish('pilot', frames, taps, 1.8)
}
for (const [name, [path, speed]] of Object.entries(PAGES)) {
  if (!on(name)) continue
  const out = fresh(name)
  await page.goto('https://orderflowmm.com' + path, { waitUntil: 'networkidle2', timeout: 60000 })
  const to = (y) => page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += 500) { await to(y); await sleep(220) } // lazy images, entrance animations
  await to(0); await sleep(900)
  const span = total - H, secs = Math.max(4.5, span / speed + 2.2), n = Math.round(secs * FPS), frames = []
  for (let i = 0; i <= n; i++) {
    const p = Math.min(1, Math.max(0, (i / n - 1 / secs) / (1 - 2 / secs))) // a beat at each end
    await to(span * (p * p * (3 - 2 * p))); await sleep(25)
    const file = `f${String(i).padStart(5, '0')}.jpg`
    await page.screenshot({ path: `${out}/${file}`, type: 'jpeg', quality: 88 })
    frames.push({ t: +(i / FPS).toFixed(3), file })
  }
  // the arrow drifts down the page beside the content, without clicking
  const spots = [[720, 450], [430, 520], [980, 380], [620, 600], [1080, 520], [360, 400]]
  const taps = []; for (let t = 1.1, k = 0; t < secs - 0.6; t += 2.6, k++) { const s = spots[k % spots.length]; taps.push({ t: +t.toFixed(2), x: s[0], y: s[1], quiet: true }) }
  finish(name, frames, taps, 2.4)
}
await browser.close()
