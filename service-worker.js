const CACHE_NAME = 'bunnyscout-cache-v4';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.json', './favicon.svg'];

self.addEventListener('install', (event) => {
  // Fetch with {cache: 'reload'} so the SW caches fresh files from the network,
  // never stale copies from the browser HTTP cache. Critical for shipping updates.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;
  // Network-first: always serve the freshest version when online (so updates
  // reach users immediately), and fall back to the cache when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
  );
});
