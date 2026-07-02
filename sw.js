/* True Hybrid service worker.
   Bump CACHE_VERSION whenever you want to force every visitor to drop old cached
   assets on their next visit. Pages and recipe data are fetched network-first, so
   normal content edits show up without changing this number. */
const CACHE_VERSION = 'th-v2';
const CACHE = `th-cache-${CACHE_VERSION}`;

// Core shell precached on install so the site opens offline.
const PRECACHE = [
  '/',
  '/index.html',
  '/tools/',
  '/more/',
  '/framework/',
  '/framework/index.html',
  '/offline.html',
  '/assets/styles.css',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin pass straight through

  // Page navigations: network-first so new deploys show immediately, fall back to cache, then offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { cachePut(req, res.clone()); return res; })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/offline.html')))
    );
    return;
  }

  // Recipe data: network-first so new recipes appear, fall back to cache offline.
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(req)
        .then((res) => { cachePut(req, res.clone()); return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Everything else (CSS, JS, images, fonts): serve from cache fast, refresh in the background.
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => { cachePut(req, res.clone()); return res; }).catch(() => hit);
      return hit || network;
    })
  );
});

function cachePut(req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    caches.open(CACHE).then((c) => c.put(req, res));
  }
}
