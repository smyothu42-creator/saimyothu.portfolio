import { launch, sleep, clickText, buttons } from './lib.mjs'
const [path, ...steps] = process.argv.slice(2)
const shot = (process.env.SHOT || 'sc')
const { browser, page } = await launch(1440, 900, 1)
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('theme', 'light') } catch {} })
await page.goto((process.env.BASE || 'http://localhost:3200') + path, { waitUntil: 'networkidle2', timeout: 180000 }); await sleep(5000)
let i = 0
for (const s of steps) { if (s[0] === '@') { await sleep(+s.slice(1)); continue } try { await clickText(page, s) } catch { console.log('MISS', s) } await sleep(2500); await page.screenshot({ path: `${shot}-${i++}.png` }); console.log(s, '=>', page.url().replace(/^https?:\/\/[^/]+/, ''), JSON.stringify((await buttons(page)).slice(0, 30)).slice(0, 700)) }
await page.screenshot({ path: 'sc-end.png' }); console.log('END', page.url())
await browser.close()
