// Data (services, reviews, faqs, images)
const SERVICES = [
  {slug:'carbon-clean-ultra-diagnostics',name:'Carbon Clean Ultra & Diagnostics',category:'Carbon Cleaning',price:'£99',duration:'59 min',desc:'A 60-minute engine carbon clean paired with computer diagnostics.'},
  {slug:'carbon-clean-up-to-1-6l',name:'Carbon Clean up to 1.6L',category:'Carbon Cleaning',price:'£59',duration:'40 min',desc:'Hydrogen engine carbon cleaning for cars and vans up to 1.6 litres.'},
  {slug:'carbon-clean-up-to-2-2l',name:'Carbon Clean up to 2.2L',category:'Carbon Cleaning',price:'£69',duration:'40 min',desc:'Hydrogen engine carbon cleaning for cars and vans up to 2.2 litres.'},
  {slug:'carbon-clean-from-2-2l',name:'Carbon Clean from 2.2L',category:'Carbon Cleaning',price:'£79',duration:'40 min',desc:'Hydrogen engine carbon cleaning for cars and vans above 2.2 litres.'},
  {slug:'commercial-carbon-clean',name:'Commercial Carbon Clean',category:'Carbon Cleaning',price:'£89',duration:'40 min',desc:'Carbon cleaning designed around working commercial vehicles.'},
  {slug:'two-engine-carbon-clean',name:'Two Engine Carbon Cleans',category:'Carbon Cleaning',price:'£119',duration:'59 min',desc:'Two carbon cleans for any size engines at our Northampton location.'},
  {slug:'hgv-carbon-clean',name:'HGV Carbon Clean',category:'Carbon Cleaning',price:'£149',duration:'59 min',desc:'Engine carbon cleaning for HGV and heavy-duty applications.'},
  {slug:'dpf-wash-flush',name:'DPF Wash & Flush',category:'DPF Services',price:'£249.99',duration:'1 hour',desc:'DPF wash and flush service with ECU sensor resetting.'},
  {slug:'dpf-wash-flush-4-2-tdi',name:'DPF Wash & Flush 4.2 TDI',category:'DPF Services',price:'£299.99',duration:'1 hour',desc:'Dedicated DPF wash and flush service for 4.2 TDI vehicles.'},
  {slug:'computer-diagnostics',name:'Computer Diagnostics',category:'Diagnostics',price:'Enquire',duration:'—',desc:'Professional computer diagnostics to identify vehicle faults.'},
  {slug:'safety-analysis',name:'Safety Analysis',category:'Diagnostics',price:'Enquire',duration:'—',desc:'A focused vehicle safety assessment and clear advice.'},
  {slug:'drivability-problems',name:'Drivability Problems',category:'Diagnostics',price:'Enquire',duration:'—',desc:'Investigation of performance, response and running concerns.'},
  {slug:'chemical-inlet-manifold-carbon-clean',name:'Chemical Inlet Manifold Carbon Clean',category:'Other Services',price:'£199.99',duration:'59 min',desc:'Targeted chemical cleaning for inlet manifold carbon deposits.'},
  {slug:'oil-change-advice',name:'Oil Change Advice',category:'Other Services',price:'Enquire',duration:'—',desc:'Practical maintenance advice following carbon cleaning.'},
  {slug:'tyre-inspection',name:'Tyre Inspection',category:'Other Services',price:'Enquire',duration:'—',desc:'Professional visual tyre condition inspection.'}
];

const REVIEWS = [
  {name:'Russell Skinner',date:'July 2023',text:'Absolute professional, genuinely knows his business and has vast experience. I would not hesitate for a second to recommend him.'},
  {name:'James Hobbs',date:'May 2022',text:'Paul gave me a really clear explanation of the problem and how the Carbon Doctor service would be able to help. Absolutely brilliant!'},
  {name:'Sam Durling',date:'May 2022',text:'Amazing service from Paul. Had a 60 min carbon clean done on my VW Scirocco and Paul was a top gent.'}
];

const FAQS = [
  {q:'What is engine carbon cleaning?',a:'Carbon Doctor uses deionised water to create hydrogen and oxygen, which pass through the engine air intake and exhaust as a gas to help remove excess carbon.'},
  {q:'How does DPF cleaning work?',a:'The DPF wash and flush service cleans accumulated soot and ash and includes ECU sensor resetting.'},
  {q:'How long does carbon cleaning take?',a:'Most listed car and van carbon-clean services take 40 minutes; the Ultra service and selected larger-vehicle services take around 59 minutes.'},
  {q:'Where is Carbon Doctor located?',a:'310 Wellingborough Road, Northampton, NN1 4EP, UK.'},
  {q:'Can you come to my location?',a:'Some services are listed as available at the customer\'s place. Call to confirm availability for your vehicle and postcode.'},
  {q:'What vehicles can you service?',a:'Carbon cleaning is listed for petrol, diesel and LPG engines, from motorcycles and cars to vans, HGVs and specialist applications.'},
  {q:'How do I book?',a:'Choose a service online or call 0800 093 6112 to discuss the right option.'}
];

