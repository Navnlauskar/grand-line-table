// ================= firearms (5e rules): reload, misfire, repair · Gunslinger fighter (grit and trick shots) · Champion critical range =================
// Firearm numbers follow the common Gunslinger homebrew; the DM can change them on the sheet with custom attacks.
const GUNS={Pistol:{rng:'60/240',rl:4,mis:1},Musket:{rng:'120/360',rl:1,mis:2},Pepperbox:{rng:'80/320',rl:6,mis:2},Blunderbuss:{rng:'15/60',rl:1,mis:2},'Bad News':{rng:'200/800',rl:1,mis:3}};
Object.assign(R5.weapons,{pistol:['Pistol','1d10','piercing','r'],musket:['Musket','1d12','piercing','r'],pepperbox:['Pepperbox','1d10','piercing','r'],blunderbuss:['Blunderbuss','2d8','piercing','r'],badnews:['Bad News','2d12','piercing','r']});
const isGS=b=>!!b&&b.rules==='5e'&&b.cls==='fighter'&&/gunslinger/i.test(b.subclass||'');
const isChamp=b=>!!b&&b.rules==='5e'&&b.cls==='fighter'&&/champion/i.test(b.subclass||'');
const SUBFEATS={
  gunslinger:{3:[['Firearm Proficiency',"You are proficient with firearms, and you can make ammunition and repair guns with tinker's tools."],['Adept Marksman','Grit points equal your WIS modifier (at least 1) and come back on a short or long rest. You regain 1 grit when you score a critical hit or drop a creature to 0 HP with a firearm. Trick shots cost 1 grit each: Deadeye Shot (advantage), Violent Shot (critical on 18-20, misfire +2), and after a hit Dazing, Disarming, Forceful, Winging, Piercing or Bullying Shot.']],
    7:[['Quickdraw','Add your proficiency bonus to initiative. Stowing one firearm and drawing another is one object interaction.']],10:[['Rapid Repair','Repair a misfired firearm as a bonus action by spending 1 grit.']],15:[['Lightning Reload','Reload a firearm as a bonus action.']],18:[['Vicious Intent','Firearm attacks score a critical hit on a 19 or 20, and a 19 also regains grit.']]},
  champion:{3:[['Improved Critical','Your weapon attacks score a critical hit on a 19 or 20.']],7:[['Remarkable Athlete','Add half your proficiency bonus (round up) to STR, DEX and CON checks you are not proficient in. Running long jumps go further by your STR modifier in feet.']],10:[['Additional Fighting Style','Choose a second Fighting Style.']],15:[['Superior Critical','Your weapon attacks score a critical hit on an 18-20.']],18:[['Survivor','At the start of each of your turns, regain 5 + CON modifier HP if you have no more than half your HP left (and at least 1).']]}};
derive5=(function(prev){return function(b){const D=prev(b);const lvl=D.lvl;const M=a=>Math.floor((D.ab[a]||10)/2)-5;const gs=isGS(b);
  for(const a of D.attacks||[]){const g=GUNS[a.name];if(!g)continue;a.gun=g;a.note+=`, firearm ${g.rng} ft, reload ${g.rl}, misfire ${g.mis}`;if(!gs){a.atkParts=a.atkParts.filter(p=>p[0]!=='Proficiency');a.atk=partsSum(a.atkParts);a.note+=', not proficient'}}
  const sk=gs?'gunslinger':isChamp(b)?'champion':null;
  if(sk){const S=SUBFEATS[sk];D.feats=D.feats.flatMap(f=>{const m=/feature \(level (\d+)\)$/.exec(f[0]);return m&&S[+m[1]]?S[+m[1]].map(x=>[x[0]+` (${sk==='gunslinger'?'Gunslinger':'Champion'})`,x[1]]):[f]})}
  if(isChamp(b)&&lvl>=3)D.critMin=lvl>=15?18:19;
  if(gs&&lvl>=3){D.res={...D.res,grit:{name:'Grit points',max:Math.max(1,M('WIS')),rest:'short'}};D.gritDC=8+D.prof+M('DEX');D.feats.push(['Trick shot save DC',String(D.gritDC)]);
    if(lvl>=7){D.initParts=[...D.initParts,['Quickdraw',D.prof]];D.init=partsSum(D.initParts)}if(lvl>=18)D.gunCrit=19}
  return D}})(derive5);
// --- the attack roll: reload, jams, critical range, trick shots before the shot ---
function gunOf(c,name){if(!c||c.build.rules!=='5e')return null;const a=(DV(c).attacks||[]).find(x=>x.name===name);return a&&a.gun?a:null}
doAttack=(function(prev){return function(u,a,tg,ak,o){const c=SH.chars[u];const g=gunOf(c,a.name);if(g){if((c.jam||{})[a.name]){toast(`Your ${a.name} is jammed. Repair it first (Firearms, below).`);return}
    if(((c.ammo||{})[a.name]||0)>=g.gun.rl){toast(`Your ${a.name} is empty. Reload it first.`);return}}return prev(u,a,tg,ak,o)}})(doAttack);
