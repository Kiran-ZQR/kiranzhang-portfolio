// Accessible folder accordion. No idle render loop or extra WebGL contexts.
(()=>{
 const folders=[...document.querySelectorAll('.project-folder')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 function openFolder(selected){folders.forEach(folder=>{const open=folder===selected;folder.classList.toggle('is-open',open);folder.querySelector('.folder-tab').setAttribute('aria-expanded',String(open));folder.querySelector('.folder-tab i').textContent=open?'−':'+';folder.querySelector('.folder-panel').inert=!open;});}
 folders.forEach((folder,index)=>{
  const tab=folder.querySelector('.folder-tab');let frame=0;
  tab.addEventListener('click',()=>{openFolder(folder.classList.contains('is-open')?null:folder);});
  tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowDown'||event.key==='ArrowRight')target=(index+1)%folders.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')target=(index+folders.length-1)%folders.length;if(event.key==='Home')target=0;if(event.key==='End')target=folders.length-1;if(target!==undefined){event.preventDefault();folders[target].querySelector('.folder-tab').focus();}});
  folder.addEventListener('pointermove',event=>{if(reduce.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;const rect=folder.getBoundingClientRect();folder.style.setProperty('--shine-x',`${(event.clientX-rect.left)/rect.width*100}%`);});});
  const reset=()=>{cancelAnimationFrame(frame);folder.style.removeProperty('--shine-x');};
  folder.addEventListener('pointerleave',reset);reduce.addEventListener('change',reset);window.addEventListener('pagehide',reset);
 });
 function fromHash(){const selected=folders.find(folder=>'#'+folder.id===location.hash);if(selected)openFolder(selected);}
 fromHash();window.addEventListener('hashchange',fromHash);
})();
