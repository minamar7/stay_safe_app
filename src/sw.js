const CACHE_NAME = "safee-cache-v2"; // Αυξάνουμε την έκδοση
const urlsToCache = [
  "./",
  "./index.html",
  "./src/app.js",
  "./styles.css",
  "./manifest.json",
  // Προσθήκη των φακέλων με τα quizzes για offline λειτουργία
  "./quizzes/questions_free_el.json",
  "./quizzes/questions_free_en.json",
  "./quizzes/questions_premium_el.json",
  "./quizzes/questions_premium_en.json"
  // Πρόσθεσε εδώ και τις υπόλοιπες γλώσσες αν θες πλήρη offline υποστήριξη
];

// Install: Αποθήκευση αρχείων στο cache
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Αναγκάζει το νέο SW να ενεργοποιηθεί αμέσως
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell & quizzes...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: Καθαρισμός παλιών caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
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
  );
});

// Fetch: Στρατηγική "Cache First, falling back to Network"
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        // Προαιρετικά: Εδώ μπορείς να επιστρέψεις μια offline σελίδα αν αποτύχουν όλα
      });
    })
  );
});
