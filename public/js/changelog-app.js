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

  // Render date cards directly from index data (no lazy loading)
  function renderDateCard(d) {
    var html = '<div class="changelog-date-card">';
    html += '<div class="changelog-date-header">';
    html += '<span class="changelog-date-arrow">▸</span>';
    html += '<span class="changelog-date-label">' + formatDate(d.date) + '</span>';
    html += '<span class="changelog-entry-count">' + (d.entries || 0) + ' ' + ((d.entries || 0) === 1 ? 'entry' : 'entries') + '</span>';
    html += '<span class="changelog-date-type type-' + (d.latestType || '') + '">' + typeIcon(d.latestType) + ' ' + typeLabel(d.latestType || '') + '</span>';
    html += '</div>';
    html += '<div class="changelog-date-body">';
    html += '<div class="changelog-description">' + (d.description || '') + '</div>';
    html += '</div>';
    html += '</div>';
    return html;
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
      var html = '';
      dates.forEach(function(d) { html += renderDateCard(d); });
      app.innerHTML = html;
    })
    .catch(function() {
      app.innerHTML = '<div class="changelog-error">Failed to load changelog.</div>';
    });
})();
