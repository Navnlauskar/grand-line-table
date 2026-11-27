// ================= helpers =================
const d=n=>1+Math.floor(Math.random()*n);
const sum=a=>a.reduce((x,y)=>x+y,0);
const mod=s=>Math.floor((s-10)/2);
const fmt=n=>(n>=0?'+':'')+n;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const B=n=>'฿'+Number(n).toLocaleString('en-US');
const $=id=>document.getElementById(id);
const cheb=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
const nowT=()=>Date.now();

// ================= icons (original emblems) =================
const SVG={
  axe:'<svg viewBox="0 0 24 24"><path d="M13.5 2.5c4.2.6 7.4 3.8 8 8l-4.8.7-3.9-3.9z"/><path d="M12.2 8.6l3.2 3.2-10.6 10.6a1.5 1.5 0 0 1-2.1 0l-1.1-1.1a1.5 1.5 0 0 1 0-2.1z"/></svg>',
  sword:'<svg viewBox="0 0 24 24"><path d="M21.5 2.5v4.2l-10.3 10.3-2.9-2.9L18.6 3.8z"/><path d="M5.2 12.9l5.9 5.9-1.6 1.6-1.7-1.7-3.4 3.4-1.7-1.7 3.4-3.4-1.7-1.7z"/></svg>',
  fist:'<svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="3.5"/><rect x="5" y="4" width="3.6" height="6.5" rx="1.8"/><rect x="9.2" y="3" width="3.6" height="7.5" rx="1.8"/><rect x="13.4" y="3.5" width="3.6" height="7" rx="1.8"/><rect x="17.2" y="5.5" width="3.2" height="5.5" rx="1.6"/></svg>',
  dagger:'<svg viewBox="0 0 24 24"><path d="M20.8 3.2l-2.1 6.4-7.2 7.2-2.3-2.3 7.2-7.2z"/><path d="M6.4 13.9l3.7 3.7-1.5 1.5-1.2-1.2-3 3-1.3-1.3 3-3-1.2-1.2z"/></svg>',
  pistol:'<svg viewBox="0 0 24 24"><path d="M2.5 7.5h16.5l2.5 2.2v2.3h-8.6l-1.5 1.6-1.6 5.4H5.4l1.3-6H2.5z"/><path d="M10.5 12h2l-.6 2h-1.9z" fill-opacity=".4"/></svg>',
  bow:'<svg viewBox="0 0 24 24"><path d="M5 2.5c8.5 2.2 14.3 8 16.5 16.5l-1.9.5C17.5 11.8 12.2 6.5 4.5 4.4z"/><path d="M4.2 3.6l15.9 15.9-1.1 1.1L3.1 4.7z" fill-opacity=".55"/><path d="M2 8.5l7.5 1.4-1.4 1.4zM13.6 14.5l1.4 7.5-1.4-1.4z"/></svg>',
  staff:'<svg viewBox="0 0 24 24"><path d="M18.4 2.6l3 3L6.6 20.4l-3-3z"/><circle cx="19.9" cy="4.1" r="2.4"/><circle cx="4.1" cy="19.9" r="2.4"/></svg>',
  skull:'<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2.5c5 0 8.5 3.4 8.5 8 0 2.8-1.4 4.9-3.5 6v2.7a1.8 1.8 0 0 1-1.8 1.8H8.8A1.8 1.8 0 0 1 7 19.2v-2.7c-2.1-1.1-3.5-3.2-3.5-6 0-4.6 3.5-8 8.5-8zM8.4 9.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zm7.2 0a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM12 13.6l-1.3 2.4h2.6z"/></svg>',
  anchor:'<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 1.8a3 3 0 0 1 1 5.8V9h3.5v2H13v8.1c3-.4 5.2-2.4 5.8-5.1h-2.3l3.3-3.6 3.3 3.6h-2.3c-.7 4.4-4.6 7.6-8.8 7.6s-8.1-3.2-8.8-7.6H.9l3.3-3.6L7.5 14H5.2c.6 2.7 2.8 4.7 5.8 5.1V11H7.5V9H11V7.6a3 3 0 0 1 1-5.8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
  flag:'<svg viewBox="0 0 24 24"><path d="M4 2.5h2v19H4z"/><path d="M6.5 3.5h13l-3 4.5 3 4.5h-13z"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  wheel:'<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11 1.5h2v2.6a8 8 0 0 1 3.4 1.4l1.8-1.8 1.4 1.4-1.8 1.8a8 8 0 0 1 1.4 3.4h2.6v2h-2.6a8 8 0 0 1-1.4 3.4l1.8 1.8-1.4 1.4-1.8-1.8a8 8 0 0 1-3.4 1.4v2.6h-2v-2.6a8 8 0 0 1-3.4-1.4l-1.8 1.8-1.4-1.4 1.8-1.8A8 8 0 0 1 4.1 13H1.5v-2h2.6a8 8 0 0 1 1.4-3.4L3.7 5.8l1.4-1.4 1.8 1.8A8 8 0 0 1 11 4.1zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/></svg>'
};
// portrait spec: {img:key} | {url} | {icon:key}
function icoHTML(p,cls='',size){const st=size?`style="width:${size}px;height:${size}px"`:'';if(p&&p.url)return`<span class="ico ${cls}" ${st}><img src="${esc(p.url)}" alt=""></span>`;
  if(p&&p.img&&typeof IMG!=='undefined'&&IMG[p.img])return`<span class="ico ${cls}" ${st}><img src="${IMG[p.img]}" alt=""></span>`;
  if(p&&p.initials){const sz=size?`width:${size}px;height:${size}px;`:'';return`<span class="ico ini ${cls}" style="${sz}background:hsl(${p.hue||200},45%,32%);font-size:${size?Math.round(size*.38):18}px">${esc(p.initials)}</span>`}
  return`<span class="ico ${cls}" ${st}>${SVG[(p&&p.icon)||'wheel']||SVG.wheel}</span>`}
const BUILTIN_NPC={carrot:{img:'mink'},arlong:{img:'arlong'},chew:{img:'chew'},kuroobi:{img:'kuroobi'},hatchan:{img:'hatchan'}};
function npcSlug(n){return String(n||'npc').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'npc'}
function npcPortrait(name){const nm=String(name||'').toLowerCase().trim();const all=Object.values(typeof ST!=='undefined'?ST.npcs||{}:{});
  const hit=all.find(n=>n.portrait&&(n.name.toLowerCase()===nm||(n.aliases||[]).includes(nm)))||all.find(n=>n.portrait&&(nm.includes(n.name.toLowerCase())||n.name.toLowerCase().includes(nm)));if(hit)return hit.portrait;
  for(const [k,p] of Object.entries(BUILTIN_NPC))if(nm.split(/[^a-z]+/).includes(k))return p;
  if(typeof autoNpcPortrait==='function'){try{const a=autoNpcPortrait(name);if(a)return a}catch(e){}}
  let h=0;for(const ch of nm)h=(h*31+ch.charCodeAt(0))%360;const words=String(name||'?').replace(/^(old|doc|captain|the|mr\.?|mrs\.?)\s+/i,'').split(/\s+/).filter(Boolean);return{initials:(words.length>1?words[0][0]+words[1][0]:(words[0]||'?').slice(0,1)).toUpperCase(),hue:h}}

// ================= rules data (5e 2024 classes + Dungeons & Devil Fruits species) =================
const ABS=['STR','DEX','CON','INT','WIS','CHA'];
const ABN={STR:'Strength',DEX:'Dexterity',CON:'Constitution',INT:'Intelligence',WIS:'Wisdom',CHA:'Charisma'};
const SKILLS={'Acrobatics':'DEX','Animal Handling':'WIS','Arcana':'INT','Athletics':'STR','Deception':'CHA','History':'INT','Insight':'WIS','Intimidation':'CHA','Investigation':'INT','Medicine':'WIS','Nature':'INT','Perception':'WIS','Performance':'CHA','Persuasion':'CHA','Religion':'INT','Sleight of Hand':'DEX','Stealth':'DEX','Survival':'WIS'};
const STD_ARRAY=[15,14,13,12,10,8];
const SPECIES={
  human:{name:'Human',img:null,speed:30,traits:['Humans adapt to anything: pick Standard (+1 to every score) or Variant (+1 to two scores).'],
    subs:{standard:{name:'Standard',asi:{STR:1,DEX:1,CON:1,INT:1,WIS:1,CHA:1}},variant:{name:'Variant',pick:[1,1]}}},
  fishman:{name:'Fish-Man',img:'fishman',speed:30,swim:35,asi:{CON:1},skills:['Athletics'],
    traits:['Amphibious: breathe air and water.','Underwater Athlete: Athletics proficiency; no underwater combat penalties.','Adapted to the Sea: resistance to cold damage.','Ten times stronger than humans (lost if you eat a Devil Fruit).'],
    subs:{shark:{name:'Shark',asi:{STR:2},skills:['Intimidation'],natural:6,traits:['Apex Predator: Intimidation.','Bite: unarmed strikes deal 1d6 + STR piercing.']},
      manta:{name:'Manta Ray',asi:{DEX:2},skills:['Acrobatics'],swim:40,traits:['Underwater Acrobatics: Acrobatics, advantage on it underwater.','Sea Glide: swim 40 ft.']},
      octopus:{name:'Octopus',asi:{STR:1,DEX:1},skills:['Sleight of Hand'],traits:['Multi-Armed: six arms, advantage on grapple checks.','Deadly Precision: Sleight of Hand.']},
      smelt:{name:'Smelt-Whiting',asi:{CHA:2},skillPick:['Deception','Persuasion'],hydro:true,traits:['Big-Mouthed: Deception or Persuasion.','Hydro Cannon (PHB): shoot concentrated blasts of water from your mouth. You can cast Ray of Frost with it at will (ranged spell attack, 60 ft, 1d8 cold, 2d8 from level 5), and from level 3 Ice Knife once per long rest. Charisma is your spellcasting ability.']}}},
  merfolk:{name:'Merfolk',img:'merfolk',speed:10,swim:50,asi:{DEX:1,WIS:1,CHA:1},
    traits:['Amphibious: breathe air and water.','Merfolk Training: spear, trident and net.','Merfolk Combat: bend water to strike foes (the DM rules the details).','Adapted to the Sea: resistance to cold damage.','Speak simple ideas with sea beasts.'],
    subs:{tail:{name:'Tail (under 30)',traits:['Walking speed 10 ft on land, swim 50 ft.']},split:{name:'Split tail (30+)',speed:30,traits:['Your tail has split: walking speed 30 ft.']}}},
  sky:{name:'Sky Islander',img:'sky',speed:30,asi:{DEX:1},traits:['Protection of the Clouds: slow your fall once per short rest.','Dial Proficiency: you carry one dial (the DM rolls on the Simple Dial table).'],
    subs:{shandian:{name:'Shandian',asi:{STR:2},traits:['Shandian Weapon Training: quarterstaff, halberd, pike, glaive, spear and heavy firearms.']},
      birkan:{name:'Birkan',asi:{WIS:2},traits:['Mantra Specialist: may train Observation Haki when the story allows.']},
      skypiean:{name:'Skypiean',asi:{INT:2},traits:['Advanced Dial Proficiency: a second dial, advantage on checks to find dials.']}}},
  mink:{name:'Mink',img:'mink',speed:30,climb:20,asi:{STR:1,DEX:1,WIS:1},skills:['Perception','Stealth'],natural:6,electro:true,
    traits:['Darkvision 60 ft.','Beast\'s Slash: climb 20 ft; unarmed strikes deal at least 1d6 slashing.','Animal Instinct: Perception and Stealth.','Electro: shocking touch, 1d8 lightning (WIS); resistance to lightning.','Sulong (level 3+): once per long rest, a 1-minute transformation.']},
  yokai:{name:'Yokai Tribe',img:null,speed:30,asi:{CHA:1},skills:['Intimidation','Persuasion'],traits:['Tribal Charisma: Intimidation and Persuasion.','Crafty: one tool or instrument.'],
    subs:{longleg:{name:'Longleg',asi:{DEX:2},speed:35,stride:true,traits:['Longleg Stride: once, double your speed for a turn (recharges after a turn without moving).']},
      longarm:{name:'Longarm',asi:{STR:2},reach:1,traits:['Long-Limbed: +5 ft reach on your melee attacks.']},
      snakeneck:{name:'Snakeneck',asi:{INT:2},skills:['Perception'],initProf:true,img:'longneck',traits:['Quick Reflexes: add your proficiency bonus to initiative.','Serpentine Senses: Perception.']},
      threeeye:{name:'Three-Eye',asi:{WIS:2},traits:['Darkvision 60 ft and blindsight 10 ft.']}}},
  cyborg:{name:'Cyborg',img:null,speed:30,asi:{CON:2},pick:[1],ac:1,traits:['Steel Skin: +1 AC.']}
};
const CLASSES={
  barbarian:{name:'Barbarian',hd:12,icon:'axe',saves:['STR','CON'],pick:2,list:['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'],weapons:['greataxe','handaxe'],armor:'bar'},
  fighter:{name:'Fighter',hd:10,icon:'sword',saves:['STR','CON'],pick:2,list:['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Persuasion','Perception','Survival'],weapons:['longsword','greatsword','pistol'],armor:'chain'},
  monk:{name:'Monk',hd:8,icon:'fist',saves:['STR','DEX'],pick:2,list:['Acrobatics','Athletics','History','Insight','Religion','Stealth'],weapons:['unarmed','quarterstaff'],armor:'monk'},
  rogue:{name:'Rogue',hd:8,icon:'dagger',saves:['DEX','INT'],pick:4,list:['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Persuasion','Sleight of Hand','Stealth'],weapons:['rapier','shortbow'],armor:'leather',expertise:2}
};
const WDTYPE={greataxe:'slashing',handaxe:'slashing',longsword:'slashing',greatsword:'slashing',pistol:'piercing',unarmed:'bludgeoning',quarterstaff:'bludgeoning',rapier:'piercing',shortbow:'piercing',dagger:'piercing',cutlass:'slashing'};
const WEAPONS={
  greataxe:{name:'Greataxe',n:1,d:12,abil:'STR',reach:1,icon:'axe',note:'heavy, two-handed'},
  handaxe:{name:'Handaxe',n:1,d:6,abil:'STR',reach:1,icon:'axe',note:'light'},
  longsword:{name:'Longsword + shield',n:1,d:8,abil:'STR',reach:1,flat:2,shield:2,icon:'sword',note:'Dueling style: +2 damage; shield +2 AC'},
  greatsword:{name:'Greatsword',n:2,d:6,abil:'STR',reach:1,gwf:true,icon:'sword',note:'Great Weapon Fighting: 1s and 2s count as 3'},
  pistol:{name:'Flintlock pistol',n:1,d:10,abil:'DEX',range:[6,18],hit:2,icon:'pistol',armor:'studded',note:'Gunslinger: +2 to hit with firearms, range 30/90 ft'},
  unarmed:{name:'Unarmed strike',n:1,d:6,abil:'MA',reach:1,icon:'fist',note:'Martial Arts die'},
  quarterstaff:{name:'Quarterstaff',n:1,d:8,abil:'MA',reach:1,icon:'staff',note:'monk weapon'},
  rapier:{name:'Rapier',n:1,d:8,abil:'FIN',reach:1,finesse:true,icon:'dagger',note:'finesse'},
  dagger:{name:'Dagger',n:1,d:4,abil:'FIN',reach:1,finesse:true,icon:'dagger',note:'finesse, light'},
  cutlass:{name:'Cutlass',n:1,d:6,abil:'FIN',reach:1,finesse:true,icon:'sword',note:'finesse, light (scimitar)'},
  shortbow:{name:'Shortbow',n:1,d:6,abil:'DEX',range:[16,64],finesse:true,icon:'bow',note:'range 80/320 ft'}
};
const FEATS={
  alert:{name:'Alert',desc:'Add your proficiency bonus to initiative.'},
  lucky:{name:'Lucky',desc:'Luck points equal to your proficiency bonus per long rest. Spend one to roll a d20 with advantage.'},
  tough:{name:'Tough',desc:'+2 max HP per level.'},
  savage:{name:'Savage Attacker',desc:'Once per turn, roll a weapon\'s damage dice twice and use the higher.'},
  skilled:{name:'Skilled',desc:'Proficiency in 3 more skills.'},
  tavern:{name:'Tavern Brawler',desc:'Unarmed strikes deal 1d4 + STR, and you reroll 1s on their damage.'}
};
const ISLANDS=[{k:'Diminutive',die:20,dc:10},{k:'Tiny',die:12,dc:12},{k:'Small',die:10,dc:14},{k:'Medium',die:8,dc:16},{k:'Large',die:6,dc:18},{k:'Colossal',die:4,dc:20}];
const UNCOMMON=["Mini Mini no Mi (Shrinking)","Bara Bara no Mi (Dividing)","Sube Sube no Mi (Smooth)","Toge Toge no Mi (Spikes)","Bane Bane no Mi (Springs)","Doa Doa no Mi (Door)","Awa Awa no Mi (Bubble)","Shari Shari no Mi (Wheel)","Beri Beri no Mi (Orb)","Woshu Woshu no Mi (Wash)","Mato Mato no Mi (Mark)","Guru Guru no Mi (Spin)","Nui Nui no Mi (Sewing)","Trashu Trashu no Mi (Trash)","Bri Bri no Mi (Brightness)","Tendri Tendri no Mi (Tendrils)","Splito Splito no Mi (Split)","Naku Naku no Mi (Crying)","Wrapu Wrapu no Mi (Wrapping)","Chizu Chizu no Mi (Cheese)","Jake Jake no Mi (Jacket)","Nagi Nagi no Mi (Silence)","Bisu Bisu no Mi (Biscuit)","Bata Bata no Mi (Butter)","Kuri Kuri no Mi (Cream)","Shibo Shibo no Mi (Wring)","Diggu Diggu no Mi (Dig)","Juku Juku no Mi (Maturing)","Kachi Kachi no Mi (Hard)","Nemu Nemu no Mi (Sleep)","Kyubu Kyubu no Mi (Cube)","Ropu Ropu no Mi (Rope)","Pottu Pottu no Mi (Pot)","Tsuri Tsuri no Mi (Fishing)","Choco Choco no Mi (Chocolate)","Poke Poke no Mi (Pocket)","Jingu Jingu no Mi (Jingle)","Kutsu Kutsu no Mi (Shoe)","Mane Mane no Mi (Imitation)","Maki Maki no Mi (Scroll)","Hira Hira no Mi (Flag)","Jigu Jigu no Mi (Jiggle)","Daicu Daicu no Mi (Dice)","Lardu Lardu no Mi (Lard)","Bottu Bottu no Mi (Bottle)","Dimmu Dimmu no Mi (Dimming)","Dullu Dullu no Mi (Dulling)","Dansu Dansu no Mi (Dancing)","Stinku Stinku no Mi (Stink)","Kosui Kosui no Mi (Perfume)","Boxu Boxu no Mi (Box)","Haku Haku no Mi (Vomit)","Kagi Kagi no Mi (Key)","Ikari Ikari no Mi (Anger)","Rubbu Rubbu no Mi (Friction)","Garas Garas no Mi (Glass)","Warau Warau no Mi (Laughter)","Kiku Kiku no Mi (Hearing)","Snapu Snapu no Mi (Snapping)","Inu Inu no Mi, Model: Dalmation","Hebi Hebi no Mi, Model: Lizard","Ushi Ushi no Mi, Model: Pig","Ushi Ushi no Mi, Model: Cow","Uma Uma no Mi, Model: Pony","Hito Hito no Mi, Model: Human","Uma Uma no Mi, Model: Camel","Nezu Nezu no Mi, Model: Rat","Kani Kani no Mi, Model: Crab","Yagi Yagi no Mi, Model: Deer","Guwa Guwa no Mi, Model: Frog","Kumo Kumo no Mi, Model: Wolf Spider","Mushi Mushi no Mi, Model: Millipede","Ushi Ushi no Mi, Model: Rothe","Guma Guma no Mi, Model: Honey Badger","Hebi Hebi no Mi, Model: Mamba","Guma Guma no Mi, Model: Weasel","Yagi Yagi no Mi, Model: Goat","Tori Tori no Mi, Model: Axe Beak","Inu Inu no Mi, Model: Jackal","Uma Uma no Mi, Model: Horse","Shika Shika no Mi, Model: Elk","Uma Uma no Mi, Model: Mule","Neko Neko no Mi, Model: Cat","Inu Inu no Mi, Model: Chihuahua","Inu Inu no Mi, Model: Golden Retriever","Neko Neko no Mi, Model: Lynx","Sara Sara no Mi, Model: Axolotl","Neko Neko no Mi, Model: Panther","Nezu Nezu no Mi, Model: Porcupine","Kame Kame no Mi, Model: Turtle","Kani Kani no Mi, Model: Lobster","Mushi Mushi no Mi, Model: Ant","Ushi Ushi no Mi, Model: Ox","Buta Buta no Mi Model: Boar","Guma Guma no Mi, Model: Wolverine","Hebi Hebi no Mi, Model: Python","Yagi Yagi no Mi, Model: Sheep","Ushi Ushi no Mi, Model: Stench Kow","Hebi Hebi no Mi, Model: Boa","Uma Uma no Mi, Model: Zebra"];
// foes: a=[attacks, dice, die, flat]; sp=[name, dice, die, flat, DC, save, everyNthRound, rangeSquares]
const FOES={
  grunt:{swim:true,name:'Fish-Man Grunt',icon:'anchor',hp:11,ac:12,atk:4,a:[1,1,8,2],wpn:'spear',reach:1,speed:6,dex:1,dt:'piercing',desc:'rank-and-file fish-man of the Arlong Pirates'},
  thug:{name:'Pirate Thug',icon:'skull',hp:9,ac:11,atk:3,a:[1,1,6,1],wpn:'cutlass',reach:1,speed:6,dex:1,dt:'slashing',desc:'human pirate, weak'},
  marine:{name:'Marine Private',icon:'flag',hp:11,ac:14,atk:3,a:[1,1,10,1],wpn:'musket',range:[8,24],speed:6,dex:1,dt:'piercing',desc:'navy soldier with a musket'},
  chew:{swim:true,name:'Chew',img:'chew',hp:30,ac:13,atk:5,a:[1,2,6,1],wpn:'Water Gun',range:[12,24],speed:6,dex:2,sp:['Hundred-Shot Water Gun',3,6,0,13,'DEX',3,3,1],dt:'bludgeoning',spdt:'bludgeoning',desc:'Arlong officer, fish-man who spits water like bullets'},
  kuroobi:{swim:true,name:'Kuroobi',img:'kuroobi',hp:34,ac:14,atk:5,a:[2,1,6,3],wpn:'Fish-Man Karate',reach:1,speed:6,dex:2,sp:['Thousand-Tile Fist',2,8,3,13,'CON',3,1],dt:'bludgeoning',spdt:'bludgeoning',desc:'Arlong officer, manta-ray fish-man karate master'},
  hatchan:{swim:true,name:'Hatchan',img:'hatchan',hp:40,ac:13,atk:4,a:[3,1,6,2],wpn:'six swords',reach:1,speed:6,dex:1,sp:['Takoyaki Punch',3,6,2,13,'DEX',4,1],dt:'slashing',spdt:'bludgeoning',desc:'Arlong officer, octopus fish-man with six swords, goofy'},
  arlong:{swim:true,name:'Arlong',img:'arlong',hp:68,ac:15,atk:6,a:[2,1,10,4],wpn:'Kiribachi',reach:1,speed:6,dex:2,sp:['Shark on Darts',4,8,0,14,'DEX',3,6],dt:'slashing',spdt:'piercing',desc:'captain, saw-shark fish-man, final boss of the East Blue arc'}
};
function foeDmgText(f){const [n,dn,die,fl]=f.a;return`${n>1?n+'× ':''}${dn}d${die}+${fl} ${f.wpn}${f.range?` (range ${f.range[0]*5}/${f.range[1]*5} ft)`:''}`}
function foeSpText(f){if(!f.sp)return'';const [nm,n,die,fl,dc,sv,ev]=f.sp;return`Every ${ev}${ev===3?'rd':'th'} round: ${nm}, ${n}d${die}${fl?'+'+fl:''}, ${sv} save DC ${dc} for half`}
// crew allies: NPCs who travel with the crew fight beside them (host runs their turns)
const ALLIES={carrot:{name:'Carrot',img:'mink',hp:22,ac:14,atk:5,a:[2,1,6,3],wpn:'claws',speed:7,dex:3,electro:[1,8],desc:'Mink warrior: two claw attacks, one Electro burst per fight'}};
const ALLY_DEFAULT={hp:16,ac:13,atk:4,a:[1,1,8,2],wpn:'weapon',speed:6,dex:1};
function allyStats(npc){const k=npcSlug(npc.name);return{...ALLY_DEFAULT,...(ALLIES[k]||{}),name:npc.name}}
const NPCS={carrot:{name:'Carrot',img:'mink'},gessa:{name:'Old Gessa',icon:'star'},pell:{name:'Doc Pell',icon:'star'}};
const SCENES={home:{name:'Home island · the old lighthouse'},deck:{name:'At sea · the storm'},village:{name:'Kelpmoor Village · the square'},canal:{name:'Arlong Park · the sea canal'},gate:{name:'Arlong Park · gate & courtyard'},throne:{name:'Arlong Park · the coral throne'}};
const ROUTE=[
  ['Home island','Gessa: Persuasion DC 12 → rumor (advantage on hunt). Fruit hunt: island die + Survival/Investigation vs island DC; 25% already taken; fruit from the d100 Uncommon table.','home'],
  ['The storm','Athletics or Acrobatics DC 13. Fail: 1d6. Fruit user overboard: DEX save DC 12 or 2d6.','deck'],
  ['Kelpmoor','Carrot joins for some food or Persuasion DC 13. Tribute collectors: 2 Fish-Man Grunts. Win → level 2.','village'],
  ['Into Arlong Park','Canal: Stealth DC 13 → ambush Chew. Gate: Intimidation DC 13 → Kuroobi shaken. Win → level 3.','canal'],
  ['Courtyard','Hatchan. Behind his stand: the tribute vault (฿30,000,000 and a stored Devil Fruit).','gate'],
  ['The throne','Long rest first. Arlong. Haki may awaken at a dramatic moment.','throne']
];

