// ================= character creation: weapons, attacks, powers and features with full explanations =================
// What each weapon property means, in plain words.
const WPROPS={
  light:['Light','Small and handy. When you attack with a light weapon in one hand, you can use your bonus action to attack with another light weapon in the other hand (no ability bonus on that second hit\'s damage unless it is negative).'],
  finesse:['Finesse','You choose: use STR or DEX for both the attack and the damage. The sheet picks the higher one for you.'],
  heavy:['Heavy','Big and unwieldy. Small creatures attack with it at disadvantage.'],
  two:['Two-handed','You need both hands to attack with it, so no shield.'],
  versatile:['Versatile','One hand, or two hands for a bigger damage die (shown in brackets). The sheet uses the one-hand die; roll the bigger one yourself when you use both hands.'],
  reach:['Reach','You hit creatures up to 10 ft away instead of 5 ft, and enemies provoke your opportunity attack from 10 ft.'],
  thrown:['Thrown','You can throw it at the range shown and still use the same ability (STR, or DEX if it is finesse). Beyond the first number you attack with disadvantage.'],
  ammo:['Ammunition','Needs arrows, bolts or bullets. Range is shown as normal/long: beyond the first number you attack with disadvantage, beyond the second you cannot hit.'],
  loading:['Loading','Slow to reload: you fire it only once per action, bonus action or reaction, even if you have Extra Attack.'],
  monk:['Monk weapon','Monks can use DEX instead of STR and roll their Martial Arts die instead if it is bigger.'],
  firearm:['Firearm','Holds a few shots before you spend an action to reload. If the d20 shows the misfire number or lower, the gun jams and must be repaired with tinker\'s tools.'],
  lance:['Special','Disadvantage against a target within 5 ft. Needs two hands unless you are mounted.']};
// 5e weapons: [category, properties, range, description]
const WINFO={club:['Simple melee','light','','A heavy stick. Cheap, quiet and easy to find anywhere.'],dagger:['Simple melee','finesse light thrown','20/60','A short blade you can stab with or throw. Good as a backup or a second weapon.'],
  greatclub:['Simple melee','two','','A big two-handed club for strong, simple fighters.'],handaxe:['Simple melee','light thrown','20/60','A small axe for chopping or throwing. Barbarians often carry two.'],
  javelin:['Simple melee','thrown','30/120','A light spear made for throwing at enemies before they reach you.'],lighthammer:['Simple melee','light thrown','20/60','A small hammer, balanced for throwing.'],
  mace:['Simple melee','','','A flanged club with a metal head. Popular with clerics.'],quarterstaff:['Simple melee','versatile monk','','A long wooden staff. One hand d6, two hands d8.','1d8'],
  sickle:['Simple melee','light','','A curved farming blade.'],spear:['Simple melee','thrown versatile monk','20/60','The classic: stab, throw, or hold with both hands for d8.','1d8'],
  lightcrossbow:['Simple ranged','ammo loading two','80/320','A crossbow anyone can use. Hits hard but fires once per action.'],dart:['Simple ranged','finesse thrown','20/60','Small throwing darts.'],
  shortbow:['Simple ranged','ammo two','80/320','A small bow, easy to carry and quick to shoot.'],sling:['Simple ranged','ammo','30/120','A leather strap that hurls stones. Leaves a hand free.'],
  battleaxe:['Martial melee','versatile','','A broad axe. One hand d8, two hands d10.','1d10'],flail:['Martial melee','','','A spiked ball on a chain.'],
  glaive:['Martial melee','heavy reach two','','A blade on a long pole: hit enemies 10 ft away.'],greataxe:['Martial melee','heavy two','','The biggest damage die in the game (d12). A barbarian favourite.'],
  greatsword:['Martial melee','heavy two','','A huge two-handed sword: 2d6, so steady damage.'],halberd:['Martial melee','heavy reach two','','An axe blade on a pole: 10 ft reach.'],
  lance:['Martial melee','reach lance','','A long spear for mounted charges.'],longsword:['Martial melee','versatile','','The knight\'s sword. One hand d8 (with a shield), two hands d10.','1d10'],
  maul:['Martial melee','heavy two','','A massive two-handed hammer: 2d6.'],morningstar:['Martial melee','','','A spiked club.'],pike:['Martial melee','heavy reach two','','A very long spear: 10 ft reach.'],
  rapier:['Martial melee','finesse','','A thin duelling blade: d8 with DEX. The best one-handed finesse weapon.'],scimitar:['Martial melee','finesse light','','A curved, light sword (a pirate cutlass). Good for two-weapon fighting.'],
  shortsword:['Martial melee','finesse light monk','','A short stabbing sword. Light and finesse, so rogues and monks love it.'],trident:['Martial melee','thrown versatile','20/60','A three-pronged fishing spear.','1d8'],
  warpick:['Martial melee','','','A pick made to punch through armor.'],warhammer:['Martial melee','versatile','','A war hammer. One hand d8, two hands d10.','1d10'],
  whip:['Martial melee','finesse reach','','A whip: little damage, but it reaches 10 ft and uses DEX.'],handcrossbow:['Martial ranged','ammo light loading','30/120','A one-handed crossbow.'],
  heavycrossbow:['Martial ranged','ammo heavy loading two','100/400','A big crossbow: d10, long range, one shot per action.'],longbow:['Martial ranged','ammo heavy two','150/600','The longest range of any bow. The archer\'s choice.'],
  unarmed:['Unarmed','','','Punches, kicks and headbutts: 1 + STR damage, or your Martial Arts die as a monk.'],
  pistol:['Firearm','firearm','60/240','A single pistol: d10, 4 shots before reloading, misfire on a 1.'],musket:['Firearm','firearm two','120/360','A long gun: d12, one shot, misfire on 1-2.'],
  pepperbox:['Firearm','firearm','80/320','A many-barrelled pistol: 6 shots, misfire on 1-2.'],blunderbuss:['Firearm','firearm','15/60','A scattergun: 2d8 up close, one shot, misfire on 1-2.'],badnews:['Firearm','firearm two','200/800','A heavy rifle: 2d12, very long range, one shot, misfire on 1-3.']};
