export function initRightRuler() {
  if (document.querySelector('.right-ruler-container')) return;

  const container = document.createElement('div');
  container.className = 'right-ruler-container fixed right-3 top-1/2 -translate-y-1/2 z-[9999] hidden lg:flex flex-col items-center justify-center w-[30px] h-[350px] pointer-events-auto select-none';
  container.setAttribute('aria-label', 'Right Ruler Indicator');

  container.innerHTML = `
    <div class="relative w-[30px] h-[342px] flex items-center justify-center">
      <img src="./src/assets/images/ruler.svg" alt="Ruler" 
           class="rotate-90 origin-center absolute w-[342px] h-[19px] max-w-none opacity-85 hover:opacity-100 transition-opacity duration-300" 
           style="filter: invert(60%) sepia(45%) saturate(1200%) hue-rotate(310deg) brightness(95%) contrast(90%);" />
      <div class="ruler-indicator absolute right-0 top-0 w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary,#E06D85)] transition-all duration-300 pointer-events-none z-10"></div>
    </div>
  `;

  document.body.appendChild(container);

  const indicator = container.querySelector('.ruler-indicator');

  const updateRulerPosition = () => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, totalScrollable)));
    if (indicator) {
      const topOffset = scrollProgress * 328;
      indicator.style.transform = `translateY(${topOffset}px)`;
    }
  };

  window.addEventListener('scroll', updateRulerPosition, { passive: true });
  updateRulerPosition();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initRightRuler());
} else {
  initRightRuler();
}

export default initRightRuler;
