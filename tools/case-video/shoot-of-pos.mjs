// The POS screen for the OrderFlow cover: the real admin on fictional data, at the screen's ratio.
// Run mock-of-api.mjs and the admin on :3011 (see shoot-of-admin.mjs), then: node shoot-of-pos.mjs
import cv from 'node:child_process'; import { launch, sleep } from './lib.mjs'
const base = 'http://localhost:3011'
const { browser, page } = await launch(1440, 1022, 2)
page.on('pageerror', (e) => console.log('ERR', e.message.slice(0, 140)))
const clean = () => page.addStyleTag({ content: '.tsqd-parent-container,[class*="TanStackDevtools"],[class*="tsrd"],.tsd-main-panel,#_tanstack-devtools,[data-testid="tanstack_devtools"]{display:none!important} *{caret-color:transparent!important}' })
const hideBadge = () => page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); if (st.position === 'fixed' && r.left < 90 && r.bottom > innerHeight - 90 && r.width < 90 && r.height < 90) el.style.display = 'none' } })
const click = (t) => page.evaluate((t) => { const c = [...document.querySelectorAll('button,[role=button],a,div,span,p,h2,h3')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && e.innerText?.trim() === t }); const e = c[c.length - 1]; if (e) e.click(); return !!e }, t)
await page.goto(base + '/orders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await sleep(9000); await clean()
console.log('card', await click('5')); await sleep(2000); await hideBadge(); await page.screenshot({ path: 'pos3d/tex/pos-raw.png' })
await browser.close()
cv.execFileSync('python3', ['-c', `
import cv2
i = cv2.imread('pos3d/tex/pos-raw.png')
cv2.imwrite('pos3d/tex/pos-screen.png', cv2.resize(i, (2048, 1453), interpolation=cv2.INTER_AREA))
`]); cv.execFileSync('rm', ['pos3d/tex/pos-raw.png'])
