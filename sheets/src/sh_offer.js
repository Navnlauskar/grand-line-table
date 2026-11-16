// ================= gifts from the DM (the player accepts), Devil Fruit pictures, the log dock =================
// ---------------- fruit pictures ----------------
function fruitImgSrc(f){if(!f)return'';const stem=f.jp.split(' ')[0].toLowerCase();const k=f.k==='hito_nika'?'gomu':FRUIT_IMG.includes(f.k)?f.k:FRUIT_IMG.includes(stem)?stem:'';return k?`${ART}fruit_${k}.webp`:''}
function fruitSVG(f,sz){const look=((f&&f.look)||'').toLowerCase();const C={crimson:'#b1123a',red:'#d33b3b',orange:'#f08a24',gold:'#d9a520',yellow:'#f2c230',lime:'#8bc34a',green:'#3fa34d',teal:'#1aa39a',cyan:'#29b6d6',blue:'#2f6fd6',violet:'#8e44ad',purple:'#7b3fb8',magenta:'#c2185b',pink:'#e86fa6',brown:'#8d5a3b',black:'#3a3a44',silver:'#b8c0c8',grey:'#8a8f98',gray:'#8a8f98',white:'#e9e6df'};
  const ck=Object.keys(C).find(k=>look.includes(k));const col=ck?C[ck]:`hsl(${hue((f&&f.k)||'x')},60%,48%)`;const long=/long|banana|pear|oval|cucumber|eggplant|elongated/.test(look);const rx=long?28:36,ry=long?42:34;const id='fg'+Math.random().toString(36).slice(2,7);
  const sw=[0,1,2,3,4].map(i=>{const cx=50+(i%2?-1:1)*(8+i*3),cy=58-ry/2+i*(ry/3.2);return`<path d="M${cx-9} ${cy} q4 -9 9 -2 q4 6 -3 7 q-5 0 -3 -4" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2.4" stroke-linecap="round"/>`}).join('');
  return`<svg class="fsvg" viewBox="0 0 100 110" width="${sz}" height="${sz}" aria-hidden="true"><defs><radialGradient id="${id}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity=".75"/></radialGradient><clipPath id="${id}c"><ellipse cx="50" cy="62" rx="${rx}" ry="${ry}"/></clipPath></defs>
    <ellipse cx="50" cy="62" rx="${rx}" ry="${ry}" fill="url(#${id})" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/><g clip-path="url(#${id}c)">${sw}</g>
    <path d="M50 ${62-ry} q2 -12 9 -16" stroke="#5b3a1e" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M53 ${58-ry} q14 -12 22 -2 q-12 8 -22 2z" fill="#3c8d3f" stroke="rgba(0,0,0,.3)"/></svg>`}
function fruitPic(f,sz){const src=fruitImgSrc(f);return src?`<img class="fpic" src="${src}" alt="" width="${sz}" height="${sz}" onerror="this.outerHTML=fruitSVG(dfeFind('${esc(f.k)}')||{},${sz})">`:fruitSVG(f,sz)}

// ---------------- offers: the DM gives, the player accepts ----------------
function offer(uid,o){const c=SH.chars[uid];if(!c)return;const id=uidNew();saveChar(uid,{offers:[...(c.offers||[]),{id,t:Date.now(),...o}]});
  addLog({by:SH.me,who:'DM',kind:'note',label:`🎁 The DM offers ${who(uid)} ${offerTxt(c,o)}.`,total:'',quiet:true});toast(`Sent to ${who(uid)}. They choose to accept it.`)}
