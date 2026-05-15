# PRD: Cypress Tree Silhouettes with Wind Animation

> **ID:** idea-020
> **Category:** 3D Elements
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-16

---

## 1. Overview

**One-liner:** Iconic Van Gogh-style cypress tree silhouettes rendered as 3D plane meshes in the scene background, swaying gently with a wind animation shader.

**Problem:** The current 3D scene has stars, moon, sunflowers, tulips, waves, and music notes — but it's missing the most iconic Van Gogh motif: the cypress tree. Van Gogh painted cypresses dozens of times (most famously in "The Starry Night" and "Wheat Field with Cypresses"). Their absence is a missed opportunity for visual identity.

**Solution:** Add 3-5 cypress tree silhouettes as textured plane meshes positioned at varying depths in the background. Each tree uses a dark silhouette texture with an alpha channel shaped like a flame-like cypress crown. A vertex shader applies a gentle sinusoidal sway animation simulating wind, with phase offsets per tree so they don't all sway in unison.

---

## 2. User Stories

- As a visitor, I want to see Van Gogh's iconic cypress trees in the background so that the scene feels more authentic to his artistic vision.
- As a visitor, I want the trees to sway gently in the wind so that the scene feels alive and organic.
- As a visitor, I want the trees to be subtle background elements so that they don't compete with the foreground content.
- As a mobile visitor, I want fewer trees with simpler animation so that the experience is smooth on my device.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Add cypress tree creation, texture loading, and wind animation
- **New file:** `public/images/cypress.svg` — SVG silhouette of a single cypress tree (used as texture)
- **No new JS modules** — This is added directly to `scene-init.js` alongside existing 3D objects

The cypress trees are `THREE.Mesh` objects with `THREE.PlaneGeometry` and a `THREE.MeshBasicMaterial` using the cypress SVG as a texture. They are positioned in the background (z = -5 to -15) and use a custom vertex shader for wind sway.

### 3.2 Implementation Details

#### Step 1: Create the cypress tree SVG silhouette
- File: `public/images/cypress.svg`
- What to do:
  - Create an SVG with a single cypress tree silhouette
  - The tree shape: tall, narrow trunk (10% width) with a flame-shaped crown (90% of height) — wide at the base, tapering to a rounded point
  - Color: solid black (`#000000`) on transparent background
  - Dimensions: 200×600 viewBox (width:height ratio ≈ 1:3)
  - The crown should have a slightly organic, wavy edge (not a perfect triangle) to match Van Gogh's expressive style
  - Export as SVG with `preserveAspectRatio="xMidYMid slice"`
- Expected outcome: A clean cypress silhouette that can be used as a texture with alpha transparency

#### Step 2: Create the cypress tree meshes
- File: `public/js/scene-init.js`
- What to do:
  - Load the cypress SVG texture using `new THREE.TextureLoader().load('/images/cypress.svg')`
  - Set `texture.colorSpace = THREE.SRGBColorSpace`
  - Create a material: `new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.1, side: THREE.DoubleSide, depthWrite: false })`
  - Create 5 cypress tree meshes (desktop) / 3 (mobile) with `THREE.PlaneGeometry(1.5, 5)` (width:height = 1:3.33)
  - Position them:
    - Tree 1: x = -6, y = -1, z = -8 (far left, partially off-screen)
    - Tree 2: x = -3, y = -0.5, z = -10 (mid-left)
    - Tree 3: x = 2, y = -1.5, z = -7 (right, closer)
    - Tree 4: x = 5, y = -0.5, z = -12 (far right, distant)
    - Tree 5: x = -8, y = 0, z = -14 (extreme left, very distant)
  - Add all trees to a `cypressGroup` (`new THREE.Group()`) for collective management
  - Add `cypressGroup` to the main scene
- Expected outcome: Cypress silhouettes visible in the background, darker than the sky but not pure black

