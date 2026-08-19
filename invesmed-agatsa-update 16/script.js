const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const ecosystemData = {
  'health-hubs': {
    number: '01',
    title: 'Invesmed Health Hubs',
    text: 'Integrated healthcare centres bringing diagnostics, telemedicine, AI healthcare, remote monitoring, and specialist access closer to communities.',
    tags: ['Diagnostics', 'Telemedicine', 'Specialist Access']
  },
  devices: {
    number: '02',
    title: 'Invesmed Medical Devices',
    text: 'Providing cutting-edge medical technologies to healthcare providers, businesses, governments, and consumers across Africa.',
    tags: ['Medical Technology', 'Distribution', 'Healthcare Providers']
  },
  rpm: {
    number: '03',
    title: 'Invesmed Remote Patient Monitoring',
    text: 'Continuous patient monitoring solutions that improve outcomes while reducing hospital admissions and healthcare costs.',
    tags: ['Live Monitoring', 'Hospital Care', 'Patient Outcomes']
  },
  tourism: {
    number: '04',
    title: 'Invesmed Medical Tourism',
    text: 'Connecting African patients to world-class, affordable treatment options through strategic international healthcare partnerships.',
    tags: ['International Care', 'Affordable Treatment', 'Patient Pathways']
  },
  advisory: {
    number: '05',
    title: 'Invesmed Advisory',
    text: 'Healthcare consulting, project development, healthcare infrastructure planning, and strategic healthcare investments.',
    tags: ['Consulting', 'Infrastructure', 'Investment']
  },
  academy: {
    number: '06',
    title: 'Invesmed Digital Health Academy',
    text: "Training Africa's future healthcare workforce through digital education, certification programmes, and AI-supported learning.",
    tags: ['Digital Learning', 'Certification', 'Workforce Development']
  }
};

function updateEcosystemPanel(button) {
  const data = ecosystemData[button.dataset.eco];
  if (!data) return;

  // Change the panel instantly on hover with no delayed swap animation.
  document.querySelectorAll('.eco-select').forEach((b) => b.classList.remove('active'));
  button.classList.add('active');

  document.getElementById('ecoNumber').textContent = data.number;
  document.getElementById('ecoTitle').textContent = data.title;
  document.getElementById('ecoText').textContent = data.text;
  document.getElementById('ecoTags').innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join('');
}

const ecoButtons = [...document.querySelectorAll('.eco-select')];

ecoButtons.forEach((button) => {
  const instant = () => updateEcosystemPanel(button);

  // Multiple instant events so the panel reacts immediately in every browser.
  button.addEventListener('mouseover', instant, { passive: true });
  button.addEventListener('mousemove', instant, { passive: true });
  button.addEventListener('pointerenter', instant, { passive: true });
  button.addEventListener('pointermove', instant, { passive: true });
  button.addEventListener('mouseenter', instant, { passive: true });
  button.addEventListener('focus', instant);
  button.addEventListener('click', instant);
});

// Extra safety: the whole ecosystem area watches the cursor and updates the panel
// the exact moment the cursor is over a square.
document.querySelectorAll('.ecosystem-orbit, .ecosystem-tech-map').forEach((area) => {
  area.addEventListener('mousemove', (event) => {
    const target = event.target.closest?.('.eco-select');
    if (target) updateEcosystemPanel(target);
  }, { passive: true });
});



// Mobile ecosystem dropdowns: on phones the info opens directly under the selected ecosystem tile.
const ecosystemMap = document.querySelector('.ecosystem-tech-map');
if (ecosystemMap && ecoButtons.length) {
  ecoButtons.forEach((button) => {
    const data = ecosystemData[button.dataset.eco];
    if (!data || button.nextElementSibling?.classList?.contains('eco-mobile-detail')) return;
    const detail = document.createElement('div');
    detail.className = 'eco-mobile-detail';
    detail.dataset.forEco = button.dataset.eco;
    detail.innerHTML = `<strong>${data.title}</strong><p>${data.text}</p><div class="mobile-tags">${data.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>`;
    button.insertAdjacentElement('afterend', detail);
  });

  const openMobileEcoDetail = (button) => {
    if (!window.matchMedia('(max-width: 640px)').matches) return;
    const key = button.dataset.eco;
    ecosystemMap.querySelectorAll('.eco-select').forEach((item) => item.classList.toggle('mobile-open', item === button));
    ecosystemMap.querySelectorAll('.eco-mobile-detail').forEach((detail) => {
      detail.classList.toggle('is-open', detail.dataset.forEco === key);
    });
  };

  ecoButtons.forEach((button) => {
    button.addEventListener('click', () => openMobileEcoDetail(button));
  });

  openMobileEcoDetail(ecoButtons.find((button) => button.classList.contains('active')) || ecoButtons[0]);
}

