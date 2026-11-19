const {chromium}=require('playwright');const sub=process.argv[2]||'Gunslinger';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(400);await p.fill('#suName','T');await p.click('[data-a=setup][data-k="5e"]');await p.waitForTimeout(200);
await p.evaluate(sub=>{const b=r5New();b.cls='fighter';b.level=5;b.name='G';b.species='human';r5ClassDefaults(b);b.subclass=sub;b.weps=sub==='Gunslinger'?['pistol','musket']:['longsword'];b.scores={STR:12,DEX:16,CON:14,INT:10,WIS:14,CHA:10};const c=newCharDoc(b);put('chars/'+SH.me,c);render(true)},sub);
console.log('feats:',await p.evaluate(()=>DV(myChar()).feats.filter(f=>/Gunslinger|Champion|DC/.test(f[0])).map(f=>f[0]).join(' | ')),'| res',await p.evaluate(()=>JSON.stringify(DV(myChar()).res)),'| atk',await p.evaluate(()=>DV(myChar()).attacks.map(a=>a.name+' +'+a.atk+' '+a.note).join(' ; ')),'crit',await p.evaluate(()=>DV(myChar()).critMin));
await p.click('[data-a=dmtab][data-k=fight]');await p.click('[data-a=fightStart]');await p.waitForTimeout(200);await p.click('[data-a=initForAll]').catch(()=>{});
await p.fill('#flib','Orc (CR 1/2)');await p.fill('#flibC','2');await p.click('[data-a=fMonLib]');await p.waitForTimeout(200);
await p.evaluate(()=>{const ini=initOf();const pc=ini.order.find(o=>o.pc);put('table/state',{...SH.state,init:{...ini,order:[pc,...ini.order.filter(o=>!o.pc)],started:true,turn:0,round:1}})});
await p.click('[data-a=swapDM]');await p.waitForTimeout(200);await p.click('[data-a=tab][data-k=actions]');await p.waitForTimeout(200);
console.log('buttons:',await p.$$eval('.mact b',e=>e.map(x=>x.textContent).join(' | ')));
// force dice: queue of d20 results
await p.evaluate(()=>{window.__q=[];const R=Math.random;Math.random=()=>{if(window.__q.length&&/at (d|rollw*) /.test(new Error().stack))return window.__q.shift();return R()}});
const q=async a=>p.evaluate(a=>{window.__q.push(...a)},a);
const pick=async()=>{for(let i=0;i<3;i++){const t=await p.$('[data-a=pkTo],[data-a=ptTo]:not([disabled])');if(!t)break;await t.click();await p.waitForTimeout(450)}const cd=await p.$('#rollCard.show [data-rcdmg]');if(cd){await cd.evaluate(b=>b.click());await p.waitForTimeout(400)}for(const x of await p.$$('.hitnote [data-a=dmg]')){await x.evaluate(b=>b.click());await p.waitForTimeout(300)}};
const n0=await p.evaluate(()=>SH.log.length);
if(sub==='Gunslinger'){await p.click('[data-a=gnDeed][data-k=deadeye]');await p.waitForTimeout(200);await q([0.9,0.3]);await p.click('[data-a=atk]');await p.waitForTimeout(300);await pick();
  const w=await p.$('[data-a=gnDeed][data-k=winging]:not([disabled])');console.log('winging enabled after hit:',!!w);if(w){await q([0.05]);await w.click();await p.waitForTimeout(600)}
  await q([0.0,0.0]);await p.click('[data-a=atk]');await p.waitForTimeout(300);await pick();// misfire on nat 1 (second attack)
  console.log('jam:',await p.evaluate(()=>JSON.stringify(myChar().jam)),'ammo',await p.evaluate(()=>JSON.stringify(myChar().ammo)));
  const rp=await p.$('[data-a=gnRepair]');if(rp){await q([0.95]);await rp.evaluate(b=>b.click());await p.waitForTimeout(400);const b2=await p.$('[data-a=gnRepair]');if(b2){await b2.evaluate(b=>b.click());await p.waitForTimeout(500)}}
  console.log('jam after repair:',await p.evaluate(()=>JSON.stringify(myChar().jam)),'grit',await p.evaluate(()=>JSON.stringify(myChar().res)));
}else{await q([0.92]);await p.click('[data-a=atk]');await p.waitForTimeout(300);await pick()}
console.log(await p.evaluate(n=>SH.log.slice(0,SH.log.length-n).reverse().map(e=>(e.who||'')+': '+e.label+(e.total!==''&&e.total!==undefined?' = '+e.total:'')).join('\n'),n0));
console.log('mons',await p.evaluate(()=>initOf().order.filter(o=>!o.pc).map(o=>o.name+' '+monsOf()[o.id].hp+(o.conds?' '+o.conds:'')).join(', ')));
await p.screenshot({path:`gun_${sub}.png`});console.log('errs',errs);await b.close()})();
