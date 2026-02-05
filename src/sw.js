const CACHE_NAME = "safee-v3-elite";
const urlsToCache = [
  "./",
  "./index.html",
  "./src/app.js",
  "./styles.css",
  "./manifest.json",
  "./quizzes/questions_free_en.json",
  "./quizzes/questions_free_el.json",
  "./quizzes/questions_premium_en.json",
  "./quizzes/questions_premium_el.json"
];

// Install Event
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Χρησιμοποιούμε addAll αλλά με catch για να μη σταματήσει αν λείπει ένα αρχείο
      return cache.addAll(urlsToCache).catch(err => console.warn("Cache addAll warning:", err));
    })
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(), // Παίρνει τον έλεγχο αμέσως
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  // Στρατηγική: Cache First, falling back to Network
  // Ιδανικό για Super Apps γιατί το app ανοίγει ακαριαία
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request).then((networkResponse) => {
        // Αν η κλήση είναι επιτυχής, την αποθηκεύουμε για μελλοντική offline χρήση
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Εδώ μπορείς να επιστρέψεις ένα custom offline μήνυμα αν θες
        console.log("App is offline and resource not in cache.");
      });
    })
  );
});
