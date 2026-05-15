// public/js/scene-init.js — Three.js scene initialization
import * as THREE from 'https://esm.sh/three@0.160.0';
import { EffectComposer } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';

var isMobile = window.innerWidth < 768;
var isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// ── Van Gogh post-processing shader ──
var vgVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
var vgFS = `uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrokeDensity;uniform float uSwirlFrequency;uniform float uColorIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}void main(){vec2 uv=vUv;float strokeAngle=noise(uv*uStrokeDensity+uTime*0.05)*6.28318;vec2 strokeDir=vec2(cos(strokeAngle),sin(strokeAngle));float strokeDist=noise(uv*uStrokeDensity*2.0+strokeDir*0.5+uTime*0.03);vec2 center=vec2(0.5);vec2 delta=uv-center;float dist=length(delta);float angle=atan(delta.y,delta.x);float swirl=sin(dist*uSwirlFrequency-uTime*0.5)*0.015;angle+=swirl;vec2 swirled=center+dist*vec2(cos(angle),sin(angle));vec2 distortedUV=mix(swirled,uv+strokeDir*strokeDist*0.012,0.5);distortedUV=clamp(distortedUV,0.0,1.0);vec4 color;color.r=texture2D(tDiffuse,distortedUV+vec2(0.002,0.0)).r;color.g=texture2D(tDiffuse,distortedUV).g;color.b=texture2D(tDiffuse,distortedUV-vec2(0.002,0.0)).b;color.a=1.0;float gray=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(gray),color.rgb,uColorIntensity);float vignette=1.0-smoothstep(0.4,1.4,dist*1.2);color.rgb*=vignette;gl_FragColor=color;}`;

// ── Glitch / chromatic aberration shader ──
var glitchVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
var glitchFS = `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co){ return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = vUv;
  // Subtle scanline flicker
  float scanline = sin(uv.y * 400.0 + uTime * 8.0) * 0.015;
  // Chromatic aberration — RGB split
  float aberr = 0.004 + sin(uTime * 0.7) * 0.002;
  float r = texture2D(tDiffuse, uv + vec2( aberr, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2( aberr, 0.0)).b;
  // Random horizontal glitch strips — more frequent (was 0.9985, now 0.98 = ~2% chance)
  float glitchLine = step(0.98, rand(vec2(floor(uv.y * 20.0), floor(uTime * 2.0))));
  float glitchShift = glitchLine * (rand(vec2(uTime, uv.y)) - 0.5) * 0.06;
  r = texture2D(tDiffuse, uv + vec2(aberr + glitchShift, 0.0)).b;
  b = texture2D(tDiffuse, uv - vec2(aberr - glitchShift, 0.0)).b;
  vec3 col = vec3(r, g, b);
  col += scanline * 0.2;
  gl_FragColor = vec4(col, 1.0);
}`;

// ── Star shader ──
var starVS = `
attribute float size;attribute float brightness;attribute float twinkleSpeed;attribute float twinklePhase;attribute vec3 customColor;
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
uniform float uTime;
void main(){
  float twinkle=0.5+0.5*sin(uTime*twinkleSpeed+twinklePhase);
  vBrightness=brightness*(0.4+0.6*twinkle);vColor=customColor;vTwinkle=twinkle;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  float sizeMult=0.4+0.6*twinkle;
  gl_PointSize=size*sizeMult*(250.0/-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}`;
var starFS = `
varying float vBrightness;varying vec3 vColor;varying float vTwinkle;
void main(){
  float dist=length(gl_PointCoord-vec2(0.5));
  if(dist>0.5)discard;
  float alpha=smoothstep(0.5,0.0,dist)*vBrightness;
  float glow=exp(-dist*3.0)*0.6;
  vec3 color=vColor+vec3(glow*0.8,glow*0.5,glow*0.2);
  gl_FragColor=vec4(color,alpha);
}`;

