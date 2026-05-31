# PRD: Village Street Lamp Lights

> **ID:** idea-046
> **Category:** 3D Elements
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-24

---

## 1. Overview

**One-liner:** Warm glowing orbs positioned along the horizon line of the 3D scene, representing the village lights from Van Gogh's Starry Night — small windows of human warmth beneath the cosmic sky.

**Problem:** The 3D scene has a rich sky (stars, moon, comets) and ground-level elements (flowers, cypress trees, waves), but the horizon line — the boundary between earth and sky — is empty. In Starry Night, Van Gogh painted a small village nestled beneath the swirling sky, with warm yellow lights glowing from windows. The current scene lacks this human element, making the world feel uninhabited.

**Solution:** Add 8-12 small glowing spheres (desktop) or 5-6 (mobile) positioned along the horizon line at varying heights, simulating distant village lights. Each light is a small `THREE.Mesh` (sphere, radius 0.1-0.2) with `MeshBasicMaterial` in warm colors (gold, amber, soft orange). They have a subtle pulsing glow (opacity oscillation via sine wave, period 3-5 seconds, desynchronized). A larger transparent sphere around each creates a soft halo effect. The lights sit at the base of the cypress trees, suggesting a village behind them.

---

## 2. User Stories

- As a visitor, I want to see warm village lights along the horizon so the scene feels inhabited and cozy.
- As a visitor, I want the lights to pulse gently so they feel alive like real candlelight.
- As a visitor, I want the lights to complement the cypress trees so the composition feels intentional.
- As a visitor on mobile, I want the lights present but fewer so performance is maintained.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Village lights system added to the Three.js scene
- **No other files changed** — purely a 3D scene addition
- Uses existing `animate()` loop for pulsing animation
- Lights are positioned relative to the cypress tree line

### 3.2 Implementation Details

#### Step 1: Create village light meshes
- File: `public/js/scene-init.js`
- What to do:
  - Define an array of light positions along the horizon (x: -30 to 30, y: 2-5, z: -15 to -20)
  - For each position, create a `THREE.Group` containing:
    - Inner sphere: `SphereGeometry(0.12, 6, 6)`, `MeshBasicMaterial` with warm color (randomly pick from `0xffcc66`, `0xffaa44`, `0xffdd88`, `0xeebb55`)
    - Outer glow: `SphereGeometry(0.35, 6, 6)`, `MeshBasicMaterial` with same color, opacity 0.15, `transparent: true`
  - Store references in a `villageLights` array for animation
  - Desktop: 10 lights; Mobile: 6 lights (detect via existing `isMobile` flag)
- Expected outcome: Warm glowing orbs positioned along the horizon

#### Step 2: Add pulsing animation
- File: `public/js/scene-init.js`
  - In the `animate()` loop, for each light in `villageLights`:
    - Calculate pulse: `0.85 + 0.15 * Math.sin(time * 0.5 + phaseOffset)` where `phaseOffset` is randomized per light
    - Apply to inner sphere material opacity
    - Apply to outer glow material opacity (scaled: `0.1 * pulse`)
  - Use a gentle sine wave — no harsh flickering
- Expected outcome: Each light pulses gently with a unique phase, creating organic variation

#### Step 3: Position relative to scene
- File: `public/js/scene-init.js`
  - Place lights at y: 2-5 (just above the water waves, below the cypress tree tops)
  - Place lights at z: -15 to -20 (behind the cypress trees, suggesting distance)
  - Vary x positions to create a natural, non-uniform distribution
  - Ensure lights don't overlap with cypress tree positions
- Expected outcome: Lights appear to be a distant village behind the cypresses

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Light count: 6 (vs 10 desktop)
  - Glow sphere radius: 0.25 (vs 0.35 desktop)
  - Same pulsing behavior
- Performance: Negligible — 12 simple sphere meshes with `MeshBasicMaterial` (no lighting calculations)

### 3.4 Data Structures

