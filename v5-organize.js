'use strict';
// Real 2560px-wide captures. Camera coordinates are normalized to each source image.
const organizeScenes=[
 [0,'01-my-channels','My Channels','Organize your subscriptions','Start with the channels you already know.'],
 [850,'02-raoul-typing','My Channels','Find a channel','Search your monitored subscriptions.'],
 [1200,'03-raoul-search','My Channels','Raoul Pal The Journey Man','Find the match. Choose Finance.'],
 [2450,'04-raoul-finance','My Channels','Raoul Pal The Journey Man','Finance added.',.16465,.38963],
 [3250,'05-patrick-search','My Channels','Patrick Boyle','The same simple choice for your next channel.'],
 [4200,'06-patrick-finance','My Channels','Patrick Boyle','Finance added.',.16465,.38963],
 [4950,'07-money-matches','My Channels','Search “money”','Three matches. Find Money & Macro.'],
 [6650,'08-money-finance','My Channels','Money & Macro','Finance added.',.16465,.38963],
 [8100,'15-longform-all','Latest Long-form','Open Latest Long-form','Now bring their latest videos together.'],
 [10350,'13-category-menu','Latest Long-form','Choose a category','All your categories, including Finance.'],
 [11820,'14-finance-selected','Latest Long-form · Finance','Choose Finance','All Finance channels. One feed.']
];
// Exactly two restrained zooms: first channel assignment, then the Finance filter.
// All intervening searches and navigation stay in a locked 16:9 full-page view.
const organizeCamera=[
 [0,1,.5,.5],[600,1,.5,.5],[1350,1.45,.41,.32],
 [2700,1.45,.41,.32],[3250,1,.5,.5],
 [9600,1,.5,.5],[10400,1.45,.35,.25],[12000,1.45,.35,.25],
 [12800,1,.5,.5],[15000,1,.5,.5]
];
// Cursor visits actual capture coordinates; it travels before each click, then settles.
const organizeActions=[[300,0.0899218738079071,0.9358940972222224],[750,0.482421875,0.05805555714501275],[2450,0.24698243141174317,0.6404166751437717],[3250,0.482421875,0.05805555714501275],[4200,0.24698243141174317,0.6404166751437717],[4950,0.482421875,0.05805555714501275],[6650,0.24698243141174317,0.6404166751437717],[8040,0.0852343738079071,0.22256077660454643],[10350,0.27730712890625,0.2980555640326606],[11700,0.2917944371700287,0.4154861026340061]];
function organizePointer(time){
 let previous=[0,.115,.65];
 for(const next of organizeActions){
  if(time<next[0]){
   const start=Math.max(previous[0],next[0]-450);
   const p=Math.max(0,Math.min(1,(time-start)/(next[0]-start))),e=p*p*(3-2*p);
   return {x:previous[1]+(next[1]-previous[1])*e,y:previous[2]+(next[2]-previous[2])*e,click:previous[0],opacity:Math.min(1,time/200)};
  }
  previous=next;
 }
 return {x:previous[1],y:previous[2],click:previous[0],opacity:Math.max(0,1-(time-12200)/200)};
}
function organizeState(time){
 time=Math.max(0,Math.min(time,14999));
 const scene=organizeScenes.findLast(s=>s[0]<=time);
 const k=organizeCamera.findLastIndex(k=>k[0]<=time),a=organizeCamera[k],b=organizeCamera[k+1]||a;
 const p=a===b?0:Math.min(1,(time-a[0])/(b[0]-a[0])),e=p*p*(3-2*p);
 return {scene,camera:a.slice(1).map((v,i)=>v+(b[i+1]-v)*e),time};
}
if(typeof module!=='undefined')module.exports={organizeScenes,organizeCamera,organizeState,organizeActions,organizePointer};
if(typeof document!=='undefined'){
 const menu=document.querySelector('.version-switcher');
 document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target))menu.open=false;});
 if(menu)menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
 (()=>{
 const root=document.querySelector('.organize-demo');if(!root)return;
 const picture=root.querySelector('.demo-image'),wrap=root.querySelector('.demo-image-wrap');
 const pointer=root.querySelector('.demo-pointer'),pulse=root.querySelector('.demo-click');
 const step=root.querySelector('.demo-step'),progress=root.querySelector('.demo-progress span');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay');
 const durations=root.querySelectorAll('[data-duration]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let duration=10000,elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const {scene:s,camera:[scale,cx,cy]}=organizeState(time);
  const yFactor=1; // All displayed captures and the viewport share 16:9 geometry.
  const tx=scale>1?Math.max(1-scale,Math.min(0,.5-scale*cx)):(1-scale)/2;
  const ty=scale*yFactor>1?Math.max(1-scale*yFactor,Math.min(0,.5-scale*cy*yFactor)):(1-scale*yFactor)/2;
  if(current!==s[1]){
   current=s[1];picture.src='organize1440/'+s[1]+'.jpg';picture.height=1440;
   step.textContent=s[2];
  }
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  const cursor=organizePointer(time),age=time-cursor.click;
  pointer.hidden=cursor.opacity<=0;pointer.style.opacity=String(cursor.opacity);
  pointer.style.left=(tx+scale*cursor.x)*100+'%';pointer.style.top=(ty+scale*cursor.y)*100+'%';
  const action=organizeActions.find(a=>a[0]===cursor.click);
  pulse.hidden=!action||age>240;
  if(action){pulse.style.left=(tx+scale*action[1])*100+'%';pulse.style.top=(ty+scale*action[2])*100+'%';}
  pulse.style.opacity=String(Math.max(0,.7*(1-age/240)));
  pulse.style.transform=`translate(-50%,-50%) scale(${.65+Math.min(age/240,1)*.65})`;
  progress.style.width=(time/150)+'%';
 }
 function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' organization animation');}
 function stop(){cancelAnimationFrame(raf);raf=0;previous=null;}
 function tick(now){
  if(!ready||paused||!visible||document.hidden){stop();return;}
  if(previous!==null)elapsed=(elapsed+(now-previous)*15000/duration)%15000;
  previous=now;render(elapsed);raf=requestAnimationFrame(tick);
 }
 function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
 toggle.addEventListener('click',()=>{paused=!paused;label();paused?stop():start();});
 replay.addEventListener('click',()=>{elapsed=0;previous=null;paused=false;render(0);label();start();});
 durations.forEach(button=>button.addEventListener('click',()=>{
  duration=Number(button.dataset.duration);elapsed=0;previous=null;render(0);
  durations.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));start();
 }));
 motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();elapsed=14999;render(elapsed);}else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 async function load(){
  if(loading)return;loading=true;
  try{
   await Promise.all(organizeScenes.map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='organize1440/'+s[1]+'.jpg';})));
   ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?14999:0);start();
  }catch{step.textContent='Latest Long-form · Finance';root.dataset.error='capture-load';}
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
 })();
}
