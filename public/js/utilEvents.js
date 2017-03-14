'use strict';

let lastPackmanPosition;
let isPackmanFall = false;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function packmanOnFloor() {
  if (isPackmanFall) {
    packman.threeobj.position.y -= 1;
    return;
  }
  const floorBox3 = new THREE.Box3().setFromObject(floorParams.floor);
  const floorCollision = packman.Sphere3.intersectsBox(floorBox3);
  if (floorCollision) {
    lastPackmanPosition = packman.Sphere3.center.clone();
    return;
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

function isFinishGame() {
  if (rivals.rivalsLength === 0 && getSumPackmanSize() >= requiredPackmanSize) {
    createHTMLText('WIN', window.innerWidth / 2, window.innerHeight / 2)
    resetGame();
  }
  else if (rivals.rivalsLength === 0) {
    createHTMLText('LOSE', window.innerWidth / 2, window.innerHeight / 2)
    resetGame();
  }
};

function getSumPackmanSize() {
  return packman.size.x + packman.size.y + packman.size.z;
};

function resetGame() {
  setTimeout(() => {
    resetPackman();
  }, 5000);
};