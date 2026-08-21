async function api(path, opts={}){
  const res = await fetch('/api'+path, Object.assign({ credentials:'include' }, opts));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const sidebar = document.getElementById('sidebar');
const views = document.querySelectorAll('.view');

loginForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(loginForm);
  try{
    await api('/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user: fd.get('user'), pass: fd.get('pass') })});
    sidebar.hidden = false; document.getElementById('login').hidden = true;
    show('dashboard'); loadImages(); loadContent(); loadResults(); loadBanners();
  }catch(err){ loginMsg.textContent = 'Login failed'; }
});

function show(view){ views.forEach(v=>v.hidden=true); document.getElementById(view).hidden=false; }

document.querySelectorAll('#sidebar nav button[data-view]').forEach(b=>b.addEventListener('click', ()=>show(b.dataset.view)));

document.getElementById('logout').addEventListener('click', async ()=>{ await api('/logout',{method:'POST'}); location.reload(); });

// Content
async function loadContent(){
  const data = await api('/content');
  const hero = data.site && data.site.hero || {};
  document.getElementById('heroEyebrow').value = hero.eyebrow||'';
  document.getElementById('heroH1').value = (hero.h1||[]).join('\n');
  document.getElementById('heroLead').value = hero.lead||'';
}

document.getElementById('saveContent').addEventListener('click', async ()=>{
  const eyebrow = document.getElementById('heroEyebrow').value;
  const h1 = document.getElementById('heroH1').value.split('\n');
  const lead = document.getElementById('heroLead').value;
  await api('/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ site:{ hero:{ eyebrow, h1, lead } } })});
  document.getElementById('saveMsg').textContent = 'Saved';
});

// Images
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const imageList = document.getElementById('imageList');

uploadForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const f = fileInput.files[0]; if(!f) return alert('pick a file');
  const fd = new FormData(); fd.append('file', f);
  await fetch('/api/upload',{ method:'POST', body:fd, credentials:'include' });
  await loadImages();
});

async function loadImages(){
  try{
    const imgs = await api('/images');
    imageList.innerHTML = '';
    imgs.forEach(i=>{
      const li = document.createElement('li');
      li.innerHTML = `<img src="/assets/${i}" style="height:40px;margin-right:8px"> ${i} <button data-file="${i}">Delete</button>`;
      imageList.appendChild(li);
    });
    imageList.querySelectorAll('button').forEach(b=>b.addEventListener('click', async ()=>{ if(!confirm('Delete?'))return; await fetch('/api/images/'+b.dataset.file,{ method:'DELETE', credentials:'include' }); loadImages(); }));
  }catch(err){ console.error(err); }
}

// Results
const resultForm = document.getElementById('resultForm');
const resultsList = document.getElementById('resultsList');
resultForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const fd = new FormData(resultForm);
  await fetch('/api/results',{ method:'POST', body:fd, credentials:'include' });
  await loadResults();
});
async function loadResults(){
  try{
    const res = await api('/results');
    resultsList.innerHTML = '';
    res.forEach(r=>{ const li=document.createElement('li'); li.textContent = (r.title||r.id)+' '+(r.image||''); resultsList.appendChild(li); });
  }catch(err){ console.error(err); }
}

// Banners
const bannerForm = document.getElementById('bannerForm');
const bannerList = document.getElementById('bannerList');
bannerForm.addEventListener('submit', async e=>{ e.preventDefault(); const fd = new FormData(bannerForm); const data = Object.fromEntries(fd.entries()); await api('/banners',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); loadBanners(); });
async function loadBanners(){ const d = await api('/content'); bannerList.innerHTML=''; (d.banners||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent = b.text + ' → ' + b.target; bannerList.appendChild(li); }); }

