// ---------- Devil Fruit Encyclopedia on the sheet (data: sh_fruitdb.js, from the One Piece Devil Fruit Encyclopedia by OneWorldHD) ----------
const dfeT=t=>typeof t==='string'&&t[0]==='@'?DFE_TXT[+t.slice(1)]:t;
const dfeNorm=s=>String(s||'').toLowerCase().replace(/\bno mi\b/g,'').replace(/model/g,'').replace(/[^a-z]/g,'');
const dfeName=f=>`${f.jp}${f.model?', Model: '+f.model:''}${f.en?' ('+f.en+')':''}`;
const DFE_ALIAS={gomugomu:'hito_nika',gomu:'hito_nika',gomugomunomi:'hito_nika'};
let _dfeIdx=null;
function dfeFind(name){if(!name)return null;const n=dfeNorm(name);if(!n)return null;
  if(!_dfeIdx){_dfeIdx={};DFE.forEach(f=>{[dfeName(f),f.jp+f.model,f.k,f.jp+' '+f.model+' '+f.en,f.jp+' ('+f.en+')'].forEach(x=>{const k=dfeNorm(x);if(k&&!_dfeIdx[k])_dfeIdx[k]=f});const j=dfeNorm(f.jp);if(!_dfeIdx[j])_dfeIdx[j]=f;const e=dfeNorm(f.en);if(!_dfeIdx['en:'+e])_dfeIdx['en:'+e]=f})}
  const al=DFE_ALIAS[n];if(al)return DFE.find(f=>f.k===al)||null;
  return _dfeIdx[n]||_dfeIdx['en:'+n]||null}
function dfeCharges(f){return f.ch||(f.sp.length?RARITY_INFO[f.rar]?.ch||5:0)}
// Hook the shared fruit rules: rarity sets the save DC and attack bonus, the encyclopedia sets the charges.
fruitRarity=(function(old){return function(c){const f=c&&dfeFind(c.fruit);return f&&RARITY_INFO[f.rar]?f.rar:old(c)}})(fruitRarity);
fruitOf=(function(old){return function(c){const f=c&&dfeFind(c.fruit);if(!f)return old(c);return{dfe:f,name:f.jp,display:dfeName(f),type:f.type,rarity:f.rar,charges:dfeCharges(f),passives:[],techs:[]}}})(fruitOf);

