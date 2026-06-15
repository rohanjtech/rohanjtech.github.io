/*!
 * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * ROHAN PAGARE — Portfolio Script
 * Senior-grade: Navbar · Hero Rotator · Counter · Scroll Reveal
 *               Active Nav · Back-to-Top · Mobile Menu · Footer Year
 * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 */

'use strict';

/* ─────────────────────────────────────────────────────────────────────
   0.  WAIT FOR DOM
───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════════════════
     1.  NAVBAR — scroll glass effect
  ═══════════════════════════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const SCROLL_Y = 60;          // px before navbar gains .scrolled

  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_Y);
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();             // run once on load


  /* ═══════════════════════════════════════════════════════════════════
     2.  MOBILE MENU — hamburger toggle
  ═══════════════════════════════════════════════════════════════════ */
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
    document.body.style.overflow = 'hidden';   // prevent bg scroll
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  /* Close on nav-link click (smooth-scroll + close) */
  navLinks.querySelectorAll('.nav-link, .nav-resume-btn').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 640) closeMenu();
    });
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

  /* Re-close menu on resize above mobile breakpoint */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMenu();
  });


  /* ═══════════════════════════════════════════════════════════════════
     3.  ACTIVE NAV LINK — highlight current section while scrolling
  ═══════════════════════════════════════════════════════════════════ */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkList = document.querySelectorAll('.nav-link[data-section]');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120;   // offset for fixed navbar

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


  /* ═══════════════════════════════════════════════════════════════════
     4.  HERO TITLE ROTATOR
  ═══════════════════════════════════════════════════════════════════ */
  const titleEl = document.getElementById('titleRotate');

  const TITLES = [
    'ML Models',
    'AI Systems',
    'Data Pipelines',
    'Predictive Apps',
    'Python Tools',
    'Smart Insights',
  ];

  let titleIndex   = 0;
  let rotatorTimer = null;

  const rotateTitles = () => {
    titleEl.classList.add('fade-out');

    setTimeout(() => {
      titleIndex = (titleIndex + 1) % TITLES.length;
      titleEl.textContent = TITLES[titleIndex];
      titleEl.classList.remove('fade-out');
      titleEl.classList.add('fade-in');

      /* Remove fade-in class after transition ends so it can re-apply */
      setTimeout(() => titleEl.classList.remove('fade-in'), 400);
    }, 350);                  // matches CSS transition 0.35s
  };

  /* Start rotating after a brief initial pause */
  rotatorTimer = setInterval(rotateTitles, 2800);

  /* Respect reduced-motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearInterval(rotatorTimer);
  }


  /* ═══════════════════════════════════════════════════════════════════
     5.  HERO STAT COUNTERS — animate numbers up when in view
  ═══════════════════════════════════════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;           // ms
    const fps      = 60;
    const steps    = Math.floor(duration / (1000 / fps));
    const increment = target / steps;
    let current  = 0;
    let step     = 0;

    const tick = () => {
      step++;
      current = Math.min(Math.ceil(increment * step), target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  /* Use IntersectionObserver so counters only fire once */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNumbers.forEach(el => counterObserver.observe(el));


  /* ═══════════════════════════════════════════════════════════════════
     6.  SCROLL REVEAL — .reveal-up / .reveal-left / .reveal-right
  ═══════════════════════════════════════════════════════════════════ */
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
  }, {
    threshold : 0.1,
    rootMargin: '0px 0px -40px 0px',   // trigger a little before fully visible
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════════════════════════════
     7.  BACK-TO-TOP BUTTON
  ═══════════════════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ═══════════════════════════════════════════════════════════════════
     8.  FOOTER YEAR — auto-updates copyright
  ═══════════════════════════════════════════════════════════════════ */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();


  /* ═══════════════════════════════════════════════════════════════════
     9.  SMOOTH SCROLL — all internal anchor links
         (supplements CSS scroll-behavior: smooth for older browsers)
  ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════════════════════════
     10.  PORTFOLIO CONFIG LINKS — inject from window.PORTFOLIO_CONFIG
           (defined in <head> <script> block of index.html)
  ═══════════════════════════════════════════════════════════════════ */
  const CONFIG = window.PORTFOLIO_CONFIG || {};

  const linkMap = {
    '[data-cfg="github"]'   : CONFIG.github,
    '[data-cfg="linkedin"]' : CONFIG.linkedin,
    '[data-cfg="email"]'    : CONFIG.email,
    '[data-cfg="resume"]'   : CONFIG.resume,
  };

  Object.entries(linkMap).forEach(([selector, href]) => {
    if (!href) return;
    document.querySelectorAll(selector).forEach(el => {
      el.href = href;
    });
  });


  /* ═══════════════════════════════════════════════════════════════════
     11.  PROJECT CARD — keyboard accessibility (Enter = click GitHub)
  ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const ghLink = card.querySelector('.btn-proj-github');
        if (ghLink) ghLink.click();
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════════════
     12.  SKILL TAG — subtle hover ripple (pointer interaction polish)
  ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.transition = '';
    });
  });


  /* ═══════════════════════════════════════════════════════════════════
     13.  HERO SCROLL CUE — hide after user starts scrolling
  ═══════════════════════════════════════════════════════════════════ */
  const heroScroll = document.querySelector('.hero-scroll');

  if (heroScroll) {
    const hideScrollCue = () => {
      if (window.scrollY > 100) {
        heroScroll.style.opacity = '0';
        heroScroll.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideScrollCue);
      }
    };
    window.addEventListener('scroll', hideScrollCue, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════════════
     14.  PERFORMANCE — preload hero section fonts after load
  ═══════════════════════════════════════════════════════════════════ */
  window.addEventListener('load', () => {
    /* Ensure all reveal animations that are already in viewport
       on first load get triggered without needing to scroll */
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      }
    });

    /* Animate counters already visible on first load */
    statNumbers.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        animateCounter(el);
        counterObserver.unobserve(el);
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════════════
     15.  RESUME BUTTON — track download click (analytics-ready stub)
  ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('[download]').forEach(btn => {
    btn.addEventListener('click', () => {
      /* Replace with your analytics call if needed, e.g.:
         gtag('event', 'resume_download', { method: 'button' });
      */
      console.info('[Portfolio] Resume download triggered.');
    });
  });


}); // END DOMContentLoaded