// ── Wave shader ──
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
    // Use window.innerHeight for mobile (avoids address bar viewport bug)
    var h = window.innerHeight;
    this.renderer.setSize(c.clientWidth, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.0 : 1.5));
    this.renderer.setClearColor(0x0a0a1a, 1);
    c.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(60, c.clientWidth / h, 0.1, 200);
    this.camera.position.set(0, 2, 8);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    // Van Gogh pass — all devices (reduced intensity on mobile)
    var vgIntensity = isLowEnd ? 1.1 : 1.4;
    var vgStroke = isLowEnd ? 6.0 : 8.0;
    var vgSwirl = isLowEnd ? 8.0 : 12.0;
    this.vgPass = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uStrokeDensity: { value: vgStroke }, uSwirlFrequency: { value: vgSwirl }, uColorIntensity: { value: vgIntensity } }, vertexShader: vgVS, fragmentShader: vgFS });
    this.composer.addPass(this.vgPass);
    // Glitch pass — subtle on all devices
    this.glitchPass = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } }, vertexShader: glitchVS, fragmentShader: glitchFS });
    this.composer.addPass(this.glitchPass);

    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    var ml = new THREE.DirectionalLight(0xfff8e7, 1.4); ml.position.set(5, 10, 5); this.scene.add(ml);
    var fl = new THREE.PointLight(0x4466aa, 0.6, 50); fl.position.set(-5, 3, -5); this.scene.add(fl);
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }
  add(o) { this.scene.add(o); this.objects.push(o); return o; }
  updateUniforms(p) {
    if (!this.vgPass) return;
    if (p.strokeDensity !== undefined) this.vgPass.uniforms.uStrokeDensity.value = p.strokeDensity;
    if (p.swirlFrequency !== undefined) this.vgPass.uniforms.uSwirlFrequency.value = p.swirlFrequency;
    if (p.colorIntensity !== undefined) this.vgPass.uniforms.uColorIntensity.value = p.colorIntensity;

  }
  onResize() {
    var w = this.container.clientWidth, h = window.innerHeight;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h); this.composer.setSize(w, h);
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    var t = this.clock.getElapsedTime();
    var dt = this.clock.getDelta();
    if (this.vgPass) this.vgPass.uniforms.uTime.value = t;
    this.glitchPass.uniforms.uTime.value = t;
    // Gentle camera drift — enhanced for parallax visibility
    this.camera.position.x = Math.sin(t * 0.15) * 0.6;
    this.camera.position.y = 2 + Math.sin(t * 0.1) * 0.35;
    this.camera.lookAt(0, 1.5, 0);
    for (var i = 0; i < this.objects.length; i++) {
      var o = this.objects[i];
      if (o.userData.animate) o.userData.animate(o, t, dt);
    }
    // Update shooting star manager
    if (this.shootingStarManager) this.shootingStarManager.update(t, dt);
    this.composer.render();
  }
}

// ── Moon ──
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
  moon.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.15) * 4;
    o.position.z = -5 + Math.cos(t * 0.15) * 2;
    o.position.y = 3 + Math.sin(t * 0.2) * 0.5;
    o.rotation.y = t * 0.2;
    o.rotation.x = Math.sin(t * 0.08) * 0.05;
  };
  scene.add(moon);
  // Subtle glow — small, low opacity, no BackSide blob
  var glowMat = new THREE.MeshBasicMaterial({ color: 0xfff5d0, transparent: true, opacity: 0.06, side: THREE.BackSide });
  var glow = new THREE.Mesh(new THREE.SphereGeometry(1.75, 16, 16), glowMat);
  glow.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.08) * 4;
    o.position.z = -5 + Math.cos(t * 0.08) * 2;
    o.position.y = 3 + Math.sin(t * 0.12) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.4) * 0.04);
  };
  scene.add(glow);
}

