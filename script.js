/* ============================================================
   GREENSY PAISAGISMO — Ultra Premium JavaScript
   GSAP + ScrollTrigger + Lenis + Custom Cursor
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

// ─── LENIS SMOOTH SCROLL ────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Smooth anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80, duration: 1.6 });
  });
});


// ─── LOADER ─────────────────────────────────────────────────
(function() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  const pct    = document.getElementById('loader-pct');
  let count = 0;

  const iv = setInterval(() => {
    count += Math.random() * 18;
    if (count >= 100) { count = 100; clearInterval(iv); }
    if (fill) fill.style.width = count + '%';
    if (pct)  pct.textContent  = Math.floor(count) + '%';
  }, 80);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (fill) fill.style.width = '100%';
      if (pct)  pct.textContent  = '100%';

      setTimeout(() => {
        if (loader) loader.classList.add('exit');
        document.body.classList.remove('is-loading');

        setTimeout(() => {
          if (loader) loader.style.display = 'none';
        }, 1200);

        initHeroAnim();
      }, 400);
    }, 800);
  });
})();





// ─── HEADER ─────────────────────────────────────────────────
(function() {
  const header = document.getElementById('header');
  if (!header) return;

  // Dark sections that should make header dark
  const darkSections = ['#ceo','#projects','#services'];
  darkSections.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 80px', end: 'bottom 80px',
      onEnter: ()  => header.classList.add('dark-mode'),
      onLeave: ()  => header.classList.remove('dark-mode'),
      onEnterBack: ()  => header.classList.add('dark-mode'),
      onLeaveBack: ()  => header.classList.remove('dark-mode'),
    });
  });

  // Hide/show on scroll direction
  let last = 0;
  lenis.on('scroll', ({ scroll }) => {
    if (scroll < 80) { header.classList.remove('hidden'); return; }
    header.classList.toggle('hidden', scroll > last);
    last = scroll;
  });

  // Burger
  const burger  = document.getElementById('burger');
  const mobMenu = document.getElementById('mob-menu');
  if (burger && mobMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('.mob-link, .btn-wpp').forEach(l => {
      l.addEventListener('click', () => {
        burger.classList.remove('open');
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();


// ─── HERO ANIMATION ─────────────────────────────────────────
function initHeroAnim() {
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('ready');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Live Badge Expand Sequence
  const badge = document.getElementById('hero-badge');
  if(badge) {
    tl.fromTo(badge, { y: 20, opacity: 0 }, { opacity: 1, y: 0, duration: 1 }, 0.4);
    tl.add(() => badge.classList.add('expanded'), 1.2);
    tl.add(() => badge.classList.remove('expanded'), 5.0);
  }

  // Lines stagger
  tl.to('.hero__heading .reveal-line span', {
    y: 0, opacity: 1, duration: 1.4,
    stagger: 0.15, ease: 'power4.out'
  }, 0.6);

  // Desc + Actions
  tl.fromTo('#hero-desc', { y: 20, opacity: 0 }, { opacity: 1, y: 0, duration: 1 }, 1.2);
  tl.fromTo('#hero-ctas', { y: 20, opacity: 0 }, { opacity: 1, y: 0, duration: 1 }, 1.4);

  // Stats bar
  tl.fromTo('#hero-stats', { y: 30, opacity: 0 }, { opacity: 1, y: 0, duration: 1 }, 1.6);

  // Trigger popup smoothly after hero animations settle
  setTimeout(() => {
    if (window.showPremiumPopup) window.showPremiumPopup();
  }, 1800);
}


// ─── SCROLL REVEAL ──────────────────────────────────────────
(function() {
  const items = document.querySelectorAll('.reveal-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal-up'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('in'), idx * 90);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => obs.observe(el));
})();


// ─── PARALLAX (skip se usuário prefere less motion) ────────
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  gsap.to('#about-pill', {
    y: -80,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
  });
  gsap.to('#about-float', {
    y: -50,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 2 }
  });
  gsap.to('.about__arch img', {
    y: -60,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
  gsap.to('#bigcta-bg', {
    yPercent: -15,
    scrollTrigger: { trigger: '.bigcta', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  // services parallax on bento card images
  gsap.utils.toArray('.svc-card__media img').forEach(img => {
    gsap.to(img, {
      yPercent: 10,
      scrollTrigger: { trigger: img.closest('.svc-card'), start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  });
}


// ─── PORTFOLIO PANEL PARALLAX ────────────────────────────────
(function() {
  const dummyCheck = document.getElementById('horiz-track');
  if (dummyCheck) return; // old section still exists, skip

})();

// Subtle parallax on portfolio cinematic image
gsap.to('.pf-cinematic img', {
  yPercent: 12,
  ease: 'none',
  scrollTrigger: { trigger: '.pf-cinematic', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
});


// ─── MOSAIC HOVER ENHANCE ────────────────────────────────────
(function() {
  document.querySelectorAll('.pf-mosaic__item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('img'), { scale: 1.08, duration: 0.8, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('img'), { scale: 1, duration: 0.8, ease: 'power2.out' });
    });
  });
})();


// ─── CEO IMAGE PARALLAX ─────────────────────────────────────
gsap.from('#ceo-img', {
  y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '#ceo', start: 'top 80%', once: true }
});
gsap.from('#ceo-quote', {
  x: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3,
  scrollTrigger: { trigger: '#ceo', start: 'top 75%', once: true }
});


// ─── MAGNETIC BUTTONS ────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
  });
});


// ─── WHATSAPP FLOAT VISIBILITY ───────────────────────────────
(function() {
  const btn = document.getElementById('wpp-float');
  const footer = document.querySelector('.footer');
  if (!btn || !footer) return;
  new IntersectionObserver(([e]) => {
    btn.style.opacity       = e.isIntersecting ? '0' : '1';
    btn.style.pointerEvents = e.isIntersecting ? 'none' : 'all';
  }, { threshold: 0.1 }).observe(footer);
})();


// ─── LOGO → TOP ──────────────────────────────────────────────
document.getElementById('logo-home')?.addEventListener('click', e => {
  e.preventDefault();
  lenis.scrollTo(0, { duration: 1.8 });
});


// ─── PORTFOLIO CAROUSEL ──────────────────────────────────────
(function() {
  const container = document.getElementById('port-carousel');
  const prevBtn = document.getElementById('c-prev');
  const nextBtn = document.getElementById('c-next');
  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 320 + 24; // pcar-item width + gap

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
})();

console.log('%c🌿 Greensy Paisagismo — Ultra Premium', 'font-size:13px;color:#B8965A;font-weight:500');

// ─── POPUP MODAL ─────────────────────────────────────────────
(function() {
  const overlay = document.getElementById('popup-overlay');
  const closeBtn = document.getElementById('popup-close');
  const link = document.getElementById('popup-link');
  
  if (!overlay || !closeBtn || !link) return;

  function closePopup() {
    overlay.classList.remove('active');
  }

  window.showPremiumPopup = function() {
    overlay.classList.add('active');
  };

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });

  link.addEventListener('click', () => {
    closePopup();
  });
})();
