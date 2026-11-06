// usage: node shoot-retina.mjs out-dir  (Retina build served on :5280)
import path from 'node:path'; import { launch, sleep } from './lib.mjs'
const out = process.argv[2]
const go = async (page, url, name) => { await page.goto('http://127.0.0.1:5280' + url, { waitUntil: 'networkidle0' }); await sleep(900); await page.screenshot({ path: path.join(out, name + '.png') }); const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 420)); console.log('##', name, page.url().replace('http://127.0.0.1:5280', ''), '\n', t) }
const desk = [['/login','login'],['/index','roles'],['/nutritionist/dashboard','nut-dashboard'],['/nutritionist/queue','nut-queue'],['/nutritionist/approved','nut-approved'],['/article-sme/review','sme-review'],['/article-sme/catalog','sme-catalog'],['/article-sme/dashboard','sme-dashboard'],['/article-sme/audit','sme-audit'],['/admin/dashboard','admin-dashboard'],['/admin/users','admin-users'],['/admin/sites','admin-sites'],['/admin/config','admin-config']]
const a = await launch(1440, 900, 2)
for (const [u, n] of desk) await go(a.page, u, n)
await a.browser.close()
const m = await launch(402, 820, 3)
for (const [u, n] of [['/store-manager/articles','sm-articles'],['/store-manager/barcode','sm-barcode'],['/store-manager/capture','sm-capture'],['/store-manager/review','sm-review'],['/store-manager/done','sm-done'],['/store-manager/progress','sm-progress'],['/store-manager/retry','sm-retry']]) await go(m.page, u, n)
await m.browser.close()

// The nutritionist's review: label beside the extracted data, then the approval gate.
const clickBtn = (page, label, nth = 0) => page.evaluate((l, n) => { const b = [...document.querySelectorAll('button')].filter((x) => (x.innerText || '').trim().replace(/\s+/g, ' ').startsWith(l))[n]; if (b) b.click(); return !!b }, label, nth)
const r = await launch(1440, 900, 2)
await r.page.goto('http://127.0.0.1:5280/nutritionist/queue', { waitUntil: 'networkidle0' }); await sleep(900)
for (const l of ['BACK', 'NUTRIENTS', 'INGREDIENTS']) { console.log(l, await clickBtn(r.page, l)); await sleep(500) }
await r.page.screenshot({ path: path.join(out, 'nut-review.png') })
console.log('approve', await clickBtn(r.page, 'Approve & Push')); await sleep(800)
await r.page.screenshot({ path: path.join(out, 'nut-approve.png') })
console.log((await r.page.evaluate(() => document.querySelector('[role=dialog]')?.innerText || 'no dialog')).replace(/\s+/g, ' ').slice(0, 300))
await r.browser.close()
