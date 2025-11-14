import { initTileRotation } from "../core/rotate.js";
import { initGlow } from "../core/glow.js";
import { initBackground } from "../core/scroll.js";

const glowConfigs = [
  { selector: '.bg--glow--bright-yellow', minOpacity: 0.4, maxOpacity: 0.9, periodMs: 10000 },
  { selector: '.bg--glow--yellow', minOpacity: 0.3, maxOpacity: 0.6, periodMs: 20000 }
];

const scrollConfigs = [
  { id: "patternCanvas-orange", colorVar: "--accent-orange-500",minR:150, maxR:180, divisor:250000, alpha:"80" },
  { id: "patternCanvas-mint1",  colorVar: "--secondary-200",       minR: 80, maxR:160, divisor:300000, alpha:"99" },
  { id: "patternCanvas-mint2",  colorVar: "--secondary-300",       minR: 80, maxR:200, divisor:200000, alpha:"66" },
];

initGlow(glowConfigs);

initTileRotation('.bg--glow, .bg--repeat');

initBackground(scrollConfigs, { cacheNs: "bg-main" });