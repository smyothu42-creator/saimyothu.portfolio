import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9355
const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${PORT}`,'--window-size=390,844','--user-data-dir=/tmp/cdp-profile-tone3','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true})
for (const [name,url,delay] of [['home','http://localhost:5173/',3000],]){
  await send('Page.navigate',{url}); await wait(delay)
  const s=await send('Page.captureScreenshot',{format:'jpeg',quality:80})
  writeFileSync(`.tmp-brand/tone-${name}.jpg`,Buffer.from(s.data,'base64'))
  console.log(name,'ok')
}
ws.close();chrome.kill()
