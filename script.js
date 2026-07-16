(function(){
  const destinations = [
    {
      eyebrow: "Yeguada TERRANOVA",
      webUrl: "https://yeguadaterranova.com/",
      loc: "#",
      title: "Yeguada\nTERRANOVA",
      desc: "Diseño UI/UX · Desarrollo Frontend · Optimización SEO · Responsive Design.",
      img: "img/caballos.png"
    },
    {
      eyebrow: "Yan wagyu",
      webUrl: "https://yanwagyu.com/",
      loc: "#",
      title: "Yan\nwagyu",
      desc: "E-commerce premium desarrollado desde cero, con diseño elegante, navegación intuitiva,optimización SEO y experiencia responsive.",
      img: "img/carne.png"
    },
    {
      eyebrow: "Hogar Matias Romero",
      webUrl: "https://hogarmatiasromero.org.mx/",
      loc: "#",
      title: "hogar\nMatias Romero",
      desc: "Sitio institucional desarrollado para transmitir confianza, cercanía y facilitar el acceso a información, donativos y voluntariado.",
      img: "img/Hogar.png"
    },
    {
      eyebrow: "Eres mi mero MOLE",
      webUrl: "https://elsabordealquisiras.com/",
      loc: "",
      title: "El sabor de \nAlquisiras",
      desc: "Sitio web desarrollado para destacar la identidad de la marca, mejorar la experiencia del usuario y presentar sus productos de forma atractiva.",
      img: "img/mole.png"
    },
    {
      eyebrow: "Cappadocia · Turkey",
      webUrl: "https://www.example.com/sirince-valley",
      loc: "Cappadocia · Turkey",
      title: "Sirince\nValley",
      desc: "Paisajes lunares de chimeneas de hadas y globos aerostáticos al amanecer. Sirince conserva su encanto rural con viñedos centenarios y casas otomanas en la ladera.",
      img: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1600&auto=format&fit=crop"
    },
    {
      eyebrow: "Switzerland Alps",
      webUrl: "https://www.example.com/saint-antonien",
      loc: "Switzerland Alps",
      title: "Saint\nAntonien",
      desc: "Escondido en los Alpes suizos, un retiro idílico para quienes buscan un refugio apartado del mundo. Senderismo en verano, esquí de fondo en invierno.",
      img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1600&auto=format&fit=crop"
    }
  ];

  const bgPool = document.getElementById('bgPool');
  const deck = document.getElementById('deck');
  const panelText = document.getElementById('panelText');
  const eyebrowEl = document.getElementById('eyebrow');
  const titleEl = document.getElementById('title');
  const descEl = document.getElementById('desc');
  const counterNow = document.getElementById('counterNow');
  const counterTotal = document.getElementById('counterTotal');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const ctaBtn = document.getElementById('ctaBtn');

  let active = 0;
  let autoTimer = null;
  const AUTO_MS = 6000;
  const n = destinations.length;

  counterTotal.textContent = String(n).padStart(2,'0');

  // build bg layers
  const bgLayers = destinations.map((d,i) => {
    const div = document.createElement('div');
    div.className = 'bg-layer' + (i===0 ? ' active' : '');
    div.style.backgroundImage = `url('${d.img}')`;
    bgPool.appendChild(div);
    return div;
  });

  // build cards
  const cards = destinations.map((d,i) => {
    const c = document.createElement('div');
    c.className = 'card';
    c.style.backgroundImage = `url('${d.img}')`;
    c.tabIndex = 0;
    c.setAttribute('role','button');
    c.setAttribute('aria-label', d.title.replace('\n',' '));
    c.innerHTML = `<div class="card-shade"></div><div class="card-label"><div class="loc">${d.loc}</div><div class="name">${d.title.replace('\n','<br>')}</div></div>`;
    c.addEventListener('click', () => goTo(i, true));
    c.addEventListener('keydown', (e) => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); goTo(i, true);} });
    deck.appendChild(c);
    return c;
  });

  function layoutCards(){
    // visible offsets from active, circular, only show next N-1 to the left in a fan
    const visibleSlots = Math.min(n, 5);
    for(let i=0;i<n;i++){
      let offset = (i - active + n) % n; // 0 = active(front-right), increasing = further left/back
      const c = cards[i];
      if(offset >= visibleSlots){
        c.style.opacity = '0';
        c.style.pointerEvents = 'none';
        c.style.transform = `translateX(60px) translateZ(-300px) rotateY(-26deg) scale(0.7)`;
        c.style.zIndex = 0;
        c.classList.remove('active');
        continue;
      }
      c.style.pointerEvents = 'auto';
      const spacing = 96;
      const translateX = -offset * spacing;
      const translateZ = -offset * 60;
      const rotateY = offset === 0 ? 0 : -16;
      const scale = 1 - offset * 0.08;
      const opacity = 1 - offset * 0.16;
      c.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      c.style.opacity = String(Math.max(opacity, 0.25));
      c.style.zIndex = String(visibleSlots - offset);
      c.classList.toggle('active', offset === 0);
    }
  }

  function renderText(){
    const d = destinations[active];
    eyebrowEl.textContent = d.eyebrow;
    titleEl.innerHTML = d.title.replace('\n','<br>');
    descEl.textContent = d.desc;
    counterNow.textContent = String(active+1).padStart(2,'0');
    if (ctaBtn) {
      ctaBtn.href = d.webUrl || '#';
      ctaBtn.setAttribute('aria-label', `Abrir ${d.title.replace(/\n/g, ' ')} en una nueva pestaña`);
    }
  }

  function swapText(){
    panelText.classList.add('swapping');
    setTimeout(() => {
      renderText();
      panelText.classList.remove('swapping');
    }, 220);
  }

  function goTo(index, userTriggered){
    active = ((index % n) + n) % n;
    bgLayers.forEach((l,i) => l.classList.toggle('active', i===active));
    layoutCards();
    swapText();
    if(userTriggered) restartAuto();
  }

  function next(){ goTo(active+1); }
  function prev(){ goTo(active-1); }

  function restartAuto(){
    clearInterval(autoTimer);
    progressFill.classList.remove('animate');
    progressFill.style.width = '0%';
    void progressFill.offsetWidth; // reflow
    progressFill.classList.add('animate');
    progressFill.style.width = '100%';
    autoTimer = setInterval(next, AUTO_MS);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu(force){
    const isOpen = typeof force === 'boolean' ? force : !menuToggle.classList.contains('active');
    menuToggle.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  }

  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu(false);
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') toggleMenu(false);
  });

  prevBtn.addEventListener('click', () => { prev(); restartAuto(); });
  nextBtn.addEventListener('click', () => { next(); restartAuto(); });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight'){ next(); restartAuto(); }
    if(e.key === 'ArrowLeft'){ prev(); restartAuto(); }
  });

  // init
  renderText();
  layoutCards();
  restartAuto();
})();
