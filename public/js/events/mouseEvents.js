'use strict';

const mouse = new THREE.Vector2();

function onMouseDown(event) {
  getMousePosition();
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObjects([packman.threeobj], true);
  if (intersects.length > 0) {
    activeObject = packman;
    window.dispatchEvent(new Event('mousemove'));
  }
};

function onMouseMove(event) {
  getMousePosition();
  if (activeObject === packman) {
    controls.enableRotate = false;
  }
};

function onMouseUp(event) {
  controls.enableRotate = true;
  activeObject = null;
};

function getMousePosition() {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
};

function updateCameraPosition() {
  camera.position.x = activeObject.threeobj.position.x;
  camera.position.z = activeObject.threeobj.position.z + 20;
};