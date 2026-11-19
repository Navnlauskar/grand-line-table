// ================= conditions change the dice: yours, and the enemy you attack =================
// Player conditions (5e rules): Poisoned, Frightened, Blinded, Prone, Restrained → disadvantage on attacks; Poisoned/Frightened also on checks;
// Restrained → disadvantage on DEX saves; Paralyzed/Stunned/Unconscious/Petrified → STR and DEX saves fail; Invisible → advantage on attacks;
// exhaustion 1+ → disadvantage on checks, 3+ also on attacks and saves.
// Enemy conditions (set by failed save spells or by the DM): Paralyzed, Stunned, Unconscious, Restrained, Prone, Blinded, Outlined → you attack with advantage;
// a melee hit on a Paralyzed or Unconscious enemy is a critical hit. Invisible enemy → disadvantage.
function rollKind(label){const l=String(label).toLowerCase();if(/ attack\b|spell attack/.test(l))return'attack';if(/ save\b|saving throw|death save/.test(l))return'save';if(/initiative/.test(l))return'init';return'check'}
function condAdv(c,kind,ab){const k=c.cond||{};const ex=c.exh||(c.ovr||{}).exh||0;let adv=0,dis=0;const why=[];
  const D=(t,w)=>{dis=1;why.push(w)};const A=(t,w)=>{adv=1;why.push(w)};
  if(kind==='attack'){for(const n of ['Poisoned','Frightened','Blinded','Prone','Restrained'])if(k[n])D(1,n.toLowerCase());if(k.Invisible)A(1,'invisible');if(ex>=3)D(1,'exhaustion')}
  if(kind==='check'||kind==='init'){if(k.Poisoned)D(1,'poisoned');if(k.Frightened)D(1,'frightened');if(ex>=1)D(1,'exhaustion')}
  if(kind==='save'){if(k.Restrained&&ab==='DEX')D(1,'restrained');if(ex>=3)D(1,'exhaustion');if(c.raging&&ab==='STR')A(1,'rage')}
  if(kind==='check'&&c.raging&&ab==='STR')A(1,'rage');
  return{adv,dis,why}}
function abOfLabel(label){const m=/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\b/.exec(label);if(m)return ABS[['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'].indexOf(m[1])];
  const sk=Object.keys(SKILLS).find(s=>new RegExp('\\b'+s+'\\b').test(label));return sk?SKILLS[sk]:null}
