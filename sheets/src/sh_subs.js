// ================= non-magical 5e subclasses that change what you do in a fight: Berserker, Open Hand, Thief =================
const SUB_SUGGEST={barbarian:['Path of the Berserker'],fighter:['Champion','Gunslinger','Battle Master'],monk:['Way of the Open Hand'],rogue:['Thief','Assassin']};
const subIs=(b,cls,re)=>!!b&&b.rules==='5e'&&b.cls===cls&&re.test(b.subclass||'');
// the builder suggests subclass names that the sheet knows how to run
builderHTML=(function(prev){return function(){let h=prev();const b=SH.edit&&SH.edit.b;if(!b||b.rules!=='5e')return h;const L=SUB_SUGGEST[b.cls];if(!L)return h;
  return h.replace(/(<input data-c="bText" data-f="subclass"[^>]*?)>/,`$1 list="subsugg"><datalist id="subsugg">${L.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><small class="hint">The sheet runs ${esc(L.join(', '))} for you. Other subclasses work too: add their features under Custom features.</small>`)}})(builderHTML);
derive5=(function(prev){return function(b){const D=prev(b);const lvl=D.lvl;
  const rep=(name,S)=>{D.feats=D.feats.flatMap(f=>{const m=/feature \(level (\d+)\)$/.exec(f[0]);return m&&S[+m[1]]?S[+m[1]].map(x=>[x[0]+` (${name})`,x[1]]):[f]})};
  if(subIs(b,'barbarian',/berserker/i))rep('Berserker',{3:[['Frenzy','While raging you can make one melee weapon attack as a bonus action on each of your turns. When the rage ends you gain one level of exhaustion.']],6:[['Mindless Rage',"You can't be charmed or frightened while raging."]],10:[['Intimidating Presence','Action: frighten one creature you can see within 30 ft (WIS save).']],14:[['Retaliation','Reaction: a melee attack against a creature within 5 ft that damaged you.']]});
  if(subIs(b,'monk',/open hand/i))rep('Open Hand',{3:[['Open Hand Technique','When you hit with a Flurry of Blows strike: the target makes a DEX save or falls prone, or a STR save or is pushed 15 ft, or it cannot take reactions until the end of your next turn.']],6:[['Wholeness of Body','Action, once per long rest: regain HP equal to three times your monk level.']],11:[['Tranquility','Sanctuary-like calm after a long rest.']],17:[['Quivering Palm','3 ki: set up lethal vibrations; later a CON save or drop to 0 HP (10d10 necrotic on a success).']]});
  if(subIs(b,'monk',/open hand/i)&&lvl>=6)D.res={...D.res,whole:{name:'Wholeness of Body',max:1,rest:'long'}};
  if(subIs(b,'rogue',/thief/i))rep('Thief',{3:[['Fast Hands','Cunning Action can also Use an Object or make a Sleight of Hand check.'],['Second-Story Work','Climbing costs no extra movement; running jumps go further by your DEX modifier.']],9:[['Supreme Sneak','Advantage on Stealth if you move no more than half your speed.']],13:[['Use Magic Device','Ignore class, race and level requirements on magic items.']],17:[["Thief's Reflexes",'Two turns in the first round of a fight (second at your initiative − 10).']]});
  return D}})(derive5);
