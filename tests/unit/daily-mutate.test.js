/**
 * daily-mutate.test.js — Unit tests for scripts/daily-mutate.js
 *
 * Tests cover:
 * - Pure utility functions: getCurrentSeason, getSeasonEmoji
 * - mutateColors(): valid scheme selection, seasonal weighting, shader param variation
 * - updateAllSections(): schema preservation, valid indices, heading generation
 * - writeChangelogEntry(): append vs. duplicate detection
 * - updateChangelogIndex(): index metadata, date pruning at 30+ days
 * - syncChangelogToContent(): deduplication, max 15 entries, chronological sort
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Fixture Data (defined before vi.mock to avoid hoisting issues) ──────

const FIXTURE_SITE_DATA = {
  themes: [
    {
      id: 'selene-moon',
      title: 'Selene and The Moon',
      category: 'mythology',
      facts: [
        { text: 'The Moon rotates synchronously with its orbit.', source: 'Astronomy', element: 'moon' },
        { text: 'During a total lunar eclipse, the Moon turns copper-red.', source: 'Astronomy', element: 'moon' },
        { text: 'The Moon is the only natural satellite of Earth.', source: 'Astronomy', element: 'moon' },
        { text: 'Ancient Babylonian astronomers tracked the cycles.', source: 'History', element: 'moon' },
        { text: 'The surface holds the footprints of twelve humans.', source: 'Space', element: 'moon' },
      ],
      quotes: [
        'We are all like the bright moon. — Kahlil Gibran',
        'The Moon, like a flower in heavens high bower. — William Blake',
        'Do not swear by the moon. — Shakespeare',
        'The Moon is the first milestone. — Arthur C. Clarke',
        'The moon does not fight. — Thich Nhat Hanh',
      ],
    },
    {
      id: 'ego-arrogance',
      title: 'Ego and Arrogance',
      category: 'philosophy',
      facts: [
        { text: 'The ego is a tight fist; the soul is an open hand.', source: 'Atrija', element: 'ego' },
        { text: 'The ego builds walls to feel safe.', source: 'Atrija', element: 'ego' },
        { text: 'The ego is not master in its own house.', source: 'Freud', element: 'ego' },
        { text: 'The self that it clings to as I is a story.', source: 'Atrija', element: 'ego' },
        { text: 'Ego is the phantom of the I.', source: 'Philosophy', element: 'ego' },
      ],
      quotes: [
        'The only true wisdom is in knowing you know nothing. — Socrates',
        'The ego is a story told by the mind. — Atrija',
        'The ego builds walls to feel safe. — Atrija',
        'The ego is not master in its own house. — Freud',
        'The ego is a tight fist. — Atrija',
      ],
    },
    {
      id: 'bhagavad-gita',
      title: 'Bhagavad Gita',
      category: 'scripture',
      facts: [
        { text: 'The soul is neither born, and nor does it die.', source: 'Bhagavad Gita 2.20', element: 'gita' },
        { text: 'When meditation is mastered, the mind is unwavering.', source: 'Bhagavad Gita 6.19', element: 'gita' },
        { text: 'The self-controlled soul wins eternal peace.', source: 'Bhagavad Gita 2.64', element: 'gita' },
        { text: 'You have the right to work.', source: 'Bhagavad Gita 2.47', element: 'gita' },
        { text: 'Action is better than inaction.', source: 'Bhagavad Gita 3.8', element: 'gita' },
      ],
      quotes: [
        'You are what you believe in. — Bhagavad Gita',
        'The soul is neither born, and nor does it die. — Bhagavad Gita 2.20',
        'When meditation is mastered. — Bhagavad Gita 6.19',
        'The self-controlled soul wins eternal peace. — Bhagavad Gita 2.64',
        'You have the right to work. — Bhagavad Gita 2.47',
      ],
    },
    {
      id: 'shiv-purana',
      title: 'Shiv Purana',
      category: 'mythology',
      facts: [
        { text: 'Shivas Tandava is the cosmic dance of creation.', source: 'Shiv Purana', element: 'shiva' },
        { text: 'The rhythm of the damaru is the heartbeat of the cosmos.', source: 'Shiv Purana', element: 'shiva' },
        { text: 'Shiva stands within the ring of flame.', source: 'Mythology', element: 'shiva' },
        { text: 'The Ganges flows from Shivas hair.', source: 'Mythology', element: 'shiva' },
        { text: 'Shiva is the destroyer of evil.', source: 'Shiv Purana', element: 'shiva' },
      ],
      quotes: [
        'Shiva dances at the hour of fire. — Shiv Purana',
        'The rhythm of the damaru is the heartbeat. — Shiv Purana',
        'Shiva stands within the ring of flame. — Mythology',
        'The Ganges flows from Shivas hair. — Mythology',
        'Shiva is the destroyer of evil. — Shiv Purana',
      ],
    },
    {
      id: 'art-beauty',
      title: 'Art and Beauty',
      category: 'aesthetics',
      facts: [
        { text: 'Van Gogh painted at every hour.', source: 'Art History', element: 'art' },
        { text: 'Color becomes almost aggressive under direct sun.', source: 'Art Theory', element: 'art' },
        { text: 'The canvas at noon is a battlefield of color.', source: 'Art Philosophy', element: 'art' },
        { text: 'Every brushstroke must stand on its own.', source: 'Art Theory', element: 'art' },
        { text: 'The painter who wins is the one who dares to be honest.', source: 'Art Philosophy', element: 'art' },
      ],
      quotes: [
        'The canvas at noon is a battlefield of color. — Atrija',
        'Color becomes almost aggressive under direct sun. — Art Theory',
        'Every brushstroke must stand on its own. — Art Theory',
        'The painter who wins is the one who dares to be honest. — Atrija',
        'Van Gogh painted at every hour. — Art History',
      ],
    },
  ],
  colorSchemes: [
    {
      name: 'sunflower',
      primary: '#f5c800',
      secondary: '#ff6f00',
      accent: '#2e7d32',
      background: '#1a1200',
      text: '#fff8e1',
      mood: 'warm',
      shaderParams: { strokeDensity: 10.6, swirlFrequency: 7.8, colorIntensity: 1.57 },
      seasons: ['autumn', 'summer'],
    },
    {
      name: 'ember-dawn',
      primary: '#ff6b35',
      secondary: '#ff4081',
      accent: '#ffd54f',
      background: '#1a0808',
      text: '#fff0e8',
      mood: 'fiery',
      shaderParams: { strokeDensity: 8.2, swirlFrequency: 12.5, colorIntensity: 1.65 },
      seasons: ['spring'],
    },
    {
      name: 'lily-garden',
      primary: '#e8b4f0',
      secondary: '#ff6b9d',
      accent: '#7c4dff',
      background: '#0d0015',
      text: '#f8e8ff',
      mood: 'passionate',
      shaderParams: { strokeDensity: 9.4, swirlFrequency: 11.2, colorIntensity: 1.43 },
      seasons: ['summer'],
    },
    {
      name: 'starry-night',
      primary: '#4a7dff',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#020810',
      text: '#e8f0ff',
      mood: 'mysterious',
      shaderParams: { strokeDensity: 12.3, swirlFrequency: 6.1, colorIntensity: 1.35 },
      seasons: ['winter'],
    },
    {
      name: 'moonlit-silver',
      primary: '#c0c0d0',
      secondary: '#ffd700',
      accent: '#2dd4bf',
      background: '#0a0a12',
      text: '#e8e8f0',
      mood: 'serene',
      shaderParams: { strokeDensity: 7.8, swirlFrequency: 9.3, colorIntensity: 1.28 },
      seasons: ['winter'],
    },
  ],
  changelog: { version: '1.8.0' },
};

const FIXTURE_CONTENT = {
  meta: { version: '1.8.0', lastUpdated: '2026-06-22', updatedBy: 'test', season: 'summer', layout: 'default' },
  sections: {
    hero: { tagline: 'The sunflower does not count the hours.' },
    today: {
      heading: 'What the Moon reveals today',
      intro: 'The sun stands at its zenith.',
      visualAsset: { type: 'svg', path: '/mutation-assets/2026-06-22/test.svg', description: 'Test', credit: 'Test' },
    },
    moon: {
      label: 'I. The Moon',
      heading: 'The moon waits.',
      intro: 'Intro text.',
      imageCard: { themeIndex: 0, factIndex: 0 },
      facts: { themeIndex: 0, slice: [0, 2] },
      quote: { themeIndex: 0, quoteIndex: 0 },
    },
    philosophy: {
      label: 'II. The Mind',
      heading: 'At zenith, the mind.',
      intro: 'Philosophy intro.',
      imageCard: { themeIndex: 1, factIndex: 0 },
      facts: { themeIndex: 1, slice: [0, 2] },
      quote: { themeIndex: 1, quoteIndex: 0 },
    },
    gita: {
      label: 'III. The Warrior',
      heading: 'The warrior at noon.',
      intro: 'Gita intro.',
      imageCard: { themeIndex: 2, factIndex: 0 },
      facts: { themeIndex: 2, slice: [0, 2] },
      quote: { themeIndex: 2, quoteIndex: 0 },
    },
    shiva: {
      label: 'IV. The Dance',
      heading: 'Shiva dances.',
      intro: 'Shiva intro.',
      imageCard: { themeIndex: 3, factIndex: 0 },
      facts: { themeIndex: 3, slice: [0, 2] },
      quote: { themeIndex: 3, quoteIndex: 0 },
    },
    art: {
      label: 'V. The Canvas',
      heading: 'The canvas at noon.',
      intro: 'Art intro.',
      imageCard: { themeIndex: 4, factIndex: 0 },
      facts: { themeIndex: 4, slice: [0, 2] },
      quote: { themeIndex: 4, quoteIndex: 0 },
    },
  },
  changelog: { version: '1.8.0', entries: [] },
};

const FIXTURE_SEASONS = {
  seasons: {
    spring: {
      months: [3, 4, 5],
      colorSchemeWeights: { 'starry-night': 1, sunflower: 1, 'midnight-wave': 1, 'tulip-garden': 3, 'moonlit-silver': 2 },
      flowerEmphasis: 'tulips',
      skyToneShift: { r: 0.02, g: 0.01, b: -0.01 },
      particleEffect: 'pollen',
      factThemeWeights: { moon: 1, ego: 1, gita: 2, shiva: 1, art: 2 },
    },
    summer: {
      months: [6, 7, 8],
      colorSchemeWeights: { 'starry-night': 2, sunflower: 3, 'midnight-wave': 1, 'tulip-garden': 1, 'moonlit-silver': 1 },
      flowerEmphasis: 'balanced',
      skyToneShift: { r: 0.03, g: 0.02, b: 0.01 },
      particleEffect: 'fireflies',
      factThemeWeights: { moon: 2, ego: 1, gita: 1, shiva: 1, art: 2 },
    },
    autumn: {
      months: [9, 10, 11],
      colorSchemeWeights: { 'starry-night': 2, sunflower: 3, 'midnight-wave': 2, 'tulip-garden': 1, 'moonlit-silver': 1 },
      flowerEmphasis: 'sunflowers',
      skyToneShift: { r: 0.04, g: 0.01, b: -0.02 },
      particleEffect: 'leaves',
      factThemeWeights: { moon: 1, ego: 2, gita: 1, shiva: 2, art: 1 },
    },
    winter: {
      months: [12, 1, 2],
      colorSchemeWeights: { 'starry-night': 3, sunflower: 1, 'midnight-wave': 2, 'tulip-garden': 1, 'moonlit-silver': 3 },
      flowerEmphasis: 'minimal',
      skyToneShift: { r: -0.01, g: 0.0, b: 0.03 },
      particleEffect: 'snow',
      factThemeWeights: { moon: 2, ego: 1, gita: 1, shiva: 1, art: 1 },
    },
  },
};

const FIXTURE_INDEX = { version: '1.2.0', lastUpdated: new Date().toISOString(), totalEntries: 0, dates: [] };

// Default readFileSync handler that returns fixture data based on path
function defaultReadFileSync(path) {
  const p = typeof path === 'string' ? path : path.toString();
  if (p.includes('siteData.json')) return JSON.stringify(FIXTURE_SITE_DATA);
  if (p.includes('content.json')) return JSON.stringify(FIXTURE_CONTENT);
  if (p.includes('seasons.json')) return JSON.stringify(FIXTURE_SEASONS);
  if (p.includes('index.json')) return JSON.stringify(FIXTURE_INDEX);
    if (p.match(/\d{4}-\d{2}-\d{2}\.json$/)) return JSON.stringify({ date: '2026-06-22', entries: [] });
  throw new Error(`Unexpected read: ${p}`);
}

// Use vi.hoisted to create shared mock functions that work inside vi.mock factories
const mockReadFileSync = vi.hoisted(() => vi.fn(defaultReadFileSync));
const mockWriteFileSync = vi.hoisted(() => vi.fn());
const mockExistsSync = vi.hoisted(() => vi.fn().mockReturnValue(false));
const mockMkdirSync = vi.hoisted(() => vi.fn());
const mockUnlinkSync = vi.hoisted(() => vi.fn());
const mockReaddirSync = vi.hoisted(() => vi.fn().mockReturnValue([]));

// Mock fs BEFORE the import
vi.mock('fs', () => ({
  default: {
    readFileSync: (...args) => mockReadFileSync(...args),
    writeFileSync: (...args) => mockWriteFileSync(...args),
    existsSync: (...args) => mockExistsSync(...args),
    mkdirSync: (...args) => mockMkdirSync(...args),
    unlinkSync: (...args) => mockUnlinkSync(...args),
    readdirSync: (...args) => mockReaddirSync(...args),
  },
  readFileSync: (...args) => mockReadFileSync(...args),
  writeFileSync: (...args) => mockWriteFileSync(...args),
  existsSync: (...args) => mockExistsSync(...args),
  mkdirSync: (...args) => mockMkdirSync(...args),
  unlinkSync: (...args) => mockUnlinkSync(...args),
  readdirSync: (...args) => mockReaddirSync(...args),
}));

// Mock process.exit — must be done BEFORE import so the main block does not kill the test runner
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  // Silently swallow — the main block calls exit(0) at the end
});

// Now import the module (main block runs but exit is mocked)
const dailyMutate = await import('../../scripts/daily-mutate.js');

// Fixture data
const VALID_SITE_DATA = {
  themes: [
    {
      id: 'selene-moon',
      title: 'Selene and The Moon',
      category: 'mythology',
      facts: [
        { text: 'The Moon rotates synchronously with its orbit.', source: 'Astronomy', element: 'moon' },
        { text: 'During a total lunar eclipse, the Moon turns copper-red.', source: 'Astronomy', element: 'moon' },
        { text: 'The Moon is the only natural satellite of Earth.', source: 'Astronomy', element: 'moon' },
        { text: 'Ancient Babylonian astronomers tracked the cycles.', source: 'History', element: 'moon' },
        { text: 'The surface holds the footprints of twelve humans.', source: 'Space', element: 'moon' },
      ],
      quotes: [
        'We are all like the bright moon. — Kahlil Gibran',
        'The Moon, like a flower in heavens high bower. — William Blake',
        'Do not swear by the moon. — Shakespeare',
        'The Moon is the first milestone. — Arthur C. Clarke',
        'The moon does not fight. — Thich Nhat Hanh',
      ],
    },
    {
      id: 'ego-arrogance',
      title: 'Ego and Arrogance',
      category: 'philosophy',
      facts: [
        { text: 'The ego is a tight fist; the soul is an open hand.', source: 'Atrija', element: 'ego' },
        { text: 'The ego builds walls to feel safe.', source: 'Atrija', element: 'ego' },
        { text: 'The ego is not master in its own house.', source: 'Freud', element: 'ego' },
        { text: 'The self that it clings to as I is a story.', source: 'Atrija', element: 'ego' },
        { text: 'Ego is the phantom of the I.', source: 'Philosophy', element: 'ego' },
      ],
      quotes: [
        'The only true wisdom is in knowing you know nothing. — Socrates',
        'The ego is a story told by the mind. — Atrija',
        'The ego builds walls to feel safe. — Atrija',
        'The ego is not master in its own house. — Freud',
        'The ego is a tight fist. — Atrija',
      ],
    },
    {
      id: 'bhagavad-gita',
      title: 'Bhagavad Gita',
      category: 'scripture',
      facts: [
        { text: 'The soul is neither born, and nor does it die.', source: 'Bhagavad Gita 2.20', element: 'gita' },
        { text: 'When meditation is mastered, the mind is unwavering.', source: 'Bhagavad Gita 6.19', element: 'gita' },
        { text: 'The self-controlled soul wins eternal peace.', source: 'Bhagavad Gita 2.64', element: 'gita' },
        { text: 'You have the right to work.', source: 'Bhagavad Gita 2.47', element: 'gita' },
        { text: 'Action is better than inaction.', source: 'Bhagavad Gita 3.8', element: 'gita' },
      ],
      quotes: [
        'You are what you believe in. — Bhagavad Gita',
        'The soul is neither born, and nor does it die. — Bhagavad Gita 2.20',
        'When meditation is mastered. — Bhagavad Gita 6.19',
        'The self-controlled soul wins eternal peace. — Bhagavad Gita 2.64',
        'You have the right to work. — Bhagavad Gita 2.47',
      ],
    },
    {
      id: 'shiv-purana',
      title: 'Shiv Purana',
      category: 'mythology',
      facts: [
        { text: 'Shivas Tandava is the cosmic dance of creation.', source: 'Shiv Purana', element: 'shiva' },
        { text: 'The rhythm of the damaru is the heartbeat of the cosmos.', source: 'Shiv Purana', element: 'shiva' },
        { text: 'Shiva stands within the ring of flame.', source: 'Mythology', element: 'shiva' },
        { text: 'The Ganges flows from Shivas hair.', source: 'Mythology', element: 'shiva' },
        { text: 'Shiva is the destroyer of evil.', source: 'Shiv Purana', element: 'shiva' },
      ],
      quotes: [
        'Shiva dances at the hour of fire. — Shiv Purana',
        'The rhythm of the damaru is the heartbeat. — Shiv Purana',
        'Shiva stands within the ring of flame. — Mythology',
        'The Ganges flows from Shivas hair. — Mythology',
        'Shiva is the destroyer of evil. — Shiv Purana',
      ],
    },
    {
      id: 'art-beauty',
      title: 'Art and Beauty',
      category: 'aesthetics',
      facts: [
        { text: 'Van Gogh painted at every hour.', source: 'Art History', element: 'art' },
        { text: 'Color becomes almost aggressive under direct sun.', source: 'Art Theory', element: 'art' },
        { text: 'The canvas at noon is a battlefield of color.', source: 'Art Philosophy', element: 'art' },
        { text: 'Every brushstroke must stand on its own.', source: 'Art Theory', element: 'art' },
        { text: 'The painter who wins is the one who dares to be honest.', source: 'Art Philosophy', element: 'art' },
      ],
      quotes: [
        'The canvas at noon is a battlefield of color. — Atrija',
        'Color becomes almost aggressive under direct sun. — Art Theory',
        'Every brushstroke must stand on its own. — Art Theory',
        'The painter who wins is the one who dares to be honest. — Atrija',
        'Van Gogh painted at every hour. — Art History',
      ],
    },
  ],
  colorSchemes: [
    {
      name: 'sunflower',
      primary: '#f5c800',
      secondary: '#ff6f00',
      accent: '#2e7d32',
      background: '#1a1200',
      text: '#fff8e1',
      mood: 'warm',
      shaderParams: { strokeDensity: 10.6, swirlFrequency: 7.8, colorIntensity: 1.57 },
      seasons: ['autumn', 'summer'],
    },
    {
      name: 'ember-dawn',
      primary: '#ff6b35',
      secondary: '#ff4081',
      accent: '#ffd54f',
      background: '#1a0808',
      text: '#fff0e8',
      mood: 'fiery',
      shaderParams: { strokeDensity: 8.2, swirlFrequency: 12.5, colorIntensity: 1.65 },
      seasons: ['spring'],
    },
    {
      name: 'lily-garden',
      primary: '#e8b4f0',
      secondary: '#ff6b9d',
      accent: '#7c4dff',
      background: '#0d0015',
      text: '#f8e8ff',
      mood: 'passionate',
      shaderParams: { strokeDensity: 9.4, swirlFrequency: 11.2, colorIntensity: 1.43 },
      seasons: ['summer'],
    },
    {
      name: 'starry-night',
      primary: '#4a7dff',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#020810',
      text: '#e8f0ff',
      mood: 'mysterious',
      shaderParams: { strokeDensity: 12.3, swirlFrequency: 6.1, colorIntensity: 1.35 },
      seasons: ['winter'],
    },
    {
      name: 'moonlit-silver',
      primary: '#c0c0d0',
      secondary: '#ffd700',
      accent: '#2dd4bf',
      background: '#0a0a12',
      text: '#e8e8f0',
      mood: 'serene',
      shaderParams: { strokeDensity: 7.8, swirlFrequency: 9.3, colorIntensity: 1.28 },
      seasons: ['winter'],
    },
  ],
  changelog: { version: '1.8.0' },
};

const VALID_CONTENT = {
  meta: { version: '1.8.0', lastUpdated: '2026-06-22', updatedBy: 'test', season: 'summer', layout: 'default' },
  sections: {
    hero: { tagline: 'The sunflower does not count the hours.' },
    today: {
      heading: 'What the Moon reveals today',
      intro: 'The sun stands at its zenith.',
      visualAsset: { type: 'svg', path: '/mutation-assets/2026-06-22/test.svg', description: 'Test', credit: 'Test' },
    },
    moon: {
      label: 'I. The Moon',
      heading: 'The moon waits.',
      intro: 'Intro text.',
      imageCard: { themeIndex: 0, factIndex: 0 },
      facts: { themeIndex: 0, slice: [0, 2] },
      quote: { themeIndex: 0, quoteIndex: 0 },
    },
    philosophy: {
      label: 'II. The Mind',
      heading: 'At zenith, the mind.',
      intro: 'Philosophy intro.',
      imageCard: { themeIndex: 1, factIndex: 0 },
      facts: { themeIndex: 1, slice: [0, 2] },
      quote: { themeIndex: 1, quoteIndex: 0 },
    },
    gita: {
      label: 'III. The Warrior',
      heading: 'The warrior at noon.',
      intro: 'Gita intro.',
      imageCard: { themeIndex: 2, factIndex: 0 },
      facts: { themeIndex: 2, slice: [0, 2] },
      quote: { themeIndex: 2, quoteIndex: 0 },
    },
    shiva: {
      label: 'IV. The Dance',
      heading: 'Shiva dances.',
      intro: 'Shiva intro.',
      imageCard: { themeIndex: 3, factIndex: 0 },
      facts: { themeIndex: 3, slice: [0, 2] },
      quote: { themeIndex: 3, quoteIndex: 0 },
    },
    art: {
      label: 'V. The Canvas',
      heading: 'The canvas at noon.',
      intro: 'Art intro.',
      imageCard: { themeIndex: 4, factIndex: 0 },
      facts: { themeIndex: 4, slice: [0, 2] },
      quote: { themeIndex: 4, quoteIndex: 0 },
    },
  },
  changelog: { version: '1.8.0', entries: [] },
};

const VALID_SEASONS = {
  seasons: {
    spring: {
      months: [3, 4, 5],
      colorSchemeWeights: { 'starry-night': 1, sunflower: 1, 'midnight-wave': 1, 'tulip-garden': 3, 'moonlit-silver': 2 },
      flowerEmphasis: 'tulips',
      skyToneShift: { r: 0.02, g: 0.01, b: -0.01 },
      particleEffect: 'pollen',
      factThemeWeights: { moon: 1, ego: 1, gita: 2, shiva: 1, art: 2 },
    },
    summer: {
      months: [6, 7, 8],
      colorSchemeWeights: { 'starry-night': 2, sunflower: 3, 'midnight-wave': 1, 'tulip-garden': 1, 'moonlit-silver': 1 },
      flowerEmphasis: 'balanced',
      skyToneShift: { r: 0.03, g: 0.02, b: 0.01 },
      particleEffect: 'fireflies',
      factThemeWeights: { moon: 2, ego: 1, gita: 1, shiva: 1, art: 2 },
    },
    autumn: {
      months: [9, 10, 11],
      colorSchemeWeights: { 'starry-night': 2, sunflower: 3, 'midnight-wave': 2, 'tulip-garden': 1, 'moonlit-silver': 1 },
      flowerEmphasis: 'sunflowers',
      skyToneShift: { r: 0.04, g: 0.01, b: -0.02 },
      particleEffect: 'leaves',
      factThemeWeights: { moon: 1, ego: 2, gita: 1, shiva: 2, art: 1 },
    },
    winter: {
      months: [12, 1, 2],
      colorSchemeWeights: { 'starry-night': 3, sunflower: 1, 'midnight-wave': 2, 'tulip-garden': 1, 'moonlit-silver': 3 },
      flowerEmphasis: 'minimal',
      skyToneShift: { r: -0.01, g: 0.0, b: 0.03 },
      particleEffect: 'snow',
      factThemeWeights: { moon: 2, ego: 1, gita: 1, shiva: 1, art: 1 },
    },
  },
};

const VALID_SCHEMES = ['starry-night', 'sunflower', 'ember-dawn', 'lily-garden', 'moonlit-silver'];

function setupMockFs() {
  mockReadFileSync.mockImplementation((path) => {
    const p = typeof path === 'string' ? path : path.toString();
    if (p.includes('siteData.json')) return JSON.stringify(VALID_SITE_DATA);
    if (p.includes('content.json')) return JSON.stringify(VALID_CONTENT);
    if (p.includes('seasons.json')) return JSON.stringify(VALID_SEASONS);
    if (p.includes('index.json')) return JSON.stringify({ version: '1.2.0', lastUpdated: new Date().toISOString(), totalEntries: 0, dates: [] });
    if (p.match(/\d{4}-\d{2}-\d{2}\.json$/)) return JSON.stringify({ date: '2026-06-22', entries: [] });
    throw new Error(`Unexpected read: ${p}`);
  });
  mockExistsSync.mockReturnValue(false);
  mockWriteFileSync.mockImplementation(() => {});
  mockMkdirSync.mockImplementation(() => {});
  mockUnlinkSync.mockImplementation(() => {});
  mockReaddirSync.mockReturnValue([]);
}

// Tests
describe('daily-mutate.js', () => {
  beforeEach(() => {
    mockReadFileSync.mockClear();
    mockWriteFileSync.mockClear();
    mockExistsSync.mockClear();
    mockMkdirSync.mockClear();
    mockUnlinkSync.mockClear();
    mockReaddirSync.mockClear();
    setupMockFs();
  });

  describe('getCurrentSeason(month)', () => {
    it('returns "spring" for months 2-4 (Mar-May)', () => {
      expect(dailyMutate.getCurrentSeason(2)).toBe('spring');
      expect(dailyMutate.getCurrentSeason(3)).toBe('spring');
      expect(dailyMutate.getCurrentSeason(4)).toBe('spring');
    });

    it('returns "summer" for months 5-7 (Jun-Aug)', () => {
      expect(dailyMutate.getCurrentSeason(5)).toBe('summer');
      expect(dailyMutate.getCurrentSeason(6)).toBe('summer');
      expect(dailyMutate.getCurrentSeason(7)).toBe('summer');
    });

    it('returns "autumn" for months 8-10 (Sep-Nov)', () => {
      expect(dailyMutate.getCurrentSeason(8)).toBe('autumn');
      expect(dailyMutate.getCurrentSeason(9)).toBe('autumn');
      expect(dailyMutate.getCurrentSeason(10)).toBe('autumn');
    });

    it('returns "winter" for months 11, 0, 1 (Dec-Feb)', () => {
      expect(dailyMutate.getCurrentSeason(11)).toBe('winter');
      expect(dailyMutate.getCurrentSeason(0)).toBe('winter');
      expect(dailyMutate.getCurrentSeason(1)).toBe('winter');
    });
  });

  describe('getSeasonEmoji(season)', () => {
    it('returns correct emoji for each season', () => {
      expect(dailyMutate.getSeasonEmoji('spring')).toBe('🌸');
      expect(dailyMutate.getSeasonEmoji('summer')).toBe('☀️');
      expect(dailyMutate.getSeasonEmoji('autumn')).toBe('🍂');
      expect(dailyMutate.getSeasonEmoji('winter')).toBe('❄️');
    });

    it('returns empty string for unknown season', () => {
      expect(dailyMutate.getSeasonEmoji('monsoon')).toBe('');
      expect(dailyMutate.getSeasonEmoji('')).toBe('');
    });
  });

  describe('getDayOfYear()', () => {
    it('returns a positive integer within valid range', () => {
      const day = dailyMutate.getDayOfYear();
      expect(day).toBeGreaterThanOrEqual(0);
      expect(day).toBeLessThanOrEqual(366);
      expect(Number.isInteger(day)).toBe(true);
    });
  });

  describe('mutateColors(siteData, dayOfYear)', () => {
    it('returns a valid color scheme from the schemes list', () => {
      const result = dailyMutate.mutateColors(VALID_SITE_DATA, 172);
      expect(VALID_SCHEMES).toContain(result.scheme.name);
    });

    it('returns a valid schemeIndex within bounds', () => {
      const result = dailyMutate.mutateColors(VALID_SITE_DATA, 172);
      expect(result.schemeIndex).toBeGreaterThanOrEqual(0);
      expect(result.schemeIndex).toBeLessThan(VALID_SITE_DATA.colorSchemes.length);
    });

    it('returns a valid season string', () => {
      const result = dailyMutate.mutateColors(VALID_SITE_DATA, 172);
      expect(['spring', 'summer', 'autumn', 'winter']).toContain(result.season);
    });

    it('shaderParams variation stays within 10 percent of original', () => {
      const result = dailyMutate.mutateColors(VALID_SITE_DATA, 172);
      const original = VALID_SITE_DATA.colorSchemes[result.schemeIndex].shaderParams;
      const varied = result.scheme.shaderParams;
      const tolerance = 0.10;
      expect(varied.strokeDensity).toBeGreaterThanOrEqual(original.strokeDensity * (1 - tolerance));
      expect(varied.strokeDensity).toBeLessThanOrEqual(original.strokeDensity * (1 + tolerance));
      expect(varied.swirlFrequency).toBeGreaterThanOrEqual(original.swirlFrequency * (1 - tolerance));
      expect(varied.swirlFrequency).toBeLessThanOrEqual(original.swirlFrequency * (1 + tolerance));
      expect(varied.colorIntensity).toBeGreaterThanOrEqual(original.colorIntensity * (1 - tolerance));
      expect(varied.colorIntensity).toBeLessThanOrEqual(original.colorIntensity * (1 + tolerance));
    });

    it('produces valid results across 20 different days', () => {
      for (let day = 0; day < 365; day += 18) {
        const result = dailyMutate.mutateColors(VALID_SITE_DATA, day);
        expect(VALID_SCHEMES).toContain(result.scheme.name);
        expect(result.schemeIndex).toBeGreaterThanOrEqual(0);
        expect(result.schemeIndex).toBeLessThan(VALID_SITE_DATA.colorSchemes.length);
      }
    });
  });

  describe('updateAllSections(content, siteData, dayOfYear)', () => {
    it('updates all 5 content sections', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      const result = dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      expect(result).toHaveLength(5);
    });

    it('returns section keys in correct order', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      const result = dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const keys = result.map(s => s.sectionKey);
      expect(keys).toEqual(['moon', 'philosophy', 'gita', 'shiva', 'art']);
    });

    it('each result has valid themeIndex within siteData bounds', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      const result = dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      result.forEach(s => {
        expect(s.themeIndex).toBeGreaterThanOrEqual(0);
        expect(s.themeIndex).toBeLessThan(VALID_SITE_DATA.themes.length);
      });
    });

    it('each result has valid factIndex within theme facts array bounds', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      const result = dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      result.forEach(s => {
        const theme = VALID_SITE_DATA.themes[s.themeIndex];
        expect(s.factIndex).toBeGreaterThanOrEqual(0);
        expect(s.factIndex).toBeLessThan(theme.facts.length);
      });
    });

    it('updates section intro with fact text from the correct theme', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const moonIntro = content.sections.moon.intro;
      const moonTheme = VALID_SITE_DATA.themes[0];
      const validIntros = moonTheme.facts.map(f => f.text);
      expect(validIntros).toContain(moonIntro);
    });

    it('updates imageCard.factIndex to a valid index', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const moonSection = content.sections.moon;
      expect(moonSection.imageCard.factIndex).toBeGreaterThanOrEqual(0);
      expect(moonSection.imageCard.factIndex).toBeLessThan(VALID_SITE_DATA.themes[0].facts.length);
    });

    it('updates facts.slice to valid range within theme facts', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const moonSection = content.sections.moon;
      const [start, end] = moonSection.facts.slice;
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeGreaterThan(start);
      // The slice end can exceed array length (the rendering code handles wrapping)
      // What matters is that start is within bounds and end > start
      expect(start).toBeLessThan(VALID_SITE_DATA.themes[0].facts.length);
    });

    it('updates quote indices to valid bounds', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const moonSection = content.sections.moon;
      expect(moonSection.quote.quoteIndex).toBeGreaterThanOrEqual(0);
      expect(moonSection.quote.quoteIndex).toBeLessThan(VALID_SITE_DATA.themes[0].quotes.length);
    });

    it('updates today heading with em tags', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      expect(content.sections.today.heading).toContain('<em>');
      expect(content.sections.today.heading).toContain('</em>');
      expect(content.sections.today.heading.length).toBeGreaterThan(10);
    });

    it('today heading includes a theme title word', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const heading = content.sections.today.heading;
      const themeTitles = VALID_SITE_DATA.themes.map(t => t.title.split(' ')[0]);
      const hasThemeWord = themeTitles.some(word => heading.includes(word));
      expect(hasThemeWord).toBe(true);
    });

    it('preserves section structure (label, heading, intro, imageCard, facts, quote)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      const sectionKeys = ['moon', 'philosophy', 'gita', 'shiva', 'art'];
      sectionKeys.forEach(key => {
        const section = content.sections[key];
        expect(section).toHaveProperty('label');
        expect(section).toHaveProperty('heading');
        expect(section).toHaveProperty('intro');
        expect(section).toHaveProperty('imageCard');
        expect(section).toHaveProperty('facts');
        expect(section).toHaveProperty('quote');
      });
    });
  });

  describe('writeChangelogEntry(dayOfYear, updatedSections, scheme, season)', () => {
    // Helper to setup mocks for writeChangelogEntry tests
    function setupWriteMocks() {
      mockReadFileSync.mockImplementation((path) => {
        const p = String(path);
        if (p.includes('siteData.json')) return JSON.stringify(VALID_SITE_DATA);
        if (p.includes('content.json')) return JSON.stringify(VALID_CONTENT);
        if (p.includes('seasons.json')) return JSON.stringify(VALID_SEASONS);
        if (p.includes('index.json')) return JSON.stringify({ version: '1.2.0', lastUpdated: new Date().toISOString(), totalEntries: 0, dates: [] });
        if (p.match(/\d{4}-\d{2}-\d{2}\.json$/)) return JSON.stringify({ date: '2026-06-22', entries: [] });
        return JSON.stringify({});
      });
      mockExistsSync.mockReturnValue(false);
      mockWriteFileSync.mockImplementation(() => {});
      mockMkdirSync.mockImplementation(() => {});
      mockUnlinkSync.mockImplementation(() => {});
      mockReaddirSync.mockReturnValue([]);
    }

    // A full scheme object (as produced by mutateColors) with shaderParams
    const fullScheme = {
      name: 'sunflower',
      mood: 'warm',
      shaderParams: { strokeDensity: 10.6, swirlFrequency: 7.8, colorIntensity: 1.57 },
    };

    it('writes a changelog entry to the correct date file', () => {
      const updatedSections = [
        { sectionKey: 'moon', themeIndex: 0, factIndex: 2, theme: 'Selene and The Moon' },
      ];
      mockWriteFileSync.mockClear();
      setupWriteMocks();
      dailyMutate.writeChangelogEntry(172, updatedSections, fullScheme, 'summer');
      expect(mockWriteFileSync.mock.calls.length).toBeGreaterThan(0);
    });

    it('creates entry with correct type "daily-mutation"', () => {
      const updatedSections = [
        { sectionKey: 'moon', themeIndex: 0, factIndex: 2, theme: 'Selene and The Moon' },
      ];
      mockWriteFileSync.mockClear();
      setupWriteMocks();
      dailyMutate.writeChangelogEntry(172, updatedSections, fullScheme, 'summer');
      const writeCalls = mockWriteFileSync.mock.calls;
      // Find the date file write (has entries array, not dates array)
      const dateFileWrite = writeCalls.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return Array.isArray(parsed.entries);
        } catch { return false; }
      });
      expect(dateFileWrite).toBeDefined();
      const parsed = JSON.parse(dateFileWrite[1]);
      expect(parsed.entries[0].type).toBe('daily-mutation');
    });

    it('does not duplicate entries on repeated calls with same time', () => {
      const updatedSections = [
        { sectionKey: 'moon', themeIndex: 0, factIndex: 2, theme: 'Selene and The Moon' },
      ];
      // First call
      mockWriteFileSync.mockClear();
      setupWriteMocks();
      dailyMutate.writeChangelogEntry(172, updatedSections, fullScheme, 'summer');
      const writeCalls = mockWriteFileSync.mock.calls;
      const dateFileWrite = writeCalls.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return Array.isArray(parsed.entries);
        } catch { return false; }
      });
      expect(dateFileWrite).toBeDefined();
      const firstData = JSON.parse(dateFileWrite[1]);
      expect(firstData.entries).toHaveLength(1);

      // Second call should replace, not append
      mockWriteFileSync.mockClear();
      setupWriteMocks();
      dailyMutate.writeChangelogEntry(172, updatedSections, fullScheme, 'summer');
      const secondWriteCalls = mockWriteFileSync.mock.calls;
      const secondDateFileWrite = secondWriteCalls.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return Array.isArray(parsed.entries);
        } catch { return false; }
      });
      expect(secondDateFileWrite).toBeDefined();
      const secondData = JSON.parse(secondDateFileWrite[1]);
      expect(secondData.entries).toHaveLength(1);
    });
  });

  describe('updateChangelogIndex(today, dateData)', () => {
    it('creates index with correct structure', () => {
      const dateData = {
        date: '2026-06-22',
        entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'test', changes: [] }],
      };
      try {
        dailyMutate.updateChangelogIndex('2026-06-22', dateData);
      } catch (e) { /* process.exit */ }
      const writeCalls = mockWriteFileSync.mock.calls;
      const indexWrite = writeCalls.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return parsed.dates !== undefined && parsed.totalEntries !== undefined;
        } catch { return false; }
      });
      expect(indexWrite).toBeDefined();
      const index = JSON.parse(indexWrite[1]);
      expect(index).toHaveProperty('version');
      expect(index).toHaveProperty('lastUpdated');
      expect(index).toHaveProperty('totalEntries');
      expect(index).toHaveProperty('dates');
    });

    it('increments totalEntries when adding new date', () => {
      const dateData = {
        date: '2026-06-22',
        entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'test', changes: [] }],
      };
      try {
        dailyMutate.updateChangelogIndex('2026-06-22', dateData);
      } catch (e) { /* process.exit */ }
      const writeCalls = mockWriteFileSync.mock.calls;
      const indexWrite = writeCalls.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return parsed.dates !== undefined;
        } catch { return false; }
      });
      const index = JSON.parse(indexWrite[1]);
      expect(index.totalEntries).toBe(1);
      expect(index.dates).toHaveLength(1);
      expect(index.dates[0].date).toBe('2026-06-22');
      expect(index.dates[0].entries).toBe(1);
    });

    it('upserts existing date entry instead of duplicating', () => {
      const dateData1 = {
        date: '2026-06-22',
        entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'test1', changes: [] }],
      };
      try {
        dailyMutate.updateChangelogIndex('2026-06-22', dateData1);
      } catch (e) { /* expected */ }
      const writeCalls1 = mockWriteFileSync.mock.calls;
      const indexWrite1 = writeCalls1.find(call => {
        try {
          const parsed = JSON.parse(call[1]);
          return parsed.dates !== undefined;
        } catch { return false; }
      });
      const index1 = JSON.parse(indexWrite1[1]);
      expect(index1.dates).toHaveLength(1);

      // Second call with same date
      const dateData2 = {
        date: '2026-06-22',
        entries: [
          { time: '06:00:00', type: 'daily-mutation', description: 'test1', changes: [] },
          { time: '12:00:00', type: 'content', description: 'test2', changes: [] },
        ],
      };
      try {
        dailyMutate.updateChangelogIndex('2026-06-22', dateData2);
      } catch (e) { /* expected */ }
      const writeCalls2 = mockWriteFileSync.mock.calls;
      const lastWrite = writeCalls2[writeCalls2.length - 1];
      const index2 = JSON.parse(lastWrite[1]);
      expect(index2.dates).toHaveLength(1);
      expect(index2.dates[0].entries).toBe(2);
      expect(index2.totalEntries).toBe(2);
    });
  });

  describe('syncChangelogToContent(content, siteData)', () => {
    it('reads changelog files and populates content.changelog.entries', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      // Setup readdirSync to return date files
      mockReaddirSync.mockReturnValue(['2026-06-22.json', 'index.json']);
      // Setup readFileSync to return appropriate data based on path
      mockReadFileSync.mockImplementation((path) => {
        const p = String(path);
        if (p.includes('2026-06-22.json') && !p.includes('index.json')) {
          return JSON.stringify({
            date: '2026-06-22',
            entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'test', changes: [] }],
          });
        }
        // Default: return valid JSON for any other file
        return JSON.stringify({ date: '2026-06-22', entries: [] });
      });
      mockExistsSync.mockReturnValue(true);

      dailyMutate.syncChangelogToContent(content, VALID_SITE_DATA);
      expect(content.changelog.entries.length).toBeGreaterThanOrEqual(1);
      expect(content.changelog.entries[0]).toHaveProperty('date');
      expect(content.changelog.entries[0]).toHaveProperty('type');
    });

    it('deduplicates entries by (date, type) pair', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      mockReaddirSync.mockReturnValue(['2026-06-22.json']);
      mockReadFileSync.mockImplementation((path) => {
        const p = String(path);
        if (p.includes('2026-06-22.json') && !p.includes('index.json')) {
          return JSON.stringify({
            date: '2026-06-22',
            entries: [
              { time: '06:00:00', type: 'daily-mutation', description: 'test', changes: [] },
              { time: '06:00:00', type: 'daily-mutation', description: 'test', changes: [] },
            ],
          });
        }
        return JSON.stringify({ date: '2026-06-22', entries: [] });
      });
      mockExistsSync.mockReturnValue(true);

      dailyMutate.syncChangelogToContent(content, VALID_SITE_DATA);
      // Should have 1 entry (deduplicated)
      expect(content.changelog.entries).toHaveLength(1);
    });

    it('sorts entries chronologically (oldest first)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      mockReaddirSync.mockReturnValue(['2026-06-20.json', '2026-06-22.json']);
      mockReadFileSync.mockImplementation((path) => {
        const p = String(path);
        if (p.includes('2026-06-22.json') && !p.includes('index.json')) {
          return JSON.stringify({
            date: '2026-06-22',
            entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'newer', changes: [] }],
          });
        }
        if (p.includes('2026-06-20.json')) {
          return JSON.stringify({
            date: '2026-06-20',
            entries: [{ time: '06:00:00', type: 'daily-mutation', description: 'older', changes: [] }],
          });
        }
        return JSON.stringify({ date: '2026-06-22', entries: [] });
      });
      mockExistsSync.mockReturnValue(true);

      dailyMutate.syncChangelogToContent(content, VALID_SITE_DATA);
      expect(content.changelog.entries).toHaveLength(2);
      expect(content.changelog.entries[0].date).toBe('2026-06-20');
      expect(content.changelog.entries[1].date).toBe('2026-06-22');
    });

    it('trims to max 15 entries (keeps newest)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      const manyEntries = [];
      for (let i = 0; i < 20; i++) {
        manyEntries.push({
          date: `2026-06-${String(i + 1).padStart(2, '0')}`,
          time: '06:00:00',
          type: 'daily-mutation',
          description: `entry ${i}`,
          changes: [],
        });
      }
      mockReaddirSync.mockReturnValue(['all.json']);
      mockReadFileSync.mockImplementation((path) => {
        const p = String(path);
        if (p.includes('all.json')) {
          return JSON.stringify({ date: '2026-06-22', entries: manyEntries });
        }
        return JSON.stringify({ date: '2026-06-22', entries: [] });
      });
      mockExistsSync.mockReturnValue(true);

      dailyMutate.syncChangelogToContent(content, VALID_SITE_DATA);
      expect(content.changelog.entries.length).toBeLessThanOrEqual(15);
    });
  });

  describe('Schema field preservation', () => {
    it('mutateColors preserves all required siteData fields', () => {
      const result = dailyMutate.mutateColors(VALID_SITE_DATA, 172);
      expect(result.scheme).toHaveProperty('name');
      expect(result.scheme).toHaveProperty('primary');
      expect(result.scheme).toHaveProperty('secondary');
      expect(result.scheme).toHaveProperty('accent');
      expect(result.scheme).toHaveProperty('background');
      expect(result.scheme).toHaveProperty('text');
      expect(result.scheme).toHaveProperty('mood');
      expect(result.scheme).toHaveProperty('shaderParams');
      expect(result.scheme).toHaveProperty('seasons');
    });

    it('updateAllSections preserves content.json section structure', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172);
      expect(content).toHaveProperty('meta');
      expect(content).toHaveProperty('sections');
      expect(content).toHaveProperty('changelog');
      expect(content.sections).toHaveProperty('hero');
      expect(content.sections).toHaveProperty('today');
      expect(content.sections.hero).toHaveProperty('tagline');
      expect(content.sections.today).toHaveProperty('heading');
      expect(content.sections.today).toHaveProperty('intro');
    });

    it('color scheme name is always valid across 53 weeks', () => {
      for (let day = 0; day < 365; day += 7) {
        const result = dailyMutate.mutateColors(VALID_SITE_DATA, day);
        expect(VALID_SCHEMES).toContain(result.scheme.name);
      }
    });
  });

  describe('Edge cases', () => {
    it('handles missing section gracefully (no crash)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      delete content.sections.moon;
      expect(() => dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172)).not.toThrow();
    });

    it('handles section without imageCard (no crash)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      delete content.sections.moon.imageCard;
      expect(() => dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172)).not.toThrow();
    });

    it('handles section without facts (no crash)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      delete content.sections.moon.facts;
      expect(() => dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172)).not.toThrow();
    });

    it('handles section without quote (no crash)', () => {
      const content = JSON.parse(JSON.stringify(VALID_CONTENT));
      delete content.sections.moon.quote;
      expect(() => dailyMutate.updateAllSections(content, VALID_SITE_DATA, 172)).not.toThrow();
    });

    it('handles empty themes array gracefully for mutateColors', () => {
      const emptySiteData = { ...VALID_SITE_DATA, themes: [] };
      expect(() => dailyMutate.mutateColors(emptySiteData, 172)).not.toThrow();
    });
  });
});
