import path from 'node:path'; import { launch, sleep, buttons } from './lib.mjs'
const out = process.argv[2], pages = process.argv.slice(3)
const { browser, page } = await launch(402, 820, 1)
for (const u of pages) {
  await page.goto('http://localhost:3002/fudo-bakery/menu/' + u, { waitUntil: 'domcontentloaded', timeout: 180000 }); await sleep(9000)
  await page.screenshot({ path: path.join(out, 'g_' + u.replace(/\//g, '_').slice(-40) + '.png') })
  console.log('##', u, (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 260)); console.log(JSON.stringify(await buttons(page)).slice(0, 600))
}
await browser.close()
