// ================= screen, taps and typing =================
function typing(){const a=document.activeElement;return!!(a&&a.closest&&a.closest('#app')&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.type!=='checkbox')}
let dirty=false;
function render(force){try{applyTheme()}catch(e){}if(!force&&typing()){dirty=true;return}dirty=false;const app=q('#app');if(!app)return;
  const dk=d=>d.dataset.dk||d.querySelector('summary')?.textContent||'';const open=[...qa('details[open]',app)].map(dk);const y=window.scrollY;
  app.innerHTML=screenHTML();
  for(const d of qa('details',app)){if(open.includes(dk(d)))d.open=true}
  window.scrollTo(0,y)}
document.addEventListener('focusout',()=>{setTimeout(()=>{if(dirty&&!typing())render()},80)});
function netHTML(){const N=window.GLT_NET;if(SH.solo)return'<span class="net">this device only</span>';if(!N||!N.code)return'<span class="net">live</span>';
  return N.role==='host'?`<span class="net">Room <b>${esc(N.code)}</b> · ${N.conns.size} 👥</span>`:N.lost?`<button type="button" class="net bad" data-a="rejoin">⚠ Reconnect</button>`:`<span class="net">Room <b>${esc(N.code)}</b></span>`}
function topHTML(){return`<header class="top"><div class="advsw" role="group" aria-label="Advantage for the next roll">${[[-1,'Dis'],[0,'Normal'],[1,'Adv']].map(([v,l])=>`<button type="button" class="${SH.adv===v?'on':''}" data-a="adv" data-k="${v}">${l}</button>`).join('')}</div>${netHTML()}<button type="button" class="btn xs" data-a="themeOpen" aria-label="Change the look">🎨</button>
  ${SH.owner&&(SH.solo||myChar())?`<button type="button" class="btn xs" data-a="swapDM">${isDM()?'My sheet':'DM'}</button>`:''}</header>`}
function navHTML(tabs,cur,act){return`<nav class="nav">${tabs.map(([k,i,l])=>`<button type="button" class="${cur===k?'on':''}" data-a="${act}" data-k="${k}"><i>${i}</i><span>${l}</span></button>`).join('')}</nav>`}
function setupHTML(){return`<div class="builder"><div class="hero"><div class="hn"><h1>Set up your table</h1><div class="sub">You are the DM. Your players only need the invite link.</div></div></div>
  <label class="fl">Table name<input id="suName" maxlength="40" placeholder="e.g. Friday crew"></label>
  <h2>Which rules?</h2><div class="pick2"><button type="button" class="card tapc" data-a="setup" data-k="op"><b>🏴‍☠️ One Piece</b><p>Dungeons & Devil Fruits: fish-men, minks and sky islanders, Devil Fruits, Haki and Berries. Levels 1 to 10.</p></button>
    <button type="button" class="card tapc" data-a="setup" data-k="5e"><b>🐉 Plain D&D 5e</b><p>The nine classic species and all twelve classes with spell slots. Levels 1 to 20.</p></button></div>
  <p class="hint">You can change this later; characters keep the rules they were made with.</p></div>`}
function screenHTML(){if(!SH.ready)return'<p class="hint" style="padding:40px;text-align:center">Opening the table…</p>';
  if(!SH.state.rules){return SH.owner?setupHTML():'<div class="builder"><div class="hero"><div class="hn"><h1>Almost there</h1><div class="sub">The DM is still setting up the table. This page will continue by itself.</div></div></div></div>'}
  if(SH.pick)return themePickHTML();
  if(SH.edit)return topHTML()+builderHTML();
  if(SH.lu)return topHTML()+luHTML();
  if(SH.open&&SH.chars[SH.open])return topHTML()+`<div class="dmopen"><button type="button" class="btn sm" data-a="closeSheet">← Back to the DM screen</button></div>`+initStripHTML()+sheetHTML(SH.open)+navHTML(TABS.filter(t=>t[0]!=='table'),SH.tab,'tab');
  if(isDM())return topHTML()+initStripHTML()+dmHTML()+navHTML(DMTABS,SH.dmTab,'dmtab');
  const c=myChar();if(!charOK(c))return topHTML()+`<div class="builder"><div class="hero"><div class="hn"><h1>Welcome${SH.state.name?' to '+esc(SH.state.name):''}</h1><div class="sub">Make your character. It takes about three minutes.</div></div></div><button type="button" class="btn pri big" data-a="editOpen" data-u="${SH.me}">Create my character</button><h2>Already at the table</h2><div class="party">${partyHTML()}</div></div>`;
  return topHTML()+reqBannerHTML()+initStripHTML()+sheetHTML(SH.me)+navHTML(TABS,SH.tab,'tab')}

