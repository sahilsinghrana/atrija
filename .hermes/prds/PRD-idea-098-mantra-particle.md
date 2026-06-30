# PRD: Mantra Particle

> **ID:** idea-098
> **Category:** Interactivity
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-30

---

## 1. Overview

**One-liner:** Render a sacred mantra (single Unicode glyph) as a subtle particle that pulses and drifts in the 3D scene.

**Problem:** The site lacks a subtle, ambient symbol that reinforces the contemplative atmosphere without adding readable text that breaks visual minimalism.

**Solution:** Introduce a small Three.js sprite (or canvas texture) displaying a mantra character (e.g., "ॐ", "हूँ", "शांति") that behaves like a particle: slow drift, gentle scale pulse, low opacity, and responds to user interaction (e.g., slight attraction to cursor). The mantra changes daily or based on moon phase.

---

## 2. User Stories

- As a visitor, I want to notice a faint sacred symbol drifting in the scene so that it adds a layer of spiritual nuance.
- As a visitor, I want the symbol to be non-intrusive and not readable as text unless I focus, preserving the minimalist aesthetic.
- As a visitor, I want the mantra to evolve over time (daily or lunar) so that returning visitors see variation.

---

## 3. Technical Specification

### 3.1 Architecture

- Create new module `public/js/mantra-particle.js` that:
  - Defines a THREE.Sprite or THREE.Points with a texture generated from a canvas drawing the mantra glyph.
  - Loads a mantra schedule from `src/content/mantra.json` (mapping date or moon phase to glyph).
  - Updates the mantra texture at midnight (or on moon phase change) by regenerating the canvas texture.
  - Animates the sprite: position drift (slow sinusoidal), scale pulse (sine), opacity fluctuates.
  - Adds the sprite to the existing scene (imported from scene-manager or via event bus).
- Add `src/content/mantra.json` with default mantra and optional alternatives.
- Integrate by importing the module in `scene-manager.js` or via an event listener on `sceneReady`.
- Ensure the sprite is added to a separate `mantraGroup` to allow easy removal.

### 3.2 Implementation Details

#### Step 1: Create mantra data
- File: `src/content/mantra.json`
  ```json
  {
    "default": "ॐ",
    "options": ["ॐ","हूँ","शांति","शिवाय","ॐ नमः शिवाय"]
    // optionally mapping by month or moon phase
  }
  ```

#### Step 2: Implement mantra-particle.js
- File: `public/js/mantra-particle.js`
- Pseudocode:
  ```javascript
  import * as THREE from 'three';
  let sprite = null;
  let mantra = 'ॐ';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 64;
  canvas.height = 64;
  function drawMintra(gly() { ctx.clearRect...; ctx.font='48px serif'; ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(mantra, canvas.width/2, canvas.height/2); }
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5,0.5,0.5); // adjust
  // Add to scene via global scene reference or event
  function updateMantra() { /* fetch mantra from json based on date/moon, redraw canvas, texture.needsUpdate = true */ }
  function update() {
    // drift: position.x = Math.sin(time * 0.001) * 2;
    // scale: 0.4 + Math.sin(time * 0.003) * 0.1;
    // opacity: material.opacity = 0.1 + Math.sin(time * 0.002) * 0.05;
  }
  // Export { init, update }
  ```

#### Step 3: Hook into scene
- In `src/js/scene/scene-manager.js`, import initMantraParticle and call init after scene creation, then add update to render loop.

### 3.3 Mobile Considerations
- Reduce sprite scale on viewport < 768px to avoid overwhelming.
- Lower opacity further.

### 3.4 Data Structures
```json
{
  "mantra": "string",
  "lastUpdated": "timestamp"
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| mantra.json contains valid JSON with string mantra | `tests/content/mantra.test.js` | `typeof data.mantra === 'string'` |
| mantra glyph is a single Unicode character (or short string) | `tests/content/mantra.test.js` | `data.mantra.length <= 2` |
| mantra-particle.js creates a THREE.Sprite | `tests/unit/mantra-particle.init.test.js` | `sprite instanceof THREE.Sprite` |
| sprite texture is a CanvasTexture | `tests/unit/mantra-particle.texture.test.js` | `sprite.material.map instanceof THREE.CanvasTexture` |
| updateMantra changes texture image | `tests/unit/mantra-particle.change.test.js` | After calling, canvas pixel data changes |
| animation loop updates position and scale | `tests/unit/mantra-particle.animate.test.js` | After tick, sprite.position.x changed, sprite.scale changed |

### 4.2 Green Phase — Implementation

Implement files to satisfy tests.

### 4.3 Refactor Phase — Optimization

- Share canvas texture across instances if multiple mantras (though we only have one).
- Use requestAnimationFrame via existing render loop.

---

## 5. Acceptance Criteria

- [ ] A mantra sprite is visible in the scene after load.
- [ ] The mantra glyph is a single character or short ligature, rendered at low opacity.
- [ ] The sprite drifts slowly and pulses in scale/opacity.
- [ ] The mantra updates daily (or per moon phase) without requiring reload.
- [ ] On mobile, sprite size is reduced.
- [ ] No performance impact: frame rate remains >30fps on mid-tier mobile.
- [ ] All unit tests pass.

---

## 6. Dependencies & Risks

**Dependencies:** Three.js (already used), canvas API.

**Risks:**
- Glyph rendering may appear blurry if canvas not scaled for devicePixelRatio. Mitigation: set canvas width/height *= window.devicePixelRatio and scale accordingly.
- Adding extra draw call may affect performance. Mitigation: keep sprite simple, use Sprite (single quad).

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Add mantra particle that displays a sacred glyph as a drifting sprite",
  "changes": [
    "Created src/content/mantra.json with default mantra and options",
    "Added public/js/mantra-particle.js to create and animate a THREE.Sprite",
    "Integrated mantra particle initialization and update in scene-manager.js"
  ]
}
```