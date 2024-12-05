const cacheName = "reun-Block Blast Puzzle-1.1";
const contentToCache = [
    "blockblast/BlockBlast1.1-8.loader.js",
    "blockblast/BlockBlast1.1-8.framework.js.unityweb",
    "blockblast/BlockBlast1.1-8.data.unityweb",
    "blockblast/BlockBlast1.1-8.wasm.unityweb",
    "style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
