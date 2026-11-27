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
await DM.evaluate(u=>{const c=SH.chars[u];const b={...c.build,species:'tiefling',cls:'barbarian',level:5};r5ClassDefaults(b);const D=DV({...c,build:b});saveChar(u,{build:b,hp:D.maxhp})},u0);await DM.waitForTimeout(500);
note('barbarian resistances: '+await p0.evaluate(()=>resLine(myChar())));
await p0.click('[data-a=tab][data-k=actions]');await p0.waitForTimeout(200);await p0.click('[data-a=rageStart]');await p0.waitForTimeout(400);
note('raging: '+await p0.evaluate(()=>myChar().raging+' · '+resLine(myChar())));
await DM.click('[data-a=dmtab][data-k=fight]');await DM.click('[data-a=fightStart]');await DM.waitForTimeout(400);
await DM.fill('#flib','Young Red Dragon (CR 10)');await DM.click('[data-a=fMonLib]');await DM.waitForTimeout(400);
const hp0=await DM.evaluate(()=>Object.values(SH.chars).map(c=>c.build.name+' '+c.hp).join(', '));
const atks=await DM.$$eval('[data-a=mtPick]',e=>e.map(x=>x.textContent));note('dragon attacks: '+atks.join(' | '));
const bi=atks.findIndex(t=>/Breath/.test(t));await DM.evaluate(ix=>{const b=document.querySelectorAll('[data-a=mtPick]')[ix];if(!b)return;const id=b.dataset.k;const ini=initOf();const i=ini.order.findIndex(o=>o.id===id);setInit({turn:i,started:true});SH.mta={}},bi);await DM.waitForTimeout(250);await (await DM.$$('[data-a=mtPick]'))[bi].click();await DM.waitForTimeout(200);
await DM.click(`[data-a=mtTo][data-u="${u0}"]`);await DM.click(`[data-a=mtTo][data-u="${u1}"]`);await DM.waitForTimeout(150);await DM.click('[data-a=mtGo]');await DM.waitForTimeout(800);
const ban=await p0.$('[data-a=sreqRoll]');note('P0 save banner: '+!!ban+' | P1 banner: '+!!(await p1.$('[data-a=sreqRoll]')));
await p0.screenshot({path:'sreq_p0.png'});
if(ban){await ban.click();await p0.waitForTimeout(900)}
note('DM waiting box: '+await DM.evaluate(()=>(document.querySelector('.sreqdm')||{}).textContent||'none'));
await DM.click('[data-a=sreqAuto]').catch(()=>note('no roll-for-them button'));await DM.waitForTimeout(800);
note('after breath: '+await DM.evaluate(()=>Object.values(SH.chars).map(c=>c.build.name+' '+c.hp+'/'+DV(c).maxhp).join(', '))+' (before '+hp0+')');
note('log: '+await p1.evaluate(()=>SH.log.slice(0,6).reverse().map(e=>e.label+(e.total!==''?' '+e.total:'')).join(' || ')));
note('sreq cleared: '+await DM.evaluate(()=>!SH.state.sreq));
// bite (piercing + fire) on the raging tiefling
const bt=atks.findIndex(t=>/Bite/.test(t));await DM.evaluate(()=>{Math.random=(R=>{let k=0;return()=>{k++;return k<=2?0.97:R()}})(Math.random)});
await DM.evaluate(ix=>{const b=document.querySelectorAll('[data-a=mtPick]')[ix];if(!b)return;const id=b.dataset.k;const ini=initOf();const i=ini.order.findIndex(o=>o.id===id);setInit({turn:i,started:true});SH.mta={}},bt);await DM.waitForTimeout(250);await (await DM.$$('[data-a=mtPick]'))[bt].click();await DM.waitForTimeout(200);await DM.click(`[data-a=mtTo][data-u="${u0}"]`);await DM.waitForTimeout(700);
note('bite: '+await p0.evaluate(()=>SH.log[0].label));
// rage damage on a greataxe hit
await p0.evaluate(()=>{const a=DV(myChar()).attacks[0];rollDmg(a.name+' damage',a.dmg,{uid:SH.me})});await p0.waitForTimeout(400);note('raging damage roll: '+await p0.evaluate(()=>SH.log[0].label+' '+SH.log[0].detail));
note('errors: '+JSON.stringify(errs));await b.close();hs.close();srv.close();process.exit(0)})();
