// public/js/scene-init.js — Client-side Three.js scene initialization
// Uses CDN-loaded Three.js via importmap

import * as THREE from 'https://esm.sh/three@0.160.0';
import { EffectComposer } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';

// ── Detect mobile for quality scaling ──
var isMobile = window.innerWidth < 768;
var isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// ── Van Gogh Post-Processing Shader (simplified) ──
var vgVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

var vgFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uStrokeDensity;
uniform float uSwirlFrequency;
uniform float uColorIntensity;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  float strokeAngle = noise(uv * uStrokeDensity + uTime * 0.05) * 6.28318;
  vec2 strokeDir = vec2(cos(strokeAngle), sin(strokeAngle));
  float strokeDist = noise(uv * uStrokeDensity * 2.0 + strokeDir * 0.5 + uTime * 0.03);
  vec2 center = vec2(0.5);
  vec2 delta = uv - center;
  float dist = length(delta);
  float angle = atan(delta.y, delta.x);
  float swirl = sin(dist * uSwirlFrequency - uTime * 0.5) * 0.015;
  angle += swirl;
  vec2 swirled = center + dist * vec2(cos(angle), sin(angle));
  vec2 distortedUV = mix(swirled, uv + strokeDir * strokeDist * 0.012, 0.5);
  distortedUV = clamp(distortedUV, 0.0, 1.0);
  vec4 color;
  color.r = texture2D(tDiffuse, distortedUV + vec2(0.002, 0.0)).r;
  color.g = texture2D(tDiffuse, distortedUV).g;
  color.b = texture2D(tDiffuse, distortedUV - vec2(0.002, 0.0)).b;
  color.a = 1.0;
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, uColorIntensity);
  float vignette = 1.0 - smoothstep(0.4, 1.4, dist * 1.2);
  color.rgb *= vignette;
  gl_FragColor = color;
}
`;

// ── Star field shader — with twinkling ──
var starVertexShader = `
attribute float size;
attribute float brightness;
attribute float twinkleSpeed;
attribute float twinklePhase;
attribute vec3 customColor;
varying float vBrightness;
varying vec3 vColor;
uniform float uTime;
void main() {
  vBrightness = brightness * (0.6 + 0.4 * sin(uTime * twinkleSpeed + twinklePhase));
  vColor = customColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (200.0 / -mvPosition.z) * (0.7 + 0.3 * sin(uTime * twinkleSpeed * 0.5 + twinklePhase));
  gl_Position = projectionMatrix * mvPosition;
}
`;

var starFragmentShader = `
varying float vBrightness;
varying vec3 vColor;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, dist) * vBrightness;
  float glow = exp(-dist * 4.0) * 0.5;
  gl_FragColor = vec4(vColor + vec3(glow), alpha);
}
`;

// ── Wave shader ──
var waveVertexShader = `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFrequency;
varying vec2 vUv;
varying float vElevation;
void main() {
  vUv = uv;
  vec3 pos = position;
  float wave1 = sin(pos.x * uWaveFrequency + uTime) * uWaveHeight;
  float wave2 = sin(pos.z * uWaveFrequency * 0.7 + uTime * 1.3) * uWaveHeight * 0.5;
  pos.y += wave1 + wave2;
  vElevation = wave1 + wave2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

var waveFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;
varying float vElevation;
void main() {
  float mixFactor = (vElevation + 1.0) * 0.5;
  vec3 color = mix(uColor1, uColor2, mixFactor);
  color = mix(color, uColor3, smoothstep(0.6, 1.0, mixFactor));
  gl_FragColor = vec4(color, 0.85);
}
`;

// ── Scene Manager ──
class VanGoghScene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.objects = [];

    this.renderer = new THREE.WebGLRenderer({
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: 'low-power'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.2 : 1.5));
    this.renderer.setClearColor(0x0a0a1a, 1);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(0, 2, 8);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // Skip post-processing on low-end devices
    if (!isLowEnd) {
      this.vgPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uStrokeDensity: { value: 8.0 },
          uSwirlFrequency: { value: 12.0 },
          uColorIntensity: { value: 1.4 }
        },
        vertexShader: vgVertexShader,
        fragmentShader: vgFragmentShader
      });
      this.composer.addPass(this.vgPass);
    }

    this.setupLighting();
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.6));
    this.moonLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    this.moonLight.position.set(5, 10, 5);
    this.scene.add(this.moonLight);
    var fillLight = new THREE.PointLight(0x4466aa, 0.5, 50);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
  }

  add(obj) {
    this.scene.add(obj);
    this.objects.push(obj);
    return obj;
  }

  updateUniforms(params) {
    if (!this.vgPass) return;
    if (params.strokeDensity !== undefined) this.vgPass.uniforms.uStrokeDensity.value = params.strokeDensity;
    if (params.swirlFrequency !== undefined) this.vgPass.uniforms.uSwirlFrequency.value = params.swirlFrequency;
    if (params.colorIntensity !== undefined) this.vgPass.uniforms.uColorIntensity.value = params.colorIntensity;
  }

  onResize() {
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    var elapsed = this.clock.getElapsedTime();
    if (this.vgPass) this.vgPass.uniforms.uTime.value = elapsed;
    for (var i = 0; i < this.objects.length; i++) {
      var obj = this.objects[i];
      if (obj.userData.animate) obj.userData.animate(obj, elapsed);
    }
    this.composer.render();
  }
}

// ── 3D Element Creators ──

function createMoon(scene) {
  var moonGeo = new THREE.SphereGeometry(1.5, 32, 32);
  var posAttr = moonGeo.attributes.position;
  for (var i = 0; i < posAttr.count; i++) {
    var x = posAttr.getX(i), y = posAttr.getY(i), z = posAttr.getZ(i);
    var noise = Math.sin(x * 8) * Math.cos(y * 6) * 0.05 + Math.sin(z * 12) * 0.03;
    posAttr.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
  }
  moonGeo.computeVertexNormals();
  var moonMat = new THREE.MeshStandardMaterial({ color: 0xfff8e7, emissive: 0x444030, emissiveIntensity: 0.4, roughness: 0.8, metalness: 0.1 });
  var moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(0, 3, -5);
  moon.userData.animate = function(obj, t) {
    obj.position.x = Math.sin(t * 0.08) * 6;
    obj.position.z = -5 + Math.cos(t * 0.08) * 3;
    obj.position.y = 3 + Math.sin(t * 0.15) * 0.8;
    obj.rotation.y = t * 0.1;
  };
  scene.add(moon);
  var glow = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff5d0, transparent: true, opacity: 0.15, side: THREE.BackSide }));
  glow.position.copy(moon.position);
  glow.userData.animate = function(obj, t) {
    obj.position.x = Math.sin(t * 0.08) * 6;
    obj.position.z = -5 + Math.cos(t * 0.08) * 3;
    obj.position.y = 3 + Math.sin(t * 0.15) * 0.8;
  };
  scene.add(glow);
  return { moon: moon, glow: glow };
}

function createSunflowers(scene, count) {
  var flowers = [];
  for (var i = 0; i < count; i++) {
    var group = new THREE.Group();
    var scale = 0.6 + Math.random() * 0.6;
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * scale, 0.05 * scale, 2 * scale, 6), new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.9 }));
    stem.position.y = scale;
    group.add(stem);
    var petalMat = new THREE.MeshStandardMaterial({ color: 0xf5c800, emissive: 0x332200, emissiveIntensity: 0.2, roughness: 0.6, side: THREE.DoubleSide });
    for (var j = 0; j < 16; j++) {
      var angle = (j / 16) * Math.PI * 2;
      var petal = new THREE.Mesh(new THREE.PlaneGeometry(0.15 * scale, 0.4 * scale), petalMat);
      petal.position.set(Math.cos(angle) * 0.2 * scale, 2 * scale, Math.sin(angle) * 0.2 * scale);
      petal.rotation.x = -0.5;
      petal.rotation.y = angle;
      group.add(petal);
    }
    var center = new THREE.Mesh(new THREE.SphereGeometry(0.15 * scale, 8, 8), new THREE.MeshStandardMaterial({ color: 0x4a2800, roughness: 1.0 }));
    center.position.y = 2 * scale;
    group.add(center);
    group.position.set((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 8 + 4);
    group.userData.animate = (function(g) {
      return function(obj, t) {
        obj.rotation.z = Math.sin(t * 0.5 + g.position.x) * 0.06;
        obj.rotation.x = Math.sin(t * 0.3 + g.position.z) * 0.04;
      };
    })(group);
    scene.add(group);
    flowers.push(group);
  }
  return flowers;
}

function createTulips(scene, count) {
  var colors = [0xcc2244, 0xff6699, 0xffcc00, 0x9933cc, 0xff4400];
  var tulips = [];
  for (var i = 0; i < count; i++) {
    var group = new THREE.Group();
    var scale = 0.5 + Math.random() * 0.5;
    var color = colors[Math.floor(Math.random() * colors.length)];
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * scale, 0.03 * scale, 1.5 * scale, 5), new THREE.MeshStandardMaterial({ color: 0x2d6a1e, roughness: 0.9 }));
    stem.position.y = 0.75 * scale;
    group.add(stem);
    var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.02 * scale, 0.4 * scale, 6, 1, true), new THREE.MeshStandardMaterial({ color: color, emissive: new THREE.Color(color).multiplyScalar(0.2), roughness: 0.4, metalness: 0.1, side: THREE.DoubleSide }));
    cup.position.y = 1.5 * scale;
    group.add(cup);
    group.position.set((Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 6 + 3);
    group.userData.animate = (function(g) {
      return function(obj, t) {
        obj.rotation.z = Math.sin(t * 0.4 + g.position.x * 2) * 0.03;
      };
    })(group);
    scene.add(group);
    tulips.push(group);
  }
  return tulips;
}

function createStars(scene, count) {
  var positions = new Float32Array(count * 3);
  var sizes = new Float32Array(count);
  var brightness = new Float32Array(count);
  var twinkleSpeed = new Float32Array(count);
  var twinklePhase = new Float32Array(count);
  var colors = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    var i3 = i * 3;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    var r = 40 + Math.random() * 20;
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
    sizes[i] = 0.5 + Math.random() * 2.0;
    brightness[i] = 0.3 + Math.random() * 0.7;
    twinkleSpeed[i] = 0.5 + Math.random() * 3.0;
    twinklePhase[i] = Math.random() * Math.PI * 2;
    var temp = Math.random();
    if (temp < 0.3) { colors[i3] = 1.0; colors[i3+1] = 0.95; colors[i3+2] = 0.7; }
    else if (temp < 0.6) { colors[i3] = 0.7; colors[i3+1] = 0.8; colors[i3+2] = 1.0; }
    else { colors[i3] = 1.0; colors[i3+1] = 0.6; colors[i3+2] = 0.3; }
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
  geo.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeed, 1));
  geo.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhase, 1));
  geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  var mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  var stars = new THREE.Points(geo, mat);
  stars.userData.animate = function(obj, t) {
    obj.material.uniforms.uTime.value = t;
    obj.rotation.y = t * 0.002;
  };
  scene.add(stars);
  return stars;
}

function createConstellations(scene) {
  var constellations = [
    { name: 'Orion', stars: [[-2,5,-30],[0,6,-30],[2,5,-30],[-3,8,-30],[3,8,-30],[-2,2,-30],[2,2,-30]] },
    { name: 'Ursa Major', stars: [[-10,10,-35],[-8,11,-35],[-6,10.5,-35],[-5,9,-35],[-6,7,-35],[-8,7.5,-35],[-9,8.5,-35]] }
  ];
  var lineMat = new THREE.LineBasicMaterial({ color: 0x6688cc, transparent: true, opacity: 0.3 });
  return constellations.map(function(c) {
    var points = c.stars.map(function(s) { return new THREE.Vector3(s[0], s[1], s[2]); });
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat);
    scene.add(line);
    return { name: c.name, mesh: line };
  });
}

function createFlute(scene) {
  var group = new THREE.Group();
  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.3, metalness: 0.6 }));
  body.rotation.z = Math.PI * 0.15;
  group.add(body);
  for (var i = 0; i < 6; i++) {
    var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 0.03, -0.8 + i * 0.25);
    group.add(hole);
  }
  var mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xc49833, roughness: 0.2, metalness: 0.7 }));
  mouth.position.set(0, 1.35, 0);
  group.add(mouth);
  group.position.set(3, 1, -2);
  group.rotation.y = -0.3;
  group.userData.animate = function(obj, t) {
    obj.rotation.z = Math.sin(t * 0.2) * 0.05;
    obj.position.y = 1 + Math.sin(t * 0.4) * 0.1;
  };
  scene.add(group);
  return group;
}

function createMusicNotes(scene, count) {
  var notes = [];
  var noteShapes = ['♪', '♫', '♩', '♬'];
  for (var i = 0; i < count; i++) {
    var canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(noteShapes[i % noteShapes.length], 32, 32);
    var texture = new THREE.CanvasTexture(canvas);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 }));
    sprite.position.set((Math.random() - 0.5) * 10, Math.random() * 6, (Math.random() - 0.5) * 10);
    sprite.scale.set(0.5, 0.5, 1);
    var speed = 0.2 + Math.random() * 0.5;
    var phase = Math.random() * Math.PI * 2;
    sprite.userData.animate = (function(spd, ph) {
      return function(obj, t) {
        obj.position.y += spd * 0.01;
        obj.position.x += Math.sin(t + ph) * 0.005;
        obj.material.opacity = 0.3 + Math.sin(t * 2 + ph) * 0.3;
        if (obj.position.y > 8) obj.position.y = -1;
      };
    })(speed, phase);
    scene.add(sprite);
    notes.push(sprite);
  }
  return notes;
}

function createWaves(scene, colorScheme) {
  var schemes = {
    default: { c1: [0.05,0.1,0.3], c2: [0.1,0.3,0.5], c3: [0.4,0.6,0.8] },
    sunset: { c1: [0.2,0.05,0.1], c2: [0.5,0.2,0.1], c3: [0.9,0.5,0.2] },
    night:  { c1: [0.02,0.05,0.15], c2: [0.05,0.1,0.3], c3: [0.1,0.2,0.4] }
  };
  var scheme = schemes[colorScheme] || schemes.default;
  // Reduced geometry segments for mobile
  var segments = isLowEnd ? 32 : 64;
  var geo = new THREE.PlaneGeometry(30, 20, segments, segments);
  geo.rotateX(-Math.PI * 0.45);
  var mat = new THREE.ShaderMaterial({
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
  var waves = new THREE.Mesh(geo, mat);
  waves.position.set(0, -2, 5);
  waves.userData.animate = function(obj, t) { obj.material.uniforms.uTime.value = t; };
  scene.add(waves);
  return waves;
}

// ── Initialize Scene ──
document.addEventListener('DOMContentLoaded', function() {
  var container = document.getElementById('canvas-container');
  if (!container) return;

  var scene = new VanGoghScene(container);

  // Reduced counts for mobile
  var starCount = isLowEnd ? 600 : 1200;
  var sunflowerCount = isLowEnd ? 5 : 8;
  var tulipCount = isLowEnd ? 3 : 5;
  var noteCount = isLowEnd ? 8 : 15;

  createStars(scene.scene, starCount);
  createConstellations(scene.scene);
  createMoon(scene.scene);
  createSunflowers(scene.scene, sunflowerCount);
  createTulips(scene.scene, tulipCount);
  createFlute(scene.scene);
  createMusicNotes(scene.scene, noteCount);
  createWaves(scene.scene, 'night');

  if (window.__VG_SHADER) {
    scene.updateUniforms({
      strokeDensity: window.__VG_SHADER.strokeDensity,
      swirlFrequency: window.__VG_SHADER.swirlFrequency,
      colorIntensity: window.__VG_SHADER.colorIntensity
    });
  }

  // Hide loader after first render frame
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    });
  });
});
