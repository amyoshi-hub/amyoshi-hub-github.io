import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { Body } from './plane.js';


let scene, camera, renderer, body;

let cameraRotationX = 0;
let cameraRotationY = 0;
let isPointerLocked = false;

let time = 5.1;
let direction = 1;
let prevTime = performance.now();

export function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 3, 3);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);

  const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide })
  );
  ground.rotation.x = Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

  const initPos = new THREE.Vector3(0, 5, 0);
  body = new Body(scene, ground, initPos);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
}

// Pointer Lock APIの設定
document.body.addEventListener("click", () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  isPointerLocked = document.pointerLockElement === renderer.domElement;
  if (!isPointerLocked) {
    //console.log("マウスロックが解除されました");
  }
});

// マウスイベントリスナー
document.addEventListener("mousemove", (e) => {
  if (!isPointerLocked) return;

  const deltaX = e.movementX || 0;
  const deltaY = e.movementY || 0;

  cameraRotationY -= deltaX * 0.002;
  cameraRotationX -= deltaY * 0.002;

  cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationX));

  camera.rotation.y = cameraRotationY;
  camera.rotation.x = cameraRotationX;
});

let prev = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = (now - prevTime) / 1000; // 秒単位
  prevTime = now;

  time += direction * 0.01;

  if (time >= 6 || time <= 4) {
    direction *= -1;
  }

  body.animate(dt, time);

  renderer.render(scene, camera);
};

//init();

