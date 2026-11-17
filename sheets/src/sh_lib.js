// ================= the monster book, NPC presets, and enemies that attack the players =================
const ALL_MONS=()=>[...MONS_OP,...MONS_5E];
const MON_LIB=()=>RULES()==='5e'?MONS_5E:[...MONS_OP,...MONS_5E];
const monFind=n=>{const k=String(n||'').toLowerCase().replace(/\s*\(cr [^)]*\)\s*$/,'').trim();return ALL_MONS().find(m=>m.n.toLowerCase()===k)||null};
const crVal=cr=>{cr=String(cr);if(cr.includes('/')){const [a,b]=cr.split('/');return+a/+b}return+cr||0};
const monLabel=m=>`${m.n} (CR ${m.cr})`;
const libAtks=m=>(m.at||[]).filter(a=>parseDice(a[2]));
function monOfLib(m,extra){return{name:m.n,n:1,hp:m.hp,ac:m.ac,init:mod(m.ab[1]),lib:m.n,atks:libAtks(m),...(extra||{})}}
function monListHTML(){return`<datalist id="monList">${MON_LIB().map(m=>`<option value="${esc(monLabel(m))}">${esc(m.ty)} · ${m.hp} HP</option>`).join('')}</datalist>`}
function statBlockHTML(m){const ab=m.ab||[10,10,10,10,10,10];
  return`<div class="statblock"><p class="sbt"><i>${esc(m.ty)}</i> · CR ${esc(m.cr)} · ${m.src==='SRD'?'SRD 5.1':'DMG'}</p>
    <p><b>AC</b> ${m.ac} · <b>HP</b> ${m.hp}${m.hd?' ('+esc(m.hd)+')':''} · <b>Speed</b> ${esc(m.sp||'30 ft.')}</p>
    <div class="sbab">${ABS.map((a,i)=>`<span><small>${a}</small><b>${ab[i]}</b> ${fmt(mod(ab[i]))}</span>`).join('')}</div>
    ${Object.entries(m.x||{}).map(([k,v])=>`<p><b>${{saves:'Saves',skills:'Skills',senses:'Senses',res:'Resists',imm:'Immune',cimm:'Condition immune',vul:'Vulnerable',lang:'Languages'}[k]||k}</b> ${esc(v)}</p>`).join('')}
    ${(m.tx||[]).map(([n,t])=>`<p>${n?`<b>${esc(n)}.</b> `:''}${esc(t)}</p>`).join('')}
    ${libAtks(m).length?`<p class="hint">Attacks the app can roll: ${libAtks(m).map(a=>esc(a[0])+' '+(a[1]!==null?fmt(a[1]):'DC '+a[4]+' '+a[5])+' ('+esc(a[2])+')').join(' · ')}</p>`:''}</div>`}

