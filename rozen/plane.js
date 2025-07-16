import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { Rigidbody } from './Rigidbody.js';

export class Body {
  constructor(scene, ground, initPosition = new THREE.Vector3(0, 2, 0)) {
    this.pivot = new THREE.Object3D();
    scene.add(this.pivot);

    this.ground = ground;

    this.rigid = new Rigidbody(THREE, 1, 2);
    this.rigid.position.copy(initPosition);

    // 胴体 (細長い長方形)
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.3);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x5555ff });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.body.position.copy(this.rigid.position);
    this.pivot.add(this.body);

    // 翼（左右）
    const wingGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.4);
    const wingMaterial = new THREE.MeshBasicMaterial({ color: 0x3333aa });
    this.leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    this.rightWing = new THREE.Mesh(wingGeometry, wingMaterial);

    this.leftWing.position.set(0, 0, 0.75);
    this.rightWing.position.set(0, 0, 0.75);
    this.leftWing.rotateY(Math.PI / 2);
    this.rightWing.rotateY(Math.PI / 2);
    this.body.add(this.leftWing);
    this.body.add(this.rightWing);

    // 尾翼
    const tailGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
    const tailMaterial = new THREE.MeshBasicMaterial({ color: 0x222288 });
    this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
    this.tail.position.set(-0.7, 0.4, 0);
    this.body.add(this.tail);

    // 飛行機向き用の角度初期化
    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;
  }

  animate(dt, time) {
   

  //現在の速度ベクトルを取得
  const velocity = this.rigid.velocity.clone();
  const speed = velocity.length();

  if(speed > 0.01) {
    //速度方向を正規化して単位ベクトル化
    const velocityDir = velocity.clone().normalize();

    //上方向ベクトル（ワールド座標で）
    const upDir = new THREE.Vector3(0, 1, 0);

    //翼の迎角(Angle of Attack)を計算（速度方向と胴体の前方ベクトルとの角度差）
    const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(this.body.quaternion);
    const angleOfAttack = forward.angleTo(velocityDir) - Math.PI / 2; // おおよそ迎角

    //揚力の大きさの計算 (簡易モデル)
    const liftMagnitude = 0.5 * speed * speed * Math.max(0, Math.sin(angleOfAttack)) * 1.5; // 1.5は係数（調整用）

    //揚力ベクトルは速度に垂直で上向き
    const liftDir = velocityDir.clone().cross(upDir).cross(velocityDir).normalize();
    //揚力をrigidbodyに加える
    const liftForce = liftDir.multiplyScalar(liftMagnitude);
    this.rigid.applyForce(liftForce);
    
  }
  

  //抗力(Drag)を簡単に速度逆方向にかける（速度が速いほど強く）
  const dragMagnitude = speed * speed * 0.05; // 係数は調整用
  const dragForce = velocity.clone().normalize().multiplyScalar(-dragMagnitude);
  this.rigid.applyForce(dragForce);

  //重力はrigidbodyで処理済み
  //this.rigid.applyGravity(dt);

  //姿勢制御：速度方向に機首を近づける
  if(speed > 0.01) {
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      velocity.clone().normalize()
    );
    this.body.quaternion.slerp(targetQuat, 0.1); // 徐々に回転
  }
  if(typeof this.i === 'undefined') this.i = -30;
  if(this.i > 30) this.i = -30;
  this.body.position.set(this.i * 0.3, 5, -10);
  this.i++;
  console.log(this.body.position);
  //見た目更新
  //this.body.position.copy(this.rigid.position);
}
}

