// ================= real dice: type in what your physical dice show =================
// Per device: "🎲 Real dice" on. Every roll for your character asks for the dice faces (or "let the app roll").
// The DM can switch it on for enemy rolls too. Rolls made with real dice are marked 🎲 in the log.
function realOn(kind){try{return localStorage.getItem('sht-real-'+kind)==='1'}catch(e){return false}}
function realSet(kind,v){try{localStorage.setItem('sht-real-'+kind,v?'1':'0')}catch(e){}}
// queue of faces fed to the app's own dice (d() uses Math.random)
{const R0=Math.random;Math.random=function(){if(SH.fq&&SH.fq.length){const [f,n]=SH.fq.shift();return Math.min(.999999,Math.max(0,(f-.5)/n))}return R0()}}
function realFor(opts){opts=opts||{};const u=opts.uid||SH.me;const mine=!opts.name&&!opts.secret&&SH.chars[u]&&(!SH.owner||u!==SH.me||!isDM()||opts.uid);return mine?realOn('me'):(SH.owner&&realOn('dm'))}
// spread a typed total over n dice of the given size
function spreadFaces(total,n,size){total=Math.max(n,Math.min(n*size,Math.round(total)));const f=Array(n).fill(1);let left=total-n;for(let i=0;i<n&&left>0;i++){const add=Math.min(size-1,left);f[i]+=add;left-=add}return f}
let realResolve=null;
function realModal(spec){return new Promise(res=>{realResolve=res;SH.realAsk=spec;SH.realPick=[];render(true);setTimeout(()=>{const i=q('.realbox input');if(i)i.focus()},50)})}
function realBoxHTML(){const s=SH.realAsk;if(!s)return'';
  if(s.kind==='d20'){const need=s.adv?2:1;const p=SH.realPick||[];
    return`<div class="modal realm" role="dialog" aria-modal="true" aria-labelledby="rlT"><div class="mbox realbox"><h2 id="rlT">🎲 Roll ${need===2?'two d20s':'a d20'}</h2><p class="mname"><b>${esc(s.label)}</b>${s.bonus?` <small>then ${fmt(s.bonus)}</small>`:''}</p>${need===2?`<p class="hint">${s.adv>0?'Advantage: the higher one counts.':'Disadvantage: the lower one counts.'} Tap both dice.${p.length?` First: <b>${p[0]}</b>`:''}</p>`:'<p class="hint">Tap the number on top of your die.</p>'}
      <div class="d20grid">${Array.from({length:20},(_,i)=>i+1).map(n=>`<button type="button" class="btn d20b ${n===20?'nat20':n===1?'nat1':''}" data-a="realFace" data-k="${n}">${n}</button>`).join('')}</div>
      <div class="row mbtn"><button type="button" class="btn" data-a="realApp">Let the app roll</button><button type="button" class="btn" data-a="realCancel">Cancel</button></div></div></div>`}
  return`<div class="modal realm" role="dialog" aria-modal="true" aria-labelledby="rlT"><div class="mbox realbox"><h2 id="rlT">🎲 Roll ${esc(s.expr)}</h2><p class="mname"><b>${esc(s.label)}</b>${s.crit?' <small>critical: dice doubled</small>':''}</p>
    ${s.groups.map((g,i)=>`<label class="fl">${g.n}d${g.die}${g.n>1?' (add them up)':''}<input id="rg_${i}" type="number" inputmode="numeric" min="${g.n}" max="${g.n*g.die}" placeholder="${g.n}–${g.n*g.die}"></label>`).join('')}
    ${s.flat?`<p class="hint">${fmt(s.flat)} is added for you.</p>`:''}
    <div class="row mbtn"><button type="button" class="btn pri big" data-a="realOk">Done</button><button type="button" class="btn" data-a="realApp">Let the app roll</button></div><button type="button" class="btn sm" data-a="realCancel">Cancel</button></div></div>`}
function realDone(v){const r=realResolve;realResolve=null;SH.realAsk=null;SH.realPick=[];render(true);if(r)r(v)}
Object.assign(ACT,{
  realFace(b){const s=SH.realAsk;if(!s)return;SH.realPick=[...(SH.realPick||[]),+b.dataset.k];if(SH.realPick.length>=(s.adv?2:1))realDone({faces:SH.realPick.map(f=>[f,20])});else render(true)},
  realOk(){const s=SH.realAsk;if(!s)return;const faces=[];for(let i=0;i<s.groups.length;i++){const g=s.groups[i];const v=+val('rg_'+i);if(!v||v<g.n||v>g.n*g.die){toast(`${g.n}d${g.die} must be between ${g.n} and ${g.n*g.die}.`);return}spreadFaces(v,g.n,g.die).forEach(f=>faces.push([f,g.die]))}realDone({faces})},
  realApp(){realDone({app:1})},realCancel(){realDone(null)},
  realTog(b){const k=b.dataset.k;realSet(k,!realOn(k));toast(realOn(k)?(k==='dm'?'Enemy rolls will ask for your real dice.':'Your rolls will ask for your real dice.'):'The app rolls the dice again.');render(true)}});
document.addEventListener('keydown',e=>{if(SH.realAsk&&e.key==='Enter'&&q('[data-a=realOk]')){e.preventDefault();ACT.realOk()}});
screenHTML=(function(prev){return function(){return prev()+realBoxHTML()}})(screenHTML);
render=(function(prev){return function(f){prev(f);try{document.body.classList.toggle('real-open',!!SH.realAsk)}catch(e){}}})(render);

