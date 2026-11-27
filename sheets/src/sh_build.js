// ================= making a character, and levelling up =================
const R5_ARMOR_DEFAULT={barbarian:'none',bard:'leather',cleric:'scale',druid:'leather',fighter:'chain',monk:'none',paladin:'chain',ranger:'scale',rogue:'leather',sorcerer:'none',warlock:'leather',wizard:'none'};
const R5_SHIELD_DEFAULT={cleric:true,druid:true,paladin:true};
function opDefault(){const b=defaultBuild();b.rules='op';b.poolIdx={};ABS.forEach((a,i)=>b.poolIdx[a]=i);return b}
function r5New(){const b=r5Default();b.method='array';b.pool=STD_ARRAY.slice();b.poolIdx={};ABS.forEach((a,i)=>b.poolIdx[a]=i);r5ClassDefaults(b);return b}
function r5ClassDefaults(b){const cl=R5.classes[b.cls];b.classSkills=[];b.expertise=[];b.weps=(cl.start||[]).slice();b.armor=R5_ARMOR_DEFAULT[b.cls]||'none';b.shield=!!R5_SHIELD_DEFAULT[b.cls]}
function opClassDefaults(b){b.classSkills=[];b.expertise=[];b.weapon=weaponsFor(b)[0];b.subclass=null}
function openBuilder(uid){const c=SH.chars[uid];let b;if(c&&c.build)b=clone(c.build);else{b=RULES()==='5e'?r5New():opDefault();const sl=+SH.state.startLevel||1;if(sl>1)b.level=Math.min(sl,b.rules==='5e'?20:10)}
  if(!b.pool){b.method='manual'}SH.edit={uid,b,isNew:!(c&&c.build),errs:[]};render()}
