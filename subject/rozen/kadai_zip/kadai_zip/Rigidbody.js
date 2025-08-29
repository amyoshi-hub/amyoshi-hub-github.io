import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Rigidbody {
  constructor(three, mass = 1, length = 1) {
    this.mass = mass;
    this.g = 9.8;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.externalForce = new THREE.Vector3();


    //重心切り替えのインターバル
    this.groundSwitchCooldown = 0;  // 重心切り替えのクールダウンタイム（秒）
    this.groundSwitchInterval = 0.3;　　
    this.length = length;
    this.angle = 3;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
  }
  //重力
  applyGravity(dt) {
    const gravityForce = new THREE.Vector3(0, -this.g * this.mass, 0);
    const totalForce = gravityForce.add(this.externalForce.clone());
    this.acceleration.copy(totalForce.divideScalar(this.mass));
    this.velocity.addScaledVector(this.acceleration, dt);
    this.position.addScaledVector(this.velocity, dt);
    this.externalForce.set(0, 0, 0);

    //着地時の動作
    if (this.isGrounded && this.velocity.y < 0) {
      this.position.y = 2;
      this.velocity.y = 0;
    }
    if(this.isGrounded){
       this.applyFriction(0.8, dt);
    }
  }
  
   //摩擦力
  applyFriction(coefficient, dt) {
  // 水平方向の速度だけに摩擦力をかける（y方向は重力で制御）
    const frictionForceX = -Math.sign(this.velocity.x) * coefficient * this.mass * this.g;
    const frictionAccelerationX = frictionForceX / this.mass;

    // 摩擦加速度を速度に加算（dtを掛けて速度の変化量）
    this.velocity.x += frictionAccelerationX * dt;

  // 摩擦力によって速度の符号が逆転しないように clamp（0以下なら0にする）
    if (Math.sign(this.velocity.x) !== Math.sign(this.velocity.x + frictionAccelerationX * dt)) {
    this.velocity.x = 0;
    }
  }
  //回転力
  applyRotation(dt, leftGround, rightGround) {
    if (!leftGround && rightGround) {
    this.angularVelocity += 10;  // 右足を軸に倒れる方向に回転を足す例
  } else if (!rightGround && leftGround) {
    this.angularVelocity -= 10;  // 左足を軸に倒れる方向に回転を足す例
  } else {
    // 両足接地などは自然に戻る方向に力をかける
    const torque = -this.mass * this.g * (this.length / 2) * Math.sin(this.angle);
    const I = (1 / 3) * this.mass * Math.pow(this.length, 2);
    this.angularAcceleration = torque / I;
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    this.angularVelocity *= 0.999;
  }
    this.angle += this.angularVelocity *dt;
 } 
  
    setGrounded(leftGrounded, rightGrounded, dt) {
  if (!leftGrounded && !rightGrounded) {
    // 空中ならインターバル関係なく即判定切り替え
    this.leftGrounded = false;
    this.rightGrounded = false;
    this.isGrounded = false;
    this.groundSwitchCooldown = 0; // クールダウンリセットもお好みで
  } else {
    // 地面にいるときだけインターバル判定
    this.groundSwitchCooldown -= dt;
    //if (this.groundSwitchCooldown <= 0) {
      if (this.leftGrounded !== leftGrounded || this.rightGrounded !== rightGrounded) {
        this.leftGrounded = leftGrounded;
        this.rightGrounded = rightGrounded;
        this.isGrounded = leftGrounded || rightGrounded;
        this.groundSwitchCooldown = this.groundSwitchInterval;
      }
    //}
  }
}
  applyForce(force) {
    this.externalForce.add(force);
  }
}

