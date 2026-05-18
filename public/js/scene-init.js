// public/js/scene-init.js — Three.js scene initialization
import * as THREE from 'https://esm.sh/three@0.160.0';

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

    this.scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));
    var ml = new THREE.DirectionalLight(0xfff8e7, 1.4); ml.position.set(5, 10, 5); this.scene.add(ml);
    var fl = new THREE.PointLight(0xffeedd, 0.4, 50); fl.position.set(-5, 3, -5); this.scene.add(fl);
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }
  add(o) { this.scene.add(o); this.objects.push(o); return o; }
  onResize() {
    var w = this.container.clientWidth, h = window.innerHeight;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    scrollMax = document.body.scrollHeight - window.innerHeight;
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    var t = this.clock.getElapsedTime();
    var dt = this.clock.getDelta();
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
    this.renderer.render(this.scene, this.camera);
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

  // Main moon sphere — white with subtle surface detail
  var geo = new THREE.SphereGeometry(1.2, 64, 64);
  var pos = geo.attributes.position;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    var n = Math.sin(x * 6) * Math.cos(y * 5) * 0.04 + Math.sin(z * 8) * 0.025 + Math.sin(x * 12 + y * 8) * 0.015;
    pos.setXYZ(i, x * (1 + n), y * (1 + n), z * (1 + n));
  }
  geo.computeVertexNormals();
  var moonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xeeeecc, emissiveIntensity: 0.35,
    roughness: 0.5, metalness: 0.05
  });
  var moon = new THREE.Mesh(geo, moonMat);
  moon.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.06) * 3;
    o.position.z = Math.cos(t * 0.06) * 1.5;
    o.position.y = Math.sin(t * 0.08) * 0.3;
    o.rotation.y = t * 0.08;
    o.rotation.x = Math.sin(t * 0.04) * 0.03;
  };
  moonGroup.add(moon);

  // Inner glow sphere
  var glowGeo = new THREE.SphereGeometry(1.35, 32, 32);
  var glowMat = new THREE.MeshBasicMaterial({
    color: 0xffffee, transparent: true, opacity: 0.06,
    side: THREE.BackSide, depthWrite: false
  });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  glow.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.06) * 3;
    o.position.z = Math.cos(t * 0.06) * 1.5;
    o.position.y = Math.sin(t * 0.08) * 0.3;
    o.scale.setScalar(1 + Math.sin(t * 0.3) * 0.03);
  };
  moonGroup.add(glow);

  // Outer glow halo
  var haloGeo = new THREE.SphereGeometry(1.8, 24, 24);
  var haloMat = new THREE.MeshBasicMaterial({
    color: 0xffffdd, transparent: true, opacity: 0.025,
    side: THREE.BackSide, depthWrite: false
  });
  var halo = new THREE.Mesh(haloGeo, haloMat);
  halo.userData.animate = function(o, t) {
    o.position.x = Math.sin(t * 0.06) * 3;
    o.position.z = Math.cos(t * 0.06) * 1.5;
    o.position.y = Math.sin(t * 0.08) * 0.3;
    o.scale.setScalar(1 + Math.sin(t * 0.2) * 0.05);
  };
  moonGroup.add(halo);
}

