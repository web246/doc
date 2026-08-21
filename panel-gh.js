// Minimal GitHub-backed admin panel. Uses PAT (repo scope) to commit files.
let state = {};

function el(id){return document.getElementById(id);}

function b64(arr){return btoa(String.fromCharCode.apply(null,new Uint8Array(arr)))}

async function ghRequest(owner, repo, path, method='GET', token, body){
  const url = `https://api.github.com/repos/${owner}/${repo}/${path}`;
  const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' };
  const res = await fetch(url, Object.assign({ method, headers }, body?{ body: JSON.stringify(body) }:{}));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getContentJson(){
  const {owner,repo,branch,token} = state;
  try{
    const res = await ghRequest(owner,repo,`contents/data/content.json?ref=${branch}`,'GET',token);
    const content = atob(res.content.replace(/\n/g,''));
    return { json: JSON.parse(content), sha: res.sha };
  }catch(err){
    // file missing -> return default
    return { json:{site:{},results:[],banners:[]}, sha:null };
  }
}

async function putFile(path, contentB64, message){
  const {owner,repo,branch,token} = state;
  // check if exists
  let sha = null;
  try{ const info = await ghRequest(owner,repo,`contents/${path}?ref=${branch}`,'GET',token); sha = info.sha; }catch(e){}
  const body = { message, content: contentB64, branch };
  if (sha) body.sha = sha;
  return ghRequest(owner,repo,`contents/${path}`,'PUT',token, body);
}

async function deleteFile(path, sha, message){
  const {owner,repo,branch,token} = state;
  const body = { message, sha, branch };
  return ghRequest(owner,repo,`contents/${path}`,'DELETE',token, body);
}

el('connect').addEventListener('click', ()=>{
  const owner = el('owner').value.trim();
  const repo = el('repo').value.trim();
  const branch = el('branch').value.trim()||'main';
  const token = el('token').value.trim();
  if(!owner||!repo||!token) return el('setupMsg').textContent='fill owner, repo and token';
  state = { owner, repo, branch, token };
  localStorage.setItem('gh_admin_state', JSON.stringify(state));
  el('setupMsg').textContent='Connected';
  // show content view by default and enable sidebar
  document.querySelectorAll('.panelSection').forEach(s=>s.hidden=true);
  el('content').hidden = false;
  // mark sidebar active
  document.querySelectorAll('.gh-sidebar nav button').forEach(b=>b.classList.remove('active'));
  document.querySelector('.gh-sidebar nav button[data-view="content"]').classList.add('active');
  loadAll();
});

if(el('disconnect')){
  el('disconnect').addEventListener('click', ()=>{ localStorage.removeItem('gh_admin_state'); state={}; location.reload(); });
}

async function loadAll(){ await loadContent(); await loadImages(); await loadResults(); await loadBanners(); }

async function loadContent(){ const {json} = await getContentJson(); el('heroEyebrow').value = (json.site&&json.site.hero&&json.site.hero.eyebrow)||''; el('heroH1').value = ((json.site&&json.site.hero&&json.site.hero.h1)||[]).join('\n'); el('heroLead').value = (json.site&&json.site.hero&&json.site.hero.lead)||''; }

el('saveContent').addEventListener('click', async ()=>{
  const eyebrow = el('heroEyebrow').value; const h1 = el('heroH1').value.split('\n'); const lead = el('heroLead').value;
  const {json,sha} = await getContentJson(); json.site = json.site||{}; json.site.hero = { eyebrow, h1, lead };
  const b64content = btoa(JSON.stringify(json, null, 2));
  await putFile('data/content.json', b64content, 'Update site content via admin panel');
  el('saveMsg').textContent = 'Saved to repo';
});

async function loadImages(){ const {owner,repo,branch,token} = state; try{ const res = await ghRequest(owner,repo,`contents/assets?ref=${branch}`,'GET',token); el('imgList').innerHTML=''; res.forEach(f=>{ const li=document.createElement('li'); li.innerHTML = `<img src="https://raw.githubusercontent.com/${owner}/${repo}/${branch}/assets/${f.name}" style="height:40px;margin-right:8px"> ${f.name} <button data-name="${f.name}">Delete</button>`; el('imgList').appendChild(li); }); el('imgList').querySelectorAll('button').forEach(b=>b.addEventListener('click', async ()=>{ if(!confirm('Delete?')) return; // get sha and delete
      const info = await ghRequest(owner,repo,`contents/assets/${b.dataset.name}?ref=${branch}`,'GET',token); await deleteFile(`assets/${b.dataset.name}`, info.sha, 'Delete image'); loadImages(); })); }catch(err){ el('imgList').innerHTML='<li>No assets folder yet</li>'; }
}

el('uploadImg').addEventListener('click', async ()=>{
  const f = el('imgFile').files[0]; if(!f) return alert('pick file');
  // try to auto-trim whitespace/transparent padding from logo-like images
  try{
    const processed = await trimImageFile(f);
    const arr = await processed.arrayBuffer(); const base64 = btoa(String.fromCharCode.apply(null,new Uint8Array(arr)));
    const name = Date.now()+'-'+f.name.replace(/[^a-zA-Z0-9.\-]/g,'_'); await putFile(`assets/${name}`, base64, 'Upload image (trimmed)'); await loadImages();
  }catch(e){
    // fallback to original
    const arr = await f.arrayBuffer(); const base64 = btoa(String.fromCharCode.apply(null,new Uint8Array(arr)));
    const name = Date.now()+'-'+f.name.replace(/[^a-zA-Z0-9.\-]/g,'_'); await putFile(`assets/${name}`, base64, 'Upload image'); await loadImages();
  }
});

// Trim image whitespace/transparent padding using canvas and return a Blob
async function trimImageFile(file){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = ()=>{
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); ctx.drawImage(img,0,0);
      const data = ctx.getImageData(0,0,w,h).data;
      let minX=w, minY=h, maxX=0, maxY=0, found=false;
      for(let y=0;y<h;y++){
        for(let x=0;x<w;x++){
          const idx = (y*w + x)*4;
          const a = data[idx+3];
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          const isOpaque = a>16; // some alpha
          const isNotWhite = !(r>240 && g>240 && b>240 && a>240);
          if(isOpaque || isNotWhite){ found=true; if(x<minX)minX=x; if(y<minY)minY=y; if(x>maxX)maxX=x; if(y>maxY)maxY=y; }
        }
      }
      if(!found) return reject(new Error('empty image'));
      const cw = maxX-minX+1, ch = maxY-minY+1; const c2 = document.createElement('canvas'); c2.width = cw; c2.height = ch; const ctx2 = c2.getContext('2d'); ctx2.drawImage(img, minX, minY, cw, ch, 0,0,cw,ch);
      c2.toBlob(blob=>{ if(!blob) return reject(new Error('blob fail')); resolve(blob); }, file.type || 'image/png');
    };
    img.onerror = ()=>reject(new Error('image load'));
    img.src = URL.createObjectURL(file);
  });
}

