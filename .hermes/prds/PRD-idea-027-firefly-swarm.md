# PRD: Interactive Firefly Swarm

> **ID:** idea-027
> **Category:** 3D Elements
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-19

---

## 1. Overview

**One-liner:** A swarm of 3D firefly points that drift organically through the scene, pulsing with warm golden light, and react to mouse movement by scattering and reforming.

**Problem:** The scene has static elements (stars, moon, flowers) and animated elements (waves, music notes, shooting stars), but lacks ambient life — small organic creatures that make the world feel inhabited and alive. Fireflies are a natural fit for a night scene and complement the impressionist aesthetic.

**Solution:** Add a swarm of 30-50 fireflies as `THREE.Points` with a custom shader that renders each point as a soft glowing orb. Fireflies drift using Perlin-noise-based velocity fields, pulse individually with randomized phase/speed, and scatter away from the mouse cursor (within a radius) before slowly returning. All implemented within the existing `scene-init.js` architecture.

---

## 2. User Stories

- As a visitor, I want to see fireflies drifting through the scene so the world feels alive and magical.
- As a visitor, I want the fireflies to glow and pulse so they're clearly visible against the dark sky.
- As a visitor, I want the fireflies to react to my mouse/cursor so I feel like I'm interacting with living creatures.
- As a visitor, I want the fireflies to be subtle and non-distracting so they enhance rather than dominate the scene.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Add `createFireflies()` function with custom shader, and call it during init
- **No new files** — all code lives in the existing scene-init.js
- **No new dependencies** — uses built-in `THREE.Points`, `THREE.ShaderMaterial`
- **Integrates with:** existing `isMobile`/`isLowEnd` detection, existing `VanGoghScene.animate()` loop

### 3.2 Implementation Details

#### Step 1: Define the firefly shader
- File: `public/js/scene-init.js` (add near other shader definitions, around line 60)
- What to do:
  - Vertex shader (`fireflyVS`):
    - Attributes: `position` (vec3), `phase` (float), `pulseSpeed` (float)
    - Uniforms: `uTime` (float), `uSize` (float = 8.0 desktop, 5.0 mobile)
    - Calculate per-firefly pulse: `float pulse = 0.4 + 0.6 * sin(uTime * pulseSpeed + phase);`
    - Size attenuation: `gl_PointSize = uSize * pulse * (200.0 / -mvPosition.z);`
    - Pass `vPhase` and `vPulse` to fragment shader
  - Fragment shader (`fireflyFS`):
    - Render a soft glowing circle: `float dist = length(gl_PointCoord - 0.5);`
    - Core: `float core = smoothstep(0.15, 0.0, dist);` (bright center)
    - Glow: `float glow = exp(-dist * 4.0) * 0.5;` (soft falloff)
    - Color: warm golden `vec3(1.0, 0.85, 0.4)` mixed with slight variation per firefly
    - Alpha: `(core + glow) * vPulse * 0.7` (never fully opaque — ethereal)
    - Discard pixels with alpha < 0.01 for performance
- Expected outcome: Soft, glowing, pulsing firefly orbs

#### Step 2: Create the firefly particle system
- File: `public/js/scene-init.js` (add `createFireflies()` function)
- What to do:
  - Count: 40 desktop, 20 mobile (15 if `isLowEnd`)
  - Create `BufferGeometry` with attributes:
    - `position`: random distribution in a volume (x: -12 to 12, y: -1 to 6, z: -5 to 8)
    - `phase`: random 0 to 2π
    - `pulseSpeed`: random 1.0 to 3.0
  - Store original positions in a `basePositions` Float32Array for drift calculation
  - Store per-firefly velocities in a `velocities` array of `THREE.Vector3`
  - Material: `ShaderMaterial` with the above shaders, `transparent: true`, `depthWrite: false`, `blending: THREE.AdditiveBlending`
- Expected outcome: A `THREE.Points` object with pulsing fireflies

#### Step 3: Implement drift and mouse interaction
- File: `public/js/scene-init.js` (in the `userData.animate` function)
- What to do:
  - **Drift:** Each firefly has a velocity that slowly changes using a simple noise approximation:
    - `vel.x += (Math.random() - 0.5) * 0.002` (gentle random walk)
    - `vel.y += (Math.random() - 0.5) * 0.001` (less vertical drift)
    - `vel.z += (Math.random() - 0.5) * 0.002`
    - Damping: `vel.multiplyScalar(0.98)` (slows down over time)
    - Apply: `pos.add(vel)`
    - Boundary wrap: if firefly exits the volume, wrap to the opposite side
  - **Mouse scatter:**
    - Track mouse position in normalized device coordinates (NDC): `mouse.x = (clientX / width) * 2 - 1`, `mouse.y = -(clientY / height) * 2 + 1`
    - Project mouse into 3D at the firefly's depth: `mouse3D.set(mouse.x, mouse.y, 0.5).unproject(camera)`
    - For each firefly within 3 units of mouse3D: apply a repulsion force `dir.normalize().multiplyScalar(-0.05)` added to velocity
    - Scatter radius: 3.0 desktop, 4.0 mobile (larger touch target)
  - **Performance:** Only update every other firefly per frame on mobile (alternate)
- Expected outcome: Fireflies drift organically and scatter from the mouse