function applyPool(b){if(b.method==='manual')return;for(const a of ABS)b.scores[a]=b.pool[b.poolIdx[a]]}
function expCount(b){if(b.rules==='5e'){const e=(R5.classes[b.cls]||{}).expertise||{};return Object.entries(e).filter(([L])=>+L<=b.level).reduce((s,[,n])=>s+n,0)}return(CLASSES[b.cls]||{}).expertise||0}
function chipsHTML(field,all,picked,max){return`<div class="chipset" data-f="${field}" data-max="${max}">${all.map(s=>`<button type="button" class="chip tog ${picked.includes(s)?'on':''}" data-a="bChip" data-f="${field}" data-v="${esc(s)}" data-max="${max}">${esc(s)}</button>`).join('')}</div>`}
function builderHTML(){const E=SH.edit;const b=E.b;const r5=b.rules==='5e';const SP=r5?R5.species:SPECIES;const CL=r5?R5.classes:CLASSES;const sp=SP[b.species];const cl=CL[b.cls];
  let D=null;try{D=r5?derive5(b):derive(b)}catch(e){}
  const picks=r5?(b.flex?[2,1]:(sp.pick||[])):asiOf(b).picks;const sub=!r5&&sp.subs?sp.subs[b.sub]:null;
  const profNow=D?Object.keys(D.skills).filter(s=>D.skills[s].prof):[];const nExp=expCount(b);
  const subLvl=r5?cl.subLvl:c2SubLevel(b.cls);
  return`<div class="builder"><div class="hero"><div class="hn"><h1>${E.isNew?'New character':'Edit '+esc(b.name||'character')}</h1><div class="sub">${r5?'D&D 5e':'One Piece · Dungeons & Devil Fruits'}</div></div><button type="button" class="btn sm" data-a="bCancel">Cancel</button></div>
  <label class="fl">Name<input data-c="bText" data-f="name" value="${esc(b.name)}" maxlength="30" placeholder="Character name"></label>
  ${speciesPickHTML(b)}
  ${r5?`<label class="ck"><input type="checkbox" data-c="bFlex" ${b.flex?'checked':''}> Choose my own ability bonuses (+2 and +1) instead of the species ones</label>`:''}
  ${picks.map((v,i)=>`<label class="fl">Ability bonus +${v}<select data-c="bAsi" data-i="${i}"><option value="">Choose…</option>${ABS.map(a=>`<option ${(b.asiPicks||[])[i]===a?'selected':''}>${a}</option>`).join('')}</select></label>`).join('')}
  ${sub&&sub.skillPick?`<label class="fl">${esc(sub.name)} skill<select data-c="bSel" data-f="speciesPick"><option value="">Choose…</option>${sub.skillPick.map(s=>`<option ${b.speciesPick===s?'selected':''}>${s}</option>`).join('')}</select></label>`:''}
  <details class="add" open data-dk="sptraits"><summary>${esc(sp.name)} traits</summary><div class="hintbox">${[...(sp.traits||[]),...((sub&&sub.traits)||[])].map(t=>`<p>${esc(t)}</p>`).join('')}</div></details>
  ${classPickHTML(b)}
  ${b.level>=subLvl?(r5?`<label class="fl">${esc(cl.subName)}<input data-c="bText" data-f="subclass" value="${esc(b.subclass||'')}" maxlength="40" placeholder="e.g. ${esc(R5.srdSub[b.cls])}"></label>`:(SUBCLASSES[b.cls]||[]).length?`<label class="fl">Subclass<select data-c="bSel" data-f="subclass"><option value="">Choose…</option>${SUBCLASSES[b.cls].filter(s=>!s.legacy||s.key===b.subclass).map(s=>`<option value="${s.key}" ${b.subclass===s.key?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`:''):''}
  ${r5?`<label class="fl">Armor<select data-c="bSel" data-f="armor">${Object.entries(R5.armor).map(([k,a])=>`<option value="${k}" ${k===(b.armor||'none')?'selected':''}>${esc(a.name)} (${a.base}${a.dex===99?' + DEX':a.dex===2?' + DEX max 2':''})</option>`).join('')}</select></label>
    <label class="ck"><input type="checkbox" data-c="bShield" ${b.shield?'checked':''}> Carries a shield (+2 AC)</label>
    ${weaponPicker5(b)}`
    :weaponPickerOp(b)}
  <h2>Ability scores</h2><div class="row"><select data-c="bMethod" aria-label="How to set ability scores"><option value="array" ${b.method==='array'?'selected':''}>Standard array (15, 14, 13, 12, 10, 8)</option><option value="roll" ${b.method==='roll'?'selected':''}>Roll 4d6, drop the lowest</option><option value="manual" ${b.method==='manual'?'selected':''}>Type them in</option></select>
    ${b.method==='roll'?`<button type="button" class="btn" data-a="bRoll" ${b.rolled&&!SH.owner?'disabled':''}>${b.rolled?'Rolled':'🎲 Roll'}</button>`:''}</div>
  ${b.method==='roll'&&!b.rolled?'<p class="hint">The six results are shown to the whole table, and you only roll once.</p>':''}
  <div class="abil build">${ABS.map(a=>{const tot=D?D.ab[a]:b.scores[a];return`<label class="ab"><small>${a}</small>${b.method==='manual'?`<input type="number" inputmode="numeric" min="1" max="30" value="${b.scores[a]}" data-c="bScore" data-k="${a}" aria-label="${ABN[a]}">`:`<select data-c="bPool" data-k="${a}" aria-label="${ABN[a]}">${b.pool.map((v,i)=>`<option value="${i}" ${b.poolIdx[a]===i?'selected':''}>${v}</option>`).join('')}</select>`}<span>= ${tot} (${fmt(mod(tot))})</span></label>`}).join('')}</div>
  <h2>Skills</h2><p class="hint">${esc(cl.name)}: choose ${cl.pick}.</p>${chipsHTML('classSkills',(cl.list||Object.keys(SKILLS)),b.classSkills||[],cl.pick)}
  <p class="hint">Background: choose any 2.</p>${chipsHTML('bgSkills',Object.keys(SKILLS).filter(s=>!(b.classSkills||[]).includes(s)),b.bgSkills||[],2)}
  ${r5?`<label class="fl">Background<input data-c="bText" data-f="background" value="${esc(b.background||'')}" maxlength="40" placeholder="e.g. Sailor, Acolyte, Outlander"></label>`:''}
  ${nExp?`<p class="hint">Expertise: choose ${nExp} skills you are proficient in.</p>${chipsHTML('expertise',profNow,b.expertise||[],nExp)}`:''}
  <details class="add" ${(b.extraSkills||[]).length||(r5&&sp.skillAny)?'open':''}><summary>Extra skill proficiencies${r5&&sp.skillAny?` (${esc(sp.name)}: choose ${sp.skillAny})`:' (species, feats or the DM)'}</summary>${chipsHTML('extraSkills',Object.keys(SKILLS),b.extraSkills||[],18)}</details>
  ${r5?'':`<label class="fl">Origin feat<select data-c="bSel" data-f="feat">${Object.entries(FEATS).map(([k,f])=>`<option value="${k}" ${k===b.feat?'selected':''}>${esc(f.name)}: ${esc(f.desc)}</option>`).join('')}</select></label>
    ${b.feat==='skilled'?`<p class="hint">Skilled: choose 3 more skills.</p>${chipsHTML('featSkills',Object.keys(SKILLS),b.featSkills||[],3)}`:''}`}
  ${SH.owner?`<label class="fl">Level (only the DM can set this)<input type="number" inputmode="numeric" min="1" max="${r5?20:10}" value="${b.level}" data-c="bLevel"></label>`:''}
  ${D?`<div class="hintbox"><p><b>${D.maxhp} HP</b> · AC ${D.ac} · speed ${D.speed} · initiative ${fmt(D.init)}</p></div>`:''}
  ${E.errs.length?`<div class="errs">${E.errs.map(e=>`<p>${esc(e)}</p>`).join('')}</div>`:''}
  <button type="button" class="btn pri big" data-a="bSave">${E.isNew?'Create character':'Save changes'}</button></div>`}
function builderSave(){const E=SH.edit;const b=E.b;applyPool(b);b.name=String(b.name||'').trim();
  const errs=b.rules==='5e'?r5Validate(b):validateBuild(b);
  if(b.method==='roll'&&!b.rolled)errs.push('Roll your ability scores first.');
  if(b.rules!=='5e'){const n=expCount(b);if(n&&(b.expertise||[]).length!==n&&!errs.some(e=>/Expertise/.test(e)))errs.push(`Choose ${n} Expertise skills.`)}
  if(errs.length){E.errs=errs;render();const el=q('.errs');if(el)el.scrollIntoView({block:'center'});return}
  const old=SH.chars[E.uid];let c;if(old&&old.build){c={...old,build:b};const D=DV(c);c.hp=Math.min(D.maxhp,old.hp+(Math.max(0,D.maxhp-DV(old).maxhp)))}else{c=newCharDoc(b);if(old)c={...old,...c}}
  put('chars/'+E.uid,c);if(E.isNew)addLog({by:SH.me,who:b.name,kind:'note',label:`${b.name} joins the table: ${DV(c).speciesName} ${DV(c).clsName} ${b.level}.`,total:''});
  SH.edit=null;SH.tab='main';announce();render();window.scrollTo(0,0)}

// ---------------- level up ----------------
function luInfo(c){const b=c.build;const L=b.level+1;const r5=b.rules==='5e';
  if(r5){const cl=R5.classes[b.cls];return{L,hd:cl.hd,feats:(cl.feats[L]||[]).map(f=>[f[0],f[1]]),needSub:L>=cl.subLvl&&!b.subclass,subFree:true,subName:cl.subName,asi:cl.asi.includes(L),exp:(cl.expertise||{})[L]||0,subFeat:(R5.subLevels[b.cls]||[]).includes(L)}}
  const feats=((LEVEL_FEATS[b.cls]||{})[L]||[]);return{L,hd:CLASSES[b.cls].hd,feats:feats.map(f=>[f[0],f[1]]),needSub:L>=c2SubLevel(b.cls)&&!b.subclass&&(SUBCLASSES[b.cls]||[]).length>0,subName:'Subclass',asi:feats.some(f=>f[0]==='Ability Score Improvement'),exp:b.cls==='rogue'&&L===6?2:0}}
function luHTML(){const U=SH.lu;const c=SH.chars[U.uid];const b=c.build;const I=luInfo(c);const D=DV(c);const avg=I.hd/2+1;const r5=b.rules==='5e';
  const featOpts=r5?[]:Object.entries(FEATS).filter(([k])=>k!=='skilled'&&!D.hasF(k));
  return`<div class="builder"><div class="hero"><div class="hn"><h1>${esc(b.name)}: level ${I.L}</h1><div class="sub">${esc(D.clsName)}</div></div><button type="button" class="btn sm" data-a="luCancel">Cancel</button></div>
  <h2>What you get</h2><div class="feats">${I.feats.map(f=>`<details open><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')||'<p class="hint">More hit points'+(I.subFeat?' and a subclass feature (add it under Custom features)':'')+'.</p>'}${I.subFeat&&I.feats.length?'<p class="hint">Plus a subclass feature: add it under Custom features.</p>':''}</div>
  <h2>Hit points</h2><div class="row"><button type="button" class="btn ${U.hp&&U.hpHow==='roll'?'pri':''}" data-a="luRoll" ${U.hpHow==='roll'?'disabled':''}>🎲 Roll d${I.hd}</button><button type="button" class="btn ${U.hpHow==='avg'?'pri':''}" data-a="luAvg" ${U.hpHow==='roll'?'disabled':''}>Take ${avg}</button></div>
  ${U.hp?`<p class="hintbox"><b>+${U.hp+mod(D.ab.CON)} HP</b> (${U.hpHow==='roll'?'rolled':'average'} ${U.hp} ${fmt(mod(D.ab.CON))} CON)</p>`:'<p class="hint">A roll is shown to the table and cannot be taken back.</p>'}
  ${I.needSub?`<h2>${esc(I.subName)}</h2>${r5?`<input data-c="luText" data-f="sub" value="${esc(U.sub||'')}" maxlength="40" placeholder="e.g. ${esc(R5.srdSub[b.cls])}">`:`<select data-c="luText" data-f="sub"><option value="">Choose…</option>${SUBCLASSES[b.cls].filter(s=>!s.legacy).map(s=>`<option value="${s.key}" ${U.sub===s.key?'selected':''}>${esc(s.name)}: ${esc(s.flavor)}</option>`).join('')}</select>`}`:''}
  ${I.asi?`<h2>Ability Score Improvement</h2><select data-c="luText" data-f="mode"><option value="two" ${U.mode==='two'?'selected':''}>+2 to one ability</option><option value="split" ${U.mode==='split'?'selected':''}>+1 to two abilities</option><option value="feat" ${U.mode==='feat'?'selected':''}>Take a feat instead</option></select>
    ${U.mode==='feat'?(r5?`<input data-c="luText" data-f="feat" value="${esc(U.feat||'')}" maxlength="40" placeholder="Feat name (add what it does under Custom features)">`:`<select data-c="luText" data-f="feat"><option value="">Choose…</option>${featOpts.map(([k,f])=>`<option value="${k}" ${U.feat===k?'selected':''}>${esc(f.name)}: ${esc(f.desc)}</option>`).join('')}</select>`)
      :`<div class="row"><select data-c="luText" data-f="a1" aria-label="First ability"><option value="">Choose…</option>${ABS.map(a=>`<option ${U.a1===a?'selected':''}>${a}</option>`).join('')}</select>${U.mode==='split'?`<select data-c="luText" data-f="a2" aria-label="Second ability"><option value="">Choose…</option>${ABS.filter(a=>a!==U.a1).map(a=>`<option ${U.a2===a?'selected':''}>${a}</option>`).join('')}</select>`:''}</div>`}`:''}
  ${I.exp?`<h2>Expertise</h2><p class="hint">Choose ${I.exp} more skills you are proficient in: you add your proficiency bonus twice to them.${Object.keys(D.skills).filter(s=>D.skills[s].prof&&!D.skills[s].exp).length<I.exp?' (You have fewer proficient skills left than that, so pick what is there; Thieves\' Tools expertise can be added under Custom features.)':''}</p><div class="chipset">${Object.keys(D.skills).filter(s=>D.skills[s].prof&&!D.skills[s].exp).map(s=>`<button type="button" class="chip tog ${(U.exp||[]).includes(s)?'on':''}" data-a="luExp" data-v="${esc(s)}" data-max="${I.exp}">${esc(s)}</button>`).join('')}</div>`:''}
  ${U.errs&&U.errs.length?`<div class="errs">${U.errs.map(e=>`<p>${esc(e)}</p>`).join('')}</div>`:''}
  <button type="button" class="btn pri big" data-a="luSave">Reach level ${I.L}</button></div>`}
function luSave(){const U=SH.lu;const c=SH.chars[U.uid];const b=clone(c.build);const I=luInfo(c);const errs=[];
  if(!U.hp)errs.push('Roll or take the average for your hit points.');if(I.needSub&&!String(U.sub||'').trim())errs.push('Choose your '+I.subName.toLowerCase()+'.');
  if(I.asi){if(U.mode==='feat'){if(!String(U.feat||'').trim())errs.push('Choose a feat.')}else if(!U.a1||(U.mode==='split'&&!U.a2))errs.push('Choose which abilities go up.')}
  const expAvail=I.exp?Object.keys(DV(c).skills).filter(k=>DV(c).skills[k].prof&&!DV(c).skills[k].exp).length:0;const expNeed=Math.min(I.exp||0,expAvail);if(I.exp&&(U.exp||[]).length!==expNeed)errs.push(`Choose ${expNeed} Expertise skill${expNeed===1?'':'s'}.`);
  if(errs.length){U.errs=errs;render();return}
  const oldMax=DV(c).maxhp;b.level=I.L;b.hpRolls={...(b.hpRolls||{}),[I.L]:U.hp};if(I.needSub)b.subclass=String(U.sub).trim();
  if(I.asi){if(U.mode==='feat')b.featLv={...(b.featLv||{}),[I.L]:String(U.feat).trim()};else b.asiLv={...(b.asiLv||{}),[I.L]:U.mode==='two'?{[U.a1]:2}:{[U.a1]:1,[U.a2]:1}}}
  if(I.exp){if(b.rules==='5e')b.expertise=[...(b.expertise||[]),...U.exp];else b.expertise6=U.exp}
  const nc={...c,build:b};const gain=Math.max(0,DV(nc).maxhp-oldMax);nc.hp=Math.min(DV(nc).maxhp,c.hp+gain);put('chars/'+U.uid,nc);
  addLog({by:SH.me,who:b.name,kind:'note',label:`⬆ ${b.name} reaches level ${I.L}! (+${gain} max HP)`,total:''});SH.lu=null;render();window.scrollTo(0,0)}
