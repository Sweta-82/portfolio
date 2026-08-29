import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveal(selector = '.scroll-reveal', opts = {}) {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];

  elements.forEach((el) => {
    if (!el || el.dataset.scrollRevealInitialized) return;
    el.dataset.scrollRevealInitialized = 'true';

    const baseOpacity = opts.baseOpacity ?? parseFloat(el.dataset.baseOpacity || '0.1');
    const enableBlur = opts.enableBlur ?? (el.dataset.enableBlur !== 'false');
    const baseRotation = opts.baseRotation ?? parseFloat(el.dataset.baseRotation || '3');
    const blurStrength = opts.blurStrength ?? parseFloat(el.dataset.blurStrength || '4');
    const scrub = opts.scrub ?? (el.dataset.scrub ? (isNaN(Number(el.dataset.scrub)) ? el.dataset.scrub === 'true' : Number(el.dataset.scrub)) : 0.5);
    const stagger = opts.stagger ?? parseFloat(el.dataset.stagger || '0.03');
    const rotationEnd = opts.rotationEnd || el.dataset.rotationEnd || 'bottom center';
    const wordAnimationEnd = opts.wordAnimationEnd || el.dataset.wordAnimationEnd || 'bottom 55%';
    const scroller = opts.scroller || document.querySelector('[data-scroll-container]') || window;

    // Helper to recursively wrap text words in span elements
    const wrapWords = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;

        const fragment = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach((part) => {
          if (part.match(/^\s+$/)) {
            fragment.appendChild(document.createTextNode(part));
          } else if (part.length > 0) {
            const span = document.createElement('span');
            span.className = 'scroll-reveal-word inline-block';
            span.textContent = part;
            fragment.appendChild(span);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (!node.classList.contains('scroll-reveal-word')) {
          Array.from(node.childNodes).forEach(wrapWords);
        }
      }
    };

    const targets = el.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    if (targets.length > 0) {
      targets.forEach((target) => wrapWords(target));
    } else {
      wrapWords(el);
    }

    // 1. Base rotation animation on container
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller: scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: scrub
        }
      }
    );

    const wordElements = el.querySelectorAll('.scroll-reveal-word');
    if (wordElements.length === 0) return;

    // 2. Word opacity animation
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity, filter' },
      {
        ease: 'none',
        opacity: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller: scroller,
          start: 'top 85%',
          end: wordAnimationEnd,
          scrub: scrub
        }
      }
    );

    // 3. Word blur animation
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: stagger,
          scrollTrigger: {
            trigger: el,
            scroller: scroller,
            start: 'top 85%',
            end: wordAnimationEnd,
            scrub: scrub
          }
        }
      );
    }
  });
}

export default initScrollReveal;
