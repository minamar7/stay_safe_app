// ==========================================
// Stay Safe Elite - Service Worker (sw.js)
// Version: 3.5 (Full Multilingual & Dojo)
// Strategy: Cache First, Network Fallback
// ==========================================

const CACHE_NAME = "safee-v3-elite-full";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./src/app.js",
  "./styles.css",
  "./manifest.json",
  
  // --- Core Assets ---
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js",

  // --- Dynamic Content ---
  "./quizzes/dojo.json",
  "./quizzes/alerts.json",

  // --- Free Quizzes (All Languages) ---
  "./quizzes/questions_free_en.json",
  "./quizzes/questions_free_el.json",
  "./quizzes/questions_free_de.json",
  "./quizzes/questions_free_fr.json",
  "./quizzes/questions_free_es.json",
  "./quizzes/questions_free_it.json",
  "./quizzes/questions_free_pt.json",
  "./quizzes/questions_free_ru.json",
  "./quizzes/questions_free_zh.json",
  "./quizzes/questions_free_hi.json",

  // --- Premium Quizzes (All Languages) ---
  "./quizzes/questions_premium_en.json",
  "./quizzes/questions_premium_el.json",
  "./quizzes/questions_premium_de.json",
  "./quizzes/questions_premium_fr.json",
  "./quizzes/questions_premium_es.json",
  "./quizzes/questions_premium_it.json",
  "./quizzes/questions_premium_pt.json",
  "./quizzes/questions_premium_ru.json",
  "./quizzes/questions_premium_zh.json",
  "./quizzes/questions_premium_hi.json"
];

// --- Install Event ---
self.addEventListener("install", (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Elite Cache Initialized: " + CACHE_NAME);
      // Χρησιμοποιούμε addAll για να κατεβάσουμε τα πάντα στην εγκατάσταση
      return cache.addAll(URLS_TO_CACHE).catch(err => {
          console.warn("Service Worker: Some assets failed to cache, checking network later.", err);
      });
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
              console.log("Purging old cache version:", key);
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
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Επιστροφή από το Cache αν υπάρχει (Ταχύτητα)
      if (cachedResponse) return cachedResponse;

      // 2. Αν δεν υπάρχει, φέρτο από το δίκτυο
      return fetch(event.request).then((networkResponse) => {
        // Αν η απάντηση είναι έγκυρη, αποθήκευσέ την για την επόμενη φορά
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log("User is offline and resource not cached.");
      });
    })
  );
});
