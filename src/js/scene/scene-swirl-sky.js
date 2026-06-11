/**
 * scene-swirl-sky.js — Standalone swirling sky dome shader module (idea-038)
 *
 * Creates an inverted sphere with a procedural vertex-displacement shader
 * that generates swirling brushstroke patterns inspired by impressionist
 * night sky aesthetics. Designed to wrap the entire 3D scene as a
 * background dome.
 *
 * Usage:
 *   import { createSwirlSky } from './scene-swirl-sky.js';
 *   createSwirlSky(scene); // call after scene is created
 *
 * The shader displaces vertices based on layered noise (simplex-like)
 * combined with a rotational swirl that slowly rotates over time. The
 * displacement is subtle enough to not distort the sky into
 * unrecognizable shapes, but visible enough to add organic movement.
 *
 * @module scene-swirl-sky
 */

import * as THREE from "three";

/**
 * Generate a pseudo-random hash for noise generation
 * @param {number} n - seed value
 * @returns {number} pseudo-random value in [0, 1]
 */
function _hash(n) {
  var x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Create a swirling sky dome and attach it as a scene background object.
 *
 * The dome uses a large inverted sphere (radius 80) with a custom
 * ShaderMaterial that applies vertex displacement based on layered
 * noise and rotational swirl. The displacement creates subtle
 * brushstroke-like undulations across the sky surface.
 *
 * The dome is set to render at the lowest render order so it appears
 * behind all other scene elements. It auto-updates its animation in
 * sync with the scene's animation loop via the userData.animate hook.
 *
 * @param {THREE.Scene} scene - The Three.js scene to attach the sky to
 * @returns {{ mesh: THREE.Mesh, material: THREE.ShaderMaterial }} The sky mesh and its material
 */
export function createSwirlSky(scene) {
  // Vertex shader: applies noise-based displacement + rotational swirl
  var swirlSkyVS = `
    uniform float uTime;
    uniform float uSwirlSpeed;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    // Simple 3D noise approximation using sin-based hash
    float _hash(vec3 p) {
      float n = sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453;
      return fract(n);
    }

    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n000 = _hash(i);
      float n100 = _hash(i + vec3(1, 0, 0));
      float n010 = _hash(i + vec3(0, 1, 0));
      float n110 = _hash(i + vec3(1, 1, 0));
      float n001 = _hash(i + vec3(0, 0, 1));
      float n101 = _hash(i + vec3(1, 0, 1));
      float n011 = _hash(i + vec3(0, 1, 1));
      float n111 = _hash(i + vec3(1, 1, 1));
      float nx00 = mix(n000, n100, f.x);
      float nx10 = mix(n010, n110, f.x);
      float nx01 = mix(n001, n101, f.x);
      float nx11 = mix(n011, n111, f.x);
      float nxy0 = mix(nx00, nx10, f.y);
      float nxy1 = mix(nx01, nx11, f.y);
      return mix(nxy0, nxy1, f.z);
    }

    void main() {
      vec3 pos = position;
      vec3 normalizedPos = normalize(position);

      // Compute swirl: rotate around Y axis based on height and time
      float elevation = normalizedPos.y;
      float swirlAngle = uTime * uSwirlSpeed * (0.3 + elevation * 0.7);
      float cosS = cos(swirlAngle);
      float sinS = sin(swirlAngle);
      vec3 swirledPos = vec3(
        pos.x * cosS - pos.z * sinS,
        pos.y,
        pos.x * sinS + pos.z * cosS
      );

      // Multi-octave noise for organic displacement
      float displacement = 0.0;
      // Large-scale swirl patterns
      displacement += noise3D(swirledPos * 0.08 + vec3(uTime * 0.02, 0.0, uTime * 0.01)) * 1.8;
      // Medium-scale undulation
      displacement += noise3D(swirledPos * 0.15 + vec3(0.0, uTime * 0.015, uTime * 0.025)) * 1.0;
      // Small-scale texture
      displacement += noise3D(swirledPos * 0.3 + vec3(uTime * 0.03, uTime * 0.02, 0.0)) * 0.4;

      // Bias displacement: poles move less, equator moves more (banded effect)
      float bandFactor = 0.5 + 0.5 * sin(elevation * 3.14159 * 4.0 + uTime * 0.1);
      displacement *= bandFactor * 0.6;

      // Apply displacement along the normal (inward for inverted sphere)
      vec3 displaced = pos - normalizedPos * displacement;

      vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `;

  // Fragment shader: deep impressionist blue with subtle star-like glow
  var swirlSkyFS = `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uHighlightColor;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    float _hash(vec3 p) {
      float n = sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453;
      return fract(n);
    }

    void main() {
      // Gradient from deep blue at horizon to darker at zenith
      float elevation = normalize(vWorldPos).y;
      float gradient = smoothstep(-0.3, 0.6, elevation);

      // Mix base color with highlight based on displacement
      vec3 color = mix(uBaseColor, uHighlightColor, gradient * 0.3);

      // Subtle warm glow variation
      float warmNoise = _hash(floor(vWorldPos * 3.0));
      color += vec3(0.01, 0.005, 0.0) * warmNoise;

      // Slow pulsing brightness
      color *= 1.0 + 0.03 * sin(uTime * 0.15);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Use a large inverted sphere as the sky dome
  var skyGeo = new THREE.SphereGeometry(80, 48, 48);

  var skyUniforms = {
    uTime: { value: 0 },
    uSwirlSpeed: { value: 0.08 },
    uBaseColor: { value: new THREE.Color(0x0a0a1e) },
    uHighlightColor: { value: new THREE.Color(0x0d1028) },
  };

  var skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: swirlSkyVS,
    fragmentShader: swirlSkyFS,
    side: THREE.BackSide,
    depthWrite: false,
  });

  var skyDome = new THREE.Mesh(skyGeo, skyMat);
  skyDome.renderOrder = -999;
  skyDome.frustumCulled = false;

  // Update time uniform each frame
  skyDome.userData.animate = function (o, t) {
    o.material.uniforms.uTime.value = t;
  };

  scene.add(skyDome);
  return { mesh: skyDome, material: skyMat };
}

/**
 * Update the swirl sky's color palette to match the current theme.
 *
 * @param {THREE.ShaderMaterial} material - The sky material
 * @param {{ baseColor: string, highlightColor: string }} colors - CSS hex color strings
 */
export function setSwirlSkyColors(material, colors) {
  if (!material || !material.uniforms) return;
  if (colors.baseColor) {
    material.uniforms.uBaseColor.value.set(colors.baseColor);
  }
  if (colors.highlightColor) {
    material.uniforms.uHighlightColor.value.set(colors.highlightColor);
  }
}
