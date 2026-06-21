(function() {
  var app = document.getElementById('changelog-app');
  if (!app) return;

  var PAGE_SIZE = 10;
  var currentPage = 1;
  var currentFilter = 'all';
  var allDates = [];
  var totalEntries = 0;

  function typeIcon(type) {
    var m = {'initial':'✦','feature':'◆','fix':'◈','content':'✎','design':'◐','daily-mutation':'✧','refactor':'⟳','perf':'⚡','chore':'⚙'};
    return m[type] || '•';
  }

  function typeLabel(type) {
    return (type || '').replace(/-/g, ' ');
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
    html += '<span class="changelog-type type-' + (e.type || '') + '">' + typeIcon(e.type) + ' ' + typeLabel(e.type || '') + '</span>';
    html += '</div>';
    html += '<div class="changelog-entry-desc">' + (e.description || '') + '</div>';
    if (e.changes && e.changes.length) {
      html += '<ul class="changelog-changes">';
      e.changes.forEach(function(c) { html += '<li>' + c + '</li>'; });
      html += '</ul>';
    }
    html += '</div>';
    return html;
  }

  function renderDateCard(d) {
    var card = document.createElement('div');
    card.className = 'changelog-date-card';
    card.dataset.date = d.date;
    card.dataset.type = d.latestType || '';

    var header = document.createElement('div');
    header.className = 'changelog-date-header';
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML =
      '<span class="changelog-date-arrow">▸</span>' +
      '<span class="changelog-date-label">' + formatDate(d.date) + '</span>' +
      '<span class="changelog-entry-count">' + (d.entries || 0) + ' ' + ((d.entries || 0) === 1 ? 'entry' : 'entries') + '</span>' +
      '<span class="changelog-date-type type-' + (d.latestType || '') + '">' + typeIcon(d.latestType) + ' ' + typeLabel(d.latestType || '') + '</span>';

    var body = document.createElement('div');
    body.className = 'changelog-date-body';
    body.innerHTML = '<div class="changelog-description">' + (d.description || '') + '</div>';

    card.appendChild(header);
    card.appendChild(body);

    function toggle() {
      var isOpen = body.classList.contains('open');
      if (isOpen) {
        body.classList.remove('open');
        header.querySelector('.changelog-date-arrow').classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
      } else {
        body.classList.add('open');
        header.querySelector('.changelog-date-arrow').classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
        if (!card.dataset.loaded) {
          card.dataset.loaded = '1';
          fetch('/content/changelog/' + d.date + '.json')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data.entries && data.entries.length) {
                var entriesHtml = '';
                data.entries.forEach(function(e) { entriesHtml += renderEntry(e); });
                body.innerHTML = entriesHtml;
              }
            })
            .catch(function() {
              body.innerHTML = '<div class="changelog-error">Failed to load entries.</div>';
            });
        }
      }
    }

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    return card;
  }

  function renderFilterBar() {
    var types = [
      { key: 'all', label: 'All', icon: '◉' },
      { key: 'daily-mutation', label: 'Mutations', icon: '✧' },
      { key: 'feature', label: 'Features', icon: '◆' },
      { key: 'content', label: 'Content', icon: '✎' },
      { key: 'fix', label: 'Fixes', icon: '◈' },
      { key: 'design', label: 'Design', icon: '◐' },
      { key: 'perf', label: 'Perf', icon: '⚡' },
      { key: 'refactor', label: 'Refactor', icon: '⟳' },
      { key: 'chore', label: 'Chore', icon: '⚙' },
    ];
    var bar = document.createElement('div');
    bar.className = 'changelog-filters';
    types.forEach(function(t) {
      var btn = document.createElement('button');
      btn.className = 'changelog-filter-btn' + (t.key === currentFilter ? ' active' : '');
      btn.innerHTML = t.icon + ' ' + t.label;
      btn.setAttribute('data-filter', t.key);
      btn.setAttribute('aria-pressed', t.key === currentFilter ? 'true' : 'false');
      btn.addEventListener('click', function() {
        currentFilter = t.key;
        currentPage = 1;
        // Update active state
        bar.querySelectorAll('.changelog-filter-btn').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        renderPage();
      });
      bar.appendChild(btn);
    });
    return bar;
  }

  function getFilteredDates() {
    if (currentFilter === 'all') return allDates;
    return allDates.filter(function(d) {
      // A date card matches if ANY of its entries match the filter
      // We check latestType as a quick heuristic, but also need to check
      // if the date file has entries of the requested type
      // For now, use latestType as primary filter (good enough for most cases)
      return d.latestType === currentFilter;
    });
  }

  function renderPage() {
    var filtered = getFilteredDates();
    var totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    var start = (currentPage - 1) * PAGE_SIZE;
    var end = start + PAGE_SIZE;
    var pageDates = filtered.slice(start, end);

    // Clear but keep filter bar
    var filterBar = app.querySelector('.changelog-filters');
    var loadMoreBtn = app.querySelector('.changelog-load-more');
    app.innerHTML = '';
    if (filterBar) app.appendChild(filterBar);

    if (!pageDates.length) {
      app.innerHTML += '<div class="changelog-empty">No changelog entries for this filter.</div>';
      return;
    }

    pageDates.forEach(function(d) {
      app.appendChild(renderDateCard(d));
    });

    // Load more button
    if (end < filtered.length) {
      var remaining = filtered.length - end;
      var btn = document.createElement('button');
      btn.className = 'changelog-load-more';
      btn.innerHTML = 'Load more <span class="changelog-remaining">(' + remaining + ' more)</span>';
      btn.addEventListener('click', function() {
        currentPage++;
        // Append new cards instead of re-rendering
        var newStart = (currentPage - 1) * PAGE_SIZE;
        var newEnd = newStart + PAGE_SIZE;
        var newDates = filtered.slice(newStart, newEnd);
        newDates.forEach(function(d) {
          app.insertBefore(renderDateCard(d), btn);
        });
        if (newEnd < filtered.length) {
          var newRemaining = filtered.length - newEnd;
          btn.querySelector('.changelog-remaining').textContent = '(' + newRemaining + ' more)';
        } else {
          btn.remove();
        }
      });
      app.appendChild(btn);
    }
  }

  // Fetch index and render
  fetch('/content/changelog/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      allDates = data.dates || [];
      totalEntries = data.totalEntries || 0;
      if (!allDates.length) {
        app.innerHTML = '<div class="changelog-empty">No changelog entries yet.</div>';
        return;
      }
      // Render filter bar + first page
      app.innerHTML = '';
      app.appendChild(renderFilterBar());
      renderPage();
    })
    .catch(function() {
      app.innerHTML = '<div class="changelog-error">Failed to load changelog.</div>';
    });
})();
