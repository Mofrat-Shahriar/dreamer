/* ================================================================
   DREAMER PHOTOGRAPHY — script.js
   Photographer: Mofrat Shahriar Shazal
   ================================================================ */

/* ── THEME ──────────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('dp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcons(saved);
})();

function updateToggleIcons(theme) {
  document.querySelectorAll('.theme-toggle, .m-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dp-theme', next);
  updateToggleIcons(next);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.theme-toggle, .m-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
});

/* ── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ── CURSOR ─────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function animate() {
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    rx+=(mx-rx)*0.13; ry+=(my-ry)*0.13;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animate);
  })();
  document.querySelectorAll('a,button,[data-cursor-expand]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });
})();

/* ── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath==='' && href==='index.html')) link.classList.add('active');
  });

  // Mobile menu
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ── HERO SLIDESHOW ─────────────────────────────────────── */
(function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current=0, timer;
  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx+slides.length)%slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }
  function startTimer() { timer=setInterval(()=>goTo(current+1),5000); }
  goTo(0); startTimer();
  dots.forEach((dot,i) => dot.addEventListener('click', () => { clearInterval(timer); goTo(i); startTimer(); }));
})();

/* ── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (!targets.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold:0.11, rootMargin:'0px 0px -44px 0px' });
  targets.forEach(t => obs.observe(t));
})();

/* ── COUNTERS ───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el=entry.target, end=parseInt(el.dataset.count), dur=1800, start=performance.now();
        const tick = now => {
          const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3);
          el.textContent=Math.round(ease*end)+(el.dataset.suffix||'');
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold:0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── GALLERY FILTER ─────────────────────────────────────── */
(function initGallery() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.photo-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach((card,i) => {
        const match = cat==='all' || card.dataset.category===cat;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation='none';
          void card.offsetWidth;
          card.style.animation=`fade-in 0.4s ${i*0.035}s ease both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── READ MORE ──────────────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.read-more-btn');
  if (!btn) return;
  const full = btn.closest('.photo-card').querySelector('.photo-card-full');
  if (!full) return;
  const isOpen = full.classList.contains('expanded');
  full.classList.toggle('expanded', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.childNodes[0].textContent = isOpen ? 'Read More' : 'Show Less';
});

/* ── LIGHTBOX ───────────────────────────────────────────── */
(function initLightbox() {
  const lb=document.getElementById('lightbox');
  const lbImg=document.getElementById('lightbox-img');
  const lbCapt=document.getElementById('lightbox-caption');
  const lbClose=document.getElementById('lightbox-close');
  if (!lb) return;
  document.addEventListener('click', e => {
    const card = e.target.closest('.photo-card-img');
    if (!card) return;
    const img = card.querySelector('img');
    if (!img) return;
    const title = card.closest('.photo-card').querySelector('.photo-card-title');
    lbImg.src=img.src; lbImg.alt=img.alt||'';
    if (lbCapt&&title) lbCapt.textContent=title.textContent;
    lb.classList.add('open'); document.body.style.overflow='hidden';
  });
  function close() { lb.classList.remove('open'); document.body.style.overflow=''; setTimeout(()=>{lbImg.src=''},500); }
  if(lbClose) lbClose.addEventListener('click',close);
  lb.addEventListener('click', e => { if(e.target===lb) close(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') close(); });
})();

/* ── BACK TO TOP ────────────────────────────────────────── */
(function() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY>400), {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
})();

/* ── PARTICLES ──────────────────────────────────────────── */
document.querySelectorAll('.particles').forEach(container => {
  for (let i=0;i<16;i++) {
    const p=document.createElement('div');
    p.className='particle';
    p.style.cssText=`left:${Math.random()*100}%;--dur:${5+Math.random()*8}s;--delay:${Math.random()*6}s;width:${Math.random()<.5?1:2}px;height:${Math.random()<.5?1:2}px`;
    container.appendChild(p);
  }
});

/* ── CONTACT FORM ───────────────────────────────────────── */
(function() {
  const form=document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const success=document.getElementById('form-success');
    form.style.display='none';
    if(success) success.classList.add('show');
  });
})();

/* ── PARALLAX ───────────────────────────────────────────── */
(function() {
  const sections=document.querySelectorAll('.parallax-section');
  if(!sections.length||window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  window.addEventListener('scroll', () => {
    sections.forEach(s => {
      const rect=s.getBoundingClientRect();
      const offset=(rect.top+rect.height/2)/window.innerHeight;
      const bg=s.querySelector('.parallax-bg');
      if(bg) bg.style.transform=`translateY(${(offset-.5)*55}px)`;
    });
  }, {passive:true});
})();

/* ── PAGE TRANSITIONS ───────────────────────────────────── */
(function() {
  const overlay=document.querySelector('.page-transition-overlay');
  if(!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('slide-in');
      setTimeout(()=>{ window.location.href=href; },540);
    });
  });
  window.addEventListener('pageshow', ()=>overlay.classList.remove('slide-in'));
})();

/* ── TYPED TEXT ─────────────────────────────────────────── */
(function() {
  const el=document.getElementById('typed-text');
  if(!el) return;
  const phrases=['Capturing Moments in Time','Telling Stories Through Light','Finding Beauty in the Ordinary','Dreaming Through the Lens'];
  let pIdx=0,cIdx=0,deleting=false;
  function tick() {
    const phrase=phrases[pIdx];
    if(!deleting) {
      el.textContent=phrase.slice(0,++cIdx);
      if(cIdx===phrase.length){deleting=true;setTimeout(tick,2400);return;}
    } else {
      el.textContent=phrase.slice(0,--cIdx);
      if(cIdx===0){deleting=false;pIdx=(pIdx+1)%phrases.length;}
    }
    setTimeout(tick,deleting?34:58);
  }
  setTimeout(tick,2600);
})();
