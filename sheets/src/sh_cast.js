// ================= casting spells from the spell list: slots, targets, saves the DM's device rolls, healing =================
const CLS_LETTER={bard:'B',cleric:'C',druid:'D',paladin:'P',ranger:'R',sorcerer:'S',warlock:'K',wizard:'W'};
const OP_FULL=['priest','skald','chemist','tinkerer','hybrid'];
function abMod(D,ab){return Math.floor(((D.ab||{})[ab]||10)/2)-5}
function casterInfo(c,D){const b=c.build;const sp=D.spell;if(!sp)return null;const res=c.res||{};const mod=abMod(D,sp.ab);const out={ab:sp.ab,mod,dc:sp.dc,atk:sp.atk,levels:[],maxLvl:0};
  if(b.rules==='5e'){(sp.slots||[]).forEach((n,i)=>{const L=i+1;if(n)out.maxLvl=Math.max(out.maxLvl,L);if(n-(res['slot'+L]||0)>0)out.levels.push({L,key:'slot'+L,left:n-(res['slot'+L]||0)})});
    if(sp.pact){out.maxLvl=Math.max(out.maxLvl,sp.pact.lvl);const left=sp.pact.n-(res.pact||0);if(left>0)out.levels.push({L:sp.pact.lvl,key:'pact',left,pact:1})}}
  else{const R=(D.res||{}).slots;if(R){const l=b.level||1;const m=/\(level (\d)\)/.exec(R.name);
      out.maxLvl=m?+m[1]:OP_FULL.includes(b.cls)?Math.min(9,Math.ceil(l/2)):b.cls==='marksman'?(l<2?0:l<5?1:l<9?2:l<13?3:l<17?4:5):(l<3?0:l<7?1:l<13?2:l<19?3:4);
      const left=R.max-(res.slots||0);if(left>0)for(let L=1;L<=out.maxLvl;L++)if(!m||L===out.maxLvl)out.levels.push({L,key:'slots',left})}}
  return out}
function classSpells(c){const b=c.build;if(b.rules==='5e'){const L=CLS_LETTER[b.cls];return L?SPELLS.filter(s=>s.cls.includes(L)).map(s=>({n:s.n,l:s.l})):[]}
  const lists=OP_SPELL_LISTS[b.cls];if(!lists)return[];const out=[];for(const [l,names] of Object.entries(lists))for(const n of names){const s=spellFind(n);out.push({n:n.replace(/\^$/,''),l:s?s.l:+l,custom:/\^$/.test(n)})}return out}
function tierDice(sp,charLvl){if(!sp.c&&!sp.rc)return 1;return 1+(charLvl>=5)+(charLvl>=11)+(charLvl>=17)}
function scaleDice(d,k){if(!d||k===1)return d;return d.replace(/(\d+)d(\d+)/g,(m,a,b)=>`${a*k}d${b}`)}
function spellDiceAt(sp,L,charLvl,mod){let d=sp.d||'';if(!d)return'';const k=sp.c?tierDice(sp,charLvl):1;d=scaleDice(d,k);
  const up=Math.max(0,L-sp.l);if(sp.u&&sp.u!=='r'&&up)for(let i=0;i<up;i++)d+='+'+sp.u;if(sp.u2&&up>=2)for(let i=0;i<Math.floor(up/2);i++)d+='+'+sp.u2;
  if((sp.mod||(sp.k==='heal'&&sp.mod))&&mod)d+=(mod>=0?'+':'')+mod;
  // tidy: merge same dice (3d4+1d4 → 4d4)
  const parts={};let flat=0;for(const t of d.split('+')){const m=/^(\d+)d(\d+)$/.exec(t.trim());if(m)parts[m[2]]=(parts[m[2]]||0)+ +m[1];else if(/^-?\d+$/.test(t.trim()))flat+= +t;else return d}
  return Object.entries(parts).sort((a,b)=>b[0]-a[0]).map(([s,n])=>`${n}d${s}`).join('+')+(flat?(flat>0?'+':'')+flat:'')}
