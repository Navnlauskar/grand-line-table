const {chromium,devices}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const {ExpressPeerServer}=require('./ptest/node_modules/peer');const ex=require('./ptest/node_modules/express')();const hs=http.createServer(ex);ex.use('/myapp',ExpressPeerServer(hs,{path:'/'}));hs.listen(9000,'127.0.0.1');
const srv=http.createServer((q,r)=>{let f=path.join('site',decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';if(fs.existsSync(f)&&fs.statSync(f).isFile()){r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html':'text/javascript'});r.end(fs.readFileSync(f))}else{r.writeHead(404);r.end()}}).listen(8791,'127.0.0.1');
const RULES=process.argv[2]||'op';
(async()=>{const b=await chromium.launch();const errs=[];const U='http://localhost:8791/sheets/';
async function ctxPage(opts,tag){const ctx=await b.newContext(opts);const mk=async()=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(tag+': '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|fonts/.test(m.text()))errs.push(tag+' console: '+m.text())});
  await p.route('**/peerjs.min.js',r=>r.fulfill({path:'ptest/node_modules/peerjs/dist/peerjs.min.js',contentType:'text/javascript'}));return p};
  await ctx.addInitScript(()=>{window.GLT_PEER_OPTS={host:'127.0.0.1',port:9000,path:'/myapp',secure:false,config:{iceServers:[]}}});return{ctx,mk}}
const dmc=await ctxPage({viewport:{width:1280,height:850}},'DM');const DM=await dmc.mk();await DM.goto(U);await DM.waitForSelector('#nlHost');await DM.click('#nlHost');await DM.waitForSelector('[data-a=setup]',{timeout:15000});
await DM.fill('#suName','Friday crew');await DM.click(`[data-a=setup][data-k="${RULES}"]`);await DM.waitForTimeout(300);
const code=await DM.evaluate(()=>GLT_NET.code);console.log('room',code);
const builds=RULES==='op'?[{name:'Zoro',cls:'fighter',species:'human',sub:'standard',weapon:'greatsword',classSkills:['Athletics','Perception'],bgSkills:['Stealth','Survival']},{name:'Chopper',cls:'chemist',species:'mink',weapon:'scimitar',classSkills:['Medicine','Nature'],bgSkills:['Insight','Perception']},{name:'Usopp',cls:'marksman',species:'human',sub:'standard',weapon:'musket',classSkills:['Perception','Stealth'],bgSkills:['Deception','Insight']}]
 :[{name:'Thorin',cls:'fighter',species:'dwarf'},{name:'Elara',cls:'wizard',species:'elf'},{name:'Pip',cls:'rogue',species:'halfling'}];
const P=[];for(let i=0;i<2;i++){const c=await ctxPage({...devices['iPhone 13']},'P'+i);const p=await c.mk();await p.goto(U+'?room='+code);await p.waitForSelector('#nlGo');await p.click('#nlGo');await p.waitForSelector('[data-a=editOpen]',{timeout:20000}).catch(async e=>{console.log('JOIN FAIL',await p.evaluate(()=>JSON.stringify([document.body.innerText.slice(0,200),SH.ready,SH.state,SH.owner,SH.solo,GLT_NET.role,GLT_NET.lost,Object.keys(GLT_NET.data)])),errs);throw e});P.push({c,p})}
for(let i=0;i<2;i++){const p=P[i].p;await p.click('[data-a=editOpen]');await p.waitForTimeout(200);
  await p.evaluate(bd=>{Object.assign(SH.edit.b,bd);const b=SH.edit.b;if(b.rules==='5e'){r5ClassDefaults(b);const cl=R5.classes[b.cls];b.classSkills=(cl.list||Object.keys(SKILLS)).slice(0,cl.pick);b.bgSkills=Object.keys(SKILLS).filter(s=>!b.classSkills.includes(s)).slice(0,2);if(b.cls==='rogue')b.expertise=b.classSkills.slice(0,2)}render(true)},builds[i]);
  await p.click('[data-a=bSave]');await p.waitForTimeout(500)}