// enemy conditions live on the turn order so every player can see them
const FOE_CONDS=['Paralyzed','Stunned','Unconscious','Restrained','Prone','Blinded','Outlined','Frightened','Charmed','Poisoned','Invisible','Incapacitated'];
const ADV_VS=['Paralyzed','Stunned','Unconscious','Restrained','Prone','Blinded','Outlined','Petrified'];
function foeConds(id){const o=(initOf().order||[]).find(x=>x.id===id);return(o&&o.conds)||[]}
function setFoeCond(id,cond,on){const ini=initOf();const order=(ini.order||[]).map(o=>o.id!==id?o:{...o,conds:on?[...new Set([...(o.conds||[]),cond])]:(o.conds||[]).filter(x=>x!==cond)});setInit({order})}
rollD20=(function(prev){return async function(label,bonus,parts,opts){opts=opts||{};const u=opts.uid||(SH.chars[SH.me]&&!opts.name?SH.me:null);const c=u&&SH.chars[u];
  if(c&&!opts.name&&opts.adv===undefined){const kind=rollKind(label);const ab=kind==='save'||kind==='check'?abOfLabel(label):null;
    // paralyzed and friends: STR and DEX saves fail outright
    const k=c.cond||{};if(kind==='save'&&(ab==='STR'||ab==='DEX')&&(k.Paralyzed||k.Stunned||k.Unconscious||k.Petrified)){addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} cannot dodge (${['Paralyzed','Stunned','Unconscious','Petrified'].find(x=>k[x]).toLowerCase()}): the ${ABN[ab]} save fails.`,total:'',...(opts.sreq?{}:{})});
      if(opts.sreq){const e={by:SH.me,who:c.build.name,label:label+' (automatic fail)',detail:'cannot dodge',total:-99,kind:'d20',sreq:opts.sreq};showRoll(e);addLog(e)}return null}
    let {adv,dis,why}=condAdv(c,kind,ab);
    if(kind==='attack'&&opts.tgt){const fc=foeConds(opts.tgt);const a2=fc.filter(x=>ADV_VS.includes(x));if(a2.length){adv=1;why.push(opts.tname+' is '+a2.join(', ').toLowerCase())}if(fc.includes('Invisible')){dis=1;why.push(opts.tname+' is invisible')}}
    if(adv||dis){const base=SH.adv||0;let v=base+(adv?1:0)-(dis?1:0);v=Math.max(-1,Math.min(1,v));if(base===1&&dis&&!adv)v=0;if(base===-1&&adv&&!dis)v=0;
      return prev(label+` (${v>0?'advantage':v<0?'disadvantage':'advantage and disadvantage cancel'}: ${why.join(', ')})`,bonus,parts,{...opts,adv:v})}}
  return prev(label,bonus,parts,opts)}})(rollD20);
// (melee hits on paralyzed/unconscious enemies become critical where the DM's device decides the hit, in sh_turns.js)
// failed saves against these spells put a condition on the enemy
const SPELL_COND={'Hold Person':'Paralyzed','Hold Monster':'Paralyzed','Entangle':'Restrained','Web':'Restrained',"Evard's Black Tentacles":'Restrained','Faerie Fire':'Outlined','Command':'Prone',"Tasha's Hideous Laughter":'Prone','Hypnotic Pattern':'Charmed','Fear':'Frightened','Charm Person':'Charmed','Earth Tremor':'Prone','Thunderwave':'','Tidal Wave':'Prone','Destructive Wave':'Prone','Slow':'','Sleep':'Unconscious','Color Spray':'Blinded','Blindness/Deafness':'Blinded','Stinking Cloud':'Incapacitated','Polymorph':'','Banishment':''};
addLog=(function(prev){return function(e){if(SH.owner&&e&&e.kind==='note'&&/^[^:]+: .*(fails)/.test(e.label||'')){const spell=e.label.split(':')[0];const cond=SPELL_COND[spell];
    if(cond){const names=[...e.label.matchAll(/([^·:]+?) fails/g)].map(m=>m[1].trim());const ini=initOf();for(const n of names){const o=(ini.order||[]).find(x=>x.name===n||foeList().some(f=>f.id===x.id&&f.name===n));if(o)setFoeCond(o.id,cond,true)}
      if(names.length)e={...e,label:e.label+` → ${cond.toLowerCase()}`}}}return prev(e)}})(addLog);
// show and edit enemy conditions
dmFight=(function(prev){return function(){let h=prev();const ini=initOf();if(!ini.on)return h;
  for(const o of ini.order||[]){if(o.pc)continue;const cs=o.conds||[];const chips=`<span class="fconds">${cs.map(x=>`<button type="button" class="chip on xs" data-a="fcOff" data-k="${o.id}" data-c2="${x}" title="Remove">${esc(x)} ✕</button>`).join('')}<select data-c="fcAdd" data-k="${o.id}" aria-label="Add a condition"><option value="">+ condition</option>${FOE_CONDS.filter(x=>!cs.includes(x)).map(x=>`<option>${x}</option>`).join('')}</select></span>`;
    h=h.replace(new RegExp(`(<button type="button" class="btn xs" data-a="oDel" data-k="${o.id}"[^>]*>✕</button>)`),`${chips}$1`)}return h}})(dmFight);
ACT.fcOff=function(b){setFoeCond(b.dataset.k,b.dataset.c2,false)};Object.assign(CHG,{fcAdd(e){if(e.value)setFoeCond(e.dataset.k,e.value,true)}});
// players see enemy conditions in the target picker and the turn strip
foeList=(function(prev){return function(){return prev().map(f=>{const cs=foeConds(f.id);return cs.length?{...f,label:f.name+' · '+cs.join(', ').toLowerCase()}:f})}})(foeList);
initStripHTML=(function(prev){return function(){let h=prev();for(const o of (initOf().order||[])){if(o.pc||!(o.conds||[]).length)continue;h=h.replace(`>${esc(o.name)}<`,`>${esc(o.name)} <small class="ic">${esc(o.conds.join(', ').toLowerCase())}</small><`)}return h}})(initStripHTML);
// a fight that ends clears enemy conditions with it (the order is replaced); your own conditions stay until removed
// buzz the phone when it becomes your turn or you are asked to roll a save
render=(function(prev){return function(f){prev(f);try{if(isDM()||!SH.me)return;const ctx=fightCtx(SH.me);const k=ctx&&ctx.mine?ctx.key:'';const s=SH.state.sreq;const sk=s&&s.targets.includes(SH.me)&&!s.done[SH.me]?s.id:'';
  if((k&&k!==SH._buzzT)||(sk&&sk!==SH._buzzS)){if(navigator.vibrate)try{navigator.vibrate([120,60,120])}catch(e){}}SH._buzzT=k;SH._buzzS=sk}catch(e){}}})(render);
