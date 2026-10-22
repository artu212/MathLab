/* MathLab — atualização de recursos online, fallback offline. */
const CACHE_VERSION = "mathlab-static-v6";
const APP_FILES = [
  "./", "./index.html", "./css/style.css", "./js/app.js", "./js/pwa.js",
  "./manifest.json", "./img/mathlab-logo.jpg", "./img/icon-192.png", "./img/icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION)
    .then(cache => cache.addAll(APP_FILES))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("mathlab-static-") && key !== CACHE_VERSION)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try {
      // Prioriza os arquivos novos enquanto há conexão.
      const response = await fetch(request);
      if (response.ok) {
        // Armazena URL canônica para a página com parâmetros do IntelliJ.
        const key = request.mode === "navigate" ? new URL("./index.html", self.registration.scope).href : request;
        await cache.put(key, response.clone());
      }
      return response;
    } catch (_) {
      if (request.mode === "navigate") {
        return (await cache.match(new URL("./index.html", self.registration.scope).href)) || Response.error();
      }
      return (await cache.match(request)) || Response.error();
    }
  })());
});
