/**
 * Content Prefetch — Preload Critical JSON on Idle
 *
 * After the 3D scene signals ready, prefetches content.json, siteData.json,
 * and changelog/index.json in the background using requestIdleCallback.
 * Results are cached in window.__contentCache for other modules to use.
 *
 * Respects Save-Data and prefers-reduced-data headers.
 * Zero scene-init.js changes. Standalone module.
 */
(function() {
  'use strict';

  // ── Respect data-saving preferences ──
  function shouldPrefetch() {
    // Check Save-Data header (via Network Information API or header)
    if (navigator.connection && navigator.connection.saveData === true) {
      return false;
    }
    // Check prefers-reduced-data media query
    if (window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      return false;
    }
    return true;
  }

  // ── Cache API ──
  var CACHE = window.__contentCache || (window.__contentCache = {});

  /**
   * Fetch a JSON URL and cache it under the given key.
   * Returns a promise that resolves with the parsed data.
   */
  function prefetchJSON(key, url) {
    if (CACHE[key]) {
      return Promise.resolve(CACHE[key]);
    }
    return fetch(url)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        CACHE[key] = data;
        return data;
      })
      .catch(function() {
        // Silently fail — modules will fetch on demand
      });
  }

  // ── Prefetch all critical JSON ──
  function doPrefetch() {
    if (!shouldPrefetch()) return;

    var urls = [
      { key: 'content',   url: '/content/content.json' },
      { key: 'siteData',  url: '/content/siteData.json' },
      { key: 'changelog', url: '/content/changelog/index.json' },
    ];

    urls.forEach(function(item) {
      prefetchJSON(item.key, item.url);
    });
  }

  // ── Schedule prefetch after scene ready ──
  function schedulePrefetch() {
    // Use requestIdleCallback with setTimeout fallback for Safari
    if ('requestIdleCallback' in window) {
      requestIdleCallback(doPrefetch, { timeout: 5000 });
    } else {
      setTimeout(doPrefetch, 250);
    }
  }

  // ── Wrap window.__sceneReady to trigger prefetch ──
  // BaseLayout.astro sets window.__sceneReady as a callback.
  // We wrap it so the original behavior is preserved, then prefetch fires.
  var originalSceneReady = window.__sceneReady;
  window.__sceneReady = function() {
    if (typeof originalSceneReady === 'function') {
      originalSceneReady();
    }
    schedulePrefetch();
  };
})();
