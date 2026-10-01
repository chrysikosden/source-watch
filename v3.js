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
 [10800,'11-finance-results','Latest Long-form · Finance','Choose Finance','All Finance channels. One feed.',.215,.198],
 [12100,'12-finance-two-rows','Latest Long-form · Finance','Your channels. One Finance feed.','Organize once. Come back whenever you need.']
];
// Full page → search → category → full page before every navigation change.
const organizeCamera=[
 [0,1,.5,.5],[500,1,.5,.5],[1200,1.8,.52,.22],[1600,1.8,.52,.22],
 [2200,1.8,.36,.33],[2850,1.8,.36,.33],[3150,1.35,.47,.3],
 [3650,1.8,.52,.22],[4150,1.8,.36,.33],[4600,1.8,.36,.33],
 [5000,1.5,.50,.28],[5550,1.7,.53,.22],[6050,1.7,.53,.22],
 [6650,1.8,.36,.34],[7100,1.8,.36,.34],[8000,1,.5,.5],
 [8100,1,.5,.5],[8900,1.08,.48,.48],[9400,1,.5,.5],
 [9500,1,.5,.5],[10200,1.65,.35,.25],[11300,1.65,.35,.25],
 [12000,1,.5,.5],[12100,1,.5,.318],[12900,.70,.5,.5],[14700,.70,.5,.5],[15000,.70,.5,.5]
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
 const title=root.querySelector('.demo-caption strong'),subtitle=root.querySelector('.demo-caption span');
 const step=root.querySelector('.demo-step'),progress=root.querySelector('.demo-progress span');
 const toggle=root.querySelector('.demo-toggle'),replay=root.querySelector('.demo-replay');
 const durations=root.querySelectorAll('[data-duration]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let duration=15000,elapsed=0,previous=null,raf=0,current='',visible=false,ready=false,loading=false,paused=motion.matches;
 function render(time){
  const {scene:s,camera:[scale,cx,cy]}=organizeState(time),tall=s[1]==='12-finance-two-rows';
  const ratio=tall?3840/3400:3840/2160,yFactor=1.6/ratio;
  const tx=scale>1?Math.max(1-scale,Math.min(0,.5-scale*cx)):(1-scale)/2;
  const ty=scale*yFactor>1?Math.max(1-scale*yFactor,Math.min(0,.5-scale*cy*yFactor)):(1-scale*yFactor)/2;
  if(current!==s[1]){
   const changedPage=current&&step.textContent!==s[2];current=s[1];
   picture.src='organize4k/'+s[1]+'.jpg';picture.height=tall?3400:2160;
   title.textContent=s[3];subtitle.textContent=s[4];step.textContent=s[2];
   if(changedPage&&!motion.matches)picture.animate([{opacity:.45,filter:'blur(2px)'},{opacity:1,filter:'blur(0)'}],{duration:180});
  }
  wrap.style.transform=`translate(${tx*100}%,${ty*100}%) scale(${scale})`;
  const age=time-s[0],click=s[5]!==undefined;
  pointer.hidden=!click;pulse.hidden=!click;
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
