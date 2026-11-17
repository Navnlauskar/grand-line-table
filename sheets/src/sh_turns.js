// ================= attacks follow the turn order in a fight; the DM's log shows the hidden rolls =================
// In a started fight: you attack on your own turn, as many times as your Attack action allows (more only with a second tap,
// marked "extra" for the DM), and damage can only be rolled once per attack roll. Outside fights you roll freely,
// and a roll repeated within 3 minutes is marked "2nd try" in the log.
function fightCtx(u){const ini=initOf();if(!ini.on||!ini.started)return null;const order=ini.order||[];if(!order.some(o=>o.pc===u))return null;const cur=order[ini.turn];return{mine:!!(cur&&cur.pc===u),key:`${ini.id}:${ini.round||1}:${ini.turn}`}}
function turnSt(u,key){SH.ta=SH.ta||{};let s=SH.ta[u];if(!s||s.key!==key)s=SH.ta[u]={key,n:0,pend:0};return s}
const dmFor=u=>SH.owner&&u!==SH.me;
ACT.atk=function(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(!a)return;const ctx=dmFor(u)?null:fightCtx(u);let tag='';let st=null;
  if(ctx){if(!ctx.mine){toast('Not your turn yet. You can attack when the fight reaches you.');return}
    st=turnSt(u,ctx.key);const lim=DV(SH.chars[u]).nAtk||1;
    if(st.n>=lim){if(!tapTwice(b,`Tap again for an extra attack (bonus action, Action Surge…)`))return;tag=' (extra attack)'}else if(lim>1)tag=` (${st.n+1} of ${lim})`;
    st.n++;st.pend++}
  rollD20(a.name+' attack'+tag,a.atk,a.atkParts?partsText(a.atkParts):fmt(a.atk),{uid:u,follow:a.dmg?[{t:'Damage '+a.dmg,run:crit=>{if(st){if(st.pend<=0)return;st.pend--}rollDmg(a.name+' damage',a.dmg,{uid:u,crit});render(true)}}]:null});render(true)};
ACT.dmg=function(b){const u=b.dataset.u;const a=atkById(u,b.dataset.k);if(!a||!a.dmg)return;const ctx=dmFor(u)?null:fightCtx(u);
  if(ctx){if(!ctx.mine){toast('Not your turn yet.');return}const st=turnSt(u,ctx.key);if(st.pend<=0){toast('Roll to hit first: tap the attack name. Damage comes after a hit.');return}st.pend--}
  rollDmg(a.name+' damage',a.dmg,{uid:u});render(true)};
// show the state on the buttons
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const ctx=dmFor(uid)?null:fightCtx(uid);if(!ctx)return h;
  if(!ctx.mine)return h.replace(/<h2>Attacks <small>[^<]*<\/small><\/h2>/,'<h2>Attacks <small>wait for your turn</small></h2>').replace(/class="rb" data-a="atk"/g,'class="rb wait" data-a="atk"').replace(/class="btn dmg" data-a="dmg"/g,'class="btn dmg wait" data-a="dmg"');
  const st=turnSt(uid,ctx.key);const lim=D.nAtk||1;
  h=h.replace(/<h2>Attacks <small>[^<]*<\/small><\/h2>/,`<h2>Attacks <small>your turn · ${Math.min(st.n,lim)} of ${lim} attack${lim>1?'s':''} used${st.n>lim?` + ${st.n-lim} extra`:''}${st.pend?` · ${st.pend} damage roll${st.pend>1?'s':''} ready`:''}</small></h2>`);
  if(!st.pend)h=h.replace(/class="btn dmg" data-a="dmg"/g,'class="btn dmg wait" data-a="dmg"');return h}})(pgActions);
// the DM's log (dock and Table page) mixes in the hidden rolls, marked 🔒
function dmLogHTML(n){const sec=((SH.dm.rolls||{}).items||[]).map(e=>({...e,label:'🔒 '+e.label,hid:1}));const all=[...SH.log,...sec].sort((a,b)=>(b.t||0)-(a.t||0));const L=SH.log;SH.log=all;try{return logHTML(n)}finally{SH.log=L}}
dockHTML=(function(prev){return function(){let h=prev();if(h&&SH.owner)h=h.replace(/<div class="log">[\s\S]*<\/div><\/aside>$/,`<div class="log">${dmLogHTML(80)}</div><p class="mini dockfoot">🔒 = hidden roll, only you see it</p></aside>`);return h}})(dockHTML);
