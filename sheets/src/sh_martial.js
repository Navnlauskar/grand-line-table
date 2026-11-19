// ================= martial class actions: Second Wind, Action Surge, Flurry of Blows, Stunning Strike, Sneak Attack, Cunning Action, Uncanny Dodge =================
const isCls=(c,...ks)=>ks.includes(c.build.cls);
function martialDie(l){return l>=17?'1d10':l>=11?'1d8':l>=5?'1d6':'1d4'}
function kiKey(D){return D.res&&D.res.ki?'ki':D.res&&D.res.focus?'focus':null}
function sneakDice(c){return Math.ceil((c.build.level||1)/2)+'d6'}
function resLeft(c,D,k){const R=(D.res||{})[k];return R?R.max-((c.res||{})[k]||0):0}
function spendRes(u,k,n){const c=SH.chars[u];saveChar(u,{res:{...(c.res||{}),[k]:((c.res||{})[k]||0)+(n||1)}})}
function myTurnSt(u){const ctx=dmFor(u)?null:fightCtx(u);if(ctx&&!ctx.mine)return'no';return ctx?turnSt(u,ctx.key):null}
function needEcon(b,st,k,label){if(st==='no'){toast('Not your turn yet.');return false}if(st&&k&&st[k]&&!tapTwice(b,`Your ${label} is used. Tap again to do it anyway`))return false;if(st&&k)st[k]=1;return true}
// unarmed strike for martial artists (One Piece Martial Artist has none in its weapon list)
function unarmedAtk(c,D){const a=(D.attacks||[]).find(x=>/unarmed/i.test(x.name));if(a)return a;const m=Math.max(abMod(D,'STR'),abMod(D,'DEX'));return{name:'Unarmed strike',atk:m+(D.prof||2),dmg:martialDie(c.build.level||1)+(m>=0?'+':'')+m,note:'bludgeoning'}}
// extra attacks granted this turn (Flurry of Blows, Action Surge)
nAtkOf=(function(prev){return function(u){const st=myTurnSt(u);return prev(u)+((st&&st!=='no'&&st.extra)||0)}})(nAtkOf);
function martialHTML(uid,c,D){if(!canEdit(uid))return'';const st=myTurnSt(uid);const L=c.build.level||1;const B=[];const btn=(a,label,sub,dis,extra)=>`<button type="button" class="btn sm mact" data-a="${a}" data-u="${uid}" ${dis?'disabled':''} ${extra||''}><b>${label}</b><small>${sub}</small></button>`;
  if(D.res&&D.res.wind)B.push(btn('maWind','Second Wind',`bonus · heal 1d10+${L} · ${resLeft(c,D,'wind')} left`,resLeft(c,D,'wind')<1));
  if(D.res&&D.res.surge)B.push(btn('maSurge','Action Surge',`one more action · ${resLeft(c,D,'surge')} left`,resLeft(c,D,'surge')<1));
  const ki=kiKey(D);if(ki){const left=resLeft(c,D,ki);const kn=D.res[ki].name.replace(/ points?/i,'');
    B.push(btn('maUnarmed','Bonus strike',`bonus · unarmed ${martialDie(L)}`,false));
    B.push(btn('maFlurry','Flurry of Blows',`bonus · 2 strikes · 1 ${kn} (${left})`,left<1));
    B.push(btn('maKi','Patient Defense',`bonus · Dodge · 1 ${kn}`,left<1,'data-k="Patient Defense"'));
    B.push(btn('maKi','Step of the Wind',`bonus · Dash or Disengage · 1 ${kn}`,left<1,'data-k="Step of the Wind"'));
    if(L>=5)B.push(btn('maStun','Stunning Strike',`after a melee hit · CON save · 1 ${kn}`,left<1||!(st&&st!=='no'&&st.lastHit)))}
  if(isCls(c,'rogue')){const on=c.sneakOn!==false;const used=st&&st!=='no'&&st.sneak;
    B.push(`<button type="button" class="btn sm mact ${on&&!used?'on':''}" data-a="maSneakTog" data-u="${uid}"><b>Sneak Attack ${sneakDice(c)}</b><small>${used?'used this turn':on?'added to your next hit':'off: tap to add'}</small></button>`);
    B.push(btn('maCunning','Cunning Action','bonus · Dash, Disengage or Hide',false));
    if(L>=5)B.push(btn('maDodge','Uncanny Dodge','reaction · halve the last hit',!(c.lastHit&&Date.now()-c.lastHit.t<120000)))}
  if(!B.length)return'';return`<h2>Class actions <small>tap to use</small></h2><div class="macts">${B.join('')}</div>`}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const m=martialHTML(uid,c,D);if(!m)return h;const i=h.indexOf('<h2>Attacks');return i<0?m+h:h.slice(0,i)+m+h.slice(i)}})(pgActions);
