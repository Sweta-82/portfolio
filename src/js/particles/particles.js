import * as THREE from 'three';

const canvas = document.querySelector('canvas.particles-bg');
if (canvas) {
    const scene = new THREE.Scene();

    // Configuration
    const objDis = 10;
    const params = {
        materialColor: '#FF3B00'
    };

    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }

    const praticlesGeo = new THREE.BufferGeometry();
    praticlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const praticlesMaterial = new THREE.PointsMaterial({
        color: params.materialColor,
        sizeAttenuation: true,
        size: 0.03
    });

    const praticles = new THREE.Points(praticlesGeo, praticlesMaterial);
    scene.add(praticles);

    // Setup Dimensions
    const size = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
    camera.position.z = 5;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Handle Resize
    window.addEventListener('resize', () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;

        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();

        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Subtle movement
        praticles.rotation.y = elapsedTime * 0.05;
        praticles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();
}
