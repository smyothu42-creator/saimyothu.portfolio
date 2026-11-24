import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9441
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--window-size=1440,900', '--user-data-dir=/tmp/cdp-cap-struct2', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS () { for (let i = 0; i < 60; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalx = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 }); writeFileSync(path, Buffer.from(r.data, 'base64')) }
const goto = async (sel) => { await evalx(`document.getElementById('${sel}').scrollIntoView()`); await wait(1000); await evalx(`document.getElementById('${sel}').scrollIntoView()`); await wait(700) }
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/orderflow' })
await wait(3000)
await goto('after')
await shot('.tmp-brand/struct-after2.jpg')
await goto('numbers')
await shot('.tmp-brand/struct-numbers.jpg')
await goto('again')
await shot('.tmp-brand/struct-again.jpg')
// jump link test
await evalx(`window.scrollTo(0, 0)`)
await wait(700)
await evalx(`(() => { document.getElementById('cs-about').scrollIntoView(); })()`)
await wait(600)
await evalx(`document.querySelector('.em-glance-jump a').click()`)
await wait(1600)
console.log('jump scrollY:', await evalx(`Math.round(window.scrollY) + ' / shift top ' + Math.round(document.getElementById('shift').getBoundingClientRect().top)`))
ws.close(); chrome.kill()
