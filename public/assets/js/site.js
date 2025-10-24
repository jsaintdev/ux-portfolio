// Generates the spheres for the background
document.addEventListener("DOMContentLoaded", () => {

  // breakpoint buckets for regen rules
  function getBucket(w) {
    // mobile <768, tablet 768–1279, desktop >=1280
    return (w < 768) ? 'm' : (w < 1280) ? 't' : 'd';
  }

  // localStorage safe wrappers
  function lsGet(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }

  function lsSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  const layerConfigs = [{
      id: "patternCanvas-dark",
      colorVar: "--pattern-dark-green",
      minR: 120,
      maxR: 160,
      divisor: 200000,
      alpha: "33"
    },
    {
      id: "patternCanvas-brown",
      colorVar: "--pattern-brown",
      minR: 120,
      maxR: 160,
      divisor: 300000,
      alpha: "26"
    },
    {
      id: "patternCanvas-yellow",
      colorVar: "--pattern-yellow",
      minR: 80,
      maxR: 100,
      divisor: 300000,
      alpha: "33"
    },
    {
      id: "patternCanvas-orange",
      colorVar: "--pattern-bright-orange",
      minR: 150,
      maxR: 180,
      divisor: 250000,
      alpha: "26"
    },
    {
      id: "patternCanvas-mint1",
      colorVar: "--pattern-mint-1",
      minR: 80,
      maxR: 160,
      divisor: 250000,
      alpha: "0D"
    },
    {
      id: "patternCanvas-orange2",
      colorVar: "--pattern-muted-orange",
      minR: 100,
      maxR: 150,
      divisor: 150000,
      alpha: "26"
    },
    {
      id: "patternCanvas-mint2",
      colorVar: "--pattern-mint-2",
      minR: 80,
      maxR: 200,
      divisor: 100000,
      alpha: "1A"
    },
  ];

  const createLayer = ({
    id,
    colorVar,
    minR,
    maxR,
    divisor,
    alpha
  }) => {

    let lastMeasuredW = 0,
      lastMeasuredH = 0;

    let lastBucket = getBucket(document.documentElement.clientWidth);
    let lastRegenAt = 0;

    // regen limits
    const MIN_REGEN_MS = 30000; // don't regenerate more often than 30s
    const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h per-bucket cache

    const cacheKey = (bucket) => `bgBlobs:${id}:${bucket}`;

    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const color = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
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

      // try cache unless forced
      if (!force) {
        const cached = lsGet(cacheKey(bucket));
        if (cached && (now - cached.ts) < CACHE_TTL_MS && Array.isArray(cached.blobs)) {
          blobs = cached.blobs; // ratios already stored
          return;
        }
      }

      const scale = getScaleFactor();
      const scaledMinR = minR * scale;
      const scaledMaxR = maxR * scale;
      let scaledDivisor = divisor / Math.pow(scale, 2);
      if (Math.min(window.innerWidth, window.innerHeight) < 480) scaledDivisor *= 0.09;

      const blobCount = Math.max(1, Math.floor((width * height) / scaledDivisor));

      blobs = Array.from({
        length: blobCount
      }, () => ({
        xRatio: Math.random(),
        yRatio: Math.random(),
        r: scaledMinR + Math.random() * (scaledMaxR - scaledMinR),
      }));

      // save ratios for this layer+bucket
      lsSet(cacheKey(bucket), {
        ts: now,
        blobs
      });
      lastRegenAt = now;
      lastBucket = bucket;
    };



    const drawPattern = (width, height) => {
      ctx.clearRect(0, 0, width, height);
      blobs.forEach(({
        xRatio,
        yRatio,
        r
      }) => {
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
      const siteMain = document.querySelector('.site-main') || d;
      const bgLayers = siteMain.querySelector('.bg-layers');

      const width = d.clientWidth;

      let height;
      const kids = Array.from(siteMain.children).filter(el => el !== bgLayers);
      if (kids.length) {
        const last = kids[kids.length - 1];
        height = Math.ceil(last.getBoundingClientRect().bottom + window.scrollY);
      } else {
        height = Math.max(b.scrollHeight, d.scrollHeight, d.clientHeight);
      }

      // Skip full work if size unchanged
      if (width === lastMeasuredW && height === lastMeasuredH) return;
      lastMeasuredW = width;
      lastMeasuredH = height;

      // canvas sizing (keeps dots circular)
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only regenerate on bucket change or expired cool-down; else just redraw
      const bucket = getBucket(width);
      const now = Date.now();
      const shouldRegen =
        (bucket !== lastBucket) ||
        (now - lastRegenAt > MIN_REGEN_MS);

      if (shouldRegen) generatePattern(width, height);
      drawPattern(width, height);
    };


    // initial paint
    resizeCanvas();

    window.addEventListener('bg:force-regen', (e) => {
      if (e.detail && e.detail.id !== id) return;

      const bucket = getBucket(document.documentElement.clientWidth);
      lsSet(cacheKey(bucket), {
        ts: 0,
        blobs: []
      });
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

    // throttle to ~1 frame per event burst
    let ticking = false;
    const scheduleRender = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        resizeCanvas();
      });
    };

    window.addEventListener('resize', scheduleRender, {
      passive: true
    });

    // Observe content growth only (not the background/canvases)
    const ro = new ResizeObserver(scheduleRender);
    const siteMain = document.querySelector('.site-main') || document.documentElement;
    ro.observe(siteMain);


  };

  // Manual refresh API: window.refreshDots() or window.refreshDots('patternCanvas-dark')
  window.refreshDots = (targetId) => {
    const fire = (id) => {
      const ev = new CustomEvent('bg:force-regen', {
        detail: {
          id
        }
      });
      window.dispatchEvent(ev);
    };
    if (targetId) fire(targetId);
    else layerConfigs.forEach(l => fire(l.id));
  };


  layerConfigs.forEach(createLayer);
});

