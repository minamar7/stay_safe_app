const CACHE_NAME = "safee-cache-v1";
const urlsToCache = ["/","/index.html","/src/app.js","/styles.css"];

self.addEventListener("install", e=> e.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
));

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res=>res||fetch(e.request))
  );
});