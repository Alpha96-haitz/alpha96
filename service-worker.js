const CACHE_NAME = 'haitz-empire-v1';
const ASSETS = [
  './',
  './index.html',
  './porfolio.css',
  './portFolio.js',
  './manifest.json',
  './icon.svg',
  './image/montage.jpeg',
  './image/portFolio.PNG',
  './image/Java.PNG',
  './image/Access.PNG',
  './image/widev.PNG',
  './image/network-school.svg',
  './cv/cv.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match('./index.html')))
  );
});
