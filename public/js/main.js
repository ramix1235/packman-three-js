'use strict';

let scene = new THREE.Scene(),
  camera,
  controls,
  renderer,
  mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster(),
  spotLight,
  stats;
// mousePos = {};

let activeObject = null;
let packman;
let container;
let rivals = [];

init();
animate();

function init() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  container = document.getElementById('scene');
  document.body.appendChild(container);

  scene.fog = new THREE.FogExp2(0x000000, 0.03);

  const axis = new THREE.AxisHelper(20);
  scene.add(axis);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 20);

  controls = new THREE.OrbitControls(camera);
  controls.maxPolarAngle = Math.PI / 2;
  controls.maxDisnatce = 10;
  controls.minDistance = 5;

  if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createLight();
  createFloor();

  packman = new Packman();
  packman.createPackman();
  createFactoryRivals();
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
};

function animate() {
  if (activeObject) {
    activeObject.move();
    activeObject.collision();
    updateCameraPosition();
  }
  render();
  requestAnimationFrame(animate);
};

function render() {
  controls.update();
  stats.update();
  renderer.render(scene, camera);
};


