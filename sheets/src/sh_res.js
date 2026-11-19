// ================= damage resistances, rage, and saves players roll on their own phones =================
const DTYPES=['acid','bludgeoning','cold','fire','force','lightning','necrotic','piercing','poison','psychic','radiant','slashing','thunder'];
const SPECIES_RES={dwarf:{resist:['poison']},tiefling:{resist:['fire']}};
function resistOf(c){const b=c.build||{};const out={resist:new Set(),immune:new Set(),vuln:new Set(),why:{}};const add=(k,t,w)=>{out[k].add(t);out.why[t]=w};
  if(b.rules==='5e'){const s=SPECIES_RES[b.species];if(s)for(const t of s.resist)add('resist',t,(R5.species[b.species]||{}).name||b.species)}
  for(const [t,v] of Object.entries(c.dres||{}))if(v)add(v,t,'sheet');
  if(c.raging)for(const t of ['bludgeoning','piercing','slashing'])add('resist',t,'rage');
  return out}
function resistMult(c,dtype){if(!dtype)return[1,''];const R=resistOf(c);const ts=String(dtype).toLowerCase().split(/\s*\+\s*|\s*,\s*|\s+or\s+/).map(t=>t.trim()).filter(t=>DTYPES.includes(t));if(!ts.length)return[1,''];
  if(ts.every(t=>R.immune.has(t)))return[0,`immune to ${ts.join(' and ')}`];if(ts.every(t=>R.resist.has(t)||R.immune.has(t)))return[.5,`resists ${ts.join(' and ')}${ts.some(t=>R.why[t]==='rage')?' (rage)':''}`];
  if(ts.some(t=>R.vuln.has(t)))return[2,`vulnerable to ${ts.find(t=>R.vuln.has(t))}`];return[1,'']}
