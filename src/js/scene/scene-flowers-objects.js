import * as THREE from "three";
import {
  makeSunflowerCanvas,
  makeTulipCanvas,
  makeLilyCanvas,
} from "./scene-flowers.js";
import { isMobile } from "./scene-config.js";

export function createTulips(scene, count) {
  const colors = [
    "#cecece",
    "#c0392b",
    "#e74c3c",
    "#d63031",
    "#b715b7",
    "#10acf5",
    "#d81b60",
    "#e91e63",
    "#f06292",
    "#ec407a",
    "#ad1457",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#ee9836",
    "#ff8a65",
    "#8b0000",
    "#9b3676",
    "#7b1fa2",
    "#9c27b0",
    "#5e27a1",
    "#dc143c",
    "#c71585",
    "#b33939",
    "#cd5c5c",
    "#b97455",
    "#fa8072",
    "#e9967a",
    "#ff6347",
    "#ff4500",
    "#33cc8c",
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