// ── Sunflower — drawn on canvas texture, billboard sprite ──
// Layout: flower head in upper 60%, stem in bottom 35%, 5% gap
function makeSunflowerCanvas(size) {
  size = size || 128;
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');
  var cx = size / 2;
  // Flower head center at 35% of canvas height (upper portion)
  var headCy = size * 0.35;
  var r = size * 0.28; // head radius

  // ── Draw stem FIRST (behind everything) ──
  // Stem goes from bottom of head zone to bottom of canvas
  ctx.strokeStyle = '#2d5a1e';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, headCy + r * 0.8);
  ctx.bezierCurveTo(cx + size * 0.03, headCy + r * 1.5, cx - size * 0.02, headCy + r * 2.2, cx, size);
  ctx.stroke();

  // ── Draw leaves on stem (still behind petals) ──
  ctx.fillStyle = '#3a7a2e';
  for (var side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(cx + side * size * 0.02, headCy + r * 1.6);
    ctx.rotate(side * 0.4);
    ctx.beginPath();
    ctx.ellipse(side * size * 0.08, 0, size * 0.1, size * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Back petals (darker gold) ──
  var petalCount = 18;
  ctx.fillStyle = '#c8920a';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, headCy);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, -(r * 0.75), r * 0.13, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Mid petals (warm amber) ──
  ctx.fillStyle = '#e8a020';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2 + Math.PI / petalCount * 0.5;
    ctx.save();
    ctx.translate(cx, headCy);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, -(r * 0.68), r * 0.12, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Front petals (bright yellow) ──
  ctx.fillStyle = '#f5c800';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2 + Math.PI / petalCount;
    ctx.save();
    ctx.translate(cx, headCy);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, -(r * 0.58), r * 0.1, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // — Center disk — dark brown with spiral seed pattern —
  var grad = ctx.createRadialGradient(cx, headCy, 0, cx, headCy, r * 0.3);
  grad.addColorStop(0, '#3a1a00');
  grad.addColorStop(0.6, '#2a1200');
  grad.addColorStop(1, '#1a0a00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, headCy, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Seeds — fibonacci spiral dots
  ctx.fillStyle = '#5a3010';
  var seedCount = 20;
  for (var i = 0; i < seedCount; i++) {
    var angle = i * 2.399963;
    var rad = r * 0.26 * Math.sqrt(i / seedCount);
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * rad, headCy + Math.sin(angle) * rad, size * 0.015, 0, Math.PI * 2);
    ctx.fill();
  }

  return c;
}

function createSunflowers(scene, count) {
  var tex = new THREE.CanvasTexture(makeSunflowerCanvas(160));
  for (var i = 0; i < count; i++) {
    // Scale — visible on both mobile and desktop
    var s = isMobile ? (0.6 + Math.random() * 0.5) : (0.8 + Math.random() * 0.8);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(1.4 * s, 1.8 * s, 1);
    // Position — higher Y on mobile so they're in view
    var spreadX = isMobile ? 10 : 14;
    sprite.position.set((Math.random() - 0.5) * spreadX, -0.3 + s * 0.4, (Math.random() - 0.5) * 6 + 2);
    var ph = Math.random() * Math.PI * 2;
    var baseY = sprite.position.y;
    (function(p, by) {
      sprite.userData.animate = function(o, t) {
        o.position.y = by + Math.sin(t * 0.5 + p) * 0.08;
        o.material.rotation = Math.sin(t * 0.3 + p) * 0.06;
      };
    })(ph, baseY);
    scene.add(sprite);
  }
}

