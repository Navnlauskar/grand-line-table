const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:430,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(400);await p.fill('#suName','T');await p.click('[data-a=setup][data-k="op"]');await p.waitForTimeout(200);
await p.click('[data-a=dmtab][data-k=table]');await p.waitForTimeout(200);await p.evaluate(()=>document.querySelector('details[data-dk=trules]').open=true);
await p.click('[data-a=trMartial]');await p.waitForTimeout(200);await p.check('[data-c=trFruitCost]');await p.waitForTimeout(200);
await p.screenshot({path:'trules.png',fullPage:true});
console.log('rules:',await p.evaluate(()=>JSON.stringify(SH.state.trules)));
await p.click('[data-a=swapDM]');await p.waitForTimeout(200);await p.click('[data-a=editOpen]');await p.waitForTimeout(300);
console.log('classes offered:',await p.$$eval('[data-a=bPickCls]',e=>e.map(x=>x.dataset.k)));
await p.click('[data-a=bPickCls][data-k=monk]');await p.waitForTimeout(200);console.log('builder errs',await p.evaluate(()=>{const b={...SH.edit.b,name:'Koby'};SH.edit=null;const c=newCharDoc(b);c.hp=DV(c).maxhp;put('chars/'+SH.me,c);render(true);return ''}));await p.waitForTimeout(400);
// eat a fruit, then level to 4 (ASI)
await p.evaluate(()=>offer(SH.me,{k:'fruit',fruit:'mera'}));await p.waitForTimeout(300);console.log('modal text has cost:',await p.evaluate(()=>document.querySelector('.modal').textContent.includes('Ability Score Improvement')));
await p.click('[data-a=ofEat]');await p.waitForTimeout(700);console.log('debt',await p.evaluate(()=>myChar().fruitDebt));
for(let L=2;L<=4;L++){await p.evaluate(()=>saveChar(SH.me,{lvlOk:myChar().build.level+1}));await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=main]');await p.click('[data-a=luOpen]');await p.waitForTimeout(250);
  const t=await p.evaluate(()=>document.body.innerText.includes('pays for your Devil Fruit'));await p.evaluate(()=>{SH.lu.hpHow='avg';SH.lu.hp=5;const s=(SUBCLASSES[myChar().build.cls]||[]).filter(x=>!x.legacy)[0];if(s)SH.lu.sub=s.key;if(!SH.lu.a1){SH.lu.mode='two';SH.lu.a1='DEX'}});await p.click('[data-a=luSave]');await p.waitForTimeout(400);
  console.log('L'+L,'fruit notice:',t,'level now',await p.evaluate(()=>myChar().build.level),'debt',await p.evaluate(()=>myChar().fruitDebt),'featLv',await p.evaluate(()=>JSON.stringify(myChar().build.featLv||{})),'asi',await p.evaluate(()=>JSON.stringify(myChar().build.asiLv||{})))}
console.log('errs',errs);await b.close()})();