rollD20=(function(prev){return async function(label,bonus,parts,opts){opts=opts||{};const u=opts.uid;const c=u&&!opts.name&&SH.chars[u];
  if(!c||!/ attack\b/.test(label)||/spell attack/.test(label))return prev(label,bonus,parts,opts);
  const D=DV(c);const nm=label.replace(/ attack.*$/,'');const a=(D.attacks||[]).find(x=>x.name===nm);let cm=D.critMin||20;const g=a&&a.gun;const st=myTurnSt(u);const S=st&&st!=='no'?st:null;
  if(g&&D.gunCrit)cm=Math.min(cm,D.gunCrit);
  if(!g){if(cm<20)opts={...opts,cm};return prev(label,bonus,parts,opts)}
  let mis=g.mis;if(S&&S.violent){cm=Math.min(cm,18);mis+=2;S.violent=0;label+=' (Violent Shot)'}
  if(S&&S.deadeye){S.deadeye=0;opts={...opts,adv:1};label+=' (Deadeye Shot: advantage)'}
  opts={...opts,mis,...(cm<20?{cm}:{})};const e=await prev(label,bonus,parts,opts);if(!e)return e;
  const cur=SH.chars[u];const patch={ammo:{...(cur.ammo||{}),[nm]:((cur.ammo||{})[nm]||0)+1}};
  if(e.aid){SH.gunAids=SH.gunAids||{};SH.gunAids[e.aid]=u}
  if(e.nat<=mis){patch.jam={...(cur.jam||{}),[nm]:true};addLog({by:SH.me,who:cur.build.name,kind:'note',label:`💥 ${cur.build.name}'s ${nm} misfires (rolled ${e.nat}, misfire ${mis}): the shot misses and the gun is jammed until repaired.`,total:''})}
  saveChar(u,patch);return e}})(rollD20);
// --- firearms box and Gunslinger trick shots on the Actions page ---
function gunsHTML(uid,c,D){if(!canEdit(uid)||c.build.rules!=='5e')return'';const G=(D.attacks||[]).filter(a=>a.gun);const gs=isGS(c.build)&&D.res.grit;if(!G.length&&!gs)return'';const st=myTurnSt(uid);const S=st&&st!=='no'?st:null;
  const btn=(a,label,sub,dis,extra)=>`<button type="button" class="btn sm mact" data-a="${a}" data-u="${uid}" ${dis?'disabled':''} ${extra||''}><b>${label}</b><small>${sub}</small></button>`;const B=[];
  for(const a of G){const used=(c.ammo||{})[a.name]||0;const left=a.gun.rl-used;const jam=(c.jam||{})[a.name];
    B.push(jam?btn('gnRepair',`🔧 Repair ${esc(a.name)}`,`jammed · ${gs&&D.lvl>=10?'bonus + 1 grit':'action'} · DC ${8+a.gun.mis}`,false,`data-k="${esc(a.name)}"`):btn('gnReload',`${esc(a.name)} ${'●'.repeat(Math.max(0,left))}${'○'.repeat(Math.max(0,Math.min(used,a.gun.rl)))}`,left<a.gun.rl?`reload · ${gs&&D.lvl>=15?'bonus action':'action'}`:'loaded',left>=a.gun.rl,`data-k="${esc(a.name)}"`))}
  if(gs){const left=resLeft(c,D,'grit');const lh=S&&S.lastHit;
    B.push(`<span class="gritn">Grit ${left}/${D.res.grit.max} · DC ${D.gritDC}</span>`);
    B.push(btn('gnDeed','Deadeye Shot',S&&S.deadeye?'ready: next shot':'advantage on your next shot',left<1||(S&&S.deadeye),'data-k="deadeye"'));
    B.push(btn('gnDeed','Violent Shot',S&&S.violent?'ready: next shot':'next shot crits on 18-20, misfire +2',left<1||(S&&S.violent),'data-k="violent"'));
    for(const [k,n,sub] of [['winging','Winging Shot','STR save or prone'],['dazing','Dazing Shot','CON save or dazed'],['disarming','Disarming Shot','STR save or drops an item'],['forceful','Forceful Shot','STR save or pushed 15 ft'],['piercing','Piercing Shot','hits everyone in a line'],['bullying','Bullying Shot','add CHA to intimidate']])
      B.push(btn('gnDeed',n,`after a firearm hit · ${sub}`,left<1||!lh,`data-k="${k}"`))}
  return`<h2>${gs?'Gunslinger':'Firearms'} <small>reload, repair${gs?', trick shots':''}</small></h2><div class="macts">${B.join('')}</div>`}
