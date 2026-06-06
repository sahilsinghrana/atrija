#!/usr/bin/env node
// scripts/daily-mutate.js — Daily content mutation, color rotation, and changelog update
// Changelog entries are written to date-based files: src/content/changelog/YYYY-MM-DD.json
// Index metadata is maintained in: src/content/changelog/index.json

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DATA_PATH = join(__dirname, "../src/content/siteData.json");
const CONTENT_PATH = join(__dirname, "../src/content/content.json");
const SEASONS_PATH = join(__dirname, "../src/content/seasons.json");
const CHANGELOG_DIR = join(__dirname, "../src/content/changelog");
const CHANGELOG_INDEX = join(CHANGELOG_DIR, "index.json");
const PUBLIC_CHANGELOG_DIR = join(__dirname, "../public/changelog");

function loadJSON(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}
function saveJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}
function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function getTimeISO() {
  return new Date().toISOString().split("T")[1].slice(0, 8);
}

// Returns the season name based on month (0-11)
// Meteorological seasons: spring: 2-4 (Mar-May), summer: 5-7 (Jun-Aug), autumn: 8-10 (Sep-Nov), winter: 11,0,1 (Dec-Feb)
function getCurrentSeason(month) {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter"; // month 11, 0, 1
}

function getSeasonEmoji(season) {
  const emojiMap = {
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
    winter: "❄️",
  };
  return emojiMap[season] || "";
}

// ── 1. Mutate colors in siteData.json with seasonal weighting ──
function mutateColors(siteData, dayOfYear) {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const season = getCurrentSeason(month);
  const seasonsData = loadJSON(SEASONS_PATH);
  const seasonInfo = seasonsData.seasons[season];
  const weights = seasonInfo.colorSchemeWeights;

  // Build a list of schemes with their weights
  const schemesWithWeights = siteData.colorSchemes.map((scheme, index) => ({
    scheme,
    index,
    weight: weights[scheme.name] || 1, // default weight 1 if not specified
  }));

  // Weighted random selection
  let totalWeight = 0;
  for (const item of schemesWithWeights) {
    totalWeight += item.weight;
  }
  let random = Math.random() * totalWeight;
  let selected = null;
  for (const item of schemesWithWeights) {
    if (random < item.weight) {
      selected = item;
      break;
    }
    random -= item.weight;
  }
  if (!selected) selected = schemesWithWeights[schemesWithWeights.length - 1]; // fallback

  const scheme = selected.scheme;
  const schemeIndex = selected.index;
  const variation = () => 0.9 + Math.random() * 0.2;
  scheme.shaderParams = {
    strokeDensity:
      Math.round(scheme.shaderParams.strokeDensity * variation() * 10) / 10,
    swirlFrequency:
      Math.round(scheme.shaderParams.swirlFrequency * variation() * 10) / 10,
    colorIntensity:
      Math.round(scheme.shaderParams.colorIntensity * variation() * 100) / 100,
  };
  return { scheme, schemeIndex, season };
}

