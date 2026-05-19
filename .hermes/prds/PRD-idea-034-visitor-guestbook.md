# PRD: Impressionist Visitor Guestbook

> **ID:** idea-034
> **Category:** Interactivity
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-20

---

## 1. Overview

**One-liner:** A lightweight, localStorage-backed guestbook where visitors leave short impressions that appear as floating, brushstroke-styled text in the 3D scene — creating an ever-growing community canvas of reactions.

**Problem:** The site is a solitary experience — visitors view, scroll, and leave. There's no sense of community or shared presence. Other visitors have been here, felt something, moved on. The site has no mechanism to capture or display the human response to Van Gogh's art, which is ironic for a site about emotional, impressionistic expression.

**Solution:** Add a small, unobtrusive guestbook button (bottom-right, opposite the flute button). Clicking it opens a minimal input panel: a text field (max 140 characters) and a submit button. On submit, the text is stored in `localStorage` and simultaneously rendered as a floating text element in the 3D scene — styled like a brushstroke (slightly rotated, hand-drawn font, color from the current theme palette). The visitor's own entries persist across visits. A subtle counter shows how many impressions have been left. No backend, no server, no database — purely client-side.

---

## 2. User Stories

- As a visitor, I want to leave a short impression so I can feel like I've contributed to this space.
- As a visitor, I want to see my previous impressions when I return so the site feels personal.
- As a visitor, I want the guestbook to be subtle and non-intrusive so it doesn't distract from the art.
- As a visitor, I want my impression to appear in the 3D scene so it feels like part of the world, not a separate UI element.
- As a visitor, I want to delete my own impressions if I change my mind.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `public/js/guestbook.js` — Standalone module for guestbook logic and 3D text rendering
- **Modified file:** `src/layouts/BaseLayout.astro` — Add the guestbook button and `<script>` import
- **Modified file:** `public/js/scene-init.js` — Add a `guestbookTexts` array and render floating text sprites (NOTE: this uses the same canvas-texture sprite pattern already used for flowers and music notes. No new Three.js techniques required.)
- **No changes to:** `siteData.json`, `content.json`, `index.astro`, or CSS files
- **Storage:** `localStorage` key `van-gogh-guestbook` — array of `{text, color, timestamp, id}` objects

### 3.2 Implementation Details

#### Step 1: Create the guestbook.js module
- File: `public/js/guestbook.js`
- What to do:
  - **localStorage schema:**
    ```json
    [
      {
        "id": "gb-1716192000000",
        "text": "The stars make me feel small and infinite at once.",
        "color": "#FFD700",
        "timestamp": 1716192000000
      }
    ]
    ```
  - **UI elements (created dynamically on init):**
    - A floating button (bottom-right, 16px from edges, 44×44px) with a quill/pen icon (SVG)
    - A panel (positioned above the button) with:
      - Text input (`<input type="maxlength">`, 140 char limit, placeholder: "Leave your impression...")
      - Character counter ("0/140")
      - Submit button ("Add to canvas")
      - A list of the visitor's previous entries (max 5 shown, with delete buttons)
      - Total impression count
    - Panel is hidden by default, toggled by the button
  - **Submit flow:**
    1. Read text from input
    2. Pick a random color from the current theme's palette (read from CSS variables or the daily color scheme)
    3. Generate an ID: `gb-${Date.now()}`
    4. Push to localStorage array
    5. Call `window.__guestbookAddText({id, text, color})` — this is the bridge to scene-init.js
    6. Clear the input, update the list
  - **Delete flow:**
    1. Remove from localStorage array
    2. Call `window.__guestbookRemoveText(id)` — bridge to scene-init.js
  - **Load on init:**
    1. Read all entries from localStorage
    2. For each entry, call `window.__guestbookAddText(entry)` to render in the scene
  - **Bridge functions:** Expose `window.__guestbookAddText` and `window.__guestbookRemoveText` that scene-init.js populates
- Expected outcome: A fully functional guestbook UI with localStorage persistence

#### Step 2: Integrate with scene-init.js (MINIMAL — sprite pattern)
- File: `public/js/scene-init.js`
- What to do:
  - Add a `guestbookTexts` array to track 3D text objects
  - Implement `window.__guestbookAddText(entry)`:
    1. Create a canvas texture from the text (same pattern as music notes — `document.createElement('canvas')`, `fillText`)
    2. Style: 48px serif font, the entry's color, centered on canvas
    3. Create a `Sprite` with the canvas texture (same pattern as existing sprites)
    4. Position: random X/Z in a "guestbook zone" (e.g., x: -10 to 10, z: -5 to 5), random Y between 1.0 and 3.0
    5. Scale: 0.3–0.6 (smaller than flowers, so they feel like floating thoughts)
    6. Add to scene and `guestbookTexts` array
    7. Animate: gentle float (sine wave on Y, very slow rotation on Y axis)
  - Implement `window.__guestbookRemoveText(id)`:
    1. Find the sprite in `guestbookTexts` by id
    2. Remove from scene, dispose geometry/material
  - **CRITICAL:** If `guestbook.js` fails to load, scene-init.js runs normally — the bridge functions just won't be called. No errors.
  - **Limit:** Max 20 guestbook sprites in the scene at once (FIFO eviction of oldest if exceeded)
- Expected outcome: Guestbook entries appear as floating text in the 3D scene