function raysAt(sp,L,charLvl){if(sp.rc)return tierDice(sp,charLvl);if(!sp.r)return 1;return sp.r+(sp.u==='r'?Math.max(0,L-sp.l):0)}
const CT={A:['act','Action'],B:['bonus','Bonus action'],R:['react','Reaction'],L:['','10 min+']};
function mechText(sp,CI,dice,rays){if(sp.k==='atk')return`spell attack ${fmt(CI.atk)} · ${rays>1?rays+' × ':''}${dice} ${sp.t}`;
  if(sp.k==='save')return`${sp.ab} save, DC ${CI.dc}${dice?` · ${dice} ${sp.t}${sp.h?' (half on a save)':''}`:''}`;
  if(sp.k==='auto')return`${dice} ${sp.t}, no roll to hit`;if(sp.k==='heal')return`heals ${dice}${sp.tn?` · up to ${sp.tn} creatures`:''}`;if(sp.k==='temp')return`${dice} temporary HP`;return''}

// ---------- the spell rows and the picker (hooks used by pgActions) ----------
function spellRowHTML(uid,s,ed){const c=SH.chars[uid];const sp=spellFind(s.name);
  if(!sp)return`<div class="spell"><div><b>${esc(s.name)}</b> <small>${s.lvl?'level '+s.lvl:'cantrip'}</small>${s.note?`<p>${esc(s.note)}</p>`:''}</div>${s.roll?`<button type="button" class="btn dmg" data-a="spRoll" data-u="${uid}" data-k="${s.id}">${esc(s.roll)}</button>`:''}${ed?`<button type="button" class="btn xs" data-a="spDel" data-u="${uid}" data-k="${s.id}" aria-label="Remove ${esc(s.name)}">✕</button>`:''}</div>`;
  const D=DV(c);const CI=casterInfo(c,D);if(!CI)return'';const ct=CT[sp.ct]||CT.A;
  const avail=sp.l?CI.levels.filter(x=>x.L>=sp.l):[{L:0}];const sel=(SH.slotSel||{})[s.id];const L=sp.l?(avail.find(x=>x.L===sel)||avail[0]||{L:sp.l}).L:0;
  const dice=spellDiceAt(sp,L,D.lvl,CI.mod);const rays=raysAt(sp,L,D.lvl);const conc=c.conc===sp.n;
  return`<div class="spell srd ${conc?'concon':''}"><div><b>${esc(sp.n)}</b> <small>${sp.l?'level '+sp.l:'cantrip'} · <mark class="tg tg-${ct[0]||'act'}">${ct[1]}</mark> · ${esc(sp.rg)}${sp.conc?' · <i>concentration</i>':''}</small>
    ${mechText(sp,CI,dice,rays)?`<p class="sptag">${esc(mechText(sp,CI,dice,rays))}</p>`:''}<details data-dk="spd_${s.id}"><summary>What it does</summary><p>${esc(sp.txt)}</p></details></div>
    ${ed?`<span class="fbtns">${sp.l&&avail.length>1?`<select data-c="slotSel" data-k="${s.id}" aria-label="Slot level">${avail.map(x=>`<option value="${x.L}" ${x.L===L?'selected':''}>L${x.L}${x.pact?' pact':''}</option>`).join('')}</select>`:''}<button type="button" class="btn dmg cast" data-a="spCast" data-u="${uid}" data-k="${s.id}" ${sp.l&&!avail.length?'disabled title="No slots left"':''}>${sp.l&&!avail.length?'No slots':'Cast'}</button><button type="button" class="btn xs" data-a="spDel" data-u="${uid}" data-k="${s.id}" aria-label="Remove ${esc(sp.n)}">✕</button></span>`:''}</div>`}