// Dice for the spells fruits cast (5e SRD numbers). l=spell level, d=dice, u=extra dice per extra charge,
// s=save ability (h=half on a save), a=spell attack, heal / temp = healing or temporary HP.
const SPELL_DICE={'sapping sting':{l:0,d:'1d4',s:'CON',t:'necrotic'},'fire bolt':{l:0,d:'1d10',a:1,t:'fire'},
 'burning hands':{l:1,d:'3d6',u:'1d6',s:'DEX',h:1,t:'fire'},'thunderwave':{l:1,d:'2d8',u:'1d8',s:'CON',h:1,t:'thunder'},'earth tremor':{l:1,d:'1d6',u:'1d6',s:'DEX',t:'bludgeoning'},
 'catapult':{l:1,d:'3d8',u:'1d8',s:'DEX',t:'bludgeoning'},'ray of sickness':{l:1,d:'2d8',u:'1d8',a:1,t:'poison'},'guiding bolt':{l:1,d:'4d6',u:'1d6',a:1,t:'radiant'},
 'chromatic orb':{l:1,d:'3d8',u:'1d8',a:1,t:'chosen'},'witch bolt':{l:1,d:'1d12',u:'1d12',a:1,t:'lightning'},'magic missile':{l:1,d:'3d4+3',u:'1d4+1',t:'force'},'magic misile':{l:1,d:'3d4+3',u:'1d4+1',t:'force'},
 'inflict wounds':{l:1,d:'3d10',u:'1d10',a:1,t:'necrotic'},'arms of hadar':{l:1,d:'2d6',u:'1d6',s:'STR',h:1,t:'necrotic'},'dissonant whispers':{l:1,d:'3d6',u:'1d6',s:'WIS',h:1,t:'psychic'},
 "tasha's caustic brew":{l:1,d:'2d4',u:'2d4',s:'DEX',t:'acid'},'frost fingers':{l:1,d:'2d8',u:'1d8',s:'CON',h:1,t:'cold'},'chaos bolt':{l:1,d:'2d8+1d6',u:'1d6',a:1,t:'random'},
 'thunderous smite':{l:1,d:'2d6',t:'thunder',smite:1},'wrathful smite':{l:1,d:'1d6',t:'psychic',smite:1},'searing smite':{l:1,d:'1d6',u:'1d6',t:'fire',smite:1},
 'hellish rebuke':{l:1,d:'2d10',u:'1d10',s:'DEX',h:1,t:'fire'},'ice knife':{l:1,d:'1d10+2d6',u:'1d6',a:1,t:'piercing + cold'},
 'cure wounds':{l:1,d:'1d8',u:'1d8',heal:1},'healing word':{l:1,d:'1d4',u:'1d4',heal:1},'false life':{l:1,d:'1d4+4',u:'5',temp:1},'armor of agathys':{l:1,d:'5',u:'5',temp:1},
 'shatter':{l:2,d:'3d8',u:'1d8',s:'CON',h:1,t:'thunder'},'cloud of daggers':{l:2,d:'4d4',u:'2d4',t:'slashing'},'spike growth':{l:2,d:'2d4',t:'piercing (per 5 ft)'},
 'acid arrow':{l:2,d:'4d4',u:'1d4',a:1,t:'acid'},'scorching ray':{l:2,d:'6d6',u:'2d6',a:1,t:'fire'},'moonbeam':{l:2,d:'2d10',u:'1d10',s:'CON',h:1,t:'radiant'},
 'heat metal':{l:2,d:'2d8',u:'1d8',t:'fire'},'flame blade':{l:2,d:'3d6',a:1,t:'fire'},"maximilian's earthen grasp":{l:2,d:'2d6',s:'STR',t:'bludgeoning'},"maximillian's earthen grasp":{l:2,d:'2d6',s:'STR',t:'bludgeoning'},
 'erupting earth':{l:3,d:'3d12',u:'1d12',s:'DEX',h:1,t:'bludgeoning'},'thunder step':{l:3,d:'3d10',u:'1d10',s:'CON',h:1,t:'thunder'},'fireball':{l:3,d:'8d6',u:'1d6',s:'DEX',h:1,t:'fire'},
 'lightning bolt':{l:3,d:'8d6',u:'1d6',s:'DEX',h:1,t:'lightning'},'conjure barrage':{l:3,d:'3d8',s:'DEX',h:1,t:'weapon'},'spirit guardians':{l:3,d:'3d8',u:'1d8',s:'WIS',h:1,t:'radiant'},
 'vampiric touch':{l:3,d:'3d6',u:'1d6',a:1,t:'necrotic'},'hunger of hadar':{l:3,d:'2d6',t:'cold'},'pulse wave':{l:3,d:'6d6',u:'1d6',s:'CON',h:1,t:'force'},'tidal wave':{l:3,d:'4d8',s:'DEX',h:1,t:'bludgeoning'},
 'blinding smite':{l:3,d:'3d8',t:'radiant',smite:1},'life transference':{l:3,d:'4d8',u:'1d8',t:'necrotic'},'aura of vitality':{l:3,d:'2d6',heal:1},'mass healing word':{l:3,d:'1d4',u:'1d4',heal:1},
 'blight':{l:4,d:'8d8',u:'1d8',s:'CON',h:1,t:'necrotic'},'ice storm':{l:4,d:'2d8+4d6',u:'1d8',s:'DEX',h:1,t:'bludgeoning + cold'},"evard's black tentacles":{l:4,d:'3d6',s:'DEX',t:'bludgeoning'},
 'vitriolic sphere':{l:4,d:'10d4',u:'2d4',s:'DEX',h:1,t:'acid'},'sickening radiance':{l:4,d:'4d10',s:'CON',t:'radiant'},'storm sphere':{l:4,d:'2d6',u:'1d6',s:'STR',t:'bludgeoning'},
 'phantasmal killer':{l:4,d:'4d10',u:'1d10',s:'WIS',t:'psychic'},'gravity sinkhole':{l:4,d:'5d10',u:'1d10',s:'CON',h:1,t:'force'},'staggering smite':{l:4,d:'4d6',t:'psychic',smite:1},'fire shield':{l:4,d:'2d8',t:'fire or cold'},
 'cone of cold':{l:5,d:'8d8',u:'1d8',s:'CON',h:1,t:'cold'},'flame strike':{l:5,d:'8d6',u:'1d6',s:'DEX',h:1,t:'fire + radiant'},'cloudkill':{l:5,d:'5d8',u:'1d8',s:'CON',h:1,t:'poison'},
 'destructive wave':{l:5,d:'10d6',s:'CON',h:1,t:'thunder + radiant'},'conjure volley':{l:5,d:'8d8',s:'DEX',h:1,t:'weapon'},"bigby's hand":{l:5,d:'4d8',u:'2d8',a:1,t:'force'},
 'steel wind strike':{l:5,d:'6d10',a:1,t:'force'},'immolation':{l:5,d:'8d6',u:'1d6',s:'DEX',h:1,t:'fire'},'mass cure wounds':{l:5,d:'3d8',u:'1d8',heal:1},
 'circle of death':{l:6,d:'8d6',u:'2d6',s:'CON',h:1,t:'necrotic'},'prismatic spray':{l:7,d:'10d6',s:'DEX',h:1,t:'varies'},'incendiary cloud':{l:8,d:'10d8',s:'DEX',h:1,t:'fire'},
 'dark star':{l:8,d:'8d10',s:'CON',h:1,t:'force'},'meteor swarm':{l:9,d:'20d6+20d6',s:'DEX',h:1,t:'fire + bludgeoning'}};
