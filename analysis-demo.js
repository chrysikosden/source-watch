'use strict';
// Genuine captured states. The prepared material is not submitted to ChatGPT.
const analysisScenes=[[0,'00-desk'],[2050,'01-copied'],[4100,'02-chatgpt'],[5600,'03-pasted']];
const analysisActions=[[1950,.4647,.3765],[3900,.5309,.3765],[5450,.505,.51]];
function analysisState(time){
 time=Math.max(0,Math.min(9999,time));
 const scene=analysisScenes.findLast(s=>s[0]<=time);
 let scale=1,cx=.5,cy=.5;
 const smooth=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p)};
 if(time<4100){const z=time<2800?smooth((time-550)/650):1-smooth((time-2800)/650);scale=1+.8*z;cx=.5;cy=.5-.12*z;}
 else{scale=3.2;cx=.505;cy=.51;}
 let prior=[0,.37,.47],cursor;
 for(const next of analysisActions){
  if(time<next[0]){const p=smooth((time-(next[0]-400))/400);cursor={x:prior[1]+(next[1]-prior[1])*p,y:prior[2]+(next[2]-prior[2])*p,click:prior[0]};break;}prior=next;
 }
 cursor||={x:prior[1],y:prior[2],click:prior[0]};
 if(time>=4100){const p=smooth((time-4650)/800);cursor.x=.40+(.505-.40)*p;cursor.y=.42+(.51-.42)*p;}
 cursor.opacity=Math.max(0,Math.min(1,time/150,(5850-time)/200));
 return{scene,camera:[scale,cx,cy],cursor,time};
}
if(typeof module!=='undefined')module.exports={analysisScenes,analysisActions,analysisState};
if(typeof document!=='undefined')(()=>{
 const root=document.querySelector('.analysis-demo');if(!root)return;
 const picture=root.querySelector('.demo-image'),wrap=root.querySelector('.demo-image-wrap'),pointer=root.querySelector('.demo-pointer'),pulse=root.querySelector('.demo-click');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay'),progress=root.querySelector('.demo-progress span'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const{scene,camera:[scale,cx,cy],cursor}=analysisState(time);
  if(current!==scene[1]){current=scene[1];picture.src='analysis4k/'+current+'.jpg';}
  const tx=Math.max(1-scale,Math.min(0,.5-scale*cx)),ty=Math.max(1-scale,Math.min(0,.5-scale*cy));
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  pointer.hidden=cursor.opacity<=0;pointer.style.opacity=String(cursor.opacity);pointer.style.left=(tx+scale*cursor.x)*100+'%';pointer.style.top=(ty+scale*cursor.y)*100+'%';
  const action=analysisActions.find(a=>a[0]===cursor.click),age=time-cursor.click;
  pulse.hidden=!action||age>180;
  if(action){pulse.style.left=(tx+scale*action[1])*100+'%';pulse.style.top=(ty+scale*action[2])*100+'%';}
  pulse.style.opacity=String(Math.max(0,.7*(1-age/180)));pulse.style.transform=`translate(-50%,-50%) scale(${.65+Math.min(age/180,1)*.65})`;progress.style.width=time/100+'%';
 }
 function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' Analysis Desk animation');}
 function stop(){cancelAnimationFrame(raf);raf=0;previous=null;}
 function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
 function tick(now){if(!ready||paused||!visible||document.hidden){stop();return;}if(previous!==null)elapsed=(elapsed+now-previous)%10000;previous=now;render(elapsed);raf=requestAnimationFrame(tick);}
 toggle.addEventListener('click',()=>{paused=!paused;label();paused?stop():start();});
 replay.addEventListener('click',()=>{elapsed=0;previous=null;paused=false;render(0);label();start();});
 motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();elapsed=9999;render(elapsed);}else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 async function load(){if(loading)return;loading=true;try{await Promise.all(analysisScenes.map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='analysis4k/'+s[1]+'.jpg';})));ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?9999:0);start();}catch{root.dataset.error='capture-load';}}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
})();
