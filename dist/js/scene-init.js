// public/js/scene-init.js — Client-side Three.js scene initialization
// This runs in the browser after Astro's build. Shader params come from window.__VG_SHADER.

import { VanGoghScene } from '/_astro/SceneManager.js';
import { createMoon } from '/_astro/Moon.js';
import { createSunflowers } from '/_astro/Sunflowers.js';
import { createTulips } from '/_astro/Tulips.js';
import { createStars, createConstellations } from '/_astro/Stars.js';
import { createFlute } from '/_astro/Flute.js';
import { createMusicNotes } from '/_astro/MusicNotes.js';
import { createWaves } from '/_astro/Waves.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new VanGoghScene(container);

  // Create all 3D elements
  createStars(scene.scene, 3000);
  createConstellations(scene.scene);
  createMoon(scene.scene);
  createSunflowers(scene.scene, 15);
  createTulips(scene.scene, 10);
  createFlute(scene.scene);
  createMusicNotes(scene.scene, 40);
  createWaves(scene.scene, 'night');

  // Apply today's shader params from build-time injection
  if (window.__VG_SHADER) {
    scene.updateUniforms({
      strokeDensity: window.__VG_SHADER.strokeDensity,
      swirlFrequency: window.__VG_SHADER.swirlFrequency,
      colorIntensity: window.__VG_SHADER.colorIntensity
    });
  }
});
