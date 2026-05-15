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
  return { scheme, schemeIndex };
}

// ── 2. Update ALL section text content in content.json ──
function updateAllSections(content, siteData, dayOfYear) {
  const sectionKeys = ['moon', 'philosophy', 'gita', 'shiva', 'art'];
  const updatedSections = [];

  sectionKeys.forEach((sectionKey, i) => {
    const section = content.sections[sectionKey];
    if (!section) return;

    // Each section gets a different theme offset so they don't all show the same content
    const themeIndex = (dayOfYear + i) % siteData.themes.length;
    const theme = siteData.themes[themeIndex];

    // Pick a unique fact index for this section
    const factIndex = (dayOfYear + i) % theme.facts.length;
    const fact = theme.facts[factIndex];

    // Update intro text
    section.intro = fact.text;

    // Update image card reference — use a different fact than the intro
    if (section.imageCard) {
      const imgFactIndex = (factIndex + 1) % theme.facts.length;
      section.imageCard.factIndex = imgFactIndex;
      section.imageCard.themeIndex = themeIndex;
    }

    // Update facts slice — rotate which facts are shown
    if (section.facts) {
      const totalFacts = theme.facts.length;
      const sliceSize = Math.min(2, totalFacts - 1);
      const sliceStart = (dayOfYear + i) % (totalFacts - sliceSize + 1);
      section.facts.themeIndex = themeIndex;
      section.facts.slice = [sliceStart, sliceStart + sliceSize];
    }

    // Update quote reference
    if (section.quote) {
      section.quote.quoteIndex = (dayOfYear + i) % theme.quotes.length;
      section.quote.themeIndex = themeIndex;
    }

    updatedSections.push({ sectionKey, themeIndex, factIndex, theme: theme.title });
  });

  // Update today's heading
  const todayThemeIndex = (dayOfYear + 2) % siteData.themes.length;
  const todayTheme = siteData.themes[todayThemeIndex];
  content.sections.today.heading = `What the <em>${todayTheme.title.split(' ')[0]}</em> whispers today`;

  return updatedSections;
}

// ── 3. Add changelog entry to content.json ──
function addChangelogEntry(content, siteData, dayOfYear, updatedSections, scheme) {
  const today = new Date().toISOString().split('T')[0];
  const themeIndex = dayOfYear % siteData.themes.length;
  const theme = siteData.themes[themeIndex];

  const changes = [
    `Color scheme: ${scheme.name} (${scheme.mood})`,
    `Shader — strokeDensity: ${scheme.shaderParams.strokeDensity}, swirlFrequency: ${scheme.shaderParams.swirlFrequency}, colorIntensity: ${scheme.shaderParams.colorIntensity}`,
  ];

  // Document what each section now shows
  updatedSections.forEach(s => {
    changes.push(`Section "${s.sectionKey}": ${s.theme} theme, fact #${s.factIndex}`);
  });

  const entry = {
    date: today,
    type: 'daily-mutation',
    description: `Daily mutation #${dayOfYear}: ${scheme.name} colors, ${updatedSections.map(s => s.theme).join(' → ')}`,
    changes
  };

  // Update existing entry or add new one
  const existingIndex = content.changelog.entries.findIndex(e => e.date === today && e.type === 'daily-mutation');
  if (existingIndex >= 0) {
    content.changelog.entries[existingIndex] = entry;
  } else {
    content.changelog.entries.push(entry);
    if (content.changelog.entries.length > 15) {
      content.changelog.entries = content.changelog.entries.slice(-15);
    }
  }

  return { entry, changes };
}

// ── Main ──
const siteData = loadJSON(SITE_DATA_PATH);
const content = loadJSON(CONTENT_PATH);
const day = getDayOfYear();

const { scheme } = mutateColors(siteData, day);
const updatedSections = updateAllSections(content, siteData, day);
const { entry, changes } = addChangelogEntry(content, siteData, day, updatedSections, scheme);

// Ensure changelog is always sorted chronologically (oldest first, newest last)
content.changelog.entries.sort((a, b) => {
  const dateCmp = a.date.localeCompare(b.date);
  if (dateCmp !== 0) return dateCmp;
  const typeOrder = { initial: 0, feature: 1, fix: 2, refactor: 3, perf: 4, chore: 5, 'daily-mutation': 6 };
  return (typeOrder[a.type] || 9) - (typeOrder[b.type] || 9);
});

saveJSON(SITE_DATA_PATH, siteData);
saveJSON(CONTENT_PATH, content);

console.log(`[daily-mutate] Day ${day}: Applied "${scheme.name}" scheme`);
console.log(`[daily-mutate] Updated ${updatedSections.length} sections:`);
updatedSections.forEach(s => console.log(`  - ${s.sectionKey}: ${s.theme} (fact #${s.factIndex})`));
console.log(`[daily-mutate] Changelog: ${entry.date} — ${changes.length} changes`);
process.exit(0);
