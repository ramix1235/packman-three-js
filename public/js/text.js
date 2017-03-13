function createText(text) {
  let loader = new THREE.FontLoader();
  loader.load('../../public/fonts/KenPixel_Regular.json', (font) => {
    let textGeo = new THREE.TextGeometry(text, {
      font: font,
      size: 2.5,
      height: 0.3
    });
    let textMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00, specular: 0xFFFFFF });
    let score = new THREE.Mesh(textGeo, textMaterial);
    score.position.set(2, 0, 0);
    score.castShadow = true;
    score.receiveShadow = true;
    scene.add(score);
    //scene.remove(score);
  });
}

function createHTMLText(text, PosY, PosX) {
  let element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.color = '#FFCC00';
  element.style.fontSize = 17 + 'pt';
  element.innerHTML = text;
  element.style.top = PosY + 'px';
  element.style.left = PosX + 'px';
  document.body.appendChild(element);
  return element;
};

function createCanvasSpriteText(text) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.canvas.height = 128;
  context.canvas.width = 256;
  context.textAlign = 'center';
  context.imageSmoothingEnabled = false;
  context.font = '65px Arial';
  context.fillStyle = 'rgba(255, 204, 0, 0.5)';
  context.fillText(text, 125, 85);
  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  //var spriteMap = new THREE.TextureLoader().load('../../public/textures/eye.jpg');
  let spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xFFCC00 });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(packman.threeobj.position.x, packman.threeobj.position.y, packman.threeobj.position.z);
  sprite.scale.set(2, 2, 2);
  scene.add(sprite);
  return sprite;
};