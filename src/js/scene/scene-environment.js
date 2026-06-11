import * as THREE from "three";
import { waveVS, waveFS, fireflyVS, fireflyFS } from "./scene-shaders.js";
import { isMobile, isLowEnd, scrollState } from "./scene-config.js";

export function createWaves(scene, segs) {
  segs = segs || (isLowEnd ? 32 : 64);
  const geo = new THREE.PlaneGeometry(30, 20, segs, segs);
  geo.rotateX(-Math.PI * 0.45);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWaveHeight: { value: 0.3 },
      uWaveFrequency: { value: 2.0 },
      uColor1: { value: new THREE.Vector3(0.02, 0.05, 0.15) },
      uColor2: { value: new THREE.Vector3(0.05, 0.1, 0.3) },
      uColor3: { value: new THREE.Vector3(0.1, 0.2, 0.4) },
    },
    vertexShader: waveVS,
    fragmentShader: waveFS,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const waves = new THREE.Mesh(geo, mat);
  waves.position.set(0, -2, 5);
  waves.userData.animate = function (o, t) {
    o.material.uniforms.uTime.value = t;
  };
  scene.add(waves);
}

function makeCypressShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.25, 0.3, 0.3, 0.8, 0.2, 1.5);
  shape.bezierCurveTo(0.35, 2.0, 0.3, 2.8, 0.15, 3.5);
  shape.bezierCurveTo(0.2, 4.0, 0.1, 4.5, 0.0, 5.0);
  shape.bezierCurveTo(-0.1, 4.5, -0.2, 4.0, -0.15, 3.5);
  shape.bezierCurveTo(-0.3, 2.8, -0.35, 2.0, -0.2, 1.5);
  shape.bezierCurveTo(-0.3, 0.8, -0.25, 0.3, 0, 0);
  return shape;
}

export function createCypressTrees(scene, count) {
  const shape = makeCypressShape();
  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: isLowEnd ? 1 : 2,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x0a0a12,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const positions = [
    { x: -10, z: 2, s: 1.3 },
    { x: -8, z: -1, s: 1.0 },
    { x: 10, z: 2, s: 1.2 },
    { x: 8, z: -1, s: 0.9 },
    { x: -4, z: -3, s: 1.1 },
  ];
  const trees = [];
  for (let i = 0; i < count && i < positions.length; i++) {
    const p = positions[i];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p.x, -1.5, p.z);
    mesh.scale.setScalar(p.s);
    mesh.renderOrder = -1;
    const phase = Math.random() * Math.PI * 2;
    const baseRotZ = (Math.random() - 0.5) * 0.04;
    (function (ph, br) {
      mesh.userData.animate = function (o, t) {
        o.rotation.z = br + Math.sin(t * 0.3 + ph) * 0.03;
        o.rotation.y = scrollState.current * 0.005;
        if (!isLowEnd) {
          const posAttr = o.geometry.attributes.position;
          if (posAttr && !o.userData._basePos)
            o.userData._basePos = new Float32Array(posAttr.array);
          if (posAttr && o.userData._basePos) {
            const basePos = o.userData._basePos;
            for (let v = 0; v < posAttr.count; v += 5) {
              const by = basePos[v * 3 + 1];
              if (by > 1.0) {
                posAttr.array[v * 3] =
                  basePos[v * 3] +
                  Math.sin(t * 0.5 + basePos[v * 3] * 2) * 0.02 * (by / 5.0);
              }
            }
            posAttr.needsUpdate = true;
          }
        }
      };
    })(phase, baseRotZ);
    scene.add(mesh);
    trees.push(mesh);
  }
  scene.userData._cypressTrees = trees;
}

export function createFireflies(scene, count) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const pulseSpeeds = new Float32Array(count);
  const basePositions = new Float32Array(count * 3);
  const velocities = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 24;
    const y = -1 + Math.random() * 7;
    const z = -5 + Math.random() * 13;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;
    phases[i] = Math.random() * Math.PI * 2;
    pulseSpeeds[i] = 1.0 + Math.random() * 2.0;
    velocities.push({ x: 0, y: 0, z: 0 });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("pulseSpeed", new THREE.BufferAttribute(pulseSpeeds, 1));
  const size = isMobile ? 5.0 : 8.0;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: size } },
    vertexShader: fireflyVS,
    fragmentShader: fireflyFS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.userData._fireflyData = {
    count,
    basePositions,
    velocities,
    mouseNDC: { x: 999, y: 999 },
  };
  points.userData.animate = function (o, t) {
    const data = o.userData._fireflyData;
    const pos = o.geometry.attributes.position.array;
    const mouse = scene.userData._mouseNDC || { x: 999, y: 999 };
    for (let i = 0; i < data.count; i++) {
      if (isMobile && i % 2 === t % 2) continue;
      const velocity = data.velocities[i];
      velocity.x += (Math.random() - 0.5) * 0.002;
      velocity.y += (Math.random() - 0.5) * 0.001;
      velocity.z += (Math.random() - 0.5) * 0.002;
      velocity.x *= 0.98;
      velocity.y *= 0.98;
      velocity.z *= 0.98;
      pos[i * 3] += velocity.x;
      pos[i * 3 + 1] += velocity.y;
      pos[i * 3 + 2] += velocity.z;
      const bx = data.basePositions[i * 3];
      const by = data.basePositions[i * 3 + 1];
      const bz = data.basePositions[i * 3 + 2];
      const dx = pos[i * 3] - bx;
      const dy = pos[i * 3 + 1] - by;
      const dz = pos[i * 3 + 2] - bz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 5) {
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = bz;
        velocity.x = 0;
        velocity.y = 0;
        velocity.z = 0;
      }
      if (mouse.x < 900) {
        const fx = pos[i * 3];
        const fy = pos[i * 3 + 1];
        const mdx = fx - mouse.x * 10;
        const mdy = fy - mouse.y * 8;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 3.0 && mDist > 0.01) {
          velocity.x += (mdx / mDist) * 0.05;
          velocity.y += (mdy / mDist) * 0.05;
        }
      }
    }
    o.geometry.attributes.position.needsUpdate = true;
    o.material.uniforms.uTime.value = t;
  };
  scene.add(points);
  scene.userData._fireflies = points;
}