// Routing helpers
function linkClickHandler(e){
  const a = e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href) return;
  // convert absolute root paths to hash routes when clicked (helps GitHub Pages)
  if(href.startsWith('/')){
    e.preventDefault();
    location.hash = '#'+href; // e.g. /services -> #/services
    // close mobile overlays
    document.querySelector('.topLinks')?.classList.remove('open');
    document.getElementById('mega')?.setAttribute('hidden','');
  } else if(href.startsWith('#/')){
    // allow default hash navigation; just close overlays
    document.querySelector('.topLinks')?.classList.remove('open');
    document.getElementById('mega')?.setAttribute('hidden','');
  }
}

document.addEventListener('click', linkClickHandler);

window.addEventListener('hashchange', router);

function setMegaMenu(open){
  const mega = document.getElementById('mega');
  const btn = document.getElementById('servicesBtn');
  if(!mega || !btn) return;
  if(open){
    mega.removeAttribute('hidden');
    btn.setAttribute('aria-expanded','true');
  } else {
    mega.setAttribute('hidden','');
    btn.setAttribute('aria-expanded','false');
  }
}

// Basic router mapping
function router(){
  const raw = location.hash.slice(1) || '/';
  const path = (raw.split('?')[0].replace(/\/$/,'') || '/');
  const app = document.getElementById('app');
  document.getElementById('year').textContent = new Date().getFullYear();
    if(path === '/'){ 
      renderTemplate('tmpl-home'); 
      hookHome(); 
      return; 
    } 
  if(path.startsWith('/services/')){
    const slug = path.replace('/services/','');
    renderServiceDetail(slug);
    return;
  }
  if(path === '/services'){
    renderServiceList();
    return;
  }
  if(path === '/results'){
    renderResults();
    return;
  }
  if(path === '/areas-we-cover'){
    renderAreas();
    return;
  }
  if(path === '/faq'){
    renderFaq();
    return;
  }
  if(path === '/contact'){
    renderContact();
    return;
  }
  if(path === '/book'){
    renderBooking();
    return;
  }
  // story pages (about, carbon-cleaning, dpf-services, diagnostics, commercial-fleet)
  const stories = ['/about','/carbon-cleaning','/dpf-services','/diagnostics','/commercial-fleet','/privacy','/terms'];
  if(stories.includes(path)){
    renderStory(path);
    return;
  }
  // fallback
  document.getElementById('app').innerHTML = '<section class="section"><h2>Page not found</h2><p class="copy">The requested page could not be found.</p></section>';
}

function renderServiceDetail(slug){
  const svc = SERVICES.find(s=>s.slug===slug);
  if(!svc){ document.getElementById('app').innerHTML = '<section class="section"><h2>Service not found</h2></section>'; return; }
  const imageMap = {
    'carbon-clean-ultra-diagnostics':'https://images.unsplash.com/photo-1771340012319-0b4fca008b54?auto=format&fit=crop&fm=jpg&q=85&w=1800',
    'carbon-clean-up-to-1-6l':'https://images.unsplash.com/photo-1767339736233-f4b02c41ee4a?auto=format&fit=crop&fm=jpg&q=85&w=1800',
    'carbon-clean-up-to-2-2l':'https://images.unsplash.com/photo-1771340012319-0b4fca008b54?auto=format&fit=crop&fm=jpg&q=85&w=1800',
    'carbon-clean-from-2-2l':'381db8_617d80cf46d74d0daa403c63c5cc02fa~mv2.jpg',
    'commercial-carbon-clean':'381db8_c34669a285f747619e0ff6f936d68946~mv2_d_4032_3024_s_4_2.jpg',
    'two-engine-carbon-clean':'381db8_f8cf84d94a9b4b67b1abbe8ae32d3e70~mv2_d_4032_3024_s_4_2.jpg',
    'hgv-carbon-clean':'381db8_c8ac6d9b88d2460aa88264bd126801c5~mv2_d_4032_3024_s_4_2.jpg',
    'dpf-wash-flush':'381db8_c45b1365293c4c579c5c0562c0b380e9~mv2.jpg',
    'dpf-wash-flush-4-2-tdi':'381db8_5b7dac0a69a8420fb852294a3d6d8033~mv2.jpg',
    'computer-diagnostics':'11062b_255f8a1173954b118306f66959c9dd07~mv2.jpeg'
  };
  const img = imageMap[slug] || '381db8_d8833a337df34b31a2bba7ca78b0bada~mv2.png';
  const imageSrc = img.startsWith('http') ? img : `https://static.wixstatic.com/media/${img}/v1/fill/w_1600,h_900,al_c,q_85/${img}`;
  document.getElementById('app').innerHTML = `
    <section class="pageHero serviceDetailHero"><img class="heroImage" src="${imageSrc}" alt="${svc.name}"><div class="pageHeroContent"><p class="eyebrow">${svc.category} · NORTHAMPTON</p><h1>${svc.name}</h1><p class="copy">${svc.desc}</p></div></section>
    <section class="section serviceDashboard">
      <aside>
        <p>SERVICE DETAILS</p>
        ${svc.price && svc.price!=='Enquire' ? `<b>${svc.price}</b>` : '<b>Enquire</b>'}
        <span>⏱ ${svc.duration && svc.duration!=='—' ? svc.duration : 'Duration confirmed on enquiry'}</span>
        <span>📍 Northampton / availability varies</span>
        <a class="btn" href="#/book?service=${svc.slug}">Book this service</a>
      </aside>
      <main>
        <p class="eyebrow">SERVICE OVERVIEW</p>
        <h2>A precise intervention for your vehicle.</h2>
        <p class="copy">${svc.desc} Carbon Doctor will confirm suitability for your vehicle before work begins and explain the process clearly.</p>
        <h3>What to expect</h3>
        <ul class="process">
          <li><b>01</b><h3>Service and vehicle details confirmed</h3></li>
          <li><b>02</b><h3>Professional inspection and service delivery</h3></li>
          <li><b>03</b><h3>Clear findings and maintenance guidance</h3></li>
        </ul>
        <h3>Key benefits</h3>
        <ul class="checkList"><li>Professional equipment and process</li><li>Service selected around engine and vehicle type</li><li>Clear, customer-focused explanation</li></ul>
      </main>
    </section>
    <section class="section related"><p class="eyebrow">RELATED SERVICES</p><h2>Continue exploring</h2><div>` + SERVICES.filter(s=>s.category===svc.category && s.slug!==svc.slug).slice(0,3).map(s=>`<a href="#/services/${s.slug}"><div><b>${s.name}</b><small>${s.desc}</small></div><div><em>${s.price}</em></div></a>`).join('') + `</div></section>`;
}

