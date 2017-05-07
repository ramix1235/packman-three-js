'use strict';

function onKeyDown(event) {
  if (activeObject) {
    return;
  }
  switch (event.key) {
    case 'w':
    case 'Up':
    case 'ArrowUp':
      packman.threeobj.position.z -= 1;
      packman.threeobj.rotation.y = Math.PI;
      packman.threeobj.rotation.x = 0;
      break;
    case 's':
    case 'Down':
    case 'ArrowDown':
      packman.threeobj.position.z += 1;
      packman.threeobj.rotation.y = Math.PI / 180;
      packman.threeobj.rotation.x = 0;
      break;
    case 'a':
    case 'Left':
    case 'ArrowLeft':
      packman.threeobj.position.x -= 1;
      packman.threeobj.rotation.y = -90 * Math.PI / 180;
      packman.threeobj.rotation.x = 0;
      break;
    case 'd':
    case 'Right':
    case 'ArrowRight':
      packman.threeobj.position.x += 1;
      packman.threeobj.rotation.y = 90 * Math.PI / 180;
      packman.threeobj.rotation.x = 0;
      break;
    default: return;
  }
  controls.enableRotate = false;
  camera.position.set(packman.threeobj.position.x, 41, packman.threeobj.position.z);
  statsScoreSprite.position.copy(packman.threeobj.position);
};