// riders (smites, Hex…) are added before asking, so the prompt shows the real dice to throw
function applyRider(label,expr,opts){const u=opts.uid;const c=u&&SH.chars[u];const nm=String(label).replace(/ damage.*$/,'').replace(/ \(critical\)$/,'');
  if(c&&c.rider&&/ damage/.test(label)&&!(typeof spellFind==='function'&&spellFind(nm))&&!opts.healTo){const r=c.rider;expr=expr+'+'+r.dice;label=label.replace(' damage',` + ${r.name} damage`);if(r.once)saveChar(u,{rider:null})}
  return[label,expr]}
rollD20=(function(prev){return async function(label,bonus,parts,opts){opts=opts||{};if(!realFor(opts))return prev(label,bonus,parts,opts);
  const adv=opts.adv!==undefined?opts.adv:SH.adv;const r=await realModal({kind:'d20',label,bonus,adv});if(!r)return null;if(r.app)return prev(label,bonus,parts,opts);
  // the core rolls two d20s; feed both (the second is ignored without advantage)
  SH.fq=[r.faces[0],r.faces[1]||r.faces[0]];SH.realFlag=1;try{return await prev(label,bonus,parts,{...opts,adv})}finally{SH.fq=[];SH.realFlag=0}}})(rollD20);
rollDmg=(function(prev){return async function(label,expr,opts){opts=opts||{};[label,expr]=applyRider(label,expr,opts);if(!realFor(opts))return prev(label,expr,opts);
  const t=parseDice(expr);if(!t)return prev(label,expr,opts);const groups=t.filter(x=>x.flat===undefined).map(x=>({n:opts.crit?x.n*2:x.n,die:x.die}));if(!groups.length)return prev(label,expr,opts);
  const flat=t.filter(x=>x.flat!==undefined).reduce((a,x)=>a+x.sign*x.flat,0);const r=await realModal({kind:'dmg',label,expr:opts.crit?groups.map(g=>g.n+'d'+g.die).join('+')+(flat?fmt(flat):''):expr,groups,flat,crit:opts.crit});
  if(!r)return null;if(r.app)return prev(label,expr,opts);SH.fq=r.faces;SH.realFlag=1;try{return await prev(label,expr,opts)}finally{SH.fq=[];SH.realFlag=0}}})(rollDmg);
addLog=(function(prev){return function(e){if(SH.realFlag&&e&&(e.kind==='d20'||e.kind==='dmg'))e.real=1;return prev(e)}})(addLog);
secretLog=(function(prev){return function(e){if(SH.realFlag&&e)e.real=1;return prev(e)}})(secretLog);
// showRoll: mark the card too
showRoll=(function(prev){return function(e,f){if(SH.realFlag&&e)e.real=1;return prev(e,f)}})(showRoll);

// switches: top bar for everyone, the DM's Table page for enemies
topHTML=(function(prev){return function(){const h=prev();if(!SH.ready||!SH.state.rules)return h;const on=realOn('me');
  return h.replace('<button type="button" class="btn xs" data-a="themeOpen"',`<button type="button" class="btn xs ${on?'on':''}" data-a="realTog" data-k="me" aria-pressed="${on}" title="${on?'You roll real dice and type the result':'Tap to roll your own real dice'}">🎲${on?'<span class="rl"> Real</span>':''}</button><button type="button" class="btn xs" data-a="themeOpen"`)}})(topHTML);
dmTable=(function(prev){return function(){const on=realOn('dm');return`<h2>Real dice</h2><p class="hint">Each player switches this on their own phone with the 🎲 button at the top. You can also roll your enemies' attacks with real dice.</p>
  <label class="row tog"><input type="checkbox" data-c="realDm" ${on?'checked':''}> Roll enemy attacks with my real dice (I type the result)</label>`+prev()}})(dmTable);
Object.assign(CHG,{realDm(e){realSet('dm',e.checked);toast(e.checked?'Enemy attacks will ask for your dice.':'The app rolls enemy attacks.')}});
// enemy damage on the DM's side (rolled without a log entry of its own)
async function realExpr(expr,crit,label){if(!(SH.owner&&realOn('dm')))return rollExprNow(expr,crit);const t=parseDice(expr);if(!t)return null;const groups=t.filter(x=>x.flat===undefined).map(x=>({n:crit?x.n*2:x.n,die:x.die}));
  const flat=t.filter(x=>x.flat!==undefined).reduce((a,x)=>a+x.sign*x.flat,0);const r=await realModal({kind:'dmg',label,expr,groups,flat,crit});if(!r)return null;if(r.app)return rollExprNow(expr,crit);SH.fq=r.faces;try{const x=rollExprNow(expr,crit);x.detail+=' · real dice';return x}finally{SH.fq=[]}}
// typed damage totals: show the total per dice group, not invented single dice
function realDetail(e){if(SH.realFlag&&e&&e.kind==='dmg'&&e.detail)e.detail=e.detail.replace(/(\d+d\d+) \(([^)]*)\)/g,(m,g,fs)=>{const a=fs.split(', ').map(Number);return a.length>1?`${g} (${a.reduce((x,y)=>x+y,0)})`:m})}
addLog=(function(prev){return function(e){realDetail(e);return prev(e)}})(addLog);
showRoll=(function(prev){return function(e,f){realDetail(e);return prev(e,f)}})(showRoll);
