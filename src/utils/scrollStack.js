import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollStack(containerSelector = '.scroll-stack-container') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll('.scroll-stack-card');
  if (!cards.length) return;

  const scroller = document.querySelector('[data-scroll-container]') || window;
  const isMobile = window.innerWidth < 768;

  cards.forEach((card, index) => {
    const isLast = index === cards.length - 1;

    card.style.willChange = 'transform, filter, opacity';

    // On small mobile screens, keep a light scale & pinning for clean responsiveness
    ScrollTrigger.create({
      trigger: card,
      scroller: scroller,
      start: isMobile ? 'top 12%' : 'top 18%',
      endTrigger: container,
      end: 'bottom 80%',
      pin: !isLast && !isMobile, // smooth scroll flow on small phones
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        if (isLast) return;
        const progress = self.progress;
        const targetScale = Math.max(0.90, 1 - progress * 0.1 + index * 0.01);
        const opacity = Math.max(0.5, 1 - progress * 0.4);
        const blur = isMobile ? 0 : progress * 5;

        gsap.set(card, {
          scale: targetScale,
          opacity: opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          transformOrigin: 'top center'
        });
      }
    });
  });

  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollStack, 300);
  });
} else {
  setTimeout(initScrollStack, 300);
}

export default initScrollStack;
