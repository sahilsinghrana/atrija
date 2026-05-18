# PRD: GLSL Watercolor Post-Processing Shader

> **ID:** idea-007  
> **Category:** Shaders  
> **Priority:** high  
> **Status:** cancelled  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Add a watercolor-style post-processing shader with edge detection and color bleeding for a painterly look that enhances the impressionist aesthetic.

**Problem:** The existing Van Gogh shader adds swirl and stroke effects, but lacks the soft, bleeding, watercolor-like quality that would make the scene feel more like a painting.

**Solution:** Add a second post-processing pass (after the existing Van Gogh pass) that applies: edge darkening (like ink outlines), color bleeding (neighborhood color averaging), and paper texture overlay. This creates a watercolor/painting effect on top of the existing scene. Desktop only — mobile uses the existing glitch shader.

---

## 2. User Stories

- As a visitor, I want the scene to look more like a painting so the artistic vision is fully realized.
- As a visitor, I want soft edges and color bleeding so the 3D scene feels hand-painted.
- As a desktop user, I want the full painterly effect so I get the premium experience.

---

## 3. Technical Specification

### 3.1 Architecture

- **File modified:** `public/js/scene-init.js`
- **New shader:** `watercolorFS` — fragment shader for watercolor effect
- **New pass:** `watercolorPass` — ShaderPass added to the composer
- **Depends on:** Existing `EffectComposer`, `isLowEnd` flag (desktop only)

### 3.2 Implementation Details

#### Step 1: Add watercolor fragment shader

Add after the existing `vgFS` shader definition (~line 12):

```javascript
// ── Watercolor post-processing shader ──
var watercolorFS = `
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uBleedRadius;
uniform float uEdgeStrength;
uniform float uColorQuantize;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 texel = 1.0 / vec2(1920.0, 1080.0); // approximate, will be scaled

  // ── Color bleeding (neighborhood average) ──
  vec3 color = texture2D(tDiffuse, uv).rgb;
  vec3 bleed = vec3(0.0);
  float total = 1.0;

  // Sample in a cross pattern for soft bleed
  float radius = uBleedRadius;
  bleed += texture2D(tDiffuse, uv + vec2(radius, 0.0) * texel).rgb;
  bleed += texture2D(tDiffuse, uv - vec2(radius, 0.0) * texel).rgb;
  bleed += texture2D(tDiffuse, uv + vec2(0.0, radius) * texel).rgb;
  bleed += texture2D(tDiffuse, uv - vec2(0.0, radius) * texel).rgb;
  bleed += texture2D(tDiffuse, uv + vec2(radius, radius) * 0.7 * texel).rgb;
  bleed += texture2D(tDiffuse, uv - vec2(radius, radius) * 0.7 * texel).rgb;
  bleed += texture2D(tDiffuse, uv + vec2(radius, -radius) * 0.7 * texel).rgb;
  bleed += texture2D(tDiffuse, uv - vec2(radius, -radius) * 0.7 * texel).rgb;
  total += 8.0;

  bleed = bleed / total;
  color = mix(color, bleed, 0.4); // blend original with bleed

  // ── Edge detection (Sobel-like) ──
  float edge = 0.0;
  vec3 c00 = texture2D(tDiffuse, uv + vec2(-1.0, -1.0) * texel * 2.0).rgb;
  vec3 c10 = texture2D(tDiffuse, uv + vec2( 0.0, -1.0) * texel * 2.0).rgb;
  vec3 c20 = texture2D(tDiffuse, uv + vec2( 1.0, -1.0) * texel * 2.0).rgb;
  vec3 c01 = texture2D(tDiffuse, uv + vec2(-1.0,  0.0) * texel * 2.0).rgb;
  vec3 c21 = texture2D(tDiffuse, uv + vec2( 1.0,  0.0) * texel * 2.0).rgb;
  vec3 c02 = texture2D(tDiffuse, uv + vec2(-1.0,  1.0) * texel * 2.0).rgb;
  vec3 c12 = texture2D(tDiffuse, uv + vec2( 0.0,  1.0) * texel * 2.0).rgb;
  vec3 c22 = texture2D(tDiffuse, uv + vec2( 1.0,  1.0) * texel * 2.0).rgb;

  vec3 gx = -c00 - 2.0*c01 - c02 + c20 + 2.0*c21 + c22;
  vec3 gy = -c00 - 2.0*c10 - c20 + c02 + 2.0*c12 + c22;
  edge = length(gx) + length(gy);
  edge = smoothstep(0.1, 0.5, edge);

  // Darken edges (ink-like)
  color = mix(color, color * 0.3, edge * uEdgeStrength);

  // ── Color quantization (reduces color banding for painterly look) ──
  float quantize = uColorQuantize;
  color = floor(color * quantize + 0.5) / quantize;

  // ── Subtle paper grain ──
  float grain = hash(uv * 500.0 + uTime * 0.1) * 0.03 - 0.015;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;
