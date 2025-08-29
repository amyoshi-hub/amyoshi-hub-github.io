import * as THREE from 'https://esm.sh/three@0.152.0';
import { GLTFLoader } from 'https://esm.sh/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model, mixer, clock;

export function rozen_init() {
  // スタイル定義
  const style = document.createElement('style');
  style.textContent = `
    body {
      margin: 0;
      overflow: hidden;
    }
    canvas.bg-canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    canvas.three-canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
    }
    #ui-layer {
      position: absolute;
      z-index: 2;
      color: white;
      padding: 1em;
      font-family: 'Georgia', serif;
    }
  `;
  document.head.appendChild(style);

  // 背景canvas
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgCanvas.classList.add('bg-canvas');
  document.body.appendChild(bgCanvas);

  const bgCtx = bgCanvas.getContext('2d');
  // 簡単な背景描画（星とかノイズとか）
  function drawBackground() {
    let sectors = 8;
    bgCtx.fillStyle = 'rgba(200, 100, 100, 0.1)';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    // 演出追加したいならここ
    for(let i = 0; i < sectors; i++){
	  bgCtx.save();
	  bgCtx.translate(bgCanvas.width / 4 * 3, bgCanvas.height /4 * 3);
	  bgCtx.rotate((Math.PI * 2 / sectors) * i);
	  drawSymmetricShape(bgCtx, i);
	  bgCtx.restore();
    }
    function drawSymmetricShape(ctx, x){
	ctx.beginPath();
	ctx.moveTo(0, 0);
	x = x * 10;
	const y = -100 + Math.sin(Date.now() * 0.002) * 50;
	ctx.lineTo(x + 30, y);
	ctx.lineTo(x - 30, y);
	ctx.closePath();

	ctx.fillStyle = 'rgb(255, 10, 100)';
	ctx.fill();
    }
    requestAnimationFrame(drawBackground);
  }
  
  
  function front_HTML() {
  const uiLayer = document.getElementById('ui-layer') || (() => {
    const div = document.createElement('div');
    div.id = 'ui-layer';
    document.body.appendChild(div);
    return div;
  })();

  const newButton = document.createElement('button');
  newButton.textContent = "click して頂戴";
  newButton.style.padding = '10px 20px';
  newButton.style.fontSize = '16px';
  newButton.style.cursor = 'pointer';

  const backButton = document.createElement('button');
  backButton.textContent = "Back";
  //backButton.style.padding = "10px 20px";
  //backButton.style.fontSize = "16px";
  //backButton.style.cursor = "pointer";
  backButton.addEventListener('click', () => {
	location.href = "./index.html";
  });

  newButton.addEventListener("click", () => {
    alert("ボタンが押されました");
  });

  uiLayer.appendChild(backButton);
  uiLayer.appendChild(newButton);
 }

  // Three.js 初期化
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 70, 85);
  camera.lookAt(0, -25, 0);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // 透明背景
  renderer.domElement.classList.add('three-canvas');
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load('rozen/rozen_shink2.glb', (gltf) => {
    model = gltf.scene;
    model.rotation.set(0, 0, 0);
    model.rotation.y += (-Math.PI / 2);
    //model.rotation.z += Math.PI;
    scene.add(model);
    
    if(gltf.animations && gltf.animations.length > 0){
	mixer = new THREE.AnimationMixer(model);
	const action = mixer.clipAction(gltf.animations[0]);
	//const 例えばblink = mixer.clipAction(gltf.animations[1]);

	action.play();
	//blink(); こうやったりweight() chainで再生比率も変えれる
	
    }
  });
    function animate() {
    drawBackground();
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(mixer){
	mixer.update(delta);
    }
    //if(model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  front_HTML();

  animate();
}