/* ─────────────────────────────────────────────────────────────────────
   GLOBAL — handle resize for mobile menu safety (outside DOMContent)
───────────────────────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  /* Collapse any open mobile menu if viewport grows past breakpoint */
  const navLinks  = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  if (window.innerWidth > 640 && navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}, { passive: true });

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR SCROLL ─────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── 2. MOBILE MENU ───────────────────────────────────────────── */
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

  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 640) closeMenu();
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMenu();
  }, { passive: true });

  /* ─── 3. ACTIVE NAV LINK ───────────────────────────────────────── */
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

  /* ─── 4. HERO TITLE ROTATOR ────────────────────────────────────── */
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

  /* ─── 5. STAT COUNTERS ─────────────────────────────────────────── */
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

  /* ─── 6. SCROLL REVEAL ─────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── 7. BACK-TO-TOP ────────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── 8. FOOTER YEAR ────────────────────────────────────────────── */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ─── 9. SMOOTH SCROLL (anchor links) ──────────────────────────── */
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

  /* ─── 10. RESUME DOWNLOAD ───────────────────────────────────────── */
  /*
   *  Place your PDF at:  assets/Rohan_Pagare_Resume.pdf
   *  The `download` attribute on every <a> tag already handles the
   *  browser prompt.  This block adds a console log + optional
   *  analytics stub.
   */
  document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', function () {
      const file = this.getAttribute('href');
      console.info('[Portfolio] Resume download initiated:', file);
      /*  Analytics stub — replace with gtag / plausible if needed:
          gtag('event', 'resume_download', { file }); */
    });
  });

  /* ─── 11. EMAIL LINK — ensure real address everywhere ───────────── */
  const REAL_EMAIL = 'rohanpagare2407@gmail.com';
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.href = `mailto:${REAL_EMAIL}`;
  });

  /* ─── 12. HERO SCROLL CUE — hide after scrolling ───────────────── */
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    const hideScrollCue = () => {
      if (window.scrollY > 100) {
        heroScroll.style.opacity        = '0';
        heroScroll.style.pointerEvents  = 'none';
        window.removeEventListener('scroll', hideScrollCue);
      }
    };
    window.addEventListener('scroll', hideScrollCue, { passive: true });
  }

  /* ─── 13. ON LOAD — trigger in-viewport reveals immediately ─────── */
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

  /* ─── 14. PROJECT CARD KEYBOARD ─────────────────────────────────── */
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