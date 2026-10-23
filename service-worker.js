
/* MathLab — Atualização 7.5: ícones e recursos offline. */

const CACHE_VERSION = "mathlab-static-v7-5";

const APP_FILES = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/pwa.js",
  "./manifest.json",
  "./img/mathlab-logo.jpg",
  "./img/logo_cabecalho.png",
  "./img/favicon_32.png",
  "./img/icone_app_180.png",
  "./img/icone_app_192.png",
  "./img/icone_app_512.png",
  "./img/icone_maskable_192.png",
  "./img/icone_maskable_512.png"
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
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith("mathlab-static-") &&
            key !== CACHE_VERSION
          )
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);

    try {
      // Prioriza os arquivos novos enquanto há conexão.
      const response = await fetch(request);

      if (response.ok) {
        // Armazena URL canônica para navegação.
        const key = request.mode === "navigate"
          ? new URL("./index.html", self.registration.scope).href
          : request;

        await cache.put(key, response.clone());
      }

      return response;

    } catch (_) {
      if (request.mode === "navigate") {
        return (
          await cache.match(
            new URL("./index.html", self.registration.scope).href
          )
        ) || Response.error();
      }

      return (await cache.match(request)) || Response.error();
    }
  })());
});
