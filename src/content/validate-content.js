/**
 * validate-content.js — Runtime validation for siteData.json, content.json,
 * seasons.json, koans.json, and per-date changelog files.
 *
 * Catches malformed content before it breaks the build or renders broken sections.
 * Validates theme indices, fact/quote indices, section keys, color scheme format,
 * changelog entry structure, and per-date changelog file schemas.
 *
 * @module validate-content
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

/**
 * Validation error with file path, field name, and expected vs actual values.
 * @typedef {Object} ValidationError
 * @property {string} file - The file path where the error occurred.
 * @property {string} field - The field path (dot-separated) that failed validation.
 * @property {string} message - Human-readable error description.
 * @property {any} [expected] - What was expected.
 * @property {any} [actual] - What was found.
 */

/**
 * Validation result.
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed.
 * @property {ValidationError[]} errors - List of validation errors.
 * @property {string} file - The file that was validated.
 */

/**
 * Read and parse a JSON file, returning { data, error }.
 * @param {string} filePath - Absolute path to the JSON file.
 * @returns {{ data: any, error: string|null }}
 */
function readJson(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    return { data: JSON.parse(raw), error: null };
  } catch (e) {
    if (e instanceof SyntaxError) {
      return { data: null, error: `Invalid JSON: ${e.message}` };
    }
    return { data: null, error: `Cannot read file: ${e.message}` };
  }
}

/**
 * Validate a hex color string (#RGB or #RRGGBB).
 * @param {string} value - The value to check.
 * @returns {boolean}
 */
function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);
}

/**
 * Validate a non-empty string.
 * @param {any} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate a non-negative integer.
 * @param {any} value
 * @returns {boolean}
 */
