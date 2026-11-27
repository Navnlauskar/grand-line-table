const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.cwd()+'/sheet/test.html');await p.waitForTimeout(300);await p.fill('#suName','R');await p.click('[data-a=setup][data-k="5e"]');await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const out=[];const mk=(cls,sub,lvl)=>{const b=r5New();b.cls=cls;b.level=lvl;b.name=cls;r5ClassDefaults(b);b.subclass=sub;const c=newCharDoc(b);c.hp=DV(c).maxhp;return c};
  const ok=(n,v,i)=>out.push((v?'✓ ':'✗ ')+n+(i!==undefined?' · '+i:''));
  // dead stays dead
  put('chars/a',{...mk('fighter','Champion',3),dead:true,hp:0});restFor('a','long');ok('dead character stays dead after a long rest',SH.chars.a.dead&&SH.chars.a.hp===0,SH.chars.a.hp);
  // 0 HP stable: 1 HP
  put('chars/b',{...mk('rogue','Thief',3),hp:0,stable:true});restFor('b','long');ok('stable at 0 HP wakes with 1 HP',SH.chars.b.hp===1,SH.chars.b.hp);
  // resources recharge
  const c=mk('fighter','Battle Master',5);c.hp=10;c.res={wind:1,surge:1,sup:3,hd:3};c.raging=false;put('chars/c',c);restFor('c','short');const s=SH.chars.c.res;ok('short rest: Second Wind, Action Surge, superiority back; hit dice kept',!s.wind&&!s.surge&&!s.sup&&s.hd===3,JSON.stringify(s));
  restFor('c','long');ok('long rest: full HP, half hit dice back',SH.chars.c.hp===DV(SH.chars.c).maxhp&&SH.chars.c.res.hd===1,JSON.stringify(SH.chars.c.res)+' hp '+SH.chars.c.hp);
  const d=mk('barbarian','Path of the Berserker',5);d.res={rage:2};d.raging=true;d.frenzied=true;put('chars/d',d);restFor('d','short');ok('short rest ends rage; rages stay used',!SH.chars.d.raging&&SH.chars.d.res.rage===2,JSON.stringify(SH.chars.d.res));
  restFor('d','long');ok('long rest brings rages back',!SH.chars.d.res.rage);
  const m=mk('monk','Way of the Open Hand',6);m.res={ki:5,whole:1};put('chars/m',m);restFor('m','short');ok('short rest: ki back, Wholeness of Body not',!SH.chars.m.res.ki&&SH.chars.m.res.whole===1,JSON.stringify(SH.chars.m.res));
  const g=mk('fighter','Gunslinger',3);g.res={grit:1};g.ammo={Pistol:4};put('chars/g',g);restFor('g','short');ok('short rest: grit back',!SH.chars.g.res.grit);
  return out});console.log(r.join('\n'));console.log('errs',errs);await b.close()})();
