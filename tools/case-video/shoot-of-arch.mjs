// The owner screen in OrderFlow's architecture block: the admin's Reports page on fictional data.
// Run mock-of-api.mjs and the admin as for the Orders tabs, then: node shoot-of-arch.mjs <out.jpg>
import { launch, sleep } from './lib.mjs'
const { browser, page } = await launch(1440, 1024, 2)
await page.emulateTimezone('Europe/London')
await page.goto('http://localhost:3011/reports', { waitUntil: 'domcontentloaded', timeout: 120000 }); await sleep(8000)
await page.addStyleTag({ content: '.tsqd-parent-container,[class*="TanStackDevtools"],[class*="tsrd"],.tsd-main-panel,#_tanstack-devtools,[data-testid="tanstack_devtools"]{display:none!important} *{caret-color:transparent!important}' })
await page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); if (st.position === 'fixed' && r.left < 90 && r.bottom > innerHeight - 90 && r.width < 90 && r.height < 90) el.style.display = 'none' } })
await page.mouse.move(1430, 10); await sleep(600)
await page.screenshot({ path: '/tmp/claude-501/arch-owner.png' })
await browser.close()
