// monkey test: random taps on every button, random inputs, both rulesets, DM and player views; catches crashes and impossible numbers
const {chromium,devices}=require('playwright');const RULES=process.argv[2]||'op';const STEPS=+(process.argv[3]||400);const SEED=+(process.argv[4]||1);
let rs=SEED;const rnd=()=>{rs=(rs*1103515245+12345)%2147483648;return rs/2147483648};
const SKIP=/^(reset|wipe|leave|delChar|charDel|resetAll|netLeave|exportAll|importFile|dl|download|print|fileLoad|planLoad|planSave|copyLink|share)/i;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices[rnd()<.5?'iPhone 13':'Pixel 7']});const p=await ctx.newPage();const errs=[];const seen=new Set();
p.on('pageerror',e=>{const k=e.message.slice(0,140);if(!seen.has(k)){seen.add(k);errs.push({msg:e.message,stack:(e.stack||'').split('\n').slice(0,4).join(' | '),last:last.slice(-6).join(' > ')})}});
p.on('dialog',d=>d.dismiss().catch(()=>{}));let last=[];
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(300);await p.fill('#suName','Fuzz');await p.click(`[data-a=setup][data-k="${RULES}"]`);await p.waitForTimeout(200);
// two characters, an encounter, a running fight
await p.evaluate(rules=>{for(const [i,cls] of (rules==='5e'?['fighter','monk','rogue','barbarian','wizard']:['fighter','monk','rogue','bruiser','chemist']).entries()){const b=rules==='5e'?r5New():opDefault();b.cls=cls;b.name='PC'+i;b.level=1+(i*2)%7;if(rules==='5e')r5ClassDefaults(b);else opClassDefaults(b);const c=newCharDoc(b);c.hp=DV(c).maxhp;const u=i===0?SH.me:'npc'+i;put('chars/'+u,c)}render(true)},RULES);
const bad=[];let step=0;
for(;step<STEPS;step++){
  // occasionally swap view
  if(rnd()<.04){const s=await p.$('[data-a=swapDM]');if(s){last.push('swapDM');await s.click().catch(()=>{})}}
  const info=await p.evaluate(r=>{document.querySelectorAll('[data-fz]').forEach(x=>x.removeAttribute('data-fz'));const L=[...document.querySelectorAll('[data-a]:not([disabled]), [data-c]:not([disabled]), [data-rcdmg], [data-rcf]')].filter(x=>{const q=x.getBoundingClientRect();return q.width>0&&q.height>0&&getComputedStyle(x).visibility!=='hidden'});if(!L.length)return null;const x=L[Math.floor(r*L.length)];x.setAttribute('data-fz','1');return{a:x.dataset.a||'',c:x.dataset.c||'',tag:x.tagName,type:x.type||'',opts:x.tagName==='SELECT'?[...x.options].map(o=>o.value):null}},rnd()).catch(()=>null);
  if(!info){await p.waitForTimeout(100);continue}const e=await p.$('[data-fz]');if(!e)continue;
  if(SKIP.test(info.a)||SKIP.test(info.c))continue;
  last.push(info.a||info.c);
  try{if(info.tag==='SELECT'){const v=info.opts[Math.floor(rnd()*info.opts.length)];await e.selectOption(v,{timeout:800})}
    else if(info.tag==='INPUT'&&info.type!=='checkbox'&&info.type!=='radio'){const v=info.type==='number'?String(Math.floor(rnd()*40)-5):['','Ab',"<b>x</b>",'1d8+2','999','-3','🙂'][Math.floor(rnd()*7)];await e.fill(v,{timeout:800});await e.dispatchEvent('change')}
    else if(info.tag==='TEXTAREA'){await e.fill('note '+step,{timeout:800});await e.dispatchEvent('change')}
    else{await e.click({timeout:800});if(rnd()<.3)await e.click({timeout:300}).catch(()=>{})}}catch(err){}
  // also fill visible inputs in forms sometimes then press the form button
  if(rnd()<.05){for(const inp of await p.$$('input[type=number]:visible'))await inp.fill(String(Math.floor(rnd()*20))).catch(()=>{})}
  await p.waitForTimeout(40);
  // pickers: choose a target sometimes
  if(rnd()<.5){const t=await p.$('[data-a=ptTo]:visible, [data-a=pkTo]:visible, [data-a=mtTo]:visible');if(t){last.push('pick');await t.click({timeout:500}).catch(()=>{})}}
  if(rnd()<.3){const real=await p.$('.realbox [data-a=realFace]:visible');if(real)await real.click().catch(()=>{})}
  if(step%25===0){const v=await p.evaluate(()=>{const out=[];for(const [u,c] of Object.entries(SH.chars||{})){try{const D=DV(c);if(!(c.hp>=0&&c.hp<=D.maxhp+0))out.push(`${c.build.name} hp ${c.hp}/${D.maxhp}`);if(c.temp<0)out.push(c.build.name+' temp '+c.temp);for(const [k,v] of Object.entries(c.res||{}))if(typeof v==='number'&&(v<0||isNaN(v)))out.push(c.build.name+' res '+k+'='+v);if(isNaN(D.ac)||isNaN(D.maxhp))out.push(c.build.name+' AC/HP NaN')}catch(e){out.push('DV crash '+e.message)}}
      try{for(const m of Object.values(monsOf()))if(!(m.hp>=0&&m.hp<=m.max))out.push(m.name+' hp '+m.hp+'/'+m.max)}catch(e){}
      const txt=document.getElementById('app').innerText;for(const w of ['NaN','undefined','[object Object]'])if(txt.includes(w)){const i=txt.indexOf(w);out.push('screen shows '+w+': …'+txt.slice(Math.max(0,i-60),i+20).replace(/\n/g,' ')+'…')}
      return out});for(const x of v)if(!bad.includes(x)){bad.push(x);console.log('INV',x,' after',last.slice(-5).join(' > '))}}
  last=last.slice(-20)}
console.log(`${RULES} seed ${SEED}: ${step} steps, ${errs.length} page errors, ${bad.length} invariant problems`);for(const e of errs)console.log('ERR',e.msg,'\n   ',e.stack,'\n    after:',e.last);
await p.screenshot({path:`fuzz_${RULES}_${SEED}.png`});await b.close()})();
