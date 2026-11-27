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
const OBS=[];const note=s=>{OBS.push(s);console.log('•',s)};
const p0=P[0].p,p1=P[1].p;const u0=await p0.evaluate(()=>SH.me),u1=await p1.evaluate(()=>SH.me);
// ---- home island via the builder UI (player 0)
await p0.click('[data-a=editOpen]');await p0.waitForTimeout(300);
const hasIsl=await p0.$('[data-a=bIsland][data-k=tiny]');note('island picker in builder: '+!!hasIsl);
if(hasIsl){await p0.click('[data-a=bIsland][data-k=tiny]');await p0.waitForTimeout(200);await p0.check('[data-c=bHunt]');await p0.screenshot({path:'hunt_builder.png',fullPage:true});}
await p0.click('[data-a=bSave]');await p0.waitForTimeout(500);
note('saved build: '+JSON.stringify(await DM.evaluate(u=>({i:SH.chars[u].build.island,h:SH.chars[u].build.hunt}),u0)));
// ---- DM runs the hunt; force the island die to 1 for the test
await DM.click('[data-a=dmtab][data-k=prep]');await DM.waitForTimeout(300);
await DM.evaluate(()=>{const R=Math.random;let k=0;Math.random=()=>{k++;return k<=1?0.0001:R()};setTimeout(()=>Math.random=R,2000)});
await DM.click(`[data-a=huntIsland][data-u="${u0}"]`);await DM.waitForTimeout(400);
note('hunt after island die: '+JSON.stringify(await DM.evaluate(u=>SH.dm.hunts[u],u0)));
await DM.check('#hr_'+u0);await DM.click(`[data-a=huntAsk][data-u="${u0}"]`);await DM.waitForTimeout(700);
// player 0 uses real dice for the search roll
await p0.click('[data-a=realTog][data-k=me]');await p0.waitForTimeout(200);
await p0.waitForSelector('[data-a=reqRoll]',{timeout:6000});note('player sees request: '+await p0.evaluate(()=>document.querySelector('.req').textContent.trim()));
await p0.click('[data-a=reqRoll]');await p0.waitForSelector('.realbox',{timeout:4000});await p0.waitForTimeout(500);await p0.screenshot({path:'real_d20.png'});
await p0.click('[data-a=realFace][data-k="18"]');await p0.waitForTimeout(200);await p0.click('[data-a=realFace][data-k="9"]');await p0.waitForTimeout(800);
note('roll logged: '+await DM.evaluate(()=>{const e=SH.log.find(x=>x.req);return e&&(e.label+' '+e.detail+' = '+e.total+(e.real?' [real]':''))}));
await DM.waitForTimeout(400);await DM.screenshot({path:'hunt_dm.png',fullPage:true});
const tk=await DM.$(`[data-a=huntTaken][data-u="${u0}"]`);note('search passed → taken check button: '+!!tk);
if(tk){await DM.evaluate(()=>{const R=Math.random;Math.random=()=>0.9;setTimeout(()=>Math.random=R,500)});await tk.click();await DM.waitForTimeout(400);
  const g=await DM.$(`[data-a=huntGive][data-u="${u0}"][data-k]:not([data-k=""])`);note('fruit suggestions: '+(await DM.$$eval(`[data-a=huntGive][data-u="${u0}"]`,e=>e.map(x=>x.textContent.trim()).filter(Boolean))).join(' | '));
  if(g){await g.click();await p0.waitForSelector('[data-a=ofEat]',{timeout:6000});await p0.screenshot({path:'hunt_offer.png'});await p0.click('[data-a=ofKeep]');await p0.waitForTimeout(500);note('player kept: '+JSON.stringify(await p0.evaluate(()=>myChar().inv.filter(i=>i.fruit).map(i=>i.name))))}}
// ---- real dice for an attack + damage outside a fight
await p0.click('[data-a=tab][data-k=actions]');await p0.waitForTimeout(200);await p0.click('[data-a=atk]');await p0.waitForSelector('.realbox');await p0.click('[data-a=realFace][data-k="20"]');await p0.waitForTimeout(500);
const card=await p0.$('#rollCard.show [data-rcf]');if(card){await card.evaluate(b=>b.click());await p0.waitForSelector('.realbox input');await p0.waitForTimeout(500);await p0.screenshot({path:'real_dmg.png'});const ins=await p0.$$('.realbox input');for(const x of ins)await x.fill('9');await p0.click('[data-a=realOk]');await p0.waitForTimeout(600)}
note('attack+damage logged: '+await DM.evaluate(()=>SH.log.slice(0,2).reverse().map(e=>e.label+' '+e.detail+' = '+e.total+(e.real?' [real]':'')).join(' || ')));
// "let the app roll"
await p0.click('[data-a=atk]');await p0.waitForSelector('.realbox');await p0.click('[data-a=realApp]');await p0.waitForTimeout(500);note('app roll: '+await DM.evaluate(()=>{const e=SH.log[0];return e.label+' real='+!!e.real}));
// DM real dice for an enemy attack
await DM.click('[data-a=dmtab][data-k=table]');await DM.check('[data-c=realDm]');await DM.click('[data-a=dmtab][data-k=fight]');await DM.click('[data-a=fightStart]');await DM.waitForTimeout(300);
await DM.fill('#flib','Marine Soldier [Recruit] (CR 1/8)');await DM.click('[data-a=fMonLib]');await DM.waitForTimeout(300);
await DM.click('[data-a=mtPick]');await DM.waitForTimeout(100);await DM.click('[data-a=mtPick]');await DM.waitForTimeout(200);await DM.click(`[data-a=mtTo][data-u="${u1}"]`);await DM.waitForSelector('.realbox');await DM.click('[data-a=realFace][data-k="19"]');await DM.waitForTimeout(400);
if(await DM.$('.realbox input')){await DM.fill('.realbox input','5');await DM.click('[data-a=realOk]');await DM.waitForTimeout(500)}
note('enemy attack (DM real dice): '+await DM.evaluate(()=>((SH.dm.rolls||{}).items||[]).slice(0,2).map(e=>e.label+' '+e.total+(e.real?' [real]':'')).join(' || '))+' | player log: '+await p1.evaluate(()=>SH.log[0].label));
note('errors: '+JSON.stringify(errs));
await b.close();hs.close();srv.close();process.exit(0)})();
