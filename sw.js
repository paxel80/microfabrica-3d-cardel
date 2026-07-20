/**
 * M3D Industrial - Service Worker
 * Offline-first caching strategy with stale-while-revalidate
 */

const CACHE_NAME = 'm3d-v4.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/por-que.html',
  '/segmentos.html',
  '/finanzas.html',
  '/inversion.html',
  '/hoja-de-ruta.html',
  '/contacto.html',
  '/js/app.js',
  '/js/three-hero.js',
  '/js/scroll-animations.js',
  '/js/interactions.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - stale-while-revalidate for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external fonts/analytics
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('cdnjs.cloudflare.com')) return;

  // HTML pages - network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets - cache first, then network
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          const networkFetch = fetch(request)
            .then(response => {
              if (response.ok) {
                caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
              }
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
    );
    return;
  }

  // Default - network first
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  const cache = await caches.open('m3d-forms');
  const requests = await cache.keys();

  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.delete(request);
        // Notify client
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ type: 'form-synced', url: request.url }));
        });
      }
    } catch (err) {
      console.log('[SW] Sync failed for:', request.url);
    }
  }
}

// Push notifications (if needed later)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: data.url
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});