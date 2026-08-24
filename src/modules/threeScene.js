import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.querySelector('#webgl-canvas');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient Lighting
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xe6a756, 3, 60);
  pointLight.position.set(10, 15, 10);
  scene.add(pointLight);

  // 3D Organic Coffee Beans
  const beanGeometry = new THREE.SphereGeometry(0.75, 16, 16);
  beanGeometry.scale(1, 1.45, 0.65);

  const beanMaterial = new THREE.MeshStandardMaterial({
    color: 0x361c0e,
    roughness: 0.35,
    metalness: 0.15
  });

  const beansGroup = new THREE.Group();
  const totalBeans = 45;

  for (let i = 0; i < totalBeans; i++) {
    const bean = new THREE.Mesh(beanGeometry, beanMaterial);

    bean.position.set(
      (Math.random() - 0.5) * 55,
      (Math.random() - 0.5) * 55,
      (Math.random() - 0.5) * 35
    );

    bean.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const scale = 0.6 + Math.random() * 0.8;
    bean.scale.set(scale, scale * 1.3, scale * 0.7);

    bean.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: (Math.random() - 0.5) * 0.015,
      floatSpeed: 0.005 + Math.random() * 0.01
    };

    beansGroup.add(bean);
  }
  scene.add(beansGroup);

  // Floating Golden Firefly / Dust Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 65;
    positions[i + 1] = (Math.random() - 0.5) * 65;
    positions[i + 2] = (Math.random() - 0.5) * 45;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xf6cb85,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    const targetX = mouseX * 2.5;
    const targetY = mouseY * 2.5;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    beansGroup.children.forEach((bean) => {
      bean.rotation.x += bean.userData.rotSpeedX;
      bean.rotation.y += bean.userData.rotSpeedY;
      bean.position.y += Math.sin(time + bean.position.x) * bean.userData.floatSpeed;
    });

    particleSystem.rotation.y = time * 0.02;
    particleSystem.rotation.x = time * 0.01;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}