Object.assign(ACT,{
  maWind(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(resLeft(c,D,'wind')<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,'wind');rollDmg('Second Wind healing',`1d10+${c.build.level||1}`,{uid:u,healTo:u})},
  maSurge(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(resLeft(c,D,'surge')<1)return;const st=myTurnSt(u);if(st==='no'){toast('Use it on your turn.');return}spendRes(u,'surge');
    if(st){st.act=0;st.n=0}addLog({by:SH.me,who:c.build.name,kind:'note',label:`⚡ ${c.build.name} uses Action Surge: one more action this turn!`,total:''});render(true)},
  maUnarmed(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;martialStrike(u,unarmedAtk(c,D),'Bonus unarmed strike')},
  maFlurry(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const ki=kiKey(D);if(resLeft(c,D,ki)<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,ki);
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`👊 ${c.build.name} uses Flurry of Blows: two unarmed strikes.`,total:''});SH.flurry={u,left:2};martialStrike(u,unarmedAtk(c,D),'Flurry of Blows (1 of 2)')},
  maKi(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const ki=kiKey(D);if(resLeft(c,D,ki)<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,ki);addLog({by:SH.me,who:c.build.name,kind:'note',label:`🌀 ${c.build.name} uses ${b.dataset.k}.`,total:''})},
  maStun(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const ki=kiKey(D);const st=myTurnSt(u);if(!st||st==='no'||!st.lastHit||resLeft(c,D,ki)<1)return;spendRes(u,ki);const dc=8+(D.prof||2)+abMod(D,'WIS');const t=st.lastHit;st.lastHit=null;
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`💫 ${c.build.name} uses Stunning Strike on ${t.tname}: CON save DC ${dc}.`,total:'',save:{ab:'CON',dc,h:false,tgts:[t.tgt],tnames:[t.tname],spell:'Stunning Strike'}});render(true)},
  maSneakTog(b){const u=b.dataset.u;const c=SH.chars[u];saveChar(u,{sneakOn:c.sneakOn===false})},
  maCunning(b){const u=b.dataset.u;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;SH.pk={u,who:'opts',max:1,sel:[],title:'Cunning Action: what do you do?',opts:[['dash','Dash (double move)'],['dis','Disengage'],['hide','Hide (roll Stealth)']],go:([k])=>{const c=SH.chars[u];if(k==='hide'){const s=DV(c).skills.Stealth;rollD20('Stealth check (Hide)',s.bonus,s.parts?partsText(s.parts):fmt(s.bonus),{uid:u})}else addLog({by:SH.me,who:c.build.name,kind:'note',label:`💨 ${c.build.name} uses Cunning Action to ${k==='dash'?'Dash':'Disengage'}.`,total:''});render(true)}};render(true)},
  maDodge(b){const u=b.dataset.u;const c=SH.chars[u];const st=myTurnSt(u);if(st&&st!=='no'&&st.react&&!tapTwice(b,'Reaction used. Tap again anyway'))return;if(!c.lastHit)return;const back=Math.floor(c.lastHit.amt/2);saveChar(u,{lastHit:null});hpChange(u,back,`Uncanny Dodge halves the hit (${c.lastHit.amt} → ${c.lastHit.amt-back})`)}});
