# PRD: Starry Night Swirling Sky Shader

> **ID:** idea-038 
> **Category:** Shaders 
> **Priority:** medium 
> **Status:** backlog 
> **PRD Version:** 1.0 
> **Last Updated:** 2026-05-22
---

## 1. Overview

**One-liner:** Add noise-based vertex displacement to the sky dome to create authentic swirling brushstroke patterns reminiscent of the artist Starry Night painting.

**Problem:** The current sky appears static and lacks the dynamic, swirling energy that characterizes the artist most famous work. While stars twinkle and the moon moves, the sky itself doesn't convey the emotional turbulence and movement central to the artist style.

**Solution:** Implement a vertex shader that applies procedural noise-based displacement to the sky dome/hemisphere, creating slow, organic swirling patterns that evolve over time, mimicking the thick, directional brushstrokes seen in Starry Night's sky.

## 2. User Stories

- As a visitor, I want to see subtle swirling movements in the night sky so that I can experience the emotional energy of the artist Starry Night.
- As a visitor, I want the sky to feel alive and painted rather than static so that the 3D scene connects more deeply to the artist artistic technique.
- As a visitor, I want the swirling effect to be gentle and not distracting so that it enhances rather than overwhelms the overall impressionist aesthetic.

## 3. Technical Specification

### 3.1 Architecture

This feature modifies the existing sky/atmosphere rendering in `public/js/scene-init.js`:
- Creates a sky dome/hemisphere geometry (if not already present)
- Adds a custom vertex shader that applies noise-based displacement
- Uses time and noise functions to create organic, evolving swirl patterns
- Maintains existing star and moon rendering layers on top

### 3.2 Implementation Details

#### Step 1: Create Sky Dome Geometry
- File: `public/js/scene-init.js`
- What to do:
  - Add a large hemispherical or spherical geometry for the sky (radius ~500-1000)
  - Position it to encompass the entire scene
  - Apply a basic MeshBasicMaterial or MeshStandardMaterial initially
- Expected outcome: A sky dome exists that can be shaded

#### Step 2: Implement Swirling Vertex Shader
- File: `public/js/scene-init.js`
- What to do:
  - Create a custom shader material with vertex shader that:
    - Uses 3D noise (simplex or perlin) based on vertex position + time
    - Applies displacement in tangent space to create swirl patterns
    - Uses multiple noise layers at different scales for complexity
    - Animates slowly over time (cycles of 20-60 seconds)
  - Fragment shader outputs a deep blue-black base color with subtle variations
- Expected outcome: Sky shows slow, organic swirling patterns that evolve over time

#### Step 3: Integrate with Existing Systems
- File: `public/js/scene-init.js`
- What to do:
  - Ensure sky renders behind stars but potentially in front of or behind moon based on desired effect
  - Adjust opacity/blending to maintain star visibility
  - Tune effect strength to be subtle but noticeable
- Expected outcome: Swirling sky integrates seamlessly with existing star field and moon

### 3.3 Mobile Considerations

- On mobile (viewport < 768px):
  - Reduce sky dome segment count for lower vertex count
  - Simplify noise to 1-2 layers instead of 3-4
  - Consider using a pre-rendered animated texture if shader proves too heavy
  - Maintain the swirling effect but at lower visual complexity

### 3.4 Data Structures

No new data structures required - this is purely a visual/shader enhancement.

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Sky dome geometry is created | `tests/threejs/sky-test.js` | Scene contains a hemispherical geometry with appropriate radius |
| Swirling shader modifies vertex positions | `tests/threejs/sky-shader-test.js` | Vertex shader applies time-based displacement to sky vertices |
| Effect is visible but subtle | `tests/e2e/visual-regression.test.js` | Sky shows animated patterns that don't obscure stars |

### 4.2 Green Phase — Implementation

The implementation makes tests pass by:
- Adding sky dome geometry creation in scene init
- Implementing custom shader material with noise-based vertex displacement
- Tuning parameters for subtle, authentic swirling effect

### 4.3 Refactor Phase — Optimization

- Share noise implementations with other shaders if applicable
- Consider texture-based noise for mobile performance
- Implement LOD system for sky detail based on distance/camera

## 5. Acceptance Criteria

- [ ] Sky dome geometry is present in the scene
- [ ] Custom vertex shader applies noise-based displacement
- [ ] Swirling patterns evolve slowly over time (noticeable over 10-30 seconds)
- [ ] Effect is subtle enough that stars remain clearly visible
- [ ] Works on desktop with full visual effect
- [ ] Mobile version maintains essence of effect with reduced complexity
- [ ] No significant performance impact (<5ms frame time increase)
- [ ] Passes all unit and visual regression tests

## 6. Dependencies & Risks

**Dependencies:**
- Existing Three.js scene initialization in scene-init.js
- Basic understanding of custom shader materials in Three.js

**Risks:**
- Performance impact on low-end devices - Mitigation: Mobile fallback to simpler effect or reduced complexity
- Effect could obscure stars if too strong - Mitigation: Careful tuning of displacement strength and opacity
- Complexity of implementing good noise functions - Mitigation: Use well-known simplex/perlin implementations or texture-based noise

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Added Starry Night swirling sky shader with noise-based vertex displacement",
  "changes": [
    "Added sky dome geometry to scene",
    "Implemented custom vertex shader with noise-based swirling displacement",
    "Integrated swirling sky behind star field with appropriate blending",
    "Added mobile performance considerations with simplified fallback"
  ]
}
```

---

## Reviewer Notes (2026-05-23)

**Sacred File Warning**: This PRD modifies `public/js/scene-init.js` directly, which is marked as SACRED in AGENTS.md. Never modify this file unless explicitly instructed by the user. The file contains the entire Three.js scene (stars, moon, sunflowers, lilies, music notes, waves, fireflies, cypress trees, painting reveal, post-processing shaders).

**Risk Assessment**: 
- High risk: Breaking `scene-init.js` breaks the entire 3D scene
- **REQUIRED**: Must be implemented as standalone `public/js/swirling-sky.js` module with only 2-line import/init in scene-init.js
- Alternative: Use the existing post-processing pipeline if it exists, or create a new EffectComposer pass

**Recommendation**: Refactor to avoid direct scene-init.js modifications. Create a standalone module that adds the sky dome as a separate Three.js object, similar to how idea-032 (time-of-day) works via CSS variables or idea-041 (aurora) works as a separate module.

---

## Reviewer Notes (2026-06-01)

**Architecture Update**: This PRD now REQUIRES standalone module pattern. The swirling sky must be `public/js/swirling-sky.js` — a self-contained module exporting `initSwirlingSky(scene)` and `updateSwirlingSky(time)`. scene-init.js gets exactly 2 lines added (import + init call). No other scene-init.js modifications.

**Status**: Backlog — no implementation attempted. Standalone Three.js addition, no dependencies.

**Priority**: Medium — appropriate for a visual enhancement that significantly improves the Starry Night atmosphere.