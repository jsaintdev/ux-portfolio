import { initBackground } from "./init.js";

const layerConfigs = [
  { id: "patternCanvas-dark",   colorVar: "--pattern-dark-green",   minR:120, maxR:160, divisor:200000, alpha:"33" },
  { id: "patternCanvas-brown",  colorVar: "--pattern-brown",        minR:120, maxR:160, divisor:300000, alpha:"26" },
  { id: "patternCanvas-yellow", colorVar: "--pattern-yellow",       minR: 80, maxR:100, divisor:300000, alpha:"33" },
  { id: "patternCanvas-orange", colorVar: "--pattern-bright-orange",minR:150, maxR:180, divisor:250000, alpha:"26" },
  { id: "patternCanvas-mint1",  colorVar: "--pattern-mint-1",       minR: 80, maxR:160, divisor:250000, alpha:"0D" },
  { id: "patternCanvas-orange2",colorVar: "--pattern-muted-orange", minR:100, maxR:150, divisor:150000, alpha:"26" },
  { id: "patternCanvas-mint2",  colorVar: "--pattern-mint-2",       minR: 80, maxR:200, divisor:100000, alpha:"1A" },
];

initBackground(layerConfigs, { cacheNs: "bg-work" });
