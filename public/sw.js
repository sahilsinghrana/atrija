/**
 * Service Worker — Atrijā PWA Shell Cache
 * Strategy:
 *   - Network-first: HTML, CSS, JS, _astro/*, JSON (always fresh from network)
 *   - Cache-first: images, SVG, fonts (static assets)
 *   - Offline fallback: cached '/' for navigation failures
 * @see idea-056
 */

const CACHE_NAME = 'atrija-shell-v110';

/** @type {string[]} — Auto-updated by post-build.js */
const PRECACHE_URLS = [
  
  '/',
  '/css/loader.css',
  '/css/main.css',
  '/css/daily-theme.css',
  '/_astro/index.B6FNdtG8.css',
  '/js/changelog-app.js',
  '/js/content-prefetch.js',
  '/js/scene-context-recovery.js',
  '/js/scene-error-boundary.js',
  '/js/scene-bundle.js',
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
  '/js/sw-register.js',
  '/js/comet.js'

];

/** Paths that should ALWAYS fetch from network first (never serve stale) */
const NETWORK_FIRST_PATTERNS = [
  /\/\.css$/,              // all CSS files
  /\.js$/,                 // all JS files
  /\/_astro\//,            // Vite-hashed assets
  /\/content\//,           // JSON content
  /\/changelog\//,         // changelog data
  /siteData\.json$/,
  /content\.json$/,
  /koans\.json$/,
  /seasons\.json$/,
];

/** Paths that are safe to serve cache-first (static, rarely change) */
const CACHE_FIRST_PATTERNS = [
  /\.(png|jpg|jpeg|webp|gif)$/i,  // images
  /\.svg$/i,                       // SVGs
  /\.(woff2?|ttf|otf|eot)$/i,     // fonts
];

/**
 * Determine fetch strategy for a URL
 * @param {string} pathname
 * @returns {'network' | 'cache'}
 */
function getStrategy(pathname) {
  if (NETWORK_FIRST_PATTERNS.some(p => p.test(pathname))) return 'network';
  if (CACHE_FIRST_PATTERNS.some(p => p.test(pathname))) return 'cache';
  // Default: network-first for everything else (safe default)
  return 'network';
}

/**
 * Install event — pre-cache the shell
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Pre-cache failed for', url, err.message);
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event — clean up old caches
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
 * Fetch event — route to appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  // HTML navigation — always network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Route based on strategy
  const strategy = getStrategy(url.pathname);
  if (strategy === 'network') {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

/**
 * Network-first: try network, fall back to cache, update cache.
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
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache-first: check cache, fall back to network, then cache.
 * Only used for static assets (images, fonts, SVGs).
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
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    return new Response('Offline', { status: 503 });
  }
}
