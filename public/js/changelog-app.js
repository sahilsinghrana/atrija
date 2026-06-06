(function() {
  var app = document.getElementById('changelog-app');
  if (!app) return;

  function typeIcon(type) {
    var m = {'initial':'✦','feature':'◆','fix':'◈','content':'✎','design':'◐','daily-mutation':'✧','refactor':'⟳','perf':'⚡','chore':'⚙'};
    return m[type] || '•';
  }

  function typeLabel(type) {
    return (type || '').replace('-', ' ');
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

    // Click to expand/collapse
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
        // Lazy-load entries on first expand
        if (!card.dataset.loaded) {
          card.dataset.loaded = '1';
          fetch('/changelog/' + d.date + '.json')
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

  // Fetch index and render
  fetch('/changelog/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var dates = data.dates || [];
      if (!dates.length) {
        app.innerHTML = '<div class="changelog-empty">No changelog entries yet.</div>';
        return;
      }
      app.innerHTML = '';
      dates.forEach(function(d) {
        app.appendChild(renderDateCard(d));
      });
    })
    .catch(function() {
      app.innerHTML = '<div class="changelog-error">Failed to load changelog.</div>';
    });
})();
