'use strict';
// Real 3840px-wide captures. Camera coordinates are normalized to each source image.
const organizeScenes=[
 [0,'01-my-channels','My Channels','Organize your subscriptions','Start with the channels you already know.'],
 [850,'02-raoul-typing','My Channels','Find a channel','Search your monitored subscriptions.'],
 [1200,'03-raoul-search','My Channels','Raoul Pal The Journey Man','Find the match. Choose Finance.'],
 [2450,'04-raoul-finance','My Channels','Raoul Pal The Journey Man','Finance added.',.16465,.38963],
 [3250,'05-patrick-search','My Channels','Patrick Boyle','The same simple choice for your next channel.'],
 [4200,'06-patrick-finance','My Channels','Patrick Boyle','Finance added.',.16465,.38963],
 [4950,'07-money-matches','My Channels','Search “money”','Three matches. Find Money & Macro.'],
 [6650,'08-money-finance','My Channels','Money & Macro','Finance added.',.16465,.38963],
 [8100,'09-channel-videos','Channel Videos','Browse your monitored channels','Channel Videos keeps your channels together.'],
 [9500,'10-longform-all','Latest Long-form','Open Latest Long-form','Now bring their latest videos together.'],
 [10800,'11-finance-results','Latest Long-form · Finance','Choose Finance','All Finance channels. One feed.',.215,.198]
];
// Exactly two restrained zooms: first channel assignment, then the Finance filter.
// All intervening searches and navigation stay in a locked 16:9 full-page view.
const organizeCamera=[
 [0,1,.5,.5],[600,1,.5,.5],[1350,1.45,.41,.32],
 [2700,1.45,.41,.32],[3250,1,.5,.5],
 [9600,1,.5,.5],[10400,1.45,.35,.25],[11400,1.45,.35,.25],
 [12200,1,.5,.5],[15000,1,.5,.5]
];
function organizeState(time){
 time=Math.max(0,Math.min(time,14999));
 const scene=organizeScenes.findLast(s=>s[0]<=time);
 const k=organizeCamera.findLastIndex(k=>k[0]<=time),a=organizeCamera[k],b=organizeCamera[k+1]||a;
 const p=a===b?0:Math.min(1,(time-a[0])/(b[0]-a[0])),e=p*p*(3-2*p);
 return {scene,camera:a.slice(1).map((v,i)=>v+(b[i+1]-v)*e),time};
}
if(typeof module!=='undefined')module.exports={organizeScenes,organizeCamera,organizeState};
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
   current=s[1];picture.src='organize4k/'+s[1]+'.jpg';picture.height=2160;
   step.textContent=s[2];
  }
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  const age=time-s[0],click=s[5]!==undefined;
  pointer.hidden=!click||age>850;pulse.hidden=!click||age>550;
  if(click)for(const el of [pointer,pulse]){el.style.left=(tx+scale*s[5])*100+'%';el.style.top=(ty+scale*s[6]*yFactor)*100+'%';}
  pulse.style.opacity=click?String(Math.max(0,1-age/550)):'0';
  pulse.style.transform=`translate(-50%,-50%) scale(${.6+Math.min(age/550,1)*1.3})`;
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
   await Promise.all(organizeScenes.map(s=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='organize4k/'+s[1]+'.jpg';})));
   ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?14999:0);start();
  }catch{step.textContent='Latest Long-form · Finance';root.dataset.error='capture-load';}
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2}).observe(root);
 })();
}
