import { initBackground } from "./init.js";

const layerConfigs = [
  // Forest base hues for continuity
  { id: "patternCanvas-green",   colorVar: "--pattern-green",         minR:120, maxR:160, divisor:220000, alpha:"26" },
  { id: "patternCanvas-brown",   colorVar: "--pattern-brown",         minR:120, maxR:160, divisor:300000, alpha:"26" },

  // Sky and horizon tones (sunrise/sunset)
  { id: "patternCanvas-yellow",  colorVar: "--pattern-yellow",        minR: 90, maxR:130, divisor:280000, alpha:"33" },
  { id: "patternCanvas-orange",  colorVar: "--pattern-bright-orange", minR:140, maxR:180, divisor:260000, alpha:"26" },

  // Daylight transition hues (cooler, mid-day sky)
  { id: "patternCanvas-mint1",   colorVar: "--pattern-mint-1",        minR: 80, maxR:160, divisor:240000, alpha:"1A" },
  { id: "patternCanvas-blue",    colorVar: "--pattern-blue",          minR:100, maxR:200, divisor:200000, alpha:"26" },
  { id: "patternCanvas-seaglass",colorVar: "--pattern-seaglass-1",    minR: 80, maxR:180, divisor:180000, alpha:"1A" },
];

initBackground(layerConfigs, { cacheNs: "bg-about" });
