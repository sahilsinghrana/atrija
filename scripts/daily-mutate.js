#!/usr/bin/env node
// scripts/daily-mutate.js — Daily content mutation, color rotation, and changelog update
// Called by cron job to update the site's daily content

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/content/siteData.json');

function loadData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function saveData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function mutateColors(data, dayOfYear) {
  const schemeIndex = dayOfYear % data.colorSchemes.length;
  const scheme = data.colorSchemes[schemeIndex];

  // Slight random variation on shader params (±10%)
  const variation = () => 0.9 + Math.random() * 0.2;
  scheme.shaderParams = {
    strokeDensity: Math.round(scheme.shaderParams.strokeDensity * variation() * 10) / 10,
    swirlFrequency: Math.round(scheme.shaderParams.swirlFrequency * variation() * 10) / 10,
    colorIntensity: Math.round(scheme.shaderParams.colorIntensity * variation() * 100) / 100
  };

  return scheme;
}

function addChangelogEntry(data, scheme) {
  const today = new Date().toISOString().split('T')[0];
  const themeIndex = getDayOfYear() % data.themes.length;
  const theme = data.themes[themeIndex];

  const entry = {
    date: today,
    type: 'daily-mutation',
    description: `Daily mutation: Theme "${theme.title}" with "${scheme.name}" color scheme.`,
    changes: [
      `Rotated to color scheme: ${scheme.name} (${scheme.mood})`,
      `Featured theme: ${theme.title}`,
      `Shader params — strokeDensity: ${scheme.shaderParams.strokeDensity}, swirlFrequency: ${scheme.shaderParams.swirlFrequency}, colorIntensity: ${scheme.shaderParams.colorIntensity}`,
      `Featured fact: "${theme.facts[getDayOfYear() % theme.facts.length].text.slice(0, 80)}..."`,
      `Featured quote: "${theme.quotes[getDayOfYear() % theme.quotes.length].slice(0, 80)}..."`
    ]
  };

  // Avoid duplicate entries for the same day
  const exists = data.changelog.entries.some(e => e.date === today && e.type === 'daily-mutation');
  if (!exists) {
    data.changelog.entries.push(entry);
  }

  return entry;
}

// Main
const data = loadData();
const day = getDayOfYear();
const scheme = mutateColors(data, day);
const entry = addChangelogEntry(data, scheme);
saveData(data);

console.log(`[daily-mutate] Day ${day}: Applied "${scheme.name}" scheme, theme "${data.themes[day % data.themes.length].title}"`);
console.log(`[daily-mutate] Changelog entry: ${entry.date} — ${entry.description}`);
process.exit(0);
