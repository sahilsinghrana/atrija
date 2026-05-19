(function() {
  var app = document.getElementById('changelog-app');
  if (!app) return;

  var INITIAL_DATES = 2;
  var allDates = [];
  var loadedDates = {};
  var expandedDates = {};

  function typeIcon(type) {
    var m = {'initial':'✦','feature':'◆','fix':'◈','content':'✎','design':'◐','daily-mutation':'✧','refactor':'⟳','perf':'⚡','chore':'⚙'};
    return m[type] || '•';
  }

  function typeLabel(type) {
    return type.replace('-', ' ');
  }

  function formatDate(ds) {
    var p = ds.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(p[1],10)-1] + ' ' + parseInt(p[2],10) + ', ' + p[0];
  }

  function renderEntry(e) {
    var html = '<div class="changelog-entry">';
    html += '<div class="changelog-entry-header">';
    html += '<span class="changelog-entry-time">' + (e.time || '') + '</span>';
    html += '<span class="changelog-type type-' + e.type + '">' + typeIcon(e.type) + ' ' + typeLabel(e.type) + '</span>';
    html += '</div>';
    html += '<div class="changelog-desc">' + e.description + '</div>';
    if (e.changes && e.changes.length) {
      html += '<ul class="changelog-changes">';
      e.changes.forEach(function(c) { html += '<li>' + c + '</li>'; });
      html += '</ul>';
    }
    html += '</div>';
    return html;
  }

  function renderDateCard(d) {
    var dateKey = d.date;
    var isExpanded = expandedDates[dateKey];
    var isLoading = loadedDates[dateKey] === 'loading';
    var isLoaded = loadedDates[dateKey] && loadedDates[dateKey] !== 'loading';
    var entryCount = d.entries || 0;

    var html = '<div class="changelog-date-card" data-date="' + dateKey + '">';
    html += '<button class="changelog-date-header" aria-expanded="' + (isExpanded ? 'true' : 'false') + '">';
    html += '<span class="changelog-date-arrow' + (isExpanded ? ' expanded' : '') + '">▸</span>';
    html += '<span class="changelog-date-label">' + formatDate(dateKey) + '</span>';
    html += '<span class="changelog-entry-count">' + entryCount + ' ' + (entryCount === 1 ? 'entry' : 'entries') + '</span>';
    html += '<span class="changelog-date-type type-' + (d.latestType || '') + '">' + typeIcon(d.latestType) + ' ' + typeLabel(d.latestType || '') + '</span>';
    html += '</button>';
    html += '<div class="changelog-date-body' + (isExpanded ? ' open' : '') + '"' + (isExpanded ? '' : ' hidden') + '">';
    if (isLoading) {
      html += '<div class="changelog-loading">Loading…</div>';
    } else if (isLoaded) {
      var entries = loadedDates[dateKey].entries || [];
      entries.forEach(function(e) { html += renderEntry(e); });
    } else {
      html += '<div class="changelog-placeholder">Click to load entries</div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderApp() {
    var shownDates = allDates.slice(0, INITIAL_DATES);
    var hasMore = allDates.length > INITIAL_DATES;

    var html = '';
    shownDates.forEach(function(d) { html += renderDateCard(d); });

    if (hasMore) {
      html += '<button class="changelog-load-more">Load older entries <span class="changelog-remaining">(' + (allDates.length - INITIAL_DATES) + ' more)</span></button>';
    }

    app.innerHTML = html;

    // Attach click handlers
    app.querySelectorAll('.changelog-date-header').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var card = btn.closest('.changelog-date-card');
        var dateKey = card.dataset.date;
        var body = card.querySelector('.changelog-date-body');
        var arrow = card.querySelector('.changelog-date-arrow');

        if (expandedDates[dateKey]) {
          // Collapse
          expandedDates[dateKey] = false;
          body.classList.remove('open');
          body.setAttribute('hidden', '');
          arrow.classList.remove('expanded');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          // Expand
          expandedDates[dateKey] = true;
          body.classList.add('open');
          body.removeAttribute('hidden');
          arrow.classList.add('expanded');
          btn.setAttribute('aria-expanded', 'true');

          // Lazy load if not yet loaded
          if (!loadedDates[dateKey]) {
            loadedDates[dateKey] = 'loading';
            var placeholder = body.querySelector('.changelog-placeholder');
            if (placeholder) placeholder.replaceWith(document.createRange().createContextualFragment('<div class="changelog-loading">Loading…</div>'));

            fetch('/changelog/' + dateKey + '.json')
              .then(function(r) { return r.json(); })
              .then(function(data) {
                loadedDates[dateKey] = data;
                var entriesHtml = '';
                (data.entries || []).forEach(function(e) { entriesHtml += renderEntry(e); });
                var loadingEl = body.querySelector('.changelog-loading');
                if (loadingEl) loadingEl.replaceWith(document.createRange().createContextualFragment(entriesHtml));
              })
              .catch(function() {
                loadedDates[dateKey] = { entries: [] };
                var loadingEl = body.querySelector('.changelog-loading');
                if (loadingEl) loadingEl.textContent = 'Failed to load.';
              });
          }
        }
      });
    });

    // Load more button
    var loadMoreBtn = app.querySelector('.changelog-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        INITIAL_DATES = allDates.length;
        renderApp();
      });
    }
  }

  // Fetch index
  fetch('/changelog/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      allDates = (data.dates || []).reverse(); // newest first
      renderApp();
    })
    .catch(function() {
      app.innerHTML = '<div class="changelog-error">Failed to load changelog.</div>';
    });
})();