// ── Tulip — cup-shaped and open variants, natural colors ──
// Layout: head in upper 65%, stem in bottom 30%, 5% gap
function makeTulipCanvas(size, color, isOpen) {
  size = size || 160;
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');
  var cx = size / 2;
  // Flower head center at 38% of canvas height
  var headCy = size * 0.38;
  var headR  = size * 0.24;

  // Parse hex color to RGB
  var hexColor = color.replace('#', '');
  var rr = parseInt(hexColor.substring(0,2), 16);
  var gg = parseInt(hexColor.substring(2,4), 16);
  var bb = parseInt(hexColor.substring(4,6), 16);

  // ── Draw stem FIRST (behind petals) ──
  ctx.strokeStyle = '#2d6a1e';
  ctx.lineWidth = size * 0.035;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, headCy + headR * 0.7);
  ctx.bezierCurveTo(cx + size * 0.04, headCy + headR * 1.4, cx - size * 0.03, headCy + headR * 2.0, cx + size * 0.01, size);
  ctx.stroke();

  // ── Draw leaves on stem (behind petals) ──
  ctx.fillStyle = '#3a7a2e';
  for (var side = -1; side <= 1; side += 2) {
    ctx.save();
    var lx = cx + side * size * 0.03;
    var ly = headCy + headR * 1.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.bezierCurveTo(
      lx + side * size * 0.14, ly - size * 0.04,
      lx + side * size * 0.18, ly - size * 0.12,
      lx + side * size * 0.1, ly - size * 0.18
    );
    ctx.bezierCurveTo(
      lx + side * size * 0.06, ly - size * 0.14,
      lx + side * size * 0.03, ly - size * 0.08,
      lx, ly
    );
    ctx.fill();
    ctx.restore();
  }

  // ── Draw petals ──
  // Use only warm natural colors: yellows, ambers, oranges — NO green in petals
  var petalCount = isOpen ? 6 : 5;
  for (var p = 0; p < petalCount; p++) {
    var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
    var spread, petalH, petalW, lightness;
    if (isOpen) {
      // Open tulip: petals spread outward and curl back
      spread = 0.4 + (p % 2) * 0.2;
      petalH = headR * (1.0 + (p % 2) * 0.15);
      petalW = headR * 0.38;
      lightness = p % 2 === 0 ? 20 : -10;
    } else {
      // Cup tulip: petals tightly wrapped
      spread = (p % 2 === 0) ? 0.5 : 0.3;
      petalH = headR * (p % 2 === 0 ? 1.0 : 0.8);
      petalW = headR * 0.35;
      lightness = p % 2 === 0 ? 0 : 25;
    }
    ctx.save();
    ctx.translate(
      cx + Math.cos(angle) * headR * spread * 0.35,
      headCy + Math.sin(angle) * headR * spread * 0.2
    );
    ctx.rotate(angle + Math.PI / 2);
    // Gradient: warm petal color, NO green channel boost
    var pg = ctx.createLinearGradient(0, -petalH, 0, petalH * 0.3);
    var r1 = Math.min(255, rr + lightness + 40);
    var g1 = Math.min(255, gg + lightness + 10); // minimal green boost
    var b1 = Math.max(0, bb - 20);
    var r2 = Math.min(255, rr + lightness);
    var g2 = Math.min(255, gg + lightness);
    var b2 = Math.max(0, bb - 10);
    var r3 = Math.max(0, rr - 40);
    var g3 = Math.max(0, gg - 20);
    var b3 = Math.max(0, bb - 30);
    pg.addColorStop(0, 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.95)');
    pg.addColorStop(0.5, 'rgba(' + r2 + ',' + g2 + ',' + b2 + ',0.9)');
    pg.addColorStop(1, 'rgba(' + r3 + ',' + g3 + ',' + b3 + ',0.75)');
    ctx.fillStyle = pg;
    ctx.beginPath();
    if (isOpen) {
      // Open: wider, more curved petals
      ctx.moveTo(0, petalH * 0.3);
      ctx.bezierCurveTo(petalW * 1.1, petalH * 0.1, petalW, -petalH * 0.7, 0, -petalH);
      ctx.bezierCurveTo(-petalW, -petalH * 0.7, -petalW * 1.1, petalH * 0.1, 0, petalH * 0.3);
    } else {
      // Cup: tighter, taller petals
      ctx.moveTo(0, petalH * 0.25);
      ctx.bezierCurveTo(petalW * 0.8, petalH * 0.05, petalW * 0.7, -petalH * 0.65, 0, -petalH);
      ctx.bezierCurveTo(-petalW * 0.7, -petalH * 0.65, -petalW * 0.8, petalH * 0.05, 0, petalH * 0.25);
    }
    ctx.fill();
    // Petal vein — subtle warm tone
    ctx.strokeStyle = 'rgba(' + Math.max(0,rr-40) + ',' + Math.max(0,gg-20) + ',' + Math.max(0,bb-20) + ',0.25)';
    ctx.lineWidth = size * 0.008;
    ctx.beginPath();
    ctx.moveTo(0, petalH * 0.15);
    ctx.lineTo(0, -petalH * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  // Stamen — small warm center
  var stGrad = ctx.createRadialGradient(cx, headCy, 0, cx, headCy, headR * 0.12);
  stGrad.addColorStop(0, 'rgba(255,240,100,0.9)');
  stGrad.addColorStop(1, 'rgba(200,160,20,0.4)');
  ctx.fillStyle = stGrad;
  ctx.beginPath();
  ctx.arc(cx, headCy, headR * 0.1, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

function createTulips(scene, count) {
  // Natural tulip colors: warm yellows, ambers, deep gold — NO green, NO pink, NO purple
  var colors = ['#e8a020','#d4901a','#c88015','#f0b030','#a06810','#d09828','#e0a825','#b87818','#c08820','#d89018','#e89020','#c08020'];
  for (var i = 0; i < count; i++) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    var isOpen = Math.random() > 0.5; // 50% cup, 50% open
    var tex = new THREE.CanvasTexture(makeTulipCanvas(160, color, isOpen));
    var s = isMobile ? (0.5 + Math.random() * 0.4) : (0.6 + Math.random() * 0.6);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(0.85 * s, 1.4 * s, 1);
    var spreadX = isMobile ? 10 : 14;
    var spreadZ = isMobile ? 6 : 8;
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      -0.5 + s * 0.3,
      (Math.random() - 0.5) * spreadZ + 1
    );
    var ph = Math.random() * Math.PI * 2;
    var baseY = sprite.position.y;
    var baseX = sprite.position.x;
    (function(p, bx, by) {
      sprite.userData.animate = function(o, t) {
        o.position.x = bx + Math.sin(t * 0.5 + p) * 0.04;
        o.position.y = by + Math.sin(t * 0.75 + p) * 0.06;
        o.material.rotation = Math.sin(t * 0.6 + p) * 0.08 + Math.sin(t * 1.5 + p * 2) * 0.03;
      };
    })(ph, baseX, baseY);
    scene.add(sprite);
  }
}

// ── Stars ──
function createStars(scene, count) {
  var pos = new Float32Array(count * 3), sizes = new Float32Array(count), bright = new Float32Array(count);
  var tSpeed = new Float32Array(count), tPhase = new Float32Array(count), cols = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    var i3 = i * 3, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 40 + Math.random() * 20;
    pos[i3] = r * Math.sin(ph) * Math.cos(th); pos[i3+1] = r * Math.sin(ph) * Math.sin(th); pos[i3+2] = r * Math.cos(ph);
    sizes[i] = 0.8 + Math.random() * 2.5; bright[i] = 0.3 + Math.random() * 0.7;
    tSpeed[i] = 0.8 + Math.random() * 4.0; tPhase[i] = Math.random() * Math.PI * 2;
    var tmp = Math.random();
    if (tmp < 0.3) { cols[i3]=1.0; cols[i3+1]=0.95; cols[i3+2]=0.7; }
    else if (tmp < 0.6) { cols[i3]=0.7; cols[i3+1]=0.8; cols[i3+2]=1.0; }
    else { cols[i3]=1.0; cols[i3+1]=0.6; cols[i3+2]=0.3; }
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
  stars.userData.animate = function(o, t) {
    o.material.uniforms.uTime.value = t;
    o.rotation.y = t * 0.008;
    o.rotation.x = Math.sin(t * 0.015) * 0.04;
    o.rotation.z = Math.cos(t * 0.012) * 0.02;
  };
  scene.add(stars);
}

// ── Constellations ──
function createConstellations(scene) {
  var cs = [
    { s: [[-2,5,-30],[0,6,-30],[2,5,-30],[-3,8,-30],[3,8,-30],[-2,2,-30],[2,2,-30]] },
    { s: [[-10,10,-35],[-8,11,-35],[-6,10.5,-35],[-5,9,-35],[-6,7,-35],[-8,7.5,-35],[-9,8.5,-35]] }
  ];
  var lm = new THREE.LineBasicMaterial({ color: 0x6688cc, transparent: true, opacity: 0.3 });
  cs.forEach(function(c) { var pts = c.s.map(function(v) { return new THREE.Vector3(v[0],v[1],v[2]); }); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm)); });
}

