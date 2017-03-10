'use strict';

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function createText(text) {
  let loader = new THREE.FontLoader();
  loader.load('../../public/fonts/KenPixel_Regular.json', (font) => {
    let textGeo = new THREE.TextGeometry(text, {
      font: font,
      size: 2.5,
      height: 0.3
    });
    let textMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, specular: 0xFFFFFF });
    let score = new THREE.Mesh(textGeo, textMaterial);
    score.position.set(2, 0, 0);
    score.castShadow = true;
    score.receiveShadow = true;
    scene.add(score);
    //scene.remove(score);
  });
}

function createHTMLText(text, top, left) {
  let element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.width = 100;
  element.style.height = 100;
  element.style.color = 'red';
  element.style.fontSize = 30 + 'px';
  element.innerHTML = text;
  element.style.top = top + 'px';
  element.style.left = left + 'px';
  document.body.appendChild(element);
  return element;
};

function createCanvasSpriteText() {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.canvas.height = 128;
  context.canvas.width = 256;
  context.textAlign = 'center';
  context.imageSmoothingEnabled = false;
  context.font = '65px Arial';
  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.fillText(rivals.elements.length, 125, 85);
  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  //var spriteMap = new THREE.TextureLoader().load('../../public/textures/eye.jpg');
  let spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xFFFFFF });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(packman.threeobj.position.x, packman.threeobj.position.y, packman.threeobj.position.z);
  sprite.scale.set(2, 2, 2);
  scene.add(sprite);
  return sprite;
};

function createFloor() {
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeTexture = new THREE.TextureLoader().load('public/textures/road.jpg');
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(10, 10);
  const planeMaterial = new THREE.MeshLambertMaterial({ map: planeTexture });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.rotation.x = 3 * Math.PI / 2;
  scene.add(plane);
  return plane;
};

let currentPosition;
let gameOver = false;

function onFloor(floor) {
  if (gameOver === true) {
    packman.threeobj.position.y -= 1;
    return;
  }
  let floorBox3 = new THREE.Box3().setFromObject(floor);
  let collision = packman.Sphere3.intersectsBox(floorBox3);
  if (collision) {
    currentPosition = packman.Sphere3.center.clone();
  }
  if (!collision) {
    gameOver = true;
    setTimeout(() => {
      resetPackman();
      let isVisible = true;
      let changeVisibility = setInterval(() => {
        isVisible = !isVisible;
        packman.threeobj.children[0].children[0].material.opacity = isVisible ? 1 : 0.1;
        packman.threeobj.children[1].material.opacity = isVisible ? 1 : 0.1;
      }, 100);
      setTimeout(() => { clearInterval(changeVisibility) }, 1000);
    }, 1000);
  }
};

function resetPackman() {
  gameOver = false;
  //console.log(currentPosition.y);
  packman.threeobj.position.set(0, currentPosition.y, 0);
  spotLight.position.set(packman.threeobj.position.x, 25, packman.threeobj.position.z);
  camera.position.set(0, 10, 20);
  packman.threeobj.rotation.x = 0;
  packman.threeobj.rotation.y = 0;
  activeObject = null;
  scoreSprite.position.set(packman.threeobj.position.x, packman.threeobj.position.y, packman.threeobj.position.z);
}

function createLight() {
/*  const ambientLightent = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLightent);*/

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  spotLight = new THREE.SpotLight(0xFFFFFF, 2);
  spotLight.position.set(0, 25, 0);

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;

  const helperSpotLight = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(spotLight);
};

/*function findRaycasterPoint(event) {
  var parentOffset = container.parentElement,
    touches = event.changedTouches,
    usedEvent = event.changedTouches ? event.changedTouches[0] : event;

  mouse.x = ((usedEvent.clientX - parentOffset.offsetLeft - container.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -((usedEvent.clientY - parentOffset.offsetTop - container.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
}

function findMousePositionOnScene() {
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize(),
    distance = -camera.position.z / dir.z;
  mousePos = camera.position.clone().add(dir.multiplyScalar(distance));
}*/