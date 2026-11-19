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
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`👊 ${c.build.name} uses Flurry of Blows: two unarmed strikes.`,total:''});SH.flurry={u,tag:'Flurry of Blows'};martialStrike(u,unarmedAtk(c,D),'Flurry of Blows')},
  maKi(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const ki=kiKey(D);if(resLeft(c,D,ki)<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,ki);addLog({by:SH.me,who:c.build.name,kind:'note',label:`🌀 ${c.build.name} uses ${b.dataset.k}.`,total:''})},
  maStun(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const ki=kiKey(D);const st=myTurnSt(u);if(!st||st==='no'||!st.lastHit||resLeft(c,D,ki)<1)return;spendRes(u,ki);const dc=8+(D.prof||2)+abMod(D,'WIS');const t=st.lastHit;st.lastHit=null;
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`💫 ${c.build.name} uses Stunning Strike on ${t.tname}: CON save DC ${dc}.`,total:'',save:{ab:'CON',dc,h:false,tgts:[t.tgt],tnames:[t.tname],spell:'Stunning Strike'}});render(true)},
  maSneakTog(b){const u=b.dataset.u;const c=SH.chars[u];saveChar(u,{sneakOn:c.sneakOn===false})},
  maCunning(b){const u=b.dataset.u;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;SH.pk={u,who:'opts',max:1,sel:[],title:'Cunning Action: what do you do?',opts:[['dash','Dash (double move)'],['dis','Disengage'],['hide','Hide (roll Stealth)']],go:([k])=>{const c=SH.chars[u];if(k==='hide'){const s=DV(c).skills.Stealth;rollD20('Stealth check (Hide)',s.bonus,s.parts?partsText(s.parts):fmt(s.bonus),{uid:u})}else addLog({by:SH.me,who:c.build.name,kind:'note',label:`💨 ${c.build.name} uses Cunning Action to ${k==='dash'?'Dash':'Disengage'}.`,total:''});render(true)}};render(true)},
  maDodge(b){const u=b.dataset.u;const c=SH.chars[u];const st=myTurnSt(u);if(st&&st!=='no'&&st.react&&!tapTwice(b,'Reaction used. Tap again anyway'))return;if(!c.lastHit)return;const back=Math.floor(c.lastHit.amt/2);saveChar(u,{lastHit:null});hpChange(u,back,`Uncanny Dodge halves the hit (${c.lastHit.amt} → ${c.lastHit.amt-back})`)}});
// a strike outside the normal attack count (bonus action), with targets like any attack
function martialStrike(u,a,tag){const ak='ma:'+uidNew();SH.pseudo=SH.pseudo||{};SH.pseudo[ak]={...a,name:a.name};const F=SH.flurry&&SH.flurry.u===u?SH.flurry:null;const foes=fightCtx(u)?foeList().filter(f=>!f.down):[];
  const nameN=i=>F?`${F.tag} (${i} of 2)`:a.name;
  const go=(tg,i)=>{doAttack(u,{...a,name:nameN(i)},tg,ak,{spell:1,bonus:1});if(F&&i<2&&!F.done){setTimeout(()=>{const fs=fightCtx(u)?foeList().filter(f=>!f.down):[];if(fs.length>1){SH.pk={u,who:'foes',max:1,sel:[],title:`${F.tag} (2 of 2): who do you hit?`,go:([id])=>go(foeList().find(f=>f.id===id),2)};render(true)}else go(fs[0]||null,2)},300)}else SH.flurry=null};
  if(!foes.length){go(null,1);return}if(foes.length===1){go(foes[0],1);return}SH.pk={u,who:'foes',max:1,sel:[],title:`${tag}: who do you hit?`,go:([id])=>go(foeList().find(f=>f.id===id),1)};render(true)}
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

