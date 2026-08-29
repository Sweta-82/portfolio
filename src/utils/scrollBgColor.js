import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollBgColor() {
  const scrollerEl = document.querySelector('[data-scroll-container]') ? '[data-scroll-container]' : window;

  // 1. Smoothly scrub background color from Deep Purple (#200A24) to Black (#000000) when entering Projects
  const projectsEl = document.querySelector('#projects');
  if (projectsEl) {
    gsap.to('body, .bg-main', {
      backgroundColor: '#000000',
      ease: 'none',
      scrollTrigger: {
        trigger: projectsEl,
        scroller: scrollerEl,
        start: 'top 90%',
        end: 'top 20%',
        scrub: 1
      }
    });
  }

  // 2. Smoothly scrub background color from Black (#000000) to Deep Rich Green (#004219) when entering Education & Beyond
  const educationEl = document.querySelector('#education');
  if (educationEl) {
    gsap.to('body, .bg-main', {
      backgroundColor: '#004219',
      ease: 'none',
      scrollTrigger: {
        trigger: educationEl,
        scroller: scrollerEl,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initScrollBgColor, 500));
} else {
  setTimeout(initScrollBgColor, 500);
}

export default initScrollBgColor;
