import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { JSDOM } from 'jsdom'

// Mock requestIdleCallback as immediate callback
const mockRequestIdleCallback = (cb) => {
  if (typeof cb === 'function') {
    cb()
  }
}

// Load the module under test
let cs
let dom
let window
let document

describe('content-search.js', () => {
  beforeEach(() => {
    // Set up jsdom environment
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
    window = dom.window
    global.window = window
    global.document = window.document

    // Mock requestIdleCallback
    global.requestIdleCallback = mockRequestIdleCallback

    // Mock fetch
    global.fetch = vi.fn()

    // Import the module (it will run the IIFE and attach exports)
    // Since the module uses window/document, we need to require after setting globals
    // Reset module cache to avoid cross-test pollution
    delete require.cache[require.resolve('../../public/js/content-search.js')]
    cs = require('../../public/js/content-search.js')
  })

  afterEach(() => {
    // Restore globals
    delete global.window
    delete global.document
    delete global.requestIdleCallback
    delete global.fetch
  })

  describe('normalize', () => {
    it('lowercases and strips HTML tags', () => {
      expect(cs.normalize('<Hello> WORLD!')).toBe('hello world')
    })
    it('removes non-word/space characters', () => {
      expect(cs.normalize('Test@#$%^&*()')).toBe('test')
    })
    it('collapses whitespace', () => {
      expect(cs.normalize('a   b    c')).toBe('a b c')
    })
    it('trims', () => {
      expect(cs.normalize('  hello  ')).toBe('hello')
    })
  })

  describe('scoreMatch', () => {
    it('returns 0 for no match', () => {
      expect(cs.scoreMatch('hello world', ['foo', 'bar'])).toBe(0)
    })
    it('returns count of matching words', () => {
      expect(cs.scoreMatch('hello world foo', ['hello', 'bar'])).toBe(1)
      expect(cs.scoreMatch('hello world foo', ['hello', 'world'])).toBe(2)
    })
    it('adds bonus for exact phrase', () => {
      expect(cs.scoreMatch('hello world foo', ['hello', 'world'])).toBe(4) // 2 matches + 2 bonus
    })
  })

  describe('highlightMatch', () => {
    it('wraps matches in <mark>', () => {
      const result = cs.highlightMatch('Hello <b>world</b>', ['world'])
      expect(result).toContain('<mark>world</mark>')
      // Ensure HTML escaped
      expect(result).not.toContain('<b>')
    })
    it('handles multiple words', () => {
      const result = cs.highlightMatch('Hello world foo', ['hello', 'foo'])
      expect(result).toContain('<mark>Hello</mark>')
      expect(result).toContain('<mark>foo</mark>')
    })
    it('escapes regex special chars', () => {
      const result = cs.highlightMatch('test [abc] xyz', ['[abc]'])
      expect(result).toBe('test <mark>[abc]</mark> xyz')
    })
  })

  describe('truncate', () => {
    it('returns unchanged if within limit', () => {
      expect(cs.truncate('short', 10)).toBe('short')
    })
    it('truncates at word boundary and adds ellipsis', () => {
      expect(cs.truncate('This is a long sentence', 10)).toBe('This is…')
    })
    it('handles empty string', () => {
      expect(cs.truncate('', 5)).toBe('')
    })
  })

  describe('search (unit)', () => {
    beforeEach(() => {
      // Manually set up index for testing
      cs.__setCache(
        [
          {
            text: 'Hello world',
            source: '',
            type: 'fact',
            themeIndex: 0,
            themeLabel: 'Theme1',
            sectionId: 'sec1',
            sectionLabel: 'Section One',
          },
          {
            text: 'Another example',
            source: '',
            type: 'quote',
            themeIndex: 0,
            themeLabel: 'Theme1',
            sectionId: 'sec1',
            sectionLabel: 'Section One',
          },
        ],
        true,
        ['Theme1'],
        { moon: 'moon', philosophy: 'philosophy' },
        { moon: 'I. The Moon', philosophy: 'II. The Waves' }
      )
    })

    it('returns empty for empty query', () => {
      expect(cs.search('')).toEqual([])
      expect(cs.search('   ')).toEqual([])
    })
    it('matches and scores correctly', () => {
      const res = cs.search('hello')
      expect(res.length).toBe(1)
      expect(res[0].text).toBe('Hello world')
      expect(res[0].score).toBeGreaterThan(0)
    })
    it('ranks higher score first', () => {
      // Add a doc with higher score
      cs.__setCache(
        [
          { text: 'Hello world', source: '', type: 'fact', themeIndex: 0, themeLabel: 'T1', sectionId: 's1', sectionLabel: 'S1' },
          { text: 'Hello world hello', source: '', type: 'fact', themeIndex: 0, themeLabel: 'T1', sectionId: 's1', sectionLabel: 'S1' }, // two hello words
        ],
        true,
        ['T1'],
        { moon: 'moon' },
        { moon: 'M' }
      )
      const res = cs.search('hello')
      // Expect the higher score first
      expect(res[0].text).toBe('Hello world hello')
    })
    it('deduplicates by normalized text', () => {
      cs.__setCache(
        [
          { text: 'Hello', source: '', type: 'fact', themeIndex: 0, themeLabel: 'T1', sectionId: 's1', sectionLabel: 'S1' },
          { text: 'HELLO!!!', source: '', type: 'fact', themeIndex: 0, themeLabel: 'T1', sectionId: 's1', sectionLabel: 'S1' },
        ],
        true,
        ['T1'],
        { moon: 'moon' },
        { moon: 'M' }
      )
      const res = cs.search('hello')
      expect(res.length).toBe(1)
    })
    it('caps at 30 results', () => {
      // create 35 identical matches
      const items = Array.from({ length: 35 }, (_, i) => ({
        text: `Item ${i}`,
        source: '',
        type: 'fact',
        themeIndex: 0,
        themeLabel: 'T1',
        sectionId: 's1',
        sectionLabel: 'S1',
      }))
      cs.__setCache(items, true, ['T1'], { moon: 'moon' }, { moon: 'M' })
      const res = cs.search('Item')
      expect(res.length).toBe(30)
    })
  })

  describe('buildIndex', () => {
    it('calls fetch for siteData, content, and koans', async () => {
      const mockSiteData = { themes: [{ title: 'Theme1', facts: [{ text: 'Fact1' }], quotes: ['Quote1'] }] }
      const mockContent = { sections: { moon: { heading: 'H', intro: 'I' } } }
      const mockKoans = { koans: [{ text: 'Koan1', source: 'S', interpretation: 'I' }] }

      global.fetch.mockImplementationOnce((url) => {
        if (url.endsWith('siteData.json')) return Promise.resolve({ json: () => Promise.resolve(mockSiteData) })
        if (url.endsWith('content.json')) return Promise.resolve({ json: () => Promise.resolve(mockContent) })
        if (url.endsWith('koans.json')) return Promise.resolve({ json: () => Promise.resolve(mockKoans) })
        return Promise.reject(new Error('Unexpected URL'))
      })

      // Call buildIndex (should be triggered via requestIdleCallback in init, but we can call directly)
      cs.buildIndex()

      // Since requestIdleCallback is mocked to call synchronously, the index should be built now
      expect(global.fetch).toHaveBeenCalledTimes(3)
      // Check internal state via __getCache
      const cache = cs.__getCache()
      expect(cache.CONTENT_INDEX.length).toBeGreaterThan(0)
      expect(cache.INDEX_BUILT).toBe(true)
    })
  })

  describe('assembleIndex', () => {
    it('builds correct index structure', () => {
      const siteData = {
        themes: [
          { title: 'Theme1', facts: [{ text: 'Fact1', source: 'Src1' }], quotes: ['Quote1'] },
          { title: 'Theme2', facts: [], quotes: [] },
        ],
      }
      const content = {
        sections: {
          moon: { heading: '<h1>Heading</h1>', intro: 'Intro text' },
          philosophy: {},
          gita: {},
          shiva: {},
          art: {},
          today: { heading: 'Today' },
        },
      }
      const koans = { koans: [{ text: 'Koan text', source: 'Koan src', interpretation: 'Interp' }] }

      cs.assembleIndex(siteData, content, koans)
      const cache = cs.__getCache()
      const idx = cache.CONTENT_INDEX
      // Expect facts, quotes, headings, intros, today heading, koans, koan interpretations
      // We'll just check length > 0 and some known entries
      expect(idx.length).toBeGreaterThan(5)
      // Find the fact entry
      const fact = idx.find((i) => i.type === 'fact' && i.text === 'Fact1')
      expect(fact).toBeDefined()
      expect(fact.source).toBe('Src1')
      expect(fact.themeLabel).toBe('Theme1')
    })
  })
})
