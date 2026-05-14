import * as THREE from 'three';

export function createFlute(scene) {
  const group = new THREE.Group();
  
  // Flute body
  const bodyGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5, 16);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4a843,
    roughness: 0.3,
    metalness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.z = Math.PI * 0.15;
  group.add(body);
  
  // Finger holes
  const holeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.07, 8);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  for (let i = 0; i < 6; i++) {
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 0.03, -0.8 + i * 0.25);
    group.add(hole);
  }
  
  // Mouthpiece
  const mouthGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.3, 16);
  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0xc49833,
    roughness: 0.2,
    metalness: 0.7
  });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, 1.35, 0);
  group.add(mouth);
  
  group.position.set(3, 1, -2);
  group.rotation.y = -0.3;
  group.userData.animate = (obj, t) => {
    obj.rotation.z = Math.sin(t * 0.2) * 0.05;
    obj.position.y = 1 + Math.sin(t * 0.4) * 0.1;
  };
  
  scene.add(group);
  return group;
}
