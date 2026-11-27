// ================= turns in a fight: Action / Bonus action / Reaction, targeted attacks checked by the DM's device =================
// A player attacks on their own turn and picks a target. The DM's device (the host, which knows the enemy's AC) says hit or miss.
// Only a hit unlocks the damage roll, and that damage is taken off the enemy automatically.
// Outside fights rolls are free; a roll repeated within 3 minutes is marked "2nd try" in the log.
function fightCtx(u){const ini=initOf();if(!ini.on||!ini.started)return null;const order=ini.order||[];if(!order.some(o=>o.pc===u))return null;const cur=order[ini.turn];return{mine:!!(cur&&cur.pc===u),key:`${ini.id}:${ini.round||1}:${ini.turn}`}}
function turnSt(u,key){SH.ta=SH.ta||{};let s=SH.ta[u];if(!s||s.key!==key)s=SH.ta[u]={key,n:0,act:0,bonus:0,react:0,hits:[]};return s}
const dmFor=u=>SH.owner&&u!==SH.me;
function foeList(){const ini=initOf();let k=0;return(ini.order||[]).filter(o=>!o.pc).map(o=>({id:o.id,name:o.hide?'Enemy '+(++k):o.name,down:!!o.down}))}
function nAtkOf(u){return DV(SH.chars[u]).nAtk||1}

function doAttack(u,a,tg,ak,o){o=o||{};const ctx=fightCtx(u);let tag='',st=null;
  let off=false;if(ctx&&ctx.mine&&!o.spell){st=turnSt(u,ctx.key);if(isLoading(u,a))st.loaded=[...(st.loaded||[]),a.name];const lim=nAtkOf(u);st.n++;if(st.n<=lim){st.act=1;if(lim>1)tag=` (${st.n} of ${lim})`}else{st.bonus=1;st.offDone=1;off=true;tag=' (off-hand, bonus action)'}}
  if(tg){const aid=uidNew();SH.myAtk=SH.myAtk||{};SH.myAtk[aid]={u,k:ak,key:ctx?ctx.key:'',off};
    rollD20(`${a.name} ${o.spell&&!o.bonus?'spell ':''}attack${tag} → ${tg.name}`,a.atk,a.atkParts?partsText(a.atkParts):fmt(a.atk),{uid:u,tgt:tg.id,tname:tg.name,aid});SH.checking=Date.now()}
  else rollD20(a.name+' attack'+tag,a.atk,a.atkParts?partsText(a.atkParts):fmt(a.atk),{uid:u,follow:a.dmg?[{t:'Damage '+a.dmg,run:crit=>{rollDmg(a.name+' damage',a.dmg,{uid:u,crit});render(true)}}]:null});
  SH.pt=null;render(true)}
ACT.atk=function(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(!a)return;const ctx=dmFor(u)?null:fightCtx(u);
  const ak=b.dataset.k;if(!ctx){doAttack(u,a,null,ak);return}
  if(!ctx.mine){toast('Not your turn yet. You can attack when the fight reaches you.');return}
  const st=turnSt(u,ctx.key);const lim=nAtkOf(u);
  if(isLoading(u,a)&&st.loaded&&st.loaded.includes(a.name)&&!(SH.pt&&SH.pt.k===ak)){toast(`The ${a.name} has the Loading property: it fires only once per action, so you cannot use it for your other attacks this turn.`);return}
  if(st.act&&st.n===0){toast('Your action is already used this turn (a spell, Dash or similar), so you cannot take the Attack action.');return}
  if(st.n>=lim&&!(SH.pt&&SH.pt.k===ak)){const did=lim===1?'your attack':`all ${lim} attacks`;
    if(st.bonus){toast(`No attacks left: you have made ${did} and used your bonus action this turn.`);return}
    if(!offhandOK(u,a)){toast(`You have made ${did} this turn. An extra attack with your bonus action needs a light weapon in each hand, or a class button (Flurry of Blows, Frenzy…).`);return}
    if(!tapTwice(b,'Tap again: off-hand attack with your bonus action (second light weapon, no ability bonus on damage)'))return}
  const foes=foeList().filter(f=>!f.down);if(!foes.length){doAttack(u,a,null,ak);return}
  if(foes.length===1){doAttack(u,a,foes[0],ak);return}
  SH.pt={u,k:ak};render(true)};
