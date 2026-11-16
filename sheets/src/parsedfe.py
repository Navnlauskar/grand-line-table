import re,json
raw=open('dfe_raw.txt').read()
# drop page footers / chapter running heads
lines=[l for l in raw.replace('\f','\n').split('\n')]
clean=[]
for l in lines:
    s=l.strip()
    if re.match(r'^CHAPTER \d+ \|',s) or re.match(r'^\d{1,3}$',s):continue
    clean.append(l.rstrip())
L=clean
heads=[];TITLES={}
for i,l in enumerate(L):
    if l.startswith('Devil Fruit, '):
        # heading is the closest non-empty line above
        j=i-1
        while j>=0 and not L[j].strip():j-=1
        heads.append((j,i))

HP=re.compile(r"^(Example: )?[A-Z][\w'ū]+ [A-Z][\w'ū]+ [Nn]o Mi\b")
def isHead(q):return bool(HP.match(L[q].strip()))
def titleAt(q):
    t=L[q].strip()
    nx=q+1
    while nx<len(L) and L[nx].strip() and not L[nx].startswith('Devil Fruit, ') and len(t)<60 and (t.endswith(':') or t.endswith(',') or 'Model' in t and not ')' in t and len(L[nx].strip())<25):
        t+=' '+L[nx].strip();nx+=1
    return t
allH=[q for q in range(len(L)) if isHead(q)]
used=set()
for (h,i) in heads:
    # the heading right above (possibly over 2 lines, e.g. "Model:" broken)
    for q in range(i-1,max(0,i-4),-1):
        if isHead(q):TITLES[i]=titleAt(q);used.add(q);break
orph=[q for q in allH if q not in used]
for (h,i) in heads:
    if i in TITLES:continue
    # nearest unused orphan heading before this block, else after
    before=[q for q in orph if q<i];after=[q for q in orph if q>i]
    q=before[-1] if before else (after[0] if after else None)
    if q is not None:TITLES[i]=titleAt(q);orph.remove(q)
out=[]
for k,(h,i) in enumerate(heads):
    end=heads[k+1][0] if k+1<len(heads) else len(L)
    title=TITLES.get(i) or L[h].strip()
    title=re.sub(r'^Example: ','',title)
    rar=L[i][len('Devil Fruit, '):].strip()
    body=L[i+1:end]
    # join wrapped lines into paragraphs: a new paragraph starts with "Word(s). " label or "Awakening"
    text='\n'.join(body)
    text=re.sub(r'\n\s*\n',' \n',text)
    paras=[];cur=''
    for ln in text.split('\n'):
        s=ln.strip()
        if not s:continue
        m=re.match(r"^([A-Z][A-Za-z'’\- ]{1,40}(?: \([^)]{1,60}\))?)\. ",s)
        if m and (not cur or cur.rstrip().endswith(('.',')','!',':')) or re.match(r'^(Type|Fruit appearance|Description|Sea Weakness|Spells|Awakening|Beast Shape|Hybrid Form|Elemental Body|Logia)',m.group(1))):
            if cur:paras.append(cur)
            cur=s
        else:
            cur=(cur+' '+s) if cur else s
    if cur:paras.append(cur)
    # cut trailing chapter headings like "Uncommon Zoans"
    rec={'title':title,'rarity':rar,'fields':[]}
    for p in paras:
        m=re.match(r"^([A-Z][A-Za-z'’\- ]{1,40}(?: \([^)]{1,60}\))?)\. (.*)$",p,re.S)
        if m:rec['fields'].append([m.group(1).strip(),m.group(2).strip()])
        elif rec['fields']:rec['fields'][-1][1]+=' '+p
    out.append(rec)
# tidy
for r in out:
    if 'no Mi' not in r['title'] and 'No Mi' not in r['title']:
        dm=re.search(r"([A-Z][a-zū]+ [A-Z][a-zū]+ [Nn]o Mi)",' '.join(v for k,v in r['fields'] if k=='Description'))
        if dm:r['title']=dm.group(1)+' ('+r['title'][:30]+')' if False else dm.group(1)
    t=r['title'];m=re.match(r"^([A-Z][\w'ū]+ [A-Z][\w'ū]+ [Nn]o Mi)(?:,? ([Mm]odel:? [^(]*?))?(?: \(([^)]*)\))?(?:\s|$)",t)
    r['jp']=m.group(1).replace(' No Mi',' no Mi') if m else t;r['model']=re.sub(r'^[Mm]odel:?','',(m.group(2) or '')).strip() if m else '';r['en']=(m.group(3) or '') if m else ''
    F=dict()
    for k,v in r['fields']:
        v=re.sub(r'\s+',' ',v).replace('⁠','').strip()
        v=re.sub(r' (Uncommon|Rare|Very Rare|Legendary) (Paramecias?|Zoans?|Logias?)$','',v)
        F.setdefault(k,v)
    r['fields']=[[k,re.sub(r'\s+',' ',v).replace('⁠','').strip()] for k,v in r['fields']]
