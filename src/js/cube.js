import * as THREE from 'three';
// import gsap from 'gsap';

// import * as dat from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import image from assets (Vite resolves this path)
import img from '../assets/images/image.png';


const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();


// praticles
const praticlesGeo1 = new THREE.BufferGeometry();
const count = 50000;
const positions = new Float32Array(count);
for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 10
}

praticlesGeo1.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// maretiral
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.001
particlesMaterial.sizeAttenuation = true; //false

const particles = new THREE.Points(praticlesGeo1, particlesMaterial)
scene.add(particles);



// cube with 3x3 grid tiles on each face
const loader = new THREE.TextureLoader();
const texture = loader.load(img);

const cube = new THREE.Group();

const gridSize = 3;        // 3x3 grid
const cubeSize = 2.5;        // overall cube size
const gap = 0.06;          // gap between tiles
const tileSize = (cubeSize - (gridSize + 1) * gap) / gridSize;
const halfCube = cubeSize / 2;

// face definitions: [axis, sign, rotationAxis, rotationAngle]
const faces = [
    { axis: 'z', dir: 1, rx: 0, ry: 0 },             // front
    { axis: 'z', dir: -1, rx: 0, ry: Math.PI },       // back
    { axis: 'x', dir: 1, rx: 0, ry: Math.PI / 2 },    // right
    { axis: 'x', dir: -1, rx: 0, ry: -Math.PI / 2 },  // left
    { axis: 'y', dir: 1, rx: -Math.PI / 2, ry: 0 },   // top
    { axis: 'y', dir: -1, rx: Math.PI / 2, ry: 0 },   // bottom
];

const tilePlane = new THREE.PlaneGeometry(tileSize, tileSize);

faces.forEach((face) => {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.7 });
            const tile = new THREE.Mesh(tilePlane, mat);

            // position in local face space (centered)
            const x = -halfCube + gap + tileSize / 2 + col * (tileSize + gap);
            const y = halfCube - gap - tileSize / 2 - row * (tileSize + gap);

            tile.position.set(x, y, halfCube);
            tile.rotation.x = face.rx;
            tile.rotation.y = face.ry;

            // move tile to correct face position based on rotation
            const offset = new THREE.Vector3(0, 0, halfCube);
            offset.applyEuler(new THREE.Euler(face.rx, face.ry, 0));

            tile.position.set(x, y, 0);
            tile.rotation.set(face.rx, face.ry, 0);

            // recalculate position on the face
            const localPos = new THREE.Vector3(x, y, halfCube);
            localPos.applyEuler(new THREE.Euler(face.rx, face.ry, 0));
            tile.position.copy(localPos);

            cube.add(tile);
        }
    }
});

scene.add(cube);
cube.position.set(0.5,-0.2,0.5)

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 4
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio); //20:16

const clock = new THREE.Clock();
const tick = () => {
    const eTime = clock.getElapsedTime();
    cube.rotation.x = eTime * 0.1;
    cube.rotation.y = eTime * 0.8;
    cube.rotation.z = -eTime * 0.3;
    // particles zoom in/out 
    const zoom = 1 + Math.sin(eTime * 0.005) * 0.2;
    // particles.scale.set(zoom, zoom, zoom);
    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(tick)
}
tick();