// tests/unit/content.test.js
import { describe, it, expect } from 'vitest';
import siteData from '../../src/content/siteData.json';

describe('Site Content Data', () => {
  it('has at least 5 themes', () => {
    expect(siteData.themes.length).toBeGreaterThanOrEqual(5);
  });

  it('each theme has a title, category, and id', () => {
    siteData.themes.forEach(theme => {
      expect(theme.id).toBeTruthy();
      expect(theme.title).toBeTruthy();
      expect(theme.category).toBeTruthy();
    });
  });

  it('each theme has at least 3 facts', () => {
    siteData.themes.forEach(theme => {
      expect(theme.facts.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('each fact has text, source, and element', () => {
    siteData.themes.forEach(theme => {
      theme.facts.forEach(fact => {
        expect(fact.text.length).toBeGreaterThan(20);
        expect(fact.source).toBeTruthy();
        expect(fact.element).toBeTruthy();
      });
    });
  });

  it('each theme has at least 2 quotes', () => {
    siteData.themes.forEach(theme => {
      expect(theme.quotes.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('has color schemes', () => {
    expect(siteData.colorSchemes.length).toBeGreaterThanOrEqual(3);
  });

  it('each color scheme has required fields', () => {
    siteData.colorSchemes.forEach(scheme => {
      expect(scheme.name).toBeTruthy();
      expect(scheme.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(scheme.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(scheme.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(scheme.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(scheme.text).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(scheme.mood).toBeTruthy();
      expect(scheme.shaderParams).toHaveProperty('strokeDensity');
      expect(scheme.shaderParams).toHaveProperty('swirlFrequency');
      expect(scheme.shaderParams).toHaveProperty('colorIntensity');
    });
  });

  it('has changelog with entries', () => {
    expect(siteData.changelog).toBeTruthy();
    expect(siteData.changelog.version).toBeTruthy();
    expect(siteData.changelog.entries.length).toBeGreaterThan(0);
  });

  it('changelog entries have date, type, description, and changes', () => {
    siteData.changelog.entries.forEach(entry => {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.type).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(Array.isArray(entry.changes)).toBe(true);
    });
  });

  it('covers required philosophical themes', () => {
    const themeIds = siteData.themes.map(t => t.id);
    expect(themeIds).toContain('selene-moon');
    expect(themeIds).toContain('ego-arrogance');
    expect(themeIds).toContain('bhagavad-gita');
    expect(themeIds).toContain('shiv-purana');
    expect(themeIds).toContain('van-gogh-philosophy');
  });
});
