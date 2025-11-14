export function initMotion(configs = []) {
  if (!Array.isArray(configs)) return;

  const layers = configs
    .map(cfg => ({
      ...cfg,
      el: cfg.selector ? document.querySelector(cfg.selector) : null
    }))
    .filter(cfg => cfg.el);

  if (!layers.length) return;

  const step = () => {
    const doc = document.documentElement;
    const body = document.body;

    const maxScroll = doc.scrollHeight - window.innerHeight;
    const rawScroll = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const t = maxScroll > 0 ? rawScroll / maxScroll : 0; // 0 → 1

    layers.forEach(cfg => {
      const { el, type } = cfg;

      if (!el) return;

      if (type === "circle") {
        const r = cfg.radius ?? 40;
        const angle = t * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        el.style.transform = `translate(${x}px, ${y}px)`;
      } else if (type === "arc") {
        const maxDeg = cfg.maxAngle ?? 90;
        const angle = (t * maxDeg * Math.PI) / 180;
        const r = cfg.radius ?? 40;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        el.style.transform = `translate(${x}px, ${y}px)`;
      } else if (type === "shift") {
        const dx = (cfg.shiftX ?? 0) * t;
        const dy = (cfg.shiftY ?? 0) * t;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    });

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