function offerTxt(c,o){return o.k==='money'?(is5(c)?(+o.amt).toLocaleString('en-US')+' gp':'฿'+(+o.amt).toLocaleString('en-US')):o.k==='fruit'?'a Devil Fruit ('+(dfeFind(o.fruit)?dfeName(dfeFind(o.fruit)):o.fruit)+')':o.k==='haki'?'the awakening of '+((hakiOpt(o.haki)||{}).name||'Haki'):`${o.qty>1?o.qty+' × ':''}${o.name}`}
function invAdd(inv,it){inv=(inv||[]).map(x=>({...x}));const ex=!it.fruit&&inv.find(x=>!x.fruit&&x.name.toLowerCase()===it.name.toLowerCase());if(ex)ex.qty+=it.qty||1;else inv.push({name:it.name,qty:it.qty||1,...(it.note?{note:it.note}:{}),...(it.fruit?{fruit:it.fruit}:{})});return inv}
function offerModalHTML(){const c=myChar();if(!c||isDM())return'';const o=(c.offers||[])[0];if(!o)return'';const more=(c.offers||[]).length-1;
  if(o.k==='fruit'){const f=dfeFind(o.fruit);const has=!!c.fruit;
    return`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mdT"><div class="mbox fruitoffer"><div class="mpic">${f?fruitPic(f,150):fruitSVG({},150)}</div>
      <h2 id="mdT">The DM gives you a Devil Fruit!</h2><p class="mname"><b>${esc(f?f.jp:o.fruit)}</b>${f&&f.model?' · Model: '+esc(f.model):''}${f?` <small>${f.en?esc(f.en)+' · ':''}${esc(f.type)} · ${esc(f.rar)}</small>`:''}</p>
      ${f&&f.look?`<p><i>${esc(f.look)}</i></p>`:''}${f?`<p>${esc(f.desc)}</p>`:''}
      <p class="hint">${has?'You already ate a Devil Fruit. Eating a second one would kill you.':'Eat it, and you gain its power, but you can never swim again. Or keep it in your bag for later, or to sell.'}</p>
      <div class="row mbtn"><button type="button" class="btn pri big" data-a="ofEat" ${has?'disabled':''}>🍇 Eat it</button><button type="button" class="btn big" data-a="ofKeep">🎒 Keep it in my bag</button></div>
      <button type="button" class="btn sm" data-a="ofNo">No thanks</button>${more?`<p class="hint">${more} more gift${more>1?'s':''} waiting.</p>`:''}</div></div>`}
  const icon=o.k==='money'?(is5(c)?'🪙':'฿'):o.k==='haki'?'⚡':'🎁';
  return`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mdT"><div class="mbox"><div class="mico">${icon}</div><h2 id="mdT">${o.k==='haki'?'Your Haki awakens!':'The DM gives you something'}</h2>
    <p class="mname"><b>${esc(offerTxt(c,o))}</b></p>${o.note?`<p>${esc(o.note)}</p>`:''}${o.k==='haki'&&hakiOpt(o.haki)?`<p>${esc(hakiOpt(o.haki).desc)}</p>`:''}
    <div class="row mbtn"><button type="button" class="btn pri big" data-a="ofYes">${o.k==='haki'?'Awaken it':'Accept'}</button><button type="button" class="btn big" data-a="ofNo">Decline</button></div>${more?`<p class="hint">${more} more gift${more>1?'s':''} waiting.</p>`:''}</div></div>`}
function ofTake(fn){const c=myChar();const o=(c.offers||[])[0];if(!o)return;const patch={offers:(c.offers||[]).slice(1)};const msg=fn(c,o,patch);saveChar(SH.me,patch);if(msg)addLog({by:SH.me,who:c.build.name,kind:'note',label:msg,total:''})}
Object.assign(ACT,{
  ofYes(){ofTake((c,o,p)=>{if(o.k==='money'){Object.assign(p,is5(c)?{gp:Math.round((moneyOf(c)+(+o.amt))*100)/100}:{berries:Math.round(moneyOf(c)+(+o.amt))})}
    else if(o.k==='haki'){if(!(c.haki||[]).includes(o.haki))p.haki=[...(c.haki||[]),o.haki];return`⚡ ${c.build.name} awakens ${(hakiOpt(o.haki)||{}).name||'Haki'}!`}
    else p.inv=invAdd(c.inv,{name:o.name,qty:o.qty,note:o.note});return`✔ ${c.build.name} accepts ${offerTxt(c,o)}.`})},
  ofNo(){ofTake((c,o)=>`✖ ${c.build.name} declines ${offerTxt(c,o)}.`)},
  ofEat(){ofTake((c,o,p)=>{const f=dfeFind(o.fruit);p.fruit=f?dfeName(f):o.fruit;p.build={...c.build,fruitAte:true};p.res={...(c.res||{}),fruit:0};return`🍇 ${c.build.name} eats the ${f?f.jp:o.fruit}! It tastes awful.`})},
  ofKeep(){ofTake((c,o,p)=>{const f=dfeFind(o.fruit);p.inv=invAdd(c.inv,{name:'Devil Fruit: '+(f?dfeName(f):o.fruit),qty:1,fruit:f?f.k:o.fruit});return`🎒 ${c.build.name} keeps a Devil Fruit in the bag.`})},
  itEat(b){const u=b.dataset.u;const c=SH.chars[u];const i=+b.dataset.i;const it=(c.inv||[])[i];if(!it||!it.fruit)return;if(c.fruit){toast('You already ate a Devil Fruit. A second one would kill you.');return}
    if(!tapTwice(b,'Tap again: eat it'))return;const f=dfeFind(it.fruit);const inv=(c.inv||[]).filter((_,j)=>j!==i);saveChar(u,{inv,fruit:f?dfeName(f):it.name.replace(/^Devil Fruit: /,''),build:{...c.build,fruitAte:true},res:{...(c.res||{}),fruit:0}});
    addLog({by:SH.me,who:c.build.name,kind:'note',label:`🍇 ${c.build.name} eats the ${f?f.jp:it.name}!`,total:''})},
  offerFruit(b){const u=b.dataset.u;const f=dfeFind(val('gf_'+u));if(!f){toast('Pick a fruit from the list.');return}offer(u,{k:'fruit',fruit:f.k});const e=document.getElementById('gf_'+u);if(e)e.value=''},
  fruitRemove(b){const u=b.dataset.u;if(!tapTwice(b,'Tap again: take the fruit power away'))return;saveChar(u,{fruit:'',fruitAwk:false});addLog({by:SH.me,who:'DM',kind:'note',label:`${who(u)} no longer has a Devil Fruit power.`,total:''})},
  ofCancel(b){const u=b.dataset.u;const c=SH.chars[u];saveChar(u,{offers:(c.offers||[]).filter(o=>o.id!==b.dataset.k)})}});
