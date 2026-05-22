# PRD: Aurora Borealis Sky Band

> **ID:** idea-041
> **Category:** 3D Elements
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-23

---

## 1. Overview

**One-liner:** A subtle, shimmering aurora borealis band that ripples across the upper sky dome during night phases, adding a new atmospheric layer to the 3D scene.

**Problem:** The current night sky, while beautiful with stars and moon, lacks the atmospheric depth that real night skies possess. Van Gogh painted in Provence where aurora sightings are rare, but the impressionist aesthetic calls for heightened natural phenomena — an aurora would add magical realism without breaking the painterly tone.

**Solution:** A curved plane mesh positioned at the sky dome's upper region with a custom GLSL shader that animates flowing green/blue/purple bands using layered sine waves and noise. The aurora only activates during "night" time-of-day phases (controlled by the existing time-of-day system). Intensity subtly pulses. On mobile, the effect is simplified to reduce GPU cost.

---

## 2. User Stories

- As a visitor, I want to see a subtle aurora shimmer in the night sky so the scene feels more alive and magical.
- As a visitor, I want the aurora to appear and fade naturally with the time-of-day cycle so it doesn't feel out of place.
- As a visitor on mobile, I want the aurora to be present but simplified so my device doesn't overheat.
- As a visitor, I want the aurora colors to harmonize with the current color scheme so it feels integrated.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/aurora-band.js` — Standalone module that creates and animates the aurora mesh
- **Modified file:** `public/js/scene-init.js` — One-line import and init call for the aurora module (MINIMAL change, only `import './aurora-band.js'` added)
- **No changes to:** `siteData.json`, `content.json`, `index.astro`, `BaseLayout.astro`
- **Depends on:** Existing time-of-day system for night-phase detection, existing scene camera and renderer

### 3.2 Implementation Details

#### Step 1: Create the aurora shader material
- File: `public/js/aurora-band.js`
- What to do:
  - Define a `ShaderMaterial` with:
    - **Vertex shader:** Pass UV coordinates, apply subtle vertex displacement along Y based on `sin(time + position.x * frequency)` to create flowing wave motion
    - **Fragment shader:** 
      - Base color: gradient from transparent at top to semi-transparent green/blue at center to transparent at bottom
      - Use 3 layered sine waves at different frequencies and speeds for organic movement
      - Add `mix()` between green (`#00ff88`), blue (`#4488ff`), and purple (`#8844ff`) based on noise
      - Alpha: `0.15–0.35` (subtle, never overwhelming)
      - Blend mode: `AdditiveBlending` for ethereal glow
  - Create a `PlaneGeometry` (20×5 segments) curved to match sky dome curvature
  - Position at Y ≈ +8 to +12 units, spanning XZ horizontally
  - Rotate to face outward from sky dome center
- Expected outcome: A shimmering aurora band material ready for the scene

#### Step 2: Add aurora to the scene with time-of-day control
- File: `public/js/aurora-band.js`
- What to do:
  - Export an `initAurora(scene, timeOfDaySystem)` function
  - In the animate loop:
    - Check current time-of-day phase from the existing system
    - Only render aurora during "night" and "dawn" phases
    - Fade in/out over 3 seconds when transitioning (lerp opacity)
    - Update shader `uniforms.time` each frame
  - On mobile (detect via `isMobile` flag from scene-init.js or user agent):
    - Reduce plane segments to 10×3
    - Use only 2 sine wave layers instead of 3
    - Cap alpha at 0.2
- Expected outcome: Aurora appears during night, fades during day, respects mobile constraints

#### Step 3: Wire into scene-init.js
- File: `public/js/scene-init.js`
- What to do:
  - Add at top: `import { initAurora } from './aurora-band.js';`
  - Add after scene setup: `initAurora(scene, timeOfDay);`
  - **CRITICAL:** This is the ONLY change to scene-init.js. No other lines modified.
- Expected outcome: Aurora initializes with the rest of the scene

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Reduced geometry segments (10×3 vs 20×5)
  - Simplified shader (2 wave layers vs 3)
  - Lower max alpha (0.2 vs 0.35)
  - If device reports low GPU memory, disable entirely
- Performance budget: One additional draw call, one custom shader. Target: < 2ms frame cost on mid-range mobile GPU.

### 3.4 Data Structures

```json
{
  "aurora": {
    "colors": ["#00ff88", "#4488ff", "#8844ff"],
    "nightOnly": true,
    "maxAlpha": 0.35,
    "mobileMaxAlpha": 0.2,
    "fadeInDuration": 3.0,
    "waveLayers": 3,
    "mobileWaveLayers": 2
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Aurora mesh is created | `tests/aurora.test.js` | `scene.children` contains a mesh with `type === 'Mesh'` and material is `ShaderMaterial` |
| Aurora is invisible during day | `tests/aurora.test.js` | When timeOfDay = 'day', aurora mesh `visible` is `false` |
| Aurora is visible during night | `tests/aurora.test.js` | When timeOfDay = 'night', aurora mesh `visible` is `true` |
| Aurora uses additive blending | `tests/aurora.test.js` | Material `blending` equals `THREE.AdditiveBlending` |
| Aurora fades in over time | `tests/aurora.test.js` | Material opacity transitions from 0 to target over ~3s |
| Mobile reduces complexity | `tests/aurora.test.js` | When `isMobile = true`, geometry segments ≤ 10×3 |

### 4.2 Green Phase — Implementation

- Create `public/js/aurora-band.js` with shader material and init function
- Add one-line import and init to `scene-init.js`
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Cache noise texture instead of computing per-frame
- Add aurora color scheme integration with the 5 existing color schemes
- Add a subtle "solar wind" intensity variation based on time-of-day sub-phase

---

## 5. Acceptance Criteria

- [ ] Aurora band appears as a subtle shimmering effect in the upper sky during night phases
- [ ] Aurora is completely invisible during day phases
- [ ] Transition between visible/invisible takes ~3 seconds (smooth fade)
- [ ] Aurora colors (green/blue/purple) harmonize with the scene
- [ ] Effect is present on mobile with reduced complexity
- [ ] No frame rate drops below 30fps on mobile
- [ ] Only one line added to scene-init.js (import + init call)
- [ ] All 6 unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- Existing time-of-day system (idea-032, status: done)
- Three.js scene and camera already initialized
- `scene-init.js` must be modified minimally (import + init only)

**Risks:**
- **Shader complexity on low-end devices:** Mitigation: mobile simplification path, graceful disable if frame time exceeds budget
- **Aurora colors clashing with color schemes:** Mitigation: use the existing color scheme's accent color as one of the aurora hues
- **scene-init.js modification:** This is a SACRED file per AGENTS.md. Mitigation: only add import + init call, no other changes. Create backup before editing.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Aurora borealis sky band — animated northern lights during night phases",
  "changes": [
    "Added public/js/aurora-band.js with custom GLSL shader",
    "Vertex-animated aurora mesh with green/blue/purple bands",
    "Activates during night/dawn time-of-day phases",
    "Smooth 3-second fade in/out on phase transitions",
    "Mobile-optimized with reduced geometry and shader complexity",
    "Additive blending for ethereal glow effect"
  ]
}
```