const DTYPE_TXT={slashing:'slashing (blades, axes)',piercing:'piercing (points, arrows, bullets)',bludgeoning:'bludgeoning (blunt blows)'};
function wPropsList(props){return String(props||'').split(/\s+/).filter(Boolean).map(p=>WPROPS[p]).filter(Boolean)}
function wCardHTML5(k,on){const w=R5.weapons[k];if(!w)return'';const I=WINFO[k]||['','','',''];const P=wPropsList(I[1]);
  return`<button type="button" class="wcard ${on?'on':''}" data-a="bChip" data-f="weps" data-v="${k}" data-max="8" aria-pressed="${on}"><b>${esc(w[0])}</b><span class="wd">${esc(w[1]==='1'?'1':w[1])}${I[4]?` (${esc(I[4])})`:''} ${esc(w[2])}</span><small>${esc(I[0])}${P.length?' · '+P.map(p=>p[0].toLowerCase()).join(', '):''}${I[2]?' · '+I[2]+' ft':''}</small><em>${esc(I[3])}</em></button>`}
function weaponPicker5(b){const groups={};for(const k of Object.keys(R5.weapons)){const g=(WINFO[k]||['Other'])[0]||'Other';(groups[g]=groups[g]||[]).push(k)}
  const picked=b.weps||[];
  return`<h2>Weapons <small>tap to carry (up to 8) · ${picked.length} picked</small></h2>
  ${Object.entries(groups).map(([g,ks])=>`<details class="add wgroup" ${ks.some(k=>picked.includes(k))||g.startsWith('Simple melee')?'open':''}><summary>${esc(g)} <small>${ks.filter(k=>picked.includes(k)).map(k=>R5.weapons[k][0]).join(', ')}</small></summary><div class="wcards">${ks.map(k=>wCardHTML5(k,picked.includes(k))).join('')}</div></details>`).join('')}
  <details class="add"><summary>What the weapon words mean</summary><dl class="gloss">${Object.values(WPROPS).map(([n,t])=>`<dt>${esc(n)}</dt><dd>${esc(t)}</dd>`).join('')}</dl></details>`}
