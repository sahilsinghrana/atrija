# PRD: Interactive Starry Night Painting Explorer

> **ID:** idea-033
> **Category:** Interactivity
> **Priority:** high
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-20

---

## 1. Overview

**One-liner:** A zoomable, interactive deep-dive into The Starry Night where visitors click on painted elements — the cypress, village, stars, moon, and hills — to learn about Van Gogh's techniques, symbolism, and the story behind each brushstroke.

**Problem:** The site already showcases Van Gogh's paintings in a gallery (idea-021) and has a scroll-driven painting reveal (idea-028), but neither lets visitors *explore* a single painting in depth. The Starry Night is the most iconic painting associated with the site's aesthetic, yet visitors can't interact with it beyond passive viewing. There's an educational gap: people see the swirls and stars but don't know what they mean.

**Solution:** Add a new "Explore the Painting" section between the painting reveal and the gallery. It displays a high-resolution image of The Starry Night (loaded progressively from Wikimedia Commons) with invisible clickable hotspot zones over key elements. Clicking a hotspot opens a side panel with: the element's name, a 2-3 sentence explanation of its significance, the technique Van Gogh used, and a relevant quote. The image supports pinch-to-zoom (mobile) and scroll-to-zoom (desktop). All content is driven by a JSON data file for easy updates.

---

## 2. User Stories

- As a visitor, I want to click on parts of The Starry Night to learn what they represent so I can appreciate the painting more deeply.
- As a visitor, I want to zoom into the painting to see brushstroke details so I can experience the texture of the work.
- As a visitor, I want the explanations to be concise and insightful so I'm not overwhelmed with art history.
- As a visitor on mobile, I want to tap hotspots and pinch-to-zoom so the experience works on touch devices.
- As a visitor, I want the painting to load progressively so I'm not waiting for a large image.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `src/content/painting-explorer.json` — Hotspot data and element descriptions
- **New file:** `src/components/PaintingExplorer.astro` — Astro component for the interactive section
- **New file:** `public/js/painting-explorer.js` — Client-side interactivity (hotspots, zoom, panel)
- **Modified file:** `src/pages/index.astro` — Import and render the PaintingExplorer component
- **No Three.js changes** — this is a pure HTML/CSS/JS overlay on a 2D image
- **No changes to:** `scene-init.js`, `siteData.json`, `content.json`

### 3.2 Implementation Details

#### Step 1: Create the painting-explorer.json data file
- File: `src/content/painting-explorer.json`
- What to do:
  - Define an array of hotspot objects, each with:
    - `id`: unique identifier (e.g., `"cypress"`, `"moon"`, `"village"`)
    - `label`: display name (e.g., "The Dark Cypress")
    - `x`, `y`: percentage position on the image (0-100)
    - `radius`: clickable radius in percentage of image width
    - `description`: 2-3 sentences about the element's significance
    - `technique`: the painting technique used (e.g., "Impasto with directional brushstrokes")
    - `quote`: a relevant Van Gogh quote about this element
  - Target 8-12 hotspots covering: the cypress, the moon, the largest star, the village, the rolling hills, the sky swirls, the church spire, the tree line
  - Example:
    ```json
    {
      "hotspots": [
        {
          "id": "cypress",
          "label": "The Dark Cypress",
          "x": 15, "y": 55, "radius": 8,
          "description": "The towering cypress tree dominates the foreground, reaching into the sky like a dark flame. Van Gogh painted cypresses repeatedly in Saint-Rémy, fascinated by their shape and what he called 'beautiful as an Egyptian obelisk.'",
          "technique": "Thick impasto with upward-sweeping strokes, using viridian green mixed with black",
          "quote": "The cypresses are always occupying my thoughts. I should like to make something of them like the canvases of the sunflowers."
        }
      ]
    }
    ```
- Expected outcome: A rich dataset of 8-12 interactive hotspots