function renderTemplate(id){
  const t = document.getElementById(id);
  if(!t) return;
  document.getElementById('app').innerHTML = t.innerHTML;
}

function renderServiceList(){
  const categories = [...new Set(SERVICES.map(service => service.category))];
  const groups = categories.map(category => {
    const services = SERVICES.filter(service => service.category === category).map(service => `
      <a href="#/services/${service.slug}">
        <div><b>${service.name}</b><small>${service.desc}</small></div>
        <em>${service.price}</em><span aria-hidden="true">&rarr;</span>
      </a>`).join('');
    return `<div><p class="eyebrow">${category}</p><h2>${category === 'Other Services' ? 'Additional care' : category}</h2><div>${services}</div></div>`;
  }).join('');
  document.getElementById('app').innerHTML = `
    <section class="pageHero catalogueHero"><div class="pageHeroContent"><p class="eyebrow">CARBON DOCTOR &middot; NORTHAMPTON</p><h1>Services that keep you moving.</h1><p class="copy">Choose the care your vehicle needs, then book online or speak to the team for clear advice.</p></div></section>
    <section class="section catalogue">${groups}</section>`;
}

function renderResultsLegacy(){
  const categories = [...new Set(SERVICES.map(s=>s.category))];
  const imgs = [
    'assets/difference.jpeg',
    'https://images.unsplash.com/photo-1771340012319-0b4fca008b54?auto=format&fit=crop&fm=jpg&q=85&w=1400',
    'https://images.unsplash.com/photo-1767339736233-f4b02c41ee4a?auto=format&fit=crop&fm=jpg&q=85&w=1400'
  ];
  const base = 'https://static.wixstatic.com/media/';
  let html = '<section class="section results"><header><p class="eyebrow">GALLERY</p><h2>Results</h2></header>';
  html += '<div class="gallery"><div class="filters">';
  html += `<button class="active" data-cat="all">All</button>`;
  categories.forEach(c=>html+=`<button data-cat="${c}">${c}</button>`);
  html += '</div><div>';
  imgs.forEach((id,index)=>{
    const src = id.startsWith('http') || id.startsWith('assets/') ? id : base+id+`/v1/fill/w_1000,h_750,al_c,q_85/${id}`;
    const captions = ['Before & after engine bay', 'Engine clean inspection', 'Engine components assessment'];
    html += `<button data-src="${src}"><img src="${src}" alt="Carbon cleaning result"><span><b>Carbon Cleaning</b><small>${captions[index]}</small><svg>+</svg></span></button>`;
  });
  html += '</div></div></section>';
  document.getElementById('app').innerHTML = html;
  // wire gallery
  document.querySelectorAll('.gallery button[data-src]').forEach(b=>b.addEventListener('click',e=>{
    const src = b.getAttribute('data-src');
    openLightbox(src);
  }));
}

function openLightbox(src){
  const lb = document.createElement('div'); lb.className='lightbox';
  lb.innerHTML = `<button aria-label="Close">✕</button><img src="${src}" alt="zoom">`;
  document.body.appendChild(lb);
  lb.querySelector('button').onclick = ()=>document.body.removeChild(lb);
}

function renderAreas(){
  document.getElementById('app').innerHTML = `<section class="section"><div class="areaMap"><div><p class="eyebrow">WORKSHOP LOCATION</p><h2>310 Wellingborough Road</h2><p>Northampton · NN1 4EP · United Kingdom</p><p class="copy">Visit the workshop for professional engine care, diagnostics and DPF services.</p><a class="btn" href="https://www.google.com/maps/search/?api=1&query=310+Wellingborough+Road+Northampton" target="_blank" rel="noopener noreferrer">Get directions →</a></div><div class="liveMap"><iframe title="Carbon Doctor workshop location" src="https://www.google.com/maps?q=310%20Wellingborough%20Road%2C%20Northampton%2C%20NN1%204EP&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div></section>`;
}

