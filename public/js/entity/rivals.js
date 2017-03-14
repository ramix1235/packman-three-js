'use strict';

let Rivals = class {
  constructor() {
    this.elements = [];
    this.rivalsLength = 0;
  }

  create() {
    // let count = 600, min = -58, max = 58;
    let count = 160, min = -48, max = 48;
    const boxGeometry = new THREE.BoxGeometry(3, 3, 1);
    boxGeometry.computeBoundingBox();
    const boxTexture = new THREE.TextureLoader().load('public/textures/box-rivals.png');
/*    const boxMaterial = new THREE.MultiMaterial([
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
    ]);*/

    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00, specular: 0xFFFFFF })

    let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 6);
    const cylinderTexture = new THREE.TextureLoader().load('public/textures/rivals-cylinder.jpg');    
    let cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xA2231D, specular: 0xFFFFFF });

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

      let number = Math.floor(Math.random() * (180 - 0 + 1)) + 0;
      let mesh;
      if (number % 2 === 0) {
        mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.position.set(positionX, 1.5, positionZ);
        this.rivalsLength++;
      } else {
        mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        mesh.position.set(positionX, 0.5, positionZ);
      }
      mesh.rotation.y = number * Math.PI / 180;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
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