// ================= campaign prep: the DM plans scenes, encounters, NPCs and loot before the session =================
// Everything here lives in the DM's private notes (players never receive it) until the DM reads a scene aloud,
// runs an encounter or hands out a loot parcel.
const campOf=()=>({name:'',pitch:'',scenes:[],encs:[],npcs:[],loot:[],...(SH.dm.camp||{})});
const saveCamp=c=>put('dm/camp',c);
function campEdit(fn){const c=clone(campOf());fn(c);saveCamp(c)}
const byId=(L,id)=>L.find(x=>x.id===id);
function monLine(m){return`${m.n>1?m.n+' × ':''}${m.name} · ${m.hp} HP${m.ac?' · AC '+m.ac:''}${m.init?' · init '+fmt(m.init):''}${m.atk!==null&&m.atk!==undefined&&m.atk!==''?' · attack '+fmt(+m.atk)+(m.dmg?' ('+m.dmg+')':''):''}${m.hide?' · hidden name':''}`}
function dmPrep(){const C=campOf();const pcs=Object.entries(SH.chars).filter(([,c])=>charOK(c));
  return`<p class="hint">Plan here before the session. Players cannot see any of this.</p>
  <label class="fl">Campaign name<input data-c="cpField" data-f="name" value="${esc(C.name)}" maxlength="60" placeholder="e.g. The Tide Bell Saga"></label>
  <label class="fl">What it is about<textarea rows="3" data-c="cpField" data-f="pitch" placeholder="The hook, the villain, where it starts…" maxlength="2000">${esc(C.pitch)}</textarea></label>
  <h2>Scenes <small>the plan, in order</small></h2>
  <div class="feats">${C.scenes.map((s,i)=>{const enc=byId(C.encs,s.enc);return`<details data-dk="${s.id}" class="${s.done?'done':''}"><summary>${s.done?'✔ ':''}${i+1}. ${esc(s.title)}</summary>
    <label class="fl">Read aloud <small>players hear this</small><textarea rows="3" data-c="cpScene" data-k="${s.id}" data-f="read" maxlength="1500" placeholder="The fog lifts, and there it is…">${esc(s.read||'')}</textarea></label>
    <label class="fl">DM notes <small>secrets, DCs, what can happen</small><textarea rows="4" data-c="cpScene" data-k="${s.id}" data-f="notes" maxlength="3000">${esc(s.notes||'')}</textarea></label>
    <label class="fl">Encounter in this scene<select data-c="cpScene" data-k="${s.id}" data-f="enc"><option value="">None</option>${C.encs.map(e=>`<option value="${e.id}" ${s.enc===e.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></label>
    <div class="row wrap" style="margin-top:10px">${s.read?`<button type="button" class="btn sm" data-a="cpRead" data-k="${s.id}">📣 Read to the table</button>`:''}${enc?`<button type="button" class="btn sm pri" data-a="cpRun" data-k="${enc.id}">⚔ Run "${esc(enc.name)}"</button>`:''}
      <button type="button" class="btn sm" data-a="cpDone" data-k="${s.id}">${s.done?'Mark as not played':'✔ Mark as played'}</button>${i?`<button type="button" class="btn sm" data-a="cpUp" data-k="${s.id}">↑ Move up</button>`:''}<button type="button" class="btn sm red" data-a="cpDel" data-f="scenes" data-k="${s.id}">Delete</button></div></details>`}).join('')||'<p class="hint">No scenes yet. A scene can be a place, a meeting or a problem.</p>'}</div>
  <div class="form inline2"><input id="cpSN" placeholder="New scene (e.g. The harbor at dawn)" maxlength="60"><button type="button" class="btn pri" data-a="cpAdd" data-f="scenes">Add</button></div>
  <h2>Encounters <small>ready to run with one tap</small></h2>
  <div class="feats">${C.encs.map(e=>{const hp=e.mons.reduce((s,m)=>s+m.hp*m.n,0);const n=e.mons.reduce((s,m)=>s+m.n,0);return`<details data-dk="${e.id}"><summary>${esc(e.name)} <small>${n} enem${n===1?'y':'ies'} · ${hp} HP in all</small></summary>
    <div class="list">${e.mons.map((m,i)=>`<div class="item"><span>${esc(monLine(m))}</span><button type="button" class="btn xs" data-a="cpMonDel" data-k="${e.id}" data-i="${i}" aria-label="Remove ${esc(m.name)}">✕</button></div>`).join('')||'<p class="hint">No enemies yet.</p>'}</div>
    <div class="form mon"><input id="cmN_${e.id}" placeholder="Enemy name" maxlength="30"><input id="cmC_${e.id}" type="number" inputmode="numeric" value="1" min="1" max="12" aria-label="How many"><input id="cmH_${e.id}" type="number" inputmode="numeric" placeholder="HP"><input id="cmA_${e.id}" type="number" inputmode="numeric" placeholder="AC"><input id="cmI_${e.id}" type="number" inputmode="numeric" placeholder="Init +0"><input id="cmT_${e.id}" type="number" inputmode="numeric" placeholder="Attack +4"><input id="cmD_${e.id}" placeholder="Damage 1d8+2" maxlength="20">
      <label class="ck"><input type="checkbox" id="cmX_${e.id}"> Hide the name</label><button type="button" class="btn" data-a="cpMonAdd" data-k="${e.id}">Add enemy</button></div>
    <label class="fl">Notes <small>tactics, terrain, what they want</small><textarea rows="3" data-c="cpEnc" data-k="${e.id}" data-f="notes" maxlength="2000">${esc(e.notes||'')}</textarea></label>
    <div class="row wrap" style="margin-top:10px"><button type="button" class="btn pri" data-a="cpRun" data-k="${e.id}" ${e.mons.length?'':'disabled'}>⚔ Run this encounter</button><button type="button" class="btn sm" data-a="cpDup" data-k="${e.id}">Duplicate</button><button type="button" class="btn sm red" data-a="cpDel" data-f="encs" data-k="${e.id}">Delete</button></div></details>`}).join('')||'<p class="hint">No encounters yet.</p>'}</div>
  <div class="form inline2"><input id="cpEN" placeholder="New encounter (e.g. Marines on the pier)" maxlength="60"><button type="button" class="btn pri" data-a="cpAdd" data-f="encs">Add</button></div>
  <h2>People <small>NPCs to remember</small></h2>
  <div class="feats">${C.npcs.map(n=>`<details data-dk="${n.id}"><summary>${esc(n.name)}${n.role?` <small>${esc(n.role)}</small>`:''}</summary><label class="fl">Who they are<input data-c="cpNpc" data-k="${n.id}" data-f="role" value="${esc(n.role||'')}" maxlength="80" placeholder="e.g. Harbor master, hates pirates"></label>
    <label class="fl">Notes <small>voice, wants, secrets</small><textarea rows="3" data-c="cpNpc" data-k="${n.id}" data-f="notes" maxlength="2000">${esc(n.notes||'')}</textarea></label><button type="button" class="btn sm red" style="margin-top:10px" data-a="cpDel" data-f="npcs" data-k="${n.id}">Delete</button></details>`).join('')||'<p class="hint">Nobody yet.</p>'}</div>
  <div class="form inline2"><input id="cpNN" placeholder="New person (e.g. Old Brina)" maxlength="40"><button type="button" class="btn pri" data-a="cpAdd" data-f="npcs">Add</button></div>
  <h2>Loot <small>parcels to hand out</small></h2>
  <div class="feats">${C.loot.map(l=>`<details data-dk="${l.id}" class="${l.given?'done':''}"><summary>${l.given?'✔ ':''}${esc(l.name)} <small>${l.money?Number(l.money).toLocaleString('en-US')+(RULES()==='5e'?' gp':' Berries'):''}${l.items.length?(l.money?' · ':'')+l.items.length+' item'+(l.items.length>1?'s':''):''}</small></summary>
    <label class="fl">${RULES()==='5e'?'Gold':'Berries'} <small>split evenly when given to everyone</small><input type="number" inputmode="decimal" min="0" data-c="cpLoot" data-k="${l.id}" data-f="money" value="${l.money||''}"></label>
    <div class="list" style="margin-top:8px">${l.items.map((it,i)=>`<div class="item"><span>${esc(it.name)}</span><b>×${it.qty}</b><button type="button" class="btn xs" data-a="cpItemDel" data-k="${l.id}" data-i="${i}" aria-label="Remove ${esc(it.name)}">✕</button></div>`).join('')}</div>
    <div class="form inline"><input id="clN_${l.id}" placeholder="Item" maxlength="50"><input id="clQ_${l.id}" type="number" inputmode="numeric" value="1" min="1" aria-label="Quantity"><button type="button" class="btn" data-a="cpItemAdd" data-k="${l.id}">Add</button></div>
    <div class="row wrap" style="margin-top:10px"><select id="clTo_${l.id}" aria-label="Who gets it" style="flex:1 1 160px"><option value="all">Everyone (money split, items to the first)</option>${pcs.map(([u,c])=>`<option value="${u}">${esc(c.build.name)}</option>`).join('')}</select><button type="button" class="btn pri" data-a="cpGive" data-k="${l.id}" ${pcs.length?'':'disabled'}>🎁 Hand out</button><button type="button" class="btn sm red" data-a="cpDel" data-f="loot" data-k="${l.id}">Delete</button></div></details>`).join('')||'<p class="hint">No loot planned.</p>'}</div>
  <div class="form inline2"><input id="cpLN" placeholder="New parcel (e.g. The captain's chest)" maxlength="60"><button type="button" class="btn pri" data-a="cpAdd" data-f="loot">Add</button></div>
  <h2>Backup</h2><p class="hint">Your plan is saved in this browser. Download a copy now and then, or to move it to another computer.</p>
  <div class="row wrap"><button type="button" class="btn" data-a="cpExport">⬇ Download the campaign</button><label class="btn" style="display:inline-flex;align-items:center;cursor:pointer">⬆ Load from a file<input type="file" accept="application/json,.json" data-c="cpImport" hidden></label></div>`}
// add planned or typed-in enemies to the running fight (starting one if needed)
function addMons(list){if(!initOf().on)ACT.fightStart();const ini=initOf();const order=[...(ini.order||[])];const cur=ini.started&&order[ini.turn]?order[ini.turn].id:null;const mons={...((SH.dm.enc||{}).mons||{})};
  for(const m of list){const name=String(m.name||'Enemy');const n=Math.max(1,Math.min(12,+m.n||1));const have=order.filter(o=>!o.pc&&o.name.replace(/ \d+$/,'')===name).length;
    for(let i=0;i<n;i++){const id='m_'+uidNew()+i;const nm=n>1||have?`${name} ${have+i+1}`:name;mons[id]={name:nm,hp:m.hp,max:m.hp,ac:m.ac||null,...(m.atk!==null&&m.atk!==undefined&&m.atk!==''?{atk:+m.atk,dmg:m.dmg||''}:{})};order.push({id,name:nm,v:d(20)+(+m.init||0),hide:!!m.hide})}}
  order.sort((a,b)=>b.v-a.v);put('dm/enc',{mons});setInit({order,turn:cur?Math.max(0,order.findIndex(o=>o.id===cur)):0})}
Object.assign(ACT,{
  cpAdd(b){const f=b.dataset.f;const inp={scenes:'cpSN',encs:'cpEN',npcs:'cpNN',loot:'cpLN'}[f];const name=val(inp).trim();if(!name){toast('Give it a name first.');return}
    campEdit(c=>{c[f].push(f==='scenes'?{id:uidNew(),title:name,read:'',notes:'',enc:''}:f==='encs'?{id:uidNew(),name,notes:'',mons:[]}:f==='npcs'?{id:uidNew(),name,role:'',notes:''}:{id:uidNew(),name,money:0,items:[]})});const e=document.getElementById(inp);if(e)e.value='';render(true);const all=qa('.feats details[data-dk]');const nid=campOf()[f].slice(-1)[0].id;const nd=all.find(x=>x.dataset.dk===nid);if(nd)nd.open=true},
  cpDel(b){if(!tapTwice(b,'Tap again: delete'))return;campEdit(c=>{c[b.dataset.f]=c[b.dataset.f].filter(x=>x.id!==b.dataset.k)})},
  cpDone(b){campEdit(c=>{const s=byId(c.scenes,b.dataset.k);s.done=!s.done})},
  cpUp(b){campEdit(c=>{const i=c.scenes.findIndex(x=>x.id===b.dataset.k);if(i>0)[c.scenes[i-1],c.scenes[i]]=[c.scenes[i],c.scenes[i-1]]})},
  cpRead(b){const s=byId(campOf().scenes,b.dataset.k);if(s&&s.read)addLog({by:SH.me,who:'DM',kind:'note',read:true,label:'📣 '+s.read,total:''});toast('Sent to everyone\'s log.')},
  cpMonAdd(b){const k=b.dataset.k;const name=val('cmN_'+k).trim();const hp=Math.round(num('cmH_'+k));if(!name||hp<1){toast('An enemy needs a name and HP.');return}const dmg=val('cmD_'+k).trim();if(dmg&&!parseDice(dmg)){toast('Write damage like 1d8+2.');return}const atk=val('cmT_'+k);
    campEdit(c=>{byId(c.encs,k).mons.push({name,n:Math.max(1,Math.min(12,Math.round(num('cmC_'+k))||1)),hp,ac:Math.round(num('cmA_'+k))||null,init:Math.round(num('cmI_'+k))||0,atk:atk===''?null:Math.round(+atk),dmg,hide:!!(q('#cmX_'+k)&&q('#cmX_'+k).checked)})});render(true)},
  cpMonDel(b){campEdit(c=>{byId(c.encs,b.dataset.k).mons.splice(+b.dataset.i,1)})},
  cpDup(b){campEdit(c=>{const e=byId(c.encs,b.dataset.k);c.encs.push({...clone(e),id:uidNew(),name:e.name+' (copy)'})})},
  cpRun(b){const e=byId(campOf().encs,b.dataset.k);if(!e||!e.mons.length){toast('This encounter has no enemies yet.');return}if(initOf().on&&!tapTwice(b,'A fight is running. Tap again: add them to it'))return;addMons(e.mons);SH.dmTab='fight';render(true);window.scrollTo(0,0)},
  cpItemAdd(b){const k=b.dataset.k;const name=val('clN_'+k).trim();if(!name)return;campEdit(c=>{byId(c.loot,k).items.push({name,qty:Math.max(1,Math.round(num('clQ_'+k))||1)})});render(true)},
  cpItemDel(b){campEdit(c=>{byId(c.loot,b.dataset.k).items.splice(+b.dataset.i,1)})},
  cpGive(b){const k=b.dataset.k;const l=byId(campOf().loot,k);if(!l)return;if(l.given&&!tapTwice(b,'Already handed out. Tap again: give it once more'))return;const to=val('clTo_'+k);const pcs=Object.entries(SH.chars).filter(([,c])=>charOK(c));const targets=to==='all'?pcs:pcs.filter(([u])=>u===to);if(!targets.length)return;
    const share=(+l.money||0)/targets.length;targets.forEach(([u,c],i)=>{const patch={};if(share)Object.assign(patch,is5(c)?{gp:Math.round((moneyOf(c)+share)*100)/100}:{berries:Math.round(moneyOf(c)+share)});
      if(i===0&&l.items.length){const inv=(c.inv||[]).map(x=>({...x}));for(const it of l.items){const ex=inv.find(x=>x.name.toLowerCase()===it.name.toLowerCase());if(ex)ex.qty+=it.qty;else inv.push({name:it.name,qty:it.qty})}patch.inv=inv}saveChar(u,patch)});
    const bits=[];if(l.money)bits.push(`${Number(l.money).toLocaleString('en-US')} ${RULES()==='5e'?'gp':'Berries'}${targets.length>1?' (split)':''}`);for(const it of l.items)bits.push(`${it.qty>1?it.qty+' × ':''}${it.name}`);
    addLog({by:SH.me,who:'DM',kind:'note',label:`🎁 ${l.name}: ${targets.length>1?'the party':targets[0][1].build.name} gets ${bits.join(', ')||'nothing'}.${l.items.length&&targets.length>1?' Items go to '+targets[0][1].build.name+'.':''}`,total:''});campEdit(c=>{byId(c.loot,k).given=true})},
  cpExport(){const C=campOf();const blob=new Blob([JSON.stringify({sheetTableCampaign:1,...C},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(C.name||'campaign').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000)},
  mAtk(b){const m=((SH.dm.enc||{}).mons||{})[b.dataset.k];const o=(initOf().order||[]).find(x=>x.id===b.dataset.k);if(!m||!o)return;const nm=o.hide?'Enemy':m.name;rollD20(nm+' attacks',m.atk,fmt(m.atk),{name:nm,follow:m.dmg?[{t:'Damage '+m.dmg,run:crit=>rollDmg(nm+' damage',m.dmg,{name:nm,crit})}]:null})},
  themeOpen(){SH.pick=true;render(true);window.scrollTo(0,0)},themeClose(){SH.pick=false;render(true)},
  themeSet(b){try{localStorage.setItem('sht-theme',b.dataset.k)}catch(e){}SH.myTheme=b.dataset.k;render(true)},
  themeTable(b){setState({theme:curTheme()});toast('Players who have not picked a look now get this one.')}
});
Object.assign(CHG,{
  cpField(e){campEdit(c=>{c[e.dataset.f]=e.value})},
  cpScene(e){campEdit(c=>{byId(c.scenes,e.dataset.k)[e.dataset.f]=e.value})},
  cpEnc(e){campEdit(c=>{byId(c.encs,e.dataset.k)[e.dataset.f]=e.value})},
  cpNpc(e){campEdit(c=>{byId(c.npcs,e.dataset.k)[e.dataset.f]=e.value})},
  cpLoot(e){campEdit(c=>{byId(c.loot,e.dataset.k)[e.dataset.f]=Math.max(0,+e.value||0)})},
  cpImport(e){const f=e.files&&e.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||!o.sheetTableCampaign||!Array.isArray(o.scenes))throw 0;const C={name:String(o.name||''),pitch:String(o.pitch||''),scenes:o.scenes||[],encs:o.encs||[],npcs:o.npcs||[],loot:o.loot||[]};saveCamp(C);toast('Campaign loaded.');render(true)}catch(x){toast('That file is not a Sheet Table campaign.')}};r.readAsText(f)}
});
// ================= looks: seven skins, picked per device (the DM can set the table's default) =================
const THEMES=[['plain','Plain','Clean and quiet. Follows your phone\'s light or dark mode.'],['chart','Sea Chart','Old parchment, ink and red wax.'],['grandline','Grand Line','Deep navy and pirate gold.'],['wanted','Wanted Poster','Sun-bleached paper, heavy black type.'],
  ['tavern','Tavern','Dark wood and lantern light.'],['arcane','Arcane','Midnight purple with glowing runes.'],['manga','Manga','Black ink, white paper, loud yellow.']];
function curTheme(){if(SH.myTheme===undefined){try{SH.myTheme=localStorage.getItem('sht-theme')||''}catch(e){SH.myTheme=''}}const t=SH.myTheme||SH.state.theme||'plain';return THEMES.some(x=>x[0]===t)?t:'plain'}
function applyTheme(){const t=curTheme();if(document.documentElement.dataset.theme!==t)document.documentElement.dataset.theme=t}
function themePickHTML(){const cur=curTheme();return`<div class="builder"><div class="hero"><div class="hn"><h1>Pick a look</h1><div class="sub">Only changes this device${SH.owner?'. You can also make it the table\'s default.':'.'}</div></div><button type="button" class="btn sm" data-a="themeClose">Done</button></div>
  <div class="thgrid">${THEMES.map(([k,n,dsc])=>`<button type="button" class="thprev ${cur===k?'sel':''}" data-theme="${k}" data-a="themeSet" data-k="${k}"><span class="th-h">${esc(n)}</span><span class="th-hp"><b>27</b> / 34 HP</span><span class="th-bar"><i></i></span><span class="th-row"><span class="th-btn">Attack +5</span><span class="th-chip">Stealth +7</span></span><span class="th-d">${esc(dsc)}</span></button>`).join('')}</div>
  ${SH.owner&&!SH.solo?`<button type="button" class="btn big" data-a="themeTable">Use "${esc(THEMES.find(t=>t[0]===cur)[1])}" as the table's default</button>`:''}</div>`}
