(() => {
  const state = document.getElementById('state');
  const dashboard = document.getElementById('dashboard');
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const item = (label,value) => '<div class="panel"><div class="eyebrow">'+safe(label)+'</div><div class="metric">'+safe(value)+'</div></div>';
  fetch('/api/admin/dashboard',{redirect:'manual'}).then(async response => {
    if(response.status===401){const body=await response.json().catch(()=>({}));location.href=body.login_url||'https://hatchable.com/console/login';return null;}
    if(response.type==='opaqueredirect'){location.href='https://hatchable.com/console/login';return null;}
    if(response.status===403){location.href='/';return null;}
    if(!response.ok)throw new Error('Dashboard unavailable');
    return response.json();
  }).then(data => {
    if(!data)return;
    const t=data.totals||{},e=data.enquiries||{},a=data.availability||{};
    document.getElementById('metrics').innerHTML=[item('Active products',t.total_products),item('Featured products',t.featured_products),item('Total enquiries',e.total_enquiries),item('Pending enquiries',e.pending_enquiries)].join('');
    document.getElementById('availability').innerHTML=['available','reserved','sold','unavailable','unclassified'].map(k=>item(k.replace('_',' '),a[k]||0)).join('');
    document.getElementById('products').innerHTML=(data.recently_updated_products||[]).map(p=>'<div class="row"><span>'+safe(p.product_ref)+' · '+safe(p.name)+'</span><span class="muted">'+safe(new Date(p.updated_at).toLocaleDateString())+'</span></div>').join('')||'<p class="muted">No product updates yet.</p>';
    document.getElementById('activity').innerHTML=(data.recent_activity||[]).map(x=>'<div class="row"><span>'+safe(x.action)+' · '+safe(x.entity_ref||x.entity_type)+'</span><span class="muted">'+safe(new Date(x.created_at).toLocaleDateString())+'</span></div>').join('')||'<p class="muted">No administrative activity recorded yet.</p>';
    state.textContent='Authenticated administrator session. Dashboard data loaded.';
    dashboard.hidden=false;
    initProductPhotoStudio();
  }).catch(error=>{state.textContent=error.message+' Please refresh or contact the project owner.';});

  async function initProductPhotoStudio(){
    const select=document.getElementById('detail-product');
    const form=document.getElementById('detail-photo-form');
    const list=document.getElementById('detail-photo-list');
    const status=document.getElementById('detail-upload-status');
    const upload=document.getElementById('detail-upload');
    if(!select||!form||!list)return;
    let images=[];
    const load=async()=>{
      const response=await fetch('/api/admin/product-gallery',{redirect:'manual'});
      if(response.status===401||response.type==='opaqueredirect'){location.href='https://hatchable.com/console/login';return}
      if(!response.ok)throw new Error('Could not load the photo library.');
      const data=await response.json();
      const previous=select.value;
      select.innerHTML=(data.products||[]).map(p=>'<option value="'+safe(p.product_ref)+'">'+safe(p.product_ref)+' · '+safe(p.name)+'</option>').join('');
      if(previous)select.value=previous;
      images=data.images||[];
      render();
    };
    const render=()=>{
      const chosen=select.value;
      const rows=images.filter(x=>x.product_ref===chosen);
      list.innerHTML='<p class="eyebrow">'+safe(chosen||'Select a product')+' · '+rows.length+' photograph(s)</p>'+
        (rows.length?'<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))">'+rows.map(x=>'<article class="panel"><img src="'+safe(x.image_url)+'" alt="'+safe(x.alt_text)+'" loading="lazy" style="width:100%;aspect-ratio:4/5;object-fit:contain;background:#e9e3d8"><p><strong>'+safe(x.detail_type)+'</strong></p><p class="muted">'+safe(x.alt_text)+'</p><p class="eyebrow">'+(x.is_published?'Published on product page':'Draft · hidden from visitors')+'</p><button type="button" data-gallery-action="'+(x.is_published?'unpublish':'publish')+'" data-gallery-id="'+safe(x.id)+'">'+(x.is_published?'Unpublish':'Approve & publish')+'</button></article>').join('')+'</div>':'<p class="muted">No detail photographs for this piece yet. Upload original studio photographs above.</p>');
    };
    select.addEventListener('change',render);
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const file=document.getElementById('detail-file').files[0];
      if(!file)return;
      const payload=new FormData(form);
      upload.disabled=true;status.textContent='Uploading photograph…';
      try{
        const response=await fetch('/api/admin/product-gallery',{method:'POST',body:payload});
        const result=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(result.error||'Upload failed.');
        form.reset();status.textContent='Uploaded as a draft. Review it below, then publish.';
        await load();
      }catch(error){status.textContent=error.message}
      finally{upload.disabled=false}
    });
    list.addEventListener('click',async event=>{
      const button=event.target.closest('[data-gallery-action]');
      if(!button)return;
      button.disabled=true;
      try{
        const response=await fetch('/api/admin/product-gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:button.dataset.galleryAction,image_id:button.dataset.galleryId})});
        const result=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(result.error||'Could not update photograph.');
        await load();
      }catch(error){status.textContent=error.message;button.disabled=false}
    });
    try{await load()}catch(error){status.textContent=error.message}
  }
})();