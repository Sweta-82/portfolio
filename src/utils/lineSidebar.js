const FALLOFF_CURVES = {
  linear: p => p,
  smooth: p => p * p * (3 - 2 * p),
  sharp: p => p * p * p
};

export function initLineSidebar(selector = '.line-sidebar', opts = {}) {
  const containers = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];

  containers.forEach(container => {
    if (!container || container.dataset.lineSidebarInitialized) return;
    container.dataset.lineSidebarInitialized = 'true';

    const accentColor = opts.accentColor || 'var(--color-primary, #FF3B00)';
    const textColor = opts.textColor || '#F5F5F5';
    const markerColor = opts.markerColor || '#52525b';
    const showIndex = opts.showIndex ?? true;
    const showMarker = opts.showMarker ?? true;
    const proximityRadius = opts.proximityRadius ?? 140;
    const maxShift = opts.maxShift ?? 35;
    const falloff = opts.falloff || 'smooth';
    const markerLength = opts.markerLength ?? 60;
    const markerGap = opts.markerGap ?? 15;
    const tickScale = opts.tickScale ?? 0.5;
    const scaleTick = opts.scaleTick ?? true;
    const itemGap = opts.itemGap ?? 20;
    const fontSize = opts.fontSize ?? '1.2rem';
    const smoothing = opts.smoothing ?? 100;
    let activeIndex = opts.defaultActive ?? null;

    container.style.setProperty('--accent-color', accentColor);
    container.style.setProperty('--text-color', textColor);
    container.style.setProperty('--marker-color', markerColor);
    container.style.setProperty('--marker-length', `${markerLength}px`);
    container.style.setProperty('--marker-gap', `${markerGap}px`);
    container.style.setProperty('--tick-scale', tickScale);
    container.style.setProperty('--max-shift', `${maxShift}px`);
    container.style.setProperty('--item-gap', `${itemGap}px`);
    container.style.setProperty('--font-size', fontSize);
    container.style.setProperty('--smoothing', `${smoothing}ms`);

    const items = Array.from(container.querySelectorAll('.line-sidebar-item, li, .achievement-row'));
    if (items.length === 0) return;

    items.forEach((item, index) => {
      item.classList.add('line-sidebar-item');
      item.dataset.index = index;

      if (!item.querySelector('.line-sidebar-marker') && showMarker) {
        const marker = document.createElement('span');
        marker.className = 'line-sidebar-marker';
        item.prepend(marker);
      }

      let contentWrapper = item.querySelector('.line-sidebar-content');
      if (!contentWrapper) {
        const children = Array.from(item.childNodes).filter(
          n => !n.classList?.contains('line-sidebar-marker')
        );
        contentWrapper = document.createElement('span');
        contentWrapper.className = 'line-sidebar-content';
        children.forEach(c => contentWrapper.appendChild(c));

        if (showIndex && !contentWrapper.querySelector('.line-sidebar-index')) {
          const indexSpan = document.createElement('span');
          indexSpan.className = 'line-sidebar-index';
          indexSpan.textContent = String(index + 1).padStart(2, '0');
          contentWrapper.prepend(indexSpan);
        }

        item.appendChild(contentWrapper);
      }
    });

    const targets = new Array(items.length).fill(0);
    const current = new Array(items.length).fill(0);
    let rafId = null;
    let lastTime = 0;

    const runFrame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const tau = Math.max(smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let moving = false;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const target = Math.max(targets[i] || 0, activeIndex === i ? 1 : 0);
        const cur = current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        current[i] = value;
        el.style.setProperty('--effect', value.toFixed(4));
        if (!settled) moving = true;
      }

      rafId = moving ? requestAnimationFrame(runFrame) : null;
    };

    const startLoop = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      lastTime = performance.now();
      rafId = requestAnimationFrame(runFrame);
    };

    const ease = FALLOFF_CURVES[falloff] || FALLOFF_CURVES.linear;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targets[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    };

    const handlePointerLeave = () => {
      for (let i = 0; i < targets.length; i++) targets[i] = 0;
      startLoop();
    };

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        activeIndex = index;
        startLoop();
      });
    });

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    startLoop();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initLineSidebar());
} else {
  initLineSidebar();
}

export default initLineSidebar;
