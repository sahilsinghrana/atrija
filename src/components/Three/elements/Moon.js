import * as THREE from 'three';

export function createMoon(scene) {
  const moonGeo = new THREE.SphereGeometry(1.5, 64, 64);
  const posAttr = moonGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const noise = Math.sin(x * 8) * Math.cos(y * 6) * 0.05 +
                  Math.sin(z * 12) * 0.03;
    posAttr.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
  }
  moonGeo.computeVertexNormals();
  
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e7,
    emissive: 0x444030,
    emissiveIntensity: 0.4,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(0, 3, -5);
  moon.userData.animate = (obj, t) => {
    obj.rotation.y = t * 0.05;
    obj.position.y = 3 + Math.sin(t * 0.3) * 0.2;
  };
  
  const glowGeo = new THREE.SphereGeometry(1.8, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xfff5d0,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.copy(moon.position);
  glow.userData.animate = (obj, t) => {
    obj.position.y = 3 + Math.sin(t * 0.3) * 0.2;
    obj.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
  };
  
  scene.add(moon);
  scene.add(glow);
  return { moon, glow };
}
