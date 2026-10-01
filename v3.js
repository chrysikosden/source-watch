'use strict';
// Every feature is visible without JavaScript or an extra click.
(() => {
  const menu=document.querySelector('.version-switcher');
  document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
})();

// Locally hosted, real UI captures. No video host, account data, or external requests.
(() => {
  const root=document.querySelector('.organize-demo');
  if(!root)return;
  const picture=root.querySelector('.demo-image'), wrap=root.querySelector('.demo-image-wrap');
  const pointer=root.querySelector('.demo-pointer'), pulse=root.querySelector('.demo-click');
  const title=root.querySelector('.demo-caption strong'), subtitle=root.querySelector('.demo-caption span');
  const step=root.querySelector('.demo-step'), progress=root.querySelector('.demo-progress span');
  const toggle=root.querySelector('.demo-toggle'), replay=root.querySelector('.demo-replay'), speed=root.querySelector('.demo-speed');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const names=['David Lin','George Gammon','Money & Macro','Patrick Boyle'];
  const frames=names.flatMap((name,i)=>[
    {at:i*1000,file:`channel-${i}-before.jpg`,view:'channel',title:'Choose Finance for your channel',sub:name,step:`My Channels · ${i+1} of 4`,x:11.635,y:66.232},
    {at:i*1000+430,file:`channel-${i}-after.jpg`,view:'channel',title:'Choose Finance for your channel',sub:name+' · Finance added',step:`My Channels · ${i+1} of 4`,x:11.635,y:66.232,click:true}
  ]).concat([
    {at:4000,file:'open-longform.jpg',view:'navigation',title:'Open Latest Long-form',sub:'Your latest uploads, in one place.',step:'Open your feed',x:14,y:43},
    {at:4500,file:'longform-all.jpg',view:'navigation',title:'Choose your topic',sub:'Category → Finance',step:'Filter by topic',x:50,y:65},
    {at:5400,file:'finance-filter.jpg',view:'navigation',title:'Finance. All your chosen channels.',sub:'No need to find each channel again.',step:'Finance selected',x:50,y:65,click:true},
    {at:6400,file:'finance-results.jpg',view:'results',title:'Your channels. One Finance feed.',sub:'Organize once. Come back whenever you need.',step:'Together, by topic'}
  ]);
  let duration=10000, elapsed=0, previous=0, raf=0, current=-1, visible=false, ready=false, paused=motion.matches;
  function render(time){
    let index=frames.findLastIndex(f=>f.at<=time); if(index<0)index=0;
    const f=frames[index];
    if(index!==current){
      current=index;picture.src='organize/'+f.file;wrap.dataset.view=f.view;
      title.textContent=f.title;subtitle.textContent=f.sub;step.textContent=f.step;
      pointer.hidden=f.x===undefined;pulse.hidden=!f.click;
      if(f.x!==undefined){for(const el of [pointer,pulse]){el.style.left=f.x+'%';el.style.top=f.y+'%';}}
    }
    const clickAge=time-f.at;
    pulse.style.opacity=f.click?String(Math.max(0,1-clickAge/400)):'0';
    pulse.style.transform=`translate(-50%,-50%) scale(${.6+Math.min(clickAge/400,1)*1.2})`;
    progress.style.width=(time/100)+'%';
    // On narrow screens, pan the real result row so all three channel names can be read.
    wrap.style.setProperty('--result-pan',String(Math.max(0,Math.min(1,(time-6900)/2200))));
  }
  function label(){toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-label',(paused?'Play':'Pause')+' organization animation');}
  function stop(){cancelAnimationFrame(raf);raf=0;previous=0;}
  function tick(now){
    if(!ready||paused||!visible||document.hidden){stop();return;}
    if(previous)elapsed=(elapsed+(now-previous)*10000/duration)%10000;
    previous=now;render(elapsed);raf=requestAnimationFrame(tick);
  }
  function start(){if(ready&&!paused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
  toggle.addEventListener('click',()=>{paused=!paused;label();if(paused)stop();else start();});
  replay.addEventListener('click',()=>{elapsed=0;previous=0;paused=false;render(0);label();start();});
  speed.addEventListener('change',()=>{duration=Number(speed.value);});
  motion.addEventListener('change',()=>{paused=motion.matches;label();if(paused){stop();render(9999);}else start();});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  let loading=false;
  async function load(){
    if(loading)return;loading=true;
    try{
      await Promise.all([...new Set(frames.map(f=>f.file))].map(file=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src='organize/'+file;})));
      ready=true;root.querySelector('.demo-controls').hidden=false;label();render(paused?9999:0);start();
    }catch{step.textContent='Your Finance feed, together';}
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();start();}else stop();},{threshold:.2});
  observer.observe(root);
})();
