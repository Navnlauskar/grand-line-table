// ================= Sheet Table: character sheets and dice for a table with a human DM =================
// The DM (the host) tells the story by voice. This app only keeps the sheets, the dice, the shared roll log and a
// light initiative list. Two rulesets: One Piece (Dungeons & Devil Fruits) and plain D&D 5e.
// Rules are permissive: the DM decides, the sheet records.
const SH={state:{},chars:{},log:[],dm:{},me:null,owner:false,solo:false,db:null,room:null,
  tab:'main',dmTab:'party',asDM:true,adv:0,open:null,edit:null,lu:null,ready:false,peers:[],seenLog:0};
const CONDS=['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious','Concentrating'];
const q=(s,el)=>(el||document).querySelector(s);
const qa=(s,el)=>[...(el||document).querySelectorAll(s)];
const uidNew=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const clone=v=>JSON.parse(JSON.stringify(v));
const RULES=()=>SH.state.rules||'op';
const is5=c=>(c&&c.build&&c.build.rules==='5e');
const moneyName=c=>is5(c)?'gp':'Berries';
const moneyOf=c=>is5(c)?(+c.gp||0):(+c.berries||0);
const moneyTxt=c=>is5(c)?(Math.round(moneyOf(c)*100)/100).toLocaleString('en-US')+' gp':'฿'+moneyOf(c).toLocaleString('en-US');
function toast(t,ms){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),ms||2800)}
// "tap twice" instead of a confirm box (those are blocked inside Claude)
function tapTwice(b,ask){const now=Date.now();if(b.dataset.armed&&now-(+b.dataset.armed)<4000){delete b.dataset.armed;b.classList.remove('armed');if(b.dataset.orig)b.innerHTML=b.dataset.orig;return true}
  b.dataset.armed=String(now);if(!b.dataset.orig)b.dataset.orig=b.innerHTML;b.innerHTML=ask||'Tap again to confirm';b.classList.add('armed');
  setTimeout(()=>{if(b.dataset.armed){delete b.dataset.armed;b.classList.remove('armed');b.innerHTML=b.dataset.orig}},4000);return false}

// ---------------- sync ----------------
const LSKEY='sheettable-local-v1';
function lsave(){if(!SH.solo)return;try{localStorage.setItem(LSKEY,JSON.stringify({state:SH.state,chars:SH.chars,log:SH.log,dm:SH.dm}))}catch(e){}}
function lload(){try{const v=JSON.parse(localStorage.getItem(LSKEY)||'null');if(v)Object.assign(SH,v)}catch(e){}}
const writing={};
async function put(path,data){const [c,id]=path.split('/');data=clone(data);
  if(c==='table')SH.state=data;else if(c==='chars')SH.chars[id]=data;else if(c==='dm')SH.dm[id]=data;
  if(SH.solo){lsave();render();return}
  if(writing[path]){writing[path].next=data;return}
  writing[path]={next:null};let body=data;
  while(body){try{await SH.db.doc(path).set(body)}catch(e){toast('Could not save ('+(e.code||e.message||'error')+'). Check your connection.')}body=writing[path].next;writing[path].next=null}
  delete writing[path]}
async function del(path){const [c,id]=path.split('/');if(c==='chars')delete SH.chars[id];if(c==='dm')delete SH.dm[id];if(SH.solo){lsave();render();return}try{await SH.db.doc(path).delete()}catch(e){toast('Could not delete.')}}
async function addLog(e){e.t=Date.now();if(SH.solo){SH.log.unshift({id:'l'+e.t+Math.random(),...e});SH.log=SH.log.slice(0,150);lsave();onLog([SH.log[0]]);render();return}
  try{await SH.db.collection('log').add(e)}catch(x){toast('Roll not shared ('+(x.code||'offline')+').')}}
