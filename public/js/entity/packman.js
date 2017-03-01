'use strict';

let Packman = class {
  constructor() {

  }

  createPackman() {
    this.threeobj = this.draw();
    controls.target = this.threeobj.position;
  }

  sayHi() {
    alert('Packman!');
  }

  move() {
    this.threeobj.position.x += mouse.x;
    this.threeobj.position.z += mouse.y;
  }

  draw() {
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    // const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const boxTexture = new THREE.TextureLoader().load('public/textures/crate.gif');
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
    let mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 1.5, 0);
    directionalLight.target = mesh;
    scene.add(mesh);

    return mesh;
  }

};