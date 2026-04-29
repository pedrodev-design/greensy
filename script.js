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


// ─── CUSTOM CURSOR ──────────────────────────────────────────
(function() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animate() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animate);
  })();

  // Enlarge on hoverable elements
  document.querySelectorAll('a, button, .magnetic, .proj-card, .bento-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) { ring.style.width = '70px'; ring.style.height = '70px'; ring.style.borderColor = 'rgba(184,150,90,.8)'; }
    });
    el.addEventListener('mouseleave', () => {
      if (ring) { ring.style.width = '40px'; ring.style.height = '40px'; ring.style.borderColor = 'rgba(184,150,90,.5)'; }
    });
  });
})();


// ─── HEADER ─────────────────────────────────────────────────
(function() {
  const header = document.getElementById('header');
  if (!header) return;

  // Dark sections that should make header dark
  const darkSections = ['#services','#ceo','#projects'];
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
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Video container reveal from bottom clip
  tl.fromTo('#hero-media',
    { clipPath: 'inset(100% 4% 0% 4% round 48px)' },
    { clipPath: 'inset(0% 1.5% 0% 1.5% round 28px)', duration: 1.6, ease: 'expo.out' }
  , 0);

  // Eyebrow
  tl.to('#hero-eye', { opacity: 1, y: 0, duration: 1 }, 0.4);

  // Lines stagger
  tl.to('.hero__heading .reveal-line span', {
    y: 0, opacity: 1, duration: 1.2,
    stagger: 0.12, ease: 'power4.out'
  }, 0.6);

  // CTAs
  tl.to('#hero-ctas', { opacity: 1, duration: 0.9 }, 1.2);

  // Stats
  tl.to('#hero-stats', { opacity: 1, duration: 0.9 }, 1.4);

  // Scroll hint
  tl.to('#scroll-hint', { opacity: 1, duration: 0.6 }, 1.7);
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


// ─── PARALLAX ───────────────────────────────────────────────
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


// ─── HORIZONTAL SCROLL ──────────────────────────────────────
(function() {
  const track    = document.getElementById('horiz-track');
  const pinEl    = document.getElementById('horiz-pin');
  const progressBar = document.getElementById('horiz-progress');
  if (!track || !pinEl) return;

  const panels   = gsap.utils.toArray('.hpanel');
  const totalW   = () => track.scrollWidth - window.innerWidth;

  let st;

  function setup() {
    if (st) { st.kill(); }

    st = gsap.to(track, {
      x: () => -totalW(),
      ease: 'none',
      scrollTrigger: {
        trigger: pinEl,
        pin: true,
        scrub: 0.6,          // lower = snappier/faster feel
        start: 'top top',
        end: () => '+=' + totalW() * 1.4,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
        }
      }
    });

    // Image parallax inside cards
    panels.forEach(panel => {
      const media = panel.querySelector('img, video');
      if (!media || panel.classList.contains('hpanel--intro')) return;
      gsap.fromTo(media,
        { x: -50 },
        {
          x: 50, ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: st,
            start: 'left right',
            end: 'right left',
            scrub: true,
          }
        }
      );
    });
  }

  setup();
  window.addEventListener('resize', () => { ScrollTrigger.refresh(); setup(); });
})();


// ─── BEFORE & AFTER ─────────────────────────────────────────
(function() {
  const wrap   = document.getElementById('ba-wrap');
  const before = document.getElementById('ba-before');
  const handle = document.getElementById('ba-handle');
  if (!wrap || !before || !handle) return;

  let dragging = false;

  function move(x) {
    const r = wrap.getBoundingClientRect();
    let p = Math.max(5, Math.min(95, ((x - r.left) / r.width) * 100));
    before.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    handle.style.left     = p + '%';
  }

  handle.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
  wrap.addEventListener('mousedown',    e => { dragging = true; move(e.clientX); });
  document.addEventListener('mousemove',e => { if (dragging) move(e.clientX); });
  document.addEventListener('mouseup',  () => dragging = false);
  wrap.addEventListener('touchstart',   e => { dragging = true; move(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchmove',e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend', () => dragging = false);

  // Animate in
  let pct = 5;
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    (function go() {
      if (pct < 50) { pct += 2; move(wrap.getBoundingClientRect().left + wrap.offsetWidth * (pct / 100)); requestAnimationFrame(go); }
    })();
  }, { threshold: 0.4 }).observe(wrap);
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

console.log('%c🌿 Greensy Paisagismo — Ultra Premium', 'font-size:13px;color:#B8965A;font-weight:500');