const setState=patch=>put('table/state',{...SH.state,...patch});
const saveChar=(uid,patch)=>{const c=SH.chars[uid];if(!c)return;return put('chars/'+uid,{...c,...patch})};
const myChar=()=>SH.chars[SH.me]||null;
const isDM=()=>SH.owner&&(SH.asDM||!SH.solo&&!myChar());
async function boot(){
  let db=null,user=null;
  try{db=await claude.use('db')}catch(e){db=null}
  try{user=await claude.use('user')}catch(e){user=null}
  if(!db){SH.solo=true;SH.owner=true;SH.me='local-me';lload();SH.ready=true;render();return}
  SH.db=db;SH.owner=user?await user.isOwner():false;SH.me=user?await user.id():'anon';SH.asDM=SH.owner;
  const err=e=>console.warn('sync',e);
  db.doc('table/state').onSnapshot(s=>{SH.state=s.exists?s.data():{};SH.ready=true;hostTick();render()},err);
  db.collection('chars').onSnapshot(s=>{const o={};s.docs.forEach(x=>o[x.id]=x.data());SH.chars=o;render()},err);
  db.collection('log').orderBy('t','desc').limit(120).onSnapshot(s=>{const fresh=s.docChanges().filter(c=>c.type==='added').map(c=>({id:c.doc.id,...c.doc.data()}));SH.log=s.docs.map(x=>({id:x.id,...x.data()}));onLog(fresh);render()},err);
  if(SH.owner)db.collection('dm').onSnapshot(s=>{const o={};s.docs.forEach(x=>o[x.id]=x.data());SH.dm=o;render()},err);
  try{SH.room=await claude.use('room')}catch(e){SH.room=null}
  if(SH.room){const pres=()=>{try{SH.peers=SH.room.peers()||[]}catch(e){SH.peers=[]}render()};SH.room.onPeers(pres);pres();announce()}
  render()}
function announce(){if(!SH.room)return;const c=myChar();SH.room.presence({who:c?c.build.name:(SH.owner?'DM':'Player'),...(SH.owner?{host:true}:{})}).catch(()=>{})}
const online=uid=>SH.solo||uid===SH.me||SH.peers.some(p=>p.id===uid);

// ---------------- the normalised sheet numbers for both rulesets ----------------
function DV(c){const b=c.build;let D;
  if(b.rules==='5e')D=derive5(b);
  else{const o=derive(b);const cl=CLASSES[b.cls]||{};D={...o,hd:cl.hd||8,nAtk:o.attacks,
      attacks:[{name:o.weapon.name,atk:o.atk,atkParts:o.atkParts,dmg:`${o.n}d${o.die}${o.dmgMod?fmt(o.dmgMod):''}`,note:[...new Set([o.dieNote,o.weapon.note,o.ranged?`range ${o.range[0]*5}/${o.range[1]*5} ft`:`reach ${o.reach*5} ft`].filter(Boolean))].join(' · ')}],
      spell:o.spellDC?{ab:cl.ab,dc:o.spellDC,atk:o.spellAtk,slots:[],pact:null,prep:0}:null}}
  D.res={...D.res};for(const r of (c.cres||[]))D.res['c_'+r.id]={name:r.name,max:Math.max(1,+r.max||1),rest:r.rest||'long',custom:r.id};
  const ov=c.ovr||{};D.auto={maxhp:D.maxhp,ac:D.ac,speed:D.speed,init:D.init};
  for(const k of ['maxhp','ac','speed','init'])if(ov[k]!==undefined&&ov[k]!==''&&ov[k]!==null&&!isNaN(+ov[k]))D[k]=+ov[k];
  D.passive=10+D.skills.Perception.bonus;return D}
const charOK=c=>!!(c&&c.build&&c.build.name);
function newCharDoc(b){const c={build:b,hp:1,temp:0,res:{},cond:{},death:{s:0,f:0},inv:[],notes:'',spells:[],catk:[],cfeat:[],cres:[],ovr:{},t:Date.now()};
  if(b.rules==='5e'){c.gp=10;c.inv=[...(b.weps||[]).filter(k=>k!=='unarmed').map(k=>({name:R5.weapons[k][0],qty:1})),...(b.armor&&b.armor!=='none'?[{name:R5.armor[b.armor].name,qty:1}]:[]),...(b.shield?[{name:'Shield',qty:1}]:[]),{name:'Backpack',qty:1},{name:'Rations (days)',qty:5},{name:'Rope (50 ft)',qty:1},{name:'Torch',qty:5}]}
  else{c.berries=100000;c.inv=startingGear(b).map(g=>({name:g.name,qty:g.qty}))}
  c.hp=DV(c).maxhp;return c}

// ---------------- dice ----------------
function parseDice(expr){const out=[];let s=String(expr||'').replace(/\s+/g,'').toLowerCase();if(!s)return null;if(!/^[+-]/.test(s))s='+'+s;
  const re=/([+-])(\d*)d(\d+)|([+-])(\d+)/g;let m,used=0;while((m=re.exec(s))){used+=m[0].length;if(m[3])out.push({sign:m[1]==='-'?-1:1,n:Math.min(40,+(m[2]||1)),die:Math.min(1000,+m[3])});else out.push({sign:m[4]==='-'?-1:1,flat:+m[5]})}
  return used===s.length&&out.length?out:null}
