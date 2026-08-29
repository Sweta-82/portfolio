const defaultOptions = {
  patternSize: 250,
  patternScaleX: 1,
  patternScaleY: 1,
  patternRefreshInterval: 8,
  patternAlpha: 15
};

function initNoise(opts = {}) {
  const options = { ...defaultOptions, ...opts };
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let off = document.createElement('canvas');
  let offCtx = off.getContext('2d');
  let frame = 0;
  let rafId;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // Work in CSS pixels by scaling context
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateOffscreen() {
    // Create an offscreen canvas sized according to patternSize and scales
    off.width = Math.max(1, Math.round(options.patternSize / options.patternScaleX));
    off.height = Math.max(1, Math.round(options.patternSize / options.patternScaleY));
    offCtx = off.getContext('2d');

    const imageData = offCtx.createImageData(off.width, off.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = options.patternAlpha; // alpha 0-255
    }
    offCtx.putImageData(imageData, 0, 0);
  }

  function draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear and draw the tiled offscreen noise
    ctx.clearRect(0, 0, width, height);
    const pattern = ctx.createPattern(off, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }

  function loop() {
    if (frame % options.patternRefreshInterval === 0) {
      generateOffscreen();
    }
    draw();
    frame++;
    rafId = window.requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();

  return () => {
    window.removeEventListener('resize', resize);
    window.cancelAnimationFrame(rafId);
  };
}

// Auto-init with sensible defaults and expose the initializer/cleanup on `window`.
window.initNoise = initNoise;
window.noiseCleanup = initNoise();

export default initNoise;
