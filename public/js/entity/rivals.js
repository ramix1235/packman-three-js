'use strict';

let Rivals = class {
  constructor() {
    this.elements = [];
    this.rivalsLength = 0;
    this.deletedElements = 0;
    this.boxParams = {
      width: 3,
      height: 3,
      depth: 1
    };
    this.cylinderParams = {
      radiusTop: 1,
      radiusBottom: 1,
      height: 1,
      radiusSegments: 6
    };
  }

  create(count, min, max) {
    const boxGeometry = new THREE.BoxGeometry(this.boxParams.width, this.boxParams.height, this.boxParams.depth);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00, specular: 0xFFFFFF })

    const cylinderGeometry = new THREE.CylinderGeometry(this.cylinderParams.radiusTop, this.cylinderParams.radiusBottom, this.cylinderParams.height, this.cylinderParams.radiusSegments);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xA2231D, specular: 0xFFFFFF });

    let distance, newCoordinateX, newCoordinateZ;
    this.elements.push(packman.threeobj);
    for (let i = 0; i < count; i++) {
      createNewСoordinates();
      // сравниваем эти координаты с уже существующими
      for (let j = 0; j < this.elements.length; j++) {
        // между новыми кординатами и массивом существующих
        distance = distanceBetweenTwoPoints(j, this.elements);
        // если где-то пересечение
        while (distance < 4) {
          createNewСoordinates();
          // опять сравниваем их с остальными
          for (let k = 0; k < this.elements.length; k++) {
            // между новыми кординатами и массивом существующих
            distance = distanceBetweenTwoPoints(k, this.elements);
            // если где-то пересечение
            if (distance < 4) {
              break;
            };
          };
        };

      };

      let randomNumber = Math.floor(Math.random() * (180 - 0 + 1)) + 0;
      let prototypeMesh;
      if (randomNumber % 2 === 0) {
        prototypeMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        prototypeMesh.position.set(newCoordinateX, this.boxParams.height / 2, newCoordinateZ);
        this.rivalsLength++;
      } else {
        prototypeMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        prototypeMesh.position.set(newCoordinateX, this.cylinderParams.height / 2, newCoordinateZ);
      }
      prototypeMesh.rotation.y = randomNumber * Math.PI / 180;
      prototypeMesh.castShadow = true;
      prototypeMesh.receiveShadow = true;
      scene.add(prototypeMesh);
      this.elements.push(prototypeMesh);

      function createNewСoordinates() {
        newCoordinateX = Math.floor(Math.random() * (max - min + 1) + min);
        newCoordinateZ = Math.floor(Math.random() * (max - min + 1) + min);
      };

      function distanceBetweenTwoPoints(j, elements) {
        return Math.sqrt(Math.pow(newCoordinateX - elements[j].position.x, 2) + Math.pow(newCoordinateZ - elements[j].position.z, 2));
      };
    };
    this.elements.shift(packman.threeobj);
  }

}