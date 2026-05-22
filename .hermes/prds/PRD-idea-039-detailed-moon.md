# PRD: Detailed Moon Surface with Craters and Texture

> **ID:** idea-039 
> **Category:** 3D Elements 
> **Priority:** medium 
> **Status:** backlog 
> **PRD Version:** 1.0 
> **Last Updated:** 2026-05-22
---

## 1. Overview

**One-liner:** Enhance the 3D moon with realistic crater texture, bump mapping, and subtle surface details using normal maps or height maps.

**Problem:** The current moon is a smooth sphere with a basic emissive material. While it has glow and orbits correctly, it lacks the surface texture and character that would make it feel like a real astronomical body, missing an opportunity to add visual interest and authenticity to the night sky.

**Solution:** Apply a lunar texture map (albedo) combined with a normal or height map to create crater details and surface variation on the moon, making it appear more like the actual moon with its maria, craters, and rugged surface.

## 2. User Stories

- As a visitor, I want to see realistic crater details on the moon so that it feels like an authentic celestial body.
- As a visitor, I want the moon's surface texture to complement the impressionist aesthetic without becoming overly literal or photorealistic.
- As a visitor, I want the moon to maintain its artistic glow and color while gaining surface detail.

## 3. Technical Specification

### 3.1 Architecture

This feature enhances the existing moon object in `public/js/scene-init.js`:
- Replaces or augments the current moon material with a textured material
- Uses texture maps for albedo (color) and normal/height (surface detail)
- Maintains existing moon orbit, rotation, and glow effects
- Preserves the moon's current size and position in the scene

### 3.2 Implementation Details

#### Step 1: Acquire or Create Lunar Texture Maps
- File: `public/textures/` (create directory if needed)
- What to do:
  - Obtain or create a moon albedo texture showing lunar mare and crater patterns
  - Obtain or create a normal map or height map for surface detail
  - Optimize textures for web use (appropriate sizing, compression)
- Expected outcome: Moon texture assets available in /public/textures/

#### Step 2: Apply Textured Material to Moon
- File: `public/js/scene-init.js`
- What to do:
  - Load the lunar textures using THREE.TextureLoader
  - Create a MeshStandardMaterial (or MeshPhongMaterial) with:
    - map: lunar albedo texture (desaturated to maintain color scheme)
    - normalMap: lunar normal map for crater detail
    - Optional: displacementMap for actual geometry changes (more expensive)
  - Maintain or adjust emissive properties for the moon's glow
  - Ensure material works with existing post-processing (if any)
- Expected outcome: Moon shows crater and mare details when viewed closely

#### Step 3: Tune for Artistic Integration
- File: `public/js/scene-init.js`
- What to do:
  - Desaturate or tint the albedo texture to match the site's color scheme
  - Adjust normal map strength to avoid overly harsh details
  - Balance texture detail with the impressionist, slightly soft aesthetic
  - Ensure the moon remains recognizable as an artistic element
- Expected outcome: Textured moon that fits the Van Gogh impressionist style

### 3.3 Mobile Considerations

- On mobile (viewport < 768px):
  - Use lower resolution texture maps (512x512 or 256x256)
  - Consider using only albedo map without normal map if performance is an issue
  - Alternatively, use baked lighting in the albedo texture itself
  - Maintain the core enhancement while respecting mobile performance constraints

### 3.4 Data Structures

No new data structures required - this enhances existing moon object with texture maps.

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Moon object exists in scene | `tests/threejs/moon-test.js` | Scene contains a moon mesh with appropriate position |
| Moon has texture material applied | `tests/threejs/moon-material-test.js` | Moon material has map and/or normalMap properties set |
| Texture loads correctly | `tests/assets/moon-texture-test.js` | Lunar textures load without errors and apply to moon |

### 4.2 Green Phase — Implementation

The implementation makes tests pass by:
- Adding texture loading for moon surface details
- Applying appropriate material properties to the moon mesh
- Tuning texture parameters for artistic integration

### 4.3 Refactor Phase — Optimization

- Implement texture level-of-detail based on camera distance
- Share texture loading logic with other celestial bodies if added
- Consider texture atlas approach if adding multiple detailed objects

## 5. Acceptance Criteria

- [ ] Moon object exists in the scene with correct orbit and rotation
- [ ] Moon has albedo texture showing lunar mare and crater patterns
- [ ] Moon has normal map or height map for surface detail (or baked detail in albedo)
- [ ] Texture resolution is appropriate for device (higher on desktop, lower on mobile)
- [ ] Moon maintains its artistic glow and color scheme integration
- [ ] Surface detail is visible but not photorealistic - maintains impressionist feel
- [ ] No significant performance impact from texture loading
- [ ] Passes all unit tests for texture loading and material application

## 6. Dependencies & Risks

**Dependencies:**
- Existing moon object creation in scene-init.js
- Ability to load and apply textures in Three.js (standard functionality)

**Risks:**
- Performance impact from texture loading and sampling - Mitigation: Optimized texture sizes, mobile fallbacks
- Texture could make moon too literal/distracting - Mitigation: Artistic tuning (desaturation, strength adjustment)
- Finding or creating appropriate lunar textures - Mitigation: Use public domain NASA textures or create simple procedural alternatives

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Enhanced moon with realistic crater texture and surface details",
  "changes": [
    "Added lunar albedo and normal textures to public/textures/",
    "Applied textured material to moon object in scene-init.js",
    "Tuned texture strength and color to maintain impressionist aesthetic",
    "Added mobile performance considerations with texture LOD"
  ]
}
```

---

## Reviewer Notes (2026-05-23)

**Sacred File Warning**: This PRD modifies `public/js/scene-init.js` directly, which is marked as SACRED in AGENTS.md. Never modify this file unless explicitly instructed by the user. The file contains the entire Three.js scene (stars, moon, sunflowers, lilies, music notes, waves, fireflies, cypress trees, painting reveal, post-processing shaders).

**Risk Assessment**: 
- High risk: Breaking `scene-init.js` breaks the entire 3D scene
- Mitigation: Consider implementing as a separate module (`public/js/detailed-moon.js`) that integrates via minimal import/init calls in scene-init.js (2 lines max)
- Alternative: Load textures in a separate module and pass the material to scene-init.js

**Priority Note**: The kanban board shows this idea as `low` priority, while this PRD shows `medium`. Based on the sacred file concerns and the fact that the moon already has glow and correct orbit, consider lowering priority to `low` unless there's strong user demand for enhanced moon detail.