const OBS=[];const note=s=>{OBS.push(s);console.log('•',s)};const N2={};const note2=s=>{N2[s]=(N2[s]||0)+1};
const T0=Date.now();
// ---------- prep ----------
await DM.click('[data-a=dmtab][data-k=prep]');await DM.waitForTimeout(200);
await DM.fill('#cpSN','The pier at dawn');await DM.click('[data-a=cpAdd][data-f=scenes]');await DM.waitForTimeout(250);
const sid=await DM.evaluate(()=>campOf().scenes[0].id);await DM.fill(`textarea[data-k="${sid}"][data-f=read]`,'Fog rolls over the pier. Two figures wait by the boats.');await DM.press(`textarea[data-k="${sid}"][data-f=read]`,'Tab');
await DM.fill('#cpEN','Pier ambush');await DM.click('[data-a=cpAdd][data-f=encs]');await DM.waitForTimeout(250);
const eid=await DM.evaluate(()=>campOf().encs[0].id);
const foes=RULES==='op'?[['Marine Soldier [Recruit] (CR 1/8)',2],['Flying Fish (CR 1/2)',1]]:[['Goblin (CR 1/4)',2],['Wolf (CR 1/4)',1]];
for(const [n,c] of foes){await DM.fill('#clib_'+eid,n);await DM.fill('#clibC_'+eid,String(c));await DM.click(`[data-a=cpMonLib][data-k="${eid}"]`);await DM.waitForTimeout(250)}
await DM.selectOption(`select[data-k="${sid}"][data-f=enc]`,eid);await DM.waitForTimeout(200);
await DM.evaluate(()=>document.querySelector('details[data-dk=npcgal]').open=true);await DM.click('[data-a=npcPreset][data-k="0"]');await DM.waitForTimeout(250);
await DM.fill('#cpLN','Captain\'s purse');await DM.click('[data-a=cpAdd][data-f=loot]');await DM.waitForTimeout(250);
const lid=await DM.evaluate(()=>campOf().loot[0].id);await DM.fill(`input[data-c=cpLoot][data-k="${lid}"]`,'300');await DM.press(`input[data-c=cpLoot][data-k="${lid}"]`,'Tab');
note('difficulty shown: '+await DM.evaluate(()=>(document.querySelector('.diff')||{}).textContent));await DM.screenshot({path:`sim_${RULES}_dm_prep.png`,fullPage:true});note('prep: '+JSON.stringify(await DM.evaluate(()=>{const c=campOf();return{scenes:c.scenes.length,enc:c.encs[0].mons.map(m=>m.name+'x'+m.n),npc:c.npcs.map(n=>n.name),loot:c.loot.length}})));
// ---------- play ----------
await DM.click(`[data-a=cpRead][data-k="${sid}"]`);await DM.waitForTimeout(500);
const nid=await DM.evaluate(()=>campOf().npcs[0].id);await DM.evaluate(()=>{const d=document.querySelector('details[data-dk]');});await DM.evaluate(id=>{const d=[...document.querySelectorAll('details[data-dk]')].find(x=>x.dataset.dk===id);if(d)d.open=true},nid);await DM.click(`[data-a=npcIntro][data-k="${nid}"]`);await DM.waitForTimeout(500);
note('player 0 log after read+intro: '+JSON.stringify(await P[0].p.evaluate(()=>SH.log.slice(0,2).map(e=>e.label))));
await DM.click(`[data-a=cpRun][data-k="${eid}"]`);await DM.waitForTimeout(600);
for(const {p} of P){await p.waitForSelector('[data-a=reqInit]',{timeout:6000}).catch(()=>note('no init request on a player'));if(await p.$('[data-a=reqInit]'))await p.click('[data-a=reqInit]')}
await DM.waitForTimeout(700);await DM.click('[data-a=initForAll]').catch(()=>{});await DM.waitForTimeout(300);await DM.click('[data-a=fightGo]');await DM.waitForTimeout(600);
note('order: '+JSON.stringify(await DM.evaluate(()=>initOf().order.map(o=>o.name+' '+o.v))));
const byUid={};for(const x of P)byUid[await x.p.evaluate(()=>SH.me)]=x.p;
let turns=0,pAtk=0,pHit=0,eAtk=0,stuck=0;
for(let k=0;k<30;k++){const st=await DM.evaluate(()=>{const i=initOf();const o=i.order[i.turn];const m=monsOf();return{pc:o.pc||null,id:o.id,name:o.name,round:i.round,alive:Object.values(m).filter(x=>x.hp>0).length,pcs:Object.values(SH.chars).map(c=>c.build.name+':'+c.hp).join(' ')}});
  if(!st.alive){note(`all enemies down in round ${st.round}`);break}
  if(st.round>8){note('fight still going after 8 rounds: '+st.pcs);break}
  turns++;
  if(st.pc){const p=byUid[st.pc];await p.click('[data-a=tab][data-k=actions]').catch(()=>{});await p.waitForTimeout(250);
    if(!await p.$('[data-a=endTurn]'))note(`${st.name}: no End-turn button on their turn`);
    const hp=await p.evaluate(()=>myChar().hp);
    if(hp<=0){note(`${st.name} is down on their turn`);await p.screenshot({path:`sim_${RULES}_p_down.png`});const db=await p.$('.dsban [data-a=death]');if(db){await db.click();note('  rolled a death save from the banner')}else note('  NO death-save banner')}
    else{await p.click('[data-a=atk]');await p.waitForTimeout(250);if(await p.$('[data-a=ptTo]:not([disabled])'))await p.click('[data-a=ptTo]:not([disabled])');pAtk++;await p.waitForTimeout(900);
      const card=await p.$('#rollCard.show [data-rcdmg]');const ready=card||await p.$('.btn.dmg.ready');if(card)note2('dmg via card');if(ready){pHit++;if(pHit===1)await p.screenshot({path:`sim_${RULES}_p_hit.png`});await ready.click();await p.waitForTimeout(700)}else if(pAtk<=3)await p.screenshot({path:`sim_${RULES}_p_miss${pAtk}.png`})
      if(pAtk===1)await p.screenshot({path:`sim_${RULES}_p_turn.png`})}
    if(await p.$('[data-a=endTurn]'))await p.click('[data-a=endTurn]');else await DM.click('[data-a=turnNext]')}
  else{const m=await DM.evaluate(id=>monsOf()[id],st.id);
    if(m&&m.hp>0){const b=await DM.$(`[data-a=mtPick][data-k="${st.id}"]`);if(b){await b.click();await DM.waitForTimeout(200);const ch=await DM.$$('[data-a=mtTo]');if(ch.length){await ch[Math.floor(Math.random()*ch.length)].click();eAtk++}else{const g=await DM.$('[data-a=mtGo]');note('save attack target picker');}await DM.waitForTimeout(700);if(eAtk===1)await DM.screenshot({path:`sim_${RULES}_dm_enemy.png`})}else note(`${st.name}: no attack button`)}
    await DM.click('[data-a=turnNext]')}
  await DM.waitForTimeout(500)}
