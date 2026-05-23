# PRD: Van Gogh Letter Excerpts

> **ID:** idea-045
> **Category:** Content
> **Priority:** medium
> **Status:** backlog
> **PRD Version:** 1.0
> **Last Updated:** 2026-05-24

---

## 1. Overview

**One-liner:** A new content section featuring rotating excerpts from Van Gogh's deeply personal letters to his brother Theo, rendered as aged-paper styled cards that reveal the artist's inner world.

**Problem:** The site celebrates Van Gogh's visual art through 3D scenes and impressionist aesthetics, but it barely scratches the mind behind the brush. Van Gogh was as much a writer as a painter — his 800+ letters to Theo are considered literary masterpieces, revealing his philosophy, struggles, and artistic vision. Visitors see the beauty but don't hear the artist's voice.

**Solution:** Add a new "Letters from Vincent" section between the existing Art & Beauty section and the changelog. It displays a daily rotating letter excerpt from a JSON data file, styled as an aged-paper card with:
- The excerpt text in elegant serif font with a handwritten feel
- The letter's date and recipient ("Arles, October 1888. Dear Theo,")
- A subtle aged-paper background texture (CSS-only, no images)
- Daily rotation via `dayOfYear % letters.length`
- Content is purely data-driven — no scene-init.js changes

---

## 2. User Stories

- As a visitor, I want to read Van Gogh's own words so I can understand the person behind the paintings.
- As a visitor, I want a new excerpt each day so there's fresh content on return visits.
- As a visitor, I want the letter cards to feel authentic and aged so they evoke the 19th century.
- As a visitor, I want the excerpts to be short enough to read in under a minute so I'm not overwhelmed.

---

## 3. Technical Specification

### 3.1 Architecture

- **New file:** `src/content/letters.json` — Array of letter excerpt objects
- **New file:** `src/components/LetterCard.astro` — Astro component for the letter section
- **Modified file:** `src/pages/index.astro` — Import and render LetterCard in the correct position
- **No changes to:** `scene-init.js`, `siteData.json`, `content.json`, `BaseLayout.astro`, any JS/CSS files
- **Purely content-driven** — this is a static Astro component with zero client-side JS

### 3.2 Implementation Details

#### Step 1: Create the letters data file
- File: `src/content/letters.json`
- What to do:
  - Define an array of 30 letter excerpt objects:
    ```json
    {
      "letters": [
        {
          "excerpt": "I often feel so infinitely indebted to you, and yet I try to express it so poorly. But I want you to know that my paintings exist because of your support. Without you, I would have sunk long ago.",
          "date": "October 1888",
          "location": "Arles",
          "recipient": "Theo",
          "context": "Written during the height of Van Gogh's Arles period, when he was painting Sunflowers and The Night Café."
        },
        {
          "excerpt": "I am unable to describe exactly what is the matter with me; now and then there are horrible fits of anxiety, apparently without cause, or otherwise a feeling of emptiness and fatigue in the head... and at times I have attacks of melancholy and of atrocious remorse.",
          "date": "July 1888",
          "location": "Arles",
          "recipient": "Theo",
          "context": "A rare candid admission of his mental health struggles, written months before the ear incident."
        }
      ]
    }
    ```
  - Curate 30 excerpts from different periods of Van Gogh's life (Nuenen, Antwerp, Paris, Arles, Saint-Rémy, Auvers)
  - Each excerpt should be 2-5 sentences (readable in 30-60 seconds)
  - Include the letter date, location, recipient, and a 1-sentence context note
  - Source from the Van Gogh Museum's published letters (public domain)
- Expected outcome: 30 rich, varied letter excerpts spanning Van Gogh's career

