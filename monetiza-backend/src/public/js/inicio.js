import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.querySelector('.hero-right');
const canvas = document.getElementById('webgl-canvas');

// Cenário, Câmera e Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);

// Câmera aproximada no Z (de 5 para 4.2) para dar mais zoom
camera.position.set(0, 1.2, 4.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controle de Rotação
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

// Iluminação Estilo Neon
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const purpleLight = new THREE.PointLight(0xa855f7, 8, 10);
purpleLight.position.set(2, 3, 2);
scene.add(purpleLight);

const greenLight = new THREE.PointLight(0x22c55e, 6, 10);
greenLight.position.set(-2, 1, 2);
scene.add(greenLight);

// Carregador de modelo GLB
const loader = new GLTFLoader();
let model = null;

// Posição base para manter o modelo bem centralizado
const initialY = 0.1; 

loader.load(
  'monetiza.glb', 
  (gltf) => {
    model = gltf.scene;

    // Escala ampliada para 3.5
    model.scale.set(3.5, 3.5, 3.5); 
    model.position.set(0, initialY, 0);

    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  (error) => {
    console.error('Erro ao carregar o modelo GLB:', error);
  }
);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  if (model) {
    model.position.y = initialY + Math.sin(time * 2) * 0.08;
    model.rotation.y += 0.005;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Ajuste Responsivo
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});