function weaponPickerOp(b){const L=weaponsFor(b);
  return`<h2>Weapon <small>pick one; your class decides what fits</small></h2><div class="wcards">${L.map(k=>{const w=WEAPONS[k];const on=k===b.weapon;
    const rng=w.range?`range ${w.range[0]*5}/${w.range[1]*5} ft`:'reach 5 ft';const ab={STR:'STR',DEX:'DEX',FIN:'STR or DEX (finesse)',MA:'STR or DEX (Martial Arts)'}[w.abil]||w.abil;
    return`<button type="button" class="wcard ${on?'on':''}" data-a="bPickW" data-k="${k}" aria-pressed="${on}"><b>${esc(w.name)}</b><span class="wd">${w.n}d${w.d}${w.flat?' +'+w.flat:''}</span><small>${esc(ab)} · ${rng}</small><em>${esc(w.note||'')}</em></button>`}).join('')}</div>`}
ACT.bPickW=function(b){if(!SH.edit)return;SH.edit.b.weapon=b.dataset.k;render()};
// ---- how an attack's numbers are made ----
function atkExplainHTML(a,D,opts){opts=opts||{};const parts=a.atkParts||[];const k=Object.entries(R5.weapons).find(([,w])=>w[0]===a.name);const I=k?WINFO[k[0]]:null;const lines=[];
  const ab=parts.find(p=>ABS.includes(p[0]));
  lines.push(`<p><b>To hit ${fmt(a.atk)}:</b> d20 ${parts.length?parts.map(p=>`+ ${esc(p[0]==='Proficiency'?'proficiency':p[0])} ${p[1]}`).join(' '):fmt(a.atk)}.</p>`);
  if(a.dmg){const dm=/^(\d+d\d+)?([+-]\d+)?$/.exec(String(a.dmg).replace(/\s/g,''));const ty=(String(a.note||'').split(/[,·]/)[0]||'').trim();
    lines.push(`<p><b>Damage ${esc(a.dmg)}:</b> ${dm&&dm[1]?esc(dm[1]):'flat'}${dm&&dm[2]?` + ${ab?ab[0]:'bonus'} ${esc(dm[2].replace('+',''))}`:''}${DTYPE_TXT[ty]?', '+esc(DTYPE_TXT[ty]):ty?', '+esc(ty):''}.</p>`)}
  if(I){const P=wPropsList(I[1]);if(I[2])lines.push(`<p><b>Range ${esc(I[2])} ft.</b></p>`);for(const [n,t] of P)lines.push(`<p><b>${esc(n)}:</b> ${esc(t)}</p>`);if(I[3])lines.push(`<p>${esc(I[3])}</p>`)}
  else if(a.note)lines.push(`<p>${esc(a.note)}</p>`);
  if(a.desc)lines.push(`<p>${esc(a.desc)}</p>`);
  if(D&&D.sneak&&(I?/finesse|ammo/.test(I[1]):/finesse|range/i.test(a.note||'')))lines.push(`<p><b>Sneak Attack:</b> once per turn this weapon can add ${D.sneak}d6 when you have advantage or an ally is next to the target.</p>`);
  return lines.join('')}
// custom attacks: numbers follow the ability scores
function catkNums(D,a){if(!a.ab)return{atk:+a.bonus||0,dmg:a.dmg,parts:null};const m=a.ab==='none'?0:Math.floor(((D.ab||{})[a.ab]||10)/2)-5;const parts=[];if(a.ab!=='none')parts.push([a.ab,m]);if(a.prof)parts.push(['Proficiency',D.prof||2]);if(+a.xb)parts.push(['Bonus',+a.xb]);
  const dm=(a.dmod&&a.ab!=='none'?m:0)+(+a.xd||0);return{atk:parts.reduce((s,p)=>s+p[1],0),dmg:a.dice?a.dice+(dm?fmt(dm):''):(dm?String(dm):''),parts}}