note(`turns ${turns}, player attacks ${pAtk} (hits ${pHit}), enemy attacks ${eAtk}`);
note('enemies: '+await DM.evaluate(()=>Object.values(monsOf()).map(m=>m.name+' '+m.hp+'/'+m.max).join(', ')));
note('party: '+await DM.evaluate(()=>Object.values(SH.chars).map(c=>c.build.name+' '+c.hp+'/'+DV(c).maxhp).join(', ')));
const leak=await P[0].p.evaluate(()=>SH.log.filter(e=>e.kind==='d20'&&!SH.chars[e.by]).map(e=>e.label));if(leak.length)note('LEAK: player sees enemy rolls '+leak.slice(0,3));
const unapplied=await DM.evaluate(()=>SH.log.filter(e=>e.kind==='dmg'&&e.tgt).length+' targeted dmg rolls; panel rows: '+document.querySelectorAll('[data-a=dApply]').length);note(unapplied);
await DM.screenshot({path:`sim_${RULES}_dm_end.png`});await P[1].p.screenshot({path:`sim_${RULES}_p1_end.png`});
console.log('--- player 1 log ---\n'+(await P[1].p.evaluate(()=>SH.log.slice(0,25).reverse().map(e=>(e.kind==='note'?'  ':e.who+': ')+e.label+(e.total!==''&&e.total!==undefined?' = '+e.total:'')).join('\n'))));
await DM.click('[data-a=fightEnd]');await DM.click('[data-a=fightEnd]');await DM.waitForTimeout(400);
// after the fight: loot, rest
await DM.click('[data-a=dmtab][data-k=prep]');await DM.waitForTimeout(200);await DM.evaluate(id=>{const d=[...document.querySelectorAll('details[data-dk]')].find(x=>x.dataset.dk===id);if(d)d.open=true},lid);await DM.click(`[data-a=cpGive][data-k="${lid}"]`);await DM.waitForTimeout(800);
for(const {p} of P){if(await p.$('[data-a=ofYes]')){await p.click('[data-a=ofYes]');await p.waitForTimeout(500)}else note('a player got no loot popup')}
note('money: '+await DM.evaluate(()=>Object.values(SH.chars).map(c=>c.build.name+' '+moneyTxt(c)).join(', ')));
for(const {p} of P){await p.click('[data-a=tab][data-k=main]').catch(()=>{});await p.waitForTimeout(200);const b=await p.$('[data-a=rest][data-k=short]');if(b){await b.click();await p.waitForTimeout(300)}}
note('counts: '+JSON.stringify(N2));note('errors: '+JSON.stringify(errs));note('time '+((Date.now()-T0)/1000|0)+' s');
await b.close();hs.close();srv.close();process.exit(0)})();
