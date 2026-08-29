import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HINGE_CONFIG = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 }
};

const FOLD_TEXT_STYLES = `
.fold-text-container {
  display: inline-block;
  user-select: text;
}

.fold-text-segment {
  display: inline-block;
  line-height: inherit;
  perspective: var(--fold-perspective, 700px);
  transform-style: preserve-3d;
  vertical-align: baseline;
}

.fold-text-piece {
  position: relative;
  display: inline-block;
  color: inherit;
  line-height: inherit;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.fold-text-piece::after {
  content: '';
  position: absolute;
  inset: -0.08em -0.02em;
  pointer-events: none;
  opacity: var(--fold-crease, 0);
  mix-blend-mode: multiply;
  border-radius: 0.08em;
}

.fold-text-piece[data-fold-hinge='top']::after {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='bottom']::after {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}
`;

export function initFoldText(selector = '[data-fold-text]') {
  if (typeof window === 'undefined') return;

  if (!document.getElementById('fold-text-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'fold-text-styles';
    styleEl.textContent = FOLD_TEXT_STYLES;
    document.head.appendChild(styleEl);
  }

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    if (el.dataset.foldInitialized) return;
    el.dataset.foldInitialized = 'true';

    const text = el.dataset.foldText || el.textContent.trim();
    const hinge = el.dataset.hinge || 'top';
    const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
    const perspective = parseFloat(el.dataset.perspective || '700');
    const duration = parseFloat(el.dataset.duration || '0.65');
    const stagger = parseFloat(el.dataset.stagger || '0.045');
    const creaseShading = parseFloat(el.dataset.creaseShading || '0.55');
    const delay = parseFloat(el.dataset.delay || '0.3');

    el.innerHTML = '';
    el.classList.add('fold-text-container');
    el.style.opacity = '1';
    el.style.visibility = 'visible';

    const chars = Array.from(text);
    const pieces = [];

    chars.forEach((char) => {
      const segment = document.createElement('span');
      segment.className = 'fold-text-segment';
      segment.style.setProperty('--fold-perspective', `${perspective}px`);

      const piece = document.createElement('span');
      piece.className = 'fold-text-piece';
      piece.dataset.foldHinge = hinge;
      piece.style.transformOrigin = hingeConfig.origin;
      piece.textContent = char === ' ' ? '\u00A0' : char;

      segment.appendChild(piece);
      el.appendChild(segment);
      pieces.push(piece);
    });

    const fromVars = {
      opacity: 0,
      rotateX: hingeConfig.rotateX,
      rotateY: hingeConfig.rotateY,
      '--fold-crease': creaseShading,
      transformOrigin: hingeConfig.origin,
      force3D: true
    };

    const toVars = {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      '--fold-crease': 0,
      duration: duration,
      delay: delay,
      ease: 'power3.out',
      stagger: stagger
    };

    gsap.fromTo(pieces, fromVars, toVars);
  });
}

// Global window trigger
window.initFoldText = initFoldText;

export default initFoldText;