#### Step 3: Add the script tag to BaseLayout.astro
- File: `src/layouts/BaseLayout.astro`
- What to do:
  - Add `<script type="module" src="/js/guestbook.js" defer></script>` after the other script tags
  - The `defer` ensures scene-init.js has loaded and set up the bridge functions
- Expected outcome: guestbook.js loads after the scene is ready

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Guestbook button: same 44×44px, bottom-right
  - Panel: full-width bottom sheet (like a mobile action sheet) instead of a floating panel
  - Input: uses native mobile keyboard, `inputmode="text"`
  - Max guestbook sprites in scene: 10 (half of desktop) to reduce draw calls
- Performance budget: Each guestbook entry is one sprite (one draw call). Max 20 on desktop, 10 on mobile. Canvas textures are small (~256×64px). Negligible memory impact.

### 3.4 Data Structures

```json
{
  "guestbookEntry": {
    "id": "gb-1716192000000",
    "text": "The stars make me feel small and infinite at once.",
    "color": "#FFD700",
    "timestamp": 1716192000000
  }
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| localStorage read/write | `tests/guestbook.test.js` | After `addEntry({text: "test"})`, localStorage contains the entry |
| Entry has required fields | `tests/guestbook.test.js` | Entry has `id`, `text`, `color`, `timestamp` |
| 140 char limit enforced | `tests/guestbook.test.js` | Input with 200 chars is truncated to 140 |
| Delete removes entry | `tests/guestbook.test.js` | After `deleteEntry(id)`, localStorage no longer contains the entry |
| Bridge function exists | `tests/guestbook.test.js` | `window.__guestbookAddText` is a function after guestbook.js loads |
| Max 20 sprites enforced | `tests/guestbook.test.js` | After adding 25 entries, only 20 sprites exist in the scene |
| Graceful fallback | `tests/guestbook.test.js` | scene-init.js runs without errors if guestbook.js is not loaded |

### 4.2 Green Phase — Implementation

- Implement `guestbook.js` with UI, localStorage, and bridge functions
- Add MINIMAL sprite rendering in `scene-init.js` (same pattern as existing sprites)
- Add script tag to `BaseLayout.astro`
- Verify all 7 tests pass

### 4.3 Refactor Phase — Optimization

- Add a "react to entry" feature (small heart/star that floats up from an entry when clicked)
- Add an option to export entries as a JSON file
- Consider adding a "featured impressions" section on the page that shows the 5 most recent entries as styled quote cards

---

## 5. Acceptance Criteria

- [ ] Guestbook button appears in the bottom-right corner
- [ ] Clicking the button opens an input panel with text field and submit button
- [ ] Submitted text appears as a floating, brushstroke-styled sprite in the 3D scene
- [ ] Entries persist across page reloads via localStorage
- [ ] Visitor can see and delete their previous entries
- [ ] Character limit of 140 is enforced
- [ ] Max 20 sprites on desktop, 10 on mobile
- [ ] Scene works correctly if guestbook.js fails to load
- [ ] Mobile: bottom sheet panel, native keyboard, reduced sprite count
- [ ] All 7 unit tests pass
- [ ] No console errors

---

## 6. Dependencies & Risks

**Dependencies:**
- `scene-init.js` must expose bridge functions (`window.__guestbookAddText`, `window.__guestbookRemoveText`)
- `BaseLayout.astro` must load `guestbook.js` after `scene-init.js`

**Risks:**
- **scene-init.js modification risk:** This is a minimal addition (sprite rendering using existing patterns). Mitigation: wrap in `try/catch`, ensure bridge functions are optional (check `typeof window.__guestbookAddText === 'function'` before calling from guestbook.js).
- **localStorage limits:** Most browsers allow 5-10MB per origin. At ~200 bytes per entry, thousands of entries would be needed to hit the limit. Mitigation: cap at 50 entries in localStorage.
- **Inappropriate content:** Since entries are local-only, this is not a moderation concern. Entries are never transmitted to any server.
- **Font rendering in canvas:** Canvas text rendering varies across browsers. Mitigation: use the site's existing `--font-serif` (Cormorant Garamond) which is loaded via Google Fonts and available on the page.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Impressionist visitor guestbook — leave floating text in the 3D scene",
  "changes": [
    "Added public/js/guestbook.js module",
    "localStorage-backed guestbook with add/delete",
    "Floating text sprites in the 3D scene using existing sprite pattern",
    "Theme-colored text with gentle float animation",
    "140 character limit, max 20 sprites (10 mobile)",
    "Bottom sheet panel on mobile",
    "Graceful fallback if module fails to load",
    "Bridge pattern: guestbook.js ↔ window.__guestbookAddText ↔ scene-init.js"
  ]
}
```

---

## Reviewer Notes (2026-05-20)

**Quality Check**: PRD is well-structured with clear user stories, good technical spec, and solid test plan. The bridge pattern (`window.__guestbookAddText`) is the right approach for decoupling guestbook.js from scene-init.js.

**Risk Flag**: The `scene-init.js` modification (Step 2) adds bridge functions. While minimal, any change to scene-init.js carries risk per AGENTS.md safety rules. Recommend:
- Wrap bridge function setup in a try/catch
- Ensure the bridge functions are truly optional (scene-init.js runs fine if guestbook.js never loads)
- Consider an event-based pattern (CustomEvent) instead of global window functions for cleaner decoupling

**Priority**: Medium is appropriate — nice community feature but not critical.

**Dependencies**: Requires `scene-init.js` modification. Coordinate with any ongoing refactor work to avoid conflicts.