// ================= derived stats with breakdowns =================
// parts: [[label, value], ...]; shown as "CHA +1 · Proficiency +2"
const partsText=p=>p.filter(x=>x[1]!==0||x[2]).map(x=>`${x[0]} ${fmt(x[1])}`).join(' + ')||'+0';
const partsSum=p=>sum(p.map(x=>x[1]));
function defaultBuild(){return{name:'',species:'human',sub:'standard',asiPicks:[],cls:'fighter',weapon:'longsword',level:1,method:'array',pool:STD_ARRAY.slice(),scores:{STR:15,DEX:14,CON:13,INT:12,WIS:10,CHA:8},classSkills:[],bgSkills:[],speciesPick:null,expertise:[],feat:'tough',featSkills:[],portrait:null}}
function speciesSkills(b){const sp=SPECIES[b.species]||SPECIES.human;const sub=sp.subs?sp.subs[b.sub]:null;const s=[...(sp.skills||[]),...((sub&&sub.skills)||[])];if(sub&&sub.skillPick&&b.speciesPick&&sub.skillPick.includes(b.speciesPick))s.push(b.speciesPick);return[...new Set(s)]}
function asiOf(b){const sp=SPECIES[b.species]||SPECIES.human;const sub=sp.subs?sp.subs[b.sub]:null;const out={};const src=[];
  const add=(o,label)=>{for(const k in o){out[k]=(out[k]||0)+o[k];src.push([k,o[k],label])}};
  if(sp.asi)add(sp.asi,sp.name);if(sub&&sub.asi)add(sub.asi,sub.name);
  const picks=[...(sp.pick||[]),...((sub&&sub.pick)||[])];picks.forEach((v,i)=>{const a=(b.asiPicks||[])[i];if(a&&ABS.includes(a)){out[a]=(out[a]||0)+v;src.push([a,v,'your choice'])}});
  return{out,src,picks}}
function derive(b){
  const sp=SPECIES[b.species]||SPECIES.human;const sub=sp.subs?sp.subs[b.sub]:null;const cl=CLASSES[b.cls]||CLASSES.fighter;const w=WEAPONS[b.weapon]||WEAPONS[cl.weapons[0]];
  const lvl=Math.max(1,Math.min(20,b.level||1));const prof=2+Math.floor((lvl-1)/4);
  const {out:asi}=asiOf(b);const ab={},abBase={};for(const a of ABS){abBase[a]=(b.scores||{})[a]||10;ab[a]=Math.min(20,abBase[a]+(asi[a]||0))}
  const asiLvl={};const addAsi=o=>{for(const [a,v] of Object.entries(o||{}))if(ABS.includes(a)&&+v){ab[a]=Math.min(20,ab[a]+(+v));asiLvl[a]=(asiLvl[a]||0)+(+v)}};addAsi(b.asi4);for(const [L,o] of Object.entries(b.asiLv||{}))if(+L<=lvl)addAsi(o);
  const M=a=>mod(ab[a]);
  const profSkills=new Set([...speciesSkills(b),...(b.classSkills||[]),...(b.bgSkills||[]),...(b.feat==='skilled'?(b.featSkills||[]):[]),...(b.extraSkills||[]),...(b.feat4==='skilled'?(b.feat4Skills||[]):[]),...Object.entries(b.featLv||{}).filter(([L,k])=>+L<=lvl&&k==='skilled').flatMap(([L])=>(b.featLvSkills||{})[L]||[])]);
  const exp=new Set([...(b.expertise||[]),...(lvl>=6?(b.expertise6||[]):[])].filter(s=>profSkills.has(s)));
  const skills={};for(const [s,a] of Object.entries(SKILLS)){const p=[[a,M(a)]];if(profSkills.has(s))p.push(['Proficiency',prof]);if(exp.has(s))p.push(['Expertise',prof]);skills[s]={ab:a,parts:p,bonus:partsSum(p),prof:profSkills.has(s),exp:exp.has(s)}}
  const saves={};for(const a of ABS){const p=[[a,M(a)]];if(cl.saves.includes(a))p.push(['Proficiency',prof]);saves[a]={parts:p,bonus:partsSum(p),prof:cl.saves.includes(a)}}
  const feat=b.fruitAte?null:b.feat;const feat4=b.feat4||null;const featsLv=Object.entries(b.featLv||{}).filter(([L])=>+L<=lvl).map(([,k])=>k);const hasF=k=>feat===k||feat4===k||featsLv.includes(k);const sc=subclassOf(b);
  // HP
  const con=M('CON');const hpParts=[[`Level 1: d${cl.hd} max`,cl.hd]];{let rest=0;const rolls=[];for(let L=2;L<=lvl;L++){const r=(b.hpRolls&&b.hpRolls[L])||(cl.hd/2+1);rest+=r;rolls.push(r)}if(lvl>1)hpParts.push([`Levels 2-${lvl} hit dice (${rolls.join(' + ')})`,rest])}hpParts.push([`CON × ${lvl}`,con*lvl]);if(hasF('tough'))hpParts.push(['Tough',2*lvl]);
  const maxhp=Math.max(1,partsSum(hpParts));
  // AC
  let armor=w.armor||cl.armor;if(b.armor){armor=b.armor==='none'?((cl.armor==='bar'||cl.armor==='monk')?cl.armor:'none'):b.armor}const acParts=[];
  if(armor==='bar'){acParts.push(['Unarmored Defense 10',10],['DEX',M('DEX')],['CON',M('CON')])}
  else if(armor==='monk'){acParts.push(['Unarmored Defense 10',10],['DEX',M('DEX')],['WIS',M('WIS')])}
  else if(armor==='chain'){acParts.push(['Chain mail',16])}
  else if(armor==='studded'){acParts.push(['Studded leather 12',12],['DEX',M('DEX')])}
  else if(armor==='none'){acParts.push(['No armor 10',10],['DEX',M('DEX')])}
  else{acParts.push(['Leather armor 11',11],['DEX',M('DEX')])}
  if(w.shield)acParts.push(['Shield',2]);if(sp.ac)acParts.push(['Steel Skin',sp.ac]);
  const ac=partsSum(acParts);
  // weapon
  let abil=w.abil;if(abil==='MA'&&b.cls!=='monk')abil='STR';if(abil==='MA'||abil==='FIN')abil=M('DEX')>=M('STR')?'DEX':'STR';
  let die=w.d,n=w.n,dieNote='';
  if(b.cls==='monk'&&(w.abil==='MA')){const md=lvl>=5?8:6;if(md>die||b.weapon==='unarmed'){die=Math.max(die,md);dieNote='Martial Arts die'}}
  if(b.weapon==='unarmed'&&b.cls!=='monk'){die=1;dieNote='unarmed: 1 + STR'}
  if(b.weapon==='unarmed'){const nat=sp.natural||(sub&&sub.natural)||0;if(hasF('tavern')&&die<4)die=4;if(nat>die){die=nat;dieNote=sp.name+' natural weapon'}}
  const atkParts=[[abil,M(abil)],['Proficiency',prof]];if(w.hit)atkParts.push(['Gunslinger',w.hit]);
  const dmgParts=[[abil,M(abil)]];if(w.flat)dmgParts.push(['Dueling',w.flat]);
  const reach=(w.reach||0)+((sub&&sub.reach)||0);
  const attacks=(lvl>=5&&['barbarian','fighter','monk'].includes(b.cls))?2:1;
  const initParts=[['DEX',M('DEX')]];if(hasF('alert'))initParts.push(['Alert',prof]);if(sub&&sub.initProf)initParts.push(['Quick Reflexes',prof]);
  const speed=((sub&&sub.speed)||sp.speed)+(b.cls==='monk'?(lvl>=10?20:lvl>=6?15:lvl>=2?10:0):0)+(b.cls==='barbarian'&&lvl>=5?10:0);
  const res={};if(b.cls==='barbarian')res.rage={name:'Rage',max:lvl>=6?4:lvl>=3?3:2,rest:'long'};
  if(b.cls==='fighter'){res.wind={name:'Second Wind',max:lvl>=10?4:lvl>=4?3:2,rest:'short*'};if(lvl>=9)res.indom={name:'Indomitable',max:1,rest:'long'};if(lvl>=2)res.surge={name:'Action Surge',max:1,rest:'short'}}
  if(b.cls==='monk'&&lvl>=2)res.focus={name:'Focus points',max:lvl,rest:'short'};
  if(sc&&sc.key==='battlemaster')res.sup={name:`Superiority dice (d${lvl>=10?10:8})`,max:lvl>=7?5:4,rest:'short'};
  if(hasF('lucky'))res.luck={name:'Luck points',max:prof,rest:'long'};
  if(sp.electro)res.electro={name:'Electro',max:99,rest:'none',hidden:true};
  if(sub&&sub.stride)res.stride={name:'Longleg Stride',max:1,rest:'turn'};
  if(b.species==='mink'&&lvl>=3)res.sulong={name:'Sulong',max:1,rest:'long'};
  const sneak=b.cls==='rogue'?Math.ceil(lvl/2):0;
  const feats=[];
  if(b.cls==='barbarian'){feats.push(['Rage','Bonus action. While raging: +2 damage with STR attacks, resistance to bludgeoning, piercing and slashing damage, advantage on STR checks and saves.'],['Unarmored Defense','AC = 10 + DEX + CON.']);if(lvl>=2)feats.push(['Reckless Attack','On your first attack: advantage on STR attacks this turn; attacks against you have advantage until your next turn.'],['Danger Sense','Advantage on DEX saves.']);if(lvl>=5)feats.push(['Extra Attack','Attack twice with the Attack action.'],['Fast Movement','+10 ft speed.']);if(lvl>=7)feats.push(['Feral Instinct','Advantage on initiative.'],['Instinctive Pounce','When you Rage, move half your speed.']);if(lvl>=9)feats.push(['Brutal Strike','When you use Reckless Attack while raging, your first hit each turn deals an extra 1d10.'])}
  if(b.cls==='fighter'){feats.push(['Fighting style',w.note],['Second Wind','Bonus action: regain 1d10 + level HP.']);if(lvl>=2)feats.push(['Action Surge','Take one extra action on your turn.']);if(lvl>=5)feats.push(['Extra Attack','Attack twice with the Attack action.']);if(lvl>=9)feats.push(['Indomitable','Once per long rest, reroll a failed saving throw (bonus = your level).'],['Tactical Master','Your weapon tricks are deadlier.'])}
  if(b.cls==='monk'){feats.push(['Martial Arts',`Unarmed strikes and monk weapons use DEX and a d${lvl>=5?8:6}. After the Attack action, make one unarmed strike as a bonus action.`],['Unarmored Defense','AC = 10 + DEX + WIS.']);if(lvl>=2)feats.push(['Flurry of Blows','1 focus, bonus action: two unarmed strikes.'],['Patient Defense / Step of the Wind','Disengage or Dash as a bonus action (Dodge or both for 1 focus).']);if(lvl>=5)feats.push(['Extra Attack','Attack twice with the Attack action.']);if(lvl>=6)feats.push(['Empowered Strikes','Your unarmed strikes deal force damage: they hit Logia users and smoke at full power.']);if(lvl>=7)feats.push(['Evasion','DEX save for half damage: success takes none, failure only half.']);if(lvl>=10)feats.push(['Self-Restoration','Shake off being frightened at the end of your turn.'])}
  if(b.cls==='rogue'){feats.push(['Sneak Attack',`Once per turn, +${sneak}d6 with a finesse or ranged weapon if you have advantage or an ally is next to the target.`],['Expertise','Double proficiency in two skills.']);if(lvl>=2)feats.push(['Cunning Action','Dash, Disengage or Hide as a bonus action.']);if(lvl>=3)feats.push(['Steady Aim','Bonus action if you have not moved: advantage on your next attack, then you cannot move this turn.']);if(lvl>=5)feats.push(['Uncanny Dodge','Reaction: halve damage from an attack you can see.']);if(lvl>=6)feats.push(['Expertise (more)','Two more skills with Expertise.']);if(lvl>=7)feats.push(['Evasion','DEX save for half damage: success takes none, failure only half.'],['Reliable Talent','On proficient checks, a d20 under 10 counts as 10.'])}
  if(sc)for(const f of sc.feats)feats.push([f[0]+' ('+sc.name+')',f[1]]);
  if(feat)feats.push([FEATS[feat].name+' (origin feat)',FEATS[feat].desc]);if(feat4)feats.push([FEATS[feat4].name+' (level 4 feat)',FEATS[feat4].desc]);for(const [L,k] of Object.entries(b.featLv||{}))if(+L<=lvl&&FEATS[k])feats.push([FEATS[k].name+` (level ${L} feat)`,FEATS[k].desc]);if(Object.keys(asiLvl).length)feats.push(['Ability Score Improvement',Object.entries(asiLvl).map(([a,v])=>a+' +'+v).join(', ')+' (from level-ups)']);
  if(b.fruitAte)feats.push(['Devil Fruit user','You ate a Devil Fruit: origin feat given up, you cannot swim, seawater weakens you.']);
  const traits=[...(sp.traits||[]),...((sub&&sub.traits)||[])];
  const icon=(b.portrait)||(sub&&sub.img?{img:sub.img}:sp.img?{img:sp.img}:{icon:cl.icon});
  const evasion=(['rogue','monk'].includes(b.cls)&&lvl>=7);const forceUnarmed=b.cls==='monk'&&lvl>=6;const feralInit=b.cls==='barbarian'&&lvl>=7;const brutal=b.cls==='barbarian'&&lvl>=9;
  return{evasion,forceUnarmed,feralInit,brutal,lvl,prof,ab,abBase,asi,skills,saves,maxhp,hpParts,ac,acParts,weapon:w,abil,die,n,dieNote,atkParts,atk:partsSum(atkParts),dmgParts,dmgMod:partsSum(dmgParts),reach,ranged:!!w.range,range:w.range,attacks,initParts,init:partsSum(initParts),speed,res,sneak,feats,traits,feat,hasF,critMin:sc&&sc.key==='champion'?19:20,frenzy:!!(sc&&sc.key==='berserker'),subclass:sc,asiLvl,icon,clsIcon:cl.icon,speciesName:sp.name+(sub?` (${sub.name})`:''),clsName:cl.name+(b.weapon==='pistol'?' (Gunslinger)':'')}
}
// starting equipment (D&D 2024 style kit + a little One Piece flavour)
function startingGear(b){const cl=b.cls;const w=WEAPONS[b.weapon]||{};const g=[{name:w.name||'Weapon',qty:1,tag:'weapon'}];
  const armor={chain:'Chain mail',studded:'Studded leather armor',leather:'Leather armor'}[w.armor||CLASSES[cl].armor];if(armor)g.push({name:armor,qty:1,tag:'armor'});
  if(b.weapon==='pistol')g.push({name:'Bullets and powder',qty:20,tag:'ammo'});if(b.weapon==='shortbow')g.push({name:'Arrows',qty:20,tag:'ammo'});
  if(cl==='barbarian'&&b.weapon!=='handaxe')g.push({name:'Handaxe',qty:4,tag:'weapon'});
  if(cl==='rogue')g.push({name:'Dagger',qty:2,tag:'weapon'},{name:"Thieves' tools",qty:1,tag:'tool'});
  if(cl==='monk')g.push({name:'Dart',qty:10,tag:'weapon'});
  g.push({name:'Backpack',qty:1,tag:'gear'},{name:'Bedroll',qty:1,tag:'gear'},{name:'Rations (days)',qty:10,tag:'food'},{name:'Waterskin',qty:1,tag:'gear'},{name:'Rope (50 ft)',qty:1,tag:'gear'},{name:'Torch',qty:10,tag:'gear'},{name:'Tinderbox',qty:1,tag:'gear'},{name:'Meat on the bone',qty:2,tag:'food'});
  return g}
