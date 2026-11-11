/**
 * WordLab KS3 service worker.
 *
 * Strategy:
 *  - App shell (index.html, manifest, icons): network-first, so a new deploy
 *    shows up as soon as the learner is online, with the last good copy as the
 *    offline fallback.
 *  - Hashed build assets (/assets/*.js, *.css) and other same-origin files:
 *    cache-first, because those filenames change on every build.
 *  - Anything cross-origin (Statcounter, Google Fonts) or under /api/ is left
 *    alone: analytics should never be replayed from a cache and the story coach
 *    needs a live network and a server-side key.
 *
 * Bump VERSION when the caching rules themselves change; old caches are then
 * cleared on activate.
 */
const VERSION = 'wordlab-ks3-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch {
            /* a single missing file must not fail the whole install */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok && response.type === 'basic') {
    const cache = await caches.open(ASSET_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok && response.type === 'basic') {
      const cache = await caches.open(SHELL_CACHE);
      cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    const cached =
      (await caches.match('/index.html')) ||
      (await caches.match('/')) ||
      (await caches.match(request));
    if (cached) return cached;
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>WordLab KS3 is offline</title>' +
        '<style>body{font-family:system-ui,sans-serif;background:#f7f3ff;color:#251a4d;' +
        'display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}' +
        'div{max-width:34ch;padding:24px}h1{color:#4c1d95}</style>' +
        '<div><h1>You are offline</h1><p>Reconnect to the internet to open WordLab KS3. ' +
        'Pages you have already visited will work again once the app has loaded once.</p></div>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
