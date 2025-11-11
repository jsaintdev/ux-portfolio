function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

ready(() => {
  const items = [
    { selector: ".bg-layers",      delay: 0    },
    { selector: ".topbar",         delay: 100  },
    { selector: ".hero__title",    delay: 500  },
    { selector: ".hero__subtitle", delay: 1000 },
    { selector: ".hero__explore",  delay: 1400 },
    { selector: ".hero__arrow",    delay: 1500 },
    { selector: ".featured",       delay: 1800 },
  ];

  const revealWhenReady = (el) => {
    if (document.body.classList.contains("is-nav-open")) {
      setTimeout(() => revealWhenReady(el), 150);
      return;
    }
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  };

  // 1) Set starting state inline so they remain hidden until we reveal
  items.forEach(({ selector }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.willChange = "opacity, transform";
  });

  // 2) Queue reveals
  items.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    setTimeout(() => revealWhenReady(el), delay);
  });

  // 3) Now it’s safe to remove the CSS gate
  document.querySelector(".site-wrapper")?.classList.remove("animations-init");
});

// Avatar surprise
ready(() => {
  const avatarLink = document.querySelector(".topbar__avatar-link");
  if (!avatarLink) return;
  const avatarWrap = avatarLink.querySelector(".topbar__avatar-wrap");
  if (!avatarWrap) return;

  let touched = false;
  avatarLink.addEventListener("click", (e) => {
    if (window.innerWidth < 1024 && !touched) {
      e.preventDefault();
      avatarWrap.classList.add("hover");
      touched = true;
      setTimeout(() => {
        avatarWrap.classList.remove("hover");
        window.location.href = avatarLink.href;
      }, 800);
    }
  });
});