atkById=(function(prev){return function(u,id){const c=SH.chars[u];const a=c&&(c.catk||[]).find(x=>x.id===id);if(a&&a.ab){const N=catkNums(DV(c),a);return{name:a.name,atk:N.atk,dmg:N.dmg,atkParts:N.parts,note:a.note}}return prev(u,id)}})(atkById);
// ---- the builder section ----
const BTN_FEATS=/^(Second Wind|Action Surge|Flurry of Blows|Patient Defense|Step of the Wind|Stunning Strike|Sneak Attack|Cunning Action|Uncanny Dodge|Rage|Frenzy|Ki|Martial Arts|Machine Gun Blows|Brace for Impact|Brute Force|Blood for Brawn|Thrill of the Fight|Rampage|Adept Marksman|Combat Superiority|Open Hand Technique|Wholeness of Body|Fast Hands)/;
function bExtra(){const E=SH.edit;if(!E.extra){const c=SH.chars[E.uid]||{};E.extra={catk:clone(c.catk||[]),cfeat:clone(c.cfeat||[]),cres:clone(c.cres||[]),spells:clone(c.spells||[])}}return E.extra}
function bDV(){const E=SH.edit;const b=clone(E.b);try{applyPool(b)}catch(e){}const X=bExtra();const c={...newCharDoc(b),catk:X.catk,cres:X.cres,spells:X.spells};try{return[c,DV(c)]}catch(e){return[c,null]}}
function spellExplain(sp){const bits=[];const ct=(CT[sp.ct]||CT.A)[1];bits.push(`${sp.l?'Level '+sp.l:'Cantrip (free, as often as you like)'} · ${ct} · ${esc(sp.rg)}${sp.conc?' · concentration (ends if you cast another concentration spell, or fail a CON save when hurt)':''}`);
  if(sp.k==='atk')bits.push(`Make a spell attack${sp.r?` (${sp.r} beam${sp.r>1?'s':''})`:''}; on a hit: ${esc(sp.d)} ${esc(sp.t)} damage.`);
  if(sp.k==='save')bits.push(`Each target makes a ${esc(sp.ab)} save against your spell DC${sp.d?`; on a failure ${esc(sp.d)} ${esc(sp.t)} damage${sp.h?', half on a success':''}`:''}.${sp.tn?` Up to ${sp.tn} targets.`:''}`);
  if(sp.k==='auto')bits.push(`No roll needed: ${esc(sp.d)} ${esc(sp.t)} damage.`);if(sp.k==='heal')bits.push(`Heals ${esc(sp.d)}${sp.mod?' + your spellcasting modifier':''}.`);if(sp.k==='temp')bits.push(`Gives ${esc(sp.d)} temporary HP.`);
  if(sp.u)bits.push(`Cast with a higher slot: +${esc(sp.u)} per level above ${sp.l}.`);if(sp.c||sp.rc)bits.push('Grows stronger at character levels 5, 11 and 17.');
  return`<p class="spmeta">${bits.join(' ')}</p><p>${esc(sp.txt||'')}</p>`}
function bSpellsHTML(c,D){const L=classSpells(c);const CI=D&&D.spell?casterInfo(c,D):null;if(!L.length||!CI)return'';const X=bExtra();const have=new Set(X.spells.map(s=>spellKey2(s.name)));const max=CI.maxLvl;
  const byL={};for(const s of L){if(s.l>max)continue;(byL[s.l]=byL[s.l]||[]).push(s)}const nm=c.build.rules==='5e'?'spells':'powers';
  return`<h2>${c.build.rules==='5e'?'Spells':'Powers'} <small>${X.spells.length} picked${D.spell.prep?` · you can prepare ${D.spell.prep}`:''} · save DC ${D.spell.dc} · spell attack ${fmt(D.spell.atk)}</small></h2>
  <p class="hint">Tap to add a ${nm.slice(0,-1)} to your sheet. Open one to read exactly what it does. You can change them later on the Actions page.</p>
  ${Object.entries(byL).map(([l,ss])=>`<details class="add" ${+l<=1?'open':''}><summary>${+l?'Level '+l:'Cantrips'} <small>${ss.filter(s=>have.has(spellKey2(s.n))).length} picked</small></summary><div class="bspells">${ss.map(s=>{const sp=spellFind(s.n);const on=have.has(spellKey2(s.n));
    return`<div class="bspell ${on?'on':''}"><button type="button" class="chip tog ${on?'on':''}" data-a="bSpell" data-k="${esc(s.n)}" data-l="${s.l}" aria-pressed="${on}">${on?'✓ ':'+ '}${esc(s.n)}</button><details><summary>What it does</summary>${sp?spellExplain(sp):'<p>From your class list in the book. Ask the DM how it works.</p>'}</details></div>`}).join('')}</div></details>`).join('')}`}
