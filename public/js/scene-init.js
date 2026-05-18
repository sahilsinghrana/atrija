// public/js/scene-init.js — Three.js scene initialization
import * as THREE from 'https://esm.sh/three@0.160.0';
import { EffectComposer } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';

var isMobile = window.innerWidth < 768;
var isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// ── Scroll-driven parallax state ──
var scrollState = { current: 0, target: 0, smooth: 0.05 };
var scrollMax = document.body.scrollHeight - window.innerHeight;
var parallaxConfig = Object.freeze({
  cameraRotationZ: 0.03,
  starsNearRotationY: 0.02,
  starsMidRotationY: 0.01,
  starsFarRotationY: 0.005,
  moonVerticalOffset: 0.5,
  mobileIntensityMultiplier: 0.6
});
window.addEventListener('scroll', function() {
  scrollState.target = Math.min(1, Math.max(0, window.scrollY / scrollMax));
}, { passive: true });

var _parallaxEnabled = true;
if (typeof IntersectionObserver !== 'undefined') {
  var _parallaxObserver = new IntersectionObserver(function(entries) {
    _parallaxEnabled = entries[0].isIntersecting;
  }, { threshold: 0 });
}

// ── Van Gogh post-processing shader ──
var vgVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
var vgFS = `uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrokeDensity;uniform float uSwirlFrequency;uniform float uColorIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}void main(){vec2 uv=vUv;float strokeAngle=noise(uv*uStrokeDensity+uTime*0.05)*6.28318;vec2 strokeDir=vec2(cos(strokeAngle),sin(strokeAngle));float strokeDist=noise(uv*uStrokeDensity*2.0+strokeDir*0.5+uTime*0.03);vec2 center=vec2(0.5);vec2 delta=uv-center;float dist=length(delta);float angle=atan(delta.y,delta.x);float swirl=sin(dist*uSwirlFrequency-uTime*0.5)*0.008;angle+=swirl;vec2 swirled=center+dist*vec2(cos(angle),sin(angle));vec2 distortedUV=mix(swirled,uv+strokeDir*strokeDist*0.008,0.5);distortedUV=clamp(distortedUV,0.0,1.0);vec4 color;color.r=texture2D(tDiffuse,distortedUV+vec2(0.001,0.0)).r;color.g=texture2D(tDiffuse,distortedUV).g;color.b=texture2D(tDiffuse,distortedUV-vec2(0.001,0.0)).b;color.a=1.0;float gray=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(gray),color.rgb,uColorIntensity);float vignette=1.0-smoothstep(0.4,1.4,dist*1.2);color.rgb*=vignette;gl_FragColor=color;}`;

