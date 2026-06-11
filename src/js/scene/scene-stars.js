import * as THREE from "three";
import { starVS, starFS } from "./scene-shaders.js";
import { isMobile } from "./scene-config.js";

function createStarLayer(scene, count, sizeMult, brightMult, twinkleAmp) {
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const bright = new Float32Array(count);
  const tSpeed = new Float32Array(count);
  const tPhase = new Float32Array(count);
  const cols = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 40 + Math.random() * 20;
    pos[i3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i3 + 2] = r * Math.cos(phi);
    sizes[i] = (0.8 + Math.random() * 2.5) * sizeMult;
    bright[i] = (0.3 + Math.random() * 0.7) * brightMult;
    tSpeed[i] = 0.8 + Math.random() * 4.0;
    tPhase[i] = Math.random() * Math.PI * 2;
    const temp = Math.random();
    if (temp < 0.3) {
      cols[i3] = 1.0;
      cols[i3 + 1] = 0.95;
      cols[i3 + 2] = 0.7;
    } else if (temp < 0.6) {
      cols[i3] = 0.7;
      cols[i3 + 1] = 0.8;
      cols[i3 + 2] = 1.0;
    } else {
      cols[i3] = 1.0;
      cols[i3 + 1] = 0.6;
      cols[i3 + 2] = 0.3;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("brightness", new THREE.BufferAttribute(bright, 1));
  geo.setAttribute("twinkleSpeed", new THREE.BufferAttribute(tSpeed, 1));
  geo.setAttribute("twinklePhase", new THREE.BufferAttribute(tPhase, 1));
  geo.setAttribute("customColor", new THREE.BufferAttribute(cols, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: starVS,
    fragmentShader: starFS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geo, mat);
  stars.userData.animate = function (o, t) {
    o.material.uniforms.uTime.value = t;
    o.rotation.y = t * 0.008;
    o.rotation.x = Math.sin(t * 0.015) * 0.04 * twinkleAmp;
    o.rotation.z = Math.cos(t * 0.012) * 0.02 * twinkleAmp;
  };
  scene.add(stars);
  return stars;
}

export function createStars(scene, count) {
  const mobileMult = isMobile ? 0.7 : 1.0;
  const nearCount = Math.floor(count * 0.3 * mobileMult);
  const midCount = Math.floor(count * 0.4 * mobileMult);
  const farCount = Math.floor(count * 0.3 * mobileMult);
  scene.userData._starsNear = createStarLayer(scene, nearCount, 2.5, 1.0, 1.0);
  scene.userData._starsMid = createStarLayer(scene, midCount, 1.8, 0.7, 0.7);
  scene.userData._starsFar = createStarLayer(scene, farCount, 1.2, 0.4, 0.4);
}

export function createConstellations(scene) {
  const constellations = [
    {
      points: [
        [-2, 5, -30],
        [0, 6, -30],
        [2, 5, -30],
        [-3, 8, -30],
        [3, 8, -30],
        [-2, 2, -30],
        [2, 2, -30],
      ],
    },
    {
      points: [
        [-10, 10, -35],
        [-8, 11, -35],
        [-6, 10.5, -35],
        [-5, 9, -35],
        [-6, 7, -35],
        [-8, 7.5, -35],
        [-9, 8.5, -35],
      ],
    },
  ];
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6688cc,
    transparent: true,
    opacity: 0.3,
  });
  constellations.forEach((item) => {
    const points = item.points.map((v) => new THREE.Vector3(v[0], v[1], v[2]));
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        lineMaterial,
      ),
    );
  });
}

export function createShootingStars(scene, maxActive) {
  maxActive = maxActive || (isMobile ? 1 : 2);
  const pool = [];
  let nextSpawn = 3 + Math.random() * 4;
  function spawn() {
    const trailLength = isMobile ? 12 : 20;
    const positions = new Float32Array(trailLength * 3);
    const opacities = new Float32Array(trailLength);
    const startR = 35 + Math.random() * 10;
    const startTheta = Math.random() * Math.PI * 2;
    const startPhi = Math.random() * Math.PI * 0.4;
    const sx = startR * Math.sin(startPhi) * Math.cos(startTheta);
    const sy = startR * Math.sin(startPhi) * Math.sin(startTheta) + 5;
    const sz = startR * Math.cos(startPhi);
    const speed = 0.15 + Math.random() * 0.15;
    const star = {
      active: true,
      life: 0,
      maxLife: 1.5 + Math.random() * 0.8,
      sx,
      sy,
      sz,
      dx: (Math.random() - 0.5) * 0.8 * speed,
      dy: (-0.3 - Math.random() * 0.5) * speed,
      dz: (Math.random() - 0.5) * 0.8 * speed,
      positions,
      opacities,
      trailLength,
      headSize: isMobile ? 3.0 : 4.0,
      headColor: new THREE.Color().setHSL(
        0.12 + Math.random() * 0.05,
        0.8,
        0.9,
      ),
    };
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    const mat = new THREE.PointsMaterial({
      color: star.headColor,
      size: star.headSize,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.userData.shootingStar = star;
    points.userData.animate = function (o, dt) {
      const s = o.userData.shootingStar;
      if (!s.active) return;
      s.life += dt;
      if (s.life >= s.maxLife) {
        o.visible = false;
        s.active = false;
        return;
      }
      s.sx += s.dx;
      s.sy += s.dy;
      s.sz += s.dz;
      for (let i = s.trailLength - 1; i > 0; i--) {
        s.positions[i * 3] = s.positions[(i - 1) * 3];
        s.positions[i * 3 + 1] = s.positions[(i - 1) * 3 + 1];
        s.positions[i * 3 + 2] = s.positions[(i - 1) * 3 + 2];
        s.opacities[i] = s.opacities[i - 1] * 0.85;
      }
      s.positions[0] = s.sx;
      s.positions[1] = s.sy;
      s.positions[2] = s.sz;
      s.opacities[0] = 1.0;
      const lifeRatio = s.life / s.maxLife;
      const fade = lifeRatio < 0.7 ? 1.0 : 1.0 - (lifeRatio - 0.7) / 0.3;
      o.material.opacity = fade;
      o.material.size = s.headSize * (0.5 + fade * 0.5);
      o.geometry.attributes.position.needsUpdate = true;
    };
    scene.add(points);
    pool.push({ points, star });
  }

  return {
    update(t, dt) {
      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        let found = false;
        for (let i = 0; i < pool.length; i++) {
          if (!pool[i].star.active) {
            const s = pool[i].star;
            s.active = true;
            s.life = 0;
            s.maxLife = 1.5 + Math.random() * 0.8;
            const sr = 35 + Math.random() * 10;
            const st = Math.random() * Math.PI * 2;
            const sp = Math.random() * Math.PI * 0.4;
            s.sx = sr * Math.sin(sp) * Math.cos(st);
            s.sy = sr * Math.sin(sp) * Math.sin(st) + 5;
            s.sz = sr * Math.cos(sp);
            const speed = 0.15 + Math.random() * 0.15;
            s.dx = (Math.random() - 0.5) * 0.8 * speed;
            s.dy = (-0.3 - Math.random() * 0.5) * speed;
            s.dz = (Math.random() - 0.5) * 0.8 * speed;
            pool[i].points.visible = true;
            pool[i].points.material.opacity = 1.0;
            found = true;
            break;
          }
        }
        if (!found && pool.length < maxActive) spawn();
        nextSpawn = 3 + Math.random() * 4;
      }
    },
  };
}
