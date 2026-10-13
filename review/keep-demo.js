'use strict';
// Genuine 3840x2160 application states from an isolated local filming profile.
// Text entry and navigation pauses are shortened; no generated app screens.
const keepScenes=[[0,'00-desk'],[650,'01-named'],[1700,'02-library'],[3300,'03-record']];
const keepActions=[[430,.711,.2135],[1550,.807,.2135],[3150,.217,.2748]];
const keepCamera=[[0,1,.5,.5],[3800,1,.5,.5],[4500,1.5,.39,.49],
 [7600,1.5,.39,.49],[8300,1,.5,.5],[10000,1,.5,.5]];
function keepState(time){
 time=Math.max(0,Math.min(9999,time));
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
 cursor.opacity=Math.max(0,Math.min(1,time/150,(3550-time)/200));
 return {scene,camera,cursor,time};
}
if(typeof module!=='undefined')module.exports={keepScenes,keepActions,keepCamera,keepState};
if(typeof document!=='undefined')(()=>{
 const root=document.querySelector('.keep-demo');if(!root)return;
 const picture=root.querySelector('.demo-image'),wrap=root.querySelector('.demo-image-wrap');
 const pointer=root.querySelector('.demo-pointer'),pulse=root.querySelector('.demo-click');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay');
 const progress=root.querySelector('.demo-progress span'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const {scene,camera:[scale,cx,cy],cursor}=keepState(time);
  if(current!==scene[1]){current=scene[1];picture.src='keep4k/'+current+'.jpg';}
  const tx=Math.max(1-scale,Math.min(0,.5-scale*cx)),ty=Math.max(1-scale,Math.min(0,.5-scale*cy));
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  pointer.hidden=cursor.opacity<=0;pointer.style.opacity=String(cursor.opacity);
  pointer.style.left=(tx+scale*cursor.x)*100+'%';pointer.style.top=(ty+scale*cursor.y)*100+'%';
  const action=keepActions.find(a=>a[0]===cursor.click),age=time-cursor.click;
  pulse.hidden=!action||age>180;
  if(action){pulse.style.left=(tx+scale*action[1])*100+'%';pulse.style.top=(ty+scale*action[2])*100+'%';}
  pulse.style.opacity=String(Math.max(0,.7*(1-age/180)));
  pulse.style.transform=`translate(-50%,-50%) scale(${.65+Math.min(age/180,1)*.65})`;
  progress.style.width=time/100+'%';
 }
 function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' saved research animation');}
 function stop(){cancelAnimationFrame(raf);raf=0;previous=null;}
 function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
 function tick(now){
  if(!ready||paused||!visible||document.hidden){stop();return;}
  if(previous!==null)elapsed=(elapsed+now-previous)%10000;
  previous=now;render(elapsed);raf=requestAnimationFrame(tick);
 }
 toggle.addEventListener('click',()=>{paused=!paused;label();paused?stop():start();});
 replay.addEventListener('click',()=>{elapsed=0;previous=null;paused=false;render(0);label();start();});
 motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();elapsed=9999;render(elapsed);}else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 async function load(){
  if(loading)return;loading=true;
  try{
   await Promise.all(keepScenes.map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='keep4k/'+s[1]+'.jpg';})));
   ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?9999:0);start();
  }catch{root.dataset.error='capture-load';}
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
})();
