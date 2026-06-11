import * as THREE from "three";
import { paintingRevealVS, paintingRevealFS } from "./scene-shaders.js";
import { isMobile, isLowEnd } from "./scene-config.js";

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