ACT.ptTo=function(b){const pt=SH.pt;if(!pt)return;const a=atkById(pt.u,pt.k);if(!a)return;const tg=b.dataset.k==='none'?null:foeList().find(f=>f.id===b.dataset.k);doAttack(pt.u,a,tg||null,pt.k)};
ACT.ptCancel=function(){SH.pt=null;render(true)};
ACT.dmg=function(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(!a||!a.dmg)return;const ctx=dmFor(u)?null:fightCtx(u);
  if(ctx){if(!ctx.mine){toast('Not your turn yet.');return}const st=turnSt(u,ctx.key);const i=st.hits.findIndex(h=>h.k===b.dataset.k);
    if(i<0){toast(st.hits.length?'That hit was with another weapon: use its damage button.':'Roll to hit first: tap the attack name. Damage comes after a hit.');return}
    const h=st.hits.splice(i,1)[0];if(h.tgt&&foeList().some(f=>f.id===h.tgt&&f.down)){toast(`${h.tname} is already down, so that hit is spent.`);render(true);return}rollDmg(`${a.name} ${h.off?'off-hand ':''}damage → ${h.tname}`,h.off?String(a.dmg).replace(/\+\d+$/,''):a.dmg,{uid:u,crit:h.crit,tgt:h.tgt,of:h.aid});render(true);return}
  rollDmg(a.name+' damage',a.dmg,{uid:u});render(true)};
ACT.econ=function(b){const u=b.dataset.u;const ctx=fightCtx(u);if(!ctx||!ctx.mine)return;const st=turnSt(u,ctx.key);const k=b.dataset.k;st[k]=st[k]?0:1;render(true)};

// incoming log entries: the host checks attacks against AC and applies damage; the attacker unlocks damage on a hit
onLog=(function(prev){return function(fresh){prev(fresh);SH.hostT=SH.hostT||Date.now();SH.done2=SH.done2||new Set();
  for(const e of fresh){const dk=e.kind==='d20'&&e.aid?'a'+e.aid:e.hitOf?'h'+e.hitOf:e.of?'d'+e.of:null;if(!dk||SH.done2.has(dk))continue;
    // host side
    if(SH.owner&&(e.t||0)>=SH.hostT-1000){const mons=monsOf();
      if(e.kind==='d20'&&e.tgt&&e.aid&&mons[e.tgt]){SH.done2.add(dk);const m=mons[e.tgt];const fc=typeof foeConds==='function'?foeConds(e.tgt):[];const helpless=fc.includes('Paralyzed')||fc.includes('Unconscious');const cm=e.cm||20;const mf=!!e.mis&&e.nat<=e.mis;const hit=!mf&&(e.nat>=cm||(e.nat!==1&&e.total>=m.ac));const crit=hit&&(e.nat>=cm||helpless&&!/spell attack|bow|crossbow|sling|dart|pistol|musket|pepperbox|blunderbuss|bad news/i.test(e.label));SH.hitOK=SH.hitOK||{};SH.hitOK[e.aid]=hit;
        addLog({by:SH.me,who:'DM',kind:'note',label:hit?`🎯 ${e.who} hits ${e.tname}${crit?(e.nat!==20&&helpless?` (${fc.includes('Paralyzed')?'paralyzed':'unconscious'}): a critical hit!`:': a critical hit!'):'.'} Roll damage.`:`${e.who} misses ${e.tname}.`,total:'',hitOf:e.aid,hit,crit,hitBy:e.by,tgt:e.tgt,tname:e.tname,quiet:true})}
      if(e.kind==='dmg'&&e.tgt&&e.of&&mons[e.tgt]){SH.done2.add(dk);if(SH.hitOK&&SH.hitOK[e.of]===false)continue;SH.hitOK&&delete SH.hitOK[e.of];
        hurtMon(e.tgt,-e.total,`${e.who}, ${e.label.replace(/ → .*$/,'')}`)}}
    // attacker side: a hit unlocks one damage roll for that weapon
    if(e.kind==='note'&&e.hitOf&&SH.myAtk&&SH.myAtk[e.hitOf]){SH.done2.add(dk);const r=SH.myAtk[e.hitOf];delete SH.myAtk[e.hitOf];
      if(e.hit){const ctx=fightCtx(r.u);const st=turnSt(r.u,ctx?ctx.key:r.key);st.hits.push({k:r.k,aid:e.hitOf,tgt:e.tgt,tname:e.tname,crit:!!e.crit,off:!!r.off})}
      atkResultCard(r,e);render(true)}}}})(onLog);
