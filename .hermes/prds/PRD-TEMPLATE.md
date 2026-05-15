# PRD: [Feature Title]

> **ID:** idea-XXX  
> **Category:** [3D Elements | Interactivity | Data | Audio | UI | Shaders | Content]  
> **Priority:** [high | medium | low]  
> **Status:** backlog | red | green | refactor | done  
> **PRD Version:** 1.0  
> **Last Updated:** YYYY-MM-DD

---

## 1. Overview

**One-liner:** What this feature does in a single sentence.

**Problem:** What user experience gap or technical limitation does this address?

**Solution:** High-level description of the approach.

---

## 2. User Stories

- As a visitor, I want [action] so that [benefit].
- As a visitor, I want [action] so that [benefit].

---

## 3. Technical Specification

### 3.1 Architecture

Describe where this fits in the existing system:
- Which files are created/modified?
- Which existing modules does it depend on?
- Does it add new Three.js objects, shaders, API calls, or UI components?

### 3.2 Implementation Details

#### Step 1: [First Implementation Step]
- File: `path/to/file.js`
- What to do:
  - Specific code changes
  - Functions to add
  - Parameters to configure
- Expected outcome: What should exist after this step

#### Step 2: [Second Implementation Step]
- File: `path/to/file.js`
- What to do:
  - Specific code changes
- Expected outcome: What should exist after this step

#### Step 3: [Third Implementation Step]
- (Continue as needed)

### 3.3 Mobile Considerations

- How does this behave on mobile (viewport < 768px)?
- Any reduced particle counts, simplified shaders, or disabled features?
- Performance budget: max draw calls / triangles / texture memory

### 3.4 Data Structures

```json
{
  "example": "New data format if applicable"
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Test name | `tests/path/to/test.js` | What should be true |
| Test name | `tests/path/to/test.js` | What should be true |

### 4.2 Green Phase — Implementation

What code makes the tests pass?

### 4.3 Refactor Phase — Optimization

- Performance improvements
- Code cleanup
- Draw call reduction

---

## 5. Acceptance Criteria

- [ ] Criterion 1 (e.g., "Shooting stars appear every 8-15 seconds")
- [ ] Criterion 2 (e.g., "Works on mobile with reduced particle count")
- [ ] Criterion 3 (e.g., "No frame rate drops below 30fps on mobile")
- [ ] Criterion 4 (e.g., "Passes all unit tests")
- [ ] Criterion 5 (e.g., "Passes all E2E tests")

---

## 6. Dependencies & Risks

**Dependencies:** What must exist before this can be built?

**Risks:** What could go wrong? Mitigation?

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Brief description for changelog",
  "changes": ["change 1", "change 2"]
}
```