function bCustomHTML(D){const X=bExtra();const abOpt=ABS.map(a=>`<option value="${a}">${a} (${fmt(Math.floor(((D&&D.ab||{})[a]||10)/2)-5)})</option>`).join('');
  const list=[...X.catk.map(a=>{const N=D?catkNums(D,a):{atk:+a.bonus||0,dmg:a.dmg};return`<details class="bcust"><summary><b>⚔ ${esc(a.name)}</b> <span>${fmt(N.atk)} to hit · ${esc(N.dmg||'no damage')}</span> <button type="button" class="btn xs" data-a="bxDel" data-f="catk" data-k="${a.id}" aria-label="Remove ${esc(a.name)}">✕</button></summary>${atkExplainHTML({...a,atk:N.atk,dmg:N.dmg,atkParts:N.parts},D)}</details>`}),
    ...X.cfeat.map(f=>`<details class="bcust"><summary><b>✦ ${esc(f.name)}</b> <span>${esc(f.kind||'feature')}${f.uses?` · ${f.uses} use${f.uses>1?'s':''}`:''}</span> <button type="button" class="btn xs" data-a="bxDel" data-f="cfeat" data-k="${f.id}" aria-label="Remove ${esc(f.name)}">✕</button></summary><p>${esc(f.text||'')}</p></details>`)].join('');
  return`<h2>Your own attacks and powers <small>homebrew, Devil Fruit tricks, signature moves</small></h2>
  ${list?`<div class="feats">${list}</div>`:'<p class="hint">Nothing added yet. Anything you add here shows up on your sheet with its description.</p>'}
  <details class="add"><summary>+ Add an attack</summary><div class="form bform">
    <label class="fl">Name<input id="bxN" maxlength="40" placeholder="e.g. Oni Giri, Gum-Gum Pistol, Flaming cutlass"></label>
    <div class="row"><label class="fl">Ability<select id="bxA">${abOpt}<option value="none">None</option></select></label><label class="ck"><input type="checkbox" id="bxP" checked> Proficient (+${D?D.prof:2})</label><label class="fl">Extra to hit<input id="bxXB" type="number" inputmode="numeric" placeholder="0"></label></div>
    <div class="row"><label class="fl">Damage dice<input id="bxD" maxlength="16" placeholder="e.g. 1d8 or 2d6"></label><label class="ck"><input type="checkbox" id="bxM" checked> Add the ability to damage</label><label class="fl">Damage type<select id="bxT">${DTYPES.map(t=>`<option>${t}</option>`).join('')}</select></label></div>
    <label class="fl">Range or reach<input id="bxR" maxlength="30" placeholder="e.g. reach 5 ft, or 60/240 ft"></label>
    <label class="fl">What it does<textarea id="bxW" rows="3" maxlength="600" placeholder="Describe the move: how it looks, what it does, any extra effect the DM agreed to."></textarea></label>
    <button type="button" class="btn pri" data-a="bxAtk">Add attack</button></div></details>
  <details class="add"><summary>+ Add a power or feature</summary><div class="form bform">
    <label class="fl">Name<input id="bfN" maxlength="50" placeholder="e.g. Iron Body, Lucky charm, Sea legs"></label>
    <div class="row"><label class="fl">How you use it<select id="bfK"><option value="always on">Always on</option><option value="action">Action</option><option value="bonus action">Bonus action</option><option value="reaction">Reaction</option></select></label>
      <label class="fl">Uses<input id="bfU" type="number" inputmode="numeric" min="0" max="20" placeholder="unlimited"></label><label class="fl">Comes back<select id="bfR"><option value="long">on a long rest</option><option value="short">on a short rest</option><option value="none">never</option></select></label></div>
    <label class="fl">What it does<textarea id="bfW" rows="4" maxlength="800" placeholder="Explain it fully: what happens, how long it lasts, any save (e.g. DC = 8 + proficiency + ability)."></textarea></label>
    <button type="button" class="btn pri" data-a="bxFeat">Add power or feature</button></div></details>`}
