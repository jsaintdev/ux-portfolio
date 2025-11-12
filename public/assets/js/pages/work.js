import { ready, runIntro } from "./init.js";

ready(() => {
  runIntro([
    { selector: ".bg-layers",          delay: 0 },
    { selector: ".topbar",             delay: 100 },
    { selector: ".project__hero",      delay: 750, type: "fade" },
    { selector: ".image__wrapper",      delay: 1500, type: "fade" },
    { selector: ".image__content",      delay: 1500, type: "fade" }
  ]);
});