json.dump(out,open('dfe.json','w'),indent=0,ensure_ascii=False)
print(len(out))
import collections
print(collections.Counter(r['rarity'] for r in out))
types=collections.Counter(next((v for k,v in r['fields'] if k=='Type'),'?') for r in out);print(len(types),types.most_common(12))
keys=collections.Counter(k for r in out for k,v in r['fields']);print([k for k,n in keys.most_common(25)])
bad=[r['title'] for r in out if not any(k.startswith('Spells') or k.startswith('Beast Shape') for k,v in r['fields'])];print('no spells/beast:',len(bad),bad[:20])
# ---- fix the split Ope Ope entry and the "Part 2" pages
fixed=[]
for r in out:
    if 'no Mi' not in r['title'] and 'No Mi' not in r['title'] and any('Ope Ope' in v for k,v in r['fields']):
        r['title']='Ope Ope no Mi (Surgery)';r['jp']='Ope Ope no Mi';r['en']='Surgery';r['model']=''
    if r['title'].endswith('Part 2') and fixed:
        fixed[-1]['fields']+=r['fields'];continue
    fixed.append(r)
out=fixed
for r in out:r['jp']=r['jp'].replace(' No Mi',' no Mi')
def split_top(s):
    parts=[];depth=0;cur=''
    for ch in s:
        if ch=='(':depth+=1
        if ch==')':depth-=1
        if ch==',' and depth==0:parts.append(cur);cur='';continue
        cur+=ch
    parts.append(cur);return [p.strip() for p in parts if p.strip()]
for r in out:
    sp=[(k,v) for k,v in r['fields'] if 'Spells' in k or ('charges' in v and 'expend 1 or more' in v)]
    r['charges']=0;r['spells']=[]
    if sp:
        k,v=sp[0];m=re.search(r'has (\d+) charges',v);r['charges']=int(m.group(1)) if m else 0
        m=re.search(r'components:\s*(.*?)(?:\.\s*The devil fruit regains|$)',v)
        lst=m.group(1) if m else ''
        for it in split_top(lst):
            it=re.sub(r'^(or|and)\s+','',it.strip()).strip(' .')
            if not it:continue
            mm=re.match(r'^(.*?)\s*\((.*)\)\s*$',it)
            name=(mm.group(1) if mm else it).strip();inner=mm.group(2) if mm else ''
            cm=re.search(r'(\d+)\s*charge',inner);cost=int(cm.group(1)) if cm else 1
            asm=re.search(r'\bas ([A-Z][A-Za-z\' ]+?)(?:,|;|$| but| with| using| that| and| to| except)',inner)
            base=(asm.group(1).strip() if asm else name)
            r['spells'].append({'name':name,'base':base,'cost':cost,'note':inner})
FIX=[('generate and control trash','Trashu Trashu no Mi','Trash'),('soundproof field','Nagi Nagi no Mi','Calm'),('manipulate ropes','Ropu Ropu no Mi','Rope'),('dance very well','Dansu Dansu no Mi','Dance'),('various hormones','Horu Horu no Mi','Hormone'),('living fortress','Shiro Shiro no Mi','Castle')]
for r in out:
    if r['jp'].endswith('no Mi'):continue
    dsc=next((v for k,v in r['fields'] if k=='Description'),'')
    for kw,jp,en in FIX:
        if kw in dsc:r['jp']=jp;r['en']=en;r['model']='';r['title']=jp+' ('+en+')'
# swap titles where the description names a different fruit that exists as another entry's title
for r in out:
    dsc=next((v for k,v in r['fields'] if k=='Description'),'')
    m=re.match(r"The ([A-Z][a-z]+) \1 [Nn]o Mi",dsc)
    if m and m.group(1)!=r['jp'].split()[0]:
        o=next((x for x in out if x is not r and x['jp'].split()[0]==m.group(1)),None)
        if o:
            for f in ('jp','en','model','title'):r[f],o[f]=o[f],r[f]
json.dump(out,open('dfe.json','w'),indent=0,ensure_ascii=False)
bases=collections.Counter(s['base'] for r in out for s in r['spells'])
print('fruits',len(out),'with spells',sum(1 for r in out if r['spells']),'distinct base spells',len(bases))
print(bases.most_common(200))
