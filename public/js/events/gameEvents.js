'use strict';

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