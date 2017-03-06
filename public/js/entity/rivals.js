'use strict';

let Rivals = class {
  constructor() {
    this.elements = [];
  }

  create() {
    // let count = 600, min = -58, max = 58;
    let count = 60, min = -50, max = 50;
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const boxTexture = new THREE.TextureLoader().load('public/textures/box-rivals.jpg');
    const boxMaterial = new THREE.MultiMaterial([
      new THREE.MeshLambertMaterial({
        map: boxTexture
      }),
      new THREE.MeshLambertMaterial({
        map: boxTexture
      }),
      new THREE.MeshLambertMaterial({
        map: boxTexture
      }),
      new THREE.MeshLambertMaterial({
        map: boxTexture
      }),
      new THREE.MeshLambertMaterial({
        map: boxTexture
      }),
      new THREE.MeshLambertMaterial({
        map: boxTexture
      })
    ]);

    let positionX;
    let positionZ;
    let distance;
    this.elements.push(packman.threeobj);
    for (let i = 0; i < count; i++) {
      createNewСoordinates();
      // сравниваем эти координаты с уже существующими
      for (let j = 0; j < this.elements.length; j++) {
        // между новыми кординатами и массивом существующих
        distanceBetweenTwoPoints(j, this.elements);
        // если где-то пересечение
        while (distance < 4) {
          createNewСoordinates();
          // опять сравниваем их с остальными
          for (let k = 0; k < this.elements.length; k++) {
            // между новыми кординатами и массивом существующих
            distanceBetweenTwoPoints(k, this.elements);
            // если где-то пересечение
            if (distance < 4) {
              break;
            };
          };
        };

      };

      let mesh = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(positionX, 1.5, positionZ);
      scene.add(mesh);
      this.elements.push(mesh);

      function createNewСoordinates() {
        positionX = Math.floor(Math.random() * (max - min + 1) + min);
        positionZ = Math.floor(Math.random() * (max - min + 1) + min);
      };

      function distanceBetweenTwoPoints(j, elements) {
        distance = Math.sqrt(Math.pow(positionX - elements[j].position.x, 2) + Math.pow(positionZ - elements[j].position.z, 2));
      };
    };
    this.elements.shift(packman.threeobj);
  }

}