function renderResults(){
  const wixImage = id => `https://static.wixstatic.com/media/${id}/v1/fill/w_1400,h_1050,al_c,q_85/${id}`;
  const results = [
    {src:'assests/difference.jpeg', title:'Before & after', text:'A clear engine-bay comparison following carbon-cleaning work.', featured:true},
    {src:'https://images.unsplash.com/photo-1771340012319-0b4fca008b54?auto=format&fit=crop&fm=jpg&q=85&w=1400', title:'Engine assessment', text:'A close, professional inspection before the service begins.'},
    {src:wixImage('381db8_cdd0afa166194b7e9adad3a3bbf27d1c~mv2_d_4032_3024_s_4_2.jpg'), title:'Workshop care', text:'Professional attention to the engine bay.'},
    {src:wixImage('381db8_617d80cf46d74d0daa403c63c5cc02fa~mv2.jpg'), title:'Carbon cleaning', text:'A focused approach to cleaner-running vehicles.'},
    {src:wixImage('381db8_f8cf84d94a9b4b67b1abbe8ae32d3e70~mv2_d_4032_3024_s_4_2.jpg'), title:'Vehicle service', text:'Results built around the vehicle in front of us.'}
  ];
  document.getElementById('app').innerHTML = `<section class="section results resultsPage"><header><div><p class="eyebrow">CARBON CLEANING RESULTS</p><h2>Proof is in the detail.</h2><p class="copy">A focused selection of engine-bay work, professional inspections and before-and-after results.</p></div><aside><b>01 — 05</b><span>Selected workshop results</span><small>Click an image to view it in detail.</small></aside></header><div class="resultsGrid">${results.map(item => `<button class="${item.featured ? 'featured' : ''}" data-src="${item.src}"><img src="${item.src}" alt="${item.title}"><span><b>${item.title}</b><small>${item.text}</small><i aria-hidden="true">+</i></span></button>`).join('')}</div></section>`;
  document.querySelectorAll('.resultsGrid button').forEach(button => button.addEventListener('click',()=>openLightbox(button.dataset.src)));
}

function renderFaq(){
  let html = '<section class="section faqPage"><div><p class="eyebrow">SERVICE FAQ</p><h2>Before you book</h2><p>Need to discuss a specific vehicle? Call 0800 093 6112.</p></div><div class="accordion">';
  FAQS.forEach((f,i)=>{
    html += `<article><button data-i="${i}">${f.q}<span>+</span></button><p class="hidden">${f.a}</p></article>`;
  });
  html += '</div></section>';
  document.getElementById('app').innerHTML = html;
  document.querySelectorAll('.accordion button').forEach(btn=>btn.addEventListener('click',e=>{
    const i = +btn.dataset.i; const p = btn.nextElementSibling; const open = !p.classList.contains('open');
    document.querySelectorAll('.accordion p').forEach(x=>x.classList.remove('open'));
    document.querySelectorAll('.accordion button span').forEach(s=>s.textContent='+');
    if(open){ p.classList.add('open'); btn.querySelector('span').textContent='-'; }
  }));
}

function renderContactLegacy(){
  const html = `<section class="section contact"><div><p class="eyebrow">CARBON DOCTOR</p><h2>Northampton</h2><p><a href="tel:08000936112">0800 093 6112</a></p><p><a href="mailto:info@carbon.doctor">info@carbon.doctor</a></p><p>310 Wellingborough Road, Northampton</p><a class="textLink" href="https://www.google.com/maps/search/?api=1&query=310+Wellingborough+Road+Northampton">Get directions</a></div><div><form id="contactForm"><label>Name<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Phone<input name="phone"></label><label>Vehicle model<input name="vehicle"></label><label>How can we help?<textarea name="message" rows="4"></textarea></label><div style="grid-column:1/-1"><button class="btn" type="submit">Send message</button></div></form><div id="contactSuccess" class="success" style="display:none"><svg>✓</svg><h3>Message prepared.</h3><p>Thank you. For this client demo, submissions are simulated. Call the team for a live enquiry.</p></div></div></section>`;
  document.getElementById('app').innerHTML = html;
  const form = document.getElementById('contactForm');
  form.addEventListener('submit',e=>{
    e.preventDefault(); form.style.display='none'; document.getElementById('contactSuccess').style.display='block';
  });
}

