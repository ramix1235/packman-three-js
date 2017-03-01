'use strict';

let scene = new THREE.Scene(),
  camera,
  controls,
  renderer,
  mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster(),
  directionalLight;
  // mousePos = {};

let activeObject = null;
let packman;
let container;

init();
animate();

function init() {
  container = document.getElementById('scene');
  document.body.appendChild(container);
  
  scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

  const axis = new THREE.AxisHelper(20);
  scene.add(axis);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 20);

  controls = new THREE.OrbitControls(camera);
  controls.maxPolarAngle = Math.PI / 2;
  controls.maxDisnatce = 10;
  controls.minDistance = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createDirectionalLight();
  createFloor();

  packman = new Packman();
  packman.createPackman();

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
}

function animate() {
  if ( activeObject ) {
    activeObject.move();
    updateCameraPosition();
  }
  render();
  requestAnimationFrame(animate);
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

function createDirectionalLight() {
  directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.castShadow = true;
  directionalLight.position.set(5, 10, -5);
  const helperDirectionalLight = new THREE.CameraHelper(directionalLight.shadow.camera);
  scene.add(directionalLight, helperDirectionalLight);
}