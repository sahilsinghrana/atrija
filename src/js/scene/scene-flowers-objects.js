import * as THREE from "three";
import {
  makeTulipCanvas,
  makeLilyCanvas,
} from "./scene-flowers.js";
import { isMobile } from "./scene-config.js";

export function createTulips(scene, count) {
  const colors = [
    "#c0392b", "#e74c3c", "#d63031", "#b715b7", "#d81b60",
    "#e91e63", "#f06292", "#ec407a", "#ad1457", "#ff7043",
    "#ff5722", "#f4511e", "#ee9836", "#ff8a65", "#8b0000",
    "#9b3676", "#7b1fa2", "#9c27b0", "#5e27a1", "#dc143c",
    "#c71585", "#b33939", "#cd5c5c", "#b97455", "#fa8072",
    "#e9967a", "#ff6347", "#ff4500", "#33cc8c",
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

    // Bake color directly into canvas texture
    const tex = new THREE.CanvasTexture(makeTulipCanvas(256, color, openness, texSeed));
    tex.minFilter = THREE.LinearFilter;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      })
    );

    const roll = Math.random();
    let s;
    if (roll < 0.25) {
      s = isMobile ? 1.4 + Math.random() * 0.4 : 1.2 + Math.random() * 0.5;
    } else {
      s = isMobile ? 0.9 + Math.random() * 0.5 : 0.8 + Math.random() * 0.55;
    }

    // Original scale: 1.5 wide, 2.0 tall — tall tulip shape
    sprite.scale.set(1.5 * s, 2.0 * s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * spreadX,
      isMobile ? -0.05 + s * 0.2 : -0.15 + s * 0.18,
      (Math.random() - 0.5) * spreadZ + 0.5,
    );

    const phase = Math.random() * Math.PI * 2;
    const baseY = sprite.position.y;
    const baseX = sprite.position.x;
    sprite.userData.animate = function (o, t) {
      o.position.x = baseX + Math.sin(t * 0.4 + phase) * 0.025;
      o.position.y = baseY + Math.sin(t * 0.6 + phase) * 0.03;
      o.material.rotation = Math.sin(t * 0.5 + phase) * 0.04;
    };

    scene.add(sprite);
  }
}

export function createSunflowers(scene, count) {
  const colors = [
    "#FFD700", "#FFC700", "#FFB700", "#FFAA00", "#FF9500",
    "#c8920a", "#e8a020", "#d4a030", "#b8860b", "#daa520",
  ];

  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const s = isMobile ? 0.8 + Math.random() * 0.6 : 0.6 + Math.random() * 0.7;
    const spreadX = isMobile ? 14 : 18;
    const spreadZ = isMobile ? 10 : 12;

    // Build sunflower canvas inline with specific color baked in
    const size = 256;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    const hcx = size / 2;
    const headCy = size * 0.35;
    const r = size * 0.28;

    ctx.clearRect(0, 0, size, size);

    // Stem
    ctx.strokeStyle = "#2d5a1e";
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(hcx, headCy + r * 0.8);
    ctx.bezierCurveTo(
      hcx + size * 0.03, headCy + r * 1.5,
      hcx - size * 0.02, headCy + r * 2.2,
      hcx, size
    );
    ctx.stroke();

    // Leaves
    ctx.fillStyle = "#3a7a2e";
    for (let side = -1; side <= 1; side += 2) {
      ctx.save();
      ctx.translate(hcx + side * size * 0.02, headCy + r * 1.6);
      ctx.rotate(side * 0.4);
      ctx.beginPath();
      ctx.ellipse(side * size * 0.08, 0, size * 0.1, size * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Parse petal color
    const hex = color.replace("#", "");
    const rr = parseInt(hex.substring(0, 2), 16);
    const gg = parseInt(hex.substring(2, 4), 16);
    const bb = parseInt(hex.substring(4, 6), 16);

    // Outer petals
    const petalCount = 18;
    ctx.fillStyle = color;
    for (let p = 0; p < petalCount; p++) {
      const aAngle = (p / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.translate(hcx, headCy);
      ctx.rotate(aAngle);
      ctx.beginPath();
      ctx.ellipse(0, -(r * 0.75), r * 0.13, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill(); // FIXED: was missing in original makeSunflowerCanvas
      ctx.restore();
    }

    // Inner petals (lighter)
    const lr = Math.min(255, rr + 40);
    const lg = Math.min(255, gg + 30);
    const lb = Math.min(255, bb + 20);
    ctx.fillStyle = `rgb(${lr},${lg},${lb})`;
    for (let p = 0; p < petalCount; p++) {
      const aOffset = (p / petalCount) * Math.PI * 2 + (Math.PI / petalCount) * 0.5;
      ctx.save();
      ctx.translate(hcx, headCy);
      ctx.rotate(aOffset);
      ctx.beginPath();
      ctx.ellipse(0, -(r * 0.68), r * 0.12, r * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Center
    const grad = ctx.createRadialGradient(hcx, headCy, 0, hcx, headCy, r * 0.3);
    grad.addColorStop(0, "#3a1a00");
    grad.addColorStop(0.6, "#2a1200");
    grad.addColorStop(1, "#1a0a00");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(hcx, headCy, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Seeds
    ctx.fillStyle = "#5a3010";
    for (let s2 = 0; s2 < 20; s2++) {
      const angle = s2 * 2.399963;
      const rad = r * 0.26 * Math.sqrt(s2 / 20);
      ctx.beginPath();
      ctx.arc(
        hcx + Math.cos(angle) * rad,
        headCy + Math.sin(angle) * rad,
        size * 0.015,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      })
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
    sprite.userData.animate = function (o, t) {
      o.position.x = baseX + Math.sin(t * 0.3 + phase) * 0.02;
      o.position.y = baseY + Math.sin(t * 0.5 + phase) * 0.025;
      o.material.rotation = Math.sin(t * 0.4 + phase) * 0.03;
    };

    scene.add(sprite);
  }
}

export function createLilies(scene, count) {
  const colors = [
    "#f05090", "#d03070", "#e87020", "#f06030", "#f0a080",
    "#f08080", "#e8a0c0", "#d05080", "#e07050", "#c0a080",
  ];

  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const variant = Math.floor(Math.random() * 3);
    const s = isMobile ? 0.7 + Math.random() * 0.5 : 0.5 + Math.random() * 0.5;
    const spreadX = isMobile ? 10 : 14;
    const spreadZ = isMobile ? 6 : 8;

    const tex = new THREE.CanvasTexture(makeLilyCanvas(160, color, variant));
    tex.minFilter = THREE.LinearFilter;

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      })
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
    sprite.userData.animate = function (o, t) {
      o.position.x = baseX + Math.sin(t * 0.5 + phase) * 0.04;
      o.position.y = baseY + Math.sin(t * 0.75 + phase) * 0.06;
      o.material.rotation =
        Math.sin(t * 0.6 + phase) * 0.08 + Math.sin(t * 1.5 + phase * 2) * 0.03;
    };

    scene.add(sprite);
  }
}