// ================= Bruiser (One Piece rules): Scrapper strike, fury powers, Blood for Brawn, Thrill of the Fight, Rampage =================
function scrapAtk(c,D){const m=abMod(D,'STR');return{name:'Unarmed strike',atk:m+(D.prof||2),dmg:`1d${D.scrap||6}${m>=0?'+':''}${m}`,note:'bludgeoning'}}
function bruiserHTML(uid,c,D){if(!canEdit(uid)||!isCls(c,'bruiser'))return'';const L=c.build.level||1;const sd='1d'+(D.scrap||6);const f=resLeft(c,D,'fury');const B=[];
  const btn=(a,label,sub,dis,extra)=>`<button type="button" class="btn sm mact" data-a="${a}" data-u="${uid}" ${dis?'disabled':''} ${extra||''}><b>${label}</b><small>${sub}</small></button>`;
  B.push(btn('brStrike','Bonus strike',`bonus · after Attack · unarmed ${sd}`,false));
  if(D.res.fury){B.push(btn('brMGB','Machine Gun Blows',`bonus · 2 strikes · 1 fury (${f})`,f<1));B.push(btn('brBrace','Brace for Impact',`bonus · ${sd}+${L} temp HP · 1 fury`,f<1));B.push(btn('brForce','Brute Force',`bonus · shove or Dash · 1 fury`,f<1))}
  if(D.res.blood){const half=c.hp<=Math.floor(D.maxhp/2);B.push(btn('brBlood','Blood for Brawn',`reaction at half HP · ${sd}+${L} temp HP, fury back · ${resLeft(c,D,'blood')} left`,resLeft(c,D,'blood')<1||!half))}
  if(D.res.frenzy)B.push(c.frenzy?btn('brFrenzyEnd','End frenzy','Thrill of the Fight',false):btn('brFrenzy','Thrill of the Fight',`bonus · frenzy · ${resLeft(c,D,'frenzy')} left`,resLeft(c,D,'frenzy')<1));
  if(L>=5){const on=!!c.rampOn;B.push(`<button type="button" class="btn sm mact ${on?'on':''}" data-a="brRamp" data-u="${uid}"><b>Rampage ${on?'on':'off'}</b><small>+${sd} on hits, you take ${sd}</small></button>`)}
  return`<h2>Class actions <small>tap to use</small></h2><div class="macts">${B.join('')}</div>`}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const m=bruiserHTML(uid,c,D);if(!m)return h;const i=h.indexOf('<h2>Attacks');return i<0?m+h:h.slice(0,i)+m+h.slice(i)}})(pgActions);
const furyOk=(c,D)=>{if(resLeft(c,D,'fury')<1){toast('No fury points left. A short rest brings them back.');return false}return true};
Object.assign(ACT,{
  brStrike(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;martialStrike(u,scrapAtk(c,D),'Bonus unarmed strike')},
  brMGB(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(!furyOk(c,D))return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,'fury');
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`👊👊 ${c.build.name} uses Machine Gun Blows: two strikes.`,total:''});SH.flurry={u,tag:'Machine Gun Blows'};martialStrike(u,scrapAtk(c,D),'Machine Gun Blows')},
  brBrace(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(!furyOk(c,D))return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,'fury');rollDmg('Brace for Impact temporary HP',`1d${D.scrap||6}+${c.build.level||1}`,{uid:u,tempTo:u})},
  brForce(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(!furyOk(c,D))return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,'fury');
    SH.pk={u,who:'opts',max:1,sel:[],title:'Brute Force: what do you do?',opts:[['shove','Shove (Athletics contest)'],['dash','Dash (double move)']],go:([k])=>{if(k==='shove'){const s=DV(c).skills.Athletics;rollD20('Athletics check (Brute Force shove)',s.bonus,s.parts?partsText(s.parts):fmt(s.bonus),{uid:u})}else addLog({by:SH.me,who:c.build.name,kind:'note',label:`💨 ${c.build.name} uses Brute Force to Dash.`,total:''})}};render(true)},
  brBlood(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(resLeft(c,D,'blood')<1)return;const st=myTurnSt(u);if(st&&st!=='no'&&st.react&&!tapTwice(b,'Reaction used. Tap again anyway'))return;if(st&&st!=='no')st.react=1;
    saveChar(u,{res:{...(c.res||{}),blood:((c.res||{}).blood||0)+1,fury:0}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`🩸 ${c.build.name} uses Blood for Brawn: all fury points come back.`,total:''});setTimeout(()=>rollDmg('Blood for Brawn temporary HP',`1d${D.scrap||6}+${c.build.level||1}`,{uid:u,tempTo:u}),250)},
  brFrenzy(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(resLeft(c,D,'frenzy')<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;spendRes(u,'frenzy');saveChar(u,{frenzy:true});
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`🔥 ${c.build.name} enters the Thrill of the Fight: resistant to blows, advantage on STR saves, but attacks against them have advantage.`,total:''})},
  brFrenzyEnd(b){const u=b.dataset.u;saveChar(u,{frenzy:false});addLog({by:SH.me,who:who(u),kind:'note',label:`${who(u)}'s frenzy ends.`,total:'',quiet:true})},
  brRamp(b){const u=b.dataset.u;saveChar(u,{rampOn:!SH.chars[u].rampOn})}});
