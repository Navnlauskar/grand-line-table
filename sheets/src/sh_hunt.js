// ================= a Devil Fruit from your home island (One Piece rules, PHB chapter 7 "Finding a Devil Fruit") =================
// Players only pick their island's size and whether to search it. The DM rolls the island die and the search DC in secret.
const HOME_ISLANDS=[['diminutive','Diminutive','A rock in the sea: a lighthouse, a few huts'],['tiny','Tiny','A fishing village'],['small','Small','A town with a harbour'],['medium','Medium','A city and the land around it'],['large','Large','A kingdom with several towns'],['colossal','Colossal','A huge country, weeks to cross']];
const ISLAND_RULE={diminutive:[20,10],tiny:[12,12],small:[10,14],medium:[8,16],large:[6,18],colossal:[4,20]};// die, search DC
// --- character creation: home island ---
function islandHTML(b){if(b.rules==='5e')return'';const cur=b.island||'';
  return`<h2>Home island</h2><p class="hint">Where did you grow up? Bigger islands have more people, smaller ones more secrets.</p>
  <div class="chipset isl">${HOME_ISLANDS.map(([k,n,t])=>`<button type="button" class="chip tog ${cur===k?'on':''}" data-a="bIsland" data-k="${k}" aria-pressed="${cur===k}"><b>${n}</b> <small>${t}</small></button>`).join('')}</div>
  ${cur?`<label class="row tog"><input type="checkbox" data-c="bHunt" ${b.hunt?'checked':''}> Before the story starts, search my home island for a Devil Fruit <small>(optional; the DM tells you what you find)</small></label>`:''}`}
builderHTML=(function(prev){return function(){let h=prev();const b=SH.edit&&SH.edit.b;if(!b||b.rules==='5e')return h;return h.replace('<h2>Ability scores</h2>',islandHTML(b)+'<h2>Ability scores</h2>')}})(builderHTML);
ACT.bIsland=function(b){const B=SH.edit.b;B.island=B.island===b.dataset.k?null:b.dataset.k;if(!B.island)B.hunt=false;render(true)};
Object.assign(CHG,{bHunt(e){SH.edit.b.hunt=e.checked}});

// --- the DM's side ---
const huntsOf=()=>((SH.dm.hunts)||{});
function huntPut(u,patch){put('dm/hunts',{...huntsOf(),[u]:{...(huntsOf()[u]||{}),...patch}})}
const SEARCH_SKILLS=['Survival','Investigation','Nature'];
function bestSearch(c){const D=DV(c);let best=null;for(const s of SEARCH_SKILLS){const x=D.skills[s];if(x&&(!best||x.bonus>best.bonus))best={key:s,bonus:x.bonus}}return best||{key:'Survival',bonus:0}}
function randomFruits(n){const W={Uncommon:46,Rare:40,'Very Rare':10,Legendary:4};const out=[];const pool=DFE.slice();for(let i=0;i<n&&pool.length;i++){const tot=pool.reduce((a,f)=>a+(W[f.rar]||10),0);let r=Math.random()*tot;let k=0;for(;k<pool.length;k++){r-=W[pool[k].rar]||10;if(r<=0)break}out.push(pool.splice(Math.min(k,pool.length-1),1)[0].k)}return out}
function huntRowHTML(u,c){const h=huntsOf()[u]||{};const isl=HOME_ISLANDS.find(x=>x[0]===c.build.island);const [die,dc]=ISLAND_RULE[c.build.island]||[10,14];const nm=esc(c.build.name);
  let body='';
  if(!h.face)body=`<button type="button" class="btn sm pri" data-a="huntIsland" data-u="${u}">Roll the island die (d${die}, secret)</button><p class="hint">On a 1, 1d4 Devil Fruits grow somewhere on ${nm}'s island.</p>`;
  else if(!h.n)body=`<p>Island die: <b>${h.face}</b> on d${die}. <b>No Devil Fruit grows there.</b> ${nm} searches and finds nothing.</p><button type="button" class="btn sm" data-a="huntTell" data-u="${u}" data-k="none">Tell ${nm}: nothing found</button>`;
  else{const req=h.req&&SH.log.find(e=>e.req===h.req&&e.by===u);const left=h.n-(h.found||0);
    body=`<p>Island die: <b>1</b>! <b>${h.n}</b> Devil Fruit${h.n>1?'s':''} grow${h.n>1?'':'s'} on the island${h.found?` (${h.found} found)`:''}. Search DC <b>${dc}</b>.</p>`;
    if(h.req&&!req)body+=`<p class="hint">Waiting for ${nm} to roll ${esc(h.skill)}…</p>`;
    if(req&&!h.done){const ok=req.total>=dc;body+=`<p>${nm} rolled <b>${req.total}</b> for ${esc(h.skill)}: <b>${ok?'found one!':'not found'}</b></p>`;
      if(ok&&h.taken===undefined)body+=`<button type="button" class="btn sm pri" data-a="huntTaken" data-u="${u}">Check if someone took it first (25%, secret)</button>`;
      else if(ok&&h.taken)body+=`<p><b>Someone already found it.</b> A story hook: who has it now?</p>`;
      else if(ok){const sug=h.sug||[];body+=`<p>Pick the fruit (suggestions are random, weighted by rarity):</p><div class="chipset">${sug.map(k=>{const f=DFE.find(x=>x.k===k);return f?`<button type="button" class="chip tog" data-a="huntGive" data-u="${u}" data-k="${k}">${esc(dfeName(f))} <small>${esc(f.rar)}</small></button>`:''}).join('')}<button type="button" class="chip" data-a="huntSug" data-u="${u}">↻ Other suggestions</button></div>
        <div class="form inline"><input id="hf_${u}" list="fruitList2" placeholder="Or type any fruit"><button type="button" class="btn" data-a="huntGive" data-u="${u}" data-k="">Give</button></div>`}
      if(!ok&&left>0)body+=`<button type="button" class="btn sm" data-a="huntAsk" data-u="${u}">Let ${nm} search again</button>`}
    if(!h.req||(req&&h.done&&left>0)){body+=`<label class="row tog"><input type="checkbox" id="hr_${u}" ${h.rumor?'checked':''}> ${nm} followed a rumor (advantage)</label><button type="button" class="btn sm pri" data-a="huntAsk" data-u="${u}">Ask ${nm} to search (${esc(bestSearch(c).key)})</button>`}}
  if(h.done)body+=`<p class="hint">✔ ${h.fruit?`Offered ${esc((DFE.find(x=>x.k===h.fruit)&&dfeName(DFE.find(x=>x.k===h.fruit)))||h.fruit)}.`:'Done.'}</p>`;
  return`<details class="hunt" data-dk="hunt_${u}" open><summary>${nm} <small>${isl?isl[1]+' island':'island not set'}</small></summary>${body}<button type="button" class="btn xs" data-a="huntReset" data-u="${u}">Start over</button></details>`}
