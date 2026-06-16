const CACHE_NAME = 'haitz-empire-v2';
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
  self.skipWaiting(); // Force la mise à jour immédiate
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
  self.clients.claim(); // Prend le contrôle de la page immédiatement
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Stratégie "Network First" pour le dev et les mises à jour
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionnel : mettre à jour le cache avec la nouvelle réponse
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
