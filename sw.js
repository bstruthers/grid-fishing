const cacheName = 'grid-fishing-v1';
const contentToCache = [
  '/',
  '/index.html',
  '/icons/fish-16x16.png',
  '/icons/fish-32x32.png',
  '/icons/fish-72x72.png',
  '/icons/fish-96x96.png',
  '/icons/fish-120x120.png',
  '/icons/fish-128x128.png',
  '/icons/fish-144x144.png',
  '/icons/fish-152x152.png',
  '/icons/fish-167x167.png',
  '/icons/fish-180x180.png',
  '/icons/fish-192x192.png',
  '/icons/fish-384x384.png',
  '/icons/fish-512x512.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(cacheName).then((cache) => {
    return cache.addAll(contentToCache);
  }));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => {
    return r || fetch(e.request).then((response) => {
      return caches.open(cacheName).then((cache) => {
        cache.put(e.request, response.clone());
        return response;
      });
  })}));
});
