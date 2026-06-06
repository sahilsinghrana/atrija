// Wheat Field Module for Atrijā Website
// Implements a wind-swept wheat field using InstancedMesh and a procedural wind vertex shader

import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

let wheatField = {
  group: null,
  mesh: null,
  scene: null,
  clock: null,
  instancePhase: null,
  dummy: null,
  time: 0,
  scrollPos: 0
};

function initWheatField(scene, camera) {
  wheatField.scene = scene;
  wheatField.clock = new THREE.Clock();

  // Create a single wheat stalk geometry (stem + head)
  const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 1.0, 4);
  stemGeometry.translate(0, 0.5, 0); // move stem up so bottom is at 0

  const headGeometry = new THREE.SphereGeometry(0.08, 4, 3);
  headGeometry.scale(1, 2.5, 0.6);
  headGeometry.translate(0, 1.5, 0); // position head on top of stem

  // Merge stem and head into a single geometry
  const stalkGeometry = BufferGeometryUtils.mergeBufferGeometries([
    stemGeometry,
    headGeometry
  ]);

  // Determine instance count based on screen size
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 300 : 800;

  // Define the area for wheat field
  const area = isMobile
    ? { x: [-6, 6], y: [-1.5, -0.8], z: [-4, -2] }
    : { x: [-8, 8], y: [-1.5, -0.8], z: [-5, -2] };

  // Create instances
  const instanceMatrix = new THREE.Matrix4();
  const instanceColor = new THREE.Color(0xdaa520); // goldenrod
  const instancePhaseArray = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Random position within the area
    const x = THREE.MathUtils.lerp(area.x[0], area.x[1], Math.random());
    const y = THREE.MathUtils.lerp(area.y[0], area.y[1], Math.random());
    const z = THREE.MathUtils.lerp(area.z[0], area.z[1], Math.random());

    instanceMatrix.makeTranslation(x, y, z);
    wheatField.dummy = wheatField.dummy || new THREE.Object3D();
    wheatField.dummy.applyMatrix4(instanceMatrix);

    // Store the matrix for the instance
    if (!wheatField.mesh) {
      // We'll set the instance matrix later when we have the mesh
    }
  }

  // Create the InstancedMesh
  const material = new THREE.MeshStandardMaterial({
    color: instanceColor,
    emissive: new THREE.Color(0x3a2a00),
    roughness: 0.8
  });

  wheatField.mesh = new THREE.InstancedMesh(stalkGeometry, material, count);

  // Set instance matrices and phases
  for (let i = 0; i < count; i++) {
    // Random position within the area
    const x = THREE.MathUtils.lerp(area.x[0], area.x[1], Math.random());
    const y = THREE.MathUtils.lerp(area.y[0], area.y[1], Math.random());
    const z = THREE.MathUtils.lerp(area.z[0], area.z[1], Math.random());

    instanceMatrix.makeTranslation(x, y, z);
    wheatField.mesh.setMatrixAt(i, instanceMatrix);
    instancePhaseArray[i] = Math.random() * Math.PI * 2; // random phase
  }

  // Set the instance phase as an attribute
  wheatField.instancePhase = new THREE.InstancedBufferAttribute(instancePhaseArray, 1);
  wheatField.mesh.geometry.setAttribute('instancePhase', wheatField.instancePhase);

  // Add to scene
  wheatField.scene.add(wheatField.mesh);

  // Set up beforeCompile hook for vertex shader
  wheatField.mesh.material.onBeforeCompile = (shader) => {
    shader.vertexShader = `
      attribute float instancePhase;
      uniform float uTime;
      uniform float uScrollBoost;
      varying float vInstancePhase;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float time = uTime;
      float phase = instancePhase;
      float scrollBoost = uScrollBoost;
      float windSpeed = 1.5;
      float amplitudeX = 0.15 * (1.0 + scrollBoost * 0.4); // increased by scroll
      float amplitudeZ = 0.08 * (1.0 + scrollBoost * 0.4);
      float windFactor = (position.y + 1.5); // 0 at bottom, 0.7 at top of stem
      transformed.x += sin(phase + time * windSpeed) * amplitudeX * windFactor;
      transformed.z += cos(phase * 0.7 + time * windSpeed * 1.2) * amplitudeZ * windFactor;
      `
    );
    shader.fragmentShader = `
      varying float vInstancePhase;
      ${shader.fragmentShader}
    `;
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uScrollBoost = { value: 0 };
  };

  // Store references for update
  wheatField.shaderUniforms = wheatField.mesh.material.uniforms;
}

function updateWheatField(time, scrollPos) {
  if (!wheatField.mesh) return;

  wheatField.time = time;
  wheatField.scrollPos = scrollPos;

  // Update shader uniforms
  if (wheatField.shaderUniforms) {
    wheatField.shaderUniforms.uTime.value = time;
    // Map scroll position (0-1) to a boost factor (0-1) with peak at 0.5
    const scrollBoost = 1.0 - Math.abs(2 * scrollPos - 1); // 0 at edges, 1 at center
    wheatField.shaderUniforms.uScrollBoost.value = scrollBoost;
  }
}

// Export for use in scene-init.js
export { initWheatField, updateWheatField };