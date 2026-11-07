import path from 'node:path'; import { launch, sleep } from './lib.mjs'
const out = process.argv[2], pages = process.argv.slice(3)
const { browser, page } = await launch(1440, 900, 1)
page.on('pageerror', (e) => console.log('ERR', e.message.slice(0, 140)))
for (const u of pages) {
  await page.goto('http://localhost:3011' + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await sleep(7000)
  await page.screenshot({ path: path.join(out, 'probe' + u.replace(/\//g, '_') + '.png') })
  console.log('##', u, (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 300))
}
await browser.close()
