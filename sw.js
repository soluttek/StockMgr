const CACHE_NAME = 'stockmgr-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/src/app.css',
    '/src/main.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: cache-first for static, network-first for dynamic
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET
    if (event.request.method !== 'GET') return;

    // Static assets: cache-first
    if (STATIC_ASSETS.some(asset => url.pathname === asset) ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.json') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.svg')) {
        event.respondWith(
            caches.match(event.request)
                .then(cached => cached || fetch(event.request).then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                }))
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Dynamic: network-first with cache fallback
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
