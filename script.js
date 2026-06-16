'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR SCROLL ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── 2. MOBILE MENU ────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  };

  /* Both click AND touch for mobile */
  navToggle.addEventListener('click', toggleMenu);
  navToggle.addEventListener('touchend', toggleMenu, { passive: false });

  /* Close on any nav link click or touch */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
    link.addEventListener('touchend', () => closeMenu(), { passive: true });
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) closeMenu();
  });

  /* Close on outside touch */
  document.addEventListener('touchend', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) closeMenu();
  }, { passive: true });

  /* Close on resize above mobile */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMenu();
  }, { passive: true });

  /* ─── 3. ACTIVE NAV LINK ────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkList = document.querySelectorAll('.nav-link[data-section]');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinkList.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ─── 4. HERO TITLE ROTATOR ─────────────────────────────────── */
  const titleEl = document.getElementById('titleRotate');
  const TITLES  = [
    'ML Models',
    'Data Pipelines',
    'Predictive Apps',
    'Insight Reports',
    'Python Tools',
    'Smart Analytics',
  ];

  let titleIndex = 0;

  const rotateTitles = () => {
    titleEl.classList.add('fade-out');
    setTimeout(() => {
      titleIndex = (titleIndex + 1) % TITLES.length;
      titleEl.textContent = TITLES[titleIndex];
      titleEl.classList.remove('fade-out');
      titleEl.classList.add('fade-in');
      setTimeout(() => titleEl.classList.remove('fade-in'), 400);
    }, 350);
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(rotateTitles, 2800);
  }

  /* ─── 5. STAT COUNTERS ──────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target    = parseInt(el.dataset.target, 10);
    const steps     = 60;
    const increment = target / steps;
    let current = 0;
    let step    = 0;

    const tick = () => {
      step++;
      current = Math.min(Math.ceil(increment * step), target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ─── 6. SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── 7. BACK TO TOP ────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── 8. FOOTER YEAR ────────────────────────────────────────── */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ─── 9. SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 10. RESUME DOWNLOAD TRACKING ─────────────────────────── */
  document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', function () {
      console.info('[Portfolio] Resume download:', this.getAttribute('href'));
    });
  });

  /* ─── 11. EMAIL LINKS — real address ───────────────────────── */
  const REAL_EMAIL = 'rohanpagare2407@gmail.com';
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.href = `mailto:${REAL_EMAIL}`;
  });

  /* ─── 12. HERO SCROLL CUE HIDE ─────────────────────────────── */
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    const hideScrollCue = () => {
      if (window.scrollY > 100) {
        heroScroll.style.opacity       = '0';
        heroScroll.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideScrollCue);
      }
    };
    window.addEventListener('scroll', hideScrollCue, { passive: true });
  }

  /* ─── 13. ON LOAD — trigger visible reveals ─────────────────── */
  window.addEventListener('load', () => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      }
    });

    statNumbers.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        animateCounter(el);
        counterObserver.unobserve(el);
      }
    });
  });

  /* ─── 14. PROJECT CARD KEYBOARD ─────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const ghLink = card.querySelector('.btn-proj-github');
        if (ghLink) ghLink.click();
      }
    });
  });

});