function invOf(c){return Array.isArray(c.inv)?c.inv:startingGear(c.build)}
const INVICON={weapon:'⚔',armor:'🛡',ammo:'•',tool:'⚒',food:'🍖',gear:'🎒',treasure:'💰',fruit:'🍇'};
function validateBuild(b){const errs=[];const cl=CLASSES[b.cls];const sp=SPECIES[b.species];const sub=sp.subs?sp.subs[b.sub]:null;
  if(!String(b.name||'').trim())errs.push('Give your character a name.');
  if(sp.subs&&!sub)errs.push('Pick a '+sp.name+' subrace.');
  const {picks}=asiOf(b);for(let i=0;i<picks.length;i++)if(!(b.asiPicks||[])[i])errs.push('Choose where your species\' ability increase goes.');
  if(new Set((b.asiPicks||[]).slice(0,picks.length)).size<picks.length)errs.push('Species increases must go to different abilities.');
  if(sub&&sub.skillPick&&!b.speciesPick)errs.push('Choose your '+sub.name+' skill.');
  if((b.classSkills||[]).length!==cl.pick)errs.push(`Choose ${cl.pick} ${cl.name} skills.`);
  if((b.bgSkills||[]).length!==2)errs.push('Choose 2 background skills.');
  if(cl.expertise&&(b.expertise||[]).length!==cl.expertise)errs.push(`Choose ${cl.expertise} Expertise skills.`);
  if(b.feat==='skilled'&&(b.featSkills||[]).length!==3)errs.push('Choose 3 skills for Skilled.');
  return errs}

// ================= level-up data: plain-language features per class and level =================
// [name, what it does, when to use it, icon]
const ASI_FEAT=['Ability Score Improvement','Raise one ability by 2 or two abilities by 1 (max 20), or take a feat instead.','Pick it in the next step. Raising your main ability makes you hit more often and harder.','star'];
const LEVEL_FEATS={
  barbarian:{
    2:[['Reckless Attack','When you attack, you can swing wildly: advantage on your Strength attacks this turn, but enemies get advantage on you until your next turn.','When you really need to hit and can take a few blows.','axe'],['Danger Sense','Advantage on Dexterity saving throws.','Works by itself: traps, explosions and water blasts are easier to dodge.','star']],
    3:[['Primal Knowledge','One more skill from the Barbarian list. While raging you can use Strength for Acrobatics, Intimidation, Perception, Stealth and Survival.','Pick the skill in the next step.','star'],['Barbarian Path','Choose what kind of warrior you are.','Pick it in the next step.','axe'],['Rage: 3 uses','You can now Rage three times per long rest.','Rage at the start of every serious fight.','axe']],
    4:[ASI_FEAT],
    5:[['Extra Attack','You attack twice whenever you take the Attack action.','Every turn: press Attack twice.','axe'],['Fast Movement','+10 ft speed.','Works by itself.','star']],
    6:[['Path feature: Mindless Rage','While raging, you cannot be frightened or charmed.','Works by itself.','axe'],['Rage: 4 uses','You can Rage four times per long rest.','Works by itself.','axe']],
    7:[['Feral Instinct','Advantage on initiative rolls.','Works by itself: you act first more often.','star'],['Instinctive Pounce','When you Rage, you can move half your speed for free.','Rage at the start of a fight to close in.','axe']],
    8:[ASI_FEAT],
    9:[['Brutal Strike','When you use Reckless Attack while raging, your first hit each turn deals an extra 1d10.','Rage plus Reckless Attack every turn against tough enemies.','axe'],['Proficiency bonus +4','Every proficient attack, save and skill gets +1.','Works by itself.','star']],
    10:[['Path feature: Intimidating Presence','Action: frighten enemies around you (as a Conqueror-lite roar).','Use the "Something else" box and describe the roar.','skull']]},
  fighter:{
    2:[['Action Surge','Once per short rest, take a whole extra action on your turn: attack again, Dash, anything.','Save it for the boss or a desperate moment.','sword'],['Tactical Mind','When you fail an ability check, spend a Second Wind use to add 1d10 to it.','Turn a failed climb or persuasion into a success.','star']],
    3:[['Fighter Archetype','Choose your fighting style for the rest of the adventure.','Pick it in the next step.','sword']],
    4:[ASI_FEAT],
    5:[['Extra Attack','You attack twice whenever you take the Attack action.','Every turn: press Attack twice.','sword'],['Tactical Shift','When you use Second Wind, you can move half your speed without opportunity attacks.','Get out when you are surrounded.','star']],
    6:[ASI_FEAT],
    7:[['Archetype feature','Champion: a second fighting style. Battle Master: 5 superiority dice and you can size up enemies.','Works by itself.','sword']],
    8:[ASI_FEAT],
    9:[['Indomitable','Once per long rest, reroll a failed saving throw and add your level.','When a big effect would knock you out of the fight.','star'],['Tactical Master','Your weapon tricks (push, slow, sap) get better.','Describe them in "Something else".','sword'],['Proficiency bonus +4','Every proficient attack, save and skill gets +1.','Works by itself.','star']],
    10:[['Archetype feature','Champion: Heroic Warrior (you always have heroic inspiration in fights). Battle Master: d10 superiority dice.','Works by itself.','sword'],['Second Wind: 4 uses','Four uses of Second Wind.','Heal more often.','star']]},
  monk:{
    2:[['Focus points','Points equal to your level, back after a short rest. You spend them on the moves below.','Watch the pips on your sheet.','fist'],['Flurry of Blows','1 focus, bonus action: two unarmed strikes instead of one.','When you want maximum damage this turn.','fist'],['Patient Defense','Bonus action: Disengage for free, or Disengage and Dodge for 1 focus.','Slip out of a crowd of enemies.','star'],['Step of the Wind','1 focus: Dash as a bonus action.','Cross the battlefield in one turn.','star'],['Unarmored Movement','+10 ft speed.','Works by itself.','star']],
    3:[['Deflect Attacks','Reaction: when a weapon hits you, reduce the damage by 1d10 + DEX + your level.','Tell the table when a big hit lands on you.','fist'],['Monk Tradition','Choose your martial school.','Pick it in the next step.','fist']],
    4:[ASI_FEAT,['Slow Fall','Reaction: take much less damage when you fall.','Works when you fall.','star']],
    5:[['Extra Attack','You attack twice whenever you take the Attack action.','Every turn.','fist'],['Stunning Strike','1 focus when you hit: the target makes a CON save or is stunned until your next turn.','Lock down the most dangerous enemy.','fist'],['Martial Arts d8','Your unarmed strikes now deal 1d8.','Works by itself.','fist']],
    6:[['Empowered Strikes','Your unarmed strikes deal force damage, so they hit Logia users like Smoker at full power.','Works by itself.','fist'],['Faster: +15 ft','Unarmored Movement goes up to +15 ft.','Works by itself.','star']],
    7:[['Evasion','When a DEX save would halve damage, you take none on a success and only half on a failure.','Works by itself against blasts and explosions.','star']],
    8:[ASI_FEAT],
    9:[['Acrobatic Movement','Run along walls and across water during your move.','Ignore the map edge of the canal: tell the DM.','star'],['Proficiency bonus +4','Every proficient attack, save and skill gets +1.','Works by itself.','star']],
    10:[['Heightened Focus','Flurry of Blows, Patient Defense and Step of the Wind get stronger.','Use them every fight.','fist'],['Self-Restoration','End being frightened or charmed at the end of your turn.','Works by itself.','star'],['Faster: +20 ft','Unarmored Movement goes up to +20 ft.','Works by itself.','star']]},
  rogue:{
    2:[['Cunning Action','Bonus action every turn: Dash, Disengage or Hide.','Hit, then hide again: the classic rogue loop. Look for the purple Hiding spots.','dagger']],
    3:[['Steady Aim','Bonus action if you have not moved: advantage on your next attack (then you cannot move this turn).','Guarantees advantage, and that means Sneak Attack.','bow'],['Rogue Archetype','Choose what kind of rogue you are.','Pick it in the next step.','dagger'],['Sneak Attack 2d6','Your Sneak Attack now deals 2d6.','Works by itself.','dagger']],
    4:[ASI_FEAT],
    5:[['Uncanny Dodge','Reaction: halve the damage from an attack you can see.','When a big hit lands on you.','star'],['Cunning Strike','Give up Sneak Attack dice for a trick: poison, trip or slip away.','Describe it in the "Something else" box.','dagger'],['Sneak Attack 3d6','Sneak Attack now deals 3d6.','Works by itself.','dagger']],
    6:[['Expertise','Pick two more skills to double your proficiency in.','Pick them in the next step.','star']],
    7:[['Evasion','When a DEX save would halve damage, you take none on a success and only half on a failure.','Works by itself.','star'],['Reliable Talent','On checks you are proficient in, a d20 under 10 counts as 10.','Works by itself.','star'],['Sneak Attack 4d6','Sneak Attack now deals 4d6.','Works by itself.','dagger']],
    8:[ASI_FEAT],
    9:[['Archetype feature','Thief: Supreme Sneak (advantage on Stealth if you move half speed). Assassin: Infiltration Expertise (perfect disguises).','Works by itself.','dagger'],['Sneak Attack 5d6','Sneak Attack now deals 5d6.','Works by itself.','dagger'],['Proficiency bonus +4','Every proficient attack, save and skill gets +1.','Works by itself.','star']],
    10:[ASI_FEAT]}};
// non-magical subclasses (campaign rule: no magic)
const SUBCLASSES={
  barbarian:[{key:'berserker',name:'Path of the Berserker',icon:'axe',flavor:'Pure fury. The angrier you get, the harder you hit.',feats:[['Frenzy','While raging, if you use Reckless Attack, your first hit each turn deals an extra 2d6.']]}],
  fighter:[{key:'champion',name:'Champion',icon:'sword',flavor:'Simple, brutal and reliable. You land critical hits far more often.',feats:[['Improved Critical','Your attacks are critical hits on a roll of 19 or 20.'],['Remarkable Athlete','Advantage on initiative and Athletics checks; after a critical hit you can move half your speed without opportunity attacks.']]},
    {key:'battlemaster',name:'Battle Master',icon:'flag',flavor:'A tactician with a trick for every fight.',feats:[['Combat Superiority','4 superiority dice (d8) per short rest. When you hit, spend one to add 1d8 damage and Trip, Push or Disarm the target.']]}],
  monk:[{key:'openhand',name:'Warrior of the Open Hand',icon:'fist',flavor:'A master of unarmed fighting. Fish-Man Karate would respect you.',feats:[['Open Hand Technique','When you hit with Flurry of Blows, you can also push the target 15 ft, knock it prone (DEX save) or stop its reactions.']]}],
  rogue:[{key:'thief',name:'Thief',icon:'dagger',flavor:'Quick hands and quicker feet. Born to be a pirate.',feats:[['Fast Hands','Cunning Action can also pick a lock, disarm a trap or use an object.'],['Second-Story Work','Climb at full speed and jump further.']]},
    {key:'assassin',name:'Assassin',icon:'skull',flavor:'Strike before they even know you are there.',feats:[['Assassinate','In the first round of a fight: advantage against anyone who has not acted yet, and your hits deal extra damage equal to your level.'],["Assassin's Tools",'Proficiency with the disguise kit and poisoner\'s kit.']]}]};
function subclassOf(b){return(SUBCLASSES[b.cls]||[]).find(s=>s.key===b.subclass)||null}

