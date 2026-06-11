import * as THREE from "three";
import { saveConstellations, loadConstellations } from "./scene-utils.js";

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
