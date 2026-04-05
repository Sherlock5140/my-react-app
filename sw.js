const CACHE_NAME = '購黑皮-v43-20260405-2340';
const APP_SHELL = [
  './',
  './index.html',
  './formulas.js',
  './rate-manager.js',
  './math-ui.js',
  './icon.svg',
  './apple-touch-icon.png'
];

const APP_SHELL_PATHS = new Set(
  APP_SHELL.map((p) => new URL(p, self.location.origin + self.location.pathname).pathname)
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
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

  // External origins (CDN, API) — let the browser handle them
  if (requestUrl.origin !== self.location.origin) return;

  // Only intercept known app shell files
  if (!APP_SHELL_PATHS.has(requestUrl.pathname)) return;

  // Cache-first, update in background
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
