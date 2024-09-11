self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('fair-trip-store').then((cache) => cache.addAll([
        '/',
        '/index.html',
      ])),
    );
  });
  
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });