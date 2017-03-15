'use strict';

let Packman = class {
  constructor() {
    this.speedMove = 0.5;
    this.size = new THREE.Vector3(1, 1, 1);
    this.sphere3;
    this.speedEat = 2;
    this.sphereBottomParams = {
      radius: 1.5,
      widthSegments: 50,
      heightSegments: 50,
      phiStart: -Math.PI / 2,
      phiLength: Math.PI * 2,
      thetaStart: Math.PI / 2,
      thetaLength: Math.PI
    };
  }

  create() {
    this.threeobj = this.draw();
    this.sphere3 = new THREE.Sphere(this.threeobj.position, this.threeobj.children[1].geometry.boundingSphere.radius);
    this.initEat();
    controls.target = this.threeobj.position;
  };

  initEat() {
    let currentAngle = 90;
    let startAngle = 90;
    let endAngle = 45;
    let direction = false;
    setTimeout(function run() {
      if (currentAngle >= startAngle) {
        direction = !direction;
      }
      if (currentAngle <= endAngle) {
        direction = !direction;
      }
      currentAngle += direction ? -this.speedEat : this.speedEat;
      this.threeobj.children[0].rotation.z = currentAngle * Math.PI / 180;
      setTimeout(run.bind(this), 10);
    }.bind(this), 100)
  };

  move() {
    this.threeobj.position.x += this.speedMove * mouse.x;
    this.threeobj.position.z += this.speedMove * mouse.y;

    let dy = mouse.x + 0;
    let dx = mouse.y + 0;
    let radians = Math.atan2(dy, dx);
    this.threeobj.rotation.y = radians;
    this.threeobj.rotation.x = mouse.y;
  };

  collision() {
    this.sphere3 = new THREE.Sphere(this.threeobj.position, this.threeobj.children[1].geometry.boundingSphere.radius);
    for (let i = 0; i < rivals.elements.length; i++) {
      let rivalBox3 = new THREE.Box3().setFromObject(rivals.elements[i]);
      let collision = this.sphere3.intersectsBox(rivalBox3);
      if (collision) {
        if (rivals.elements[i].geometry.type == 'BoxGeometry') {
          this.threeobj.scale.set(this.size.x += 0.02, this.size.y += 0.02, this.size.z += 0.02);
          this.threeobj.position.y += 0.03;
          this.threeobj.children[1].geometry.boundingSphere.radius += 0.03;
          rivals.rivalsLength--;
          rivals.deletedElements++;
        } else {
          if (getSumPackmanSize() < 1.1) {
            return;
          }
          this.threeobj.scale.set(this.size.x -= 0.02, this.size.y -= 0.02, this.size.z -= 0.02);
          this.threeobj.position.y -= 0.03;
          this.threeobj.children[1].geometry.boundingSphere.radius -= 0.03;
        }
        scene.remove(rivals.elements[i]);
        rivals.elements.splice(i, 1);
        statsScore.innerHTML = `Elements: ${rivals.rivalsLength + rivals.deletedElements}/${rivals.rivalsLength}`;
        statsPackmanSize.innerHTML = `Size ${requiredPackmanSize}/${(getSumPackmanSize()).toFixed(2)}`;
        scene.remove(statsScoreSprite);
        statsScoreSprite = createCanvasSpriteText(rivals.rivalsLength);
        isFinishGame();
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
    /*  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
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
        ]);*/

    const sphereTopGeometry = new THREE.SphereGeometry(1.5, 50, 50, -Math.PI / 180, Math.PI * 2, 90 * Math.PI / 180, Math.PI);
    const sphereTopMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00 });
    const sphereTopMesh = new THREE.Mesh(sphereTopGeometry, sphereTopMaterial);
    sphereTopMesh.position.y = Math.PI / 2;
    sphereTopMesh.rotation.z = Math.PI / 2;
    sphereTopMesh.castShadow = true;

    const eyeGeometry = new THREE.CircleGeometry(0.4, 7);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeLeft.rotation.x = -90 * Math.PI / 180;
    eyeLeft.position.set(0.8, 2.9, 0.6);
    const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeRight.rotation.x = -90 * Math.PI / 180;
    eyeRight.position.set(0.8, 2.9, -0.6);

    const groupSphereTop = new THREE.Group();
    groupSphereTop.add(sphereTopMesh);
    groupSphereTop.add(eyeLeft);
    groupSphereTop.add(eyeRight);
    groupSphereTop.position.z = -90 * Math.PI / 180;
    groupSphereTop.rotation.y = 90 * Math.PI / 180;

    const sphereBottomGeometry = new THREE.SphereGeometry(
      this.sphereBottomParams.radius,
      this.sphereBottomParams.widthSegments,
      this.sphereBottomParams.heightSegments,
      this.sphereBottomParams.phiStart,
      this.sphereBottomParams.phiLength,
      this.sphereBottomParams.thetaStart,
      this.sphereBottomParams.thetaLength);
    sphereBottomGeometry.computeBoundingSphere();
    const sphereBottomMaterial = new THREE.MeshPhongMaterial({ color: 0xFFCC00 });
    const sphereBottomMesh = new THREE.Mesh(sphereBottomGeometry, sphereBottomMaterial);
    sphereBottomMesh.castShadow = true;
    const groupMesh = new THREE.Group();
    groupMesh.add(groupSphereTop, sphereBottomMesh);
    groupMesh.position.set(0, this.sphereBottomParams.radius, 0);
    scene.add(groupMesh);

    return groupMesh;
  };

};