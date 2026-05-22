# PRD: Interactive Flower Pollination Effect

> **ID:** idea-042
> **Category:** Interactivity
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-23

---

## 1. Overview

**One-liner:** Click on any sunflower or tulip in the 3D scene to release a burst of golden pollen particles that drift downward, with nearby flowers briefly glowing in response.

**Problem:** The 3D scene has beautiful flowers (sunflowers, tulips) rendered as 3D geometry, but they're purely decorative. Visitors can't interact with them beyond the global flute click. The scene needs more micro-interactions that reward exploration and make the world feel alive.

**Solution:** Add raycasting to detect clicks on flower meshes. When a flower is clicked, spawn a burst of ~20 pollen particles (small golden spheres with additive blending) that burst outward and drift down with simulated gravity and air resistance. Flowers within a 3-unit radius briefly emit a warm glow (emissive intensity increase) for 1.5 seconds, creating a "ripple" effect. All client-side, no backend.

---

## 2. User Stories

- As a visitor, I want to click on flowers and see pollen burst out so the scene feels interactive and alive.
- As a visitor, I want nearby flowers to react when I pollinate one so I feel a sense of connection between elements.
- As a visitor, I want the pollen to drift naturally with gravity so it feels physically believable.
- As a visitor on mobile, I want to tap flowers and see the same effect so the experience works on touch.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/flower-pollination.js` — Standalone module for pollen particle system and flower interaction
- **Modified file:** `public/js/scene-init.js` — One-line import + init, plus flower meshes must have `userData.isFlower = true` for raycasting identification
- **No changes to:** `siteData.json`, `content.json`, `index.astro`, `BaseLayout.astro`
- **Depends on:** Existing flower meshes (sunflowers, tulips) from the 3D geometry system (idea-023, status: done)

### 3.2 Implementation Details

#### Step 1: Create the pollen particle system
- File: `public/js/flower-pollination.js`
- What to do:
  - Define a `PollenBurst` class:
    - Constructor takes `(position, scene)` — position is the clicked flower's world position
    - Creates 20 particle sprites (small `SphereGeometry(0.05, 4, 4)` with `MeshBasicMaterial` in `#FFD700` with `AdditiveBlending`)
    - Each particle gets random initial velocity: outward burst + slight upward component
    - Physics per frame: `velocity.y -= 0.002` (gravity), `velocity.multiplyScalar(0.98)` (air resistance)
    - Particles fade out over 2 seconds via material opacity
    - Auto-dispose after 2.5 seconds (remove from scene, dispose geometry + material)
  - Maintain an active bursts array, cleaned up each frame
- Expected outcome: A reusable pollen burst that looks like golden dust drifting down

#### Step 2: Add flower click detection via raycasting
- File: `public/js/flower-pollination.js`
- What to do:
  - Export an `initFlowerPollination(scene, camera)` function
  - On `click` event on the canvas:
    - Create a `THREE.Raycaster` from mouse position
    - Raycast against all objects in scene
    - Check if any intersected object has `userData.isFlower === true`
    - If yes: trigger `new PollenBurst(intersect.point, scene)`
    - Also find all other flower meshes within 3 units and temporarily increase their `material.emissiveIntensity` by 0.5 for 1.5 seconds (then restore)
  - On mobile: use `touchstart` event with the same logic
- Expected outcome: Clicking flowers triggers pollen burst + nearby flower glow

#### Step 3: Mark flower meshes for identification
- File: `public/js/scene-init.js`
- What to do:
  - Wherever flower meshes are created (sunflowers, tulips), add: `mesh.userData.isFlower = true;`
  - This is a ONE-WORD addition per flower creation block
  - Add import: `import { initFlowerPollination } from './flower-pollination.js';`
  - Add init: `initFlowerPollination(scene, camera);`
- Expected outcome: Flower meshes are identifiable by the pollination system

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Reduce pollen particles per burst from 20 to 10
  - Use `SphereGeometry(0.04, 3, 3)` for smaller, cheaper particles
  - Touch target: raycast on `touchstart` with single-finger detection
- Performance budget: Max 3 concurrent bursts (60 particles desktop, 30 mobile). Each particle is a simple sphere with basic material.

### 3.4 Data Structures

```json
{
  "pollination": {
    "particlesPerBurst": 20,
    "mobileParticlesPerBurst": 10,
    "gravity": -0.002,
    "airResistance": 0.98,
    "lifespan": 2.5,
    "glowRadius": 3.0,
    "glowIntensity": 0.5,
    "glowDuration": 1.5
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Pollen burst creates particles | `tests/flower-pollination.test.js` | After burst, scene has 20 new mesh children |
| Particles drift downward | `tests/flower-pollination.test.js` | After 10 frames, average particle Y position < initial Y |
| Particles fade out | `tests/flower-pollination.test.js` | After 2.5s, all burst particles are removed from scene |
| Click on flower triggers burst | `tests/flower-pollination.test.js` | Raycaster intersect on flower mesh triggers `PollenBurst` |
| Nearby flowers glow | `tests/flower-pollination.test.js` | Flowers within 3 units get `emissiveIntensity` increase |
| Mobile reduces particles | `tests/flower-pollination.test.js` | When `isMobile`, burst creates ≤ 10 particles |

### 4.2 Green Phase — Implementation

- Create `public/js/flower-pollination.js` with `PollenBurst` class and init function
- Add `userData.isFlower = true` to flower meshes in `scene-init.js`
- Add import + init to `scene-init.js`
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Use `InstancedMesh` for pollen particles to reduce draw calls
- Add a "butterfly" variant: occasionally a small golden sprite follows a curved path from the burst
- Add haptic feedback on mobile (`navigator.vibrate(50)`) when flowers are pollinated

---

## 5. Acceptance Criteria

- [ ] Clicking a sunflower or tulip releases a burst of golden pollen particles
- [ ] Pollen particles drift downward with gravity and fade out over 2.5 seconds
- [ ] Nearby flowers (within 3 units) briefly glow warm when one is pollinated
- [ ] Effect works on mobile with tap interaction and reduced particle count
- [ ] No more than 3 concurrent pollen bursts at once
- [ ] Flower meshes are identified via `userData.isFlower` flag
- [ ] Only minimal changes to scene-init.js (import + init + userData flags)
- [ ] All 6 unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- Existing 3D flower geometry (idea-023, status: done) — sunflower and tulip meshes must exist
- Three.js raycaster (already available via the Three.js import)
- scene-init.js must be modified minimally

**Risks:**
- **Raycast performance:** Raycasting every click is cheap, but checking all scene objects could be slow with many objects. Mitigation: maintain a separate `flowers[]` array for raycasting targets only.
- **Particle overflow:** If user clicks rapidly, too many particles could accumulate. Mitigation: cap at 3 concurrent bursts, queue additional clicks.
- **scene-init.js modification:** SACRED file. Mitigation: only add `userData.isFlower = true` to existing flower mesh creation blocks, plus one import and one init line. Create backup before editing.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Interactive flower pollination — click flowers to release pollen bursts with nearby glow ripple",
  "changes": [
    "Added public/js/flower-pollination.js with PollenBurst particle system",
    "Raycasting click detection on flower meshes via userData.isFlower flag",
    "Golden pollen particles with gravity and air resistance physics",
    "Nearby flower glow ripple effect within 3-unit radius",
    "Mobile-optimized with reduced particle count and touch support",
    "Max 3 concurrent bursts to prevent particle overflow"
  ]
}
```
