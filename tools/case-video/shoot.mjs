// usage: node shoot.mjs <url> <out.png> [w h dpr fullPage]
import { launch, sleep, clickText } from './lib.mjs'
const [url, out, w = 1440, h = 900, dpr = 2, full = ''] = process.argv.slice(2)
const { browser, page } = await launch(+w, +h, +dpr)
await page.goto(url, { waitUntil: 'networkidle0' }); await sleep(500)
for (const c of (process.env.CLICKS || '').split('|').filter(Boolean)) { try { await clickText(page, c) } catch { console.log('MISS', c) } await sleep(700) }
await page.screenshot({ path: out, fullPage: !!full })
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,button,a,[data-screen],.screen-label,nav li')].map((e) => e.innerText.trim()).filter(Boolean).slice(0, 60))))
await browser.close()
