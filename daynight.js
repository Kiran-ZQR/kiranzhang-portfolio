(()=>{
 'use strict';
 const main=document.querySelector('.dn-main'),dialog=document.querySelector('.dn-dialog'),status=document.querySelector('#dn-status');
 const switches=[...document.querySelectorAll('[data-theme-switch]')];
 let scenes=[],current=null,mode='light',category='reading',request=0,busy=false;
 const url=(id,theme,width=900)=>`assets/daynight/${id}-${theme}-${width}.webp`;
 const announce=text=>{status.textContent=text;};
 function makeScreen(scene,small=false){
  const viewport=document.createElement('div');viewport.className='dn-screen';viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label',scene.label+'，可滚动浏览');
  const pair=document.createElement('div');pair.className='dn-image-pair';
  for(const theme of ['light','dark']){
   const img=new Image();img.src=url(scene.id,theme,small?450:900);img.width=scene.width;img.height=scene.height;img.decoding='async';img.dataset.imageMode=theme;img.alt=scene.label+' · '+(theme==='light'?'日间':'夜间');img.setAttribute('aria-hidden',String(theme!==mode));pair.append(img);
  }
  viewport.append(pair);return viewport;
 }
 async function ready(container){await Promise.all([...container.querySelectorAll('img')].map(img=>img.decode()));}
 function syncMode(){
  main.dataset.mode=mode;dialog.dataset.mode=mode;
  switches.forEach(button=>button.setAttribute('aria-checked',String(mode==='dark')));
  document.querySelectorAll('[data-image-mode]').forEach(img=>img.setAttribute('aria-hidden',String(img.dataset.imageMode!==mode)));
 }
 switches.forEach(button=>button.addEventListener('click',async()=>{
  if(busy)return;busy=true;switches.forEach(b=>b.disabled=true);
  try{await ready(main);if(dialog.open)await ready(dialog);mode=mode==='light'?'dark':'light';syncMode();announce('已切换为'+(mode==='light'?'日间':'夜间')+'模式，阅读位置保持不变。');}
  catch{announce('图片加载暂未完成，请稍后再试。');}
  finally{busy=false;switches.forEach(b=>b.disabled=false);}
 }));
 function renderOptions(){
  const options=document.querySelector('#scene-options');options.replaceChildren();
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  for(const scene of scenes.filter(s=>s.category===category)){
   const button=document.createElement('button');button.type='button';button.textContent=scene.label;button.dataset.scene=scene.id;button.setAttribute('aria-pressed',String(scene.id===current?.id));button.addEventListener('click',()=>selectScene(scene.id));options.append(button);
  }
 }
 async function selectScene(id){
  const scene=scenes.find(s=>s.id===id);if(!scene)return;
  const ticket=++request,screen=makeScreen(scene);document.querySelector('#library-preview').setAttribute('aria-busy','true');
  try{
   await ready(screen);if(ticket!==request)return;
   current=scene;category=scene.category;document.querySelector('#library-preview').replaceChildren(screen);document.querySelector('#scene-label').textContent=scene.label;renderOptions();syncMode();document.querySelector('#open-detail').disabled=false;
  }catch{if(ticket===request)announce('该页面图片加载失败，请重新选择或刷新页面。');}
  finally{if(ticket===request)document.querySelector('#library-preview').removeAttribute('aria-busy');}
 }
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{const scene=scenes.find(s=>s.category===b.dataset.category);if(scene)selectScene(scene.id);}));
 document.querySelectorAll('[data-jump-scene]').forEach(b=>b.addEventListener('click',async()=>{await selectScene(b.dataset.jumpScene);const library=document.querySelector('#scene-library');library.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#scene-options [aria-pressed=true]')?.focus({preventScroll:true});}));
 let scrollOverflow='';
 document.querySelector('#open-detail').addEventListener('click',()=>{
  if(!current)return;document.querySelector('#dialog-title').textContent=current.label;document.querySelector('#dialog-preview').replaceChildren(makeScreen(current));syncMode();scrollOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();document.querySelector('#close-detail').focus();
 });
 document.querySelector('#close-detail').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=scrollOverflow;document.querySelector('#open-detail').focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 async function init(){
  try{
   const response=await fetch('assets/daynight/scenes.json');if(!response.ok)throw Error('manifest');scenes=await response.json();
   const showcase=document.querySelector('#showcase');showcase.replaceChildren();
   ['article','video','morning'].forEach((id,i)=>{const scene=scenes.find(s=>s.id===id),figure=document.createElement('figure');figure.className='dn-device';figure.append(makeScreen(scene,true));const caption=document.createElement('figcaption');const label=document.createElement('b');label.style.fontWeight='400';label.textContent=['图文阅读','视频内容','早报资讯'][i];const number=document.createElement('span');number.textContent='0'+(i+1)+' / 03';caption.append(label,number);figure.append(caption);showcase.append(figure);});
   renderOptions();await ready(showcase);switches.forEach(b=>b.disabled=false);
   // The library's full-resolution pair is fetched only when it approaches the viewport.
   const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){if(!current&&request===0)selectScene('article');observer.disconnect();}},{rootMargin:'350px'});observer.observe(document.querySelector('#scene-library'));
  }catch{announce('演示素材暂时无法加载，请刷新重试。');document.querySelector('.dn-loading')?.remove();}
 }
 init();
})();
