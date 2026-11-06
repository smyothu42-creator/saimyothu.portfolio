// usage: node shoot-of-admin.mjs out-dir
// Real OrderFlow admin UI on fictional data: run mock-of-api.mjs, then the admin with
// VITE_AUTH_API_URL=http://127.0.0.1:3012/api/v1 DEV_API_TARGET=http://127.0.0.1:3012 on :3011.
import path from 'node:path'; import { launch, sleep } from './lib.mjs'
const out = process.argv[2], base = 'http://localhost:3011', DPR = +(process.env.DPR || 2)
const { browser, page } = await launch(1440, 900, DPR)
page.on('pageerror', (e) => console.log('ERR', e.message.slice(0, 140)))
const clean = () => page.addStyleTag({ content: '.tsqd-parent-container,[class*="TanStackDevtools"],[class*="tsrd"],.tsd-main-panel,#_tanstack-devtools,[data-testid="tanstack_devtools"]{display:none!important} *{caret-color:transparent!important}' })
const hideBadge = () => page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); if (st.position === 'fixed' && r.left < 90 && r.bottom > innerHeight - 90 && r.width < 90 && r.height < 90) el.style.display = 'none' } })
const shot = async (n) => { await hideBadge(); await sleep(500); await page.screenshot({ path: path.join(out, n + '.png') }); console.log('##', n, (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(130, 560)) }
const click = (t, sel = 'button,[role=button],a,div,span,p,h2,h3') => page.evaluate((t, sel) => { const c = [...document.querySelectorAll(sel)].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && e.innerText?.trim() === t }); const e = c[c.length - 1]; if (e) e.click(); return !!e }, t, sel)
const open = async (u) => { await page.goto(base + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await sleep(6000); await clean() }
await open('/orders'); await shot('board')
console.log('card', await click('5')); await sleep(1800); await shot('qr')
await open('/orders'); console.log('card', await click('R-03')); await sleep(1800); await shot('room')
console.log('pay', await page.evaluate(() => { const b = [...document.querySelectorAll('button')].filter((x) => /payment|checkout|done/i.test(x.innerText)); const e = b[b.length - 1]; e?.click(); return e?.innerText })); await sleep(1800); await shot('room-pay')
await open('/orders'); console.log('new', await click('+ Manual Order')); await sleep(1500); await shot('table-pick')
console.log('table', await click('6')); await sleep(1500); await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /^(continue|confirm|next|ok|start)/i.test(x.innerText.trim())); b?.click() }); await sleep(5000); await clean()
for (const n of ['Iced Americano', 'Latte', 'Cinnamon Roll']) console.log(n, await click(n)); await sleep(2500); await shot('manual')
await browser.close()
