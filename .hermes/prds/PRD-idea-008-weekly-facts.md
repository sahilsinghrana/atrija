# PRD: Daily Generated Philosophy Facts

> **ID:** idea-008  
> **Category:** Content  
> **Priority:** medium  
> **Status:** backlog  
> **PRD Version:** 1.0  
> **Last Updated:** 2026-05-15

---

## 1. Overview

**One-liner:** Use the Hermes agent (via cron) to generate new philosophy facts daily, adding them to `siteData.json` so the site always has fresh content.

**Problem:** The site has a fixed set of facts in `siteData.json`. After a few weeks, visitors have seen everything. The daily mutation cron only rotates existing facts — it doesn't create new ones.

**Solution:** Add a weekly cron job that uses the Hermes agent to generate 2-3 new philosophy facts for each theme. The agent writes them directly to `siteData.json`. The daily mutation cron then rotates through the expanded fact pool. This keeps the site fresh indefinitely without manual content creation.

---

## 2. User Stories

- As a returning visitor, I want to see new facts so the site feels fresh and worth revisiting.
- As a visitor, I want facts that are accurate and well-sourced so I trust the content.
- As the site owner, I want content to grow automatically so I don't have to write new facts manually.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `scripts/weekly-fact-generator.js` — Node.js script that generates facts
- **File modified:** `src/content/siteData.json` — facts array grows over time
- **New cron job:** `van-gogh-weekly-facts` — runs weekly (Sunday 3 AM)
- **Depends on:** Hermes agent (via cron prompt), existing `siteData.json` structure

### 3.2 Implementation Details

#### Step 1: Create the fact generator script

This script is run by the Hermes agent cron. The agent reads this script's instructions, generates facts using its knowledge, and writes them to `siteData.json`.

```javascript
// scripts/weekly-fact-generator.js
// INSTRUCTIONS FOR HERMES AGENT:
// 1. Read src/content/siteData.json
// 2. For each theme (Moon, Ego, Bhagavad Gita, Shiv Purana, Art & Beauty):
//    - Generate 2 NEW facts that don't already exist in the facts array
//    - Each fact should be 1-2 sentences, insightful, and tied to the theme
//    - Include a source attribution (text, scripture, or philosopher)
//    - Facts should be diverse: historical, scientific, philosophical, cultural
// 3. Append new facts to the facts array for each theme
// 4. Write the updated JSON back to src/content/siteData.json
// 5. Add a changelog entry with the new fact count
// 6. Build and deploy

const fs = require('fs');
const path = require('path');

const siteDataPath = path.join(__dirname, '..', 'src', 'content', 'siteData.json');
const changelogDir = path.join(__dirname, '..', 'src', 'content', 'changelog');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJSON(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

// This script is a reference — the actual fact generation is done by the Hermes agent
// The agent should follow the instructions above and directly manipulate siteData.json

module.exports = { readJSON, writeJSON, siteDataPath, changelogDir };
```

#### Step 2: Create the cron job

The cron job is a pure Hermes agent prompt (no subprocess):

```
Weekly Philosophy Fact Generation (Sunday 3 AM):

1. Read /root/projects/van-gogh-site/src/content/siteData.json
2. For each of the 5 themes (Moon, Ego, Bhagavad Gita, Shiv Purana, Art & Beauty):
   a. Generate 2 NEW philosophy facts that are NOT already in the facts array
   b. Each fact: 1-2 sentences, insightful, tied to the theme
   c. Include source attribution (scripture, philosopher, or text)
   d. Ensure diversity: historical, scientific, philosophical, cultural
3. Append new facts to each theme's facts array
4. Write updated siteData.json
5. Add changelog entry: type "content", description "Weekly facts: +10 new philosophy facts"
6. Build: cd /root/projects/van-gogh-site && npm run build
7. Deploy: cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
8. Git commit: feat: weekly philosophy facts — +10 new facts across 5 themes
9. Git push
```

#### Step 3: Validate facts before adding

The agent should check for duplicates before adding:

```javascript
// Duplicate check logic (for agent to use):
function isDuplicate(newFact, existingFacts) {
  var newLower = newFact.toLowerCase().substring(0, 50);
  return existingFacts.some(function(f) {
    return f.toLowerCase().substring(0, 50) === newLower;
  });
}
```

### 3.3 Mobile Considerations

- No mobile-specific changes — this is a content update, not a UI change
- More facts = longer fact arrays = more variety in daily rotation
- Fact text length should be reasonable for mobile reading (1-2 sentences max)

### 3.4 Data Structures

```json
{
  "theme": "Moon",
  "newFacts": [
    {
      "text": "The Moon's gravitational pull creates tides that slow Earth's rotation by 1.4 milliseconds per century — a cosmic dance of time itself.",
      "source": "NASA Science"
    },
    {
      "text": "In Vedic tradition, the Moon (Chandra) is born from the mind of the cosmic being — representing not just a celestial body, but consciousness itself.",
      "source": "Rig Veda"
    }
  ]
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Facts array grows after generation | `tests/unit/weekly-facts.test.js` | `facts.length > initialLength` |
| No duplicate facts added | `tests/unit/weekly-facts.test.js` | `uniqueFacts.length === totalFacts.length` |
| Each theme gets new facts | `tests/unit/weekly-facts.test.js` | `every theme.facts.length > initial` |
| Changelog entry created | `tests/unit/weekly-facts.test.js` | `changelog has content type entry` |

### 4.2 Green Phase — Implementation

Create cron job, agent generates facts, updates siteData.json.

### 4.3 Refactor Phase — Optimization

- Cap facts array at 50 per theme (remove oldest if exceeded)
- Add fact quality scoring (agent self-reviews before adding)
- Generate facts in batches to avoid overwhelming the daily rotation

---

## 5. Acceptance Criteria

- [ ] Weekly cron runs every Sunday at 3 AM
- [ ] Generates 2 new facts per theme (10 total per week)
- [ ] No duplicate facts (checked against existing)
- [ ] Each fact is 1-2 sentences with source attribution
- [ ] Facts are diverse (historical, scientific, philosophical, cultural)
- [ ] Updated siteData.json is valid JSON
- [ ] Changelog entry records the update
- [ ] Site builds and deploys successfully
- [ ] Git commit with semantic message

---

## 6. Dependencies & Risks

**Dependencies:** Hermes agent (for generation), existing `siteData.json` structure, cron system

**Risks:**
- Agent may generate inaccurate facts → Include source attribution for verifiability
- Facts array could grow unbounded → Cap at 50 per theme, remove oldest
- Agent may generate duplicate facts → Check first 50 chars for similarity
- Weekly cron may fail silently → Add error logging to changelog

---

## 7. Changelog Entry

```json
{
  "type": "content",
  "description": "Weekly philosophy facts — +10 new facts across 5 themes",
  "changes": [
    "Added 2 new facts per theme (Moon, Ego, Gita, Shiva, Art)",
    "Each fact includes source attribution",
    "Weekly cron: every Sunday 3 AM"
  ]
}
```
