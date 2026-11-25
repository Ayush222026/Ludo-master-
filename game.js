const $=s=>document.querySelector(s),COL=['#e53935','#43a047','#fdd835','#1e88e5'],NM=['Red','Green','Yellow','Blue'],AV=['🦁','🐯','🦊','🐼'],FACE='⚀⚁⚂⚃⚄⚅'.split('');
const P="1,6 2,6 3,6 4,6 5,6 6,5 6,4 6,3 6,2 6,1 6,0 7,0 8,0 8,1 8,2 8,3 8,4 8,5 9,6 10,6 11,6 12,6 13,6 14,6 14,7 14,8 13,8 12,8 11,8 10,8 9,8 8,9 8,10 8,11 8,12 8,13 8,14 7,14 6,14 6,13 6,12 6,11 6,10 6,9 5,8 4,8 3,8 2,8 1,8 0,8 0,7 0,6".split(' ').map(s=>s.split(',').map(Number));
const START=[0,13,26,39],SAFE=new Set([0,8,13,21,26,34,39,47]),TRICK=[3,10,16,23,29,36,42,49],YO=[[0,0],[9,0],[9,9],[0,9]],YS=[[1.7,1.7],[4.3,1.7],[1.7,4.3],[4.3,4.3]];
const HOME=(c,k)=>[[1+k,7],[7,1+k],[13-k,7],[7,13-k]][c],FIN=[[6.6,7.5],[7.5,6.6],[8.4,7.5],[7.5,8.4]];
const ld=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch(e){return d}};
let INV=ld('lk_inv',{}),ST=ld('lk_st',{p:0,cap:0,dice:0,h:[]}),G=null,busy=false,sfx=true,music=false,AC;
let FX=[],cfg={mode:'c',n:2,vs:'cpu',d:'medium'},step='home';const seat=c=>cfg.vs=='fr'||c==0?'H':cfg.d,DEF=['Red','Green','Yellow','Blue'];
const AVL=['🦁','🐯','🦊','🐼','🐸','🐵','🦄','🐲','🐧','🦉'];let PR=ld('lk_pr',{});for(const c in PR){NM[c]=PR[c].n;AV[c]=PR[c].a}
const savePR=()=>{PR={};for(let c=0;c<4;c++)PR[c]={n:NM[c],a:AV[c]};localStorage.lk_pr=JSON.stringify(PR)};
const store=()=>{localStorage.lk_inv=JSON.stringify(INV);localStorage.lk_st=JSON.stringify(ST)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),rnd=n=>Math.floor(Math.random()*n),ACT=()=>cfg.n==2?[0,2]:cfg.n==3?[0,1,2]:[0,1,2,3];
function beep(f,d=.1,t='sine',v=.08,force){if(!sfx&&!force)return;try{AC=AC||new(window.AudioContext||webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const NOTES=[262,330,392,523,392,330,294,370,440,587,440,370];let ni=0;setInterval(()=>{if(music)beep(NOTES[ni++%12],.4,'triangle',.03,1)},450);
function mr(){$('#tav').textContent=AV[0];$('#tnm').textContent=NM[0];$('#tmode').textContent=cfg.mode=='t'?'⚡ Tricky':'🎲 Classic';const m=$('#stage'),cpu=cfg.vs=='cpu';
if(step=='home')m.innerHTML=`<div class=seg><button data-m=c class="${cfg.mode=='c'?'on':''}">🎲 Classic</button><button data-m=t class="${cfg.mode=='t'?'on':''}">⚡ Tricky</button></div>
<div class=grid><button class=tile data-go=cpu><span class=e>🤖</span><span class=l>COMPUTER</span></button><button class=tile data-go=fr><span class=e>👥</span><span class=l>FRIENDS</span></button></div>
${localStorage.lk_save?'<button class="gold big" data-go=resume>⏪ RESUME GAME</button>':''}
<div class=nav><button data-go=home>🏠<br>HOME</button><button data-go=inv>📊<br>STATS</button></div>`;
else if(step=='count')m.innerHTML=`<h2>How many players?</h2><div class="grid g3">${[2,3,4].map(n=>`<button class="tile${cfg.n==n?' sel':''}" data-n=${n}><span class=e>${'👤'.repeat(n)}</span><span class=l>${n} PLAYERS</span></button>`).join('')}</div>
${cpu?`<b>Computer level</b><div class=row style="justify-content:center">${['easy','medium','hard'].map(d=>`<button data-d=${d} class="${cfg.d==d?'on':''}">${d.toUpperCase()}</button>`).join('')}</div>`:''}
<button class="gold big" data-go=names>NEXT ➜</button><button class="back big" data-go=home>⬅ Back</button>`;
else if(step=='names')m.innerHTML=`<h2>Player names</h2>`+ACT().map(c=>seat(c)=='H'?`<div class=row style="justify-content:center;align-items:center"><button data-a=${c} style="border-color:${COL[c]}">${AV[c]}</button><input data-p=${c} value="${NM[c]}" maxlength=10></div>`:`<div class=row style="justify-content:center;align-items:center"><button disabled style="border-color:${COL[c]}">${AV[c]}</button><input disabled value="Computer (${cfg.d})"></div>`).join('')+`<p style="opacity:.7;font-size:13px">Tap the avatar to change it</p><button class="gold big" data-go=ready>NEXT ➜</button><button class="back big" data-go=count>⬅ Back</button>`;
else if(step=='ready')m.innerHTML=`<h2>Ready?</h2><div class=card>${cfg.mode=='t'?'⚡ Tricky':'🎲 Classic'} · ${cpu?'vs Computer':'Friends'}<hr>`+ACT().map(c=>`<span style="color:${COL[c]}">●</span> ${AV[c]} ${seat(c)=='H'?NM[c]:'Computer ('+cfg.d+')'}`).join('<br>')+`</div><button id=go class="gold big">▶ START GAME</button><button class="back big" data-go=names>⬅ Back</button>`;
else m.innerHTML=`<h2>📊 Stats</h2><div class=card><b>⚡ Special dice &amp; 🚧 roadblocks</b><br><small>Only in Tricky mode. Pick up 🎲 / 🚧 / 🛡️ from tiles on the path (a tile jumps elsewhere after pickup). ⚡ boosts you +4, 🕳️ traps you −3. Start at 0 each game, no limit, reset at game end.</small><hr>Games finished: ${ST.p} · Captures: ${ST.cap}<br>`+ST.h.slice(-8).reverse().join('<br>')+`</div><button class="back big" data-go=home>⬅ Back</button>`}
$('#menu').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.m)cfg.mode=d.m;if(d.n)cfg.n=+d.n;if(d.d)cfg.d=d.d;
if(d.a!=null){AV[d.a]=AVL[(AVL.indexOf(AV[d.a])+1)%AVL.length];savePR()}
if(d.go=='cpu'||d.go=='fr'){cfg.vs=d.go;step='count'}else if(d.go=='resume'){G=ld('lk_save',null);if(G)return begin()}else if(d.go)step=d.go;
if(b.id=='go')return startGame();mr()};
$('#menu').oninput=e=>{const c=e.target.dataset.p;if(c!=null){NM[c]=e.target.value.trim()||DEF[c];savePR()}};
$('#wagain').onclick=()=>startGame();$('#whome').onclick=()=>{$('#win').hidden=true;show(false)};
function startGame(){G={mode:cfg.mode,turn:0,bk:[],pk:cfg.mode=='t'?mkPk():[],pl:ACT().map(c=>{const h=seat(c)=='H';return{c,ai:h?0:cfg.d,t:[-1,-1,-1,-1],sh:[0,0,0,0],inv:0,bl:0}})};begin()}
function show(g){$('#menu').hidden=g;$('#game').hidden=!g;if(g)resize();else{step='home';mr()}}
function begin(){$('#win').hidden=true;show(true);music=true;turn()}
$('#mn').onclick=()=>{busy=true;show(false)};
$('#sfxb').onclick=e=>{sfx=!sfx;e.target.textContent=sfx?'🔊':'🔇'};$('#mub').onclick=e=>{music=!music;e.target.style.opacity=music?1:.4};
const lv=p=>({easy:1,medium:2,hard:3})[p.ai],cur=()=>G.pl[G.turn],msg=t=>$('#msg').textContent=t;
const blk=(p,f,to)=>{for(let k=f<0?0:f+1;k<=Math.min(to,50);k++){const a=abs(p,k);if((G.bk||[]).some(b=>b.a==a&&b.o!=p.c))return true;if(!SAFE.has(a)&&G.pl.some(o=>o!==p&&o.t.filter(q=>q>=0&&q<=50&&abs(o,q)==a).length>1))return true}return false};
const legal=(p,r)=>[0,1,2,3].filter(i=>p.t[i]<0?r==6&&!blk(p,-1,0):p.t[i]+r<=56&&!blk(p,p.t[i],p.t[i]+r));
function mkPk(){const pk=[];for(const t of 'ddddbbssxxxyyy'){let a;do{a=rnd(52)}while(SAFE.has(a)||pk.some(x=>x.a==a));pk.push({a,t})}return pk}
function relocate(k){let a;do{a=rnd(52)}while(SAFE.has(a)||a==k.a||G.pk.some(x=>x.a==a));k.a=a}
function aiBlock(p){let best=null;for(const o of G.pl)if(o!==p)for(const q of o.t)if(q>=8&&q<=47&&(!best||q>best.q))best={o,q};
if(!best)return;const a=abs(best.o,best.q+(lv(p)>2?1:1+rnd(3)));if(G.bk.some(b=>b.a==a))return;p.bl--;G.bk.push({a,o:p.c});msg(`🚧 ${NM[p.c]} placed a roadblock!`)}
function gain(p,n){if(G.mode=='t')p.inv+=n}
function use(p){p.inv--}
const abs=(p,q)=>(START[p.c]+q)%52;
function danger(p,a){let n=0;for(const o of G.pl)if(o!==p)for(const q of o.t)if(q>=0&&q<=50){const d=(a-abs(o,q)+52)%52;if(d>=1&&d<=6)n++}return n}
function score(p,i,r){const t=p.t[i],to=t<0?0:t+r,l=lv(p);let s=Math.random()*5+to*.3;if(to==56)s+=80;if(t<0)s+=45;
if(to<=50){const a=abs(p,to);if(!SAFE.has(a)){for(const o of G.pl)if(o!==p)for(const q of o.t)if(q>=0&&q<=50&&abs(o,q)==a)s+=100;if(l>2)s-=danger(p,a)*18}else if(l>2)s+=25;
if(l>2&&!SAFE.has(a)&&p.t.some((q,j)=>j!=i&&q==to))s+=20;
if(l>2&&t>=0&&t<=50&&!SAFE.has(abs(p,t)))s+=danger(p,abs(p,t))*22}else s+=20;return s}
function pick(p,r,m){if(lv(p)==1)return m[rnd(m.length)];return m.reduce((b,i)=>score(p,i,r)>score(p,b,r)?i:b,m[0])}
async function turn(){if(G.over)return;G.bk=G.bk||[];G.pk=G.pk||[];const p=cur();G.ph='roll';localStorage.lk_save=JSON.stringify(G);busy=false;ui();msg(`${AV[p.c]} ${NM[p.c]}'s turn`);
if(p.ai){busy=true;ui();await sleep(800);if(G.mode=='t'&&lv(p)>1&&(p.bl||0)>0)aiBlock(p);if(lv(p)>1&&p.inv>0){let b=[0,0];for(let n=1;n<7;n++)for(const i of legal(p,n)){const s=score(p,i,n);if(s>b[0])b=[s,n]}if(b[0]>=(lv(p)>2?80:100)){use(p);return roll(b[1])}}roll()}}
function ui(){const p=cur();$('#bar').innerHTML=G.pl.map((q,i)=>`<div class="pc${i==G.turn?' on':''}" style="border-color:${COL[q.c]}">${AV[q.c]}<small>${NM[q.c]}${q.ai?' 🤖':''}</small>🏠${q.t.filter(x=>x==56).length}${G.mode=='t'?' 🎲'+q.inv+' 🚧'+(q.bl||0):''}</div>`).join('');
$('#sp').hidden=!(!p.ai&&p.inv>0&&G.ph=='roll'&&!busy);$('#sp').textContent=`🎲 Use special dice ×${p.inv}`;$('#bl').hidden=!(G.mode=='t'&&!p.ai&&(p.bl||0)>0&&(G.ph=='roll'||G.ph=='place')&&!busy);$('#bl').textContent=G.ph=='place'?'✖ Cancel':`🚧 Place roadblock ×${p.bl}`;$('#pk').hidden=true}
$('#bl').onclick=()=>{if(busy)return;if(G.ph=='roll'){G.ph='place';msg('🚧 Tap a cell on the path to place the roadblock');ui()}else if(G.ph=='place'){G.ph='roll';msg('Your turn');ui()}};
$('#dice').onclick=()=>{if(!busy&&!cur().ai&&G.ph=='roll')roll()};
$('#sp').onclick=()=>{$('#pk').hidden=!$('#pk').hidden};
$('#pk').innerHTML=[1,2,3,4,5,6].map(n=>`<button data-n="${n}">${n}</button>`).join('');
$('#pk').onclick=e=>{const n=+e.target.dataset.n;if(n&&!busy&&G.ph=='roll'&&cur().inv>0){use(cur());roll(n)}};
async function roll(f){busy=true;const p=cur();ui();$('#dice').classList.add('rl');for(let k=0;k<8;k++){$('#dice').textContent=FACE[rnd(6)];beep(200+k*40,.05);await sleep(70)}$('#dice').classList.remove('rl');
const r=f||rnd(6)+1;G.roll=r;if(r==6){G.six=(G.six||0)+1;if(G.six>=3){G.six=0;$('#dice').textContent=FACE[5];msg('🚫 Three 6s in a row! Turn lost');await sleep(1200);return nxt()}}else G.six=0;$('#dice').textContent=FACE[r-1];const m=legal(p,r);
if(!m.length){msg(`Rolled ${r} - no move${(G.bk||[]).some(b=>b.o!=p.c)?' (🚧 roadblock)':''}`);await sleep(800);return nxt()}
if(p.ai||m.length==1){await sleep(300);return move(p,p.ai?pick(p,r,m):m[0],r)}
G.ph='pick';busy=false;msg(`Rolled ${r} - tap a glowing token`)}
function nxt(){G.six=0;G.turn=(G.turn+1)%G.pl.length;G.bk=(G.bk||[]).filter(b=>b.o!=G.pl[G.turn].c);turn()}
async function move(p,i,r){busy=true;G.ph='x';const t=p.t,from=t[i],to=from<0?0:from+r;let ex=r==6,cap=0;
if(from<0){t[i]=0;beep(500)}else for(let k=from+1;k<=to;k++){t[i]=k;beep(300+k*5,.05);await sleep(130)}
if(to<=50){const a=abs(p,to);
if(!SAFE.has(a))for(const o of G.pl)if(o!==p)o.t.forEach((q,j)=>{if(q>=0&&q<=50&&abs(o,q)==a){if(o.sh&&o.sh[j]){o.sh[j]=0;msg('🛡️ Shield saved a token!')}else{FX.push([...xy(o,j),Date.now(),COL[o.c]]);o.t[j]=-1;cap++}}});
if(G.mode=='t'){const k=(G.pk||[]).find(x=>x.a==a);if(k){await sleep(250);beep(800,.25,'square');if(k.t=='d'){gain(p,1);msg('🎲 Special dice collected!');relocate(k)}else if(k.t=='b'){p.bl=(p.bl||0)+1;msg('🚧 Roadblock collected!');relocate(k)}else if(k.t=='s'){(p.sh=p.sh||[0,0,0,0])[i]=1;msg('🛡️ Shield! Safe from the next capture');relocate(k)}else if(k.t=='x'){if(to+4<=50){t[i]=to+4;msg('⚡ Boost! +4 steps')}}else if(k.t=='y'&&to>=3){t[i]=to-3;msg('🕳️ Trap! Back 3 steps')}}}}
if(cap){ex=true;ST.cap+=cap;gain(p,cap);beep(120,.4,'sawtooth');msg(`💥 Captured ${cap}!${G.mode=='t'?' +'+cap+' special dice':''}`)}
if(to==56){ex=true;gain(p,1);beep(900,.3);msg(G.mode=='t'?'🏠 Token home! +1 special dice':'🏠 Token home!')}
ui();await sleep(600);
if(t.every(q=>q==56)){G.over=true;delete localStorage.lk_save;ST.p++;ST.h.push(`${new Date().toLocaleDateString()} · ${G.mode=='t'?'Tricky':'Classic'} · ${AV[p.c]} ${NM[p.c]} won`);store();msg(`🏆 ${NM[p.c]} wins!`);$('#wn').textContent=`${AV[p.c]} ${NM[p.c]} wins!`;$('#ws').textContent=`Games finished: ${ST.p}`;$('#win').hidden=false;[523,659,784,1047].forEach((f,k)=>setTimeout(()=>beep(f,.3),k*200));return}
ex?turn():nxt()}
function xy(p,i){const q=p.t[i];if(q<0){const[a,b]=YS[i],[ox,oy]=YO[p.c];return[ox+a,oy+b]}
if(q<=50){const c=P[abs(p,q)];return[c[0]+.5+(i-1.5)*.06,c[1]+.5+(i-1.5)*.06]}
if(q<=55){const c=HOME(p.c,q-51);return[c[0]+.5,c[1]+.5]}return[FIN[p.c][0]+(i-1.5)*.1,FIN[p.c][1]+(i-1.5)*.1]}
const cv=$('#cv'),X=cv.getContext('2d');
function resize(){const w=Math.min(innerWidth-20,480),d=devicePixelRatio||1;cv.style.width=cv.style.height=w+'px';cv.width=cv.height=Math.round(w*d)}
addEventListener('resize',()=>{if(!$('#game').hidden)resize()});
cv.onclick=e=>{if(!G||busy)return;const b=cv.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*15,y=(e.clientY-b.top)/b.height*15,p=cur();
if(G.ph=='place'){const i=P.findIndex(c=>c[0]==Math.floor(x)&&c[1]==Math.floor(y));if(i<0){msg('Tap a cell on the path');return}p.bl--;G.bk.push({a:i,o:p.c});G.ph='roll';ui();msg('🚧 Roadblock placed! Now roll the dice');beep(250,.2,'square');return}
if(G.ph!='pick')return;
for(const i of legal(p,G.roll)){const[a,c]=xy(p,i);if(Math.hypot(a-x,c-y)<.8){return move(p,i,G.roll)}}};
function draw(){const s=cv.width/15;if(!G||$('#game').hidden)return;X.fillStyle='#fff8e1';X.fillRect(0,0,cv.width,cv.width);
for(let c=0;c<4;c++){const[ox,oy]=YO[c];X.fillStyle=COL[c];X.fillRect(ox*s,oy*s,6*s,6*s);X.fillStyle='#fffdf5';X.beginPath();X.roundRect?X.roundRect((ox+.8)*s,(oy+.8)*s,4.4*s,4.4*s,.6*s):X.rect((ox+.8)*s,(oy+.8)*s,4.4*s,4.4*s);X.fill();
if(G.pl.some(q=>q.c==c))YS.forEach(([a,b])=>{X.fillStyle=COL[c]+'99';X.beginPath();X.arc((ox+a)*s,(oy+b)*s,.55*s,0,7);X.fill()})}
X.font=`${s*.6}px sans-serif`;X.textAlign='center';X.textBaseline='middle';
P.forEach(([a,b],i)=>{X.fillStyle='#fff';X.fillRect(a*s,b*s,s,s);const c=START.indexOf(i);if(c>=0){X.fillStyle=COL[c];X.fillRect(a*s,b*s,s,s)}
X.strokeStyle='#8886';X.strokeRect(a*s,b*s,s,s);if(SAFE.has(i)){X.fillStyle=c>=0?'#fff':'#f5a300';X.fillText('★',(a+.5)*s,(b+.55)*s)}
else{const k=(G.pk||[]).find(x=>x.a==i);if(k){X.fillStyle={x:'#fff59d',y:'#ffcdd2'}[k.t]||'#f3e5f5';X.fillRect(a*s+1,b*s+1,s-2,s-2);X.fillStyle='#000';X.fillText({d:'🎲',b:'🚧',s:'🛡️',x:'⚡',y:'🕳️'}[k.t],(a+.5)*s,(b+.55)*s)}}});
for(let c=0;c<4;c++)for(let k=0;k<5;k++){const[a,b]=HOME(c,k);X.fillStyle=COL[c];X.fillRect(a*s,b*s,s,s);X.strokeStyle='#fff6';X.strokeRect(a*s,b*s,s,s)}
[[[6,6],[6,9]],[[6,6],[9,6]],[[9,6],[9,9]],[[6,9],[9,9]]].forEach(([u,v],c)=>{X.fillStyle=COL[c];X.beginPath();X.moveTo(u[0]*s,u[1]*s);X.lineTo(v[0]*s,v[1]*s);X.lineTo(7.5*s,7.5*s);X.fill()});
(G.bk||[]).forEach(k=>{const[a,b]=P[k.a];X.strokeStyle=COL[k.o];X.lineWidth=s*.12;X.strokeRect(a*s+2,b*s+2,s-4,s-4);X.fillStyle='#000';X.fillText('🚧',(a+.5)*s,(b+.55)*s)});
const mv=G.ph=='pick'?legal(cur(),G.roll):[],pulse=.5+.5*Math.sin(Date.now()/150);
G.pl.forEach(p=>p.t.forEach((q,i)=>{const[ta,tb]=xy(p,i),d=(p.d=p.d||[])[i]=p.d[i]||[ta,tb];d[0]+=(ta-d[0])*.3;d[1]+=(tb-d[1])*.3;const a=d[0],b=d[1];
X.fillStyle='#0005';X.beginPath();X.ellipse(a*s,(b+.26)*s,.3*s,.12*s,0,0,7);X.fill();
const g=X.createRadialGradient((a-.1)*s,(b-.12)*s,.04*s,a*s,b*s,.36*s);g.addColorStop(0,'#fff');g.addColorStop(.25,COL[p.c]);g.addColorStop(1,'#000a');
X.fillStyle=g;X.strokeStyle='#fff';X.lineWidth=s*.06;X.beginPath();X.arc(a*s,b*s,.33*s,0,7);X.fill();X.stroke();
if(q>=0&&q<=50&&!SAFE.has(abs(p,q))&&p.t.filter(z=>z==q).length>1){X.strokeStyle='#ffd54a';X.lineWidth=s*.07;X.beginPath();X.arc(a*s,b*s,.4*s,0,7);X.stroke()}
if(p.sh&&p.sh[i]){X.strokeStyle='#80d8ff';X.lineWidth=s*.08;X.beginPath();X.arc(a*s,b*s,.42*s,0,7);X.stroke()}
if(p===cur()&&mv.includes(i)){X.strokeStyle=`rgba(255,255,255,${.4+pulse*.6})`;X.lineWidth=s*.1;X.beginPath();X.arc(a*s,b*s,(.45+pulse*.1)*s,0,7);X.stroke()}}))}
function fxd(){if(!G)return;const s=cv.width/15,n=Date.now();FX=FX.filter(f=>n-f[2]<600);FX.forEach(f=>{const k=(n-f[2])/600;X.globalAlpha=1-k;X.strokeStyle=f[3];X.lineWidth=s*.1;X.beginPath();X.arc(f[0]*s,f[1]*s,(.3+k*1.2)*s,0,7);X.stroke();for(let i=0;i<8;i++){const an=i*.785;X.fillStyle='#ffd54a';X.beginPath();X.arc((f[0]+Math.cos(an)*k*1.3)*s,(f[1]+Math.sin(an)*k*1.3)*s,.07*s,0,7);X.fill()}X.globalAlpha=1})}
(function loop(){draw();fxd();requestAnimationFrame(loop)})();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
mr();
window.__ok=1;