// Gold Africa map hover/select controls. The points are positioned as percentages
// on the actual gold map image, not the surrounding card, to keep them accurate.
const goldenMap = document.querySelector('.golden-africa-card');
if (goldenMap) {
  const mapControls = [...goldenMap.querySelectorAll('.map-region-controls button, .country-label')];
  const setGoldRegion = (region) => {
    goldenMap.dataset.activeRegion = region;
    goldenMap.querySelectorAll('.map-region-controls button, .country-label').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.region === region);
    });
  };
  setGoldRegion(goldenMap.dataset.activeRegion || 'west');
  mapControls.forEach((item) => {
    const activate = () => setGoldRegion(item.dataset.region);
    item.addEventListener('mouseenter', activate, { passive: true });
    item.addEventListener('mouseover', activate, { passive: true });
    item.addEventListener('pointerenter', activate, { passive: true });
    item.addEventListener('focus', activate);
    item.addEventListener('click', activate);
  });
}

// SVG Africa map: no pings, just labels that animate the already-highlighted areas.
const svgAfricaCard = document.querySelector('.svg-africa-card');
if (svgAfricaCard) {
  const clearSvgMapActive = () => {
    svgAfricaCard.querySelectorAll('.is-map-active').forEach((el) => el.classList.remove('is-map-active'));
  };
  const activateSvgHub = (hubList) => {
    clearSvgMapActive();
    String(hubList || '').split(/\s+/).filter(Boolean).forEach((hub) => {
      svgAfricaCard.querySelectorAll(`.${hub}`).forEach((el) => el.classList.add('is-map-active'));
      svgAfricaCard.querySelectorAll(`[data-hub~="${hub}"]`).forEach((el) => el.classList.add('is-map-active'));
    });
  };
  svgAfricaCard.querySelectorAll('.svg-country-label, .svg-map-name, .region-badge, .region-strip-card, .hub-country').forEach((el) => {
    const hub = el.dataset.hub || [...el.classList].find((c) => ['ghana','zambia','south-africa'].includes(c));
    if (!hub) return;
    el.addEventListener('mouseenter', () => activateSvgHub(hub), { passive: true });
    el.addEventListener('pointerenter', () => activateSvgHub(hub), { passive: true });
    el.addEventListener('focus', () => activateSvgHub(hub));
    el.addEventListener('click', () => activateSvgHub(hub));
  });
  svgAfricaCard.addEventListener('mouseleave', clearSvgMapActive, { passive: true });
}

// Compact RSS topic filtering for the final news layout
function activateNewsFilters(){
  const pills = [...document.querySelectorAll('[data-news-filter]')];
  const cards = [...document.querySelectorAll('[data-topic-card]')];
  if (!pills.length || !cards.length) return;
  pills.forEach((pill)=>{
    pill.addEventListener('click',()=>{
      const filter = pill.dataset.newsFilter;
      pills.forEach((p)=>p.classList.remove('active'));
      pill.classList.add('active');
      cards.forEach((card)=>{
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.topicCard !== filter);
      });
    });
  });
}
activateNewsFilters();


// Footer division anchors: activate ecosystem panel when linking directly to a division square.
function activateEcosystemFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target && target.classList && target.classList.contains('eco-select')) {
    updateEcosystemPanel(target);
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  }
}
window.addEventListener('hashchange', activateEcosystemFromHash);
window.addEventListener('load', activateEcosystemFromHash);

