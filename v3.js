'use strict';
// Every feature is visible without JavaScript or an extra click.
(() => {
  const menu=document.querySelector('.version-switcher');
  document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
})();