// ================= powers: Devil Fruits, Haki, items, area templates =================
// Technique kinds:
//  attack: {n,die,dtype,range(squares),ab}           -> attack roll vs the target, like a weapon
//  save:   {save,n,die,dtype,half,effect,area:{shape:'self'|'burst'|'cone'|'line'|'target',size(ft),range(ft)}}
//  buff:   {cond:{...}, temp:'formula', econ:{...}}  -> changes on yourself
//  heal:   {n,die,plus}
// Effects on enemies: prone, restrained, blinded, frightened, weakened (attacks at disadvantage).
// Save DC for fruits = 8 + proficiency + CON (Dungeons & Devil Fruits).
const FRUITS={
  sube:{match:/sube/i,name:'Sube Sube no Mi',type:'Smooth · Paramecia',resist:['bludgeoning','slashing'],smooth:true,
    passives:[['Slippery Resistance','Bludgeoning and slashing attacks slip off you: half damage. You can never be knocked prone by slipping.'],['Swift Movement','Difficult terrain costs you nothing extra.']],
    techs:[{id:'grease',name:'Grease Slick',cost:1,act:'action',kind:'save',save:'DEX',effect:'prone',area:{shape:'self',size:5},desc:'Enemies next to you: DEX save or fall prone.'},
      {id:'blur',name:'Blur',cost:2,act:'action',kind:'buff',cond:{blur:true},desc:'Attacks against you have disadvantage for the rest of the fight.'},
      {id:'slide',name:"Slip 'n Slide",cost:2,act:'bonus',kind:'buff',econ:{slide:true,disengaged:true},desc:'+10 ft movement and no opportunity attacks this turn.'}]},
  bara:{match:/bara bara/i,name:'Bara Bara no Mi',type:'Dividing · Paramecia',immune:['slashing'],
    passives:[['Cut Immunity','Slashing damage does nothing to you: your body just splits apart.'],['Floating Limbs','Your hands fly up to 30 ft away.']],
    techs:[{id:'cannon',name:'Bara Bara Cannon',cost:1,act:'action',kind:'attack',n:2,die:8,dtype:'bludgeoning',range:6,ab:'CON',desc:'Launch your fist at an enemy up to 30 ft away.'},
      {id:'festival',name:'Bara Bara Festival',cost:2,act:'action',kind:'save',save:'DEX',n:3,die:6,dtype:'piercing',half:true,area:{shape:'self',size:10},desc:'Your pieces whirl around you: enemies within 10 ft take 3d6 piercing (DEX save for half).'},
      {id:'escape',name:'Chop-Chop Escape',cost:1,act:'bonus',kind:'buff',econ:{disengaged:true,dash:1},desc:'Split apart and slip away: Disengage and Dash.'}]},
  toge:{match:/toge toge/i,name:'Toge Toge no Mi',type:'Spikes · Paramecia',immune:['piercing'],
    passives:[['Spike Immunity','Piercing damage does nothing to you.']],
    techs:[{id:'impale',name:'Impaling Strike',cost:0,act:'bonus',kind:'buff',cond:{impale:true},desc:'Your next melee hit deals an extra 1d8 piercing.'},
      {id:'thorns',name:'Armor of Thorns',cost:1,act:'action',kind:'buff',cond:{thorns:5},temp:'5',desc:'Gain 5 temporary HP; enemies that hit you in melee take 5 piercing.'},
      {id:'growth',name:'Spike Field',cost:2,act:'action',kind:'save',save:'DEX',n:4,die:4,dtype:'piercing',half:true,effect:'restrained',area:{shape:'burst',size:10,range:30},desc:'Spikes burst from the ground: 4d4 piercing and restrained (DEX save for half, no restrain).'}]},
  bane:{match:/bane bane/i,name:'Bane Bane no Mi',type:'Springs · Paramecia',
    passives:[['Spring Legs','You jump three times as far.']],
    techs:[{id:'hopper',name:'Spring Hopper',cost:1,act:'bonus',kind:'buff',econ:{dash:1,disengaged:true},desc:'Bounce away: Dash and Disengage.'},
      {id:'snipe',name:'Spring Snipe',cost:1,act:'action',kind:'attack',n:3,die:8,dtype:'bludgeoning',range:1,ab:'STR',desc:'A coiled-spring punch: 3d8 bludgeoning.'}]},
  awa:{match:/awa awa/i,name:'Awa Awa no Mi',type:'Bubble · Paramecia',
    passives:[['Soap Body','You can always wash things clean, even strength.']],
    techs:[{id:'clean',name:'Golden Bubble Wash',cost:2,act:'action',kind:'save',save:'CON',effect:'weakened',area:{shape:'burst',size:10,range:30},desc:'Bubbles scrub enemies clean of their strength: CON save or their attacks have disadvantage.'},
      {id:'slip',name:'Slippery Bubbles',cost:1,act:'action',kind:'save',save:'DEX',effect:'prone',area:{shape:'burst',size:10,range:30},desc:'Bubbles under their feet: DEX save or fall prone.'}]},
  beri:{match:/beri beri/i,name:'Beri Beri no Mi',type:'Orb · Paramecia',resist:['slashing'],
    passives:[['Orb Split','Blades pass between your orbs: half slashing damage.']],
    techs:[{id:'bombard',name:'Berry Bombard',cost:1,act:'action',kind:'attack',n:3,die:6,dtype:'bludgeoning',range:6,ab:'CON',desc:'Hurl a hard orb of yourself up to 30 ft: 3d6.'},
      {id:'scatter',name:'Orb Scatter',cost:2,act:'action',kind:'buff',cond:{blur:true},desc:'Scatter into orbs: attacks against you have disadvantage this fight.'}]},
  mane:{match:/mane mane/i,name:'Mane Mane no Mi',type:'Imitation · Paramecia',
    passives:[['Memoirs','Copy the face and body of anyone you have touched.']],
    techs:[{id:'mimic',name:'Mimic Face',cost:1,act:'bonus',kind:'buff',cond:{hidden:true},desc:'Take an enemy\'s face: you count as hidden (advantage on your next attack).'},
      {id:'kick',name:'Okama Kenpo',cost:1,act:'action',kind:'attack',n:2,die:10,dtype:'bludgeoning',range:1,ab:'DEX',desc:'A ballet kick: 2d10 bludgeoning.'}]},
  doa:{match:/doa doa/i,name:'Doa Doa no Mi',type:'Door · Paramecia',
    passives:[['Doors Everywhere','Open a door in any wall, floor or even the air.']],
    techs:[{id:'door',name:'Door Step',cost:1,act:'bonus',kind:'buff',econ:{dash:1,disengaged:true},desc:'Step through a door: Dash and Disengage.'},
      {id:'air',name:'Air Door',cost:2,act:'action',kind:'buff',cond:{hidden:true,blur:true},desc:'Hide in the space between: hidden, and attacks against you have disadvantage.'}]},
  bomu:{match:/bomu bomu/i,name:'Bomu Bomu no Mi',type:'Bomb · Paramecia',immune:['fire'],
    passives:[['Bomb Body','Your own explosions cannot hurt you (immune to fire).']],
    techs:[{id:'nose',name:'Nose Fancy Cannon',cost:1,act:'action',kind:'attack',n:3,die:6,dtype:'fire',range:12,ab:'CON',desc:'Flick an exploding booger up to 60 ft: 3d6 fire.'},
      {id:'breath',name:'Breeze Breath Bomb',cost:2,act:'action',kind:'save',save:'DEX',n:3,die:8,dtype:'fire',half:true,area:{shape:'burst',size:10,range:30},desc:'Exploding breath: 3d8 fire in a 10 ft burst (DEX for half).'}]},
  doru:{match:/doru doru/i,name:'Doru Doru no Mi',type:'Wax · Paramecia',
    passives:[['Candle Body','Wax hardens like steel.']],
    techs:[{id:'lock',name:'Candle Lock',cost:2,act:'action',kind:'save',save:'STR',effect:'restrained',area:{shape:'target',size:5,range:30},desc:'Wax locks one enemy\'s feet: STR save or restrained.'},
      {id:'armor',name:'Candle Armor',cost:1,act:'bonus',kind:'buff',cond:{resistAll:true},desc:'Harden a wax shell: half damage from weapons this fight.'}]},
  hana:{match:/hana hana/i,name:'Hana Hana no Mi',type:'Flower Blooming · Paramecia',
    passives:[['Bloom','Sprout arms and eyes on any surface you can see.']],
    techs:[{id:'cuatro',name:'Cuatro Mano',cost:1,act:'action',kind:'save',save:'DEX',effect:'restrained',area:{shape:'target',size:5,range:60},desc:'Arms bloom and grab an enemy: DEX save or restrained.'},
      {id:'clutch',name:'Clutch',cost:2,act:'action',kind:'save',save:'CON',n:4,die:8,dtype:'bludgeoning',half:true,area:{shape:'target',size:5,range:60},desc:'Bend them backwards: 4d8 bludgeoning (CON for half).'}]},
  mera:{match:/mera mera/i,name:'Mera Mera no Mi',type:'Fire · Logia',resist:['bludgeoning','piercing','slashing'],immune:['fire'],
    passives:[['Fire Body (Logia)','Weapons pass through flame: half bludgeoning, piercing and slashing damage, immune to fire. Haki and seastone still hurt you.']],
    techs:[{id:'fist',name:'Fire Fist',cost:1,act:'action',kind:'attack',n:3,die:8,dtype:'fire',range:12,ab:'CON',desc:'A fist of fire up to 60 ft: 3d8 fire.'},
      {id:'pillar',name:'Flame Pillar',cost:2,act:'action',kind:'save',save:'DEX',n:4,die:6,dtype:'fire',half:true,area:{shape:'self',size:10},desc:'Erupt in a column of fire: 4d6 to enemies within 10 ft (DEX for half).'},
      {id:'gun',name:'Fire Gun',cost:2,act:'action',kind:'save',save:'DEX',n:3,die:6,dtype:'fire',half:true,area:{shape:'cone',size:15},desc:'Fire bullets from your fingertips: 15 ft cone, 3d6 fire (DEX for half).'}]},
  hie:{match:/hie hie/i,name:'Hie Hie no Mi',type:'Ice · Logia',resist:['bludgeoning','piercing','slashing'],immune:['cold'],
    passives:[['Ice Body (Logia)','Half damage from weapons, immune to cold.']],
    techs:[{id:'saber',name:'Ice Saber',cost:1,act:'action',kind:'attack',n:2,die:10,dtype:'cold',range:1,ab:'CON',desc:'An ice blade: 2d10 cold.'},
      {id:'time',name:'Ice Time',cost:2,act:'action',kind:'save',save:'CON',n:3,die:6,dtype:'cold',half:true,effect:'restrained',area:{shape:'burst',size:5,range:30},desc:'Freeze an enemy solid: 3d6 cold and restrained (CON save for half, no freeze).'}]},
  suna:{match:/suna suna/i,name:'Suna Suna no Mi',type:'Sand · Logia',resist:['bludgeoning','piercing','slashing'],
    passives:[['Sand Body (Logia)','Half damage from weapons. Water turns you solid.']],
    techs:[{id:'sables',name:'Sables',cost:2,act:'action',kind:'save',save:'STR',n:3,die:6,dtype:'bludgeoning',half:true,effect:'prone',area:{shape:'burst',size:15,range:60},desc:'A sandstorm: 3d6 and knocked prone (STR save for half, stay standing).'},
      {id:'spada',name:'Desert Spada',cost:2,act:'action',kind:'save',save:'DEX',n:4,die:6,dtype:'slashing',half:true,area:{shape:'line',size:60},desc:'A blade of sand along the ground: 60 ft line, 4d6 slashing (DEX for half).'}]},
  moku:{match:/moku moku/i,name:'Moku Moku no Mi',type:'Smoke · Logia',resist:['bludgeoning','piercing','slashing'],
    passives:[['Smoke Body (Logia)','Half damage from weapons.']],
    techs:[{id:'snake',name:'White Snake',cost:1,act:'action',kind:'save',save:'STR',n:1,die:8,dtype:'bludgeoning',effect:'restrained',area:{shape:'target',size:5,range:30},desc:'A smoke coil grabs an enemy: 1d8 and restrained (STR save avoids).'},
      {id:'out',name:'White Out',cost:2,act:'action',kind:'save',save:'CON',effect:'blinded',area:{shape:'self',size:15},desc:'Thick smoke: enemies within 15 ft are blinded (CON save avoids).'}]},
  goro:{match:/goro goro/i,name:'Goro Goro no Mi',type:'Lightning · Logia',resist:['bludgeoning','piercing','slashing'],immune:['lightning'],
    passives:[['Lightning Body (Logia)','Half damage from weapons, immune to lightning.']],
    techs:[{id:'vari',name:'El Thor',cost:2,act:'action',kind:'save',save:'DEX',n:5,die:6,dtype:'lightning',half:true,area:{shape:'burst',size:10,range:60},desc:'A pillar of lightning: 5d6 in a 10 ft burst (DEX for half).'},
      {id:'jolt',name:'Jolt',cost:1,act:'action',kind:'attack',n:3,die:8,dtype:'lightning',range:1,ab:'CON',desc:'A charged touch: 3d8 lightning.'}]}
};
const FRUIT_ZOAN={zoan:true,type:'Zoan',
  passives:[['Animal Senses','Keen smell and hearing.'],['Three Forms','Human, hybrid and full animal form.']],
  techs:[{id:'hybrid',name:'Hybrid Form',cost:1,act:'bonus',kind:'buff',cond:{beast:true},temp:'lvl+con2',desc:'Transform: temporary HP and +1d6 damage on melee hits for the rest of the fight.'},
    {id:'rampage',name:'Beast Rampage',cost:1,act:'action',kind:'attack',n:2,die:10,dtype:'slashing',range:1,ab:'STR',desc:'Claws, horns or fangs: 2d10.'}]};
const FRUIT_GENERIC={generic:true,type:'Devil Fruit',passives:[],
  techs:[{id:'fstrike',name:'Devil Fruit technique',cost:1,act:'action',kind:'attack',n:2,die:6,dtype:'force',range:6,ab:'CON',desc:'Strike with your fruit power (up to 30 ft): 2d6. Ask the DM what else your fruit can do.'}]};
const FRUIT_CHARGES=5;
// Dungeons & Devil Fruits PHB chapter 7: rarity sets charges and the save DC / attack bonus
const FRUIT_RARITY={sube:'Uncommon',bara:'Uncommon',toge:'Uncommon',bane:'Uncommon',awa:'Uncommon',beri:'Uncommon',mane:'Uncommon',doa:'Uncommon',bomu:'Rare',doru:'Rare',hana:'Rare',suna:'Very Rare',moku:'Very Rare',mera:'Legendary',hie:'Legendary',goro:'Legendary'};
const RARITY_INFO={Uncommon:{b:1,ch:5,lv:3},Rare:{b:2,ch:9,lv:5},'Very Rare':{b:3,ch:13,lv:7},Legendary:{b:4,ch:17,lv:9}};
function fruitRarity(c){if(!c||!c.fruit)return'Uncommon';const k=Object.keys(FRUITS).find(k=>FRUITS[k].match.test(c.fruit));return(k&&FRUIT_RARITY[k])||'Uncommon'}
function fruitOf(c){if(!c||!c.fruit)return null;const f=Object.values(FRUITS).find(x=>x.match.test(c.fruit));const rar=fruitRarity(c);const ch=RARITY_INFO[rar].ch;if(f)return{...f,display:c.fruit,charges:ch,rarity:rar};
  if(/model|zoan|inu inu|neko neko|ushi ushi|uma uma|tori tori|hebi hebi|zou zou|hito hito/i.test(c.fruit))return{...FRUIT_ZOAN,name:c.fruit,display:c.fruit,charges:ch,rarity:rar};
  return{...FRUIT_GENERIC,name:c.fruit,display:c.fruit,charges:ch,rarity:rar}}
function fruitDC(D,c){return 8+D.prof+RARITY_INFO[fruitRarity(c||(typeof myChar==='function'?myChar():null))].b}
function fruitAtk(D,c){return D.prof+RARITY_INFO[fruitRarity(c||(typeof myChar==='function'?myChar():null))].b}
// ---- Haki (Dungeons & Devil Fruits, chapter 7, simplified for the battle map) ----
const HAKI={
  armament:{name:'Color of Armament',ab:'CON',icon:'🛡',blurb:'Coat your body and weapons in spirit: hit Logia users at full power.',opts:{
    hardening:{name:'Weapon Hardening',act:'bonus',uses:'prof',kind:'buff',cond:{hardened:true},desc:'For the fight: +1 to hit and damage, and your weapon or fists hit Logia users and smoke at full power.'},
    blast:{name:'Spirit Blast',act:'free',uses:'prof',kind:'buff',econ:{blast:true},desc:'Your next melee hit this turn deals an extra 2d8 force.'},
    vessel:{name:'Vessel of Resilience',act:'action',uses:1,kind:'buff',cond:{resistAll:true},desc:'For the fight: half damage from weapons.'},
    life:{name:'Aura of Life',act:'action',uses:'prof',kind:'buff',temp:'1d6+conscore+lvl',desc:'Gain 1d6 + your CON score + your level temporary HP.'}}},
  observation:{name:'Color of Observation',ab:'WIS',icon:'👁',blurb:'Sense auras, see attacks coming, find what hides.',opts:{
    sense:{name:'Spirit Sense',act:'action',uses:'prof',kind:'reveal',desc:'Sense every hidden enemy within 60 ft and reveal them on the map.'},
    predictive:{name:'Predictive Strike',act:'passive',uses:'prof',kind:'passive',desc:'When an enemy misses you in melee, you strike back automatically (uses a charge).'},
    foresight:{name:'Predict Outcome',act:'bonus',uses:1,kind:'buff',cond:{foresight:true},desc:'See the future: attacks against you have disadvantage until your next turn.'}}},
  conqueror:{name:"Color of the Supreme King",ab:'CHA',icon:'👑',blurb:'Rare. Force weaker wills into submission.',opts:{
    conq:{name:"Conqueror's Will",act:'action',uses:1,kind:'conq',desc:'Every enemy within 30 ft makes a WIS save: weak ones faint, the rest are frightened (disadvantage on attacks) for a round.'}}}};
function hakiOf(c){return(c&&c.haki)||[]}
function hakiOpt(k){for(const [col,h] of Object.entries(HAKI))if(h.opts[k])return{...h.opts[k],key:k,color:col,colorName:h.name,ab:h.ab};return null}
function hakiUses(o,D){return o.uses==='prof'?D.prof:o.uses}
function hakiDC(o,D){return 8+D.prof+Math.floor((D.ab[o.ab]-10)/2)}
// ---- items: shop catalog with effects ----
const ITEMS={
  bandage:{name:'Bandages',price:10000,tag:'heal',use:{act:'action',kind:'heal',n:1,die:4,plus:1},desc:'Action: heal 1d4+1.'},
  medicine:{name:'Herbal medicine',price:500000,tag:'heal',use:{act:'action',kind:'heal',n:2,die:4,plus:2},desc:'Action: heal 2d4+2 (a potion of healing).'},
  meat:{name:'Meat on the bone',price:50000,tag:'food',use:{act:'bonus',kind:'heal',n:1,die:6,plus:2},desc:'Bonus action: heal 1d6+2. Also a day\'s food.'},
  smoke:{name:'Smoke bomb',price:250000,tag:'gear',use:{act:'bonus',kind:'buff',cond:{hidden:true}},desc:'Bonus action: vanish in smoke (hidden).'},
  tabasco:{name:'Tabasco Star',price:10000,tag:'ammo',use:{act:'action',kind:'save',save:'CON',n:1,die:6,dtype:'fire',effect:'blinded',area:{shape:'target',size:5,range:30}},desc:'Action: hot sauce pellet up to 30 ft: 1d6 fire and blinded (CON save avoids).'},
  bomb:{name:'Bomb',price:1500000,tag:'gear',use:{act:'action',kind:'save',save:'DEX',n:3,die:6,dtype:'fire',half:true,area:{shape:'burst',size:10,range:30}},desc:'Action: throw up to 30 ft, 10 ft blast, 3d6 fire (DEX for half).'},
  flashdial:{name:'Flash Dial',price:500000,tag:'gear',use:{act:'action',kind:'save',save:'CON',effect:'blinded',area:{shape:'cone',size:15}},desc:'Action: blinding light in a 15 ft cone (CON save avoids).'},
  impactdial:{name:'Impact Dial',price:5000000,tag:'gear',use:{act:'action',kind:'attack',n:4,die:8,dtype:'force',range:1,ab:'STR',recoil:'1d8'},desc:'Action: release stored impact on an adjacent enemy: 4d8 force (you take 1d8 recoil).'},
  handcuffs:{name:'Seastone handcuffs',price:1000000,tag:'gear',use:{act:'action',kind:'save',save:'STR',effect:'restrained',area:{shape:'target',size:5,range:5}},desc:'Action: cuff an adjacent enemy: STR save or restrained (Devil Fruit users lose their powers).'},
  rope:{name:'Rope (50 ft)',price:10000,tag:'gear',desc:'Useful for climbing, tying and swinging.'},
  rations:{name:'Rations (days)',price:5000,tag:'food',desc:'One day of food at sea.'},
  fineblade:{name:'Fine weapon (+1)',price:5000000,tag:'weapon',bonus:{atk:1,dmg:1},desc:'A masterwork version of your weapon: +1 to hit and damage.'},
  seastoneblade:{name:'Seastone-edged weapon',price:10000000,tag:'weapon',bonus:{atk:1,dmg:1,magic:true},desc:'Seastone edge: +1, and it hits Logia users at full power.'},
  marinecoat:{name:'Reinforced coat',price:2500000,tag:'armor',bonus:{ac:1},desc:'+1 AC.'},
  logpose:{name:'Log Pose',price:500000,tag:'gear',desc:'Needed to navigate the Grand Line.'},
  cola:{name:'Barrel of cola',price:8000,tag:'gear',desc:'Fuel for some very special ships.'}};