// ── Flute ──
function createFlute(scene) {
  var g = new THREE.Group();
  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,2.5,12), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.3, metalness: 0.6 }));
  body.rotation.z = Math.PI * 0.15; g.add(body);
  for (var i = 0; i < 6; i++) {
    var h = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.07,6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    h.rotation.x = Math.PI / 2; h.position.set(0, 0.03, -0.8 + i * 0.25); g.add(h);
  }
  var mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,0.3,12), new THREE.MeshStandardMaterial({ color: 0xc49833, roughness: 0.2, metalness: 0.7 }));
  mouth.position.set(0, 1.35, 0); g.add(mouth);
  g.position.set(3, 1, -2); g.rotation.y = -0.3;
  g.userData.animate = function(o, t) { o.rotation.z = Math.sin(t * 0.2) * 0.05; o.position.y = 1 + Math.sin(t * 0.4) * 0.1; };
  scene.add(g);
}

// ── Music Notes — spread across full scene, always visible ──
function createMusicNotes(scene, count) {
  var shapes = ['♪','♫','♩','♬'];
  var noteColors = ['rgba(255,220,100,0.95)','rgba(255,180,80,0.9)','rgba(200,220,255,0.9)','rgba(255,200,255,0.85)','rgba(180,255,200,0.85)'];
  for (var i = 0; i < count; i++) {
    var canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = noteColors[i % noteColors.length];
    ctx.font = 'bold 46px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(shapes[i % shapes.length], 32, 32);
    var tex = new THREE.CanvasTexture(canvas);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.75 }));

    // Spread across full visible scene
    var startX = (Math.random() - 0.5) * 20;
    var startY = (Math.random() - 0.5) * 14;
    var startZ = (Math.random() - 0.5) * 18;
    sprite.position.set(startX, startY, startZ);

    // Larger notes for visibility
    var noteScale = isMobile ? 0.9 : 0.45;
    sprite.scale.set(noteScale, noteScale, 1);

    // Faster, more visible animation
    var riseSpeed  = isMobile ? (0.08 + Math.random() * 0.1) : (0.04 + Math.random() * 0.05);
    var driftFreqX = 0.6 + Math.random() * 1.8;
    var driftFreqZ = 0.5 + Math.random() * 1.2;
    var driftAmpX  = isMobile ? (0.015 + Math.random() * 0.03) : (0.008 + Math.random() * 0.02);
    var driftAmpZ  = isMobile ? (0.01 + Math.random() * 0.025) : (0.005 + Math.random() * 0.015);
    var phaseX     = Math.random() * Math.PI * 2;
    var phaseZ     = Math.random() * Math.PI * 2;
    var rotFreq    = 0.5 + Math.random() * 1.5;
    var rotAmp     = 0.08 + Math.random() * 0.3;
    var rotPhase   = Math.random() * Math.PI * 2;
    var opacFreq   = 1.0 + Math.random() * 3.0;
    var opacPhase  = Math.random() * Math.PI * 2;
    var resetY     = isMobile ? 6 + Math.random() * 4 : 8 + Math.random() * 5;
    var resetX     = (Math.random() - 0.5) * 20;

    (function(rs, dfx, dfz, dax, daz, px, pz, rf, ra, rp, of, op, ry, rx) {
      sprite.userData.animate = function(o, t) {
        o.position.y += rs;
        o.position.x += Math.sin(t * dfx + px) * dax;
        o.position.z += Math.sin(t * dfz + pz) * daz;
        o.material.rotation = Math.sin(t * rf + rp) * ra;
        o.material.opacity = 0.35 + Math.sin(t * of + op) * 0.4;
        if (o.position.y > ry) {
          o.position.y = -4 - Math.random() * 5;
          o.position.x = rx + (Math.random() - 0.5) * 5;
          o.position.z = (Math.random() - 0.5) * 18;
        }
      };
    })(riseSpeed, driftFreqX, driftFreqZ, driftAmpX, driftAmpZ, phaseX, phaseZ, rotFreq, rotAmp, rotPhase, opacFreq, opacPhase, resetY, resetX);

    scene.add(sprite);
  }
}

