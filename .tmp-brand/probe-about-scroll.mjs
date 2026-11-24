import { spawn } from 'node:child_process'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9500 + Math.floor(Math.random() * 90)
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${PORT}`,'--window-size=1440,900',`--user-data-dir=/tmp/cdp-profile-pas-${PORT}`,'about:blank'], { stdio: 'ignore' })
const wait = (ms) => new Promise(r => setTimeout(r, ms))
async function getWS(){for(let i=0;i<60;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws = new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pending=new Map()
ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pending.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async e=>(await send('Runtime.evaluate',{expression:e,returnByValue:true})).result.value
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false})
await send('Page.navigate',{url:'http://localhost:5173/about'}); await wait(5000)
console.log(await ev(`JSON.stringify({y:scrollY, sh:document.documentElement.scrollHeight, bodyH:document.body.scrollHeight, htmlOv:getComputedStyle(document.documentElement).overflow, bodyOv:getComputedStyle(document.body).overflow})`))
await ev('window.scrollTo(0,500)'); await wait(800)
console.log('after', await ev(`JSON.stringify({y:scrollY, top:document.querySelector('.about-hero')?.getBoundingClientRect().top})`))
const r = await ev(`(()=>{const e=document.querySelector('.em-top a.em-word'); const b=e.getBoundingClientRect(); e.click(); return JSON.stringify({clicked:true, top:b.top})})()`)
console.log(r); await wait(1500)
console.log(await ev(`JSON.stringify({path:location.pathname, y:scrollY, pane:!!document.querySelector('.pg-pane')})`))
ws.close(); chrome.kill()
