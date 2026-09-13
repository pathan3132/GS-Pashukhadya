// GS Pashukhadya — service worker
// App shell cache-first (instant load), data fetch (Google Sheet) hamesha network se
// hi jaati hai kyunki app khud usse localStorage me cache karta hai (loadData() dekho).

const CACHE_NAME = 'gs-pashukhadya-shell-v3';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Google Apps Script data calls: always go to network, never cache (live data chahiye)
  if (url.hostname.includes('script.google.com')) {
    return;
  }

  // App shell: cache-first, background update
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && event.request.method === 'GET') {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
