// ================= table rules: the DM limits classes and species, and decides what a Devil Fruit costs =================
const TR=()=>SH.state.trules||{};
function trSet(p){setState({trules:{...TR(),...p}})}
function allowedCls(r5){const t=TR();const L=r5?t.cls5:t.clsOp;return Array.isArray(L)&&L.length?L:null}
function allowedSp(r5){const t=TR();const L=r5?t.sp5:t.spOp;return Array.isArray(L)&&L.length?L:null}
// the builder only shows what the table allows (a character made earlier keeps its pick)
pickCardsHTML=(function(prev){return function(kind,items,cur){const b=SH.edit&&SH.edit.b;const r5=b&&b.rules==='5e';
  if(kind==='bPickCls'){const A=allowedCls(r5);if(A)items=items.filter(i=>A.includes(i.k)||i.k===cur)}
  if(kind==='bPickSp'){const A=allowedSp(r5);if(A)items=items.filter(i=>A.includes(i.k)||i.k===cur)}
  return prev(kind,items,cur)}})(pickCardsHTML);
builderHTML=(function(prev){return function(){let h=prev();const b=SH.edit&&SH.edit.b;if(!b)return h;const r5=b.rules==='5e';const A=allowedCls(r5),S=allowedSp(r5);
  const bad=[];if(A&&!A.includes(b.cls))bad.push('this class');if(S&&!S.includes(b.species))bad.push('this species');
  if(bad.length)h=h.replace('<h2>Class</h2>',`<p class="hintbox warn">⚠ The DM's table rules do not allow ${bad.join(' or ')}. Pick another one, or ask the DM.</p><h2>Class</h2>`);
  if(!r5&&TR().hunt===false)h=h.replace(/<label class="row tog"><input type="checkbox" data-c="bHunt"[\s\S]*?<\/label>/,'');
  if(!r5&&TR().fruitCost)h=h.replace('search my home island for a Devil Fruit <small>(optional; the DM tells you what you find)</small>','search my home island for a Devil Fruit <small>(optional; eating one costs your next Ability Score Improvement or feat)</small>');
  return h}})(builderHTML);
// eating a fruit under the cost rule: the next Ability Score Improvement pays for it
const _eatMark=u=>{if(!TR().fruitCost)return;const c=SH.chars[u];saveChar(u,{fruitDebt:(c.fruitDebt||0)+1});addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name}'s next Ability Score Improvement or feat goes to the Devil Fruit (table rule).`,total:''})};
for(const k of ['ofEat','itEat']){const f=ACT[k];ACT[k]=function(b){const u=k==='ofEat'?SH.me:b.dataset.u;const before=(SH.chars[u]||{}).fruit;const r=f(b);setTimeout(()=>{const c=SH.chars[u];if(c&&c.fruit&&c.fruit!==before)_eatMark(u)},400);return r}}
offerModalHTML=(function(prev){return function(){let h=prev();if(TR().fruitCost)h=h.replace('Eat it, and you gain its power, but you can never swim again.','Eat it, and you gain its power, but you can never swim again, and your next Ability Score Improvement or feat pays for it.');return h}})(offerModalHTML);
luHTML=(function(prev){return function(){let h=prev();const U=SH.lu;const c=U&&SH.chars[U.uid];if(!c||!c.fruitDebt)return h;const I=luInfo(c);if(!I.asi)return h;
  return h.replace(/<h2>Ability Score Improvement<\/h2>[\s\S]*?(?=<h2>|<button[^>]*data-a="luSave")/,'<h2>Ability Score Improvement</h2><p class="hintbox">🍇 This one pays for your Devil Fruit (table rule), so no ability goes up this time.</p>')}})(luHTML);
