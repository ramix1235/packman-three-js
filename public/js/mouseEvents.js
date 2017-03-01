function onMouseDown(event) {
  getMousePosition();
  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects([packman.threeobj], true);

  if (intersects.length > 0) {
    activeObject = packman;
    window.dispatchEvent(new Event('mousemove'));
  }
}

function onMouseMove(event) {
  getMousePosition();
  if (activeObject === packman) {
    controls.enableRotate = false;
  }
}

function onMouseUp(event) {
  controls.enableRotate = true;
  activeObject = null;
}

function getMousePosition() {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}

/*function getPos() {
  mousePos.x = (event.clientX - window.innerWidth / 2);
  mousePos.y = (event.clientY - window.innerHeight / 2);
}*/

function updateCameraPosition() {
  camera.position.x = activeObject.threeobj.position.x;
  camera.position.z = activeObject.threeobj.position.z + 20;
}