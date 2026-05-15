# PRD: Scroll-Driven Color Palette Transition

> **ID:** idea-021
> **Category:** Shaders
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-16

---

## 1. Overview

**One-liner:** As the user scrolls through sections, the post-processing shader subtly shifts the scene's color palette between Van Gogh's famous painting palettes.

**Problem:** The site currently uses a single Van Gogh-style post-processing shader with fixed parameters. While the daily mutation system changes color schemes in `siteData.json`, the visual transition between sections is abrupt (instant palette swap). This misses an opportunity for a cinematic, immersive experience that mirrors how Van Gogh's own palette evolved across his career.

**Solution:** A scroll-driven uniform that interpolates between 5 color palette configurations in the post-processing shader. As the user scrolls from one section to the next, the shader smoothly transitions hue shifts, saturation, and color tinting over 1.5 seconds. Each section maps to a palette inspired by a specific Van Gogh painting (Starry Night, Sunflowers, Midnight Wave, Tulip Garden, Moonlit Silver).

---

## 2. User Stories

- As a visitor, I want the colors to shift smoothly as I scroll between sections so that the experience feels cinematic and cohesive.
- As a visitor, I want each section's color palette to evoke a specific Van Gogh painting so that I feel immersed in his artistic world.
- As a visitor, I want the transitions to be subtle so that they enhance rather than distract from the content.
- As a mobile visitor, I want the same palette transitions but with reduced shader complexity so that my device stays smooth.

---

## 3. Technical Specification

### 3.1 Architecture

- **Modified file:** `public/js/scene-init.js` — Modify the existing post-processing shader to accept palette interpolation uniforms
- **Modified file:** `src/pages/index.astro` — Add `data-palette` attributes to section elements for scroll detection
- **No new files** — This extends the existing Van Gogh post-processing shader

The system works by:
1. Adding `data-palette` attributes to each section element in `index.astro`
2. Using `IntersectionObserver` to detect which section is currently in view
3. Mapping each section to a palette configuration (5 palettes for 5 themes)
4. Passing the target palette index and transition progress as uniforms to the post-processing shader
5. The shader interpolates between the current and target palette each frame

### 3.2 Implementation Details

#### Step 1: Define palette configurations
- File: `public/js/scene-init.js`
- What to do:
  - Define a `PALETTES` array with 5 palette objects:
    ```js
    const PALETTES = [
      { // 0: Starry Night — deep blues, bright yellows
        hueShift: 0.0,        // radians, 0 = no shift
        saturation: 1.1,      // slight boost
        warmth: 0.0,          // neutral
        tint: { r: 0.15, g: 0.2, b: 0.4 },  // subtle blue tint
        contrast: 1.05
      },
      { // 1: Sunflowers — warm yellows, golden tones
        hueShift: 0.05,       // slight warm shift
        saturation: 1.2,
        warmth: 0.3,          // warm
        tint: { r: 0.35, g: 0.25, b: 0.05 }, // golden tint
        contrast: 1.0
      },
      { // 2: Midnight Wave — deep teals, dark blues
        hueShift: -0.1,       // cool shift
        saturation: 0.95,
        warmth: -0.2,         // cool
        tint: { r: 0.05, g: 0.15, b: 0.3 },  // teal tint
        contrast: 1.1
      },
      { // 3: Tulip Garden — vibrant reds, purples, greens
        hueShift: 0.02,
        saturation: 1.3,      // high saturation
        warmth: 0.1,
        tint: { r: 0.2, g: 0.05, b: 0.15 },  // magenta tint
        contrast: 1.0
      },
      { // 4: Moonlit Silver — desaturated, cool grays
        hueShift: 0.0,
        saturation: 0.7,      // desaturated
        warmth: -0.1,
        tint: { r: 0.1, g: 0.1, b: 0.15 },   // subtle cool gray
        contrast: 0.95
      }
    ];
    ```
