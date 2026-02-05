// ==========================================
// Stay Safe Elite - Service Worker (sw.js)
// Strategy: Cache First, Network Fallback
// ==========================================

const CACHE_NAME = "safee-v3-elite";
const URLS_TO_CACHE = [
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

// --- Install Event ---
self.addEventListener("install", (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Installing Cache: " + CACHE_NAME);
      return cache.addAll(URLS_TO_CACHE).catch(err => console.warn("Caching warning:", err));
    })
  );
});

// --- Activate Event ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Removing old cache:", key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// --- Fetch Event ---
self.addEventListener("fetch", (event) => {
  // Παράκαμψη για μη-GET αιτήματα (π.χ. POST) ή εξωτερικά APIs αν χρειαστεί
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Επιστροφή από το Cache αν υπάρχει
      if (cachedResponse) return cachedResponse;

      // 2. Διαφορετικά, αίτημα στο Δίκτυο
      return fetch(event.request).then((networkResponse) => {
        // Έλεγχος εγκυρότητας απάντησης πριν το caching
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline Fallback (προαιρετικά επιστρέφεις μια σελίδα offline.html)
        console.log("Resource not available offline:", event.request.url);
      });
    })
  );
});
