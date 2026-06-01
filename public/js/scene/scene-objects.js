import * as THREE from "https://esm.sh/three@0.160.0";
import {
  starVS,
  starFS,
  waveVS,
  waveFS,
  fireflyVS,
  fireflyFS,
  paintingRevealVS,
  paintingRevealFS,
} from "./scene-shaders.js";
import {
  getMoonPhase,
  getMoonPhaseName,
  getMoonEmoji,
  saveConstellations,
  loadConstellations,
} from "./scene-utils.js";
import {
  makeSunflowerCanvas,
  makeTulipCanvas,
  makeLilyCanvas,
} from "./scene-flowers.js";
import { isMobile, isLowEnd, scrollState } from "./scene-config.js";

export { createMoon } from "./scene-moon.js";

export function createTulips(scene, count) {
  const colors = [
    "#c0392b",
    "#e74c3c",
    "#d63031",
    "#b71540",
    "#c23616",
    "#d81b60",
    "#e91e63",
    "#f06292",
    "#ec407a",
    "#ad1457",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#e64a19",
    "#ff8a65",
    "#8b0000",
    "#6a1b4d",
    "#7b1fa2",
    "#9c27b0",
    "#4a148c",
    "#dc143c",
    "#c71585",
    "#b33939",
    "#cd5c5c",
    "#b97455",
    "#fa8072",
    "#e9967a",
    "#ff6347",
    "#ff4500",
    "#cc3366",
  ];
  let lastColorIdx = -1;
  for (let i = 0; i < count; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * colors.length);
    } while (idx === lastColorIdx);
    lastColorIdx = idx;
    const color = colors[idx];
    const openness = 0.3 + Math.random() * 0.65;
    const texSeed = Math.floor(Math.random() * 10000);
    const spreadX = isMobile ? 12 : 16;
    const spreadZ = isMobile ? 8 : 10;
    const tex = new THREE.CanvasTexture(
      makeTulipCanvas(256, color, openness, texSeed),
    );
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      }),
    );
    const roll = Math.random();
    let s;
    if (roll < 0.25) {
      s = isMobile ? 1.4 + Math.random() * 0.4 : 1.2 + Math.random() * 0.5;
    } else {
      s = isMobile ? 0.9 + Math.random() * 0.5 : 0.8 + Math.random() * 0.55;
    }
    sprite.scale.set(1.5 * s, 2.0 * s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      isMobile ? -0.05 + s * 0.2 : -0.15 + s * 0.18,
      (Math.random() - 0.5) * spreadZ + 0.5,
    );
    const phase = Math.random() * Math.PI * 2;
    const baseY = sprite.position.y;
    const baseX = sprite.position.x;
    (function (p, bx, by) {
      sprite.userData.animate = function (o, t) {
        o.position.x = bx + Math.sin(t * 0.4 + p) * 0.025;
        o.position.y = by + Math.sin(t * 0.6 + p) * 0.03;
        o.material.rotation = Math.sin(t * 0.5 + p) * 0.04;
      };
    })(phase, baseX, baseY);
    scene.add(sprite);
  }
}

export function createSunflowers(scene, count) {
  const colors = ["#FFD700", "#FFC700", "#FFB700", "#FFAA00", "#FF9500"];
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const s = isMobile ? 0.8 + Math.random() * 0.6 : 0.6 + Math.random() * 0.7;
    const spreadX = isMobile ? 14 : 18;
    const spreadZ = isMobile ? 10 : 12;
    const tex = new THREE.CanvasTexture(makeSunflowerCanvas(256, color));
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      }),
    );
    sprite.scale.set(1.2 * s, 1.5 * s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      isMobile ? 0 + s * 0.25 : -0.2 + s * 0.2,
      (Math.random() - 0.5) * spreadZ,
    );
    const phase = Math.random() * Math.PI * 2;
    const baseY = sprite.position.y;
    const baseX = sprite.position.x;
    (function (p, bx, by) {
      sprite.userData.animate = function (o, t) {
        o.position.x = bx + Math.sin(t * 0.3 + p) * 0.02;
        o.position.y = by + Math.sin(t * 0.5 + p) * 0.025;
        o.material.rotation = Math.sin(t * 0.4 + p) * 0.03;
      };
    })(phase, baseX, baseY);
    scene.add(sprite);
  }
}