function subHTML(uid,c,D){if(!canEdit(uid))return'';const b=c.build;const st=myTurnSt(uid);const S=st&&st!=='no'?st:null;const B=[];
  const btn=(a,label,sub,dis,extra)=>`<button type="button" class="btn sm mact" data-a="${a}" data-u="${uid}" ${dis?'disabled':''} ${extra||''}><b>${label}</b><small>${sub}</small></button>`;
  if(subIs(b,'barbarian',/berserker/i)&&D.lvl>=3&&c.raging)B.push(btn('sbFrenzy','Frenzied strike','bonus · one melee attack · exhaustion when the rage ends',false));
  if(subIs(b,'monk',/open hand/i)&&D.lvl>=3){const ok=S&&S.lastFlurry;for(const [k,n,sub] of [['prone','Topple','DEX save or prone'],['push','Push','STR save or 15 ft away'],['react','Unsettle','no reactions']])B.push(btn('sbOpen',`Open Hand: ${n}`,`after a Flurry hit · ${sub}`,!ok,`data-k="${k}"`));
    if(D.res.whole)B.push(btn('sbWhole','Wholeness of Body',`action · heal ${3*D.lvl} · ${resLeft(c,D,'whole')} left`,resLeft(c,D,'whole')<1))}
  if(!B.length)return'';return`<h2>${esc(b.subclass)} <small>subclass actions</small></h2><div class="macts">${B.join('')}</div>`}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const m=subHTML(uid,c,D);if(!m)return h;const i=h.indexOf('<h2>Attacks');return i<0?m+h:h.slice(0,i)+m+h.slice(i)}})(pgActions);
Object.assign(ACT,{
  sbFrenzy(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(!c.raging){toast('Frenzy works while you rage.');return}const a=(D.attacks||[]).find(x=>!/ranged|range|firearm/i.test(x.note||''));if(!a){toast('You need a melee weapon on your sheet.');return}
    const st=myTurnSt(u);if(!needEcon(b,st,'bonus','bonus action'))return;if(!c.frenzied){saveChar(u,{frenzied:true});addLog({by:SH.me,who:c.build.name,kind:'note',label:`😡 ${c.build.name} goes into a frenzy: one more attack each turn, and exhaustion when the rage ends.`,total:''})}
    martialStrike(u,a,'Frenzied strike')},
  sbOpen(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const st=myTurnSt(u);const t=st&&st!=='no'&&st.lastFlurry;if(!t){toast('Hit with a Flurry of Blows strike first.');return}st.lastFlurry=null;const dc=8+(D.prof||2)+abMod(D,'WIS');const k=b.dataset.k;
    if(k==='react'){addLog({by:SH.me,who:c.build.name,kind:'note',label:`✋ ${c.build.name}'s Open Hand strike leaves ${t.tname} unable to take reactions until the end of ${c.build.name}'s next turn.`,total:''});render(true);return}
    const [n,ab]=k==='prone'?['Open Hand Topple','DEX']:['Open Hand Push','STR'];addLog({by:SH.me,who:c.build.name,kind:'note',label:`✋ ${c.build.name} uses ${n} on ${t.tname}: ${ab} save DC ${dc}.`,total:'',save:{ab,dc,h:false,tgts:[t.tgt],tnames:[t.tname],spell:n}});render(true)},
  sbWhole(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);if(resLeft(c,D,'whole')<1)return;const st=myTurnSt(u);if(!needEcon(b,st,'act','action'))return;spendRes(u,'whole');hpChange(u,3*D.lvl,'Wholeness of Body')}});