// Results
el('resultForm').addEventListener('submit', async e=>{
  e.preventDefault(); const fd = new FormData(el('resultForm')); const title = fd.get('title'); const desc = fd.get('desc'); const file = document.getElementById('resultFile').files[0]; let imageName = null; if(file){ const arr = await file.arrayBuffer(); const base64 = btoa(String.fromCharCode.apply(null,new Uint8Array(arr))); imageName = Date.now()+'-'+file.name.replace(/[^a-zA-Z0-9.\-]/g,'_'); await putFile(`assets/${imageName}`, base64, 'Upload result image'); }
  const {json} = await getContentJson(); json.results = json.results||[]; json.results.unshift({ id: Date.now(), title, desc, image: imageName }); const b64content = btoa(JSON.stringify(json,null,2)); await putFile('data/content.json', b64content, 'Add result'); loadResults();
});

async function loadResults(){ const {json} = await getContentJson(); el('resultsList').innerHTML=''; (json.results||[]).forEach(r=>{ const li=document.createElement('li'); li.textContent = (r.title||r.id)+' '+(r.image||''); el('resultsList').appendChild(li); }); }

// Banners
el('bannerForm').addEventListener('submit', async e=>{ e.preventDefault(); const fd = new FormData(el('bannerForm')); const data = Object.fromEntries(fd.entries()); const {json} = await getContentJson(); json.banners = json.banners||[]; json.banners.push(Object.assign({ id: Date.now() }, data)); await putFile('data/content.json', btoa(JSON.stringify(json,null,2)), 'Add banner'); loadBanners(); });
async function loadBanners(){ const {json} = await getContentJson(); el('bannerList').innerHTML=''; (json.banners||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent = b.text + ' → ' + b.target; el('bannerList').appendChild(li); }); }