/* Final nav correction: fixed header offset + clean section start targets */
(function () {
  const sectionSelectors = {
    home: '#home',
    about: '#about .section-head',
    ecosystem: '#ecosystem .ecosystem-tech-head, #ecosystem .section-head, #ecosystem',
    solutions: '#solutions .section-head',
    partners: '#partners .section-head',
    investors: '#investors .investor-stats, #investors .investor-panel, #investors',
    news: '#news .news-shell-clean, #news .section-head, #news',
    'inves-stem': '#inves-stem',
    contact: '#contact .contact-card, #contact .section-head, #contact'
  };

  function headerOffset() {
    const header = document.querySelector('.site-header');
    return (header ? header.getBoundingClientRect().height : 96) + 16;
  }

  function firstMatch(selectorList) {
    return selectorList.split(',').map(s => document.querySelector(s.trim())).find(Boolean);
  }

  function scrollToHash(hash, updateHash = true) {
    if (!hash || hash === '#') return false;
    const id = hash.replace('#', '');
    const selector = sectionSelectors[id];
    let target = selector ? firstMatch(selector) : document.querySelector(hash);
    if (!target) return false;

    // If a footer division points to a specific ecosystem button later, keep the ecosystem panel active,
    // but still land the page at the top of the ecosystem section, not halfway down the graphic.
    if (target.classList && target.classList.contains('eco-select')) {
      if (typeof updateEcosystemPanel === 'function') updateEcosystemPanel(target);
      target = firstMatch(sectionSelectors.ecosystem);
    }

    const extraOffset = id === 'inves-stem' ? (window.innerWidth <= 820 ? 20 : 58) : 0;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - extraOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

    if (updateHash && history.pushState) history.pushState(null, '', hash);
    return true;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (scrollToHash(hash, true)) event.preventDefault();
    });
  });

  window.addEventListener('load', () => {
    if (window.location.hash) setTimeout(() => scrollToHash(window.location.hash, false), 120);
  });
})();

// Premium Invesmed orb cursor - instant tracking, no lag/trailing delay
(function(){
  const finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if(!finePointer) return;

  const orb = document.createElement('div');
  const ring = document.createElement('div');
  orb.className = 'cursor-orb';
  ring.className = 'cursor-orb-ring';
  document.body.appendChild(ring);
  document.body.appendChild(orb);
  document.body.classList.add('cursor-ready');

  function setCursorPosition(e){
    const left = e.clientX + 'px';
    const top = e.clientY + 'px';
    orb.style.left = left;
    orb.style.top = top;
    ring.style.left = left;
    ring.style.top = top;

    const overEcosystem = !!e.target.closest('#ecosystem');
    document.body.classList.toggle('cursor-over-ecosystem', overEcosystem);
  }

  document.addEventListener('mousemove', setCursorPosition, {passive:true});

  const hoverSelectors = 'a, button, input, select, textarea, .news-link, .rss-news-link, .headline-card, .partner-card, .solution-grid article, .about-card, .btn';
  document.addEventListener('mouseover', (e) => {
    if(e.target.closest(hoverSelectors)) document.body.classList.add('cursor-hover');
  }, {passive:true});
  document.addEventListener('mouseout', (e) => {
    if(e.target.closest(hoverSelectors)) document.body.classList.remove('cursor-hover');
  }, {passive:true});
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));
  document.addEventListener('mouseenter', () => document.body.classList.add('cursor-ready'));
})();


// Mobile navigation drawer
(function(){
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.site-header .nav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('mobile-nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('mobile-nav-open');
      toggle.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      document.body.classList.remove('mobile-nav-open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
})();

// Inves-STEM: gentle pointer parallax while preserving the approved settled layout.
(() => {
  const stage = document.querySelector('.stem-stage');
  if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0;
  const update = (x,y) => {
    stage.style.setProperty('--mx', x.toFixed(3));
    stage.style.setProperty('--my', y.toFixed(3));
  };
  stage.addEventListener('pointermove', (event) => {
    const r = stage.getBoundingClientRect();
    const x = ((event.clientX-r.left)/r.width-.5)*2;
    const y = ((event.clientY-r.top)/r.height-.5)*2;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => update(x,y));
  });
  stage.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => update(0,0));
  });
})();
