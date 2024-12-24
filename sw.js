// Define a cache name
const CACHE_NAME = 'orbit-cache-v1';  // You can change the version number to force updates
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',                   // Your main HTML file
    '/manifest.json',                 // Your web app manifest file, if you have one
    '/style.css',                     // Your CSS file, if you have one
    '/script.js',                     // Your main script file
    '/logoorbit.png',                 // Replace with your actual asset URLs
    '/bannerimage.png',               // Add any other assets you want to cache
];

// Install event - caches the specified resources
self.addEventListener('install', (event) => {
    console.log('Service worker installed.');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch event - responds with cached assets or fetches network if not cached
self.addEventListener('fetch', (event) => {
    console.log('Fetch event for ', event.request.url);
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// Activate event - cleans up outdated caches
self.addEventListener('activate', (event) => {
    console.log('Service worker activated.');
    
    const cacheWhitelist = [CACHE_NAME]; // This ensures only the current cache is kept
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);  // Delete outdated cache
                    }
                })
            );
        })
    );
});
