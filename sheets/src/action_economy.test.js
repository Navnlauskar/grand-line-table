// action economy: players and enemies cannot attack more than the rules allow
const {chromium}=require('playwright');
async function setup(b,rules,build,mon,n){const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.errs=errs;
  await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(300);await p.fill('#suName','T');await p.click(`[data-a=setup][data-k="${rules}"]`);await p.waitForTimeout(200);
  await p.evaluate(([rules,B])=>{const b=rules==='5e'?r5New():opDefault();Object.assign(b,{name:'P',species:rules==='5e'?'human':b.species},B);if(rules==='5e'&&!B.weps)r5ClassDefaults(b);Object.assign(b,B);b.scores={STR:16,DEX:14,CON:14,INT:10,WIS:12,CHA:10};const c=newCharDoc(b);c.hp=DV(c).maxhp;put('chars/'+SH.me,c);render(true)},[rules,build]);
  await p.click('[data-a=dmtab][data-k=fight]');await p.click('[data-a=fightStart]');await p.waitForTimeout(150);await p.click('[data-a=initForAll]').catch(()=>{});
  await p.fill('#flib',mon);await p.fill('#flibC',String(n||1));await p.click('[data-a=fMonLib]');await p.waitForTimeout(200);
  await p.evaluate(()=>{const ini=initOf();const pc=ini.order.find(o=>o.pc);put('table/state',{...SH.state,init:{...ini,order:[pc,...ini.order.filter(o=>!o.pc)],started:true,turn:0,round:1}})});await p.waitForTimeout(150);
  await p.evaluate(()=>{for(const m of Object.values(monsOf()))m.hp=m.max=999});return p}
const setTurn=(p,i,round)=>p.evaluate(([i,round])=>{const ini=initOf();put('table/state',{...SH.state,init:{...ini,turn:i,round:round||ini.round}})},[i,round]);
const myAtkRolls=p=>p.evaluate(()=>SH.log.filter(e=>e.kind==='d20'&&e.by===SH.me&&/ attack/.test(e.label)&&e.who==='P').map(e=>e.label));
async function spamPlayer(p,times,dbl){for(let i=0;i<times;i++){const a=await p.$('[data-a=atk]');if(!a)break;await a.click();if(dbl){await p.waitForTimeout(80);const a2=await p.$('[data-a=atk]');if(a2)await a2.click()}await p.waitForTimeout(250);
  for(let k=0;k<2;k++){const t=await p.$('[data-a=ptTo]:not([disabled])');if(!t)break;await t.click();await p.waitForTimeout(250)}
  for(const x of await p.$$('.hitnote [data-a=dmg], #rollCard.show [data-rcdmg]')){await x.evaluate(b=>b.click()).catch(()=>{});await p.waitForTimeout(200)}}}
