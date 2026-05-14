// public/js/scene-init.js — Three.js scene initialization
import * as THREE from 'https://esm.sh/three@0.160.0';
import { EffectComposer } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';

var isMobile = window.innerWidth < 768;
var isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// ── Shaders ──
var vgVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
var vgFS = `uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrokeDensity;uniform float uSwirlFrequency;uniform float uColorIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}void main(){vec2 uv=vUv;float strokeAngle=noise(uv*uStrokeDensity+uTime*0.05)*6.28318;vec2 strokeDir=vec2(cos(strokeAngle),sin(strokeAngle));float strokeDist=noise(uv*uStrokeDensity*2.0+strokeDir*0.5+uTime*0.03);vec2 center=vec2(0.5);vec2 delta=uv-center;float dist=length(delta);float angle=atan(delta.y,delta.x);float swirl=sin(dist*uSwirlFrequency-uTime*0.5)*0.015;angle+=swirl;vec2 swirled=center+dist*vec2(cos(angle),sin(angle));vec2 distortedUV=mix(swirled,uv+strokeDir*strokeDist*0.012,0.5);distortedUV=clamp(distortedUV,0.0,1.0);vec4 color;color.r=texture2D(tDiffuse,distortedUV+vec2(0.002,0.0)).r;color.g=texture2D(tDiffuse,distortedUV).g;color.b=texture2D(tDiffuse,distortedUV-vec2(0.002,0.0)).b;color.a=1.0;float gray=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(gray),color.rgb,uColorIntensity);float vignette=1.0-smoothstep(0.4,1.4,dist*1.2);color.rgb*=vignette;gl_FragColor=color;}`;

