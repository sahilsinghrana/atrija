# PRD: Daily Haiku Content Section

> **ID:** idea-104
> **Category:** Content
> **Priority:** low
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-07-10

---

## 1. Overview

**One-liner:** Add a daily rotating haiku section with seasonal themes.

**Problem:** Site has philosophy quotes and koans but no poetic form. Haiku's 5-7-5 syllable structure fits text-minimalism constraint.

**Solution:** New section between Philosophy and Shiva with daily haiku, hourly rotation via daily-mutate.js.

---

## 2. User Stories

- As a visitor, I want a daily haiku so I can enjoy brief poetic moments.
- As a returning visitor, I want fresh haikus hourly so the site feels alive.

---

## 3. Technical Specification

### 3.1 Architecture

- Modify: `src/content/content.json` - Add haiku section definition
- Modify: `src/content/siteData.json` - Add haiku themes array
- Modify: `scripts/daily-mutate.js` - Add haiku rotation logic
- Zero scene-init.js changes

### 3.2 Implementation Details

#### Step 1: Add haiku section to content.json
- Add section with heading "Daily Verse", intro "Brief poems for contemplation", placeholder haiku

#### Step 2: Add haiku themes to siteData.json
- Add seasons-based themes: Spring (cherry blossoms), Summer (cicadas), Autumn (moon viewing), Winter (snow)

#### Step 3: Update daily-mutate.js
- Function: `rotateHaiku()` selects random haiku matching season
- Validates 5-7-5 syllable pattern
- Hourly rotation via cron

### 3.3 Mobile Considerations

- Text minimalism enforced: heading <20 chars, intro <60 chars, haiku <100 chars total

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Haiku has correct syllable count | `tests/unit/haiku.test.js` | 5-7-5 pattern |
| Seasonal themes apply correctly | `tests/unit/haiku.test.js` | Season determines theme |
| daily-mutate writes valid haiku | `tests/unit/haiku.test.js` | JSON structure valid |

---

## 5. Acceptance Criteria

- [ ] Haiku section renders between Philosophy and Shiva
- [ ] 5-7-5 syllable pattern enforced
- [ ] Seasonal themes apply
- [ ] Hourly rotation works
- [ ] Text-minimalism constraints met
