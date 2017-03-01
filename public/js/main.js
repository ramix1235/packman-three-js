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
  createFactoryRivals();

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
}

function animate() {
  if (activeObject) {
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

function createFactoryRivals() {
  let count = 600, min = -58, max = 58;
  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
  const boxTexture = new THREE.TextureLoader().load('public/textures/box-rivals.jpg');
  const boxMaterial = new THREE.MultiMaterial([
    new THREE.MeshLambertMaterial({
      map: boxTexture
    }),
    new THREE.MeshLambertMaterial({
      map: boxTexture
    }),
    new THREE.MeshLambertMaterial({
      map: boxTexture
    }),
    new THREE.MeshLambertMaterial({
      map: boxTexture
    }),
    new THREE.MeshLambertMaterial({
      map: boxTexture
    }),
    new THREE.MeshLambertMaterial({
      map: boxTexture
    })
  ]);

  // добавляемые элементы
  let meshes = [];
  // сразу добавим пэкмена
  meshes.push(packman.threeobj);
  for (let i = 0; i < count; i++) {
    // считаем координаты для будущего элемента
    let positionX = Math.floor(Math.random() * (max - min + 1) + min);
    let positionZ = Math.floor(Math.random() * (max - min + 1) + min);

    // сравниваем эти координаты с уже существующими
    for (let j = 0; j < meshes.length; j++) {
      // вычисляем расстояние между новыми кординатами и массивом существующих
      let distance = Math.sqrt(Math.pow(positionX - meshes[j].position.x, 2) + Math.pow(positionZ - meshes[j].position.z, 2));

      // если где-то пересечение
      while (distance < 4) {
        // находим новые координаты
        positionX = Math.floor(Math.random() * (max - min + 1) + min);
        positionZ = Math.floor(Math.random() * (max - min + 1) + min);

        // опять сравниваем их с остальными
        for (let j = 0; j < meshes.length; j++) {
          // вычисляем расстояние между новыми кординатами и массивом существующи
          distance = Math.sqrt(Math.pow(positionX - meshes[j].position.x, 2) + Math.pow(positionZ - meshes[j].position.z, 2));
          // если где-то пересечение
          if (distance < 4) {
            break;
          };
        };
      };

    };

    let mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(positionX, 1.5, positionZ);
    scene.add(mesh);
    meshes.push(mesh);
    console.log(meshes.length);
  };

/*  for (let i = 0; i < 2; i++) {
    let positionX = Math.floor(Math.random() * (max - min + 1) + min);
    let positionZ = Math.floor(Math.random() * (max - min + 1) + min);
    console.log('позиция пэкмена ' + packman.threeobj.position.x + '  ' + packman.threeobj.position.z);
    console.log('позиция куба ' + positionX + '  ' + positionZ);
    let distance = Math.sqrt(Math.pow(positionX - packman.threeobj.position.x, 2) + Math.pow(positionZ - packman.threeobj.position.z, 2));
    console.log('расстояние между их центрами ' + distance);
    while (distance < 4) {
      console.log('|||куб слишком близко! Создаю новый|||');
      positionX = Math.floor(Math.random() * (max - min + 1) + min);
      positionZ = Math.floor(Math.random() * (max - min + 1) + min);
      console.log('позиция куба ' + positionX + '  ' + positionZ);
      distance = Math.sqrt(Math.pow(positionX - packman.threeobj.position.x, 2) + Math.pow(positionZ - packman.threeobj.position.z, 2));
      console.log('расстояние между их центрами ' + distance);
    }
    let mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(positionX, 1.5, positionZ);
    console.log('ДОБАВИЛ КУБ НА СЦЕНУ');
    scene.add(mesh);
    meshes.push(mesh);
  }*/
};



