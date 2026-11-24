import { spawn } from 'node:child_process'
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new','--remote-debugging-port=9398','--window-size=1440,900','about:blank'
])
await new Promise(r=>setTimeout(r,1500))
const list = await (await fetch('http://127.0.0.1:9398/json')).json()
const page = list.find(t=>t.type==='page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id=0; const pending=new Map()
ws.onmessage=(e)=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m); pending.delete(m.id)}}
await new Promise(r=>ws.onopen=r)
const send=(method,params={})=>new Promise(res=>{const i=++id;pending.set(i,res);ws.send(JSON.stringify({id:i,method,params}))})
const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});return r.result}
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false})
await send('Page.navigate',{url:'http://localhost:5173/'})
await new Promise(r=>setTimeout(r,3000))
await send('Runtime.evaluate',{expression:`document.querySelectorAll('.em-row')[7]?.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}))`})
await new Promise(r=>setTimeout(r,1200))
const out = await ev(`(()=>{
  const qs=s=>document.querySelector(s)
  const info=el=>{if(!el)return null;const cs=getComputedStyle(el);const b=el.getBoundingClientRect();return {rect:[Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)],bg:cs.backgroundColor,boxShadow:cs.boxShadow,filter:cs.filter,opacity:cs.opacity,z:cs.zIndex,mix:cs.mixBlendMode,backgroundImage:cs.backgroundImage.slice(0,80)}}
  const shot=qs('.em-shot.is-brand')
  const after=getComputedStyle(shot,'::after')
  const before=getComputedStyle(shot,'::before')
  return {
    shot: info(shot),
    brand: info(qs('.em-brand')),
    plate: info(qs('.em-brand-plate')),
    pop: info(qs('.em-brand-pop')),
    popImg: info(qs('.em-brand-pop img')),
    after: {content:after.content, bg:after.backgroundColor, bgi:after.backgroundImage.slice(0,120)},
    before: {content:before.content, bg:before.backgroundColor, bgi:before.backgroundImage.slice(0,120)},
    shotClass: shot.className,
    children: [...shot.querySelectorAll('*')].map(e=>e.className||e.tagName)
  }
})()`)
console.log(JSON.stringify(out,null,1))
ws.close(); chrome.kill()
