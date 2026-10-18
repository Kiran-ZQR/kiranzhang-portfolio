(()=>{
 const groups=[{"list":"tencent-news.html#business","items":[["主客态体验","tencent-news-details.html"],["下拉刷新","tencent-news-refresh.html"],["上滑引导","tencent-news-guide.html"],["直播置顶","tencent-news-live.html"],["推广海报","tencent-news-promotion.html"]]},{"list":"tencent-news.html#explore","items":[["AI 海报裁切","tencent-news-crop.html"],["AI 精品工具","tencent-news-ai-tools.html"]]},{"list":"academic-projects.html","items":[["SADRA","academic-sadra.html"],["FurSure","academic-fursure.html"],["PROFILED","academic-profiled.html"],["Star Farm","academic-star-farm.html"],["Lead Me","academic-lead-me.html"]]},{"list":"multimedia-projects.html","items":[["五元编织","life-weave.html"],["SentAIment","sentaiment.html"]]},{"list":"aigc.html","items":[["The Fortress","aigc-fortress.html"],["The Rococo","aigc-rococo.html"],["角色场景","aigc-worlds.html"],["视觉实验","aigc-experiments.html"]]}];
 const file=location.pathname.split('/').pop()||'index.html';
 const indexes=['tencent-news.html','academic-projects.html','multimedia-projects.html','aigc.html'];
 const header=document.querySelector('.unified-navigation');
 if(indexes.includes(file)){document.body.classList.add('category-index-page');header?.querySelector('.primary-island')?.remove();return;}
 const group=groups.find(g=>g.items.some(x=>x[1]===file));if(!group)return;
 document.body.classList.add('project-detail-page');
 const index=group.items.findIndex(x=>x[1]===file);
 const switcher=header?.querySelector('.case-switcher');
 if(switcher){switcher.removeAttribute('role');switcher.setAttribute('aria-label','同类项目');switcher.replaceChildren();
 group.items.forEach(([name,href],i)=>{const a=document.createElement('a');a.className='case-tab'+(i===index?' is-active':'');a.href=href;a.textContent=name;if(i===index)a.setAttribute('aria-current','page');switcher.append(a)});switcher.style.setProperty('--tab-count',group.items.length);}
 document.querySelectorAll('.project-next,.academic-footer,.case-footer,.collection-back,.work-two-back').forEach(el=>el.remove());
 const main=document.querySelector('main');const back=document.createElement('a');back.className='project-back';back.href=group.list;back.textContent='← 返回项目列表';main?.prepend(back);
 // Supplementary boards must precede the final navigation, not sit below it.
 document.querySelectorAll('body>.project-original-boards').forEach(board=>main?.append(board));
 // Keep the current project reachable in the scrollable mobile navigation.
 switcher?.querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest',inline:'nearest'});
 const next=group.items[index+1];const footer=document.createElement('footer');footer.className='project-sequence';
 const link=document.createElement('a');link.className='sequence-link';link.href=next?next[1]:group.list;
 link.innerHTML='<span class="sequence-label">'+(next?'NEXT PROJECT':'ALL PROJECTS')+'</span><span>'+(next?next[0]:'返回项目列表')+'</span><i aria-hidden="true">↗</i>';
 footer.append(link);
 if(file==='life-weave.html'){document.querySelector('#completion .result-actions')?.append(footer);back?.classList.add('weave-back');}else{main?.append(footer);}
})();
