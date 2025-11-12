import { ready, runIntro } from "./init.js";

ready(() => {
  runIntro([
    { selector: ".bg-layers",          delay: 0 },
    { selector: ".topbar",             delay: 100 },
    { selector: ".featured",      delay: 750, type: "fade" }
  ]);
});