// a strike outside the normal attack count (bonus action), with targets like any attack
function martialStrike(u,a,tag){const ak='ma:'+uidNew();SH.pseudo=SH.pseudo||{};SH.pseudo[ak]={...a,name:a.name};const foes=fightCtx(u)?foeList().filter(f=>!f.down):[];
  const go=tg=>{doAttack(u,{...a,name:tag.startsWith('Flurry')?tag:a.name},tg,ak,{spell:1,bonus:1});const F=SH.flurry;if(F&&F.u===u&&--F.left>0)setTimeout(()=>{if(foes.length)SH.pk={u,who:'foes',max:1,sel:[],title:'Flurry of Blows (2 of 2): who do you hit?',go:([id])=>go2(foeList().find(f=>f.id===id))};else go2(null);render(true)},300);else SH.flurry=null};
  const go2=tg=>{doAttack(u,{...a,name:'Flurry of Blows (2 of 2)'},tg,ak,{spell:1,bonus:1});SH.flurry=null};
  if(!foes.length){go(null);return}if(foes.length===1){go(foes[0]);return}SH.pk={u,who:'foes',max:1,sel:[],title:`${tag}: who do you hit?`,go:([id])=>go(foeList().find(f=>f.id===id))};render(true)}
// picker with plain options (Cunning Action)
pickHTML=(function(prev){return function(uid){const k=SH.pk;if(!k||k.u!==uid||k.who!=='opts')return prev(uid);return`<div class="mtarget ptarget"><span>${esc(k.title)}</span><div class="chipset">${k.opts.map(([v,l])=>`<button type="button" class="chip tog" data-a="pkTo" data-k="${v}">${esc(l)}</button>`).join('')}</div><button type="button" class="btn sm" data-a="pkCancel">Cancel</button></div>`}})(pickHTML);
// remember the last melee hit (for Stunning Strike) and the last hit you took (for Uncanny Dodge)
onLog=(function(prev){return function(fresh){prev(fresh);for(const e of fresh){if(e.kind==='note'&&e.hitOf&&e.hit&&e.hitBy===SH.me){const ctx=fightCtx(SH.me);if(ctx&&ctx.mine)turnSt(SH.me,ctx.key).lastHit={tgt:e.tgt,tname:e.tname}}}}})(onLog);
hpChange=(function(prev){return function(u,delta,note,crit,dtype){const c=SH.chars[u];const r=prev(u,delta,note,crit,dtype);if(c&&delta<0&&isCls(c,'rogue')&&/hits/.test(note||''))saveChar(u,{lastHit:{amt:-delta,t:Date.now()}});return r}})(hpChange);
// Sneak Attack: added once per turn to a finesse or ranged weapon hit
applyRider=(function(prev){return function(label,expr,opts){[label,expr]=prev(label,expr,opts);const u=opts.uid;const c=u&&SH.chars[u];if(!c||!isCls(c,'rogue')||c.sneakOn===false||!/ damage/.test(label)||opts.healTo)return[label,expr];
  const nm=String(label).replace(/ (\+ .*)?damage.*$/,'').trim();const a=(DV(c).attacks||[]).find(x=>x.name===nm);if(!a||!/finesse|ranged|range/i.test(a.note||''))return[label,expr];
  const st=myTurnSt(u);if(st&&st!=='no'){if(st.sneak)return[label,expr];st.sneak=1}else if(st==='no')return[label,expr];
  return[label.replace(' damage',' + Sneak Attack damage'),expr+'+'+sneakDice(c)]}})(applyRider);
// Stunning Strike: a failed save stuns
SPELL_COND['Stunning Strike']='Stunned';
