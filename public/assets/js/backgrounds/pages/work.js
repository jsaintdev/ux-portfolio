import { initTileRotation } from "../core/rotate.js";
import { initGlow } from "../core/glow.js";

const glowConfigs = [
  { selector: '.bg--glow--bright-yellow', minOpacity: 0.4, maxOpacity: 0.9, periodMs: 10000 },
  { selector: '.bg--glow--yellow', minOpacity: 0.3, maxOpacity: 0.6, periodMs: 20000 }
];

initGlow(glowConfigs);

initTileRotation('.bg--glow, .bg--repeat');