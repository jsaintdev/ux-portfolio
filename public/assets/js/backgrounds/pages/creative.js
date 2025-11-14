import { initTileRotation } from "../core/rotate.js";
import { initGlow } from "../core/glow.js";

const glowConfigs = [
  { selector: '.bg--glow--white', minOpacity: 0.3, maxOpacity: 0.5, periodMs: 10000 },
  { selector: '.bg--glow--bright-white', minOpacity: 0.8, maxOpacity: 0.9, periodMs: 20000 }
];

initGlow(glowConfigs);
initTileRotation('.bg--glow, .bg--repeat');
