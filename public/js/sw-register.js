/**
 * Service Worker Registration — Atrijā PWA
 * Registers /sw.js if the browser supports service workers.
 * Non-blocking: failures are silently caught so the site still works.
 * @see idea-056
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  // Use no query string — nginx serves SW with max-age=3600 which is fine.
  // The SW itself checks for updates on every navigation (skipWaiting + clients.claim).
  // Internal CACHE_NAME changes every build, triggering re-install.
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    // Don't use 'type: module' — service workers are classic scripts
  }).catch(function () {
    // Silently fail — site works fine without SW
  });
})();