#### Step 2: Create the LetterCard.astro component
- File: `src/components/LetterCard.astro`
- What to do:
  - Frontmatter: Import letters.json, compute `dayOfYear % letters.length` for today's letter
  - Template:
    - Section with id="letters" and class="section"
    - Label: "VII. Letters from Vincent" (Roman numeral VII)
    - Heading: "Words from the Artist" with `<em>` emphasis on "Artist"
    - Aged-paper card: `<div class="letter-card">` with CSS background gradient simulating aged paper (#f5e6c8 → #e8d5a8), subtle border, box-shadow
    - Letter date/location line: `<p class="letter-meta">Arles, October 1888. Dear Theo,</p>`
    - Excerpt text: `<blockquote class="letter-excerpt">` in `--font-serif`, `font-size: var(--text-lg)`, `line-height: 1.8`
    - Context note: `<p class="letter-context">` in `--text-tertiary`, italic, smaller font
    - Decorative quill/ink SVG icon (inline SVG, `--accent-gold` color)
  - Styles: Use existing CSS custom properties. Inline `<style>` block within the component. Aged-paper effect via CSS gradients only (no images).
- Expected outcome: An elegant, aged-paper styled letter card component

#### Step 3: Add LetterCard to index.astro
- File: `src/pages/index.astro`
  - Import: `import LetterCard from '../components/LetterCard.astro';`
  - Place after the Art & Beauty section and before the changelog section
- Expected outcome: Letter section appears in the correct position on the page

### 3.3 Mobile Considerations

- On viewport < 768px:
  - Excerpt text: `font-size: var(--text-base)` instead of `text-lg`
  - Letter card padding: reduced by 20%
  - Meta and context text: `font-size: var(--text-sm)`
- No performance concerns — this is a purely static component

### 3.4 Data Structures

```json
{
  "letters": [
    {
      "excerpt": "I dream of painting and then I paint my dream.",
      "date": "September 1888",
      "location": "Arles",
      "recipient": "Theo",
      "context": "Written while painting The Starry Night, reflecting his belief that art should express inner vision."
    }
  ]
}
```

---

## 4. Test Plan (TDD)

### 4.1 Red Phase — Failing Tests

| Test | File | Assertion |
|------|------|-----------|
| Letters data file is valid | `tests/letters.test.js` | `JSON.parse(data)` succeeds and `.letters` array has ≥ 30 entries |
| Each letter has required fields | `tests/letters.test.js` | Every entry has `excerpt`, `date`, `location`, `recipient`, `context` |
| Excerpts are readable length | `tests/letters.test.js` | Each excerpt is 50-500 characters |
| Daily rotation is deterministic | `tests/letters.test.js` | Same `dayOfYear` always returns the same letter |
| LetterCard renders excerpt text | `tests/letters.test.js` | Component output includes the excerpt content |
| LetterCard renders date and location | `tests/letters.test.js` | Component output includes formatted date/location |

### 4.2 Green Phase — Implementation

- Create `src/content/letters.json` with 30 curated letter excerpts
- Create `src/components/LetterCard.astro` with aged-paper styling
- Add to `index.astro` in the correct position
- Verify all 6 tests pass

### 4.3 Refactor Phase — Optimization

- Add a "Read more" link to the Van Gogh Museum's online letter archive
- Add a subtle paper-texture CSS animation (very slow gradient shift)
- Allow visitors to browse previous days' letters with arrow navigation

---

## 5. Acceptance Criteria

- [ ] Letter section appears after Art & Beauty and before changelog
- [ ] A different letter excerpt is shown each day (rotates via dayOfYear)
- [ ] Excerpt text is displayed in elegant serif typography
- [ ] Date, location, and recipient are shown above the excerpt
- [ ] Context note is displayed below in muted styling
- [ ] Aged-paper card uses CSS-only styling (no images)
- [ ] Section uses existing design tokens (no new CSS files)
- [ ] Works on mobile with appropriate sizing
- [ ] All 6 unit tests pass
- [ ] No console errors
- [ ] No changes to scene-init.js or any JS scene files

---

## 6. Dependencies & Risks

**Dependencies:**
- Astro component system (existing)
- `index.astro` must import the new component

**Risks:**
- **Content quality:** Excerpts must be genuinely moving and representative of Van Gogh's voice. Mitigation: source from the Van Gogh Museum's published translations; avoid overused quotes.
- **Copyright:** Van Gogh's letters are public domain (he died in 1890), but translations may have copyright. Mitigation: use the Van Gogh Museum's public domain translations or write original paraphrases inspired by his style.
- **Scope creep:** This is a content feature. Resist adding 3D elements or interactive effects. The power is in the words.

---

## 7. Changelog Entry

```json
{
  "type": "feature",
  "description": "Van Gogh Letter Excerpts — daily rotating letter passages from Vincent to Theo",
  "changes": [
    "Added src/content/letters.json with 30 curated letter excerpts",
    "Created src/components/LetterCard.astro with aged-paper card styling",
    "Daily rotation via dayOfYear modulo",
    "Excerpts span Van Gogh's entire career (Nuenen to Auvers)",
    "Aged-paper effect via CSS gradients — no images needed",
    "Mobile-optimized typography and spacing",
    "No scene-init.js changes — purely content-driven"
  ]
}
```

---

## Reviewer Notes (2026-05-24)

**Quality Check**: Beautiful PRD. The aged-paper CSS approach (no images) is smart. The letter selection spanning Van Gogh's entire career provides variety and depth.

**Design Alignment**: This is the most emotionally resonant content feature in the backlog. Van Gogh's letters are his true voice — more intimate than any painting. The aged-paper styling evokes the 19th century without being kitschy.

**Feasibility**: Very low risk — pure Astro component, zero client-side JS. The `dayOfYear % letters.length` rotation is straightforward.

**Content Sourcing**: Ensure all excerpts are from public domain translations. The Van Gogh Museum's published letters (vangoghletters.org) are the best source. Avoid overused quotes like "I dream of painting and then I paint my dream" — dig deeper into the 800+ letters for fresh material.

**Scope**: Medium is appropriate given the content curation effort, though technically it's a low-complexity implementation.
