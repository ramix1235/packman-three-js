'use strict';

const requiredPackmanSize = 7;
let stats, scene, camera, controls, renderer;
let packman, rivals, activeObject;
let countWin = 0, countLose = 0;
let statsScore, statsPackmanSize, statsScoreSprite, statsWin, statsLose;
let floorParams = {
  width: 100,
  height: 100
};
let mirrorParams = {
  width: floorParams.width,
  height: 50
};

init();
animate();

function init() {
  if (!Detector.webgl) {
    alert('Your graphics card does not seem to support WebGL.');
    return;
  }
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  document.body.appendChild(stats.domElement);

  const container = document.getElementById('scene');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xFFFFFF, 0.02);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 20);

  controls = new THREE.OrbitControls(camera);
  controls.maxPolarAngle = 90 * Math.PI / 180;
  controls.maxDisnatce = 10;
  controls.minDistance = 5;
  controls.enablePan = false;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createLight();
  createFloor();
  createMirror();
  packman = new Packman();
  packman.create();
  rivals = new Rivals();
  rivals.create(160, -floorParams.width / 2 + 2, floorParams.height / 2 - 2);

  statsScore = createHTMLText(`Elements: ${rivals.rivalsLength}/${rivals.rivalsLength}`, 10, 100);
  statsPackmanSize = createHTMLText(`Size: ${requiredPackmanSize}/${getSumPackmanSize()}`, 10, 130);
  statsScoreSprite = createCanvasSpriteText(rivals.rivalsLength);
  statsWin = createHTMLText(`Win: ${countWin}`, 10, 160);
  statsLose = createHTMLText(`Lose: ${countLose}`, 10, 190);
  create3DText('packman', 2, 0, 0);

  events();
};

function animate() {
  render();
  requestAnimationFrame(animate);
};

function render() {
  if (activeObject) {
    activeObject.move();
    updateCameraPosition();
  }
  packmanOnFloor();
  packman.collision();
  mirrorParams.mirror.render();
  statsScoreSprite.position.copy(packman.threeobj.position);
  controls.update();
  stats.update();
  renderer.render(scene, camera);
};

function events() {
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
  document.addEventListener('keydown', onKeyDown, false);
};

function createLight() {
  const spotLight = new THREE.SpotLight(0xFFFFFF, 1.5);
  spotLight.position.set(0, 41, 0);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  scene.add(spotLight);
};

function createFloor() {
  const planeGeometry = new THREE.PlaneGeometry(floorParams.width, floorParams.height);
  const planeTexture = new THREE.TextureLoader().load('public/textures/floor.jpg');
  const planeMaterial = new THREE.MeshLambertMaterial({ map: planeTexture });
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(25, 25);
  floorParams.floor = new THREE.Mesh(planeGeometry, planeMaterial);
  floorParams.floor.castShadow = true;
  floorParams.floor.receiveShadow = true;
  floorParams.floor.rotation.x = -90 * Math.PI / 180;
  scene.add(floorParams.floor);
};

function createMirror() {
  mirrorParams.mirror = new THREE.Mirror(renderer, camera, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color: 0x889999 });
  mirrorParams.mirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(mirrorParams.width, mirrorParams.height), mirrorParams.mirror.material);
  mirrorParams.mirrorMesh.add(mirrorParams.mirror);
  mirrorParams.mirrorMesh.position.y = mirrorParams.height / 2;
  mirrorParams.mirrorMesh.position.z = -floorParams.height / 2;
  scene.add(mirrorParams.mirrorMesh);
};