// Load saved state
(function(){ const s = localStorage.getItem('gh_admin_state'); if(s){ try{ const parsed = JSON.parse(s); el('owner').value = parsed.owner||''; el('repo').value = parsed.repo||''; el('branch').value = parsed.branch||'main'; el('token').value = parsed.token||''; }catch(e){} }})();

// Sidebar navigation
// Sidebar navigation (robust guard for dynamic DOM)
const sidebarButtons = document.querySelectorAll('.gh-sidebar nav button');
if(sidebarButtons && sidebarButtons.length){
  sidebarButtons.forEach(b=>{
    b.addEventListener('click', (e)=>{
      sidebarButtons.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const v = b.dataset.view;
      document.querySelectorAll('.panelSection').forEach(s=>s.hidden=true);
      const elv = document.getElementById(v);
      if (elv) elv.hidden = false;
      // focus the first input inside the section for faster workflow
      const firstInput = elv && elv.querySelector('input,textarea,select,button'); if(firstInput) firstInput.focus();
    });
  });
}

// Live preview: postMessage to iframe
function postPreview(data){
  const iframe = document.getElementById('previewFrame');
  if(!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage({ type:'preview-update', data }, '*');
}

// Debounced preview updates
let previewTimer = null;
function schedulePreview(){
  if(previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(()=>{
    const data = { hero:{ eyebrow: el('heroEyebrow').value, h1: el('heroH1').value.split('\n'), lead: el('heroLead').value } };
    postPreview(data);
  }, 300);
}

['heroEyebrow','heroH1','heroLead'].forEach(id=>{ const e = document.getElementById(id); if(e) e.addEventListener('input', schedulePreview); });

// Drag & drop for images
const dropZone = document.getElementById('dropZone');
if(dropZone){
  dropZone.addEventListener('dragover', e=>{ e.preventDefault(); dropZone.classList.add('active'); });
  dropZone.addEventListener('dragleave', e=>{ dropZone.classList.remove('active'); });
  dropZone.addEventListener('drop', async e=>{
    e.preventDefault(); dropZone.classList.remove('active');
    const f = e.dataTransfer.files[0]; if(!f) return; el('imgFile').files = e.dataTransfer.files; el('uploadImg').click();
  });
}

// open preview in new tab
document.getElementById('openInNew')?.addEventListener('click', ()=>{ const iframe = document.getElementById('previewFrame'); if(iframe) window.open(iframe.src, '_blank'); });

// apply preview immediately after uploads/saves where appropriate
const origPutFile = putFile;
putFile = async function(path, contentB64, message){
  const res = await origPutFile(path, contentB64, message);
  // when content.json changed, update preview
  if (path === 'data/content.json'){
    try{ const parsed = JSON.parse(atob(contentB64)); postPreview(parsed); }catch(e){}
  }
  return res;
};
