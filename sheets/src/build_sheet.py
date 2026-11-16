import os,re,subprocess
L=lambda f:open(f).read()
def lines(f,a,b):return '\n'.join(open(f).read().split('\n')[a-1:b])
c2=lines('v3_classes2.js',1,40)+'\n'+lines('v3_classes2.js',42,66)
s2=lines('v3_species2.js',1,14)
op='\n'.join([L('v3_rules.js'),L('v3_levels.js'),L('v3_powers.js'),L('v3_fruitnames.js'),c2,s2])
mine='\n'.join(L('sheet/'+f) for f in ['sh_rules5e.js','sh_core.js','sheet_dummy.js'] if os.path.exists('sheet/'+f))
mine='\n'.join(L('sheet/'+f) for f in ['sh_rules5e.js','sh_core.js','sh_sheet.js','sh_build.js','sh_dm.js','sh_main.js'])
js=op+'\n'+mine
open('sheet/bundle.js','w').write(js)
r=subprocess.run(['node','--check','sheet/bundle.js'],capture_output=True,text=True)
print('syntax',r.returncode,r.stderr[:600])
css=L('sheet/sh.css')
body='<div id="app"></div>\n<style>'+css+'</style>\n<script>\n'+js+'\n</script>'
# single file (Claude artifact / local test)
open('sheet/sheet-table.html','w').write('<title>Sheet Table</title>\n'+body)
open('sheet/test.html','w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Sheet Table</title></head><body>'+body+'</body></html>')
# website with room codes
p=L('site/p2p.js').replace("'grandlinetable-v1-'","'sheettable-v1-'").replace('glt-','sht-').replace('Grand Line Table','Sheet Table')
p=p.replace("Host a game for your crew, or join a friend\\'s game with their room code.","The DM hosts the table. Players join with the room code and only need their character sheet.")
p=p.replace('Host a new game','Host a table (I am the DM)').replace('Host your game again','Open my table again').replace('Play alone on this device','Try it alone on this device')
p=p.replace('#netLobby .nl-ai{','#netLobby .nl-ai{display:none;')
os.makedirs('site/sheets',exist_ok=True)
open('site/sheets/p2p.js','w').write(p)
open('site/sheets/index.html','w').write('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Sheet Table</title><meta name="description" content="Character sheets and dice for a table with a human DM: One Piece or plain D&D 5e.">
<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"></script><script src="p2p.js"></script></head><body>'''+body+'</body></html>')
print('size',len(body)//1024,'KB')
