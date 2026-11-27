// level every martial class from 1 to 8 through the level-up screen; check HP, features, attacks
const {chromium}=require('playwright');const RULES=process.argv[2]||'5e';
const LIST=RULES==='5e'?[['barbarian','Path of the Berserker'],['fighter','Battle Master'],['fighter','Gunslinger'],['monk','Way of the Open Hand'],['rogue','Thief']]:[['fighter',''],['monk',''],['rogue',''],['bruiser','']];
(async()=>{const b=await chromium.launch();let fails=0;
for(const [cls,sub] of LIST){const p=await b.newPage({viewport:{width:420,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(300);await p.fill('#suName','L');await p.click(`[data-a=setup][data-k="${RULES}"]`);await p.waitForTimeout(200);
 await p.evaluate(([R,cls])=>{SH.state.freeLevel=true;setState({freeLevel:true});const b=R==='5e'?r5New():opDefault();b.cls=cls;b.name='Lv';if(R==='5e')r5ClassDefaults(b);else opClassDefaults(b);b.scores={STR:15,DEX:14,CON:14,INT:10,WIS:12,CHA:8};const c=newCharDoc(b);c.hp=DV(c).maxhp;put('chars/'+SH.me,c);render(true)},[RULES,cls]);
 await p.click('[data-a=swapDM]').catch(()=>{});await p.waitForTimeout(200);
 const out=[];for(let L=2;L<=8;L++){const before=await p.evaluate(()=>{const c=myChar();const D=DV(c);return{hp:c.hp,max:D.maxhp,n:D.feats.length,names:D.feats.map(f=>f[0]),con:mod(D.ab.CON),lvl:c.build.level}});
  const lu=await p.$('[data-a=luOpen]');if(!lu){out.push(`L${L}: no level-up button`);fails++;break}await lu.click();await p.waitForTimeout(200);
  const wyg=await p.$$eval('.builder .feats summary',e=>e.map(x=>x.textContent));const hint=await p.$$eval('.builder .feats .hint',e=>e.map(x=>x.textContent).join(' '));
  await p.click('[data-a=luAvg]');await p.waitForTimeout(100);
  const subIn=await p.$('[data-c=luText][data-f=sub]');if(subIn){const tag=await subIn.evaluate(x=>x.tagName);if(tag==='SELECT'){const o=await subIn.$$eval('option',e=>e.map(x=>x.value).filter(Boolean));await subIn.selectOption(o[0])}else{await subIn.fill(sub);await subIn.dispatchEvent('change')}await p.waitForTimeout(100)}
  const wyg2=await p.$$eval('.builder .feats summary',e=>e.map(x=>x.textContent));wyg.push(...wyg2);
  const a1=await p.$('[data-c=luText][data-f=a1]');if(a1){await a1.selectOption(cls==='rogue'||cls==='monk'?'DEX':'STR');await p.waitForTimeout(100)}
  for(let i=0;i<4;i++){const ch=await p.$('[data-a=luExp]:not(.on)');if(!ch)break;await ch.click();await p.waitForTimeout(80)}
  await p.click('[data-a=luSave]');await p.waitForTimeout(250);const er=await p.$$eval('.errs p',e=>e.map(x=>x.textContent));
  const after=await p.evaluate(()=>{const c=myChar();const D=DV(c);return{hp:c.hp,max:D.maxhp,names:D.feats.map(f=>f[0]),lvl:c.build.level,atk:D.nAtk||1,res:Object.entries(D.res||{}).map(([k,r])=>k+':'+r.max).join(' '),acts:[...document.querySelectorAll('.mact b')].map(x=>x.textContent).join(', ')}});
  const newF=after.names.filter(n=>!before.names.includes(n));
  if(er.length||after.lvl!==L){out.push(`L${L}: NOT SAVED ${er.join(' / ')}`);fails++;await p.click('[data-a=luCancel]').catch(()=>{});break}
  const gain=after.max-before.max;const hd={barbarian:12,fighter:10,monk:8,rogue:8,bruiser:10}[cls]||8;const exp=(RULES==='5e'?hd/2+1:hd/2+1)+after.hp*0+ (before.con);
  out.push(`L${L}: +${gain} HP (expected ~${exp}${gain!==exp?' (CON or feature change)':''}) · attacks ${after.atk} · new: ${newF.join(', ')||'—'} · shown before saving: ${wyg.join(', ')||'—'}${hint?' ['+hint+']':''}`);
  const missing=newF.filter(n=>!/^Ability Score/.test(n)&&!wyg.some(w=>n.startsWith(w)||w.startsWith(n.replace(/ \(.*/,''))));if(missing.length){out.push(`   ✗ not shown on the level-up screen: ${missing.join(', ')}`);fails++}
  if(after.hp!==after.max){out.push(`   ✗ hp ${after.hp}/${after.max} after level up from full`);fails++}
  if(L===8)out.push(`   resources ${after.res} | class buttons: ${after.acts}`)}
 console.log(`== ${RULES} ${cls} ${sub}\n`+out.join('\n')+(errs.length?'\n   ERR '+errs.join(' | '):''));if(errs.length)fails++;await p.close()}
console.log(fails?fails+' problems':'all fine');await b.close()})();
