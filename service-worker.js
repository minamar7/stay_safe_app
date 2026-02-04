const CACHE_NAME = 'stay-safe-elite-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',

  // Free Quizzes
  './quizzes/questions_free_en.json',
  './quizzes/questions_free_el.json',
  './quizzes/questions_free_de.json',
  './quizzes/questions_free_fr.json',
  './quizzes/questions_free_es.json',
  './quizzes/questions_free_it.json',
  './quizzes/questions_free_pt.json',
  './quizzes/questions_free_ru.json',
  './quizzes/questions_free_zh.json',
  './quizzes/questions_free_hi.json',

  // Premium Quizzes
  './quizzes/questions_premium_en.json',
  './quizzes/questions_premium_el.json',
  './quizzes/questions_premium_de.json',
  './quizzes/questions_premium_fr.json',
  './quizzes/questions_premium_es.json',
  './quizzes/questions_premium_it.json',
  './quizzes/questions_premium_pt.json',
  './quizzes/questions_premium_ru.json',
  './quizzes/questions_premium_zh.json',
  './quizzes/questions_premium_hi.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate — remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});
