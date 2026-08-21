const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;
const ROOT = path.resolve(__dirname);
const ASSETS = path.join(ROOT, 'assets');
const DATA_DIR = path.join(ROOT, 'data');
const CONFIG_PATH = path.join(ROOT, 'server-config.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(ASSETS)) fs.mkdirSync(ASSETS);

const config = fs.existsSync(CONFIG_PATH)
  ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  : { adminUser: 'admin', adminPass: 'changeme' };

app.use(express.static(ROOT));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

const upload = multer({ dest: path.join(ASSETS, 'tmp') });

function requireAuth(req, res, next){
  if (req.session && req.session.user === config.adminUser) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.post('/api/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === config.adminUser && pass === config.adminPass) {
    req.session.user = user;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res)=>{ req.session.destroy(()=>res.json({ok:true})); });

const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, JSON.stringify({ site:{}, results:[], banners:[] }, null, 2));

app.get('/api/content', requireAuth, (req, res)=>{
  const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  res.json(data);
});

app.post('/api/content', requireAuth, (req, res)=>{
  const current = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  const merged = Object.assign({}, current, req.body);
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(merged, null, 2));
  res.json({ ok:true });
});

app.get('/api/images', requireAuth, (req, res)=>{
  const imgs = fs.readdirSync(ASSETS).filter(f=>!f.startsWith('tmp'));
  res.json(imgs);
});

app.post('/api/upload', requireAuth, upload.single('file'), (req, res)=>{
  if(!req.file) return res.status(400).json({error:'no file'});
  const ext = path.extname(req.file.originalname);
  const name = Date.now() + '-' + req.file.originalname.replace(/[^a-zA-Z0-9.\-]/g,'_');
  const dest = path.join(ASSETS, name);
  fs.renameSync(req.file.path, dest);
  res.json({ ok:true, name });
});

app.delete('/api/images/:name', requireAuth, (req, res)=>{
  const name = req.params.name;
  const target = path.join(ASSETS, name);
  if (fs.existsSync(target)) { fs.unlinkSync(target); return res.json({ ok:true }); }
  res.status(404).json({ error:'not found' });
});

app.get('/api/results', requireAuth, (req, res)=>{
  const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  res.json(data.results || []);
});

app.post('/api/results', requireAuth, upload.single('file'), (req, res)=>{
  const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  let imageName = null;
  if (req.file){
    imageName = Date.now() + '-' + req.file.originalname.replace(/[^a-zA-Z0-9.\-]/g,'_');
    fs.renameSync(req.file.path, path.join(ASSETS, imageName));
  }
  const entry = Object.assign({ id: Date.now(), image: imageName }, req.body);
  data.results = data.results || [];
  data.results.unshift(entry);
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
  res.json({ ok:true, entry });
});

app.post('/api/banners', requireAuth, (req, res)=>{
  const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  data.banners = data.banners || [];
  const banner = Object.assign({ id: Date.now() }, req.body);
  data.banners.push(banner);
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
  res.json({ ok:true, banner });
});

app.get('/panel', (req, res)=>{
  res.sendFile(path.join(ROOT, 'panel.html'));
});

app.listen(PORT, ()=>console.log('Dev server running on http://localhost:'+PORT));
