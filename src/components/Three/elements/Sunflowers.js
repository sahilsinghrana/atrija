import * as THREE from 'three';

function createSunflower(x, z, scale) {
  scale = scale || 1;
  const group = new THREE.Group();
  
  const stemGeo = new THREE.CylinderGeometry(0.03 * scale, 0.05 * scale, 2 * scale, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.9 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = scale;
  group.add(stem);
  
  const petalCount = 20;
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xf5c800,
    emissive: 0x332200,
    emissiveIntensity: 0.2,
    roughness: 0.6,
    side: THREE.DoubleSide
  });
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petalGeo = new THREE.PlaneGeometry(0.15 * scale, 0.4 * scale);
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(
      Math.cos(angle) * 0.2 * scale,
      2 * scale,
      Math.sin(angle) * 0.2 * scale
    );
    petal.rotation.x = -0.5;
    petal.rotation.y = angle;
    group.add(petal);
  }
  
  const centerGeo = new THREE.SphereGeometry(0.15 * scale, 16, 16);
  const centerMat = new THREE.MeshStandardMaterial({ color: 0x4a2800, roughness: 1.0 });
  const center = new THREE.Mesh(centerGeo, centerMat);
  center.position.y = 2 * scale;
  group.add(center);
  
  group.position.set(x, 0, z);
  return group;
}

export function createSunflowers(scene, count) {
  count = count || 12;
  const flowers = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 16;
    const z = (Math.random() - 0.5) * 8 + 4;
    const scale = 0.6 + Math.random() * 0.6;
    const flower = createSunflower(x, z, scale);
    flower.userData.animate = (obj, t) => {
      obj.rotation.z = Math.sin(t * 0.5 + obj.position.x) * 0.05;
      obj.rotation.x = Math.sin(t * 0.3 + obj.position.z) * 0.03;
    };
    scene.add(flower);
    flowers.push(flower);
  }
  return flowers;
}
