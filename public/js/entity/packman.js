'use strict';

let Packman = class {
  constructor() {
    this.speed = 0.5;
    this.size = new THREE.Vector3(1, 1, 1);
    this.groupMesh = new THREE.Group();
    this.eatSpeed;
  }

  create() {
    this.threeobj = this.draw();
    controls.target = this.threeobj.position;
    this.eatInit();
  };

  eatInit() {
    let currentAngle = 90;
    let startAngle = 90;
    let endAngle = 45;
    let direction = false;
    this.eatSpeed = 2;
    setTimeout(function run() {
      if (currentAngle >= startAngle) {
        direction = true;
      }
      if (currentAngle <= endAngle) {
        direction = false;
      }
      currentAngle += direction ? -this.eatSpeed : this.eatSpeed;

      this.groupMesh.children[0].rotation.z = Math.PI / 180 * currentAngle;
      setTimeout(run.bind(this), 10);
    }.bind(this), 100)
  };

  move() {
    let position = this.threeobj.position;
    position.x += this.speed * mouse.x;
    position.z += this.speed * mouse.y;

    let rotation = this.threeobj.rotation;
    let dy = mouse.x + 0;
    let dx = mouse.y + 0;
    let radians = Math.atan2(dy, dx);
    rotation.y = radians;

    this.threeobj.rotation.x = mouse.y;

    spotLight.position.set(position.x, 25, position.z);
  };

  collision() {
    //let packmanBox3 = new THREE.Box3().setFromObject(this.threeobj);
    /* let boxHelper = new THREE.BoxHelper(packmanBox3, 0xffffff);
    scene.add(boxHelper);*/
    let packmanSphere3 = new THREE.Sphere(this.threeobj.position, this.threeobj.children[1].geometry.boundingSphere.radius);
    for (let i = 0; i < rivals.elements.length; i++) {
      let rivalBox3 = new THREE.Box3().setFromObject(rivals.elements[i]);
      //let collision = packmanBox3.intersectsBox(rivalBox3);
      //let rivalSphere3 = new THREE.Sphere(rivals.elements[i].position, rivals.elements[i].geometry.boundingSphere.radius);   
      //let collision = packmanSphere3.intersectsSphere(rivalSphere3);
      let collision = packmanSphere3.intersectsBox(rivalBox3);
      if (collision) {
        scene.remove(rivals.elements[i]);
        rivals.elements.splice(i, 1);
        this.threeobj.scale.set(this.size.x += 0.02, this.size.y += 0.02, this.size.z += 0.02);
        this.threeobj.position.y += 0.03;
        this.threeobj.children[1].geometry.boundingSphere.radius += 0.03;
      }
    }

    // expand THREE.js Sphere to support collision tests vs Box3
    // we are creating a vector outside the method scope to
    // avoid spawning a new instance of Vector3 on every check
    THREE.Sphere.__closest = new THREE.Vector3();
    THREE.Sphere.prototype.intersectsBox = function (box) {
      // get box closest point to sphere center by clamping
      THREE.Sphere.__closest.set(this.center.x, this.center.y, this.center.z);
      THREE.Sphere.__closest.clamp(box.min, box.max);

      let distance = this.center.distanceToSquared(THREE.Sphere.__closest);
      return distance < (this.radius * this.radius);
    };

    /* let originPoint = this.threeobj.position.clone();
    let packmanBox3 = new THREE.Box3().setFromObject(this.threeobj);
    for (let vertexIndex = 0; vertexIndex < this.threeobj.geometry.vertices.length; vertexIndex++) {
      let localVertex = this.threeobj.geometry.vertices[vertexIndex].clone();
      let globalVertex = localVertex.applyMatrix4(this.threeobj.matrix);
      let directionVector = globalVertex.sub(this.threeobj.position);
 
      let raycaster = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      let collisionResults = raycaster.intersectObjects(rivals.elements);
      // for (let i = 0; i < collisionResults.length; i++) {
      if (collisionResults.length > 0) {
        // let rivalBox3 = new THREE.Box3().setFromObject(collisionResults[i].object);
        let rivalBox3 = new THREE.Box3().setFromObject(collisionResults[0].object);
        let collision = packmanBox3.intersectsBox(rivalBox3);
        if (collision) {
          // this.threeobj.scale.set(this.size.x += 0.02, this.size.y += 0.02, this.size.z += 0.02);
          // this.threeobj.position.y += 0.03;
          // scene.remove(collisionResults[i].object);
          scene.remove(collisionResults[0].object);
        }
      }
    }*/

    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //   intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //   for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    /* let originPoint = this.threeobj.position.clone();
    for (let vertexIndex = 0; vertexIndex < this.threeobj.geometry.vertices.length; vertexIndex++) {
      let localVertex = this.threeobj.geometry.vertices[vertexIndex].clone();
      let globalVertex = localVertex.applyMatrix4(this.threeobj.matrix);
      let directionVector = globalVertex.sub(this.threeobj.position);
  
      let raycaster = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      let collisionResults = raycaster.intersectObjects(rivals.elements);
      for (let i = 0; i < collisionResults.length; i++) {
        this.threeobj.scale.set(this.size.x += 0.02, this.size.y += 0.02, this.size.z += 0.02);
        this.threeobj.position.y += 0.03;
        rivals.elements.forEach((item, i, arr) => {
          if (item === collisionResults[0].object) {
            scene.remove(item);
            arr.splice(i, 1);
          }
        });
      }
    }*/
  };

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

    // const sphereGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, 0, Math.PI); // default

    // const sphereGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, Math.PI * 2, Math.PI / 2);
    // const sphereGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, Math.PI / 2, Math.PI);

    // const sphereGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, 0, Math.PI / 2);

    /*    const sphereTexture = new THREE.TextureLoader().load('public/textures/sphere.jpg');
        const sphereMaterial = new THREE.MeshLambertMaterial({ map: sphereTexture });
    
        const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(0, 1.5, 0);
        spotLight.target = mesh;
        scene.add(mesh);*/

    const sphereTopGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, Math.PI / 2, Math.PI);
    const sphereTopTexture = new THREE.TextureLoader().load('public/textures/crate.gif');
    const sphereTopMaterial = new THREE.MeshLambertMaterial({ map: sphereTopTexture });
    const sphereTopMesh = new THREE.Mesh(sphereTopGeometry, sphereTopMaterial);
    sphereTopMesh.position.y = Math.PI / 2;
    sphereTopMesh.rotation.z = Math.PI / 2;
    sphereTopMesh.castShadow = true;

    const groupSphereTop = new THREE.Group();
    groupSphereTop.add(sphereTopMesh);
    groupSphereTop.position.z = -Math.PI / 180 * 90;
    groupSphereTop.rotation.y = Math.PI / 180 * 90;

    //groupSphereTop.rotation.z = Math.PI / 180 * 65;

    const sphereBottomGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 2, Math.PI * 2, Math.PI / 2, Math.PI);
    const sphereBottomTexture = new THREE.TextureLoader().load('public/textures/crate.gif');
    const sphereBottomMaterial = new THREE.MeshLambertMaterial({ map: sphereBottomTexture });
    const sphereBottomMesh = new THREE.Mesh(sphereBottomGeometry, sphereBottomMaterial);
    sphereBottomMesh.castShadow = true;

    this.groupMesh.add(groupSphereTop, sphereBottomMesh);
    this.groupMesh.position.set(0, 1.5, 0);
    spotLight.target = this.groupMesh;
    scene.add(this.groupMesh);

    return this.groupMesh;
  };

};