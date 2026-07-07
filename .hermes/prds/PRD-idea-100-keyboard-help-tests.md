# PRD: Unit Tests for Keyboard Help Overlay

> **ID:** idea-100
> **Category:** Testing & Reliability
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-08

---

## 1. Overview

**One-liner:** Create unit tests for the keyboard-help.js overlay module to verify modal display, shortcut listing, focus trap functionality, and keyboard interaction handling.

**Problem:** The keyboard-help.js module (493 lines) is a standalone client-side module with zero test coverage. It shows a modal overlay listing all available keyboard shortcuts ('/' for search, '?' for this help, Arrow keys for navigation, Tab/Shift+Tab for focus cycling) when the user presses '?'. The module handles focus trapping, scroll locking, and keyboard event management.

**Solution:** Create tests/unit/keyboard-help.test.js using vitest + jsdom to test: (1) overlay creation with correct ARIA attributes, (2) showing/hiding the overlay on '?' key, (3) focus trap cycling between interactive elements, (4) shortcut key detection (/, ?, Escape), (5) proper cleanup of event listeners on hide.

---

## 2. User Stories

- As a keyboard user, I want to discover available shortcuts so I can navigate efficiently.
- As a screen reader user, I want the help modal to have proper ARIA attributes for accessibility.
- As a developer, I want tests to verify the module works correctly across all interactions.

---

## 3. Technical Specification

### 3.1 Architecture

- **Test file:** `tests/unit/keyboard-help.test.js`
- **Test subject:** `public/js/keyboard-help.js`
- **Environment:** vitest + jsdom
- **Mocking:** Need to mock DOM structure with focusable elements

### 3.2 Implementation Details

#### Step 1: Create mock DOM structure

```javascript
// tests/unit/keyboard-help.test.js
function setupMockDOM() {
  document.body.innerHTML = `
    <button id="theme-toggle">Theme</button>
    <button id="flute-button">Flute</button>
    <div id="keyboard-help-overlay" class="help-overlay hidden">
      <div class="help-content">
        <kbd>/</kbd> Search
        <kbd>?</kbd> Help
        <button id="close-help">Close</button>
      </div>
    </div>
  `;
}
```

#### Step 2: Test cases

| Test | Description |
|------|-------------|
| Modal creates with ARIA | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` present |
| Show on '?' key | Pressing '?' reveals overlay, traps focus |
| Hide on Escape | Pressing Escape hides overlay, restores focus |
| Focus trap cycles | Tab from last element goes to first |
| Scroll locked | Body scroll locked when overlay visible |
| Event listener cleanup | Listeners removed on module cleanup |

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Creates overlay with correct ARIA | `tests/unit/keyboard-help.test.js` | `overlay.getAttribute('role') === 'dialog'` |
| Shows on '?' key | `tests/unit/keyboard-help.test.js` | `overlay.classList.contains('hidden') === false after '?' key` |
| Hides on Escape | `tests/unit/keyboard-help.test.js` | `overlay.classList.contains('hidden') === true after Escape` |
| Focus trap works | `tests/unit/keyboard-help.test.js` | Last element Tab returns to first element |
| Scroll locked | `tests/unit/keyboard-help.test.js` | `document.body.style.overflow === 'hidden'` when visible |

### 4.2 Green Phase — Implementation

- Import keyboard-help.js and test its functions
- Mock `addEventListener` and `removeEventListener` to verify cleanup

### 4.3 Refactor Phase — Optimization

- Extract modal creation to testable function
- Use `vi.useFakeTimers()` for timing-related tests

---

## 5. Acceptance Criteria

- [ ] All 12 unit tests pass (overlay creation, show/hide, focus trap, keyboard events)
- [ ] Tests use jsdom environment without real DOM
- [ ] No network calls in tests
- [ ] Existing test suite unaffected
- [ ] Tests run in <5s

---

## 6. Dependencies & Risks

**Dependencies:** Existing keyboard-help.js module, jsdom test environment.

**Risks:** Focus trap implementation may need refactoring for testability.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Added unit tests for keyboard-help.js overlay module covering modal display, focus trap, and keyboard interactions"
}
```