// ---------------- NPC presets ----------------
const NPC_OP=[['Tavern keeper','npc_tav_m','Commoner','Pours drinks, hears every rumor in port'],['Barmaid','npc_tav_f','Commoner','Quick wit, knows who owes whom'],['Marine officer','npc_marine','Marine Soldier [Lieutenant]','Follows orders to the letter'],
  ['Marine recruit','npc_mar_f1','Marine Soldier [Recruit]','Nervous, wants to prove themself'],['Marine captain','npc_mar_m5','Marine Elite [Captain]','Hunts pirates for justice, or for promotion'],['Pirate thug','npc_pir_m3','Pirate Lackey [Buccaneer]','Loud, greedy, loyal to whoever pays'],
  ['Pirate captain','npc_pir_f1','Pirate Elite [Captain]','Has a bounty and a grudge'],['Pirate deckhand','npc_pir_m4','Pirate Lackey [Recruit]','Dreams of a bigger crew'],['Town doctor','npc_doc_f','Commoner','Patches anyone, asks no questions'],
  ['Old doctor','npc_doc_m','Commoner','Grumpy, brilliant, drinks too much'],['Blacksmith','npc_smith_m','Thug','Forges blades, hates rushed jobs'],['Shipwright','npc_wright_m','Commoner','Can fix any hull, for a price'],
  ['Shopkeeper','npc_shop_old','Commoner','Sells everything, remembers every face'],['Noble','npc_noble_m','Noble','Bored, rich and dangerous to offend'],['Noblewoman','npc_noble_f','Noble','Plays politics like chess'],
  ['Mayor','npc_mayor_m','Noble','Keeps the town quiet, keeps secrets quieter'],['King','npc_king_m','Noble','Rules a small island, fears a big enemy'],['Queen','npc_queen_f','Noble','Proud, sharp, protective of her people'],
  ['Town guard','npc_guard_m','Guard','Tired, underpaid, notices strangers'],['Guard captain','npc_guard_f','Veteran','Strict and fair'],['Spy','npc_spy_m','Spy','Works for someone powerful'],
  ['Scholar','npc_scholar_f','Commoner','Studies the Void Century in secret'],['Professor','npc_scholar_m','Commoner','Absent-minded, knows old maps'],['Gambler','npc_gambler_m','Spy','Never loses, never plays fair'],
  ['Thief','npc_thief_f','Bandit','Steals from pirates, mostly'],['Bounty hunter','npc_hunter_f','Bounty Hunter','Knows the players\' bounties by heart'],['Fish-Man brawler','npc_fish_m','Fish-Man Martial Artist','Distrusts humans'],
  ['Fish-Man elder','npc_fishman_m2','Fish-Man Martial Artist Master','Calm, strong, remembers the old wars'],['Mermaid','npc_mer_f','Commoner','Curious about the surface'],['Mink warrior','npc_mink_m2','Mink','Loyal, loud, says "Garchu!"'],
  ['Giant','npc_giant_m','Elbaf warrior','A warrior of Elbaf who values honor above all'],['Cyborg','npc_cyborg_f','Tinkerer','Half machine, fixes things with a hammer'],['Mad scientist','npc_vill_sci','Tinkerer','Experiments on anything that moves'],
  ['Witch','npc_witch_f','Mage','Reads fortunes, sells curses'],['Monk','npc_monk_m','Priest','Speaks in riddles'],['Nun','npc_nun_f','Acolyte','Runs the orphanage on the hill'],
  ['Musician','npc_musician_m','Commoner','Plays for coins and stories'],['Ship\'s cook','npc_cook_m','Commoner','Feeds anyone who is hungry'],['Farmer','npc_farmer_f','Commoner','Wants the pirates gone'],
  ['Harbor master','npc_harbor_f','Guard','Counts every ship that docks'],['Dancer','npc_dancer_f','Commoner','Performs for a corrupt lord'],['Revolutionary','npc_rev_m','Veteran','Fights the World Government in secret'],
  ['Corrupt noble','npc_vill_noble','Noble','Smiles while he ruins you'],['Yokai wanderer','npc_yokai_f','Samurai','Travels alone, carries a long blade'],['Sky Islander','npc_sky_f2','Scout','Fell from the clouds and wants to go back'],
  ['Tontatta dwarf','npc_dwarf_f','Scout','Tiny, fast and very trusting'],['Child','npc_kid_f1','Commoner','Wants to become a pirate'],['Fisherman','npc_fisherman','Commoner','Saw something huge under the waves'],
  ['Villager','npc_civ_mf1','Commoner','Just wants a quiet life'],['Old sailor','npc_civ_om1','Commoner','Has a story about every sea']];
const NPC_5E=[['Innkeeper','🍺','Commoner','Knows every rumor in town'],['Town guard','🛡','Guard','Tired, underpaid, notices strangers'],['Guard captain','⚔','Veteran','Strict and fair'],['Knight','🐎','Knight','Bound by an oath to a lord'],
  ['Noble','👑','Noble','Bored, rich and dangerous to offend'],['Priest','✝','Priest','Runs the temple, hides a doubt'],['Acolyte','🕯','Acolyte','Young and eager to help'],['Mage','🔮','Mage','Wants a rare book, pays well'],
  ['Merchant','💰','Commoner','Sells everything, remembers every face'],['Blacksmith','⚒','Thug','Forges blades, hates rushed jobs'],['Spy','🕵','Spy','Works for someone powerful'],['Bandit chief','🗡','Bandit Captain','Rules the forest road'],
  ['Bandit','🏹','Bandit','Robs travelers to feed a family'],['Cult leader','👁','Cult Fanatic','Speaks for a sleeping god'],['Cultist','🌑','Cultist','Believes every word'],['Assassin','☠','Assassin','Already knows your name'],
  ['Gladiator','🏟','Gladiator','Fights for coin and glory'],['Berserker','🪓','Berserker','Lives for battle'],['Scout','🌲','Scout','Knows every path through the woods'],['Farmer','🌾','Commoner','Wants the monsters gone'],
  ['Thug','👊','Thug','Collects debts with fists'],['Child','🧒','Commoner','Follows the heroes everywhere'],['Hermit','🍄','Commoner','Lives alone, knows an old secret'],['Bard','🎻','Commoner','Plays for coins and stories']];
