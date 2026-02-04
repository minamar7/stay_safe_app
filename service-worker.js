const CACHE_NAME = 'stay-safe-elite-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './quizzes/questions_free_en.json',
  './quizzes/questions_premium_en.json'
  // Προσθέστε όλα τα JSON για άλλες γλώσσες
];

// Install SW & cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Fetch from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});