export function createLilies(scene, count) {
  const colors = [
    "#f05090",
    "#d03070",
    "#e87020",
    "#f06030",
    "#f0a080",
    "#f08080",
    "#e8a0c0",
    "#d05080",
    "#e07050",
    "#c0a080",
  ];
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const variant = Math.floor(Math.random() * 3);
    const s = isMobile ? 0.7 + Math.random() * 0.5 : 0.5 + Math.random() * 0.5;
    const spreadX = isMobile ? 10 : 14;
    const spreadZ = isMobile ? 6 : 8;
    const tex = new THREE.CanvasTexture(makeLilyCanvas(160, color, variant));
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      }),
    );
    sprite.scale.set(1.0 * s, 1.6 * s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      isMobile ? -0.1 + s * 0.3 : -0.4 + s * 0.25,
      (Math.random() - 0.5) * spreadZ + 1,
    );
    const phase = Math.random() * Math.PI * 2;
    const baseY = sprite.position.y;
    const baseX = sprite.position.x;
    (function (p, bx, by) {
      sprite.userData.animate = function (o, t) {
        o.position.x = bx + Math.sin(t * 0.5 + p) * 0.04;
        o.position.y = by + Math.sin(t * 0.75 + p) * 0.06;
        o.material.rotation =
          Math.sin(t * 0.6 + p) * 0.08 + Math.sin(t * 1.5 + p * 2) * 0.03;
      };
    })(phase, baseX, baseY);
    scene.add(sprite);
  }
}

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

export function createFlute(scene) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4a833,
    roughness: 0.3,
    metalness: 0.6,
  });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12),
    bodyMat,
  );
  body.rotation.z = Math.PI * 0.15;
  group.add(body);
  for (let i = 0; i < 6; i++) {
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.07, 6),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a }),
    );
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 0.03, -0.8 + i * 0.25);
    group.add(hole);
  }
  const mouth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.3, 12),
    new THREE.MeshStandardMaterial({
      color: 0xc49833,
      roughness: 0.2,
      metalness: 0.7,
    }),
  );
  mouth.position.set(0, 1.35, 0);
  group.add(mouth);
  group.position.set(3, 1, -2);
  group.rotation.y = -0.3;
  group.userData.animate = function (o, t) {
    o.rotation.z = Math.sin(t * 0.2) * 0.05;
    o.position.y = 1 + Math.sin(t * 0.4) * 0.1;
  };
  scene.add(group);
}

export function createMusicNotes(scene, count) {
  const noteGroup = new THREE.Group();
  const noteColors = [0xffd54f, 0xff8a65, 0x4fc3f7, 0xb388ff, 0x80cbc4];
  for (let i = 0; i < count; i++) {
    const color = noteColors[i % noteColors.length];
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7,
      roughness: 0.3,
      metalness: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const noteWrapper = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mat);
    head.position.set(0.04, 0, 0);
    head.rotation.z = -0.3;
    noteWrapper.add(head);
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4),
      mat,
    );
    stem.position.set(-0.02, 0.1, 0);
    noteWrapper.add(stem);
    const flag = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), mat);
    flag.position.set(0.02, 0.18, 0);
    flag.rotation.z = -0.5;
    noteWrapper.add(flag);
    noteWrapper.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 14,
    );
    const noteScale = isMobile ? 1.2 : 0.6;
    noteWrapper.scale.setScalar(noteScale);
    const riseSpeed = 0.03 + Math.random() * 0.04;
    const rotSpeed = 0.5 + Math.random() * 1.5;
    const rotPhase = Math.random() * Math.PI * 2;
    const driftAmp = 0.005 + Math.random() * 0.01;
    const driftFreq = 0.4 + Math.random() * 0.8;
    const driftPhase = Math.random() * Math.PI * 2;
    const resetY = 5 + Math.random() * 4;
    const startX = noteWrapper.position.x;
    (function (rs, rsp, rph, da, df, dp, ry, sx) {
      noteWrapper.userData.animate = function (o, t) {
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
    })(
      riseSpeed,
      rotSpeed,
      rotPhase,
      driftAmp,
      driftFreq,
      driftPhase,
      resetY,
      startX,
    );
    noteGroup.add(noteWrapper);
  }
  scene.add(noteGroup);
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

export function createWaves(scene, segs) {
  segs = segs || (isLowEnd ? 32 : 64);
  const geo = new THREE.PlaneGeometry(30, 20, segs, segs);
  geo.rotateX(-Math.PI * 0.45);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWaveHeight: { value: 0.3 },
      uWaveFrequency: { value: 2.0 },
      uColor1: { value: new THREE.Vector3(0.02, 0.05, 0.15) },
      uColor2: { value: new THREE.Vector3(0.05, 0.1, 0.3) },
      uColor3: { value: new THREE.Vector3(0.1, 0.2, 0.4) },
    },
    vertexShader: waveVS,
    fragmentShader: waveFS,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const waves = new THREE.Mesh(geo, mat);
  waves.position.set(0, -2, 5);
  waves.userData.animate = function (o, t) {
    o.material.uniforms.uTime.value = t;
  };
  scene.add(waves);
}

function makeCypressShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.25, 0.3, 0.3, 0.8, 0.2, 1.5);
  shape.bezierCurveTo(0.35, 2.0, 0.3, 2.8, 0.15, 3.5);
  shape.bezierCurveTo(0.2, 4.0, 0.1, 4.5, 0.0, 5.0);
  shape.bezierCurveTo(-0.1, 4.5, -0.2, 4.0, -0.15, 3.5);
  shape.bezierCurveTo(-0.3, 2.8, -0.35, 2.0, -0.2, 1.5);
  shape.bezierCurveTo(-0.3, 0.8, -0.25, 0.3, 0, 0);
  return shape;
}

export function createCypressTrees(scene, count) {
  const shape = makeCypressShape();
  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: isLowEnd ? 1 : 2,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x0a0a12,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const positions = [
    { x: -10, z: 2, s: 1.3 },
    { x: -8, z: -1, s: 1.0 },
    { x: 10, z: 2, s: 1.2 },
    { x: 8, z: -1, s: 0.9 },
    { x: -4, z: -3, s: 1.1 },
  ];
  const trees = [];
  for (let i = 0; i < count && i < positions.length; i++) {
    const p = positions[i];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p.x, -1.5, p.z);
    mesh.scale.setScalar(p.s);
    mesh.renderOrder = -1;
    const phase = Math.random() * Math.PI * 2;
    const baseRotZ = (Math.random() - 0.5) * 0.04;
    (function (ph, br) {
      mesh.userData.animate = function (o, t) {
        o.rotation.z = br + Math.sin(t * 0.3 + ph) * 0.03;
        o.rotation.y = scrollState.current * 0.005;
        if (!isLowEnd) {
          const posAttr = o.geometry.attributes.position;
          if (posAttr && !o.userData._basePos)
            o.userData._basePos = new Float32Array(posAttr.array);
          if (posAttr && o.userData._basePos) {
            const basePos = o.userData._basePos;
            for (let v = 0; v < posAttr.count; v += 5) {
              const by = basePos[v * 3 + 1];
              if (by > 1.0) {
                posAttr.array[v * 3] =
                  basePos[v * 3] +
                  Math.sin(t * 0.5 + basePos[v * 3] * 2) * 0.02 * (by / 5.0);
              }
            }
            posAttr.needsUpdate = true;
          }
        }
      };
    })(phase, baseRotZ);
    scene.add(mesh);
    trees.push(mesh);
  }
  scene.userData._cypressTrees = trees;
}

export function createFireflies(scene, count) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const pulseSpeeds = new Float32Array(count);
  const basePositions = new Float32Array(count * 3);
  const velocities = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 24;
    const y = -1 + Math.random() * 7;
    const z = -5 + Math.random() * 13;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;
    phases[i] = Math.random() * Math.PI * 2;
    pulseSpeeds[i] = 1.0 + Math.random() * 2.0;
    velocities.push({ x: 0, y: 0, z: 0 });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("pulseSpeed", new THREE.BufferAttribute(pulseSpeeds, 1));
  const size = isMobile ? 5.0 : 8.0;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: size } },
    vertexShader: fireflyVS,
    fragmentShader: fireflyFS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.userData._fireflyData = {
    count,
    basePositions,
    velocities,
    mouseNDC: { x: 999, y: 999 },
  };
  points.userData.animate = function (o, t) {
    const data = o.userData._fireflyData;
    const pos = o.geometry.attributes.position.array;
    const mouse = scene.userData._mouseNDC || { x: 999, y: 999 };
    for (let i = 0; i < data.count; i++) {
      if (isMobile && i % 2 === t % 2) continue;
      const velocity = data.velocities[i];
      velocity.x += (Math.random() - 0.5) * 0.002;
      velocity.y += (Math.random() - 0.5) * 0.001;
      velocity.z += (Math.random() - 0.5) * 0.002;
      velocity.x *= 0.98;
      velocity.y *= 0.98;
      velocity.z *= 0.98;
      pos[i * 3] += velocity.x;
      pos[i * 3 + 1] += velocity.y;
      pos[i * 3 + 2] += velocity.z;
      const bx = data.basePositions[i * 3];
      const by = data.basePositions[i * 3 + 1];
      const bz = data.basePositions[i * 3 + 2];
      const dx = pos[i * 3] - bx;
      const dy = pos[i * 3 + 1] - by;
      const dz = pos[i * 3 + 2] - bz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 5) {
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = bz;
        velocity.x = 0;
        velocity.y = 0;
        velocity.z = 0;
      }
      if (mouse.x < 900) {
        const fx = pos[i * 3];
        const fy = pos[i * 3 + 1];
        const mdx = fx - mouse.x * 10;
        const mdy = fy - mouse.y * 8;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 3.0 && mDist > 0.01) {
          velocity.x += (mdx / mDist) * 0.05;
          velocity.y += (mdy / mDist) * 0.05;
        }
      }
    }
    o.geometry.attributes.position.needsUpdate = true;
    o.material.uniforms.uTime.value = t;
  };
  scene.add(points);
  scene.userData._fireflies = points;
}

