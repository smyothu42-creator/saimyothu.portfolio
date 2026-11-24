import { spawn } from 'node:child_process'
import fs from 'node:fs'
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new','--remote-debugging-port=9398','--window-size=1440,900','about:blank'])
await new Promise(r=>setTimeout(r,1500))
const list = await (await fetch('http://127.0.0.1:9398/json')).json()
const page = list.find(t=>t.type==='page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id=0; const pending=new Map()
ws.onmessage=(e)=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m); pending.delete(m.id)}}
await new Promise(r=>ws.onopen=r)
const send=(method,params={})=>new Promise(res=>{const i=++id;pending.set(i,res);ws.send(JSON.stringify({id:i,method,params}))})
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false})
await send('Page.navigate',{url:'http://localhost:5173/'})
await new Promise(r=>setTimeout(r,3000))
await send('Runtime.evaluate',{expression:`(()=>{const a=document.querySelector('.em-row[href="/work/uz-branding"]');a.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}))})()`})
await new Promise(r=>setTimeout(r,1400))
const shot = async (name)=>{const r=await send('Page.captureScreenshot',{format:'png',clip:{x:70,y:250,width:560,height:500,scale:1}});fs.writeFileSync('.tmp-brand/'+name,Buffer.from(r.result.data,'base64'))}
await send('Runtime.evaluate',{expression:`document.querySelector('.em-brand-pop').style.display='none'`})
await shot('probe-plate-only.png')
await send('Runtime.evaluate',{expression:`document.querySelector('.em-brand-pop').style.display='';document.querySelector('.em-brand-plate').style.display='none'`})
await shot('probe-pop-only.png')
ws.close(); chrome.kill()