hpChange=(function(prev){return function(u,delta,note,crit,dtype){const c=SH.chars[u];if(c&&delta<0&&dtype){const [m,why]=resistMult(c,dtype);if(m!==1){delta=-Math.floor(-delta*m);note=(note||'')+` · ${why}: ${m===0?'no':m===.5?'half':'double'} damage`;if(delta===0){addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} takes no damage (${note}).`,total:''});return}}}
  return prev(u,delta,note,crit)}})(hpChange);
// --- the sheet: resistances editor (Features page) and a summary line (Main page) ---
function resLine(c){const R=resistOf(c);const parts=[];if(R.resist.size)parts.push('Resists '+[...R.resist].join(', '));if(R.immune.size)parts.push('Immune to '+[...R.immune].join(', '));if(R.vuln.size)parts.push('Vulnerable to '+[...R.vuln].join(', '));return parts.join(' · ')}
pgMain=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const l=resLine(c);const rage=c.raging?`<p class="conc rageon">😤 Raging: advantage on STR checks and saves, +${rageBonus(c)} melee damage, resistance to bludgeoning, piercing and slashing. <button type="button" class="btn xs" data-a="rageEnd" data-u="${uid}">End rage</button></p>`:'';
  if(l||rage)h=h.replace('<h2>Abilities',`${rage}${l?`<p class="resline">🛡 ${esc(l)}</p>`:''}<h2>Abilities`);return h}})(pgMain);
pgFeats=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);if(!canEdit(uid))return h;const R=resistOf(c);const cur=c.dres||{};
  const sec=`<details class="add" data-dk="dres_${uid}"><summary>🛡 Damage resistances ${resLine(c)?'<small>'+esc(resLine(c))+'</small>':''}</summary><p class="hint">Tap a damage type to cycle: resist (half) → immune → vulnerable (double) → normal. Species and rage are added on their own. Damage from enemies is adjusted automatically.</p>
    <div class="chipset">${DTYPES.map(t=>{const v=cur[t]||'';const auto=!v&&(R.resist.has(t)||R.immune.has(t));return`<button type="button" class="chip tog ${v||auto?'on':''} dr-${v||(auto?'resist':'')}" data-a="dresTog" data-u="${uid}" data-k="${t}">${t}${v?` <small>${v==='resist'?'half':v==='immune'?'immune':'double'}</small>`:auto?` <small>${esc(R.why[t])}</small>`:''}</button>`}).join('')}</div></details>`;
  return sec+h}})(pgFeats);
ACT.dresTog=function(b){const u=b.dataset.u,t=b.dataset.k;const c=SH.chars[u];const cur={...(c.dres||{})};const order=['','resist','immune','vuln'];cur[t]=order[(order.indexOf(cur[t]||'')+1)%4];if(!cur[t])delete cur[t];saveChar(u,{dres:cur})};
// --- rage (5e Barbarian) ---
function rageBonus(c){const l=c.build.level||1;return l>=16?4:l>=9?3:2}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const R=(D.res||{}).rage;if(!R||!canEdit(uid))return h;const left=R.max-((c.res||{}).rage||0);
  const btn=c.raging?`<button type="button" class="btn sm" data-a="rageEnd" data-u="${uid}">😤 End rage</button>`:`<button type="button" class="btn sm pri" data-a="rageStart" data-u="${uid}" ${left>0?'':'disabled'}>😤 Rage <small>(bonus action, ${left} left)</small></button>`;
  return`<div class="row rage">${btn}</div>`+h}})(pgActions);
ACT.rageStart=function(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const R=(D.res||{}).rage;if(!R)return;const used=(c.res||{}).rage||0;if(used>=R.max){toast('No rages left. A long rest brings them back.');return}
  const ctx=fightCtx(u);if(ctx&&!ctx.mine){toast('You can rage on your turn (bonus action).');return}if(ctx){const st=turnSt(u,ctx.key);if(st.bonus&&!tapTwice(b,'Your bonus action is used. Tap again to rage anyway'))return;st.bonus=1}
  saveChar(u,{raging:true,res:{...(c.res||{}),rage:used+1}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`😤 ${c.build.name} flies into a rage!`,total:''})};
ACT.rageEnd=function(b){const u=b.dataset.u;saveChar(u,{raging:false});addLog({by:SH.me,who:who(u),kind:'note',label:`${who(u)}'s rage ends.`,total:'',quiet:true})};
// rage damage on STR melee weapon hits
applyRider=(function(prev){return function(label,expr,opts){[label,expr]=prev(label,expr,opts);const u=opts.uid;const c=u&&SH.chars[u];if(c&&c.raging&&/ damage/.test(label)&&!opts.healTo){const nm=String(label).replace(/ (\+ .*)?damage.*$/,'').trim();const a=(DV(c).attacks||[]).find(x=>x.name===nm);
  if(a&&!/range|ammunition/i.test(a.note||'')&&(a.atkParts||[])[0]&&a.atkParts[0][0]==='STR'){expr=expr+'+'+rageBonus(c);label=label.replace(' damage',' + rage damage')}}return[label,expr]}})(applyRider);
ACT.rest=(function(prev){return function(b){const r=prev(b);const u=b.dataset.u;if(b.dataset.k==='long'&&SH.chars[u]&&SH.chars[u].raging)saveChar(u,{raging:false});return r}})(ACT.rest);
// --- saves the player rolls when an enemy uses an area attack ---
function sreqOf(){return SH.state.sreq||null}
screenHTML=(function(prev){return function(){let h=prev();const s=sreqOf();const c=myChar();if(!s||!c||isDM()||!s.targets.includes(SH.me)||s.done[SH.me])return h;const D=DV(c);const sb=(D.saves[s.ab]||{bonus:0}).bonus;
  const ban=`<div class="sreqban" role="alert"><b>🛡 ${esc(ABN[s.ab]||s.ab)} save!</b><span>${esc(s.from)} uses ${esc(s.att)}. Roll to see if you get out of the way.</span><button type="button" class="btn pri big" data-a="sreqRoll">🎲 Roll ${esc(ABN[s.ab]||s.ab)} save (${fmt(sb)})</button></div>`;
  return h.replace('<div class="hero">',ban+'<div class="hero">')}})(screenHTML);
ACT.sreqRoll=function(){const s=sreqOf();const c=myChar();if(!s||!c)return;const D=DV(c);const sb=(D.saves[s.ab]||{bonus:0});rollD20(`${ABN[s.ab]||s.ab} save vs ${s.att}`,sb.bonus,sb.parts?partsText(sb.parts):fmt(sb.bonus),{uid:SH.me,sreq:s.id})};
function sreqResolve(s,u,total){const dc=((SH.dm.sreqs||{})[s.id]||{}).dc;if(dc===undefined)return;const c=SH.chars[u];if(!c)return;const ok=total>=dc;const dmg=ok?(s.half?Math.floor(s.total/2):0):s.total;
  SH._sd=SH._sd||{};const done=SH._sd[s.id]={...s.done,...(SH._sd[s.id]||{}),[u]:ok?'saved':'failed'};setState({sreq:{...s,done}});
  if(dmg)hpChange(u,-dmg,`${s.from}'s ${s.att}, ${ABN[s.ab]||s.ab} save ${total}: ${ok?'saved, half':'failed'}`,false,s.type);else addLog({by:SH.me,who:'DM',kind:'note',label:`${c.build.name} saves against ${s.att} and takes no damage.`,total:''});
  if(s.targets.every(t=>done[t]))setTimeout(()=>{if(sreqOf()&&sreqOf().id===s.id)setState({sreq:null})},400)}
onLog=(function(prev){return function(fresh){prev(fresh);if(!SH.owner)return;const s=sreqOf();if(!s)return;for(const e of fresh){if(e.sreq!==s.id||e.kind!=='d20'||s.done[e.by]||((SH._sd||{})[s.id]||{})[e.by])continue;sreqResolve(sreqOf(),e.by,e.total)}}})(onLog);
// the DM sees who still has to roll, and can roll for them
dmFight=(function(prev){return function(){let h=prev();const s=sreqOf();if(!s)return h;const wait=s.targets.filter(u=>!s.done[u]);if(!wait.length)return h;
  return`<div class="sreqdm"><b>${esc(s.att)}: waiting for ${esc(ABN[s.ab]||s.ab)} saves</b> <span>${wait.map(u=>esc(who(u))).join(', ')}</span><button type="button" class="btn sm" data-a="sreqAuto">Roll for them</button></div>`+h}})(dmFight);
ACT.sreqAuto=function(){const s=sreqOf();if(!s)return;for(const u of s.targets){const cur=sreqOf();if(cur.done[u]||((SH._sd||{})[s.id]||{})[u])continue;const c=SH.chars[u];const sb=(DV(c).saves[s.ab]||{bonus:0}).bonus;const n=d(20);secretLog({by:SH.me,who:c.build.name,label:`${s.ab} save vs ${s.att} (rolled by the DM)`,detail:`d20 ${n} ${fmt(sb)}`,total:n+sb,kind:'d20'});sreqResolve(cur,u,n+sb)}};
