import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9350
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${PORT}`,'--window-size=1440,1100','--user-data-dir=/tmp/cdp-profile-lang','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async(expression)=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result?.value
await send('Page.enable')
async function shot(name,w,h,dsf,fresh){
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dsf,mobile:w<500})
  if(fresh) await send('Page.navigate',{url:'http://localhost:5173/work/uz-branding'}), await wait(3200)
  const box=await ev(`(() => { const s=document.getElementById('languages'); if(!s) return null; const r=s.getBoundingClientRect(); return JSON.stringify({x:r.x,y:r.y+scrollY,w:r.width,h:r.height}) })()`)
  if(!box){console.log('no section',name);return}
  const b=JSON.parse(box)
  await ev(`document.getElementById('languages').scrollIntoView({block:'start'}); scrollBy(0,-40)`)
  await wait(800)
  const s=await send('Page.captureScreenshot',{format:'jpeg',quality:88,clip:{x:b.x-20,y:b.y-40,width:b.w+40,height:b.h+80,scale:1},captureBeyondViewport:true})
  writeFileSync(`.tmp-brand/check-lang-${name}.jpg`,Buffer.from(s.data,'base64'))
  console.log(name,JSON.stringify(b))
}
await send('Page.navigate',{url:'http://localhost:5173/work/uz-branding'})
await wait(3200)
await shot('desktop',1440,1000,1,false)
await shot('mobile',390,844,2,true)
ws.close();chrome.kill()