export function createPaintingReveal(scene) {
  const width = isMobile ? 10 : 14;
  const height = isMobile ? 7 : 10;
  const segs = isLowEnd ? 10 : 20;
  const geo = new THREE.PlaneGeometry(width, height, 1, segs);
  const url =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/" +
    (isMobile ? "800" : "1280") +
    "px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg";
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTexture: { value: texture }, uRevealProgress: { value: 0.0 } },
    vertexShader: paintingRevealVS,
    fragmentShader: paintingRevealFS,
    transparent: true,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(geo, mat);
  plane.position.set(0, 1.5, -15);
  plane.visible = true;
  scene.add(plane);
  scene.userData._paintingPlane = plane;
  scene.userData._paintingRevealState = { section: null, progress: 0 };
}

export function updatePaintingReveal(scene) {
  if (!scene.userData._paintingRevealState) return;
  const state = scene.userData._paintingRevealState;
  if (!state.section) {
    state.section = document.getElementById("painting-reveal");
    if (!state.section) return;
  }
  const rect = state.section.getBoundingClientRect();
  const vh = window.innerHeight;
  let progress = (vh - rect.top) / (vh + rect.height);
  progress = Math.max(0, Math.min(1, progress));
  progress = progress * progress * (3 - 2 * progress);
  state.progress = progress;
  const plane = scene.userData._paintingPlane;
  if (plane && plane.material.uniforms) {
    plane.material.uniforms.uRevealProgress.value = progress;
  }
}

export function initConstellationInteraction(vanGoghScene) {
  const scene = vanGoghScene.scene;
  const camera = vanGoghScene.camera;
  const renderer = vanGoghScene.renderer;
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 2.0;
  const mouse = new THREE.Vector2();
  let selectedStars = [];
  let userLines = [];
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x88aaff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const hint = document.createElement("div");
  hint.id = "constellation-hint";
  hint.textContent = "✦ Tap stars to connect them";
  hint.style.cssText =
    "position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.4);font-family:Inter,sans-serif;font-size:0.8rem;letter-spacing:0.05em;pointer-events:none;transition:opacity 1s;white-space:nowrap;";
  document.body.appendChild(hint);

  function hideHint() {
    hint.style.opacity = "0";
    setTimeout(() => hint.remove(), 1000);
  }

  function createHighlightTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,220,100,1)");
    grad.addColorStop(0.5, "rgba(255,200,80,0.4)");
    grad.addColorStop(1, "rgba(255,180,50,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }

  const highlightTexture = createHighlightTexture();

  function onPointerDown(event) {
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    if (x == null || y == null) return;
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const starObjects = [];
    scene.traverse((obj) => {
      if (obj.isPoints && obj.geometry && obj.geometry.attributes.size) {
        starObjects.push(obj);
      }
    });
    const intersects = raycaster.intersectObjects(starObjects);
    if (!intersects.length) return;
    const hit = intersects[0];
    const starPos = hit.point.clone();
    let alreadySelected = false;
    for (let i = 0; i < selectedStars.length; i++) {
      if (selectedStars[i].distanceTo(starPos) < 1.5) {
        alreadySelected = true;
        break;
      }
    }
    if (alreadySelected) return;
    selectedStars.push(starPos);
    const highlight = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.8,
        map: highlightTexture,
        depthWrite: false,
      }),
    );
    highlight.position.copy(starPos);
    highlight.scale.set(2, 2, 1);
    highlight.userData.isHighlight = true;
    scene.add(highlight);
    if (selectedStars.length >= 2) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        selectedStars[selectedStars.length - 2],
        selectedStars[selectedStars.length - 1],
      ]);
      const line = new THREE.Line(lineGeo, lineMat.clone());
      line.userData.isUserLine = true;
      line.userData.createdAt = Date.now();
      scene.add(line);
      userLines.push(line);
      line.material.opacity = 0;
      const fadeStart = Date.now();
      line.userData.animate = function (o) {
        const elapsed = (Date.now() - fadeStart) / 1000;
        o.material.opacity = Math.min(0.6, elapsed * 2);
        if (Date.now() - o.userData.createdAt > 30000) {
          o.material.opacity = Math.max(
            0,
            0.6 - (Date.now() - o.userData.createdAt - 30000) / 5000,
          );
        }
      };
      saveConstellations(userLines);
    }
    if (selectedStars.length === 2) hideHint();
    if (selectedStars.length >= 6) {
      setTimeout(clearUserLines, 5000);
    }
  }

  function clearUserLines() {
    for (let i = userLines.length - 1; i >= 0; i--) {
      scene.remove(userLines[i]);
      userLines[i].geometry.dispose();
      userLines[i].material.dispose();
    }
    userLines = [];
    selectedStars = [];
    const toRemove = [];
    scene.traverse((obj) => {
      if (obj.userData.isHighlight) toRemove.push(obj);
    });
    toRemove.forEach((obj) => scene.remove(obj));
    localStorage.removeItem("atrija-constellations");
  }

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("touchstart", onPointerDown, {
    passive: true,
  });

  const saved = loadConstellations();
  if (saved && saved.length > 0 && scene.userData._cypressTrees) {
    saved.forEach((data) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(data.x1, data.y1, data.z1),
        new THREE.Vector3(data.x2, data.y2, data.z2),
      ]);
      const line = new THREE.Line(lineGeo, lineMat.clone());
      line.userData.isUserLine = true;
      line.userData.createdAt = Date.now() - 10000;
      scene.add(line);
      userLines.push(line);
    });
  }
}

