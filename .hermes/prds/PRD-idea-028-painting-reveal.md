# PRD: Scroll-Driven Painting Reveal

> **ID:** idea-028
> **Category:** Interactivity
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-19

---

## 1. Overview

**One-liner:** A large Van Gogh painting fades into view as the user scrolls, with the brushstroke texture appearing progressively from top to bottom, as if being painted in real-time.

**Problem:** The site references Van Gogh's paintings in the content sections but doesn't showcase any actual artwork visually. The painting gallery (idea-021) is a backlog carousel concept, but a more dramatic approach would be to reveal a famous painting as part of the scroll experience itself.

** Solution:** Add a full-viewport "painting reveal" section between two content sections. A high-resolution Van Gogh painting (loaded from Wikimedia Commons) is displayed with a custom Three.js shader mask that progressively reveals it based on scroll position. The reveal effect simulates brushstrokes appearing: the image is divided into horizontal bands that fade in sequentially, with slight randomization to avoid a mechanical look. The painting is displayed in a 3D plane within the scene, positioned behind the main content, creating a parallax depth effect.

---

## 2. User Stories

- As a visitor, I want to see a famous Van Gogh painting revealed as I scroll so I feel a sense of discovery.
- As a visitor, I want the reveal to feel organic and painterly (not a simple fade) so it matches the impressionist theme.
- As a visitor, I want the painting to be visible through/behind the content sections so it adds depth to the scene.
- As a visitor, I want the painting to load progressively so it doesn't block the initial page load.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/painting-reveal.js` — Standalone module for the painting reveal effect
- **Modified file:** `public/js/scene-init.js` — Add a `THREE.PlaneGeometry` for the painting in the 3D scene, with scroll-driven uniform updates
- **Modified file:** `src/pages/index.astro` — Add a `<section id="painting-reveal">` anchor element for scroll detection
- **No server-side rendering of the painting** — image is loaded client-side from Wikimedia Commons CDN
- **Integrates with:** existing scroll parallax system (`scrollState.current`), existing `isMobile` detection

### 3.2 Implementation Details

#### Step 1: Create the painting plane in the 3D scene
- File: `public/js/scene-init.js` (add in `createPaintingReveal()` function)
- What to do:
  - Create a `THREE.PlaneGeometry(14, 10, 1, 20)` — wide plane, 20 vertical segments for the reveal effect
  - Position: `(0, 1.5, -15)` — behind the main scene, visible through the content
  - Rotation: `(0, 0, 0)` — facing the camera directly
  - Load texture: `new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg')`
    - Use `texture.colorSpace = THREE.SRGBColorSpace` for correct colors
    - Set `texture.minFilter = THREE.LinearFilter` (no mipmaps needed for a plane always facing camera)
  - Custom shader material (see Step 2)
  - Add to scene: `scene.add(plane); scene.userData._paintingPlane = plane;`
- Expected outcome: A textured plane in the 3D scene, initially fully masked

#### Step 2: Create the reveal shader
- File: `public/js/scene-init.js` (shader code, near other shader definitions)
- What to do:
  - Vertex shader (`paintingRevealVS`):
    - Pass `vUv` to fragment shader
    - Pass `vPosition` (world position Y) for the reveal calculation
  - Fragment shader (`paintingRevealFS`):
    - Uniforms: `uTexture` (sampler2D), `uRevealProgress` (float, 0.0 to 1.0), `uTime` (float)
    - Reveal calculation:
      ```
      float band = floor(vUv.y * 20.0);  // 20 horizontal bands
      float bandThreshold = (band + 1.0) / 20.0;
      float noiseOffset = sin(vUv.x * 50.0 + band * 3.7) * 0.03; // slight horizontal variation
      float reveal = smoothstep(bandThreshold + noiseOffset - 0.05, bandThreshold + noiseOffset, uRevealProgress);
      ```
    - Sample texture: `vec4 texColor = texture2D(uTexture, vUv);`
    - Apply reveal: `gl_FragColor = vec4(texColor.rgb, texColor.a * reveal);`
    - When `uRevealProgress >= 1.0`, skip the shader and just show the texture (optimization)
  - Material: `ShaderMaterial` with `transparent: true`, `depthWrite: false`
- Expected outcome: Painting reveals band-by-band based on `uRevealProgress`

#### Step 3: Connect scroll position to reveal progress
- File: `public/js/scene-init.js` (in the `VanGoghScene.animate()` method)
- What to do:
  - Find the painting reveal section: `document.getElementById('painting-reveal')`
  - Calculate reveal progress based on section's position relative to viewport:
    ```
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    // Reveal starts when section top enters viewport, completes when section bottom leaves
    const revealStart = viewportHeight;
    const revealEnd = -sectionHeight;
    const rawProgress = (revealStart - sectionTop) / (revealStart - revealEnd);
    const revealProgress = Math.max(0, Math.min(1, rawProgress));
    ```
  - Update uniform: `scene.userData._paintingPlane.material.uniforms.uRevealProgress.value = revealProgress`
  - Smooth the progress: `revealProgress = revealProgress * revealProgress * (3 - 2 * revealProgress)` (smoothstep)
- Expected outcome: Painting reveals smoothly as user scrolls past the section

#### Step 4: Add the section anchor to index.astro
- File: `src/pages/index.astro`
- What to do:
  - Add `<section id="painting-reveal" class="painting-reveal-section"></section>` between two content sections (e.g., after the Philosophy section, before the Gita section)
  - The section should be `height: 150vh` (tall enough to drive the full reveal)
  - Add minimal CSS: `.painting-reveal-section { position: relative; height: 150vh; }`
  - The section is mostly empty — the painting is rendered in the 3D plane behind it
  - Add a small caption at the bottom: `<p class="painting-caption">The Starry Night, 1889 — Oil on canvas</p>`