Object.assign(CHG,{offerHaki(e){const u=e.dataset.u;if(!e.value)return;offer(u,{k:'haki',haki:e.value});e.value=''}});
// DM gifts become offers (taking money away stays direct)
{const g=ACT.give;ACT.give=function(b){const u=b.dataset.u;if(!SH.owner||u===SH.me)return g(b);const name=val('giN_'+u).trim();if(!name){toast('Type an item first.');return}
  const f=dfeFind(name.replace(/^devil fruit:?\s*/i,''));const qty=Math.max(1,Math.round(num('giQ_'+u))||1);if(f&&/no mi|devil fruit/i.test(name))offer(u,{k:'fruit',fruit:f.k});else offer(u,{k:'item',name,qty});const e=document.getElementById('giN_'+u);if(e)e.value=''}}
{const m=ACT.money;ACT.money=function(b){const u=b.dataset.u;if(!SH.owner||u===SH.me||+b.dataset.s<0)return m(b);const n=Math.abs(num('moN_'+u));if(!n){toast('Type an amount first.');return}offer(u,{k:'money',amt:n});const e=document.getElementById('moN_'+u);if(e)e.value=''}}
ACT.cpGive=function(b){const k=b.dataset.k;const l=byId(campOf().loot,k);if(!l)return;if(l.given&&!tapTwice(b,'Already handed out. Tap again: give it once more'))return;const to=val('clTo_'+k);const pcs=Object.entries(SH.chars).filter(([,c])=>charOK(c));const T=to==='all'?pcs:pcs.filter(([u])=>u===to);if(!T.length)return;
  const share=Math.floor(((+l.money||0)/T.length)*100)/100;
  T.forEach(([u,c],i)=>{const offs=[...(c.offers||[])];const add=o=>offs.push({id:uidNew(),t:Date.now(),...o});if(share)add({k:'money',amt:share,note:l.name});
    if(i===0)for(const it of l.items){const f=dfeFind(it.name.replace(/^devil fruit:?\s*/i,''));if(f&&/no mi|devil fruit/i.test(it.name))add({k:'fruit',fruit:f.k});else add({k:'item',name:it.name,qty:it.qty,note:l.name})}
    saveChar(u,{offers:offs})});
  addLog({by:SH.me,who:'DM',kind:'note',label:`🎁 ${l.name} is handed out to ${T.length>1?'the party':T[0][1].build.name}.`,total:''});campEdit(c=>{byId(c.loot,k).given=true})};