const NAMES_OP=['Bonney','Garp','Rook','Mabel','Tibbs','Sable','Kessler','Marla','Gus','Pip','Dorra','Hollis','Crane','Wen','Fennick','Brina','Odo','Lazlo','Mira','Jory','Kaito','Rin','Hachi','Sota','Momo','Tenzo','Yuki','Bastien','Lola','Cobb','Ivo','Nell','Rufus','Saki','Zeff','Bram','Ophelia','Cassius','Dax','Elba','Jonas','Kiku','Lucan','Maro','Nami-ko','Pell','Quill','Renzo','Tamsin','Ursa','Vito','Wade','Yara'];
const NAMES_5E=['Aldric','Brienne','Corwin','Dela','Eldon','Fenna','Garrick','Hilde','Isolde','Jarek','Kestra','Lorien','Maelis','Nyx','Orrin','Petra','Quentin','Rhosyn','Sorin','Talia','Ulric','Vesna','Wren','Yorick','Zara','Bram','Cerys','Doran','Elowen','Faramund','Gwyn','Hollis','Ingram','Jessa','Kael','Lyra','Merrick','Nim','Osric','Perrin'];
const NPC_LIST=()=>RULES()==='5e'?NPC_5E:NPC_OP;
const npcImg=p=>p&&/^npc_/.test(p)?`${ART}${p}.${/^npc_(brina|crane|dockthief|dorra|fennick|fisherman|gus|hollis|kessler|mabry|marine|marla|pip|quartermaster|rattlefin|rook|sable|tibbs|wen)$/.test(p)?'jpg':'webp'}`:'';
const randName=()=>{const L=RULES()==='5e'?NAMES_5E:NAMES_OP;const used=new Set(campOf().npcs.map(n=>n.name));const free=L.filter(n=>!used.has(n));return(free.length?free:L)[Math.floor(Math.random()*(free.length?free.length:L.length))]};
function npcPortrait(n,sz){const im=npcImg(n.img);return im?`<img class="npcimg" src="${im}" alt="" style="width:${sz}px;height:${sz}px" onerror="this.remove()">`:n.img&&!/^npc_/.test(n.img)?`<span class="npcimg emo" style="width:${sz}px;height:${sz}px">${esc(n.img)}</span>`:avatar(n.name,sz)}
function npcGalleryHTML(){return`<details class="add" data-dk="npcgal"><summary>+ Add a person from the gallery</summary><p class="hint">Tap one. You get a random name you can change, a role and stats if they end up in a fight.</p>
  <div class="pickcards npcs">${NPC_LIST().map((p,i)=>`<button type="button" class="pcard" data-a="npcPreset" data-k="${i}">${/^npc_/.test(p[1])?`<img src="${npcImg(p[1])}" alt="" loading="lazy" onerror="this.remove()">`:`<span class="pcicon">${p[1]}</span>`}<b>${esc(p[0])}</b><small>${esc(p[3])}</small></button>`).join('')}</div></details>`}