function bAttacksHTML(){const [c,D]=bDV();if(!D)return'';const b=c.build;
  const atks=(D.attacks||[]).map(a=>`<details class="batk"><summary><b>${esc(a.name)}</b> <span>${fmt(a.atk)} to hit · ${esc(a.dmg||'—')}</span></summary>${atkExplainHTML(a,D)}</details>`).join('');
  const feats=(D.feats||[]).map(f=>`<details class="bfeat"><summary>${esc(f[0])}${BTN_FEATS.test(f[0])?' <small class="tagbtn">button on your sheet</small>':''}</summary><p>${esc(f[1])}</p></details>`).join('');
  return`<div class="bextra"><h2>Your attacks <small>${D.nAtk>1?D.nAtk+' per Attack action · ':''}open one to see how the numbers are made</small></h2>
  <p class="hint">To attack, roll a d20 and add the to-hit number. You hit if you match or beat the target's Armor Class. A natural 20 always hits and is a critical hit (roll the damage dice twice); a natural 1 always misses. Damage types matter: some creatures resist or ignore a type.</p><div class="feats">${atks||'<p class="hint">No weapons yet. Pick one above.</p>'}</div>
  <h2>What you can do at level ${b.level} <small>${esc(D.clsName||'')}</small></h2><div class="feats">${feats||'<p class="hint">Nothing yet.</p>'}</div>
  ${bSpellsHTML(c,D)}${bCustomHTML(D)}</div>`}
builderHTML=(function(prev){return function(){let h=prev();const b=SH.edit&&SH.edit.b;if(!b)return h;let x='';try{x=bAttacksHTML()}catch(e){console.warn(e)}
  const i=h.lastIndexOf('<div class="hintbox"><p><b>');const j=i>=0?i:h.lastIndexOf('<button type="button" class="btn pri big" data-a="bSave"');return h.slice(0,j)+x+h.slice(j)}})(builderHTML);
Object.assign(ACT,{
  bSpell(b){const X=bExtra();const n=b.dataset.k;const i=X.spells.findIndex(s=>spellKey2(s.name)===spellKey2(n));if(i>=0)X.spells.splice(i,1);else X.spells.push({id:uidNew(),name:n,lvl:+b.dataset.l});render()},
  bxDel(b){const X=bExtra();const f=b.dataset.f;const it=X[f].find(x=>x.id===b.dataset.k);X[f]=X[f].filter(x=>x.id!==b.dataset.k);if(f==='cfeat'&&it&&it.res)X.cres=X.cres.filter(r=>r.id!==it.res);render()},
  bxAtk(){const X=bExtra();const name=val('bxN').trim();if(!name){toast('Give the attack a name.');return}const dice=val('bxD').trim().replace(/\s/g,'');if(dice&&!parseDice(dice)){toast('Write damage dice like 1d8 or 2d6.');return}
    const ab=val('bxA');const rng=val('bxR').trim();const t=val('bxT');X.catk.push({id:uidNew(),name,ab,prof:q('#bxP').checked,xb:Math.round(num('bxXB'))||0,dice,dmod:q('#bxM').checked,note:[t,rng].filter(Boolean).join(', '),desc:val('bxW').trim()});render()},
  bxFeat(){const X=bExtra();const name=val('bfN').trim();if(!name){toast('Give it a name.');return}const uses=Math.round(num('bfU'))||0;const kind=val('bfK');const id=uidNew();let res=null;
    if(uses>0){res=uidNew();X.cres.push({id:res,name,max:uses,rest:val('bfR')})}X.cfeat.push({id,name,kind,uses,res,text:(kind!=='always on'?`(${kind[0].toUpperCase()+kind.slice(1)}) `:'')+val('bfW').trim()});render()}});
// creating or saving the character keeps what was added here
builderSave=(function(prev){return function(){const E=SH.edit;const X=E&&E.extra;const uid=E&&E.uid;prev();if(X&&!SH.edit&&SH.chars[uid])saveChar(uid,{catk:X.catk,cfeat:X.cfeat,cres:X.cres,spells:X.spells})}})(builderSave);
