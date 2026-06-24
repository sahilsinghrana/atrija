/**
 * Service Worker — Atrijā PWA Shell Cache
 * Caches HTML shell, CSS, JS modules, and static assets.
 * Network-first for JSON content (fresh data), cache-first for everything else.
 * @see idea-056
 */

const CACHE_NAME = 'atrija-shell-v63';

/** @type {string[]} — Pre-cache these at install time */
const PRECACHE_URLS = [
  '/',
  '/css/loader.css',
  '/css/main.css',
  '/js/scene-init.js',
  '/js/moon-phase.js',
  '/js/quote-carousel.js',
  '/js/brushstroke-cursor.js',
  '/js/theme-switcher.js',
  '/js/accessibility.js',
  '/js/scroll-lighting.js',
  '/js/section-nav.js',
  '/js/content-search.js',
  '/js/keyboard-help.js',
  '/js/reader-mode.js',
  '/js/performance-scaler.js',
  '/js/changelog-app.js',
  '/js/loader-boot.js',
  '/js/loader-progress.js',
];

/** Paths that should always fetch from network first (JSON content) */
const NETWORK_FIRST_PATTERNS = [
  /\/content\//,
  /\/changelog\//,
  /siteData\.json$/,
  /content\.json$/,
  /koans\.json$/,
  /seasons\.json$/,
];

/**
 * Check if a URL should use network-first strategy
 * @param {string} url
 * @returns {boolean}
 */
function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Install event — pre-cache the shell
 * @param {ExtendableEvent} event
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Add all precache URLs; don't fail the install if one is unreachable
        return Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Pre-cache failed for', url, err.message);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event — clean up old caches
 * @param {ExtendableEvent} event
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/**
 * Fetch event — route to cache-first or network-first
 * @param {FetchEvent} event
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and our own assets
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  // HTML navigation requests — always go to network first (cache bust on every deploy)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (isNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

/**
 * Cache-first strategy: check cache, fall back to network, then cache the response.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Network failed and not in cache — return offline fallback for navigation
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network-first strategy: try network, fall back to cache.
 * Used for JSON content that should be fresh.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Network failed — serve stale from cache
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}