// ---------------- Devil Fruit and Haki only appear once you have them ----------------
opPowersHTML=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const dm=SH.owner;
  h=h.replace(/<div class="row"><input id="fruit_[^"]*"[\s\S]*?<\/datalist><\/div>/,'').replace(/<select data-c="hakiAdd"[\s\S]*?<\/select>/,'');
  const i=h.indexOf('<h2>Haki</h2>');let fp=i<0?h:h.slice(0,i),hp=i<0?'':h.slice(i);
  const gf=`<div class="form inline"><input id="gf_${uid}" list="fruitList2" placeholder="DM: give a Devil Fruit (type a name)" aria-label="Devil Fruit to give"><button type="button" class="btn" data-a="offerFruit" data-u="${uid}">Give</button></div><datalist id="fruitList2">${DFE.map(f=>`<option value="${esc(dfeName(f))}">${esc(f.rar)}</option>`).join('')}</datalist>`;
  const all=Object.entries(HAKI).flatMap(([col,hk])=>Object.entries(hk.opts).map(([k,o])=>({k,name:o.name,col:hk.name}))).filter(o=>!(c.haki||[]).includes(o.k));
  const gh=all.length?`<select data-c="offerHaki" data-u="${uid}" aria-label="Awaken Haki"><option value="">DM: awaken a Haki power…</option>${all.map(o=>`<option value="${o.k}">${esc(o.col)}: ${esc(o.name)}</option>`).join('')}</select>`:'';
  const pend=(c.offers||[]).filter(o=>o.k==='fruit'||o.k==='haki');
  if(!c.fruit)fp=dm?`<h2>Devil Fruit</h2><p class="hint">${esc(c.build.name)} has not eaten a Devil Fruit.</p>${gf}`:'';
  else{const f=dfeFind(c.fruit);if(f)fp=fp.replace('<div class="fhead">',`<div class="fhead">${fruitPic(f,56)}`);if(dm)fp+=`<button type="button" class="btn sm red" data-a="fruitRemove" data-u="${uid}">DM: take the fruit away</button>`}
  if(!(c.haki||[]).length)hp=dm?`<h2>Haki</h2><p class="hint">No Haki awakened yet.</p>${gh}`:'';else if(dm)hp+=gh;
  const pp=dm&&pend.length?`<p class="hint">Waiting for ${esc(c.build.name)} to accept: ${pend.map(o=>`${esc(offerTxt(c,o))} <button type="button" class="btn xs" data-a="ofCancel" data-u="${uid}" data-k="${o.id}">withdraw</button>`).join(', ')}</p>`:'';
  return fp+hp+pp}})(opPowersHTML);
pgBag=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const ed=canEdit(uid);
  (c.inv||[]).forEach((it,i)=>{if(!it.fruit)return;const f=dfeFind(it.fruit);
    h=h.replace(`<div class="item"><span>${esc(it.name)}`,`<div class="item fitem">${f?fruitPic(f,40):''}<span>${esc(it.name)}`).replace(`data-a="itQ" data-u="${uid}" data-i="${i}" data-d="-1"`,`data-a="itEat" data-u="${uid}" data-i="${i}" data-x="-1"`)});
  h=h.replace(/(<button type="button" class="btn xs" data-a="itEat"[^>]*>)−<\/button>/g,'$1🍇 Eat</button>');
  const off=(c.offers||[]);if(off.length&&uid!==SH.me)h=`<p class="hint">Waiting to be accepted: ${off.map(o=>esc(offerTxt(c,o))).join(', ')}</p>`+h;return h}})(pgBag);
// the DM party card: Devil Fruit and Haki gifts
dmParty=(function(prev){return function(){let h=prev();for(const [u,c] of Object.entries(SH.chars)){if(!charOK(c)||is5(c))continue;
  const extra=`<div class="form inline"><input id="gf_${u}" list="fruitList2" placeholder="Give a Devil Fruit" aria-label="Devil Fruit for ${esc(c.build.name)}"><button type="button" class="btn" data-a="offerFruit" data-u="${u}">Give</button></div>`;
  h=h.replace(`<button type="button" class="btn sm red" data-a="kick" data-u="${u}">`,extra+`<button type="button" class="btn sm red" data-a="kick" data-u="${u}">`);
  const n=(c.offers||[]).length;if(n)h=h.replace(`data-a="openSheet" data-u="${u}">Sheet</button>`,`data-a="openSheet" data-u="${u}">Sheet</button><span class="chip" title="Gifts waiting">🎁 ${n}</span>`)}
  return h+`<datalist id="fruitList2">${DFE.map(f=>`<option value="${esc(dfeName(f))}">${esc(f.rar)}</option>`).join('')}</datalist>`}})(dmParty);