// ═══════════════════════════════════════
// 3D SUNFLOWER — stem + disk + petals
// ═══════════════════════════════════════
function createSunflower3D(x, y, z, scale) {
  var group = new THREE.Group();
  group.position.set(x, y, z);
  group.scale.setScalar(scale);

  var stemMat = new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.8 });
  var leafMat = new THREE.MeshStandardMaterial({ color: 0x3a7a2e, roughness: 0.7, side: THREE.DoubleSide });

  // Stem — curved bezier-like using multiple cylinder segments
  var stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.2, 0),
    new THREE.Vector3(0.02, -0.6, 0.01),
    new THREE.Vector3(-0.01, 0, -0.01),
    new THREE.Vector3(0.01, 0.5, 0.02),
    new THREE.Vector3(0, 0.9, 0)
  ]);
  var stemGeo = new THREE.TubeGeometry(stemCurve, 12, 0.025, 6, false);
  var stem = new THREE.Mesh(stemGeo, stemMat);
  group.add(stem);

  // Leaves — 2 per flower, flat elongated shapes
  for (var lv = 0; lv < 2; lv++) {
    var leafGeo = new THREE.PlaneGeometry(0.25, 0.12);
    var leaf = new THREE.Mesh(leafGeo, leafMat);
    var side = lv === 0 ? 1 : -1;
    leaf.position.set(side * 0.12, -0.4 + lv * 0.3, 0);
    leaf.rotation.set(0.3, side * 0.5, side * 0.6);
    group.add(leaf);
  }

  // Flower head group (rotates to face camera)
  var head = new THREE.Group();
  head.position.set(0, 0.9, 0);
  group.add(head);

  // Center disk — dark brown
  var diskGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
  var diskMat = new THREE.MeshStandardMaterial({ color: 0x2a1200, roughness: 0.9 });
  var disk = new THREE.Mesh(diskGeo, diskMat);
  disk.rotation.x = Math.PI / 2;
  head.add(disk);

  // Seed pattern on disk
  var seedMat = new THREE.MeshStandardMaterial({ color: 0x5a3010, roughness: 0.8 });
  for (var s = 0; s < 18; s++) {
    var sa = s * 2.399963;
    var sr = 0.14 * Math.sqrt(s / 18);
    var seedGeo = new THREE.SphereGeometry(0.012, 4, 4);
    var seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(Math.cos(sa) * sr, Math.sin(sa) * sr, 0.025);
    head.add(seed);
  }

  // Petals — 3 layers × 12 petals each, elongated ellipsoid shapes
  var petalColors = [0xc8920a, 0xe8a020, 0xf5c800];
  for (var layer = 0; layer < 3; layer++) {
    var pColor = petalColors[layer];
    var pMat = new THREE.MeshStandardMaterial({
      color: pColor, roughness: 0.6, side: THREE.DoubleSide,
      emissive: new THREE.Color(pColor), emissiveIntensity: 0.08
    });
    var pCount = 12 - layer * 2;
    var pRadius = 0.22 + layer * 0.06;
    var pLength = 0.32 - layer * 0.04;
    var pWidth = 0.08 - layer * 0.01;
    var zOff = 0.02 + layer * 0.015;

    for (var p = 0; p < pCount; p++) {
      var angle = (p / pCount) * Math.PI * 2 + layer * 0.15;
      // Petal shape — elongated box with tapered ends
      var petalGeo = new THREE.PlaneGeometry(pWidth, pLength);
      var petal = new THREE.Mesh(petalGeo, pMat);
      petal.position.set(
        Math.cos(angle) * pRadius,
        Math.sin(angle) * pRadius,
        zOff
      );
      petal.rotation.set(
        Math.PI * 0.15,  // slight tilt outward
        0,
        angle + Math.PI / 2  // face outward
      );
      head.add(petal);
    }
  }

  // Billboard the head to face camera
  head.userData.isBillboard = true;
  head.userData.animate = function(o, t) {
    // Face camera
    if (o.parent && o.parent.parent) {
      var worldPos = new THREE.Vector3();
      o.getWorldPosition(worldPos);
      var cam = o.parent.parent.parent.camera;
      if (cam) o.lookAt(cam.position);
    }
    // Gentle sway
    o.rotation.z = Math.sin(t * 0.5) * 0.03;
  };

  return group;
}

