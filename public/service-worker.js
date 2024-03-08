// service-worker.js

const cacheName = 'asa-cache';
const urlsToCache = [
  './',
  './index.html',
];

self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cachedResponse) {
      if (cachedResponse) {
        console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
        return cachedResponse;
      } else {
        return fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            cache.put(e.request, response.clone());
            console.log("[Service Worker] Resource fetched and saved in the cache for: " +
              e.request.url);
            return response;
          });
        });
      }
    })
  );
});
