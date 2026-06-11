import * as THREE from "three";

export function createMoon(scene) {
  const moonGroup = new THREE.Group();
  moonGroup.position.set(0, 0.5, -5);
  scene.add(moonGroup);
  scene.userData._moonGroup = moonGroup;
  scene.userData._moonBaseY = 0.5;

  const geo = new THREE.SphereGeometry(1.5, 64, 64);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    let n = Math.sin(x * 8) * Math.cos(y * 6) * 0.04 + Math.sin(z * 12) * 0.025;
    const craters = [
      { cx: 0.6, cy: 0.3, cz: 1.2, r: 0.35, d: 0.12 },
      { cx: -0.8, cy: -0.2, cz: 0.9, r: 0.25, d: 0.08 },
      { cx: 0.2, cy: -0.7, cz: 1.1, r: 0.2, d: 0.06 },
      { cx: -0.3, cy: 0.8, cz: 0.8, r: 0.18, d: 0.05 },
      { cx: 0.9, cy: 0.5, cz: 0.6, r: 0.15, d: 0.04 },
      { cx: -0.5, cy: -0.6, cz: 0.7, r: 0.22, d: 0.07 },
      { cx: 0.1, cy: 0.1, cz: 1.35, r: 0.28, d: 0.09 },
    ];
    for (let j = 0; j < craters.length; j++) {
      const cr = craters[j];
      const dx = x - cr.cx;
      const dy = y - cr.cy;
      const dz = z - cr.cz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < cr.r) {
        const t = dist / cr.r;
        const craterEffect =
          -cr.d * (1 - t * t) +
          cr.d * 0.3 * Math.exp(-((t - 0.85) * (t - 0.85)) * 50);
        n += craterEffect;
      }
    }
    pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
  }
  geo.computeVertexNormals();

  // Use a lit material so the moon responds to scene lighting and appears warmer
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e8,
    roughness: 0.6,
    metalness: 0.0,
    emissive: 0x332211,
    emissiveIntensity: 0.06,
  });
  const moon = new THREE.Mesh(geo, moonMat);
  moon.userData.animate = function (o, t) {
    o.position.x = Math.sin(t * 0.15) * 4;
    o.position.z = Math.cos(t * 0.15) * 2;
    o.position.y = Math.sin(t * 0.2) * 0.5;
    o.rotation.y = t * 0.2;
    o.rotation.x = Math.sin(t * 0.08) * 0.05;
    const breathe = 1 + Math.sin(t * 0.3) * 0.015;
    o.scale.setScalar(breathe);
  };
  moonGroup.add(moon);

  const glowGeo = new THREE.SphereGeometry(1.62, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xfff0c0,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.userData.animate = function (o, t) {
    o.position.x = Math.sin(t * 0.08) * 4;
    o.position.z = Math.cos(t * 0.08) * 2;
    o.position.y = Math.sin(t * 0.12) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.4) * 0.04);
    o.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.02;
  };
  moonGroup.add(glow);

  const haloGeo = new THREE.SphereGeometry(2.0, 24, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xfff8e0,
    transparent: true,
    opacity: 0.035,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.userData.animate = function (o, t) {
    o.position.x = Math.sin(t * 0.08) * 4;
    o.position.z = Math.cos(t * 0.08) * 2;
    o.position.y = Math.sin(t * 0.12) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.25) * 0.06);
    o.material.opacity = 0.025 + Math.sin(t * 0.35) * 0.01;
  };
  moonGroup.add(halo);

  const hazeGeo = new THREE.SphereGeometry(2.8, 20, 20);
  const hazeMat = new THREE.MeshBasicMaterial({
    color: 0xffeedd,
    transparent: true,
    opacity: 0.012,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const haze = new THREE.Mesh(hazeGeo, hazeMat);
  haze.userData.animate = function (o, t) {
    o.position.x = Math.sin(t * 0.06) * 4;
    o.position.z = Math.cos(t * 0.06) * 2;
    o.position.y = Math.sin(t * 0.1) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.18) * 0.08);
    o.material.opacity = 0.008 + Math.sin(t * 0.22) * 0.006;
  };
  moonGroup.add(haze);

  const moonLight = new THREE.PointLight(0xfff5d0, 1.2, 25, 1.5);
  moonLight.position.set(0, 0, 0);
  moonLight.userData.animate = function (o, t) {
    o.intensity = 1.2 + Math.sin(t * 0.7) * 0.15 + Math.sin(t * 1.3) * 0.08;
  };
  moonGroup.add(moonLight);
}

export function updatePaintingReveal(scene) {
  // placeholder passthrough kept for backward compatibility when referenced from elsewhere
  // real implementation lives in scene-objects.js (unchanged)
}
