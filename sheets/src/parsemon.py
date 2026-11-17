import re,json
L=[l.rstrip() for l in open('dmg_raw.txt',encoding='utf8')]
SZ=re.compile(r'^\*?(Tiny|Small|Medium|Large|Huge|Gargantuan)( or \w+)? ([A-Za-z ()\-,]+?), ([a-z \-]+)$')
starts=[i for i,l in enumerate(L) if SZ.match(l.strip()) and any(re.match(r'^Armor Class \d',x) for x in L[i+1:i+9])]
mons=[]
for si,i in enumerate(starts):
    k=i-1
    while k>0 and (not L[k].strip() or re.match(r'^\d+$',L[k].strip()) or L[k].startswith('CHAPTER')):k-=1
    name=L[k].strip();name=re.sub(r'^Example: ','',name)
    end=starts[si+1]-1 if si+1<len(starts) else len(L)
    blk=L[i:end]
    m=SZ.match(L[i].strip());o={'name':name,'size':m.group(1),'type':m.group(3).strip(),'align':m.group(4)}
    txt='\n'.join(blk)
    g=lambda p:(re.search(p,txt,re.M) or [None,None])
    a=re.search(r'^Armor Class (\d+)(?: \(([^)]*)\))?',txt,re.M);o['ac']=int(a.group(1));o['acn']=a.group(2) or ''
    h=re.search(r'^Hit Points (\d+)(?: \(([^)]*)\))?',txt,re.M);o['hp']=int(h.group(1));o['hd']=(h.group(2) or '').replace(' ','')
    s=re.search(r'^Speed (.*)$',txt,re.M);o['speed']=s.group(1) if s else ''
    ab=re.search(r'^(\d+) \(([+\-−]\d+)\) (\d+) \(([+\-−]\d+)\) (\d+) \(([+\-−]\d+)\) (\d+)',txt,re.M)
    sc=re.findall(r'(\d+) \(([+\-−]?\d+)\)',txt[ab.start():ab.start()+80]) if ab else []
    o['ab']=[int(x[0]) for x in sc[:6]]
    c=re.search(r'^Challenge ([0-9/]+)',txt,re.M);o['cr']=c.group(1) if c else '?'
    for k,p in [('saves','Saving Throws'),('skills','Skills'),('senses','Senses'),('res','Damage Resistances'),('imm','Damage Immunities'),('cimm','Condition Immunities'),('vul','Damage Vulnerabilities'),('lang','Languages')]:
        mm=re.search(r'^'+p+r' (.*)$',txt,re.M);o[k]=mm.group(1).strip() if mm else ''
    # body after Challenge: join wrapped lines into paragraphs that start with "Name."
    ci=next((j for j,l in enumerate(blk) if re.match(r'^\d+ \([+\-−]?\d+\) \d+ \(',l)),None)
    STAT=re.compile(r'^(Saving Throws|Skills|Senses|Damage Resistances|Damage Immunities|Condition Immunities|Damage Vulnerabilities|Languages|Challenge|Proficiency Bonus) ')
    body=[l for l in blk[ci+1:] if l.strip() and not STAT.match(l) and not l.startswith('CHAPTER ') and not re.match(r'^\d+$',l.strip())] if ci is not None else []
    secs={'traits':[],'actions':[],'bonus':[],'reactions':[],'legendary':[]};cur='traits';paras=[]
    HEAD={'Actions':'actions','Bonus Actions':'bonus','Reactions':'reactions','Legendary Actions':'legendary','Mythic Actions':'legendary'}
    for l in body:
        t=l.strip()
        if t in HEAD:cur=HEAD[t];continue
        if t.startswith('Proficiency Bonus'):continue
        mm=re.match(r"^([A-Z][A-Za-z0-9'’ ,\-/()]{1,60}?)\. (.*)$",t)
        if mm and not re.match(r'^(Hit|Each|The|On|If|A|This|It|Its|When|Until|While)$',mm.group(1)):
            secs[cur].append([mm.group(1),mm.group(2)])
        elif secs[cur]:secs[cur][-1][1]+=' '+t
        else:secs[cur].append(['',t])
    o.update(secs)
    atks=[]
    for n,t in secs['traits']+secs['actions']+secs['bonus']+secs['legendary']:
        mm=re.search(r'(Melee|Ranged|Melee or Ranged) (?:Weapon|Spell) Attack: ([+\-]\d+) to hit.*?Hit: (?:\d+ )?\((\d+(?:d\d+)?[\dd +\-]*)\) (\w+)(?: damage)?((?: plus (?:\d+ )?\(\d+d\d+[\dd +\-]*\) \w+(?: damage)?)*)',t)
        if mm and not re.search(r'd0',mm.group(3).replace(' ','')):
            d=mm.group(3).replace(' ','');ty=mm.group(4)
            for x in re.findall(r'plus (?:\d+ )?\((\d+d\d+[\dd +\-]*)\) (\w+)',mm.group(5) or ''):d+='+'+x[0].replace(' ','');ty+=' + '+x[1]
            atks.append({'n':n,'b':int(mm.group(2)),'d':d,'t':ty,'r':'m' if mm.group(1)=='Melee' else 'r'})
        else:
            mm=re.search(r'DC (\d+) (\w+) saving throw.*?(?:\d+ )?\((\d+d\d+[\dd +\-]*)\) (\w+) damage',t)
            if mm:atks.append({'n':n,'dc':int(mm.group(1)),'s':mm.group(2)[:3].upper(),'d':mm.group(3).replace(' ',''),'t':mm.group(4),'h':'half' in t})
    o['atks']=atks
    ma=next((t for n,t in secs['actions'] if n=='Multiattack'),'')
    o['multi']=ma
    mons.append(o)
print(len(mons))
for o in mons:print(o['name'],'|',o['size'],o['type'],'| CR',o['cr'],'AC',o['ac'],'HP',o['hp'],o['ab'],'| atks',[(a['n'],a.get('b',a.get('dc')),a['d']) for a in o['atks']][:4])
json.dump(mons,open('mons.json','w'),ensure_ascii=False)