// ---------------- prep page additions: library enemies, the monster book, NPC gallery ----------------
dmPrep=(function(old){return function(){let h=old();const C=campOf();
  // library picker inside each encounter
  for(const e of C.encs){const form=`<div class="form mon" id="cmN_${e.id}"`;const lib=`<div class="form inline libadd"><input id="clib_${e.id}" list="monList" placeholder="From the monster book: type a name" aria-label="Monster from the book"><input id="clibC_${e.id}" type="number" inputmode="numeric" value="1" min="1" max="12" aria-label="How many"><label class="ck"><input type="checkbox" id="clibX_${e.id}"> Hide name</label><button type="button" class="btn pri" data-a="cpMonLib" data-k="${e.id}">Add</button></div><details class="add"><summary>Or make one up</summary>`;
    h=h.replace(`<div class="form mon"><input id="cmN_${e.id}"`,lib+`<div class="form mon"><input id="cmN_${e.id}"`).replace(`data-a="cpMonAdd" data-k="${e.id}">Add enemy</button></div>`,`data-a="cpMonAdd" data-k="${e.id}">Add enemy</button></div></details>`)}
  // NPC gallery + richer NPC cards
  h=h.replace(/<h2>People <small>NPCs to remember<\/small><\/h2>\s*<div class="feats">[\s\S]*?<\/div>\s*<div class="form inline2"><input id="cpNN"/,()=>`<h2>People <small>NPCs to remember</small></h2><div class="feats">${C.npcs.map(n=>{const st=n.stat&&monFind(n.stat);return`<details data-dk="${n.id}"><summary>${npcPortrait(n,28)} ${esc(n.name)}${n.role?` <small>${esc(n.role)}</small>`:''}</summary>
      <div class="npchead">${npcPortrait(n,96)}<div style="flex:1"><label class="fl">Name<input data-c="cpNpc" data-k="${n.id}" data-f="name" value="${esc(n.name)}" maxlength="40"></label><label class="fl">Who they are<input data-c="cpNpc" data-k="${n.id}" data-f="role" value="${esc(n.role||'')}" maxlength="80" placeholder="e.g. Harbor master, hates pirates"></label></div></div>
      <label class="fl">Notes <small>voice, wants, secrets</small><textarea rows="3" data-c="cpNpc" data-k="${n.id}" data-f="notes" maxlength="2000">${esc(n.notes||'')}</textarea></label>
      <label class="fl">Stats if it comes to a fight<input data-c="cpNpc" data-k="${n.id}" data-f="stat" list="monList" value="${esc(n.stat||'')}" placeholder="e.g. Guard"></label>
      ${st?`<details data-dk="sb_${n.id}"><summary>Stat block: ${esc(st.n)}</summary>${statBlockHTML(st)}</details>`:''}
      <div class="row wrap" style="margin-top:10px"><button type="button" class="btn sm" data-a="npcIntro" data-k="${n.id}">📣 Introduce to the table</button>${st?`<button type="button" class="btn sm pri" data-a="npcFight" data-k="${n.id}">⚔ Add to the fight</button>`:''}<button type="button" class="btn sm red" data-a="cpDel" data-f="npcs" data-k="${n.id}">Delete</button></div></details>`}).join('')||'<p class="hint">Nobody yet.</p>'}</div>
    ${npcGalleryHTML()}<div class="form inline2"><input id="cpNN"`).replace('placeholder="New person (e.g. Old Brina)"','placeholder="Or type a name (e.g. Old Brina)"');
  // monster book
  const qy=(SH.mbq||'').toLowerCase();const L=MON_LIB().filter(m=>!qy||m.n.toLowerCase().includes(qy)||m.ty.toLowerCase().includes(qy)).sort((a,b)=>crVal(a.cr)-crVal(b.cr));
  h=h.replace('<h2>Loot <small>parcels to hand out</small></h2>',`<h2>Monster book <small>${MON_LIB().length} creatures</small></h2>
    <div class="form inline2"><input id="mbq" data-c="mbq" value="${esc(SH.mbq||'')}" placeholder="Search: marine, sea king, beast…" aria-label="Search the monster book"><button type="button" class="btn" data-a="mbqGo">Search</button></div>
    <div class="feats mbook">${L.slice(0,SH.mbAll?400:12).map(m=>`<details data-dk="mb_${esc(m.n)}"><summary>${esc(m.n)} <small>CR ${esc(m.cr)} · ${m.hp} HP · AC ${m.ac}</small></summary>${statBlockHTML(m)}</details>`).join('')||'<p class="hint">Nothing matches.</p>'}</div>
    ${L.length>12&&!SH.mbAll?`<button type="button" class="btn sm" data-a="mbAll">Show all ${L.length}</button>`:''}
    <h2>Loot <small>parcels to hand out</small></h2>`);
  return h+monListHTML()}})(dmPrep);
monLine=(function(old){return function(m){return old({...m,atk:m.atks&&m.atks.length?null:m.atk})+(m.atks&&m.atks.length?' · '+m.atks.map(a=>a[0]).join(', '):'')}})(monLine);

