// Shared page helpers: ready() + runIntro()
export function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

export function runIntro(sequence) {
  ready(() => {
    const revealWhenReady = (el, type) => {
      if (document.body.classList.contains("is-nav-open")) {
        setTimeout(() => revealWhenReady(el, type), 150);
        return;
      }

      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = "1";
      if (type !== "fade") el.style.transform = "translateY(0)";
    };

    // 1) Start hidden
    sequence.forEach(({ selector, type }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.style.opacity = "0";
      el.style.willChange = "opacity, transform";
      if (type !== "fade") el.style.transform = "translateY(12px)";
    });

    // 2) Reveal in order
    sequence.forEach(({ selector, delay, type }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      setTimeout(() => revealWhenReady(el, type), delay);
    });

    // 3) Release CSS gate
    document.querySelector(".site-wrapper")?.classList.remove("animations-init");
  });
}
