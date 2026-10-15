/* Preserve the supplied split-panel layout; no extra texture or linework. */
window.drawLifeTextile=(ctx,w,h,grid,options={})=>{
 ctx.fillStyle='#eee9d5';ctx.fillRect(0,0,w,h);
 if(!grid)return;
 const parts=options.segments||[],sources=window.ElementPatternImages;
 if(!sources||!parts.length)return;
 const recent=parts.slice(-5),band=h/recent.length;
 ctx.imageSmoothingEnabled=false;
 recent.forEach((part,index)=>{
  const image=sources[part.element];
  if(!image?.complete||!image.naturalWidth)return;
  const top=index*band;
  ctx.drawImage(image,0,top,w,band);
  // Each actual Conway cell is visible over the entire cloth, not a sampled dot layer.
  const split=[.37,.56,.66,.625,.275][part.element];
  const inks=[['#eee9d5','#4d7075'],['#4d7075','#91d6df'],['#fff252','#440d09'],['#eee9d5','#c83c9d'],['#440d09','#ac8b40']][part.element];
  // Rotate the 100×60 simulation mapping to fit the tall cloth with near-square cells.
  const cw=w/60,ch=h/100;
  ctx.save();ctx.beginPath();ctx.rect(0,top,w,band);ctx.clip();ctx.globalAlpha=.86;
  for(let row=0;row<60;row++)for(let col=0;col<100;col++){
   if(!grid[row*100+col])continue;
   const y=col*ch;
   if(y+ch<top||y>top+band)continue;
   ctx.fillStyle=inks[(y-top)/band<split?0:1];
   ctx.fillRect(row*cw,y,cw,ch);
  }
  ctx.restore();
 });
};
