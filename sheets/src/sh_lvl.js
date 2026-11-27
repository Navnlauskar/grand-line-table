// ================= level-up screen: show everything the new level brings, including subclass features the sheet runs =================
function luPreview(){const U=SH.lu;const c=SH.chars[U.uid];const I=luInfo(c);const nb=clone(c.build);nb.level=I.L;nb.hpRolls={...(nb.hpRolls||{}),[I.L]:I.hd/2+1};if(I.needSub&&U.sub)nb.subclass=String(U.sub).trim();
  const D0=DV(c);let D1;try{D1=DV({...c,build:nb})}catch(e){return null}const old=new Set(D0.feats.map(f=>f[0]));
  const feats=D1.feats.filter(f=>!old.has(f[0])&&!/^Ability Score Improvement/.test(f[0]));const better=[];
  for(const [k,r] of Object.entries(D1.res||{})){const o=(D0.res||{})[k];if(!o)continue;if(r.max>o.max)better.push(`${r.name}: ${o.max} → ${r.max}`)}
  if((D1.nAtk||1)>(D0.nAtk||1))better.push(`Attacks per Attack action: ${D0.nAtk||1} → ${D1.nAtk}`);
  if(D1.sneak&&D1.sneak>(D0.sneak||0))better.push(`Sneak Attack: ${D0.sneak}d6 → ${D1.sneak}d6`);
  if(D1.prof>D0.prof)better.push(`Proficiency bonus: +${D0.prof} → +${D1.prof} (attacks, proficient skills and saves)`);
  const a0=(D0.attacks||[])[0],a1=(D1.attacks||[]).find(a=>a0&&a.name===a0.name);if(a0&&a1&&a1.dmg!==a0.dmg)better.push(`${a1.name} damage: ${a0.dmg} → ${a1.dmg}`);
  return{feats,better,I,needSubPick:I.needSub&&!U.sub}}
luHTML=(function(prev){return function(){let h=prev();const P=luPreview();if(!P)return h;const U=SH.lu;const c=SH.chars[U.uid];
  const list=P.feats.map(f=>`<details open><summary>${esc(f[0])}${typeof BTN_FEATS!=='undefined'&&BTN_FEATS.test(f[0])?' <small class="tagbtn">button on your sheet</small>':''}</summary><p>${esc(f[1])}</p></details>`).join('');
  const sub=P.needSubPick?`<p class="hint">Pick your ${esc(P.I.subName.toLowerCase())} below to see its features here.</p>`:'';
  const bet=P.better.length?`<p class="hint"><b>Also better:</b></p><ul class="lubetter">${P.better.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  const asi=P.I.asi?'<p class="hint">Plus an Ability Score Improvement (choose below).</p>':'';
  h=h.replace(/<h2>What you get<\/h2><div class="feats">[\s\S]*?<\/div>\s*<h2>Hit points<\/h2>/,`<h2>What you get</h2><div class="feats">${list||(sub||asi?'':'<p class="hint">More hit points.</p>')}${sub}${asi}${bet}</div>\n  <h2>Hit points</h2>`);
  // 5e subclass names the sheet knows
  if(c.build.rules==='5e'&&typeof SUB_SUGGEST!=='undefined'&&SUB_SUGGEST[c.build.cls])h=h.replace(/(<input data-c="luText" data-f="sub"[^>]*?)>/,`$1 list="lusubs"><datalist id="lusubs">${SUB_SUGGEST[c.build.cls].map(x=>`<option value="${esc(x)}">`).join('')}</datalist><small class="hint">The sheet runs ${esc(SUB_SUGGEST[c.build.cls].join(', '))} for you.</small>`);
  if(U.hp){try{const nb=clone(c.build);nb.level=P.I.L;nb.hpRolls={...(nb.hpRolls||{}),[P.I.L]:U.hp};if(P.I.needSub&&U.sub)nb.subclass=String(U.sub).trim();const D0=DV(c);const gain=DV({...c,build:nb}).maxhp-D0.maxhp;const con=mod(D0.ab.CON);const other=gain-U.hp-con;
    h=h.replace(/<b>\+\d+ HP<\/b> \(([^)]*)\)/,`<b>+${gain} HP</b> ($1${other?`, ${fmt(other)} from ${esc(D0.feats.some(f=>/^Tough/.test(f[0]))?'Tough':'features')}`:''})`)}catch(e){}}
  return h}})(luHTML);
// ================= rests: the dead do not get up; a character at 0 HP only wakes with 1 HP; any rest ends rage and frenzy =================
restFor=(function(prev){return function(uid,kind){const c=SH.chars[uid];if(!c)return;
  if(c.dead){toast(`${c.build.name} is dead: a rest does not bring them back (the DM can revive them).`);return}
  const end={};if(c.raging)end.raging=false;if(c.frenzy)end.frenzy=false;if(c.frenzied){end.frenzied=false}if(c.dodge)end.dodge=null;if(kind==='long'&&c.conc)end.conc=null;
  if(kind==='long'&&c.hp<=0){prev(uid,kind);saveChar(uid,{...end,hp:1,stable:false,death:{s:0,f:0}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} was at 0 HP, so the long rest only brings them back to 1 HP (hit points need a rest started with at least 1 HP).`,total:''});return}
  prev(uid,kind);if(Object.keys(end).length)saveChar(uid,end)}})(restFor);
// ================= turn state survives a reload (attacks used, bonus action, hits waiting for damage; enemies' attacks on the DM's device) =================
try{const t=JSON.parse(localStorage.getItem('sht-ta')||'null');if(t&&typeof t==='object')SH.ta=t;const m=JSON.parse(localStorage.getItem('sht-mta')||'null');if(m&&typeof m==='object')SH.mta=m}catch(e){}
render=(function(prev){return function(f){prev(f);try{const a=JSON.stringify(SH.ta||{}),b=JSON.stringify(SH.mta||{});if(a!==SH._taS){localStorage.setItem('sht-ta',a);SH._taS=a}if(b!==SH._mtaS){localStorage.setItem('sht-mta',b);SH._mtaS=b}}catch(e){}}})(render);
// a "tap again" button stays armed when the screen re-renders (other players' updates arrive all the time)
render=(function(prev){return function(f){prev(f);const A=SH._armed;if(!A||Date.now()-A.t>=4000)return;try{for(const b of document.querySelectorAll('[data-a],[data-c]')){if(tapKey(b)!==A.k)continue;if(!b.dataset.orig)b.dataset.orig=b.innerHTML;b.dataset.armed=String(A.t);b.innerHTML=A.ask;b.classList.add('armed');const el=b;setTimeout(()=>{if(el.dataset.armed){delete el.dataset.armed;el.classList.remove('armed');el.innerHTML=el.dataset.orig}},Math.max(0,4000-(Date.now()-A.t)));break}}catch(e){}}})(render);
