(()=>{
 'use strict';
 const scenes=[
  {id:'reading',label:'阅读与评论',steps:[
   ['feed','沉浸流入口','视频观看界面保留评论入口，由内容进入讨论。'],
   ['video-comments','视频评论区','展开评论后，视频与讨论内容在同一界面中呈现。'],
   ['video-thread','视频回复展开','查看更完整的回复层级；在手机画面内滚动查看长列表。'],
   ['article','图文阅读入口','图文内容通过底部操作区衔接评论。'],
   ['article-comments','图文评论区','以评论面板承接讨论，保留原文背景。'],
   ['article-thread','图文回复展开','展开回复后的完整列表，呈现评论与回复的层级。']
  ]},
  {id:'participation',label:'参与讨论',steps:[
   ['login','未登录提示','这是未登录用户的登录提示状态；演示不会触发真实登录。'],
   ['compose','评论输入','已登录场景下的输入框、键盘与快捷提及入口。'],
   ['mention','选择 @ 对象','输入 @ 后呈现可选择的 AI 对象。'],
   ['mention-selected','已选择对象','选中的 @ 对象进入输入内容，展示输入过程中的状态变化。'],
   ['success','发布成功反馈','交付稿中的成功反馈状态；本页不会发送任何评论。']
  ]},
  {id:'messages',label:'消息回访',steps:[
   ['entry','图文消息提示','图文页面的头像红点提示新消息。'],
   ['menu','图文菜单入口','展开菜单后，从“我的消息”进入消息列表。'],
   ['video-menu','沉浸流菜单入口','沉浸流通过菜单中的消息入口承接回访。'],
   ['inbox','我的消息','同时呈现新消息与历史内容，并保留回复关联的上下文。'],
   ['locate','回到对应评论','评论定位状态让回访有明确的落点。']
  ]},
  {id:'boundaries',label:'边界与空状态',steps:[
   ['history','已读历史','没有新消息时，仍可查看已读的消息记录。'],
   ['deleted','评论已删除','内容删除后保留对应提示，避免原消息上下文凭空消失。'],
   ['empty-light','暂无消息 · 日间','无历史消息的空状态，并提供返回资讯内容的入口。'],
   ['empty-dark','暂无消息 · 夜间','同一空消息状态的夜间适配版本。'],
   ['handoff','外部应用确认','交付稿中的系统确认状态。演示不会实际跳转或打开应用。']
  ]}
 ];
 const byId=id=>document.getElementById(id),screen=byId('cm-screen'),image=byId('cm-image'),dialog=byId('cm-dialog-title').closest('dialog');
 let scene=scenes[0],step=0,request=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function button(label,index,active,fn){const el=document.createElement('button');el.type='button';el.setAttribute('aria-pressed',String(active));el.textContent=label;const n=document.createElement('small');n.textContent=String(index+1).padStart(2,'0');el.append(n);el.addEventListener('click',fn);return el;}
 function renderSteps(){byId('cm-steps').replaceChildren(...scene.steps.map((s,i)=>button(s[1],i,i===step,()=>selectStep(i))));}
 function selectStep(index){
  step=index;const [key,title,caption]=scene.steps[step];const token=++request;
  [...byId('cm-steps').children].forEach((el,i)=>el.setAttribute('aria-pressed',String(i===step)));
  byId('cm-state-title').textContent=title;byId('cm-caption').textContent=caption;byId('cm-counter').textContent=`${scene.label} / ${String(step+1).padStart(2,'0')} — ${String(scene.steps.length).padStart(2,'0')}`;
  image.alt=title;image.srcset=`assets/comments/${key}-450.webp 450w, assets/comments/${key}-900.webp 900w`;image.src=`assets/comments/${key}-450.webp`;screen.scrollTop=0;
  screen.setAttribute('aria-busy','true');
  image.decode().then(()=>{if(token!==request)return;screen.setAttribute('aria-busy','false');image.getAnimations().forEach(animation=>animation.cancel());if(!reduced.matches)image.animate([{opacity:.25},{opacity:1}],{duration:350,easing:'ease-out'});}).catch(()=>{if(token!==request)return;screen.setAttribute('aria-busy','false');byId('cm-caption').textContent='图片暂未加载成功，请重新选择此状态重试。';});
 }
 function selectScene(id){scene=scenes.find(s=>s.id===id);step=0;[...byId('cm-scenarios').children].forEach((el,i)=>el.setAttribute('aria-pressed',String(scenes[i]===scene)));renderSteps();selectStep(0);}
 byId('cm-scenarios').replaceChildren(...scenes.map((s,i)=>button(s.label,i,i===0,()=>selectScene(s.id))));renderSteps();selectStep(0);
 document.querySelectorAll('[data-scene-jump]').forEach(el=>el.addEventListener('click',()=>{selectScene(el.dataset.sceneJump);document.querySelector('.cm-stage').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});byId('cm-scenarios').querySelector('[aria-pressed=true]').focus({preventScroll:true});}));
 let previousOverflow='';
 byId('cm-enlarge').addEventListener('click',()=>{const [key,title]=scene.steps[step];byId('cm-dialog-title').textContent=title;byId('cm-detail').alt=title;byId('cm-detail').src=`assets/comments/${key}-900.webp`;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;byId('cm-close').focus();});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;byId('cm-enlarge').focus({preventScroll:true});});
 byId('cm-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('cm-visible');observer.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll('.cm-section,.cm-closing').forEach(el=>{el.classList.add('cm-reveal');observer.observe(el);});}
})();
