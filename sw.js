self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('tracker-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './app.js',
        './manifest.json',
        './icons/icon-192.png',
        './icons/icon-512.png',
        './icons/apple-touch-icon-180.png',
        './icons/favicon-32.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});