dmPrep=(function(prev){return function(){let h=prev();if(SH.state.rules==='5e')return h;const list=Object.entries(SH.chars).filter(([,c])=>charOK(c)&&c.build.rules!=='5e'&&c.build.hunt&&c.build.island);
  const sec=`<h2>Devil Fruit hunts <small>home islands</small></h2>${list.length?`<p class="hint">Players who chose to search their home island. Everything here is secret until you offer a fruit.</p><div class="feats">${list.map(([u,c])=>huntRowHTML(u,c)).join('')}</div>`:'<p class="hint">Nobody asked to search their home island. Players choose this when they make their character.</p>'}`;
  return h.replace('<h2>Monster book',sec+'<h2>Monster book')+(h.includes('id="fruitList2"')?'':`<datalist id="fruitList2">${DFE.map(f=>`<option value="${esc(dfeName(f))}">${esc(f.rar)}</option>`).join('')}</datalist>`)}})(dmPrep);
Object.assign(ACT,{
  huntIsland(b){const u=b.dataset.u;const c=SH.chars[u];const [die]=ISLAND_RULE[c.build.island]||[10];const face=d(die);const n=face===1?d(4):0;
    secretLog({by:SH.me,who:c.build.name,label:`Home island die (d${die})`,detail:face===1?`1 → ${n} fruit${n>1?'s':''}`:`${face}`,total:face,kind:'d20'});huntPut(u,{face,n,found:0})},
  huntAsk(b){const u=b.dataset.u;const c=SH.chars[u];const [,dc]=ISLAND_RULE[c.build.island]||[10,14];const sk=bestSearch(c);const rumor=!!(q('#hr_'+u)&&q('#hr_'+u).checked);const id=uidNew();
    put('dm/req',{id,dc});setState({req:{id,kind:'skill',key:sk.key,label:`${reqLabelOf('skill',sk.key)}: searching your home island`,adv:rumor?1:0,for:[u],t:Date.now()}});
    huntPut(u,{req:id,skill:sk.key,rumor,done:false,taken:undefined,sug:null});toast(`${c.build.name} is asked to roll ${sk.key}.`)},
  huntTaken(b){const u=b.dataset.u;const r=d(4);secretLog({by:SH.me,who:'DM',label:'Already found by someone? (1 on d4 = yes)',detail:String(r),total:r,kind:'d20'});huntPut(u,{taken:r===1,sug:r===1?null:randomFruits(3),found:((huntsOf()[u]||{}).found||0)+1})},
  huntSug(b){huntPut(b.dataset.u,{sug:randomFruits(3)})},
  huntGive(b){const u=b.dataset.u;let k=b.dataset.k;if(!k){const f=dfeFind(val('hf_'+u));if(!f){toast('Pick a fruit from the list.');return}k=f.k}offer(u,{k:'fruit',fruit:k,note:'Found on your home island'});huntPut(u,{done:true,fruit:k})},
  huntTell(b){const u=b.dataset.u;offer(u,{k:'msg',title:'Your search is over',note:'You searched your home island for weeks, but you found no Devil Fruit.'});huntPut(u,{done:true})},
  huntReset(b){if(!tapTwice(b,'Tap again: forget this hunt'))return;const H={...huntsOf()};delete H[b.dataset.u];put('dm/hunts',H)}});
