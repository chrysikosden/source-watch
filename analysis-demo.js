'use strict';
// Genuine app/ChatGPT captured states. Generation waiting time is shortened.
const analysisScenes=[[0,'10-feed'],[600,'11-selected'],[1600,'13-desk'],
 [3300,'14-copied'],[4300,'18-chatgpt'],[5100,'15-pasted'],
 [7200,'17-response']];
const analysisActions=[[520,.14052,.42833],[1450,.367547,.355556],
 [3180,.4647,.3765],[4150,.5308,.3765],[4950,.505,.51],[5800,.599,.558]];
function analysisState(time){
 time=Math.max(0,Math.min(9999,time));
 const scene=analysisScenes.findLast(s=>s[0]<=time);
 let scale=1,cx=.5,cy=.5;
 const smooth=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p)};
 if(time<4300){const z=smooth((time-2150)/600);scale=1+.8*z;cx=.5;cy=.5-.12*z;}
 else{scale=3.2;cx=.505;cy=time<7200?.51:.37;}
 let prior=[0,.10,.55],cursor;
 for(const next of analysisActions){
  if(time<next[0]){const p=smooth((time-(next[0]-400))/400);cursor={x:prior[1]+(next[1]-prior[1])*p,y:prior[2]+(next[2]-prior[2])*p,click:prior[0]};break;}prior=next;
 }
 cursor||={x:prior[1],y:prior[2],click:prior[0]};
 if(time>=4300&&time<4950){const p=smooth((time-4500)/450);cursor.x=.40+(.505-.40)*p;cursor.y=.42+(.51-.42)*p;}
 cursor.opacity=Math.max(0,Math.min(1,time/150,(6200-time)/200));
 return{scene,camera:[scale,cx,cy],cursor,time};
}
// Alternate route starts at the expanded, muted player from section 02.
// Transcript-only material is pasted, not submitted; the first route's answer
// is never presented as the result of this different input.
const playerScenes=[[0,'20-player'],[900,'21-player'],[2200,'22-player-copied'],[3600,'23-player-chatgpt'],[4500,'24-player-pasted']];
const playerActions=[[2100,.380869,.881736],[3450,.710249,.881736],[4350,.505,.51]];
const analysisDuration=18500,playerOffset=10500;
function playerAnalysisState(time){
 time=Math.max(0,Math.min(7999,time));
 const smooth=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p)};
 const z=smooth((time-600)/650);
 const camera=time<3600?[1+.65*z,.5+.05*z,.5+.22*z]:[3.2,.505,.51];
 let prior=[0,.30,.62],cursor;
 for(const next of playerActions){
  if(time<next[0]){const p=smooth((time-(next[0]-450))/450);cursor={x:prior[1]+(next[1]-prior[1])*p,y:prior[2]+(next[2]-prior[2])*p,click:prior[0]};break;}prior=next;
 }
 cursor||={x:prior[1],y:prior[2],click:prior[0]};
 if(time>=3600&&time<4350){const p=smooth((time-3750)/600);cursor.x=.40+.105*p;cursor.y=.42+.09*p;}
 cursor.opacity=Math.max(0,Math.min(1,time/180,(5000-time)/250));
 return{scene:playerScenes.findLast(s=>s[0]<=time),camera,cursor,time};
}
function analysisPlaylistState(time){
 time=Math.max(0,Math.min(analysisDuration-1,time));
 if(time<10000)return{...analysisState(time),route:'desk',actions:analysisActions,blend:1};
 const state=playerAnalysisState(Math.max(0,time-playerOffset));
 return{...state,route:'player',actions:playerActions,blend:Math.min(1,(time-10000)/500)};
}
if(typeof module!=='undefined')module.exports={analysisScenes,analysisActions,analysisState,playerScenes,playerActions,playerAnalysisState,analysisPlaylistState,analysisDuration};
if(typeof document!=='undefined')(()=>{
 const root=document.querySelector('.analysis-demo');if(!root)return;
 const picture=root.querySelector('.demo-image'),wrap=root.querySelector('.demo-image-wrap'),pointer=root.querySelector('.demo-pointer'),pulse=root.querySelector('.demo-click');
 const ghost=wrap.cloneNode(true);ghost.classList.add('demo-transition');ghost.setAttribute('aria-hidden','true');ghost.hidden=true;wrap.before(ghost);
 const ghostPicture=ghost.querySelector('img'),badge=root.querySelector('.demo-badge');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay'),progress=root.querySelector('.demo-progress span'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const{scene,camera:[scale,cx,cy],cursor,route,actions,blend,time:localTime}=analysisPlaylistState(time);
  badge.textContent=route==='desk'?'ANALYSIS DESK → CHATGPT':'VIDEO PLAYER → CHATGPT';
  ghost.hidden=blend>=1;wrap.style.opacity=String(blend);
  if(blend<1){ghostPicture.src='analysis4k/17-response.jpg';ghost.style.transform='translate(-111.6%, -68.4%) scale(3.2)';ghost.style.opacity=String(1-blend);}
  if(current!==scene[1]){current=scene[1];picture.src='analysis4k/'+current+'.jpg';}
  const tx=Math.max(1-scale,Math.min(0,.5-scale*cx)),ty=Math.max(1-scale,Math.min(0,.5-scale*cy));
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  pointer.hidden=cursor.opacity<=0;pointer.style.opacity=String(cursor.opacity);pointer.style.left=(tx+scale*cursor.x)*100+'%';pointer.style.top=(ty+scale*cursor.y)*100+'%';
  const action=actions.find(a=>a[0]===cursor.click),age=localTime-cursor.click;
  pulse.hidden=!action||age>180;
  if(action){pulse.style.left=(tx+scale*action[1])*100+'%';pulse.style.top=(ty+scale*action[2])*100+'%';}
  pulse.style.opacity=String(Math.max(0,.7*(1-age/180)));pulse.style.transform=`translate(-50%,-50%) scale(${.65+Math.min(age/180,1)*.65})`;progress.style.width=time/analysisDuration*100+'%';
 }
 function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' Analysis Desk animation');}
 function stop(){cancelAnimationFrame(raf);raf=0;previous=null;}
 function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
 function tick(now){if(!ready||paused||!visible||document.hidden){stop();return;}if(previous!==null)elapsed=(elapsed+now-previous)%analysisDuration;previous=now;render(elapsed);raf=requestAnimationFrame(tick);}
 toggle.addEventListener('click',()=>{paused=!paused;label();paused?stop():start();});
 replay.addEventListener('click',()=>{elapsed=0;previous=null;paused=false;render(0);label();start();});
 motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();elapsed=9999;render(elapsed);}else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 async function load(){if(loading)return;loading=true;try{await Promise.all([...analysisScenes,...playerScenes].map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='analysis4k/'+s[1]+'.jpg';})));ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?9999:0);start();}catch{root.dataset.error='capture-load';}}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
})();
