# D&D 5e SRD creatures (Systems Reference Document 5.1, CC-BY-4.0): name, cr, type, ac, hp, hit dice, speed, abilities, attacks, notes
# attacks: [name, to-hit, dice, type]  or  [name, None, dice, type, DC, save, half]
import json
R=[
('Commoner','0','Medium humanoid',10,4,'1d8','30 ft.',[10,10,10,10,10,10],[['Club',2,'1d4','bludgeoning']],'',[]),
('Acolyte','1/4','Medium humanoid',10,9,'2d8','30 ft.',[10,10,10,10,14,11],[['Club',2,'1d4','bludgeoning']],'',[['Spellcasting','Cleric 1st level, spell save DC 12: sacred flame, light, thaumaturgy; bless, cure wounds, sanctuary (3 slots).']]),
('Bandit','1/8','Medium humanoid',12,11,'2d8+2','30 ft.',[11,12,12,10,10,10],[['Scimitar',3,'1d6+1','slashing'],['Light crossbow',3,'1d8+1','piercing']],'',[]),
('Bandit Captain','2','Medium humanoid',15,65,'10d8+20','30 ft.',[15,16,14,14,11,14],[['Scimitar',5,'1d6+3','slashing'],['Dagger',5,'1d4+3','piercing']],'Three attacks: two scimitar and one dagger.',[['Reaction: Parry','+2 AC against one melee attack that would hit.']]),
('Cultist','1/8','Medium humanoid',12,9,'2d8','30 ft.',[11,12,10,10,11,10],[['Scimitar',3,'1d6+1','slashing']],'',[['Dark Devotion','Advantage on saves against being charmed or frightened.']]),
('Cult Fanatic','2','Medium humanoid',13,33,'6d8+6','30 ft.',[11,14,12,10,13,14],[['Dagger',4,'1d4+2','piercing'],['Inflict Wounds',4,'3d10','necrotic']],'Two melee attacks.',[['Spellcasting','Spell save DC 11, +3 to hit: sacred flame; command, inflict wounds, shield of faith (4); hold person, spiritual weapon (3).']]),
('Guard','1/8','Medium humanoid',16,11,'2d8+2','30 ft.',[13,12,12,10,11,10],[['Spear',3,'1d6+1','piercing']],'',[]),
('Thug','1/2','Medium humanoid',11,32,'5d8+10','30 ft.',[15,11,14,10,10,11],[['Mace',4,'1d6+2','bludgeoning'],['Heavy crossbow',2,'1d10','piercing']],'Two melee attacks.',[['Pack Tactics','Advantage on attacks if an ally is within 5 ft. of the target.']]),
('Scout','1/2','Medium humanoid',13,16,'3d8+3','30 ft.',[11,14,12,11,13,11],[['Shortsword',4,'1d6+2','piercing'],['Longbow',4,'1d8+2','piercing']],'Two melee or two ranged attacks.',[['Keen Hearing and Sight','Advantage on Perception that relies on hearing or sight.']]),
('Spy','1','Medium humanoid',12,27,'6d8','30 ft.',[10,15,10,12,14,16],[['Shortsword',4,'1d6+2','piercing'],['Hand crossbow',4,'1d6+2','piercing']],'Two melee attacks.',[['Cunning Action','Dash, Disengage or Hide as a bonus action.'],['Sneak Attack','+2d6 once per turn with advantage or an ally next to the target.']]),
('Noble','1/8','Medium humanoid',15,9,'2d8','30 ft.',[11,12,11,12,14,16],[['Rapier',3,'1d8+1','piercing']],'',[['Reaction: Parry','+2 AC against one melee attack.']]),
('Priest','2','Medium humanoid',13,27,'5d8+5','30 ft.',[10,10,12,13,16,13],[['Mace',2,'1d6','bludgeoning'],['Sacred Flame',None,'1d8','radiant',13,'DEX',0]],'',[['Spellcasting','Spell save DC 13: cure wounds, guiding bolt, sanctuary (4); lesser restoration, spiritual weapon (3); dispel magic, spirit guardians (2).']]),
('Berserker','2','Medium humanoid',13,67,'9d8+27','30 ft.',[16,12,17,9,11,9],[['Greataxe',5,'1d12+3','slashing']],'',[['Reckless','Advantage on melee attacks; attacks against it have advantage too.']]),
('Veteran','3','Medium humanoid',17,58,'9d8+18','30 ft.',[16,13,14,10,11,10],[['Longsword',5,'1d8+3','slashing'],['Shortsword',5,'1d6+3','piercing'],['Heavy crossbow',3,'1d10+1','piercing']],'Two longsword attacks, plus a shortsword attack if it has one drawn.',[]),
('Knight','3','Medium humanoid',18,52,'8d8+16','30 ft.',[16,11,14,11,11,15],[['Greatsword',5,'2d6+3','slashing'],['Heavy crossbow',2,'1d10','piercing']],'Two melee attacks.',[['Brave','Advantage on saves against being frightened.'],['Leadership','1/short rest: allies within 30 ft. add 1d4 to attacks and saves for 1 minute.']]),
('Gladiator','5','Medium humanoid',16,112,'15d8+45','30 ft.',[18,15,16,10,12,15],[['Spear',7,'2d6+4','piercing'],['Shield Bash',7,'2d4+4','bludgeoning']],'Three melee attacks or two ranged.',[['Brave','Advantage on saves against being frightened.'],['Brute','One extra die on melee weapon hits (included).']]),
('Mage','6','Medium humanoid',12,40,'9d8','30 ft.',[9,14,11,17,12,11],[['Dagger',5,'1d4+2','piercing'],['Fire Bolt',6,'2d10','fire'],['Fireball',None,'8d6','fire',14,'DEX',1],['Cone of Cold',None,'8d8','cold',14,'CON',1]],'',[['Spellcasting','Spell save DC 14, +6 to hit. Slots 4/3/3/3/1: magic missile, shield, misty step, suggestion, counterspell, fireball, fly, greater invisibility, ice storm, cone of cold.']]),
('Assassin','8','Medium humanoid',15,78,'12d8+24','30 ft.',[11,16,14,13,11,10],[['Shortsword',6,'1d6+3+7d6','piercing + poison'],['Light crossbow',6,'1d8+3+7d6','piercing + poison']],'Two shortsword attacks.',[['Assassinate','Advantage on creatures that have not acted; hits on surprised creatures are critical.'],['Sneak Attack','+4d6 once per turn.'],['Evasion','No damage on a successful DEX save for half.']]),
('Kobold','1/8','Small humanoid',12,5,'2d6-2','30 ft.',[7,15,9,8,7,8],[['Dagger',4,'1d4+2','piercing'],['Sling',4,'1d4+2','bludgeoning']],'',[['Pack Tactics','Advantage if an ally is next to the target.'],['Sunlight Sensitivity','Disadvantage in sunlight.']]),
('Goblin','1/4','Small humanoid',15,7,'2d6','30 ft.',[8,14,10,10,8,8],[['Scimitar',4,'1d6+2','slashing'],['Shortbow',4,'1d6+2','piercing']],'',[['Nimble Escape','Disengage or Hide as a bonus action.']]),
('Hobgoblin','1/2','Medium humanoid',18,11,'2d8+2','30 ft.',[13,12,12,10,10,9],[['Longsword',3,'1d8+1','slashing'],['Longbow',3,'1d8+1','piercing']],'',[['Martial Advantage','+2d6 once per turn when an ally is next to the target.']]),
('Orc','1/2','Medium humanoid',13,15,'2d8+6','30 ft.',[16,12,16,7,11,10],[['Greataxe',5,'1d12+3','slashing'],['Javelin',5,'1d6+3','piercing']],'',[['Aggressive','Bonus action: move up to its speed toward an enemy.']]),
('Gnoll','1/2','Medium humanoid',15,22,'5d8','30 ft.',[14,12,11,6,10,7],[['Bite',4,'1d4+2','piercing'],['Spear',4,'1d6+2','piercing'],['Longbow',3,'1d8+1','piercing']],'',[['Rampage','When it drops a creature to 0 HP: bonus action move half and bite.']]),
('Bugbear','1','Medium humanoid',16,27,'5d8+5','30 ft.',[15,14,13,8,11,9],[['Morningstar',4,'2d8+2','piercing'],['Javelin',4,'1d6+2','piercing']],'',[['Surprise Attack','+2d6 against a surprised creature in the first round.']]),
('Skeleton','1/4','Medium undead',13,13,'2d8+4','30 ft.',[10,14,15,6,8,5],[['Shortsword',4,'1d6+2','piercing'],['Shortbow',4,'1d6+2','piercing']],'',[['Vulnerable','Bludgeoning damage. Immune to poison.']]),
('Zombie','1/4','Medium undead',8,22,'3d8+9','20 ft.',[13,6,16,3,6,5],[['Slam',3,'1d6+1','bludgeoning']],'',[['Undead Fortitude','At 0 HP: CON save DC 5 + damage taken (not radiant or crits) to drop to 1 HP instead.']]),
('Ghoul','1','Medium undead',12,22,'5d8','30 ft.',[13,15,10,7,10,6],[['Bite',2,'2d6+2','piercing'],['Claws',4,'2d4+2','slashing']],'',[['Paralyzing Claws','Non-elf hit by claws: CON save DC 10 or paralyzed for 1 minute (repeat save each turn).']]),
('Wight','3','Medium undead',14,45,'6d8+18','30 ft.',[15,14,16,10,13,15],[['Longsword',4,'1d8+2','slashing'],['Life Drain',4,'1d6+2','necrotic'],['Longbow',4,'1d8+2','piercing']],'Two longsword attacks or two longbow attacks; one longsword can be Life Drain.',[['Sunlight Sensitivity','Disadvantage in sunlight.']]),
('Specter','1','Medium undead',12,22,'5d8','0 ft., fly 50 ft. (hover)',[1,14,11,10,10,11],[['Life Drain',4,'3d6','necrotic']],'',[['Incorporeal','Moves through creatures and objects. Resists most non-magical damage.']]),
('Giant Rat','1/8','Small beast',12,7,'2d6','30 ft.',[7,15,11,2,10,4],[['Bite',4,'1d4+2','piercing']],'',[['Pack Tactics','Advantage if an ally is next to the target.']]),
('Wolf','1/4','Medium beast',13,11,'2d8+2','40 ft.',[12,15,12,3,12,6],[['Bite',4,'2d4+2','piercing']],'',[['Knock down','A creature hit must make a DC 11 STR save or be knocked prone.'],['Pack Tactics','Advantage if an ally is next to the target.']]),
('Dire Wolf','1','Large beast',14,37,'5d10+10','50 ft.',[17,15,15,3,12,7],[['Bite',5,'2d6+3','piercing']],'',[['Knock down','DC 13 STR save or prone.'],['Pack Tactics','Advantage if an ally is next to the target.']]),
('Giant Spider','1','Large beast',14,26,'4d10+4','30 ft., climb 30 ft.',[14,16,12,2,11,4],[['Bite',5,'1d8+3+2d8','piercing + poison']],'',[['Web','Recharge 5-6: ranged +5, restrains the target (DC 12 STR to escape).']]),
('Brown Bear','1','Large beast',11,34,'4d10+12','40 ft., climb 30 ft.',[19,10,16,2,13,7],[['Bite',6,'1d8+4','piercing'],['Claws',6,'2d6+4','slashing']],'One bite and one claws attack.',[]),
('Giant Crocodile','5','Huge beast',14,85,'9d12+27','30 ft., swim 50 ft.',[21,9,17,2,10,7],[['Bite',8,'3d10+5','piercing'],['Tail',8,'2d8+5','bludgeoning']],'One bite and one tail attack.',[]),
('Harpy','1','Medium monstrosity',11,38,'7d8+7','20 ft., fly 40 ft.',[12,13,12,7,10,13],[['Claws',3,'2d4+1','slashing'],['Club',3,'1d4+1','bludgeoning']],'One claws and one club attack.',[['Luring Song','WIS save DC 11 or charmed and drawn toward the harpy.']]),
('Ogre','2','Large giant',11,59,'7d10+21','40 ft.',[19,8,16,5,7,7],[['Greatclub',6,'2d8+4','bludgeoning'],['Javelin',6,'2d6+4','piercing']],'',[]),
('Owlbear','3','Large monstrosity',13,59,'7d10+21','40 ft.',[20,12,17,3,12,7],[['Beak',7,'1d10+5','piercing'],['Claws',7,'2d8+5','slashing']],'One beak and one claws attack.',[]),
('Minotaur','3','Large monstrosity',14,76,'9d10+27','40 ft.',[18,11,16,6,16,9],[['Greataxe',6,'2d12+4','slashing'],['Gore',6,'2d8+4','piercing']],'',[['Charge','Moves 10 ft. straight then gores: +2d8 and DC 14 STR save or pushed 10 ft. and prone.']]),
('Basilisk','3','Medium monstrosity',15,52,'8d8+16','20 ft.',[16,8,15,2,8,7],[['Bite',5,'2d6+3+2d6','piercing + poison']],'',[['Petrifying Gaze','CON save DC 12 or begin turning to stone.']]),
('Troll','5','Large giant',15,84,'8d10+40','30 ft.',[18,13,20,7,9,7],[['Bite',7,'1d6+4','piercing'],['Claw',7,'2d6+4','slashing']],'One bite and two claw attacks.',[['Regeneration','Regains 10 HP at the start of its turn unless it took acid or fire damage.']]),
('Hill Giant','5','Huge giant',13,105,'10d12+40','40 ft.',[21,8,19,5,9,6],[['Greatclub',8,'3d8+5','bludgeoning'],['Rock',8,'3d10+5','bludgeoning']],'Two greatclub attacks.',[]),
('Wyvern','6','Large dragon',13,110,'13d10+39','20 ft., fly 80 ft.',[19,10,16,5,12,6],[['Bite',7,'2d6+4','piercing'],['Claws',7,'2d8+4','slashing'],['Stinger',7,'2d6+4+7d6','piercing + poison']],'One bite and one stinger attack (or claws when flying).',[]),
('Young Red Dragon','10','Large dragon',18,178,'17d10+85','40 ft., climb 40 ft., fly 80 ft.',[23,10,21,14,11,19],[['Bite',10,'2d10+6+1d6','piercing + fire'],['Claw',10,'2d6+6','slashing'],['Fire Breath',None,'16d6','fire',17,'DEX',1]],'One bite and two claw attacks. Fire Breath recharges on 5-6.',[]),
('Gelatinous Cube','2','Large ooze',6,84,'8d10+40','15 ft.',[14,3,20,1,6,1],[['Pseudopod',4,'3d6','acid'],['Engulf',None,'3d6','acid',12,'DEX',0]],'',[['Transparent','Hard to see when still (DC 15 Perception).']]),
('Mimic','2','Medium monstrosity',12,58,'9d8+18','15 ft.',[17,12,15,5,13,8],[['Pseudopod',5,'1d8+3','bludgeoning'],['Bite',5,'1d8+3+1d8','piercing + acid']],'',[['Adhesive','Sticks to what it touches; grappled creatures DC 13 to escape.']]),
('Shark (Hunter)','2','Large beast',12,45,'6d10+12','swim 40 ft.',[18,13,15,1,10,4],[['Bite',6,'2d8+4','piercing']],'',[['Blood Frenzy','Advantage against creatures that are not at full HP.']]),
('Giant Octopus','1','Large beast',11,52,'8d10+8','10 ft., swim 60 ft.',[17,13,13,4,10,4],[['Tentacles',5,'2d6+3','bludgeoning']],'',[['Grapple','Hit creatures are grappled (DC 16) and restrained.']]),
]
out=[]
for n,cr,ty,ac,hp,hd,sp,ab,at,multi,tx in R:
    at2=[]
    for a in at:
        if a[1] is None:at2.append([a[0],None,a[2],a[3],a[4] or None,a[5] or None,a[6]])
        else:at2.append(a)
    t=[['Multiattack',multi]] if multi else []
    out.append({'n':n,'cr':cr,'ty':ty,'ac':ac,'hp':hp,'hd':hd,'sp':sp,'ab':ab,'at':at2,'x':{},'tx':t+tx,'src':'SRD'})
json.dump(out,open('mons_5e.json','w'))
print(len(out))