function renderContact(){
  document.getElementById('app').innerHTML = `
    <section class="section contact">
      <div>
        <p class="eyebrow">CONTACT CARBON DOCTOR</p><h2>Let’s talk about your vehicle.</h2>
        <p class="copy">Tell us what’s happening and the team will help you identify the right next step.</p>
        <div class="contactMeta">
          <a href="tel:08000936112"><span class="contactIcon">☎</span><span><b>Call us</b><br>0800 093 6112</span></a>
          <a href="mailto:info@carbon.doctor"><span class="contactIcon">✉</span><span><b>Email us</b><br>info@carbon.doctor</span></a>
          <p><span class="contactIcon">⌖</span><span><b>Visit the workshop</b><br>310 Wellingborough Road, Northampton, NN1 4EP</span></p>
        </div>
        <a class="textLink" href="https://www.google.com/maps/search/?api=1&query=310+Wellingborough+Road+Northampton" target="_blank" rel="noopener noreferrer">Get directions →</a>
        <div class="contactMap liveMap"><iframe title="Carbon Doctor workshop location" src="https://www.google.com/maps?q=310%20Wellingborough%20Road%2C%20Northampton%2C%20NN1%204EP&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
      </div>
      <div>
        <form id="contactForm">
          <label>Name<input name="name" autocomplete="name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label class="phoneField">Phone number<input id="phone" name="phone" type="tel" autocomplete="tel" required></label>
          <label>Postcode area<select name="postcode" required><option value="" selected disabled>Select your area</option><option>NN1 — Northampton Central</option><option>NN2 — Kingsthorpe</option><option>NN3 — East Northampton</option><option>NN4 — South Northampton</option><option>NN5 — West Northampton</option><option>NN6 — Northamptonshire</option><option>NN7 — Northamptonshire</option><option>NN8 — Wellingborough</option><option>Other UK postcode</option><option>Outside the UK</option></select></label>
          <label>Vehicle model<input name="vehicle" autocomplete="off" placeholder="e.g. Volkswagen Golf"></label>
          <label>Service<select name="service"><option value="" selected disabled>Select a service (optional)</option>${SERVICES.map(s=>`<option value="${s.slug}">${s.name}</option>`).join('')}</select></label>
          <label>How can we help?<textarea name="message" rows="4" placeholder="Tell us about the issue or service you need"></textarea></label>
          <div style="grid-column:1/-1"><button class="btn" type="submit">Send enquiry</button></div>
        </form>
        <div id="contactSuccess" class="success" style="display:none"><h3>Thanks — your enquiry is ready.</h3><p>This demo simulates sending a message. Carbon Doctor would follow up to discuss your vehicle.</p></div>
      </div>
    </section>`;
  const phone = document.getElementById('phone');
  if(window.intlTelInput){
    window.intlTelInput(phone,{initialCountry:'gb',separateDialCode:true,strictMode:true,nationalMode:false});
  }
  document.getElementById('contactForm').addEventListener('submit',event=>{
    event.preventDefault();
    const form = event.currentTarget;
    if(!form.reportValidity()) return;
    form.style.display='none';
    document.getElementById('contactSuccess').style.display='block';
  });
}