function itemKeyByName(nm){const n=String(nm||'').toLowerCase().trim();for(const [k,it] of Object.entries(ITEMS))if(it.name.toLowerCase()===n)return k;for(const [k,it] of Object.entries(ITEMS))if(n&&(n.includes(it.name.toLowerCase())||it.name.toLowerCase().includes(n)))return k;return null}
function itemBonus(c){const out={atk:0,dmg:0,ac:0,magic:false,name:''};for(const it of invOf(c)){if(it.equipped===false)continue;const k=it.key||itemKeyByName(it.name);const b=k&&ITEMS[k]&&ITEMS[k].bonus;if(!b)continue;if(b.atk>out.atk){out.atk=b.atk;out.name=ITEMS[k].name}if(b.dmg>out.dmg)out.dmg=b.dmg;if(b.ac)out.ac+=b.ac;if(b.magic)out.magic=true}return out}
function usableItems(c){return invOf(c).map((it,i)=>({it,i,k:it.key||itemKeyByName(it.name)})).filter(x=>x.k&&ITEMS[x.k]&&ITEMS[x.k].use&&x.it.qty>0)}
// ---- area templates ----
function tplCells(shape,size,origin,aim){const r=Math.max(1,Math.round(size/5));const out=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){let inside=false;
    if(shape==='burst'||shape==='self'||shape==='target'){const R=shape==='target'?0:r;inside=Math.max(Math.abs(x-origin.x),Math.abs(y-origin.y))<=R&&!(shape==='self'&&x===origin.x&&y===origin.y)}
    else{const dx=aim.x-origin.x,dy=aim.y-origin.y;const L=Math.hypot(dx,dy)||1;const ux=dx/L,uy=dy/L;const px=x-origin.x,py=y-origin.y;const along=px*ux+py*uy;const across=Math.abs(-px*uy+py*ux);
      if(shape==='cone')inside=along>0.5&&along<=r+0.5&&across<=along*0.5+0.5;
      if(shape==='line')inside=along>0.5&&along<=r+0.5&&across<=0.5}
    if(inside)out.push({x,y})}return out}
let PLACE=null;
function tokensIn(cells,kind){const set=new Set(cells.map(c=>c.x+','+c.y));return Object.entries(ST.tokens).filter(([,t])=>t.scene===ST.state.scene&&(!kind||t.kind===kind)&&set.has(t.x+','+t.y)).map(([id])=>id)}
function drawTpl(cells,ok,label){let g=$('tplFx');if(!g){g=document.createElement('div');g.id='tplFx';$('board').appendChild(g)}const s=CELL*ZOOM;
  g.innerHTML=cells.map(c=>`<i style="left:${c.x*s}px;top:${c.y*s}px;width:${s}px;height:${s}px" class="${ok?'':'bad'}"></i>`).join('')+(label?`<b style="left:${(cells[0]?cells[0].x:0)*s}px;top:${(cells[0]?cells[0].y:0)*s-22}px">${esc(label)}</b>`:'')}
function clearTpl(){const g=$('tplFx');if(g)g.remove()}
function startPlace(spec,onDone){const me=ST.tokens[myTokId()];if(!me)return;const a=spec.area;
  if(a.shape==='self'){const cells=tplCells('self',a.size,me,me);onDone(cells);return}
  PLACE={spec,onDone,me};$('board').classList.add('placing');toast(a.shape==='cone'||a.shape==='line'?'Point where to aim, then click (Esc cancels).':'Click where to place it (Esc cancels).');
  $('board').addEventListener('pointermove',placeMove);setTimeout(()=>$('board').addEventListener('click',placeClick,{once:false}),50)}
function placeAim(e){const p=cellFromEvent(e);const me=PLACE.me;const a=PLACE.spec.area;let ok=true;let origin=me,aim=p;
  if(a.shape==='burst'||a.shape==='target'){const rr=Math.round((a.range||30)/5);ok=cheb(me,p)<=rr&&canTarget(ST.state.scene,me,p);origin=p}
  return{cells:tplCells(a.shape,a.size,origin,aim),ok}}
function placeMove(e){if(!PLACE)return;const r=placeAim(e);drawTpl(r.cells,r.ok,PLACE.spec.name+(r.ok?'':' · out of range'))}
function placeClick(e){if(!PLACE)return;e.stopPropagation();const r=placeAim(e);if(!r.ok){toast('Out of range or out of sight.');return}const fn=PLACE.onDone;cancelPlace();drawTpl(r.cells,true,'');setTimeout(clearTpl,1500);fn(r.cells)}
function cancelPlace(){if(!PLACE)return;PLACE=null;$('board').classList.remove('placing');$('board').removeEventListener('pointermove',placeMove);$('board').removeEventListener('click',placeClick);clearTpl()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&PLACE){cancelPlace();toast('Cancelled.')}});
// ---- the buttons on your turn ----
function techUses(c,D,src){if(src.type==='fruit'){const fr=fruitOf(c);const mx=fr?fr.charges:FRUIT_CHARGES;return{left:mx-((c.res||{}).fruit||0),max:mx}}
  if(src.type==='haki'){const o=hakiOpt(src.key);const mx=hakiUses(o,D);return{left:mx-((c.res||{})['haki_'+src.key]||0),max:mx}}
  if(src.type==='item'){const it=invOf(c)[src.i];return{left:it?it.qty:0,max:it?it.qty:0}}return{left:0,max:0}}
function powerList(c,D){const L=[];const fr=fruitOf(c);if(fr&&(c.build.fruitAte||c.fruit))for(const t of fr.techs)L.push({id:'f_'+t.id,src:{type:'fruit'},spec:{...t,dc:fruitDC(D,c)},cost:t.cost,label:'🍇 '+t.name,cls:'fruitact'});
  for(const k of hakiOf(c)){const o=hakiOpt(k);if(!o||o.act==='passive')continue;L.push({id:'h_'+k,src:{type:'haki',key:k},spec:{...o,id:k,dc:hakiDC(o,D),cost:1},cost:1,label:HAKI[o.color].icon+' '+o.name,cls:'hakiact'})}
  for(const x of usableItems(c)){const it=ITEMS[x.k];L.push({id:'i_'+x.i,src:{type:'item',i:x.i},spec:{...it.use,name:it.name,desc:it.desc,dc:8+D.prof+Math.max(mod(D.ab.DEX),mod(D.ab.STR))},cost:1,label:'🎒 '+it.name,cls:'itemact'})}
  return L}
function powerActions(c,D,e,tok){return powerList(c,D).map(p=>{const s=p.spec;const u=techUses(c,D,p.src);const act=s.act||'action';const need=act==='action'?e.action<1:act==='bonus'?e.bonus<1:false;
  let dis=need||u.left<(p.src.type==='fruit'?p.cost:1);if(s.kind==='attack'&&!tok)dis=true;if(s.cond&&s.cond.blur&&c.cond&&c.cond.blur&&!s.cond.hidden)dis=true;if(s.econ&&s.econ.slide&&e.slide)dis=true;if(s.econ&&s.econ.blast&&e.blast)dis=true;if(s.cond&&s.cond.hardened&&c.cond&&c.cond.hardened)dis=true;
  const costTxt=p.src.type==='fruit'?(p.cost?`${p.cost} charge${p.cost>1?'s':''}`:'free'):p.src.type==='haki'?'Haki':'item';
  const leftTxt=p.src.type==='item'?`×${u.left}`:`${u.left}/${u.max} left`;
  return{id:'pw_'+p.id,k:`${act==='action'?'Action':act==='bonus'?'Bonus action':'Free'} · ${costTxt}`,b:p.label,s:`${s.desc} · ${leftTxt}${s.kind==='save'?` · DC ${s.dc}`:''}`,dis,fruit:true,cls:p.cls}})}
async function spendUse(c,D,p){const fresh=myChar();const res={...(fresh.res||{})};
  if(p.src.type==='fruit')res.fruit=(res.fruit||0)+p.cost;
  if(p.src.type==='haki')res['haki_'+p.src.key]=(res['haki_'+p.src.key]||0)+1;
  if(p.src.type==='item'){const inv=invOf(fresh).map(x=>({...x}));const it=inv[p.src.i];if(it)it.qty-=1;await put('chars/'+ST.me,{...fresh,res,inv:inv.filter(x=>x.qty>0)});return}
  await put('chars/'+ST.me,{...fresh,res})}
function evalTemp(f,c,D){if(!f)return 0;let v=0;for(const part of String(f).split('+')){const p=part.trim();if(/^\d+d\d+$/.test(p)){const [n,dd]=p.split('d').map(Number);v+=sum(Array.from({length:n},()=>d(dd)))}else if(p==='lvl')v+=D.lvl;else if(p==='conscore')v+=D.ab.CON;else if(p==='con2')v+=2*Math.max(0,mod(D.ab.CON))+2;else v+=+p||0}return v}
async function usePower(pid){const c=myChar();const D=derive(c.build);const p=powerList(c,D).find(x=>x.id===pid);if(!p)return;const s=p.spec;const e=econNow();const act=s.act||'action';
  const cost=act==='action'?{action:e.action-1}:act==='bonus'?{bonus:0}:{};const upd=patch=>put('table/econ',{...econNow(),...patch});
  if(s.kind==='attack'){if(strike('tech',{...s,name:s.name})){await spendUse(c,D,p);upd(cost);if(s.recoil){const r=evalTemp(s.recoil,c,D);const f=myChar();put('chars/'+ST.me,{...f,hp:Math.max(1,f.hp-r)});toast(`Recoil: you take ${r}.`)}}return}
  if(s.kind==='heal'){const h=sum(Array.from({length:s.n},()=>d(s.die)))+(s.plus||0);await spendUse(c,D,p);const f=myChar();const nh=Math.min(D.maxhp,Math.max(0,f.hp)+h);await put('chars/'+ST.me,{...f,hp:nh,...(nh>0?{death:{s:0,f:0},stable:false}:{})});upd(cost);addLog({by:ST.me,who:c.build.name,label:s.name,detail:`${s.n}d${s.die}+${s.plus||0}`,total:'+'+h,fx:{tg:myTokId(),k:'heal',n:h}});return}
  if(s.kind==='buff'){await spendUse(c,D,p);const f=myChar();const nc={...(f.cond||{}),...(s.cond||{})};let temp=f.temp||0;if(s.temp){temp=Math.max(temp,evalTemp(s.temp,c,D))}await put('chars/'+ST.me,{...f,cond:nc,temp});upd({...cost,...(s.econ||{}),...(s.econ&&s.econ.dash?{dash:(econNow().dash||0)+s.econ.dash}:{})});
    addLog({by:ST.me,who:c.build.name,label:s.name,detail:`${c.build.name}: ${s.desc}${temp&&s.temp?` (${temp} temporary HP)`:''}`,total:'✦',fx:{tg:myTokId(),k:'info',txt:s.name.toUpperCase()+'!'}});return}
  if(s.kind==='reveal'){await spendUse(c,D,p);upd(cost);sendAction({kind:'power',op:'reveal',by:ST.me,who:c.build.name,actor:myTokId(),label:s.name,range:12});return}
  if(s.kind==='conq'){await spendUse(c,D,p);upd(cost);sendAction({kind:'power',op:'conq',by:ST.me,who:c.build.name,actor:myTokId(),label:s.name,dc:s.dc,range:6});pop("CONQUEROR'S HAKI!");return}
  if(s.kind==='save'){startPlace(s,async cells=>{const tg=tokensIn(cells,'foe');await spendUse(c,D,p);upd(cost);
      if(!tg.length){addLog({by:ST.me,who:c.build.name,label:s.name,detail:`${c.build.name} uses ${s.name}, but no enemy is caught in it.`,total:'—'});return}
      sendAction({kind:'power',op:'save',by:ST.me,who:c.build.name,actor:myTokId(),targets:tg,dc:s.dc,save:s.save,n:s.n||0,die:s.die||0,dtype:s.dtype||'force',half:!!s.half,effect:s.effect||null,label:s.name,cells:cells.slice(0,80)})});return}}
// ---- host side ----
const FOE_SAVE=(ft,sv)=>{const boss=(ft.hp||0)>=30;const base=sv==='DEX'?(ft.dex||0):sv==='STR'?(ft.str??Math.max(1,ft.atk-3)):sv==='CON'?(boss?3:1):(boss?2:0);return base+(boss?2:0)};
async function hostPower(a){const who=String(a.who||'Someone').slice(0,40);const label=String(a.label||'Power').slice(0,40);
  if(a.op==='save'){const ls=[];let first=null;for(const id of (a.targets||[]).slice(0,10)){const f=ST.dm[id];const tk=ST.tokens[id];if(!f||f.hp<=0||!tk)continue;const ft=FOES[f.foe]||{};const r=d20roll(0);const tot=r.v+FOE_SAVE(ft,a.save);const ok=tot>=(+a.dc||10);
      let dmg=0;if(+a.n&&+a.die){dmg=sum(Array.from({length:Math.min(12,+a.n)},()=>d(Math.min(12,+a.die))));if(ok)dmg=a.half?Math.floor(dmg/2):0;if((ft.immune||[]).includes(a.dtype))dmg=0;else if((ft.resist||[]).includes(a.dtype))dmg=Math.floor(dmg/2)}
      const eff=!ok&&a.effect&&['prone','restrained','blinded','frightened','weakened'].includes(a.effect)?a.effect:null;
      if(dmg){const nh=Math.max(0,f.hp-dmg);await setFoeHp(id,nh);if(nh===0)setTimeout(()=>koFoe(id),900)}
      if(eff&&ST.tokens[id])await put('tokens/'+id,{...ST.tokens[id],[eff]:true});
      ls.push(`${f.name}: ${a.save} save ${tot} ${ok?'succeeds':'fails'}${dmg?`, ${dmg} ${a.dtype} damage`:''}${eff?`, ${eff}!`:''}.`);if(!first)first={id,dmg,eff}}
    if(ls.length)await addLog({by:a.by||'',who,label,detail:ls.join(' '),total:`DC ${+a.dc||10}`,fx:first?{a:a.actor,tg:first.id,k:first.dmg?'hit':'info',n:first.dmg,txt:first.eff?first.eff.toUpperCase()+'!':'saved',area:(a.cells||[]).slice(0,80)}:null});
    hostCombatCheck();return}
  if(a.op==='reveal'){const me=ST.tokens[a.actor];const found=[];for(const [id,f] of Object.entries(ST.dm)){if(f.type!=='foe'||!f.hidden||f.scene!==ST.state.scene||f.hp<=0)continue;if(me&&cheb(me,f)>(+a.range||12))continue;await revealFoe(id,true);found.push(f.name)}
    await addLog({by:a.by||'',who,label,detail:found.length?`${who} senses ${found.join(', ')}!`:`${who} reaches out with Haki... nobody is hiding nearby.`,total:'👁'});return}
  if(a.op==='conq'){const me=ST.tokens[a.actor];const ls=[];for(const [id,t] of Object.entries(ST.tokens)){if(t.kind!=='foe'||t.scene!==ST.state.scene||!me||cheb(me,t)>(+a.range||6))continue;const f=ST.dm[id];if(!f||f.hp<=0)continue;const ft=FOES[f.foe]||{};const r=d20roll(0);const tot=r.v+FOE_SAVE(ft,'WIS');
      if(tot>=(+a.dc||12)){ls.push(`${f.name} withstands it (${tot}).`);continue}
      if(f.max<=12){await setFoeHp(id,0);setTimeout(()=>koFoe(id),900);ls.push(`${f.name} foams at the mouth and faints!`)}else{await put('tokens/'+id,{...ST.tokens[id],frightened:true});ls.push(`${f.name} trembles: frightened!`)}}
    await addLog({by:a.by||'',who,label,detail:ls.join(' ')||'No enemy close enough.',total:'👑',fx:{tg:a.actor,k:'info',txt:'HAKI!'}});hostCombatCheck();return}}
// enemy turn helpers
const ONE_TURN=['restrained','blinded','frightened','weakened'];
function foeDisadv(tk){return!!(tk&&(tk.restrained||tk.blinded||tk.frightened||tk.weakened))}
async function clearFoeTurnFx(id){const t=ST.tokens[id];if(!t)return;if(ONE_TURN.some(k=>t[k])){const n={...t};for(const k of ONE_TURN)delete n[k];await put('tokens/'+id,n)}}
function pcResists(c,dt){const fr=fruitOf(c);const cond=c.cond||{};if(fr&&(fr.immune||[]).includes(dt))return'immune';if(cond.raging&&['bludgeoning','piercing','slashing'].includes(dt))return'half';if(cond.resistAll&&['bludgeoning','piercing','slashing'].includes(dt))return'half';if(fr&&(fr.resist||[]).includes(dt))return'half';return null}
async function predictiveCounter(uid,foeId){const c=ST.chars[uid];if(!charOK(c)||c.hp<=0||!hakiOf(c).includes('predictive'))return null;const D=derive(c.build);const used=(c.res||{}).haki_predictive||0;if(used>=D.prof)return null;
  const f=ST.dm[foeId];if(!f||f.hp<=0)return null;const r=d20roll(0);const tot=r.v+D.atk;await put('chars/'+uid,{...ST.chars[uid],res:{...(ST.chars[uid].res||{}),haki_predictive:used+1}});
  if(r.v!==20&&(r.v===1||tot<f.ac))return`${c.build.name} sees it coming and strikes back (Predictive Strike) but misses.`;
  let dmg=sum(Array.from({length:D.n*(r.v===20?2:1)},()=>d(D.die)))+D.dmgMod;const ft=FOES[f.foe]||{};const dt=WDTYPE[c.build.weapon]||'slashing';if((ft.immune||[]).includes(dt))dmg=0;else if((ft.resist||[]).includes(dt))dmg=Math.floor(dmg/2);
  const nh=Math.max(0,f.hp-dmg);await setFoeHp(foeId,nh);if(nh===0)setTimeout(()=>koFoe(foeId),900);return`${c.build.name} saw it coming: Predictive Strike hits ${f.name} for ${dmg}!`}

// ================= Devil Fruit names: Japanese name, English name and type (Paramecia / Zoan / Logia) wherever a known fruit is shown =================
// English names follow the official English translations where the fruit is from the series; otherwise they come from the book's meaning.
const FRUIT_EN={gomu:'Rubber',bara:'Chop',sube:'Slip',toge:'Spike',bane:'Spring',doa:'Door',awa:'Bubble',beri:'Berry',mane:'Clone',bomu:'Bomb',doru:'Wax',hana:'Flower-Flower',
  kilo:'Kilo',ope:'Op',nikyu:'Paw',horo:'Hollow',yomi:'Revive',kage:'Shadow',gura:'Tremor',ito:'String',hobi:'Hobby',bari:'Barrier',mero:'Love',doku:'Venom',suke:'Clear',noro:'Slow',
  nagi:'Calm',mochi:'Mochi',soru:'Soul',bisu:'Biscuit',kuri:'Cream',ori:'Cage',sabi:'Rust',woshu:'Wash',nui:'Stitch',guru:'Spin',jake:'Jacket',poke:'Pocket',mato:'Mark',shibo:'Wring',
  choco:'Choco',nemu:'Sleep',mini:'Shrink',kachi:'Hard',hira:'Flag',bata:'Butter',juku:'Ripe',kyubu:'Cube',ropu:'Rope',tsuri:'Fishing',kutsu:'Shoe',maki:'Scroll',kagi:'Key',
  mera:'Flame',hie:'Ice',suna:'Sand',moku:'Smoke',goro:'Rumble',pika:'Glint',magu:'Magma',yami:'Dark',gasu:'Gas',yuki:'Snow',numa:'Swamp',mori:'Forest',
  hito:'Human',inu:'Dog',neko:'Cat',ushi:'Ox',uma:'Horse',tori:'Bird',hebi:'Snake',zou:'Elephant',mogu:'Mole',nezu:'Rat',kani:'Crab',yagi:'Goat',kumo:'Spider',mushi:'Bug',
  shika:'Deer',sara:'Salamander',kame:'Turtle',buta:'Pig',guwa:'Frog',guma:'Weasel',ryu:'Dragon',batto:'Bat',sake:'Fish',ookami:'Wolf'};
