const SOURCE='/catalog-source.html';
const BASE='https://asset-huggers.lovable.app';
const filters=['All','Tees','Denim','Outerwear','Footwear','Bags'];
let products=[];
let activeFilter='All';
let searchQuery='';
/* Gallery-led presentation; category navigation only. */
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
 const term=searchQuery.trim().toLocaleLowerCase();
 const shown=products.filter(p=>{
  const categoryMatch=activeFilter==='All'||p.category===activeFilter;
  const searchMatch=!term||[p.title,p.description,p.category,p.code].some(value=>String(value||'').toLocaleLowerCase().includes(term));
  return categoryMatch&&searchMatch;
 });
 $('#item-count').textContent=shown.length;
 $('#product-grid').innerHTML=shown.length?shown.map((p)=>'<article class="product-card" tabindex="0" role="button" data-code="'+p.code+'" aria-label="View '+escapeHTML(p.title)+'"><div class="product-image-wrap"><img loading="lazy" src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.alt)+'"><span class="product-number">'+p.code+'</span></div><div class="product-info"><div><h3>'+escapeHTML(p.title)+'</h3><p>'+escapeHTML(p.description)+'</p></div><span class="product-category">'+escapeHTML(p.category)+'</span></div></article>').join(''):'<div class="archive-empty"><p>No pieces match that search.</p><button type="button" id="clear-archive-search">Clear search and filters</button></div>';
 $('#product-grid').querySelectorAll('.product-card').forEach(card=>{const open=()=>showProduct(card.dataset.code);card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
 const clear=$('#clear-archive-search');if(clear)clear.addEventListener('click',()=>{searchQuery='';activeFilter='All';$('#archive-search').value='';renderFilters();renderProducts()});
}
function showProduct(code){
 const index=products.findIndex(x=>x.code===code);if(index<0)return;
 const p=products[index],position=index+1;
 $('#modal-content').innerHTML='<div class="modal-image-stage"><img src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.alt)+'"><span class="modal-image-label">EDMOND CLINTON INC. / OBJECT '+String(position).padStart(3,'0')+'</span><div class="modal-object-nav"><button type="button" data-product-step="-1" aria-label="Previous archive object">←</button><span>'+String(position).padStart(3,'0')+' / '+String(products.length).padStart(3,'0')+'</span><button type="button" data-product-step="1" aria-label="Next archive object">→</button></div></div><div class="modal-copy"><p class="eyebrow">THE LIVING ARCHIVE — '+p.code+'</p><p class="modal-edition">'+escapeHTML(p.category)+' / ONE OF ONE</p><h2>'+escapeHTML(p.title)+'</h2><div class="modal-rule"></div><p class="detail-label">MATERIAL / SURFACE NOTE</p><p class="modal-description">'+escapeHTML(p.description)+'</p><div class="detail-facts"><span>EDITION</span><strong>ONE OF ONE</strong><span>OBJECT CODE</span><strong>'+p.code+'</strong><span>COLLECTION</span><strong>'+escapeHTML(p.category)+'</strong></div><p class="modal-note">For current availability, provenance and additional details, enquire directly with the studio. The photograph shown is the original archive image for this piece.</p><a class="button button-dark" href="https://wa.me/27736453141?text='+encodeURIComponent('Hello, I would like to enquire about '+p.title+' ('+p.code+').')+'" target="_blank" rel="noreferrer">Enquire about this piece <span>↗</span></a><p class="modal-foot">CAPE TOWN · MADE BY HAND · NO DUPLICATES</p></div>';
 $('#modal-content').querySelectorAll('[data-product-step]').forEach(button=>button.addEventListener('click',()=>{const next=(index+Number(button.dataset.productStep)+products.length)%products.length;showProduct(products[next].code)}));
 $('#product-modal').classList.add('open');$('#product-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){$('#product-modal').classList.remove('open');$('#product-modal').setAttribute('aria-hidden','true');if(!$('#campaign-lightbox').classList.contains('open'))document.body.style.overflow=''}
let campaignIndex=0;
const campaignImages=()=>[...document.querySelectorAll('.model-portrait img')];
function showCampaignImage(index){const items=campaignImages();if(!items.length)return;campaignIndex=(index+items.length)%items.length;const img=items[campaignIndex];$('#campaign-lightbox-image').src=img.currentSrc||img.src;$('#campaign-lightbox-image').alt=img.alt;$('#campaign-lightbox-caption').textContent=img.closest('figure')?.querySelector('figcaption')?.innerText.replace(/\s+/g,' · ')||'EDMOND CLINTON INC. CAMPAIGN';$('#campaign-lightbox-count').textContent=String(campaignIndex+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0')}
function openCampaign(index){showCampaignImage(index);$('#campaign-lightbox').classList.add('open');$('#campaign-lightbox').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#campaign-close').focus()}
function closeCampaign(){$('#campaign-lightbox').classList.remove('open');$('#campaign-lightbox').setAttribute('aria-hidden','true');$('#campaign-lightbox-image').removeAttribute('src');if(!$('#product-modal').classList.contains('open'))document.body.style.overflow=''}
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
$('#archive-search').addEventListener('input',e=>{searchQuery=e.currentTarget.value;renderProducts()});
$('#discover-piece').addEventListener('click',()=>{if(!products.length)return;const piece=products[Math.floor(Math.random()*products.length)];showProduct(piece.code)});
$('.menu-toggle').addEventListener('click',()=>{const nav=$('.main-nav'),open=nav.classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))});
$('.main-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{$('.main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
$('.modal-close').addEventListener('click',closeModal);
$('#product-modal').addEventListener('click',e=>{if(e.target.id==='product-modal')closeModal()});
campaignImages().forEach((img,index)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Open campaign photograph '+(index+1));img.addEventListener('click',()=>openCampaign(index));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCampaign(index)}})});
$('#campaign-close').addEventListener('click',closeCampaign);
$('#campaign-prev').addEventListener('click',()=>showCampaignImage(campaignIndex-1));
$('#campaign-next').addEventListener('click',()=>showCampaignImage(campaignIndex+1));
$('#campaign-lightbox').addEventListener('click',e=>{if(e.target.id==='campaign-lightbox')closeCampaign()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCampaign()}else if($('#campaign-lightbox').classList.contains('open')&&e.key==='ArrowRight'){showCampaignImage(campaignIndex+1)}else if($('#campaign-lightbox').classList.contains('open')&&e.key==='ArrowLeft'){showCampaignImage(campaignIndex-1)}else if($('#product-modal').classList.contains('open')&&e.key==='ArrowRight'){const code=$('#modal-content .eyebrow').textContent.split('—').pop().trim();const i=products.findIndex(p=>p.code===code);if(i>=0)showProduct(products[(i+1)%products.length].code)}else if($('#product-modal').classList.contains('open')&&e.key==='ArrowLeft'){const code=$('#modal-content .eyebrow').textContent.split('—').pop().trim();const i=products.findIndex(p=>p.code===code);if(i>=0)showProduct(products[(i-1+products.length)%products.length].code)}});
$('#commission-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const msg=['Hello Edmond Clinton Inc., I would like to discuss a commission.','Name: '+f.get('name'),'Contact: '+f.get('contact'),'Material history: '+(f.get('material')||'Not specified'),'The vision: '+(f.get('vision')||'Not specified')].join('\n');window.open('https://wa.me/27736453141?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
if('IntersectionObserver' in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal-section').forEach(section=>revealObserver.observe(section))}else{document.querySelectorAll('.reveal-section').forEach(section=>section.classList.add('is-visible'))}
/* The archive remains an exhibition index, not a retail search interface. */
init();

/* Preserve the exact campaign subject pixels; replace only the surrounding scene.
   If segmentation cannot load, the original photograph remains visible unchanged. */
async function composeHeroBackdrop(){
 const photo=document.getElementById('hero-original-image');
 const canvas=document.getElementById('hero-composite-canvas');
 if(!photo||!canvas)return;
 try{
  const saved=localStorage.getItem('eci-hero-composite-v1');
  if(saved){
   const cached=new Image();cached.src=saved;
   await cached.decode();
   canvas.width=cached.naturalWidth;canvas.height=cached.naturalHeight;
   canvas.getContext('2d').drawImage(cached,0,0);
   canvas.classList.add('is-ready');photo.classList.add('is-composited');
   return;
  }
 }catch(cacheError){console.info('ECI composite cache unavailable; creating it once.',cacheError)}
 try{
  if(!photo.complete)await new Promise((resolve,reject)=>{photo.onload=resolve;photo.onerror=reject});
  const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
  const fileset=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
  const segmenter=await vision.ImageSegmenter.createFromOptions(fileset,{
   baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite'},
   runningMode:'IMAGE',
   outputCategoryMask:true,
   outputConfidenceMasks:false
  });
  const result=segmenter.segment(photo);
  const mask=result.categoryMask;
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
  const mw=mask.width,mh=mask.height,n=mw*mh;
  const labels=new Int32Array(n),queue=new Int32Array(n);
  let component=0,largestComponent=0,largestSize=0;
  for(let start=0;start<n;start++){
   if(maskValues[start]!==0||labels[start]!==0)continue;
   component++;let head=0,tail=0;queue[tail++]=start;labels[start]=component;
   while(head<tail){
    const at=queue[head++],x=at%mw,y=(at/mw)|0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
     if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;
     if(nx<0||ny<0||nx>=mw||ny>=mh)continue;
     const next=ny*mw+nx;
     if(maskValues[next]===0&&labels[next]===0){labels[next]=component;queue[tail++]=next;}
    }
   }
   if(tail>largestSize){largestSize=tail;largestComponent=component;}
  }
  if(!largestComponent)throw new Error('Person region not detected');
  const maskCanvas=document.createElement('canvas');maskCanvas.width=w;maskCanvas.height=h;
  const mctx=maskCanvas.getContext('2d');
  const maskPixels=mctx.createImageData(mw,mh);
  for(let i=0;i<n;i++){
   const a=labels[i]===largestComponent?255:0,j=i*4;
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
  try{localStorage.setItem('eci-hero-composite-v1',canvas.toDataURL('image/jpeg',.82))}catch(cacheError){console.info('ECI composite could not be cached.',cacheError)}
  segmenter.close();
 }catch(error){console.warn('ECI background composite unavailable; original campaign photograph retained.',error)}
}
const scheduleHeroComposite=()=>{const run=()=>{if('requestIdleCallback'in window)requestIdleCallback(()=>composeHeroBackdrop(),{timeout:3500});else setTimeout(composeHeroBackdrop,2200)};setTimeout(run,1800)};
/* The original campaign photograph remains untouched. The recovered limestone image is used as the physical gallery surround in CSS; no unverified segmentation mask is applied. */
// Background compositing is intentionally disabled until a verified subject mask is available.