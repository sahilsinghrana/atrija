# PRD: 3D Cypress Tree Silhouettes

> **ID:** idea-026
> **Category:** 3D Elements
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-19

---

## 1. Overview

**One-liner:** Tall, dark cypress tree silhouettes rendered as Three.js 3D geometry that sway gently in the background, evoking Van Gogh's iconic "The Starry Night" cypresses.

**Problem:** The current 3D scene has stars, moon, sunflowers, lilies, waves, and a flute — but lacks the most iconic visual element from Van Gogh's most famous painting: the towering cypress trees. Their absence makes the scene feel incomplete as an impressionist homage.

**Solution:** Add 3-5 cypress tree silhouettes as Three.js `ExtrudeGeometry` meshes positioned at the edges of the scene. Each tree is a dark, organic shape built from a custom 2D path (tall, flame-like silhouette) extruded into 3D. They sway gently using vertex animation in the `animate` loop, with parallax response to scroll. Trees use `MeshBasicMaterial` (no lighting needed — they're dark silhouettes against the sky).

---

## 2. User Stories

- As a visitor, I want to see cypress trees in the 3D scene so that the Starry Night homage feels complete and recognizable.
- As a visitor, I want the trees to sway gently so the scene feels alive and organic.
- As a visitor, I want the trees to respond to scroll position so they integrate with the existing parallax system.
- As a visitor, I want the trees to be visible but not dominant so they frame the scene without obscuring the moon and stars.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Add `createCypressTrees()` function and call it during init
- **No new files** — all code lives in the existing scene-init.js
- **No new dependencies** — uses built-in Three.js `ExtrudeGeometry` and `Shape`
- **Integrates with:** existing parallax scroll system (`scrollState.current`), existing `isMobile` / `isLowEnd` detection

### 3.2 Implementation Details

#### Step 1: Define the cypress silhouette path
- File: `public/js/scene-init.js` (add near other shape functions, around line 520)
- What to do:
  - Create a `makeCypressShape()` function that returns a `THREE.Shape`:
    - Base width: ~0.4 units, tapering to a point at the top
    - Height: 4-6 units (tall, dramatic)
    - Use bezier curves to create an organic, slightly asymmetric flame shape:
      - Start at bottom center (0, 0)
      - Left edge: curve outward to ~width/2 at 20% height, then taper inward with slight waviness
      - Right edge: mirror with slight variation (not perfectly symmetric)
      - Top: come to a soft point, not a sharp spike
    - Add 2-3 small "notches" along the edges to suggest branches/tufts (small triangular cutouts)
  - The shape should evoke Van Gogh's swirling, organic cypress forms — not a geometric cone
- Expected outcome: A reusable `THREE.Shape` that looks like a cypress silhouette

#### Step 2: Create the cypress mesh with extrusion
- File: `public/js/scene-init.js` (continue in `createCypressTrees()`)
- What to do:
  - Extrude settings: `{ depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 2 }`
  - Material: `new THREE.MeshBasicMaterial({ color: 0x0a0a12, side: THREE.DoubleSide, depthWrite: false })`
    - Near-black, slightly blue-tinted to match the night sky
    - `MeshBasicMaterial` means no lighting cost — perfect for silhouettes
  - Store the original vertex positions for animation (copy `geometry.attributes.position.array` to a `basePositions` Float32Array)
- Expected outcome: A 3D cypress mesh with slight depth and beveled edges

#### Step 3: Position trees and add sway animation
- File: `public/js/scene-init.js`
- What to do:
  - Create 5 trees (3 on desktop, 2 on mobile if `isLowEnd`)
  - Position trees:
    - 2 trees on the left edge: x = -8 to -12, z = -3 to 5
    - 2 trees on the right edge: x = 8 to 12, z = -3 to 5
    - 1 tree center-left: x = -4, z = -5 (partially behind moon area)
    - Scale: 0.8-1.4 (varied for depth)
    - Y position: -1.5 (base near the bottom of the scene)
  - Add `userData.animate` function to each tree:
    - Gentle sway: rotate around Z-axis with `Math.sin(t * 0.3 + phase) * 0.03`
    - Subtle vertex displacement: for every Nth vertex (every 5th to limit cost), apply `baseY * Math.sin(t * 0.5 + baseX * 2) * 0.02` to simulate wind bending
    - Parallax: `rotation.y = scrollState.current * 0.01 * mult` (very subtle, trees barely rotate)
  - Store trees in `scene.userData._cypressTrees` array for potential future interaction
- Expected outcome: Trees sway gently and respond to scroll

#### Step 4: Integrate into init sequence
- File: `public/js/scene-init.js` (in the init IIFE, around line 697)
- What to do:
  - Add `createCypressTrees(scene.scene, isLowEnd ? 2 : 5);` after `createWaves()` and before the `requestAnimationFrame` callback
  - Trees should be created in the same frame as sunflowers/lilies (not deferred)
- Expected outcome: Trees appear on initial scene load

### 3.3 Mobile Considerations

- On mobile / low-end:
  - Reduce tree count from 5 to 2 (one per side)
  - Skip vertex displacement animation (only use rotation sway)
  - Reduce extrude bevel segments from 2 to 1
  - Use simpler shape (fewer bezier control points)
- Performance budget:
  - Each tree: ~200-400 vertices (shape complexity × extrusion)
  - 5 trees desktop: ~1500 vertices total — negligible
  - Vertex animation: only every 5th vertex, so ~300 animated vertices max
  - Draw calls: 1 per tree (5 total) — acceptable
  - Trees use `depthWrite: false` so they don't cause overdraw with stars

### 3.4 Data Structures

```json
{
  "cypressTree": {
    "position": { "x": -10, "y": -1.5, "z": 2 },
    "scale": 1.2,
    "swayPhase": 1.57,
    "swaySpeed": 0.3,
    "swayAmplitude": 0.03,
    "vertexAnimInterval": 5
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Cypress trees are created | `tests/cypress.test.js` | `scene.userData._cypressTrees` array exists and has ≥ 2 entries |
| Trees use MeshBasicMaterial | `tests/cypress.test.js` | All cypress meshes have `MeshBasicMaterial` (no lighting dependency) |
| Trees have animate function | `tests/cypress.test.js` | Every tree mesh has `userData.animate` defined |
| Trees sway over time | `tests/cypress.test.js` | After calling animate with t=1 and t=2, rotation.z differs |
| Trees positioned at scene edges | `tests/cypress.test.js` | At least one tree has `position.x < -5` and one has `position.x > 5` |
| Mobile reduces tree count | `tests/cypress.test.js` | With `isLowEnd=true`, tree count ≤ 2 |

### 4.2 Green Phase — Implementation

- Implement `makeCypressShape()` with bezier flame silhouette
- Implement `createCypressTrees()` with extrusion, positioning, and sway animation
- Add to init sequence
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Share a single geometry instance across all trees (use `geometry.clone()` with different scales)
- Add a subtle "glow" outline using a second slightly larger mesh with transparent dark blue material behind each tree
- Consider making the center-left tree interact with the moon's orbit path (moon passes behind it)

---

## 5. Acceptance Criteria

- [ ] 5 cypress tree silhouettes appear on desktop (2 on mobile/low-end)
- [ ] Trees are positioned at the left and right edges of the scene, framing the view
- [ ] Trees sway gently with a organic, wind-like motion
- [ ] Trees respond subtly to scroll position (parallax)
- [ ] Trees use `MeshBasicMaterial` (no lighting cost)
- [ ] Trees do not obscure the moon or main star field
- [ ] Vertex animation is throttled (every 5th vertex) to maintain 60fps
- [ ] All 6 unit tests pass
- [ ] No console errors on scene init

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js `ExtrudeGeometry` and `Shape` (available in the base Three.js import — no extra modules needed)
- Existing `isMobile` / `isLowEnd` detection
- Existing parallax scroll state system

**Risks:**
- **Geometry complexity:** Too many bezier control points could create heavy geometry. Mitigation: limit shape to ~12-16 control points, use `bevelSegments: 2`.
- **Z-fighting with stars:** Trees use `depthWrite: false` which could cause visual artifacts with the star field. Mitigation: trees are positioned at z=-3 to 5 while stars are at r=40-60, so they shouldn't overlap. If issues arise, move trees further back.
- **Performance on very low-end devices:** Even with reduced count, extrusion has a cost. Mitigation: on `isLowEnd`, use a simpler `BufferGeometry` (manual triangle mesh) instead of `ExtrudeGeometry`.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "3D cypress tree silhouettes — Van Gogh's iconic Starry Night trees as extruded 3D geometry with gentle sway animation",
  "changes": [
    "Added makeCypressShape() with organic bezier flame silhouette",
    "Added createCypressTrees() with ExtrudeGeometry and beveled edges",
    "Trees sway with rotation + throttled vertex displacement",
    "Integrated with existing parallax scroll system",
    "5 trees on desktop, 2 on mobile/low-end",
    "MeshBasicMaterial for zero lighting cost"
  ]
}
```
