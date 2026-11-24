import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const W=Number(process.argv[2]||1440); const PAGE=process.argv[3]||'/work/orderflow'; const TAG=process.argv[4]||'tm'; const SCROLL=Number(process.argv[5]||0)
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';const PORT=9654
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${PORT}`,`--window-size=${W},900`,`--user-data-dir=/tmp/cdp-tm-${PORT}`,'about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<60;i++){try{const l=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS());await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pending=new Map();ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pending.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const evalJs=async(e)=>(await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result.value
const shot=async(n)=>{const s=await send('Page.captureScreenshot',{format:'jpeg',quality:85});writeFileSync(`.tmp-brand/${TAG}-${n}.jpg`,Buffer.from(s.data,'base64'))}
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:W,height:900,deviceScaleFactor:1,mobile:W<700})
await send('Page.navigate',{url:'http://localhost:5173'+PAGE})
await wait(6000)
if (SCROLL) { await evalJs(`window.scrollTo(0, ${SCROLL}); 1`); await wait(700) }
await evalJs(`window.__t0 = performance.now(); document.querySelector('.em-top a.em-word').click(); 1`)
for (const t of [120, 250, 380, 520, 660, 820, 1000]) {
  const now = await evalJs('Math.round(performance.now() - window.__t0)')
  if (now < t) await wait(t - now)
  const at = await evalJs(`JSON.stringify({t: Math.round(performance.now() - window.__t0), w: document.querySelector('.pg-pane') ? Math.round(document.querySelector('.pg-pane').getBoundingClientRect().width) : null})`)
  await shot(`t${t}`)
  console.log(at)
}
ws.close();chrome.kill()
