const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(400);await p.fill('#suName','T');await p.click('[data-a=setup][data-k="5e"]');await p.waitForTimeout(200);
await p.evaluate(()=>{const b=r5New();b.cls='fighter';b.level=5;b.name='Fig';b.species='human';r5ClassDefaults(b);b.scores={STR:16,DEX:12,CON:14,INT:10,WIS:14,CHA:10};const c=newCharDoc(b);c.hp=DV(c).maxhp;c.spells=[{id:'h',name:'Hold Person',lvl:2}];put('chars/'+SH.me,c);render(true)});
await p.click('[data-a=dmtab][data-k=fight]');await p.click('[data-a=fightStart]');await p.waitForTimeout(200);await p.click('[data-a=initForAll]').catch(()=>{});
await p.fill('#flib','Bandit Captain (CR 2)');await p.fill('#flibC','2');await p.click('[data-a=fMonLib]');await p.waitForTimeout(200);
await p.evaluate(()=>{const ini=initOf();const pc=ini.order.find(o=>o.pc);put('table/state',{...SH.state,init:{...ini,order:[pc,...ini.order.filter(o=>!o.pc)],started:true,turn:0,round:1}})});
// pretend a caster's Hold Person failed on captain 1 (spell save note from the host)
await p.evaluate(()=>{const id=initOf().order.filter(o=>!o.pc)[0].id;const n=initOf().order.find(o=>o.id===id).name;addLog({by:SH.me,who:'DM',kind:'note',label:`Hold Person: ${n} fails and is affected`,total:''})});await p.waitForTimeout(300);
console.log('conds:',await p.evaluate(()=>JSON.stringify(initOf().order.filter(o=>!o.pc).map(o=>[o.name,o.conds]))));
console.log('dm row has cond chips:',await p.$$eval('.fconds .chip',e=>e.map(x=>x.textContent)));
await p.click('[data-a=swapDM]');await p.waitForTimeout(200);await p.click('[data-a=tab][data-k=actions]');await p.waitForTimeout(200);
// attack the paralyzed captain
await p.evaluate(()=>{Math.random=()=>0.6});await p.click('[data-a=atk]');await p.waitForTimeout(300);
const chips=await p.$$eval('[data-a=ptTo]',e=>e.map(x=>x.textContent));console.log('picker:',chips);await (await p.$$('[data-a=ptTo]'))[0].click();await p.waitForTimeout(600);
console.log(await p.evaluate(()=>SH.log.slice(0,3).reverse().map(e=>e.label+' '+(e.detail||'')+' '+(e.total||'')).join('\n')));
// now poisoned, attack captain 2
await p.evaluate(()=>saveChar(SH.me,{cond:{Poisoned:true}}));await p.waitForTimeout(200);
await p.evaluate(()=>{const k=fightCtx(SH.me).key;SH.ta[SH.me]={key:k,n:0,act:0,bonus:0,react:0,hits:[]}});await p.click('[data-a=atk]');await p.waitForTimeout(300);await (await p.$$('[data-a=ptTo]'))[1].click();await p.waitForTimeout(600);
console.log(await p.evaluate(()=>SH.log.slice(0,2).reverse().map(e=>e.label+' '+(e.detail||'')).join('\n')));
// a skill check while poisoned
await p.evaluate(()=>rollD20('Perception check',2,'+2',{uid:SH.me}));await p.waitForTimeout(300);console.log(await p.evaluate(()=>SH.log[0].label+' '+SH.log[0].detail));
await p.screenshot({path:'cond.png'});console.log('errs',errs);await b.close()})();