function spellLibHTML(uid,c,D){const L=classSpells(c);if(!L.length)return'';const CI=casterInfo(c,D);const max=CI?CI.maxLvl:0;const have=new Set((c.spells||[]).map(s=>spellKey2(s.name)));
  const opts=L.filter(s=>s.l<=Math.max(max,0)&&!have.has(spellKey2(s.n))).sort((a,b)=>a.l-b.l||a.n.localeCompare(b.n));
  const nm=c.build.rules==='5e'?(R5.classes[c.build.cls]||{}).name:(CLASSES[c.build.cls]||{}).name;
  return`<div class="form inline libadd"><input id="spLib_${uid}" list="spList_${uid}" placeholder="Add from the ${esc(nm||'')} list: type a name" aria-label="Spell from your list"><button type="button" class="btn pri" data-a="spLib" data-u="${uid}">Add</button></div>
    <datalist id="spList_${uid}">${opts.map(s=>`<option value="${esc(s.n)}">${s.l?'Level '+s.l:'Cantrip'}${spellFind(s.n)?'':' (text only)'}</option>`).join('')}</datalist>
    ${(()=>{const prep=(D.spell||{}).prep||0;const n=(c.spells||[]).filter(x=>(x.lvl||0)>0).length;const cn=(c.spells||[]).filter(x=>!(x.lvl||0)).length;return`<p class="hint">Spells up to level ${max} · ${cn} cantrip${cn===1?'':'s'}, ${n} levelled spell${n===1?'':'s'}${prep?` · you can prepare ${prep}${n>prep?' <b class="warn">(too many: pick which are ready today)</b>':''}`:''}</p>`})()}
    ${c.conc?`<p class="conc">🔮 Concentrating on <b>${esc(c.conc)}</b>. Damage forces a CON save. <button type="button" class="btn xs" data-a="concEnd" data-u="${uid}">Stop</button></p>`:''}`}

// ---------- target picker shared by spells ----------
function pickHTML(uid){const k=SH.pk;if(!k||k.u!==uid)return'';const L=k.who==='foes'?foeList().filter(f=>!f.down).map(f=>({id:f.id,name:f.name})):Object.entries(SH.chars).filter(([,c])=>charOK(c)&&!c.dead).map(([u,c])=>({id:u,name:c.build.name+(u===uid?' (you)':''),sub:c.hp+'/'+DV(c).maxhp}));
  return`<div class="mtarget ptarget"><span>${esc(k.title)}</span><div class="chipset">${L.map(x=>`<button type="button" class="chip tog ${k.sel.includes(x.id)?'on':''}" data-a="pkTo" data-k="${x.id}">${esc(x.name)}${x.sub?` <small>${x.sub}</small>`:''}</button>`).join('')}</div>
    <div class="row">${k.max>1?`<button type="button" class="btn pri sm" data-a="pkGo" ${k.sel.length?'':'disabled'}>Cast on ${k.sel.length||'…'}</button>`:''}<button type="button" class="btn sm" data-a="pkCancel">Cancel</button></div></div>`}
ACT.pkTo=function(b){const k=SH.pk;if(!k)return;const id=b.dataset.k;if(k.max<=1){k.sel=[id];SH.pk=null;k.go(k.sel);return}k.sel=k.sel.includes(id)?k.sel.filter(x=>x!==id):k.sel.length<k.max?[...k.sel,id]:k.sel;render(true)};
ACT.pkGo=function(){const k=SH.pk;if(!k||!k.sel.length)return;SH.pk=null;k.go(k.sel)};ACT.pkCancel=function(){if(SH.pk&&SH.pk.refund)SH.pk.refund();SH.pk=null;render(true)};

// ---------- casting ----------
ACT.spLib=function(b){const u=b.dataset.u;const name=val('spLib_'+u).trim();const L=classSpells(SH.chars[u]);const hit=L.find(s=>spellKey2(s.n)===spellKey2(name));if(!hit){toast('Pick a spell from your list.');return}
  const sp=spellFind(hit.n);listEdit(u,'spells',X=>[...X,{id:uidNew(),name:hit.n,lvl:hit.l,...(sp?{}:{note:'From your class list. Ask the DM how it works.'})}]);const e=document.getElementById('spLib_'+u);if(e)e.value=''};