#### Step 4: Track mouse position
- File: `scene-init.js` (in the init IIFE, around line 711)
- What to do:
  - Add `window.addEventListener('mousemove', function(e) { ... })` to update a `mouse3D` vector
  - On mobile, use `touchmove` events instead
  - Store mouse NDC in `scene.userData._mouseNDC = { x: 0, y: 0 }` for the animate function to read
- Expected outcome: Mouse position available to firefly animate function

#### Step 5: Integrate into init
- File: `scene-init.js` (in the init IIFE, around line 697)
- What to do:
  - Add `createFireflies(scene.scene, isLowEnd ? 15 : (isMobile ? 20 : 40));` after `createMusicNotes()`
  - Fireflies should be created in the deferred batch (300ms timeout) with sunflowers/lilies
- Expected outcome: Fireflies appear after initial scene load

### 3.3 Mobile Considerations

- On mobile:
  - Reduce count to 20 (15 on low-end)
  - Skip mouse scatter (no hover on touch); instead, scatter from touch point during `touchmove`
  - Update every other firefly per frame (halves CPU cost)
  - Increase point size slightly (5.0 vs 8.0) for visibility on smaller screens
- Performance budget:
  - 40 points × position update = negligible (40 vec3 operations per frame)
  - Mouse scatter: only check fireflies within scatter radius (early exit with distance check)
  - Shader is simple: sin, exp, smoothstep — no texture lookups
  - Additive blending is GPU-cheap for small point counts

### 3.4 Data Structures

```json
{
  "firefly": {
    "position": { "x": 3.5, "y": 2.1, "z": -1.0 },
    "velocity": { "x": 0.001, "y": -0.002, "z": 0.003 },
    "phase": 2.34,
    "pulseSpeed": 1.8,
    "basePosition": { "x": 3.5, "y": 2.1, "z": -1.0 }
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Firefly Points object created | `tests/fireflies.test.js` | `scene.userData._fireflies` is a `THREE.Points` instance |
| Correct firefly count | `tests/fireflies.test.js` | Position attribute count equals expected count (40 desktop / 20 mobile) |
| Shader has pulse uniforms | `tests/fireflies.test.js` | Material uniforms include `uTime` and `uSize` |
| Fireflies drift over time | `tests/fireflies.test.js` | After animate(t=0) and animate(t=1), at least one position component changed |
| Mouse scatter applies force | `tests/fireflies.test.js` | After setting mouse near a firefly and calling animate, its velocity magnitude increases |
| Mobile reduces count | `tests/fireflies.test.js` | With isMobile=true, count ≤ 20 |
| Additive blending used | `tests/fireflies.test.js` | Material blending is `THREE.AdditiveBlending` |

### 4.2 Green Phase — Implementation

- Implement `fireflyVS` and `fireflyFS` shaders
- Implement `createFireflies()` with buffer attributes and drift logic
- Add mouse tracking and scatter force
- Add to init sequence
- Verify all 7 tests pass

### 4.3 Refactor Phase — Optimization

- Use a spatial hash for mouse scatter (only check nearby fireflies instead of all)
- Add a "firefly trail" effect: render a second, larger, more transparent point behind each firefly with a 2-frame position delay
- Add seasonal variation: fireflies are brighter/more active in "summer" color schemes

---

## 5. Acceptance Criteria

- [ ] 40 fireflies appear on desktop (20 mobile, 15 low-end)
- [ ] Each firefly pulses with warm golden light at its own rhythm
- [ ] Fireflies drift organically through the scene with gentle random motion
- [ ] Fireflies scatter away from the mouse cursor and slowly return
- [ ] Fireflies wrap around scene boundaries (no visible pop-in)
- [ ] Render as soft glowing orbs (not hard squares)
- [ ] Use additive blending for ethereal glow effect
- [ ] All 7 unit tests pass
- [ ] No frame rate drops below 30fps on mobile
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- Three.js `THREE.Points` and `THREE.ShaderMaterial` (already imported)
- Mouse/touch events (standard browser API)
- Existing `isMobile`/`isLowEnd` detection

**Risks:**
- **Performance on low-end devices:** Even 15 particles with per-frame updates could strain very weak GPUs. Mitigation: on `isLowEnd`, skip mouse scatter entirely and reduce drift update frequency to every 3rd frame.
- **Mouse coordinate projection:** Unprojecting mouse to 3D space depends on camera state. Mitigation: use a fixed depth plane (z=0 in NDC) and accept approximate scatter — it doesn't need to be physically accurate.
- **Additive blending with stars:** Both fireflies and stars use additive blending, which could cause over-bright areas where they overlap. Mitigation: fireflies are positioned in the foreground (z=-5 to 8) while stars are at r=40-60, so overlap is rare. Keep firefly alpha low (max 0.7).

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Interactive firefly swarm — 3D pulsing fireflies with organic drift and mouse scatter behavior",
  "changes": [
    "Added fireflyVS/fireflyFS custom shaders with soft glow rendering",
    "Added createFireflies() with BufferGeometry and per-firefly phase/speed",
    "Drift animation using damped random walk velocity field",
    "Mouse scatter: fireflies repel from cursor within 3-unit radius",
    "40 fireflies desktop, 20 mobile, 15 low-end",
    "Additive blending for ethereal glow",
    "Integrated with existing scene init and animate loop"
  ]
}
```
