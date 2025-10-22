// Animates the hero content (defers while nav is open)
document.addEventListener("DOMContentLoaded", () => {
  const elements = [{
      selector: ".bg-layers",
      delay: 0
    },
    {
      selector: ".topbar",
      delay: 100
    },
    {
      selector: ".hero__title",
      delay: 500
    },
    {
      selector: ".hero__subtitle",
      delay: 1000
    },
    {
      selector: ".hero__explore",
      delay: 1400
    },
    {
      selector: ".hero__arrow",
      delay: 1500
    },
  ];

  const revealWhenReady = (el) => {
    if (document.body.classList.contains('is-nav-open')) {
      setTimeout(() => revealWhenReady(el), 150);
      return;
    }
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  };

  elements.forEach(({
    selector,
    delay
  }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    setTimeout(() => revealWhenReady(el), delay);
  });
});


// Makes the avatar surprise appear upon clicking
document.addEventListener("DOMContentLoaded", () => {
  const avatarLink = document.querySelector(".topbar__avatar-link");
  const avatarWrap = avatarLink.querySelector(".topbar__avatar-wrap");

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