pgActions=(function(prev){return function(uid,c,D){let h=prev(uid,c,D);const m=gunsHTML(uid,c,D);if(!m)return h;const i=h.indexOf('<h2>Attacks');return i<0?m+h:h.slice(0,i)+m+h.slice(i)}})(pgActions);
const DEEDS={winging:['Winging Shot','STR','Prone'],dazing:['Dazing Shot','CON','Dazed'],disarming:['Disarming Shot','STR',''],forceful:['Forceful Shot','STR','']};
Object.assign(SPELL_COND,{'Winging Shot':'Prone','Dazing Shot':'Dazed'});if(!FOE_CONDS.includes('Dazed'))FOE_CONDS.push('Dazed');
Object.assign(ACT,{
  gnReload(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const nm=b.dataset.k;const st=myTurnSt(u);const fast=isGS(c.build)&&D.lvl>=15;if(!needEcon(b,st,fast?'bonus':'act',fast?'bonus action':'action'))return;
    saveChar(u,{ammo:{...(c.ammo||{}),[nm]:0}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`🔫 ${c.build.name} reloads the ${nm}.`,total:'',quiet:true})},
  async gnRepair(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const nm=b.dataset.k;const a=gunOf(c,nm);if(!a)return;const gs=isGS(c.build);const fast=gs&&D.lvl>=10&&resLeft(c,D,'grit')>0;const st=myTurnSt(u);
    if(!needEcon(b,st,fast?'bonus':'act',fast?'bonus action':'action'))return;if(fast)spendRes(u,'grit');const bonus=abMod(D,'DEX')+(gs?D.prof:0);const dc=8+a.gun.mis;
    const e=await rollD20(`Tinker's tools check: repair the ${nm} (DC ${dc})`,bonus,`DEX ${fmt(abMod(D,'DEX'))}${gs?' + proficiency '+D.prof:''}`,{uid:u});if(!e)return;
    if(e.total>=dc){saveChar(u,{jam:{...(SH.chars[u].jam||{}),[nm]:false}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`🔧 ${c.build.name} fixes the ${nm}.`,total:''})}else addLog({by:SH.me,who:c.build.name,kind:'note',label:`🔧 The ${nm} is still jammed.`,total:''})},
  gnDeed(b){const u=b.dataset.u;const c=SH.chars[u];const D=DV(c);const k=b.dataset.k;if(resLeft(c,D,'grit')<1){toast('No grit left. A short rest brings it back.');return}const st=myTurnSt(u);if(st==='no'){toast('Not your turn yet.');return}
    if(k==='deadeye'||k==='violent'){if(st)st[k]=1;spendRes(u,'grit');addLog({by:SH.me,who:c.build.name,kind:'note',label:`🎯 ${c.build.name} lines up a ${k==='deadeye'?'Deadeye':'Violent'} Shot.`,total:'',quiet:true});render(true);return}
    const t=st&&st.lastHit;if(!t){toast('Hit with a firearm first.');return}spendRes(u,'grit');st.lastHit=null;
    if(DEEDS[k]){const [n,ab]=DEEDS[k];addLog({by:SH.me,who:c.build.name,kind:'note',label:`🎯 ${c.build.name} uses ${n} on ${t.tname}: ${ab} save DC ${D.gritDC}.`,total:'',save:{ab,dc:D.gritDC,h:false,tgts:[t.tgt],tnames:[t.tname],spell:n}})}
    else addLog({by:SH.me,who:c.build.name,kind:'note',label:k==='piercing'?`🎯 ${c.build.name} uses Piercing Shot: the bullet goes on through ${t.tname}. DM: roll the shot against each creature in a line behind it.`:`🎯 ${c.build.name} uses Bullying Shot: add CHA to the next Intimidation check.`,total:''});render(true)}});
// regain grit: a critical hit or a kill with a firearm
onLog=(function(prev){return function(fresh){prev(fresh);const c=myChar();if(!c||!isGS(c.build))return;const D=DV(c);if(!D.res.grit)return;let gain=0;
  for(const e of fresh){if(e.kind!=='note')continue;if(e.hitOf&&e.hit&&e.crit&&(SH.gunAids||{})[e.hitOf]===SH.me)gain++;
    const m=/goes down \(([^,]+), (.+?) (?:\+ .*)?damage\)/.exec(e.label||'');if(m&&m[1]===c.build.name&&GUNS[m[2].trim()])gain++}
  if(!gain)return;const used=(c.res||{}).grit||0;if(!used)return;saveChar(SH.me,{res:{...(c.res||{}),grit:Math.max(0,used-gain)}});addLog({by:SH.me,who:c.build.name,kind:'note',label:`${c.build.name} regains ${gain} grit.`,total:'',quiet:true})}})(onLog);