// ── Shooting Stars ──
function createShootingStars(scene, maxActive) {
  maxActive = maxActive || (isMobile ? 1 : 2);
  var pool = [];
  var nextSpawn = 3 + Math.random() * 4;

  function spawn() {
    var trailLength = isMobile ? 12 : 20;
    var positions = new Float32Array(trailLength * 3);
    var opacities = new Float32Array(trailLength);

    var startR = 35 + Math.random() * 10;
    var startTheta = Math.random() * Math.PI * 2;
    var startPhi = Math.random() * Math.PI * 0.4;
    var sx = startR * Math.sin(startPhi) * Math.cos(startTheta);
    var sy = startR * Math.sin(startPhi) * Math.sin(startTheta) + 5;
    var sz = startR * Math.cos(startPhi);

    var dirX = (Math.random() - 0.5) * 0.8;
    var dirY = -0.3 - Math.random() * 0.5;
    var dirZ = (Math.random() - 0.5) * 0.8;
    var speed = 0.15 + Math.random() * 0.15;

    var star = {
      active: true, life: 0, maxLife: 1.5 + Math.random() * 0.8,
      sx: sx, sy: sy, sz: sz,
      dx: dirX * speed, dy: dirY * speed, dz: dirZ * speed,
      positions: positions, opacities: opacities, trailLength: trailLength,
      headSize: isMobile ? 3.0 : 4.0,
      headColor: new THREE.Color().setHSL(0.12 + Math.random() * 0.05, 0.8, 0.9)
    };

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    var mat = new THREE.PointsMaterial({
      color: star.headColor, size: star.headSize, transparent: true,
      opacity: 1.0, depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    var points = new THREE.Points(geo, mat);
    points.userData.shootingStar = star;
    points.userData.isShootingStar = true;
    points.userData.animate = function(o, t, dt) {
      var s = o.userData.shootingStar;
      if (!s.active) return;
      s.life += dt;
      if (s.life >= s.maxLife) { o.visible = false; s.active = false; return; }
      s.sx += s.dx; s.sy += s.dy; s.sz += s.dz;
      for (var i = s.trailLength - 1; i > 0; i--) {
        s.positions[i*3] = s.positions[(i-1)*3];
        s.positions[i*3+1] = s.positions[(i-1)*3+1];
        s.positions[i*3+2] = s.positions[(i-1)*3+2];
        s.opacities[i] = s.opacities[i-1] * 0.85;
      }
      s.positions[0] = s.sx; s.positions[1] = s.sy; s.positions[2] = s.sz;
      s.opacities[0] = 1.0;
      var lifeRatio = s.life / s.maxLife;
      var fade = lifeRatio < 0.7 ? 1.0 : 1.0 - (lifeRatio - 0.7) / 0.3;
      o.material.opacity = fade;
      o.material.size = s.headSize * (0.5 + fade * 0.5);
      o.geometry.attributes.position.needsUpdate = true;
    };
    scene.add(points);
    pool.push({ points: points, star: star });
  }

  return {
    update: function(t, dt) {
      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        var found = false;
        for (var i = 0; i < pool.length; i++) {
          if (!pool[i].star.active) {
            var s = pool[i].star;
            s.active = true; s.life = 0; s.maxLife = 1.5 + Math.random() * 0.8;
            var sr = 35 + Math.random() * 10, st = Math.random() * Math.PI * 2, sp = Math.random() * Math.PI * 0.4;
            s.sx = sr * Math.sin(sp) * Math.cos(st);
            s.sy = sr * Math.sin(sp) * Math.sin(st) + 5;
            s.sz = sr * Math.cos(sp);
            s.dx = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15);
            s.dy = (-0.3-Math.random()*0.5) * (0.15+Math.random()*0.15);
            s.dz = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15);
            pool[i].points.visible = true;
            pool[i].points.material.opacity = 1.0;
            found = true; break;
          }
        }
        if (!found && pool.length < maxActive) spawn();
        nextSpawn = 3 + Math.random() * 4;
      }
    }
  };
}

