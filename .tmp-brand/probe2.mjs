import { spawn } from 'node:child_process'
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT=9357
const chrome=spawn(CHROME,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,'--window-size=1440,1200','--user-data-dir=/tmp/cdp-profile-probe2','about:blank'],{stdio:'ignore'})
const wait=(ms)=>new Promise(r=>setTimeout(r,ms))
async function getWS(){for(let i=0;i<50;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==='page');if(p)return p.webSocketDebuggerUrl}catch{}await wait(200)}throw new Error('no chrome')}
const ws=new WebSocket(await getWS()); await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0;const pend=new Map()
ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}})
const send=(method,params={})=>new Promise((res,rej)=>{const mid=++id;pend.set(mid,m=>m.error?rej(new Error(JSON.stringify(m.error))):res(m.result));ws.send(JSON.stringify({id:mid,method,params}))})
const ev=async(expression)=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result?.value
await send('Page.navigate',{url:'http://localhost:5173/work/uz-branding'}); await wait(3000)
console.log(await ev(`(() => { try {
 const img=[...document.images].find(i=>i.currentSrc.includes('use-02-tag'));
 if(!img) return 'no img';
 let out=[]; let p=img;
 for(let i=0;i<5 && p;i++){ const c=getComputedStyle(p); out.push(String(p.tagName)+'.'+String(p.className)+' display='+c.display+' aspect='+c.aspectRatio+' h='+c.height+' w='+c.width+' objfit='+c.objectFit+' objpos='+c.objectPosition+' overflow='+c.overflow); p=p.parentElement }
 return JSON.stringify({natural:[img.naturalWidth,img.naturalHeight], box:[img.clientWidth,img.clientHeight], out},null,1)
} catch(e){ return 'ERR '+e.message } })()`))
ws.close();chrome.kill()
