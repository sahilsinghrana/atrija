# PRD: Daily Haiku

> **ID:** idea-097
> **Category:** Content
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-06-30

---

## 1. Overview

**One-liner:** Display a daily haiku (5-7-5 syllable) in the sky as faint, floating text.

**Problem:** The site currently lacks subtle, changing textual poetry that enhances the contemplative experience without breaking visual minimalism.

**Solution:** Integrate a haiku generator that selects a haiku from a curated list based on the day of year, renders it as a three-line HTML overlay positioned in the sky, styled with low opacity and a subtle fade-in/out animation.

---

## 2. User Stories

- As a visitor, I want to see a short poetic verse appear in the sky each day so that I can pause and reflect.
- As a visitor, I want the haiku to be minimal and non-intrusive so that it does not distract from the 3D scene.

---

## 3. Technical Specification

### 3.1 Architecture

- Create a new module `public/js/daily-haiku.js` that:
  - Imports a haiku list from `src/content/haiku.json` (array of objects with `lines: [string, string, string]`).
  - Computes index based on day of year (0-364) modulo length.
  - Creates three absolutely positioned `<div>` elements (one per line) inside a container fixed to the canvas or positioned via Three.js CSS2DRenderer? Simpler: position absolute in viewport, top-center, using CSS.
  - Applies CSS: `font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: rgba(255,255,255,0.15); pointer-events: none;`.
  - Adds a gentle fade-in/out cycle (opacity animation) using CSS keyframes.
  - Updates the haiku at midnight (using `setInterval` to check date change).
- Add a new JSON file `src/content/haiku.json` with ~30 haiku entries, each line <40 characters.
- Update `index.html` (or BaseLayout.astro) to include `<script type="module" src="/js/daily-haiku.js"></script>` before body end.
- No changes to Three.js scene; purely DOM overlay.

### 3.2 Implementation Details

#### Step 1: Create haiku data file
- File: `src/content/haiku.json`
- Content:
  ```json
  [
    {"lines": ["Ancient pond whispers","A frog jumps into water—Splash! silence again",""]},
    ...
  ]
  ```
  (Each line <40 chars, total <200 chars per haiku.)

#### Step 2: Implement daily-haiku.js
- File: `public/js/daily-haiku.js`
- Logic:
  - Fetch haiku.json (or import if bundled via Vite? Since it's client-side, we can fetch).
  - Compute index: `const now = new Date(); const start = new Date(now.getFullYear(), 0, 0); const diff = (now - start) + ((timezoneOffset)*60000); const day = Math.floor(diff / 86400000);`
  - Select haiku = list[day % list.length].
  - Create container div id="daily-haiku".
  - For each line, create div class="haiku-line", set textContent.
  - Append to body.
  - Add CSS via a style block or link to existing CSS? We'll inject a style tag.
  - Add animation: `@keyframes fade { 0% {opacity:0;} 50% {opacity:0.15;} 100% {opacity:0;} }` and apply `animation: fade 30s infinite;` (or use JS to toggle opacity).
  - Optionally, make it gently drift.

#### Step 3: Integrate into base layout
- Edit `src/layouts/BaseLayout.astro` (or wherever scripts are included) to add the script tag before closing `</body>`.

### 3.3 Mobile Considerations
- On viewport < 768px, reduce font size to 1rem and opacity to 0.1 to be less intrusive.
- Ensure tap-through (pointer-events: none) so it doesn't block interaction.

### 3.4 Data Structures
```json
{
  "haiku": [
    {
      "lines": [
        "first line (≤40 chars)",
        "second line (≤40 chars)",
        "third line (≤40 chars)"
      ]
    }
  ]
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| haiku.json is valid array of objects with lines length 3 | `tests/content/haiku.test.js` | Each entry has `Array.isArray(lines) && lines.length === 3` |
| each line length ≤ 40 characters | `tests/content/haiku.test.js` | `line.length <= 40` |
| total characters of three lines < 200 | `tests/content/haiku.test.js` | `lines.reduce((sum,l)=>sum+l.length,0) < 200` |
| daily-haiku.js computes correct day index | `tests/unit/daily-haiku.index.test.js` | For known dates, index matches expected |
| daily-haiku.js creates three visible divs | `tests/unit/daily-haiku.dom.test.js` | After init, `document.querySelectorAll('#daily-haiku .haiku-line').length === 3` |
| opacity animation CSS present | `tests/unit/daily-haiku.css.test.js` | Stylesheet contains `@keyframes fade` |

### 4.2 Green Phase — Implementation

Implement the files as described to make tests pass.

### 4.3 Refactor Phase — Optimization

- Lazy-load haiku.json only once and cache.
- Use requestIdleCallback to load if not critical.
- Minimize DOM updates: only change text when day changes.

---

## 5. Acceptance Criteria

- [ ] A haiku appears each day at midnight local time.
- [ ] Each line is ≤40 characters, total <200 characters.
- [ ] The haiku is styled with low opacity (0.15) and does not obstruct the 3D view.
- [ ] On mobile, font size reduces and opacity further decreases.
- [ ] The haiku changes smoothly at date transition.
- [ ] All unit tests pass.
- [ ] No console errors in production build.

---

## 6. Dependencies & Risks

**Dependencies:** None beyond existing fetch API and CSS animations.

**Risks:** 
- HAWKU content may need curation to avoid copyright. Mitigation: use public domain or original haiku.
- Layout shift on load: mitigate by inserting element early and setting visibility hidden until ready.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Add daily haiku overlay showing a minimal poetic verse",
  "changes": [
    "Created src/content/haiku.json with 30 original haiku",
    "Added public/js/daily-haiku.js to render and animate haiku",
    "Updated BaseLayout.astro to include the script"
  ]
}
```