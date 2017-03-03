'use strict';

let Packman = class {
  constructor() {
    this.speed = 0.5;
    this.size = new THREE.Vector3(1, 1, 1);
  }

  createPackman() {
    this.threeobj = this.draw();
    controls.target = this.threeobj.position;
  }

  move() {
    let position = this.threeobj.position;
    position.x += this.speed * mouse.x;
    position.z += this.speed * mouse.y;

    let rotation = this.threeobj.rotation;
    let dy = mouse.x + 0;
    let dx = mouse.y + 0;
    let radians = Math.atan2(dy, dx);
    rotation.y = radians;

    spotLight.position.set(position.x, 25, position.z);
  }

  collision() {
    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //   intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //   for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    let originPoint = this.threeobj.position.clone();

    for (let vertexIndex = 0; vertexIndex < this.threeobj.geometry.vertices.length; vertexIndex++) {
      let localVertex = this.threeobj.geometry.vertices[vertexIndex].clone();
      let globalVertex = localVertex.applyMatrix4(this.threeobj.matrix);
      let directionVector = globalVertex.sub(this.threeobj.position);

      let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      let collisionResults = ray.intersectObjects(rivals);
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        this.threeobj.scale.set(this.size.x += 0.05, this.size.y += 0.05, this.size.z += 0.05);
        rivals.forEach((item, i, arr) => {
          if (item === collisionResults[0].object) {
            scene.remove(item);
            arr.splice(i, 1);
          }
        });
      }
    }
  }

  draw() {
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
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
    spotLight.target = mesh;
    scene.add(mesh);

    return mesh;
  }

};