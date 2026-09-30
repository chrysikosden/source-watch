'use strict';
(() => {
  const menu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.site-header');
  menu.hidden = false;
  document.body.classList.add('nav-ready');
  function closeMenu() {header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));header.classList.toggle('menu-open',open);
  });
  document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click',closeMenu));
  header.addEventListener('keydown',event => {if(event.key === 'Escape'){closeMenu();menu.focus();}});
  const list = document.querySelector('.stage-tabs');
  const tabs = [...list.querySelectorAll('a')];
  const panels = tabs.map(tab => document.querySelector(tab.getAttribute('href')));
  list.setAttribute('role','tablist');
  tabs.forEach((tab,i) => {tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[i].id);panels[i].setAttribute('role','tabpanel');panels[i].tabIndex=0;});
  function select(index,focus=false) {
    tabs.forEach((tab,i) => {tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;panels[i].classList.toggle('active-stage',i===index);});
    if(focus)tabs[index].focus();
  }
  function fromHash() {const i=panels.findIndex(panel=>'#'+panel.id===location.hash);if(i>=0)select(i);}
  select(0);fromHash();
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',event=>{event.preventDefault();select(i);});
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(i+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(event.key===' '){event.preventDefault();select(i);return;}
      if(next!==undefined){event.preventDefault();select(next,true);}
    });
  });
  addEventListener('hashchange',fromHash);
  // Native anchor navigation is intentionally retained: #download and #start work on entry.
})();
