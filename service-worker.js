const CACHE_NAME = 'smartportfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/src/app.jsx',
  '/src/consoleCapture.js',
  '/src/firebase.js',
  '/src/locales.js',
  '/src/demoPortfolio.js',
  '/src/marketData.js',
  '/src/vision.js',
  '/src/clientPredict.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
