const version = 'v2';

var cacheName = 'uco-cache';
var filesToCache = [
  '/',
  '/plan.jpg',
  '/style.css',
  '/javascript.js',
  '/icons/manifest.json',
  'http://myucoapi.azurewebsites.net/api/classrooms',
  'http://myucoapi.azurewebsites.net/api/beacons',
  'http://myucoapi.azurewebsites.net/api/trajectories'
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2'
];

self.addEventListener('install', function(event) {
    console.log('SW %s installed at', version, new Date().toLocaleTimeString());
     event.waitUntil(
       caches.open(cacheName).then(function(cache) {
       console.log('[ServiceWorker] Caching app shell');
       return cache.addAll(filesToCache);
    })
  );
    
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('SW %s activated at', version, new Date().toLocaleTimeString());
});

self.addEventListener('fetch', function (event) {
   
         event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});