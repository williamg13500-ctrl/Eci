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
  }).catch(error=>{state.textContent=error.message+' Please refresh or contact the project owner.';});
})();