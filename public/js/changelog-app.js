(function() {
  'use strict';
  var app = document.getElementById('changelog-app');
  if (!app) return;

  // ── Config ──
  var PAGE_SIZE = 8;
  var FILTERS = [
    { key: 'all',          label: 'All',        icon: '◉' },
    { key: 'daily-mutation', label: 'Mutate',   icon: '✧' },
    { key: 'feature',      label: 'Features',   icon: '◆' },
    { key: 'content',      label: 'Content',    icon: '✎' },
    { key: 'fix',          label: 'Fixes',      icon: '◈' },
    { key: 'design',       label: 'Design',     icon: '◐' },
    { key: 'perf',         label: 'Perf',       icon: '⚡' },
    { key: 'refactor',     label: 'Refactor',   icon: '⟳' },
    { key: 'chore',        label: 'Chore',      icon: '⚙' },
  ];
  var TYPE_ICONS = {};
  FILTERS.forEach(function(f) { TYPE_ICONS[f.key] = f.icon; });
  TYPE_ICONS['initial'] = '✦';

  // ── State ──
  var state = {
    filter: 'all',
    page: 1,
    dates: [],
    expanded: {},        // date -> bool
    loaded: {},          // date -> bool
    loading: {},         // date -> bool
    failed: {},          // date -> bool
    entries: {},         // date -> entry[]
    totalEntries: 0,
    filterCounts: {},    // filter key -> count
  };

  // ── Helpers ──
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function typeIcon(type) { return TYPE_ICONS[type] || '•'; }

  function typeLabel(type) { return (type || '').replace(/-/g, ' '); }

  function relativeDate(ds) {
    var parts = ds.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diffDays = Math.round((today - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    if (diffDays < 30) return Math.round(diffDays / 7) + ' weeks ago';
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function shortDate(ds) {
    var parts = ds.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[+parts[1] - 1] + ' ' + (+parts[2]);
  }

  // ── Compute filter counts from index data ──
  function computeFilterCounts() {
    var counts = { all: 0 };
    FILTERS.forEach(function(f) { if (f.key !== 'all') counts[f.key] = 0; });
    state.dates.forEach(function(d) {
      counts.all += d.entries || 0;
      // Count by latestType (best-effort from index)
      var t = d.latestType || '';
      if (counts[t] !== undefined) counts[t] += d.entries || 0;
    });
    state.filterCounts = counts;
  }

  // ── Filtering ──
  function getFilteredDates() {
    if (state.filter === 'all') return state.dates;
    return state.dates.filter(function(d) {
      return d.latestType === state.filter;
    });
  }

  // ── Render: filter bar ──
  function renderFilterBar() {
    var bar = document.createElement('div');
    bar.className = 'changelog-filters';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Filter changelog by type');

    FILTERS.forEach(function(f) {
      var count = state.filterCounts[f.key] || 0;
      // Hide filters with 0 entries (except 'all')
      if (f.key !== 'all' && count === 0) return;

      var btn = document.createElement('button');
      btn.className = 'changelog-filter-btn' + (f.key === state.filter ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('data-filter', f.key);
      btn.setAttribute('aria-pressed', f.key === state.filter ? 'true' : 'false');
      btn.setAttribute('aria-selected', f.key === state.filter ? 'true' : 'false');
      btn.innerHTML =
        '<span class="changelog-filter-icon">' + f.icon + '</span>' +
        '<span class="changelog-filter-label">' + f.label + '</span>' +
        '<span class="changelog-filter-count">' + count + '</span>';

      btn.addEventListener('click', function() {
        if (state.filter === f.key) return;
        state.filter = f.key;
        state.page = 1;
        // Update active states
        bar.querySelectorAll('.changelog-filter-btn').forEach(function(b) {
          var isActive = b.dataset.filter === f.key;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderDates();
      });

      // Keyboard nav: left/right arrows
      btn.addEventListener('keydown', function(e) {
        var btns = Array.from(bar.querySelectorAll('.changelog-filter-btn'));
        var idx = btns.indexOf(btn);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var next = btns[(idx + 1) % btns.length];
          if (next) next.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = btns[(idx - 1 + btns.length) % btns.length];
          if (prev) prev.focus();
        }
      });

      bar.appendChild(btn);
    });

    return bar;
  }

  // ── Render: summary line ──
  function renderSummary() {
    var filtered = getFilteredDates();
    var totalDates = filtered.length;
    var totalE = 0;
    filtered.forEach(function(d) { totalE += d.entries || 0; });

    var el = document.createElement('div');
    el.className = 'changelog-summary';
    if (state.filter === 'all') {
      el.textContent = totalDates + ' update' + (totalDates !== 1 ? 's' : '') + ' · ' + totalE + ' total entries';
    } else {
      var label = typeLabel(state.filter);
      el.textContent = totalE + ' ' + label + ' entr' + (totalE !== 1 ? 'ies' : 'y') + ' across ' + totalDates + ' date' + (totalDates !== 1 ? 's' : '');
    }
    return el;
  }

  // ── Render: single entry ──
  function renderEntry(e) {
    var html = '<div class="changelog-entry" data-type="' + esc(e.type) + '">';
    html += '<div class="changelog-entry-header">';
    if (e.time) {
      html += '<time class="changelog-entry-time" datetime="' + esc(e.date + 'T' + e.time) + '">' + esc(e.time) + '</time>';
    }
    html += '<span class="changelog-type type-' + esc(e.type || '') + '">' + typeIcon(e.type) + ' ' + esc(typeLabel(e.type)) + '</span>';
    html += '</div>';
    if (e.description) {
      html += '<div class="changelog-entry-desc">' + esc(e.description) + '</div>';
    }
    if (e.changes && e.changes.length) {
      html += '<ul class="changelog-changes">';
      e.changes.forEach(function(c) { html += '<li>' + esc(c) + '</li>'; });
      html += '</ul>';
    }
    html += '</div>';
    return html;
  }

  // ── Render: date card ──
  function renderDateCard(d) {
    var card = document.createElement('div');
    card.className = 'changelog-date-card';
    card.dataset.date = d.date;

    var isExpanded = !!state.expanded[d.date];
    var isLoaded = !!state.loaded[d.date];
    var isLoading = !!state.loading[d.date];
    var isFailed = !!state.failed[d.date];

    // ── Header ──
    var header = document.createElement('button');
    header.className = 'changelog-date-header';
    header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    header.setAttribute('aria-controls', 'changelog-body-' + d.date);

    var typeLabelText = typeLabel(d.latestType);
    header.innerHTML =
      '<span class="changelog-date-arrow" aria-hidden="true">' + (isExpanded ? '▾' : '▸') + '</span>' +
      '<span class="changelog-date-relative">' + esc(relativeDate(d.date)) + '</span>' +
      '<span class="changelog-date-short">' + esc(shortDate(d.date)) + '</span>' +
      '<span class="changelog-entry-count">' + (d.entries || 0) + '</span>' +
      '<span class="changelog-date-type type-' + esc(d.latestType || '') + '">' + typeIcon(d.latestType) + ' ' + esc(typeLabelText) + '</span>';

    // ── Body ──
    var body = document.createElement('div');
    body.className = 'changelog-date-body' + (isExpanded ? ' open' : '');
    body.id = 'changelog-body-' + d.date;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', 'changelog-header-' + d.date);

    if (isExpanded) {
      if (isLoading) {
        body.innerHTML = '<div class="changelog-loading-entries"><span class="changelog-spinner"></span> Loading…</div>';
      } else if (isFailed) {
        body.innerHTML = '<div class="changelog-error">Failed to load. <button class="changelog-retry" data-date="' + esc(d.date) + '">Retry</button></div>';
      } else if (isLoaded && state.entries[d.date]) {
        var entries = state.entries[d.date];
        if (entries.length) {
          var html = '';
          entries.forEach(function(e) { html += renderEntry(e); });
          body.innerHTML = html;
        }
      }
    }

    // ── Toggle handler ──
    header.addEventListener('click', function() {
      if (state.expanded[d.date]) {
        // Collapse
        state.expanded[d.date] = false;
        body.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
        header.querySelector('.changelog-date-arrow').textContent = '▸';
      } else {
        // Expand
        state.expanded[d.date] = true;
        body.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        header.querySelector('.changelog-date-arrow').textContent = '▾';

        if (!state.loaded[d.date] && !state.loading[d.date]) {
          loadDateEntries(d.date);
        } else if (state.entries[d.date]) {
          // Re-render loaded entries
          var entries = state.entries[d.date];
          if (entries.length) {
            var html = '';
            entries.forEach(function(e) { html += renderEntry(e); });
            body.innerHTML = html;
          }
        }
      }
    });

    card.appendChild(header);
    card.appendChild(body);

    // Delegate retry clicks
    card.addEventListener('click', function(e) {
      var retryBtn = e.target.closest('.changelog-retry');
      if (retryBtn) {
        e.stopPropagation();
        var date = retryBtn.dataset.date;
        if (date) loadDateEntries(date);
      }
    });

    return card;
  }

  // ── Load entries for a date ──
  function loadDateEntries(date) {
    state.loading[date] = true;
    state.failed[date] = false;

    // Update UI to show loading
    var body = document.getElementById('changelog-body-' + date);
    if (body) {
      body.innerHTML = '<div class="changelog-loading-entries"><span class="changelog-spinner"></span> Loading…</div>';
    }

    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 10000);

    fetch('/content/changelog/' + date + '.json', { signal: controller.signal })
      .then(function(r) {
        clearTimeout(timeout);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        state.loading[date] = false;
        state.loaded[date] = true;
        state.entries[date] = data.entries || [];

        // Update UI
        if (body) {
          var entries = state.entries[date];
          if (entries.length) {
            var html = '';
            entries.forEach(function(e) { html += renderEntry(e); });
            body.innerHTML = html;
          } else {
            body.innerHTML = '<div class="changelog-empty-entries">No entries for this date.</div>';
          }
        }
      })
      .catch(function() {
        clearTimeout(timeout);
        state.loading[date] = false;
        state.failed[date] = true;
        if (body) {
          body.innerHTML = '<div class="changelog-error">Failed to load entries. <button class="changelog-retry" data-date="' + esc(date) + '">Retry</button></div>';
        }
      });
  }

  // ── Render: date list + load more ──
  function renderDates() {
    var filtered = getFilteredDates();
    var start = 0;
    var end = state.page * PAGE_SIZE;
    var pageDates = filtered.slice(0, end);

    // Remember scroll position
    var prevScroll = app.scrollTop;

    // Clear app but preserve filter bar
    var filterBar = app.querySelector('.changelog-filters');
    var oldSummary = app.querySelector('.changelog-summary');
    app.innerHTML = '';

    if (filterBar) app.appendChild(filterBar);

    if (!filtered.length) {
      var empty = document.createElement('div');
      empty.className = 'changelog-empty-state';
      empty.innerHTML =
        '<div class="changelog-empty-icon">📭</div>' +
        '<div class="changelog-empty-text">No ' + esc(typeLabel(state.filter)) + ' entries yet.</div>' +
        '<div class="changelog-empty-sub">Check back later or select a different filter.</div>';
      app.appendChild(empty);
      return;
    }

    // Summary
    app.appendChild(renderSummary());

    // Date cards container
    var container = document.createElement('div');
    container.className = 'changelog-timeline';
    pageDates.forEach(function(d) {
      container.appendChild(renderDateCard(d));
    });
    app.appendChild(container);

    // Load more
    if (end < filtered.length) {
      var remaining = filtered.length - end;
      var btn = document.createElement('button');
      btn.className = 'changelog-load-more';
      btn.innerHTML =
        '<span class="changelog-load-more-text">Load more</span>' +
        '<span class="changelog-load-more-count">' + remaining + ' remaining</span>';
      btn.addEventListener('click', function() {
        state.page++;
        renderDates();
        // Scroll to show new content
        var newCards = container.querySelectorAll('.changelog-date-card');
        if (newCards.length > PAGE_SIZE) {
          var firstNew = newCards[newCards.length - PAGE_SIZE];
          if (firstNew) firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      app.appendChild(btn);
    }
  }

  // ── Initial load ──
  function init() {
    // Show skeleton loading
    app.innerHTML = '<div class="changelog-skeleton">' +
      '<div class="changelog-skeleton-bar"></div>' +
      '<div class="changelog-skeleton-card"></div>' +
      '<div class="changelog-skeleton-card"></div>' +
      '<div class="changelog-skeleton-card"></div>' +
      '</div>';

    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 15000);

    fetch('/content/changelog/index.json', { signal: controller.signal })
      .then(function(r) {
        clearTimeout(timeout);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        state.dates = data.dates || [];
        state.totalEntries = data.totalEntries || 0;
        computeFilterCounts();

        if (!state.dates.length) {
          app.innerHTML = '<div class="changelog-empty-state">' +
            '<div class="changelog-empty-icon">📋</div>' +
            '<div class="changelog-empty-text">No changelog entries yet.</div>' +
            '<div class="changelog-empty-sub">Updates will appear here as the project evolves.</div>' +
            '</div>';
          return;
        }

        app.innerHTML = '';
        app.appendChild(renderFilterBar());
        renderDates();
      })
      .catch(function() {
        clearTimeout(timeout);
        app.innerHTML = '<div class="changelog-error-state">' +
          '<div class="changelog-error-icon">⚠</div>' +
          '<div class="changelog-error-text">Failed to load changelog.</div>' +
          '<button class="changelog-retry-btn" onclick="location.reload()">Reload page</button>' +
          '</div>';
      });
  }

  init();
})();
