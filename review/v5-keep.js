'use strict';
// Genuine 2560x1440 application states from an isolated local filming profile.
// Text entry and navigation pauses are shortened; no generated app screens.
const keepDuration=44000;
const keepScenes=[[0,"01-one-video"],[3200,"02-search-query"],[6400,"03-search-results"],[8800,"04-bloomberg-selected"],[10000,"04b-euronews-choice"],[12300,"05-two-selected"],[13500,"05b-return-to-research"],[15100,"06-open-research"],[16800,"07-add-selected"],[19000,"08-three-videos-added"],[20200,"09-three-sources"],[23300,"10-ai-finding"],[26700,"11-own-note"],[29200,"12-saved"],[31000,"13-leave"],[33300,"14-return-library"],[35300,"15-restored-notes"],[39300,"16-restored-videos"]];
const keepActions=[[2900,0.06363107033146238,0.24308621110587283],[3550,0.28299029600273057,0.29310344827586204],[6100,0.18328641428530795,0.5000689907731681],[8500,0.4363033894659246,0.6565172497979526],[12000,0.4363033894659246,0.5001034651131465],[14800,0.06712621596253034,0.46901724979795256],[16500,0.561747572815534,0.30586206896551726],[18700,0.4114514574958283,0.2577241463496767],[23500,0.561747572815534,0.5464569249646417],[28900,0.17397815593238017,0.7742413961476293],[30700,0.06363107033146238,0.16446552145070042],[33000,0.06712621596253034,0.46901724979795256],[35000,0.561747572815534,0.30586206896551726]];
const keepCamera=[[0,1,0.5,0.5],[3300,1,0.5,0.5],[4050,1.25,0.4,0.4],[6000,1.25,0.4,0.4],[6700,1,0.5,0.5],[23300,1,0.5,0.5],[24100,1.3,0.53,0.56],[28500,1.3,0.53,0.56],[29100,1,0.5,0.5],[44000,1,0.5,0.5]];
function keepState(time){
 time=Math.max(0,Math.min(keepDuration-1,time));
 const scene=keepScenes.findLast(s=>s[0]<=time);
 const i=keepCamera.findLastIndex(k=>k[0]<=time),a=keepCamera[i],b=keepCamera[i+1]||a;
 const p=a===b?0:(time-a[0])/(b[0]-a[0]),e=p*p*(3-2*p);
 const camera=a.slice(1).map((v,i)=>v+(b[i+1]-v)*e);
 let prior=[0,.58,.26],cursor;
 for(const next of keepActions){
  if(time<next[0]){
   const start=Math.max(prior[0],next[0]-420),p=Math.max(0,Math.min(1,(time-start)/(next[0]-start))),e=p*p*(3-2*p);
   cursor={x:prior[1]+(next[1]-prior[1])*e,y:prior[2]+(next[2]-prior[2])*e,click:prior[0]};break;
  }prior=next;
 }
 cursor ||= {x:prior[1],y:prior[2],click:prior[0]};
 cursor.opacity=keepActions.some(a=>time>=a[0]-650&&time<=a[0]+450)?1:0;
 return {scene,camera,cursor,time};
}
if(typeof module!=='undefined')module.exports={keepDuration,keepScenes,keepActions,keepCamera,keepState};
if(typeof document!=='undefined')(()=>{
 const root=document.querySelector('.keep-demo');if(!root)return;
 const picture=root.querySelector('.demo-image'),wrap=root.querySelector('.demo-image-wrap');
 const pointer=root.querySelector('.demo-pointer'),pulse=root.querySelector('.demo-click');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay');
 const progress=root.querySelector('.demo-progress span'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const {scene,camera:[scale,cx,cy],cursor}=keepState(time);
  const phase=time<3200?'ONE QUESTION · ONE STARTING VIDEO':time<15100?'FIND MORE · WIDER YOUTUBE':time<23300?'THREE VIDEOS · ONE RESEARCH WORKSPACE':time<31000?'KEEP AI FINDINGS · ADD YOUR NOTES':'LEAVE · RETURN · CONTINUE YOUR RESEARCH';
  root.querySelector('.demo-badge').textContent=phase;
  if(current!==scene[1]){current=scene[1];picture.src='keepresearch1440/'+current+'.jpg';}
  const tx=Math.max(1-scale,Math.min(0,.5-scale*cx)),ty=Math.max(1-scale,Math.min(0,.5-scale*cy));
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  pointer.hidden=cursor.opacity<=0;pointer.style.opacity=String(cursor.opacity);
  pointer.style.left=(tx+scale*cursor.x)*100+'%';pointer.style.top=(ty+scale*cursor.y)*100+'%';
  const action=keepActions.find(a=>a[0]===cursor.click),age=time-cursor.click;
  pulse.hidden=!action||age>180;
  if(action){pulse.style.left=(tx+scale*action[1])*100+'%';pulse.style.top=(ty+scale*action[2])*100+'%';}
  pulse.style.opacity=String(Math.max(0,.7*(1-age/180)));
  pulse.style.transform=`translate(-50%,-50%) scale(${.65+Math.min(age/180,1)*.65})`;
  progress.style.width=time/keepDuration*100+'%';
 }
 function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' saved research animation');}
 function stop(){cancelAnimationFrame(raf);raf=0;previous=null;}
 function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
 function tick(now){
  if(!ready||paused||!visible||document.hidden){stop();return;}
  if(previous!==null)elapsed=(elapsed+now-previous)%keepDuration;
  previous=now;render(elapsed);raf=requestAnimationFrame(tick);
 }
 toggle.addEventListener('click',()=>{paused=!paused;label();paused?stop():start();});
 replay.addEventListener('click',()=>{elapsed=0;previous=null;paused=false;render(0);label();start();});
 motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();elapsed=keepDuration-1;render(elapsed);}else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 async function load(){
  if(loading)return;loading=true;
  try{
   await Promise.all(keepScenes.map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='keepresearch1440/'+s[1]+'.jpg';})));
   ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?keepDuration-1:0);start();
  }catch{root.dataset.error='capture-load';}
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
})();