// frenzy: resistance and STR advantage; ends on a long rest or when the fight ends
resistOf=(function(prev){return function(c){const R=prev(c);if(c.frenzy)for(const t of ['bludgeoning','piercing','slashing']){R.resist.add(t);R.why[t]=R.why[t]||'frenzy'}return R}})(resistOf);
condAdv=(function(prev){return function(c,kind,ab){const r=prev(c,kind,ab);if(c.frenzy&&ab==='STR'&&(kind==='save'||kind==='check')&&!r.adv){r.adv=1;r.why.push('frenzy')}return r}})(condAdv);
ACT.rest=(function(prev){return function(b){const r=prev(b);const u=b.dataset.u;if(b.dataset.k==='long'&&SH.chars[u]&&SH.chars[u].frenzy)saveChar(u,{frenzy:false});return r}})(ACT.rest);
// Rampage: one more Scrapper die on unarmed or bruiser-weapon hits, and the bruiser takes one too
applyRider=(function(prev){return function(label,expr,opts){[label,expr]=prev(label,expr,opts);const u=opts.uid;const c=u&&SH.chars[u];if(!c||!isCls(c,'bruiser')||!c.rampOn||!/ damage/.test(label)||opts.healTo||opts.tempTo||!opts.tgt)return[label,expr];
  const nm=String(label).replace(/ (\+ .*)?damage.*$/,'').trim();if(!/unarmed|cutlass|club|quarterstaff|handaxe|machine gun|improvised/i.test(nm))return[label,expr];const D=DV(c);const sd=D.scrap||6;
  setTimeout(()=>{const n=1+Math.floor(Math.random()*sd);hpChange(u,-n,`Rampage recoil (1d${sd} = ${n})`)},600);return[label.replace(' damage',' + Rampage damage'),expr+'+1d'+sd]}})(applyRider);
// Patient Defense and Dodge: attacks against you have disadvantage until your next turn
ACT.maKi=(function(prev){return function(b){const u=b.dataset.u;const before=JSON.stringify((SH.chars[u]||{}).res||{});prev(b);if(b.dataset.k==='Patient Defense'&&JSON.stringify((SH.chars[u]||{}).res||{})!==before){const i=initOf();if(i.on)saveChar(u,{dodge:{id:i.id,round:i.round||1,turn:i.turn||0}})}}})(ACT.maKi);
function dodging(c){const d=c.dodge;const i=initOf();if(!d||!i.on||i.id!==d.id)return false;const r=i.round||1;return r===d.round||(r===d.round+1&&(i.turn||0)<d.turn)}
// how an enemy attacks a character: advantage and disadvantage from conditions, frenzy, dodging
function advVsPc(c){const k=c.cond||{};const down=c.hp<=0&&!c.dead;let adv=0,dis=0;const why=[];
  if(down){adv=1;why.push('down')}for(const n of ['Paralyzed','Stunned','Unconscious','Restrained','Prone','Blinded','Petrified'])if(k[n]){adv=1;why.push(n.toLowerCase())}
  if(c.frenzy){adv=1;why.push('frenzy')}if(c.reckless){adv=1;why.push('reckless')}if(k.Invisible){dis=1;why.push('invisible')}if(dodging(c)&&!down&&!k.Paralyzed&&!k.Stunned&&!k.Unconscious){dis=1;why.push('dodging')}
  return{v:adv&&dis?0:adv?1:dis?-1:0,why,autoCrit:down||!!(k.Paralyzed||k.Unconscious)}}
// rage and frenzy end with the fight
onLog=(function(prev){return function(fresh){prev(fresh);const c=myChar();if(!c||!(c.raging||c.frenzy))return;if(fresh.some(e=>e.who==='DM'&&e.label==='The fight is over.'&&Date.now()-(e.t||Date.now())<60000))saveChar(SH.me,{raging:false,frenzy:false})}})(onLog);
