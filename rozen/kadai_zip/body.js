import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { Rigidbody } from './Rigidbody.js';

export class Body {
  constructor(scene, ground, initPosition = new THREE.Vector3(0, 2, 0)) {
    //回転基盤　体の下にあり足のraycasによって回転
    this.pivot = new THREE.Object3D();
    scene.add(this.pivot);

    this.ground = ground;

    this.rigid = new Rigidbody(THREE, 1, 2);
    this.rigid.position.copy(initPosition);

    // ボディ
    const bodyGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xFEDCBD });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.body.position.copy(this.rigid.position);
    this.pivot.add(this.body);
    //scene.add(this.body);
    //body pivot
    const bodyPos = this.rigid.position;

    // 頭
    const headGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xFEDCBD });
    this.head = new THREE.Mesh(headGeometry, headMaterial);
    this.head.position.set(0, 1.2, 0);
    this.body.add(this.head);

    // 足（右）
    this.right_leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    this.right_leg.position.set(-0.2, -1.5, 0);
    this.body.add(this.right_leg);

    // 足（左）
    this.left_leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    ;
    this.left_leg.position.set(-0.2, -1.5, 0);
    this.body.add(this.left_leg);

    //this.body.add(this.left_leg);
    this.body.add(this.left_leg);
  }

  animate(dt, time) {
    //leg用のbody基準
    const bodyPos = this.rigid.position;
    this.right_leg.position.set(
	bodyPos.x - 0.20,
	bodyPos.y - 1.5,
	bodyPos.z
    );

    this.left_leg.position.set(
	bodyPos.x + 0.20,
	bodyPos.y - 1.5,
	bodyPos.z
    );
    
    // レイキャスト
    const raycaster = new THREE.Raycaster();
    const threshold = 1;
    const direction = new THREE.Vector3(0, -1, 0);

    //足の基準
    const leftOrigin = this.left_leg.getWorldPosition(new THREE.Vector3());
    const rightOrigin = this.right_leg.getWorldPosition(new THREE.Vector3());

    //片足づつraycasを設定
    const leftFootBottom = this.left_leg.localToWorld(new THREE.Vector3(0, -0.5, 0));
    const rightFootBottom = this.right_leg.localToWorld(new THREE.Vector3(0, -0.5, 0));
    raycaster.set(leftOrigin, direction);
    const leftHit = raycaster.intersectObject(this.ground);

    raycaster.set(rightOrigin, direction);
    const rightHit = raycaster.intersectObject(this.ground);

    //地面設置判定
    const leftGrounded = leftHit.length > 0 && leftHit[0].distance < threshold;
    const rightGrounded = rightHit.length > 0 && rightHit[0].distance < threshold;

    this.rigid.setGrounded(leftGrounded, rightGrounded);

    // 物理挙動
    this.rigid.applyGravity(dt);
    //this.rigid.applyRotation(dt);
    this.rigid.applyRotation(dt, leftGrounded, rightGrounded);
    //足のスイング（仮）
    if (!leftGrounded) {
  	this.left_leg.rotation.x = Math.sin(time * 2) * 0.2;
    }
    if (!rightGrounded) {
  	this.right_leg.rotation.x = Math.sin(time * 2 + Math.PI) * 0.2;
    }

    // 見た目更新
    this.body.position.copy(this.rigid.position);
    this.body.rotation.z = this.rigid.angle;
      console.log("Left foot:", leftHit.length > 0 ? leftHit[0].distance : "no hit");
  console.log("Right foot:", rightHit.length > 0 ? rightHit[0].distance : "no hit");
  console.log("Is grounded:", leftGrounded || rightGrounded);
  }
}

