import re
import json,re
d=json.load(open('dfe.json'))
SKIP={'Type','Fruit appearance','Description','Sea Weakness'}
out=[];seen=set()
for r in d:
    F=r['fields'];get=lambda k:next((v for kk,v in F if kk==k),'')
    jp=r['jp'].strip();model=r['model'].strip().rstrip(',')
    key=re.sub(r'[^a-z]','',jp.split()[0].lower())+('_'+re.sub(r'[^a-z0-9]+','',model.lower()) if model else '')
    if key in seen:continue
    seen.add(key)
    feats=[];awk=None
    for k,v in F:
        if k in SKIP:continue
        if 'Spells' in k or ('charges' in v and 'expend 1 or more' in v):continue
        if k.startswith('Awakening'):
            awk=[k.replace('Awakening','').strip(' ()') or 'Awakening',v] if not awk else [awk[0],awk[1]+' '+v];continue
        feats.append([k,v])
    sp=[]
    def cap(x):return ' '.join(w if w in ('of','and','or','the','to') or not w else w[0].upper()+w[1:] for w in x.split(' '))
    for s_ in r['spells']:
        n,cost,note,base=s_['name'].strip(),s_['cost'],s_['note'],s_['base']
        if n.lower() in ('or','and'):continue
        m=re.match(r"^([^().]+?)\s*\(([^)]*?)(\d+) charges?\)",n)
        if m:
            n=m.group(1).strip();cost=int(m.group(3));inner=m.group(2).strip(' ;,');note=(inner+'; ' if inner else '')+str(cost)+' charges'
            base=inner.split(';')[0].strip() if inner else n
            base=re.sub(r'^as ','',base)
        elif len(n)>40:
            n=re.split(r' \(|\. ',n)[0].strip()
            if len(n)>40 or n[0].islower() and ' ' in n and len(n.split())>4:continue
            base=n
        if not base or len(base)>40:base=n
        sp.append([cap(n),cost,note,cap(base)])
    typ=get('Type').replace('Enahncer','Enhancer')
    out.append({'k':key,'jp':jp,'model':model,'en':r['en'],'rar':r['rarity'],'type':typ,'look':get('Fruit appearance'),'desc':get('Description'),'feats':feats,'ch':r['charges'],'sp':sp,'awk':awk})
out.sort(key=lambda x:(['Uncommon','Rare','Very Rare','Legendary'].index(x['rar']) if x['rar'] in ['Uncommon','Rare','Very Rare','Legendary'] else 9,x['jp'],x['model']))
import collections
cnt=collections.Counter(v for x in out for k,v in x['feats'])
cnt.update(x['awk'][1] for x in out if x['awk'])
common=[t for t,n in cnt.items() if n>=3 and len(t)>120]
idx={t:i for i,t in enumerate(common)}
for x in out:
    x['feats']=[[k,('@%d'%idx[v]) if v in idx else v] for k,v in x['feats']]
    if x['awk'] and x['awk'][1] in idx:x['awk'][1]='@%d'%idx[x['awk'][1]]
dups=collections.Counter(x['k'] for x in d) if False else None
js='// The Devil Fruit Encyclopedia (D&D 5e System Homebrew) by OneWorldHD, free fan content: every fruit, its passives, techniques and awakening.\nconst DFE_TXT='+json.dumps(common,ensure_ascii=False)+';\nconst DFE='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n'
open('sheet/sh_fruitdb.js','w').write(js)
print(len(out),len(js)//1024,'KB')
import collections;print(collections.Counter(x['type'].split()[-1] if x['type'] else '?' for x in out))
print([x['k'] for x in out if not x['type']][:10])
print(sum(1 for x in out if x['ch']),'with charges;',sum(1 for x in out if x['awk']),'with awakening')