// ---------------- the log dock (right side, always open on wide screens; a drawer on phones) ----------------
const wideDock=()=>window.innerWidth>=1100;
const dockKey=()=>wideDock()?'w':'n';SH.docks={};
function dockOpen(){const k=dockKey();if(SH.docks[k]===undefined){let v=null;try{v=localStorage.getItem('sht-dock-'+k)}catch(e){}SH.docks[k]=v===null?k==='w':v==='1'}return SH.docks[k]}
function contentW(){return window.innerWidth-(dockOpen()&&wideDock()?340:0)}
function dockHTML(){if(!SH.ready||!SH.state.rules||SH.pick||SH.edit||SH.lu)return'';if(!dockOpen())return'';
  return`${wideDock()?'':'<div class="dockbg" data-a="dockTog" aria-hidden="true"></div>'}<aside class="dock ${wideDock()?'side':'drawer'}" aria-label="Table log"><div class="dockh"><b>Table log</b><span class="mini">${SH.log.length?'newest first':''}</span><button type="button" class="btn xs" data-a="dockTog" aria-label="Close the log">✕</button></div>
    <div class="dockdice">${[4,6,8,10,12,20].map(n=>`<button type="button" class="btn xs" data-a="die" data-k="${n}">d${n}</button>`).join('')}</div>
    <div class="log">${logHTML(80)}</div></aside>`}
const unread=()=>SH.log.filter(e=>(e.t||0)>(SH.dockSeen||0)&&e.by!==SH.me).length;
topHTML=(function(prev){return function(){const h=prev();const n=dockOpen()?0:unread();return h.replace('<button type="button" class="btn xs" data-a="themeOpen"',`<button type="button" class="btn xs ${dockOpen()?'on':''}" data-a="dockTog" aria-label="${dockOpen()?'Hide':'Show'} the table log">📜${n?`<i class="badge">${n>9?'9+':n}</i>`:''}</button><button type="button" class="btn xs" data-a="themeOpen"`)}})(topHTML);
logHTML=(function(prev){return function(n){let h=prev(n);for(const e of SH.log.slice(0,n||60))if(e.npcImg&&npcImg(e.npcImg))h=h.replace(`<div class="lg note read">${esc(e.label)}</div>`,`<div class="lg note read npcnote"><img src="${npcImg(e.npcImg)}" alt="" onerror="this.remove()">${esc(e.label)}</div>`);return h}})(logHTML);
pgTable=(function(prev){return function(uid){const h=prev(uid);return dockOpen()&&wideDock()?h.replace(/<h2>Table log[\s\S]*$/,'<p class="hint">The table log is open on the right.</p>'):h}})(pgTable);
ACT.dockTog=function(){const k=dockKey();SH.docks[k]=!dockOpen();try{localStorage.setItem('sht-dock-'+k,SH.docks[k]?'1':'0')}catch(e){}SH.dockSeen=Date.now();render(true)};
// on wide screens Main already sits on the left, so the tab bar starts at Skills
navHTML=(function(prev){return function(tabs,cur,act){if(act==='tab'&&contentW()>=1000&&!SH.printAll){tabs=tabs.filter(t=>t[0]!=='main');if(cur==='main')cur='skills'}return prev(tabs,cur,act)}})(navHTML);
screenHTML=(function(prev){return function(){return prev()+dockHTML()+offerModalHTML()}})(screenHTML);
render=(function(prev){return function(force){prev(force);try{if(SH.forceOpen||SH.forceClose){for(const d of qa('details[data-dk]')){if(d.dataset.dk===SH.forceOpen)d.open=true;if(d.dataset.dk===SH.forceClose)d.open=false}if(q('#app details'))SH.forceOpen=SH.forceClose=null}document.body.classList.toggle('docked',!!(dockOpen()&&wideDock()&&q('.dock.side')));document.body.classList.toggle('modal-open',!!q('.modal'));if(dockOpen())SH.dockSeen=Date.now();
  // never more hit points than the maximum (after a level-up, an edit or an override)
  for(const [u,c] of Object.entries(SH.chars)){if(!charOK(c)||!canEdit(u)||(u!==SH.me&&!SH.owner))continue;const mx=DV(c).maxhp;if(c.hp>mx&&!render._fix){render._fix=1;saveChar(u,{hp:mx});setTimeout(()=>render._fix=0,500)}}}catch(e){console.warn(e)}}})(render);
dmTable=(function(prev){return function(){return prev()+`<p class="hint" style="margin-top:24px">Credits: One Piece Dungeons & Devil Fruits (Player's Handbook, DM's Guide and Devil Fruit Encyclopedia) by OneWorldHD, a fan homebrew. Plain 5e rules and monsters from the D&D System Reference Document 5.1 by Wizards of the Coast, CC-BY-4.0. One Piece belongs to Eiichiro Oda / Shueisha.</p>`}})(dmTable);
