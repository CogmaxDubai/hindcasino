/* HindCasino — interactive behaviour */

(() => {
  'use strict';

  /* ---- FAQ accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(isOpen));
    };

    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---- TOC scroll-spy ---- */
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  const sectionMap = new Map();
  tocLinks.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) sectionMap.set(target, a);
  });

  if ('IntersectionObserver' in window && sectionMap.size > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sectionMap.forEach((_, section) => observer.observe(section));
  }

  /* ---- Smooth-scroll offset for sticky header ---- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---- Mobile CTA bar — hide while top quick-pick is on screen ---- */
  const mobileCta = document.querySelector('.mobile-cta');
  const quickPick = document.querySelector('.quick-pick');
  if (mobileCta && quickPick && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        mobileCta.style.transform = entry.isIntersecting ? 'translateY(120%)' : 'translateY(0)';
        mobileCta.style.transition = 'transform 0.3s ease';
      },
      { threshold: 0.1 }
    );
    ctaObserver.observe(quickPick);
  }

  /* ---- Mark current year in footer if used ---- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
