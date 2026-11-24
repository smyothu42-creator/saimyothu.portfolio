import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9395
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/cdp-profile-rules', 'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getWS() { for (let i = 0; i < 50; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl } catch {} await wait(200) } throw new Error('no chrome') }
const ws = new WebSocket(await getWS()); await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map()
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } })
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pend.set(mid, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))); ws.send(JSON.stringify({ id: mid, method, params })) })
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.value
await send('Page.enable')
await send('Page.navigate', { url: 'http://localhost:5173/work/uz-branding' }); await wait(3500)
console.log(await ev(`(() => {
  const el = document.querySelector('#languages .sv-bi-greet');
  const out = [];
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules } catch { continue }
    for (const r of rules) {
      if (!r.selectorText || !r.style || !r.style.fontFamily) continue
      const sels = r.selectorText.split(',')
      for (const s of sels) { try { if (el.matches(s.trim())) out.push(r.selectorText + ' => ' + r.style.fontFamily) } catch {} }
    }
  }
  return JSON.stringify({ cls: el.className, matches: out, computed: getComputedStyle(el).fontFamily })
})()`))
ws.close(); chrome.kill()