function createSunflowers(scene, totalCount) {
  var layers = [
    { count: Math.floor(totalCount * 0.3), scaleRange: [0.5, 0.8], zRange: [-12, -7], yRange: [-1.2, -0.4], spreadX: 18 },
    { count: Math.floor(totalCount * 0.4), scaleRange: [0.8, 1.3], zRange: [-8, -3], yRange: [-0.8, 0.0], spreadX: 14 },
    { count: Math.floor(totalCount * 0.3), scaleRange: [1.3, 2.0], zRange: [-5, -1], yRange: [-0.4, 0.4], spreadX: 10 }
  ];

  if (isMobile) {
    layers.forEach(function(l) {
      l.count = Math.max(1, Math.floor(l.count * 0.5));
      l.scaleRange = [l.scaleRange[0] * 0.7, l.scaleRange[1] * 0.7];
    });
  }

  var allFlowers = [];
  layers.forEach(function(layer) {
    for (var i = 0; i < layer.count; i++) {
      var s = layer.scaleRange[0] + Math.random() * (layer.scaleRange[1] - layer.scaleRange[0]);
      var x = (Math.random() - 0.5) * layer.spreadX;
      var y = layer.yRange[0] + Math.random() * (layer.yRange[1] - layer.yRange[0]);
      var z = layer.zRange[0] + Math.random() * (layer.zRange[1] - layer.zRange[0]);
      var flower = createSunflower3D(x, y, z, s);
      var ph = Math.random() * Math.PI * 2;
      var swayAmp = 0.02 + Math.random() * 0.04;
      var swaySpeed = 0.3 + Math.random() * 0.5;
      flower.userData.animate = function(o, t) {
        o.rotation.z = Math.sin(t * swaySpeed + ph) * swayAmp;
        o.rotation.x = Math.sin(t * swaySpeed * 0.7 + ph) * swayAmp * 0.5;
        // Billboard all heads
        o.children.forEach(function(child) {
          if (child.userData && child.userData.isBillboard && child.userData.animate) {
            child.userData.animate(child, t);
          }
        });
      };
      scene.add(flower);
      allFlowers.push(flower);
    }
  });
  scene.userData._sunflowers = allFlowers;
}

