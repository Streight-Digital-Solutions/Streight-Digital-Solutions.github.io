(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Loader
  --------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('is-hidden'), 700);
  });

  /* ---------------------------------------------------------
     Header scroll state + mobile nav
  --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
  }));

  /* ---------------------------------------------------------
     Scroll reveals
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .process-step, .work-card, .about-copy, .about-panel, .contact-panel, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------------------------------------------------------
     Stat counters
  --------------------------------------------------------- */
  const statEls = document.querySelectorAll('.stat-num');
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statIO.observe(el));

  /* ---------------------------------------------------------
     Ticker pause on hover
  --------------------------------------------------------- */
  const tickerTrack = document.querySelector('.ticker-track');
  const ticker = document.querySelector('.ticker');
  if (ticker && tickerTrack) {
    ticker.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
  }

  /* ---------------------------------------------------------
     Contact form (static-site friendly stub)
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Message received. We\u2019ll be in touch shortly.';
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     HERO CANVAS — converging speed-lines forming an arrow,
     with ambient drift and cursor parallax.
  --------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let streaks = [];
  let mouseX = 0.5, mouseY = 0.5;
  let targetMouseX = 0.5, targetMouseY = 0.5;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStreaks();
  }

  function initStreaks() {
    const count = Math.round((w * h) / 26000);
    streaks = new Array(Math.max(18, Math.min(count, 70))).fill(0).map(() => makeStreak(true));
  }

  function makeStreak(randomStart) {
    // Streaks travel diagonally, echoing the logo's forward-slanted speed lines.
    const fromLeft = Math.random() > 0.5;
    const y = Math.random() * h;
    const len = 60 + Math.random() * 160;
    const speed = 1.6 + Math.random() * 3.2;
    const x = randomStart
      ? Math.random() * w
      : (fromLeft ? -len : w + len);
    const hueMix = Math.random();
    return {
      x, y, len, speed,
      dir: fromLeft ? 1 : -1,
      slope: -0.18, // slight upward slant, matching logo chevrons
      color: hueMix > 0.66 ? '79,224,255' : (hueMix > 0.33 ? '47,125,255' : '14,66,201'),
      alpha: 0.15 + Math.random() * 0.4,
      width: 0.6 + Math.random() * 1.4
    };
  }

  function drawArrowGlow(time) {
    // Central emblem echo: a soft pulsing chevron/arrow, matching the logo's core shape.
    const cx = w / 2 + (mouseX - 0.5) * 18;
    const cy = h / 2 + (mouseY - 0.5) * 14;
    const pulse = 0.5 + Math.sin(time / 900) * 0.5;
    const size = Math.min(w, h) * 0.16;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.4);
    grad.addColorStop(0, `rgba(79,224,255,${0.10 + pulse * 0.05})`);
    grad.addColorStop(1, 'rgba(79,224,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(79,224,255,${0.35 + pulse * 0.25})`;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'square';
    ctx.shadowColor = 'rgba(79,224,255,0.8)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(-size * 0.55, -size * 0.6);
    ctx.lineTo(size * 0.15, 0);
    ctx.lineTo(-size * 0.55, size * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  function frame(time) {
    ctx.clearRect(0, 0, w, h);

    // ease mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    ctx.globalCompositeOperation = 'lighter';
    streaks.forEach(s => {
      s.x += s.dir * s.speed;
      s.y += s.slope * (s.speed / 3);

      const parallax = (mouseX - 0.5) * 14;
      const drawX = s.x + parallax;

      const grad = ctx.createLinearGradient(
        drawX, s.y, drawX - s.dir * s.len, s.y - s.slope * s.len
      );
      grad.addColorStop(0, `rgba(${s.color},${s.alpha})`);
      grad.addColorStop(1, `rgba(${s.color},0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(drawX, s.y);
      ctx.lineTo(drawX - s.dir * s.len, s.y - s.slope * s.len);
      ctx.stroke();

      if (s.dir > 0 && s.x - parallax > w + s.len) Object.assign(s, makeStreak(false));
      if (s.dir < 0 && s.x - parallax < -s.len) Object.assign(s, makeStreak(false));
    });

    drawArrowGlow(time);

    if (!prefersReduced) requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
  }, { passive: true });

  resize();
  if (prefersReduced) {
    // Draw a single static frame for reduced-motion users.
    frame(0);
  } else {
    requestAnimationFrame(frame);
  }
})();
