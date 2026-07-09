# PRD: Screen Reader Announcements for Interactive Elements

> **ID:** idea-103
> **Category:** Accessibility
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-10

---

## 1. Overview

**One-liner:** Add ARIA live regions to announce key interactive element interactions to screen reader users.

**Problem:** Currently, interactive elements like flute clicks, section navigation, and search results provide visual feedback but no audio/assistive feedback for screen reader users.

**Solution:** Add aria-live="polite" regions that announce interactions without interrupting the user's workflow.

---

## 2. User Stories

- As a screen reader user, I want announcements when I click the flute button so I know the interaction succeeded.
- As a keyboard navigator, I want section changes announced so I know where I am on the page.
- As a search user, I want result counts announced so I know how many results were found.

---

## 3. Technical Specification

### 3.1 Architecture

- Create: `public/js/screen-reader-announcements.js` - Standalone IIFE module
- Modify: `src/pages/index.astro` - Add aria-live region to DOM
- Zero scene-init.js changes

### 3.2 Implementation Details

#### Step 1: Add ARIA live region to index.astro
- File: `src/pages/index.astro`
- Add `<div id="announcer" aria-live="polite" aria-atomic="true" class="sr-only"></div>` after main content

#### Step 2: Create screen-reader-announcements.js
- File: `public/js/screen-reader-announcements.js`
- Listen for: `flute-clicked` custom event, `section-navigated` from section-nav, search results update
- Function: `announce(message)` clears and sets text content of announcer div

#### Step 3: Hook into existing modules
- Dispatch custom event from flute click handler
- Listen for section-nav events
- Listen for search results rendered

### 3.3 Mobile Considerations

- No additional mobile considerations - pure ARIA
- Screen reader support works on mobile browsers

### 3.4 Data Structures

No new data structures required.

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| announce() sets text content | `tests/unit/screen-reader-announcements.test.js` | `.textContent` contains message |
| announce() clears after delay | `tests/unit/screen-reader-announcements.test.js` | `.textContent` empty after 2s |
| Flute click triggers announcement | `tests/unit/screen-reader-announcements.test.js` | "Flute played" announced on click |
| Section nav triggers announcement | `tests/unit/screen-reader-announcements.test.js` | "Navigated to Moon" announced |

---

## 5. Acceptance Criteria

- [ ] ARIA live region added to page
- [ ] Flute click announces "Flute played"
- [ ] Section navigation announces section name
- [ ] Search results announce count
- [ ] All tests pass
- [ ] Zero scene-init.js changes