// ═══════════════════════════════════════
// 3D LILY — stem + trumpet petals + stamens + pistil
// ═══════════════════════════════════════
function createLily3D(x, y, z, scale, colorHex, variant) {
  var group = new THREE.Group();
  group.position.set(x, y, z);
  group.scale.setScalar(scale);

  var stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a1e, roughness: 0.8 });
  var leafMat = new THREE.MeshStandardMaterial({ color: 0x3a7a2e, roughness: 0.7, side: THREE.DoubleSide });

  // Stem
  var stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.0, 0),
    new THREE.Vector3(0.01, -0.4, 0.01),
    new THREE.Vector3(-0.01, 0.1, -0.01),
    new THREE.Vector3(0, 0.6, 0)
  ]);
  var stemGeo = new THREE.TubeGeometry(stemCurve, 10, 0.02, 5, false);
  group.add(new THREE.Mesh(stemGeo, stemMat));

  // Leaves
  for (var lv = 0; lv < 2; lv++) {
    var leafGeo = new THREE.PlaneGeometry(0.2, 0.08);
    var leaf = new THREE.Mesh(leafGeo, leafMat);
    var side = lv === 0 ? 1 : -1;
    leaf.position.set(side * 0.1, -0.2 + lv * 0.25, 0);
    leaf.rotation.set(0.2, side * 0.4, side * 0.5);
    group.add(leaf);
  }

  // Flower head
  var head = new THREE.Group();
  head.position.set(0, 0.6, 0);
  group.add(head);

  // Parse color
  var hex = colorHex.replace('#', '');
  var cr = parseInt(hex.substring(0,2), 16) / 255;
  var cg = parseInt(hex.substring(2,4), 16) / 255;
  var cb = parseInt(hex.substring(4,6), 16) / 255;
  var petalColor = new THREE.Color(cr, cg, cb);

  // 6 trumpet petals
  var spread = variant === 0 ? 0.08 : (variant === 1 ? 0.15 : 0.28);
  var petalLen = variant === 0 ? 0.35 : (variant === 1 ? 0.28 : 0.22);
  var petalMat = new THREE.MeshStandardMaterial({
    color: petalColor, roughness: 0.5, side: THREE.DoubleSide,
    emissive: petalColor, emissiveIntensity: 0.06
  });

  for (var p = 0; p < 6; p++) {
    var angle = (p / 6) * Math.PI * 2;
    // Trumpet petal — curved shape using a bent plane
    var petalGeo = new THREE.PlaneGeometry(0.12, petalLen);
    // Bend the petal vertices to create trumpet shape
    var pPos = petalGeo.attributes.position;
    for (var v = 0; v < pPos.count; v++) {
      var py = pPos.getY(v);
      var px = pPos.getX(v);
      var t = (py + petalLen / 2) / petalLen; // 0 at base, 1 at tip
      var flare = t * t * 0.08; // flare outward at tip
      pPos.setX(v, px + flare);
      pPos.setZ(v, t * 0.05); // slight forward curve
    }
    petalGeo.computeVertexNormals();

    var petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(
      Math.cos(angle) * spread,
      Math.sin(angle) * spread * 0.5,
      0
    );
    petal.rotation.set(
      variant === 0 ? 0.15 : (variant === 1 ? 0.4 : 0.7),
      0,
      angle + Math.PI / 2
    );
    head.add(petal);
  }

  // Stamens (6) — thin cylinders with anther dots
  var stamenMat = new THREE.MeshStandardMaterial({ color: 0x5a7a3a, roughness: 0.6 });
  var antherMat = new THREE.MeshStandardMaterial({ color: 0xc8a040, roughness: 0.5, emissive: 0xc8a040, emissiveIntensity: 0.15 });
  for (var s = 0; s < 6; s++) {
    var sa = (s / 6) * Math.PI * 2 + 0.15;
    var sLen = 0.18 + Math.random() * 0.06;
    var stamenGeo = new THREE.CylinderGeometry(0.004, 0.006, sLen, 4);
    var stamen = new THREE.Mesh(stamenGeo, stamenMat);
    stamen.position.set(Math.cos(sa) * 0.06, Math.sin(sa) * 0.04, sLen * 0.3);
    stamen.rotation.set(0.2, 0, sa);
    head.add(stamen);

    // Anther dot
    var antherGeo = new THREE.SphereGeometry(0.012, 6, 6);
    var anther = new THREE.Mesh(antherGeo, antherMat);
    anther.position.set(
      Math.cos(sa) * 0.06,
      Math.sin(sa) * 0.04,
      sLen * 0.5 + 0.02
    );
    head.add(anther);
  }

  // Central pistil — longer than stamens
  var pistilMat = new THREE.MeshStandardMaterial({ color: 0x6a9a4a, roughness: 0.5 });
  var pistilGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.25, 5);
  var pistil = new THREE.Mesh(pistilGeo, pistilMat);
  pistil.position.set(0, 0, 0.05);
  head.add(pistil);

  // Stigma (top of pistil)
  var stigmaGeo = new THREE.SphereGeometry(0.015, 6, 6);
  var stigmaMat = new THREE.MeshStandardMaterial({ color: 0x7aaa5a, roughness: 0.4, emissive: 0x7aaa5a, emissiveIntensity: 0.2 });
  var stigma = new THREE.Mesh(stigmaGeo, stigmaMat);
  stigma.position.set(0, 0, 0.18);
  head.add(stigma);

  // Spots/freckles on inner petals (small dark dots)
  var spotMat = new THREE.MeshStandardMaterial({ color: 0x503020, roughness: 0.7, transparent: true, opacity: 0.4 });
  for (var f = 0; f < 6; f++) {
    var fx = (Math.random() - 0.5) * 0.08;
    var fy = (Math.random() - 0.5) * 0.08;
    var spotGeo = new THREE.CircleGeometry(0.008 + Math.random() * 0.006, 5);
    var spot = new THREE.Mesh(spotGeo, spotMat);
    spot.position.set(fx, fy, 0.01);
    head.add(spot);
  }

  // Billboard head
  head.userData.isBillboard = true;
  head.userData.animate = function(o, t) {
    o.rotation.z = Math.sin(t * 0.4) * 0.025;
  };

  return group;
}