// the attacker's roll card turns into the result: HIT (with the damage button) or MISS
function atkResultCard(r,e){const a=atkById(r.u,r.k);let el=q('#rollCard');if(!el){el=document.createElement('div');el.id='rollCard';document.body.appendChild(el)}
  el.className='show '+(e.hit?(e.crit?'crit':'hitc'):'fumble');
  el.innerHTML=`<div class="rc-l">${esc(a?a.name:'Attack')} → ${esc(e.tname||'')}</div><div class="rc-t rc-word">${e.hit?(e.crit?'CRITICAL HIT!':'HIT!'):'MISS'}</div><div class="rc-d">${e.hit?(e.crit?'Damage dice are doubled.':'Now roll damage.'):'No damage this time.'}</div>
    ${e.hit&&a&&a.dmg?`<div class="rc-f"><button type="button" class="btn pri" data-rcdmg="1">Roll damage ${esc(a.dmg)}${e.crit?' ×2 dice':''}</button></div>`:''}<button type="button" class="rc-x" aria-label="Close">✕</button>`;
  const bt=q('[data-rcdmg]',el);if(bt)bt.onclick=()=>{if(bt.disabled)return;bt.disabled=true;ACT.dmg({dataset:{u:r.u,k:r.k}});el.className=''};
  q('.rc-x',el).onclick=()=>{el.className=''};clearTimeout(rollT);rollT=setTimeout(()=>{el.className=''},e.hit?15000:4000)}

