import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9700 + Math.floor(Math.random() * 40)
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', `--user-data-dir=/tmp/cdp-profile-edge-${PORT}`, 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const js = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

// Reached only when a slide is skipped or broken.
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(3000)

// 1. back during the slide
await js(`document.querySelector('.em-stage-nav a[href="/about"]').click()`)
await wait(200)
await send('Page.navigate', { url: 'http://localhost:5173/' }).catch(() => {})
await wait(100)
await js('history.back()')
await wait(1200)
console.log('back-during-slide', await js(`JSON.stringify({path: location.pathname, slide: !!document.querySelector('.pg-slide'), stage: !!document.querySelector('.em-stage'), tf: document.querySelector('.em-stage')?.style.transform || ''})`))

// 2. about → contact (cross-fade path) then back button
await js(`document.querySelector('.em-stage-nav a[href="/about"]').click()`)
await wait(1000)
await js(`document.querySelector('.em-nav a[href="/contact"], .em-top a[href="/contact"]').click()`)
await wait(1200)
console.log('about-contact', await js(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, slide: !!document.querySelector('.pg-slide')})`))
await js('history.back()')
await wait(1200)
console.log('back-to-about', await js(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent})`))

// 3. reduced motion: must be instant, no overlay stuck
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await js('history.pushState({key:"x"}, "", "/") ; null')
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(2500)
await js(`document.querySelector('.em-stage-nav a[href="/about"]').click()`)
await wait(500)
console.log('reduced', await js(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, slide: !!document.querySelector('.pg-slide'), stage: !!document.querySelector('.em-stage'), scrollY: window.scrollY})`))
await send('Emulation.setEmulatedMedia', { features: [] })

// 4. 1024 wide forward slide
await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 800, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(2500)
await js(`document.querySelector('.em-stage-nav a[href="/about"]').click()`)
await wait(400)
const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 })
const { writeFileSync } = await import('node:fs')
writeFileSync('.tmp-brand/slide-1024-mid.jpg', Buffer.from(s.data, 'base64'))
await wait(700)
console.log('1024', await js(`JSON.stringify({path: location.pathname, h1: document.querySelector('h1')?.textContent, scrollY: window.scrollY})`))

// 5. scrolled home then about
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 640, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5173/' })
await wait(2500)
await js('window.scrollTo(0, 500)')
await wait(400)
const before = await js('window.scrollY')
await js(`document.querySelector('.em-stage-nav a[href="/about"]').click()`)
await wait(1100)
console.log('scrolled', JSON.stringify({ before, after: await js('window.scrollY'), path: await js('location.pathname') }))
ws.close(); chrome.kill()
