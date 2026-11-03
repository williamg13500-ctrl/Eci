const SOURCE='/catalog-source.html';
const BASE='https://asset-huggers.lovable.app';
const filters=['All','Tees','Denim','Outerwear','Footwear','Bags'];
let products=[];
let activeFilter='All';
const $=(s,root=document)=>root.querySelector(s);
const escapeHTML=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function imageURL(src){return src.startsWith('http')?src:BASE+src}
function parseArchive(html){
 const doc=new DOMParser().parseFromString(html,'text/html');
 return [...doc.querySelectorAll('article[aria-label]')].map((card,index)=>{
  const img=$('img',card), title=$('h3',card), desc=$('p',card), code=card.textContent.match(/ECI-\d{3}/)?.[0]||'';
  const aria=card.getAttribute('aria-label')||'';
  const category=filters.slice(1).find(c=>aria.endsWith(', '+c))||'Archive';
  return {title:title?.textContent.trim()||img?.alt||'Untitled',description:desc?.textContent.trim()||'One-of-one wearable art',code,category,image:img?imageURL(img.getAttribute('src')):'',alt:img?.getAttribute('alt')||''};
 }).filter(p=>p.image&&p.code);
}
function renderFilters(){
 $('#filters').innerHTML=filters.map(f=>'<button class="filter-button '+(f===activeFilter?'active':'')+'" data-filter="'+f+'">'+f+'</button>').join('');
 $('#filters').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;renderFilters();renderProducts()}));
}
function renderProducts(){
 const shown=activeFilter==='All'?products:products.filter(p=>p.category===activeFilter);
 $('#item-count').textContent=shown.length;
 $('#product-grid').innerHTML=shown.map((p)=>'<article class="product-card" tabindex="0" role="button" data-code="'+p.code+'" aria-label="View '+escapeHTML(p.title)+'"><div class="product-image-wrap"><img loading="lazy" src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.alt)+'"><span class="product-number">'+p.code+'</span></div><div class="product-info"><div><h3>'+escapeHTML(p.title)+'</h3><p>'+escapeHTML(p.description)+'</p></div><span class="product-category">'+escapeHTML(p.category)+'</span></div></article>').join('');
 $('#product-grid').querySelectorAll('.product-card').forEach(card=>{const open=()=>showProduct(card.dataset.code);card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
}
function showProduct(code){
 const p=products.find(x=>x.code===code);if(!p)return;
 const position=products.findIndex(x=>x.code===code)+1;
 $('#modal-content').innerHTML='<div class="modal-image-stage"><img src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.alt)+'"><span class="modal-image-label">EDMOND CLINTON INC. / OBJECT '+String(position).padStart(3,'0')+'</span></div><div class="modal-copy"><p class="eyebrow">THE LIVING ARCHIVE — '+p.code+'</p><p class="modal-edition">'+escapeHTML(p.category)+' / ONE OF ONE</p><h2>'+escapeHTML(p.title)+'</h2><div class="modal-rule"></div><p class="modal-description">'+escapeHTML(p.description)+'</p><p class="modal-note">A singular object, carrying its own material history. Enquire with the studio for availability and further details.</p><a class="button button-dark" href="https://wa.me/27736453141?text='+encodeURIComponent('Hello, I would like to enquire about '+p.title+' ('+p.code+').')+'" target="_blank" rel="noreferrer">Request this piece <span>↗</span></a><p class="modal-foot">CAPE TOWN · MADE BY HAND · NO DUPLICATES</p></div>';
 $('#product-modal').classList.add('open');$('#product-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){$('#product-modal').classList.remove('open');$('#product-modal').setAttribute('aria-hidden','true');document.body.style.overflow=''}
async function loadCanvases(html){
 const doc=new DOMParser().parseFromString(html,'text/html');
 const imgs=[...doc.querySelectorAll('img[alt*="original painting by Edmond Clinton"]')];
 $('#canvas-grid').innerHTML=imgs.map((img,i)=>{const title=img.alt.split(' — ')[0];return '<article class="canvas-card"><img loading="lazy" src="'+escapeHTML(imageURL(img.getAttribute('src'))) +'" alt="'+escapeHTML(img.alt)+'"><p>'+escapeHTML(title)+'</p><span>Original canvas · Edmond Clinton</span></article>'}).join('');
}
async function init(){
 try{
  const response=await fetch(SOURCE);if(!response.ok)throw new Error('Source archive unavailable');
  const html=await response.text();products=parseArchive(html);
  if(!products.length)throw new Error('No archive objects found');
  renderFilters();renderProducts();loadCanvases(html);
 }catch(err){$('#product-grid').innerHTML='<p class="loading">The archive could not be loaded. Please refresh or contact the studio.</p>';console.error(err)}
}
$('.menu-toggle').addEventListener('click',()=>{const nav=$('.main-nav'),open=nav.classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))});
$('.main-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{$('.main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
$('.modal-close').addEventListener('click',closeModal);
$('#product-modal').addEventListener('click',e=>{if(e.target.id==='product-modal')closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#commission-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const msg=['Hello Edmond Clinton Inc., I would like to discuss a commission.','Name: '+f.get('name'),'Contact: '+f.get('contact'),'Material history: '+(f.get('material')||'Not specified'),'The vision: '+(f.get('vision')||'Not specified')].join('\n');window.open('https://wa.me/27736453141?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
if('IntersectionObserver' in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal-section').forEach(section=>revealObserver.observe(section))}else{document.querySelectorAll('.reveal-section').forEach(section=>section.classList.add('is-visible'))}
init();

/* Preserve the exact campaign subject pixels; replace only the surrounding scene.
   If segmentation cannot load, the original photograph remains visible unchanged. */
async function composeHeroBackdrop(){
 const photo=document.getElementById('hero-original-image');
 const canvas=document.getElementById('hero-composite-canvas');
 if(!photo||!canvas)return;
 try{
  if(!photo.complete)await new Promise((resolve,reject)=>{photo.onload=resolve;photo.onerror=reject});
  const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
  const fileset=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
  const segmenter=await vision.ImageSegmenter.createFromOptions(fileset,{
   baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite'},
   runningMode:'IMAGE',
   outputCategoryMask:false,
   outputConfidenceMasks:true
  });
  const result=segmenter.segment(photo);
  const isConfidenceMask=!!result.confidenceMasks?.[1];
  const mask=result.confidenceMasks?.[1]||result.categoryMask;
  if(!mask)throw new Error('No person mask returned');
  const w=photo.naturalWidth,h=photo.naturalHeight;
  canvas.width=w;canvas.height=h;
  const bg=new Image();bg.src='/images/campaign-backdrop-limestone.jpg';
  if(!bg.complete)await new Promise((resolve,reject)=>{bg.onload=resolve;bg.onerror=reject});
  const back=document.createElement('canvas');back.width=w;back.height=h;
  const bctx=back.getContext('2d');
  const scale=Math.max(w/bg.naturalWidth,h/bg.naturalHeight);
  const bw=bg.naturalWidth*scale,bh=bg.naturalHeight*scale;
  bctx.drawImage(bg,(w-bw)/2,(h-bh)/2,bw,bh);
  const maskValues=mask.getAsFloat32Array?mask.getAsFloat32Array():mask.getAsUint8Array();
  const mw=mask.width,mh=mask.height;
  const maskCanvas=document.createElement('canvas');maskCanvas.width=w;maskCanvas.height=h;
  const mctx=maskCanvas.getContext('2d');
  const maskPixels=mctx.createImageData(mw,mh);
  for(let i=0;i<maskValues.length;i++){
   const confidence=maskValues[i];
   const person=isConfidenceMask?confidence:(confidence===0?1:0);
   const smooth=Math.max(0,Math.min(1,(person-.28)/.42));
   const a=Math.round(smooth*smooth*(3-2*smooth)*255), j=i*4;
   maskPixels.data[j]=255;maskPixels.data[j+1]=255;maskPixels.data[j+2]=255;maskPixels.data[j+3]=a;
  }
  const smallMask=document.createElement('canvas');smallMask.width=mw;smallMask.height=mh;
  smallMask.getContext('2d').putImageData(maskPixels,0,0);
  mctx.filter='blur(1.1px)';mctx.drawImage(smallMask,0,0,w,h);mctx.filter='none';
  const subject=document.createElement('canvas');subject.width=w;subject.height=h;
  const sctx=subject.getContext('2d');sctx.drawImage(photo,0,0,w,h);
  sctx.globalCompositeOperation='destination-in';sctx.drawImage(maskCanvas,0,0,w,h);sctx.globalCompositeOperation='source-over';
  const ctx=canvas.getContext('2d');ctx.drawImage(back,0,0);ctx.drawImage(subject,0,0);
  canvas.classList.add('is-ready');photo.classList.add('is-composited');
  segmenter.close();
 }catch(error){console.warn('ECI background composite unavailable; original campaign photograph retained.',error)}
}
if(document.readyState==='complete')composeHeroBackdrop();else window.addEventListener('load',composeHeroBackdrop,{once:true});