import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9361
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${PORT}`,'--window-size=1440,1000','--user-data-dir=/tmp/cdp-profile-close2','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async(expression)=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result?.value
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
await send('Page.navigate',{url:'http://localhost:5173/'}); await wait(2800)
// hover + click first row
await ev(`(() => { const r=document.querySelector('.em-row'); r.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true})); r.click(); })()`)
await wait(1200)
const info = await ev(`(() => {
  const shot=document.querySelector('.em-shot[data-slug="orderflow"]');
  const inner=shot.querySelector('.em-pos,.st-device,img');
  const rr=inner.getBoundingClientRect(); const a=document.querySelector('.em-stage').getBoundingClientRect();
  return JSON.stringify({shotInner:[rr.x,rr.y,rr.width,rr.height], stage:[a.x,a.y,a.width,a.height]})
})()`)
console.log('rects',info)
// close via x button
await ev(`document.querySelector('.rv-modal-x').click()`)
await wait(560)
console.log('near-end', await ev(`(() => { const sh=document.querySelector('.rv-modal-sheet'); if(!sh) return 'gone'; const r=sh.getBoundingClientRect(); const st=document.querySelector('.em-stage').getBoundingClientRect(); return JSON.stringify({sheet:[r.x,r.y,r.width,r.height],sheetCenter:[r.x+r.width/2,r.y+r.height/2],stage:[st.x,st.y,st.width,st.height]}) })()`))
ws.close();chrome.kill()