// ---------- what the player sees ----------
const ECON=[['act','Action','Attack, cast a spell, Dash, Dodge, Help, Hide, use an object'],['bonus','Bonus action','Only things that say "bonus action": off-hand attack, some spells and class features'],['react','Reaction','One per round, even on other turns: opportunity attack, Shield, Uncanny Dodge']];
function econHTML(uid,D,st,mine){return`<div class="econ ${mine?'mine':''}">${ECON.map(([k,n,t])=>`<button type="button" class="ec ec-${k} ${st&&st[k]?'used':''}" ${mine?`data-a="econ" data-u="${uid}" data-k="${k}"`:'disabled'} title="${esc(t)}"><b>${n}</b><small>${mine?(st&&st[k]?'used':'ready'):esc(t.split(':')[0])}</small></button>`).join('')}<span class="ec ec-move"><b>Move</b><small>${D.speed} ft</small></span></div>`}
function markEcon(h){return h.split(/(<textarea[\s\S]*?<\/textarea>|<select[\s\S]*?<\/select>|<datalist[\s\S]*?<\/datalist>)/).map((p,i)=>i%2?p:markEcon1(p)).join('')}
function markEcon1(h){return h.replace(/>([^<]+)</g,(m,t)=>'>'+t.replace(/\b(bonus action)s?\b/gi,'<mark class="tg tg-bonus">$&</mark>').replace(/\b(reaction)s?\b/gi,'<mark class="tg tg-react">$&</mark>').replace(/\b(as an action|use your action|an action|the Attack action|your action)\b/gi,'<mark class="tg tg-act">$&</mark>')+'<')}
pgActions=(function(prev){return function(uid,c,D){let h=markEcon(prev(uid,c,D));const ctx=dmFor(uid)?null:fightCtx(uid);
  if(!ctx)return econHTML(uid,D,null,false)+h.replace(/<h2>Attacks <small>[^<]*<\/small><\/h2>/,`<h2>Attacks <small><mark class="tg tg-act">Action</mark> ${D.nAtk>1?D.nAtk+' attacks per Attack action · ':''}tap the name to roll to hit</small></h2>`);
  if(!ctx.mine)return econHTML(uid,D,null,false)+h.replace(/<h2>Attacks <small>[^<]*<\/small><\/h2>/,'<h2>Attacks <small>wait for your turn</small></h2>').replace(/class="rb" data-a="atk"/g,'class="rb wait" data-a="atk"').replace(/class="btn dmg" data-a="dmg"/g,'class="btn dmg wait" data-a="dmg"');
  const st=turnSt(uid,ctx.key);const lim=D.nAtk||1;
  h=h.replace(/<h2>Attacks <small>[^<]*<\/small><\/h2>/,`<h2>Attacks <small><mark class="tg tg-act">Action</mark> ${Math.min(st.n,lim)} of ${lim} attack${lim>1?'s':''} used${st.n>lim?` + ${st.n-lim} extra`:''}</small></h2>`);
  // target picker
  if(SH.pt&&SH.pt.u===uid){const a=atkById(uid,SH.pt.k);const foes=foeList();h=h.replace(/(<h2>Attacks <small>[\s\S]*?<\/h2>)/,`$1<div class="mtarget ptarget"><span>${esc(a?a.name:'')}: who do you attack?</span><div class="chipset">${foes.map(f=>`<button type="button" class="chip tog" data-a="ptTo" data-k="${f.id}" ${f.down?'disabled':''}>${esc(f.label||f.name)}${f.down?' (down)':''}</button>`).join('')}<button type="button" class="chip tog" data-a="ptTo" data-k="none">Something else</button></div><button type="button" class="btn sm" data-a="ptCancel">Cancel</button></div>`)}
  // damage buttons only light up after a hit
  const ready=new Set(st.hits.map(x=>x.k));h=h.replace(/class="btn dmg" data-a="dmg" data-u="([^"]*)" data-k="([^"]*)"/g,(m,u,k)=>ready.has(k)?`class="btn dmg ready" data-a="dmg" data-u="${u}" data-k="${k}"`:`class="btn dmg wait" data-a="dmg" data-u="${u}" data-k="${k}"`);
  return econHTML(uid,D,st,true)+(st.hits.length?`<p class="hitnote">🎯 Hit! Tap the red damage button${st.hits.length>1?'s':''} to roll damage.</p>`:'')+h}})(pgActions);
pgFeats=(function(prev){return function(uid,c,D){return markEcon(prev(uid,c,D))}})(pgFeats);
// the DM's log (dock) mixes in the hidden rolls, marked 🔒
function dmLogHTML(n){const sec=((SH.dm.rolls||{}).items||[]).map(e=>({...e,label:'🔒 '+e.label,hid:1}));const all=[...SH.log,...sec].sort((a,b)=>(b.t||0)-(a.t||0));const L=SH.log;SH.log=all;try{return logHTML(n)}finally{SH.log=L}}
dockHTML=(function(prev){return function(){let h=prev();if(h&&SH.owner)h=h.replace(/<div class="log">[\s\S]*<\/div><\/aside>$/,`<div class="log">${dmLogHTML(80)}</div><p class="mini dockfoot">🔒 = hidden roll, only you see it</p></aside>`);return h}})(dockHTML);
// host: keep "down" flags on enemies in the turn order so players cannot target them
render=(function(prev){return function(f){prev(f);try{const ini=initOf();if(!SH.owner||!ini.on)return;const mons=monsOf();let ch=0;const order=(ini.order||[]).map(o=>{if(o.pc||!mons[o.id])return o;const dn=mons[o.id].hp<=0;if(!!o.down!==dn){ch=1;return{...o,down:dn}}return o});if(ch&&!render._d){render._d=1;setInit({order});setTimeout(()=>render._d=0,300)}}catch(e){}}})(render);

