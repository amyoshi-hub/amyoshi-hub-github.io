import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('model.gltf', (gltf) => {
  scene.add(gltf.scene);

  // アニメーション用のMixerを作る
  const mixer = new THREE.AnimationMixer(gltf.scene);

  // アニメーションが複数あれば、使いたいものを選択
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();

  // 毎フレーム更新でmixerを更新
  animate();
  
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
  }
});

