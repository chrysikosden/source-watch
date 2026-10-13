'use strict';
(() => {
 const version=document.getElementById('version'),device=document.getElementById('device'),frame=document.getElementById('page-frame'),shell=document.getElementById('screen-shell'),canvas=document.getElementById('canvas'),status=document.getElementById('preview-status'),open=document.getElementById('open-page');
 const sizes={phone:[390,844],small:[320,740],tablet:[768,1024],laptop:[1366,768],desktop:[1920,1080]};
 const params=new URLSearchParams(location.search);
 if(/^[1-9]$/.test(params.get('version')||''))version.value=params.get('version');
 if(Object.hasOwn(sizes,params.get('device')||''))device.value=params.get('device');
 function resize(){
  const [width,height]=sizes[device.value]||sizes.phone;
  const border=parseFloat(getComputedStyle(shell).borderLeftWidth)*2;
  const scale=Math.min(1,Math.max(0.1,(canvas.clientWidth-border)/width));
  frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform=`scale(${scale})`;
  shell.style.width=width*scale+border+'px';shell.style.height=height*scale+border+'px';
  status.textContent=`${width} × ${height} CSS-pixel viewport · ${Math.round(scale*100)}% preview scale · Design preview`;
 }
 function update(changePage){
  const url=`v${version.value}.html`;
  if(changePage&&frame.getAttribute('src')!==url)frame.src=url;
  open.href=url;history.replaceState(null,'',`preview.html?version=${version.value}&device=${device.value}`);resize();
 }
 version.addEventListener('change',()=>update(true));device.addEventListener('change',()=>update(false));
 new ResizeObserver(resize).observe(canvas);update(true);
})();
