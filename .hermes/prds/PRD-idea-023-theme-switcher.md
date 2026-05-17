# PRD: Theme Color Scheme Switcher

> **ID:** idea-023
> **Category:** UI
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-18

---

## 1. Overview

**One-liner:** A floating theme picker that lets visitors manually switch between the 5 impressionist color schemes (starry-night, sunflower, midnight-wave, tulip-garden, moonlit-silver).

**Problem:** Currently, the color scheme is determined by daily rotation (`dayOfYear % 5`). Visitors who prefer a specific palette have no way to choose it, and the daily change can feel arbitrary rather than intentional.

**Solution:** Add a compact, non-intrusive theme switcher UI element (floating button + dropdown panel) in the bottom-right corner. The visitor's choice is persisted in `localStorage` and overrides the daily rotation. A "reset to daily" option restores automatic rotation.

---

## 2. User Stories

- As a visitor, I want to pick my favorite color scheme so that I can enjoy the site in the palette I prefer.
- As a visitor, I want my theme choice to persist across page loads so I don't have to re-select it.
- As a visitor, I want to reset to the automatic daily rotation so I can experience the intended variety.
- As a visitor, I want the theme switcher to be unobtrusive so it doesn't distract from the artwork.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/theme-switcher.js` — Standalone module, loaded via `<script>` tag in `BaseLayout.astro`
- **Modified file:** `src/layouts/BaseLayout.astro` — Add the theme switcher `<div>` container and `<script>` import
- **Modified file:** `src/pages/index.astro` — Read the initial theme from `siteData.json` color schemes; the JS module handles runtime switching
- **Existing dependency:** `siteData.json` color schemes array (5 schemes with `.name`, `.colors` fields)
- **No Three.js changes** — this only affects CSS custom properties on `:root`

### 3.2 Implementation Details