const spellKey=s=>String(s||'').toLowerCase().replace(/[’`]/g,"'").trim();
function spellDice(sd,extra){if(!sd)return null;if(!extra||!sd.u)return sd.d;
  const m=/^(\d+)d(\d+)(.*)$/.exec(sd.d),mu=/^(\d+)d(\d+)(?:\+(\d+))?$/.exec(sd.u);
  if(m&&mu&&m[2]===mu[2]){let rest=m[3];if(mu[3]){const b=/\+(\d+)$/.exec(rest);rest=b?rest.replace(/\+\d+$/,'+'+(+b[1]+mu[3]*extra)):rest+'+'+mu[3]*extra}return`${+m[1]+mu[1]*extra}d${m[2]}${rest}`}
  if(/^\d+$/.test(sd.d)&&/^\d+$/.test(sd.u))return String(+sd.d+sd.u*extra);
  return sd.d+Array(extra).fill('+'+sd.u).join('')}
const upcastable=s=>/higher level|additional charge/i.test(s[2]||'');
// feature text that lets you spend charges ("by spending 3 devil fruit charges")
const featCost=t=>{const m=/(?:spend(?:ing)?|expend(?:ing)?)\s+(\d+|one|two|three|four|five)\s+(?:of your\s+)?(?:devil fruit\s+)?charges?/i.exec(t||'');if(!m)return 0;return{one:1,two:2,three:3,four:4,five:5}[m[1].toLowerCase()]||+m[1]};
const featAtk=t=>{const m=/Weapon Attack:\s*\+(\d+) to hit[\s\S]*?Hit:?\s*(?:\d+\s*)?\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*(\w+)/i.exec(t||'');return m?{b:+m[1],d:m[2].replace(/\s/g,''),t:m[3]}:null};
const featDice=t=>{const m=/(\d+d\d+(?:\s*\+\s*\d+)?)\s+([a-z]+)\s+damage/i.exec(t||'');return m?{d:m[1].replace(/\s/g,''),t:m[2]}:null};

function dfeSheetHTML(uid,c,D,fr){const f=fr.dfe;const ed=canEdit(uid);const res=c.res||{};const used=res.fruit||0;const max=fr.charges;const left=max-used;
  const up=(SH.fup||{})[uid]||{};const awk=!!c.fruitAwk;const dm=SH.owner;
  const spells=f.sp.map((s,i)=>{const sd=SPELL_DICE[spellKey(s[3])]||SPELL_DICE[spellKey(s[0])];const ex=up[i]||0;const cost=s[1]+ex;
    const tag=sd?(sd.heal?'heal '+spellDice(sd,ex):sd.temp?'temp HP '+spellDice(sd,ex):(sd.a?'attack · ':sd.s?sd.s+' save · ':'')+spellDice(sd,ex)+' '+sd.t):'';
    return`<div class="spell fsp"><div><b>${esc(s[0])}</b> <small>${cost} charge${cost>1?'s':''}${s[3]&&spellKey(s[3])!==spellKey(s[0])?' · as '+esc(s[3]):''}${tag?' · '+esc(tag):''}</small>${s[2]?`<p>${esc(s[2])}</p>`:''}</div>
      ${ed?`<span class="fbtns">${upcastable(s)?`<button type="button" class="btn xs" data-a="fUp" data-u="${uid}" data-k="${i}" data-d="-1" aria-label="One charge less"${ex?'':' disabled'}>−</button><button type="button" class="btn xs" data-a="fUp" data-u="${uid}" data-k="${i}" data-d="1" aria-label="Cast at a higher level"${cost<left?'':' disabled'}>+</button>`:''}<button type="button" class="btn dmg" data-a="fCast" data-u="${uid}" data-k="${i}"${cost>left?' disabled':''}>Use</button></span>`:''}</div>`}).join('');
  const feat=(x,j,pre)=>{const t=dfeT(x[1]);const fc=featCost(t);
    return`<div class="${fc||featAtk(t)?'spell fsp':''}"><div><p><b>${esc(x[0])}.</b> ${esc(t)}</p></div>${fc&&ed&&(pre!=='a'||awk)?`<span class="fbtns"><button type="button" class="btn dmg" data-a="fFeat" data-u="${uid}" data-k="${pre}${j}"${fc>left?' disabled':''}>Use · ${fc}</button></span>`:''}${!fc&&ed&&featAtk(t)&&(pre!=='a'||awk)?`<span class="fbtns"><button type="button" class="btn dmg" data-a="fAtk" data-u="${uid}" data-k="${pre}${j}">${fmt(featAtk(t).b)} · ${esc(featAtk(t).d)}</button></span>`:''}</div>`};
  return`<div class="card fruit dfe"><div class="fhead"><b>🍇 ${esc(f.jp)}${f.model?' · Model: '+esc(f.model):''}</b> <small>${f.en?esc(f.en)+' · ':''}${esc(f.type)} · ${esc(f.rar)}</small></div>
    <div class="row chips"><span class="chip">Save DC ${fruitDC(D,c)}</span><span class="chip">Attack ${fmt(fruitAtk(D,c))}</span>${awk?'<span class="chip on">✨ Awakened</span>':''}</div>
    ${max?`<div class="resrow"><span>Charges <small>regain at dawn</small></span>${pipsHTML(uid,'fruit',max,used,'Fruit charge')}</div>`:''}
    <details data-dk="flook_${uid}"><summary>What it looks like</summary>${f.look?`<p><i>${esc(f.look)}</i></p>`:''}<p>${esc(f.desc)}</p></details>
    <h3>Powers</h3>${f.feats.map((x,j)=>feat(x,j,'f')).join('')}
    ${spells?`<h3>Techniques <small>spend charges</small></h3>${spells}`:''}
    ${f.awk?`<details data-dk="fawk_${uid}"${awk?' open':''}><summary>Awakening: ${esc(f.awk[0]||'Awakened')} ${awk?'':'<small>(locked until the DM says so)</small>'}</summary><p>${esc(dfeT(f.awk[1]))}</p>${awk&&featCost(dfeT(f.awk[1]))?feat(f.awk,'','a'):''}</details>`:''}
    ${dm?`<label class="row tog"><input type="checkbox" data-c="fruitAwk" data-u="${uid}"${awk?' checked':''}> DM: the fruit is awakened</label>`:''}
    <p class="hint">You can never swim again. Seawater and seastone sap your strength. The DM rules anything the fruit does beyond this.</p></div>`}

opPowersHTML=(function(old){return function(uid,c,D){let h=old(uid,c,D);const fr=fruitOf(c);
  // full encyclopedia list in the picker
  h=h.replace(/<datalist id="fruitList">[\s\S]*?<\/datalist>/,`<datalist id="fruitList">${DFE.map(f=>`<option value="${esc(dfeName(f))}">${esc(f.rar)}</option>`).join('')}</datalist>`)
     .replace('placeholder="None. Type or pick a fruit"','placeholder="None. Type a fruit, power or animal"');
  if(fr&&fr.dfe)h=h.replace(/<div class="card fruit">[\s\S]*?The DM rules anything the fruit can do beyond this\.<\/p><\/div>/,()=>dfeSheetHTML(uid,c,D,fr));
  else if(c.fruit&&!fr?.dfe)h=h.replace('<div class="card fruit">','<div class="card fruit"><p class="hint">Not in the encyclopedia, so this uses a homebrew fruit. Pick a name from the list for the full fruit sheet.</p>');
  return h}})(opPowersHTML);

function fruitSpend(u,cost,label){const c=SH.chars[u];const fr=fruitOf(c);const used=(c.res||{}).fruit||0;
  if(fr.charges&&used+cost>fr.charges){toast('Not enough charges left.');return false}
  if(fr.charges)saveChar(u,{res:{...(c.res||{}),fruit:used+cost}});return true}
Object.assign(ACT,{
  fUp(b){const u=b.dataset.u,i=+b.dataset.k;SH.fup=SH.fup||{};const m=SH.fup[u]=SH.fup[u]||{};m[i]=Math.max(0,(m[i]||0)+(+b.dataset.d));render(true)},
  fCast(b){const u=b.dataset.u,i=+b.dataset.k;const c=SH.chars[u];const D=DV(c);const fr=fruitOf(c);if(!fr||!fr.dfe)return;const s=fr.dfe.sp[i];if(!s)return;
    const ex=((SH.fup||{})[u]||{})[i]||0;const cost=s[1]+ex;if(!fruitSpend(u,cost))return;if(SH.fup&&SH.fup[u])delete SH.fup[u][i];
    const sd=SPELL_DICE[spellKey(s[3])]||SPELL_DICE[spellKey(s[0])];const dice=spellDice(sd,ex);const nm=`🍇 ${s[0]}`;const chg=` (${cost} charge${cost>1?'s':''})`;
    if(sd&&sd.a)rollD20(s[0],fruitAtk(D,c),`${fmt(fruitAtk(D,c))} fruit attack${chg}`,{uid:u,follow:[{t:`Damage ${dice}`,run:crit=>rollDmg(`${s[0]} ${sd.t} damage`,dice,{uid:u,crit})}]});
    else{addLog({by:SH.me,who:who(u),kind:'note',label:`${nm}${chg}${s[3]&&spellKey(s[3])!==spellKey(s[0])?' as '+s[3]:''}${sd&&sd.s?`: ${sd.s} save DC ${fruitDC(D,c)}${sd.h?', half on a success':''}`:''}${sd&&sd.smite?': on your next weapon hit':''}`,total:''});
      if(sd)rollDmg(sd.heal?`${s[0]} healing`:sd.temp?`${s[0]} temporary HP`:`${s[0]} ${sd.t} damage`,dice,{uid:u})}},
  fFeat(b){const u=b.dataset.u,k=b.dataset.k;const c=SH.chars[u];const D=DV(c);const fr=fruitOf(c);if(!fr||!fr.dfe)return;
    const x=k[0]==='a'?fr.dfe.awk:fr.dfe.feats[+k.slice(1)];if(!x)return;const t=dfeT(x[1]);const cost=featCost(t);if(!fruitSpend(u,cost))return;
    const sv=/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/i.exec(t);const dd=featDice(t);
    addLog({by:SH.me,who:who(u),kind:'note',label:`🍇 ${who(u)} uses ${x[0]} (${cost} charge${cost>1?'s':''})${sv?`: ${sv[1]} save DC ${fruitDC(D,c)}`:''}`,total:''});
    if(dd)rollDmg(`${x[0]} ${dd.t} damage`,dd.d,{uid:u})}});
ACT.fAtk=function(b){const u=b.dataset.u,k=b.dataset.k;const fr=fruitOf(SH.chars[u]);if(!fr||!fr.dfe)return;const x=k[0]==='a'?fr.dfe.awk:fr.dfe.feats[+k.slice(1)];const A=x&&featAtk(dfeT(x[1]));if(!A)return;
  rollD20(x[0],A.b,fmt(A.b),{uid:u,follow:[{t:'Damage '+A.d,run:crit=>rollDmg(`${x[0]} ${A.t} damage`,A.d,{uid:u,crit})}]})};
Object.assign(CHG,{fruitAwk(e){const u=e.dataset.u;if(!SH.owner)return;saveChar(u,{fruitAwk:e.checked});addLog({by:SH.me,who:'DM',kind:'note',label:`✨ ${who(u)}'s Devil Fruit ${e.checked?'awakens!':'is no longer awakened.'}`,total:''})}});
