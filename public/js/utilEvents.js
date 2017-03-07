'use strict';

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
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

//let currentPosition;

function onFloor(floor) {
  let packmanSphere3 = new THREE.Sphere(packman.threeobj.position, packman.threeobj.children[1].geometry.boundingSphere.radius);
  let floorBox3 = new THREE.Box3().setFromObject(floor);
  let collision = packmanSphere3.intersectsBox(floorBox3);
  /*  if (collision) {
      currentPosition = packman.threeobj.position.clone();
    }*/
  if (!collision) {
    packman.threeobj.position.y -= 1;
    setTimeout(() => {
      packman.threeobj.position.set(0, 1.5, 0);
      spotLight.position.set(packman.threeobj.position.x, 25, packman.threeobj.position.z);
      camera.position.set(0, 10, 20);
      packman.threeobj.rotation.x = 0;
      packman.threeobj.rotation.y = 0;
      activeObject = null;
      let isVisible = true;
      let changeVisibility = setInterval(() => {
        isVisible = !isVisible;
        packman.groupMesh.children[0].children[0].material.opacity = isVisible ? 1 : 0.1;
        packman.groupMesh.children[1].material.opacity = isVisible ? 1 : 0.1;
      }, 100);
      setTimeout(() => { clearInterval(changeVisibility) }, 1000);
    }, 1000);
    //packman.threeobj.position.set(currentPosition.x, currentPosition.y, currentPosition.z); 
  }
};

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
  scene.add(spotLight, helperSpotLight);
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