function isNonNegativeInt(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/**
 * Validate siteData.json structure and content.
 * Checks: themes array, facts/quotes indices, color schemes, changelog entries.
 *
 * @param {Object} data - Parsed siteData.json content.
 * @returns {ValidationError[]} Array of validation errors (empty if valid).
 */
function validateSiteData(data) {
  const errors = [];
  const file = 'src/content/siteData.json';

  // Top-level structure
  if (!data || typeof data !== 'object') {
    errors.push({ file, field: '<root>', message: 'siteData.json must be a JSON object' });
    return errors;
  }

  // Validate themes array
  if (!Array.isArray(data.themes)) {
    errors.push({ file, field: 'themes', message: '"themes" must be an array', expected: 'array', actual: typeof data.themes });
  } else if (data.themes.length === 0) {
    errors.push({ file, field: 'themes', message: '"themes" array must not be empty' });
  } else {
    data.themes.forEach((theme, i) => {
      const prefix = `themes[${i}]`;

      if (!isNonEmptyString(theme.id)) {
        errors.push({ file, field: `${prefix}.id`, message: `Theme at index ${i} must have a non-empty string "id"`, expected: 'non-empty string', actual: theme.id });
      }

      if (!isNonEmptyString(theme.title)) {
        errors.push({ file, field: `${prefix}.title`, message: `Theme at index ${i} must have a non-empty string "title"`, expected: 'non-empty string', actual: theme.title });
      }

      if (!isNonEmptyString(theme.category)) {
        errors.push({ file, field: `${prefix}.category`, message: `Theme at index ${i} must have a non-empty string "category"`, expected: 'non-empty string', actual: theme.category });
      }

      // Validate facts array
      if (!Array.isArray(theme.facts)) {
        errors.push({ file, field: `${prefix}.facts`, message: `Theme "${theme.id || i}" must have a "facts" array`, expected: 'array', actual: typeof theme.facts });
      } else {
        theme.facts.forEach((fact, j) => {
          const fPrefix = `${prefix}.facts[${j}]`;
          if (!isNonEmptyString(fact.text)) {
            errors.push({ file, field: fPrefix + '.text', message: `Fact at themes[${i}].facts[${j}] must have a non-empty string "text"`, expected: 'non-empty string', actual: fact.text });
          }
          if (!isNonEmptyString(fact.source)) {
            errors.push({ file, field: fPrefix + '.source', message: `Fact at themes[${i}].facts[${j}] must have a non-empty string "source"`, expected: 'non-empty string', actual: fact.source });
          }
          if (!isNonEmptyString(fact.element)) {
            errors.push({ file, field: fPrefix + '.element', message: `Fact at themes[${i}].facts[${j}] must have a non-empty string "element"`, expected: 'non-empty string', actual: fact.element });
          }
        });
      }

      // Validate quotes array
      if (!Array.isArray(theme.quotes)) {
        errors.push({ file, field: `${prefix}.quotes`, message: `Theme "${theme.id || i}" must have a "quotes" array`, expected: 'array', actual: typeof theme.quotes });
      } else {
        theme.quotes.forEach((quote, j) => {
          if (!isNonEmptyString(quote)) {
            errors.push({ file, field: `${prefix}.quotes[${j}]`, message: `Quote at themes[${i}].quotes[${j}] must be a non-empty string`, expected: 'non-empty string', actual: quote });
          }
        });
      }
    });
  }

  // Validate colorSchemes array
  if (!Array.isArray(data.colorSchemes)) {
    errors.push({ file, field: 'colorSchemes', message: '"colorSchemes" must be an array', expected: 'array', actual: typeof data.colorSchemes });
  } else {
    data.colorSchemes.forEach((scheme, i) => {
      const prefix = `colorSchemes[${i}]`;

      if (!isNonEmptyString(scheme.name)) {
        errors.push({ file, field: `${prefix}.name`, message: `Color scheme at index ${i} must have a non-empty string "name"` });
      }

      // Validate hex color fields
      const colorFields = ['primary', 'secondary', 'accent', 'background', 'text'];
      for (const cf of colorFields) {
        if (!isHexColor(scheme[cf])) {
          errors.push({
            file,
            field: `${prefix}.${cf}`,
            message: `Color scheme "${scheme.name || i}" field "${cf}" must be a hex color (e.g. #1a237e), got: ${scheme[cf]}`,
            expected: 'hex color string (#RGB or #RRGGBB)',
            actual: scheme[cf]
          });
        }
      }

      // Validate shaderParams
      if (scheme.shaderParams != null) {
        if (typeof scheme.shaderParams !== 'object') {
          errors.push({ file, field: `${prefix}.shaderParams`, message: '"shaderParams" must be an object', expected: 'object', actual: typeof scheme.shaderParams });
        } else {
          const spFields = ['strokeDensity', 'swirlFrequency', 'colorIntensity'];
          for (const sp of spFields) {
            if (typeof scheme.shaderParams[sp] !== 'number') {
              errors.push({ file, field: `${prefix}.shaderParams.${sp}`, message: `"${sp}" must be a number`, expected: 'number', actual: scheme.shaderParams[sp] });
            }
          }
        }
      }

      // Validate seasons array
      if (!Array.isArray(scheme.seasons)) {
        errors.push({ file, field: `${prefix}.seasons`, message: `Color scheme "${scheme.name || i}" must have a "seasons" array`, expected: 'array', actual: typeof scheme.seasons });
      }
    });
  }

  // Validate changelog if present
  if (data.changelog != null) {
    if (typeof data.changelog !== 'object') {
      errors.push({ file, field: 'changelog', message: '"changelog" must be an object', expected: 'object', actual: typeof data.changelog });
    } else {
      if (!isNonEmptyString(data.changelog.version)) {
        errors.push({ file, field: 'changelog.version', message: '"changelog.version" must be a non-empty string' });
      }
      if (!Array.isArray(data.changelog.entries)) {
        errors.push({ file, field: 'changelog.entries', message: '"changelog.entries" must be an array', expected: 'array', actual: typeof data.changelog.entries });
      } else {
        data.changelog.entries.forEach((entry, i) => {
          const ePrefix = `changelog.entries[${i}]`;
          if (!isNonEmptyString(entry.date)) {
            errors.push({ file, field: ePrefix + '.date', message: `Changelog entry ${i} must have a non-empty string "date"` });
          }
          if (!isNonEmptyString(entry.type)) {
            errors.push({ file, field: ePrefix + '.type', message: `Changelog entry ${i} must have a non-empty string "type"` });
          }
          if (!isNonEmptyString(entry.description)) {
            errors.push({ file, field: ePrefix + '.description', message: `Changelog entry ${i} must have a non-empty string "description"` });
          }
          if (!Array.isArray(entry.changes)) {
            errors.push({ file, field: ePrefix + '.changes', message: `Changelog entry ${i} must have a "changes" array`, expected: 'array', actual: typeof entry.changes });
          }
        });
      }
    }
  }

  return errors;
}

/**
 * Validate content.json structure and cross-references to siteData.json.
 * Checks: section keys, themeIndex/factIndex bounds, quoteIndex bounds, slice format.
 *
 * @param {Object} data - Parsed content.json content.
 * @param {Object} [siteData] - Parsed siteData.json for cross-reference validation.
 * @returns {ValidationError[]} Array of validation errors (empty if valid).
 */
function validateContent(data, siteData = null) {
  const errors = [];
  const file = 'src/content/content.json';

  if (!data || typeof data !== 'object') {
    errors.push({ file, field: '<root>', message: 'content.json must be a JSON object' });
    return errors;
  }

  // Validate meta
  if (data.meta != null) {
    if (typeof data.meta !== 'object') {
      errors.push({ file, field: 'meta', message: '"meta" must be an object', expected: 'object', actual: typeof data.meta });
    }
  }

  // Validate sections
  if (!data.sections || typeof data.sections !== 'object') {
    errors.push({ file, field: 'sections', message: '"sections" must be a non-null object', expected: 'object', actual: typeof data.sections });
    return errors;
  }

  const sec = data.sections;

  // Validate hero section
  if (sec.hero != null) {
    if (typeof sec.hero !== 'object') {
      errors.push({ file, field: 'sections.hero', message: '"hero" must be an object' });
    } else if (!isNonEmptyString(sec.hero.tagline)) {
      errors.push({ file, field: 'sections.hero.tagline', message: '"hero.tagline" must be a non-empty string' });
    }
  }

  // Validate today section
  if (sec.today != null) {
    if (typeof sec.today !== 'object') {
      errors.push({ file, field: 'sections.today', message: '"today" must be an object' });
    } else if (!isNonEmptyString(sec.today.heading)) {
      errors.push({ file, field: 'sections.today.heading', message: '"today.heading" must be a non-empty string' });
    }
  }

  // Required section keys
  const requiredSections = ['moon', 'philosophy', 'gita', 'shiva', 'art'];
  const sectionLabels = { moon: 'I. The Moon', philosophy: 'II. The Waves', gita: 'III. The Battlefield', shiva: 'IV. The Dance', art: 'V. The Canvas' };

  for (const key of requiredSections) {
    if (!sec[key] || typeof sec[key] !== 'object') {
      errors.push({ file, field: `sections.${key}`, message: `Section "${key}" (${sectionLabels[key]}) is missing or not an object`, expected: 'object', actual: sec[key] });
      continue;
    }

    const section = sec[key];
    const prefix = `sections.${key}`;

    // Validate label
    if (!isNonEmptyString(section.label)) {
      errors.push({ file, field: `${prefix}.label`, message: `Section "${key}" must have a non-empty string "label"` });
    }

    // Validate heading
    if (!isNonEmptyString(section.heading)) {
      errors.push({ file, field: `${prefix}.heading`, message: `Section "${key}" must have a non-empty string "heading"` });
    }

    // Validate intro
    if (!isNonEmptyString(section.intro)) {
      errors.push({ file, field: `${prefix}.intro`, message: `Section "${key}" must have a non-empty string "intro"` });
    }

    // Validate imageCard
    if (!section.imageCard || typeof section.imageCard !== 'object') {
      errors.push({ file, field: `${prefix}.imageCard`, message: `Section "${key}" must have an "imageCard" object` });
    } else {
      if (!isNonNegativeInt(section.imageCard.themeIndex)) {
        errors.push({ file, field: `${prefix}.imageCard.themeIndex`, message: `"themeIndex" must be a non-negative integer`, expected: 'non-negative integer', actual: section.imageCard.themeIndex });
      }
      if (!isNonNegativeInt(section.imageCard.factIndex)) {
        errors.push({ file, field: `${prefix}.imageCard.factIndex`, message: `"factIndex" must be a non-negative integer`, expected: 'non-negative integer', actual: section.imageCard.factIndex });
      }
    }

    // Validate facts
    if (!section.facts || typeof section.facts !== 'object') {
      errors.push({ file, field: `${prefix}.facts`, message: `Section "${key}" must have a "facts" object` });
    } else {
      if (!isNonNegativeInt(section.facts.themeIndex)) {
        errors.push({ file, field: `${prefix}.facts.themeIndex`, message: `"themeIndex" must be a non-negative integer`, expected: 'non-negative integer', actual: section.facts.themeIndex });
      }
      if (!Array.isArray(section.facts.slice) || section.facts.slice.length !== 2) {
        errors.push({ file, field: `${prefix}.facts.slice`, message: `"slice" must be an array of exactly 2 integers [start, end]`, expected: '[number, number]', actual: section.facts.slice });
      } else {
        if (!isNonNegativeInt(section.facts.slice[0])) {
          errors.push({ file, field: `${prefix}.facts.slice[0]`, message: `"slice[0]" (start) must be a non-negative integer`, expected: 'non-negative integer', actual: section.facts.slice[0] });
        }
        if (!isNonNegativeInt(section.facts.slice[1])) {
          errors.push({ file, field: `${prefix}.facts.slice[1]`, message: `"slice[1]" (end) must be a non-negative integer`, expected: 'non-negative integer', actual: section.facts.slice[1] });
        }
      }
    }

    // Validate quote
    if (!section.quote || typeof section.quote !== 'object') {
      errors.push({ file, field: `${prefix}.quote`, message: `Section "${key}" must have a "quote" object` });
    } else {
      if (!isNonNegativeInt(section.quote.themeIndex)) {
        errors.push({ file, field: `${prefix}.quote.themeIndex`, message: `"themeIndex" must be a non-negative integer`, expected: 'non-negative integer', actual: section.quote.themeIndex });
      }
      if (!isNonNegativeInt(section.quote.quoteIndex)) {
        errors.push({ file, field: `${prefix}.quote.quoteIndex`, message: `"quoteIndex" must be a non-negative integer`, expected: 'non-negative integer', actual: section.quote.quoteIndex });
      }
    }
  }

  // Cross-reference validation against siteData
  if (siteData && Array.isArray(siteData.themes)) {
    const themeCount = siteData.themes.length;

    for (const key of requiredSections) {
      if (!sec[key] || typeof sec[key] !== 'object') continue;
      const section = sec[key];
      const prefix = `sections.${key}`;

      // Check imageCard themeIndex bounds
      if (section.imageCard && isNonNegativeInt(section.imageCard.themeIndex)) {
        if (section.imageCard.themeIndex >= themeCount) {
          errors.push({
            file,
            field: `${prefix}.imageCard.themeIndex`,
            message: `themeIndex ${section.imageCard.themeIndex} is out of bounds (siteData has ${themeCount} themes, max index ${themeCount - 1})`,
            expected: `0-${themeCount - 1}`,
            actual: section.imageCard.themeIndex
          });
        } else {
          // Check factIndex bounds
          const theme = siteData.themes[section.imageCard.themeIndex];
          if (theme && Array.isArray(theme.facts) && isNonNegativeInt(section.imageCard.factIndex)) {
            if (section.imageCard.factIndex >= theme.facts.length) {
              errors.push({
                file,
                field: `${prefix}.imageCard.factIndex`,
                message: `factIndex ${section.imageCard.factIndex} is out of bounds for theme "${theme.id}" (has ${theme.facts.length} facts, max index ${theme.facts.length - 1})`,
                expected: `0-${theme.facts.length - 1}`,
                actual: section.imageCard.factIndex
              });
            }
          }
        }
      }

      // Check facts themeIndex bounds
      if (section.facts && isNonNegativeInt(section.facts.themeIndex)) {
        if (section.facts.themeIndex >= themeCount) {
          errors.push({
            file,
            field: `${prefix}.facts.themeIndex`,
            message: `facts themeIndex ${section.facts.themeIndex} is out of bounds (siteData has ${themeCount} themes)`,
            expected: `0-${themeCount - 1}`,
            actual: section.facts.themeIndex
          });
        } else {
          // Check slice bounds
          const theme = siteData.themes[section.facts.themeIndex];
          if (theme && Array.isArray(theme.facts) && Array.isArray(section.facts.slice) && section.facts.slice.length === 2) {
            const end = section.facts.slice[1];
            if (isNonNegativeInt(end) && end > theme.facts.length) {
              errors.push({
                file,
                field: `${prefix}.facts.slice[1]`,
                message: `slice end ${end} exceeds fact count ${theme.facts.length} for theme "${theme.id}"`,
                expected: `<= ${theme.facts.length}`,
                actual: end
              });
            }
          }
        }
      }

      // Check quote themeIndex and quoteIndex bounds
      if (section.quote && isNonNegativeInt(section.quote.themeIndex)) {
        if (section.quote.themeIndex >= themeCount) {
          errors.push({
            file,
            field: `${prefix}.quote.themeIndex`,
            message: `quote themeIndex ${section.quote.themeIndex} is out of bounds (siteData has ${themeCount} themes)`,
            expected: `0-${themeCount - 1}`,
            actual: section.quote.themeIndex
          });
        } else if (isNonNegativeInt(section.quote.quoteIndex)) {
          const theme = siteData.themes[section.quote.themeIndex];
          if (theme && Array.isArray(theme.quotes) && section.quote.quoteIndex >= theme.quotes.length) {
            errors.push({
              file,
              field: `${prefix}.quote.quoteIndex`,
              message: `quoteIndex ${section.quote.quoteIndex} is out of bounds for theme "${theme.id}" (has ${theme.quotes.length} quotes, max index ${theme.quotes.length - 1})`,
              expected: `0-${theme.quotes.length - 1}`,
              actual: section.quote.quoteIndex
            });
          }
        }
      }
    }
  }

  // Validate changelog if present
  if (data.changelog != null) {
    if (typeof data.changelog !== 'object') {
      errors.push({ file, field: 'changelog', message: '"changelog" must be an object', expected: 'object', actual: typeof data.changelog });
    } else {
      if (!isNonEmptyString(data.changelog.version)) {
        errors.push({ file, field: 'changelog.version', message: '"changelog.version" must be a non-empty string' });
      }
      if (!Array.isArray(data.changelog.entries)) {
        errors.push({ file, field: 'changelog.entries', message: '"changelog.entries" must be an array', expected: 'array', actual: typeof data.changelog.entries });
      }
    }
  }

  return errors;
}

/**
 * Validate seasons.json structure and content.
 * Checks: 4 season keys (spring, summer, autumn, winter), months array (numbers 1-12),
 * colorSchemeWeights (all 5 scheme keys present, values >= 1), flowerEmphasis enum,
 * skyToneShift RGB ranges, particleEffect string, factThemeWeights (all theme keys present, values >= 1).
 *
 * @param {Object} data - Parsed seasons.json content.
 * @returns {ValidationError[]} Array of validation errors (empty if valid).
 */
function validateSeasons(data) {
  const errors = [];
  const file = 'src/content/seasons.json';

  if (!data || typeof data !== 'object') {
    errors.push({ file, field: '<root>', message: 'seasons.json must be a JSON object' });
    return errors;
  }

  const seasons = data.seasons;
  if (!seasons || typeof seasons !== 'object') {
    errors.push({ file, field: 'seasons', message: '\"seasons\" must be a non-null object', expected: 'object', actual: typeof seasons });
    return errors;
  }

  // Required season keys
  const requiredSeasons = ['spring', 'summer', 'autumn', 'winter'];
  for (const seasonKey of requiredSeasons) {
    if (!seasons[seasonKey] || typeof seasons[seasonKey] !== 'object') {
      errors.push({ file, field: `seasons.${seasonKey}`, message: `Season \"${seasonKey}\" is missing or not an object`, expected: 'object', actual: seasons[seasonKey] });
    }
  }

  // Validate each season that exists
  const COLOR_SCHEME_KEYS = ['starry-night', 'sunflower', 'midnight-wave', 'tulip-garden', 'moonlit-silver'];
  const FACT_THEME_KEYS = ['moon', 'ego', 'gita', 'shiva', 'art'];
  const FLOWER_EMPHASIS_VALUES = ['tulips', 'sunflowers', 'balanced', 'lilies', 'wildflowers'];

  for (const seasonKey of requiredSeasons) {
    const season = seasons[seasonKey];
    if (!season || typeof season !== 'object') continue;
    const prefix = `seasons.${seasonKey}`;

    // Validate months array
    if (!Array.isArray(season.months)) {
      errors.push({ file, field: `${prefix}.months`, message: `\"months\" must be an array of month numbers (1-12)`, expected: 'array', actual: typeof season.months });
    } else {
      season.months.forEach((m, i) => {
        if (typeof m !== 'number' || !Number.isInteger(m) || m < 1 || m > 12) {
          errors.push({ file, field: `${prefix}.months[${i}]`, message: `Month value must be an integer 1-12, got: ${m}`, expected: '1-12', actual: m });
        }
      });
    }

    // Validate colorSchemeWeights
    if (!season.colorSchemeWeights || typeof season.colorSchemeWeights !== 'object') {
      errors.push({ file, field: `${prefix}.colorSchemeWeights`, message: `\"colorSchemeWeights\" must be an object`, expected: 'object', actual: typeof season.colorSchemeWeights });
    } else {
      for (const schemeKey of COLOR_SCHEME_KEYS) {
        if (!(schemeKey in season.colorSchemeWeights)) {
          errors.push({ file, field: `${prefix}.colorSchemeWeights.${schemeKey}`, message: `Missing required color scheme key \"${schemeKey}\"`, expected: 'present', actual: 'missing' });
        } else {
          const val = season.colorSchemeWeights[schemeKey];
          if (typeof val !== 'number' || !Number.isInteger(val) || val < 1) {
            errors.push({ file, field: `${prefix}.colorSchemeWeights.${schemeKey}`, message: `Weight must be a positive integer (>= 1), got: ${val}`, expected: '>= 1', actual: val });
          }
        }
      }
    }

    // Validate flowerEmphasis enum
    if (!season.flowerEmphasis) {
      errors.push({ file, field: `${prefix}.flowerEmphasis`, message: `\"flowerEmphasis\" is required`, expected: FLOWER_EMPHASIS_VALUES.join(' | '), actual: season.flowerEmphasis });
    } else if (!FLOWER_EMPHASIS_VALUES.includes(season.flowerEmphasis)) {
      errors.push({ file, field: `${prefix}.flowerEmphasis`, message: `\"flowerEmphasis\" must be one of: ${FLOWER_EMPHASIS_VALUES.join(', ')}, got: \"${season.flowerEmphasis}\"`, expected: FLOWER_EMPHASIS_VALUES.join(' | '), actual: season.flowerEmphasis });
    }

    // Validate skyToneShift RGB
    if (!season.skyToneShift || typeof season.skyToneShift !== 'object') {
      errors.push({ file, field: `${prefix}.skyToneShift`, message: `\"skyToneShift\" must be an object with r, g, b number fields`, expected: '{r, g, b}', actual: typeof season.skyToneShift });
    } else {
      for (const channel of ['r', 'g', 'b']) {
        if (typeof season.skyToneShift[channel] !== 'number') {
          errors.push({ file, field: `${prefix}.skyToneShift.${channel}`, message: `\"${channel}\" must be a number`, expected: 'number', actual: season.skyToneShift[channel] });
        }
      }
    }

    // Validate particleEffect string
    if (!isNonEmptyString(season.particleEffect)) {
      errors.push({ file, field: `${prefix}.particleEffect`, message: `\"particleEffect\" must be a non-empty string`, expected: 'non-empty string', actual: season.particleEffect });
    }

    // Validate factThemeWeights
    if (!season.factThemeWeights || typeof season.factThemeWeights !== 'object') {
      errors.push({ file, field: `${prefix}.factThemeWeights`, message: `\"factThemeWeights\" must be an object`, expected: 'object', actual: typeof season.factThemeWeights });
    } else {
      for (const themeKey of FACT_THEME_KEYS) {
        if (!(themeKey in season.factThemeWeights)) {
          errors.push({ file, field: `${prefix}.factThemeWeights.${themeKey}`, message: `Missing required fact theme key \"${themeKey}\"`, expected: 'present', actual: 'missing' });
        } else {
          const val = season.factThemeWeights[themeKey];
          if (typeof val !== 'number' || !Number.isInteger(val) || val < 1) {
            errors.push({ file, field: `${prefix}.factThemeWeights.${themeKey}`, message: `Weight must be a positive integer (>= 1), got: ${val}`, expected: '>= 1', actual: val });
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Validate koans.json structure and content.
 * Checks: root object with "koans" array, each entry has non-empty text/source/interpretation strings.
 *
 * @param {Object} data - Parsed koans.json content.
 * @returns {ValidationError[]} Array of validation errors (empty if valid).
 */
function validateKoans(data) {
  const errors = [];
  const file = 'src/content/koans.json';

  if (!data || typeof data !== 'object') {
    errors.push({ file, field: '<root>', message: 'koans.json must be a JSON object' });
    return errors;
  }

  if (!Array.isArray(data.koans)) {
    errors.push({ file, field: 'koans', message: '"koans" must be an array', expected: 'array', actual: typeof data.koans });
    return errors;
  }

  if (data.koans.length === 0) {
    errors.push({ file, field: 'koans', message: '"koans" array must not be empty' });
    return errors;
  }

  data.koans.forEach((koan, i) => {
    const prefix = `koans[${i}]`;

    if (!koan || typeof koan !== 'object') {
      errors.push({ file, field: prefix, message: `Koan at index ${i} must be an object`, expected: 'object', actual: typeof koan });
      return;
    }

    if (!isNonEmptyString(koan.text)) {
      errors.push({ file, field: `${prefix}.text`, message: `Koan at index ${i} must have a non-empty string "text"`, expected: 'non-empty string', actual: koan.text });
    }

    if (!isNonEmptyString(koan.source)) {
      errors.push({ file, field: `${prefix}.source`, message: `Koan at index ${i} must have a non-empty string "source"`, expected: 'non-empty string', actual: koan.source });
    }

    if (!isNonEmptyString(koan.interpretation)) {
      errors.push({ file, field: `${prefix}.interpretation`, message: `Koan at index ${i} must have a non-empty string "interpretation"`, expected: 'non-empty string', actual: koan.interpretation });
    }
  });

  return errors;
}

/**
 * Validate all content files and return combined results.
 * Runs siteData.json validation first, then content.json with cross-references,
 * seasons.json, and optionally all per-date changelog files.
 *
 * @param {Object} [options]
 * @param {string} [options.siteDataPath] - Override path to siteData.json.
 * @param {string} [options.contentPath] - Override path to content.json.
 * @param {string} [options.seasonsPath] - Override path to seasons.json.
 * @param {string} [options.koansPath] - Override path to koans.json.
 * @param {string} [options.changelogDirPath] - Path to changelog directory for date-file validation.
 * @param {boolean} [options.throwOnError=false] - If true, throw an Error when validation fails.
 * @returns {{ siteData: ValidationResult, content: ValidationResult, seasons: ValidationResult, koans: ValidationResult, changelog: { valid: boolean, errors: ValidationError[], filesChecked: number }|null, valid: boolean }}
 */
function validateAll(options = {}) {
  const siteDataPath = options.siteDataPath || join(PROJECT_ROOT, 'src', 'content', 'siteData.json');
  const contentPath = options.contentPath || join(PROJECT_ROOT, 'src', 'content', 'content.json');
  const seasonsPath = options.seasonsPath || join(PROJECT_ROOT, 'src', 'content', 'seasons.json');
  const koansPath = options.koansPath || join(PROJECT_ROOT, 'src', 'content', 'koans.json');
  const changelogDirPath = options.changelogDirPath || null;
  const throwOnError = options.throwOnError || false;

  // Validate siteData.json
  const siteDataResult = { valid: true, errors: [], file: siteDataPath };
  if (!existsSync(siteDataPath)) {
    siteDataResult.errors.push({ file: siteDataPath, field: '<file>', message: 'File not found' });
    siteDataResult.valid = false;
  } else {
    const { data, error } = readJson(siteDataPath);
    if (error) {
      siteDataResult.errors.push({ file: siteDataPath, field: '<parse>', message: error });
      siteDataResult.valid = false;
    } else {
      siteDataResult.errors = validateSiteData(data);
      siteDataResult.valid = siteDataResult.errors.length === 0;
    }
  }

  // Validate content.json (with cross-references to siteData)
  const contentResult = { valid: true, errors: [], file: contentPath };
  if (!existsSync(contentPath)) {
    contentResult.errors.push({ file: contentPath, field: '<file>', message: 'File not found' });
    contentResult.valid = false;
  } else {
    const { data: contentData, error: contentError } = readJson(contentPath);
    if (contentError) {
      contentResult.errors.push({ file: contentPath, field: '<parse>', message: contentError });
      contentResult.valid = false;
    } else {
      // Parse siteData for cross-reference (reuse if already parsed, otherwise parse again)
      let siteData = null;
      if (siteDataResult.valid || !siteDataResult.errors.some(e => e.field === '<parse>' || e.field === '<file>')) {
        const { data: sd } = readJson(siteDataPath);
        siteData = sd;
      }
      contentResult.errors = validateContent(contentData, siteData);
      contentResult.valid = contentResult.errors.length === 0;
    }
  }

  // Validate seasons.json
  const seasonsResult = { valid: true, errors: [], file: seasonsPath };
  if (!existsSync(seasonsPath)) {
    seasonsResult.errors.push({ file: seasonsPath, field: '<file>', message: 'File not found' });
    seasonsResult.valid = false;
  } else {
    const { data: seasonsData, error: seasonsError } = readJson(seasonsPath);
    if (seasonsError) {
      seasonsResult.errors.push({ file: seasonsPath, field: '<parse>', message: seasonsError });
      seasonsResult.valid = false;
    } else {
      seasonsResult.errors = validateSeasons(seasonsData);
      seasonsResult.valid = seasonsResult.errors.length === 0;
    }
  }

  // Validate koans.json
  const koansResult = { valid: true, errors: [], file: koansPath };
  if (!existsSync(koansPath)) {
    koansResult.errors.push({ file: koansPath, field: '<file>', message: 'File not found' });
    koansResult.valid = false;
  } else {
    const { data: koansData, error: koansError } = readJson(koansPath);
    if (koansError) {
      koansResult.errors.push({ file: koansPath, field: '<parse>', message: koansError });
      koansResult.valid = false;
    } else {
      koansResult.errors = validateKoans(koansData);
      koansResult.valid = koansResult.errors.length === 0;
    }
  }

  // Validate changelog date files if directory provided
  let changelogResult = null;
  if (changelogDirPath) {
    const dirResult = validateChangelogDir(changelogDirPath);
    changelogResult = dirResult.changelog;
  }

  const valid = siteDataResult.valid && contentResult.valid && seasonsResult.valid && koansResult.valid && (changelogResult ? changelogResult.valid : true);

  if (throwOnError && !valid) {
    const allErrors = [...siteDataResult.errors, ...contentResult.errors, ...seasonsResult.errors, ...koansResult.errors];
    if (changelogResult) allErrors.push(...changelogResult.errors);
    const msg = allErrors.map(e => `[${e.file}] ${e.field}: ${e.message}`).join('\n');
    throw new Error(`Content validation failed with ${allErrors.length} error(s):\n${msg}`);
  }

  return { siteData: siteDataResult, content: contentResult, seasons: seasonsResult, koans: koansResult, changelog: changelogResult, valid };
}

/**
 * Format validation errors for console output.
 * @param {ValidationResult} result
 * @returns {string}
 */
function formatErrors(result) {
  if (result.valid) return `✓ ${result.file} — valid`;

  const lines = [`✗ ${result.file} — ${result.errors.length} error(s):`];
  for (const err of result.errors) {
    lines.push(`  • ${err.field}: ${err.message}`);
  }
  return lines.join('\n');
}

// ─── Changelog Date-File Validation ────────────────────────────────────

/** Allowed entry types for changelog date files. */
const CHANGELOG_ENTRY_TYPES = [
  'daily-mutation', 'feature', 'fix', 'content',
  'design', 'refactor', 'perf', 'chore'
];

/** Regex for HH:MM:SS time format. */
const TIME_RE = /^\d{2}:\d{2}:\d{2}$/;

/** Regex for YYYY-MM-DD date format. */
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Validate a single per-date changelog file (e.g. 2026-06-09.json).
 * Checks: date field (YYYY-MM-DD), entries array (non-empty), each entry
 * has time (HH:MM:SS), type (valid enum), description (string, max 200),
 * changes (array of non-empty strings).
 *
 * @param {Object} data - Parsed changelog date file content.
 * @param {string} [filePath] - File path for error messages.
 * @returns {ValidationError[]} Array of validation errors (empty if valid).
 */
function validateChangelogDateFile(data, filePath = 'changelog/date-file.json') {
  const errors = [];
  const file = filePath;

  if (!data || typeof data !== 'object') {
    errors.push({ file, field: '<root>', message: 'Changelog date file must be a JSON object' });
    return errors;
  }

  // Validate date field
  if (!isNonEmptyString(data.date)) {
    errors.push({ file, field: 'date', message: '"date" must be a non-empty string', expected: 'YYYY-MM-DD', actual: data.date });
  } else if (!DATE_RE.test(data.date)) {
    errors.push({ file, field: 'date', message: `"date" must match YYYY-MM-DD format, got: ${data.date}`, expected: 'YYYY-MM-DD', actual: data.date });
  }

  // Validate entries array
  if (!Array.isArray(data.entries)) {
    errors.push({ file, field: 'entries', message: '"entries" must be an array', expected: 'array', actual: typeof data.entries });
  } else if (data.entries.length === 0) {
    errors.push({ file, field: 'entries', message: '"entries" array must not be empty' });
  } else {
    data.entries.forEach((entry, i) => {
      const ePrefix = `entries[${i}]`;

      if (!entry || typeof entry !== 'object') {
        errors.push({ file, field: ePrefix, message: `Entry ${i} must be an object`, expected: 'object', actual: typeof entry });
        return;
      }

      // Validate time
      if (!isNonEmptyString(entry.time)) {
        errors.push({ file, field: `${ePrefix}.time`, message: `Entry ${i} must have a non-empty string "time"`, expected: 'HH:MM:SS', actual: entry.time });
      } else if (!TIME_RE.test(entry.time)) {
        errors.push({ file, field: `${ePrefix}.time`, message: `Entry ${i} "time" must match HH:MM:SS format, got: ${entry.time}`, expected: 'HH:MM:SS', actual: entry.time });
      }

      // Validate type
      if (!isNonEmptyString(entry.type)) {
        errors.push({ file, field: `${ePrefix}.type`, message: `Entry ${i} must have a non-empty string "type"`, expected: CHANGELOG_ENTRY_TYPES.join(' | '), actual: entry.type });
      } else if (!CHANGELOG_ENTRY_TYPES.includes(entry.type)) {
        errors.push({ file, field: `${ePrefix}.type`, message: `Entry ${i} "type" must be one of: ${CHANGELOG_ENTRY_TYPES.join(', ')}, got: "${entry.type}"`, expected: CHANGELOG_ENTRY_TYPES.join(' | '), actual: entry.type });
      }

      // Validate description
      if (!isNonEmptyString(entry.description)) {
        errors.push({ file, field: `${ePrefix}.description`, message: `Entry ${i} must have a non-empty string "description"`, expected: 'non-empty string (max 200 chars)', actual: entry.description });
      } else if (entry.description.length > 200) {
        errors.push({ file, field: `${ePrefix}.description`, message: `Entry ${i} "description" must be at most 200 characters, got: ${entry.description.length}`, expected: '<= 200 chars', actual: `${entry.description.length} chars` });
      }

      // Validate changes
      if (!Array.isArray(entry.changes)) {
        errors.push({ file, field: `${ePrefix}.changes`, message: `Entry ${i} must have a "changes" array`, expected: 'array', actual: typeof entry.changes });
      } else {
        entry.changes.forEach((change, j) => {
          if (!isNonEmptyString(change)) {
            errors.push({ file, field: `${ePrefix}.changes[${j}]`, message: `Entry ${i} change ${j} must be a non-empty string`, expected: 'non-empty string', actual: change });
          }
        });
      }
    });
  }

  return errors;
}

/**
 * Validate all changelog date files (YYYY-MM-DD.json) in a directory.
 * Skips index.json — only validates per-date entry files.
 *
 * @param {string} dirPath - Path to changelog directory.
 * @returns {{ changelog: { valid: boolean, errors: ValidationError[], filesChecked: number }, fileResults: Array<{ file: string, errors: ValidationError[], valid: boolean }> }}
 */
function validateChangelogDir(dirPath) {
  const fileResults = [];
  let totalErrors = [];

  if (!existsSync(dirPath)) {
    return {
      changelog: { valid: false, errors: [{ file: dirPath, field: '<dir>', message: 'Changelog directory not found' }], filesChecked: 0 },
      fileResults: []
    };
  }

  let filesChecked = 0;
  let dir;
  try {
    dir = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return {
      changelog: { valid: false, errors: [{ file: dirPath, field: '<dir>', message: 'Cannot read changelog directory' }], filesChecked: 0 },
      fileResults: []
    };
  }

  for (const dirent of dir) {
    if (!dirent.isFile()) continue;
    const name = dirent.name;
    if (!DATE_RE.test(name.replace('.json', ''))) continue; // Only YYYY-MM-DD.json
    if (name === 'index.json') continue;

    const filePath = join(dirPath, name);
    filesChecked++;
    const { data, error } = readJson(filePath);
    if (error) {
      fileResults.push({ file: name, errors: [{ file: filePath, field: '<parse>', message: error }], valid: false });
      totalErrors.push({ file: filePath, field: '<parse>', message: error });
    } else {
      const entryErrors = validateChangelogDateFile(data, `src/content/changelog/${name}`);
      fileResults.push({ file: name, errors: entryErrors, valid: entryErrors.length === 0 });
      totalErrors.push(...entryErrors);
    }
  }

  return {
    changelog: { valid: totalErrors.length === 0, errors: totalErrors, filesChecked },
    fileResults
  };
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const start = Date.now();
  const result = validateAll();
  const elapsed = Date.now() - start;

  console.log(formatErrors(result.siteData));
  console.log(formatErrors(result.content));
  console.log(formatErrors(result.seasons));
  console.log(formatErrors(result.koans));
  if (result.changelog) {
    console.log(result.changelog.valid
      ? `✓ changelog/ — ${result.changelog.filesChecked} date file(s) valid`
      : `✗ changelog/ — ${result.changelog.errors.length} error(s) across ${result.changelog.filesChecked} file(s):`);
    if (!result.changelog.valid) {
      for (const err of result.changelog.errors) {
        console.log(`  • ${err.file}: ${err.message}`);
      }
    }
  }
  console.log(`\nValidation completed in ${elapsed}ms — ${result.valid ? 'PASS' : 'FAIL'}`);

  if (!result.valid) {
    process.exit(1);
  }
}

export {
  validateSiteData,
  validateContent,
  validateSeasons,
  validateKoans,
  validateChangelogDateFile,
  validateChangelogDir,
  validateAll,
  formatErrors,
  readJson,
  isHexColor,
  isNonEmptyString,
  isNonNegativeInt
};
