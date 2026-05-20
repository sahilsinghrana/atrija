// tests/painting-explorer.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, '../content/painting-explorer.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

describe('Painting Explorer Data', () => {
  it('hotspot data file is valid JSON with hotspots array', () => {
    expect(data).toBeDefined();
    expect(Array.isArray(data.hotspots)).toBe(true);
  });

  it('has at least 8 hotspots', () => {
    expect(data.hotspots.length).toBeGreaterThanOrEqual(8);
  });

  it('each hotspot has required fields', () => {
    data.hotspots.forEach(spot => {
      expect(spot.id).toBeTruthy();
      expect(spot.label).toBeTruthy();
      expect(typeof spot.x).toBe('number');
      expect(typeof spot.y).toBe('number');
      expect(typeof spot.radius).toBe('number');
      expect(spot.description.length).toBeGreaterThan(20);
      expect(spot.technique).toBeTruthy();
      expect(spot.quote).toBeTruthy();
    });
  });

  it('hotspot positions are within 0-100 range', () => {
    data.hotspots.forEach(spot => {
      expect(spot.x).toBeGreaterThanOrEqual(0);
      expect(spot.x).toBeLessThanOrEqual(100);
      expect(spot.y).toBeGreaterThanOrEqual(0);
      expect(spot.y).toBeLessThanOrEqual(100);
    });
  });

  it('painting metadata is present', () => {
    expect(data.painting).toBeDefined();
    expect(data.painting.title).toBe('The Starry Night');
    expect(data.painting.year).toBe(1889);
    expect(data.painting.image).toBeDefined();
    expect(data.painting.image.small).toBeTruthy();
    expect(data.painting.image.medium).toBeTruthy();
    expect(data.painting.image.large).toBeTruthy();
  });

  it('hotspot IDs are unique', () => {
    const ids = data.hotspots.map(s => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('covers key painting elements', () => {
    const ids = data.hotspots.map(s => s.id);
    expect(ids).toContain('cypress');
    expect(ids).toContain('moon');
    expect(ids).toContain('village');
    expect(ids).toContain('sky-swirls');
  });
});

describe('Painting Explorer Component Files', () => {
  it('PaintingExplorer.astro component exists', () => {
    const componentPath = path.resolve(__dirname, '../../src/components/PaintingExplorer.astro');
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it('painting-explorer.js exists', () => {
    const jsPath = path.resolve(__dirname, '../../public/js/painting-explorer.js');
    expect(fs.existsSync(jsPath)).toBe(true);
  });

  it('painting-explorer.js has content', () => {
    const jsPath = path.resolve(__dirname, '../../public/js/painting-explorer.js');
    const content = fs.readFileSync(jsPath, 'utf-8');
    expect(content.length).toBeGreaterThan(1000);
    expect(content).toContain('pe-viewport');
    expect(content).toContain('pe-panel');
    expect(content).toContain('pe-hotspot');
  });

  it('PaintingExplorer.astro contains hotspot rendering', () => {
    const componentPath = path.resolve(__dirname, '../../src/components/PaintingExplorer.astro');
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('pe-hotspot');
    expect(content).toContain('pe-panel');
    expect(content).toContain('pe-viewport');
    expect(content).toContain('pe-zoom');
  });

  it('index.astro imports PaintingExplorer', () => {
    const indexPath = path.resolve(__dirname, '../../src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain("import PaintingExplorer from '../components/PaintingExplorer.astro'");
    expect(content).toContain('<PaintingExplorer');
  });
});