#### Step 2: Create the PaintingExplorer.astro component
- File: `src/components/PaintingExplorer.astro`
- What to do:
  - Import `painting-explorer.json`
  - Render a section with:
    - Section heading: `<h2>Explore <em>The Starry Night</em></h2>`
    - A container div (`position: relative`) holding:
      - The painting image (`<img>` with `loading="lazy"`, `srcset` for responsive sizes, Wikimedia Commons URL)
      - Hotspot buttons (`<button>` elements, absolutely positioned at `x/y`%, styled as subtle pulsing dots with `aria-label`)
    - A side panel (`<aside>`) that slides in when a hotspot is clicked:
      - Element name (large, `--accent-gold`)
      - Description paragraph
      - Technique badge (small, `--text-tertiary`, monospace font)
      - Quote block (italic, `--font-serif`)
      - Close button
    - A zoom controls bar: zoom in/out buttons + reset button
  - Use CSS custom properties from the site's design tokens
  - The image uses `object-fit: contain` and scales within a max-height of 80vh
  - Hotspots have a subtle pulsing ring animation (CSS `@keyframes`) to draw attention without being distracting
- Expected outcome: A visually consistent interactive painting section

#### Step 3: Add the PaintingExplorer to index.astro
- File: `src/pages/index.astro`
  - Import: `import PaintingExplorer from '../components/PaintingExplorer.astro';`
  - Place it after the painting reveal section and before the Gallery component
  - Wrap in a `<section id="painting-explorer">` with appropriate spacing
- Expected outcome: The explorer appears in the correct position on the page

#### Step 4: Add client-side interactivity
- File: `public/js/painting-explorer.js`
- What to do:
  - On `DOMContentLoaded`:
    1. Find all hotspot buttons
    2. On click/tap: show the side panel with the corresponding hotspot data (from `data-*` attributes or a client-side JSON import)
    3. Zoom: track a `scale` state (1.0–3.0), apply `transform: scale()` to the image container
    4. On desktop: mouse wheel zooms in/out (centered on cursor position)
    5. On mobile: pinch gesture zooms (use `touchstart`/`touchend` with two-finger distance calculation)
    6. Pan: when zoomed in, click+drag to pan the image
    7. Close panel: clicking outside the panel or pressing Escape closes it
    8. Keyboard: Tab navigates between hotspots, Enter activates
  - Respect `prefers-reduced-motion`: disable hotspot pulsing animation
  - Progressive image loading: start with a low-res placeholder, swap to high-res when loaded
- Expected outcome: Smooth, accessible, touch-friendly painting exploration

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Hotspot buttons: 44×44px minimum touch target (larger than the visual dot)
  - Side panel: full-screen overlay instead of side slide-in
  - Zoom: pinch-to-zoom only (no mouse wheel)
  - Pan: single-finger drag when zoomed in
  - Image: max-height 60vh to leave room for the panel
- Performance budget: One high-res image (Wikimedia Commons provides responsive `srcset`). Hotspot buttons are plain DOM elements (no canvas). Max 12 hotspots.

### 3.4 Data Structures

