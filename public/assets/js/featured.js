// featured.js
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Make entire project card clickable (and keyboard-accessible)
  function enhanceCards() {
    document.querySelectorAll('.project-card').forEach(card => {
      const link = card.querySelector('.project-card__link');
      if (!link) return;

      // Make card act like the link
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.dataset.href = link.getAttribute('href');

      const go = () => window.location.assign(card.dataset.href);

      const isInteractive = (el) => {
        const tag = el.tagName.toLowerCase();
        return (
          tag === 'a' ||
          tag === 'button' ||
          tag === 'input' ||
          tag === 'select' ||
          tag === 'textarea' ||
          el.closest('[data-no-nav]')
        );
      };

      card.addEventListener('click', e => {
        // allow selecting text or clicking nested interactive elements without navigating
        const sel = window.getSelection();
        if ((sel && String(sel).length) || isInteractive(e.target)) return;
        go();
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    });
  }

  // 2) Glide cards into place when they enter viewport (reset when out)
  function observeInView() {
    if (prefersReduced) return; // respect user setting

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const featured = entry.target;
        if (entry.isIntersecting) {
          featured.classList.add('is-in');
        } else {
          featured.classList.remove('is-in'); // reset so it replays when re-entering
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.featured').forEach(p => io.observe(p));
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhanceCards();
    observeInView();
  });
})();