```json
{
  "villageLights": {
    "count": 10,
    "countMobile": 6,
    "colors": ["0xffcc66", "0xffaa44", "0xffdd88", "0xeebb55"],
    "innerRadius": 0.12,
    "glowRadius": 0.35,
    "yRange": [2, 5],
    "zRange": [-20, -15],
    "pulseSpeed": 0.5,
    "pulseAmplitude": 0.15
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Village lights array exists | `tests/village-lights.test.js` | `villageLights` is an array with length ≥ 6 |
| Each light has inner + glow spheres | `tests/village-lights.test.js` | Each light group has 2 children |
| Lights use warm colors | `tests/village-lights.test.js` | All material colors are in the warm palette |
| Lights are positioned at horizon | `tests/village-lights.test.js` | All lights have y between 2-5 and z between -20 and -15 |
| Pulsing animation runs | `tests/village-lights.test.js` | After animate loop, light opacity has changed from initial |
| Mobile uses fewer lights | `tests/village-lights.test.js` | When `isMobile === true`, light count ≤ 6 |

### 4.2 Green Phase — Implementation

- Add village light meshes and pulsing animation to `scene-init.js`
- Verify all 6 tests pass
- Verify build succeeds: `npm run build`

### 4.3 Refactor Phase — Optimization

- Add a subtle "window" shape (small dark quad behind each light) to suggest buildings
- Make lights slightly visible through the cypress tree silhouettes (depth layering)
- Add a very faint reflection of the lights on the water waves

---

## 5. Acceptance Criteria

- [ ] 10 warm glowing lights appear along the horizon (6 on mobile)
- [ ] Lights pulse gently with desynchronized sine waves
- [ ] Lights use warm colors (gold, amber, soft orange)
- [ ] Lights are positioned behind/between cypress trees
- [ ] Each light has an inner bright sphere and outer soft glow
- [ ] No frame rate impact (uses MeshBasicMaterial, no lighting calculations)
- [ ] All 6 unit tests pass
- [ ] No console errors
- [ ] Does not interfere with existing scene elements (cypress, waves, flowers)

---

## 6. Dependencies & Risks

**Dependencies:**
- Existing Three.js scene in `scene-init.js` (present)
- Existing cypress tree positions (idea-026) for placement reference
- Existing `isMobile` flag for count adjustment

**Risks:**
- **Lights look like stars:** If placed too high or too bright, they could be confused with stars. Mitigation: keep them low (y: 2-5), warm-colored (not white), and clustered near the horizon.
- **Overlap with cypress trees:** Lights behind trees should be partially occluded. Mitigation: place lights at z: -15 to -20, cypress trees at z: -10 to -12.
- **Too many draw calls:** Each light is a separate group. Mitigation: use `MeshBasicMaterial` (no lighting), low polygon counts (6 segments), and keep count ≤ 10.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Village street lamp lights — warm glowing orbs along the horizon evoking Starry Night's village",
  "changes": [
    "Added 10 warm glowing light orbs (6 mobile) to scene-init.js",
    "Each light: inner bright sphere + outer soft glow halo",
    "Gentle pulsing animation with desynchronized sine waves",
    "Warm color palette: gold, amber, soft orange",
    "Positioned at horizon line behind cypress trees",
    "Uses MeshBasicMaterial for zero lighting cost",
    "References the village in Van Gogh's Starry Night painting"
  ]
}
```

---

## Reviewer Notes (2026-05-24)

**Quality Check**: Solid PRD with clear positioning and good technical approach. The `MeshBasicMaterial` choice is correct — zero lighting cost for distant atmospheric elements.

**Design Alignment**: The village lights fill a genuine compositional gap in the scene. They add human warmth to the cosmic sky, which is exactly what Van Gogh painted — the tension between the infinite above and the intimate below.

**Feasibility**: This PRD modifies `scene-init.js` directly (SACRED file). While the changes are relatively simple (adding light meshes and pulsing animation), any modification to scene-init.js carries risk. **Recommendation**: Refactor to use a standalone `public/js/village-lights.js` module with a 2-line import/init in scene-init.js.

**Scope**: Low is appropriate. This is a small atmospheric addition with negligible performance impact.

---

## Reviewer Notes (2026-06-01)

**Architecture Update**: This PRD now REQUIRES standalone module pattern. The village lights must be `public/js/village-lights.js` — a self-contained module exporting `initVillageLights(scene)` and `updateVillageLights(time)`. scene-init.js gets exactly 2 lines added (import + init call). No other scene-init.js modifications.

**Status**: Backlog — no implementation attempted. Depends only on existing Three.js scene and cypress tree positions (idea-026, done).

**Priority**: Low — appropriate for a small atmospheric addition.
