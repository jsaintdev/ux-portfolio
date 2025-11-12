let initialized = false;

export function initBackground(layerConfigs, { cacheNs = "bgBlobs" } = {}) {
  if (initialized) initialized = false; // allow multiple page variants if needed

  const getBucket = (w) => (w < 768) ? "m" : (w < 1280) ? "t" : "d";
  const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const MIN_REGEN_MS = 30000;
  const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

  const createLayer = ({ id, colorVar, minR, maxR, divisor, alpha }) => {
    let lastMeasuredW = 0, lastMeasuredH = 0;
    let lastBucket = getBucket(document.documentElement.clientWidth);
    let lastRegenAt = 0;

    const cacheKey = (bucket) => `${cacheNs}:${id}:${bucket}`;
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const readColor = () => getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
    let blobs = [];

    const getScaleFactor = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.5;
      if (width < 768) return 0.7;
      if (width < 1024) return 0.8;
      return 1;
    };

    const generatePattern = (width, height, force = false) => {
      const now = Date.now();
      const bucket = getBucket(width);

      if (!force) {
        const cached = lsGet(cacheKey(bucket));
        if (cached && (now - cached.ts) < CACHE_TTL_MS && Array.isArray(cached.blobs)) {
          blobs = cached.blobs;
          return;
        }
      }

      const scale = getScaleFactor();
      const scaledMinR = minR * scale;
      const scaledMaxR = maxR * scale;
      let scaledDivisor = divisor / Math.pow(scale, 2);
      if (Math.min(window.innerWidth, window.innerHeight) < 480) scaledDivisor *= 0.09;

      const blobCount = Math.max(1, Math.floor((width * height) / scaledDivisor));
      blobs = Array.from({ length: blobCount }, () => ({
        xRatio: Math.random(),
        yRatio: Math.random(),
        r: scaledMinR + Math.random() * (scaledMaxR - scaledMinR),
      }));

      lsSet(cacheKey(bucket), { ts: now, blobs });
      lastRegenAt = now;
      lastBucket = bucket;
    };

    const drawPattern = (width, height) => {
      const color = readColor();
      if (!color) return;

      ctx.clearRect(0, 0, width, height);
      blobs.forEach(({ xRatio, yRatio, r }) => {
        const x = xRatio * width;
        const y = yRatio * height;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `${color}${alpha}`);
        grad.addColorStop(1, `${color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    const resizeCanvas = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const d = document.documentElement;
      const b = document.body;
      const siteMain = document.querySelector(".site-main") || d;
      const bgLayers = siteMain.querySelector(".bg-layers");

      const width = d.clientWidth;
      let height;
      const kids = Array.from(siteMain.children).filter(el => el !== bgLayers);
      if (kids.length) {
        const last = kids[kids.length - 1];
        height = Math.ceil(last.getBoundingClientRect().bottom + window.scrollY);
      } else {
        height = Math.max(b.scrollHeight, d.scrollHeight, d.clientHeight);
      }

      if (width === lastMeasuredW && height === lastMeasuredH) return;
      lastMeasuredW = width;
      lastMeasuredH = height;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bucket = getBucket(width);
      const now = Date.now();
      const shouldRegen = (bucket !== lastBucket) || (now - lastRegenAt > MIN_REGEN_MS);

      if (shouldRegen) generatePattern(width, height);
      drawPattern(width, height);
    };

    // initial paint (after load)
    resizeCanvas();

    window.addEventListener("bg:force-regen", (e) => {
      if (e.detail && e.detail.id !== id) return;

      const bucket = getBucket(document.documentElement.clientWidth);
      lsSet(cacheKey(bucket), { ts: 0, blobs: [] });
      blobs = [];

      generatePattern(
        lastMeasuredW || document.documentElement.clientWidth,
        lastMeasuredH || document.documentElement.scrollHeight,
        true
      );
      drawPattern(
        lastMeasuredW || document.documentElement.clientWidth,
        lastMeasuredH || document.documentElement.scrollHeight
      );
    });

    let ticking = false;
    const scheduleRender = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        resizeCanvas();
      });
    };

    window.addEventListener("resize", scheduleRender, { passive: true });

    const ro = new ResizeObserver(scheduleRender);
    const siteMain = document.querySelector(".site-main") || document.documentElement;
    ro.observe(siteMain);
  };

  const start = () => layerConfigs.forEach(createLayer);
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  // Back-compat manual refresh name
  window.refreshDots = (targetId) => {
    const fire = (id) => window.dispatchEvent(new CustomEvent("bg:force-regen", { detail: { id } }));
    if (targetId) fire(targetId);
    else layerConfigs.forEach(l => fire(l.id));
  };
}
