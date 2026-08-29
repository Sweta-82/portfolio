const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

export function initInfiniteSpiral(containerSelector = '#spiral-container', opts = {}) {
  const root = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!root) return;
  const defaultItems = [
    { src: './src/assets/images/buynest.png', alt: 'SkillSync GenAI Platform', href: 'https://github.com/Sweta-82', title: 'SkillSync GenAI Interview Prep' },
    { src: './src/assets/images/saasify.png', alt: 'SaaSify Hosting Platform', href: 'https://github.com/Sweta-82/SaaSify', title: 'SaaSify Hosting & Domain' },
    { src: './src/assets/images/petpaal.png', alt: 'Pet Paal Realtime Adoption', href: 'https://petpaal.onrender.com/', title: 'Pet Paal Real-Time Adoption' },
    { src: './src/assets/images/vida.png', alt: 'Vida 3D Experience', href: 'https://vida-inky.vercel.app/', title: 'Vida 3D Portfolio' },
    { src: './src/assets/images/k2.png', alt: 'K72 Agency Website', href: 'https://k72-five-sage.vercel.app/', title: 'K72 Agency Website' },
    { src: './src/assets/images/div1.png', alt: 'BuyNest E-Commerce', href: 'https://buynest-8pji.onrender.com/', title: 'BuyNest E-Commerce Platform' },
    { src: './src/assets/images/div2.png', alt: 'MERN Microservices System', href: 'https://github.com/Sweta-82', title: 'MERN Microservices Architecture' },
    { src: './src/assets/images/div3.png', alt: 'Modern Digital Experience', href: 'https://github.com/Sweta-82', title: 'Modern Fullstack Applications' }
  ];

  const items = opts.items || defaultItems;
  const speed = opts.speed ?? 0.55;
  const direction = opts.direction || 'up';
  const animationMode = opts.animationMode || 'all';
  const radius = opts.radius ?? 200;
  const cardWidth = opts.cardWidth ?? 190;
  const cardHeight = opts.cardHeight ?? 130;
  const verticalSpacing = opts.verticalSpacing ?? 75;
  const perspective = opts.perspective ?? 1000;
  const cardsPerTurn = opts.cardsPerTurn ?? 7;
  const rotation = opts.rotation ?? 0;
  const cardTilt = opts.cardTilt ?? 0;
  const cardRadius = opts.cardRadius ?? 14;
  const centerScale = opts.centerScale ?? 1.2;
  const edgeFade = opts.edgeFade ?? 0.3;
  const edgeBlur = opts.edgeBlur ?? 6;
  const pauseOnHover = opts.pauseOnHover ?? true;
  const imageFit = opts.imageFit || 'cover';
  const grayscale = opts.grayscale ?? 0;

  root.className = `relative isolate h-[500px] w-full overflow-hidden ${root.className || ''}`;
  root.style.perspective = `${perspective}px`;
  root.style.cursor = 'grab';
  root.style.touchAction = 'pan-x';
  root.style.userSelect = 'none';

  const listContainer = document.createElement('div');
  listContainer.className = 'absolute inset-0 [transform-style:preserve-3d]';
  listContainer.setAttribute('role', 'list');
  listContainer.setAttribute('aria-label', 'Infinite spiral gallery');

  const cardElements = [];

  items.forEach((item, index) => {
    const Tag = item.href ? 'a' : 'div';
    const card = document.createElement(Tag);
    card.className = 'absolute left-1/2 top-1/2 block overflow-hidden border border-white/25 bg-white/10 shadow-[0_14px_38px_rgba(8,6,18,0.3)] group [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] transition-all duration-300';
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.borderRadius = `${cardRadius}px`;

    if (item.href) {
      card.href = item.href;
      card.target = '_blank';
      card.rel = 'noreferrer';
    }

    card.innerHTML = `
      <img
        src="${item.src}"
        alt="${item.alt}"
        loading="${index < 6 ? 'eager' : 'lazy'}"
        draggable="false"
        class="absolute inset-0 block h-full w-full select-none object-center transition-transform duration-500 group-hover:scale-110"
        style="object-fit: ${imageFit}; filter: grayscale(${grayscale});"
      />
      ${item.title ? `
        <div class="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-bold text-xs">
          ${item.title}
        </div>
      ` : ''}
    `;

    listContainer.appendChild(card);
    cardElements.push(card);
  });

  root.appendChild(listContainer);

  let progress = 0;
  let targetProgress = 0;
  let autoSpeed = 0;
  let hovered = false;
  let visible = true;
  let dragging = false;
  let lastPointerY = 0;
  let dragMoved = false;

  let frameId;
  let previousTime = performance.now();
  let bounds = root.getBoundingClientRect();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollEnabled = animationMode === 'scroll' || animationMode === 'all';
  const dragEnabled = animationMode === 'drag' || animationMode === 'all';
  const autoEnabled = animationMode === 'auto' || animationMode === 'all';
  const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
  let lastScrollY = window.scrollY;

  const resizeObserver = new ResizeObserver(() => {
    bounds = root.getBoundingClientRect();
  });
  resizeObserver.observe(root);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  intersectionObserver.observe(root);

  const handleScroll = () => {
    const nextScrollY = window.scrollY;
    const scrollDelta = nextScrollY - lastScrollY;
    lastScrollY = nextScrollY;
    if (!scrollEnabled || !visible || scrollDelta === 0) return;
    targetProgress += clamp(
      (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
      -1.5,
      1.5
    );
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  const render = (time) => {
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    const motionPaused = dragging || (pauseOnHover && hovered);
    const directionMultiplier = direction === 'down' ? -1 : 1;
    const desiredAutoSpeed =
      autoEnabled && visible && !reducedMotion.matches && !motionPaused
        ? speed * directionMultiplier
        : 0;
    const speedBlend = 1 - Math.exp(-delta * 7);
    autoSpeed += (desiredAutoSpeed - autoSpeed) * speedBlend;
    targetProgress += autoSpeed * delta;

    const followBlend = 1 - Math.exp(-delta * (dragging ? 22 : 11));
    progress += (targetProgress - progress) * followBlend;

    const count = items.length;
    const half = count / 2;
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
    const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
    const fadeStart = clamp(1 - edgeFade, 0, 0.98);
    const turnSize = Math.max(cardsPerTurn, 1);

    cardElements.forEach((card, index) => {
      if (!card) return;
      const offset = modulo(index - progress + half, count) - half;
      const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
      const opacity = 1 - smoothstep(fadeStart, 1, edge);
      const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
      const scale = (1 + (centerScale - 1) * focus) * fit;
      const angle = offset * (360 / turnSize) + rotation;
      const angleRadians = (angle * Math.PI) / 180;
      const x = Math.sin(angleRadians) * responsiveRadius;
      const z = Math.cos(angleRadians) * responsiveRadius;
      const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
      const visualScale = scale * depthScale;
      const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
      const blur = edgeBlur * smoothstep(0.35, 1, edge);
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none';
      card.style.zIndex = String(Math.round(depth * 100000) + index);
      card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
    });
    frameId = requestAnimationFrame(render);
  };

  frameId = requestAnimationFrame(render);

  root.addEventListener('mouseenter', () => {
    hovered = true;
  });
  root.addEventListener('mouseleave', () => {
    hovered = false;
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    if (event.pointerId && root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
    root.style.cursor = dragEnabled ? 'grab' : 'default';
  };

  root.addEventListener('pointerdown', (event) => {
    if (!dragEnabled || event.button !== 0) return;
    dragging = true;
    dragMoved = false;
    lastPointerY = event.clientY;
    targetProgress = progress;
    root.setPointerCapture(event.pointerId);
    root.style.cursor = 'grabbing';
  });

  root.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const pointerDelta = event.clientY - lastPointerY;
    lastPointerY = event.clientY;
    if (Math.abs(pointerDelta) > 0.5) dragMoved = true;
    targetProgress -= pointerDelta / Math.max(verticalSpacing, 1);
  });

  root.addEventListener('pointerup', stopDragging);
  root.addEventListener('pointercancel', stopDragging);

  root.addEventListener(
    'click',
    (event) => {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    },
    true
  );

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('scroll', handleScroll);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initInfiniteSpiral());
} else {
  initInfiniteSpiral();
}

export default initInfiniteSpiral;