// ---------------- fight page: library enemies, enemy attacks with targets, players' damage ----------------
const monsOf=()=>((SH.dm.enc||{}).mons||{});
function monAtks(m){if(m.atks&&m.atks.length)return m.atks;if(m.atk!==undefined&&m.atk!==null)return[['Attack',m.atk,m.dmg||'1d6','']];return[]}
function hurtMon(id,delta,why){const mons={...monsOf()};const m=mons[id];if(!m)return;const o=(initOf().order||[]).find(x=>x.id===id);const nm=o&&o.hide?'An enemy':m.name;
  mons[id]={...m,hp:Math.max(0,Math.min(m.max,m.hp+delta))};put('dm/enc',{...(SH.dm.enc||{}),mons});
  addLog({by:SH.me,who:'DM',kind:'note',label:mons[id].hp<=0?`💀 ${nm} goes down${why?' ('+why+')':''}.`:`${nm} ${delta<0?'takes '+(-delta)+' damage':'heals '+delta}${why?' ('+why+')':''}.`,total:'',quiet:mons[id].hp>0})}
dmFight=(function(old){return function(){let h=old();const ini=SH.state.init;if(!ini||!ini.on)return h;const mons=monsOf();const order=ini.order||[];
  const pcs=Object.entries(SH.chars).filter(([,c])=>charOK(c)&&!c.dead);
  // attack buttons + target picker on each enemy row
  for(const o of order){const m=mons[o.id];if(!m)continue;const A=monAtks(m);
    const old1=m.atk!==undefined&&m.atk!==null?`<button type="button" class="btn xs" data-a="mAtk" data-k="${o.id}">Atk ${fmt(m.atk)}</button>`:'';
    const btns=A.length&&m.hp>0?`<div class="matks">${A.map((a,i)=>`<button type="button" class="btn xs ${SH.mt&&SH.mt.id===o.id&&SH.mt.i===i?'pri':''}" data-a="mtPick" data-k="${o.id}" data-i="${i}">⚔ ${esc(a[0].replace(/ \(Recharge[^)]*\)/,' ⟳'))} ${a[1]!==null?fmt(a[1]):'DC '+a[4]}</button>`).join('')}${m.lib?`<button type="button" class="btn xs" data-a="mSb" data-k="${o.id}" aria-label="Stat block">📖</button>`:''}</div>`:'';
    const mt=SH.mt&&SH.mt.id===o.id?SH.mt:null;const a=mt?A[mt.i]:null;
    const pick=a?`<div class="mtarget"><span>${esc(a[0])}: ${a[1]!==null?'who does it attack?':'who is caught in it? (pick one or more)'}</span><div class="chipset">${pcs.map(([u,c])=>`<button type="button" class="chip tog ${(mt.t||[]).includes(u)?'on':''}" data-a="mtTo" data-u="${u}">${esc(c.build.name)} <small>AC ${DV(c).ac}</small></button>`).join('')}</div>
      <div class="row">${a[1]===null?`<button type="button" class="btn pri sm" data-a="mtGo" ${(mt.t||[]).length?'':'disabled'}>Roll the saves</button>`:''}<button type="button" class="btn sm" data-a="mtCancel">Cancel</button></div></div>`:'';
    const sb=SH.msb===o.id&&m.lib&&monFind(m.lib)?statBlockHTML(monFind(m.lib)):'';
    if(btns){const hb=new RegExp(`<button type="button" class="btn xs" data-a="oHide" data-k="${o.id}"[^>]*>[^<]*</button>`).exec(h);const db=new RegExp(`<button type="button" class="btn xs" data-a="oDel" data-k="${o.id}"[^>]*>✕</button>`).exec(h);
      if(hb&&db){h=h.replace(hb[0],'').replace(db[0]+'</div>',`${btns.replace(/<\/div>$/,`<span class="mtools">${hb[0]}${db[0]}</span></div>`)}${pick}${sb}</div>`)}}
    else h=h.replace(new RegExp(`(<button type="button" class="btn xs" data-a="oDel" data-k="${o.id}"[^>]*>✕</button>)</div>`),`$1${pick}${sb}</div>`);if(old1)h=h.replace(old1,'')}
  // players' damage rolls waiting to be applied
  const done=(SH.dm.enc||{}).done||[];const live=order.filter(o=>mons[o.id]&&mons[o.id].hp>0);
  const pend=SH.log.filter(e=>e.kind==='dmg'&&!/heal|hit die|temporary/i.test(e.label||'')&&SH.chars[e.by]&&(e.t||0)>=(ini.t||0)&&!done.includes(e.id)).slice(0,6);
  const panel=pend.length&&live.length?`<h2>Players' damage <small>pick who took it</small></h2><div class="list">${pend.map(e=>`<div class="item dmgrow"><span><b>${esc(e.who)}</b> ${esc(e.label)}<small>${esc(e.detail||'')}</small></span><b class="dtot">${e.total}</b>
      <select id="dTo_${e.id}" aria-label="Which enemy">${live.map(o=>`<option value="${o.id}" ${SH.lastTarget===o.id?'selected':''}>${esc(o.name)} (${mons[o.id].hp})</option>`).join('')}</select><button type="button" class="btn xs red" data-a="dApply" data-k="${e.id}" data-m="1">Apply</button><button type="button" class="btn xs" data-a="dApply" data-k="${e.id}" data-m="0.5">½</button><button type="button" class="btn xs" data-a="dSkip" data-k="${e.id}" aria-label="Ignore">✕</button></div>`).join('')}</div>`:'';
  // library add form
  h=h.replace('<h2>Add enemies</h2><div class="form">',`${panel}<h2>Add enemies</h2><div class="form inline libadd"><input id="flib" list="monList" placeholder="From the monster book: type a name" aria-label="Monster from the book"><input id="flibC" type="number" inputmode="numeric" value="1" min="1" max="12" aria-label="How many"><label class="ck"><input type="checkbox" id="flibX" ${SH.state.hideNames?'checked':''}> Hide name</label><button type="button" class="btn pri" data-a="fMonLib">Add</button></div>
    ${campOf().npcs.some(n=>n.stat&&monFind(n.stat))?`<div class="row wrap"><small>Your NPCs:</small>${campOf().npcs.filter(n=>n.stat&&monFind(n.stat)).map(n=>`<button type="button" class="btn sm" data-a="npcFight" data-k="${n.id}">${esc(n.name)}</button>`).join('')}</div>`:''}
    <details class="add"><summary>Or make one up</summary><div class="form">`).replace('data-a="monAdd">Add and roll initiative</button></div>','data-a="monAdd">Add and roll initiative</button></div></details>');
  return h+monListHTML()}})(dmFight);

