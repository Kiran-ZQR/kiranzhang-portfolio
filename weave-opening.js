/* Reference poster: unchanged right-hand composition, recolored via an SVG filter. */
(() => {
 const overlay=document.createElement('div');overlay.className='thread-opening';
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','五行编织 — 进入');
 overlay.innerHTML=`<div class="opening-poster"><div class="pixel-opening-title"><h1>Five elements.<br>One living weave.<br>Made by you.</h1><button type="button">进入编织 ↗</button></div><div class="pixel-blast-container" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="310 91 340 203" preserveAspectRatio="none"><defs><filter id="poster-recolor" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .784 0 0 0 0 .235 0 0 0 0 .616 -1 0 0 0 1"/></filter></defs><image width="735" height="414" href="${window.PosterReferenceSource}" filter="url(#poster-recolor)"/></svg></div></div>`;
 document.body.append(overlay);
 const content=[...document.body.children].filter(el=>el!==overlay&&el.tagName!=='SCRIPT');content.forEach(el=>el.inert=true);
 function close(){overlay.remove();content.forEach(el=>el.inert=false);document.body.classList.remove('intro-pending');document.body.classList.add('skip-intro');document.querySelector('#handle-zone')?.focus({preventScroll:true});}
 overlay.querySelector('button').onclick=close;
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 overlay.querySelector('button').focus({preventScroll:true});
})();
