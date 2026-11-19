const {chromium}=require('playwright');const [rules,cls]=[process.argv[2],process.argv[3]];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(400);await p.fill('#suName','T');await p.click(`[data-a=setup][data-k="${rules}"]`);await p.waitForTimeout(200);
await p.evaluate(([rules,cls])=>{const b=rules==='5e'?r5New():opDefault();b.cls=cls;b.level=5;b.name='M';if(rules==='5e'){b.species='human';r5ClassDefaults(b)}b.scores={STR:12,DEX:16,CON:14,INT:10,WIS:14,CHA:10};const c=newCharDoc(b);c.hp=DV(c).maxhp-8;put('chars/'+SH.me,c);render(true)},[rules,cls]);
await p.click('[data-a=dmtab][data-k=fight]');await p.click('[data-a=fightStart]');await p.waitForTimeout(200);await p.click('[data-a=initForAll]').catch(()=>{});
await p.fill('#flib',rules==='5e'?'Orc (CR 1/2)':'Pirate Lackey [Buccaneer] (CR 1/2)');await p.fill('#flibC','2');await p.click('[data-a=fMonLib]');await p.waitForTimeout(200);
await p.evaluate(()=>{const ini=initOf();const pc=ini.order.find(o=>o.pc);put('table/state',{...SH.state,init:{...ini,order:[pc,...ini.order.filter(o=>!o.pc)],started:true,turn:0,round:1}})});
await p.click('[data-a=swapDM]');await p.waitForTimeout(200);await p.click('[data-a=tab][data-k=actions]');await p.waitForTimeout(200);
console.log(cls,'class actions:',await p.$$eval('.mact b',e=>e.map(x=>x.textContent)));
await p.evaluate(()=>{Math.random=(R=>{let k=0;return()=>{k++;return k%3===0?R():0.8}})(Math.random)});
const pick=async()=>{for(let i=0;i<3;i++){const t=await p.$('[data-a=pkTo],[data-a=ptTo]:not([disabled])');if(!t)break;await t.click();await p.waitForTimeout(450)}const cd=await p.$('#rollCard.show [data-rcdmg]');if(cd){await cd.evaluate(b=>b.click());await p.waitForTimeout(400)}for(const x of await p.$$('.hitnote [data-a=dmg]')){await x.evaluate(b=>b.click());await p.waitForTimeout(300)}};
const n0=await p.evaluate(()=>SH.log.length);
await p.click('[data-a=atk]');await p.waitForTimeout(300);await pick();
for(const a of ['maWind','maSurge','maFlurry','maStun','maCunning','maUnarmed']){const bt=await p.$(`[data-a=${a}]:not([disabled])`);if(!bt)continue;await bt.click();await p.waitForTimeout(400);await pick();if(a==='maSurge'){await p.click('[data-a=atk]');await p.waitForTimeout(300);await pick()}}
if(cls==='rogue'){await p.evaluate(()=>hpChange(SH.me,-10,"Orc's Greataxe hits"));await p.waitForTimeout(200);const ud=await p.$('[data-a=maDodge]:not([disabled])');if(ud){await ud.click();await p.waitForTimeout(300)}}
console.log(await p.evaluate(n=>SH.log.slice(0,SH.log.length-n).reverse().map(e=>(e.who||'')+': '+e.label+(e.total!==''&&e.total!==undefined?' = '+e.total:'')).join('\n'),n0));
console.log('mons',await p.evaluate(()=>initOf().order.filter(o=>!o.pc).map(o=>o.name+' '+monsOf()[o.id].hp+(o.conds?' '+o.conds:'')).join(', ')),'| me',await p.evaluate(()=>myChar().hp+'/'+DV(myChar()).maxhp+' res '+JSON.stringify(myChar().res)));
await p.screenshot({path:`mart_${cls}.png`});console.log('errs',errs);await b.close()})();
