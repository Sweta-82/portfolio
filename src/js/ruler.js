function buildRulers() {
    // Horizontal ruler
    const trackH = document.getElementById('rulerTrackH');
    const width = Math.max(window.innerWidth, document.documentElement.scrollWidth);
    trackH.innerHTML = '';
    trackH.style.width = width + 'px';

    for (let i = 0; i <= width; i += 10) {
        const tick = document.createElement('div');
        tick.className = 'ruler-tick';

        if (i % 100 === 0) {
            tick.classList.add('ruler-tick--major');
            const label = document.createElement('span');
            label.className = 'ruler-label';
            label.textContent = i;
            tick.appendChild(label);
        } else if (i % 50 === 0) {
            tick.classList.add('ruler-tick--mid');
        }

        tick.style.left = i + 'px';
        trackH.appendChild(tick);
    }

    // Vertical ruler
    const trackV = document.getElementById('rulerTrackV');
    const height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    trackV.innerHTML = '';
    trackV.style.height = height + 'px';

    for (let i = 0; i <= height; i += 10) {
        const tick = document.createElement('div');
        tick.className = 'ruler-tick';

        if (i % 100 === 0) {
            tick.classList.add('ruler-tick--major');
            const label = document.createElement('span');
            label.className = 'ruler-label';
            label.textContent = i;
            tick.appendChild(label);
        } else if (i % 50 === 0) {
            tick.classList.add('ruler-tick--mid');
        }

        tick.style.top = i + 'px';
        trackV.appendChild(tick);
    }
}

buildRulers();
window.addEventListener('resize', buildRulers);
