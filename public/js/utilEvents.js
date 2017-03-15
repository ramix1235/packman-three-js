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

function isFinishGame() {
  // как игра закончилась и таймаут идет, если есть оставшиеся элементы, то packman будет заходить в этот метод и спамить победу или проигрышь
  // заморозить пэкмена, либо входить единажды в этот метод
  if (rivals.rivalsLength === 0 && getSumPackmanSize() >= requiredPackmanSize) {
    statsWin.innerHTML = `Win: ${++countWin}`;
    resetGame();
  }
  else if (rivals.rivalsLength === 0) {
    statsLose.innerHTML = `Lose: ${++countLose}`;
    resetGame();
  }
};

function getSumPackmanSize() {
  return packman.size.x + packman.size.y + packman.size.z;
};

function resetGame() {
  setTimeout(() => {
    scene.remove(packman.threeobj);
    packman = new Packman();
    packman.create();
    for (let i = 0; i < rivals.elements.length; i++) {
      scene.remove(rivals.elements[i]);
    }
    rivals = new Rivals();
    rivals.create(160, -floorParams.width / 2 + 2, floorParams.height / 2 - 2);

    statsScore.innerHTML = `Elements: ${rivals.rivalsLength + rivals.deletedElements}/${rivals.rivalsLength}`;
    statsPackmanSize.innerHTML = `Size ${requiredPackmanSize}/${(getSumPackmanSize()).toFixed(2)}`;
    scene.remove(statsScoreSprite);
    statsScoreSprite = createCanvasSpriteText(rivals.rivalsLength);

    camera.position.set(0, 10, 20);
  }, 3000);
};