// down on your own turn: a big death-save prompt; ending the turn without rolling asks twice
ACT.death=(function(prev){return function(b){const u=b.dataset.u||SH.me;const ctx=fightCtx(u);if(ctx&&ctx.mine)turnSt(u,ctx.key).ds=1;return prev(b)}})(ACT.death);
ACT.endTurn=(function(prev){return function(b){const c=myChar();const ctx=fightCtx(SH.me);if(c&&c.hp<=0&&!c.dead&&!c.stable&&ctx&&ctx.mine&&!turnSt(SH.me,ctx.key).ds&&b&&!tapTwice(b,'Roll your death save first! Tap again to skip it'))return;return prev(b)}})(ACT.endTurn);
screenHTML=(function(prev){return function(){let h=prev();const c=myChar();if(!c||isDM()||!SH.ready)return h;const ctx=fightCtx(SH.me);
  if(ctx&&ctx.mine&&c.hp<=0&&!c.dead&&!c.stable&&!turnSt(SH.me,ctx.key).ds){const d=c.death||{s:0,f:0};
    h=h.replace('<div class="hero">',`<div class="dsban" role="alert"><b>You are down!</b><span>On your turn you roll a death save: 10 or more is a success. 3 successes and you stabilise, 3 failures and you die. A 20 brings you back with 1 HP.</span><span class="dsn">✔ ${d.s||0}/3 · ✖ ${d.f||0}/3</span><button type="button" class="btn pri big" data-a="death" data-u="${SH.me}">🎲 Roll death save</button></div><div class="hero">`)}
  else if(ctx&&ctx.mine&&(c.dead||c.stable||c.hp<=0))h=h.replace('<div class="hero">',`<div class="yourturn">${c.dead?'☠ Your character is dead. Talk to the DM, then tap <b>End my turn</b>.':c.stable?'You are unconscious but stable. You wake up when someone heals you. Tap <b>End my turn</b>.':'Death save rolled. Tap <b>End my turn</b>.'}</div><div class="hero">`);
  else if(ctx&&ctx.mine)h=h.replace('<div class="hero">','<div class="yourturn">Your turn! Use your Action, Bonus action and Move, then tap <b>End my turn</b>.</div><div class="hero">');
  return h}})(screenHTML);

// DM: say so when the whole party is down
dmFight=(function(prev){return function(){let h=prev();const ini=initOf();if(!ini.on)return h;const pcs=Object.values(SH.chars).filter(c=>charOK(c)&&(ini.order||[]).some(o=>o.pc&&SH.chars[o.pc]===c));
  if(pcs.length&&pcs.every(c=>c.hp<=0||c.dead))h=`<div class="dsban"><b>The whole party is down.</b><span>Enemies can finish them, take them prisoner or leave. You decide: end the fight when the scene is over.</span></div>`+h;return h}})(dmFight);

// off-hand attacks (two-weapon fighting) need a light weapon
function offhandOK(u,a){const c=SH.chars[u];if(!c||!a)return false;if(/light/i.test(a.note||''))return true;
  if(c.build.rules==='5e'){const k=Object.entries(R5.weapons).find(([,w])=>w[0]===a.name);return!!(k&&typeof WINFO!=='undefined'&&WINFO[k[0]]&&/\blight\b/.test(WINFO[k[0]][1]))}
  const w=Object.values(WEAPONS).find(x=>x.name===a.name);return!!(w&&/light/i.test(w.note||''))}

// Loading (crossbows, muskets): one shot per action, bonus action or reaction
function isLoading(u,a){const c=SH.chars[u];if(!c||!a||c.build.rules!=='5e')return false;if(/crossbow expert/i.test(JSON.stringify((c.build.featLv||{}))+JSON.stringify(c.cfeat||[])))return false;const k=Object.entries(R5.weapons).find(([,w])=>w[0]===a.name);return!!(k&&typeof WINFO!=='undefined'&&WINFO[k[0]]&&/\bloading\b/.test(WINFO[k[0]][1]))}
