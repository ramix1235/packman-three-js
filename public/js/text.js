'use strict';

function create3DText(text, posX, posY, posZ) {
  const loader = new THREE.FontLoader();
  loader.load('../../public/fonts/KenPixel_Regular.json', (font) => {
    const textGeometry = new THREE.TextGeometry(text, {
      font: font,
      size: 2.5,
      height: 0.3
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xA2231D, specular: 0xFFFFFF });
    let text3D = new THREE.Mesh(textGeometry, textMaterial);
    text3D.position.set(posX, posY, posZ);
    text3D.castShadow = true;
    text3D.receiveShadow = true;
    scene.add(text3D);
  });
};

function createHTMLText(text, posX, posY) {
  const textHTML = document.createElement('div');
  textHTML.style.position = 'absolute';
  textHTML.style.color = '#E32636';
  textHTML.style.fontSize = 17 + 'pt';
  textHTML.innerHTML = text;
  textHTML.style.top = posY + 'px';
  textHTML.style.left = posX + 'px';
  document.body.appendChild(textHTML);
  return textHTML;
};

function createCanvasSpriteText(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.canvas.height = 128;
  context.canvas.width = 256;
  context.textAlign = 'center';
  context.imageSmoothingEnabled = false;
  context.font = '65px Arial';
  context.fillStyle = 'rgba(165, 35, 29, 0.5)';
  context.fillText(text, 125, 85);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xFFCC00 });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2, 2, 2);
  scene.add(sprite);
  return sprite;
};