```

#### Step 2: Add pass to the composer

In the `VanGoghScene` constructor, after the Van Gogh pass:

```javascript
// After the vgPass setup (~line 87):
if (!isLowEnd) {
  this.watercolorPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uBleedRadius: { value: 3.0 },
      uEdgeStrength: { value: 0.6 },
      uColorQuantize: { value: 16.0 }
    },
    vertexShader: vgVS,
    fragmentShader: watercolorFS
  });
  this.composer.addPass(this.watercolorPass);
}
```

#### Step 3: Update animation loop

In `VanGoghScene.animate()`:

```javascript
if (this.watercolorPass) this.watercolorPass.uniforms.uTime.value = t;
```

#### Step 4: Add to updateUniforms

```javascript
if (this.watercolorPass) {
  if (p.bleedRadius !== undefined) this.watercolorPass.uniforms.uBleedRadius.value = p.bleedRadius;
  if (p.edgeStrength !== undefined) this.watercolorPass.uniforms.uEdgeStrength.value = p.edgeStrength;
  if (p.colorQuantize !== undefined) this.watercolorPass.uniforms.uColorQuantize.value = p.colorQuantize;
}
```

### 3.3 Mobile Considerations

- **Disabled on mobile** (`isLowEnd` check) — too expensive for mobile GPUs
- Desktop only: added as final pass in the composer chain
- If desktop performance is poor, reduce bleed radius from 3.0 to 2.0

### 3.4 Data Structures

```json
{
  "watercolorUniforms": {
    "uBleedRadius": 3.0,
    "uEdgeStrength": 0.6,
    "uColorQuantize": 16.0
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Watercolor pass created on desktop | `tests/unit/watercolor-shader.test.js` | `watercolorPass !== undefined when !isLowEnd` |
| Watercolor pass skipped on mobile | `tests/unit/watercolor-shader.test.js` | `watercolorPass === undefined when isLowEnd` |
| Shader compiles without error | `tests/unit/watercolor-shader.test.js` | `gl.getError() === 0` |
| Uniforms have correct defaults | `tests/unit/watercolor-shader.test.js` | `uBleedRadius === 3.0` |

### 4.2 Green Phase — Implementation

Add shader, add pass to composer, update animation loop.

### 4.3 Refactor Phase — Optimization

- Reduce sample count from 8 to 4 for bleed (cross pattern only)
- Use lower resolution render target for the watercolor pass
- Make bleed radius configurable via daily mutation cron

---

## 5. Acceptance Criteria

- [ ] Watercolor shader applies on desktop (not mobile)
- [ ] Color bleeding creates soft, painterly color transitions
- [ ] Edge detection darkens boundaries (ink-like outlines)
- [ ] Color quantization reduces banding for painterly look
- [ ] Subtle paper grain texture visible
- [ ] No frame rate drops below 30fps on desktop
- [ ] All unit tests pass
- [ ] Changelog entry added

---

## 6. Dependencies & Risks

**Dependencies:** Existing `EffectComposer`, `isLowEnd` flag, `vgVS` vertex shader (reused)

**Risks:**
- 8-sample bleed may be expensive on low-end desktops → Reduce to 4 samples
- Edge detection may be too aggressive → Tune `uEdgeStrength` (0.4-0.8 range)
- Color quantization may look banded if value is too low → Keep at 16+ levels
- Shader compilation may fail on some GPUs → Test with common Intel/AMD/NVIDIA

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Watercolor post-processing shader — edge detection + color bleeding + paper grain",
  "changes": [
    "Added watercolor GLSL post-processing pass (desktop only)",
    "Sobel edge detection for ink-like outlines",
    "8-sample color bleeding for soft painterly look",
    "Color quantization + paper grain texture"
  ]
}
```

---

## Reviewer Notes (2026-05-19)

**Status changed to CANCELLED.** The post-processing pipeline (EffectComposer, ShaderPass, Van Gogh/glitch shaders) was removed in a prior refactoring (see AGENTS.md: "No post-processing: Direct `renderer.render()`"). This PRD depends entirely on that removed infrastructure. To revisit this idea, a new approach would need to work with the current direct-render architecture — e.g., applying watercolor effects via CSS filters on the canvas element, or re-implementing post-processing with a lighter custom solution.
