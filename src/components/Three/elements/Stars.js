import * as THREE from 'three';
import { starVertexShader, starFragmentShader } from '../../../shaders/stars.mjs';

export function createStars(scene, count) {
  count = count || 2000;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 40 + Math.random() * 20;
    
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
    
    sizes[i] = 0.5 + Math.random() * 2.0;
    brightness[i] = 0.3 + Math.random() * 0.7;
    
    const temp = Math.random();
    if (temp < 0.3) {
      colors[i3] = 1.0; colors[i3+1] = 0.95; colors[i3+2] = 0.7;
    } else if (temp < 0.6) {
      colors[i3] = 0.7; colors[i3+1] = 0.8; colors[i3+2] = 1.0;
    } else {
      colors[i3] = 1.0; colors[i3+1] = 0.6; colors[i3+2] = 0.3;
    }
  }
  
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
  geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  
  const mat = new THREE.ShaderMaterial({
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  const stars = new THREE.Points(geo, mat);
  stars.userData.animate = (obj, t) => {
    obj.rotation.y = t * 0.003;
    obj.rotation.x = Math.sin(t * 0.01) * 0.02;
  };
  
  scene.add(stars);
  return stars;
}

export function createConstellations(scene) {
  const constellations = [
    { name: 'Orion', stars: [
      [-2, 5, -30], [0, 6, -30], [2, 5, -30],
      [-3, 8, -30], [3, 8, -30],
      [-2, 2, -30], [2, 2, -30]
    ]},
    { name: 'Ursa Major', stars: [
      [-10, 10, -35], [-8, 11, -35], [-6, 10.5, -35],
      [-5, 9, -35], [-6, 7, -35], [-8, 7.5, -35], [-9, 8.5, -35]
    ]}
  ];
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6688cc,
    transparent: true,
    opacity: 0.3
  });
  
  const groups = [];
  constellations.forEach(function(cons) {
    const points = cons.stars.map(function(s) { return new THREE.Vector3(s[0], s[1], s[2]); });
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, lineMaterial);
    scene.add(line);
    groups.push({ name: cons.name, mesh: line });
  });
  
  return groups;
}
