'use strict'

const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000),
  controls = new THREE.OrbitControls(camera),
  renderer = new THREE.WebGLRenderer(),
  mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster();

let meshes = [];

init();
animate();

function init() {
  scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

  const axis = new THREE.AxisHelper(20);
  scene.add(axis);

  camera.position.set(0, 7, 12);

  controls.maxDisnatce = 10;
  controls.minDistance = 5;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFFFFF);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  // window.addEventListener('mousemove', onMouseClick, false);
  window.addEventListener('mousedown', onMouseDown, false);
  // window.addEventListener('keydown', onKeydown, false);

  /*  const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(50, 150, -50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048; // default is 512
    spotLight.shadow.mapSize.height = 2048; // default is 512
    const helperSpotLight = new THREE.CameraHelper(spotLight.shadow.camera);
    scene.add(spotLight, helperSpotLight);*/

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.castShadow = true;
  directionalLight.position.set(5, 10, -5);
  const helperDirectionalLight = new THREE.CameraHelper(directionalLight.shadow.camera);
  scene.add(directionalLight, helperDirectionalLight);

  const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  // const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xCC3333 });
  const planeTexture = new THREE.TextureLoader().load('public/textures/road.jpg');
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(100, 100);
  const planeMaterial = new THREE.MeshLambertMaterial({ map: planeTexture });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.receiveShadow = true;
  plane.rotation.x = 3 * Math.PI / 2;
  scene.add(plane);
  meshes.push(plane);

  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
  // const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  const boxTexture = new THREE.TextureLoader().load('public/textures/crate.gif');
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
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.set(0, 1.5, 0);
  directionalLight.target = box;
  scene.add(box);
  meshes.push(box);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
  //event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  console.log(mouse);

  // Make the sphere follow the mouse
  /*  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    meshes[1].position.copy(pos)*/

  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects(scene.children, true);
  // console.log(scene.children[4].uuid);
  // console.log(intersects[0].object.uuid);
  if (intersects.length > 0 && scene.children[4].uuid === intersects[0].object.uuid) {
    meshes[1].position.set(mouse.x, mouse.y, 0);
    //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
  }
}

/*function onKeydown(event) {
  if (event.key === 'w') {
    console.log(event);
    meshes[1].position.z -= 0.1;
  }
}*/

function animate() {
  render();
  requestAnimationFrame(animate);
}

function render() {
  if (camera.position.y < 2) {
    camera.position.y = 2;  
  }
  controls.update();
  renderer.render(scene, camera);
}