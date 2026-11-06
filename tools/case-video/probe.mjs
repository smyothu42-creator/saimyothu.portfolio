// Click through a flow and print the visible buttons after each step.
// usage: URL=http://... node probe.mjs "Button" "~Slide label" "@ms" ...
import { launch, sleep, clickText, buttons, slide } from './lib.mjs'
const { browser, page } = await launch(+(process.env.W || 402), +(process.env.H || 820), +(process.env.DPR || 2))
await page.goto(process.env.URL || 'http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 120000 })
let i = 0
for (const s of process.argv.slice(2)) {
  if (s.startsWith('@')) { await sleep(+s.slice(1)); continue }
  if (s.startsWith('TYPE:')) { const [sel, txt] = s.slice(5).split('|'); await page.type(sel, txt, { delay: 45 }); await sleep(300); continue }
  try { s.startsWith('~') ? await slide(page, s.slice(1)) : await clickText(page, s) } catch { console.log('MISS', s) }
  await sleep(1200)
  await page.screenshot({ path: `probe-${i++}.png` })
  console.log(s, '=>', page.url().replace(/^https?:\/\/[^/]+/, ''), JSON.stringify((await buttons(page)).slice(0, 24)))
}
await page.screenshot({ path: 'probe-end.png' })
await browser.close()
