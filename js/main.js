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

  /* ---- Auto-label .quick-pick / .facts-table cells for the mobile
     card layout. CSS uses `content: attr(data-label)` on small screens,
     so each <td> needs a data-label matching its column header.
     This avoids editing every toplist + comparison HTML file. */
  document.querySelectorAll('.quick-pick table, table.facts-table').forEach((table) => {
    const headers = Array.from(table.querySelectorAll('thead th')).map((th) =>
      (th.textContent || '').trim()
    );
    if (!headers.length) return;
    table.querySelectorAll('tbody tr').forEach((row) => {
      Array.from(row.children).forEach((cell, i) => {
        if (cell.tagName !== 'TD') return;
        if (cell.hasAttribute('data-label')) return; // respect explicit ones
        const label = headers[i];
        if (label) cell.setAttribute('data-label', label);
      });
    });
  });

  /* ---- Mobile nav: inject hamburger toggle ----
     We do not touch the HTML on 65 pages — instead, on small screens we
     add a button into .header-inner that toggles .is-open on .main-nav.
     CSS handles the rest (display + animation + accessibility cues). */
  const headerInner = document.querySelector('.site-header .header-inner');
  const mainNav = document.querySelector('.site-header .main-nav');
  if (headerInner && mainNav && !headerInner.querySelector('.nav-toggle')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'primary-nav');
    btn.innerHTML = '<span class="bars" aria-hidden="true"><span></span></span>';
    // Give the nav an id so aria-controls is valid
    if (!mainNav.id) mainNav.id = 'primary-nav';
    // Insert after the logo, before the nav
    headerInner.insertBefore(btn, mainNav);

    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      mainNav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => {
      setOpen(mainNav.classList.contains('is-open') === false);
    });
    // Close on link click (so SPA-style nav feels natural)
    mainNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) setOpen(false);
    });
    // Reset state if the viewport grows past mobile
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }
})();
