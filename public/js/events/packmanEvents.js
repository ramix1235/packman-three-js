'use strict';

function packmanOnFloor() {
  if (isPackmanFall) {
    packman.threeobj.position.y -= 1;
    return;
  }
  const floorBox3 = new THREE.Box3().setFromObject(floorParams.floor);
  const floorCollision = packman.sphere3.intersectsBox(floorBox3);
  if (floorCollision) {
    lastPackmanPosition = packman.sphere3.center.clone();
    return;
  }
  if (getSumPackmanSize() > 1.1) {
    packman.threeobj.scale.set(packman.size.x -= 0.02, packman.size.y -= 0.02, packman.size.z -= 0.02);
    lastPackmanPosition.y -= 0.03;
    packman.threeobj.children[1].geometry.boundingSphere.radius -= 0.03;
    statsPackmanSize.innerHTML = `Size ${requiredPackmanSize}/${(getSumPackmanSize()).toFixed(2)}`;
  }
  isPackmanFall = true;
  setTimeout(() => {
    resetPackman();
  }, 1000);
};

function resetPackman() {
  isPackmanFall = false;
  packman.threeobj.position.set(0, lastPackmanPosition.y, 0);
  camera.position.set(0, 10, 20);
  packman.threeobj.rotation.x = 0;
  packman.threeobj.rotation.y = 0;
  activeObject = null;
  statsScoreSprite.position.copy(packman.threeobj.position);
};