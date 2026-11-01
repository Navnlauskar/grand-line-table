// ================= Grand Line Table on its own website: room codes and peer-to-peer play =================
// Outside Claude there is no shared database, so this file provides one with the same shape the game already uses
// (claude.use('db'|'user'|'room')). The host's browser keeps the table and saves it; friends connect straight to the
// host with a room code (PeerJS / WebRTC). Every write goes to the host, who applies it and sends it on to everyone.
(function(){
if(window.claude)return;
const LS=k=>{try{return localStorage.getItem(k)}catch(e){return null}},LSS=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let uid=LS('glt-uid');if(!uid){uid='u'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-3);LSS('glt-uid',uid)}
const PREFIX='grandlinetable-v1-';
const HOST_ONLY=new Set(['dm','actions']);           // the host's secrets and the action queue never go to players
const CAP={story:700,log:200,actions:200};             // old entries are trimmed so the table stays small
const N={role:null,code:null,peer:null,conns:new Map(),hostConn:null,data:{},subs:[],peers:{},peerCbs:[],myPres:{},ready:null,saveT:0,lost:false};
let readyRes;N.ready=new Promise(r=>readyRes=r);
const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function coll(c){return N.data[c]||(N.data[c]={})}
// ---------------- local store + listeners ----------------
function snapColl(sub){let ids=Object.keys(coll(sub.c));const d=coll(sub.c);
  if(sub.order){const [f,dir]=sub.order;ids.sort((a,b)=>{const x=d[a][f],y=d[b][f];return(x>y?1:x<y?-1:0)*(dir==='desc'?-1:1)})}
  if(sub.limit)ids=ids.slice(0,sub.limit);
  const mk=id=>({id,exists:true,data:()=>clone(d[id])});const docs=ids.map(mk);const prev=sub.prev||new Map();const now=new Map(ids.map(id=>[id,JSON.stringify(d[id])]));
  const changes=[];for(const id of ids){if(!prev.has(id))changes.push({type:'added',doc:mk(id)});else if(prev.get(id)!==now.get(id))changes.push({type:'modified',doc:mk(id)})}
  for(const id of prev.keys())if(!now.has(id))changes.push({type:'removed',doc:{id,exists:false,data:()=>undefined}});sub.prev=now;
  return{docs,size:docs.length,empty:!docs.length,docChanges:()=>changes}}
function snapDoc(c,id){const v=coll(c)[id];return{id,exists:v!==undefined,data:()=>clone(v)}}
function fire(c,id){for(const s of N.subs){if(s.c!==c)continue;if(s.kind==='doc'&&s.id!==id)continue;try{s.cb(s.kind==='doc'?snapDoc(c,s.id):snapColl(s))}catch(e){console.warn(e)}}}
function applyLocal(c,id,v){if(v===null||v===undefined)delete coll(c)[id];else coll(c)[id]=v;fire(c,id)}
// ---------------- host side ----------------
function hostSave(){clearTimeout(N.saveT);N.saveT=setTimeout(()=>{const keep={};for(const [c,o] of Object.entries(N.data))if(c!=='actions')keep[c]=o;LSS('glt-host-'+N.code,JSON.stringify(keep))},800)}
function trim(c){const cap=CAP[c];if(!cap)return;const o=coll(c);const ids=Object.keys(o);if(ids.length<=cap)return;ids.sort((a,b)=>(o[a].t||0)-(o[b].t||0));for(const id of ids.slice(0,ids.length-cap)){delete o[id];bcast({t:'chg',c,id,v:null})}}
function bcast(m,except){if(HOST_ONLY.has(m.c))return;for(const [pid,cn] of N.conns)if(pid!==except&&cn.open)try{cn.send(m)}catch(e){}}
function hostWrite(op,c,id,v){if(op==='add'){id=id||rid()}const val=op==='del'?null:clone(v);applyLocal(c,id,val);bcast({t:'chg',c,id,v:val});if(op==='add')trim(c);hostSave();return id}
function publicData(){const o={};for(const [c,v] of Object.entries(N.data))if(!HOST_ONLY.has(c))o[c]=v;return o}
function peerList(){const me={id:uid,isMe:true,presence:N.myPres};const others=Object.values(N.peers);return N.role==='host'?[me,...others]:[me,...others.filter(p=>p.id!==uid)]}
function sendPeers(){const list=[{id:uid,presence:N.myPres},...Object.values(N.peers).map(p=>({id:p.id,presence:p.presence}))];for(const cn of N.conns.values())if(cn.open)try{cn.send({t:'peers',list})}catch(e){}firePeers()}
function firePeers(){for(const cb of N.peerCbs)try{cb()}catch(e){}}
function startHost(code){N.role='host';N.code=code;LSS('glt-last-host',code);
  try{N.data=JSON.parse(LS('glt-host-'+code)||'{}')||{}}catch(e){N.data={}}
  return new Promise((res,rej)=>{const p=new Peer(PREFIX+code,window.GLT_PEER_OPTS||{});N.peer=p;
    p.on('open',()=>res());p.on('error',e=>{if(e.type==='unavailable-id')rej(new Error('That room is already open somewhere else (maybe in another tab).'));else if(!N.readyDone)rej(e);else console.warn(e)});
    p.on('disconnected',()=>{setTimeout(()=>{try{p.reconnect()}catch(e){}},2000)});
    p.on('connection',cn=>{cn.on('open',()=>{N.conns.set(cn.peer,cn);cn.send({t:'full',data:publicData()});sendPeers();netBadge()});
      cn.on('data',m=>{if(!m||typeof m!=='object')return;
        if(m.t==='w')hostWrite(m.op,m.c,m.id,m.v);
        else if(m.t==='hello'){N.peers[cn.peer]={id:m.uid,presence:m.pres||{}};sendPeers();netBadge()}
        else if(m.t==='pres'){const p0=N.peers[cn.peer]||{id:m.uid};N.peers[cn.peer]={...p0,presence:m.v||{}};sendPeers()}});
      cn.on('close',()=>{N.conns.delete(cn.peer);delete N.peers[cn.peer];sendPeers();netBadge()});cn.on('error',()=>{})})})}
// ---------------- player side ----------------
function startJoin(code){N.role='guest';N.code=code;LSS('glt-last-join',code);
  return new Promise((res,rej)=>{const p=new Peer(window.GLT_PEER_OPTS||{});N.peer=p;let opened=false;
    const fail=setTimeout(()=>{if(!opened)rej(new Error('Could not reach the host. Check the room code, and that the host has the game open.'))},15000);
    p.on('error',e=>{if(e.type==='peer-unavailable'){clearTimeout(fail);if(!opened)rej(new Error('No game with that room code is open right now.'));else lost()}else if(!opened){clearTimeout(fail);rej(e)}});
    p.on('open',()=>connect(()=>{opened=true;clearTimeout(fail);res()}))})}
function connect(onFull){const cn=N.peer.connect(PREFIX+N.code,{reliable:true,serialization:'json'});N.hostConn=cn;
  cn.on('open',()=>{cn.send({t:'hello',uid,pres:N.myPres})});
  cn.on('data',m=>{if(!m||typeof m!=='object')return;
    if(m.t==='full'){const old=N.data;N.data=m.data||{};const cs=new Set([...Object.keys(old),...Object.keys(N.data)]);for(const c of cs){for(const s of N.subs)if(s.c===c)fire(c,s.id)}if(N.lost){N.lost=false;netBadge();try{setConn('on')}catch(e){};toast&&toast('Reconnected to the host.')}if(onFull){const f=onFull;onFull=null;f()}}
    else if(m.t==='chg')applyLocal(m.c,m.id,m.v);
    else if(m.t==='peers'){N.peers={};for(const p of m.list)if(p.id!==uid)N.peers[p.id]=p;firePeers()}});
  cn.on('close',()=>lost());cn.on('error',()=>{})}
function lost(){if(N.lost)return;N.lost=true;netBadge();try{setConn('off')}catch(e){};try{toast('Lost the connection to the host. Trying again…')}catch(e){}
  const again=()=>{if(!N.lost)return;try{if(N.peer.disconnected)N.peer.reconnect();connect(null)}catch(e){}setTimeout(again,4000)};setTimeout(again,1500)}
function guestWrite(op,c,id,v){if(op==='add')id=id||rid();if(c!=='actions')applyLocal(c,id,op==='del'?null:clone(v));
  if(N.hostConn&&N.hostConn.open)N.hostConn.send({t:'w',op,c,id,v:op==='del'?null:v});else{const e=new Error('offline');e.code='unavailable';throw e}return id}
function write(op,c,id,v){return N.role==='host'?hostWrite(op,c,id,v):guestWrite(op,c,id,v)}
// ---------------- the db / user / room objects the game asks for ----------------
function query(c,order,limit){return{
  orderBy:(f,dir)=>query(c,[f,dir||'asc'],limit),limit:n=>query(c,order,n),
  onSnapshot:(cb,err)=>{const s={kind:'coll',c,order,limit,cb};N.subs.push(s);setTimeout(()=>{try{cb(snapColl(s))}catch(e){console.warn(e)}},0);return()=>{N.subs=N.subs.filter(x=>x!==s)}},
  get:async()=>snapColl({c,order,limit}),
  add:async v=>({id:write('add',c,null,v)}),
  doc:id=>docRef(c+'/'+id)}}
function docRef(path){const [c,id]=path.split('/');return{id,
  set:async v=>{write('set',c,id,v)},update:async v=>{write('set',c,id,{...(coll(c)[id]||{}),...v})},delete:async()=>{write('del',c,id)},
  get:async()=>snapDoc(c,id),
  onSnapshot:(cb,err)=>{const s={kind:'doc',c,id,cb};N.subs.push(s);setTimeout(()=>{try{cb(snapDoc(c,id))}catch(e){console.warn(e)}},0);return()=>{N.subs=N.subs.filter(x=>x!==s)}}}}
const DB={collection:c=>query(c),doc:p=>docRef(p)};
const USER={isOwner:async()=>N.role==='host',id:async()=>uid,can:async()=>true};
const ROOM={peers:()=>peerList(),onPeers:cb=>{N.peerCbs.push(cb);return()=>{N.peerCbs=N.peerCbs.filter(x=>x!==cb)}},
  presence:async v=>{N.myPres=v||{};if(N.role==='host')sendPeers();else if(N.hostConn&&N.hostConn.open)N.hostConn.send({t:'pres',uid,v:N.myPres})}};
window.claude={use:async what=>{const mode=await N.ready;if(mode==='solo')throw new Error('not here');
  if(what==='db')return DB;if(what==='user')return USER;if(what==='room')return ROOM;throw new Error('not available on the website')}};
window.GLT_NET=N;
// ---------------- the start screen: host, join or play alone ----------------
function codeGen(){const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=A[Math.floor(Math.random()*A.length)];return s.slice(0,3)+'-'+s.slice(3)}
function norm(c){c=String(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');return c.length===6?c.slice(0,3)+'-'+c.slice(3):c}
function inviteLink(){return location.origin+location.pathname+'?room='+encodeURIComponent(N.code)}
function netBadge(){const b=document.getElementById('netBadge');if(!b)return;const n=N.conns.size;
  b.innerHTML=N.role==='host'?`🏴‍☠️ <b>${N.code}</b> · ${n} 👥 <button type="button" id="netCopy">Copy invite link</button>`:N.lost?`⚠ Reconnecting to room <b>${N.code}</b>…`:`⚓ In room <b>${N.code}</b>`;
  const c=document.getElementById('netCopy');if(c)c.onclick=async()=>{try{await navigator.clipboard.writeText(inviteLink());c.textContent='Copied!'}catch(e){prompt('Send this link to your friends:',inviteLink())}setTimeout(()=>{c.textContent='Copy invite link'},1600)}}
function lobby(){const st=document.createElement('style');st.textContent=`
#netLobby{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse at top,#1d3a52,#0b1520 70%);color:#f3e6c8;font-family:Georgia,serif}
#netLobby .box{width:100%;max-width:440px;background:rgba(20,16,12,.92);border:1px solid rgba(224,164,88,.45);border-radius:16px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
#netLobby h1{margin:0 0 4px;font-size:28px;color:#e0a458;font-weight:normal}#netLobby p{margin:0 0 16px;opacity:.85;font-size:15px;line-height:1.45}
#netLobby label{display:block;font:12px/1.2 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;opacity:.75;margin:14px 0 6px}
#netLobby input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid rgba(224,164,88,.4);background:#0f0c09;color:#f3e6c8;font-size:17px}
#netLobby button{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:1px solid #e0a458;background:#e0a458;color:#1a120a;font-size:16px;cursor:pointer;font-family:inherit}
#netLobby button.alt{background:transparent;color:#f3e6c8;border-color:rgba(224,164,88,.45)}#netLobby button:disabled{opacity:.5;cursor:wait}
#netLobby .row{display:flex;gap:8px}#netLobby .row input{flex:1}#netLobby .row button{width:auto;margin-top:0;padding:0 20px;min-height:46px}
#netLobby .or{text-align:center;opacity:.6;margin:16px 0 4px;font-size:13px}#netLobby .err{color:#ff9b8a;min-height:20px;margin-top:10px;font-size:14px}
#netLobby .small{font-size:13px;opacity:.7;margin-top:14px}
#netBadge{position:fixed;left:50%;transform:translateX(-50%);bottom:10px;z-index:9000;background:rgba(15,12,9,.92);color:#f3e6c8;border:1px solid rgba(224,164,88,.45);border-radius:999px;padding:6px 8px 6px 14px;font:13px/1.3 ui-monospace,monospace;display:flex;gap:10px;align-items:center;max-width:calc(100vw - 32px);flex-wrap:wrap;justify-content:center}
#netBadge button{background:#e0a458;color:#1a120a;border:0;border-radius:999px;padding:5px 12px;cursor:pointer;font:inherit}
@media (max-width:700px){#netBadge{bottom:calc(env(safe-area-inset-bottom,0px) + 84px);font-size:11px;padding:4px 4px 4px 10px;gap:6px;flex-wrap:nowrap;white-space:nowrap}#netBadge button{padding:4px 10px}}
#netBadge.mini .nb-x{display:none}`;document.head.appendChild(st);
  const q=new URLSearchParams(location.search);const invited=norm(q.get('room')||'');const lastHost=LS('glt-last-host');
  const el=document.createElement('div');el.id='netLobby';el.innerHTML=`<div class="box">
    <h1>Grand Line Table</h1><p>${invited?`You have been invited to room <b>${invited}</b>.`:'Host a game for your crew, or join a friend\'s game with their room code.'}</p>
    <div id="nlJoin"><label>Room code</label><div class="row"><input id="nlCode" placeholder="ABC-123" maxlength="7" value="${invited}" autocomplete="off"><button type="button" id="nlGo">Join</button></div></div>
    <div class="or">or</div>
    <button type="button" id="nlHost" class="${invited?'alt':''}">${lastHost?`Host your game again (room ${lastHost})`:'Host a new game'}</button>
    ${lastHost?'<button type="button" id="nlNew" class="alt">Host a brand-new table</button>':''}
    <button type="button" id="nlSolo" class="alt">Play alone on this device</button>
    <div class="err" id="nlErr"></div>
    <div class="small">The host's browser runs the game and keeps the save. Keep it open while your friends play.</div></div>`;
  document.body.appendChild(el);const $$=id=>document.getElementById(id);const err=t=>{$$('nlErr').textContent=t};
  const busy=b=>el.querySelectorAll('button').forEach(x=>x.disabled=b);
  const done=mode=>{N.readyDone=true;el.remove();if(mode!=='solo'){const b=document.createElement('div');b.id='netBadge';document.body.appendChild(b);netBadge();
      if(mode==='host')window.addEventListener('beforeunload',e=>{if(N.conns.size){e.preventDefault();e.returnValue=''}})}readyRes(mode)};
  const host=async code=>{busy(true);err('Opening the room…');try{await startHost(code);done('host')}catch(e){busy(false);err(e.message||'Could not open the room.')}};
  $$('nlHost').onclick=()=>host(lastHost||codeGen());if($$('nlNew'))$$('nlNew').onclick=()=>{if(confirm('Start a brand-new table? Your old one stays saved, and you can open it again later with its room code.'))host(codeGen())};
  $$('nlSolo').onclick=()=>done('solo');
  const join=async()=>{const code=norm($$('nlCode').value);if(code.length!==7){err('A room code looks like ABC-123.');return}
    if(code===LS('glt-last-host')){host(code);return}
    busy(true);err('Connecting to the host…');try{await startJoin(code);if(location.search)history.replaceState(null,'',location.pathname);done('guest')}catch(e){busy(false);err(e.message||'Could not join.')}};
  $$('nlGo').onclick=join;$$('nlCode').onkeydown=e=>{if(e.key==='Enter')join()};
  if(typeof Peer==='undefined'){err('The multiplayer library did not load. Check your internet connection and reload.');$$('nlHost').disabled=true;$$('nlGo').disabled=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lobby);else lobby();
})();
