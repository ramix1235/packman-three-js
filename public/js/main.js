'use strict';

let scene = new THREE.Scene(),
  camera,
  controls,
  renderer,
  mouse = new THREE.Vector2(),
  raycaster,
  spotLight,
  directionalLight,
  stats;
// mousePos = {};

let activeObject = null;
let packman;
let rivals;
let container;
let floor;

// let minMesh, maxMesh, box, packmanBox3;

init();
animate();

function init() {
  if (!Detector.webgl) {
    alert('Your graphics card does not seem to support WebGL.');
    return;
  }
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
  controls.enablePan = false;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createLight();
  floor = createFloor();

  packman = new Packman();
  packman.create();

  rivals = new Rivals();
  rivals.create();

/* box = new THREE.Box3().setFromObject(packman.threeobj);
  minMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4));
  minMesh.position.copy(box.min);
  scene.add(minMesh);
  maxMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4));
  maxMesh.position.copy(box.max);
  scene.add(maxMesh);*/

/* packmanBox3 = new THREE.Box3().setFromObject(packman.threeobj);
  let boxHelper = new THREE.BoxHelper(packmanBox3, 0xffffff);
  scene.add(boxHelper);*/

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
    onFloor(floor);
  }
  render();
  requestAnimationFrame(animate);
};

function render() {
  controls.update();
  stats.update();
  renderer.render(scene, camera);
};


