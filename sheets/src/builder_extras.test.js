const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();for(const [rules,cls] of [['5e','wizard'],['5e','fighter'],['op','rogue']]){const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='warning'||m.type()==='error')errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(400);
await p.fill('#suName','T');await p.click(`[data-a=setup][data-k="${rules}"]`);await p.waitForTimeout(200);await p.click('[data-a=swapDM]');await p.click('[data-a=editOpen]');await p.waitForTimeout(300);
await p.fill('[data-f=name]','Tester');await p.click(`[data-a=bPickCls][data-k=${cls}]`);await p.waitForTimeout(400);
if(rules==='5e'&&cls==='fighter'){await p.click('[data-a=bChip][data-f=weps][data-v=rapier]');await p.waitForTimeout(200)}
if(rules==='op'){const w=await p.$$('[data-a=bPickW]');if(w[1]){await w[1].click();await p.waitForTimeout(200)}}
if(cls==='wizard'){for(const n of ['Fire Bolt','Magic Missile','Shield']){const s=await p.$(`[data-a=bSpell][data-k="${n}"]`);if(s){await s.evaluate(x=>x.click());await p.waitForTimeout(150)}}}
// custom attack + feature
await p.evaluate(()=>{for(const d of document.querySelectorAll('.bextra details.add'))d.open=true});
await p.fill('#bxN','Gum-Gum Pistol');await p.selectOption('#bxA','STR');await p.fill('#bxD','1d10');await p.selectOption('#bxT','bludgeoning');await p.fill('#bxR','reach 15 ft');await p.fill('#bxW','A stretching punch that hits from far away.');await p.click('[data-a=bxAtk]');await p.waitForTimeout(200);
await p.evaluate(()=>{for(const d of document.querySelectorAll('.bextra details.add'))d.open=true});
await p.fill('#bfN','Iron Body');await p.selectOption('#bfK','reaction');await p.fill('#bfU','2');await p.fill('#bfW','Harden your body: reduce the damage of one hit by 1d10 + CON.');await p.click('[data-a=bxFeat]');await p.waitForTimeout(200);
console.log(rules,cls,'extras:',await p.$$eval('.bcust summary b',e=>e.map(x=>x.textContent)),'attacks:',await p.$$eval('.batk summary',e=>e.map(x=>x.textContent.trim())));
console.log(' first attack explain:',await p.$eval('.batk',d=>d.innerText.slice(0,600)).catch(()=>'none'));
await p.evaluate(()=>{for(const d of document.querySelectorAll('.bextra details'))d.open=true});await p.screenshot({path:`bx_${rules}_${cls}.png`,fullPage:true});
for(const f of ['classSkills','bgSkills','expertise']){for(let i=0;i<4;i++){const ch=await p.$$(`[data-a=bChip][data-f=${f}]:not(.on)`);if(!ch[i])break;await ch[0].evaluate(x=>x.click());await p.waitForTimeout(120)}}
console.log(' spell chips:',await p.$$eval('[data-a=bSpell]',e=>e.length),'on:',await p.$$eval('[data-a=bSpell].on',e=>e.map(x=>x.textContent)));
await p.click('[data-a=bSave]');await p.waitForTimeout(500);
const errBox=await p.$$eval('.errs p',e=>e.map(x=>x.textContent));if(errBox.length)console.log(' save errs',errBox);
console.log(' saved:',await p.evaluate(()=>{const c=Object.values(SH.chars).find(c=>c.build&&c.build.name==='Tester');return c?JSON.stringify({catk:c.catk.map(a=>a.name),cfeat:c.cfeat.map(a=>a.name),cres:c.cres.map(a=>a.name+'/'+a.max),spells:c.spells.map(s=>s.name)}):'not saved'}));
const atab=await p.$('[data-a=tab][data-k=actions]');if(atab){await atab.click();await p.waitForTimeout(300);console.log(' sheet custom atk row:',await p.$$eval('.atk .rb span',e=>e.map(x=>x.textContent).join(' | ')));await p.screenshot({path:`bx_${rules}_${cls}_sheet.png`,fullPage:true})}
console.log(' errs',errs);await ctx.close()}
await b.close()})();
