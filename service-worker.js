/* MathLab PWA — Cache de arquivos estáticos para uso offline.
   Atualize CACHE_VERSION sempre que publicar uma nova versão. */
const CACHE_VERSION = "mathlab-static-v3";
const APP_FILES = [
  "./", "./index.html", "./css/style.css", "./js/app.js", "./js/pwa.js",
  "./manifest.json", "./img/mathlab-logo.jpg",
  "./img/icon-192.png", "./img/icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key.startsWith("mathlab-static-") &&
        key !== CACHE_VERSION).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () =>
        (await caches.match("./index.html")) || Response.error()
      )
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
