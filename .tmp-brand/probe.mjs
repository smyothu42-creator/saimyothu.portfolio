import { spawn } from 'node:child_process'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9356
const chrome=spawn(CHROME,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,'--window-size=1440,1000','--user-data-dir=/tmp/cdp-profile-probe','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async(expression)=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result?.value
await send('Page.navigate',{url:'http://localhost:5173/'}); await wait(2800)
console.log(await ev(`(() => { try {
 const pts=[[300,500],[1100,500]];
 return pts.map(([x,y])=>{ const el=document.elementFromPoint(x,y); const cs=getComputedStyle(el); let p=el, chain=[]; while(p && chain.length<6){ const c=getComputedStyle(p); if(c.backgroundColor!=='rgba(0, 0, 0, 0)') chain.push(String(p.className)+' => '+c.backgroundColor); p=p.parentElement }
  return JSON.stringify({x,y,tag:el.tagName,cls:String(el.className),bg:cs.backgroundColor,chain}) }).join(' || ')
} catch(e){ return 'ERR '+e.message } })()`))
ws.close();chrome.kill()