const FRUIT_LOGIA=new Set(['mera','hie','suna','moku','goro','pika','magu','yami','gasu','yuki','numa','mori']);
const FRUIT_ZOANS=new Set(['hito','inu','neko','ushi','uma','tori','hebi','zou','mogu','nezu','kani','yagi','kumo','mushi','shika','sara','kame','buta','guwa','guma','ryu','batto','sake','ookami']);
const FRUIT_TYPE_INFO={Paramecia:'Paramecia: gives the body or the user a special power.',Zoan:'Zoan: lets the user turn into an animal and a hybrid form.',Logia:'Logia: turns the body into an element; plain weapons pass through it.'};
// "Mini Mini no Mi (Shrinking)" / "Inu Inu no Mi, Model: Dalmation" -> {jp, en, type}
function fruitInfo(name){const raw=String(name||'').trim();if(!raw)return null;
  const meaning=(raw.match(/\(([^)]+)\)/)||[])[1];const jp=raw.replace(/\s*\([^)]*\)/,'').replace(/\s+/g,' ').replace(/no Mi\s+Model/i,'no Mi, Model').trim();
  const root=(jp.match(/^([A-Za-z]+)/)||[])[1];if(!root||!/no Mi/i.test(jp))return{jp,en:'',type:''};const k=root.toLowerCase();
  const model=(jp.match(/Model:\s*(.+)$/i)||[])[1];const book=Object.values(typeof FRUITS==='object'?FRUITS:{}).find(f=>f.match&&f.match.test(jp));
  let type=model||FRUIT_ZOANS.has(k)?'Zoan':FRUIT_LOGIA.has(k)?'Logia':'Paramecia';if(book&&/Logia/.test(book.type))type='Logia';
  let w=FRUIT_EN[k];if(!w){const m=meaning||(book&&String(book.type).split(' · ')[0])||'';w=fruitStem(m)}
  const en=w?(w.includes('-')?w:`${w}-${w}`)+' Fruit'+(model?`, Model: ${model.replace(/Dalmation/i,'Dalmatian')}`:''):'';
  return{jp:jp.replace(/Dalmation/i,'Dalmatian'),en,type}}