- Expected outcome: 5 palette configurations that can be interpolated between

#### Step 2: Add palette attributes to sections
- File: `src/pages/index.astro`
- What to do:
  - Add `data-palette="0"` through `data-palette="4"` to each section's root element:
    ```astro
    <section data-palette="0" id="hero">...</section>
    <section data-palette="1" id="moon">...</section>
    <section data-palette="2" id="philosophy">...</section>
    <section data-palette="3" id="gita">...</section>
    <section data-palette="4" id="shiva">...</section>
    ```
  - Map: hero→starry-night(0), moon→sunflowers(1), philosophy→midnight-wave(2), gita→tulip-garden(3), shiva→moonlit-silver(4)
- Expected outcome: Each section declares its target palette via data attribute

#### Step 3: Implement scroll-driven palette detection
- File: `public/js/scene-init.js`
- What to do:
  - Create an `IntersectionObserver` watching all `[data-palette]` elements:
    ```js
    const paletteObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paletteIndex = parseInt(entry.target.dataset.palette, 10);
          targetPaletteIndex = paletteIndex;
          transitionStartTime = performance.now();
        }
      });
    }, {
      threshold: 0.5,  // section is "active" when 50% visible
      rootMargin: '-10% 0px -10% 0px'  // focus on center of viewport
    });
    document.querySelectorAll('[data-palette]').forEach(el => paletteObserver.observe(el));
    ```
  - Track `currentPaletteIndex`, `targetPaletteIndex`, `transitionStartTime`, `TRANSITION_DURATION = 1500` (ms)
- Expected outcome: As user scrolls, `targetPaletteIndex` updates to the active section's palette

#### Step 4: Implement smooth palette interpolation
- File: `public/js/scene-init.js`
- What to do:
  - In the animation loop, each frame:
    ```js
    function updatePaletteUniforms() {
      const elapsed = performance.now() - transitionStartTime;
      const t = Math.min(elapsed / TRANSITION_DURATION, 1.0);
      // Smoothstep easing
      const eased = t * t * (3 - 2 * t);

      const current = PALETTES[currentPaletteIndex];
      const target = PALETTES[targetPaletteIndex];

      // Lerp each property
      const lerped = {
        hueShift: lerp(current.hueShift, target.hueShift, eased),
        saturation: lerp(current.saturation, target.saturation, eased),
        warmth: lerp(current.warmth, target.warmth, eased),
        tintR: lerp(current.tint.r, target.tint.r, eased),
        tintG: lerp(current.tint.g, target.tint.g, eased),
        tintB: lerp(current.tint.b, target.tint.b, eased),
        contrast: lerp(current.contrast, target.contrast, eased)
      };

      // Update shader uniforms
      if (vgShaderMaterial) {
        vgShaderMaterial.uniforms.uHueShift.value = lerped.hueShift;
        vgShaderMaterial.uniforms.uSaturation.value = lerped.saturation;
        vgShaderMaterial.uniforms.uWarmth.value = lerped.warmth;
        vgShaderMaterial.uniforms.uTint.value.set(lerped.tintR, lerped.tintG, lerped.tintB);
        vgShaderMaterial.uniforms.uContrast.value = lerped.contrast;
      }

      // When transition completes, update currentPaletteIndex
      if (t >= 1.0 && currentPaletteIndex !== targetPaletteIndex) {
        currentPaletteIndex = targetPaletteIndex;
      }
    }
    ```
- Expected outcome: Smooth, eased transitions between palettes over 1.5 seconds