function renderStory(path){
  let title=''; let image=''; let head=''; let body='';
  if(path==='/about'){ title='Restorative engineering, since 2017.'; image='381db8_bf0e75a996d34d67a8fe33ede8d0f12d~mv2_d_3024_4032_s_4_2.jpg'; head='A modern approach to engine care'; body='The hydrogen cleaning system uses deionised water to create hydrogen and oxygen, passed through the engine without dismantling components or using harmful chemical products. The approach is technical, but the service remains personal: understand the vehicle, explain the work and give clear maintenance advice.' }
  if(path==='/carbon-cleaning'){ title='Give your engine room to breathe.'; image='assets/carbon.png'; head='Carbon cleaning, without dismantling'; body='Hydrogen and oxygen pass through the engine air intake and leave through the exhaust as a gas, helping remove excess carbon associated with poor running.' }
  if(path==='/dpf-services'){ title='Restore flow. Protect performance.'; image='381db8_23213a30caeb4a66adb8eeac2ef76395~mv2.jpeg'; head='Address the restriction properly'; body='Diesel particulate filters capture exhaust particulates, but soot and ash build-up can lead to warning lights, reduced performance and limp mode.' }
  if(path==='/diagnostics'){ title='Evidence before action.'; image='11062b_255f8a1173954b118306f66959c9dd07~mv2.jpeg'; head='Find the cause, not just the symptom'; body='Computer diagnostics support a clearer understanding of vehicle faults.' }
  if(path==='/commercial-fleet'){ title='Keep your fleet moving.'; image='381db8_6c9d3ed82dfc4d44a80f9305911f4822~mv2_d_3024_4032_s_4_2.jpg'; head='Built around working vehicles'; body='Clogged DPFs can reduce performance and increase maintenance costs.' }
  if(path==='/privacy' || path==='/terms'){
    if(path==='/privacy'){
      title = 'Privacy Policy';
      image='11062b_255f8a1173954b118306f66959c9dd07~mv2.jpeg';
      head='Your information';
      body='This redesigned website is a client demonstration. For Carbon Doctor\'s currently published information, please contact the business directly at info@carbon.doctor or call 0800 093 6112.';
    } else {
      // Render full Terms of Business page
      document.getElementById('app').innerHTML = `
        <section class="section"><div>
          <p class="eyebrow">TERMS OF BUSINESS</p>
          <h1>Carbon Doctor Ltd — Terms of Business</h1>
          <p>Innovative carbon clean solution reduces emissions, improves performance and enhances driveability — in just 30 minutes.</p>
          <ul>
            <li>Effects are immediate</li>
            <li>Revitalises inlet system, cylinder head and exhaust manifold</li>
            <li>Smoother, more powerful delivery of performance</li>
            <li>Lower emissions and quieter engine</li>
            <li>No chemicals used</li>
            <li>Approx. 30 mins for each clean</li>
            <li>Less maintenance required</li>
            <li>CE marked product</li>
          </ul>

          <h2>Our contract with you</h2>
          <p>By asking Carbon Doctor to carry out a motor carbon clean on your vehicle you agree that our work shall be governed by these terms and conditions. Our contract with you is formed at the time of you making your appointment with us online, over the phone or in person. By handing over your vehicle and key to our technician you agree to these Terms of Business.</p>

          <h3>Declaration</h3>
          <p>I have read and understood Carbon Doctor Terms of Business as expressed in this contract and agree to my vehicle (registration number below) to have its engine cleaned using the engine carbon clean service.</p>
          <p>Customer Name<br>Vehicle Registration Number<br>Customer Address<br>Vehicle Mileage<br>Appointment Date<br>Customer Telephone<br>Customer Email<br>Signed by Vehicle Owner (or representative)<br>Date</p>

          <h3>1. Risk and faults</h3>
          <p>In the course of the motor carbon clean process, a controlled volume of hydrogen is introduced into the engine through your vehicle's air intake. Your vehicle may suffer an engine fault through no fault of our technician or motor carbon clean service. You acknowledge that risk. If that happens, we will ask if you would like us to restart your vehicle's engine. If your vehicle will not restart you will be liable for any costs incurred in having the vehicle recovered and repaired subject to clauses 6 & 8 below.</p>

          <h3>2. Manufacturer warranty</h3>
          <p>Please be aware that having your motor cleaned using the carbon clean process may result in your vehicle manufacturer's warranty being invalidated. You acknowledge that risk. If you have any questions regarding your manufacturer's warranty please contact your manufacturer. Carbon Doctor holds certificates of no harm from a number of motor manufacturers — for information please call 0800 093 6112 or write to Customer Services c/o Carbon Doctor or email info@carbon.doctor.</p>

          <h3>3. Payments up front and in part</h3>
          <p>You agree to be responsible for the full cost of our motor carbon/DPF clean work on your vehicle. In making arrangements to deliver our service to you, we incur business costs. You agree that we can immediately charge 50% (i) for or in any respect of these arrangements or costs and/or (ii) an up front part payment in respect of our service.</p>

          <h3>4. Performance expectations</h3>
          <p>The improvement to emissions and/or additional motor power and/or fuel economy and/or future engine component reliability depends upon each individual motor, the motor's mileage and hours used, the fuel and lubricants used and the style of driving. Carbon Doctor can make no guarantee with regards to these benefits or the amounts of carbon that can be safely removed in the 30 minute procedure.</p>

          <h3>5. Pre-existing damage</h3>
          <p>A diagrammatic record of visible damage existing on your vehicle will be made by our technician before starting work on your vehicle. We exclude all liability for repair of damage, whether visible or not, existing before we began to work on your vehicle.</p>

          <h3>6. Service delivery & complaints</h3>
          <p>We will perform our service to the best of our ability at a time and location to be agreed between us. We reserve the right to change our appointment time with you for any reason and will notify you in advance of any change. If you have a complaint about our service, please call 0800 093 6112 or write to Customer Services, Carbon Doctor. If we damage your vehicle, we can arrange its repair at no cost to you. If without our prior written approval you organise a repair yourself, we do not guarantee to pay the costs you incur.</p>

          <h3>7. Liability limits</h3>
          <p>You acknowledge that the cost to us of cleaning your vehicle's motor in the event that we damage it is likely to exceed the amount we are paid for our service. Our total liability to you for any damage we cause is limited to the total cost of repairing that damage. We do not reimburse indirect or consequential losses (loss of income, loss of use, rental costs, loss of business or profits) except where required by law. Nothing limits our liability for fraud or death or personal injury caused by our negligence.</p>

          <h3>8. DPF cleaning</h3>
          <p>With respect to DPF cleaning, we are contracted to wash & flush the filter to the best of our ability. We carry OBD diagnostics for insight into your DPF's health only and are under no obligation to inform you of findings unless you request a pre-paid diagnostics check. We can only wash & flush a DPF on a running, healthy engine. If the engine is not able to run, we reserve the right to collect 50% of the agreed booking to cover travel, time and equipment transport. We reserve the right to stop the wash & flush if we find anything that could cause harm or damage.</p>

          <h3>9. Miscellaneous</h3>
          <p>The only language offered for any contract is English. We reserve the right to update our Terms of Business at any point. Date of issue: 1st August 2017.</p>

          <h3>Contact</h3>
          <p>Carbon Doctor Ltd<br>167-169 Great Portland Street, 5th Floor, London W1W 5PF<br>Tel: 0800 093 6112<br>Email: info@carbon.doctor</p>
        </div></section>`;
      return;
    }
  }
  const imageSrc = image.startsWith('http') || image.startsWith('assets/') ? image : `https://static.wixstatic.com/media/${image}/v1/fill/w_1600,h_900,al_c,q_85/${image}`;
  document.getElementById('app').innerHTML = `<section class="pageHero"><img class="heroImage" src="${imageSrc}" alt="Carbon Doctor workshop"><div class="pageHeroContent"><p class="eyebrow">CARBON DOCTOR · NORTHAMPTON</p><h1>${title}</h1><p class="copy">${body}</p><a class="ghost btn" href="#/services">Explore services</a></div></section><section class="section editorial"><div><p class="eyebrow">THE CARBON DOCTOR APPROACH</p><h2>${head}</h2><p class="copy">${body}</p></div><div><img src="${imageSrc}" alt="Carbon Doctor workshop"></div></section><section class="manifesto"><p>PRECISION, CLARITY, CARE</p><h2>Professional equipment. Clear advice. Customer-focused care.</h2><a class="textLink" href="#/book">Choose a service →</a></section>`;
}