let fails=0;const check=(name,ok,info)=>{console.log((ok?'✓ ':'✗ ')+name+(info?'  · '+info:''));if(!ok)fails++};
(async()=>{const b=await chromium.launch();
 // A: level 1 fighter with a longsword only: one attack, spam does nothing more
 {const p=await setup(b,'5e',{cls:'fighter',level:1,weps:['longsword']},'Orc (CR 1/2)');await p.click('[data-a=swapDM]');await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=actions]');
  await spamPlayer(p,5,true);const L=await myAtkRolls(p);check('L1 fighter, longsword only: 1 attack per turn',L.length===1,L.join(' | '));
  await setTurn(p,1);await setTurn(p,0,2);await p.waitForTimeout(200);await spamPlayer(p,3,true);const L2=await myAtkRolls(p);check('next round: 1 more attack, no "2nd try"',L2.length===2&&!(await p.evaluate(()=>SH.log.some(e=>e.again&&e.kind==='d20')))
   ,L2.join(' | '));check('no page errors',!p.errs.length,p.errs.join(';'));await p.close()}
 // B: two light weapons: attack + off-hand bonus attack, then nothing
 {const p=await setup(b,'5e',{cls:'rogue',level:1,weps:['shortsword','dagger']},'Orc (CR 1/2)');await p.click('[data-a=swapDM]');await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=actions]');
  await p.evaluate(()=>{Math.random=()=>0.95});await spamPlayer(p,5,true);const L=await myAtkRolls(p);check('rogue with two light weapons: attack + off-hand',L.length===2&&L.some(x=>/off-hand/.test(x)),L.join(' | '));
  const dm=await p.evaluate(()=>SH.log.filter(e=>e.kind==='dmg'&&e.who==='P').map(e=>e.label+' ['+e.detail+']'));check('off-hand damage has no ability bonus',dm.some(x=>/off-hand/.test(x)&&!/\+\s*2\]|\+2\]/.test(x)),dm.join(' | '));await p.close()}
 // C: level 5 fighter: Extra Attack = 2
 {const p=await setup(b,'5e',{cls:'fighter',level:5,weps:['greatsword']},'Orc (CR 1/2)');await p.click('[data-a=swapDM]');await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=actions]');
  await spamPlayer(p,6,true);const L=await myAtkRolls(p);check('L5 fighter with greatsword: 2 attacks',L.length===2,L.join(' | '));await p.close()}
 // C2: action already used (a spell, Dash)
 {const p=await setup(b,'5e',{cls:'fighter',level:5,weps:['longsword']},'Orc (CR 1/2)');await p.click('[data-a=swapDM]');await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=actions]');
  await p.evaluate(()=>{const ctx=fightCtx(SH.me);turnSt(SH.me,ctx.key).act=1});await spamPlayer(p,3,true);const L=await myAtkRolls(p);check('action already used (spell): no Attack action',L.length===0,L.join(' | '));await p.close()}
 // D: not your turn
 {const p=await setup(b,'5e',{cls:'fighter',level:1,weps:['longsword']},'Orc (CR 1/2)');await setTurn(p,1);await p.click('[data-a=swapDM]');await p.waitForTimeout(150);await p.click('[data-a=tab][data-k=actions]');
  await spamPlayer(p,3,true);const L=await myAtkRolls(p);check('no attacks on the enemy\'s turn',L.length===0,L.join(' | '));await p.close()}
 // E/F: enemies. Orc (one attack), Three-length Bird (Multiattack: two)
 for(const [rules,mon,want] of [['5e','Orc (CR 1/2)',1],['op','Three-length Bird',2]]){const p=await setup(b,rules,{cls:'fighter',level:1},mon,2);
  const ids=await p.evaluate(()=>initOf().order.filter(o=>!o.pc).map(o=>o.id));const uid=await p.evaluate(()=>SH.me);
  const dmAtk=async(id,dbl)=>{const bt=await p.$(`[data-a=mtPick][data-k="${id}"][data-i="0"]`);if(!bt)return;await bt.click();if(dbl){await p.waitForTimeout(80);const b2=await p.$(`[data-a=mtPick][data-k="${id}"][data-i="0"]`);if(b2)await b2.click()}await p.waitForTimeout(150);const t=await p.$(`[data-a=mtTo][data-u="${uid}"]`);if(t){await t.click();await p.waitForTimeout(350)}};
  const cnt=id=>p.evaluate(id=>{const nm=monsOf()[id].name;return((SH.dm.rolls||{}).items||[]).filter(e=>e.who===nm&&e.kind==='d20'&&/→/.test(e.label)).length},id);
  await setTurn(p,1);await p.waitForTimeout(150);for(let i=0;i<5;i++)await dmAtk(ids[0],false);const n1=await cnt(ids[0]);check(`${mon} on its turn: ${want} attack(s) with single taps`,n1===want,'made '+n1);
  console.log('   row tag:',await p.$$eval('.econm',e=>e.map(x=>x.textContent).join(' | ')));
  for(let i=0;i<3;i++)await dmAtk(ids[1],true);check(`${mon} 2 off its turn: attack buttons do nothing`,(await cnt(ids[1]))===0);
  for(let i=0;i<2;i++){const r=await p.$(`[data-a=mtReact][data-k="${ids[1]}"]`);if(r){await r.click();await p.waitForTimeout(150)}await dmAtk(ids[1],false)}check(`${mon} 2 off its turn: ⚡ Reaction gives one attack only`,(await cnt(ids[1]))===1,'made '+await cnt(ids[1]));
  await p.click(`[data-a=mtMore][data-k="${ids[0]}"]`);await p.waitForTimeout(150);await dmAtk(ids[0],false);await dmAtk(ids[0],false);check(`+1 attack gives exactly one more`,(await cnt(ids[0]))===want+1,'made '+await cnt(ids[0]));
  await setTurn(p,2);await setTurn(p,1,2);await p.waitForTimeout(150);for(let i=0;i<4;i++)await dmAtk(ids[0],false);check(`next round: ${want} more`,(await cnt(ids[0]))===2*want+1,'made '+await cnt(ids[0]));
  check('no page errors',!p.errs.length,p.errs.join(';'));await p.screenshot({path:`econ_${rules}.png`});await p.close()}
 console.log(fails?`${fails} FAILED`:'all passed');await b.close()})();