// ── Glitch / chromatic aberration shader ──
var glitchVS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
var glitchFS = `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co){ return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = vUv;
  float scanline = sin(uv.y * 400.0 + uTime * 8.0) * 0.012;
  float aberr = 0.003 + sin(uTime * 0.7) * 0.0015;
  float r = texture2D(tDiffuse, uv + vec2( aberr, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2( aberr, 0.0)).b;
  float glitchLine = step(0.98, rand(vec2(floor(uv.y * 20.0), floor(uTime * 2.0))));
  float glitchShift = glitchLine * (rand(vec2(uTime, uv.y)) - 0.5) * 0.04;
  if (glitchLine > 0.0) {
    r = texture2D(tDiffuse, uv + vec2(aberr + glitchShift, 0.0)).b;
    b = texture2D(tDiffuse, uv - vec2(aberr - glitchShift, 0.0)).r;
  }
  vec3 col = vec3(r, g, b);
  col += scanline * 0.15;
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
    var h = window.innerHeight;
    this.renderer.setSize(c.clientWidth, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1.0 : 1.5));
    this.renderer.setClearColor(0x0a0a1a, 1);
    c.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(60, c.clientWidth / h, 0.1, 200);
    this.camera.position.set(0, 2, 8);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    // Van Gogh pass — subtle
    var vgIntensity = isLowEnd ? 0.85 : 1.0;
    var vgStroke = isLowEnd ? 4.0 : 6.0;
    var vgSwirl = isLowEnd ? 6.0 : 8.0;
    this.vgPass = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uStrokeDensity: { value: vgStroke }, uSwirlFrequency: { value: vgSwirl }, uColorIntensity: { value: vgIntensity } }, vertexShader: vgVS, fragmentShader: vgFS });
    this.composer.addPass(this.vgPass);
    // Glitch pass — subtle
    this.glitchPass = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } }, vertexShader: glitchVS, fragmentShader: glitchFS });
    this.composer.addPass(this.glitchPass);

    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    var ml = new THREE.DirectionalLight(0xfff8e7, 1.4); ml.position.set(5, 10, 5); this.scene.add(ml);
    var fl = new THREE.PointLight(0xffeedd, 0.4, 50); fl.position.set(-5, 3, -5); this.scene.add(fl);
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
    scrollMax = document.body.scrollHeight - window.innerHeight;
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    var t = this.clock.getElapsedTime();
    var dt = this.clock.getDelta();
    if (this.vgPass) this.vgPass.uniforms.uTime.value = t;
    this.glitchPass.uniforms.uTime.value = t;
    if (_parallaxEnabled) {
      var scrollDelta = Math.abs(scrollState.target - scrollState.current);
      if (scrollDelta > 0.001) {
        scrollState.current += (scrollState.target - scrollState.current) * scrollState.smooth;
      }
    }
    var mult = isMobile ? parallaxConfig.mobileIntensityMultiplier : 1.0;
    var s = scrollState.current;
    this.camera.position.x = Math.sin(t * 0.15) * 0.6;
    this.camera.position.y = 2 + Math.sin(t * 0.1) * 0.35;
    this.camera.rotation.z = s * parallaxConfig.cameraRotationZ * mult;
    this.camera.lookAt(0, 1.5, 0);
    if (this.scene.userData._starsNear) this.scene.userData._starsNear.rotation.y = s * parallaxConfig.starsNearRotationY * mult;
    if (this.scene.userData._starsMid) this.scene.userData._starsMid.rotation.y = s * parallaxConfig.starsMidRotationY * mult;
    if (this.scene.userData._starsFar) this.scene.userData._starsFar.rotation.y = s * parallaxConfig.starsFarRotationY * mult;
    if (this.scene.userData._moonGroup) {
      var baseY = this.scene.userData._moonBaseY || 3;
      this.scene.userData._moonGroup.position.y = baseY + s * parallaxConfig.moonVerticalOffset * mult;
    }
    if (!isMobile) {
      var bgTop = new THREE.Color(0x08080f);
      var bgBot = new THREE.Color(0x0d0d1a);
      this.scene.background = bgTop.clone().lerp(bgBot, s);
    }
    for (var i = 0; i < this.objects.length; i++) {
      var o = this.objects[i];
      if (o.userData.animate) o.userData.animate(o, t, dt);
    }
    if (this.shootingStarManager) this.shootingStarManager.update(t, dt);
    this.composer.render();
  }
}

// ═══════════════════════════════════════
// 3D MOON — large, detailed, with glow
// ═══════════════════════════════════════
function createMoon(scene) {
  var moonGroup = new THREE.Group();
  moonGroup.position.set(0, 0.5, -5);
  scene.add(moonGroup);
  scene.userData._moonGroup = moonGroup;
  scene.userData._moonBaseY = 0.5;

  var geo = new THREE.SphereGeometry(1.5, 64, 64);
  var pos = geo.attributes.position;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    var n = Math.sin(x * 8) * Math.cos(y * 6) * 0.05 + Math.sin(z * 12) * 0.03;
    pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
  }
  geo.computeVertexNormals();
  var moonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xeeeecc, emissiveIntensity: 0.4,
    roughness: 0.4, metalness: 0.05
  });
  var moon = new THREE.Mesh(geo, moonMat);
  moon.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.15) * 4;
    o.position.z = Math.cos(t * 0.15) * 2;
    o.position.y = Math.sin(t * 0.2) * 0.5;
    o.rotation.y = t * 0.2;
    o.rotation.x = Math.sin(t * 0.08) * 0.05;
  };
  moonGroup.add(moon);

  var glowGeo = new THREE.SphereGeometry(1.75, 32, 32);
  var glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, side: THREE.BackSide, depthWrite: false });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  glow.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.08) * 4;
    o.position.z = Math.cos(t * 0.08) * 2;
    o.position.y = Math.sin(t * 0.12) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.4) * 0.04);
  };
  moonGroup.add(glow);

  var haloGeo = new THREE.SphereGeometry(2.2, 24, 24);
  var haloMat = new THREE.MeshBasicMaterial({ color: 0xffffdd, transparent: true, opacity: 0.03, side: THREE.BackSide, depthWrite: false });
  var halo = new THREE.Mesh(haloGeo, haloMat);
  halo.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.08) * 4;
    o.position.z = Math.cos(t * 0.08) * 2;
    o.position.y = Math.sin(t * 0.12) * 0.5;
    o.scale.setScalar(1 + Math.sin(t * 0.25) * 0.06);
  };
  moonGroup.add(halo);
}

// ═══════════════════════════════════════
// SUNFLOWER — canvas texture from v1.3.0 (a0ce3ef reference)
// ═══════════════════════════════════════
function makeSunflowerCanvas(size) {
  size = size || 128;
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');
  var cx = size / 2;
  var headCy = size * 0.35;
  var r = size * 0.28;

  // Stem
  ctx.strokeStyle = '#2d5a1e';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, headCy + r * 0.8);
  ctx.bezierCurveTo(cx + size * 0.03, headCy + r * 1.5, cx - size * 0.02, headCy + r * 2.2, cx, size);
  ctx.stroke();

  // Leaves
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

  // Back petals (darker gold)
  var petalCount = 18;
  ctx.fillStyle = '#c8920a';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2;
    ctx.save(); ctx.translate(cx, headCy); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0, -(r * 0.75), r * 0.13, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  // Mid petals (warm amber)
  ctx.fillStyle = '#e8a020';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2 + Math.PI / petalCount * 0.5;
    ctx.save(); ctx.translate(cx, headCy); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0, -(r * 0.68), r * 0.12, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  // Front petals (bright yellow)
  ctx.fillStyle = '#f5c800';
  for (var i = 0; i < petalCount; i++) {
    var a = (i / petalCount) * Math.PI * 2 + Math.PI / petalCount;
    ctx.save(); ctx.translate(cx, headCy); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0, -(r * 0.58), r * 0.1, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  // Center disk
  var grad = ctx.createRadialGradient(cx, headCy, 0, cx, headCy, r * 0.3);
  grad.addColorStop(0, '#3a1a00'); grad.addColorStop(0.6, '#2a1200'); grad.addColorStop(1, '#1a0a00');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, headCy, r * 0.3, 0, Math.PI * 2); ctx.fill();

  // Seeds
  ctx.fillStyle = '#5a3010';
  for (var i = 0; i < 20; i++) {
    var angle = i * 2.399963;
    var rad = r * 0.26 * Math.sqrt(i / 20);
    ctx.beginPath(); ctx.arc(cx + Math.cos(angle) * rad, headCy + Math.sin(angle) * rad, size * 0.015, 0, Math.PI * 2); ctx.fill();
  }
  return c;
}

function createSunflowers(scene, count) {
  var tex = new THREE.CanvasTexture(makeSunflowerCanvas(160));
  for (var i = 0; i < count; i++) {
    var s = isMobile ? (0.6 + Math.random() * 0.5) : (0.8 + Math.random() * 0.8);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(1.4 * s, 1.8 * s, 1);
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

// ═══════════════════════════════════════
// LILY — canvas texture from v1.3.0
// ═══════════════════════════════════════
function makeLilyCanvas(size, color, variant) {
  size = size || 160;
  var c = document.createElement('canvas');
  c.width = size; c.height = size;
  var ctx = c.getContext('2d');
  var cx = size / 2;
  var headCy = size * 0.38;
  var headR = size * 0.24;

  var hexColor = color.replace('#', '');
  var rr = parseInt(hexColor.substring(0,2), 16);
  var gg = parseInt(hexColor.substring(2,4), 16);
  var bb = parseInt(hexColor.substring(4,6), 16);

  // Stem
  ctx.strokeStyle = '#2d6a1e';
  ctx.lineWidth = size * 0.035;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, headCy + headR * 0.7);
  ctx.bezierCurveTo(cx + size * 0.04, headCy + headR * 1.4, cx - size * 0.03, headCy + headR * 2.0, cx + size * 0.01, size);
  ctx.stroke();

  // Leaves
  ctx.fillStyle = '#3a7a2e';
  for (var side = -1; side <= 1; side += 2) {
    ctx.save();
    var lx = cx + side * size * 0.03;
    var ly = headCy + headR * 1.5;
    ctx.beginPath(); ctx.moveTo(lx, ly);
    ctx.bezierCurveTo(lx + side * size * 0.14, ly - size * 0.04, lx + side * size * 0.18, ly - size * 0.12, lx + side * size * 0.1, ly - size * 0.18);
    ctx.bezierCurveTo(lx + side * size * 0.06, ly - size * 0.14, lx + side * size * 0.03, ly - size * 0.08, lx, ly);
    ctx.fill(); ctx.restore();
  }

  // 6 trumpet petals
  var petalCount = 6;
  var spread = variant === 0 ? 0.05 : (variant === 1 ? 0.15 : 0.3);
  for (var p = 0; p < petalCount; p++) {
    var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
    var depthFactor = 0.7 + Math.random() * 0.6;
    var pLightness = -2 + Math.floor(Math.random() * 5);
    var petalH = headR * (variant === 0 ? 1.1 : (variant === 1 ? 0.8 : 0.7)) * (0.9 + Math.random() * 0.2);
    var petalW = headR * (variant === 0 ? 0.18 : (variant === 1 ? 0.25 : 0.32)) * (0.85 + Math.random() * 0.3);

    var r2 = Math.min(255, Math.max(0, rr + pLightness * 8));
    var g2 = Math.min(255, Math.max(0, gg + pLightness * 4));
    var b2 = Math.min(255, Math.max(0, bb + pLightness * 2));

    ctx.save();
    ctx.translate(cx + Math.cos(angle) * spread * headR, headCy + Math.sin(angle) * spread * headR * 0.5);
    ctx.rotate(angle + Math.PI / 2 + (variant === 0 ? 0.1 : (variant === 1 ? 0.3 : 0.6)));

    // Trumpet petal shape
    var tipW = petalW * 1.3;
    ctx.beginPath();
    ctx.moveTo(0, petalH * 0.25);
    ctx.bezierCurveTo(-petalW * 0.4, petalH * 0.1, -tipW * 0.6, -petalH * 0.5, 0, -petalH);
    ctx.bezierCurveTo(tipW * 0.6, -petalH * 0.5, petalW * 0.4, petalH * 0.1, 0, petalH * 0.25);

    var pg = ctx.createLinearGradient(0, -petalH, 0, petalH * 0.3);
    pg.addColorStop(0, 'rgba('+Math.min(255,r2+40)+','+Math.min(255,g2+10)+','+Math.min(255,b2+10)+',0.97)');
    pg.addColorStop(0.4, 'rgba('+r2+','+g2+','+b2+',0.92)');
    pg.addColorStop(1, 'rgba('+Math.max(0,r2-50)+','+Math.max(0,g2-30)+','+Math.max(0,b2-20)+',0.78)');
    ctx.fillStyle = pg;
    ctx.fill();

    // Vein
    ctx.strokeStyle = 'rgba('+Math.max(0,r2-30)+','+Math.max(0,g2-20)+','+Math.max(0,b2-15)+',0.15)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, petalH * 0.2); ctx.quadraticCurveTo(petalW * 0.05, 0, 0, -petalH * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  // Stamens (6)
  for (var s = 0; s < 6; s++) {
    var sa = (s / 6) * Math.PI * 2 - Math.PI / 2;
    var sLen = headR * (0.45 + Math.random() * 0.15);
    ctx.strokeStyle = '#5a7a3a'; ctx.lineWidth = size * 0.012;
    ctx.beginPath(); ctx.moveTo(cx, headCy);
    ctx.quadraticCurveTo(cx + Math.cos(sa) * sLen * 0.5, headCy + Math.sin(sa) * sLen * 0.5, cx + Math.cos(sa) * sLen, headCy + Math.sin(sa) * sLen);
    ctx.stroke();
    var ax = cx + Math.cos(sa) * sLen; var ay = headCy + Math.sin(sa) * sLen;
    ctx.fillStyle = '#c8a040';
    ctx.beginPath(); ctx.arc(ax, ay, size * 0.018, 0, Math.PI * 2); ctx.fill();
  }

  // Pistil
  var pistilLen = headR * 0.65;
  ctx.strokeStyle = '#6a9a4a'; ctx.lineWidth = size * 0.018;
  ctx.beginPath(); ctx.moveTo(cx, headCy); ctx.lineTo(cx, headCy - pistilLen); ctx.stroke();
  ctx.fillStyle = '#7aaa5a';
  ctx.beginPath(); ctx.arc(cx, headCy - pistilLen, size * 0.022, 0, Math.PI * 2); ctx.fill();

  // Spots
  for (var f = 0; f < 8; f++) {
    var fx = cx + (Math.random() - 0.5) * headR * 0.4;
    var fy = headCy + (Math.random() - 0.5) * headR * 0.4;
    ctx.fillStyle = 'rgba(80, 40, 20, ' + (0.2 + Math.random() * 0.3) + ')';
    ctx.beginPath(); ctx.arc(fx, fy, size * (0.006 + Math.random() * 0.008), 0, Math.PI * 2); ctx.fill();
  }
  return c;
}

function createLilies(scene, count) {
  var colors = ['#f0f0f0','#e8e0e0','#f05090','#d03070','#e87020','#f06030','#f0a080','#f08080','#e8a0c0','#d05080','#e07050','#c0a080'];
  for (var i = 0; i < count; i++) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    var variant = Math.floor(Math.random() * 3);
    var s = isMobile ? (0.7 + Math.random() * 0.5) : (0.5 + Math.random() * 0.5);
    var spreadX = isMobile ? 10 : 14;
    var spreadZ = isMobile ? 6 : 8;
    var tex = new THREE.CanvasTexture(makeLilyCanvas(160, color, variant));
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(1.0 * s, 1.6 * s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      isMobile ? -0.1 + s * 0.3 : -0.4 + s * 0.25,
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

// ═══════════════════════════════════════
// STARS — 3 depth layers for parallax
// ═══════════════════════════════════════
function createStarLayer(scene, count, sizeMult, brightMult, twinkleAmp) {
  var pos = new Float32Array(count * 3), sizes = new Float32Array(count), bright = new Float32Array(count);
  var tSpeed = new Float32Array(count), tPhase = new Float32Array(count), cols = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    var i3 = i * 3, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 40 + Math.random() * 20;
    pos[i3] = r * Math.sin(ph) * Math.cos(th); pos[i3+1] = r * Math.sin(ph) * Math.sin(th); pos[i3+2] = r * Math.cos(ph);
    sizes[i] = (0.8 + Math.random() * 2.5) * sizeMult; bright[i] = (0.3 + Math.random() * 0.7) * brightMult;
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
    o.rotation.x = Math.sin(t * 0.015) * 0.04 * twinkleAmp;
    o.rotation.z = Math.cos(t * 0.012) * 0.02 * twinkleAmp;
  };
  scene.add(stars);
  return stars;
}

function createStars(scene, count) {
  var mobileMult = isMobile ? 0.7 : 1.0;
  var nearCount = Math.floor(count * 0.3 * mobileMult);
  var midCount = Math.floor(count * 0.4 * mobileMult);
  var farCount = Math.floor(count * 0.3 * mobileMult);
  scene.userData._starsNear = createStarLayer(scene, nearCount, 2.5, 1.0, 1.0);
  scene.userData._starsMid = createStarLayer(scene, midCount, 1.8, 0.7, 0.7);
  scene.userData._starsFar = createStarLayer(scene, farCount, 1.2, 0.4, 0.4);
}

function createConstellations(scene) {
  var cs = [
    { s: [[-2,5,-30],[0,6,-30],[2,5,-30],[-3,8,-30],[3,8,-30],[-2,2,-30],[2,2,-30]] },
    { s: [[-10,10,-35],[-8,11,-35],[-6,10.5,-35],[-5,9,-35],[-6,7,-35],[-8,7.5,-35],[-9,8.5,-35]] }
  ];
  var lm = new THREE.LineBasicMaterial({ color: 0x6688cc, transparent: true, opacity: 0.3 });
  cs.forEach(function(c) { var pts = c.s.map(function(v) { return new THREE.Vector3(v[0],v[1],v[2]); }); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm)); });
}

// ═══════════════════════════════════════
// 3D FLUTE — bamboo bansuri
// ═══════════════════════════════════════
function createFlute(scene) {
  var g = new THREE.Group();
  var bodyMat = new THREE.MeshStandardMaterial({ color: 0xd4a833, roughness: 0.3, metalness: 0.6 });
  var body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12), bodyMat);
  body.rotation.z = Math.PI * 0.15; g.add(body);
  for (var i = 0; i < 6; i++) {
    var h = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    h.rotation.x = Math.PI / 2; h.position.set(0, 0.03, -0.8 + i * 0.25); g.add(h);
  }
  var mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xc49833, roughness: 0.2, metalness: 0.7 }));
  mouth.position.set(0, 1.35, 0); g.add(mouth);
  g.position.set(3, 1, -2); g.rotation.y = -0.3;
  g.userData.animate = function(o, t) { o.rotation.z = Math.sin(t * 0.2) * 0.05; o.position.y = 1 + Math.sin(t * 0.4) * 0.1; };
  scene.add(g);
}

// ═══════════════════════════════════════
// 3D MUSIC NOTES — floating 3D shapes with glow
// ═══════════════════════════════════════
function createMusicNotes(scene, count) {
  var noteGroup = new THREE.Group();
  var noteColors = [0xffd54f, 0xff8a65, 0x4fc3f7, 0xb388ff, 0x80cbc4];
  for (var i = 0; i < count; i++) {
    var color = noteColors[i % noteColors.length];
    var mat = new THREE.MeshStandardMaterial({
      color: color, emissive: color, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.7, roughness: 0.3, metalness: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var noteWrapper = new THREE.Group();
    var headGeo = new THREE.SphereGeometry(0.06, 8, 8);
    var head = new THREE.Mesh(headGeo, mat);
    head.position.set(0.04, 0, 0); head.rotation.z = -0.3;
    noteWrapper.add(head);
    var stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4);
    var stem = new THREE.Mesh(stemGeo, mat);
    stem.position.set(-0.02, 0.1, 0); noteWrapper.add(stem);
    var flagGeo = new THREE.ConeGeometry(0.04, 0.08, 4);
    var flag = new THREE.Mesh(flagGeo, mat);
    flag.position.set(0.02, 0.18, 0); flag.rotation.z = -0.5;
    noteWrapper.add(flag);
    noteWrapper.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 14);
    var noteScale = isMobile ? 1.2 : 0.6;
    noteWrapper.scale.setScalar(noteScale);
    var riseSpeed = 0.03 + Math.random() * 0.04;
    var rotSpeed = 0.5 + Math.random() * 1.5;
    var rotPhase = Math.random() * Math.PI * 2;
    var driftAmp = 0.005 + Math.random() * 0.01;
    var driftFreq = 0.4 + Math.random() * 0.8;
    var driftPhase = Math.random() * Math.PI * 2;
    var resetY = 5 + Math.random() * 4;
    var startX = noteWrapper.position.x;
    (function(rs, rsp, rph, da, df, dp, ry, sx) {
      noteWrapper.userData.animate = function(o, t) {
        o.position.y += rs;
        o.position.x = sx + Math.sin(t * df + dp) * da;
        o.rotation.y = Math.sin(t * rsp + rph) * 0.5;
        o.rotation.z = Math.sin(t * rsp * 0.7 + rph) * 0.3;
        o.material.opacity = 0.3 + Math.sin(t * 2 + rph) * 0.35;
        if (o.position.y > ry) { o.position.y = -4 - Math.random() * 4; o.position.x = (Math.random() - 0.5) * 18; o.position.z = (Math.random() - 0.5) * 14; }
      };
    })(riseSpeed, rotSpeed, rotPhase, driftAmp, driftFreq, driftPhase, resetY, startX);
    noteGroup.add(noteWrapper);
  }
  scene.add(noteGroup);
}

// ═══════════════════════════════════════
// SHOOTING STARS
// ═══════════════════════════════════════
function createShootingStars(scene, maxActive) {
  maxActive = maxActive || (isMobile ? 1 : 2);
  var pool = [];
  var nextSpawn = 3 + Math.random() * 4;
  function spawn() {
    var trailLength = isMobile ? 12 : 20;
    var positions = new Float32Array(trailLength * 3);
    var opacities = new Float32Array(trailLength);
    var startR = 35 + Math.random() * 10, startTheta = Math.random() * Math.PI * 2, startPhi = Math.random() * Math.PI * 0.4;
    var sx = startR * Math.sin(startPhi) * Math.cos(startTheta);
    var sy = startR * Math.sin(startPhi) * Math.sin(startTheta) + 5;
    var sz = startR * Math.cos(startPhi);
    var dirX = (Math.random() - 0.5) * 0.8, dirY = -0.3 - Math.random() * 0.5, dirZ = (Math.random() - 0.5) * 0.8;
    var speed = 0.15 + Math.random() * 0.15;
    var star = { active: true, life: 0, maxLife: 1.5 + Math.random() * 0.8, sx: sx, sy: sy, sz: sz, dx: dirX * speed, dy: dirY * speed, dz: dirZ * speed, positions: positions, opacities: opacities, trailLength: trailLength, headSize: isMobile ? 3.0 : 4.0, headColor: new THREE.Color().setHSL(0.12 + Math.random() * 0.05, 0.8, 0.9) };
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    var mat = new THREE.PointsMaterial({ color: star.headColor, size: star.headSize, transparent: true, opacity: 1.0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    var points = new THREE.Points(geo, mat);
    points.userData.shootingStar = star;
    points.userData.animate = function(o, dt) {
      var s = o.userData.shootingStar;
      if (!s.active) return;
      s.life += dt;
      if (s.life >= s.maxLife) { o.visible = false; s.active = false; return; }
      s.sx += s.dx; s.sy += s.dy; s.sz += s.dz;
      for (var i = s.trailLength - 1; i > 0; i--) { s.positions[i*3] = s.positions[(i-1)*3]; s.positions[i*3+1] = s.positions[(i-1)*3+1]; s.positions[i*3+2] = s.positions[(i-1)*3+2]; s.opacities[i] = s.opacities[i-1] * 0.85; }
      s.positions[0] = s.sx; s.positions[1] = s.sy; s.positions[2] = s.sz; s.opacities[0] = 1.0;
      var lifeRatio = s.life / s.maxLife; var fade = lifeRatio < 0.7 ? 1.0 : 1.0 - (lifeRatio - 0.7) / 0.3;
      o.material.opacity = fade; o.material.size = s.headSize * (0.5 + fade * 0.5);
      o.geometry.attributes.position.needsUpdate = true;
    };
    scene.add(points);
    pool.push({ points: points, star: star });
  }
  return { update: function(t, dt) { nextSpawn -= dt; if (nextSpawn <= 0) { var found = false; for (var i = 0; i < pool.length; i++) { if (!pool[i].star.active) { var s = pool[i].star; s.active = true; s.life = 0; s.maxLife = 1.5 + Math.random() * 0.8; var sr = 35 + Math.random() * 10, st = Math.random() * Math.PI * 2, sp = Math.random() * Math.PI * 0.4; s.sx = sr * Math.sin(sp) * Math.cos(st); s.sy = sr * Math.sin(sp) * Math.sin(st) + 5; s.sz = sr * Math.cos(sp); s.dx = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15); s.dy = (-0.3-Math.random()*0.5) * (0.15+Math.random()*0.15); s.dz = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15); pool[i].points.visible = true; pool[i].points.material.opacity = 1.0; found = true; break; } } if (!found && pool.length < maxActive) spawn(); nextSpawn = 3 + Math.random() * 4; } } };
}

// ═══════════════════════════════════════
// WAVES
// ═══════════════════════════════════════
function createWaves(scene, segs) {
  segs = segs || (isLowEnd ? 32 : 64);
  var geo = new THREE.PlaneGeometry(30, 20, segs, segs);
  geo.rotateX(-Math.PI * 0.45);
  var mat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uWaveHeight: { value: 0.3 }, uWaveFrequency: { value: 2.0 }, uColor1: { value: new THREE.Vector3(0.02,0.05,0.15) }, uColor2: { value: new THREE.Vector3(0.05,0.1,0.3) }, uColor3: { value: new THREE.Vector3(0.1,0.2,0.4) } }, vertexShader: waveVS, fragmentShader: waveFS, transparent: true, side: THREE.DoubleSide });
  var waves = new THREE.Mesh(geo, mat); waves.position.set(0, -2, 5);
  waves.userData.animate = function(o, t) { o.material.uniforms.uTime.value = t; };
  scene.add(waves);
}

// ═══════════════════════════════════════
// CLICK → FLUTE + NOTES
// ═══════════════════════════════════════
function spawnNotesBurst(cx, cy, count) {
  var symbols = ['♪','♫','♩','♬','♭','♮','♯'];
  var colors = ['#ffd54f','#ff8a65','#4fc3f7','#b388ff','#80cbc4','#fff8e1','#ffcc80'];
  count = count || 6;
  var fluteEl = document.createElement('div');
  fluteEl.innerHTML = `<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;"><defs><linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#d4a843;stop-opacity:1"/><stop offset="45%" style="stop-color:#c49833;stop-opacity:1"/><stop offset="55%" style="stop-color:#b88820;stop-opacity:1"/><stop offset="100%" style="stop-color:#a67810;stop-opacity:1"/></linearGradient><linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f5d870;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#e8c060;stop-opacity:0.3"/></linearGradient></defs><rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/><rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/><rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/><ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/><ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/><rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="24" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><circle cx="168" cy="24" r="5" fill="#8a6820" opacity="0.8"/><circle cx="168" cy="24" r="3" fill="#d4a843" opacity="0.6"/><text x="2" y="14" font-size="12" fill="#ffd54f" opacity="0.8" font-family="serif">♪</text><text x="170" y="12" font-size="10" fill="#ff8a65" opacity="0.6" font-family="serif">♫</text></svg>`;
  fluteEl.style.cssText = 'position:fixed;z-index:9998;pointer-events:none;left:'+(cx-90)+'px;top:'+(cy-24)+'px;opacity:0;transform:scale(0.5) rotate(-8deg);transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);will-change:transform,opacity;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))';
  document.body.appendChild(fluteEl);
  requestAnimationFrame(function() { fluteEl.style.opacity='1'; fluteEl.style.transform='scale(1) rotate(-2deg)'; });
  for (var i = 0; i < count; i++) {
    (function(idx) {
      setTimeout(function() {
        var n = document.createElement('div');
        n.textContent = symbols[Math.floor(Math.random()*symbols.length)];
        var size = (1.0+Math.random()*0.8).toFixed(2);
        var color = colors[Math.floor(Math.random()*colors.length)];
        var ox = 80 + (Math.random()-0.2)*110; var oy = (Math.random()-0.5)*70-35;
        n.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;font-family:serif;font-size:'+size+'rem;color:'+color+';left:'+(cx+ox)+'px;top:'+(cy+oy)+'px;animation:noteFloat 2s ease-out forwards;will-change:transform,opacity';
        document.body.appendChild(n);
        setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},2100);
      }, idx*70);
    })(i);
  }
  setTimeout(function() { fluteEl.style.opacity='0'; fluteEl.style.transform='scale(0.85) rotate(5deg)'; setTimeout(function(){if(fluteEl.parentNode)fluteEl.parentNode.removeChild(fluteEl);},350); }, 1500);
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
(function() {
  var c = document.getElementById('canvas-container');
  if (!c) return;
  if (typeof _parallaxObserver !== 'undefined') _parallaxObserver.observe(c);
  var scene = new VanGoghScene(c);
  if (window.__sceneLoadingStarted) window.__sceneLoadingStarted();
  var starCount = isLowEnd ? 700 : 2500;
  var noteCount = isLowEnd ? 10 : 15;
  var sunflowerCount = isLowEnd ? 3 : 8;
  var lilyCount = isLowEnd ? 2 : 4;
  var waveSegs = isLowEnd ? 16 : 32;
  if (window.__updateLoaderProgress) window.__updateLoaderProgress(30);
  createStars(scene.scene, starCount);
  createMoon(scene.scene);
  createWaves(scene.scene, waveSegs);
  if (window.__updateLoaderProgress) window.__updateLoaderProgress(60);
  requestAnimationFrame(function() {
    if (window.__updateLoaderProgress) window.__updateLoaderProgress(90);
    var l = document.getElementById('loader');
    if (l) l.classList.add('hidden');
    if (window.__updateLoaderProgress) window.__updateLoaderProgress(100);
  });
  setTimeout(function() {
    createSunflowers(scene.scene, sunflowerCount);
    createLilies(scene.scene, lilyCount);
    createFlute(scene.scene);
    createMusicNotes(scene.scene, noteCount);
  }, 300);
  if (!isLowEnd) {
    setTimeout(function() {
      createConstellations(scene.scene);
      scene.shootingStarManager = createShootingStars(scene.scene, isMobile ? 1 : 2);
    }, 800);
  } else {
    setTimeout(function() { createConstellations(scene.scene); }, 800);
  }
  document.addEventListener('click', function(e) {
    var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.target.closest && e.target.closest('#flute-container')) return;
    spawnNotesBurst(e.clientX, e.clientY, isMobile ? 8 : 6);
  });
  window.addEventListener('orientationchange', function() { setTimeout(function() { scene.onResize(); }, 200); });
})();