// Sets up the footer
document.addEventListener("DOMContentLoaded", async () => {
  const footerContainer = document.getElementById("footer-container");
  if (!footerContainer) return;

  try {
    const path = location.pathname
      .replace(/index\.html$/i, '')
      .replace(/\/+$/, '/');
    const segments = path.split('/').filter(Boolean).length;
    const basePath = segments === 0 ? './' : '../'.repeat(segments);
    const footerURL = basePath + 'partials/footer.html';

    const res = await fetch(footerURL);
    if (!res.ok) throw new Error(`Failed to load footer (${res.status})`);
    footerContainer.innerHTML = await res.text();

    if (typeof window.wireFooterEmail === "function") {
      window.wireFooterEmail();
    }
  } catch (err) {
    console.error("Footer load error:", err);
  }
});


// Set up email in footer
function wireFooterEmail() {
  document.querySelectorAll('.footer__connect[data-u][data-d][data-tld]').forEach(el => {
    if (el.dataset.wired === '1') return; // already wired
    el.dataset.wired = '1';

    const u = el.dataset.u.split('').reverse().join('');
    const d = el.dataset.d.split('').reverse().join('');
    const tld = el.dataset.tld.split('').reverse().join('');
    const addr = `${u}@${d}.${tld}`;

    // avoid duplicate email node
    let emailText = el.querySelector('.footer__email');
    if (!emailText) {
      emailText = document.createElement('h2');
      emailText.className = 'footer__email';
      emailText.textContent = addr;
      el.appendChild(emailText);
    }

    const arrow = el.querySelector('.footer__arrow');

    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(addr);
        const prev = emailText.textContent;
        emailText.textContent = 'Email Copied!';
        emailText.classList.add('copied');
        if (arrow) arrow.classList.add('nudge');
        setTimeout(() => {
          emailText.textContent = prev;
          emailText.classList.remove('copied');
          if (arrow) arrow.classList.remove('nudge');
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  });
}