```json
{
  "painting": {
    "title": "The Starry Night",
    "year": 1889,
    "image": {
      "small": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/600px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      "medium": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      "large": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/2560px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
    },
    "hotspots": [
      {
        "id": "cypress",
        "label": "The Dark Cypress",
        "x": 15, "y": 55, "radius": 8,
        "description": "The towering cypress tree dominates the foreground...",
        "technique": "Thick impasto with upward-sweeping strokes",
        "quote": "The cypresses are always occupying my thoughts..."
      }
    ]
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Hotspot data file is valid | `tests/painting-explorer.test.js` | `JSON.parse(data)` succeeds and `.hotspots` array has ≥ 8 entries |
| Hotspots render at correct positions | `tests/painting-explorer.test.js` | Each hotspot button has correct `left` and `top` percentage styles |
| Clicking hotspot opens panel | `tests/painting-explorer.test.js` | After click, panel is visible and shows correct hotspot label |
| Zoom in increases scale | `tests/painting-explorer.test.js` | After zoom-in click, image container has `transform: scale(N)` where N > 1 |
| Escape closes panel | `tests/painting-explorer.test.js` | After `Escape` keydown, panel is hidden |
| Mobile touch targets are ≥ 44px | `tests/painting-explorer.test.js` | All hotspot buttons have `offsetWidth >= 44` and `offsetHeight >= 44` |
| Keyboard navigation works | `tests/painting-explorer.test.js` | Tab key moves focus between hotspot buttons |

### 4.2 Green Phase — Implementation

- Create `painting-explorer.json` with 8-12 hotspots
- Create `PaintingExplorer.astro` component
- Add to `index.astro`
- Create `painting-explorer.js` for interactivity
- Verify all 7 tests pass

### 4.3 Refactor Phase — Optimization

- Add a "tour" mode that auto-highlights each hotspot in sequence with a 5-second delay
- Preload the high-res image after page load completes
- Add a mini-map overlay showing current viewport position when zoomed in

---

## 5. Acceptance Criteria

- [ ] Painting explorer section appears on the page with The Starry Night image
- [ ] 8-12 clickable hotspot dots are visible on the painting
- [ ] Clicking a hotspot opens a panel with element name, description, technique, and quote
- [ ] Zoom in/out/reset controls work on desktop (scroll wheel) and mobile (pinch)
- [ ] Panning works when zoomed in (drag on desktop, single-finger on mobile)
- [ ] Side panel closes on Escape key or clicking outside
- [ ] Hotspot pulsing animation respects `prefers-reduced-motion`
- [ ] All hotspot touch targets are ≥ 44×44px on mobile
- [ ] Image loads progressively (low-res → high-res)
- [ ] All 7 unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- Wikimedia Commons image URLs (same pattern as the existing gallery component)
- `index.astro` must import the new component

**Risks:**
- **Image hotlinking:** Same risk as gallery. Mitigation: use the same image loading pattern as the existing Gallery component (which already handles this).
- **Hotspot positioning accuracy:** Percentage-based positions may shift with different aspect ratios. Mitigation: use a fixed-aspect-ratio container for the image.
- **Zoom performance on low-end devices:** CSS `transform: scale()` is GPU-accelerated and generally fast, but very large images could cause jank. Mitigation: cap zoom at 3x, use `will-change: transform` on the image container.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Interactive Starry Night painting explorer — clickable hotspots with technique and symbolism",
  "changes": [
    "Added src/content/painting-explorer.json with 8-12 hotspot definitions",
    "Created src/components/PaintingExplorer.astro component",
    "Added painting explorer section to index.astro",
    "Added public/js/painting-explorer.js for hotspots, zoom, and pan",
    "Progressive image loading from Wikimedia Commons",
    "Pinch-to-zoom and pan on mobile",
    "Keyboard accessible with Tab/Enter/Escape navigation",
    "Respects prefers-reduced-motion"
  ]
}
```

---

## Reviewer Notes (2026-05-20)

**Quality Check**: Well-structured PRD with good technical spec. The hotspot approach is clean and the progressive image loading is smart. Test plan covers key interactions.

**Priority Adjustment**: Changed from high → medium. This is a content/education feature, not a core visual or performance feature. It's valuable but should not take priority over 3D scene improvements or performance work.

**Design Alignment**: Excellent fit — deep-diving into The Starry Night's symbolism directly serves the site's educational mission. The hotspot panel approach keeps the painting itself unobstructed.

**Feasibility**: No scene-init.js changes needed — this is a pure Astro component + vanilla JS. Low risk, high value. The zoom/pan implementation should use CSS transforms (GPU-accelerated) rather than canvas manipulation.

**Scope Note**: This PRD overlaps conceptually with idea-021 (Painting Gallery Carousel) and idea-028 (Scroll-Driven Painting Reveal). Consider implementing all three as a unified "Van Gogh Art" section to avoid content fragmentation.

## Implementation Review (2026-05-20 06:00 UTC)

**Status: NOT IMPLEMENTED** — Moved from "done" back to "red".

**Findings:**
- The commit `faed742` only updated kanban.json, PRD files, and changelog entries.
- No actual implementation files were created:
  - `src/components/PaintingExplorer.astro` — MISSING
  - `src/content/painting-explorer.json` — MISSING
  - `public/js/painting-explorer.js` — MISSING
- `src/pages/index.astro` does NOT import or render the PaintingExplorer component.
- The changelog entries reference the component but it doesn't exist.
- This appears to be a case where the background-implement cron updated the kanban status without actually writing the code.

**Required to complete:**
1. Create `src/content/painting-explorer.json` with 8-12 hotspot definitions
2. Create `src/components/PaintingExplorer.astro` with hotspot rendering and side panel
3. Add the component to `src/pages/index.astro`
4. Create `public/js/painting-explorer.js` for zoom/pan/hotspot interactivity
5. Write and pass the 7 unit tests from the PRD test plan
6. Run `npm run build` and verify success
7. Deploy and verify site returns 200