#### Step 1: Create the theme-switcher.js module
- File: `public/js/theme-switcher.js`
- What to do:
  - Define the 5 theme options matching `siteData.json` color scheme names: `starry-night`, `sunflower`, `midnight-wave`, `tulip-garden`, `moonlit-silver`
  - Each theme maps to a set of CSS custom property overrides:
    - `--bg`, `--text-primary`, `--text-secondary`, `--text-tertiary`
    - `--accent-gold`, `--accent-blue`, `--accent-coral`, `--accent-violet`, `--sage`
  - On `DOMContentLoaded`:
    1. Check `localStorage.getItem('van-gogh-theme')`
    2. If a saved theme exists, apply it immediately (before first paint — use `document.documentElement.style.setProperty`)
    3. If no saved theme, do nothing (daily rotation from build is used)
  - Create a floating button (bottom-right, `position: fixed`, `z-index: 100`):
    - Icon: 🎨 (palette emoji) or a small SVG palette icon
    - Size: 44×44px (mobile tap target)
    - Style: semi-transparent dark background, rounded, subtle border matching `--accent-gold`
  - On click, toggle a dropdown panel showing:
    - 5 color swatch buttons (small circles with the theme's primary accent color)
    - Theme name label on hover/focus
    - A "🔄 Daily" button at the bottom to clear localStorage and revert to daily rotation
  - On theme selection:
    1. Apply all CSS custom properties to `document.documentElement`
    2. Save choice to `localStorage.setItem('van-gogh-theme', themeName)`
    3. Close the dropdown
    4. Dispatch a custom event `theme-changed` with `{ themeName }` detail (for any listeners)
  - On "Daily" selection:
    1. Remove all inline custom property overrides (remove `style` attribute from `:root`)
    2. `localStorage.removeItem('van-gogh-theme')`
    3. Close the dropdown
- Expected outcome: A working theme switcher that persists across reloads

#### Step 2: Add the switcher container to BaseLayout.astro
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add a `<div id="theme-switcher"></div>` inside the `<body>`, after the main content but before other floating elements (flute button, etc.)
  - Add `<script type="module" src="/js/theme-switcher.js"></script>` at the end of `<body>`
  - Ensure the container `div` is positioned by the JS module (the module creates its own floating button inside this container)
- Expected outcome: The theme switcher loads on every page

#### Step 3: Define the CSS color mappings
- File: `public/js/theme-switcher.js` (same file, top of module)
- What to do:
  - Define a `THEME_COLORS` constant mapping each theme name to its CSS variable values.
  - These should match the color schemes already defined in `siteData.json`:
    ```js
    const THEME_COLORS = {
      'starry-night': {
        '--bg': '#08080f',
        '--text-primary': '#f0e6d3',
        '--text-secondary': '#c9b896',
        '--text-tertiary': '#8a7e6b',
        '--accent-gold': '#d4a843',
        '--accent-blue': '#5b7fa5',
        '--accent-coral': '#c97b5a',
        '--accent-violet': '#8b6f9b',
        '--sage': '#7a8b6f'
      },
      'sunflower': {
        '--bg': '#0f0d08',
        '--text-primary': '#f5e6c8',
        '--text-secondary': '#d4b87a',
        '--text-tertiary': '#9a8a5e',
        '--accent-gold': '#e8b830',
        '--accent-blue': '#4a6a8a',
        '--accent-coral': '#d4884a',
        '--accent-violet': '#9b7ab0',
        '--sage': '#8a9b5a'
      },
      // ... midnight-wave, tulip-garden, moonlit-silver with appropriate warm/cool palettes
    };
    ```
- Expected outcome: Each theme has a complete set of CSS variable overrides

#### Step 4: Add CSS for the switcher UI
- File: `public/js/theme-switcher.js` (inject styles via JS) OR add to existing CSS
- What to do:
  - Inject a `<style>` tag from JS with:
    - `#theme-switcher` container positioning
    - `.ts-button` styles (floating button)
    - `.ts-panel` styles (dropdown panel, hidden by default, fade-in animation)
    - `.ts-swatch` styles (color circles, 32px, border on selected)
    - `.ts-daily-btn` styles (reset button)
    - `prefers-reduced-motion` support: disable animations
  - Panel should use `display: none` → `display: block` with `opacity` transition (100ms)
- Expected outcome: Polished, accessible switcher UI

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Move the floating button to bottom-right but offset 16px from edges (avoid overlapping flute button which is bottom-left)
  - Swatch buttons should be at least 44×44px tap targets
  - Panel opens upward instead of upward-right
- Performance budget: negligible — only CSS custom property changes, no layout thrashing
- The switcher should not appear on the loading screen (wait for `DOMContentLoaded`)

### 3.4 Data Structures

```json
{
  "themeName": "starry-night",
  "colors": {
    "--bg": "#08080f",
    "--text-primary": "#f0e6d3",
    "--text-secondary": "#c9b896",
    "--text-tertiary": "#8a7e6b",
    "--accent-gold": "#d4a843",
    "--accent-blue": "#5b7fa5",
    "--accent-coral": "#c97b5a",
    "--accent-violet": "#8b6f9b",
    "--sage": "#7a8b6f"
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Theme switcher button exists | `tests/theme-switcher.test.js` | `document.querySelector('#theme-switcher .ts-button')` is truthy |
| Clicking button opens panel | `tests/theme-switcher.test.js` | Panel has `display: block` after click |
| Selecting a theme applies CSS vars | `tests/theme-switcher.test.js` | `getComputedStyle(document.documentElement).getPropertyValue('--bg')` matches selected theme |
| Theme persists in localStorage | `tests/theme-switcher.test.js` | `localStorage.getItem('van-gogh-theme')` equals selected theme name |
| Daily button clears override | `tests/theme-switcher.test.js` | After clicking Daily, `localStorage.getItem('van-gogh-theme')` is null and inline styles are removed |
| Theme-changed event fires | `tests/theme-switcher.test.js` | Custom event `theme-changed` dispatched with correct `themeName` in detail |

### 4.2 Green Phase — Implementation

- Implement `theme-switcher.js` with all 5 themes, localStorage read/write, panel toggle, and event dispatch
- Add container div and script tag to `BaseLayout.astro`
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Extract color mappings to a shared JSON file if both `siteData.json` and `theme-switcher.js` need them
- Add keyboard navigation (Tab through swatches, Enter to select, Escape to close panel)
- Add ARIA attributes for accessibility (`role="listbox"`, `aria-selected`, `aria-label`)

---

## 5. Acceptance Criteria

- [ ] Floating palette button appears in bottom-right corner on all pages
- [ ] Clicking the button opens a dropdown with 5 color swatches and a "Daily" option
- [ ] Selecting a theme immediately updates the site's color scheme
- [ ] Theme choice persists across page reloads via localStorage
- [ ] Clicking "Daily" removes the override and restores the build-time daily rotation
- [ ] Works on mobile with appropriate tap target sizes (44px minimum)
- [ ] Respects `prefers-reduced-motion` (no animations)
- [ ] All 6 unit tests pass
- [ ] No console errors on any page load

---

## 6. Dependencies & Risks

**Dependencies:**
- `siteData.json` must have the 5 color schemes with consistent naming
- `BaseLayout.astro` must have a `<body>` tag where we can inject the container

**Risks:**
- **Flash of unstyled content (FOUC):** If JS loads slowly, the daily theme flashes before the saved theme applies. Mitigation: apply the saved theme synchronously in a `<script>` block in `<head>` that reads localStorage and sets inline styles before first paint.
- **Theme color accuracy:** The JS color mappings must exactly match the Astro-built CSS. Mitigation: derive the mappings from the same `siteData.json` source at build time, or document the exact hex values.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Theme color scheme switcher — visitors can pick from 5 impressionist palettes",
  "changes": [
    "Added public/js/theme-switcher.js module",
    "Added theme switcher container to BaseLayout.astro",
    "localStorage persistence for theme selection",
    "Daily rotation reset option",
    "Custom theme-changed event for extensibility"
  ]
}
```
