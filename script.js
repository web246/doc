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
  const html = `
    <section class="pageHero resultsHero">
      <img class="heroImage" src="assets/difference.jpeg" alt="Results hero">
      <div class="pageHeroContent">
        <p class="eyebrow">ENGINE CARE RESULTS</p>
        <h1>Common issues. Clear answers.</h1>
        <p class="copy">A practical guide to what carbon build-up can affect, what it can and cannot solve, and why maintenance matters.</p>
      </div>
    </section>

    <section class="section resultsPage resultsTextPage">
      <header class="resultsIntro">
        <div>
          <p class="eyebrow">RESULTS &amp; EXPLANATION</p>
          <h2>Why carbon cleaning matters</h2>
          <p class="copy">Carbon build-up can have a real effect on engine health, emissions, sensors and emissions-related components. This is the practical overview our customers use to understand the risks and the limits of carbon-cleaning work.</p>
        </div>
        <aside>
          <b>01 — 06</b>
          <span>Key engine issues explained</span>
          <small>Clear, honest guidance on what carbon cleaning can help with.</small>
        </aside>
      </header>

      <article class="resultsArticle">
        <section class="resultBlock revealCard" style="animation-delay:0ms">
          <div class="resultNumber">01</div>
          <div class="resultContent">
            <h3>Mechanical problems</h3>
            <p>There is a huge misconception that Carbon Cleaning is a Repair Service, that it fixes cars engine running problems. Wrong it does not do that, but what it does do is clear out Carbon Deposits that can create engine running problems. Where there is carbon build up, there are problems. Remove the Carbon and you have half a chance of aiding the engine&apos;s health.</p>
          </div>
        </section>

        <section class="resultBlock revealCard" style="animation-delay:120ms">
          <div class="resultNumber">02</div>
          <div class="resultContent">
            <h3>Electrical problems</h3>
            <p>Electrical problems can be created by Carbon getting onto sensitive sensors around the engine. It has been known that a Carbon Clean “can” aid cleaning the sensors around the engine and in the exhaust. Please note there is no guarantee with this.</p>
          </div>
        </section>

        <section class="resultBlock revealCard" style="animation-delay:240ms">
          <div class="resultNumber">03</div>
          <div class="resultContent">
            <h3>EGR valves repairs</h3>
            <p>We are going to be upfront about this myth. Can Carbon Cleaning Unblock or Unclog an EGR Valve? The simple answer is “MAYBE” as we do a Carbon clean. The extra hot exhaust gases get recycled through the EGR Valve and “can” get to work on the Carbon Crud that has built up in there over the life of the engine. The only way to head off EGR Valve issues is simply to have your car/van or lorry Carbon Cleaned every 10,000 miles or every 12 months before your annual oil service.</p>
          </div>
        </section>

        <section class="resultBlock revealCard" style="animation-delay:360ms">
          <div class="resultNumber">04</div>
          <div class="resultContent">
            <h3>DPF Filters</h3>
            <p>DPF filters do get blocked.</p>
            <p>We offer a Wash &amp; Flush Service from £249 and can offer a Warranty for an Extra £50 that lasts for 30 days or 1000 miles on the work (there must be no other faults with the engine and the service must be up to date).</p>
            <p>DPF systems can be forced regenerated by us, but this is if they have not exceeded their regenerated limit. If we can regenerate the DPF filter for you then we simply will at an additional cost of just £125. All Mechanical failures and Fire risks are accepted by the vehicle owner.</p>
            <p>But the question that is hardly ever asked is “WHY” is it getting blocked?</p>

            <ol class="resultsList">
              <li><strong>Short journeys &amp; low-speed driving (most common)</strong>
                <p>DPFs need high exhaust temperatures to clean themselves (called regeneration). All of these mean the exhaust never gets hot enough, so soot just accumulates.</p>
                <ul>
                  <li>Lots of short trips</li>
                  <li>Town driving</li>
                  <li>Stop–start traffic</li>
                  <li>Engine not fully warming up</li>
                </ul>
              </li>
              <li><strong>Failed or interrupted regeneration</strong>
                <p>There are two main types:</p>
                <ul>
                  <li>Passive regeneration – happens naturally at motorway speeds</li>
                  <li>Active regeneration – the car injects extra fuel to raise exhaust temps</li>
                </ul>
                <p>If you keep switching the engine off during an active regen (often without knowing), it fails repeatedly and the DPF loads up.</p>
              </li>
              <li><strong>Driving style</strong>
                <ul>
                  <li>Constant low revs</li>
                  <li>Staying in high gears at low speeds</li>
                  <li>“Eco driving” taken too far</li>
                </ul>
                <p>This keeps exhaust temperatures too low for proper regeneration.</p>
              </li>
              <li><strong>Faults elsewhere in the engine</strong>
                <p>DPFs often block because of another problem, such as:</p>
                <ul>
                  <li>Faulty EGR valve</li>
                  <li>Failed glow plugs (very common)</li>
                  <li>Boost leaks</li>
                  <li>Faulty temperature or pressure sensors</li>
                  <li>Injectors over-fuelling</li>
                </ul>
                <p>These cause excess soot or prevent regeneration from starting.</p>
              </li>
              <li><strong>Wrong oil or poor servicing</strong>
                <ul>
                  <li>Using non-low-ash oil (must be DPF-safe)</li>
                  <li>Missed oil changes</li>
                </ul>
                <p>Ash can’t be burned off like soot, so it permanently fills the DPF.</p>
              </li>
              <li><strong>Urban use of modern diesels</strong>
                <p>Modern diesel engines don’t suit city-only driving. Many DPF issues are simply because the vehicle is being used in a way it wasn’t designed for.</p>
              </li>
            </ol>

            <div class="resultWarning">
              <h4>Warning signs of a blocking DPF</h4>
              <ul>
                <li>DPF warning light</li>
                <li>Loss of power (limp mode)</li>
                <li>Rising fuel consumption</li>
                <li>Cooling fans running after shutdown</li>
                <li>Frequent regeneration attempts</li>
              </ul>
            </div>

            <div class="resultWarning">
              <h4>How to reduce the risk</h4>
              <ul>
                <li>Do a 20–30 min motorway run weekly (2,000+ RPM)</li>
                <li>Don’t ignore warning lights</li>
                <li>Use correct engine oil</li>
                <li>Fix small engine faults early</li>
                <li>Avoid constant short trips if possible</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="resultBlock revealCard" style="animation-delay:480ms">
          <div class="resultNumber">05</div>
          <div class="resultContent">
            <h3>VNT Turbos</h3>
            <p>Since the late 1990s many diesel cars have been fitted with a turbocharger using a Variable Geometry Turbine or Variable Nozzle Turbine. These turbochargers are very effective in minimising the effects of turbo lag, resulting in a more responsive throttle especially at low engine speed and much improved torque.</p>
            <p>These systems work by changing the speed and direction of the exhaust gases onto the turbine wheel. The most common of these systems is Garrett&apos;s VNT ® mechanism which incorporates a ring of small movable vanes around the turbine wheel. These vanes are sometimes referred to as the speed control mechanism. At low engine speed, the vanes are in the “closed” position narrowing the gap between them which effectively accelerates the exhaust gas onto the turbine wheel. At high engine speed the vanes open up slowing the exhaust gases, which prevents the turbocharger over-boosting. In most cases this level of control negates the need for a conventional wastegate.</p>
            <p>Despite these benefits, such turbochargers can be prone to problems. The vane mechanism is easily affected by carbon build-up, which, if it becomes excessive, can cause the mechanism to jam. This can occur quite quickly if the vehicle is used predominantly for short journeys where the engine is not allowed to get up to full operating temperature. The mechanism may jam in either the fully open or fully closed position resulting in no boost or too much boost from the turbo. If the turbo over-boosts there is a real danger that it&apos;s internal components will be damaged, resulting in the need for a complete replacement unit. In many cases, the computer controlling the engine will sense a fault and will severely limit the engine&apos;s performance in what is called a “limp-home” mode to prevent any further damage. Low boost may also cause black smoke under acceleration. The problem may clear itself by cycling the ignition switch, but it is extremely likely that the problem will recur.</p>
            <p>Previously, the only solution was to buy a brand new replacement turbocharger, because the VNT mechanisms could only be cleaned at the factory. However, Carbon Doctor have the correct equipment to reduce the Carbon without removing the Turbo Unit itself.</p>
          </div>
        </section>

        <section class="resultBlock revealCard" style="animation-delay:600ms">
          <div class="resultNumber">06</div>
          <div class="resultContent">
            <h3>Emissions repairs</h3>
            <p>The Carbon clean significantly reduces dangerous emissions and “can” also help to achieve emission MOT test levels.</p>
          </div>
        </section>
      </article>
    </section>`;

  document.getElementById('app').innerHTML = html;
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
  if(path==='/commercial-fleet'){ title='Keep your fleet moving.'; image='assets/hero1.avif'; head='Built around working vehicles'; body='Clogged DPFs can reduce performance and increase maintenance costs.' }
  if(path==='/privacy' || path==='/terms'){
    if(path==='/privacy'){
      document.getElementById('app').innerHTML = `
        <section class="section"><div>
          <p class="eyebrow">PRIVACY POLICY</p>
          <h1>Carbon Doctor Ltd — Privacy Policy</h1>
          <p>At Carbon Doctor, we are committed to protecting your personal information. This privacy policy explains how we collect, use, store and protect information when you contact us, arrange a service, make an enquiry or visit our website.</p>

          <h2>1. Information we collect</h2>
          <p>We may collect personal information including your name, address, email address, telephone number, vehicle registration number, mileage, booking date, vehicle details and any information you provide in a message or enquiry. We may also collect information about how you use our website, including browser type, IP address, pages visited and cookies.</p>

          <h2>2. How we use your information</h2>
          <p>We use your information to arrange and provide vehicle carbon cleaning and DPF services, respond to enquiries, confirm appointments, contact you about your service, manage payments, provide customer support, improve our website and services and comply with legal obligations.</p>

          <h2>3. Sharing your information</h2>
          <p>We may share your information with trusted third parties where necessary to provide our service, such as payment processors, scheduling providers, service partners, insurers, legal advisers or regulatory authorities. We will not sell your personal data to third parties for marketing purposes.</p>

          <h2>4. Cookies</h2>
          <p>Our website uses cookies and similar technologies to improve functionality, remember your preferences, understand usage patterns and support security. You can manage cookie settings through your browser. If you choose to disable cookies, some parts of the website may not function properly.</p>

          <h2>5. Data retention</h2>
          <p>We keep personal information only for as long as necessary to provide the service, fulfil legal obligations, resolve disputes and maintain records. Where appropriate, we will securely delete or anonymise data when it is no longer needed.</p>

          <h2>6. Your rights</h2>
          <p>You have the right to request access to the personal data we hold about you, ask us to correct inaccuracies, request deletion of your personal data, object to certain processing and withdraw consent where applicable. If you wish to limit our use of your personal information, please write to Data Protection c/o Carbon Doctor at the address shown below.</p>

          <h2>7. Security</h2>
          <p>We take reasonable steps to protect personal data from loss, misuse, unauthorised access and disclosure. However, no data transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>

          <h2>8. Fraud prevention</h2>
          <p>At Carbon Doctor, we are committed to reducing fraud made using credit cards. We reserve the right not to accept payment by debit or credit card where we suspect that doing so may perpetrate a fraud against us or the registered card holder.</p>

          <h2>9. International transfers</h2>
          <p>Where necessary, your information may be transferred outside the UK or EEA. In those cases, we will put appropriate safeguards in place to protect your personal data in accordance with applicable law.</p>

          <h2>10. Contact</h2>
          <p>If you have any questions, requests or concerns about this Privacy Policy, please contact us at:<br>Carbon Doctor Ltd<br>167-169 Great Portland Street, 5th Floor, London W1W 5PF<br>Tel: 0800 093 6112<br>Email: info@carbon.doctor</p>
        </div></section>`;
      return;
    }

    // Render full Terms of Business page
    document.getElementById('app').innerHTML = `
      <section class="section"><div>
        <p class="eyebrow">TERMS OF BUSINESS</p>
        <h1>Carbon Doctor Ltd — Terms of Business</h1>
        <p>Innovative carbon clean solution reduces emissions, improves performance and enhances driveability – in just 30 minutes.</p>
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

        <h2>Terms of Business for vehicle carbon clean services</h2>

        <h3>Our contract with you</h3>
        <p>I have read and understood Carbon Doctor Terms of Business as expressed in this contract and agree to my vehicle, registration number below to have its engine cleaned using the engine carbon clean service.</p>
        <p>Customer Name<br>Vehicle Registration Number<br>Customer Address<br>Vehicle Mileage<br>Appointment Date<br>Customer Telephone<br>Customer Email<br>Signed by Vehicle Owner (or representative)<br>Date</p>

        <p>When using the motor carbon clean service, you are dealing with Carbon Doctor Ltd. In these terms references to “we” or “our” means Carbon Doctor. By asking Carbon Doctor to carry out a motor carbon clean on your vehicle you agree that our work shall be governed by the following terms and conditions. Our contract with you is formed at the time of you making your appointment with us online, over the phone or in person. Most but not all of the terms set out below are reproduced on the sales document that you (or your representative) can be asked to sign when we attend your vehicle. By handing over your Vehicle and Key to Our Technician you are agreeing to all of our Terms of Business.</p>

        <h3>1. Motor carbon clean process</h3>
        <p>In the course of the motor carbon clean process, a controlled volume of hydrogen is introduced into the engine through your vehicle's air intake. Your vehicle may suffer an engine fault through no fault of our technician or motor carbon clean service. You acknowledge that risk. If that happens, we will ask if you would like us to restart your vehicle's engine. If your vehicle will not restart you will be liable for any costs incurred in having the vehicle recovered and repaired subject to clause 6 & 8 below.</p>

        <h3>2. Manufacturer warranty</h3>
        <p>Please be aware that having your motor cleaned using the carbon clean process may result in your vehicle manufacturer's warranty being invalidated. You acknowledge that risk. If you have any questions regarding your manufacturer's warranty please contact your manufacturer. Carbon Doctor holds certificates of no harm from a number of motor manufacturers. For information please call 0800 093 6112 or write to Customer Services c/o Carbon Doctor at the address shown at the bottom of this page or email us using the following link: info@carbon.doctor.</p>

        <h3>3. Payments up front and in part</h3>
        <p>You agree to be responsible for the full cost of our motor carbon/DPF clean work on your vehicle. In making arrangements to deliver our service to you, we incur business costs. You agree that we can immediately charge 50% (i) for or in any respect of these arrangements or costs and/or (ii) an up front part payment in respect of our service.</p>

        <h3>4. Performance expectations</h3>
        <p>The improvement to emissions and/or additional motor power and/or fuel economy and/or future engine component reliability that you can expect to enjoy once your vehicle has been cleaned using the engine carbon clean service depends upon each individual motor, the motor's mileage and hours used, the fuel and lubricants used and the style of driving that the engine has experienced prior to the engine carbon clean taking place. Carbon Doctor can make no guarantee with regards to these benefits or the amounts of carbon that can be safely removed in the 30 minute procedure.</p>

        <h3>5. Damage and inspections</h3>
        <p>A diagrammatic record of visible damage existing on your vehicle will be made by our technician before starting work on your vehicle. We exclude all liability for repair of damage, whether visible or not, existing before we began to work on your vehicle.</p>

        <h3>6. Service delivery and complaints</h3>
        <p>We will perform our service to the best of our ability at a time and location to be agreed between us. We reserve the right to change our appointment time with you for any reason. We will notify you in advance of any change to the agreed appointment time. If you have a complaint about our service, please call 0800 093 6112 or write to Customer Services c/o Carbon Doctor at the address shown in clause 16(a) or email us using the following link: info@carbon.doctor. If we damage your vehicle, we can arrange its repair at no cost to you. If without our prior written approval you organise a repair yourself, we do not guarantee to pay the costs you incur.</p>

        <h3>7. Key limitations to our work</h3>
        <p>We have the right to refuse or stop service where a vehicle is not suitable for treatment. We may stop the service if we identify conditions that could cause harm to the engine or DPF. Not all DPFs can be washed and flushed. We do not expect to clean the DPF to 100%, but will remove as much as possible at the service.</p>

        <h3>8. Liability and exclusions</h3>
        <p>You acknowledge that the cost to us of cleaning your vehicle's motor in the event that we damage it is likely to exceed the amount we are paid for our service. You agree that our total liability to you both for any service failure or vehicle damage is limited to: the total cost of repairing any damage we cause to your vehicle; plus, for any period where your own car will be unavailable to you, the cost to us of providing you with, or paying for, alternative means of transport or a replacement vehicle. Except as stated above, you agree that unless we have written to you to confirm otherwise before we begin work, you and Carbon Doctor do not intend that Carbon Doctor reimburse or compensate you for loss of income, loss of use of your vehicle, costs or expenses incurred from loss of use of your vehicle, cost of any rental cars or taxi services, loss of business or profits or pure economic loss or indirect or consequential loss suffered by you as a result of our work. Nothing shall limit our liability for fraud or death or personal injury caused by our negligence. Your statutory rights are not affected. You will be provided with our full insurance details for claims that we have caused damage to your car/engine/motor and you are willing to have your car/engine/motor fully inspected and a third-party independent report is produced to resolve any such claims.</p>

        <h3>9. Trade and company accounts</h3>
        <p>Where payment for our work on your vehicle will be made using a trade or company account, our trade/company terms will apply to our work in priority to the terms written above.</p>

        <h3>10. Privacy and cookies</h3>
        <p>You agree that our privacy policy and policy on cookies as it or they appear from time to time on our website shall govern the handling of your personal information that we receive from you. If you wish to limit our right to use your personal information, please write to Data Protection c/o Carbon Doctor at the address shown below.</p>

        <h3>11. Payment and fraud prevention</h3>
        <p>At Carbon Doctor, we are committed to reducing fraud made using credit cards. We reserve our right not to accept payment from you by debit or credit card where we suspect that by doing so a fraud may be perpetrated against us or the registered card holder.</p>

        <h3>12. Governing law</h3>
        <p>Our terms of business and any dispute or claim arising out of or in connection with them or their subject matter (including non-contractual disputes or claims of any kind arising directly or indirectly) shall be governed by and construed in accordance with the laws of England and Wales. The courts of England will have exclusive jurisdiction over any claim arising from, or related to, our goods and services although we retain the right to bring proceedings against you for breach of these conditions in your country of residence or any other relevant country.</p>

        <h3>13. Consumer rights information</h3>
        <p>Any booking that you make with us by phone or online will be subject to The Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (SI 2013/3134) (as amended from time to time). We are pleased to provide you with the following information in accordance with those regulations:</p>
        <p>Carbon Doctor Ltd<br>167-169 Great Portland Street, 5th Floor, London W1W 5PF<br>0800 093 6112<br>You can contact us using the following link: info@carbon.doctor</p>
        <p>When we accept your booking we will provide you with a quote for our work. In doing so we make assumptions as to the extent of cleaning your engine will require. If those assumptions prove to be incorrect, our costs of service and therefore our price will change to take account of our additional work. For example, we may have to extend the time of the motor carbon clean service. We reserve our right to adjust our price and we charge you according to the goods and services we supply to you in the course of providing our service to you.</p>
        <p>We make no additional charge for delivery of the equipment that we will use in the course of providing our service. We accept payment over the telephone using most major debit or credit cards other than Diner's Club and American Express. We do not accept personal cheques. We accept payments made through PayPal, bank transfer, credit & debit card via chip & pin and in cash.</p>
        <p>We will provide our service to you by appointment at a location agreed between us. Our contract with you is for the supply of vehicle motor carbon clean services. Normally, under the Regulations, if you are a consumer, you will have a right to cancel our contract for 14 working days counting from the day after our contract with you was formed. When we are given the keys to your vehicle, we shall understand that to be your express consent to begin our work on your vehicle. Usually, that means we will have begun our work before the end of the usual cancellation period. Your cancellation rights under the Regulations will end when that work starts.</p>
        <p>You may cancel your appointment and receive a full refund of any monies that you have paid to us at any time before we commence work on your vehicle. To cancel our service, please call us, contact us via our website or tell our technician before he starts work on your vehicle. We do not require you to complete any special form to cancel your appointment. We recommend that the easiest way to cancel your appointment is to call us on 0800 093 6112. Please note that you may not cancel your appointment after we have commenced our work on your vehicle and we reserve all rights to recover payment for our service in circumstances where you attempt to cancel your appointment or require us to cease work on your vehicle after our work has commenced.</p>
        <p>The validity of any price we offer you for our services is limited to the duration of the call during which the offer was made. Accordingly, we may refuse to honour a price offered to you where you do not agree to purchase the relevant service during the continuation of the call in which the offer was first communicated to you. Where we have taken any payment from you in the course of you making an appointment with us, we shall hold that payment to your order until the moment we begin our work on your vehicle. With effect from commencement of our work on your vehicle, we reserve our right to retain for our account any payment you have made to us.</p>

        <h3>14. DPF-specific terms</h3>
        <p>In respect to DPF cleaning, we are only contracted to wash & flush to the best of our ability your filter only. We do carry OBD diagnostics for our insight into your DPF's health only. We are under no obligation to inform you of any said information that we find unless you ask for it via a pre-paid diagnostics check up booking. We may at our discretion inform you of any said findings on the day at the appointment only.</p>
        <p>We can only wash & flush a DPF on a running healthy engine. If the engine is not able to run, then we reserve the right to collect 50% of the agreed booking of the job costs, for travel, time and equipment transportation to the said location of intended service.</p>
        <p>We reserve the right to stop the wash and flush clean at any point during the service if we find anything that can cause your DPF or engine any harm or damage during the clean or in the future use of the DPF or engine.</p>
        <p>Not all DPFs can be washed and flushed. We do not expect to clean the DPF to 100% but will get out as much as possible at the service.</p>
        <p>Forced regenerations are not a service that we carry out, but if the client requests that we do, then any damage or fire caused by the forced regeneration will not be accepted by Carbon Doctor Ltd but solely by the registered keeper or owner of the said vehicle.</p>

        <p>The only language offered by us for any contract is English. We have the right to update our Terms of Business at any point.</p>
        <p>Date of issue: 1st August 2017.</p>
      </div></section>`;
    return;
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
    {k:'ENGINE CARBON CLEANING',title:['Restore Your Engine.','Drive With Confidence.'],text:'Professional hydrogen carbon cleaning designed to help your engine breathe.',img:'assets/hero1.avif',focus:'58% 42%'},
    {k:'DPF CLEANING & RESTORATION',title:['Clear The Restriction.','Restore The Drive.'],text:'Specialist DPF wash and flush with ECU sensor resetting.',img:'assets/hero2.avif',focus:'center center'},
    {k:'VEHICLE DIAGNOSTICS',title:['Precision Insight.','Clear Direction.'],text:'Professional diagnostics for warning lights and drivability concerns.',img:'assets/hero3.avif',focus:'center center'},
    {k:'COMMERCIAL & FLEET',title:['Keep Your Fleet','Moving.'],text:'DPF cleaning and preventative maintenance for working vehicles.',img:'assets/hero4.avif',focus:'center center'}
  ];
  const root = document.querySelector('.hero');
  if(!root) return;
  const eyebrow = root.querySelector('.eyebrow');
  const h1 = root.querySelector('h1');
  const lead = root.querySelector('.lead');
  const bg = root.querySelector('.heroBg');
  const dots = root.querySelectorAll('.dot');
  let i = 0; let pause=false; let timer=null;
  function show(n){
    i=(n+slides.length)%slides.length;
    eyebrow.textContent = 'PROFESSIONAL AUTOMOTIVE CARE · '+slides[i].k;
    h1.innerHTML = slides[i].title.map(s=>`<span>${s}</span>`).join('');
    lead.textContent = slides[i].text + ' From Carbon Doctor in Northampton.';
    const src = slides[i].img.startsWith('http') || slides[i].img.startsWith('assets/') ? slides[i].img : 'https://static.wixstatic.com/media/'+slides[i].img+'/v1/fill/w_1600,h_900,al_c,q_85/'+slides[i].img;
    bg.src = src;
    bg.style.objectPosition = slides[i].focus || '65% center';
    dots.forEach(d=>d.classList.toggle('active', +d.dataset.i===i));
  }
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
