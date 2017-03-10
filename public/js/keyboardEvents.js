'use strict';

function onKeyDown(event) {
  if (activeObject) {
    return;
  }
  controls.enableRotate = false;
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      packman.threeobj.position.z -= 1;
      packman.threeobj.rotation.y = 3 * Math.PI;
      packman.threeobj.rotation.x = 0; 
      break;
    case 's':
    case 'ArrowDown':
      packman.threeobj.position.z += 1;
      packman.threeobj.rotation.y = 0;
      packman.threeobj.rotation.x = 0;       
      break;
    case 'a':
    case 'ArrowLeft':
      packman.threeobj.position.x -= 1;
      packman.threeobj.rotation.y = 3 * Math.PI / 2;
      packman.threeobj.rotation.x = 0;
      break;
    case 'd':
    case 'ArrowRight':
      packman.threeobj.position.x += 1;
      packman.threeobj.rotation.y = Math.PI / 2;
      packman.threeobj.rotation.x = 0;
      break;
    default: return;
  }
  //camera.position.x = packman.threeobj.position.x;
  //camera.position.z = packman.threeobj.position.z + 20;
  camera.position.set(packman.threeobj.position.x, 40, packman.threeobj.position.z);
  scoreSprite.position.set(packman.threeobj.position.x, packman.threeobj.position.y, packman.threeobj.position.z);
  spotLight.position.set(packman.threeobj.position.x, 25, packman.threeobj.position.z);
}