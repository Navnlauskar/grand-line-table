import json,re
M=json.load(open('mons.json'))
out=[]
for o in M:
    n=o['name']
    n=re.sub(r' Actions$','',n);n=re.sub(r' Challenge .*$','',n)
    if ']' in n:n=n[:n.index(']')+1]
    n=re.sub(r' [A-Z][a-z]+ [A-Z]?[a-z]*\. .*$','',n) if '. ' in n else n
    n=n.strip()
    if n.startswith('Yagara'):o['cr']='1/2'
    at=[]
    for a in o['atks']:
        nm=a['n'] or 'Attack'
        if nm=='Multiattack':nm='Spear'
        nm=re.sub(r' \(Recharge[^)]*\)',lambda m:m.group(0),nm)
        if 'b' in a:at.append([nm,a['b'],a['d'],a['t']])
        else:at.append([nm,None,a['d'],a['t'],a['dc'],a['s'],1 if a['h'] else 0])
    tx=[]
    for sec,lab in [('traits',''),('actions','Action'),('bonus','Bonus action'),('reactions','Reaction'),('legendary','Legendary')]:
        for k,v in o[sec]:tx.append([(lab+': ' if lab else '')+k,v[:700]])
    ab=o['ab'] if len(o['ab'])==6 else [10]*6
    out.append({'n':n,'cr':o['cr'],'ty':(o['size']+' '+o['type']).strip(),'ac':o['ac'],'hp':o['hp'],'hd':o['hd'],'sp':o['speed'],'ab':ab,'at':at,
      'x':{k:o[k] for k in ('saves','skills','senses','res','imm','cimm','vul','lang') if o[k]},'tx':tx,'src':'DMG'})
print(len(out),len(json.dumps(out))//1024,'KB')
for o in out:print(o['n'])
json.dump(out,open('mons_op.json','w'),ensure_ascii=False)