function fruitStem(m){const ex={Dancing:'Dance',Dividing:'Divide',Maturing:'Ripe',Dimming:'Dim',Wrapping:'Wrap',Snapping:'Snap',Shrinking:'Shrink',Crying:'Cry',Sewing:'Stitch',Hearing:'Hear',Dulling:'Dull',Fishing:'Fish',Laughter:'Laugh',Tendrils:'Tendril',Brightness:'Bright',Spikes:'Spike',Springs:'Spring',Imitation:'Clone'};return ex[m]||m.replace(/ing$/,'')}
function fruitLabel(name){const f=fruitInfo(name);if(!f)return'';return[f.jp,f.en,f.type].filter(Boolean).join(' · ')}
// small chip like "Paramecia" with a colour per type and a hover explanation
function fruitTypeChip(type){return type?`<span class="frt frt-${type.toLowerCase()}" title="${esc(FRUIT_TYPE_INFO[type]||'')}">${esc(type)}</span>`:''}
(function(){const st=document.createElement('style');st.textContent=`
.frt{display:inline-block;font-size:.78em;line-height:1.2;padding:1px 7px;border-radius:999px;border:1px solid currentColor;font-weight:600;letter-spacing:.02em;vertical-align:1px;white-space:nowrap}
.frt-paramecia{color:#d9a441}.frt-zoan{color:#7cc46f}.frt-logia{color:#6fb3e0}
[data-theme] .frt{}
.frn{white-space:normal;border-bottom:1px dotted var(--brass,#b8893b)}.frn small{font-size:.82em;opacity:.85;white-space:nowrap}
.fr-en{font-size:13px;margin-top:2px;opacity:.9}
.resrow{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 8px}.resc{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid var(--brass,#b8893b);font-size:12.5px;background:rgba(0,0,0,.18)}
.resc b{font-weight:600}.resc em{font-style:normal;font-variant-numeric:tabular-nums;color:var(--brass,#e0a458);font-weight:700}.resc.out{opacity:.6}
.rpips{display:inline-flex;gap:3px}.rpips i{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--brass,#e0a458)}.rpips i.on{background:var(--brass,#e0a458)}`;document.head.appendChild(st)})();
// the fruit card, fruit reveal and party tags use the extra names
{const _fo=fruitOf;fruitOf=function(c){const fr=_fo(c);if(!fr)return fr;const f=fruitInfo(c.fruit);if(!f)return fr;return{...fr,display:f.jp,en:f.en,ftype:f.type,type:[f.en,f.type].filter(Boolean).join(' · ')||fr.type}}}
// in the story text: after a known fruit's name, add its English name and type
function fruitMark(html){return String(html).replace(/\b([A-Z][a-z]+)[ -]\1 no Mi(?:,? Model: [A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)?)?(?!\s*<small)/g,m=>{const f=fruitInfo(m.replace(/&#39;|&amp;/g,''));if(!f||!f.en)return m;
  return`<span class="frn" title="${esc(f.en+' · '+f.type)}">${m}<small> (${esc(f.en)}, ${esc(f.type)})</small></span>`})}

const MAX_LEVEL=10;function asiLevels(cls){return cls==='fighter'?[4,6,8]:cls==='rogue'?[4,8,10]:[4,8]}
// ================= more classes from the Dungeons & Devil Fruits PHB =================
// Marksman (sniper), Priest (holy powers), Skald (spirit powers, music) and Chemist (invention powers, monster mutation).
// Their "powers" are the book's renamed spells. Every power costs one slot from the class pool (slots come back after a long rest);
// cantrips (natural abilities) are at will. Levels 1-10 are covered, which is as far as the campaigns go.
Object.assign(WEAPONS,{
  musket:{name:'Musket',n:1,d:12,abil:'DEX',range:[8,24],icon:'pistol',note:'two-handed firearm, range 40/120 ft'},
  mace:{name:'Mace + shield',n:1,d:6,abil:'STR',reach:1,shield:2,icon:'staff',note:'shield +2 AC'},
  scimitar:{name:'Scimitar + shield',n:1,d:6,abil:'FIN',reach:1,finesse:true,shield:2,icon:'sword',note:'finesse, shield +2 AC'}});
Object.assign(WDTYPE,{musket:'piercing',mace:'bludgeoning',scimitar:'slashing'});
Object.assign(CLASSES,{
  marksman:{name:'Marksman',hd:10,icon:'pistol',saves:['STR','DEX'],pick:2,list:['Acrobatics','Insight','Investigation','History','Perception','Sleight of Hand','Stealth','Survival'],weapons:['musket','pistol'],armor:'scale',caster:'half',ab:'WIS',pool:'Tactic slots',book:'Marksman',
    blurb:'A sniper who marks a target and never misses it twice. Usopp would approve.'},
  priest:{name:'Priest',hd:8,icon:'star',saves:['WIS','CHA'],pick:2,list:['History','Insight','Medicine','Persuasion','Religion'],weapons:['mace','musket'],armor:'scale',caster:'full',ab:'WIS',pool:'Holy power slots',book:'Priest',sub1:true,
    blurb:'Holy powers heal the crew and smite enemies with sky fire.'},
  skald:{name:'Skald',hd:8,icon:'flag',saves:['DEX','CHA'],pick:3,any:true,weapons:['rapier','cutlass'],armor:'leather',caster:'full',ab:'CHA',pool:'Spirit power slots',book:'Skald',
    blurb:'A musician and storyteller. Songs give the crew courage and break enemy nerves.'},
  chemist:{name:'Chemist',hd:8,icon:'wheel',saves:['INT','WIS'],pick:2,list:['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'],weapons:['scimitar','quarterstaff'],armor:'leather',caster:'full',ab:'WIS',pool:'Invention slots',book:'Chemist',
    blurb:'A doctor and alchemist. Heals with medicine, poisons with vials, and can mutate into a monster.'}});
CLASSES.skald.list=Object.keys(SKILLS);
const SLOTS_FULL=[0,2,3,6,7,9,10,11,12,14,15],SLOTS_HALF=[0,0,2,3,3,6,6,7,7,9,9];
function c2Slots(cls,lvl){const cl=CLASSES[cls];if(!cl||!cl.caster)return 0;return(cl.caster==='half'?SLOTS_HALF:SLOTS_FULL)[Math.min(10,lvl)]||0}
function c2New(cls){return['marksman','priest','skald','chemist'].includes(cls)}
// subclasses (priests choose a domain at level 1, chemists a study at level 2, the others at level 3)
Object.assign(SUBCLASSES,{
  marksman:[{key:'gunslinger',name:'Gunslinger',icon:'pistol',flavor:'Fast hands, trick shots and a pistol in each hand.',feats:[['Trick Shot','Lock-On Shot also knocks the target prone if it fails a STR save against your tactic DC.']]},
    {key:'hunter',name:'Professional Hunter',icon:'bow',flavor:'You track your prey across the sea and finish it.',feats:[['Prey Awareness','Your Lock-On bonus die is one size bigger (d6, then d8).']]}],
  priest:[{key:'sky',name:'Sky Domain',icon:'star',flavor:'The god of the sky answers with thunder.',feats:[['Thunderclap','A holy power: everyone within 10 ft of a spot makes a CON save or takes 2d8 thunder.'],['Heavy Armor','You can wear chain mail (AC 16).']]},
    {key:'death',name:'Death Domain',icon:'skull',flavor:'You speak for the dead and borrow their cold.',feats:[['Chill Touch','At will: a ranged power attack, 1d10 necrotic (2d10 at level 5).'],['Reaper','Your Sacred Flame uses d10s instead of d8s.']]}],
  skald:[{key:'warrior',name:'Warrior Verse',icon:'sword',flavor:'Your songs are war chants and your blade keeps the beat.',feats:[['Battle Verse','You can wear medium armor (scale mail).'],['Extra Attack','From level 6 you attack twice with the Attack action.']]},
    {key:'haunting',name:'Haunting Verse',icon:'skull',flavor:'Eerie songs that make enemies hear their own death.',feats:[['Dread Chorus','Dissonant Whispers costs no slot once per short rest.']]}],
  chemist:[{key:'medicine',name:'Medicine Study',icon:'star',flavor:'A doctor first. Nobody dies on your ship.',feats:[['Doctor\'s Hands','Your healing powers heal +your proficiency bonus extra.']]},
    {key:'botany',name:'Botany Study',icon:'flag',flavor:'Poison plants, thorn vines and sleeping spores.',feats:[['Thorn Vines','A power: vines grab everyone in a 10 ft spot, STR save or restrained.']]}]});
function c2SubLevel(cls){return cls==='priest'?1:cls==='chemist'?2:3}
// what you learn at each level (shown on the level-up screen)
Object.assign(LEVEL_FEATS,{
  marksman:{2:[['Fighting Style: Deadeye','+2 to hit with firearms.','Works by itself.','pistol'],['Special Tactics','Tactic slots for Ensnaring Shot and Hail of Bullets (WIS).','Use them in battle.','star']],3:[['Marksman Archetype','Choose Gunslinger or Professional Hunter.','Pick it in the next step.','pistol']],4:[ASI_FEAT],5:[['Extra Attack','Attack twice with the Attack action.','Works by itself.','pistol'],['More tactic slots','6 tactic slots per long rest.','Works by itself.','star']],6:[['Greater Lock-On','Lock-On damage becomes 1d6 and adds your WIS.','Works by itself.','pistol']],7:[['Archetype feature','Your archetype gets stronger.','Works by itself.','star']],8:[ASI_FEAT],9:[['More tactic slots','9 tactic slots per long rest.','Works by itself.','star']],10:[['Trick Shot','Lock-On Shot can be used one more time per long rest.','Works by itself.','pistol']]},
  priest:{2:[['Channel Divinity: Divine Spark','Heal an ally 1d8 + WIS, once per short rest.','When someone is about to fall.','star']],3:[['More holy powers','6 holy power slots per long rest.','Works by itself.','star']],4:[ASI_FEAT],5:[['Sacred Flame 2d8','Your at-will flame grows.','Works by itself.','star'],['More slots','9 holy power slots.','Works by itself.','star']],6:[['Channel Divinity ×2','Divine Spark twice per short rest.','Works by itself.','star']],7:[['More slots','11 holy power slots.','Works by itself.','star']],8:[ASI_FEAT],9:[['More slots','14 holy power slots.','Works by itself.','star']],10:[['Divine Intervention','Once per long rest, ask your god for help (the DM decides).','When all is lost.','star']]},
  skald:{2:[['Jack of All Trades','Add half your proficiency bonus to skills you are not proficient in.','Works by itself.','star']],3:[['Skald Verse','Choose Warrior Verse or Haunting Verse.','Pick it in the next step.','flag']],4:[ASI_FEAT],5:[['Skaldic Verse d8','Your verse die grows to d8, and you regain it on a short rest.','Works by itself.','flag']],6:[['Counterverse','Your songs steady the crew against fear.','Works by itself.','flag']],7:[['More slots','11 spirit power slots.','Works by itself.','star']],8:[ASI_FEAT],9:[['More slots','14 spirit power slots.','Works by itself.','star']],10:[['Skaldic Verse d10','Your verse die grows to d10.','Works by itself.','flag']]},
  chemist:{2:[['Monster Mutation: Tooth','Transform into a Tooth Abomination twice per short rest: temporary HP and +1d6 bite damage on melee hits.','When the fight turns ugly.','skull'],['Chemist Study','Choose Medicine or Botany.','Pick it in the next step.','wheel']],3:[['More invention slots','6 slots per long rest.','Works by itself.','star']],4:[['Monster Mutation: Claw and Fin','Your mutation gets tougher (more temporary HP).','Works by itself.','skull'],ASI_FEAT],5:[['Poison Spray 2d12','Your at-will poison grows.','Works by itself.','wheel']],6:[['Study feature','Your study gets stronger.','Works by itself.','star']],7:[['More slots','11 invention slots.','Works by itself.','star']],8:[['Monster Mutation: Wing and Beast','Even more temporary HP when you mutate.','Works by itself.','skull'],ASI_FEAT],9:[['More slots','14 invention slots.','Works by itself.','star']],10:[['Study feature','Your study gets stronger.','Works by itself.','star']]}});
// the level-up flow asks for the subclass at the class's own level
// ---------- stats ----------
{const _dv=derive;derive=function(b){const D=_dv(b);const cl=CLASSES[b.cls];if(!c2New(b.cls))return D;const lvl=D.lvl;const M=a=>mod(D.ab[a]);const sc=D.subclass;
  // armour: scale mail = 14 + DEX (max 2); Sky Domain priests may wear chain mail
  let armor=b.armor&&b.armor!=='none'?b.armor:cl.armor;if(b.cls==='priest'&&sc&&sc.key==='sky'&&!b.armor)armor='chain';if(b.cls==='skald'&&sc&&sc.key==='warrior'&&!b.armor)armor='scale';
  if(armor==='scale'||armor==='chain'){const acParts=armor==='chain'?[['Chain mail',16]]:[['Scale mail 14',14],['DEX (max 2)',Math.min(2,M('DEX'))]];if(D.weapon.shield)acParts.push(['Shield',2]);const sp=SPECIES[b.species];if(sp&&sp.ac)acParts.push(['Steel Skin',sp.ac]);D.acParts=acParts;D.ac=partsSum(acParts)}
  const fire=['musket','pistol'].includes(b.weapon);
  if(b.cls==='marksman'&&fire){D.atkParts=D.atkParts.filter(p=>p[0]!=='Gunslinger');D.atkParts.push(['Close Quarters Shooter',1]);if(lvl>=2)D.atkParts.push(['Deadeye',2]);D.atk=partsSum(D.atkParts)}
  if(b.cls==='marksman'&&lvl>=5)D.attacks=2;if(b.cls==='skald'&&sc&&sc.key==='warrior'&&lvl>=6)D.attacks=2;
  // Hawk-Eyed: double proficiency in Perception
  if(b.cls==='marksman'&&D.skills.Perception&&D.skills.Perception.prof&&!D.skills.Perception.exp){const s=D.skills.Perception;s.parts.push(['Hawk-Eyed',D.prof]);s.bonus=partsSum(s.parts);s.exp=true}
  // Jack of All Trades
  if(b.cls==='skald'&&lvl>=2)for(const s of Object.values(D.skills))if(!s.prof){s.parts.push(['Jack of All Trades',Math.floor(D.prof/2)]);s.bonus=partsSum(s.parts)}
  const slots=c2Slots(b.cls,lvl);if(slots)D.res.slots={name:cl.pool,max:slots,rest:'long'};
  const spellDC=8+D.prof+M(cl.ab);D.spellDC=spellDC;D.spellAtk=D.prof+M(cl.ab);
  if(b.cls==='marksman')D.res.lockon={name:'Lock-On',max:D.prof+(lvl>=10?1:0),rest:'long'};
  if(b.cls==='priest'&&lvl>=2)D.res.channel={name:'Channel Divinity',max:lvl>=6?2:1,rest:'short'};
  if(b.cls==='skald')D.res.verse={name:'Skaldic Verse',max:Math.max(1,M('CHA')),rest:lvl>=5?'short':'long'};
  if(b.cls==='skald'&&sc&&sc.key==='haunting')D.res.dread={name:'Dread Chorus',max:1,rest:'short'};
  if(b.cls==='chemist'&&lvl>=2)D.res.mutate={name:'Monster Mutation',max:2,rest:'short'};
  const F=[];
  if(b.cls==='marksman'){F.push(['Hawk-Eyed','Double proficiency on Perception.'],['Lock-On',`Mark a target with a shot: +1d${lvl>=6?6:4}${lvl>=6?' + WIS':''} damage. ${D.res.lockon.max} per long rest.`],['Close Quarters Shooter','+1 to hit with firearms, and no disadvantage for shooting next to an enemy.']);if(lvl>=2)F.push(['Deadeye','+2 to hit with firearms.'],['Special Tactics',`Tactics (WIS, save DC ${spellDC}): Ensnaring Shot, Hail of Bullets.`]);if(lvl>=5)F.push(['Extra Attack','Attack twice with the Attack action.'])}
  if(b.cls==='priest'){F.push(['Holy Powers',`WIS, save DC ${spellDC}, attack ${fmt(D.spellAtk)}. Sacred Flame at will; Healing Word, Cure Wounds and Guiding Bolt use slots.`]);if(lvl>=2)F.push(['Divine Spark','Channel Divinity: heal an ally 1d8 + WIS.'])}
  if(b.cls==='skald'){F.push(['Spirit Powers',`CHA, save DC ${spellDC}. Vicious Mockery at will; Healing Word, Thunderwave and Dissonant Whispers use slots.`],['Skaldic Verse',`Bonus action: an ally gets a d${lvl>=10?10:lvl>=5?8:6} to add to their next attack roll.`]);if(lvl>=2)F.push(['Jack of All Trades','Half proficiency on every other skill.'])}
  if(b.cls==='chemist'){F.push(['Invention Powers',`WIS, save DC ${spellDC}. Poison Spray at will; Cure Wounds and Ray of Sickness use slots.`]);if(lvl>=2)F.push(['Monster Mutation','Bonus action, 2 per short rest: mutate for temporary HP and a 1d6 bite on melee hits.'])}
  D.feats=[...F,...D.feats];if(D.clsName===cl.name&&b.weapon==='pistol')D.clsName=cl.name;return D}}
// ================= species in battle: their training, weapons and powers become real actions =================
// Merfolk: trident, spear and net (Merfolk Training), and Merfolk Combat (Ray of Frost at will, Ice Knife from level 3,
//   Rime's Binding Ice from level 5, each levelled power once per long rest, CHA).
// Shandians: spear, halberd, glaive and heavy firearms. Sky Islanders start with a dial (Skypieans with two).
// Octopus fish-men: advantage on grapples with their six arms. Minks: the Sulong transformation from level 3.
// Everyone: Grapple (PHB: replaces an attack; Athletics against the target's STR or DEX; on a win the target can't move).
Object.assign(WEAPONS,{
  trident:{name:'Trident',n:1,d:8,abil:'STR',reach:1,icon:'staff',note:'versatile (1d8 two-handed), can be thrown 20/60 ft'},
  spear:{name:'Spear',n:1,d:8,abil:'STR',reach:1,icon:'staff',note:'versatile (1d8 two-handed), can be thrown 20/60 ft'},
  halberd:{name:'Halberd',n:1,d:10,abil:'STR',reach:2,icon:'axe',note:'heavy, reach 10 ft'},
  glaive:{name:'Glaive',n:1,d:10,abil:'STR',reach:2,icon:'axe',note:'heavy, reach 10 ft'}});
Object.assign(WDTYPE,{trident:'piercing',spear:'piercing',halberd:'slashing',glaive:'slashing'});
function speciesWeapons(b){const sp=b.species,sub=b.sub;if(sp==='merfolk')return['trident','spear'];if(sp==='sky'&&sub==='shandian')return['spear','halberd','glaive','musket'];return[]}
function weaponsFor(b){const cl=CLASSES[b.cls];return[...new Set([...(cl?cl.weapons:[]),...speciesWeapons(b)])]}
// ================= the Player's Handbook classes, as the book writes them =================
// Dungeons & Devil Fruits PHB chapter 3. Feature texts are short summaries in our own words.
// - New: Bruiser, Devilforged, Hybrid, Tinkerer.
// - Fighter and Monk become the book's Warrior and Martial Artist (same engine, the book's features and subclasses).
// - The classic 5e Barbarian stays for characters that already use it, but new pirates pick the Bruiser.
// Features are written for levels 1-20; the main game caps at the level its campaigns reach.
const ASI_TXT='Raise one ability by 2 or two abilities by 1 (max 20), or take a feat.';
const BOOK={
 bruiser:{subName:'Brawling Style',subLvl:3,subAt:[3,6,11,17],asi:[4,8,12,16,19],
  feats:{1:[['Scrapper','Unarmed strikes and bruiser weapons (simple one-handed melee weapons, cutlasses and improvised weapons, no finesse) use your Scrapper die: d6, d8 at 5, d10 at 11, d12 at 17. After the Attack action you can make one unarmed strike or grapple as a bonus action. No armor or shield.'],['Unarmored Defense','Without armor or shield: AC = 10 + DEX + CON.']],
   2:[['Fury','Fury points (2 at level 2, up to 12 at 20) come back after a short rest with 30 minutes of training. Fury save DC = 8 + proficiency + CON. Machine Gun Blows: 1 fury, two unarmed strikes or bruiser weapon attacks as a bonus action after the Attack action. Brute Force: 1 fury, shove or Dash as a bonus action. Brace for Impact: 1 fury, bonus action, temporary HP = Scrapper die + bruiser level.'],['Charge Right Through','While you have at least 1 fury point: advantage on CON saves against traps, powers, poison, disease and breath attacks.']],
   3:[['Blood for Brawn','Once per short rest, as a reaction when you drop to half HP or less: temporary HP = Scrapper die + bruiser level, and all fury points come back.']],
   4:[['Thrill of the Fight','Bonus action, proficiency-bonus times per long rest: a 1-minute frenzy. Advantage on STR checks and saves, resistance to bludgeoning, piercing and slashing, a reaction attack against anyone who hits you in melee. Attacks against you have advantage, and you cannot use powers.']],
   5:[['Extra Attack','Attack twice with the Attack action.'],['Rampage','When you hit with an unarmed strike or bruiser weapon, add one more Scrapper die of damage, but you take one Scrapper die of damage yourself.'],['Fast Movement','+10 ft speed without heavy armor.']],
   6:[['Spirit Assault','Your unarmed strikes and bruiser weapons count as magical (a little Haki in every blow).']],
   7:[['Frenzied Rush','Entering your frenzy also moves you half your speed; if surprised, you can still act on your first turn by entering your frenzy first.'],['Unbending Resolve','Action: end one effect that charms or frightens you.']],
   9:[['Brutal Frenzy','While frenzied, your strikes deal extra damage equal to half your proficiency bonus.']],
   10:[['Unbreakable','Charge Right Through works even with no fury left. Immune to disease and poison.']],
   13:[['Undying Frenzy','Dropping to 0 HP while frenzied: DC 10 CON save (+5 each time) to stay at 1 HP.']],
   14:[['Focused Fury','Entering your frenzy gives back 1 fury point. Spend 1 fury to reroll a failed save.']],
   15:[['Tireless Training','Double carrying capacity, full running jumps from standing, and once per long rest ignore exhaustion from a forced march.']],
   18:[['Invincible','Brace for Impact during your frenzy also gives resistance to all damage but force until your next turn.']],
   20:[['The King','STR and CON +2 (max 22). A long rest gives back all your hit dice.']]},
  subs:[{key:'blackfist',name:'Black Fist Style',icon:'fist',flavor:'Fists coated in thick black Haki. Heroic, with a hint of bloodlust.',
     feats:{3:[['Bonus Proficiency','Athletics (or Acrobatics or Insight if you have it).'],['Demon Stance','Dropping a creature within 5 ft to 0 HP gives you temporary HP = CON modifier + bruiser level.']],6:[['Haki-Coated','Gain one Uncommon Armament Haki advancement feat.']],
       11:[['Bone Crusher','While grappling: a headbutt gives the target disadvantage on attacks until your next turn; spend fury to suplex (CON save, fury spent + 3 Scrapper dice bludgeoning and prone, half on a success).']],17:[['Black Fist Master','Gain one Very Rare or lower Armament Haki advancement feat. Backbreaker: 1 fury to stun a grappled target (CON save).']]}},
   {key:'dragon',name:'Dragon Style',icon:'fist',flavor:'The pride and might of a dragon: raw strength guided by a dragon spirit.',
     feats:{3:[['Dragon Stance','Your strikes can deal fire, cold or lightning damage.'],['Dragon\'s Breath','1 fury, in place of one attack: a 15 ft cone or 30 ft line, DEX save, two Scrapper dice of fire, cold or lightning (half on a success). Three dice from level 11.']],6:[['Thunderous Leap','Brute Force can teleport you 30 ft and give advantage on your next attack.']],
       11:[['Conqueror of Three Worlds','Action, 2 fury: everyone you choose within 20 ft makes a DEX save, two Scrapper dice + CON of fire, thunder or lightning (half on a success). Breath damage lingers on a failed save.']],17:[['Dragon Emperor','Your frenzy wraps you in a dragon aura: anyone who hits you within 30 ft takes a Scrapper die of fire, cold or lightning as a reaction.']]}},
   {key:'beast',name:'Beast Style',icon:'fist',flavor:'You and a tamed beast fight as one.',
     feats:{3:[['Bonus Proficiency','Animal Handling (or Nature or Survival).'],['Beast Companion','A bonded animal (ape, bear, boar, panther, wolf…) that uses your proficiency bonus and grows with you. Command it as a bonus action.'],['Beast Stance','Your companion shares Machine Gun Blows, Brute Force and Brace for Impact.']],
       6:[['Bestial Spirit Assault','Your companion\'s attacks count as magical.'],['Primal Coordination','When you take the Attack action, your companion can attack with its reaction.']],11:[['Vicious Mauling','1 fury, bonus action: your companion attacks everyone it chooses within 5 ft.']],17:[['Chain Frenzy','Your frenzy also gives your companion resistance and extra damage.']]}}]},
 devilforged:{subName:'Devilsmith',subLvl:1,subAt:[1,6,10,14],asi:[4,8,12,16,19],
  feats:{1:[['Devil Fruit Infusion','Green Blood lets you pour Devil Fruit powers into one item, your focus. CHA powers, save DC 8 + proficiency + CHA. Few power slots, all of the same level, and they come back on a short rest. The item cannot be used in seawater or against seastone.'],['Devilsmith','Gear, Blade or Firearm Smithing.']],
   2:[['Sea Devil\'s Emanations','Learn 2 emanations (special tricks of your infused item); more at higher levels.']],
   3:[['Infused Devil Fruit Category','Paramecia (the item becomes any weapon you like), Zoan (a familiar broken off the item, it can attack in your place) or Logia (three cantrips from any list, with your chosen element).']],
   11:[['Fiendish Assimilation','One 6th-level power once per long rest without a slot (7th at 13, 8th at 15, 9th at 17), or steal a Devil Fruit power you see within 30 ft.']],20:[['Devil\'s Bounty','Once per long rest, focus for 1 minute to get all your power slots back.']]},
  subs:[{key:'gear',name:'Gear Smithing',icon:'wheel',flavor:'Infused armor, tools and gear: protection and know-how.',
     feats:{1:[['Tool Proficiency','Smith\'s tools.'],['Armored Up','Medium armor and shields; +1 AC while your infused item is held or worn.']],6:[['Abyssal Enhancement','Once per short rest, add a d10 to an ability check or save after seeing the roll.']],10:[['Resilient Equipment','After a rest, pick a damage type to resist.']],14:[['Devilish Reconstruction','Once per short rest, bonus action: heal 1d8 + devilforged level.']]}},
   {key:'blade',name:'Blade Smithing',icon:'sword',flavor:'Infused blades for duels and close fighting.',
     feats:{1:[['Hell\'s Duelist','Medium armor, shields and martial melee weapons; one bonded weapon uses CHA for attack and damage.'],['Devil\'s Branding','Once per short rest, bonus action: brand a creature within 30 ft for 1 minute. +proficiency damage against it, crits on 19-20, heal when it dies.']],6:[['Echoing Strike','Bonus action, proficiency times per short rest: +10 ft reach, and on a hit everyone within 5 ft of the target takes CHA force damage.']],10:[['Demonic Deflection','Reaction when your branded target hits you: on a d6 roll of 4+, it misses.']],14:[['Archdevil\'s Branding','When the branded creature dies, move the brand to another within 30 ft.']]}},
   {key:'firearm',name:'Firearm Smithing',icon:'pistol',flavor:'Infused guns and cannons: range and raw power.',
     feats:{1:[['Hellfire Artillery','Martial ranged weapons. Proficiency times per long rest, bonus action: a cannon grows from your item for 1 minute; bonus action shots at 60 ft for 1d8 + CHA fire, cold or lightning (2d8 at 10).']],6:[['Nether Scope','Darkvision 60 ft, Perception or Insight, resistance to fire.'],['Blinding Flare','Reaction: impose disadvantage on an attack against someone within 60 ft (the cannon crumbles).']],10:[['Exploding Shrapnel Shot','Once per long rest, a cannon shot explodes as a 5th-level fireball that also slows.']],14:[['Hellstorm Artillery','Two cannons at once, 120 ft range.']]}}],
  options:{name:'Sea Devil\'s Emanations',list:[['Demonic Protection','Mage armor on yourself at will.'],['Devil\'s Sight','See in any darkness to 120 ft.'],['Fiendish Vigor','False life on yourself at will.'],['Mask of Many Faces','Disguise self at will.'],['Misty Visions','Silent image at will.'],['Silver Tongue','Deception and Persuasion.'],['Stable Infusion','Advantage on concentration saves.'],['Thief of Five Fates','Bane once per long rest.'],['Agonizing Blast','Eldritch blast adds CHA to damage.'],['Repelling Blast','Eldritch blast pushes 10 ft.'],['Improved Paramecia Weapon','+1 to your infused weapon (Paramecia).'],['Burning Blood','No sleep needed (Logia).'],['Greater Logia Powers','Two 1st-level powers from any list (Logia).'],['Greater Zoan Form','Your familiar flies, attacks on command and resists damage (Zoan).'],['Cloak of Shadows','Invisible in dim light (level 5).'],['Ice Tomb','Once per short rest, encase yourself in ice for 10 temp HP per level (level 5).'],['Paramecia Smite','Spend a slot for +1d8 force per slot level and knock prone (level 5).'],['Ricocheting Strike','Attack twice with your paramecia weapon (level 5).'],['Spring Step','Levitate at will (level 9).'],['Shroud of Shadow','Invisibility at will (level 15).']]}},
 hybrid:{subName:'Hybrid Lineage',subLvl:1,subAt:[1,6,14,18],asi:[4,8,12,16,19],
  feats:{1:[['Hybrid Powers','Lineage factors in your blood fuel CHA powers. Save DC 8 + proficiency + CHA. Slots come back on a long rest.'],['Hybrid Lineage','Seraphim, Germa or Beast.']],
   2:[['Hybrid Points','Points equal to your level (from 2), back on a long rest. Turn points into slots (2, 3, 5, 6, 7 points for slot levels 1 to 5) or slots into points.']],
   3:[['Power Enhancements','Two ways to bend your powers (more at 10 and 17): Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted or Twinned.']],
   5:[['Hybrid Resilience','Spend 1 hybrid point to reroll a failed ability check.']],20:[['Hybrid Restoration','A short rest gives back 4 hybrid points.']]},
  subs:[{key:'seraphim',name:'Seraphim Lineage',icon:'star',flavor:'Lunarian blood: tough, fiery, with black wings later.',
     feats:{1:[['Lunarian Blessing','Once per short rest, add 2d4 to a failed save or missed attack.'],['Angelic Resilience','+1 HP per level. Without armor, AC = 13 + DEX.']],6:[['Flame Affinity','Add CHA to fire power damage; 1 point for fire resistance for an hour.']],14:[['Celestial Wings','Bonus action: fly at your speed.']],18:[['Heavenly Presence','5 points: a 60 ft aura of awe or fear (WIS save).']]}},
   {key:'germa',name:'Germa Lineage',icon:'sword',flavor:'Bred by Germa scientists for strength, toughness and speed.',
     feats:{1:[['Bonus Proficiencies','Shields, simple and martial weapons.'],['Elemental Powers','You may also learn smite powers and magic weapon.'],['Soldier\'s Durability','+1 HP per level. Action: AC 13 + CON without armor (steel skin).']],6:[['Elemental Absorption','Resist fire, lightning, thunder or poison; taking it charges your next power with +1d6.']],14:[['Modified Flesh','Bonus action, points: see invisible, fly, swim or slip through gaps for 10 minutes.']],18:[['Warping Implosion','Once per long rest: teleport 120 ft and pull nearby enemies (STR save, 3d10 force).']]}},
   {key:'beast',name:'Beast Lineage',icon:'skull',flavor:'Beast lineage factors since birth: fur, scales or feathers.',
     feats:{1:[['Animalistic Traits','Swim and breathe water, or fly, or +5 ft speed and hide in light cover.'],['Sharpened Vision','Darkvision 120 ft; see invisibility from level 3 for 2 points.']],6:[['Bestial Defense','Resist psychic. Once per short rest, reaction: reduce weapon damage by level + CHA and move 30 ft safely.']],14:[['Flexible Body','Half damage from opportunity attacks, move through enemies and 3-inch gaps.']],18:[['Final Evolution','No food or sleep, crits become normal hits, resist weapon damage.']]}}]},
 tinkerer:{subName:'Tinkerer Study',subLvl:2,subAt:[2,6,10,14],asi:[4,8,12,16,19],
  feats:{1:[['Creation Powers','INT powers from your gadget and blueprints. Prepare INT + level powers after a long rest. Save DC 8 + proficiency + INT.'],['Recharging','Once a day after a short rest, recover slots worth up to half your level (rounded up).']],
   2:[['Tinkerer Study','Military Science, Meteorology or Robotics.']],3:[['Adaptive Cantrip Technology','After a long rest, swap one cantrip.']],18:[['Master of Innovation','One 1st- and one 2nd-level power at will.']],20:[['Ultimate Technology','Two 3rd-level signature powers, once per short rest each for free.']]},
  subs:[{key:'military',name:'Military Science',icon:'wheel',flavor:'Technology for war: shields, tactics and power surges.',
     feats:{2:[['Deflector Shield','Reaction when hit or failing a save: +2 AC or +4 to the save (then only cantrips until your next turn).'],['Tactical Mind','Add INT to initiative.']],6:[['Power Surge','Store surges (up to INT); spend one for +level force damage on a damaging power.']],10:[['Durable Tech','While concentrating: +2 AC and saves.']],14:[['Deflecting Shroud','Deflector Shield also zaps up to three creatures for half your level.']]}},
   {key:'meteo',name:'Meteorology',icon:'star',flavor:'Weather machines in the style of Weatheria.',
     feats:{2:[['Cloud Surfing','Bonus action around a power: fly 10 ft on a cloud without opportunity attacks.']],6:[['Storm Forecasting','Resist lightning and thunder; casting such powers zaps nearby enemies for half your level.']],10:[['Weather Control','Stop rain or make a 20 ft storm (proficiency times per long rest).']],14:[['Thunder Counter','Reaction when hit in melee: thunder damage = level and a push (STR save).']]}},
   {key:'robotics',name:'Robotics',icon:'wheel',flavor:'Automatons and robots that help in tasks and fights.',
     feats:{2:[['Machine Summoning','Your summoned creatures are robots; copying summoning powers costs half.'],['Simple Robots','Action: build a tiny robot or gadget that does simple tasks within 30 ft.']],6:[['Quantum Teleportation','Teleport 30 ft or swap places with your robot (once per long rest).']],10:[['Autopilot Controls','Damage cannot break concentration on summoning powers.']],14:[['Reinforced Exterior','Your summoned creatures have 30 temporary HP.']]}}]},
 fighter:{name:'Warrior',subName:'Warrior Type',subLvl:3,subAt:[3,7,10,15,18],asi:[4,6,8,12,14,16,19],
  feats:{1:[['Fighting Style','Aiming, Close Quarters Shooter, Defense, Dueling, Great Weapon Fighting, Interception, Mariner, Protection, Thrown Weapon Fighting or Two-Weapon Fighting.'],['Second Wind','Once per short rest, bonus action: heal 1d10 + warrior level.']],
   2:[['Action Surge','Once per short rest, take one extra action (twice from 17).']],5:[['Extra Attack','Attack twice with the Attack action (three times at 11, four at 20).']],9:[['Indomitable','Reroll a failed save once per long rest (twice at 13, three times at 17).']]},
  subs:[{key:'cursed',name:'Cursed Soul',icon:'skull',flavor:'A cursed weapon or a tainted spirit: something evil lives in you.',
     feats:{3:[['Champion of Malice','Cursed Spirit dice (2 × proficiency, d6, d8 at 5, d10 at 11, d12 at 17), back on a long rest; regain one as a bonus action once per short rest. Curse DC 8 + proficiency + INT.'],['Demon Strike','Once per turn after a weapon hit: spend a die for die + INT necrotic, psychic or radiant.'],['Arms of Asura','After a hit, spend a die to hit another creature next to the target with a mirrored attack.']],
       7:[['Evil\'s Embrace','Fallen Angel Wings (fly for a turn), Purgatory Strike (Demon Strike pushes or knocks prone), Hellish Glare (frighten, WIS save).']],10:[['Shepherd of Spirits','Resist psychic; spend a die to end charm or fear.']],15:[['Silver Mist','Once per long rest: extra spirit arms for a minute, advantage on one attack each turn and +2 AC.']],18:[['Jest of the Dead','Silver Mist grows heads and arms: knock targets prone, advantage against blinding and stuns, Demon Strike on every attack.']]}},
   {key:'blackweapon',name:'Black Weapon',icon:'sword',flavor:'So much willpower poured into your weapon that it turns black.',
     feats:{3:[['Sharpened Spirit','Your weapon attacks crit on 19-20.']],7:[['Haki Weapon','Gain one Uncommon Armament Haki advancement feat.']],10:[['Improved Style','A second Fighting Style.']],15:[['Superior Sharpened Spirit','Crits on 18-20.']],18:[['Haki Weapon Master','Gain one Very Rare or lower Armament Haki advancement feat.']]}},
   {key:'elemental',name:'Elemental Weapon',icon:'sword',flavor:'Fire, ice or lightning through your blade, the way Wano samurai fight.',
     feats:{3:[['Elementalist','INT powers from the tinkerer list (a third of a full caster\'s slots).'],['Weapon Bond','Up to three bonded weapons; spend a slot on a hit for +2d6 fire, cold or lightning (+1d6 per slot level above 1st).']],7:[['Dance of Elements','After casting a cantrip, a weapon attack as a bonus action.']],10:[['Water Siphon','Your weapon hits give disadvantage on the next save against your powers.']],15:[['Lightning Dash','Action Surge also teleports you 30 ft.']],18:[['Improved Dance of Elements','After casting any power, a weapon attack as a bonus action.']]}}]},
 monk:{name:'Martial Artist',subName:'Martial Arts School',subLvl:3,subAt:[3,6,11,17],asi:[4,8,12,16,19],
  feats:{1:[['Unarmored Defense','Without armor or shield: AC = 10 + DEX + WIS.'],['Martial Arts','Unarmed strikes and martial artist weapons can use DEX and your Martial Arts die (d6, d8 at 5, d10 at 11, d12 at 17); after the Attack action, one unarmed strike as a bonus action.']],
   2:[['Ki','Ki points equal to your level, back after a short rest. Swift Barrage: 1 ki, two unarmed strikes as a bonus action. Shifting Body: 1 ki, Dodge as a bonus action. Whirlwind Step: 1 ki, Disengage and Dash, double jump.'],['Unarmored Movement','+10 ft speed (+15 at 6, +20 at 10, +25 at 14, +30 at 18).'],['Soul Weapon','After a rest, make one weapon you know a martial artist weapon.']],
   3:[['Deflect Projectile','Reaction: reduce ranged weapon damage by 1d10 + DEX + level; at 0, 1 ki to throw it back.'],['Ki-Fueled Attack','After spending ki in your action, one bonus attack.']],
   4:[['Slow Fall','Reaction: reduce falling damage by 5 × level.'],['Heart Chakra','Action, 2 ki: heal a Martial Arts die + proficiency.']],
   5:[['Extra Attack','Attack twice with the Attack action.'],['Stunning Strike','1 ki on a melee hit: CON save or stunned until your next turn.'],['Focused Aim','After a miss, 1 to 3 ki for +2 each to the roll.']],
   6:[['Solar Plexus Chakra','Your unarmed strikes can deal force damage.']],7:[['Evasion','DEX saves for half: none on a success, half on a failure.'],['Stomach Chakra','Once per long rest, rest 1 minute for the benefits of a short rest.']],
   9:[['Acrobatic Movement','Run up walls and across water.']],10:[['Root Chakra','Bonus action: end charm, fear or poison; no exhaustion from hunger.']],13:[['Throat Chakra','Telepathy 30 ft.'],['Deflect Energy','Deflect any ranged attack.']],14:[['Crown Chakra','Proficient in all saves; 1 ki to reroll a failed save.']],
   15:[['Sacral Chakra','Roll initiative with 3 ki or fewer: back up to 4.']],18:[['Third Eye Chakra','3 ki: resist all damage but force for a minute.']],20:[['Death Chakra','At 0 HP, 4 ki: your HP becomes four Martial Arts dice.']]},
  subs:[{key:'sixpowers',name:'Six Powers',icon:'fist',flavor:'The superhuman style of government assassins: Finger Pistol, Tempest Kick, Shave.',
     feats:{3:[['Finger Pistol','Unarmed strikes can deal piercing damage.'],['Tempest Kick','In place of a melee attack: a 30 ft air slice, DEX to hit, Martial Arts die slashing (force from 6). 1 ki to replace all your attacks.']],6:[['Iron Body','Deflect Projectile also works on melee weapon attacks; redirect them for 1 ki.']],11:[['Shave','Bonus action, proficiency times per long rest (then 1 ki): teleport 60 ft and get advantage on the next melee attack.'],['Moon Walk','Whirlwind Step lets you fly until your next turn; Slow Fall stops all falling damage.']],17:[['Six King Gun','3 ki on an unarmed hit: CON save or drop to 0 HP, otherwise 10d10 force. You cannot act next turn.']]}},
   {key:'fishkarate',name:'Fish-Man Karate',icon:'fist',flavor:'Control the water in the air and in your enemy\'s body.',
     feats:{3:[['Water Adept','Your melee attacks can deal cold damage.'],['Arabesque Tile True Punch','Swift Barrage hits can knock prone (DEX), push 15 ft (STR) or stop reactions.']],6:[['Five Thousand Tile True Punch','After the Attack action, 2 ki: a 15 ft cone, DEX save, three Martial Arts dice cold (+1 die per extra ki).'],['Wrath of the Sea','Your strikes deal extra cold damage equal to half your proficiency bonus.']],
       11:[['Sharkskin Palm Block','Once per long rest (or 4 ki): a 30 ft water aura, resistance for allies and cold damage to attackers.']],17:[['Shark Pack Attack','Spend ki for water sharks (one per ki) at 120 ft: two Martial Arts dice cold and restrained each.']]}},
   {key:'kamakenpo',name:'New Kama Kenpo',icon:'fist',flavor:'The fabulous dancing kicks of the Okama masters of Kamabakka.',
     feats:{3:[['Okama Way','Performance and disguise kits; add WIS to Charisma checks while dressed up.'],['Spinning Spa','Swift Barrage also Disengages and adds 20 ft speed.']],6:[['Kick Claw First Pointe','Reaction when an enemy comes within 15 ft: leap to it and strike; on a hit its speed drops to 0.']],11:[['Awakening of the Maiden','2 ki to cancel disadvantage; stand up for free.']],17:[['Galaxy Spin','Swift Barrage makes a third attack, and anyone you hit has disadvantage against you.']]}}]}};
// ---------- the class entries the engine needs ----------
Object.assign(WEAPONS,{club:{name:'Club',n:1,d:4,abil:'STR',reach:1,icon:'staff',note:'light, simple'},dagger:WEAPONS.dagger||{name:'Dagger',n:1,d:4,abil:'FIN',reach:1,finesse:true,icon:'dagger',note:'finesse, light, thrown 20/60 ft'},
  cutlass:WEAPONS.cutlass||{name:'Cutlass',n:1,d:6,abil:'STR',reach:1,icon:'sword',note:'a sailor\'s sword'}});
Object.assign(WDTYPE,{club:'bludgeoning'});
Object.assign(CLASSES,{
  bruiser:{name:'Bruiser',hd:12,icon:'fist',saves:['STR','CON'],pick:2,list:['Acrobatics','Athletics','Persuasion','Intimidation','Perception','Animal Handling','Survival'],weapons:['unarmed','cutlass','club','quarterstaff'],armor:'bar',blurb:'A scrapper who fights with fists, clubs and fury. Takes a beating and gives back more.'},
  devilforged:{name:'Devilforged',hd:8,icon:'wheel',saves:['WIS','CHA'],pick:2,list:['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'],weapons:['musket','quarterstaff','dagger'],armor:'leather',caster:'pact',ab:'CHA',pool:'Devil power slots',book:'Devilforged',blurb:'Forges Devil Fruit power into a weapon or tool with Green Blood. Never ate a fruit, still wields one.'},
  hybrid:{name:'Hybrid',hd:6,icon:'star',saves:['CON','CHA'],pick:2,list:['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'],weapons:['quarterstaff','musket','dagger'],armor:'none',caster:'full',ab:'CHA',pool:'Hybrid power slots',book:'Hybrid',blurb:'Ancient lineage factors in the blood: Lunarian fire, Germa steel or beast traits.'},
  tinkerer:{name:'Tinkerer',hd:6,icon:'wheel',saves:['INT','WIS'],pick:2,list:['Arcana','History','Insight','Investigation','Medicine','Religion'],weapons:['quarterstaff','musket','dagger'],armor:'none',caster:'full',ab:'INT',pool:'Creation slots',book:'Tinkerer',blurb:'An inventor with a gadget and blueprints: weather machines, robots and war tech.'}});
CLASSES.fighter.name='Warrior';CLASSES.fighter.blurb='Trained in armed combat: soldiers, samurai and bounty hunters.';CLASSES.fighter.list=['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'];
CLASSES.monk.name='Martial Artist';CLASSES.monk.blurb='Six Powers, Fish-Man Karate or New Kama Kenpo: the body is the weapon.';CLASSES.monk.list=['Acrobatics','Athletics','History','Insight','Religion','Stealth'];CLASSES.monk.saves=['STR','DEX'];
CLASSES.barbarian.name='Barbarian (classic 5e)';CLASSES.barbarian.legacy=true;
const BOOK_CLS=new Set(Object.keys(BOOK));
function bookSub(b){const B=BOOK[b.cls];return B&&(B.subs.find(s=>s.key===b.subclass)||null)}
// subclasses: the book's, plus the old 5e ones kept only for characters that already have them
for(const [k,B] of Object.entries(BOOK)){const old=(SUBCLASSES[k]||[]).map(s=>({...s,legacy:true}));
  SUBCLASSES[k]=[...B.subs.map(s=>({key:s.key,name:s.name,icon:s.icon,flavor:s.flavor,feats:Object.entries(s.feats).filter(([L])=>+L<=B.subLvl).flatMap(([,f])=>f)})),...old]}
const visibleSubs=(cls,cur)=>(SUBCLASSES[cls]||[]).filter(s=>!s.legacy||s.key===cur);
// level-up screen texts
for(const [k,B] of Object.entries(BOOK)){LEVEL_FEATS[k]={};for(let L=2;L<=20;L++){const out=[...(B.feats[L]||[]).map(f=>[f[0],f[1],'Works as described.','star'])];
  if(B.asi.includes(L))out.push(ASI_FEAT);if(L===B.subLvl&&L>1)out.push([B.subName,'Choose your '+B.subName.toLowerCase()+'.','Pick it in the next step.','star']);if(B.subAt.includes(L)&&L>B.subLvl)out.push([B.subName+' feature','A new feature from your '+B.subName.toLowerCase()+'.','See your sheet.','star']);if(out.length)LEVEL_FEATS[k][L]=out}}
{const _sl=c2SubLevel;c2SubLevel=function(cls){return BOOK[cls]?BOOK[cls].subLvl:_sl(cls)}}
{const _cn=c2New;c2New=function(cls){return['devilforged','hybrid','tinkerer'].includes(cls)||_cn(cls)}}
{const _al=asiLevels;asiLevels=function(cls){return BOOK[cls]?BOOK[cls].asi.filter(L=>L<=MAX_LEVEL):_al(cls)}}
CLASSES.devilforged.sub1=true;CLASSES.hybrid.sub1=true;
// slots: devilforged pact slots (few, one level, short rest); the Elemental Weapon warrior is a third caster
const PACT=[[0,0],[1,1],[2,1],[2,2],[2,2],[2,3],[2,3],[2,4],[2,4],[2,5],[2,5],[3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5]];
const THIRD=[0,0,0,2,3,3,3,6,6,6,7,7,7,9,9,9,10,10,10,11,11];
const scrapDie=l=>l>=17?12:l>=11?10:l>=5?8:6,maDie=l=>l>=17?12:l>=11?10:l>=5?8:6;
const FURY=[0,0,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,12];
// ---------- numbers ----------
{const _dv=derive;derive=function(b){const D=_dv(b);if(!BOOK[b.cls])return D;const B=BOOK[b.cls];const lvl=D.lvl;const M=a=>mod(D.ab[a]);const sc=bookSub(b);
  // features: the book's class and subclass features up to this level, then feats, ASI and fruit notes from the engine
  const keep=D.feats.filter(f=>/\((origin feat|level \d+ feat)\)$|^Ability Score Improvement$|^Devil Fruit user$/.test(f[0]));
  const F=[];for(let L=1;L<=lvl;L++)for(const f of (B.feats[L]||[]))F.push([f[0],f[1]]);
  if(sc)for(let L=1;L<=lvl;L++)for(const f of (sc.feats[L]||[]))F.push([f[0]+' ('+sc.name+')',f[1]]);
  const oldSc=D.subclass&&D.subclass.legacy?D.subclass:null;if(oldSc)for(const f of oldSc.feats)F.push([f[0]+' ('+oldSc.name+')',f[1]]);
  D.feats=[...F,...keep];D.bookSub=sc;
  if(b.cls==='bruiser'){const bw=['unarmed','cutlass','club','quarterstaff','handaxe'].includes(b.weapon);const sd=scrapDie(lvl);
    if(bw&&(D.die<sd||b.weapon==='unarmed')){D.die=sd;D.n=1;D.dieNote='Scrapper die'}D.abil='STR';D.atkParts=[['STR',M('STR')],['Proficiency',D.prof]];D.atk=partsSum(D.atkParts);D.dmgParts=[['STR',M('STR')]];D.dmgMod=partsSum(D.dmgParts);
    D.attacks=lvl>=5?2:1;if(lvl>=5)D.speed+=10;D.res={...Object.fromEntries(Object.entries(D.res).filter(([k])=>!['rage'].includes(k)))};
    if(lvl>=2)D.res.fury={name:'Fury points',max:FURY[Math.min(20,lvl)],rest:'short'};if(lvl>=3)D.res.blood={name:'Blood for Brawn',max:1,rest:'short'};if(lvl>=4)D.res.frenzy={name:'Thrill of the Fight',max:D.prof,rest:'long'};
    D.scrap=sd;D.furyDC=8+D.prof+M('CON')}
  if(b.cls==='monk'){D.res.focus&&(D.res.focus.name='Ki points');if(sc&&sc.key==='sixpowers'&&lvl>=11)D.res.shave={name:'Shave',max:D.prof,rest:'long'};if(sc&&sc.key==='fishkarate'&&lvl>=11)D.res.sharkskin={name:'Sharkskin Palm Block',max:1,rest:'long'};D.kiDC=8+D.prof+M('WIS')}
  if(b.cls==='fighter'){D.res.wind={name:'Second Wind',max:1,rest:'short'};if(lvl>=2)D.res.surge={name:'Action Surge',max:lvl>=17?2:1,rest:'short'};if(lvl>=9)D.res.indom={name:'Indomitable',max:lvl>=17?3:lvl>=13?2:1,rest:'long'};
    if(sc&&sc.key==='blackweapon')D.critMin=lvl>=15?18:19;
    if(sc&&sc.key==='cursed'&&lvl>=3){D.res.cursed={name:`Cursed Spirit dice (d${lvl>=17?12:lvl>=11?10:lvl>=5?8:6})`,max:2*D.prof,rest:'long'};D.curseDie=lvl>=17?12:lvl>=11?10:lvl>=5?8:6;D.spellDC=8+D.prof+M('INT')}
    if(sc&&sc.key==='elemental'&&lvl>=3){D.res.slots={name:'Elemental power slots',max:THIRD[Math.min(20,lvl)],rest:'long'};D.spellDC=8+D.prof+M('INT');D.spellAtk=D.prof+M('INT')}}
  if(b.cls==='devilforged'){const p=PACT[Math.min(20,lvl)];D.res.slots={name:`Devil power slots (level ${p[1]})`,max:p[0],rest:'short'};D.pactLvl=p[1];if(lvl>=11)D.res.assim={name:'Fiendish Assimilation',max:1,rest:'long'};
    if(sc&&sc.key==='blade')D.res.brand={name:'Devil\'s Branding',max:1,rest:'short'};if(sc&&sc.key==='firearm')D.res.artillery={name:'Hellfire Artillery',max:D.prof,rest:'long'};if(sc&&sc.key==='gear'){D.acParts.push(['Armored Up',1]);D.ac=partsSum(D.acParts)}}
  if(b.cls==='hybrid'){if(lvl>=2)D.res.hpts={name:'Hybrid points',max:lvl,rest:'long'};if(sc&&(sc.key==='seraphim'||sc.key==='germa')){D.hpParts.push([sc.name,lvl]);D.maxhp+=lvl}
    if(sc&&sc.key==='seraphim'&&!b.armor){D.acParts=[['Angelic Resilience 13',13],['DEX',M('DEX')]];D.ac=partsSum(D.acParts)}if(sc&&sc.key==='seraphim')D.res.blessing={name:'Lunarian Blessing',max:1,rest:'short'}}
  if(b.cls==='tinkerer'){D.res.recharge={name:'Recharging',max:1,rest:'long'};if(sc&&sc.key==='military'){D.initParts.push(['Tactical Mind',M('INT')]);D.init=partsSum(D.initParts)}}
  return D}}
// ---------- the Bruiser's frenzy halves weapon damage ----------
{const _pr=pcResists;pcResists=function(c,dt){const r=_pr(c,dt);if(r)return r;if(c&&c.cond&&c.cond.frenzy&&['bludgeoning','piercing','slashing'].includes(dt))return'half';return null}}

CLASSES.fighter.pool="Elemental power slots";CLASSES.monk.pool="Ki points";CLASSES.bruiser.pool="Fury points";