#### Step 5: Modify the post-processing shader
- File: `public/js/scene-init.js` (shader code within the JS file)
- What to do:
  - Add new uniforms to the existing Van Gogh shader:
    ```glsl
    uniform float uHueShift;
    uniform float uSaturation;
    uniform float uWarmth;
    uniform vec3 uTint;
    uniform float uContrast;
    ```
  - In the fragment shader, after the existing Van Gogh effect, apply:
    ```glsl
    // Hue shift
    vec3 hsl = rgb2hsv(color.rgb);
    hsl.x = fract(hsl.x + uHueShift);
    hsl.y = clamp(hsl.y * uSaturation, 0.0, 1.0);
    color.rgb = hsv2rgb(hsl);

    // Warmth (shift toward orange/blue)
    color.r += uWarmth * 0.05;
    color.b -= uWarmth * 0.05;

    // Tint overlay (subtle multiply)
    color.rgb = mix(color.rgb, color.rgb * (1.0 + uTint), 0.15);

    // Contrast
    color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
    ```
  - Include `rgb2hsv` and `hsv2rgb` helper functions (standard GLSL implementations)
  - Initialize all new uniforms with default values matching the first palette (Starry Night)
- Expected outcome: Shader responds to uniform changes with visible but subtle color shifts

#### Step 6: Mobile adaptation
- File: `public/js/scene-init.js`
- What to do:
  - On mobile, the post-processing shader is already skipped (per existing code)
  - Instead, apply palette transitions via CSS on the `<body>` or overlay element:
    ```js
    if (isMobile) {
      // Apply a subtle CSS filter overlay instead of shader
      const palette = PALETTES[currentPaletteIndex];
      document.documentElement.style.setProperty('--palette-warmth', palette.warmth);
      document.documentElement.style.setProperty('--palette-saturation', palette.saturation);
    }
    ```
  - Add CSS variables to `BaseLayout.astro`:
    ```css
    :root {
      --palette-warmth: 0;
      --palette-saturation: 1;
    }
    .scene-container {
      filter: saturate(calc(var(--palette-saturation))) sepia(calc(var(--palette-warmth) * 0.1));
      transition: filter 1.5s ease;
    }
    ```
- Expected outcome: Mobile gets CSS-based palette transitions instead of shader-based

### 3.3 Mobile Considerations

- Viewport < 768px: Use CSS `filter` transitions instead of GLSL shader uniforms (post-processing already disabled on mobile)
- The CSS `filter` approach uses `saturate()` and `sepia()` which are GPU-accelerated and cheap
- Transition duration remains 1.5s on mobile
- `IntersectionObserver` works identically on mobile — no changes needed
- Performance budget: CSS filter transitions are compositor-only, near-zero GPU cost

### 3.4 Data Structures

