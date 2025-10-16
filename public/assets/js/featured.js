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

  // 2) Hover grayscale → color (toggle a class on featured so sibling image reacts)
  function wireHoverColor() {
    document.querySelectorAll('.featured').forEach(featured => {
      const card = featured.querySelector('.project-card');
      if (!card) return;
      card.addEventListener('mouseenter', () => featured.classList.add('is-card-hover'));
      card.addEventListener('mouseleave', () => featured.classList.remove('is-card-hover'));
      card.addEventListener('focusin',   () => featured.classList.add('is-card-hover'));
      card.addEventListener('focusout',  () => featured.classList.remove('is-card-hover'));
    });
  }

  // 3) Glide cards into place when they enter viewport (reset when out)
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
    wireHoverColor();
    observeInView();
    colorizeCreativeOnScroll();  
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

    // 4) Mobile portrait: desaturate off-screen, saturate as image center nears viewport center (creative featured only)
  function colorizeCreativeOnScroll() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isPortrait || prefersReduced) return;

    const imgs = Array.from(document.querySelectorAll('.featured--play .featured__img'));
    if (!imgs.length) return;

    let ticking = false;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const update = () => {
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;

      // How far from center should we start/stop the effect?
      // Using 60% of viewport as the falloff radius feels natural.
      const radius = vh * 0.6;

      imgs.forEach(img => {
        const r = img.getBoundingClientRect();
        const imgCenter = r.top + r.height / 2;
        const dist = Math.abs(imgCenter - viewportCenter);

        // Map distance → progress (1 at center, 0 when beyond radius)
        const progress = clamp(1 - dist / radius, 0, 1);

        // Write to CSS variable (drives grayscale filter)
        img.style.setProperty('--sat-progress', progress.toFixed(3));
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Initialize & wire
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

});