function rollExprNow(expr,crit){const terms=parseDice(expr);if(!terms)return null;let total=0;const bits=[];
  for(const t of terms){if(t.flat!==undefined){total+=t.sign*t.flat;bits.push((t.sign<0?'−':'+')+t.flat)}
    else{const n=crit?t.n*2:t.n;const rs=Array.from({length:n},()=>d(t.die));total+=t.sign*sum(rs);bits.push(`${t.sign<0?'−':'+'}${n}d${t.die} (${rs.join(', ')})`)}}
  return{total:Math.max(0,total),detail:bits.join(' ').replace(/^\+/,'')}}
function who(uid){const c=SH.chars[uid];return c&&c.build?c.build.name:(uid===SH.me&&SH.owner?'DM':'Someone')}
// a d20 roll with the Adv/Dis switch; opts: {uid, follow, req, secret, kind}
async function rollD20(label,bonus,partsTxt,opts){opts=opts||{};const adv=opts.adv!==undefined?opts.adv:SH.adv;const a=d(20),b2=d(20);const nat=adv>0?Math.max(a,b2):adv<0?Math.min(a,b2):a;const total=nat+bonus;
  const detail=`d20 ${adv?`${adv>0?'adv':'dis'} (${a}, ${b2}) → `:''}${nat} ${partsTxt?'· '+partsTxt:(bonus?fmt(bonus):'')}`.trim();
  const e={by:SH.me,who:opts.name||who(opts.uid||SH.me),label,detail,total,nat,kind:opts.kind||'d20',...(adv?{adv}:{}),...(opts.req?{req:opts.req}:{}),...(opts.init?{init:opts.init}:{})};
  {const g=againN(e);if(g)e.again=g}SH.adv=0;showRoll(e,opts.follow);if(opts.secret){await secretLog(e)}else await addLog(e);return e}
async function rollDmg(label,expr,opts){opts=opts||{};const r=rollExprNow(expr,opts.crit);if(!r){toast('Cannot roll "'+expr+'". Write dice like 2d6+3.');return null}
  const e={by:SH.me,who:opts.name||who(opts.uid||SH.me),label:label+(opts.crit?' (critical)':''),detail:r.detail,total:r.total,kind:opts.kind||'dmg'};
  {const g=againN(e);if(g)e.again=g}showRoll(e);if(opts.secret)await secretLog(e);else await addLog(e);return e}
function againN(e){SH.rec=SH.rec||{};const k=e.by+'|'+e.who+'|'+e.label;const r=SH.rec[k];const now=Date.now();const n=r&&now-r.t<180000?r.n+1:1;SH.rec[k]={n,t:now};return n>1?n:0}
async function secretLog(e){const doc=SH.dm.rolls||{items:[]};await put('dm/rolls',{items:[{...e,t:Date.now()},...(doc.items||[])].slice(0,60)})}
let rollT=0;
function showRoll(e,follow){let el=q('#rollCard');if(!el){el=document.createElement('div');el.id='rollCard';document.body.appendChild(el)}
  const crit=e.kind!=='dmg'&&e.nat===20,fum=e.kind!=='dmg'&&e.nat===1;
  el.className='show'+(crit?' crit':fum?' fumble':'');
  el.innerHTML=`<div class="rc-l">${esc(e.who)} · ${esc(e.label)}</div><div class="rc-t">${e.total}</div><div class="rc-d">${esc(e.detail)}${crit?' · <b>NAT 20</b>':fum?' · <b>NAT 1</b>':''}</div>
    ${follow?`<div class="rc-f">${follow.map((f,i)=>`<button type="button" class="btn sm" data-rcf="${i}">${esc(f.t)}</button>`).join('')}</div>`:''}<button type="button" class="rc-x" aria-label="Close">✕</button>`;
  qa('[data-rcf]',el).forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;follow[+b.dataset.rcf].run(crit)});q('.rc-x',el).onclick=()=>{el.className=''};
  clearTimeout(rollT);rollT=setTimeout(()=>{el.className=''},follow?9000:4500)}
// other people's rolls pop up as a small line
function onLog(fresh){const boot=!SH.seenLog;const newest=fresh.reduce((m,e)=>Math.max(m,e.t||0),0);
  if(!boot)for(const e of fresh){if(e.by===SH.me||(e.t||0)<=SH.seenLog)continue;if(e.quiet)continue;if(e.kind==='note')toast(e.label,e.read?9000:3500);else toast(`${e.who}: ${e.label} → ${e.total}${e.nat===20?' (nat 20!)':e.nat===1?' (nat 1)':''}`,3500)}
  SH.seenLog=Math.max(SH.seenLog||1,newest);hostTick()}

