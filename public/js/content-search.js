/**
 * Client-side Content Search Overlay (idea-055)
 *
 * A keyboard-triggered search overlay (press '/' or click a search icon)
 * that indexes all facts, quotes, koans, and section intros from
 * siteData.json and content.json. Fuzzy-matches visitor queries against
 * text content and returns results grouped by theme.
 *
 * Pure client-side with a small JSON index built at page load.
 * No backend, no Three.js — standalone module.
 *
 * Zero scene-init.js changes.
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  var SECTION_KEY_TO_ID = {
    moon: 'moon',
    philosophy: 'philosophy',
    gita: 'gita',
    shiva: 'shiva',
    art: 'art',
  };

  var SECTION_KEY_TO_LABEL = {
    moon: 'I. The Moon',
    philosophy: 'II. The Waves',
    gita: 'III. The Battlefield',
    shiva: 'IV. The Dance',
    art: 'V. The Canvas',
  };

  var THEME_LABELS = [];
  var CONTENT_INDEX = [];
  var INDEX_BUILT = false;
  var OVERLAY_VISIBLE = false;

  // ── Helpers ─────────────────────────────────────────────────────
  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function normalize(s) {
    // Replace HTML tags but preserve their content: <tag>content</tag> → content
    return s.toLowerCase().replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '$1').replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Simple fuzzy scoring: counts query words found in text
  function scoreMatch(text, queryWords) {
    var n = normalize(text);
    var score = 0;
    for (var i = 0; i < queryWords.length; i++) {
      if (n.indexOf(queryWords[i]) !== -1) {
        score += 1;
        // Bonus for exact phrase match
        if (n.indexOf(queryWords.join(' ')) !== -1) score += 2;
      }
    }
    return score;
  }

  function highlightMatch(text, queryWords) {
    var escaped = escapeHtml(text);
    for (var i = 0; i < queryWords.length; i++) {
      var q = queryWords[i].trim();
      if (!q) continue;
      var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      escaped = escaped.replace(re, '<mark>$1</mark>');
    }
    return escaped;
  }

  function truncate(text, maxLen) {
    var clean = text.replace(/<[^>]+>/g, '');
    if (clean.length <= maxLen) return clean;
    return clean.substring(0, maxLen).replace(/\s+\S*$/, '') + '…';
  }

  // ── Build Index ─────────────────────────────────────────────────
  function buildIndex() {
    if (INDEX_BUILT) return;
    CONTENT_INDEX = [];

    // We fetch JSON content files to build the index
    // Check prefetch cache first (populated by content-prefetch.js after scene ready)
    var CACHE = (window && window.__contentCache) || {};
    var pending = 2;
    var siteData = null;
    var contentData = null;
    var koansData = null;

    function checkDone() {
      pending--;
      if (pending <= 0 && siteData && contentData) {
        assembleIndex(siteData, contentData, koansData);
        INDEX_BUILT = true;
      }
    }

    // Fetch siteData.json (use cache if available)
    var cachedSiteData = CACHE['siteData'];
    if (cachedSiteData) {
      siteData = cachedSiteData;
      checkDone();
    } else {
      fetch('/content/siteData.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { siteData = d; checkDone(); })
        .catch(function () { checkDone(); });
    }

    // Fetch content.json (use cache if available)
    var cachedContent = CACHE['content'];
    if (cachedContent) {
      contentData = cachedContent;
      checkDone();
    } else {
      fetch('/content/content.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { contentData = d; checkDone(); })
        .catch(function () { checkDone(); });
    }

    // Fetch koans.json (optional)
    fetch('/content/koans.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { koansData = d; checkDone(); })
      .catch(function () { koansData = { koans: [] }; checkDone(); });
  }

  function assembleIndex(siteData, contentData, koansData) {
    // Theme labels from siteData
    THEME_LABELS = siteData.themes.map(function (t) { return t.title; });

    var themeIndex = 0;
    siteData.themes.forEach(function (theme) {
      var themeLabel = THEME_LABELS[themeIndex];
      var themeId = Object.keys(SECTION_KEY_TO_ID)[themeIndex] || '';

      // Index facts from each theme
      theme.facts.forEach(function (fact) {
        if (!fact.text) return;
        CONTENT_INDEX.push({
          text: fact.text,
          source: fact.source || '',
          type: 'fact',
          themeIndex: themeIndex,
          themeLabel: themeLabel,
          sectionId: themeId,
          sectionLabel: SECTION_KEY_TO_LABEL[themeId] || themeLabel,
        });
      });

      // Index quotes from each theme
      theme.quotes.forEach(function (quote) {
        if (!quote) return;
        CONTENT_INDEX.push({
          text: quote,
          source: '',
          type: 'quote',
          themeIndex: themeIndex,
          themeLabel: themeLabel,
          sectionId: themeId,
          sectionLabel: SECTION_KEY_TO_LABEL[themeId] || themeLabel,
        });
      });

      themeIndex++;
    });

    // Index section intros and headings from content.json
    var sections = contentData.sections || {};
    Object.keys(SECTION_KEY_TO_ID).forEach(function (key) {
      var sec = sections[key];
      if (!sec) return;
      var sectionId = SECTION_KEY_TO_ID[key];
      var sectionLabel = SECTION_KEY_TO_LABEL[key] || key;

      if (sec.intro) {
        CONTENT_INDEX.push({
          text: sec.intro,
          source: '',
          type: 'intro',
          themeIndex: Object.keys(SECTION_KEY_TO_ID).indexOf(key),
          themeLabel: sectionLabel,
          sectionId: sectionId,
          sectionLabel: sectionLabel,
        });
      }

      if (sec.heading) {
        CONTENT_INDEX.push({
          text: sec.heading.replace(/<[^>]+>/g, ''),
          source: '',
          type: 'heading',
          themeIndex: Object.keys(SECTION_KEY_TO_ID).indexOf(key),
          themeLabel: sectionLabel,
          sectionId: sectionId,
          sectionLabel: sectionLabel,
        });
      }
    });

    // Today section
    if (sections.today && sections.today.heading) {
      CONTENT_INDEX.push({
        text: sections.today.heading.replace(/<[^>]+>/g, ''),
        source: '',
        type: 'heading',
        themeIndex: -1,
        themeLabel: "Today's Reflection",
        sectionId: 'today',
        sectionLabel: "Today's Reflection",
      });
    }

    // Index koans
    if (koansData && koansData.koans) {
      koansData.koans.forEach(function (koan) {
        if (!koan.text) return;
        CONTENT_INDEX.push({
          text: koan.text,
          source: koan.source || '',
          type: 'koan',
          themeIndex: 99,
          themeLabel: 'Daily Contemplation',
          sectionId: 'koan',
          sectionLabel: 'VI. Daily Contemplation',
        });
        if (koan.interpretation) {
          CONTENT_INDEX.push({
            text: koan.interpretation,
            source: '',
            type: 'koan-interpretation',
            themeIndex: 99,
            themeLabel: 'Daily Contemplation',
            sectionId: 'koan',
            sectionLabel: 'VI. Daily Contemplation',
          });
        }
      });
    }
  }

  // ── Search ──────────────────────────────────────────────────────
  function search(query) {
    if (!INDEX_BUILT) return [];
    var q = normalize(query);
    if (!q) return [];
    var queryWords = q.split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!queryWords.length) return [];

    var results = [];
    for (var i = 0; i < CONTENT_INDEX.length; i++) {
      var item = CONTENT_INDEX[i];
      var score = scoreMatch(item.text, queryWords);
      if (score > 0) {
        results.push({
          text: item.text,
          source: item.source,
          type: item.type,
          themeIndex: item.themeIndex,
          themeLabel: item.themeLabel,
          sectionId: item.sectionId,
          sectionLabel: item.sectionLabel,
          score: score,
        });
      }
    }

    // Sort by score descending
    results.sort(function (a, b) { return b.score - a.score; });

    // Deduplicate by text
    var seen = {};
    var deduped = [];
    for (var j = 0; j < results.length; j++) {
      var key = normalize(results[j].text);
      if (!seen[key]) {
        seen[key] = true;
        deduped.push(results[j]);
      }
    }

    return deduped.slice(0, 30); // Cap at 30 results
  }

  // ── UI ──────────────────────────────────────────────────────────
  function createOverlay() {
    var overlay = document.getElementById('search-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search content');

    overlay.innerHTML =
      '<div class="search-backdrop"></div>' +
      '<div class="search-panel">' +
        '<div class="search-header">' +
          '<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="11" cy="11" r="8"/>' +
            '<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
          '</svg>' +
          '<input type="text" class="search-input" id="search-input" placeholder="Search facts, quotes, koans…" autocomplete="off" spellcheck="false" aria-label="Search content" aria-autocomplete="list" aria-controls="search-results"/>' +
          '<button class="search-close-btn" id="search-close-btn" aria-label="Close search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<line x1="18" y1="6" x2="6" y2="18"/>' +
              '<line x1="6" y1="6" x2="18" y2="18"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="search-hint"><kbd>/</kbd> to search · <kbd>Esc</kbd> to close</div>' +
        '<div class="search-results" id="search-results" role="listbox"></div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Backdrop click closes
    overlay.querySelector('.search-backdrop').addEventListener('click', hideOverlay);

    // Close button
    overlay.querySelector('#search-close-btn').addEventListener('click', hideOverlay);

    // Input handling
    var input = overlay.querySelector('#search-input');
    var debounceTimer = null;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        performSearch(input.value);
      }, 150);
    });

    // Keyboard nav
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideOverlay();
      } else if (e.key === 'Enter') {
        var firstResult = overlay.querySelector('.search-result-item');
        if (firstResult) {
          firstResult.click();
        }
      }
    });

    return overlay;
  }

  function performSearch(query) {
    var resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (!query.trim()) {
      resultsContainer.innerHTML = '<div class="search-empty">Type to search across facts, quotes, koans, and section intros.</div>';
      return;
    }

    if (!INDEX_BUILT) {
      resultsContainer.innerHTML = '<div class="search-empty">Building search index…</div>';
      return;
    }

    var results = search(query);
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-empty">No results found for "<em>' + escapeHtml(query) + '</em>"</div>';
      return;
    }

    var queryWords = normalize(query).split(/\s+/).filter(function (w) { return w.length > 1; });
    var html = '';
    var grouped = {};

    // Group by section
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var groupKey = r.sectionId || r.themeLabel;
      if (!grouped[groupKey]) {
        grouped[groupKey] = { label: r.sectionLabel || r.themeLabel, sectionId: r.sectionId, items: [] };
      }
      grouped[groupKey].items.push(r);
    }

    var groupKeys = Object.keys(grouped);
    for (var g = 0; g < groupKeys.length; g++) {
      var group = grouped[groupKeys[g]];
      html += '<div class="search-group">';
      html += '<div class="search-group-label">' + escapeHtml(group.label) + '</div>';

      for (var j = 0; j < group.items.length; j++) {
        var item = group.items[j];
        var snippet = truncate(item.text, 180);
        var highlighted = highlightMatch(snippet, queryWords);
        var typeLabel = item.type === 'fact' ? 'Fact' : item.type === 'quote' ? 'Quote' : item.type === 'koan' ? 'Koan' : item.type === 'intro' ? 'Intro' : 'Heading';

        html += '<div class="search-result-item" role="option" data-section-id="' + escapeHtml(item.sectionId) + '" tabindex="0">';
        html += '<div class="search-result-type">' + typeLabel + '</div>';
        html += '<div class="search-result-text">' + highlighted + '</div>';
        if (item.source) {
          html += '<div class="search-result-source">' + escapeHtml(item.source) + '</div>';
        }
        html += '<div class="search-result-jump">↗ Jump to section</div>';
        html += '</div>';
      }

      html += '</div>';
    }

    html += '<div class="search-results-count">' + results.length + ' result' + (results.length !== 1 ? 's' : '') + '</div>';
    resultsContainer.innerHTML = html;

    // Attach click handlers
    var items = resultsContainer.querySelectorAll('.search-result-item');
    for (var k = 0; k < items.length; k++) {
      (function (el) {
        function onClick() {
          var sectionId = el.getAttribute('data-section-id');
          if (sectionId) {
            hideOverlay();
            var target = document.getElementById(sectionId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
        el.addEventListener('click', onClick);
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        });
      })(items[k]);
    }
  }

  function showOverlay() {
    var overlay = createOverlay();
    overlay.classList.add('search-overlay-visible');
    OVERLAY_VISIBLE = true;
    var input = document.getElementById('search-input');
    if (input) {
      setTimeout(function () { input.focus(); }, 50);
    }
    document.body.style.overflow = 'hidden';
  }

  function hideOverlay() {
    var overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.remove('search-overlay-visible');
    }
    OVERLAY_VISIBLE = false;
    document.body.style.overflow = '';
  }

  // ── Search Button ───────────────────────────────────────────────
  function createSearchButton() {
    var btn = document.getElementById('search-btn');
    if (btn) return;

    btn = document.createElement('button');
    btn.id = 'search-btn';
    btn.className = 'search-toggle-btn';
    btn.setAttribute('aria-label', 'Search content');
    btn.setAttribute('title', 'Search (/)');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="8"/>' +
        '<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '</svg>';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (OVERLAY_VISIBLE) {
        hideOverlay();
      } else {
        showOverlay();
      }
    });

    document.body.appendChild(btn);
  }

  // ── Keyboard Shortcut ───────────────────────────────────────────
  function onKeyDown(e) {
    // '/' to open search (unless already in an input)
    if (e.key === '/' && !OVERLAY_VISIBLE) {
      var tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return;
      }
      e.preventDefault();
      showOverlay();
      return;
    }

    // Escape to close
    if (e.key === 'Escape' && OVERLAY_VISIBLE) {
      hideOverlay();
      return;
    }
  }

  // ── Testing Hooks (exposed on window for test access) ────────
  // Must be defined BEFORE init() so tests can access them
  if (typeof window !== 'undefined') {
    window.__csSetCache = function(index, built, themes, keyToId, keyToLabel) {
      CONTENT_INDEX = index || [];
      INDEX_BUILT = built || false;
      THEME_LABELS = themes || [];
      SECTION_KEY_TO_ID = keyToId || SECTION_KEY_TO_ID;
      SECTION_KEY_TO_LABEL = keyToLabel || SECTION_KEY_TO_LABEL;
    };
    window.__csGetCache = function() {
      return {
        CONTENT_INDEX: CONTENT_INDEX,
        THEME_LABELS: THEME_LABELS,
        INDEX_BUILT: INDEX_BUILT,
        SECTION_KEY_TO_ID: SECTION_KEY_TO_ID,
        SECTION_KEY_TO_LABEL: SECTION_KEY_TO_LABEL
      };
    };
    window.__csBuildIndex = buildIndex;
    window.__csAssembleIndex = assembleIndex;
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    // Skip init during tests (detected via test environment)
    if (typeof window !== 'undefined' && window.__isUnitTest) {
      return;
    }
    // Build index in background
    requestIdleCallback(function () {
      buildIndex();
    });

    // Create UI
    createSearchButton();

    // Listen for keyboard shortcut
    document.addEventListener('keydown', onKeyDown);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