// ── 2. Update ALL section text content in content.json ──
// Each section has a fixed theme — we never rotate themes.
// Instead we pick a random fact/quote from the same theme for variety.
function updateAllSections(content, siteData, dayOfYear) {
  // Fixed theme mapping: each section always uses the same theme
  const sectionThemeMap = {
    moon: 0, // Selene & The Moon
    philosophy: 1, // Ego & Arrogance
    gita: 2, // Bhagavad Gita
    shiva: 3, // Shiv Purana
    art: 4, // Art & Beauty
  };
  const sectionKeys = ["moon", "philosophy", "gita", "shiva", "art"];
  const updatedSections = [];

  sectionKeys.forEach((sectionKey, i) => {
    const section = content.sections[sectionKey];
    if (!section) return;

    const themeIndex = sectionThemeMap[sectionKey];
    const theme = siteData.themes[themeIndex];

    // Pick a random fact from this theme (different each day, but same theme)
    const factIndex = Math.floor(Math.random() * theme.facts.length);
    const fact = theme.facts[factIndex];

    section.intro = fact.text;

    let imgFactIndex = factIndex;
    if (section.imageCard) {
      // Pick a different fact for the image card
      imgFactIndex =
        (factIndex + 1 + Math.floor(Math.random() * (theme.facts.length - 1))) %
        theme.facts.length;
      section.imageCard.factIndex = imgFactIndex;
      section.imageCard.themeIndex = themeIndex;
    }

    if (section.facts) {
      const totalFacts = theme.facts.length;
      const sliceSize = Math.min(2, totalFacts - 1);
      // Pick a random slice that doesn't overlap with factIndex or imgFactIndex
      let sliceStart;
      let attempts = 0;
      do {
        sliceStart = Math.floor(Math.random() * totalFacts);
        attempts++;
      } while (
        attempts < 20 &&
        (sliceStart === factIndex ||
          sliceStart === imgFactIndex ||
          (sliceStart + sliceSize - 1) % totalFacts === factIndex ||
          (sliceStart + sliceSize - 1) % totalFacts === imgFactIndex)
      );
      section.facts.themeIndex = themeIndex;
      section.facts.slice = [sliceStart, sliceStart + sliceSize];
    }

    if (section.quote) {
      // Pick a random quote from this theme
      section.quote.quoteIndex = Math.floor(
        Math.random() * theme.quotes.length,
      );
      section.quote.themeIndex = themeIndex;
    }

    updatedSections.push({
      sectionKey,
      themeIndex,
      factIndex,
      theme: theme.title,
    });
  });

  // Today's heading: rotate emphasis word by day of year
  const headingThemes = [
    "moon",
    "philosophy",
    "gita",
    "shiva",
    "art",
  ];
  const headingVerbs = [
    "reveals",
    "conceals",
    "teaches",
    "dissolves",
    "whispers",
  ];
  const headingThemeKey = headingThemes[dayOfYear % headingThemes.length];
  const headingVerb = headingVerbs[dayOfYear % headingVerbs.length];
  const headingThemeTitle =
    siteData.themes[sectionThemeMap[headingThemeKey]].title.split(" ")[0];
  content.sections.today.heading = `What the <em>${headingThemeTitle}</em> ${headingVerb} today`;

  return updatedSections;
}

// ── 3. Write changelog entry to date-based file ──
function writeChangelogEntry(dayOfYear, updatedSections, scheme, season) {
  ensureDir(CHANGELOG_DIR);

  const today = getTodayISO();
  const time = getTimeISO();
  const dateFile = join(CHANGELOG_DIR, `${today}.json`);

  // Build changes list
  const changes = [
    `Color scheme: ${scheme.name} (${scheme.mood})`,
    `Season: ${season}`,
    `Shader — strokeDensity: ${scheme.shaderParams.strokeDensity}, swirlFrequency: ${scheme.shaderParams.swirlFrequency}, colorIntensity: ${scheme.shaderParams.colorIntensity}`,
  ];
  updatedSections.forEach((s) => {
    changes.push(
      `Section \"${s.sectionKey}\": ${s.theme} theme, fact #${s.factIndex}`,
    );
  });

  // Entry with time field for same-date differentiation
  const entry = {
    time,
    type: "daily-mutation",
    description: `Daily mutation #${dayOfYear}: ${scheme.name} colors (${season} season), ${updatedSections.map((s) => s.theme).join(" → ")}`,
    changes,
  };

  // Load existing date file or create new
  let dateData = { date: today, entries: [] };
  if (existsSync(dateFile)) {
    try {
      dateData = loadJSON(dateFile);
    } catch (e) {
      /* corrupted, start fresh */
    }
  }

  // Replace same type+time entry, otherwise append
  const existingIdx = dateData.entries.findIndex(
    (e) => e.type === entry.type && e.time === entry.time,
  );
  if (existingIdx >= 0) {
    dateData.entries[existingIdx] = entry;
  } else {
    dateData.entries.push(entry);
  }

  // Sort entries by time for consistent ordering
  dateData.entries.sort((a, b) => a.time.localeCompare(b.time));

  saveJSON(dateFile, dateData);

  // Update index metadata
  updateChangelogIndex(today, dateData);

  // Sync to public/changelog/ for deployment
  ensureDir(PUBLIC_CHANGELOG_DIR);
  const publicDateFile = join(PUBLIC_CHANGELOG_DIR, `${today}.json`);
  const publicIndexFile = join(PUBLIC_CHANGELOG_DIR, "index.json");
  saveJSON(publicDateFile, dateData);
  // Re-read the index that updateChangelogIndex just wrote
  const currentIndex = loadJSON(CHANGELOG_INDEX);
  saveJSON(publicIndexFile, currentIndex);

  return { entry, changes };
}