// ── Star shader — enhanced twinkling with visible size oscillation ──
var starVS = `
attribute float size;
attribute float brightness;
attribute float twinkleSpeed;
attribute float twinklePhase;
attribute vec3 customColor;
varying float vBrightness;
varying vec3 vColor;
varying float vTwinkle;
uniform float uTime;
void main(){
  float twinkle = 0.5 + 0.5 * sin(uTime * twinkleSpeed + twinklePhase);
  vBrightness = brightness * (0.4 + 0.6 * twinkle);
  vColor = customColor;
  vTwinkle = twinkle;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Size oscillates between 40% and 100% of base size
  float sizeMult = 0.4 + 0.6 * twinkle;
  gl_PointSize = size * sizeMult * (250.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;
var starFS = `
varying float vBrightness;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  // Soft circular falloff
  float alpha = smoothstep(0.5, 0.0, dist) * vBrightness;
  // Glow effect — brighter center
  float glow = exp(-dist * 3.0) * 0.6;
  // Color shifts slightly with twinkle (warmer when brighter)
  vec3 color = vColor + vec3(glow * 0.8, glow * 0.5, glow * 0.2);
  gl_FragColor = vec4(color, alpha);
}
`;

var waveVS = `uniform float uTime;uniform float uWaveHeight;uniform float uWaveFrequency;varying vec2 vUv;varying float vElevation;void main(){vUv=uv;vec3 pos=position;float w1=sin(pos.x*uWaveFrequency+uTime)*uWaveHeight;float w2=sin(pos.z*uWaveFrequency*0.7+uTime*1.3)*uWaveHeight*0.5;pos.y+=w1+w2;vElevation=w1+w2;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}`;
var waveFS = `uniform vec3 uColor1;uniform vec3 uColor2;uniform vec3 uColor3;varying vec2 vUv;varying float vElevation;void main(){float f=(vElevation+1.0)*0.5;vec3 color=mix(uColor1,uColor2,f);color=mix(color,uColor3,smoothstep(0.6,1.0,f));gl_FragColor=vec4(color,0.85);}`;

// ── Scene Manager ──
class VanGoghScene {
  constructor(c) {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.objects = [];
    this.container = c;
    this.renderer = new THREE.WebGLRenderer({ antialias: !isLowEnd, alpha: true, powerPreference: 'low-power' });
    this.renderer.setSize(c.clientWidth, c.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.2 : 1.5));
    this.renderer.setClearColor(0x0a0a1a, 1);
    c.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(60, c.clientWidth / c.clientHeight, 0.1, 200);
    this.camera.position.set(0, 2, 8);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    if (!isLowEnd) {
      this.vgPass = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uStrokeDensity: { value: 8.0 }, uSwirlFrequency: { value: 12.0 }, uColorIntensity: { value: 1.4 } }, vertexShader: vgVS, fragmentShader: vgFS });
      this.composer.addPass(this.vgPass);
    }
    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.6));
    var ml = new THREE.DirectionalLight(0xfff8e7, 1.2); ml.position.set(5, 10, 5); this.scene.add(ml);
    var fl = new THREE.PointLight(0x4466aa, 0.5, 50); fl.position.set(-5, 3, -5); this.scene.add(fl);
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }
  add(o) { this.scene.add(o); this.objects.push(o); return o; }
  updateUniforms(p) { if (!this.vgPass) return; if (p.strokeDensity !== undefined) this.vgPass.uniforms.uStrokeDensity.value = p.strokeDensity; if (p.swirlFrequency !== undefined) this.vgPass.uniforms.uSwirlFrequency.value = p.swirlFrequency; if (p.colorIntensity !== undefined) this.vgPass.uniforms.uColorIntensity.value = p.colorIntensity; }
  onResize() { var w = this.container.clientWidth, h = this.container.clientHeight; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); this.composer.setSize(w, h); }
  animate() {
    requestAnimationFrame(() => this.animate());
    var t = this.clock.getElapsedTime();
    if (this.vgPass) this.vgPass.uniforms.uTime.value = t;
    for (var i = 0; i < this.objects.length; i++) {
      var o = this.objects[i];
      if (o.userData.animate) o.userData.animate(o, t);
    }
    this.composer.render();
  }
}

// ── Moon — slow orbit + visible self-rotation ──
function createMoon(scene) {
  var geo = new THREE.SphereGeometry(1.5, 48, 48);
  var pos = geo.attributes.position;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    var n = Math.sin(x * 8) * Math.cos(y * 6) * 0.05 + Math.sin(z * 12) * 0.03;
    pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
  }
  geo.computeVertexNormals();
  var moonMat = new THREE.MeshStandardMaterial({ color: 0xfff8e7, emissive: 0x554820, emissiveIntensity: 0.5, roughness: 0.7, metalness: 0.1 });
  var moon = new THREE.Mesh(geo, moonMat);
  moon.position.set(0, 3, -5);
  // Slow orbit + visible self-rotation
  moon.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.06) * 5;
    o.position.z = -5 + Math.cos(t * 0.06) * 2.5;
    o.position.y = 3 + Math.sin(t * 0.1) * 0.6;
    // Visible self-rotation — one full rotation every 60 seconds
    o.rotation.y = t * 0.1;
  };
  scene.add(moon);
  // Glow
  var glow = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 24), new THREE.MeshBasicMaterial({ color: 0xfff5d0, transparent: true, opacity: 0.12, side: THREE.BackSide }));
  glow.position.copy(moon.position);
  glow.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.06) * 5;
    o.position.z = -5 + Math.cos(t * 0.06) * 2.5;
    o.position.y = 3 + Math.sin(t * 0.1) * 0.6;
    o.scale.setScalar(1 + Math.sin(t * 0.3) * 0.05);
  };
  scene.add(glow);
}

// ── Sunflowers — face the camera (billboard-style) ──
function createSunflowers(scene, count) {
  var flowers = [];
  for (var i = 0; i < count; i++) {
    var g = new THREE.Group();
    var s = 0.6 + Math.random() * 0.6;
    // Stem — vertical
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * s, 0.04 * s, 2.2 * s, 6), new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.9 }));
    stem.position.y = 1.1 * s;
    g.add(stem);
    // Leaves
    for (var lv = 0; lv < 2; lv++) {
      var leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.2 * s, 0.5 * s), new THREE.MeshStandardMaterial({ color: 0x3a7a2e, side: THREE.DoubleSide, roughness: 0.8 }));
      leaf.position.set(lv === 0 ? -0.12 * s : 0.12 * s, (0.6 + lv * 0.5) * s, 0);
      leaf.rotation.z = lv === 0 ? 0.4 : -0.4;
      leaf.rotation.y = lv === 0 ? -0.3 : 0.3;
      g.add(leaf);
    }
    // Flower head group — this will face the camera
    var head = new THREE.Group();
    head.position.y = 2.2 * s;
    var headY = 0;
    // Back petals (darker)
    var petalMat1 = new THREE.MeshStandardMaterial({ color: 0xd4a000, emissive: 0x221100, emissiveIntensity: 0.15, roughness: 0.6, side: THREE.DoubleSide });
    for (var p1 = 0; p1 < 12; p1++) {
      var a1 = (p1 / 12) * Math.PI * 2;
      var petal = new THREE.Mesh(new THREE.PlaneGeometry(0.12 * s, 0.35 * s), petalMat1);
      petal.position.set(Math.cos(a1) * 0.18 * s, 0.05 * s, Math.sin(a1) * 0.18 * s);
      petal.rotation.x = -0.6;
      petal.rotation.y = a1;
      head.add(petal);
    }
    // Front petals (brighter)
    var petalMat2 = new THREE.MeshStandardMaterial({ color: 0xf5c800, emissive: 0x332200, emissiveIntensity: 0.2, roughness: 0.5, side: THREE.DoubleSide });
    for (var p2 = 0; p2 < 12; p2++) {
      var a2 = (p2 / 12) * Math.PI * 2 + Math.PI / 12;
      var petal = new THREE.Mesh(new THREE.PlaneGeometry(0.1 * s, 0.3 * s), petalMat2);
      petal.position.set(Math.cos(a2) * 0.14 * s, 0.1 * s, Math.sin(a2) * 0.14 * s);
      petal.rotation.x = -0.5;
      petal.rotation.y = a2;
      head.add(petal);
    }
    // Center disk
    var centerGeo = new THREE.CylinderGeometry(0.12 * s, 0.14 * s, 0.06 * s, 16);
    var centerMat = new THREE.MeshStandardMaterial({ color: 0x2a1500, roughness: 1.0 });
    var center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = 0.12 * s;
    center.rotation.x = Math.PI / 2;
    head.add(center);
    // Seeds
    var seedMat = new THREE.MeshStandardMaterial({ color: 0x3a2000, roughness: 0.9 });
    for (var sd = 0; sd < 8; sd++) {
      var sa = (sd / 8) * Math.PI * 2;
      var seed = new THREE.Mesh(new THREE.SphereGeometry(0.015 * s, 4, 4), seedMat);
      seed.position.set(Math.cos(sa) * 0.08 * s, 0.15 * s, Math.sin(sa) * 0.08 * s);
      head.add(seed);
    }
    g.add(head);
    // Position in field
    g.position.set((Math.random() - 0.5) * 16, 0, (Math.random() - 0.5) * 8 + 4);
    // Animate: sway + billboard (face camera)
    (function(gr, headRef) {
      gr.userData.animate = function(o, t) {
        // Gentle sway
        o.rotation.z = Math.sin(t * 0.5 + gr.position.x) * 0.04;
        o.rotation.x = Math.sin(t * 0.3 + gr.position.z) * 0.03;
        // Billboard: flower head always faces camera
        headRef.lookAt(scene.camera.position);
      };
    })(g, head);
    scene.add(g);
    flowers.push(g);
  }
  return flowers;
}

// ── Tulips — face the camera ──
function createTulips(scene, count) {
  var colors = [0xcc2244, 0xff6699, 0xffcc00, 0x9933cc, 0xff4400, 0xff3366];
  var tulips = [];
  for (var i = 0; i < count; i++) {
    var g = new THREE.Group();
    var s = 0.5 + Math.random() * 0.5;
    var color = colors[Math.floor(Math.random() * colors.length)];
    // Stem
    var stemCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05 * s, 0.6 * s, 0), new THREE.Vector3(0, 1.3 * s, 0));
    var stemGeo = new THREE.TubeGeometry(stemCurve, 8, 0.015 * s, 4, false);
    var stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a1e, roughness: 0.9 });
    g.add(new THREE.Mesh(stemGeo, stemMat));
    // Leaves
    for (var lv = 0; lv < 2; lv++) {
      var leafCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.1 * s, 0),
        new THREE.Vector3((lv === 0 ? -0.15 : 0.15) * s, 0.5 * s, 0.05 * s),
        new THREE.Vector3((lv === 0 ? -0.08 : 0.08) * s, 1.0 * s, 0)
      );
      var leafGeo = new THREE.TubeGeometry(leafCurve, 6, 0.02 * s, 4, false);
      g.add(new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x3a7a2e, side: THREE.DoubleSide, roughness: 0.8 })));
    }
    // Tulip cup group — faces camera
    var cup = new THREE.Group();
    cup.position.y = 1.3 * s;
    var petalMat = new THREE.MeshStandardMaterial({ color: color, emissive: new THREE.Color(color).multiplyScalar(0.15), roughness: 0.35, metalness: 0.05, side: THREE.DoubleSide });
    for (var p = 0; p < 3; p++) {
      var angle = (p / 3) * Math.PI * 2;
      var petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      petalShape.quadraticCurveTo(0.06 * s, 0.15 * s, 0.04 * s, 0.35 * s);
      petalShape.quadraticCurveTo(0, 0.4 * s, -0.04 * s, 0.35 * s);
      petalShape.quadraticCurveTo(-0.06 * s, 0.15 * s, 0, 0);
      var petalGeo = new THREE.ShapeGeometry(petalShape);
      var petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.03 * s, 0, Math.sin(angle) * 0.03 * s);
      petal.rotation.x = -0.3;
      petal.rotation.y = angle;
      petal.rotation.z = Math.sin(angle) * 0.3;
      cup.add(petal);
    }
    // Inner petals
    var innerMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(1.3), emissive: new THREE.Color(color).multiplyScalar(0.1), roughness: 0.3, side: THREE.DoubleSide });
    for (var ip = 0; ip < 3; ip++) {
      var iAngle = (ip / 3) * Math.PI * 2 + Math.PI / 3;
      var iPetal = new THREE.Mesh(new THREE.PlaneGeometry(0.04 * s, 0.2 * s), innerMat);
      iPetal.position.set(Math.cos(iAngle) * 0.015 * s, 0.05 * s, Math.sin(iAngle) * 0.015 * s);
      iPetal.rotation.x = -0.5;
      iPetal.rotation.y = iAngle;
      cup.add(iPetal);
    }
    g.add(cup);
    g.position.set((Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 6 + 3);
    // Animate: sway + billboard
    (function(gr, cupRef) {
      gr.userData.animate = function(o, t) {
        o.rotation.z = Math.sin(t * 0.4 + gr.position.x * 2) * 0.03;
        // Billboard: cup always faces camera
        cupRef.lookAt(scene.camera.position);
      };
    })(g, cup);
    scene.add(g);
    tulips.push(g);
  }
  return tulips;
}

// ── Stars — enhanced twinkling ──
function createStars(scene, count) {
  var pos = new Float32Array(count * 3), sizes = new Float32Array(count), bright = new Float32Array(count);
  var tSpeed = new Float32Array(count), tPhase = new Float32Array(count), cols = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    var i3 = i * 3, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 40 + Math.random() * 20;
    pos[i3] = r * Math.sin(ph) * Math.cos(th); pos[i3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i3 + 2] = r * Math.cos(ph);
    sizes[i] = 0.8 + Math.random() * 2.5; bright[i] = 0.3 + Math.random() * 0.7;
    tSpeed[i] = 0.8 + Math.random() * 4.0; tPhase[i] = Math.random() * Math.PI * 2;
    var tmp = Math.random();
    if (tmp < 0.3) { cols[i3] = 1.0; cols[i3 + 1] = 0.95; cols[i3 + 2] = 0.7; }
    else if (tmp < 0.6) { cols[i3] = 0.7; cols[i3 + 1] = 0.8; cols[i3 + 2] = 1.0; }
    else { cols[i3] = 1.0; cols[i3 + 1] = 0.6; cols[i3 + 2] = 0.3; }
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('brightness', new THREE.BufferAttribute(bright, 1));
  geo.setAttribute('twinkleSpeed', new THREE.BufferAttribute(tSpeed, 1));
  geo.setAttribute('twinklePhase', new THREE.BufferAttribute(tPhase, 1));
  geo.setAttribute('customColor', new THREE.BufferAttribute(cols, 3));
  var mat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: starVS, fragmentShader: starFS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  var stars = new THREE.Points(geo, mat);
  stars.userData.animate = function(o, t) { o.material.uniforms.uTime.value = t; o.rotation.y = t * 0.001; };
  scene.add(stars);
}

// ── Constellations ──
function createConstellations(scene) {
  var cs = [
    { s: [[-2,5,-30],[0,6,-30],[2,5,-30],[-3,8,-30],[3,8,-30],[-2,2,-30],[2,2,-30]] },
    { s: [[-10,10,-35],[-8,11,-35],[-6,10.5,-35],[-5,9,-35],[-6,7,-35],[-8,7.5,-35],[-9,8.5,-35]] }
  ];
  var lm = new THREE.LineBasicMaterial({ color: 0x6688cc, transparent: true, opacity: 0.3 });
  cs.forEach(function(c) { var pts = c.s.map(function(v) { return new THREE.Vector3(v[0], v[1], v[2]); }); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm)); });
}

// ── Flute ──
function createFlute(scene) {
  var g = new THREE.Group();
  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.3, metalness: 0.6 }));
  body.rotation.z = Math.PI * 0.15; g.add(body);
  for (var i = 0; i < 6; i++) { var h = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a })); h.rotation.x = Math.PI / 2; h.position.set(0, 0.03, -0.8 + i * 0.25); g.add(h); }
  var mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xc49833, roughness: 0.2, metalness: 0.7 }));
  mouth.position.set(0, 1.35, 0); g.add(mouth);
  g.position.set(3, 1, -2); g.rotation.y = -0.3;
  g.userData.animate = function(o, t) { o.rotation.z = Math.sin(t * 0.2) * 0.05; o.position.y = 1 + Math.sin(t * 0.4) * 0.1; };
  scene.add(g);
}

// ── Music Notes ──
function createMusicNotes(scene, count) {
  var shapes = ['♪', '♫', '♩', '♬'];
  for (var i = 0; i < count; i++) {
    var canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 220, 100, 0.8)'; ctx.font = '48px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(shapes[i % shapes.length], 32, 32);
    var tex = new THREE.CanvasTexture(canvas);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.6 }));
    sprite.position.set((Math.random() - 0.5) * 10, Math.random() * 6, (Math.random() - 0.5) * 10);
    sprite.scale.set(0.5, 0.5, 1);
    var spd = 0.2 + Math.random() * 0.5, ph = Math.random() * Math.PI * 2;
    (function(s, p) {
      sprite.userData.animate = function(o, t) { o.position.y += s * 0.01; o.position.x += Math.sin(t + p) * 0.005; o.material.opacity = 0.3 + Math.sin(t * 2 + p) * 0.3; if (o.position.y > 8) o.position.y = -1; };
    })(spd, ph);
    scene.add(sprite);
  }
}

// ── Waves ──
function createWaves(scene) {
  var segs = isLowEnd ? 32 : 64;
  var geo = new THREE.PlaneGeometry(30, 20, segs, segs);
  geo.rotateX(-Math.PI * 0.45);
  var mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uWaveHeight: { value: 0.3 }, uWaveFrequency: { value: 1.5 },
      uColor1: { value: new THREE.Vector3(0.02, 0.05, 0.15) }, uColor2: { value: new THREE.Vector3(0.05, 0.1, 0.3) }, uColor3: { value: new THREE.Vector3(0.1, 0.2, 0.4) } },
    vertexShader: waveVS, fragmentShader: waveFS, transparent: true, side: THREE.DoubleSide
  });
  var waves = new THREE.Mesh(geo, mat); waves.position.set(0, -2, 5);
  waves.userData.animate = function(o, t) { o.material.uniforms.uTime.value = t; };
  scene.add(waves);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  var c = document.getElementById('canvas-container');
  if (!c) return;
  var scene = new VanGoghScene(c);
  createStars(scene.scene, isLowEnd ? 1500 : 2500);
  createConstellations(scene.scene);
  createMoon(scene.scene);
  createSunflowers(scene.scene, isLowEnd ? 6 : 12);
  createTulips(scene.scene, isLowEnd ? 4 : 8);
  createFlute(scene.scene);
  createMusicNotes(scene.scene, isLowEnd ? 20 : 30);
  createWaves(scene.scene);
  if (window.__VG_SHADER) scene.updateUniforms({ strokeDensity: window.__VG_SHADER.strokeDensity, swirlFrequency: window.__VG_SHADER.swirlFrequency, colorIntensity: window.__VG_SHADER.colorIntensity });
  requestAnimationFrame(function() { requestAnimationFrame(function() { var l = document.getElementById('loader'); if (l) l.classList.add('hidden'); }); });
});
