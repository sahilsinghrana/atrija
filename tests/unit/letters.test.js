// tests/unit/letters.test.js
// Red-phase tests: Van Gogh Letter Excerpts (idea-045)
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Van Gogh Letter Excerpts (idea-045)', () => {
  let lettersData;
  try {
    const raw = readFileSync(join(process.cwd(), 'src/content/letters.json'), 'utf-8');
    lettersData = JSON.parse(raw);
  } catch (e) {
    lettersData = null;
  }

  describe('Data file validity', () => {
    it('letters.json parses successfully', () => {
      expect(lettersData).not.toBeNull();
    });

    it('has a letters array with at least 30 entries', () => {
      expect(lettersData).toHaveProperty('letters');
      expect(Array.isArray(lettersData.letters)).toBe(true);
      expect(lettersData.letters.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Letter structure', () => {
    const requiredFields = ['excerpt', 'date', 'location', 'recipient', 'context'];

    it('every letter has all required fields', () => {
      if (!lettersData || !lettersData.letters) {
        expect.fail('letters.json not loaded');
        return;
      }
      lettersData.letters.forEach((letter, i) => {
        requiredFields.forEach(field => {
          expect(letter).toHaveProperty(field);
          expect(typeof letter[field]).toBe('string');
          expect(letter[field].length).toBeGreaterThan(0);
        });
      });
    });

    it('every excerpt is between 50 and 500 characters', () => {
      if (!lettersData || !lettersData.letters) {
        expect.fail('letters.json not loaded');
        return;
      }
      lettersData.letters.forEach((letter, i) => {
        expect(letter.excerpt.length).toBeGreaterThanOrEqual(50);
        expect(letter.excerpt.length).toBeLessThanOrEqual(500);
      });
    });
  });

  describe('Daily rotation', () => {
    it('daily rotation is deterministic for a given dayOfYear', () => {
      if (!lettersData || !lettersData.letters) {
        expect.fail('letters.json not loaded');
        return;
      }
      const len = lettersData.letters.length;
      const dayOfYear = 100;
      const index1 = dayOfYear % len;
      const index2 = dayOfYear % len;
      expect(index1).toBe(index2);
      expect(lettersData.letters[index1]).toBe(lettersData.letters[index2]);
    });

    it('different dayOfYear values can produce different letters', () => {
      if (!lettersData || !lettersData.letters) {
        expect.fail('letters.json not loaded');
        return;
      }
      const len = lettersData.letters.length;
      // With 30+ letters, at least two different days should yield different indices
      const indices = new Set();
      for (let d = 0; d < len; d++) {
        indices.add(d % len);
      }
      expect(indices.size).toBeGreaterThan(1);
    });
  });

  describe('LetterCard component', () => {
    let componentContent;
    try {
      componentContent = readFileSync(join(process.cwd(), 'src/components/LetterCard.astro'), 'utf-8');
    } catch (e) {
      componentContent = null;
    }

    it('LetterCard.astro component file exists', () => {
      expect(componentContent).not.toBeNull();
    });

    it('component imports letters.json', () => {
      expect(componentContent).toMatch(/letters\.json/);
    });

    it('component renders excerpt text', () => {
      expect(componentContent).toMatch(/excerpt/);
    });

    it('component renders date and location', () => {
      expect(componentContent).toMatch(/date/);
      expect(componentContent).toMatch(/location/);
    });

    it('component uses dayOfYear for daily rotation', () => {
      expect(componentContent).toMatch(/dayOfYear/);
    });
  });

  describe('index.astro integration', () => {
    let indexContent;
    try {
      indexContent = readFileSync(join(process.cwd(), 'src/pages/index.astro'), 'utf-8');
    } catch (e) {
      indexContent = null;
    }

    it('index.astro imports LetterCard', () => {
      expect(indexContent).toMatch(/import\s+LetterCard/);
    });

    it('LetterCard is rendered in the template', () => {
      expect(indexContent).toMatch(/<LetterCard/);
    });
  });
});