ACT.concEnd=function(b){const u=b.dataset.u;const c=SH.chars[u];addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} stops concentrating on ${c.conc}.`,total:''});saveChar(u,{conc:''})};
Object.assign(CHG,{slotSel(e){SH.slotSel=SH.slotSel||{};SH.slotSel[e.dataset.k]=+e.value;setTimeout(()=>render(true),0)}});
ACT.spCast=function(b){const u=b.dataset.u;const c=SH.chars[u];const s=(c.spells||[]).find(x=>x.id===b.dataset.k);const sp=s&&spellFind(s.name);if(!sp)return;const D=DV(c);const CI=casterInfo(c,D);if(!CI)return;
  const ctx=dmFor(u)?null:fightCtx(u);const ct=(CT[sp.ct]||CT.A)[0];
  if(ctx&&!ctx.mine&&sp.ct!=='R'){toast('Not your turn yet. Only reactions can be cast now.');return}
  let st=ctx&&ctx.mine?turnSt(u,ctx.key):null;
  if(st&&ct&&st[ct]&&!tapTwice(b,`Your ${ct==='act'?'Action':ct==='bonus'?'Bonus action':'Reaction'} is used. Tap again to cast anyway`))return;
  // slot
  let L=0,slot=null;if(sp.l){const avail=CI.levels.filter(x=>x.L>=sp.l);const sel=(SH.slotSel||{})[s.id];slot=avail.find(x=>x.L===sel)||avail[0];if(!slot){toast('No spell slots left of that level. A rest gets them back.');return}L=slot.L}
  const res={...(c.res||{})};if(slot)res[slot.key]=(res[slot.key]||0)+1;const patch={res};
  if(sp.conc){if(c.conc&&c.conc!==sp.n)addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} stops concentrating on ${c.conc}.`,total:'',quiet:true});patch.conc=sp.n}
  saveChar(u,patch);if(st&&ct)st[ct]=1;
  const refund=()=>{const cc=SH.chars[u];if(slot){const r2={...(cc.res||{})};r2[slot.key]=Math.max(0,(r2[slot.key]||0)-1);saveChar(u,{res:r2})}if(st&&ct)st[ct]=0};
  const dice=spellDiceAt(sp,L,D.lvl,CI.mod);const rays=raysAt(sp,L,D.lvl);const tag=L?` (level ${L}${slot&&slot.pact?' pact':''} slot)`:'';const nm=`✨ ${sp.n}`;
  const foes=fightCtx(u)?foeList().filter(f=>!f.down):[];
  addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} casts ${sp.n}${tag}.`,total:'',quiet:true});
  if(sp.k==='atk'){const a={name:sp.n,atk:CI.atk,dmg:dice,spell:1};const ak='sp:'+s.id;SH.pseudo=SH.pseudo||{};SH.pseudo[ak]=a;
    if(!foes.length){for(let i=0;i<rays;i++)rollD20(sp.n+(rays>1?` (${i+1} of ${rays})`:'')+' spell attack',CI.atk,fmt(CI.atk),{uid:u,follow:dice?[{t:'Damage '+dice,run:crit=>rollDmg(sp.n+' damage',dice,{uid:u,crit})}]:null});return}
    let left=rays;const next=()=>{if(left<=0){render(true);return}const i=rays-left+1;left--;SH.pk={u,who:'foes',max:1,sel:[],title:`${sp.n}${rays>1?` (${i} of ${rays})`:''}: who is the target?`,refund:left===rays-1?refund:null,go:([id])=>{const tg=foeList().find(f=>f.id===id);doAttack(u,a,tg,ak,{spell:1});setTimeout(next,300)}};render(true)};next();return}
  if(sp.k==='save'){const go=ids=>{const tg=foeList().filter(f=>ids.includes(f.id));const meta={save:{ab:sp.ab,dc:CI.dc,h:!!sp.h,tgts:tg.map(t=>t.id),tnames:tg.map(t=>t.name),spell:sp.n}};
      if(dice)rollDmg(`${sp.n} (${sp.ab} save DC ${CI.dc})${tg.length?' → '+tg.map(t=>t.name).join(', '):''}`,dice,{uid:u,...meta});
      else addLog({by:SH.me,who:c.build.name,kind:'note',label:`${nm}: ${sp.ab} save DC ${CI.dc}${tg.length?' for '+tg.map(t=>t.name).join(', '):''}.`,total:'',...meta});render(true)};
    if(!foes.length){go([]);return}SH.pk={u,who:'foes',max:sp.tn||8,sel:[],title:`${sp.n}: who is caught in it? Tap everyone in the area.`,refund,go};render(true);return}
  if(sp.k==='auto'){const go=ids=>{const tg=foeList().find(f=>f.id===ids[0]);rollDmg(`${sp.n}${tg?' → '+tg.name:''}`,dice,{uid:u,...(tg?{tgt:tg.id,of:'auto'+uidNew()}:{})});render(true)};
    if(/Smite$|Lightning Arrow/.test(sp.n))return;if(!foes.length){go([]);return}SH.pk={u,who:'foes',max:1,sel:[],title:`${sp.n}: who is the target?`,refund,go};render(true);return}
  if(sp.k==='heal'){SH.pk={u,who:'allies',max:sp.tn||1,sel:[],title:`${sp.n}: who do you heal?`,refund,go:ids=>{const r=rollExprNow(dice);if(!r)return;for(const id of ids)rollDmgFixed(u,`${sp.n} healing → ${SH.chars[id].build.name}`,r,{healTo:id});render(true)}};render(true);return}
  if(sp.k==='temp'){rollDmg(`${sp.n}: temporary HP`,dice,{uid:u,tempTo:u});return}
  addLog({by:SH.me,who:c.build.name,kind:'note',label:`${nm}: ${sp.txt}`,total:''})};
// a heal roll shared by several targets is rolled once
function rollDmgFixed(u,label,r,extra){const e={by:SH.me,who:who(u),label,detail:r.detail,total:r.total,kind:'dmg',...extra};showRoll(e);addLog(e)}

// ---------- the host applies saves, healing and temporary HP ----------
onLog=(function(prev){return function(fresh){prev(fresh);if(!SH.owner)return;SH.hostT=SH.hostT||Date.now();SH.done3=SH.done3||new Set();
  for(const e of fresh){if((e.t||0)<SH.hostT-1000)continue;const key=(e.id||'')+'|'+e.t+'|'+e.label;if(SH.done3.has(key))continue;
    if(e.save&&e.save.tgts&&e.save.tgts.length){SH.done3.add(key);const mons=monsOf();const res=[];
      for(const id of e.save.tgts){const m=mons[id];if(!m||m.hp<=0)continue;const L=m.lib&&monFind(m.lib);const idx=ABS.indexOf(e.save.ab);const bonus=L?mod(L.ab[idx]):0;const n=d(20);const ok=n+bonus>=e.save.dc;
        secretLog({by:SH.me,who:m.name,label:`${e.save.ab} save vs ${e.save.spell}`,detail:`d20 ${n} ${fmt(bonus)}`,total:n+bonus,kind:'d20'});
        const name=e.save.tnames[e.save.tgts.indexOf(id)]||m.name;
        if(e.total!==''&&e.total!==undefined&&e.kind==='dmg'){const dmg=ok?(e.save.h?Math.floor(e.total/2):0):e.total;res.push(`${name} ${ok?'saves':'fails'}${dmg?` (${dmg})`:''}`);if(dmg)hurtMon(id,-dmg,`${e.save.spell}`)}
        else res.push(`${name} ${ok?'saves':'fails and is affected'}`)}
      if(res.length)addLog({by:SH.me,who:'DM',kind:'note',label:`${e.save.spell}: ${res.join(' · ')}`,total:''})}
    if(e.healTo&&SH.chars[e.healTo]&&e.kind==='dmg'){SH.done3.add(key);hpChange(e.healTo,+e.total,`${e.who}: ${e.label.replace(/ → .*$/,'')}`)}
    if(e.tempTo&&SH.chars[e.tempTo]){SH.done3.add(key);const c=SH.chars[e.tempTo];if((c.temp||0)<e.total)saveChar(e.tempTo,{temp:e.total})}}}})(onLog);
// spell pseudo-attacks resolve like weapons
atkById=(function(prev){return function(u,k){if(String(k).startsWith('sp:'))return(SH.pseudo||{})[k]||null;return prev(u,k)}})(atkById);
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const p=pickHTML(uid);if(p)h=p+h;
  // pending spell hits get their own damage buttons
  const ctx=fightCtx(uid);if(ctx&&ctx.mine){const st=turnSt(uid,ctx.key);const sh=st.hits.filter(x=>String(x.k).startsWith('sp:'));if(sh.length)h=`<div class="hitnote">${sh.map(x=>{const a=atkById(uid,x.k);return a?`<button type="button" class="btn dmg ready" data-a="dmg" data-u="${uid}" data-k="${x.k}">🎯 ${esc(a.name)} hit ${esc(x.tname)}: roll ${esc(a.dmg)}</button>`:''}).join(' ')}</div>`+h}
  return h}})(pgActions);
// when a target picker opens, bring it into view and move the roll card out of the way
render=(function(prev){return function(f){prev(f);try{const t=q('.ptarget');if(t){const rc=q('#rollCard');if(rc&&rc.className.includes('show')&&!q('[data-rcdmg]',rc))rc.className='';const r=t.getBoundingClientRect();if(r.top<60||r.bottom>innerHeight-260)t.scrollIntoView({block:'start'})}}catch(e){}}})(render);

// level-up: remind casters that new spells may be available
luHTML=(function(prev){return function(){let h=prev();try{const lu=SH.lu;const c=lu&&SH.chars[lu.uid];if(!c||!DV(c).spell)return h;const nb={...c.build,level:(c.build.level||1)+1};const D2=DV({...c,build:nb});const CI=casterInfo({...c,build:nb,res:{}},D2);
  if(CI&&CI.maxLvl)h=h.replace(/(<button[^>]*data-a="luSave")/,`<p class="hintbox">✨ After levelling up you can cast spells up to level ${CI.maxLvl}. Add new ones on the Actions page from your class list.</p>$1`)}catch(e){}return h}})(luHTML);

// ---------- riders (smites, Hex, Hunter's Mark) and spells you can use again on later turns ----------
const RIDER_KEEP={'Hex':['1d6','necrotic'],"Hunter's Mark":['1d6','weapon'],'Divine Favor':['1d4','radiant']};
const AGAIN_FREE=['Spiritual Weapon','Flaming Sphere','Witch Bolt','Call Lightning','Moonbeam','Spirit Guardians','Cloud of Daggers','Heat Metal','Flame Blade','Sunbeam',"Bigby's Hand",'Create Bonfire','Aura of Vitality','Wall of Fire','Insect Plague','Cloudkill','Immolation','Vampiric Touch'];
ACT.spCast=(function(prev){return function(b){const u=b.dataset.u;const c=SH.chars[u];const s=(c.spells||[]).find(x=>x.id===b.dataset.k);const sp=s&&spellFind(s.name);if(!sp)return prev(b);
  const free=b.dataset.free==='1';
  if(free){// a free re-use: same level, no slot, keeps concentration
    const L=(c.persist&&c.persist.name===sp.n?c.persist.L:sp.l)||sp.l;SH.freeCast={u,L};const saved=c.res;
    SH._noSlot=1;try{prev(b)}finally{SH._noSlot=0;SH.freeCast=null}return}
  const before=JSON.stringify(c.res||{});prev(b);const c2=SH.chars[u];if(JSON.stringify(c2.res||{})===before&&sp.l)return;// cast did not happen
  const used=Object.keys(c2.res||{}).find(k=>(c2.res[k]||0)>((JSON.parse(before)[k])||0));const L=used==='pact'?(DV(c2).spell.pact||{}).lvl:used&&used.startsWith('slot')?+used.slice(4)||sp.l:((SH.slotSel||{})[s.id]||sp.l);
  const patch={};const ini=initOf();
  if(AGAIN_FREE.includes(sp.n))patch.persist={name:sp.n,L:L||sp.l,fight:ini&&ini.on?ini.id:''};
  if(/Smite$|Lightning Arrow/.test(sp.n)){patch.rider={name:sp.n,dice:spellDiceAt(sp,L||sp.l,DV(c2).lvl,0),type:sp.t,once:1};addLog({by:SH.me,who:c2.build.name,kind:'note',label:`✨ ${sp.n}: your next weapon hit adds ${patch.rider.dice} ${sp.t}.`,total:''})}
  if(RIDER_KEEP[sp.n]){patch.rider={name:sp.n,dice:RIDER_KEEP[sp.n][0],type:RIDER_KEEP[sp.n][1],conc:1};addLog({by:SH.me,who:c2.build.name,kind:'note',label:`✨ ${sp.n}: your weapon hits add ${patch.rider.dice} while you concentrate.`,total:''})}
  if(Object.keys(patch).length)saveChar(u,patch)}})(ACT.spCast);
// casting without a slot when re-using
casterInfo=(function(prev){return function(c,D){const r=prev(c,D);if(r&&SH._noSlot&&SH.freeCast){r.levels=[{L:SH.freeCast.L,key:'_free',left:99}]}return r}})(casterInfo);
saveChar=(function(prev){return function(u,patch){if(SH._noSlot&&patch&&patch.res){const p={...patch};const r={...p.res};delete r._free;p.res=r;if(p.conc)delete p.conc;return prev(u,p)}return prev(u,patch)}})(saveChar);
// weapon damage picks up the rider
rollDmg=(function(prev){return function(label,expr,opts){opts=opts||{};const u=opts.uid;const c=u&&SH.chars[u];const nm=String(label).replace(/ damage.*$/,'').replace(/ \(critical\)$/,'');
  if(c&&c.rider&&/ damage/.test(label)&&!spellFind(nm)&&!opts.healTo){const r=c.rider;expr=expr+'+'+r.dice;label=label.replace(' damage',` + ${r.name} damage`);if(r.once)saveChar(u,{rider:null})}
  return prev(label,expr,opts)}})(rollDmg);
// ending concentration ends a concentration rider
saveChar=(function(prev){return function(u,patch){const c=SH.chars[u];if(c&&patch&&'conc' in patch&&c.rider&&c.rider.conc&&patch.conc!==c.rider.name)patch={...patch,rider:null};return prev(u,patch)}})(saveChar);
spellRowHTML=(function(prev){return function(uid,s,ed){let h=prev(uid,s,ed);const c=SH.chars[uid];const sp=spellFind(s.name);if(!sp||!ed)return h;const ini=initOf();
  const again=(sp.conc&&c.conc===sp.n&&sp.k!=='util'&&sp.d)||(c.persist&&c.persist.name===sp.n&&!sp.conc&&(!c.persist.fight||(ini.on&&ini.id===c.persist.fight)));
  if(again)h=h.replace(`<button type="button" class="btn dmg cast" data-a="spCast" data-u="${uid}" data-k="${s.id}"`,`<button type="button" class="btn dmg ready" data-a="spCast" data-u="${uid}" data-k="${s.id}" data-free="1" title="Use it again this turn without a new slot">♻ Again</button><button type="button" class="btn dmg cast" data-a="spCast" data-u="${uid}" data-k="${s.id}"`);
  return h}})(spellRowHTML);
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);if(c.rider)h=`<p class="conc">⚔ Next weapon hit${c.rider.once?'':'s'}: +${esc(c.rider.dice)} ${esc(c.rider.type||'')} (${esc(c.rider.name)})</p>`+h;return h}})(pgActions);
