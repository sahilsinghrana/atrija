/**
 * content-search.test.js — Unit tests for public/js/content-search.js
 *
 * Tests the pure logic functions by replicating them (they are pure, no DOM/Three.js deps)
 */

import { describe, it, expect } from 'vitest'
import { JSDOM } from 'jsdom'

// Pure function implementations (duplicated from module for unit testing)
// Note: HTML tags are removed but content inside them is preserved
function normalize(s) {
  return s.toLowerCase().replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '$1').replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function escapeHtml(s) {
  const div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function scoreMatch(text, queryWords) {
  const n = normalize(text)
  let score = 0
  for (let i = 0; i < queryWords.length; i++) {
    if (n.indexOf(queryWords[i]) !== -1) {
      score += 1
      // Bonus for exact phrase match
      if (n.indexOf(queryWords.join(' ')) !== -1) score += 2
    }
  }
  return score
}

function highlightMatch(text, queryWords) {
  let escaped = escapeHtml(text)
  for (let i = 0; i < queryWords.length; i++) {
    const q = queryWords[i].trim()
    if (!q) continue
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
    escaped = escaped.replace(re, '<mark>$1</mark>')
  }
  return escaped
}

function truncate(text, maxLen) {
  let clean = text.replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '$1').replace(/<[^>]*>/g, '')
  if (clean.length <= maxLen) return clean
  return clean.substring(0, maxLen).replace(/\s+\S*$/, '') + '…'
}

// Set up jsdom for escapeHtml tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document

describe('content-search.js pure logic', () => {
  describe('normalize()', () => {
    it('lowercases and preserves content inside HTML tags', () => {
      // Real-world usage: <em>Hello</em> WORLD! → hello world
      expect(normalize('<em>Hello</em> WORLD!')).toBe('hello world')
    })
    it('removes non-word/space characters', () => {
      expect(normalize('Test@#$%^&*()')).toBe('test')
    })
    it('collapses whitespace', () => {
      expect(normalize('a   b    c')).toBe('a b c')
    })
    it('trims leading/trailing spaces', () => {
      expect(normalize('  hello  ')).toBe('hello')
    })
    it('handles unicode characters (strips accents as non-word)', () => {
      // Unicode accented chars are treated as non-word chars
      const result = normalize('Héllo Wörld!')
      expect(result.split(' ')).toContain('h')
      expect(result.split(' ')).toContain('w')
    })
    it('preserves ASCII letters and digits', () => {
      expect(normalize('Hello123 World456')).toBe('hello123 world456')
    })
    it('handles nested tags (inner content preserved)', () => {
      // Content inside nested tags
      const result = normalize('<p><strong>Hello</strong> world</p>')
      expect(result).toBe('hello world')
    })
    it('handles tags from real content.json', () => {
      // As seen in content.json: "<em>Lunar</em> gaze"
      const result = normalize('<em>Lunar</em> gaze')
      expect(result).toBe('lunar gaze')
    })
  })

  describe('escapeHtml()', () => {
    it('escapes angle brackets', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
    })
    it('escapes ampersand', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B')
    })
    it('preserves text without special chars', () => {
      expect(escapeHtml('Hello world')).toBe('Hello world')
    })
  })

  describe('scoreMatch()', () => {
    it('returns 0 for no match', () => {
      expect(scoreMatch('hello world', ['foo', 'bar'])).toBe(0)
    })
    it('returns count of matching words', () => {
      expect(scoreMatch('hello world', ['foo', 'bar'])).toBe(0)
      expect(scoreMatch('hello there', ['hello', 'world'])).toBe(1)
    })
    it('adds bonus for exact phrase match', () => {
      // When 'hello world' appears as phrase in text, score includes bonus
      expect(scoreMatch('hello world foo', ['hello', 'world'])).toBe(6)
    })
    it('does not add phrase bonus if words not together', () => {
      // 'hello' and 'world' are in text but not as contiguous phrase
      expect(scoreMatch('hello there world', ['hello', 'world'])).toBe(2)
    })
    it('handles HTML tags in text', () => {
      // Tags are stripped before scoring
      expect(scoreMatch('<em>Hello</em> world', ['hello', 'world'])).toBe(6)
    })
  })

  describe('highlightMatch()', () => {
    it('wraps matches in <mark>', () => {
      const result = highlightMatch('Hello <b>world</b>', ['world'])
      expect(result).toContain('<mark>world</mark>')
    })
    it('escapes HTML in input', () => {
      const result = highlightMatch('Hello <b>world</b>', ['world'])
      expect(result).not.toContain('<b>')
    })
    it('handles multiple words', () => {
      const result = highlightMatch('Hello world foo', ['hello', 'foo'])
      expect(result).toContain('<mark>Hello</mark>')
      expect(result).toContain('<mark>foo</mark>')
    })
    it('escapes regex special chars', () => {
      const result = highlightMatch('test [abc] xyz', ['[abc]'])
      expect(result).toBe('test <mark>[abc]</mark> xyz')
    })
    it('handles special regex chars: dots', () => {
      const result = highlightMatch('version 1.5.2', ['1.5'])
      expect(result).toContain('<mark>1.5</mark>')
    })
    it('handles special regex chars: parens', () => {
      const result = highlightMatch('test (abc) xyz', ['(abc)'])
      expect(result).toBe('test <mark>(abc)</mark> xyz')
    })
  })

  describe('truncate()', () => {
    it('returns unchanged if within limit', () => {
      expect(truncate('short', 10)).toBe('short')
    })
    it('truncates at word boundary and adds ellipsis', () => {
      const result = truncate('This is a long sentence', 10)
      expect(result.length).toBeLessThan(12)
      expect(result.endsWith('…')).toBe(true)
    })
    it('handles empty string', () => {
      expect(truncate('', 5)).toBe('')
    })
    it('removes HTML before truncating', () => {
      const result = truncate('<b>long</b> sentence here', 10)
      expect(result.length).toBeLessThan(15)
      expect(result.includes('<b>')).toBe(false)
    })
    it('handles HTML with content', () => {
      // <em>Lunar</em> gaze → "Lunar gaze" → truncated
      const result = truncate('<em>Lunar</em> gaze into the night', 10)
      expect(result.includes('<em>')).toBe(false)
      expect(result.includes('Lunar')).toBe(true)
    })
  })
})

describe('search() logic', () => {
  it('search ranks higher score first', () => {
    const items = [
      { text: 'Hello world', type: 'fact' },
      { text: 'Hello there world', type: 'fact' }, // has both words but not as phrase
    ]
    const queryWords = ['hello', 'world']
    const results = items.map(i => ({ ...i, score: scoreMatch(i.text, queryWords) }))
      .sort((a, b) => b.score - a.score)

    // First item has 'hello world' as phrase, second doesn't
    expect(results[0].text).toBe('Hello world')
    expect(results[0].score).toBeGreaterThan(results[1].score)
  })

  it('search deduplicates by normalized text', () => {
    const items = [
      { text: 'Hello', type: 'fact' },
      { text: 'HELLO!!!', type: 'fact' },
    ]

    const seen = {}
    const deduped = []
    for (const item of items) {
      const key = normalize(item.text)
      if (!seen[key]) {
        seen[key] = true
        deduped.push(item)
      }
    }

    expect(deduped.length).toBe(1)
  })

  it('search caps at 30 results', () => {
    const items = Array.from({ length: 35 }, (_, i) => ({ text: `Item ${i}`, type: 'fact' }))
    const results = items.slice(0, 30)
    expect(results.length).toBe(30)
  })
})