function createLilies(scene, count) {
  var colors = [
    0xf0f0f0, 0xe8e0e0, 0xf05090, 0xd03070, 0xe87020, 0xf06030,
    0xf0a080, 0xf08080, 0xe8a0c0, 0xd05080, 0xe07050, 0xc0a080
  ];
  var hexColors = ['#f0f0f0','#e8e0e0','#f05090','#d03070','#e87020','#f06030','#f0a080','#f08080','#e8a0c0','#d05080','#e07050','#c0a080'];

  for (var i = 0; i < count; i++) {
    var ci = Math.floor(Math.random() * hexColors.length);
    var variant = Math.floor(Math.random() * 3);
    var s = isMobile ? (0.7 + Math.random() * 0.5) : (0.5 + Math.random() * 0.5);
    var spreadX = isMobile ? 10 : 14;
    var spreadZ = isMobile ? 6 : 8;
    var lily = createLily3D(
      (Math.random() - 0.5) * spreadX,
      isMobile ? -0.1 + s * 0.3 : -0.4 + s * 0.25,
      (Math.random() - 0.5) * spreadZ + 1,
      s, hexColors[ci], variant
    );
    var ph = Math.random() * Math.PI * 2;
    lily.userData.animate = function(o, t) {
      o.rotation.z = Math.sin(t * 0.4 + ph) * 0.03;
      o.rotation.x = Math.sin(t * 0.6 + ph) * 0.02;
      o.children.forEach(function(child) {
        if (child.userData && child.userData.isBillboard && child.userData.animate) {
          child.userData.animate(child, t);
        }
      });
    };
    scene.add(lily);
  }
}

// ═══════════════════════════════════════
// 3D MUSIC NOTES — floating 3D shapes
// ═══════════════════════════════════════
function createMusicNotes(scene, count) {
  var noteGroup = new THREE.Group();
  var noteColors = [0xffd54f, 0xff8a65, 0x4fc3f7, 0xb388ff, 0x80cbc4];

  for (var i = 0; i < count; i++) {
    var color = noteColors[i % noteColors.length];
    var mat = new THREE.MeshStandardMaterial({
      color: color, emissive: color, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.7, roughness: 0.3, metalness: 0.1
    });

    // Create note shape — sphere head + cylinder stem
    var noteWrapper = new THREE.Group();

    // Note head — small sphere
    var headGeo = new THREE.SphereGeometry(0.06, 8, 8);
    var head = new THREE.Mesh(headGeo, mat);
    head.position.set(0.04, 0, 0);
    head.rotation.z = -0.3;
    noteWrapper.add(head);

    // Note stem — thin cylinder
    var stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4);
    var stem = new THREE.Mesh(stemGeo, mat);
    stem.position.set(-0.02, 0.1, 0);
    noteWrapper.add(stem);

    // Note flag — small cone
    var flagGeo = new THREE.ConeGeometry(0.04, 0.08, 4);
    var flag = new THREE.Mesh(flagGeo, mat);
    flag.position.set(0.02, 0.18, 0);
    flag.rotation.z = -0.5;
    noteWrapper.add(flag);

    // Position in scene
    noteWrapper.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 14
    );

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
        if (o.position.y > ry) {
          o.position.y = -4 - Math.random() * 4;
          o.position.x = (Math.random() - 0.5) * 18;
          o.position.z = (Math.random() - 0.5) * 14;
        }
      };
    })(riseSpeed, rotSpeed, rotPhase, driftAmp, driftFreq, driftPhase, resetY, startX);

    noteGroup.add(noteWrapper);
  }

  noteGroup.userData.animate = function(o, t) {
    o.children.forEach(function(child) {
      if (child.userData.animate) child.userData.animate(child, t);
    });
  };

  scene.add(noteGroup);
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
      for (var i = s.trailLength - 1; i > 0; i--) {
        s.positions[i*3] = s.positions[(i-1)*3]; s.positions[i*3+1] = s.positions[(i-1)*3+1]; s.positions[i*3+2] = s.positions[(i-1)*3+2];
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
  return { update: function(t, dt) {
    nextSpawn -= dt;
    if (nextSpawn <= 0) {
      var found = false;
      for (var i = 0; i < pool.length; i++) {
        if (!pool[i].star.active) {
          var s = pool[i].star;
          s.active = true; s.life = 0; s.maxLife = 1.5 + Math.random() * 0.8;
          var sr = 35 + Math.random() * 10, st = Math.random() * Math.PI * 2, sp = Math.random() * Math.PI * 0.4;
          s.sx = sr * Math.sin(sp) * Math.cos(st); s.sy = sr * Math.sin(sp) * Math.sin(st) + 5; s.sz = sr * Math.cos(sp);
          s.dx = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15);
          s.dy = (-0.3-Math.random()*0.5) * (0.15+Math.random()*0.15);
          s.dz = ((Math.random()-0.5)*0.8) * (0.15+Math.random()*0.15);
          pool[i].points.visible = true; pool[i].points.material.opacity = 1.0;
          found = true; break;
        }
      }
      if (!found && pool.length < maxActive) spawn();
      nextSpawn = 3 + Math.random() * 4;
    }
  }};
}