async function monAttack(id,i,targets){const m=monsOf()[id];const o=(initOf().order||[]).find(x=>x.id===id);if(!m||!o)return;const a=monAtks(m)[i];if(!a)return;const nm=o.hide?'Enemy':m.name;
  if(a[1]!==null){const u=targets[0];const c=SH.chars[u];const D=DV(c);
    const e=await rollD20(`${a[0]} → ${c.build.name}`,a[1],fmt(a[1]),{name:nm,secret:true});const crit=e.nat===20;const hit=crit||(e.nat!==1&&e.total>=D.ac);
    if(!hit){addLog({by:SH.me,who:nm,kind:'note',label:`${nm}'s ${a[0]} misses ${c.build.name}.`,total:''});return}
    const r=rollExprNow(a[2],crit);secretLog({by:SH.me,who:nm,label:`${a[0]} damage → ${c.build.name}${crit?' (critical)':''}`,detail:r.detail,total:r.total,kind:'dmg'});hpChange(u,-r.total,`${nm}'s ${a[0]} hits${crit?', a critical hit':''}${a[3]?', '+a[3]:''}`)}
  else{const r=rollExprNow(a[2]);secretLog({by:SH.me,who:nm,label:`${a[0]} damage`,detail:r.detail,total:r.total,kind:'dmg'});const ab=a[5]||'DEX';const lines=[];
    for(const u of targets){const c=SH.chars[u];if(!c)continue;const D=DV(c);const sb=(D.saves[ab]||{bonus:0}).bonus;const n=d(20);const ok=n+sb>=a[4];const dmg=ok?(a[6]?Math.floor(r.total/2):0):r.total;
      lines.push(`${c.build.name} ${n+sb} (${ok?'saved':'failed'})`);if(dmg)hpChange(u,-dmg,`${nm}'s ${a[0]}, ${ABN[ab]||ab} save ${n+sb}, ${ok?'saved':'failed'}${a[3]?', '+a[3]:''}`)}
    addLog({by:SH.me,who:nm,kind:'note',label:`${nm} uses ${a[0]}! ${ABN[ab]||ab} saves: ${lines.join(' · ')}`,total:''})}}