luSave=(function(prev){return function(){const U=SH.lu;const c=U&&SH.chars[U.uid];if(c&&c.fruitDebt&&luInfo(c).asi){U.mode='feat';U.feat='Devil Fruit (paid with this improvement)';const u=U.uid;const lvl=c.build.level;const r=prev();setTimeout(()=>{const n=SH.chars[u];if(n&&n.build.level>lvl)saveChar(u,{fruitDebt:Math.max(0,(n.fruitDebt||0)-1)})},300);return r}return prev()}})(luSave);
pgMain=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);if(c.fruitDebt)h=h.replace('<h2>Abilities',`<p class="resline">🍇 Your next Ability Score Improvement pays for your Devil Fruit.</p><h2>Abilities`);return h}})(pgMain);
// the DM's table page
function trulesHTML(){const t=TR();const r5=SH.state.rules==='5e';const CL=r5?R5.classes:CLASSES;const SP=r5?R5.species:SPECIES;const A=allowedCls(r5),S=allowedSp(r5);
  const cls=Object.entries(CL).filter(([k,c])=>!c.legacy);const sps=Object.entries(SP);
  return`<h2>Table rules <small>what players can pick</small></h2>
  <details class="add" data-dk="trules"><summary>Classes, species and Devil Fruits ${A||S||t.fruitCost?'<small>(limits set)</small>':''}</summary>
  <p class="hint">Untick what your campaign does not use. Players only see the rest when they make a character.</p>
  <h3>Classes</h3><div class="chipset">${cls.map(([k,c])=>`<label class="chip tog ${!A||A.includes(k)?'on':''}"><input type="checkbox" data-c="trCls" data-k="${k}" ${!A||A.includes(k)?'checked':''}> ${esc(c.name)}</label>`).join('')}</div>
  ${!r5?`<button type="button" class="btn sm" data-a="trMartial">Martial only: Warrior, Martial Artist, Rogue, Bruiser</button>`:`<button type="button" class="btn sm" data-a="trMartial">Martial only: Barbarian, Fighter, Monk, Rogue</button>`} <button type="button" class="btn sm" data-a="trAll">Allow every class</button>
  <h3>Species</h3><div class="chipset">${sps.map(([k,s])=>`<label class="chip tog ${!S||S.includes(k)?'on':''}"><input type="checkbox" data-c="trSp" data-k="${k}" ${!S||S.includes(k)?'checked':''}> ${esc(s.name)}</label>`).join('')}</div>
  ${!r5?`<h3>Devil Fruits</h3><label class="row tog"><input type="checkbox" data-c="trFruitCost" ${t.fruitCost?'checked':''}> Eating a Devil Fruit costs the next Ability Score Improvement or feat</label>
  <label class="row tog"><input type="checkbox" data-c="trHunt" ${t.hunt!==false?'checked':''}> Players may search their home island for a Devil Fruit when they make a character</label>`:''}</details>`}
dmTable=(function(prev){return function(){return trulesHTML()+prev()}})(dmTable);
function trToggle(key,all,k,on){const r5=SH.state.rules==='5e';const cur=TR()[key]||all;const next=on?[...new Set([...cur,k])]:cur.filter(x=>x!==k);if(!next.length){toast('Keep at least one.');render(true);return}trSet({[key]:next.length===all.length?null:next})}
Object.assign(CHG,{
  trCls(e){const r5=SH.state.rules==='5e';const CL=r5?R5.classes:CLASSES;trToggle(r5?'cls5':'clsOp',Object.keys(CL).filter(k=>!CL[k].legacy),e.dataset.k,e.checked)},
  trSp(e){const r5=SH.state.rules==='5e';trToggle(r5?'sp5':'spOp',Object.keys(r5?R5.species:SPECIES),e.dataset.k,e.checked)},
  trFruitCost(e){trSet({fruitCost:e.checked})},trHunt(e){trSet({hunt:e.checked})}});
Object.assign(ACT,{trMartial(){const r5=SH.state.rules==='5e';trSet(r5?{cls5:['barbarian','fighter','monk','rogue']}:{clsOp:['fighter','monk','rogue','bruiser'].filter(k=>CLASSES[k])});toast('Only martial classes for new characters.')},
  trAll(){const r5=SH.state.rules==='5e';trSet(r5?{cls5:null}:{clsOp:null})}});