// ═══════════════════════════════════════
// WAVES
// ═══════════════════════════════════════
function createWaves(scene, segs) {
  segs = segs || (isLowEnd ? 32 : 64);
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

// ═══════════════════════════════════════
// CLICK → FLUTE + NOTES
// ═══════════════════════════════════════
function spawnNotesBurst(cx, cy, count) {
  var symbols = ['♪','♫','♩','♬','♭','♮','♯'];
  var colors = ['#ffd54f','#ff8a65','#4fc3f7','#b388ff','#80cbc4','#fff8e1','#ffcc80'];
  count = count || 6;

  // Show animated Krishna's bansuri at click position
  var fluteEl = document.createElement('div');
  fluteEl.innerHTML = `<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;">
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
    <rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/>
    <rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/>
    <rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/>
    <ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/>
    <ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/>
    <ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/>
    <ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/>
    <rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    <rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    <rect x="24" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/>
    <circle cx="168" cy="24" r="5" fill="#8a6820" opacity="0.8"/>
    <circle cx="168" cy="24" r="3" fill="#d4a843" opacity="0.6"/>
    <text x="2" y="14" font-size="12" fill="#ffd54f" opacity="0.8" font-family="serif">♪</text>
    <text x="170" y="12" font-size="10" fill="#ff8a65" opacity="0.6" font-family="serif">♫</text>
  </svg>`;
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
        var ox = 80 + (Math.random()-0.2)*110;
        var oy = (Math.random()-0.5)*70-35;
        n.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;font-family:serif;font-size:'+size+'rem;color:'+color+';left:'+(cx+ox)+'px;top:'+(cy+oy)+'px;animation:noteFloat 2s ease-out forwards;will-change:transform,opacity';
        document.body.appendChild(n);
        setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},2100);
      }, idx*70);
    })(i);
  }
  setTimeout(function() {
    fluteEl.style.opacity='0';
    fluteEl.style.transform='scale(0.85) rotate(5deg)';
    setTimeout(function(){if(fluteEl.parentNode)fluteEl.parentNode.removeChild(fluteEl);},350);
  }, 1500);
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

  window.addEventListener('orientationchange', function() {
    setTimeout(function() { scene.onResize(); }, 200);
  });
})();