SPELL_COND['Open Hand Topple']='Prone';
// remember a Flurry of Blows hit for Open Hand Technique
onLog=(function(prev){return function(fresh){prev(fresh);for(const e of fresh){if(e.kind==='note'&&e.hitOf&&e.hit&&e.hitBy===SH.me){const a=(SH.myAtkLbl||{})[e.hitOf];if(a&&/Flurry of Blows/.test(a)){const ctx=fightCtx(SH.me);if(ctx&&ctx.mine)turnSt(SH.me,ctx.key).lastFlurry={tgt:e.tgt,tname:e.tname}}}}}})(onLog);
rollD20=(function(prev){return function(label,bonus,parts,opts){if(opts&&opts.aid){SH.myAtkLbl=SH.myAtkLbl||{};SH.myAtkLbl[opts.aid]=label}return prev(label,bonus,parts,opts)}})(rollD20);
// Berserker: exhaustion when a frenzied rage ends
ACT.rageEnd=(function(prev){return function(b){const u=b.dataset.u;const c=SH.chars[u];const fr=c&&c.frenzied;const r=prev(b);if(fr){const n=(c.exh||0)+1;saveChar(u,{frenzied:false,exh:n});addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} is worn out by the frenzy: exhaustion level ${n}.`,total:''})}return r}})(ACT.rageEnd);
// Thief: Fast Hands adds two choices to Cunning Action
ACT.maCunning=(function(prev){return function(b){const r=prev(b);const u=b.dataset.u;const c=SH.chars[u];if(SH.pk&&SH.pk.who==='opts'&&subIs(c.build,'rogue',/thief/i)&&DV(c).lvl>=3){const go=SH.pk.go;
  SH.pk.opts=[...SH.pk.opts,['obj','Use an object (Fast Hands)'],['soh','Sleight of Hand (Fast Hands)']];SH.pk.go=([k])=>{if(k==='obj'){addLog({by:SH.me,who:c.build.name,kind:'note',label:`🖐 ${c.build.name} uses an object with Fast Hands.`,total:''});render(true);return}
    if(k==='soh'){const s=DV(c).skills['Sleight of Hand'];rollD20('Sleight of Hand check (Fast Hands)',s.bonus,s.parts?partsText(s.parts):fmt(s.bonus),{uid:u});render(true);return}go([k])};render(true)}return r}})(ACT.maCunning);
// ================= Battle Master: superiority dice and manoeuvres =================
const bmDie=l=>l>=18?12:l>=10?10:8;
const MANEUVERS={trip:['Trip Attack','STR','Prone','after a hit · +die · STR save or prone'],push:['Pushing Attack','STR','','after a hit · +die · STR save or pushed 15 ft'],disarm:['Disarming Attack','STR','','after a hit · +die · STR save or drops an item'],
  menace:['Menacing Attack','WIS','Frightened','after a hit · +die · WIS save or frightened'],goad:['Goading Attack','WIS','','after a hit · +die · WIS save or disadvantage vs others'],dmg:['Extra damage','','','after a hit · +die damage']};
Object.assign(SPELL_COND,{'Trip Attack':'Prone','Menacing Attack':'Frightened'});
derive5=(function(prev){return function(b){const D=prev(b);const lvl=D.lvl;if(!subIs(b,'fighter',/battle ?master/i)||lvl<3)return D;const die=bmDie(lvl);
  D.res={...D.res,sup:{name:`Superiority dice (d${die})`,max:lvl>=15?6:lvl>=7?5:4,rest:'short'}};D.supDie=die;D.supDC=8+D.prof+Math.max(Math.floor(D.ab.STR/2)-5,Math.floor(D.ab.DEX/2)-5);
  D.feats=D.feats.flatMap(f=>{const m=/feature \(level (\d+)\)$/.exec(f[0]);if(!m)return[f];const L=+m[1];return L===3?[['Combat Superiority (Battle Master)',`Superiority dice (d${die}) power manoeuvres and come back on a short rest. Manoeuvre save DC ${D.supDC}. The sheet runs Trip, Pushing, Disarming, Menacing, Goading, Precision and Rally.`]]:L===7?[['Know Your Enemy (Battle Master)','Study a creature for 1 minute to learn how it compares to you.']]:L===10?[['Improved Combat Superiority (Battle Master)','Superiority dice become d10.']]:L===15?[['Relentless (Battle Master)','Regain one superiority die when you roll initiative with none left.']]:L===18?[['Improved Combat Superiority (Battle Master)','Superiority dice become d12.']]:[f]});return D}})(derive5);
function bmHTML(uid,c,D){if(!canEdit(uid)||!D.res||!D.res.sup)return'';const st=myTurnSt(uid);const S=st&&st!=='no'?st:null;const left=resLeft(c,D,'sup');const lh=S&&S.lastHit;
  const btn=(a,label,sub,dis,extra)=>`<button type="button" class="btn sm mact ${extra&&extra.includes('on')?'':''}" data-a="${a}" data-u="${uid}" ${dis?'disabled':''} ${extra||''}><b>${label}</b><small>${sub}</small></button>`;
  const B=[`<span class="gritn">Superiority ${left}/${D.res.sup.max} · d${D.supDie} · DC ${D.supDC}</span>`];
  if(S&&S.mv)B.push(`<span class="gritn">${esc(MANEUVERS[S.mv.k][0])} ready: tap the damage button</span>`);
  for(const [k,v] of Object.entries(MANEUVERS))B.push(btn('bmMove',v[0],v[3],left<1||!lh||!!(S&&S.mv),`data-k="${k}"`));
  B.push(btn('bmMove','Precision Attack',S&&S.prec?'ready: next attack':'+die to your next attack roll',left<1||!!(S&&S.prec),'data-k="prec"'));
  B.push(btn('bmMove','Rally','bonus · an ally gets die + CHA temp HP',left<1,'data-k="rally"'));
  return`<h2>Manoeuvres <small>Battle Master</small></h2><div class="macts">${B.join('')}</div>`}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const m=bmHTML(uid,c,D);if(!m)return h;const i=h.indexOf('<h2>Attacks');return i<0?m+h:h.slice(0,i)+m+h.slice(i)}})(pgActions);
ACT.bmMove=function(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const k=b.dataset.k;if(resLeft(c,D,'sup')<1){toast('No superiority dice left. A short rest brings them back.');return}const st=myTurnSt(u);if(st==='no'){toast('Not your turn yet.');return}
  if(k==='prec'){if(st)st.prec=1;spendRes(u,'sup');render(true);return}
  if(k==='rally'){if(!needEcon(b,st,'bonus','bonus action'))return;SH.pk={u,who:'allies',max:1,sel:[],title:'Rally: who gets temporary HP?',go:([id])=>{spendRes(u,'sup');rollDmg('Rally temporary HP',`1d${D.supDie}+${Math.max(0,abMod(D,'CHA'))}`,{uid:u,tempTo:id})}};render(true);return}
  const t=st&&st.lastHit;if(!t){toast('Hit first, then pick the manoeuvre before rolling damage.');return}
  if(!(st.hits||[]).some(h=>h.tgt===t.tgt)){toast('Pick the manoeuvre before you roll damage for that hit.');return}
  spendRes(u,'sup');st.mv={k,tgt:t.tgt,tname:t.tname};st.lastHit=null;render(true)};
// the manoeuvre die rides on the damage roll, then the save goes to the DM's device
applyRider=(function(prev){return function(label,expr,opts){[label,expr]=prev(label,expr,opts);const u=opts.uid;const st=u&&SH.chars[u]&&myTurnSt(u);const mv=st&&st!=='no'&&st.mv;if(!mv||!/ damage/.test(label)||opts.healTo||opts.tempTo||opts.tgt!==mv.tgt)return[label,expr];
  st.mv=null;const c=SH.chars[u];const D=DV(c);const [n,ab]=MANEUVERS[mv.k];
  if(ab)setTimeout(()=>foeList().some(f=>f.id===mv.tgt&&f.down)||addLog({by:SH.me,who:c.build.name,kind:'note',label:`⚔ ${c.build.name} uses ${n} on ${mv.tname}: ${ab} save DC ${D.supDC}.`,total:'',save:{ab,dc:D.supDC,h:false,tgts:[mv.tgt],tnames:[mv.tname],spell:n}}),500);
  return[label.replace(' damage',` + ${n==='Extra damage'?'superiority':n} damage`),expr+'+1d'+D.supDie]}})(applyRider);
rollD20=(function(prev){return function(label,bonus,parts,opts){const u=opts&&opts.uid;const st=u&&!opts.name&&SH.chars[u]&&/ attack\b/.test(label)&&myTurnSt(u);if(st&&st!=='no'&&st.prec){st.prec=0;const D=DV(SH.chars[u]);const n=1+Math.floor(Math.random()*D.supDie);
  return prev(label+` (Precision Attack +${n})`,bonus+n,`${parts} + Precision ${n}`,opts)}return prev(label,bonus,parts,opts)}})(rollD20);
