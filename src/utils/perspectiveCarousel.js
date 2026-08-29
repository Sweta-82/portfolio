import { gsap } from 'gsap';

export function initPerspectiveCarousel(containerSelector = '.perspective-carousel') {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) return;

  containers.forEach((container) => {
    if (container.dataset.carouselInitialized) return;
    container.dataset.carouselInitialized = 'true';

    const track = container.querySelector('.carousel-track');
    const items = container.querySelectorAll('.carousel-item');
    const dotsContainer = container.querySelector('.carousel-dots');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');

    if (!track || !items.length) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    const calculateMetrics = () => {
      const gap = 24;
      const itemWidth = items[0].offsetWidth;
      return { itemWidth, trackItemOffset: itemWidth + gap };
    };

    let { trackItemOffset } = calculateMetrics();

    // Render navigation dots if container exists
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      items.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-primary scale-125 shadow-[0_0_10px_var(--color-primary,#D9267C)]' : 'bg-white/20 hover:bg-white/50'}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateCard3DEffects(currentTrackX) {
      const { trackItemOffset } = calculateMetrics();

      items.forEach((item, index) => {
        const itemCenterOffset = currentTrackX + index * trackItemOffset;
        const normalizedOffset = itemCenterOffset / trackItemOffset;

        // 3D perspective Y rotation and scale math
        const rotateY = Math.max(-75, Math.min(75, -normalizedOffset * 55));
        const scale = Math.max(0.85, 1 - Math.abs(normalizedOffset) * 0.12);
        const opacity = Math.max(0.35, 1 - Math.abs(normalizedOffset) * 0.4);

        item.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
        item.style.opacity = opacity;
      });

      // Update dot styles
      if (dotsContainer) {
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.className = 'w-3.5 h-3.5 rounded-full bg-primary scale-125 transition-all duration-300 shadow-[0_0_12px_var(--color-primary,#D9267C)]';
          } else {
            dot.className = 'w-3 h-3 rounded-full bg-white/20 hover:bg-white/50 transition-all duration-300';
          }
        });
      }
    }

    function goToSlide(index) {
      const { trackItemOffset } = calculateMetrics();
      currentIndex = Math.max(0, Math.min(index, items.length - 1));
      const targetX = -currentIndex * trackItemOffset;

      gsap.to(track, {
        x: targetX,
        duration: 0.65,
        ease: 'power3.out',
        onUpdate: () => updateCard3DEffects(gsap.getProperty(track, 'x'))
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Pointer Drag Physics
    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX - gsap.getProperty(track, 'x');
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const currentX = e.clientX - startX;
      gsap.set(track, { x: currentX });
      updateCard3DEffects(currentX);
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      const { trackItemOffset } = calculateMetrics();
      const trackX = gsap.getProperty(track, 'x');
      const nearestIndex = Math.round(-trackX / trackItemOffset);
      goToSlide(nearestIndex);
    });

    window.addEventListener('resize', () => goToSlide(currentIndex));

    // Initial setup
    goToSlide(0);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initPerspectiveCarousel, 300));
} else {
  setTimeout(initPerspectiveCarousel, 300);
}

export default initPerspectiveCarousel;