export function spawnNotesBurst(cx, cy, count = 6) {
  const symbols = ["♪", "♫", "♩", "♬", "♭", "♮", "♯"];
  const colors = [
    "#ffd54f",
    "#ff8a65",
    "#4fc3f7",
    "#b388ff",
    "#80cbc4",
    "#fff8e1",
    "#ffcc80",
  ];
  const fluteEl = document.createElement("div");
  fluteEl.innerHTML = `<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;"><defs><linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#d4a843;stop-opacity:1"/><stop offset="45%" style="stop-color:#c49833;stop-opacity:1"/><stop offset="55%" style="stop-color:#b88820;stop-opacity:1"/><stop offset="100%" style="stop-color:#a67810;stop-opacity:1"/></linearGradient><linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f5d870;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#e8c060;stop-opacity:0.3"/></linearGradient></defs><rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/><rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/><rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/><ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/><ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/><rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/></svg>`;
  fluteEl.style.cssText =
    "position:fixed;z-index:9998;pointer-events:none;left:" +
    (cx - 90) +
    "px;top:" +
    (cy - 24) +
    "px;opacity:0;transform:scale(0.5) rotate(-8deg);transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);will-change:transform,opacity;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))";
  document.body.appendChild(fluteEl);
  requestAnimationFrame(() => {
    fluteEl.style.opacity = "1";
    fluteEl.style.transform = "scale(1) rotate(-2deg)";
  });

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const note = document.createElement("div");
      note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const size = (1.0 + Math.random() * 0.8).toFixed(2);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const ox = 80 + (Math.random() - 0.2) * 110;
      const oy = (Math.random() - 0.5) * 70 - 35;
      note.style.cssText =
        "position:fixed;z-index:9999;pointer-events:none;font-family:serif;font-size:" +
        size +
        "rem;color:" +
        color +
        ";left:" +
        (cx + ox) +
        "px;top:" +
        (cy + oy) +
        "px;animation:noteFloat 2s ease-out forwards;will-change:transform,opacity";
      document.body.appendChild(note);
      setTimeout(() => {
        if (note.parentNode) note.parentNode.removeChild(note);
      }, 2100);
    }, i * 70);
  }

  setTimeout(() => {
    fluteEl.style.opacity = "0";
    fluteEl.style.transform = "scale(0.85) rotate(5deg)";
    setTimeout(() => {
      if (fluteEl.parentNode) fluteEl.parentNode.removeChild(fluteEl);
    }, 350);
  }, 1500);
}