#### Step 3: Implement wind sway vertex shader
- File: `public/js/scene-init.js`
- What to do:
  - Replace the `MeshBasicMaterial` with `THREE.ShaderMaterial` using custom vertex/fragment shaders
  - Vertex shader:
    ```glsl
    uniform float uTime;
    uniform float uPhase;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      // Sway increases with height (y coordinate)
      float heightFactor = (position.y + 2.5) / 5.0; // normalized 0-1
      float sway = sin(uTime * 0.8 + uPhase) * 0.15 * heightFactor;
      sway += sin(uTime * 1.3 + uPhase * 0.7) * 0.08 * heightFactor; // secondary harmonic
      pos.x += sway;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    ```
  - Fragment shader:
    ```glsl
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      gl_FragColor = texColor;
    }
  - Set `alphaTest: 0.1` on the material
  - Each tree gets a different `uPhase` uniform (0, 1.2, 2.4, 3.6, 4.8) so they sway out of sync
- Expected outcome: Trees sway gently with a natural, organic motion

#### Step 4: Animate the wind uniform
- File: `public/js/scene-init.js`
- What to do:
  - In the existing animation loop, update `uTime` uniform for each cypress material:
    ```js
    cypressTrees.forEach(tree => {
      tree.material.uniforms.uTime.value = elapsedTime * 0.001; // convert ms to seconds
    });
    ```
  - Use the same clock/elapsed time as the rest of the scene
- Expected outcome: Continuous wind animation synchronized with the scene

#### Step 5: Adjust tree appearance for depth
- File: `public/js/scene-init.js`
- What to do:
  - Trees further back (more negative z) should be:
    - Slightly smaller (scale 0.7-0.9)
    - Slightly more transparent (material opacity 0.6-0.8)
    - Slightly lighter color (closer to background sky color) — simulate atmospheric perspective
  - Apply via a helper function:
    ```js
    function setTreeDepth(tree, depthFactor) {
      // depthFactor: 0 = closest, 1 = farthest
      tree.scale.setScalar(1 - depthFactor * 0.3);
      tree.material.opacity = 1 - depthFactor * 0.3;
    }
    ```
- Expected outcome: Trees have a sense of depth and atmospheric perspective

#### Step 6: Mobile adaptation
- File: `public/js/scene-init.js`
- What to do:
  - On mobile (viewport < 768px):
    - Render only 3 trees (remove trees 4 and 5)
    - Reduce geometry segments from default (1×1) — already minimal, no change needed
    - Simplify the vertex shader to a single sine wave (remove secondary harmonic)
    - Reduce sway amplitude by 30% (trees are closer to camera on mobile, excessive sway looks unnatural)
- Expected outcome: Smooth performance on mobile with 3 trees and simpler animation

### 3.3 Mobile Considerations

- Viewport < 768px: 3 trees instead of 5, simplified shader (single sine wave)
- Performance budget: Each tree is a single plane (2 triangles). 5 trees = 10 triangles desktop, 6 triangles mobile — completely negligible
- The `depthWrite: false` setting prevents z-buffer issues with transparent textures
- Trees are positioned behind all other 3D elements (negative z) so they don't occlude flowers or the moon
- `alphaTest: 0.1` ensures fully transparent pixels are discarded, reducing overdraw

### 3.4 Data Structures

```json
{
  "cypressTree": {
    "mesh": "THREE.Mesh",
    "geometry": "THREE.PlaneGeometry(1.5, 5)",
    "material": "THREE.ShaderMaterial",
    "uniforms": {
      "uTime": 0.0,
      "uPhase": 0.0
    },
    "position": { "x": -6, "y": -1, "z": -8 },
    "depthFactor": 0.3
  },
  "config": {
    "desktopCount": 5,
    "mobileCount": 3,
    "windSpeed": 0.8,
    "swayAmplitude": 0.15,
    "secondaryHarmonicAmplitude": 0.08,
    "mobileSwayReduction": 0.7
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Cypress SVG loads as valid texture | `tests/cypress/texture.test.js` | Texture is non-null, has valid image data |
| Correct number of trees created | `tests/cypress/creation.test.js` | Scene contains 5 cypress tree meshes (desktop) |
| Trees are positioned behind scene | `tests/cypress/positioning.test.js` | All tree z positions are negative (behind camera near plane) |
| Wind shader uniforms update | `tests/cypress/animation.test.js` | `uTime` increases between frames |
| Phase offsets are unique per tree | `tests/cypress/animation.test.js` | No two trees share the same `uPhase` value |
| Depth scaling is applied | `tests/cypress/depth.test.js` | Farther trees have smaller scale and lower opacity |
| Mobile renders fewer trees | `tests/cypress/mobile.test.js` | When viewport < 768, only 3 trees exist |
| Trees don't occlude foreground | `tests/cypress/rendering.test.js` | `depthWrite` is false on all tree materials |

### 4.2 Green Phase — Implementation

- Add cypress tree creation code to `scene-init.js`
- Create the `cypress.svg` silhouette file
- Verify trees appear in the background of the scene
- Verify wind sway animation is visible and trees sway out of sync
- Verify trees are behind the moon, flowers, and other elements

### 4.3 Refactor Phase — Optimization

- If the SVG texture causes a flash of unstyled content, pre-load it in the HTML or use a base64-encoded data URI
- Consider using a single `InstancedMesh` for all trees if the shader uniforms can be per-instance (Three.js r150+ supports `mesh.onBeforeRender` for per-instance uniforms)
- Cache the shader material and share it across trees, only updating per-tree uniforms in the render loop
- Profile GPU usage: ensure the vertex shader doesn't cause vertex processing bottlenecks (unlikely with 5 planes, but verify)

---

## 5. Acceptance Criteria

- [ ] 5 cypress tree silhouettes visible in the scene background on desktop
- [ ] 3 cypress tree silhouettes on mobile (viewport < 768px)
- [ ] Trees sway gently with wind animation (sinusoidal vertex displacement)
- [ ] Each tree sways with a different phase offset (not synchronized)
- [ ] Trees further back appear smaller and more transparent (atmospheric perspective)
- [ ] Trees are positioned behind all other 3D elements (moon, flowers, waves)
- [ ] Trees do not cause z-fighting or transparency rendering issues
- [ ] No frame rate drops below 55fps on desktop, 30fps on mobile
- [ ] Cypress SVG silhouette has organic, flame-like shape matching Van Gogh's style
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js `TextureLoader` and `ShaderMaterial` (already available in `scene-init.js`)
- The SVG file must be served from `/public/images/cypress.svg` and accessible at runtime
- The animation loop must be running (already exists for stars, moon, flowers)

**Risks:**
- **SVG texture not loading:** If the SVG fails to load, trees will be invisible. Mitigation: add a fallback solid-color material (dark green `#1a3a1a`) and log a warning
- **Trees look too uniform:** 5 identical silhouettes may look repetitive. Mitigation: slight random rotation (±5°) and scale variation (±10%) per tree
- **Wind animation too fast/slow:** The `0.8` speed constant may need tuning. Mitigation: make it a configurable constant at the top of the file
- **Z-index with post-processing:** The Van Gogh post-processing shader may affect tree colors. Mitigation: trees are dark silhouettes, so color shifts are minimal. Verify visually.
- **SVG file size:** Keep the SVG under 5KB. A simple silhouette path should be ~1-2KB.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Cypress tree silhouettes with wind sway animation — iconic Van Gogh motif added to 3D background",
  "changes": [
    "Added cypress.svg silhouette asset (flame-shaped cypress crown)",
    "5 cypress tree plane meshes with custom wind sway vertex shader",
    "Per-tree phase offset for natural unsynchronized sway",
    "Atmospheric depth scaling (distant trees smaller and more transparent)",
    "Mobile adaptation: 3 trees with simplified single-harmonic shader",
    "depthWrite: false for correct transparency rendering"
  ]
}
```