// Booking flow (simplified single-page form)
function renderBooking(){
  // Read `service` query parameter from hash (e.g. #/book?service=slug)
  let serviceQuery = '';
  const hash = location.hash || '';
  const qi = hash.indexOf('?');
  if(qi !== -1){ serviceQuery = new URLSearchParams(hash.slice(qi+1)).get('service') || ''; }
  const stepsHtml = `
  <section class="booking">
    <header><p class="eyebrow">CARBON DOCTOR · SECURE BOOKING DEMO</p><h1>Book your service</h1><div class="progress"><span class="active"></span><span></span><span></span><span></span><span></span></div></header>
    <section>
      <div id="stepContainer"></div>
    </section>
  </section>`;
  document.getElementById('app').innerHTML = stepsHtml;
  const state = {step:1,service:serviceQuery||'',date:'',time:'',info:{name:'',phone:'',email:'',postcode:'',vehicle:''}};
  function renderStep(){
    const el = document.getElementById('stepContainer');
    if(state.step===1){
      el.innerHTML = '<h2>Select service</h2><div class="servicePicker">' + SERVICES.map(s=>`<button data-slug="${s.slug}" class="${s.slug===state.service?'active':''}"><div><b>${s.name}</b><small>${s.desc}</small></div><div><em>${s.price}</em><div>${s.duration}</div></div></button>`).join('') + `</div><nav><button id="nextBtn" class="btn" ${state.service ? '' : 'disabled'}>Continue</button></nav>`;
      el.querySelectorAll('.servicePicker button').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('.servicePicker button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.service=b.dataset.slug; el.querySelector('#nextBtn').disabled=false;}));
      el.querySelector('#nextBtn').addEventListener('click',()=>{ if(!state.service) return; state.step=2; renderStep(); });
    }
    if(state.step===2){
      el.innerHTML = `<h2>Date & time</h2><label>Date<input type="date" id="bkDate" min="${new Date().toISOString().slice(0,10)}"></label><div class="slots"><button data-time="10:00">10:00</button><button data-time="11:30">11:30</button><button data-time="14:00">14:00</button><button data-time="16:00">16:00</button></div><nav><button id="backBtn" class="btn">Back</button><button id="nextBtn" class="btn" disabled>Continue</button></nav>`;
      el.querySelectorAll('.slots button').forEach(b=>b.addEventListener('click',()=>{ el.querySelectorAll('.slots button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.time=b.dataset.time; checkNext(); }));
      el.querySelector('#bkDate').addEventListener('change',e=>{ state.date=e.target.value; checkNext(); });
      el.querySelector('#backBtn').addEventListener('click',()=>{ state.step=1; renderStep(); });
      function checkNext(){ el.querySelector('#nextBtn').disabled = !(state.date && state.time); }
      el.querySelector('#nextBtn').addEventListener('click',()=>{ state.step=3; renderStep(); });
    }
    if(state.step===3){
      el.innerHTML = `<h2>Your details</h2><form id="bkForm" class="formGrid"><label>Full name<input name="name" required></label><label>Phone<input name="phone" required></label><label>Email<input name="email" type="email" required></label><label>Postcode area<select name="postcode" required><option value="" selected disabled>Select your area</option><option>NN1 — Northampton Central</option><option>NN2 — Kingsthorpe</option><option>NN3 — East Northampton</option><option>NN4 — South Northampton</option><option>NN5 — West Northampton</option><option>NN6 — Northamptonshire</option><option>NN7 — Northamptonshire</option><option>NN8 — Wellingborough</option><option>Other UK postcode</option><option>Outside the UK</option></select></label><label>Vehicle model<input name="vehicle" placeholder="e.g. Volkswagen Golf"></label></form><nav><button id="backBtn" class="btn">Back</button><button id="nextBtn" class="btn">Continue</button></nav>`;
      el.querySelector('#backBtn').addEventListener('click',()=>{ state.step=2; renderStep(); });
      el.querySelector('#nextBtn').addEventListener('click',()=>{ const f = document.getElementById('bkForm'); if(!f.reportValidity()) return; const fm = new FormData(f); state.info.name=fm.get('name')||''; state.info.phone=fm.get('phone')||''; state.info.email=fm.get('email')||''; state.info.postcode=fm.get('postcode')||''; state.info.vehicle=fm.get('vehicle')||''; state.step=4; renderStep(); });
    }
    if(state.step===4){
      const svc = SERVICES.find(s=>s.slug===state.service);
      el.innerHTML = `<h2>Review</h2><div class="review"><dl><div><dt>Service</dt><dd>${svc.name}</dd></div><div><dt>Price</dt><dd>${svc.price}</dd></div><div><dt>Preferred slot</dt><dd>${state.date} ${state.time}</dd></div><div><dt>Vehicle</dt><dd>${state.info.vehicle}</dd></div><div><dt>Postcode area</dt><dd>${state.info.postcode}</dd></div><div><dt>Contact</dt><dd>${state.info.name} · ${state.info.phone} · ${state.info.email}</dd></div></dl><p>This demo does not take payment. Carbon Doctor would confirm the appointment directly.</p></div><nav><button id="backBtn" class="btn">Back</button><button id="confirmBtn" class="btn">Confirm</button></nav>`;
      el.querySelector('#backBtn').addEventListener('click',()=>{ state.step=3; renderStep(); });
      el.querySelector('#confirmBtn').addEventListener('click',()=>{ state.step=5; renderStep(); });
    }
    if(state.step===5){
      el.innerHTML = `<div class="success"><svg>✓</svg><h2>Thank you, ${state.info.name || 'Customer'}.</h2><p>This is a simulated demo confirmation. No live appointment has been made. For a real booking, call 0800 093 6112.</p><a class="btn" href="tel:08000936112">Call 0800 093 6112</a></div>`;
    }
    // update progress bar
    document.querySelectorAll('.progress span').forEach((sp,i)=>{ sp.classList.toggle('active', i<state.step); });
  }
  renderStep();
}

// Home hooks: slider, controls, pause on hover
function hookHome(){
  const slides = [
    {k:'ENGINE CARBON CLEANING',title:['Restore Your Engine.','Drive With Confidence.'],text:'Professional hydrogen carbon cleaning designed to help your engine breathe.',img:'381db8_d8833a337df34b31a2bba7ca78b0bada~mv2.png'},
    {k:'DPF CLEANING & RESTORATION',title:['Clear The Restriction.','Restore The Drive.'],text:'Specialist DPF wash and flush with ECU sensor resetting.',img:'381db8_23213a30caeb4a66adb8eeac2ef76395~mv2.jpeg'},
    {k:'VEHICLE DIAGNOSTICS',title:['Precision Insight.','Clear Direction.'],text:'Professional diagnostics for warning lights and drivability concerns.',img:'11062b_255f8a1173954b118306f66959c9dd07~mv2.jpeg'},
    {k:'COMMERCIAL & FLEET',title:['Keep Your Fleet','Moving.'],text:'DPF cleaning and preventative maintenance for working vehicles.',img:'381db8_6c9d3ed82dfc4d44a80f9305911f4822~mv2_d_3024_4032_s_4_2.jpg'}
  ];
  const root = document.querySelector('.hero');
  if(!root) return;
  const eyebrow = root.querySelector('.eyebrow');
  const h1 = root.querySelector('h1');
  const lead = root.querySelector('.lead');
  const bg = root.querySelector('.heroBg');
  const dots = root.querySelectorAll('.dot');
  let i = 0; let pause=false; let timer=null;
  function show(n){ i=(n+slides.length)%slides.length; eyebrow.textContent = 'PROFESSIONAL AUTOMOTIVE CARE · '+slides[i].k; h1.innerHTML = slides[i].title.map(s=>`<span>${s}</span>`).join(''); lead.textContent = slides[i].text + ' From Carbon Doctor in Northampton.'; bg.src = 'https://static.wixstatic.com/media/'+slides[i].img+'/v1/fill/w_1600,h_900,al_c,q_85/'+slides[i].img; dots.forEach(d=>d.classList.toggle('active', +d.dataset.i===i)); }
  function showWithAnimation(n){
    // update content, then trigger entrance animation
    show(n);
    root.classList.remove('animate');
    requestAnimationFrame(()=>{ root.classList.add('animate'); });
  }
  function start(){ timer = setInterval(()=>{ if(!pause) showWithAnimation(i+1); },5000); }
  function stop(){ clearInterval(timer); timer=null; }
  root.addEventListener('mouseenter',()=>pause=true);
  root.addEventListener('mouseleave',()=>pause=false);
  const prevBtn = root.querySelector('#heroPrev');
  const nextBtn = root.querySelector('#heroNext');
  if(prevBtn) prevBtn.addEventListener('click',()=>showWithAnimation(i-1));
  if(nextBtn) nextBtn.addEventListener('click',()=>showWithAnimation(i+1));
  dots.forEach(d=>d.addEventListener('click',()=>show(+d.dataset.i)));
  const ctaBtn = document.getElementById('servicesCtaBtn');
  ctaBtn?.addEventListener('click',()=>{
    const mega = document.getElementById('mega');
    if(mega) mega.removeAttribute('hidden');
  });
  showWithAnimation(0); start();
}

// Mega menu and mobile
const megaToggle = document.getElementById('servicesBtn');
const megaPanel = document.getElementById('mega');

megaToggle?.addEventListener('click',(event)=>{
  event.stopPropagation();
  const isHidden = megaPanel?.hasAttribute('hidden');
  setMegaMenu(Boolean(isHidden));
});

megaToggle?.addEventListener('mouseenter',()=>{
  if(window.innerWidth > 900){ setMegaMenu(true); }
});

megaPanel?.addEventListener('mouseleave',()=>{
  if(window.innerWidth > 900){ setMegaMenu(false); }
});

document.addEventListener('click',(event)=>{
  const inToggle = event.target.closest('#servicesBtn');
  const inMega = event.target.closest('#mega');
  if(!inToggle && !inMega){ setMegaMenu(false); }
});

document.addEventListener('keydown',(event)=>{
  if(event.key === 'Escape'){ setMegaMenu(false); }
});

document.getElementById('menuBtn')?.addEventListener('click',()=>{
  document.querySelector('.topLinks')?.classList.toggle('open');
  const mega = document.getElementById('mega');
  if(!mega) return;
  if(document.querySelector('.topLinks')?.classList.contains('open')){ mega.setAttribute('hidden',''); }
});

// Initialize
document.addEventListener('DOMContentLoaded',()=>router());
