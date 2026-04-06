const CACHE_NAME = '購黑皮-v50-20260406-1400';
const CDN_CACHE  = 'cdn-assets-v2';

const APP_SHELL = [
  './',
  './index.html',
  './formulas.js',
  './rate-manager.js',
  './math-ui.js',
  './icon.svg',
  './apple-touch-icon.png'
];

// Versioned CDN URLs — safe to pre-cache at install time
const CDN_RESOURCES = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

// CDN hosts: versioned (cache-first) vs unversioned (stale-while-revalidate)
const CDN_HOSTS_VERSIONED = ['unpkg.com'];
const CDN_HOSTS_REVALIDATE = ['cdn.tailwindcss.com']; // unversioned URL → always revalidate

const APP_SHELL_PATHS = new Set(
  APP_SHELL.map((p) => new URL(p, self.location.origin + self.location.pathname).pathname)
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // App shell — must succeed
      caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
      // CDN resources — fail silently per resource
      caches.open(CDN_CACHE).then((cache) =>
        Promise.all(
          CDN_RESOURCES.map((url) =>
            cache.add(url).catch((err) => console.warn('[SW] CDN pre-cache failed:', url, err))
          )
        )
      )
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== CDN_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET') return;

  // Navigate requests: network-first with 4s timeout, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      Promise.race([
        fetch(request),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
      ])
        .then((response) => {
          if (response && response.ok) {
            caches.open(CACHE_NAME)
              .then((cache) => cache.put('./index.html', response.clone()))
              .catch((err) => console.warn('[SW] index.html cache write failed', err));
          }
          return response;
        })
        .catch(() =>
          caches.match('./index.html')
            .then((r) => r || new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' }))
        )
    );
    return;
  }

  // Versioned CDN (unpkg.com): cache-first, fetch on miss
  if (CDN_HOSTS_VERSIONED.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone())
                .catch((err) => console.warn('[SW] CDN cache write failed', err));
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Unversioned CDN (Tailwind): stale-while-revalidate — serve cache instantly, update in background
  if (CDN_HOSTS_REVALIDATE.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone())
                .catch((err) => console.warn('[SW] Tailwind cache update failed', err));
            }
            return response;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Same-origin non-shell: skip
  if (requestUrl.origin !== self.location.origin) return;
  if (!APP_SHELL_PATHS.has(requestUrl.pathname)) return;

  // App shell: cache-first, update in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (!response || !response.ok) return cached || response;
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, response.clone()))
            .catch((err) => console.warn('[SW] shell cache write failed', err));
          return response;
        })
        .catch(() => cached || new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' }));
      return cached || networkFetch;
    })
  );
});
