'use strict';
(() => {
  // Exact normalized click coordinates from capture-save-return-sequence-manifest.json.
  // Every frame is an unchanged 2560 × 1440 beta.13 application capture.
  // Text entry is represented by recorded states, not fabricated typed overlays.
  const duration = 29500;
  const scenes = [
    {at:0, file:'result-01-save-action', label:'Open Save analysis result', action:[0.5142252604166667,0.8443721064814815]},
    {at:2500, file:'result-02-empty-form', label:'Give the result a name', action:[0.5,0.31397569444444445]},
    {at:4500, file:'result-03-named-form', label:'Add your working note', action:[0.5,0.4632523148148148]},
    {at:6500, file:'result-04-completed-form', label:'Save the named result', action:[0.6399454752604167,0.8680121527777778]},
    {at:10000, file:'result-05-saved-confirmation', label:'Saved — open the result', action:[0.35487467447916665,0.5418402777777778]},
    {at:12500, file:'result-06-opened-result', label:'Leave for your feed', action:[0.05677083333333333,0.1277633101851852]},
    {at:15500, file:'result-07-back-to-feed', label:'Return to Saved Research', action:[0.059895833333333336,0.40091145833333336]},
    {at:17500, file:'result-08-choose-analyses', label:'Choose Saved Analyses', action:[0.24653727213541668,0.18813657407407408]},
    {at:19800, file:'result-09-find-named-result', label:'Open the named result', action:[0.19813639322916668,0.36128472222222224]},
    {at:22500, file:'result-10-reopened-result', label:'Reopened — your note and source together', action:null}
  ];
  const asset = file => 'captures-beta13/' + file + '.jpg';
  function stateAt(time) {
    const safe = Math.max(0,Math.min(duration,Number(time)||0));
    let index = 0;
    for (let i=1;i<scenes.length;i++) {if(scenes[i].at<=safe)index=i;else break;}
    const scene=scenes[index];
    if(!scene.action)return {scene,index,time:safe,pointer:null,pulse:0};
    const clickAt=scenes[index+1].at-180;
    const moveAt=clickAt-680;
    const prior=index?scenes[index-1].action:[scene.action[0]-.035,scene.action[1]-.025];
    const p=Math.max(0,Math.min(1,(safe-moveAt)/680)),ease=p*p*(3-2*p);
    const opacity=safe<moveAt?0:Math.min(1,(safe-moveAt)/120);
    return {scene,index,time:safe,pointer:{x:p===1?scene.action[0]:prior[0]+(scene.action[0]-prior[0])*ease,y:p===1?scene.action[1]:prior[1]+(scene.action[1]-prior[1])*ease,opacity},pulse:safe>=clickAt?Math.max(0,1-(safe-clickAt)/180):0};
  }
  // Pure timeline export is for local source checks only; no browser globals are created.
  if(typeof module!=='undefined'&&module.exports)module.exports={duration,scenes,stateAt};
  if(typeof document==='undefined')return;
  const root=document.getElementById('saved-result-stage');
  if(!root)return;
  const frame=root.querySelector('.sr-frame'),pointer=root.querySelector('.sr-pointer'),pulse=root.querySelector('.sr-click');
  const badge=root.querySelector('[data-sr-step]'),controls=root.querySelector('.sr-controls');
  const toggle=root.querySelector('[data-sr-toggle]'),replay=root.querySelector('[data-sr-replay]'),fullscreen=root.querySelector('[data-sr-fullscreen]');
  const status=document.querySelector('[data-sr-status]'),error=document.querySelector('[data-sr-error]');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed=motion.matches?duration:0,completed=motion.matches,userPaused=motion.matches;
  let ready=false,loading=null,visible=false,pageActive=true,raf=0,last=null,current='',failed=false;
  const cachedImages=[];
  controls.hidden=false;

  function announce(message){if(status)status.textContent=message;}
  function render(time){
    const state=stateAt(time);
    if(current!==state.scene.file){current=state.scene.file;frame.src=asset(current);badge.textContent=state.scene.label;root.dataset.scene=String(state.index+1);}
    pointer.hidden=!state.pointer||state.pointer.opacity<=0;
    if(state.pointer){pointer.style.left=(state.pointer.x*100)+'%';pointer.style.top=(state.pointer.y*100)+'%';pointer.style.opacity=String(state.pointer.opacity);}
    pulse.hidden=state.pulse<=0;
    if(state.pulse>0){pulse.style.left=(state.scene.action[0]*100)+'%';pulse.style.top=(state.scene.action[1]*100)+'%';pulse.style.opacity=String(state.pulse*.8);pulse.style.transform='translate(-50%,-50%) scale('+(1+(1-state.pulse)*.35)+')';}
    root.dataset.complete=String(completed);
  }
  function updateControls(){
    toggle.disabled=!ready&&!failed;replay.disabled=!ready;
    const playing=ready&&!userPaused&&!completed;
    toggle.textContent=failed?'Play / retry':!ready?'Preparing…':completed?'Play again':playing?'Pause':'Play';
    toggle.setAttribute('aria-label',playing?'Pause saved-result demonstration':completed?'Play saved-result demonstration again':'Play saved-result demonstration');
    root.dataset.playback=completed?'complete':playing?(raf?'playing':'waiting-visible'):'paused';
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=null;}
  function canRun(){return ready&&!userPaused&&!completed&&visible&&pageActive&&!document.hidden;}
  function start(){if(canRun()&&!raf){last=null;raf=requestAnimationFrame(tick);}updateControls();}
  function tick(now){
    if(!canRun()){stop();updateControls();return;}
    if(last!==null)elapsed=Math.min(duration,elapsed+Math.max(0,now-last));
    last=now;
    if(elapsed>=duration){completed=true;render(duration);stop();updateControls();announce('Demonstration complete. The named result is open again in Saved Analyses.');return;}
    render(elapsed);raf=requestAnimationFrame(tick);
  }
  async function preload(){
    if(ready)return true;
    if(loading)return loading;
    failed=false;error.hidden=true;updateControls();
    loading=Promise.all(scenes.map(scene=>new Promise((resolve,reject)=>{
      const image=new Image();cachedImages.push(image);
      image.onload=()=>resolve();image.onerror=()=>reject(new Error('Capture unavailable'));
      image.src=asset(scene.file);
    }))).then(()=>{
      ready=true;render(elapsed);start();
      if(motion.matches&&userPaused)announce('Reduced motion is enabled. A still image is shown; choose Play to watch the demonstration.');
      return true;
    }).catch(()=>{
      failed=true;userPaused=true;error.hidden=false;stop();updateControls();
      announce('The sequence could not load completely. Retry with Play or open the full-size still.');return false;
    }).finally(()=>{loading=null;});
    return loading;
  }
  async function playFromStart(){
    userPaused=false;completed=false;elapsed=0;last=null;
    if(!await preload())return;
    render(0);start();announce('Playing the save, leave and reopen demonstration.');
  }
  toggle.addEventListener('click',async()=>{
    if(!ready||completed){await playFromStart();return;}
    userPaused=!userPaused;
    if(userPaused){stop();updateControls();announce('Demonstration paused.');}
    else{start();announce('Demonstration playing.');}
  });
  replay.addEventListener('click',()=>{stop();void playFromStart();});
  if(root.requestFullscreen){
    fullscreen.hidden=false;
    fullscreen.addEventListener('click',async()=>{
      try{if(document.fullscreenElement===root)await document.exitFullscreen();else await root.requestFullscreen();}
      catch{announce('Full screen is unavailable. Use the full-size screenshot link instead.');}
    });
    document.addEventListener('fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement===root?'Back to page':'Full screen';});
  }
  function suspend(){stop();updateControls();}
  document.addEventListener('visibilitychange',()=>document.hidden?suspend():start());
  window.addEventListener('pagehide',()=>{pageActive=false;suspend();});
  window.addEventListener('pageshow',()=>{pageActive=true;start();});
  motion.addEventListener('change',event=>{
    if(event.matches){userPaused=true;completed=true;elapsed=duration;stop();if(ready)render(duration);updateControls();announce('Reduced motion enabled. A still image is shown; choose Play to watch.');}
  });
  if('IntersectionObserver' in window){
    const near=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){void preload();near.disconnect();}},{rootMargin:'600px 0px'});near.observe(root);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){void preload();start();}else suspend();},{threshold:.2}).observe(root);
  }else{visible=true;void preload();}
  updateControls();
})();
