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
let score;
let sizePackman;
let scoreSprite;

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

  scene.fog = new THREE.FogExp2(0xFFFFFF, 0.02);

  const axis = new THREE.AxisHelper(20);
  //scene.add(axis);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 20);

  controls = new THREE.OrbitControls(camera);
  controls.maxPolarAngle = Math.PI / 2;
  controls.maxDisnatce = 10;
  controls.minDistance = 5;
  controls.enablePan = false;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createLight();

  packman = new Packman();
  packman.create();

  rivals = new Rivals();
  rivals.create();

  floor = createFloor();

  createHTMLText(`Elements ${rivals.rivalsLength}/`, 100, 10);
  score = createHTMLText(rivals.rivalsLength, 100, 130);

  createHTMLText('Size', 130, 10);
  sizePackman = createHTMLText(packman.size.x + packman.size.y + packman.size.z, 130, 55);

  scoreSprite = createCanvasSpriteText(rivals.rivalsLength);
  createText('packman');
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
  document.addEventListener('keydown', onKeyDown, false);
};

function animate() {
  if (activeObject) {
    activeObject.move();
    updateCameraPosition();
  };
  packman.collision();
  render();
  requestAnimationFrame(animate);
};

function render() {
  controls.update();
  stats.update();
  onFloor(floor);
  renderer.render(scene, camera);
};


