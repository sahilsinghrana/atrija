# PRD: Wind-Swept Wheat Field

> **ID:** idea-035
> **Category:** 3D Elements
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-21

---

## 1. Overview

**One-liter:** A field of golden wheat stalks rendered as InstancedMesh in the lower portion of the 3D scene, swaying organically in a procedural wind pattern inspired by Van Gogh's famous wheat field paintings.

**Problem:** The current 3D scene has sunflowers, tulips, cypress trees, and waves — but lacks the iconic wheat fields that feature prominently in Van Gogh's oeuvre (Wheat Field with Cypresses, Wheat Field under Clouded Sky). The lower foreground feels empty between the water waves and the flower elements.

**Solution:** Add a dense field of wheat stalks using Three.js InstancedMesh for performance. Each stalk is a simple geometry (thin cylinder + ellipsoid head) with a per-instance phase offset. A vertex shader applies sinusoidal wind displacement that varies with time, creating a realistic sweeping effect. The field sits at the bottom of the scene, behind the flowers but in front of the waves.

---

## 2. User Stories

- As a visitor, I want to see a living wheat field that sways in the wind so that the scene feels more immersive and true to Van Gogh's landscapes.
- As a visitor on mobile, I want the wheat field to still be present but with fewer stalks so that performance stays smooth.
- As a visitor, I want the wheat to react subtly to scroll position so that the wind feels connected to my journey through the page.

---

## 3. Technical Specification

### 3.1 Architecture

**New files:**
- `public/js/wheat-field.js` — Wheat field module: geometry creation, instanced setup, wind shader, scroll integration
- `src/tests/wheat-field.test.js` — Unit tests

**Modified files:**
- `public/js/scene-init.js` — Import and initialize wheat field module (single `import` + `initWheatField()` call). **Minimal change — only 2 lines added.**

**Dependencies:**
- Three.js (already loaded via CDN in scene-init.js)
- Existing camera, renderer, and animation loop from scene-init.js
- Scroll position from existing scroll-driven systems (idea-020)

### 3.2 Implementation Details

#### Step 1: Create wheat stalk geometry
- File: `public/js/wheat-field.js`
- What to do:
  - Create a single wheat stalk geometry: `CylinderGeometry(0.02, 0.03, 1.0, 4)` for the stem + `SphereGeometry(0.08, 4, 3)` scaled to `(1, 2.5, 0.6)` for the head, merged into one `BufferGeometry` via `BufferGeometryUtils.mergeBufferGeometries()`
  - Create `InstancedMesh` with count = 800 (desktop) or 300 (mobile)
  - Position instances in a grid pattern in the lower portion of the scene (y: -1.5 to -0.8, z: -5 to -2, x: -8 to 8)
  - Add per-instance random phase offset (0 to 2π) stored in a custom `instancePhase` attribute
  - Material: `MeshStandardMaterial` with color `0xdaa520` (goldenrod), emissive `0x3a2a00`, roughness 0.8
- Expected outcome: A static field of wheat stalks visible in the scene

#### Step 2: Add wind vertex shader
- File: `public/js/wheat-field.js`
- What to do:
  - Add a `beforeCompile` shader hook to the instanced mesh material
  - Vertex shader modification: apply horizontal displacement based on `instancePhase + time`
  - Displacement formula: `position.x += sin(instancePhase + time * 1.5) * 0.15 * (position.y + 1.5)` (more displacement at the top)
  - Add slight z-axis displacement: `position.z += cos(instancePhase * 0.7 + time * 1.2) * 0.08 * (position.y + 1.5)`
  - Use `onBeforeCompile` to inject the shader code without replacing the entire material
- Expected outcome: Wheat stalks sway organically in a wind-like pattern

#### Step 3: Integrate scroll-driven wind intensity
- File: `public/js/wheat-field.js`
- What to do:
  - Accept scroll position (0-1) as a uniform
  - Increase wind displacement amplitude by up to 40% at peak scroll (scroll ~0.5)
  - Add a subtle scroll-driven rotation to the entire field group (±2 degrees)
- Expected outcome: Wind intensifies as user scrolls through the middle sections

#### Step 4: Initialize from scene-init.js
- File: `public/js/scene-init.js`
- What to do:
  - Add `import { initWheatField, updateWheatField } from './wheat-field.js';` at the top
  - Call `initWheatField(scene, camera);` in the init section
  - Call `updateWheatField(time, scrollPos);` in the animation loop
- Expected outcome: Wheat field appears and animates in the scene

### 3.3 Mobile Considerations

