import pdfplumber,glob,re,json
f=glob.glob('/mnt/user-data/uploads/DND/*Player*')[0];pdf=pdfplumber.open(f)
seq=[]
def cols(i):
  p=pdf.pages[i];ws=p.extract_words(keep_blank_chars=True);C=[[],[],[],[]]
  for w in ws:
    x=w['x0'];c=0 if x<280 else 1 if x<415 else 2 if x<545 else 3
    if w['top']>p.height-40:continue
    C[c].append(w)
  return [sorted(c,key=lambda w:w['top']) for c in C]
for a in range(408,422,2):
  A=cols(a);B=cols(a+1)
  for c in range(4):
    for w in A[c]+B[c]:seq.append((a,w['text'].strip()))
LV=re.compile(r'^(\d)(st|nd|rd|th) Level$')
NAMES=['Chemist','Devilforged','Hybrid','Marksman','Priest','Skald','Tinkerer']
toks=[x for _,x in seq]
cur=None;lvl=0;out={};skip=0
for j,s in enumerate(toks):
  if s.startswith('Custom Spells') and cur:break
  if s=='Natural' or s.startswith('Abilities/Cantrips') or s.startswith('Natural Abilities') or s=='Level)':
    if s=='Natural' or s.startswith('Natural'):
      back=' '.join(toks[max(0,j-4):j])
      for n in NAMES:
        if n in back:cur=n.lower();out.setdefault(cur,{})
    lvl=0;continue
  m=re.match(r'^(%s)( Spells)?$'%'|'.join(NAMES),s)
  if m:cur=m.group(1).lower();out.setdefault(cur,{});lvl=0;continue
  if s=='Spells':continue
  if cur is None:continue
  m=LV.match(s)
  if m:lvl=int(m.group(1));continue
  if s.startswith('CHAPTER') or len(s)>32 or s.endswith('.') or s.endswith(',') or not s[0].isupper():continue
  out[cur].setdefault(str(lvl),[]).append(s)
for k,v in out.items():print(k,{l:len(x) for l,x in sorted(v.items())})

for k,v in out.items():
  for l,L in v.items():
    J=[]
    for x in L:
      if J and re.search(r' (and|of|from|or|with|the)$',J[-1]):J[-1]+=' '+x
      else:J.append(x)
    v[l]=J
json.dump(out,open('oplists.json','w'),indent=0)
print(out.get('priest',{}).get('1'))