// ---------------- sheet actions (uid = whose sheet: your own, or any sheet if you are the DM) ----------------
const canEdit=uid=>uid===SH.me||SH.owner;
function hpChange(uid,delta,note){const c=SH.chars[uid];if(!c)return;const D=DV(c);let hp=c.hp,temp=c.temp||0;
  const patch={};let extra='';
  if(delta<0){let dmg=-delta;const t=Math.min(temp,dmg);temp-=t;dmg-=t;
    if(c.hp<=0&&dmg>0&&!c.dead){const dt={...(c.death||{s:0,f:0})};dt.f=Math.min(3,dt.f+1);patch.death=dt;patch.stable=false;if(dt.f>=3)patch.dead=true;extra=dt.f>=3?' · DEAD':' · a failed death save'}
    else if(dmg-hp>=D.maxhp&&hp>0){patch.dead=true;extra=' · killed outright (massive damage)'}
    hp=Math.max(0,hp-dmg)}else hp=Math.min(D.maxhp,hp+delta);
  Object.assign(patch,{hp,temp});if(hp>0&&c.hp<=0){patch.death={s:0,f:0};patch.stable=false;patch.dead=false}
  saveChar(uid,patch);addLog({by:SH.me,who:who(uid),kind:'note',label:`${who(uid)} ${delta<0?'takes '+(-delta)+' damage':'heals '+delta}${note?' ('+note+')':''}: ${hp}/${D.maxhp} HP${hp<=0&&!extra?' · DOWN':''}${extra}`,total:'',quiet:hp>0})}
function restFor(uid,kind){const c=SH.chars[uid];if(!c)return;const D=DV(c);const res={...(c.res||{})};
  for(const [k,r] of Object.entries(D.res)){const rest=String(r.rest||'');if(kind==='long'||rest.startsWith('short')||rest==='turn')delete res[k]}
  if(kind==='long'){for(const k of Object.keys(res))if(/^slot\d|^pact$|^fruit$|^hk_/.test(k))delete res[k];
    const used=res.hd||0;if(is5(c))res.hd=Math.max(0,used-Math.max(1,Math.floor(D.lvl/2)));else delete res.hd;
    saveChar(uid,{hp:D.maxhp,temp:0,res,death:{s:0,f:0},stable:false,exh:Math.max(0,(c.exh||0)-1)})}
  else{if(D.spell&&D.spell.pact)delete res.pact;saveChar(uid,{res})}}
function spendHD(uid){const c=SH.chars[uid];const D=DV(c);const used=(c.res||{}).hd||0;if(used>=D.lvl){toast('No hit dice left.');return}
  const r=d(D.hd);const heal=Math.max(1,r+mod(D.ab.CON));const hp=Math.min(D.maxhp,c.hp+heal);saveChar(uid,{hp,res:{...(c.res||{}),hd:used+1}});
  const e={by:SH.me,who:who(uid),label:'Hit die',detail:`d${D.hd} (${r}) ${fmt(mod(D.ab.CON))} CON`,total:heal,kind:'dmg'};showRoll(e);addLog(e)}
async function deathSave(uid){const c=SH.chars[uid];const e=await rollD20('Death save',0,'',{uid,adv:0});const dt={...(c.death||{s:0,f:0})};let patch={};
  if(e.nat===20)patch={hp:1,death:{s:0,f:0},stable:false};else{if(e.nat===1)dt.f+=2;else if(e.nat>=10)dt.s+=1;else dt.f+=1;patch={death:dt};if(dt.f>=3)patch.dead=true;else if(dt.s>=3){patch.stable=true;patch.death={s:0,f:0}}}
  saveChar(uid,patch)}

// ---------------- the host keeps the table: initiative rolls land in the order, the session snapshot ----------------
function hostTick(){if(!SH.owner||!SH.ready)return;const st=SH.state;const ini=st.init;
  if(ini&&ini.on&&ini.req){let ch=false;const order=[...(ini.order||[])];
    for(const e of SH.log){if(e.init!==ini.req)continue;const uid=e.by;if(!SH.chars[uid])continue;const have=order.find(o=>o.pc===uid);if(have){if(have.t>=e.t)continue;have.v=e.total;have.t=e.t;ch=true}else{order.push({id:'pc_'+uid,name:SH.chars[uid].build.name,v:e.total,pc:uid,t:e.t});ch=true}}
    if(ch){const cur=order[ini.turn]&&ini.started?order[ini.turn].id:null;order.sort((a,b)=>b.v-a.v);put('table/state',{...st,init:{...ini,order,turn:cur?Math.max(0,order.findIndex(o=>o.id===cur)):0}})}}}
