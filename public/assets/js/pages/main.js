import { ready, runIntro } from "./init.js";

// Detect hash link arrival
const fromWorkLink = window.location.hash === "#work";

// Build the intro sequence dynamically
const sequence = [
  { selector: ".bg-layers",      delay: fromWorkLink ? 0   : 0    },
  { selector: ".topbar",         delay: fromWorkLink ? 200 : 100  },
  { selector: ".hero__title",    delay: fromWorkLink ? 200 : 500  },
  { selector: ".hero__subtitle", delay: fromWorkLink ? 200 : 1000 },
  { selector: ".hero__explore",  delay: fromWorkLink ? 200 : 1400 },
  { selector: ".hero__arrow",    delay: fromWorkLink ? 200 : 1500 },
  { selector: ".featured",       delay: fromWorkLink ? 500 : 1800, type: "fade" },
];

runIntro(sequence);

// Avatar surprise (main page only)
ready(() => {
  const link = document.querySelector(".topbar__avatar-link");
  const wrap = link?.querySelector(".topbar__avatar-wrap");
  if (!link || !wrap) return;

  let touched = false;
  link.addEventListener("click", (e) => {
    if (window.innerWidth < 1024 && !touched) {
      e.preventDefault();
      wrap.classList.add("hover");
      touched = true;
      setTimeout(() => {
        wrap.classList.remove("hover");
        window.location.href = link.href;
      }, 800);
    }
  });
});

ready(() => {
  const cards = document.querySelectorAll(".featured__card");
  if (!cards.length) return;

  const reveal = (el) => {
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        reveal(en.target);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  cards.forEach((el) => io.observe(el));
});
