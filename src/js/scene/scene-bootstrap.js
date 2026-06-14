import { VanGoghScene } from "./scene-manager.js";
import {
  createStars,
  createWaves,
  createCypressTrees,
  createPaintingReveal,
  createSunflowers,
  createLilies,
  createTulips,
  createFlute,
  createMusicNotes,
  createFireflies,
  createConstellations,
  createShootingStars,
  initConstellationInteraction,
  spawnNotesBurst,
} from "./scene-objects.js";
import { createMoon } from "./scene-moon.js";
import { getMoonPhase, getMoonPhaseName, getMoonEmoji } from "./scene-utils.js";
import { isMobile, isLowEnd, _parallaxObserver } from "./scene-config.js";

export function bootScene() {
  try {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    if (_parallaxObserver) _parallaxObserver.observe(container);

    const scene = new VanGoghScene(container);
    scene.scene.userData._camera = scene.camera;

    if (window.__sceneLoadingStarted) window.__sceneLoadingStarted();

    const starCount = isLowEnd ? 750 : 2500;
    const noteCount = isLowEnd ? 15 : 18;
    const sunflowerCount = isLowEnd ? 5 : 10;
    const lilyCount = isLowEnd ? 2 : 4;
    const tulipCount = isLowEnd ? 15 : 20;
    const waveSegs = isLowEnd ? 18 : 32;

    if (window.__updateLoaderProgress) window.__updateLoaderProgress(30);
    createStars(scene.scene, starCount);
    createMoon(scene.scene);
    createWaves(scene.scene, waveSegs);
    createCypressTrees(scene.scene, isLowEnd ? 2 : 5);
    createPaintingReveal(scene.scene);

    if (window.__updateLoaderProgress) window.__updateLoaderProgress(60);
    requestAnimationFrame(() => {
      if (window.__updateLoaderProgress) window.__updateLoaderProgress(90);
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("hidden");
      if (window.__updateLoaderProgress) window.__updateLoaderProgress(100);
      if (window.__sceneReady) window.__sceneReady();
    });

    setTimeout(() => {
      createSunflowers(scene.scene, sunflowerCount);
      createLilies(scene.scene, lilyCount);
      createTulips(scene.scene, tulipCount);
      createFlute(scene.scene);
      createMusicNotes(scene.scene, noteCount);
      createFireflies(scene.scene, isLowEnd ? 15 : isMobile ? 20 : 40);
    }, 300);

    if (!isLowEnd) {
      setTimeout(() => {
        createConstellations(scene.scene);
        scene.shootingStarManager = createShootingStars(
          scene.scene,
          isMobile ? 1 : 2,
        );
        initConstellationInteraction(scene);
      }, 800);
    } else {
      setTimeout(() => {
        createConstellations(scene.scene);
      }, 800);
    }

    const phaseLabel = document.getElementById("moon-phase-label");
    if (phaseLabel) {
      const mp = getMoonPhase();
      phaseLabel.innerHTML =
        getMoonEmoji(mp.fraction) +
        " " +
        getMoonPhaseName(mp.fraction) +
        " · " +
        Math.round(mp.illumination * 100) +
        "% illuminated";
    }

    scene.scene.userData._mouseNDC = { x: 999, y: 999 };
    window.addEventListener("mousemove", (e) => {
      scene.scene.userData._mouseNDC.x =
        (e.clientX / window.innerWidth) * 2 - 1;
      scene.scene.userData._mouseNDC.y =
        -(e.clientY / window.innerHeight) * 2 + 1;
    });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) {
          scene.scene.userData._mouseNDC.x =
            (e.touches[0].clientX / window.innerWidth) * 2 - 1;
          scene.scene.userData._mouseNDC.y =
            -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
      },
      { passive: true },
    );

    document.addEventListener("click", (e) => {
      const tag =
        e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      if (["a", "button", "input", "textarea", "select"].includes(tag)) return;
      if (e.target.closest && e.target.closest("#flute-container")) return;
      spawnNotesBurst(e.clientX, e.clientY, isMobile ? 8 : 6);
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        scene.onResize();
      }, 200);
    });
  } catch (error) {
    console.error("Scene init error:", error);
    if (window.__sceneFailed)
      window.__sceneFailed(error.message || String(error));
  }
}

// Expose globally and auto-boot when loaded as <script type="module">
if (typeof window !== 'undefined') {
  window.bootScene = bootScene;
  // Auto-boot: run after microtask so module exports are registered
  if (document.readyState !== 'loading') {
    Promise.resolve().then(() => bootScene());
  } else {
    document.addEventListener('DOMContentLoaded', () => bootScene());
  }
}
