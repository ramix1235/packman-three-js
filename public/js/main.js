'use strict';

let scene = new THREE.Scene(),
  camera,
  controls,
  renderer,
  mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster(),
  spotLight
// mousePos = {};

let activeObject = null;
let packman;
let container;

init();
animate();

function init() {
  container = document.getElementById('scene');
  document.body.appendChild(container);

  scene.fog = new THREE.FogExp2(0x000000, 0.03);
  // const ambientLightent = new THREE.AmbientLight(0xffffff, 0);
  //scene.add(ambientLightent);
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

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
  // renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  createSpotLight();
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

function createSpotLight() {
  spotLight = new THREE.SpotLight(0xffffff, 1.5);
  // (color, intensity, distance, angle, penumbra, decay)
  spotLight.position.set(0, 25, 0);

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;

  const helperSpotLight = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(spotLight, helperSpotLight  );
}

function createFactoryRivals() {
  // let count = 600, min = -58, max = 58;
  let count = 600, min = -100, max = 100;
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



