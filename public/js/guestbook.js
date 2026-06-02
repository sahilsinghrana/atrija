(function() {
  'use strict';

  var STORAGE_KEY = 'atrija_guestbook';
  var MAX_ENTRIES = 50;

  var form = document.getElementById('guestbook-form');
  var nameInput = document.getElementById('guestbook-name');
  var msgInput = document.getElementById('guestbook-message');
  var listEl = document.getElementById('guestbook-list');
  var countEl = document.getElementById('guestbook-count');
  var nameCountEl = document.getElementById('name-count');
  var msgCountEl = document.getElementById('msg-count');

  if (!form || !msgInput || !listEl) return;

  // ── Load entries from localStorage ──
  function loadEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  // ── Save entries to localStorage ──
  function saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      // Storage full — prune oldest entries and retry
      if (entries.length > 10) {
        var pruned = entries.slice(0, Math.floor(entries.length / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
          return pruned;
        } catch (e2) {
          // Give up silently
        }
      }
    }
    return entries;
  }

  // ── Format timestamp ──
  function formatTime(iso) {
    try {
      var d = new Date(iso);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var month = months[d.getMonth()];
      var day = d.getDate();
      var hours = d.getHours();
      var mins = d.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      var minStr = mins < 10 ? '0' + mins : '' + mins;
      return month + ' ' + day + ', ' + hours + ':' + minStr + ' ' + ampm;
    } catch (e) {
      return '';
    }
  }

  // ── Render entries ──
  function renderEntries() {
    var entries = loadEntries();
    countEl && (countEl.textContent = entries.length);

    if (!entries.length) {
      listEl.innerHTML = '<p class="guestbook-empty">No impressions yet. Be the first to leave your mark.</p>';
      return;
    }

    var html = '';
    for (var i = entries.length - 1; i >= 0; i--) {
      var e = entries[i];
      var name = e.name ? escapeHtml(e.name) : 'Anonymous';
      var nameClass = e.name ? 'guestbook-entry-name' : 'guestbook-entry-name anonymous';
      var msg = escapeHtml(e.message);
      var time = formatTime(e.timestamp);

      html += '<div class="guestbook-entry">';
      html += '<div class="guestbook-entry-header">';
      html += '<span class="' + nameClass + '">' + name + '</span>';
      html += '<span class="guestbook-entry-time">' + time + '</span>';
      html += '</div>';
      html += '<p class="guestbook-entry-message">' + msg + '</p>';
      html += '</div>';
    }

    listEl.innerHTML = html;
  }

  // ── Escape HTML ──
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ── Show toast ──
  function showToast(message) {
    var existing = document.getElementById('guestbook-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'guestbook-toast';
    toast.className = 'guestbook-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2500);
  }

  // ── Character counters ──
  if (nameInput && nameCountEl) {
    nameInput.addEventListener('input', function() {
      nameCountEl.textContent = nameInput.value.length;
    });
  }

  if (msgInput && msgCountEl) {
    msgInput.addEventListener('input', function() {
      msgCountEl.textContent = msgInput.value.length;
    });
  }

  // ── Form submit ──
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var message = msgInput.value.trim();
    if (!message) {
      msgInput.focus();
      return;
    }

    var name = nameInput.value.trim();

    // Disable button during submit
    var btn = form.querySelector('.guestbook-submit');
    if (btn) btn.classList.add('submitting');

    // Simulate brief async (for UX feel)
    setTimeout(function() {
      var entries = loadEntries();

      entries.push({
        name: name,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Enforce max entries
      while (entries.length > MAX_ENTRIES) {
        entries.shift();
      }

      saveEntries(entries);
      renderEntries();

      // Reset form
      msgInput.value = '';
      nameInput.value = '';
      if (nameCountEl) nameCountEl.textContent = '0';
      if (msgCountEl) msgCountEl.textContent = '0';

      if (btn) btn.classList.remove('submitting');

      showToast('Your impression has been left upon the canvas.');
    }, 300);
  });

  // ── Initial render ──
  renderEntries();

})();
