import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9345
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${PORT}`,'--window-size=1440,1000','--user-data-dir=/tmp/cdp-profile-pillars','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async(expression)=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result?.value
await send('Page.enable')
async function shot(name, w, h, dsf) {
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dsf,mobile:dsf>1})
  await send('Page.navigate',{url:'http://localhost:5173/work/uz-branding'})
  await wait(3500)
  await ev(`(() => { const p=document.querySelector('.sv-pillars'); if(p) p.scrollIntoView({block:'center'}); })()`)
  await wait(2500)
  const s=await send('Page.captureScreenshot',{format:'jpeg',quality:85})
  writeFileSync(`.tmp-brand/check-${name}.jpg`, Buffer.from(s.data,'base64'))
}
await shot('pillars-desktop',1440,1000,1)
await shot('pillars-mobile',390,844,2)
console.log(await ev(`JSON.stringify({videos:[...document.querySelectorAll('.sv-pillar-film video')].map(v=>({src:v.src.split('/').pop(),w:v.videoWidth+'x'+v.videoHeight,paused:v.paused,t:+v.currentTime.toFixed(1)})),err:[...document.querySelectorAll('.sv-pillar-head strong')].map(s=>s.textContent)})`))
ws.close();chrome.kill()