// ── 4. Update changelog/index.json metadata ──
function updateChangelogIndex(today, dateData) {
  let index = {
    version: "1.2.0",
    lastUpdated: new Date().toISOString(),
    totalEntries: 0,
    dates: [],
  };
  if (existsSync(CHANGELOG_INDEX)) {
    try {
      index = loadJSON(CHANGELOG_INDEX);
    } catch (e) {
      /* corrupted, start fresh */
    }
  }

  // Build date entry metadata
  const lastEntry = dateData.entries[dateData.entries.length - 1];
  const dateEntry = {
    date: today,
    entries: dateData.entries.length,
    latestType: lastEntry?.type || "daily-mutation",
    description: lastEntry?.description || "",
  };

  // Upsert date entry in index
  const existingIdx = index.dates.findIndex((d) => d.date === today);
  if (existingIdx >= 0) {
    index.dates[existingIdx] = dateEntry;
  } else {
    index.dates.unshift(dateEntry);
  }

  // Sort dates descending (newest first)
  index.dates.sort((a, b) => b.date.localeCompare(a.date));

  // Recalculate total entries
  index.totalEntries = index.dates.reduce((sum, d) => sum + d.entries, 0);
  index.lastUpdated = new Date().toISOString();

  // Keep only last 30 days — delete old date files
  if (index.dates.length > 30) {
    const removed = index.dates.splice(30);
    removed.forEach((d) => {
      const oldFile = join(CHANGELOG_DIR, `${d.date}.json`);
      if (existsSync(oldFile)) {
        try {
          unlinkSync(oldFile);
        } catch (e) {
          /* ignore deletion errors */
        }
      }
    });
    index.totalEntries = index.dates.reduce((sum, d) => sum + d.entries, 0);
  }

  saveJSON(CHANGELOG_INDEX, index);
}

// ── 4. Sync changelog entries back to content.json ──
function syncChangelogToContent(content, siteData) {
  ensureDir(CHANGELOG_DIR);

  // Read all date files from changelog dir
  let allEntries = [];
  try {
    const files = readdirSync(CHANGELOG_DIR).filter((f) =>
      /^\\d{4}-\\d{2}-\\d{2}\\.json$/.test(f),
    );
    files.sort(); // chronological
    for (const file of files) {
      try {
        const dateData = loadJSON(join(CHANGELOG_DIR, file));
        for (const entry of dateData.entries) {
          allEntries.push({ ...entry, date: dateData.date });
        }
      } catch (e) {
        /* skip corrupted */
      }
    }
  } catch (e) {
    /* dir might not exist */
  }

  // Deduplicate: keep latest entry per (date, type) pair
  const seen = new Map();
  for (const entry of allEntries) {
    const key = `${entry.date}|${entry.type}`;
    seen.set(key, entry);
  }
  const deduped = Array.from(seen.values());

  // Sort chronologically (oldest first)
  deduped.sort((a, b) => {
    const cmp = a.date.localeCompare(b.date);
    if (cmp !== 0) return cmp;
    return (a.time || "").localeCompare(b.time || "");
  });

  // Keep max 15 entries (trim oldest)
  const trimmed =
    deduped.length > 15 ? deduped.slice(deduped.length - 15) : deduped;

  // Update content.json changelog
  content.changelog = {
    version:
      siteData.changelog?.version || content.changelog?.version || "1.2.0",
    entries: trimmed,
  };
}

// ── Main ──
const siteData = loadJSON(SITE_DATA_PATH);
const content = loadJSON(CONTENT_PATH);
const day = getDayOfYear();

const { scheme, schemeIndex, season } = mutateColors(siteData, day);
const updatedSections = updateAllSections(content, siteData, day);
const { entry, changes } = writeChangelogEntry(
  day,
  updatedSections,
  scheme,
  season,
);
syncChangelogToContent(content, siteData);

// Add season indicator to content.meta
content.meta.season = `${season} ${getSeasonEmoji(season)}`;

saveJSON(SITE_DATA_PATH, siteData);
saveJSON(CONTENT_PATH, content);

console.log(
  `[daily-mutate] Day ${day}: Applied \"${scheme.name}\" scheme (${season} season)`,
);
console.log(`[daily-mutate] Updated ${updatedSections.length} sections:`);
updatedSections.forEach((s) =>
  console.log(`  - ${s.sectionKey}: ${s.theme} (fact #${s.factIndex})`),
);
console.log(
  `[daily-mutate] Changelog: ${getTodayISO()} ${getTimeISO()} — ${changes.length} changes`,
);
console.log(`[daily-mutate] Written to changelog/${getTodayISO()}.json`);
console.log(
  `[daily-mutate] Synced ${content.changelog.entries.length} entries to content.json`,
);
process.exit(0);
