// Renders the Heizen Studio revamp screens (tools/heizen-studio-ui, on :5190).
import { launch, sleep } from './lib.mjs'
const out = process.argv[2] || '.'
const {browser,page}=await launch(1920,992,2); const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,220))})
for(let i=0;i<30;i++){try{await page.goto('http://localhost:5190/#sprint',{waitUntil:'networkidle2',timeout:20000});break}catch{await sleep(1000)}}
await page.evaluate(()=>document.fonts.ready)
for(const k of ['sprint','backlog','meetings','wiki']){await page.evaluate(k=>location.hash=k,k);await sleep(1400);await page.screenshot({path:out+'/'+k+'.png',captureBeyondViewport:false})}
console.log(errs.slice(0,6)); await browser.close()
