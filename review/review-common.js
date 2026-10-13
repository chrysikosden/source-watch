'use strict';
(() => {
  // Shared landing-page URLs should open at the beginning, not retain an old tour hash.
  // Section links still move and focus correctly, without contaminating the share URL.
  if(document.body.dataset.shareStart==='top'){
    if('scrollRestoration' in history) history.scrollRestoration='manual';
    if(location.hash) history.replaceState(null,'',location.pathname+location.search);
    window.scrollTo(0,0);
    window.addEventListener('pageshow',()=>window.scrollTo({top:0,behavior:'instant'}),{once:true});
    document.addEventListener('click',event=>{
      const link=event.target.closest('a[href^="#"]');
      if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const id=link.getAttribute('href').slice(1),target=document.getElementById(id);
      if(!target)return;
      event.preventDefault();
      target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
      if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    });
  }
  const switchers=[...document.querySelectorAll('.version-switcher')];
  document.addEventListener('click',e=>switchers.forEach(s=>{if(!s.contains(e.target))s.open=false;}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')switchers.forEach(s=>{if(s.open){s.open=false;s.querySelector('summary').focus();}});});
  // A readable view is especially useful on laptops and phones; no video service loads.
  document.querySelectorAll('.stage-panel figure').forEach(figure=>{
    const controls=figure.querySelector('.demo-controls');
    if(!controls||!figure.requestFullscreen)return;
    const button=document.createElement('button');button.type='button';button.className='demo-fullscreen';button.textContent='Full screen';
    button.setAttribute('aria-label','View this demonstration full screen');
    button.addEventListener('click',async()=>{try{if(document.fullscreenElement===figure)await document.exitFullscreen();else await figure.requestFullscreen();}catch{button.textContent='Full screen unavailable';}});
    document.addEventListener('fullscreenchange',()=>{const active=document.fullscreenElement===figure;button.textContent=active?'Back to page':'Full screen';button.setAttribute('aria-label',active?'Exit full screen and return to the page':'View this demonstration full screen');});
    controls.append(button);
  });
})();