Object.assign(ACT,{
  cpMonLib(b){const k=b.dataset.k;const m=monFind(val('clib_'+k));if(!m){toast('Pick a creature from the list.');return}const n=Math.max(1,Math.min(12,Math.round(num('clibC_'+k))||1));
    campEdit(c=>{byId(c.encs,k).mons.push(monOfLib(m,{n,hide:!!(q('#clibX_'+k)&&q('#clibX_'+k).checked)}))});render(true)},
  fMonLib(){const m=monFind(val('flib'));if(!m){toast('Pick a creature from the list.');return}addMons([monOfLib(m,{n:Math.max(1,Math.min(12,Math.round(num('flibC'))||1)),hide:!!(q('#flibX')&&q('#flibX').checked)})]);render(true)},
  mbqGo(){SH.mbq=val('mbq').trim();SH.mbAll=false;render(true)},mbAll(){SH.mbAll=true;render(true)},
  npcPreset(b){const p=NPC_LIST()[+b.dataset.k];if(!p)return;const id=uidNew();campEdit(c=>{c.npcs.push({id,name:randName(),role:p[0]+': '+p[3],img:p[1],stat:p[2],notes:''})});SH.forceOpen=id;SH.forceClose='npcgal';render(true);const d=qa('details[data-dk]').find(x=>x.dataset.dk===id);if(d)d.scrollIntoView({block:'center'})},
  npcIntro(b){const n=byId(campOf().npcs,b.dataset.k);if(n)addLog({by:SH.me,who:'DM',kind:'note',read:true,label:`👤 ${n.name}${n.role?', '+n.role.split(':')[0].toLowerCase():''}`,total:'',npcImg:n.img||''});toast('Introduced.')},
  npcFight(b){const n=byId(campOf().npcs,b.dataset.k);const m=n&&monFind(n.stat);if(!m)return;addMons([monOfLib(m,{name:n.name})]);SH.dmTab='fight';render(true)},
  mtPick(b){const id=b.dataset.k,i=+b.dataset.i;if(SH.mt&&SH.mt.id===id&&SH.mt.i===i){SH.mt=null}else SH.mt={id,i,t:[]};render(true)},
  mtTo(b){const mt=SH.mt;if(!mt)return;const m=monsOf()[mt.id];const a=m&&monAtks(m)[mt.i];if(!a)return;
    if(a[1]!==null){SH.mt=null;render(true);monAttack(mt.id,mt.i,[b.dataset.u]);return}
    mt.t=mt.t.includes(b.dataset.u)?mt.t.filter(x=>x!==b.dataset.u):[...mt.t,b.dataset.u];render(true)},
  mtGo(){const mt=SH.mt;if(!mt||!mt.t.length)return;SH.mt=null;render(true);monAttack(mt.id,mt.i,mt.t)},
  mtCancel(){SH.mt=null;render(true)},mSb(b){SH.msb=SH.msb===b.dataset.k?null:b.dataset.k;render(true)},
  dApply(b){const e=SH.log.find(x=>x.id===b.dataset.k);const to=val('dTo_'+b.dataset.k);if(!e||!to)return;const n=Math.floor(e.total*(+b.dataset.m));SH.lastTarget=to;
    put('dm/enc',{...(SH.dm.enc||{}),done:[...((SH.dm.enc||{}).done||[]),e.id].slice(-60)});hurtMon(to,-n,`${e.who}: ${e.label}${b.dataset.m==='0.5'?', halved':''}`)},
  dSkip(b){put('dm/enc',{...(SH.dm.enc||{}),done:[...((SH.dm.enc||{}).done||[]),b.dataset.k].slice(-60)})}});
Object.assign(CHG,{mbq(e){SH.mbq=e.value.trim();SH.mbAll=false;setTimeout(()=>render(true),0)}});
// put()/dm/enc writes elsewhere drop the "done" list: keep it
{const _put=put;put=function(path,data){if(path==='dm/enc'&&data&&!data.done&&SH.dm.enc&&SH.dm.enc.done&&data.mons&&Object.keys(data.mons).length)data={...data,done:SH.dm.enc.done};return _put(path,data)}}
