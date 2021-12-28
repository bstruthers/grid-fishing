const cacheName = 'grid-fishing-v3.2';
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

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then((keys) => {
		return Promise.all(keys.filter((key) => {
			return cacheName !== key
		}).map(function (key) {
			return caches.delete(key);
		}));
	}).then(() => {
    return clients.claim();
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  e.waitUntil(async function() {
    const allClients = await clients.matchAll({
      includeUncontrolled: true,
      type: 'all'
    });

    let len = allClients.length;
    if (len) {
      while (len--) {
        const client = allClients[len];
        if (e.action === 'cast') {
          client.postMessage('cast');
        } else {
          client.focus();
        }
      }
    } else {
      return clients.openWindow('/');
    }
  }());
});
