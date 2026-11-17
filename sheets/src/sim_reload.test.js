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
const LV=+(process.argv[3]||3);const builds=RULES==='op'?[{name:'Zoro',cls:'fighter',species:'human',sub:'standard',weapon:'greatsword',classSkills:['Athletics','Perception'],bgSkills:['Stealth','Survival']},{name:'Chopper',cls:'chemist',species:'mink',weapon:'scimitar',classSkills:['Medicine','Nature'],bgSkills:['Insight','Perception']},{name:'Usopp',cls:'marksman',species:'human',sub:'standard',weapon:'musket',classSkills:['Perception','Stealth'],bgSkills:['Deception','Insight']}]
 :[{name:'Thorin',cls:'fighter',species:'dwarf'},{name:'Elara',cls:'wizard',species:'elf'},{name:'Pip',cls:'rogue',species:'halfling'}];
const P=[];for(let i=0;i<2;i++){const c=await ctxPage({...devices['iPhone 13']},'P'+i);const p=await c.mk();await p.goto(U+'?room='+code);await p.waitForSelector('#nlGo');await p.click('#nlGo');await p.waitForSelector('[data-a=editOpen]',{timeout:20000}).catch(async e=>{console.log('JOIN FAIL',await p.evaluate(()=>JSON.stringify([document.body.innerText.slice(0,200),SH.ready,SH.state,SH.owner,SH.solo,GLT_NET.role,GLT_NET.lost,Object.keys(GLT_NET.data)])),errs);throw e});P.push({c,p})}
for(let i=0;i<2;i++){const p=P[i].p;await p.click('[data-a=editOpen]');await p.waitForTimeout(200);
  await p.evaluate(bd=>{Object.assign(SH.edit.b,bd);const b=SH.edit.b;if(b.rules==='5e'){r5ClassDefaults(b);const cl=R5.classes[b.cls];b.classSkills=(cl.list||Object.keys(SKILLS)).slice(0,cl.pick);b.bgSkills=Object.keys(SKILLS).filter(s=>!b.classSkills.includes(s)).slice(0,2);if(b.cls==='rogue')b.expertise=b.classSkills.slice(0,2)}render(true)},builds[i]);
  await p.evaluate(lv=>{SH.edit.b.level=lv;render(true)},LV);await p.click('[data-a=bSave]');await p.waitForTimeout(500);
  const SP={chemist:['Produce Flame','Thorn Whip','Cure Wounds','Healing Word','Thunderwave','Moonbeam'],wizard:['Fire Bolt','Ray of Frost','Magic Missile','Burning Hands','Shield','Scorching Ray'],fighter:[]}[builds[i].cls]||[];
  for(const n of SP){await p.evaluate(n=>listEdit(SH.me,'spells',L=>[...L,{id:uidNew(),name:n,lvl:spellFind(n).l}]),n);await p.waitForTimeout(80)}}
const AIPLAN=()=>{const c=myChar();const me=SH.me;const D=DV(c);const CI=casterInfo(c,D);const spells=(c.spells||[]).map(s=>({id:s.id,sp:spellFind(s.name)})).filter(x=>x.sp);
  const can=x=>!x.sp.l||(CI&&CI.levels.some(v=>v.L>=x.sp.l));const down=Object.entries(SH.chars).find(([u,x])=>u!==me&&x.hp<=0&&!x.dead);const hurt=Object.entries(SH.chars).find(([u,x])=>x.hp>0&&x.hp<DV(x).maxhp/3);
  if(down){const h=spells.find(x=>x.sp.k==='heal'&&can(x));if(h)return{cast:h.id,target:down[0],why:'heal downed ally'}}
  if(hurt){const h=spells.find(x=>x.sp.k==='heal'&&can(x));if(h&&Math.random()<.6)return{cast:h.id,target:hurt[0],why:'heal hurt ally'}}
  const foes=foeList().filter(f=>!f.down).length;const aoe=spells.find(x=>x.sp.k==='save'&&x.sp.d&&x.sp.l>0&&can(x));if(aoe&&foes>=2&&Math.random()<.6)return{cast:aoe.id,many:1,why:'area spell'};
  const l1=spells.find(x=>x.sp.l>0&&(x.sp.k==='atk'||x.sp.k==='auto')&&can(x));if(l1&&Math.random()<.35)return{cast:l1.id,why:'levelled spell'};
  const ct=spells.find(x=>x.sp.l===0&&x.sp.d);if(ct&&Math.random()<.75)return{cast:ct.id,why:'cantrip'};return{weapon:1,why:'weapon'}};
