# PRD: Enhanced Star System with Temperature-Based Colors

> **ID:** idea-040 
> **Category:** 3D Elements 
> **Priority:** low 
> **Status:** backlog 
> **PRD Version:** 1.0 
> **Last Updated:** 2026-05-24
---

## 1. Overview

**One-liner:** Enhance the star field with scientifically-inspired color variations based on simulated star temperatures, creating a more vivid and impressionist night sky.

**Problem:** The current star field uses uniform white or slightly yellowish stars, which lacks the color variety and visual interest that could make the night sky feel more alive and authentic. Real star fields show a variety of colors based on stellar temperatures, which would enhance the impressionist aesthetic.

**Solution:** Assign stars colors based on a simplified temperature scale (red, orange, yellow, white, blue-white) to create a more natural and visually interesting star field that still maintains the dreamy, impressionist quality of the the artist aesthetic.

## 2. User Stories

- As a visitor, I want to see stars with subtle color variations so that the night sky feels more realistic and immersive.
- As a visitor, I want the star colors to complement the site's existing color scheme without clashing or becoming too distracting.
- As a visitor, I want the enhanced star system to work seamlessly with the existing twinkling effect.

## 3. Technical Specification

### 3.1 Architecture

This feature enhances the existing star particle system in `public/js/scene-init.js`:
- Modifies star creation to assign colors based on simulated temperature
- Maintains existing star count, twinkling shader, and positioning logic
- Works within the current THREE.Points system or similar sprite-based approach
- Preserves all existing star behavior (twinkling, positioning, etc.)

### 3.2 Implementation Details

#### Step 1: Implement Star Temperature/Color Assignment
- File: `public/js/scene-init.js`
- What to do:
  - Modify star creation loop to assign each star a "temperature" value
  - Map temperature to color using a simplified astronomical scale:
    - Red (< 3,500K): Cool red dwarfs
    - Orange (3,500-5,000K): K-type stars
    - Yellow (5,000-6,000K): G-type like our Sun
    - White (6,000-7,500K): F-type stars
    - Blue-white (> 7,500K): A, B, O-type stars
  - Apply these colors to the star sprites/particles
  - Ensure colors are subtle and work with the dark background
- Expected outcome: Stars exhibit subtle color variations based on simulated temperature

#### Step 2: Integrate with Existing Twinkling Shader
- File: `public/js/scene-init.js`
- What to do:
  - Ensure the existing twinkling shader (size + brightness oscillation) works with colored stars
  - Modify twinkling to affect brightness while preserving color hue
  - Optionally add very subtle color shifting to the twinkling for extra life
- Expected outcome: Colored stars twinkle in a way that enhances rather than obscures their color

#### Step 3: Balance and Artistic Tuning
- File: `public/js/scene-init.js`
- What to do:
  - Adjust color saturation to be subtle and dreamy, not garish
  - Ensure colors work with the site's overall color schemes (starry-night, sunflower, etc.)
  - Consider weighting the distribution to favor warmer colors for a cozier night sky feel
  - Test that the enhanced star field maintains the impressionist, not photorealistic, quality
- Expected outcome: Star field with pleasing color variation that enhances the the artist aesthetic

### 3.3 Mobile Considerations

- On mobile (viewport < 768px):
  - The star color enhancement works identically since it's a material/color property
  - No additional performance cost beyond the existing star system
  - May consider reducing star count slightly if needed for performance, but color addition itself is negligible

### 3.4 Data Structures

May add a temperature property to star data if stored individually, or calculate color on-the-fly based on star index/position.

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Star creation assigns colors | `tests/threejs/star-color-test.js` | Stars have varied colors beyond pure white |
| Colors follow temperature distribution | `tests/threejs/star-distribution-test.js` | Star colors show appropriate distribution across temperature spectrum |
| Existing twinkling preserved | `tests/threejs/star-twinkle-test.js` | Stars still exhibit size/brightness oscillation with color enhancement |

### 4.2 Green Phase — Implementation

The implementation makes tests pass by:
- Modifying star particle creation to include color assignment
- Ensuring the point sprite/material system supports vertex/per-star colors
- Maintaining backward compatibility with all existing star behaviors

### 4.3 Refactor Phase — Optimization

- Consider using a color lookup texture for efficiency if star count is very high
- Implement color variation that can be tuned via uniforms for easy adjustment
- Share color generation logic with other celestial objects if needed

## 5. Acceptance Criteria

- [ ] Star system creates stars with varied colors beyond white/yellow
- [ ] Colors follow a logical temperature-based distribution (red to blue-white)
- [ ] Existing twinkling behavior (size/brightness oscillation) is preserved
- [ ] Star colors are subtle and complement the impressionist aesthetic
- [ ] Works correctly with all existing color schemes (starry-night, sunflower, etc.)
- [ ] No performance impact on star rendering
- [ ] Mobile performance identical to desktop (color add is negligible cost)
- [ ] Passes all unit tests for star creation, color assignment, and behavior preservation

## 6. Dependencies & Risks

**Dependencies:**
- Existing star particle system in scene-init.js
- Three.js Points or similar system that supports per-vertex/per-particle colors

**Risks:**
- Colors could become too distracting or garish - Mitigation: Careful tinting and saturation control, favoring subtlety
- Could conflict with specific color schemes - Mitigation: Test with all 5 existing schemes, adjust as needed
- Performance impact if not implemented efficiently - Mitigation: Minimal overhead, star color is cheap to calculate/apply

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Enhanced star field with temperature-based color variations",
  "changes": [
    "Modified star creation to assign colors based on simulated stellar temperature",
    "Implemented color mapping from red dwarfs to blue-white stars",
    "Integrated colored stars with existing twinkling shader system",
    "Tuned color saturation for subtlety and impressionist aesthetic",
    "Verified compatibility with all existing site color schemes"
  ]
}
```

---

## Reviewer Notes (2026-05-23)

**Sacred File Warning**: This PRD modifies `public/js/scene-init.js` directly, which is marked as SACRED in AGENTS.md. Never modify this file unless explicitly instructed by the user. The file contains the entire Three.js scene (stars, moon, sunflowers, lilies, music notes, waves, fireflies, cypress trees, painting reveal, post-processing shaders).

**Risk Assessment**: 
- High risk: Breaking `scene-init.js` breaks the entire 3D scene
- Mitigation: Consider implementing as a separate module (`public/js/enhanced-stars.js`) that integrates via minimal import/init calls in scene-init.js (2 lines max)
- Alternative: Create a custom star material or modify the existing material in a separate module

**Priority Note**: The kanban board shows this idea as `low` priority, while this PRD shows `medium`. Based on the sacred file concerns and the fact that the star field already twinkles and has basic color, consider lowering priority to `low` unless there's strong user demand for enhanced star colors.