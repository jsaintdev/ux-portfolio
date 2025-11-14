export function initGlow(configs = []) {
  if (!Array.isArray(configs) || configs.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  configs.forEach(({ selector, minOpacity = 0.3, maxOpacity = 0.7, periodMs = 10000 }) => {
    if (!selector) return;

    const glowLayer = document.querySelector(selector);
    if (!glowLayer) {
      console.warn("Glow layer not found:", selector);
      return;
    }

    if (prefersReduced) {
      glowLayer.style.opacity = ((minOpacity + maxOpacity) / 2).toString();
      return;
    }

    const mid = (minOpacity + maxOpacity) / 2;
    const amp = (maxOpacity - minOpacity) / 2;

    const loop = (t) => {
      const phase = ((t % periodMs) / periodMs) * Math.PI * 2;
      const value = mid + amp * Math.sin(phase);
      glowLayer.style.opacity = value.toFixed(3);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  });
}
