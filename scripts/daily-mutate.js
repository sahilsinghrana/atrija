#!/usr/bin/env node
// scripts/daily-mutate.js — Daily content mutation, color rotation, and changelog update
// Updates BOTH siteData.json (colors/shaders) and content.json (text content)

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DATA_PATH = join(__dirname, '../src/content/siteData.json');
const CONTENT_PATH = join(__dirname, '../src/content/content.json');

function loadJSON(path) { return JSON.parse(readFileSync(path, 'utf-8')); }
function saveJSON(path, data) { writeFileSync(path, JSON.stringify(data, null, 2)); }

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// ── 1. Mutate colors in siteData.json ──
function mutateColors(siteData, dayOfYear) {
  const schemeIndex = dayOfYear % siteData.colorSchemes.length;
  const scheme = siteData.colorSchemes[schemeIndex];
  const variation = () => 0.9 + Math.random() * 0.2;
  scheme.shaderParams = {
    strokeDensity: Math.round(scheme.shaderParams.strokeDensity * variation() * 10) / 10,
    swirlFrequency: Math.round(scheme.shaderParams.swirlFrequency * variation() * 10) / 10,
    colorIntensity: Math.round(scheme.shaderParams.colorIntensity * variation() * 100) / 100
  };
  return scheme;
}

// ── 2. Add changelog entry to content.json ──
function addChangelogEntry(content, siteData, dayOfYear) {
  const today = new Date().toISOString().split('T')[0];
  const themeIndex = dayOfYear % siteData.themes.length;
  const theme = siteData.themes[themeIndex];
  const scheme = siteData.colorSchemes[dayOfYear % siteData.colorSchemes.length];

  const entry = {
    date: today,
    type: 'daily-mutation',
    description: `Daily mutation: Theme "${theme.title}" with "${scheme.name}" color scheme.`,
    changes: [
      `Rotated to color scheme: ${scheme.name} (${scheme.mood})`,
      `Featured theme: ${theme.title}`,
      `Shader params — strokeDensity: ${scheme.shaderParams.strokeDensity}, swirlFrequency: ${scheme.shaderParams.swirlFrequency}, colorIntensity: ${scheme.shaderParams.colorIntensity}`,
      `Featured fact: "${theme.facts[dayOfYear % theme.facts.length].text.slice(0, 80)}..."`,
      `Featured quote: "${theme.quotes[dayOfYear % theme.quotes.length].slice(0, 80)}..."`
    ]
  };

  // Avoid duplicate entries for the same day
  const exists = content.changelog.entries.some(e => e.date === today && e.type === 'daily-mutation');
  if (!exists) {
    content.changelog.entries.push(entry);
    // Keep only last 10 entries
    if (content.changelog.entries.length > 10) {
      content.changelog.entries = content.changelog.entries.slice(-10);
    }
  }

  return entry;
}

// ── 3. Update section text content in content.json ──
function updateSectionContent(content, siteData, dayOfYear) {
  const themeIndex = dayOfYear % siteData.themes.length;
  const theme = siteData.themes[themeIndex];
  const sectionKeys = ['moon', 'philosophy', 'gita', 'shiva', 'art'];
  const sectionKey = sectionKeys[dayOfYear % sectionKeys.length];
  const section = content.sections[sectionKey];

  if (!section) return null;

  // Rotate the intro text from the theme's facts
  const factIndex = dayOfYear % theme.facts.length;
  const fact = theme.facts[factIndex];

  // Update the intro with a fresh fact-based paragraph
  section.intro = fact.text;

  // Update image card reference
  if (section.imageCard) {
    section.imageCard.factIndex = factIndex;
    section.imageCard.themeIndex = themeIndex;
  }

  // Update quote reference
  if (section.quote) {
    section.quote.quoteIndex = dayOfYear % theme.quotes.length;
    section.quote.themeIndex = themeIndex;
  }

  // Update today's section with current theme
  content.sections.today.heading = `What the <em>universe</em> whispers today`;

  return { sectionKey, factIndex, theme: theme.title };
}

// ── Main ──
const siteData = loadJSON(SITE_DATA_PATH);
const content = loadJSON(CONTENT_PATH);
const day = getDayOfYear();

const scheme = mutateColors(siteData, day);
const entry = addChangelogEntry(content, siteData, day);
const contentUpdate = updateSectionContent(content, siteData, day);

saveJSON(SITE_DATA_PATH, siteData);
saveJSON(CONTENT_PATH, content);

console.log(`[daily-mutate] Day ${day}: Applied "${scheme.name}" scheme, theme "${siteData.themes[day % siteData.themes.length].title}"`);
console.log(`[daily-mutate] Changelog entry: ${entry.date} — ${entry.description}`);
if (contentUpdate) {
  console.log(`[daily-mutate] Updated content.json: section "${contentUpdate.sectionKey}" with fact ${contentUpdate.factIndex} from theme "${contentUpdate.theme}"`);
}
process.exit(0);
