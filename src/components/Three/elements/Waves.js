import * as THREE from 'three';
import { waveVertexShader, waveFragmentShader } from '../../../shaders/waves.mjs';

export function createWaves(scene, colorScheme) {
  colorScheme = colorScheme || 'default';
  const schemes = {
    default: { c1: [0.05, 0.1, 0.3], c2: [0.1, 0.3, 0.5], c3: [0.4, 0.6, 0.8] },
    sunset: { c1: [0.2, 0.05, 0.1], c2: [0.5, 0.2, 0.1], c3: [0.9, 0.5, 0.2] },
    night:  { c1: [0.02, 0.05, 0.15], c2: [0.05, 0.1, 0.3], c3: [0.1, 0.2, 0.4] }
  };
  
  const scheme = schemes[colorScheme] || schemes.default;
  
  const geo = new THREE.PlaneGeometry(30, 20, 128, 128);
  geo.rotateX(-Math.PI * 0.45);
  
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWaveHeight: { value: 0.3 },
      uWaveFrequency: { value: 1.5 },
      uColor1: { value: new THREE.Vector3(scheme.c1[0], scheme.c1[1], scheme.c1[2]) },
      uColor2: { value: new THREE.Vector3(scheme.c2[0], scheme.c2[1], scheme.c2[2]) },
      uColor3: { value: new THREE.Vector3(scheme.c3[0], scheme.c3[1], scheme.c3[2]) }
    },
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const waves = new THREE.Mesh(geo, mat);
  waves.position.set(0, -2, 5);
  waves.userData.animate = (obj, t) => {
    obj.material.uniforms.uTime.value = t;
  };
  
  scene.add(waves);
  return waves;
}
