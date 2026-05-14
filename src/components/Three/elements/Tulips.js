import * as THREE from 'three';

function createTulip(x, z, color, scale) {
  scale = scale || 1;
  color = color || 0xcc2244;
  const group = new THREE.Group();
  
  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.02 * scale, 0.03 * scale, 1.5 * scale, 6);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a1e, roughness: 0.9 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.75 * scale;
  group.add(stem);
  
  // Leaves
  for (let i = 0; i < 2; i++) {
    const leafGeo = new THREE.PlaneGeometry(0.15 * scale, 0.8 * scale);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x3a7a2e,
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set((i === 0 ? -0.1 : 0.1) * scale, 0.5 * scale, 0);
    leaf.rotation.z = (i === 0 ? 0.3 : -0.3);
    leaf.rotation.y = (i === 0 ? -0.2 : 0.2);
    group.add(leaf);
  }
  
  // Tulip cup (petals)
  const cupGeo = new THREE.CylinderGeometry(0.08 * scale, 0.02 * scale, 0.4 * scale, 8, 1, true);
  const cupMat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: new THREE.Color(color).multiplyScalar(0.2),
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.position.y = 1.5 * scale;
  group.add(cup);
  
  group.position.set(x, 0, z);
  return group;
}

export function createTulips(scene, count) {
  count = count || 8;
  const colors = [0xcc2244, 0xff6699, 0xffcc00, 0x9933cc, 0xff4400];
  const tulips = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 6 + 3;
    const scale = 0.5 + Math.random() * 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tulip = createTulip(x, z, color, scale);
    tulip.userData.animate = (obj, t) => {
      obj.rotation.z = Math.sin(t * 0.4 + obj.position.x * 2) * 0.04;
    };
    scene.add(tulip);
    tulips.push(tulip);
  }
  return tulips;
}