const val=id=>{const e=document.getElementById(id);return e?e.value:''};
const num=id=>{const v=parseFloat(val(id));return isNaN(v)?0:v};
function atkById(uid,id){const c=SH.chars[uid];const D=DV(c);if(id[0]==='w')return D.attacks[+id.slice(1)];const a=(c.catk||[]).find(x=>x.id===id);return a?{name:a.name,atk:+a.bonus||0,dmg:a.dmg}:null}
function listEdit(uid,field,fn){const c=SH.chars[uid];saveChar(uid,{[field]:fn((c[field]||[]).slice())})}
const ACT={
  adv(b){SH.adv=+b.dataset.k;render(true)},tab(b){SH.tab=b.dataset.k;render(true);window.scrollTo(0,0)},dmtab(b){SH.dmTab=b.dataset.k;render(true);window.scrollTo(0,0)},
  swapDM(){SH.asDM=!isDM();SH.open=null;render(true)},rejoin(){if(window.GLT_REJOIN)window.GLT_REJOIN()},
  setup(b){put('table/state',{...SH.state,rules:b.dataset.k,name:val('suName').trim(),t:Date.now(),showHP:true})},
  // --- sheet ---
  hp(b){const u=b.dataset.u;const n=Math.abs(Math.round(num('hpN_'+u)));if(!n){toast('Type an amount first.');return}hpChange(u,n*(+b.dataset.s));const e=document.getElementById('hpN_'+u);if(e)e.value=''},
  temp(b){const u=b.dataset.u;const n=Math.max(0,Math.round(num('hpN_'+u)));saveChar(u,{temp:n});const e=document.getElementById('hpN_'+u);if(e)e.value=''},
  death(b){deathSave(b.dataset.u)},hd(b){spendHD(b.dataset.u)},
  rest(b){const u=b.dataset.u,k=b.dataset.k;if(k==='long'&&!tapTwice(b,'Tap again: long rest'))return;restFor(u,k);addLog({by:SH.me,who:who(u),kind:'note',label:`🛌 ${who(u)} takes a ${k} rest.`,total:''});if(k==='short')toast('Short rest: spend hit dice to heal.')},
  init(b){const u=b.dataset.u;const D=DV(SH.chars[u]);const ini=SH.state.init;rollD20('Initiative',D.init,partsText(D.initParts||[]),{uid:u,...(ini&&ini.on&&ini.req&&u===SH.me?{init:ini.req}:{})})},
  insp(b){const u=b.dataset.u;saveChar(u,{insp:!SH.chars[u].insp})},exh(b){const u=b.dataset.u;saveChar(u,{exh:Math.max(0,Math.min(6,(SH.chars[u].exh||0)+(+b.dataset.d)))})},
  cond(b){const u=b.dataset.u;const cd={...(SH.chars[u].cond||{})};delete cd[b.dataset.k];saveChar(u,{cond:cd})},
  abil(b){const u=b.dataset.u,k=b.dataset.k;const D=DV(SH.chars[u]);rollD20(ABN[k]+' check',mod(D.ab[k]),`${fmt(mod(D.ab[k]))} ${k}`,{uid:u})},
  save(b){const u=b.dataset.u,k=b.dataset.k;const s=DV(SH.chars[u]).saves[k];rollD20(ABN[k]+' save',s.bonus,partsText(s.parts),{uid:u})},
  skill(b){const u=b.dataset.u,k=b.dataset.k;const s=DV(SH.chars[u]).skills[k];rollD20(k,s.bonus,partsText(s.parts),{uid:u})},
  atk(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(!a)return;rollD20(a.name+' attack',a.atk,a.atkParts?partsText(a.atkParts):fmt(a.atk),{uid:u,follow:a.dmg?[{t:'Damage '+a.dmg,run:crit=>rollDmg(a.name+' damage',a.dmg,{uid:u,crit})}]:null})},
  dmg(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(a&&a.dmg)rollDmg(a.name+' damage',a.dmg,{uid:u})},
  sneak(b){const u=b.dataset.u;rollDmg('Sneak Attack',DV(SH.chars[u]).sneak+'d6',{uid:u})},
  pip(b){const u=b.dataset.u,k=b.dataset.k;if(!canEdit(u))return;const c=SH.chars[u];const max=+b.dataset.m;const i=+b.dataset.i;const used=(c.res||{})[k]||0;const left=max-used;const nl=b.classList.contains('on')?i:i+1;saveChar(u,{res:{...(c.res||{}),[k]:Math.max(0,max-nl)}})},
  resAdj(b){const u=b.dataset.u,k=b.dataset.k;const c=SH.chars[u];const D=DV(c);const max=k==='fruit'?(fruitOf(c)||{charges:0}).charges:(D.res[k]||{max:99}).max;saveChar(u,{res:{...(c.res||{}),[k]:Math.max(0,Math.min(max,((c.res||{})[k]||0)+(+b.dataset.d)))}})},
  catkAdd(b){const u=b.dataset.u;const name=val('caN_'+u).trim();if(!name){toast('Give the attack a name.');return}const dmg=val('caD_'+u).trim();if(dmg&&!parseDice(dmg)){toast('Write damage like 1d8+3.');return}listEdit(u,'catk',L=>[...L,{id:uidNew(),name,bonus:Math.round(num('caB_'+u)),dmg,note:val('caT_'+u).trim()}])},
  catkDel(b){listEdit(b.dataset.u,'catk',L=>L.filter(x=>x.id!==b.dataset.k))},
  cresAdd(b){const u=b.dataset.u;const name=val('crN_'+u).trim();const max=Math.round(num('crM_'+u));if(!name||max<1){toast('Give it a name and a number of uses.');return}listEdit(u,'cres',L=>[...L,{id:uidNew(),name,max:Math.min(99,max),rest:val('crR_'+u)}])},
  cresDel(b){listEdit(b.dataset.u,'cres',L=>L.filter(x=>x.id!==b.dataset.k))},
  spAdd(b){const u=b.dataset.u;const name=val('spN_'+u).trim();if(!name){toast('Give it a name.');return}const roll=val('spR_'+u).trim();if(roll&&!parseDice(roll)){toast('Write dice like 8d6 or 1d10+4.');return}listEdit(u,'spells',L=>[...L,{id:uidNew(),name,lvl:+val('spL_'+u)||0,roll,note:val('spT_'+u).trim()}])},
  spDel(b){listEdit(b.dataset.u,'spells',L=>L.filter(x=>x.id!==b.dataset.k))},
  spRoll(b){const u=b.dataset.u;const s=(SH.chars[u].spells||[]).find(x=>x.id===b.dataset.k);if(s)rollDmg(s.name,s.roll,{uid:u})},
  spAtk(b){const u=b.dataset.u;const sp=DV(SH.chars[u]).spell;rollD20('Spell attack',sp.atk,fmt(sp.atk),{uid:u})},
  fruitUse(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const fr=fruitOf(c);const t=fr&&fr.techs.find(x=>x.id===b.dataset.k);if(!t)return;const used=(c.res||{}).fruit||0;if(used+t.cost>fr.charges){toast('Not enough charges left.');return}
    saveChar(u,{res:{...(c.res||{}),fruit:used+t.cost}});const dmg=t.n&&t.die?`${t.n}d${t.die}`:null;
    if(t.kind==='attack')rollD20(t.name,fruitAtk(D,c),`${fmt(fruitAtk(D,c))} fruit attack`,{uid:u,follow:dmg?[{t:'Damage '+dmg,run:crit=>rollDmg(t.name+' damage',dmg,{uid:u,crit})}]:null});
    else{addLog({by:SH.me,who:who(u),kind:'note',label:`🍇 ${who(u)} uses ${t.name}${t.save?`: ${t.save} save DC ${fruitDC(D,c)}`:''}`,total:''});if(dmg)rollDmg(t.name+' damage',dmg,{uid:u})}},
  hakiDel(b){const u=b.dataset.u;saveChar(u,{haki:(SH.chars[u].haki||[]).filter(k=>k!==b.dataset.k)})},
  cfeatAdd(b){const u=b.dataset.u;const name=val('cfN_'+u).trim();if(!name){toast('Give the feature a name.');return}listEdit(u,'cfeat',L=>[...L,{id:uidNew(),name,text:val('cfT_'+u).trim()}])},
  cfeatDel(b,ev){ev.preventDefault();listEdit(b.dataset.u,'cfeat',L=>L.filter(x=>x.id!==b.dataset.k))},
  money(b){const u=b.dataset.u;const c=SH.chars[u];const n=Math.abs(num('moN_'+u));if(!n){toast('Type an amount first.');return}const s=+b.dataset.s;const now=Math.max(0,moneyOf(c)+s*n);saveChar(u,is5(c)?{gp:Math.round(now*100)/100}:{berries:Math.round(now)});
    addLog({by:SH.me,who:who(u),kind:'note',label:`${who(u)} ${s>0?'gets':'spends'} ${n.toLocaleString('en-US')} ${moneyName(c)}.`,total:''});const e=document.getElementById('moN_'+u);if(e)e.value=''},
  itQ(b){const u=b.dataset.u;listEdit(u,'inv',L=>{const i=+b.dataset.i;L[i]={...L[i],qty:Math.max(0,L[i].qty+(+b.dataset.d))};return L.filter(x=>x.qty>0)})},
  itDel(b){if(!tapTwice(b,'✕?'))return;listEdit(b.dataset.u,'inv',L=>L.filter((x,i)=>i!==+b.dataset.i))},
  itAdd(b){const u=b.dataset.u;const name=val('itN_'+u).trim();if(!name)return;const qty=Math.max(1,Math.round(num('itQ_'+u))||1);listEdit(u,'inv',L=>{const ex=L.find(x=>x.name.toLowerCase()===name.toLowerCase());if(ex){ex.qty+=qty;return L}return[...L,{name,qty,note:val('itT_'+u).trim()}]})},
  die(b){const n=+b.dataset.k;const secret=!!b.dataset.secret;if(n===20)rollD20('d20',0,'',{secret,name:secret?'DM':undefined});else rollDmg('d'+n,'1d'+n,{secret,kind:'dmg',name:secret?'DM':undefined})},
  expr(b){const secret=!!b.dataset.secret;const x=val(secret?'sxExpr':'fxExpr').trim();if(x)rollDmg(x,x,{secret,name:secret?'DM':undefined})},
  print(){SH.printAll=true;render(true);qa('.feats details').forEach(d=>d.open=true);window.print();SH.printAll=false;render(true)},
  retire(b){if(!tapTwice(b,'Tap again: delete this character for good'))return;const u=b.dataset.u;addLog({by:SH.me,who:who(u),kind:'note',label:`${who(u)} leaves the table.`,total:''});del('chars/'+u);SH.open=null;render(true)},
  editOpen(b){openBuilder(b.dataset.u)},luOpen(b){SH.lu={uid:b.dataset.u,mode:'two',exp:[]};render(true);window.scrollTo(0,0)},
  // --- roll requests and turns, player side ---
  reqInit(){const c=myChar();const D=DV(c);rollD20('Initiative',D.init,partsText(D.initParts||[]),{init:SH.state.init.req})},
  reqRoll(){const r=SH.state.req;const c=myChar();const D=DV(c);let bonus=0,parts='';if(r.kind==='skill'){const s=D.skills[r.key];bonus=s.bonus;parts=partsText(s.parts)}else if(r.kind==='save'){const s=D.saves[r.key];bonus=s.bonus;parts=partsText(s.parts)}else if(r.kind==='abil'){bonus=mod(D.ab[r.key]);parts=fmt(bonus)+' '+r.key}
    const adv=r.adv?Math.max(-1,Math.min(1,(r.adv||0)+SH.adv)):undefined;rollD20(r.label,bonus,parts,{req:r.id,...(adv!==undefined?{adv}:{})})},
  endTurn(){const ini=SH.state.init;addLog({by:SH.me,who:who(SH.me),kind:'note',label:`${who(SH.me)} ends their turn.`,total:'',endTurn:`${ini.id}:${ini.round}:${ini.turn}`})},
  // --- builder / level up ---
  bCancel(){SH.edit=null;render(true)},bSave(){builderSave()},
  bChip(b){const E=SH.edit;const f=b.dataset.f;const L=(E.b[f]||[]).slice();const v=b.dataset.v;const i=L.indexOf(v);if(i>=0)L.splice(i,1);else{if(L.length>=+b.dataset.max){toast(`You can pick ${b.dataset.max} here. Tap one to remove it first.`);return}L.push(v)}E.b[f]=L;
    if(f==='classSkills')E.b.bgSkills=(E.b.bgSkills||[]).filter(s=>!L.includes(s));render(true)},
  bRoll(){const b=SH.edit.b;if(b.rolled&&!SH.owner)return;const rolls=Array.from({length:6},()=>{const r=[d(6),d(6),d(6),d(6)].sort((x,y)=>x-y);return r[1]+r[2]+r[3]}).sort((x,y)=>y-x);b.pool=rolls;b.rolled=true;ABS.forEach((a,i)=>b.poolIdx[a]=i);applyPool(b);
    addLog({by:SH.me,who:b.name||'A new character',kind:'note',label:`🎲 ${b.name||'A new character'} rolls ability scores: ${rolls.join(', ')}`,total:''});render(true)},
  luCancel(){SH.lu=null;render(true)},luSave(){luSave()},
  luRoll(){const U=SH.lu;if(U.hpHow==='roll')return;const c=SH.chars[U.uid];const I=luInfo(c);U.hp=d(I.hd);U.hpHow='roll';addLog({by:SH.me,who:c.build.name,kind:'note',label:`🎲 ${c.build.name} rolls a d${I.hd} for hit points: ${U.hp}`,total:''});render(true)},
  luAvg(){const U=SH.lu;if(U.hpHow==='roll')return;const I=luInfo(SH.chars[U.uid]);U.hp=I.hd/2+1;U.hpHow='avg';render(true)},
  luExp(b){const U=SH.lu;const L=(U.exp||[]).slice();const v=b.dataset.v;const i=L.indexOf(v);if(i>=0)L.splice(i,1);else{if(L.length>=+b.dataset.max)return;L.push(v)}U.exp=L;render(true)},
  // --- DM ---
  openSheet(b){SH.open=b.dataset.u;SH.tab='main';render(true);window.scrollTo(0,0)},closeSheet(){SH.open=null;render(true)},
  allRest(b){const k=b.dataset.k;if(!tapTwice(b,`Tap again: ${k} rest for everyone`))return;for(const [u,c] of Object.entries(SH.chars))if(charOK(c))restFor(u,k);addLog({by:SH.me,who:'DM',kind:'note',label:`🛌 The party takes a ${k} rest.`,total:''})},
  allLevel(b){if(!tapTwice(b,'Tap again: everyone may level up'))return;for(const [u,c] of Object.entries(SH.chars))if(charOK(c))saveChar(u,{lvlOk:c.build.level+1});addLog({by:SH.me,who:'DM',kind:'note',label:'⬆ The DM grants everyone a level!',total:''})},
  grant(b){const u=b.dataset.u;const c=SH.chars[u];saveChar(u,{lvlOk:c.build.level+1});addLog({by:SH.me,who:'DM',kind:'note',label:`⬆ ${c.build.name} may level up!`,total:''})},
  give(b){const u=b.dataset.u;const name=val('giN_'+u).trim();if(!name)return;const qty=Math.max(1,Math.round(num('giQ_'+u))||1);listEdit(u,'inv',L=>{const ex=L.find(x=>x.name.toLowerCase()===name.toLowerCase());if(ex){ex.qty+=qty;return L}return[...L,{name,qty}]});addLog({by:SH.me,who:'DM',kind:'note',label:`🎁 ${who(u)} receives ${qty>1?qty+' × ':''}${name}.`,total:''})},
  kick(b){if(!tapTwice(b,'Tap again: delete this character'))return;del('chars/'+b.dataset.u);render(true)},
  rqWho(b){b.classList.toggle('on')},
  reqAsk(){const kind=val('rqK');const key=val('rqKey').trim();if(!key){toast('Say what they should roll.');return}const who2=qa('[data-a=rqWho].on').map(x=>x.dataset.u);const all=qa('[data-a=rqWho]').length;if(!who2.length){toast('Pick at least one player.');return}
    const id=uidNew();const dc=Math.round(num('rqDC'));if(dc>0)put('dm/req',{id,dc});setState({req:{id,kind,key,label:reqLabelOf(kind,key),adv:+val('rqAdv')||0,for:who2.length===all?'all':who2,t:Date.now()}})},
  reqClose(){setState({req:null})},
  reqFor(b){const u=b.dataset.u;const r=SH.state.req;const D=DV(SH.chars[u]);let bonus=0;if(r.kind==='skill')bonus=D.skills[r.key].bonus;else if(r.kind==='save')bonus=D.saves[r.key].bonus;else if(r.kind==='abil')bonus=mod(D.ab[r.key]);
    const a=d(20);addLog({by:u,who:who(u),label:r.label+' (rolled by the DM)',detail:`d20 ${a} ${fmt(bonus)}`,total:a+bonus,nat:a,kind:'d20',req:r.id})},
  secD20(){const label=val('sxLabel').trim()||'Secret d20';const bonus=Math.round(num('sxBonus'));rollD20(label,bonus,bonus?fmt(bonus):'',{secret:true,name:'DM'})},
  fightStart(){const id=uidNew();put('dm/enc',{mons:{}});setState({init:{on:true,id,t:Date.now(),req:id,started:false,round:1,turn:0,order:[]},req:null});addLog({by:SH.me,who:'DM',kind:'note',label:'⚔ A fight begins! Roll for initiative.',total:''})},
  fightGo(){setInit({started:true,turn:0,round:1});const o=(initOf().order||[])[0];if(o)addLog({by:SH.me,who:'DM',kind:'note',label:`▶ Round 1. ${o.pc||!o.hide?o.name:'An enemy'} goes first.`,total:''})},
  fightEnd(b){if(!tapTwice(b,'Tap again: end the fight'))return;setState({init:{on:false}});put('dm/enc',{mons:{}});addLog({by:SH.me,who:'DM',kind:'note',label:'The fight is over.',total:''})},
  turnNext(){turnStep(1)},turnPrev(){turnStep(-1)},
  initForAll(){const ini=initOf();const order=[...(ini.order||[])];for(const [u,c] of Object.entries(SH.chars)){if(!charOK(c)||order.some(o=>o.pc===u))continue;const D=DV(c);const r=d(20);order.push({id:'pc_'+u,name:c.build.name,v:r+D.init,pc:u,t:Date.now()})}order.sort((a,b)=>b.v-a.v);setInit({order})},
  monAdd(){const name=val('mN').trim()||'Enemy';const n=Math.max(1,Math.min(12,Math.round(num('mC'))||1));const hp=Math.max(1,Math.round(num('mHP'))||10);const ac=Math.round(num('mAC'))||null;const ib=Math.round(num('mI'))||0;const hide=!!(q('#mHide')&&q('#mHide').checked);
    const ini=initOf();const order=[...(ini.order||[])];const cur=ini.started&&order[ini.turn]?order[ini.turn].id:null;const mons={...((SH.dm.enc||{}).mons||{})};const have=order.filter(o=>!o.pc&&o.name.replace(/ \d+$/,'')===name).length;
    for(let i=0;i<n;i++){const id='m_'+uidNew();const nm=n>1||have?`${name} ${have+i+1}`:name;mons[id]={name:nm,hp,max:hp,ac};order.push({id,name:nm,v:d(20)+ib,hide})}
    order.sort((a,b)=>b.v-a.v);put('dm/enc',{mons});setInit({order,turn:cur?Math.max(0,order.findIndex(o=>o.id===cur)):0})},
  oHp(b){const id=b.dataset.k;const n=Math.abs(Math.round(num('oN_'+id)));if(!n){toast('Type an amount first.');return}const s=+b.dataset.s;const o=(initOf().order||[]).find(x=>x.id===id);if(!o)return;
    if(o.pc){hpChange(o.pc,n*s)}else{const mons={...((SH.dm.enc||{}).mons||{})};const m=mons[id];if(!m)return;mons[id]={...m,hp:Math.max(0,Math.min(m.max,m.hp+n*s))};put('dm/enc',{mons});if(mons[id].hp<=0)addLog({by:SH.me,who:'DM',kind:'note',label:`💀 ${o.hide?'An enemy':o.name} goes down.`,total:''})}
    const e=document.getElementById('oN_'+id);if(e)e.value=''},
  oHide(b){const ini=initOf();setInit({order:(ini.order||[]).map(o=>o.id===b.dataset.k?{...o,hide:!o.hide}:o)})},
  oDel(b){const ini=initOf();const order=(ini.order||[]).filter(o=>o.id!==b.dataset.k);const cur=(ini.order||[])[ini.turn];let turn=cur?order.findIndex(o=>o.id===cur.id):0;if(turn<0)turn=Math.min(ini.turn,Math.max(0,order.length-1));setInit({order,turn})},
  sessStart(b){if(SH.dm.session&&!tapTwice(b,'Tap again: start a new session'))return;const chars={};for(const [u,c] of Object.entries(SH.chars))if(charOK(c))chars[u]={lvl:c.build.level,hp:c.hp,money:moneyOf(c),inv:Object.fromEntries((c.inv||[]).map(i=>[i.name,i.qty]))};put('dm/session',{t:Date.now(),chars});addLog({by:SH.me,who:'DM',kind:'note',label:'📖 The session begins.',total:''})},
  async copyLink(b){try{await navigator.clipboard.writeText(b.dataset.k);b.textContent='Copied!'}catch(e){const i=b.parentElement.querySelector('input');if(i){i.select();toast('Copy the selected link.')}}}
};
const CHG={
  condAdd(e){const u=e.dataset.u;if(!e.value)return;saveChar(u,{cond:{...(SH.chars[u].cond||{}),[e.value]:true}})},
  hakiAdd(e){const u=e.dataset.u;if(!e.value)return;saveChar(u,{haki:[...(SH.chars[u].haki||[]),e.value]})},
  fruit(e){const u=e.dataset.u;const c=SH.chars[u];const v=e.value.trim();saveChar(u,{fruit:v,build:{...c.build,fruitAte:!!v}})},
  notes(e){saveChar(e.dataset.u,{notes:e.value})},
  ovr(e){const u=e.dataset.u;const ov={...(SH.chars[u].ovr||{})};if(e.value==='')delete ov[e.dataset.k];else ov[e.dataset.k]=+e.value;saveChar(u,{ovr:ov})},
  bText(e){SH.edit.b[e.dataset.f]=e.value},
  bSel(e){const b=SH.edit.b;b[e.dataset.f]=e.value||null;if(e.dataset.f==='sub'){b.asiPicks=[];b.speciesPick=null;if(b.rules!=='5e'&&!weaponsFor(b).includes(b.weapon))b.weapon=weaponsFor(b)[0]}},
  bSpecies(e){const b=SH.edit.b;b.species=e.value;b.asiPicks=[];b.speciesPick=null;if(b.rules!=='5e'){const sp=SPECIES[b.species];b.sub=sp.subs?Object.keys(sp.subs)[0]:null;if(!weaponsFor(b).includes(b.weapon))b.weapon=weaponsFor(b)[0]}},
  bClass(e){const b=SH.edit.b;b.cls=e.value;if(b.rules==='5e')r5ClassDefaults(b);else opClassDefaults(b)},
  bFlex(e){const b=SH.edit.b;b.flex=e.checked;b.asiPicks=[]},bShield(e){SH.edit.b.shield=e.checked},
  bAsi(e){const b=SH.edit.b;b.asiPicks=(b.asiPicks||[]).slice();b.asiPicks[+e.dataset.i]=e.value||null},
  bMethod(e){const b=SH.edit.b;b.method=e.value;if(b.method==='array'){b.pool=STD_ARRAY.slice();b.poolIdx=b.poolIdx||{};ABS.forEach((a,i)=>b.poolIdx[a]=i);applyPool(b)}else if(b.method==='roll'){if(!b.rolled){b.pool=[10,10,10,10,10,10];b.poolIdx=b.poolIdx||{};ABS.forEach((a,i)=>b.poolIdx[a]=i);applyPool(b)}}},
  bPool(e){const b=SH.edit.b;const a=e.dataset.k;const j=+e.value;const other=ABS.find(x=>b.poolIdx[x]===j);if(other)b.poolIdx[other]=b.poolIdx[a];b.poolIdx[a]=j;applyPool(b)},
  bScore(e){SH.edit.b.scores[e.dataset.k]=Math.max(1,Math.min(30,Math.round(+e.value)||10))},
  bLevel(e){const b=SH.edit.b;b.level=Math.max(1,Math.min(b.rules==='5e'?20:10,Math.round(+e.value)||1))},
  luText(e){SH.lu[e.dataset.f]=e.value},
  rqKind(e){SH.rqKind=e.value;const w=q('#rqWhat');if(w)w.innerHTML=rqWhatHTML(e.value);return'norender'},
  stName(e){setState({name:e.value.trim()})},stRules(e){setState({rules:e.value})},stStart(e){setState({startLevel:Math.max(1,Math.min(20,Math.round(+e.value)||1))})},
  stFlag(e){setState({[e.dataset.k]:e.checked})},
  dmNotes(e){put('dm/notes',{text:e.value})},
  initV(e){const ini=initOf();const order=(ini.order||[]).map(o=>o.id===e.dataset.k?{...o,v:Math.round(+e.value)||0}:o);const cur=(ini.order||[])[ini.turn];order.sort((a,b)=>b.v-a.v);setInit({order,turn:cur&&ini.started?Math.max(0,order.findIndex(o=>o.id===cur.id)):0})}
};
Object.assign(ACT,{bPickSp(b){CHG.bSpecies({value:b.dataset.k});render(true)},bPickSub(b){CHG.bSel({value:b.dataset.k,dataset:{f:'sub'}});render(true)},bPickCls(b){CHG.bClass({value:b.dataset.k});render(true)}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(!b||b.disabled)return;const f=ACT[b.dataset.a];if(!f)return;try{f(b,ev)}catch(e){console.error(e);toast('Something went wrong: '+e.message)}});
document.addEventListener('change',ev=>{const e=ev.target.closest('[data-c]');if(!e)return;const f=CHG[e.dataset.c];if(!f)return;let r;try{r=f(e)}catch(x){console.error(x);toast('Something went wrong: '+x.message)}
  if(r!=='norender'&&/^(SELECT)$/.test(e.tagName)||e.type==='checkbox'){setTimeout(()=>render(true),0)}else dirty=true});
// the host also listens for "end my turn"
{const _ht=hostTick;hostTick=function(){_ht();try{if(!SH.owner)return;const ini=SH.state.init;if(!ini||!ini.on||!ini.started)return;const key=`${ini.id}:${ini.round}:${ini.turn}`;const cur=(ini.order||[])[ini.turn];if(!cur||!cur.pc)return;
  if(SH.log.some(e=>e.endTurn===key&&e.by===cur.pc)&&hostTick.done!==key){hostTick.done=key;turnStep(1)}}catch(e){console.warn(e)}}}
window.addEventListener('resize',()=>{clearTimeout(window._rz);window._rz=setTimeout(()=>render(),200)});
setInterval(()=>{const n=q('.net');if(n&&!typing()){const h=netHTML();if(n.outerHTML!==h)render()}},3000);
boot();