```json
{
  "palette": {
    "hueShift": 0.0,
    "saturation": 1.1,
    "warmth": 0.0,
    "tint": { "r": 0.15, "g": 0.2, "b": 0.4 },
    "contrast": 1.05
  },
  "transition": {
    "currentIndex": 0,
    "targetIndex": 0,
    "startTime": 0,
    "duration": 1500,
    "easing": "smoothstep"
  },
  "config": {
    "observerThreshold": 0.5,
    "observerRootMargin": "-10% 0px -10% 0px",
    "mobileUsesCSS": true
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| All 5 palettes have valid properties | `tests/palette/validation.test.js` | Each palette has hueShift, saturation, warmth, tint (r/g/b), contrast |
| Palette lerp produces intermediate values | `tests/palette/interpolation.test.js` | `lerpPalette(p0, p1, 0.5)` returns values between p0 and p1 |
| Smoothstep easing is monotonic | `tests/palette/easing.test.js` | `smoothstep(0)=0`, `smoothstep(1)=1`, values increase monotonically |
| IntersectionObserver fires on scroll | `tests/palette/observer.test.js` | After scrolling to section, targetPaletteIndex updates |
| Shader uniforms update each frame | `tests/palette/shader.test.js` | After updatePaletteUniforms(), uSaturation matches expected value |
| CSS variables set on mobile | `tests/palette/mobile.test.js` | On mobile viewport, --palette-saturation CSS variable updates |
| Transition completes within duration | `tests/palette/timing.test.js` | After 1500ms, currentPaletteIndex equals targetPaletteIndex |
| rgb2hsv and hsv2rgb are inverses | `tests/palette/color.test.js` | `hsv2rgb(rgb2hsv(c)) ≈ c` for test colors |

### 4.2 Green Phase — Implementation

- Add palette definitions and interpolation logic to `scene-init.js`
- Modify the post-processing shader with new uniforms and color transformation code
- Add `data-palette` attributes to sections in `index.astro`
- Add CSS variables and filter rules to `BaseLayout.astro`
- Verify palette transitions occur when scrolling between sections
- Verify mobile CSS transitions work

### 4.3 Refactor Phase — Optimization

- Cache the `rgb2hsv`/`hsv2rgb` functions outside the shader (they're per-pixel, can't be moved, but ensure they're not redefined)
- Use `uniformsNeedUpdate = true` only when values change, not every frame
- Consider reducing palette transition duration to 1.0s if 1.5s feels sluggish
- Profile the shader: ensure the added hue shift + saturation + warmth + contrast operations don't push fragment shader time above 2ms
- If the CSS filter approach on mobile causes repaints, switch to a semi-transparent overlay div with `mix-blend-mode: multiply`

---

## 5. Acceptance Criteria

- [ ] 5 distinct color palettes defined, each inspired by a Van Gogh painting
- [ ] Palette transitions trigger when scrolling to a new section (IntersectionObserver, 50% threshold)
- [ ] Transitions complete over 1.5 seconds with smoothstep easing
- [ ] Post-processing shader applies hue shift, saturation, warmth, tint, and contrast uniforms
- [ ] Mobile uses CSS filter transitions instead of shader uniforms
- [ ] Transitions are subtle — colors shift but content remains readable
- [ ] No abrupt color changes (all transitions are interpolated)
- [ ] Shader uniforms initialize with Starry Night palette (index 0) on page load
- [ ] No frame rate drops below 55fps on desktop, 30fps on mobile
- [ ] All unit tests pass

---

## 6. Dependencies & Risks

**Dependencies:**
- The existing Van Gogh post-processing shader must be present in `scene-init.js`
- `index.astro` must have identifiable section elements to attach `data-palette` attributes to
- The animation loop must be running to update uniforms each frame
- `IntersectionObserver` is available in all target browsers (IE11 not supported — acceptable)

**Risks:**
- **Shader complexity:** Adding hue shift + saturation + warmth + tint + contrast increases fragment shader instruction count. Mitigation: profile on target hardware; if too expensive, drop the warmth and contrast operations (least visible)
- **Color banding:** Hue shifts on low-quality displays may cause banding. Mitigation: add a small amount of dithering noise in the shader (reuse existing noise function)
- **Scroll jitter:** Rapid scrolling could cause palette index to bounce between sections. Mitigation: the `threshold: 0.5` and `rootMargin` settings prevent this; also, transitions are smooth so bouncing would just blend
- **CSS filter on mobile:** `sepia()` and `saturate()` may not match the shader look exactly. Mitigation: this is acceptable — mobile is a degraded experience by design
- **Palette definitions need tuning:** The initial palette values (hueShift, saturation, etc.) are estimates. Mitigation: mark them as `// TUNE` constants and iterate after visual testing

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Scroll-driven color palette transitions — smooth shader interpolation between 5 Van Gogh painting palettes",
  "changes": [
    "Added 5 palette configurations (Starry Night, Sunflowers, Midnight Wave, Tulip Garden, Moonlit Silver)",
    "IntersectionObserver detects active section and triggers palette transition",
    "Smoothstep interpolation over 1.5 seconds between palettes",
    "Post-processing shader extended with hueShift, saturation, warmth, tint, contrast uniforms",
    "rgb2hsv/hsv2rgb color space conversion in GLSL",
    "Mobile fallback: CSS filter transitions (saturate + sepia) on .scene-container",
    "data-palette attributes on section elements in index.astro"
  ]
}
```
