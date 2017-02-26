'use strict'

let camera, controls, scene, axes, spotLight, helper, renderer;
let raycaster = new THREE.Raycaster();
let projector = new THREE.Projector();
let intersects;
let mouse = new THREE.Vector2();

let cubeGeometry, cubeMaterial, cube, cubeForGroup;
let lineGeometry, lineMaterial, line;
let planeGeometry, planeMaterial, plane;
let sphereGeometry, sphereMaterial, sphereForGroup, sphereForGroup2;
let group, meshes, pivots;

init();
animate();

function init() {
  // create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, 15);

  // controls
  controls = new THREE.OrbitControls(camera);
  controls.minDistance = 10;
  controls.maxDistance = 50;

  // create the Scene
  scene = new THREE.Scene();

  // axes
  axes = new THREE.AxisHelper(20);

  // light
  spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 10, 10);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048; // default is 512
  spotLight.shadow.mapSize.height = 2048; // default is 512
  helper = new THREE.CameraHelper(spotLight.shadow.camera);

  // create elements for scene
  cubeGeometry = new THREE.BoxGeometry(2, 2, 10);
  cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.rotation.x = -.9 * Math.PI;
  cube.position.y = 1.06;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cubeForGroup = new THREE.Mesh(cubeGeometry, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
  cubeForGroup.castShadow = true;

  lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(-3, 0, 0), new THREE.Vector3(0, 7, 0), new THREE.Vector3(3, 0, 0));
  lineMaterial = new THREE.MeshBasicMaterial({ color: 0xCC3333 });
  line = new THREE.Line(lineGeometry, lineMaterial);
  line.rotation.x = .1 * Math.PI;

  planeGeometry = new THREE.PlaneGeometry(16, 12);
  // planeMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('../textures/road.jpg') });
  planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  planeMaterial.side = THREE.DoubleSide;
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -.4 * Math.PI;
  plane.castShadow = true;
  plane.receiveShadow = true;

  sphereGeometry = new THREE.SphereGeometry(1, 5, 5); 
  sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xFFC618 });
  sphereForGroup = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereForGroup.castShadow = true;
  sphereForGroup.receiveShadow = true;
  sphereForGroup2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereForGroup2.castShadow = true;
  sphereForGroup2.receiveShadow = true;

  // parent
  group = new THREE.Group();
  group.add(cubeForGroup, sphereForGroup, sphereForGroup2);
  group.children[0].position.set(0, 10, 0);
  group.children[1].position.set(10, 0, 0);
  group.children[2].position.set(-10, 0, 0);

  // add elements on scene
  scene.add(axes, spotLight, helper, cube, line, plane, group);

  // init the WebGL renderer and append it to the Dom
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onMouseClick, false);
}



function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  // console.log('mousemove: ', mouse.x, mouse.y);
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  console.log('click: ', mouse.x, mouse.y);

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  intersects = raycaster.intersectObjects(scene.children, true);

  // Change color if hit block
  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    //intersects[0].object.scale.set(2, 2, 2);
    //console.log(intersects[0].object);
  }
}



function animate() {
  // render the 3D scene
  render();
  // relaunch the 'timer' 
  requestAnimationFrame(animate);
}


function render() {
  line.rotation.y += 0.01;

  cube.rotation.y += 0.01;

  group.rotation.x += 0.01;
  group.rotation.y += 0.01;

  controls.update();

  // make the cube bounce
  /*  var dtime = Date.now() - startTime;
    cube.scale.x = 1.0 + 0.3 * Math.sin(dtime / 300);
    cube.scale.y = 1.0 + 0.3 * Math.sin(dtime / 300);
    cube.scale.z = 1.0 + 0.3 * Math.sin(dtime / 300);*/
  // actually display the scene in the Dom element
  renderer.render(scene, camera);
}