const W2=ms=>new Promise(r=>setTimeout(r,ms));const OBS=[];const note=s=>{OBS.push(s);console.log('•',s)};const N2={};const note2=s=>{N2[s]=(N2[s]||0)+1};
const T0=Date.now();
// ---------- prep ----------
await DM.click('[data-a=dmtab][data-k=prep]');await DM.waitForTimeout(200);
await DM.fill('#cpSN','The pier at dawn');await DM.click('[data-a=cpAdd][data-f=scenes]');await DM.waitForTimeout(250);
const sid=await DM.evaluate(()=>campOf().scenes[0].id);await DM.fill(`textarea[data-k="${sid}"][data-f=read]`,'Fog rolls over the pier. Two figures wait by the boats.');await DM.press(`textarea[data-k="${sid}"][data-f=read]`,'Tab');
await DM.fill('#cpEN','Pier ambush');await DM.click('[data-a=cpAdd][data-f=encs]');await DM.waitForTimeout(250);
const eid=await DM.evaluate(()=>campOf().encs[0].id);
const foes=RULES==='op'?[['Marine Soldier [Recruit] (CR 1/8)',3],['Flying Fish (CR 1/2)',1]]:[['Goblin (CR 1/4)',3],['Wolf (CR 1/4)',1]];
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
  if(turns===4){note('P1 reloads mid-fight');await P[1].p.reload();await P[1].p.waitForSelector('#nlGo',{timeout:8000}).then(()=>P[1].p.click('#nlGo')).catch(()=>{});await P[1].p.waitForSelector('[data-a=tab]',{timeout:20000}).catch(()=>note('P1 did not come back'));await W2(1500);
    note('P1 after reload sees fight: '+await P[1].p.evaluate(()=>!!(SH.state.init&&SH.state.init.on))+' own hp '+await P[1].p.evaluate(()=>myChar()&&myChar().hp))}
  if(turns===9){note('DM reloads mid-fight');await DM.reload();await DM.waitForSelector('#nlHost,[data-a=dmtab]',{timeout:15000}).catch(()=>{});if(await DM.$('#nlHost')){await DM.click('#nlHost')}await DM.waitForSelector('[data-a=dmtab]',{timeout:20000}).catch(()=>note('DM did not come back'));await W2(4000);
    await DM.click('[data-a=dmtab][data-k=fight]').catch(()=>{});await W2(500);note('DM after reload: fight on '+await DM.evaluate(()=>!!(SH.state.init&&SH.state.init.on))+', enemies '+await DM.evaluate(()=>Object.values(monsOf()).map(m=>m.hp).join('/'))+', players connected '+await DM.evaluate(()=>Object.keys(SH.chars).length));
    for(const x of P)note('player sees DM back: '+await x.p.evaluate(()=>!document.body.innerText.includes('Reconnecting')&&!document.body.innerText.includes('lost')))}
  if(st.pc){const p=byUid[st.pc];await p.click('[data-a=tab][data-k=actions]').catch(()=>{});await p.waitForTimeout(250);
    if(!await p.$('[data-a=endTurn]'))note(`${st.name}: no End-turn button on their turn`);
    const hp=await p.evaluate(()=>myChar().hp);
    if(hp<=0){note(`${st.name} is down on their turn`);await p.screenshot({path:`sim_${RULES}_p_down.png`});const db=await p.$('.dsban [data-a=death]');if(db){await db.click();note('  rolled a death save from the banner')}else note('  NO death-save banner')}
    else{const plan=await p.evaluate(AIPLAN);note2(st.name+': '+plan.why);
      if(plan.cast){await p.click(`[data-a=spCast][data-k="${plan.cast}"]`);await p.waitForTimeout(300);
        for(let r=0;r<6;r++){if(!await p.$('[data-a=pkTo]'))break;const cd0=await p.$('#rollCard.show [data-rcdmg]');if(cd0){await cd0.evaluate(b=>b.click()).catch(()=>{});await p.waitForTimeout(400)}const many=await p.$('[data-a=pkGo]');
          if(plan.target&&await p.$(`[data-a=pkTo][data-k="${plan.target}"]`))await p.click(`[data-a=pkTo][data-k="${plan.target}"]`);else await (await p.$$('[data-a=pkTo]'))[0].click();await p.waitForTimeout(200);
          if(many){const c2=await p.$$('[data-a=pkTo]:not(.on)');if(plan.many&&c2[0]){await c2[0].click();await p.waitForTimeout(150)}if(await p.$('[data-a=pkGo]:not([disabled])'))await p.click('[data-a=pkGo]')}await p.waitForTimeout(700);
          const cd=await p.$('#rollCard.show [data-rcdmg]');if(cd){await cd.evaluate(b=>b.click());await p.waitForTimeout(500)}}
        await p.waitForTimeout(500);for(const x of await p.$$('.hitnote [data-a=dmg]')){await x.click().catch(()=>{});await p.waitForTimeout(400)}pAtk++;
        const cd=await p.$('#rollCard.show [data-rcdmg]');if(cd){pHit++;await cd.evaluate(b=>b.click());await p.waitForTimeout(600)}}
      else{await p.click('[data-a=atk]');await p.waitForTimeout(250);if(await p.$('[data-a=ptTo]:not([disabled])'))await p.click('[data-a=ptTo]:not([disabled])');pAtk++;await p.waitForTimeout(900);
      const card=await p.$('#rollCard.show [data-rcdmg]');const ready=card||await p.$('.btn.dmg.ready');if(card)note2('dmg via card');if(ready){pHit++;if(pHit===1)await p.screenshot({path:`sim_${RULES}_p_hit.png`});await ready.evaluate(b=>b.click());await p.waitForTimeout(700)}else if(pAtk<=3)await p.screenshot({path:`sim_${RULES}_p_miss${pAtk}.png`})
      if(pAtk===1)await p.screenshot({path:`sim_${RULES}_p_turn.png`})}}
    if(await p.$('[data-a=endTurn]'))await p.click('[data-a=endTurn]');else await DM.click('[data-a=turnNext]')}
  else{const m=await DM.evaluate(id=>monsOf()[id],st.id);
    if(m&&m.hp>0){const b=await DM.$(`[data-a=mtPick][data-k="${st.id}"]`);if(b){await b.click();await DM.waitForTimeout(200);const ch=await DM.$$('[data-a=mtTo]');if(ch.length){await ch[Math.floor(Math.random()*ch.length)].click();eAtk++}else{const g=await DM.$('[data-a=mtGo]');note('save attack target picker');}await DM.waitForTimeout(700);if(eAtk===1)await DM.screenshot({path:`sim_${RULES}_dm_enemy.png`})}else note(`${st.name}: no attack button`)}
    await DM.click('[data-a=turnNext]')}
  const inv=await DM.evaluate(()=>{const bad=[];for(const [u,c] of Object.entries(SH.chars)){const D=DV(c);if(!(c.hp>=0&&c.hp<=D.maxhp))bad.push(c.build.name+' hp '+c.hp+'/'+D.maxhp);for(const [k,v] of Object.entries(c.res||{}))if(v<0||isNaN(v))bad.push(c.build.name+' res '+k+'='+v)}
    for(const m of Object.values(monsOf()))if(!(m.hp>=0&&m.hp<=m.max))bad.push(m.name+' hp '+m.hp);for(const e of SH.log.slice(0,12))if(/NaN|undefined|null/.test(e.label+' '+e.total))bad.push('log: '+e.label+' '+e.total);return bad});
  for(const x of inv)if(!OBS.includes('INV '+x))note('INV '+x);
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