- Instance count: 300 on mobile (vs 800 desktop), detected via `window.innerWidth < 768`
- Stalk geometry uses 4 radial segments (already minimal)
- Shader displacement is the same (GPU-based, low cost)
- Performance budget: InstancedMesh = 1 draw call regardless of count. Target: < 5ms frame time for wheat field.
- If frame rate drops below 30fps, auto-reduce instance count by 50%

### 3.4 Data Structures

```json
{
  "wheatField": {
    "desktop": { "count": 800, "area": { "x": [-8, 8], "y": [-1.5, -0.8], "z": [-5, -2] } },
    "mobile": { "count": 300, "area": { "x": [-6, 6], "y": [-1.5, -0.8], "z": [-4, -2] } },
    "wind": { "speed": 1.5, "amplitudeX": 0.15, "amplitudeZ": 0.08, "scrollBoost": 0.4 },
    "colors": { "stem": "#6b5b20", "head": "#daa520", "emissive": "#3a2a00" }
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Wheat field creates correct instance count (desktop) | `tests/wheat-field.test.js` | `mesh.count === 800` |
| Wheat field creates correct instance count (mobile) | `tests/wheat-field.test.js` | `mesh.count === 300` when `innerWidth < 768` |
| Wind shader injects beforeCompile hook | `tests/wheat-field.test.js` | `material.onBeforeCompile` is called |
| Instances are within bounds | `tests/wheat-field.test.js` | All instance positions within defined area |
| Scroll boost increases displacement | `tests/wheat-field.test.js` | Uniform `scrollBoost` > 0 when scroll > 0 |
| Material uses correct colors | `tests/wheat-field.test.js` | `material.color.hex === 0xdaa520` |

### 4.2 Green Phase — Implementation

Create `public/js/wheat-field.js` with `initWheatField(scene, camera)` and `updateWheatField(time, scrollPos)` exports. Use Three.js InstancedMesh with custom shader hook.

### 4.3 Refactor Phase — Optimization

- Merge stem and head into a single BufferGeometry to reduce memory
- Use `Float32Array` for instance phase attribute instead of per-instance objects
- Consider LOD: reduce instance count at distance
- Cache `sin`/`cos` calculations where possible

---

## 5. Acceptance Criteria

- [ ] Wheat field renders 800 stalks on desktop, 300 on mobile
- [ ] Stalks sway organically in wind pattern without manual intervention
- [ ] Wind intensity increases by up to 40% during mid-scroll
- [ ] Field sits correctly in the scene depth (behind flowers, in front of waves)
- [ ] Frame rate stays above 30fps on mobile
- [ ] All unit tests pass
- [ ] No modifications to scene-init.js beyond 2 import/init lines
- [ ] Build passes (`npm run build` exit code 0)

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js InstancedMesh (available in current Three.js version)
- `BufferGeometryUtils` from Three.js examples (must be imported separately or geometry manually merged)
- Existing animation loop in scene-init.js

**Risks:**
- InstancedMesh with custom shader hooks may not work on all mobile GPUs → Mitigation: test on low-end, provide fallback to static field if shader compilation fails
- Too many instances could impact performance on low-end devices → Mitigation: auto-scaling instance count based on frame time
- Geometry merging adds complexity → Mitigation: can use separate stem + head meshes instanced together if merging is problematic

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Wind-swept wheat field: 800 instanced stalks with procedural wind shader",
  "changes": [
    "Added public/js/wheat-field.js module with InstancedMesh wheat field",
    "Vertex shader wind displacement with scroll-driven intensity boost",
    "800 stalks desktop / 300 mobile, goldenrod color with emissive glow",
    "Integrated into scene-init.js with minimal 2-line addition"
  ]
}
```

---

## Reviewer Notes (2026-05-24)

**Quality Check**: Solid PRD with good technical approach. The InstancedMesh + vertex shader pattern is the right call for performance. Clear mobile considerations with reduced instance count.

**Design Alignment**: Wheat fields are quintessentially Van Gogh — this fills a genuine gap in the scene between the water waves and flowers. The scroll-driven wind intensity is a nice touch that connects the 3D world to the reading experience.

**Feasibility**: The `BufferGeometryUtils.mergeBufferGeometries()` dependency needs verification — this utility must be imported separately from Three.js examples. If it's not available, use separate stem + head meshes instanced together as the PRD suggests in the risks section.

**Scope**: Medium is appropriate. The 2-line scene-init.js change is minimal and follows the established pattern from other modules.

**Category Note**: This is a 3D Elements addition. The backlog currently has 61.5% 3D Elements ideas — consider balancing with more Content or Interactivity features in the next kanban generation.