- Expected outcome: A scroll anchor that drives the reveal progress

#### Step 5: Handle image loading gracefully
- File: `public/js/scene-init.js`
- What to do:
  - Show a dark placeholder (matching the sky color) while the image loads
  - Use `TextureLoader.load(url, onLoad, onProgress, onError)` callbacks:
    - `onLogad`: enable the plane's visibility
    - `onError`: log a warning, keep the plane hidden (graceful degradation)
  - Set `plane.visible = false` initially, set to `true` on texture load
  - Add a 500ms delay before starting the reveal (allows texture to decode)
- Expected outcome: No broken image icon; graceful fallback if Wikimedia is unreachable

### 3.3 Mobile Considerations

- On mobile:
  - Use a smaller image: `/800px-` instead of `/1280px-` (Wikimedia supports URL-based resizing)
  - Reduce plane geometry segments from 20 to 10 (fewer bands, less fragment shader work)
  - Reduce plane size: `PlaneGeometry(10, 7)` to fit mobile viewport
  - Section height: `120vh` instead of `150vh` (less scrolling needed)
- Performance budget:
  - Texture: 1280×1024 JPEG ≈ 200KB download, ~3MB GPU memory
  - Shader: simple arithmetic + one texture sample per pixel — negligible on modern GPUs
  - The plane covers ~30% of the viewport at peak reveal, so fragment cost is bounded
  - On `isLowEnd`: skip the shader entirely, use a simple opacity fade (no bands)

### 3.4 Data Structures

```json
{
  "paintingReveal": {
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "title": "The Starry Night",
    "year": 1889,
    "medium": "Oil on canvas",
    "dimensions": { "width": 14, "height": 10 },
    "bands": 20,
    "sectionHeightVh": 150
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Painting plane created | `tests/painting-reveal.test.js` | `scene.userData._paintingPlane` is a `THREE.Mesh` instance |
| Plane has reveal shader | `tests/painting-reveal.test.js` | Material uniforms include `uRevealProgress` and `uTexture` |
| Reveal starts at 0 | `tests/painting-reveal.test.js` | Initial `uRevealProgress` value is 0 |
| Scroll updates reveal | `tests/painting-reveal.test.js` | After simulating scroll to section, `uRevealProgress` > 0 |
| Reveal completes | `tests/painting-reveal.test.js` | After scrolling past section, `uRevealProgress` ≈ 1.0 |
| Section anchor exists | `tests/painting-reveal.test.js` | `document.getElementById('painting-reveal')` is truthy |
| Graceful image failure | `tests/painting-reveal.test.js` | With invalid URL, plane remains visible=false, no console error |

### 4.2 Green Phase — Implementation

- Implement `createPaintingReveal()` with plane, texture, and shader
- Implement reveal progress calculation from scroll position
- Add section anchor to `index.astro`
- Verify all 7 tests pass

### 4.3 Refactor Phase — Optimization

- Add a second painting (e.g., "Sunflowers") that reveals in a later section
- Add a subtle frame/border around the painting using a slightly larger dark plane behind it
- Add a "brushstroke" noise texture overlay to the reveal bands for a more organic feel
- Preload the image with `<link rel="preload" as="image" href="...">` in the HTML head

---

## 5. Acceptance Criteria

- [ ] A large Van Gogh painting appears in the 3D scene as the user scrolls
- [ ] The painting reveals progressively from top to bottom in horizontal bands
- [ ] The reveal is driven by scroll position (not time)
- [ ] The reveal has slight horizontal variation (not a straight line)
- [ ] The painting loads from Wikimedia Commons and displays correctly
- [ ] If the image fails to load, the scene continues without errors
- [ ] Works on mobile with reduced geometry and smaller image
- [ ] The painting plane is positioned behind content (parallax depth)
- [ ] All 7 unit tests pass
- [ ] No frame rate drops below 30fps on mobile

---

## 6. Dependencies & Risks

**Dependencies:**
- Wikimedia Commons image URL (hotlinked — see risks)
- Three.js `THREE.PlaneGeometry`, `THREE.TextureLoader`, `THREE.ShaderMaterial` (already available)
- Existing scroll parallax system
- A `<section id="painting-reveal">` element in the HTML

**Risks:**
- **Image hotlinking:** Wikimedia Commons may rate-limit or block hotlinked images. Mitigation: use the Wikimedia API to verify the URL, add `onerror` fallback, or download the image to `public/images/` during build.
- **CORS:** Wikimedia Commons supports CORS for image loading, but some browsers may have issues with `texImage2D` from cross-origin images. Mitigation: set `texture.crossOrigin = 'anonymous'` on the loader.
- **Large image on slow connections:** 200KB is reasonable, but on very slow connections the texture may take seconds to load. Mitigation: show a loading state (dark plane with a subtle "Loading..." text overlay), use a smaller image on mobile.
- **Shader complexity on low-end GPUs:** The smoothstep + sin per pixel could be expensive on very weak mobile GPUs at high resolutions. Mitigation: on `isLowEnd`, use a simple opacity fade instead of the band shader.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Scroll-driven painting reveal — Van Gogh artwork progressively unveiled in 3D scene as user scrolls",
  "changes": [
    "Added createPaintingReveal() with PlaneGeometry and custom reveal shader",
    "Band-based reveal effect with horizontal variation",
    "Scroll position drives reveal progress (0 to 1)",
    "Wikimedia Commons image loaded via TextureLoader",
    "Graceful degradation on image load failure",
    "Mobile-optimized with reduced geometry and smaller image",
    "Added painting-reveal section anchor to index.astro"
  ]
}
```
