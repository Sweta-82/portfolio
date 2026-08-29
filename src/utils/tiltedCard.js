const lerp = (a, b, n) => (1 - n) * a + n * b;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function initTiltedCard(selector = '.tilted-card, #projects .main', opts = {}) {
  const cards = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];

  cards.forEach(card => {
    if (!card || card.dataset.tiltedCardInitialized) return;
    card.dataset.tiltedCardInitialized = 'true';

    const rotateAmplitude = opts.rotateAmplitude ?? parseFloat(card.dataset.rotateAmplitude || '14');
    const scaleOnHover = opts.scaleOnHover ?? parseFloat(card.dataset.scaleOnHover || '1.04');
    const showTooltip = opts.showTooltip ?? (card.dataset.showTooltip !== 'false');

    card.classList.add('tilted-card-wrapper');
    card.style.perspective = '800px';
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    // Find or create overlay content wrapper for 3D depth floating
    const overlay = card.querySelector('.tilted-card-overlay') || card.querySelector('div:last-child');
    if (overlay) {
      overlay.style.transform = 'translateZ(35px)';
      overlay.style.transformStyle = 'preserve-3d';
      overlay.style.willChange = 'transform';
    }

    // Tooltip figcaption element
    let tooltip = card.querySelector('figcaption');
    if (!tooltip && showTooltip) {
      const img = card.querySelector('img');
      const captionText = card.dataset.caption || img?.alt || '';
      if (captionText) {
        tooltip = document.createElement('figcaption');
        tooltip.className = 'pointer-events-none absolute left-0 top-0 rounded-md bg-white/90 text-black px-3 py-1.5 text-xs font-bold shadow-xl opacity-0 z-30 transition-opacity duration-300 backdrop-blur-sm whitespace-nowrap';
        tooltip.textContent = captionText;
        card.appendChild(tooltip);
      }
    }

    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetScale = 1;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentScale = 1;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let lastOffsetY = 0;
    let targetTooltipRotate = 0;
    let currentTooltipRotate = 0;

    let isHovered = false;
    let rafId = null;

    const render = () => {
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.12);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.12);
      currentScale = lerp(currentScale, targetScale, 0.12);

      currentMouseX = lerp(currentMouseX, targetMouseX, 0.2);
      currentMouseY = lerp(currentMouseY, targetMouseY, 0.2);
      currentTooltipRotate = lerp(currentTooltipRotate, targetTooltipRotate, 0.15);

      card.style.transform = `perspective(800px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;

      if (tooltip) {
        tooltip.style.transform = `translate3d(${currentMouseX.toFixed(1)}px, ${currentMouseY.toFixed(1)}px, 45px) rotate(${currentTooltipRotate.toFixed(1)}deg)`;
      }

      if (isHovered || Math.abs(currentRotateX - targetRotateX) > 0.01 || Math.abs(currentRotateY - targetRotateY) > 0.01) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      targetRotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
      targetRotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

      targetMouseX = e.clientX - rect.left + 15;
      targetMouseY = e.clientY - rect.top + 15;

      const velocityY = offsetY - lastOffsetY;
      targetTooltipRotate = clamp(-velocityY * 0.4, -15, 15);
      lastOffsetY = offsetY;

      startLoop();
    };

    const handleMouseEnter = () => {
      isHovered = true;
      targetScale = scaleOnHover;
      if (tooltip) tooltip.style.opacity = '1';
      startLoop();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetRotateX = 0;
      targetRotateY = 0;
      targetScale = 1;
      targetTooltipRotate = 0;
      if (tooltip) tooltip.style.opacity = '0';
      startLoop();
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTiltedCard());
} else {
  initTiltedCard();
}

export default initTiltedCard;
