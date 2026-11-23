// ================= enemies follow the action economy too: attacks on their own turn (Multiattack), one reaction per round =================
const NUMW={one:1,two:2,three:3,four:4,five:5,six:6};
function multiOf(m){const L=m&&m.lib&&monFind(m.lib);const t=L&&(L.tx||[]).find(x=>/multiattack/i.test(x[0]));if(!t)return{n:1,txt:''};
  const r=/makes (one|two|three|four|five|six|\d+)\b[^.]*?attacks?/i.exec(t[1]);const n=r?(NUMW[r[1].toLowerCase()]||+r[1]||1):2;return{n:Math.max(1,n),txt:t[1]}}
function monTurnSt(id){const ini=initOf();const key=ini.id+':'+(ini.round||1);SH.mta=SH.mta||{};let s=SH.mta[id];if(!s||s.key!==key)s=SH.mta[id]={key,n:0,react:0,turnN:-1};
  // a new turn for this enemy resets its attacks (its reaction lasts until its next turn)
  const onTurn=ini.started&&(ini.order||[])[ini.turn]&&ini.order[ini.turn].id===id;if(onTurn&&s.turnN!==ini.turn){s.turnN=ini.turn;s.n=0;s.react=0}return s}
function monOnTurn(id){const ini=initOf();return!!(ini.started&&(ini.order||[])[ini.turn]&&ini.order[ini.turn].id===id)}
// the gate sits on the DM's attack button, before the target is picked
ACT.mtPick=(function(prev){return function(b){const id=b.dataset.k;const i=+b.dataset.i;if(SH.mt&&SH.mt.id===id&&SH.mt.i===i)return prev(b);const ini=initOf();const m=monsOf()[id];if(!m)return prev(b);
  if(!ini.started){if(!tapTwice(b,'The round has not begun. Tap again to attack anyway (surprise)'))return;return prev(b)}
  const st=monTurnSt(id);const M=multiOf(m);
  if(!monOnTurn(id)){if(st.react){toast(`${m.name} has already used its reaction this round.`);return}
    if(SH.reactArm!==id){toast(`It is not ${m.name}'s turn. For an opportunity attack, tap ⚡ Reaction on its row first.`);return}return prev(b)}
  if(st.n>=M.n+(st.extra||0)){toast(`${m.name} has made ${M.n===1?'its attack':'all '+M.n+' attacks'} this turn. If a rule gives it more, tap +1 attack on its row.`);return}
  return prev(b)}})(ACT.mtPick);
monAttack=(function(prev){return async function(id,i,targets){const ini=initOf();const m=monsOf()[id];if(m&&ini.on&&ini.started&&m.hp>0){const st=monTurnSt(id);if(monOnTurn(id))st.n++;else{st.react=1;SH.reactArm=null}}return prev(id,i,targets)}})(monAttack);
Object.assign(ACT,{mtReact(b){const id=b.dataset.k;SH.reactArm=SH.reactArm===id?null:id;if(SH.reactArm)toast('Now pick the attack and the target.');render(true)},
  mtMore(b){const id=b.dataset.k;const st=monTurnSt(id);st.extra=(st.extra||0)+1;const m=monsOf()[id];secretLog({by:SH.me,who:'DM',label:`${m?m.name:'Enemy'} gets one more attack this turn (DM's call).`,detail:'',total:'',kind:'note'});render(true)}});
// show how many attacks are left on each enemy's row
dmFight=(function(prev){return function(){let h=prev();const ini=initOf();if(!ini.on||!ini.started)return h;const mons=monsOf();
  for(const o of ini.order||[]){const m=mons[o.id];if(!m||o.pc||m.hp<=0)continue;const st=monTurnSt(o.id);const M=multiOf(m);const on=monOnTurn(o.id);
    const lim=M.n+(st.extra||0);const tag=on?`<span class="econm ${st.n>=lim?'used':''}" title="${esc(M.txt)}">${lim>1?`${M.n>1?'Multiattack: ':''}${Math.min(st.n,lim)} of ${lim} attacks`:`Attack: ${st.n>=1?'used':'ready'}`}</span><button type="button" class="btn xs" data-a="mtMore" data-k="${o.id}" title="A rule gives it one more attack">+1 attack</button>`
      :st.react?`<span class="econm used">reaction used</span>`:`<button type="button" class="btn xs ${SH.reactArm===o.id?'pri':''}" data-a="mtReact" data-k="${o.id}" title="Opportunity attack outside its turn">⚡ Reaction</button>`;
    h=h.replace(new RegExp(`<div class="matks">(?=<(?:button[^>]*data-k="${o.id}"|input id="caB_${o.id}"))`),`<div class="matks">${tag}`)}
  return h}})(dmFight);
