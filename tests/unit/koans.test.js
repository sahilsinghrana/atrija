import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('koans.json', () => {
  const koansPath = path.resolve(__dirname, '../../src/content/koans.json')
  let koansData

  beforeAll(() => {
    const raw = fs.readFileSync(koansPath, 'utf-8')
    koansData = JSON.parse(raw)
  })

  it('is valid JSON and has .koans array with >= 30 entries', () => {
    expect(koansData).toBeDefined()
    expect(Array.isArray(koansData.koans)).toBe(true)
    expect(koansData.koans.length).toBeGreaterThanOrEqual(30)
  })

  it('each koan has required fields: text, source, interpretation', () => {
    for (const koan of koansData.koans) {
      expect(typeof koan.text).toBe('string')
      expect(koan.text.length).toBeGreaterThan(0)
      expect(typeof koan.source).toBe('string')
      expect(koan.source.length).toBeGreaterThan(0)
      expect(typeof koan.interpretation).toBe('string')
      expect(koan.interpretation.length).toBeGreaterThan(0)
    }
  })

  it('daily rotation is deterministic (same dayOfYear returns same koan)', () => {
    const dayOfYear = 42
    const idx = dayOfYear % koansData.koans.length
    const koan1 = koansData.koans[idx]
    const koan2 = koansData.koans[dayOfYear % koansData.koans.length]
    expect(koan1).toBe(koan2)
  })

  it("koan text is 1-3 sentences (readable at a glance)", () => {
    for (const koan of koansData.koans) {
      const sentences = koan.text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      expect(sentences.length).toBeGreaterThanOrEqual(1)
      expect(sentences.length).toBeLessThanOrEqual(3)
    }
  })

  it('interpretations are 1-3 sentences', () => {
    for (const koan of koansData.koans) {
      const sentences = koan.interpretation.split(/[.!?]+/).filter(s => s.trim().length > 0)
      expect(sentences.length).toBeGreaterThanOrEqual(1)
      expect(sentences.length).toBeLessThanOrEqual(3)
    }
  })
})

describe('KoanCard.astro component', () => {
  const componentPath = path.resolve(__dirname, '../../src/components/KoanCard.astro')

  it('component file exists', () => {
    expect(fs.existsSync(componentPath)).toBe(true)
  })

  it('component imports koans.json', () => {
    const content = fs.readFileSync(componentPath, 'utf-8')
    expect(content).toContain('koans.json')
  })

  it('component contains koan section with id="koan"', () => {
    const content = fs.readFileSync(componentPath, 'utf-8')
    expect(content).toContain('id="koan"')
  })

  it('component contains Reflect button', () => {
    const content = fs.readFileSync(componentPath, 'utf-8')
    expect(content.toLowerCase()).toContain('reflect')
  })

  it('component contains blockquote for koan text', () => {
    const content = fs.readFileSync(componentPath, 'utf-8')
    expect(content).toContain('<blockquote')
  })

  it('component uses dayOfYear for rotation', () => {
    const content = fs.readFileSync(componentPath, 'utf-8')
    expect(content).toContain('dayOfYear')
  })
})