// ── Waves ──
function createWaves(scene) {
  var segs = isLowEnd ? 32 : 64;
  var geo = new THREE.PlaneGeometry(30, 20, segs, segs);
  geo.rotateX(-Math.PI * 0.45);
  var mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uWaveHeight: { value: 0.3 }, uWaveFrequency: { value: 2.0 },
      uColor1: { value: new THREE.Vector3(0.02,0.05,0.15) }, uColor2: { value: new THREE.Vector3(0.05,0.1,0.3) }, uColor3: { value: new THREE.Vector3(0.1,0.2,0.4) } },
    vertexShader: waveVS, fragmentShader: waveFS, transparent: true, side: THREE.DoubleSide
  });
  var waves = new THREE.Mesh(geo, mat); waves.position.set(0, -2, 5);
  waves.userData.animate = function(o, t) { o.material.uniforms.uTime.value = t; };
  scene.add(waves);
}

// ── Music Note Burst — fires from any click position ──
function spawnNotesBurst(cx, cy, count) {
  var symbols = ['♪','♫','♩','♬','♭','♮','♯'];
  var colors = ['#ffd54f','#ff8a65','#4fc3f7','#b388ff','#80cbc4','#fff8e1','#ffcc80'];
  count = count || 6;
  
  // Show animated Krishna's bansuri (bamboo flute) at click position
  var fluteEl = document.createElement('div');
  fluteEl.innerHTML = `<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;">
    <!-- Bamboo segments with natural texture -->
    <defs>
      <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#d4a843;stop-opacity:1" />
        <stop offset="45%" style="stop-color:#c49833;stop-opacity:1" />
        <stop offset="55%" style="stop-color:#b88820;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#a67810;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#f5d870;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#e8c060;stop-opacity:0.3" />
      </linearGradient>
    </defs>
    
    <!-- Main bamboo body - long and cylindrical -->
    <rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/>
    
    <!-- Bamboo highlight (top shine) -->
    <rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/>
    
    <!-- Bamboo segment rings (natural joints) -->
    <rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    
    <!-- Finger holes (6 playing holes + 1 thumb hole) -->
    <ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    
    <!-- Thumb hole (back side, shown as smaller) -->
    <ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/>
    
    <!-- Mouthpiece end (blowing hole) - slightly wider -->
    <ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/>
    <ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/>
    
    <!-- Decorative thread wrapping (traditional) -->
    <rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    <rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    <rect x="24" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    
    <!-- End cap decoration -->
    <circle cx="168" cy="24" r="5" fill="#8a6820" opacity="0.8"/>
    <circle cx="168" cy="24" r="3" fill="#d4a843" opacity="0.6"/>
    
    <!-- Musical notes floating near mouthpiece -->
    <text x="2" y="14" font-size="12" fill="#ffd54f" opacity="0.8" font-family="serif">♪</text>
    <text x="170" y="12" font-size="10" fill="#ff8a65" opacity="0.6" font-family="serif">♫</text>
  </svg>`;
  fluteEl.style.cssText = [
    'position:fixed','z-index:9998','pointer-events:none',
    'left:' + (cx - 90) + 'px','top:' + (cy - 24) + 'px',
    'opacity:0','transform:scale(0.5) rotate(-8deg)',
    'transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    'will-change:transform,opacity',
    'filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
  ].join(';');
  document.body.appendChild(fluteEl);
  
  // Animate flute in
  requestAnimationFrame(function() {
    fluteEl.style.opacity = '1';
    fluteEl.style.transform = 'scale(1) rotate(-2deg)';
  });
  
  // Spawn notes from flute mouthpiece (left side where you blow)
  for (var i = 0; i < count; i++) {
    (function(idx) {
      setTimeout(function() {
        var n = document.createElement('div');
        n.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        var size = (1.0 + Math.random() * 0.8).toFixed(2);
        var color = colors[Math.floor(Math.random() * colors.length)];
        // Notes originate from right end (sound comes out the far end)
        var ox = 80 + (Math.random() - 0.2) * 110;
        var oy = (Math.random() - 0.5) * 70 - 35;
        n.style.cssText = [
          'position:fixed','z-index:9999','pointer-events:none',
          'font-family:serif','font-size:' + size + 'rem',
          'color:' + color,
          'left:' + (cx + ox) + 'px','top:' + (cy + oy) + 'px',
          'animation:noteFloat 2s ease-out forwards',
          'will-change:transform,opacity'
        ].join(';');
        document.body.appendChild(n);
        setTimeout(function() { if (n.parentNode) n.parentNode.removeChild(n); }, 2100);
      }, idx * 70);
    })(i);
  }
  
  // Remove flute after animation
  setTimeout(function() {
    fluteEl.style.opacity = '0';
    fluteEl.style.transform = 'scale(0.85) rotate(5deg)';
    setTimeout(function() {
      if (fluteEl.parentNode) fluteEl.parentNode.removeChild(fluteEl);
    }, 350);
  }, 1500);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  var c = document.getElementById('canvas-container');
  if (!c) return;
  var scene = new VanGoghScene(c);

  // Flower counts — matching the proven a0ce3ef baseline
  var noteCount     = isMobile ? 25 : 30;
  var sunflowerCount = isMobile ? 6 : 10;
  var tulipCount    = isMobile ? 3 : 6;
  var starCount     = isLowEnd ? 1800 : 2000;

  createStars(scene.scene, starCount);
  createConstellations(scene.scene);
  createMoon(scene.scene);
  createSunflowers(scene.scene, sunflowerCount);
  createTulips(scene.scene, tulipCount);
  createFlute(scene.scene);
  createMusicNotes(scene.scene, noteCount);
  createWaves(scene.scene);
  var shootingStarManager = createShootingStars(scene.scene, isMobile ? 1 : 2);
  scene.shootingStarManager = shootingStarManager;

  if (window.__VG_SHADER) scene.updateUniforms({ strokeDensity: window.__VG_SHADER.strokeDensity, swirlFrequency: window.__VG_SHADER.swirlFrequency, colorIntensity: window.__VG_SHADER.colorIntensity });

  // Global click → flute magic at click position (old behavior)
  document.addEventListener('click', function(e) {
    var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    // Only skip actual interactive elements
    if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') return;
    // Skip the flute button itself (it has its own handler)
    if (e.target.closest && e.target.closest('#flute-container')) return;
    spawnNotesBurst(e.clientX, e.clientY, isMobile ? 8 : 6);
  });

  // Re-render on orientation change (mobile viewport fix)
  window.addEventListener('orientationchange', function() {
    setTimeout(function() { scene.onResize(); }, 200);
  });

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var l = document.getElementById('loader');
      if (l) l.classList.add('hidden');
    });
  });
});
