import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9471
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-probe-scroll', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/orderflow' })
await wait(3200)
console.log('before', await evalx(`JSON.stringify({y: scrollY, after: document.getElementById('after').getBoundingClientRect().top, design: document.getElementById('design').getBoundingClientRect().top})`))
await evalx(`(async () => { const m = await import('/src/scroll.js'); window.__lenis = !!m.scroller.lenis; const y = document.getElementById('after').getBoundingClientRect().top + scrollY - 70; m.scroller.lenis?.scrollTo(y, { immediate: true, force: true }); window.scrollTo(0, y); return y })()`)
await wait(1000)
console.log('after', await evalx(`JSON.stringify({y: scrollY, after: document.getElementById('after').getBoundingClientRect().top, lenis: window.__lenis})`))
await wait(2000)
console.log('later', await evalx(`JSON.stringify({y: scrollY, after: document.getElementById('after').getBoundingClientRect().top})`))
ws.close(); chrome.kill()
