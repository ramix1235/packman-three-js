'use strict';

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function createFloor() {
  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  const planeTexture = new THREE.TextureLoader().load('public/textures/road.jpg');
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(100, 100);
  const planeMaterial = new THREE.MeshLambertMaterial({ map: planeTexture });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.rotation.x = 3 * Math.PI / 2;
  scene.add(plane);
};

function createLight() {
  const ambientLightent = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLightent);

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  spotLight = new THREE.SpotLight(0xffffff, 1.5);
  // (color, intensity, distance, angle, penumbra, decay)
  spotLight.position.set(0, 25, 0);

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;

  const helperSpotLight = new THREE.CameraHelper(spotLight.shadow.camera);
  //scene.add(spotLight, helperSpotLight);
};

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

  let positionX;
  let positionZ;
  let distance;
  rivals.push(packman.threeobj);  
  for (let i = 0; i < count; i++) {
    createNewСoordinates();
    // сравниваем эти координаты с уже существующими
    for (let j = 0; j < rivals.length; j++) {
      // между новыми кординатами и массивом существующих
      distanceBetweenTwoPoints(j);
      // если где-то пересечение
      while (distance < 4) {
        createNewСoordinates();
        // опять сравниваем их с остальными
        for (let k = 0; k < rivals.length; k++) {
          // между новыми кординатами и массивом существующих
          distanceBetweenTwoPoints(k);
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
    rivals.push(mesh);

    function createNewСoordinates() {
      positionX = Math.floor(Math.random() * (max - min + 1) + min);
      positionZ = Math.floor(Math.random() * (max - min + 1) + min);
    };

    function distanceBetweenTwoPoints(j) {
      distance = Math.sqrt(Math.pow(positionX - rivals[j].position.x, 2) + Math.pow(positionZ - rivals[j].position.z, 2));
    };
  };
  rivals.shift(packman.threeobj);

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