import * as THREE from "https://esm.sh/three@0.160.0";
import { isMobile } from "./scene-config.js";

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
  // restore original full-size flute SVG and positioning
  fluteEl.innerHTML = `<svg viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:180px;height:48px;"><defs><linearGradient id="bambooGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#d4a843;stop-opacity:1"/><stop offset="45%" style="stop-color:#c49833;stop-opacity:1"/><stop offset="55%" style="stop-color:#b88820;stop-opacity:1"/><stop offset="100%" style="stop-color:#a67810;stop-opacity:1"/></linearGradient><linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f5d870;stop-opacity:0.8"/><stop offset="100%" style="stop-color:#e8c060;stop-opacity:0.3"/></linearGradient></defs><rect x="8" y="18" width="164" height="12" rx="6" fill="url(#bambooGrad)"/><rect x="8" y="19" width="164" height="4" rx="2" fill="url(#highlightGrad)" opacity="0.6"/><rect x="28" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="58" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="88" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="118" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><rect x="148" y="17" width="2.5" height="14" rx="1" fill="#8a6820" opacity="0.7"/><ellipse cx="45" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="65" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="85" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="105" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="125" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="145" cy="24" rx="3" ry="3.5" fill="#1a1a1a" opacity="0.9"/><ellipse cx="95" cy="20" rx="2" ry="2.5" fill="#2a2a2a" opacity="0.6"/><ellipse cx="14" cy="24" rx="4" ry="5" fill="#1a1a1a" opacity="0.85"/><ellipse cx="14" cy="24" rx="2.5" ry="3.5" fill="#3a2a1a" opacity="0.5"/><rect x="20" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="22" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="28" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="30" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="36" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/><rect x="38" y="20" width="1" height="8" fill="#cc2244" opacity="0.8"/></svg>`;
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
