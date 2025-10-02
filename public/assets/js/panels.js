// panels.js
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

      card.addEventListener('click', e => {
        // allow selecting text inside card without navigating
        const sel = window.getSelection();
        if (sel && String(sel).length) return;
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

  // 2) Hover grayscale → color (toggle a class on the panel so sibling image reacts)
  function wireHoverColor() {
    document.querySelectorAll('.panel').forEach(panel => {
      const card = panel.querySelector('.project-card');
      if (!card) return;
      card.addEventListener('mouseenter', () => panel.classList.add('is-card-hover'));
      card.addEventListener('mouseleave', () => panel.classList.remove('is-card-hover'));
      card.addEventListener('focusin',   () => panel.classList.add('is-card-hover'));
      card.addEventListener('focusout',  () => panel.classList.remove('is-card-hover'));
    });
  }

  // 3) Glide cards into place when they enter viewport (reset when out)
  function observeInView() {
    if (prefersReduced) return; // respect user setting

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const panel = entry.target;
        if (entry.isIntersecting) {
          panel.classList.add('is-in');
        } else {
          panel.classList.remove('is-in'); // reset so it replays when re-entering
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.panel').forEach(p => io.observe(p));
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhanceCards();
    wireHoverColor();
    observeInView();
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const wave = document.querySelector(".wave");
  if (!wave) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wave.classList.add("animate");
          wave.addEventListener("animationend", () => {
            wave.classList.remove("animate"); // reset so it can play again
          }, { once: true });
        }
      });
    },
    { threshold: 0.6 } // trigger when 60% of the element is visible
  );

  observer.observe(wave);
});
